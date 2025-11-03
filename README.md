# GardenGuard Game

## General Description
The game simulates a garden where bees are helpful pollinators trying to reach a central plant (sunflower), while birds are threats that can damage it. Players use keyboard gestures to assist the bees and repel the birds. It's visually basic, with optional image assets for bees, birds and a plant.

The game runs in a browser and demonstrates key programming concepts like event handling, loops, arrays, and state management. Bees and birds move across the screen, with player input affecting their speed.

## Goal
The primary goal is to guide 5 bees to the central plant before the 20-second timer runs out, while preventing birds from reaching it. Achieving 5 bees results in a "You Win!" alert. If birds reach the plant 3 times (losing all lives) or time expires, the game ends with a "Game Over" or "Time's up!" message.

## Rules
- Bees spawn from the right side and move left toward the plant automatically at a slow speed.
- Birds spawn from the left side and move right toward the plant, acting as obstacles.
- If a bee reaches the plant:
  - Score (bee count) increases by 1.
  - The plant grows slightly in size.
- If a bird reaches the plant:
  - You lose 1 life (heart).
  - At 0 lives, game over.
- The game ends if time runs out OR lives reach 0.
- Refresh the browser to play again.
- Bees/birds are removed upon reaching the plant.

## Instructions

1. **Keyboard Controls**:
   - **Boost Bees**: Press **Z** or **B** repeatedly to increase the speed of the leading bee. example: "bbzzbzbbbzbzbzbzbzbzz"
   - **Slow Birds**: Swipe **P → O → I** on the keyboard (press in sequence quickly) to reduce all birds' speed. Repeat to slow more; if speed hits 0, birds stop/remove.
2. **Game Flow**:
   - Timer starts at 20 seconds.
   - Bees spawn every 3.5 seconds from the right.
   - Birds spawn every 4 seconds from the left.
   - Watch the top: Time left, Lives, Bees score.
3. **Winning/Losing**: Get 5 bees = win. 0 lives or time out = lose.
