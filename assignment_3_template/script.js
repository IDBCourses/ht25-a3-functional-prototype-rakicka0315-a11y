/*
 * Assignment 3: Functional Prototype
 * ----------------------------------
 * Programming 2024, Interaction Design Bachelor, Malmö University
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

        
    import * as Util from "../assignment_3_template/util.js";

// The state should contain all the "moving" parts of your program, values that change.
let state = Object.freeze({
    latestKey: undefined,
    growing: false,
    fontWeight: 100,
});


// The settings object contains all of the "fixed" parts of your sketch, 
// like static HTMLElements, paramaters or thresholds.
const settings = Object.freeze({
    textElement: document.querySelector("#text"),
    growthFactor: 5,
    updateInterval: 10,
});


/**
 * Update the state object with the properties included in `newState`.
 * @param {Object} newState An object with the properties to update in the state object.
 */
function updateState(newState) {
    state = Object.freeze({ ...state, ...newState });
}


/**
 * Return `num` normalized to 0..1 in range min..max.
 * @param {number} num
 * @param {number} min 
 * @param {number} max 
 * @returns number
 */
function scale(num, min, max) {
    if (num < min) return 0;
    if (num > max) return 1;
    return (num - min) / (max - min);
}


/**
 * Return `num` transformed from the normalised 0..1 form back to the min..max form.
 * @param {number} num
 * @param {number} min 
 * @param {number} max 
 * @returns number
 */
function toAbsolute(num, min, max) {
    if (num < 0) return min;
    if (num > 1) return max;
    return (num * (max - min)) + min;
}

/**
 * This is where we put the code that transforms our data.
 * update() is run every frame, assuming that we keep calling it with `window.requestAnimationFrame`.
 */
function update() {
    const { growing, fontWeight } = state;
    const { growthFactor, updateInterval } = settings;

    if (growing) {
        updateState({ fontWeight: fontWeight + growthFactor });
    } else {
        updateState({ fontWeight: fontWeight - growthFactor });
    }

    if (fontWeight === 900) {
        updateState({ growing: false });
    } else if (fontWeight === 100) {
        updateState({ growing: true });
    }

    setTimeout(update, updateInterval);
}

/**
 * This is where we put the code that outputs our data.
 * use() is run every frame, assuming that we keep calling it with `window.requestAnimationFrame`.
 */
function use() {
    const { key, fontWeight } = state;
    const { textElement } = settings;

    if (key) {
        textElement.innerHTML = `The latest key pressed was ${key.code} producing an ${key.key}. It was pressed ${Math.floor(key.pressed)}ms after opening the page.`;
    }

    textElement.style.fontWeight = `${fontWeight}`;

    window.requestAnimationFrame(use);
}


/**
 * Setup is run once, at the start of the program. It sets everything up for us!
 */
function setup() {

    document.addEventListener("keydown", function (event) {
        updateState({
            key: {
                code: event.code,
                key: event.key,
                pressed: performance.now()
            }
        });
    });

    document.addEventListener("keyup", function (event) {
        // Nothing!
    });

    update();
    use();
}



setup(); // Always remember to call setup()!
