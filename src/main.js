document.addEventListener("DOMContentLoaded", () => {
    drawMenu()
    //initialize()
});

/*   
    pre: called only when DOM content has loaded.
    post: constructs a map and two players, draws board and commanders.
*/
function initialize(){
    map = new Map()
    stack = new Stack()
    player1 = new Player(1)
    player2 = new Player(2)
    log.push("Game Log: ")
    log.push("Player 1 turn:")
    drawTemplate()
}

/*   
    param: x and y, the x and y coordinates of a click on the screen
    post: returns a value representing which canvas (board, cards, or actions) x and y correspond to.
*/
function canvasRounding(x, y){
    let section = 0
    if(x > 8 && x < 1408 && y > 8 && y < 608){
        section = 1
    }
    else if(x > 8 && x < 909 && y > 626 && y < 827){
        section = 2
    }
    else if(x > 914 && x < 1408 && y > 626 && y < 827){
        section = 3
    }
    //console.log(section)
    return(section)
}

/*   
    param: x and y, the x and y coordinates of a click on the screen
    pre: assumes x and y correspond to the board canvas
    post: returns the tile that x and y correspond to.
*/
function tileRounding(x, y){
    roundedXCoordinate = Math.floor((x - 8)/40)
    roundedYCoordinate = Math.floor((y - 8)/40)
    //console.log([roundedXCoordinate, roundedYCoordinate])
    return(map.tiles[roundedXCoordinate][roundedYCoordinate])
}

/*   
    param: x and y, the x and y coordinates of a click on the screen
    pre: assumes x and y correspond to the cards canvas
    post: returns the card that x and y correspond to.
*/
function cardRounding(x, y){
    //all cards [647 < y < 797]
    //card 1 [88 < x < 188]
    //card 2 [244 < x < 344]
    //card 3 [400 < x < 500]
    //card 4 [556 < x < 656]
    //card 5 [712 < x < 812]

    let cardNum = null

    if (y >= 647 && y <= 797) {                 //test y coord of click
        if (x >= 88 && x <= 188) {              //test x coord of click
            cardNum = 0                         //set cardNum to array value of card clicked
        }
        else if (x >= 244 && x <= 344){
            cardNum = 1
        }
        else if (x >= 400 && x <= 500){
            cardNum = 2
        }
        else if (x >= 556 && x <= 656){
            cardNum = 3
        }
        else if (x >= 712 && x <= 812){
            cardNum = 4
        }
    }
    
    let card = null
    if (turn == 1) {                             //check who's turn it is
        try {
            card = player1.hand.cards[cardNum]   //try to set card to the card clicked
        } catch (error) {
            console.log(error)                   //if an empty card is clicked, log error
        }
    } else if (turn == 2) {
        try {
            card = player2.hand.cards[cardNum]
        } catch (error) {
            console.log(error)
        }
    }
    return card
}

/*   
    param: x and y, the x and y coordinates of a click on the screen
    pre: assumes x and y correspond to the actions canvas
    post: returns the action that x and y correspond to.
*/
function actionRounding(x, y){
    //all actions [1003 < x < 1306]
    //action 1 [650 < y < 683]
    //action 2 [710 < y < 343]
    //action 3 [770 < y < 803]

    let actionNum = null
    let action = null
    if(x > 1003 && x < 1306){
        for(let i = 0; i < 3; i++){
            if(y > 650 + 60*i && y < 683 + 60*i){
                actionNum = i + 1
                //check whether there is currently a unit selected
                if(unitSelected != null){                       
                    let activatedAbilities = unitSelected.getActivatedAbilities()
                    action = activatedAbilities[i]            //if so, set action to the action that has been clicked
                }
            }
        }
    }
    return(action)

}

function menuRounding(x, y){
    if(x >= 360 && x <= 1050){
        if(y > 200 && y < 270){
            gameStart = true
            initialize()
        }
        else if(y > 300 && y < 370){
            window.open(document.getElementById("rules").href)
        }
        else if(y > 400 && y < 470){
            gameStart = true
            initialize()
            runTests()
        }
    }
}
/*   
    param: x and y, the x and y coordinates of a click on the screen
    pre: called only when a click has been registered by the click event listener.
    post: determines what section of the board has been clicked, checks gamestate variables if applicable, then performs the appropriate functionality.
*/
function clickProcessing(x, y){
    if(actionSelected != null && turn != unitSelected.owner.playerID){
        alert("That's not your unit!")
        actionSelected = null
        unitSelected = null
        }
    else {
        let canvasSection
        canvasSection = canvasRounding(x, y)            //check to see which section of the canvas the click has occurred in
        if(canvasSection == 1){                         //map area has been clicked
            let tile = tileRounding(x, y)               //check which tile was clicked
            tileClicked(tile)
        }
        else if(canvasSection == 2){                    //if the card area has been clicked
            let card = cardRounding(x, y)               //see which card was clicked
            if (card != null) {
                cardClicked(card)
            }
        }
        else if(canvasSection == 3){
            let action = actionRounding(x, y)
            if (action != null) {
                actionClicked(action)
            }
        }
    }
    //console.log(turn, tileSelected, unitSelected, actionSelected, cardSelected)
    

    drawTemplate()                         //update board to show the outcome of the click
}


/*   
    param:  tile, the tile object that was clicked
    post:   provides proper functionality for a tile being clicked in any situation
*/
function tileClicked(tile) {
    if(actionSelected == null){                 //if there is no action currently selected, select the tile and the unit on the tile
        selectTile(tile)
    }
    else if(cardSelected != null) {
        if (cardSelected.play(tile)) {
            passTurn()
        }
        else {
            console.log("Card was not played")
            unitSelected = null
            actionSelected = null
            cardSelected = null
            selectTile(tile)
        }
    }
    else if(cardSelected == null && actionSelected != null) {
        if (actionSelected.activate(tile)) {
            passTurn()
        }
        else {
            console.log("Ability was not activated")
            unitSelected = null
            actionSelected = null
            cardSelected = null
            selectTile(tile)
        }
    }

    /*
    else {
        let validTargetSelected = actionSelected.validTarget(tileSelected, actionSelected.range, tile)
        if(validTargetSelected){
            executeAction(tile)               //if there is an action currently selected, and if the selected tile is valid for that action, execute the action.
        }
        else {
            unitSelected = null
            actionSelected = null
            cardSelected = null
            selectTile(tile)
        }
    }
    */
}

/*   
    param:  tile, the tile to select
    pre:    none
    post:   the tile passed in is selected, along with any unit on that tile
*/
function selectTile(tile) {
    tileSelected = tile
    unitSelected = tile.unit
}

/*   
    param:  card, the card object that was clicked
    pre:    none
    post:   provides functionality for a card being clicked to either select or unselect it
*/
function cardClicked(card) {
    if (card == cardSelected) {                 //if you click the card that is currently selected
        cardSelected = null                     //deselect the card and action
        actionSelected = null
    }
    else {
        selectTile(findCommander())             //set selected tile to where commander is
        cardSelected = card                     //update cardSelected
        actionSelected = card.ability           //update actionSelected
    }
}

/*   
    param:  action, the unit action that was clicked
    pre:    none
    post:   provides functionality for an action being clicked to either select or unselect it
*/
function actionClicked(action) {
    if (action == actionSelected) {
        actionSelected = null
    } 
    else {
        actionSelected = action
    }
}

document.addEventListener("click", e => {
    
    if(gameWon == null){               //prevent further clicks from being processed once the game has ended.
        if(gameStart == false){
            menuRounding(e.x, e.y)
        }
        else{
            console.log(e.x, e.y)
            clickProcessing(e.x, e.y)
        }
    }
})

/*
    post: resets gamestate variables to null and passes the turn to player 2.
*/
function passTurn(){
    while (stack.isEmpty() == false) {
        stack.resolveTop()
    }

    checkForStalemate()
    tileSelected = null
    unitSelected = null
    actionSelected = null
    cardSelected = null
    turn = (turn % 2) + 1

    let message = "Player " + turn + " turn:"
    log.push(message)
}

/*
    post: checks both players hands and the board to see if there are any units capable of capturing a commander. If not, the game results in a draw.
*/
function checkForStalemate(){
    let cardsRemain = true
    let unitsRemain = false
    if(player1.hand.cards.length == 0 && player2.hand.cards.length == 0){
        cardsRemain = false                                                 //if neither player has any cards in hand, cardsRemain is false
    }
    for (let x = 0; x < map.xWidth; x++) {                              //loop through map x coords
        for (let y = 0; y < map.yHeight; y++) {                         //loop through map y coords
            try {                                                       //try catch for error when the tile doesn't have a unit
                let unit = map.tiles[x][y].unit
                if (unit.symbol != "*" && unit.symbol != "GT" && unit.symbol != null) {      //if there is any tile that contains a unit other than a Commander
                    unitsRemain = true                           //unitsRemain is true
                }   
            } catch (error) {
            }
        }                
    }
    if(cardsRemain == false && unitsRemain == false){
        gameWon = 0
    }
}