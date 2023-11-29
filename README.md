# Project-1:
Game Title: Minesweeper

Overview:
A single-player puzzle game where the player's objective is to clear a rectangular board 
containing hidden "mines" or bombs without detonating any of them. The game is played on a grid, and the player must 
use logical deduction to reveal safe squares and avoid the mines.

User Stories:

As a player I want:

-to see a grid of covered cells when I start the game, so that I can begin playing Minesweeper.

-to reveal a cell by clicking on it, so that I can uncover the content underneath.

-to see numbers in revealed cells indicating the number of adjacent mines. 

-the game to end in defeat if I click on a cell containing a mine.

-the game to end in victory if I successfully reveal all non-mine cells.

-to be able to flag a cell that I suspect contains a mine, so that I can mark it and avoid clicking on it accidentally.

-to be able to unflag a cell, so that I can correct any mistakes in flagging.

-to be able to start a new game, so that I can play again without having to refresh the entire page.

-to have different difficulty levels (easy, medium, hard).

-to see a timer that tracks the duration of my current game, so that I can challenge myself to improve my speed.

-the game to provide feedback or animation when I win or lose.

Wireframe:
![IMG_1038](https://github.com/Jbuckley3/Project-1/assets/121533653/3e419acb-c3ec-499f-8c3e-b3b032f7cb0a)

Pseudocode:

//Choose difficulty

//Beginner (8x8 or 9x9 with 10 mines), Intermediate (16x16 with 40 mines) and Expert (30x16 with 99 mines).

// Define game variables

// Initialize the game

// Create the board

// Render the initial state of the board

// Populate the grid with mines randomly

// Calculate and set the number of adjacent mines for each cell

// Function to render the Minesweeper board

// Set up event listeners for each grid cell (click to reveal, right-click to flag

// Event listener for grid cell clicks

// Event listener for right-clicks (to flag cells)

// Function to handle left-click on a cell

  // Check if the clicked element is a grid cell
    
  // Handle revealing the clicked cell
    
  // Check for game over or victory conditions

// Function to handle right-click on a cell

  // Check if the clicked element is a grid cell
    
  // Handle flagging/unflagging the clicked cell
   

// Game logic functions (revealing cells, flagging cells, checking for victory/defeat)

