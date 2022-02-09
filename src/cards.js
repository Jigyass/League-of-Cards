class Card{
    constructor(name, owner){
        this.name = name
        this.owner = owner
        this.text
        this.ability
        initializeCard(this)
    }

    getRange(){
        return this.ability.getRange()
    }

    play(targetTile){
        if (this.ability.activate(targetTile)) {
            //remove card from hand
            this.owner.hand.discard(this)
            return true
        }
        else {
            //log that it didn't work
            return false
        }
    }

}

function initializeCard(card){
    let name = card.name

    if (name == "Template") {
        card.text = ``
        card.ability
    }

    else if (name == "Knight") {
        card.text = `Charge: Destroy target\n unit within 6 tiles\n vertical or horizontal\n of Knight. If the\n unit is destroyed this\n way, Knight moves\n to that tile.`
        card.ability = new ActivatedAbility("Knight: Summon", card.owner.commander)
    }
    
    else if (name == "Guard Tower") {
        card.text = `Stationary: Cannot move\n
        Watchful Eye:\n When a unit an\n opponent controls\n moves to within 2\n tiles of Guard Tower,\n destroy that unit.`
        card.ability = new ActivatedAbility("Guard Tower: Summon", card.owner.commander)
    }
    
    else if (name == "Fireball") {
        card.text = `KaBoom:\n Destroys everything\n within 3 tiles.`
        card.ability = new ActivatedAbility("Fireball", card.owner.commander)
    }

    else if (name == "Assassin") {
        card.text = `Assassinate: Assassin\n destroys target unit\n within 2 tile vertical\n or horizontal.`
        card.ability = new ActivatedAbility("Assassin: Summon", card.owner.commander)
    }

    else if (name == "Firebound Apprentice") {
        card.text = `Burn Bright:\n Begin with 5\n charge counters. When\n no charge counters remain,\n destroy this unit.

        (1)Explosive Entrance:\nUnit moves to tile\n Destroy each unit within\n 1 tile of unit.
    
        (2)Firebolt:\n Unit destroys enemy`
        card.ability = new ActivatedAbility("Firebound Apprentice: Summon", card.owner.commander)
    }
}