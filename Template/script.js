/*
 * Assignment 3: Functional Prototype
 * ----------------------------------
 * Programming 2025, Interaction Design Bachelor, Malmö University
 * 
 * This assignment is written by:
 * Bozena Rakicka
 */


import * as Util from "./util.js";

// State variables are the parts of your program that change over time.

// Settings variables should contain all of the "fixed" parts of your programs

// 1. CONSTANTS
const gameTime = 20;      // seconds
const beeSpeed = 0.0005;     // % of window width per frame
const birdSpeed = 0.0007;
const maxLives = 3;
const plantX = 0.5;     // normalized 0..1
const plantY = 0.5;

let game = {
  timeLeft : gameTime,
  beeCount : 0,
  lives    : 3,
  bees     : [],   // array of bee objects
  birds    : [],   // array of bird objects
  running  : true
};

// DOM elements
//const plantEl  = document.getElementById('plant');
const timerEl  = document.getElementById('timer');
const livesEl  = document.getElementById('lives');
const scoreEl = document.getElementById('score');

// Functions

function createBee() {
  const el = Util.createThing(null, "bee");
  Util.setSize(40, 40, el);
  Util.setColour(60, 100, 50, 1, el);
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

function createBird() {
  const el = Util.createThing(null, "bird");
  Util.setSize(50, 50, el);
  Util.setColour(200, 70, 50, 1, el)
  //Util.setPosition(x, y, element);
  Util.setRoundedness(0.3,el);

  const startX= 0.0;
  const startY= 0.5;
  Util.setPosition(startX, startY, el);

  return {
    el,
    x: startX,
    y: startY,
    speed: birdSpeed,
    slowCount:0
  };
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
      bee.el.remove();                  // Remove from screen
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


// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {

  //shows score
  scoreEl.textContent = `Bees: ${game.beeCount}`;

  //create one bee to start with
  const bee = createBee();
  game.bees.push(bee);

  // create one bird
  const bird = createBird();
  game.birds = [];  // Make sure array exists
  game.birds.push(bird);


  // Put your event listener code here
  // KEY PRESS: Z or B makes the bee faster
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "z" || key === "b") {
      // Increase speed of the first bee
      if (game.bees.length > 0) {
        game.bees[0].speed = game.bees[0].speed + 0.0003;
      }
    }
  });

    // Every 4 seconds, add a new bee
  setInterval(() => {
    if (game.running) {
      const newBee = createBee();
      game.bees.push(newBee);
    }
  }, 4000);

  
  // Add to game arrays!
  //game.bees.push(createBee());
  //game.birds.push(createBird());

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

  livesEl.textContent = '❤️'.repeat(game.lives);

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
