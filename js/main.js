document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('minesweeper-board');
    const resetButton = document.getElementById('reset-button');
    let minePositions = [];

    // Initialize the game
    initializeGame();

    // Reset button click event
    resetButton.addEventListener('click', initializeGame);

    function initializeGame() {
        // Clear the board and set up a new game
        clearBoard();
        createGrid();
        placeMines();
        calculateAdjacentMineCounts();
        renderBoard();
    }

    function clearBoard() {
        board.innerHTML = '';
        minePositions = [];
    }

    function createGrid() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'hidden');
                cell.dataset.row = row;
                cell.dataset.col = col;
    
                // Add the cell to the board
                board.appendChild(cell);
    
                // Check if the current cell contains a mine position
                const isMine = minePositions.some(pos => pos.row === row && pos.col === col);
    
                // If it's a mine, add the 'mine' class
                if (isMine) {
                    cell.classList.add('mine');
                }
            }
        }
    }
    

    function placeMines() {
        const totalMines = 10;
        const cells = document.querySelectorAll('.cell');
        const cellCount = cells.length;

        const isMineAlreadyPlaced = (row, col) => {
            return minePositions.some(pos => pos.row === row && pos.col === col);
        };

        for (let i = 0; i < totalMines; i++) {
            let randomCell;

            do {
                const randomIndex = Math.floor(Math.random() * cellCount);
                randomCell = cells[randomIndex];

                var row = parseInt(randomCell.dataset.row);
                var col = parseInt(randomCell.dataset.col);

            } while (isMineAlreadyPlaced(row, col));

            randomCell.classList.add('mine');
            minePositions.push({ row, col });
        }
    }

    function calculateAdjacentMineCounts() {
        const cells = document.querySelectorAll('.cell');

        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            let adjacentMineCount = 0;

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const neighborRow = row + i;
                    const neighborCol = col + j;

                    if (i === 0 && j === 0) continue;

                    if (neighborRow >= 0 && neighborRow < 8 && neighborCol >= 0 && neighborCol < 8) {
                        if (minePositions.some(pos => pos.row === neighborRow && pos.col === neighborCol)) {
                            adjacentMineCount++;
                        }
                    }
                }
            }

            cell.dataset.adjacentMines = adjacentMineCount;

            if (!cell.classList.contains('flagged')) {
                cell.classList.add('hidden');
            }
        });
    }

    function renderBoard() {
        const cells = document.querySelectorAll('.cell');
    
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
    
            if (minePositions.some(pos => pos.row === row && pos.col === col)) {
                // Handle mine cells separately
                if (cell.classList.contains('revealed')) {
                    // If mine cell is revealed, show a mine
                    cell.innerHTML = '💣'; 
                } else {
                    cell.innerHTML = ''; // Hide content for hidden mine cells
                }
            } else if (cell.classList.contains('revealed')) {
                // Already revealed cells
                const adjacentMines = parseInt(cell.dataset.adjacentMines || 0);
                if (adjacentMines > 0) {
                    cell.textContent = adjacentMines;
                } else {
                    cell.innerHTML = ''; // Hide content for revealed cells without adjacent mines
                }
            } else {
                // Hide content for hidden non-mine cells
                cell.innerHTML = ''; //Ensuring content is hidden
            }
        });
    }
    

    function handleCellClick(event) {
        const clickedCell = event.target;
        const row = parseInt(clickedCell.dataset.row);
        const col = parseInt(clickedCell.dataset.col);

        if (event.type === 'contextmenu') {
            event.preventDefault();

            if (!clickedCell.classList.contains('revealed')) {
                clickedCell.classList.toggle('flagged');
            }

            return;
        }

        if (!clickedCell.classList.contains('flagged') && !clickedCell.classList.contains('revealed')) {
            if (minePositions.some(pos => pos.row === row && pos.col === col)) {
                // Game over: Clicked on a mine
                alert('Game Over! You clicked on a mine.');
            } else {
                revealCell(row, col);
                renderBoard(); // Call renderBoard after revealing cells
            }
        }
    }

    function revealCell(row, col) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    
        if (!cell || cell.classList.contains('revealed') || cell.classList.contains('flagged')) {
            return;
        }
    
        cell.classList.add('revealed');
    
        if (minePositions.some(pos => pos.row === row && pos.col === col)) {
            // Revealed a mine
            // Handle game over logic here
            cell.innerHTML = '💣'; // Show mine when revealed
        } else {
            const adjacentMines = parseInt(cell.dataset.adjacentMines || 0);
    
            if (adjacentMines === 0) {
                // Add neighboring cells to the list of cells to check
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const neighborRow = row + i;
                        const neighborCol = col + j;
                        if (
                            neighborRow >= 0 &&
                            neighborRow < 8 &&
                            neighborCol >= 0 &&
                            neighborCol < 8
                        ) {
                            revealCell(neighborRow, neighborCol);
                        }
                    }
                }
            }
        }
        renderBoard(); // Call renderBoard after revealing cells
    }

    // Remove the contextmenu event listener from individual cells
    // It's already added to the board itself
    // const cells = document.querySelectorAll('.cell');
    // cells.forEach(cell => {
    //     cell.addEventListener('contextmenu', handleCellClick);
    // });

    // Add right-click event listener to prevent the context menu
    board.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });

    board.addEventListener('click', handleCellClick);

    function checkWin() {
        const revealedCells = document.querySelectorAll('.revealed');
        const totalCells = document.querySelectorAll('.cell').length;
        const totalMines = minePositions.length;

        return revealedCells.length === totalCells - totalMines;
    }
});
