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
const birdSpeed = 0.003;
const plantX = 0.5;     // normalized 0..1
const plantY = 0.5;



//// GAME STATE ////
// This object holds everything that changes during the game
let game = {
  timeLeft : gameTime,
  beeCount : 0,
  lives    : 3,
  bees     : [],   // array of active bees
  birds    : [],   // array of active birds
  running  : true,
  swipe: false
};

//SWIPING 
let prevKey = null;
let currKey = null;
let timeoutID = null;

const row = ['KeyP', 'KeyO', 'KeyI'];


//// DOM ELEMENTS ////
const plantEl  = document.getElementById('plant');
const timerEl  = document.getElementById('timer');
const livesEl  = document.getElementById('lives'); 
const scoreEl = document.getElementById('score');

//// FUNCTIONS ////

// create a bee object
function createBee() {
  const el = Util.createThing(null, "bee");
  Util.setSize(300, 300, el);
  Util.setRoundedness(1, el);

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
  const startY= 0.5;
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

// Code that runs over and over again
function loop() {
  if (!game.running) return;

  game.bees = game.bees.filter(bee => {
    bee.x = bee.x - bee.speed;
    Util.setPosition(bee.x, bee.y, bee.el);

    // Did it reach the plant?
    if (bee.x <= plantX) {
      game.beeCount++;
      scoreEl.textContent = `Bees: ${game.beeCount}`;
      bee.el.remove();        
      
      // Remove from screen
      
      Util.setSize(plantEl.offsetWidth + 5, plantEl.offsetHeight + 5, plantEl);
      return false;                     // Remove from array
    }
    return true;                        // Keep in array
  });


  // === MOVE BIRDS ===
  game.birds = game.birds.filter(bird => {
    bird.x = bird.x + bird.speed;           // Move right
    Util.setPosition(bird.x, bird.y, bird.el);

    // Did bird reach plant?
    if (bird.x >= plantX) {
      game.lives--;
      livesEl.textContent = '❤️'.repeat(game.lives);
      bird.el.remove();
      Util.setColour(120 - (3 - game.lives) * 20, 100, 50, 1, plantEl);

      if (game.lives <= 0) {
        game.running = false;
        alert("Game Over! No lives left.");
      }
      return false;  // Remove bird
    }
    return true;     // Keep bird

  });

  window.requestAnimationFrame(loop);
}


// SETUP
function setup() {

  //shows starting score and lives
  scoreEl.textContent = `Bees: ${game.beeCount}`;
  livesEl.textContent = '❤️'.repeat(game.lives);

  //create one bee to start with
  const bee = createBee();
  game.bees.push(bee);

  // create one bird
  const bird = createBird();
  game.birds = [];  // Make sure array exists
  game.birds.push(bird);


  // Every 3.5 seconds, add a new bee
      setInterval(() => {
      if (game.running) {
        const newBee = createBee();
        game.bees.push(newBee);
      }
    }, 3500);

  // Every 5 seconds, add a new bird
    setInterval(() => {
      if (game.running) {
        game.birds.push(createBird());
      }
    }, 5000);


  // EVENT LISTENERS

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
        if (bird.speed < 0.001) {
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
