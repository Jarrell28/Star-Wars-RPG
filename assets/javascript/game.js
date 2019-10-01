var gameObj = {
    fighting: false,
    characters: [
        {
            name: "Obi-Wan Kenobi",
            HP: 120,
            BP: 8,
            AP: 8,
            CP: 10,
            img: "assets/images/obi-wan.jpg"
        },
        {
            name: "Luke Skywalker",
            HP: 100,
            BP: 16,
            AP: 16,
            CP: 5,
            img: "assets/images/luke-skywalker.jpg"
        },
        {
            name: "Darth Sidious",
            HP: 150,
            BP: 6,
            AP: 6,
            CP: 20,
            img: "assets/images/darth-sidious.jpg"
        },
        {
            name: "Darth Maul",
            HP: 180,
            BP: 4,
            AP: 4,
            CP: 25,
            img: "assets/images/darth-maul.jpg"
        },

    ],
    champion: {},
    enemy: {},
    opponents: 0,

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
                //Assigns selected character object to gameObj champion object
                gameObj.champion = Object.assign({}, characterObj[0]);
            }
            //Else just moves character to the opponents section and removes it from champion select section
            //increments opponents by 1
            else {
                $("#opponents").append(`<div class="col-sm-3 opponent my-2" data-name="${characterObj[0].name}" style="background-image: linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,.5)), url('${characterObj[0].img}')"><p>${characterObj[0].name}</p><p>${characterObj[0].HP}</p></div>`);
                $(this).remove();
                gameObj.opponents++;
            }
        });

        $("#character-h2").hide();
        $("#opponents-h2").show();
        $("#champion-h2").show();

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
                    //Assigns selected opponent object to gameObj enemy object
                    gameObj.enemy = Object.assign({}, characterObj[0]);
                    $("#combat-text").html("<p>Enemy Selected, Fight!</p>");

                    //If there is only 1 opponent left, it hides the opponents text
                    if (gameObj.opponents === 1) {
                        $("#opponents-h2").hide();
                    }
                }
            });

            //Sets fighting to true because both champion and enemy have been selected
            this.fighting = true;
            $("#attack").show();
        }

        $("#enemy-h2").show();

    },

    //Function to simulate characters attacking and checks who dies
    attackEnemy: function () {

        //If there is no enemy selected prevents from attacking
        if ($.isEmptyObject(this.enemy)) {
            $("#combat-text").text("No enemy to attack");
        } else {
            //Simulates attack subtracting enemy health
            this.enemy.HP -= this.champion.AP;

            //Enemy didn't survive champion attack
            if (this.enemy.HP <= 0) {
                this.enemy.HP = 0;
                $("#enemy-hp").text(this.enemy.HP);
                $("#combat-text").html("<p>You defeated your enemy! Select another enemy to continue!</p>");
                this.fighting = false;
                //clears current enemy object
                this.enemy = {};
                $("#attack").hide();
                //Subtracts remaining opponents
                this.opponents--;
                //Increases champion attack power by base power
                this.champion.AP += this.champion.BP;

                //If there are no opponents left, ends game, prompts play again
                if (this.opponents === 0) {
                    $("#combat-text").html("<p>You have defeated all of your enemies!</p>");
                    $("#play-again").show();
                    $("#attack").hide();

                }

            }

            //Enemy survives champion attack
            else if (this.enemy.HP > 0) {
                this.champion.HP -= this.enemy.CP;
                $("#enemy-hp").text(this.enemy.HP);

                //Champion survives enemy attack
                if (this.champion.HP > 0) {
                    $("#combat-text").html(`<p>You attacked the enemy with ${this.champion.AP} Attack Power</p><p>The enemy counter attacked you with ${this.enemy.CP} Attack Power</p>`);
                    $("#champion-hp").text(this.champion.HP);
                    //Increases champion attack power by base power
                    this.champion.AP += this.champion.BP;
                }

                //Champion dies from enemy attack
                else if (this.champion.HP <= 0) {
                    this.champion.HP = 0;
                    $("#champion-hp").text(this.champion.HP);
                    $("#combat-text").html("<p>You lost!</p>");
                    $("#play-again").show();
                    $("#attack").hide();
                }
            }

        }
    },

    //Game reset
    resetGame: function () {
        this.champion = {};
        this.enemy = {};
        this.opponents = 0;
        $("#champion").html("");
        $("#opponents").html("");
        $("#enemy").html("");
        $("#combat-text").html("");
        this.fighting = false;
        this.displayCharacters();
        $("#play-again").hide();
        $("#attack").hide();
        $("#character-h2").show();
        $("#opponents-h2").hide();
        $("#champion-h2").hide();
        $("#enemy-h2").hide();
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