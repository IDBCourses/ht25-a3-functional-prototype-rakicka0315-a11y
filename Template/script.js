/*
 * Assignment 3: Functional Prototype
 * ----------------------------------
 * Programming 2025, Interaction Design Bachelor, Malmö University
 * 
 * This assignment is written by:
 * Bozena Rakicka
 * 
 * 
 * The template contains some sample code exemplifying the template code structure.
 * You should use the structure with `state`, `settings`, `setup`, `update`, and `use`. 
 * `scale` and `toAbsolute` are very helpful in data processing.
 * 
 * For instructions, see the Canvas assignment: https://mau.instructure.com/courses/11936/assignments/84965
 * You might want to look at the Assignment examples for more elaborate starting points.
 *
 */


import * as Util from "./util.js";

// State variables are the parts of your program that change over time.

// Settings variables should contain all of the "fixed" parts of your programs

// 1. CONSTANTS
const gameTime = 20;      // seconds
const beeSpeed = 0.4;     // % of window width per frame
const birdSpeed = 0.25;
const plantX = 0.5;     // normalized 0..1
const plantY = 0.5;

let game = {
  timeLeft : gameTime,
  beeCount : 0,
  bees     : [],   // array of bee objects
  birds    : [],   // array of bird objects
  running  : true
};

// DOM elements
const plantEl  = document.getElementById('plant');
const timerEl  = document.getElementById('timer');
const scoreEl  = document.getElementById('score');

function createBee() {
  const el = Util.createThing(null, "bee");
  Util.setSize(40, 40, el);
  Util.setColour(60, 100, 50, 1, el)
  //Util.setPosition(0, 0, el);
  Util.setRoundedness(1, el);

  const startX= 1.0;
  const startY= 0.1+Math.random()*0.8;
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
  const startY= 0.1+Math.random()*0.8;
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
  window.requestAnimationFrame(loop);
}


// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
 
  // Put your event listener code here
/*   document.addEventListener("keydown", (event) => {grow()
    console.log(`You pressed the "${event.key}" key.`);
  }); */
// Add to game arrays!
  game.bees.push(createBee());
  game.birds.push(createBird());

  // Timer
  const timerId = setInterval(() => {
    if (!game.running) return;
    game.timeLeft--;
    timerEl.textContent = `Time: ${game.timeLeft}`;
    if (game.timeLeft <= 0) {
      clearInterval(timerId);
      game.running = false;
      alert("Time's up!");
    }
  }, 1000);
  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
