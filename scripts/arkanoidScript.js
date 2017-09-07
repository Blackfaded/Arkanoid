// Arkanoid by René Heinen, Denis Paris, Jan Kulisch


//initGame when the document is loaded
$(document).ready(function () {
    initGame();
});
window.addEventListener("keydown", tastendruckDown);
window.addEventListener("keyup", tastendruckUp);
var rightPressed = false;
var leftPressed = false;
var speed = 10;
var winkel;
var begin = true;
var lives = 3;
var ballspeed = 4;
var points = 0;
var levelCounter = 1;

var start;
var ball;
var slider;
var playground;
var menu;
var gamecontainer;
var levelArray;
var endscreen;
var headline;
var continueButton;
var summary;
var livesMenu;
var levelsMenu;
var pointsMenu;


function Punkt(x, y) {
    this.xPos = x;
    this.yPos = y;
}

function Area(x, y, width, height, radius, color) {
    Punkt.call(this, x, y);
    this.width = width;
    this.height = height;
    this.color = color;
    this.radius = radius;

    this.div = document.createElement("div");
    $(this.div).css("background-color", this.color);
    $(this.div).css("width", this.width);
    $(this.div).css("height", this.height);
    $(this.div).css("border-radius", this.radius);
    $(this.div).css("left", this.xPos - this.width / 2);
    $(this.div).css("top", this.yPos - this.height / 2);
    $(this.div).css("position", "absolute");
    $(this.div).css("z-index", 2);

    this.move = function (dX, dY) {
        this.xPos = this.xPos + dX;
        this.yPos = this.yPos + dY;
        $(this.div).css("left", this.xPos - this.width / 2);
        $(this.div).css("top", this.yPos - this.height / 2);
    };

    this.set = function (x, y) {
        this.xPos = x;
        this.yPos = y;
        $(this.div).css("left", this.xPos - this.width / 2);
        $(this.div).css("top", this.yPos - this.height / 2);
    }
}

Area.prototype = new Punkt();
Area.prototype.constructor = Area;

function TextArea(x, y, width, height, radius, backgroundColor, textColor, paddingTop) {
    Area.call(this, x, y, width, height, radius, backgroundColor);
    this.textColor = textColor;
    this.paddingTop = paddingTop;
    $(this.div).css("text-align", "center");
    $(this.div).css("font-family", "Verdana,sans-serif");
    $(this.div).css("font-size", "1.5rem");
    $(this.div).css("line-height", 1.5);
    $(this.div).css("padding-top", this.paddingTop);
    $(this.div).css("color", this.textColor);
    this.addText = function (text) {
        this.div.innerHTML = text;
    }
}

TextArea.prototype = new Area();
TextArea.prototype.constructor = TextArea;

function Ball(x, y, radius, color, shadow) {
    Area.call(this, x, y, 2 * radius, 2 * radius, radius, color, shadow);
    $(this.div).css("z-index", 1);
}

Ball.prototype = new Area();
Ball.prototype.constructor = Ball;

function createLevel(number) {
    begin = true;
    //remove prev blocks
    $(".blocks").remove();
    winkel = 90;
    //draw UI
    pointsMenu.addText("Punkte: " + points);
    livesMenu.addText("Bälle: " + lives);
    levelsMenu.addText("Level: " + levelCounter);
    slider.set(325, 510);
    ball.set(325, 500);
    switch (number) {
        case 1:
            levelArray = [[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                          [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
                          [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
                          [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                          [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
                          [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
                          [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
                         ];
            break;
        case 2:
            levelArray = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
                          [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
                          [0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0],
                          [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
                          [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0]
                         ];

            break;
        case 3:
            levelArray = [[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                          [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                          [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                          [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                          [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                          [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                          [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
                         ];
            break;
    }

    for (var i = 0; i < levelArray.length; i++) {
        for (var j = 0; j < levelArray[i].length; j++) {
            if (levelArray[i][j] == 1) {
                // platziert Blöcke immer mittig
                levelArray[i][j] = new Area(25 + (14 - levelArray[i].length) * 25 + j * 50, 100 + i * 15, 48, 13, 0, "#2EA300");
                $(levelArray[i][j].div).addClass("blocks");
                $(levelArray[i][j].div).css("border", "1px solid black");
                $(playground.div).append(levelArray[i][j].div);
            }
        }
    }
    clearInterval(start);
    start = setInterval(draw, speed);
}

function endLevelScreen(status) {
    begin = true;
    clearInterval(start);
    //create area, with playground size
    endscreen = new Area(playground.xPos, playground.yPos, playground.width, playground.height, 0, "#131313");
    $(gamecontainer.div).append(endscreen.div);
    $(endscreen.div).css("z-index", 4);
    headline = new TextArea(endscreen.xPos, endscreen.yPos - endscreen.height / 2 + 50, endscreen.width * 3 / 4, 50, 10, "#088A08", "#131313", 15);
    $(endscreen.div).append(headline.div);
    continueButton = document.createElement("button");
    $(continueButton).css("width", 300);
    $(continueButton).css("height", 50);
    $(continueButton).css("position", "absolute");
    $(continueButton).css("left", endscreen.xPos - 150);
    $(continueButton).css("top", endscreen.yPos + 100);
    $(endscreen.div).append(continueButton);


    switch (status) {
        case "dead":
            lives = 3;
            levelCounter = 1;
            points = 0;
            headline.addText("Leider Verloren");
            continueButton.innerHTML = "Nochmal versuchen!";
            continueButton.onclick = function () {
                createLevel(levelCounter);
                $(endscreen.div).remove();
            };
            break;
        case "won":
            //add the current used ball in the calculation
            lives++;
            summary = new TextArea(endscreen.xPos, endscreen.yPos - 60, endscreen.width / 3, endscreen.height / 4, 10, "#088A08", "#131313", 15);
            summary.addText("Punkte x Bälle: <br>" + points + " * " + lives + "<br> = " + points * lives + " Punkte");
            $(endscreen.div).append(summary.div);
            points *= (lives);
            pointsMenu.addText("Punkte: " + points);

            headline.addText("Gewonnen!");
            continueButton.innerHTML = "Nochmal spielen!";
            continueButton.onclick = function () {
                points = 0;
                lives = 3;
                levelCounter = 1;
                createLevel(levelCounter);
                $(endscreen.div).remove();
            };
            break;
    }
}

function initGame() {
    gamecontainer = new Area(400, 335, 700, 650, 0, "black");
    $("body").append(gamecontainer.div);

    menu = new Area(350, 25, 700, 50, 0, "#131313");
    $(gamecontainer.div).append(menu.div);

    livesMenu = new TextArea(menu.width / 6, menu.height / 2, menu.width / 3, menu.height, 0, menu.color, "#ddd", 5);
    livesMenu.addText("Bälle: " + lives);
    $(menu.div).append(livesMenu.div);

    levelsMenu = new TextArea(menu.width / 6 + menu.width / 3, menu.height / 2, menu.width / 3, menu.height, 0, menu.color, "#ddd", 5);
    levelsMenu.addText("Level: " + levelCounter);
    $(menu.div).append(levelsMenu.div);

    pointsMenu = new TextArea(menu.width / 6 + 2 * menu.width / 3, menu.height / 2, menu.width / 3, menu.height, 0, menu.color, "#ddd", 5);
    pointsMenu.addText("Punkte: " + points);
    $(menu.div).append(pointsMenu.div);

    playground = new Area(350, 350, 700, 600, 0, "#444");
    $(gamecontainer.div).append(playground.div);

    slider = new Area(350, 510, 100, 10, 5, "black");
    $(playground.div).append(slider.div);

    ball = new Ball(slider.xPos, slider.yPos - slider.height / 2 - 5, 5, "#ED0003");
    $(playground.div).append(ball.div);

    createLevel(levelCounter);
}

function draw() {
    //check collision
    collision(ball);
    //Check life and direction
    if (lives >= 0) {
        if (leftPressed == true && slider.xPos - slider.width / 2 > 0) {
            slider.move(-5, 0);
            if (begin) {
                ball.move(-5, 0);
            }
        }

        if (rightPressed == true && slider.xPos + slider.width / 2 < playground.width) {
            slider.move(5, 0);
            if (begin) {
                ball.move(5, 0);
            }
        }

        if (!begin) {
            // Umrechnung von Radianten in Winkel
            ball.move((Math.cos(winkel * Math.PI / 180) * ballspeed), (-Math.sin(winkel * Math.PI / 180) * ballspeed));
        }
    }

    else {
        endLevelScreen("dead");
        livesMenu.addText("Game Over");
    }
}

function collision(ball) {
    //TOP COLLISION
    if (ball.yPos - ball.radius <= 0) {
        winkel = 360 - winkel;
    }

    //SLIDER COLLISION
    if (ball.yPos + ball.radius > slider.yPos - slider.height / 2 &&
        ball.yPos - ball.radius < slider.yPos + slider.height / 2 &&
        ball.xPos >= slider.xPos - slider.width / 2 &&
        ball.xPos <= slider.xPos + slider.width / 2) {
        if (ball.xPos == slider.xPos) {
            winkel = 90;
        }
        else {
            var dif = slider.xPos - ball.xPos;
            winkel = 90 - ((-dif) / (slider.width / 2)) * 80;
        }
    }

    //SIDE COLLISION
    if (ball.xPos - ball.radius <= 0 || ball.xPos + ball.radius >= playground.width) {
        winkel = 180 - winkel;
    }

    //BOTTOM COLLISION -> Lose Life
    if (ball.yPos + ball.radius >= playground.height) {
        begin = true;
        lives--;
        livesMenu.addText("Bälle: " + lives);
        ball.set(slider.xPos, slider.yPos - slider.height / 2 - ball.radius);
        winkel = 90;
    }

    //BLOCK COLLISION
    for (var i = 0; i < levelArray.length; i++) {
        for (var j = 0; j < levelArray[i].length; j++) {
            var dX = Math.abs((ball.xPos - levelArray[i][j].xPos)) - (levelArray[i][j].width / 2);
            var dY = Math.abs((ball.yPos - levelArray[i][j].yPos)) - (levelArray[i][j].height / 2);

            //EDGE COLLISION
            if (dX > 0 && dY > 0) {
                if (Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2)) <= ball.radius) {
                    if (dX <= dY) {
                        //bottom/top collision
                        winkel = -winkel;
                        blockColHandler(i, j);
                        break;
                    }

                    else {
                        //side collision
                        winkel = 180 - winkel;
                        blockColHandler(i, j);
                        break;
                    }
                }
            }

            else if (ball.xPos + ball.radius >= levelArray[i][j].xPos - levelArray[i][j].width / 2 &&
                ball.yPos < levelArray[i][j].yPos + levelArray[i][j].height / 2 &&
                ball.yPos > levelArray[i][j].yPos - levelArray[i][j].height / 2 &&
                ball.xPos - ball.radius <= levelArray[i][j].xPos + levelArray[i][j].width / 2) {
                //pure sidecollision
                winkel = 180 - winkel;
                blockColHandler(i, j);
                break;
            }

            else if (ball.yPos + ball.radius >= levelArray[i][j].yPos - levelArray[i][j].height / 2 &&
                ball.xPos < levelArray[i][j].xPos + levelArray[i][j].width / 2 &&
                ball.xPos > levelArray[i][j].xPos - levelArray[i][j].width / 2 &&
                ball.yPos - ball.radius <= levelArray[i][j].yPos + levelArray[i][j].height / 2) {
                //pure bottom/top collision
                winkel = -winkel;
                blockColHandler(i, j);
                break;
            }
        }
    }
}

function blockColHandler(i, j) {
    //add point for hitting block
    points++;
    pointsMenu.addText("Punkte: " + points);
    //remove block 
    $(levelArray[i][j].div).remove();
    levelArray[i][j] = 0;
    //check if level is complete
    if ($(playground.div).children(".blocks").length <= 0) {

        if (levelCounter == 3) {
            endLevelScreen("won");
        }
        else {
            levelCounter++;
            createLevel(levelCounter);
        }
    }
    levelsMenu.addText("Level: " + levelCounter);
}

//KEYDOWNHANDLER
function tastendruckDown(event) {
    switch (event.keyCode) {
        //start - spacebar
        case 32:
            begin = false;
            break;

        //move - left:
        case 37:
            leftPressed = true;
            break;

        //move - right:
        case 39:
            rightPressed = true;
            break;

        //pause - down
        case 40:
            clearInterval(start);
            break;

        //unpause - up
        case 38:
            clearInterval(start);
            start = setInterval(draw, speed);
            break;
    }
}

//KEYUPHANDLER
function tastendruckUp(event) {
    switch (event.keyCode) {
        //left:
        case 37:
            leftPressed = false;
            break;

        //right:
        case 39:
            rightPressed = false;
            break;
    }
}
