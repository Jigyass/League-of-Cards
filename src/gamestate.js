let gameStart = false
let turn = 1
let tileSelected = null
let unitSelected = null
let actionSelected = null
let cardSelected = null
let gameWon = null


var log = []

function resetGame(){
    turn = 1
    tileSelected = null
    unitSelected = null
    actionSelected = null
    cardSelected = null
    gameWon = null
    log = []
    initialize()
}

