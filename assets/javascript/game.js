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
    fighting: false,
    characters: [
        {
            name: "Obi-Wan Kenobi",
            HP: 120,
            BP: 8,
            AP: 8,
            CP: 25,
            img: "assets/images/obi-wan.jpg"
        },
        {
            name: "Luke Skywalker",
            HP: 100,
            BP: 8,
            AP: 8,
            CP: 25,
            img: "assets/images/luke-skywalker.jpg"
        },
        {
            name: "Darth Sidious",
            HP: 150,
            BP: 8,
            AP: 8,
            CP: 25,
            img: "assets/images/darth-sidious.jpg"
        },
        {
            name: "Darth Maul",
            HP: 180,
            BP: 8,
            AP: 8,
            CP: 25,
            img: "assets/images/darth-maul.jpg"
        },

    ],
    champion: {},
    enemy: {},

    //Loops over character array objects and creates html elements for each
    displayCharacters: function () {
        this.characters.forEach(function (character) {
            $("#characters").append(`<div class="col-sm-3 character my-2" data-name="${character.name}" style="background-image: linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${character.img}')"><p>${character.name}</p><p>${character.HP}</p></div>`);
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
                $("#champion").append(`<div class="col-sm-3 my-2" id="champion-character" data-name="${characterObj[0].name}"  style="background-image: linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${characterObj[0].img}')"><p>${characterObj[0].name}</p><p id="champion-hp">${characterObj[0].HP}</p></div>`);
                $(this).remove();
                gameObj.champion = Object.assign({}, characterObj[0]);
            }
            //Else just moves character to the opponents section and removes it from champion select section
            else {
                $("#opponents").append(`<div class="col-sm-3 opponent my-2" data-name="${characterObj[0].name}" style="background-image: linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${characterObj[0].img}')"><p>${characterObj[0].name}</p><p>${characterObj[0].HP}</p></div>`);
                $(this).remove();
            }
        });

    },

    //Pretty much same as selectChampion except it is selecting the Enemy and adding it to enemy object
    selectEnemy: function (name) {

        //If champion and enemy are not fighting, allows to choose enemy
        if (this.fighting === false) {
            $(".opponent").each(function () {
                var opponentName = $(this).data("name");
                var characterObj = gameObj.characters.filter(function (character) {
                    return character.name === opponentName;
                });

                if (opponentName === name) {
                    $("#enemy").html(`<div class="col-sm-3 my-2" id="enemy-character" data-name="${characterObj[0].name}" style="background-image: linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${characterObj[0].img}')"><p>${characterObj[0].name}</p><p id="enemy-hp">${characterObj[0].HP}</p></div>`);
                    $(this).remove();
                    gameObj.enemy = Object.assign({}, characterObj[0]);
                }
            });

            //Sets fighting to true because both champion and enemy have been selected
            this.fighting = true;
            $("#attack").show();
        }

    },

    //Function to simulate characters attacking and checks who dies
    attackEnemy: function () {

        //If there is no enemy selected prevents from attacking
        if ($.isEmptyObject(this.enemy)) {
            $("#combat-text").text("No enemy to attack");
        } else {
            //Simulates attack subtracting champion and enemy Health
            this.enemy.HP -= this.champion.AP;
            this.champion.HP -= this.enemy.CP;

            //If champion and enemy are still alive, updates Health and displays combat damage done
            if (this.champion.HP > 0 && this.enemy.HP > 0) {
                $("#combat-text").html(`<p>You attacked the enemy with ${this.champion.AP} Attack Power</p><p>The enemy counter attacked you with ${this.enemy.CP} Attack Power</p>`);
                $("#champion-hp").text(this.champion.HP);
                $("#enemy-hp").text(this.enemy.HP);
                this.champion.AP += this.champion.BP;
            }

            //If champion and enemy die, updates Health and displays both died message, also shows play again button and hides attack button
            else if (this.champion.HP <= 0 && this.enemy.HP <= 0) {
                this.champion.HP = 0;
                this.enemy.HP = 0;
                $("#champion-hp").text(this.champion.HP);
                $("#enemy-hp").text(this.enemy.HP);
                $("#combat-text").html("<p>You both died!</p>");
                $("#play-again").show();
                $("#attack").hide();
            }

            //If champion dies, shows you lost message, updates health
            else if (this.champion.HP <= 0) {
                this.champion.HP = 0;
                $("#champion-hp").text(this.champion.HP);
                $("#enemy-hp").text(this.enemy.HP);
                $("#combat-text").html("<p>You lost!</p>");
                $("#play-again").show();
                $("#attack").hide();
            }

            //If enemy dies, updates Health, shows win message and enables you to select another enemy 
            else if (this.enemy.HP <= 0) {
                this.enemy.HP = 0;
                $("#champion-hp").text(this.champion.HP);
                $("#enemy-hp").text(this.enemy.HP);
                $("#combat-text").html("<p>You defeated your enemy! Select another enemy to continue!</p>");
                this.fighting = false;
                this.enemy = {};
                $("#attack").hide();
            }

        }
    },

    //Game reset
    resetGame: function () {
        this.champion = {};
        this.enemy = {};
        $("#champion").html("");
        $("#opponents").html("");
        $("#enemy").html("");
        $("#combat-text").html("");
        this.fighting = false;
        this.displayCharacters();
        $("#play-again").hide();
        $("#attack").hide();
    }
}

//Displays character when window loads
$(document).ready(function () {
    gameObj.displayCharacters();
})

//When clicking, gets character name via data-name attribute and calls selectChampion function passing the name
$("#characters").on("click", ".character", function () {
    var name = $(this).data("name");
    gameObj.selectChampion(name);
});
//Same as above but for selectEnemy
$("#opponents").on("click", ".opponent", function () {
    var name = $(this).data("name");
    gameObj.selectEnemy(name);
});

//When clicking attack button, calls attackEnemy function
$("#attack").on("click", function () {
    gameObj.attackEnemy();
});

//When clicking play again, resets game and displays characters
$("#play-again").on("click", function () {
    gameObj.resetGame();
});