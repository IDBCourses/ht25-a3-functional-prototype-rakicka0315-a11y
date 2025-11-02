/*
 * Assignment 3: Functional Prototype
 * ----------------------------------
 * Programming 2025, Interaction Design Bachelor, Malmö University
 * 
 * This assignment is written by:
 * Bozena Rakicka
 */


import * as Util from "./util.js";

//// CONSTANTS ////
const gameTime = 20;      // seconds
const beeSpeed = 0.0005;     // % of window width per frame
const birdSpeed = 0.0009;
const plantX = 0.5;     // normalized 0..1



//// GAME  ////
// holds everything that changes during the game
let game = {
  timeLeft : gameTime,
  beeCount : 0,
  lives    : 3,
  bees     : [],   // array of active bees
  birds    : [],   // array of active birds
  running  : true,
};

//// SWIPING ////
let prevKey = null;
let currKey = null;
let timeoutID = null;
const row = ['KeyP', 'KeyO', 'KeyI'];


//// DOM ELEMENTS ////
const plantEl  = document.getElementById('plant');
const timerEl  = document.getElementById('timer');
const livesEl  = document.getElementById('lives'); 
const scoreEl = document.getElementById('score');

//// HELPER FUNCTIONS ////

// create a bee object
function createBee() {
  const el = Util.createThing(null, "bee");
  Util.setSize(100, 100, el);

  const startX= 1;
  const startY= 0.5;
  Util.setPosition(startX, startY, el);

  return {
    el,
    x: startX,
    y: startY,
    speed: beeSpeed,
  };
}

// create a bird object
function createBird() {
  const el = Util.createThing(null, "bird");
  Util.setSize(180, 180, el);

  const startX= 0;
  const startY= 0.3;
  Util.setPosition(startX, startY, el);

  return {
    el,
    x: startX,
    y: startY,
    speed: birdSpeed,
  };
}

// swipe detection
function swipeDirection(){
  let prevIndex = row.indexOf(prevKey);
  let currIndex = row.indexOf(currKey);

  // If key not in row -> invalid
  if( currIndex < 0 || prevIndex < 0){
    return 0;
  } 
  
  let dIndex = currIndex - prevIndex;

  // Only allow swipe of 1 step (P -> O or O -> I)
  if (dIndex > 1 || dIndex < -1) {
    return 0;
  }

  return dIndex;  // -1, 0, or +1
}

//reset keys
function resetKeys() {
  prevKey = null;
  currKey = null;
}

// bee manager – update bees positions and count
function updateBees() {
  game.bees = game.bees.filter(bee => {
    bee.x -= bee.speed;  // move left 
    Util.setPosition(bee.x, bee.y, bee.el);

    if (bee.x <= plantX) {  // Reached plant
      game.beeCount++;
      scoreEl.textContent = `Bees: ${game.beeCount}`;
      bee.el.remove();
      Util.setSize(plantEl.offsetWidth + 20, plantEl.offsetHeight + 20, plantEl);

      if (game.beeCount >= 5) {
        game.running = false;
        alert("You Win! 5 bees reached the plant!");
      }
      return false;  // remove from array
    }
    return true;  // keep
  });
}

// bird manager– update birds positions and lives
function updateBirds() {
  game.birds = game.birds.filter(bird => {
    bird.x += bird.speed;  // move right
    Util.setPosition(bird.x, bird.y, bird.el);

    if (bird.x >= plantX - 0.1) {  // reached plant 
      game.lives--;
      livesEl.textContent = '❤️'.repeat(game.lives);
      bird.el.remove();

      if (game.lives <= 0) {
        game.running = false;
        alert("Game Over! No lives left.");
      }
      return false;  // remove
    }
    return true;  // keep
  });
}

// Code that runs over and over again
function loop() {

  if (!game.running) return;
  
  updateBees();
  updateBirds();

  window.requestAnimationFrame(loop);
}


//// SETUP ////
function setup() {

  //shows starting score and lives
  scoreEl.textContent = `Bees: ${game.beeCount}`;
  livesEl.textContent = '❤️'.repeat(game.lives);

  //create one bee to start with
  game.bees.push(createBee());

  // Every 3.5 seconds, add a new bee
    setInterval(() => {
      if (game.running) {
        game.bees.push(createBee());
      }
    }, 3500);

  // Every 5 seconds, add a new bird
    setInterval(() => {
      if (game.running) {
        game.birds.push(createBird());
      }
    }, 5000);


  //// EVENT LISTENERS ////

  document.addEventListener("keydown", (event) => {

    clearTimeout(timeoutID);
    const key = event.key.toLowerCase();

    // press z or b makes the bee faster
    if (key === "z" || key === "b") {
      // Increase speed of the first bee
      if (game.bees.length > 0) {
        game.bees[0].speed += 0.0003;
      } return;
    }

    //swipe p->o->i
    prevKey = currKey;
    currKey = event.code;

    let dir = swipeDirection();

    if (dir===1) {
      game.birds.forEach(bird => {
        bird.speed *= 0.8;
        if (bird.speed < 0.0002) {
          bird.el.remove();
        }
      });
    }


  });

  document.addEventListener('keyup', (event) => {
    timeoutID = setTimeout(resetKeys, 75);
  });

  // Timer
  const timerId = setInterval(() => {
    if (!game.running) return;
    game.timeLeft--;
    timerEl.textContent = `Time: ${game.timeLeft}`
    
    if (game.timeLeft <= 0) {
      clearInterval(timerId);
      game.running = false;
      alert("Time's up!");
    }
  }, 1000);

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
