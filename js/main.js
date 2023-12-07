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
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborRow = row + i;
                const neighborCol = col + j;

                if (neighborRow >= 0 && neighborRow < 8 && neighborCol >= 0 && neighborCol < 8) {
                    const cell = document.querySelector(`.cell[data-row="${neighborRow}"][data-col="${neighborCol}"]`);
                    if (!cell.classList.contains('revealed') && !cell.classList.contains('flagged')) {
                        cell.classList.add('revealed');
                        const adjacentMines = parseInt(cell.dataset.adjacentMines || 0);
                        if (adjacentMines === 0) {
                            revealEmptyCells(neighborRow, neighborCol);
                        }
                    }
                }
            }
        }
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
    }

    function handleCellClick(event) {
        event.preventDefault();
        const clickedCell = event.target;
        const row = parseInt(clickedCell.dataset.row);
        const col = parseInt(clickedCell.dataset.col);

        if (event.type === 'contextmenu') {
            if (!clickedCell.classList.contains('revealed')) {
                clickedCell.classList.toggle('flagged');
            }
        } else {
            if (!clickedCell.classList.contains('flagged') && !clickedCell.classList.contains('revealed')) {
                if (minePositions.some(pos => pos.row === row && pos.col === col)) {
                    // Reveal all mine cells on the board
                    minePositions.forEach(pos => {
                        const mineCell = document.querySelector(`.cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
                        mineCell.classList.add('revealed');
                        mineCell.innerHTML = '💣';
                    });

                    // Trigger game over alert
                    alert('Game Over! You clicked on a mine.');
                } else {
                    clickedCell.classList.add('revealed');
                    if (parseInt(clickedCell.dataset.adjacentMines || 0) === 0) {
                        revealEmptyCells(row, col);
                    }
                    renderBoard();
                }
            }
        }
    }
});
