class Card{
    constructor(name){
        this.name = name;
        this.text = cardText(name)
        this.ability = cardAbility(name)
    }

    getRange(source){
        return this.ability.getRange(source)
    }

    playCard(target){
        this.ability.activate(target)
        //Need to remove card from hand
    }

}





function cardText(name){
    switch (name) {
        case "Guard Tower":
            let text = 
                `Summon range: 4 tiles

                Watchful Eye: When a unit an opponent controls moves to within 2 tiles of Guard Tower, destroy that unit.`;
            return text;

        case "Knight":
            let text = 
            `Summon range: 3 tiles

            Move: Knight moves to target unoccupied tile within 3 tiles vertical or horizontal.
        
            Charge: Target unit within 6 tiles vertical or horizontal of Knight. Knight destroys that unit and moves to its tile.`
            return text;

        case "Assassin":
            let text = 
            `Summon range: 5 tiles

            Move: Assassin moves to target unoccupied tile within 7 tiles diagonally.
        
            Assassinate: Assassin destroys target unit within 1 tile vertically or horizontally.`;
            return text;

        case "Firebound Apprentice":
            let text = 
                `Summon range: 3 tiles

                Burn Bright: Firebound Mage enters the battlefield with 5 charge counters. When Firebound Mage has no charge counters, destroy it.
            
                Move: Firebound Mage moves to target unoccupied tile within 2 tiles vertical or horizontal.
            
                Explosive Entrance: Firebound Mage moves to target unoccupied tile within 7 tiles. Destroy each unit within 1 tile of Firebound Mage. Remove one charge counter.
            
                Firebolt: Firebound Mage destroys target unit within 3 tiles. Remove 2 charge counters.`;
            return text;

        case "Ethereal Ward":
            let text =
                `Target non-commander unit within 5 tiles gains Warded.

                Warded: If an action would destroy this unit, prevent that action and this unit loses Warded.`;
            return text;

        case "Magical Landmine":
            let text =
                `Summon range: 10 tiles

                Trap: This unit does not occupy a tile and is not visible on the map.
            
                Kaboom: When a unit moves to this tile, Magical Landmine destroys itself, that unit, and each unit within 2 tiles.`;
            return text;

        case "Curse":
            let text =
                `Place 5 Death Toll counters on target unit.`;
            return text;

        case "Indiscriminate Wrath":
            let text =
                `Target tile within 6 tiles. Destroy each unit within 2 tiles of target tile.`;
            return text;

        case "Hocus Pocus":
            let text =
                `Target unit moves to a random unoccupied tile.`;
            return text;

        default:
            break;
    }
}

function cardAbility(name){
    switch (name) {
        case "Knight":
            let ability = new Summon_Knight();
            return ability;
    
        default:
            break;
    }
}



/*
function card_template(){
    let name = ""
    let description = ""

    

    let card = new Card(name, description, action)
    return card
}
*/


// DOING



// DONE
function card_guardTower(){
    let name = "Guard Tower"
    let description = "Unmoving, defends a nearby area"
    let action = action_summonGuardTower()

    let card = new Card(name, description, action)
    return card
}

function card_knight(){
    let name = "Knight"
    let description = "Charges headfirst into the fray"

    let action = action_summonKnight()

    let card = new Card(name, description, action)
    return card
}

function card_fireball(){
    let name = "Fireball"
    let description = "kaaBOOOOOM"

    let action = action_fireball()

    let card = new Card(name, description, action)
    return card
}

// TO DO

/*
function assassinCard(){
    function function3(x_pos, y_pos)
    {
        Assassin = new Unit();
        Map.tiles[x_pos][y_pos].unit = Assassin;
    }
    action3 = new Action("Assassin", 1, null, function3());
    this.cards[2] = new Card("Assassin", "something", action3);
}

function wizardCard(){
    function function4(x_pos, y_pos)
    {
        Wizard = new Unit();
        Map.tiles[x_pos][y_pos].unit = Wizard;
    }
    action4 = new Action("Wizard", 1, null, function4());
    this.cards[3] = new Card("Wizard", "something", action4);
}

function etherealWardCard(){
    function function5(x_pos, y_pos)
    {
        Ethereal_Ward = new Trigger();
        Map.tiles[x_pos][y_pos].unit.triggers.push(Ethereal_Ward);
    }
    action5 = new Action("Placed Ethereal Ward", 1, null, function5() );
    this.cards[4] = new Card("Ethereal Ward", "something", action5);

}

function nowYouSeeMeCard(){
    function function7(x_pos, y_pos)
    {
     Now_You_See_Me = new Trigger();
     Map.tiles[x_pos][y_pos].unit.triggers.push(Now_You_See_Me);
    }
    action7 = new Action("Placed Now You See Me", 1, null, function7());
    this.cards[6] = new Card("Now You See Me", "something", action7);
}
*/