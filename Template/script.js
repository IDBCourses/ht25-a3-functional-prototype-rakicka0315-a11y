/*
 * Assignment 3: Functional Prototype
 * ----------------------------------
 * Programming 2025, Interaction Design Bachelor, Malmö University
 * 
 * This assignment is written by:
 * Bozena Rakicka
 */


import * as Util from "./util.js";


//// DOM ELEMENTS ////
const plantEl  = document.getElementById('plant');
const timerEl  = document.getElementById('timer');
const livesEl  = document.getElementById('lives'); 
const scoreEl = document.getElementById('score');


//// CONSTANTS ////
const gameTime = 20;      // seconds
const beeSpeed = 0.0005;     // % of window width per frame
const birdSpeed = 0.0012;
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
// from class example
let prevKey = null;
let currKey = null;
let timeoutID = null;
const row = ['KeyP', 'KeyO', 'KeyI'];

//// HELPER FUNCTIONS ////

// creates a bee object and adds it to the screen
function createBee() {
  const el = Util.createThing(null, "bee"); 
  Util.setSize(100, 100, el); // width, height in pixels

  const startX= 1;
  const startY= 0.5;
  Util.setPosition(startX, startY, el);

  // returns an object with bee's data (position, speed, element)
  return {
    el,
    x: startX,
    y: startY,
    speed: beeSpeed,
  };
}

// creates a bird object and adds it to the screen
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

// swipe detection (from class)
function swipeDirection(){
  let prevIndex = row.indexOf(prevKey); // position of last key in row array (e.g., P=0, O=1, I=2)
  let currIndex = row.indexOf(currKey);

  // if key not in row -> invalid, no swipe
  if( currIndex < 0 || prevIndex < 0){
    return 0;
  } 
  
  let dIndex = currIndex - prevIndex;

  // only allows swipe of 1 step (P -> O or O -> I)
  if (dIndex > 1 || dIndex < -1) {
    return 0;
  }

  return dIndex;  // -1, 0, or +1
}

// reset swipe tracking after delay
function resetKeys() {
  prevKey = null;
  currKey = null;
}

// bee manager – update bees (move, check reach, remove if done)
function updateBees() {
  game.bees = game.bees.filter(bee => { //.filter loops through bees, builds NEW list keeping only "true" returns
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

// bird manager– update birds (move, check reach, remove if done)
function updateBirds() {
  game.birds = game.birds.filter(bird => { //same as for bees
    bird.x += bird.speed;  // move right
    Util.setPosition(bird.x, bird.y, bird.el);

    if (bird.x >= plantX - 0.1) {  // reached plant 
      game.lives--;
      livesEl.textContent = '❤️'.repeat(game.lives); //.repeat makes string like '❤️' (repeat heart emoji 'lives' times)
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

// code that runs over and over again – 60x/sec
function loop() {

  if (!game.running) return; // stops if game over
  
  updateBees();
  updateBirds();

  window.requestAnimationFrame(loop); // calls loop again next frame
}


//// SETUP ////
function setup() {

  //shows starting score and lives
  scoreEl.textContent = `Bees: ${game.beeCount}`;
  livesEl.textContent = '❤️'.repeat(game.lives);

  //creates one bee to start with
  game.bees.push(createBee());

  // every 3.5 seconds, add a new bee
    setInterval(() => {
      if (game.running) {
        game.bees.push(createBee());
      }
    }, 3500);

  // every 4 seconds, add a new bird
    setInterval(() => {
      if (game.running) {
        game.birds.push(createBird());
      }
    }, 4000);


  //// EVENT LISTENERS ////

  document.addEventListener("keydown", (event) => {

    clearTimeout(timeoutID);
    const key = event.key.toLowerCase(); // ignore case (z or Z)

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
      game.birds.forEach(bird => { // .forEach loops through all birds
        bird.speed *= 0.8;
        if (bird.speed < 0.0002) {
          bird.el.remove();
        }
      });
    }


  });

  document.addEventListener('keyup', (event) => {
    timeoutID = setTimeout(resetKeys, 75); // after key release, wait 75ms then reset keys (allows fast swipes)
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
