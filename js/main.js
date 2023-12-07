document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('minesweeper-board');
    const resetButton = document.getElementById('reset-button');
    const minesLeftSpan = document.getElementById('mines-left');
    const messageContainer = document.getElementById('message-container');
    let minePositions = [];
    let flaggedMines = 0;
    let revealedCells = 0;

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
        // Reset the mines left counter and revealed cells count
        flaggedMines = 0;
        revealedCells = 0;
        updateMinesLeftCounter();
        // Clear any previous messages
        messageContainer.textContent = '';
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
                cell.addEventListener('click', handleCellClick);
                cell.addEventListener('contextmenu', handleCellClick);
                board.appendChild(cell);
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
        });
    }

    function revealEmptyCells(row, col) {
        // Get all cells on the board
        const cells = document.querySelectorAll('.cell');
        
        // Find the clicked cell using its row and column values
        const clickedCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    
        // Check if the clicked cell is valid for revealing
        if (!clickedCell || clickedCell.classList.contains('revealed') || clickedCell.classList.contains('flagged')) {
            return;
        }
    
        // Create a stack to keep track of cells to reveal
        const stack = [];
        stack.push(clickedCell);
    
        // Use a while loop to iterate through the stack until it's empty
        while (stack.length > 0) {
            // Pop the last cell from the stack
            const currentCell = stack.pop();
    
            // Check if the cell has not been revealed
            if (!currentCell.classList.contains('revealed')) {
                // Mark the cell as revealed
                currentCell.classList.add('revealed');
                revealedCells++; // Increment the count of revealed cells
    
                // Get the number of adjacent mines for the current cell
                const adjacentMines = parseInt(currentCell.dataset.adjacentMines || 0);
    
                // If there are no adjacent mines, add neighboring cells to the stack
                if (adjacentMines === 0) {
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            const neighborRow = parseInt(currentCell.dataset.row) + i;
                            const neighborCol = parseInt(currentCell.dataset.col) + j;
    
                            // Skip the current cell
                            if (i === 0 && j === 0) continue;
    
                            // Find the neighboring cell in the DOM
                            const neighborCell = document.querySelector(`.cell[data-row="${neighborRow}"][data-col="${neighborCol}"]`);
    
                            // Check if the neighboring cell is valid for revealing
                            if (neighborCell && !neighborCell.classList.contains('revealed') && !neighborCell.classList.contains('flagged')) {
                                // Add the neighboring cell to the stack for further processing
                                stack.push(neighborCell);
                            }
                        }
                    }
                }
            }
        }
    }
    
    function revealMines() {
        minePositions.forEach(pos => {
            const mineCell = document.querySelector(`.cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
            mineCell.classList.add('revealed', 'mine');
            mineCell.innerHTML = '💣';
        });
    }

    function renderBoard() {
        const cells = document.querySelectorAll('.cell');

        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            if (minePositions.some(pos => pos.row === row && pos.col === col)) {
                if (cell.classList.contains('revealed')) {
                    cell.innerHTML = '💣';
                } else {
                    cell.innerHTML = '';
                }
            } else if (cell.classList.contains('revealed')) {
                const adjacentMines = parseInt(cell.dataset.adjacentMines || 0);
                if (adjacentMines > 0) {
                    cell.textContent = adjacentMines;
                } else {
                    cell.innerHTML = '';
                }
            } else {
                cell.innerHTML = '';
            }
        });

        if (revealedCells === (64 - minePositions.length)) {
            showMessage('Congratulations! You have won!');
            revealMines();
        }
    }

    function updateMinesLeftCounter() {
        minesLeftSpan.textContent = `Mines left: ${10 - flaggedMines}`;
    }

    function showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.classList.add('message');
        messageContainer.appendChild(messageElement);
    }

    function handleCellClick(event) {
        event.preventDefault();
        const clickedCell = event.target;
        const row = parseInt(clickedCell.dataset.row);
        const col = parseInt(clickedCell.dataset.col);

        if (event.type === 'contextmenu') {
            if (!clickedCell.classList.contains('revealed')) {
                clickedCell.classList.toggle('flagged');
                if (clickedCell.classList.contains('flagged')) {
                    flaggedMines++;
                } else {
                    flaggedMines--;
                }
                updateMinesLeftCounter();
            }
        } else {
            if (!clickedCell.classList.contains('flagged') && !clickedCell.classList.contains('revealed')) {
                if (minePositions.some(pos => pos.row === row && pos.col === col)) {
                    minePositions.forEach(pos => {
                        const mineCell = document.querySelector(`.cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
                        mineCell.classList.add('revealed');
                        mineCell.innerHTML = '💣';
                    });
                    showMessage('Game Over! You clicked on a mine.');
                    revealMines();
                    setTimeout(() => {
                        clickedCell.classList.add('revealed', 'mine');
                        clickedCell.innerHTML = '💣';
                    }, 0);
                } else {
                    revealEmptyCells(row, col);
                    renderBoard();
                }
            }
        }
    }
});
