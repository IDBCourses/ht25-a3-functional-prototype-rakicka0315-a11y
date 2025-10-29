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

// Code that runs over and over again
function loop() {

  window.requestAnimationFrame(loop);
}

function grow() {
  // Put your grow code here
  size+=1;
  setTimeout(grow,100);
}

// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  // Put your event listener code here
  document.addEventListener("keydown", (event) => {grow()
    console.log(`You pressed the "${event.key}" key.`);
  });

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!
