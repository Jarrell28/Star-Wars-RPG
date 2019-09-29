//Create Game Object
//Create playing boolean
//Create array of character objects
//Character should have HP, Attack Power, CounterAttack Power
//Create way to select character and move to player html
//Create way to select enemy and move to defender area
//create attack button when characters are chosen
//When attacking calculate hp losses, check if someone dies
//

var gameObj = {
    playing: true,
    characters: [
        {
            name: "Obi-Wan Kenobi",
            HP: 120,
            AP: 8,
            CP: 25
        },
        {
            name: "Luke Skywalker",
            HP: 100,
            AP: 8,
            CP: 25
        },
        {
            name: "Darth Sidious",
            HP: 150,
            AP: 8,
            CP: 25
        },
        {
            name: "Darth Maul",
            HP: 180,
            AP: 8,
            CP: 25
        },

    ],
    champion: {},
    enemy: {},

    //Loops over character array objects and creates html elements for each
    displayCharacters: function () {
        this.characters.forEach(function (character) {
            $("#characters").append(`<div class="col-sm-3 character" data-name="${character.name}"><p>${character.name}</p><p>${character.HP}</p></div>`);
        })
    },

    //Selects a character as the champion and adds that object to the champion object
    selectChampion: function (name) {

        //Loops over each character html element
        $(".character").each(function () {
            var characterName = $(this).data("name");
            //Returns the matching object of the current character being looped
            var characterObj = gameObj.characters.filter(function (character) {
                return character.name === characterName;
            });

            //If current character name is equal to the name of the characted clicked then assigns it as champion
            //Also moves champion to champion html section
            if (characterName === name) {
                $("#champion").append(`<div class="col-sm-3" id="champion-character" data-name="${characterObj[0].name}"><p>${characterObj[0].name}</p><p>${characterObj[0].HP}</p></div>`);
                $(this).remove();
                gameObj.champion = characterObj[0];
            }
            //Else just moves character to the opponents section and removes it from champion select section
            else {
                $("#opponents").append(`<div class="col-sm-3 opponent" data-name="${characterObj[0].name}"><p>${characterObj[0].name}</p><p>${characterObj[0].HP}</p></div>`);
                $(this).remove();
            }
        });

    },

    //Pretty much same as selectChampion except it is selecting the Enemy and adding it to enemy object
    selectEnemy: function (name) {
        $(".opponent").each(function () {
            var opponentName = $(this).data("name");
            var characterObj = gameObj.characters.filter(function (character) {
                return character.name === opponentName;
            });

            if (opponentName === name) {
                $("#enemy").append(`<div class="col-sm-3" id="enemy-character" data-name="${characterObj[0].name}"><p>${characterObj[0].name}</p><p>${characterObj[0].HP}</p></div>`);
                $(this).remove();
                gameObj.enemy = characterObj[0];
            }
        });
    }
}

gameObj.displayCharacters();

//When clicking, gets character name via data-name attribute and calls selectChampion function passing the name
$(".character").on("click", function () {
    var name = $(this).data("name");
    gameObj.selectChampion(name);
});
//Same as above but for selectEnemy
$("#opponents").on("click", ".opponent", function () {
    var name = $(this).data("name");
    gameObj.selectEnemy(name);
});
