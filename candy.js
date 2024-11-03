var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

window.onload = function () {
    startGame();
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement('img');
            tile.id = `${r}-${c}`;
            tile.src = `./images/${randomCandy()}.png`;

            // Add drag functionality
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

var selectedTile, replacedTile;

function dragStart() {
    selectedTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    replacedTile = this;
}

function dragEnd() {
    if (selectedTile && replacedTile) {
        let selectedId = selectedTile.id.split("-");
        let replacedId = replacedTile.id.split("-");

        let selectedRow = parseInt(selectedId[0]);
        let selectedCol = parseInt(selectedId[1]);
        let replacedRow = parseInt(replacedId[0]);
        let replacedCol = parseInt(replacedId[1]);

        let validMove = (Math.abs(selectedRow - replacedRow) + Math.abs(selectedCol - replacedCol)) === 1;

        if (validMove) {
            let tempSrc = selectedTile.src;
            selectedTile.src = replacedTile.src;
            replacedTile.src = tempSrc;

            if (checkMatches(selectedRow, selectedCol) || checkMatches(replacedRow, replacedCol)) {
                clearMatches();
                dropCandies();
            } else {
                // Revert swap if no match
                selectedTile.src = tempSrc;
                replacedTile.src = selectedTile.src;
            }
        }
    }
    selectedTile = null;
    replacedTile = null;
}

function checkMatches(row, col) {
    let matched = false;

    // Horizontal and vertical checks for match of 4 to create striped candy
    if (col > 2 && board[row][col].src === board[row][col - 1].src && board[row][col].src === board[row][col - 2].src) {
        board[row][col].src = `./images/${board[row][col].src.split('/').pop().split('.')[0]}-striped-horizontal.png`;
        matched = true;
    } else if (row > 2 && board[row][col].src === board[row - 1][col].src && board[row][col].src === board[row - 2][col].src) {
        board[row][col].src = `./images/${board[row][col].src.split('/').pop().split('.')[0]}-striped-vertical.png`;
        matched = true;
    } else if (col > 1 && col < columns - 1 && board[row][col].src === board[row][col - 1].src && board[row][col].src === board[row][col + 1].src) {
        matched = true;
    }

    // Check vertical match of 3
    if (row > 1 && board[row][col].src === board[row - 1][col].src && board[row][col].src === board[row - 2].src) {
        matched = true;
    }

    return matched;
}

function clearMatches() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c].src.includes("blank.png")) continue;
            if (checkMatches(r, c)) {
                board[r][c].src = "./images/blank.png";
                score += 10;
                document.getElementById("score").innerText = score;
            }
        }
    }
}

function dropCandies() {
    for (let c = 0; c < columns; c++) {
        let emptyTiles = [];
        for (let r = rows - 1; r >= 0; r--) {
            let tile = board[r][c];
            if (tile.src.includes("blank.png")) {
                emptyTiles.push(tile);
            } else if (emptyTiles.length > 0) {
                let emptyTile = emptyTiles.shift();
                emptyTile.src = tile.src;
                tile.src = "./images/blank.png";
                emptyTiles.push(tile);
            }
        }
        // Fill empty spaces with new candies
        for (let r = 0; r < emptyTiles.length; r++) {
            emptyTiles[r].src = `./images/${randomCandy()}.png`;
        }
    }
}
