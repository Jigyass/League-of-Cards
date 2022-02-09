let canvas
let context

 /* 
    pre: assumes initialization has just been completed. 
    post: draws board, cards, and actions.
*/
function drawTemplate() {
    if (gameWon == null) {
        drawBoard();
        drawLog();
        drawCards();
        drawActions();
        drawUnits();

    
        if (actionSelected != null) {
            highlightTiles_ActionRange()
        }
    }
    else {
        drawWinScreen(gameWon)
    }
}


/*
    pre: log must be drawn
*/
function drawLog()
{
    canvas = document.getElementById("log");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 2000, 2000);
    ctx.font = "12px Georgia";

    if (log.length > 41) {
        let deltaLength = log.length - 41

        log.splice(0, deltaLength)
    }

    // draw the log on the screen
    for(var i = 0; i < log.length;i++)
    {
        ctx.fillText(log[i] + "\n", 3, 12+14*i);
    }
}

function drawMenu() {
    canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 2000, 1000);
    for (let i = 0; i < 3; i++){
        ctx.beginPath()
        ctx.lineWidth = "1"
        ctx.moveTo(1050, 200 + 100*i)
        ctx.lineTo(1050, 270 + 100*i)
        ctx.lineTo(360, 270 + 100*i)
        ctx.lineTo(360, 200 + 100*i)
        ctx.lineTo(1050, 200 + 100*i)
        ctx.strokeStyle = "black"
        ctx.stroke()
        ctx.font = "bold 29pt Verdana";
        ctx.fillText("PLAY", 650, 250)
        ctx.fillText("HOW TO PLAY", 560, 350)
        ctx.fillText("TEST", 650, 450)
    }
}

/*   
    post: draws the board
*/
function drawBoard() {
    // draw board
    canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 2000, 1000);
    //loop for drawing grid lines
    for (var i = 0; i <= 1400; i = i + 40) {

        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "black";
        //vertical lines
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 1400);

        //horizontal lines
        ctx.moveTo(0, i);
        ctx.lineTo(1400, i);

        ctx.strokeStyle = "black";
        ctx.stroke();
    }
}

/*   
    post: draws five spaces for cards to be drawn (at this point in implementation, does not have the functionality for drawing the cards themselves)
    fix: add, the print name, and draw rectangle. maybe second for loop. depending on number of cards, use ctx.filltext to write card's name at the top of the card.
*/
function drawCards() {
    //draw cards
    canvas = document.getElementById("cards");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 2000, 1000);
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "black";
    ctx.font = "bold 12pt Verdana";

    //loop draws card rectangles but very messily

    let j = 0;
    for (var i = 80; i <= 704; i = i + 156) {
        ctx.rect(i, 20, 100, 150);      //top left corner is at [i, 20] then [width, height]
        ctx.stroke();
        var lines;

        if(turn == 1 && j < player1.hand.cards.length)
        {
            ctx.font = "bold 12pt Verdana";
            ctx.fillText(player1.hand.cards[j].name, i + 2, 37, 95);
            ctx.font = "8pt Verdana";
            
            lines = player1.hand.cards[j].text.split(`\n`);
            for(var k = 0; k < lines.length; k++)
            {
                ctx.fillText(lines[k], i + 2, 60 + (k*9), 95);
            }
        }
        else if (turn == 2 && j < player2.hand.cards.length)
        {
            ctx.font = "bold 12pt Verdana";
            ctx.fillText(player2.hand.cards[j].name, i + 2, 37, 95);
            ctx.font = "8pt Verdana";

            lines = player2.hand.cards[j].text.split(`\n`);
            for(var k = 0; k < lines.length; k++)
            {
                ctx.fillText(lines[k], i + 2, 60 + (k*9), 95);
            }
            //ctx.fillText(player2.hand.cards[j].text, i + 2, 60, 95);
        }
        j++
    }
}


/*   
    post: draws the symbols all units in the appropriate tiles.
*/
function drawUnits() {
    canvas = document.getElementById("board")
    ctx = canvas.getContext("2d");
    ctx.font = "30pt Calibri"
    for(let x = 0; x < map.xWidth; x++){
        for(let y = 0; y < map.yHeight; y++){
            if(map.tiles[x][y].unit != null){
                let symbol = map.tiles[x][y].unit.symbol
                let xCoord = Math.floor(3 + x*40)
                let yCoord = Math.floor(33 + y*40)
                let maxWidth = 35
                ctx.fillText(symbol, xCoord, yCoord, maxWidth)      //drawing symbol for the unit
                //console.log("unit " + symbol + " drawn at (" + xCoord + ", " + yCoord + ") = tile (" + x + ", " + y + ")")
            }
        }
    }
}


/*   
    post: draws three action buttons. If a unit is selected, will name these buttons after the actions available to that unit.
*/
function drawActions() {
    canvas = document.getElementById("actions");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 2000, 1000);
    ctx.font = "21pt Impact"
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.strokeStyle = "black";

    for (let i = 0; i < 3; i++) {
        yCoord = 60*i
        ctx.rect(90, 25 + yCoord, 300, 30);
        ctx.stroke();
        if(unitSelected != null){
            if(unitSelected.getActivatedAbilities()[i] != null){
                ctx.fillText(unitSelected.getActivatedAbilities()[i].tag, 95, 50 + yCoord, 90)
            }
        }
    }
}

/*   
    pre:    an action or card is selected
    post:   tiles within range of the selected action or card are highlighted
*/
function highlightTiles_ActionRange() {
    actionRange = actionSelected.getRange()

    for (let x = 0; x < map.xWidth; x++) {
        for (let y = 0; y < map.yHeight; y++) {
            if (actionRange[x][y]) {
                highlightTile(x,y)
            }            
        }        
    }
}

/*   
    param:  x, the x coordinate of the tile to highlight
            y, the y coordinate of the tile to highlight
    post:   the indicated tile is highlighted on the UI
*/
function highlightTile(x, y) {
    canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "red";

    ctx.rect(40*x, 40*y, 40, 40)
    ctx.stroke()
}

/*   
    param:  player, the playerID of the player who won
    pre:    one or both commanders have been destroyed
    post:   winscreen is drawn (printed) over the gameboard area
*/
function drawWinScreen(player){
    canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 2000, 1000);
    ctx.font = "90pt Impact"
    if(gameWon == 0){
        ctx.fillText("IT'S A DRAW", 530, 350, 350)
    }
    else {
        ctx.fillText("PLAYER " + player + " WINS", 530, 350, 350)
    }
}

/*   
    param:  
    pre:    Test button has been clicked in the menu
    post:   draw (print) test results over the gameboard area
*/
function drawTestResults(){
    canvas = document.getElementById("board")
    ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, 2000, 1000);
    ctx.font = "22pt Calibri"
    for(let i = 0; i < numberOfTests; i++){
        ctx.fillText(testDescriptions[i] + outcomes[i], 15, 30 + 40*i)
    }
}