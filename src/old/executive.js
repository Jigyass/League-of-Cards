/*
    post: resets gamestate variables to null and passes the turn to player 2.
*/
function passTurn(){
    while (stack.isEmpty() == false) {
        stack.resolveTop()
    }


    tileSelected = null
    unitSelected = null
    actionSelected = null
    cardSelected = null
    turn = (turn % 2) + 1
}


let triggeredFunctions = []

/*
    param: tile, a tile in the map; and flag, a flagID.
    pre: called only when the tile in question is a relevant tile for flag.
    post: for all triggers belonging to tile, compares flag to that trigger's flagID. If there is a match, it executes that trigger's function.
*/
function executeTileTriggers(tile, flag){
    //console.log("looking at tile triggers")
    for(let i = 0; i < tile.triggers.length; i++){
        if(tile.triggers[i].flagID == flag){
            triggeredFunctions.push(tile.triggers[i].function)
        }
    }
}

/*
    param: tile, a tile in the map; and flag, a flagID.
    pre: called only when the tile in question is a relevant tile for flag, and when there is a unit on that tile.
    post: for all triggers belonging to the unit located on tile, compares flag to that trigger's flagID. If there is a match, it executes that trigger's function.
*/
function executeUnitTriggers(tile, flag){
    for(let i = 0; i < tile.unit.triggers.length; i++){
        if(tile.unit.triggers[i].flagID == flag){
            triggeredFunctions.push(tile.unit.triggers[i].function)
        }
    }
}

/*
    param: target, the action to be executed.
    pre: called only when actionSelected is set to an action (not null)
    post: Executes target. Then for each flag associated with target, this function executes triggers of relevant tiles and any units on relevant tiles.
*/
function executeAction(target){

    let flags = actionSelected.flags
    //console.log(flags)
    for(let flag = 0; flag < flags.length; flag++){        
        let flagID = flags[flag].flagID                            //defining flagID to be the identifier for the flag we are currently looking at
        let relevantTiles = flags[flag].relevantTiles(target)  //defining relevantTiles to be a 2D array of boolean values that represent all relevant tiles for the flag we are currently looking at
        
        for(let x = 0; x < map.xWidth; x++){
            for(let y = 0; y < map.yHeight; y++){
                if(relevantTiles[x][y] == 1){
                   executeTileTriggers(map.tiles[x][y], flagID)         //executing tile triggers for all relevant tiles
                   if(map.tiles[x][y].unit != null){
                        executeUnitTriggers(map.tiles[x][y], flagID)    //executing unit triggers for all relevant tiles
                   }
                }
            }
        }
    }

    actionSelected.function(tileSelected, target, turn)                     //carry out the action

    log.push("Player " + turn + " has " + actionSelected.name)              //mark the action in the log
    
    while (triggeredFunctions.length > 0) {
        triggeredFunctions[0](target)
        triggeredFunctions.splice(0,1)
    }

    passTurn()
}