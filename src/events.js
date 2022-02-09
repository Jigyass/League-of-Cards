class Event{
    constructor(sourceAbility){
        this.sourceAbility = sourceAbility
    }
    
    checkForTriggers(){
        //iterate through map's tiles
        for (let x = 0; x < map.xWidth; x++) {
            for (let y = 0; y < map.yHeight; y++) {
                //check tile for unit
                let unit = map.tiles[x][y].unit
                if (unit != null) {
                    //iterate through unit's abilities
                    for (let abilityNum = 0; abilityNum < unit.abilities.length; abilityNum++) {
                        //check if ability is a triggered ability
                        let ability = unit.abilities[abilityNum]
                        if (ability.constructor.name == "TriggeredAbility") {
                            //pass this event into the ability's trigger function
                            ability.trigger(this)
                        }
                    }
                }
            }
        }
    }
    
    execute(){
        this.checkForTriggers()
        this.doEvent()
    }
}



class summon_unit extends Event{
    constructor(sourceAbility, summonedUnit, targetTile){
        super(sourceAbility)
        this.eventID = "summon_unit"
        this.summonedUnit = summonedUnit
        this.targetTile = targetTile
    }
    
    doEvent(){
        this.targetTile.unit = this.summonedUnit

        let message = this.summonedUnit.name + " was summoned"
        log.push(message)
    }
}

class destroy_unit extends Event{
    constructor(sourceAbility, targetTile){
        super(sourceAbility)
        this.eventID = "destroy_unit"
        this.targetTile = targetTile
        this.destroyedUnit = targetTile.unit
    }

    doEvent(){
        this.targetTile.unit = null

        let message = this.sourceAbility.sourceUnit.name + " destroyed " + this.destroyedUnit.name + " with " + this.sourceAbility.tag
        log.push(message)
    }
}

class move_unit extends Event{
    constructor(sourceAbility, movedUnit, tileFrom, tileTo){
        super(sourceAbility)
        this.eventID = "move_unit"
        this.movedUnit = movedUnit
        this.tileFrom = tileFrom
        this.tileTo = tileTo
    }

    doEvent(){
        //map.tiles[this.tileTo.xPos][this.tileTo.yPos].
        this.tileTo.unit = this.movedUnit
        this.tileFrom.unit = null

        let message = this.movedUnit.name + " moved"
        log.push(message)
    }
}

class place_counter_on_unit extends Event{
    constructor(sourceAbility, counterType, unit){
        super(sourceAbility)
        this.eventID = "place_counter_on_unit"
        this.counterType = counterType
        this.unit = unit
    }

    doEvent(){
        this.unit.counters.push(this.counterType)

        let message = this.counterType + " counter placed on " + this.unit.name
        log.push(message)
    }
}

class remove_counter_from_unit extends Event{
    constructor(sourceAbility, counterType, unit){
        super(sourceAbility)
        this.eventID = "remove_counter_from_unit"
        this.counterType = counterType
        this.unit = unit
    }

    doEvent(){
        let counterIndex = this.unit.counters.indexOf(this.counterType)
        this.unit.counters.splice(counterIndex, 1)

        let message = this.counterType + " counter removed from " + this.unit.name
        log.push(message)
    }
}

class lose_game extends Event{
    constructor(sourceAbility, commanderLost){
        super(sourceAbility)
        this.eventID = "lose_game"
        this.commanderLost = commanderLost
    }

    doEvent(){
        if (gameWon != null) {
            gameWon = 0
        }
        else if (this.commanderLost.owner.playerID == 1) {
            gameWon = 2
        } else if (this.commanderLost.owner.playerID == 2){
            gameWon = 1
        }
    }
}