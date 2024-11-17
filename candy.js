/*Programmer: Sachorra Douglas
Date: 11/2/2024
Project: Candy Crush Rep*/

var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"]; // Array of candy colors
var board = []; // Initialize the game board as an empty array
var rows = 9; // Number of rows in the game board
var columns = 9; // Number of columns in the game board
var score = 0; // Initialize score to 0

var currTile; // Variable to store the current tile being dragged
var otherTile; // Variable to store the tile being dropped on


window.onload = function() {
    startGame(); // Start the game when the window loads

    // Update the game every 1/10th of a second
    window.setInterval(function(){
        crushCandy(); // Check and crush candy
        slideCandy(); // Slide candy down
        generateCandy(); // Generate new candy
    }, 100);
}

function randomCandy() {
    // Return a random candy color
    return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}

function startGame() {
    for (let r = 0; r < rows; r++) { // Loop through each row
        let row = []; // Initialize an empty row
        for (let c = 0; c < columns; c++) { // Loop through each column
            // Create a new image element for the candy
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString(); // Set the id of the tile
            tile.src = "./images/" + randomCandy() + ".png"; // Set the image source to a random candy

            // Add drag and drop functionality
            tile.addEventListener("dragstart", dragStart); // Click on a candy to start dragging
            tile.addEventListener("dragover", dragOver);  // Move mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); // Dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); // Leaving candy over another candy
            tile.addEventListener("drop", dragDrop); // Dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); // Swap candies after drag process

            // Append the tile to the board
            document.getElementById("board").append(tile);
            row.push(tile); // Add the tile to the row
        }
        board.push(row); // Add the row to the board
    }

    console.log(board); // Log the board to the console
}

function dragStart() {
    // Store the tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault(); // Prevent default behavior
}

function dragEnter(e) {
    e.preventDefault(); // Prevent default behavior
}

function dragLeave() {
    // Empty function for drag leave
}

function dragDrop() {
    // Store the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return; // Do nothing if any tile is blank
    }

    // Get the coordinates of the current tile
    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    // Get the coordinates of the other tile
    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // Check if the tiles are adjacent
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;
    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        // Swap the images of the current and other tile
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        // Check if the move is valid
        let validMove = checkValid();
        if (!validMove) {
            // Swap back if the move is not valid
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        }
    }
}

function crushCandy() {
    // Check and crush candies in groups of three or more
    //crushFive();
    //crushFour();
    crushThree(); // Crush candies in groups of three
    document.getElementById("score").innerText = score; // Update the score
}

function crushThree() {
    // Check rows for matching candies
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30; // Increase score
            }
        }
    }

    // Check columns for matching candies
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30; // Increase score
            }
        }
    }
}

function checkValid() {
    // Check rows for valid moves
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    // Check columns for valid moves
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false; // No valid moves found
}

function slideCandy() {
    // Slide candies down
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    // Generate new candies at the top
    for (let c = 0; c < columns;  c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}
