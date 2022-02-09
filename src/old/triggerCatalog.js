class Trigger{
    constructor(flagID, triggeredFunction, playerID){
        this.flagID = flagID
        this.function = triggeredFunction
        this.playerID = playerID
    }
}

/*
function trigger_template(playerID){
    let flagID = ""

    function triggeredFunction(target){

    }

    let trigger = new Trigger(flagID, triggeredFunction, playerID)
    return trigger
}
*/

function trigger_commanderDestroyed(playerID){
    let flagID = "UNIT_DESTROYED"

    function triggeredFunction(target){
        if(gameWon != null){ //draw clause, in case this is the second commander destroyed trigger being executed.
            gameWon = 0
        }
        else if (playerID == 1) {
            gameWon = 2
        } 
        else if (playerID == 2){
            gameWon = 1
        }
    }

    let trigger = new Trigger(flagID, triggeredFunction, playerID)
    return trigger
}

function trigger_defended(playerID){
    let flagID = "UNIT_MOVETOTILE"

    function triggeredFunction(target){
        const player = playerID
        if (target.unit.playerID != player) {
            target.unit = null
        }
    }

    let trigger = new Trigger(flagID, triggeredFunction, playerID)
    return trigger
}

function trigger_guardTowerDestroyed(playerID){
    let flagID = "UNIT_DESTROYED"       //when a guard tower unit is destroyed

    function triggeredFunction(target){

        let defended = trigger_defended()
        let defendedRadius = 2
        for (let x = -defendedRadius; x < defendedRadius; x++) {        //goes around to all tiles defended by the guard tower
            for (let y = -defendedRadius; y < defendedRadius; y++) {
                try{
                    index = map.tiles[target.xPos + x][target.yPos + y].triggers.indexOf(defended)
                    map.tiles[target.xPos + x][target.yPos + y].triggers.splice(index, 1)       //removes one instance of the "defended" trigger
                }
                catch(error){
                }
            }
        }
    }

    let trigger = new Trigger(flagID, triggeredFunction, playerID)
    return trigger
}