// Init varaibles
let board;
let table;
let bombs;
let isPlay;
let numCount;
let FlagCount;
init();

//Initialize variables.
function init() {
    board = new Array(); //Create main array for board. 
    table = document.getElementById('board'); //Target table on HTML.
    bombs = 10;
    isPlay = true;
    numCount = 0;
    FlagCount=0;
    generateBoard();
    generateItemsOnCell();
}

function generateBoard() {
    //This function will generate board on HTML.
    let row, col;
    let idCounter = 0;
    let arrayCounter = 0;

    for (let i = 0; i < 8; i++) {
        row = table.insertRow(i); //Create rows in table.
        board.push(new Array()); //Add inner Arrays into board. 

        for (let j = 0; j < 8; j++) {
            board[i].push(0); // Push items in Inner Arrays that will act as rows in table.
            arrayCounter++;

            col = row.insertCell(j); //Insert numbers into cells of table
            col.classList.add('cell'); //Add class='cell' into each cell item.
            col.setAttribute('id', i + '' + j); //Add id on each cell. 
            col.setAttribute('onmousedown', 'play(this.id,event)'); //Add onmousedown event to call play().
            col.setAttribute('oncontextmenu', 'return false'); //remove right click context menu on each call.

            idCounter++;
        }
    }
}

function generateItemsOnCell() {
    //This function generates numbers and mines on the cells.
    let mineCounter = 0;

    //Generate mines based on random locations on cell.
    let row = 8, col = 8;
    for (let i = 0; i < bombs; i++) {
        board[Math.floor(Math.random() * row)][Math.floor(Math.random() * col)] = 'M';
    }

    //Generate numbers around mines
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            //Check all sides of a cell for mines
            // The loop checks all 8 sides of a cell and based on number of mines it adds the number to the cell.
            if (j + 1 <= 7) {
                board[i][j + 1] === 'M' ? mineCounter++ : '';
            }
            if (j - 1 > 0) {
                board[i][j - 1] === 'M' ? mineCounter++ : '';
            }
            if (i - 1 > 0) {
                board[i - 1][j] === 'M' ? mineCounter++ : '';
            }
            if (i + 1 <= 7) {
                board[i + 1][j] === 'M' ? mineCounter++ : '';
            }
            if (i - 1 > 0 && j - 1 > 0) {
                board[i - 1][j - 1] === 'M' ? mineCounter++ : '';
            }
            if (i + 1 <= 7 && j - 1 > 0) {
                board[i + 1][j - 1] === 'M' ? mineCounter++ : '';
            }
            if (i - 1 > 0 && j <= 7) {
                board[i - 1][j + 1] === 'M' ? mineCounter++ : '';
            }
            if (i + 1 <= 7 && j + 1 <= 7) {
                board[i + 1][j + 1] === 'M' ? mineCounter++ : '';
            }
            if (board[i][j] !== 'M') {
                board[i][j] = mineCounter;
            }
            mineCounter = 0;
        }
    }
    //Calculate cells with numbers
    //This will be used to determine if the player has won the game or not
    for(let i = 0; i<board.length; i++){
        for(let j = 0; j<board[i].length; j++){
            if(board[i][j] !== 0 && board[i][j] !== 'M'){
                numCount++;
            }
        }
    }
}

function play(id, e) {
    //This function is called when any cell is clicked.
    //The id is broken in two parts acting as x and y locations.
    const iOne = id.charAt(0);
    const iTwo = id.charAt(1);
    if (isPlay === true) {
        if (e.button === 0 && board[iOne][iTwo] !== 0 && board[iOne][iTwo] !== 'M') {
            //This if is used when a number'd box is clicked.
            document.getElementById(id).innerText = board[iOne][iTwo];
            win();
        }
        if (e.button === 0 && board[iOne][iTwo] === 0) {
            //This if is called when an empty space box is clicked.
            checkNeighbours(parseInt(iOne), parseInt(iTwo));
            win();
        }
        if (e.button === 0 && board[iOne][iTwo] === 'M') {
            //This if is called when a mine is clicked.
            loose();
        }
        if (e.button === 2){
            setFlag(iOne,iTwo);
        }
    }
}

function win() {
    //This function checks win conditions, Total numbers are compared with the numbers that are revealed in the box. 
    //when both variables are equal then win condition is satisfied.
    let innerTextCount = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (document.getElementById(i + '' + j).innerText != 0 && document.getElementById(i + '' + j).innerText != 'M') {
                innerTextCount++;
            }
        }
    }

    if (numCount === innerTextCount) {
        isPlay = false;
        document.getElementById('gameWin').style.display = 'block';
    }
}

function loose() {
    //Thiis function handles the loose condition, this is called when the player clicks on a mine.
    isPlay = false;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 'M') {
                document.getElementById(i + '' + j).style.backgroundColor = 'red';
            }if(board[i][j] === 'F'){//Checks if Flag is set right or not
                document.getElementById(i + '' + j).style.backgroundColor = 'yellow';
            }
        }
    }
    document.getElementById('gameOver').style.display = 'block';
}

function checkNeighbours(iOne, iTwo) {

    //This function is called when an empty space box is clickd by the player.
    //The function checks for neighbouring cells and if there's a space in the cell then add green color.
    //IF the neighbouring cell has any number in them then the cell shows that number on the board. 
    //The function takes care of the fact that array bounds should not exceed limits to avoid errors. 

    if (document.getElementById(iOne + '' + (iTwo)).style.backgroundColor === 'green') {
        return;
    }

    if (board[iOne][iTwo] === 0) { //if cell[0][0] = 0
        document.getElementById(iOne + '' + iTwo).style.backgroundColor = 'green'; //color it green
        if (iTwo + 1 <= 7) { //Check if next cell on the right is <= 7
            if (board[iOne][iTwo + 1] === 0) { // if next cell on right is free space then color Green
                checkNeighbours(iOne, iTwo + 1);
            } else if (board[iOne][iTwo + 1] === 1 || board[iOne][iTwo + 1] === 2 || board[iOne][iTwo + 1] === 3) {
                //Else show the number on next cell.
                document.getElementById(iOne + '' + (iTwo + 1)).innerText = board[iOne][iTwo + 1];
            }
        }

        if (iTwo - 1 > 0) {
            if (board[iOne][iTwo - 1] === 0) {
                checkNeighbours(iOne, (iTwo - 1));

            } else if (board[iOne][iTwo - 1] === 1 || board[iOne][iTwo - 1] === 2 || board[iOne][iTwo - 1] === 3) {
                document.getElementById(iOne + '' + (iTwo - 1)).innerText = board[iOne][iTwo - 1];
            }
        }
        if (iOne - 1 > 0) {
            if (board[iOne - 1][iTwo] === 0) {
                checkNeighbours(iOne - 1, iTwo);

            } else if (board[iOne - 1][iTwo] === 1 || board[iOne - 1][iTwo] === 2 || board[iOne - 1][iTwo] === 3) {
                document.getElementById((iOne - 1) + '' + iTwo).innerText = board[iOne - 1][iTwo];

            }
        }
        if (iOne + 1 <= 7) {
            if (board[iOne + 1][iTwo] === 0) {
                checkNeighbours(iOne + 1, iTwo);

            } else if (board[iOne + 1][iTwo] === 1 || board[iOne + 1][iTwo] === 2 || board[iOne + 1][iTwo] === 3) {
                document.getElementById((iOne + 1) + '' + iTwo).innerText = board[iOne + 1][iTwo];

            }
        }
        if (iOne - 1 > 0 && iTwo - 1 > 0) {
            if (board[iOne - 1][iTwo - 1] === 0) {
                checkNeighbours(iOne - 1, iTwo - 1);

            } else if (board[iOne - 1][iTwo - 1] === 1 || board[iOne - 1][iTwo - 1] === 2 || board[iOne - 1][iTwo - 1] === 3) {
                document.getElementById((iOne - 1) + '' + (iTwo - 1)).innerText = board[iOne - 1][iTwo - 1];

            }
        }
        if (iOne + 1 <= 7 && iTwo - 1 > 0) {
            if (board[iOne + 1][iTwo - 1] === 0) {
                checkNeighbours(iOne + 1, iTwo - 1);

            } else if (board[iOne + 1][iTwo - 1] === 1 || board[iOne + 1][iTwo - 1] === 2 || board[iOne + 1][iTwo - 1] === 3) {
                document.getElementById((iOne + 1) + '' + (iTwo - 1)).innerText = board[iOne + 1][iTwo - 1];

            }
        }
        if (iOne - 1 > 0 && iTwo <= 7) {
            if (board[iOne - 1][iTwo + 1] === 0) {
                checkNeighbours(iOne - 1, iTwo + 1);

            } else if (board[iOne - 1][iTwo + 1] === 1 || board[iOne - 1][iTwo + 1] === 2 || board[iOne - 1][iTwo + 1] === 3) {
                document.getElementById((iOne - 1) + '' + (iTwo + 1)).innerText = board[iOne - 1][iTwo + 1];

            }
        }
        if (iOne + 1 <= 7 && iTwo + 1 <= 7) {
            if (board[iOne + 1][iTwo + 1] === 0) {
                checkNeighbours(iOne + 1, iTwo + 1);

            } else if (board[iOne + 1][iTwo + 1] === 1 || board[iOne + 1][iTwo + 1] === 2 || board[iOne + 1][iTwo + 1] === 3) {
                document.getElementById((iOne + 1) + '' + (iTwo + 1)).innerText = board[iOne + 1][iTwo + 1];

            }
        }
    }
}

function restart() {
    //This function restarts the game.
    //Removes all variables and HTML table. 
    //calls init() function.
    document.getElementById('board').removeChild(document.getElementById('board').childNodes[1]);
    board = '';
    table = '';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameWin').style.display = 'none';
    isPlay = true;
    init();
}
function setFlag(iOne,iTwo){// Sets the Flag
    id=iOne + '' + iTwo;
    if(FlagCount < bombs){//Flags Can't exceed Bombs
        if(document.getElementById(id).style.backgroundColor !== 'green' && document.getElementById(id).innerText==""){
            if(document.getElementById(id).style.backgroundColor == 'blue'){
               if(board[iOne][iTwo]==='F'){
                 board[iOne][iTwo] = 'M';
                 document.getElementById(id).style.backgroundColor = '#BDBDBD';
                  return FlagCount--;
               } else{
                 document.getElementById(id).style.backgroundColor = '#BDBDBD';
                return FlagCount--;
               }
            }
            if(board[iOne][iTwo]==="M"){
                document.getElementById(id).style.backgroundColor = 'blue';
                board[iOne][iTwo]="F";
                return FlagCount++;
            }else{
                document.getElementById(id).style.backgroundColor = 'blue';
                return FlagCount++;
            }
        }
    }else{
        return alert('Flag Count Reached');
    }
}