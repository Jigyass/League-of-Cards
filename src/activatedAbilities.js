class ActivatedAbility {
    constructor(name, sourceUnit){
        //These should be set when constructed
        this.name = name
        this.sourceUnit = sourceUnit
        this.tag
        this.rangeType
        this.range
        this.conditions
        this.targetConditions
        this.resolve
        initializeActivatedAbility(this)

        //These should be set when being put on the stack
        this.sourceTile
        this.targetTile
    }

    getRange(){
        if (this.rangeType == "radial") {
            return radialRange(tileSelected, this.range)
        } else if (this.rangeType == "straight"){
            return straightRange(tileSelected, this.range)
        } else if (this.rangeType == "diagonal"){
            return diagonalRange(tileSelected, this.range)
        }
    }

    conditionsMet(){
        let met = true

        if (this.conditions.includes("One Charge Counter")) {
            let charges = 0
            this.sourceUnit.counters.forEach(counter => {
                if (counter == "Charge") {
                    charges++
                }
            });
            
            if (charges < 1) {
                met = false
                log.push("Not enough Charge counters")
            }
        }
        if (this.conditions.includes("Two Charge Counters")) {
            let charges = 0
            this.sourceUnit.counters.forEach(counter => {
                if (counter == "Charge") {
                    charges++
                }
            });

            if (charges < 2) {
                met = false
                log.push("Not enough Charge counters")
            }
        }

        //console.log("met = ", met)
        return met
    }
    
    targetConditionsMet(targetTile){
        let valid = true

        if (this.getRange()[targetTile.xPos][targetTile.yPos] == false) {
            valid = false
            log.push("out of range")
        }
        if (this.targetConditions.includes("unoccupied") && targetTile.occupied() == true) {
            valid = false
            log.push("tile occupied")
        }
        if (this.targetConditions.includes("unit") && targetTile.unit == null) {
            valid = false
            log.push("not a unit")
        }
        if (this.targetConditions.includes("ally") && targetTile.unit.playerID != this.sourceUnit.playerID) {
            valid = false
            log.push("not an allied unit")
        }
        if (this.targetConditions.includes("enemy") && targetTile.unit.playerID == this.sourceUnit.playerID) {
            valid = false
            log.push("not an enemy unit")
        }
        if (this.targetConditions.includes("non-commander") && targetTile.unit.name == "Commander") {
            valid = false
            log.push("tile occupied")
        }

        //console.log("valid = ", valid)
        return valid
    }

    setSource(tile, unit){
        this.sourceTile = tile
        this.sourceUnit = unit
    }

    activate(targetTile){
        if (this.conditionsMet() && this.targetConditionsMet(targetTile)) {
            let copy = new ActivatedAbility(this.name, this.sourceUnit)
            copy.sourceTile = tileSelected
            copy.targetTile = targetTile

            stack.pushAbility(copy)
            return true
        }
        else {
            return false
        }
    }

    resolve(){
        //This function is defined dynamically for each ability name
    }

}



function initializeActivatedAbility(ability){
    let name = ability.name

    if (name == "Template") {
        ability.tag = ""
        ability.rangeType = ""
        ability.range = 0
        ability.targetConditions = []
        ability.conditions = []
        
        function resolve(){

        }
        ability.resolve = resolve
    }


    else if (name == "Commander: Move") {
        ability.tag = "Move"
        ability.rangeType = "radial"
        ability.range = 1
        ability.targetConditions = ["unoccupied"]
        ability.conditions = []
        
        function resolve(){
            let event = new move_unit(this, this.sourceUnit, this.sourceTile, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    }
    else if (name == "Commander: Attack") {
        ability.tag = "Attack"
        ability.rangeType = "radial"
        ability.range = 1
        ability.targetConditions = ["unit"]
        ability.conditions = []
        
        function resolve(){
            let event = new destroy_unit(this, this.targetTile)
            event.execute()

            event = new move_unit(this, this.sourceUnit, this.sourceTile, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    }
    else if (name == "Commander: Draw Card") {
        ability.tag = "Draw Card"
        ability.rangeType = "radial"
        ability.range = 0
        ability.targetConditions = ["unit"]
        ability.conditions = []
        
        function resolve(){
            
        }
        ability.resolve = resolve
    }


    else if (name == "Knight: Summon") {
        ability.tag = "Knight"
        ability.rangeType = "radial"
        ability.range = 5
        ability.targetConditions = ["unoccupied"]
        ability.conditions = []
        
        function resolve(){
            let Knight = new Unit("Knight", this.sourceUnit.owner)
            let event = new summon_unit(this, Knight, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    } 
    else if (name == "Knight: Move") {
        ability.tag = "Move"
        ability.rangeType = "radial"
        ability.range = 3
        ability.targetConditions = ["unoccupied"]
        ability.conditions = []
        
        function resolve(){
            let event = new move_unit(this, this.sourceUnit, this.sourceTile, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    } 
    else if (name == "Knight: Charge") {
        ability.tag = "Charge"
        ability.rangeType = "straight"
        ability.range = 7
        ability.targetConditions = ["unit"]
        ability.conditions = []
        
        function resolve(){
            let event = new destroy_unit(this, this.targetTile)
            event.execute()

            event = new move_unit(this, this.sourceUnit, this.sourceTile, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    }


    else if (name == "Guard Tower: Summon") {
        ability.tag = "Guard Tower"
        ability.rangeType = "radial"
        ability.range = 3
        ability.targetConditions = ["unoccupied"]
        ability.conditions = []
        
        function resolve(){
            let guardTower = new Unit("Guard Tower", this.sourceUnit.owner)
            let event = new summon_unit(this, guardTower, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    }


    else if (name == "Assassin: Summon") {
        ability.tag = "Assassin"
        ability.rangeType = "radial"
        ability.range = 5
        ability.targetConditions = ["unoccupied"]
        ability.conditions = []
        
        function resolve(){
            let assassin = new Unit("Assassin", this.sourceUnit.owner)
            let event = new summon_unit(this, assassin, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    }
    else if (name == "Assassin: Move") {
        ability.tag = "Move"
        ability.rangeType = "diagonal"
        ability.range = 7
        ability.targetConditions = ["unoccupied"]
        ability.conditions = []
        
        function resolve(){
            let event

            event = new move_unit(this, this.sourceUnit, this.sourceTile, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    }
    else if (name == "Assassin: Assassinate") {
        ability.tag = "Assassinate"
        ability.rangeType = "diagonal"
        ability.range = 2
        ability.targetConditions = ["unit"]
        ability.conditions = []
        
        function resolve(){
            let event

            event = new destroy_unit(this, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    }


    else if (name == "Firebound Apprentice: Summon") {
        ability.tag = "Firebound Apprentice"
        ability.rangeType = "radial"
        ability.range = 3
        ability.targetConditions = ["unoccupied"]
        ability.conditions = []
        
        function resolve(){
            let event

            let unit = new Unit("Firebound Apprentice", this.sourceUnit.owner)
            event = new summon_unit(this, unit, this.targetTile)
            event.execute()

            for (let i = 0; i < 5; i++) {
                event = new place_counter_on_unit(this, "Charge", unit)
                event.execute()
            }
        }
        ability.resolve = resolve
    }
    else if (name == "Firebound Apprentice: Move") {
        ability.tag = "Move"
        ability.rangeType = "straight"
        ability.range = 2
        ability.targetConditions = ["unoccupied"]
        ability.conditions = []
        
        function resolve(){
            let event

            event = new move_unit(this, this.sourceUnit, this.sourceTile, this.targetTile)
            event.execute()
        }
        ability.resolve = resolve
    }
    else if (name == "Firebound Apprentice: Explosive Entrance") {
        ability.tag = "Explosive Entrance"
        ability.rangeType = "radial"
        ability.range = 7
        ability.targetConditions = ["unoccupied"]
        ability.conditions = ["Two Charge Counters"]
        
        function resolve(){
            let event
        
            let range = radialRange(this.targetTile, 1)
            for (let x = 0; x < map.xWidth; x++) {
                for (let y = 0; y < map.yHeight; y++) {
                    if (range[x][y] && map.tiles[x][y].unit != null) {
                        event = new destroy_unit(this, map.tiles[x][y])
                        event.execute()
                    }
                }
            }

            event = new move_unit(this, this.sourceUnit, this.sourceTile, this.targetTile)
            event.execute()
            
            event = new remove_counter_from_unit(this, "Charge", this.sourceUnit)
            event.execute()
            event.execute()

            //event = new remove_counter_from_unit(this, "Charge", this.sourceUnit)
            event.checkForTriggers()
        }
        ability.resolve = resolve
    }
    else if (name == "Firebound Apprentice: Firebolt") {
        ability.tag = "Firebolt"
        ability.rangeType = "radial"
        ability.range = 7
        ability.targetConditions = ["unit"]
        ability.conditions = ["One Charge Counter"]
        
        function resolve(){
            let event
        
            event = new destroy_unit(this, this.targetTile)
            event.execute()
            
            event = new remove_counter_from_unit(this, "Charge", this.sourceUnit)
            event.execute()
            event.checkForTriggers()
        }
        ability.resolve = resolve
    }


    else if (name == "Magical Landmine: Summon") {
        
    }


    else if (name == "Fireball") {
        ability.tag = "Fireball"
        ability.rangeType = "radial"
        ability.range = 8
        ability.targetConditions = []
        ability.conditions = []
        
        function resolve(){
            let event
        
            let range = radialRange(this.targetTile, 3)
            for (let x = 0; x < map.xWidth; x++) {
                for (let y = 0; y < map.yHeight; y++) {
                    if (range[x][y] && map.tiles[x][y].unit != null) {
                        event = new destroy_unit(this, map.tiles[x][y])
                        event.execute()
                    }
                }
            }
        }
        ability.resolve = resolve
    }


    else if (name == "Curse") {
        
    }
    

    else if (name == "Hocus Pocus") {
        
    }
    else if (name == "") {
        
    }
    else if (name == "") {
        
    }
}