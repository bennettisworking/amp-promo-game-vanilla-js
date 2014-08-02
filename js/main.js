/// CANVAS SETUP 
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 933;
canvas.height = 640;
document.body.appendChild(canvas);
//$('body').append("<div id='container'></div>");
//$('#container').css({width:canvas.width+"px",height:canvas.height+"px",marginTop:(canvas.height*-1)+"px"});
var canvasOffset = $('canvas').offset();
var canvasOffsetX = canvasOffset.left;
var canvasOffsetY = canvasOffset.top;
/// LOADER
var loadImg = new Image();
loadImg.onload = function() {
    ctx.drawImage(loadImg, 378, 304);
};
loadImg.src = "images/loading.png";
/// 
var blackstarCount = 0;
var whiteAmp = Math.floor(Math.random() * 19);
var ampDistroArray = [];
var ampsPerRound;
var roundScreenStatus;
var currentPlayerFrame = 0;
var playerFrames = 6;
var cabinetOffsetX = 200;
var cabinetOffsetY = 203;
var cabinetSize = 88;
var gamePlayStatus = false;
var ampCounter = 0;
var mouseIsDown;
var mouseDir;
var newRoundInterval;
//var textWindow=false;
var fps = 30;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;
var heroRoundSizes = new Array(123, 138);
///
///
/// IMAGES
///
///
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "images/test_bg2.jpg";
var bg2Ready = false;
var bg2Image = new Image();
bg2Image.onload = function() {
    bg2Ready = true;
};
bg2Image.src = "images/real_bg_2.jpg";
var tsReady = false;
var tsImage = new Image();
var bgImages = new Array(bgImage, bg2Image);
var inReady = false;
var inImage = new Image();
// Hero images
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
    heroReady = true;
};
heroImage.src = "sprites/testrun3.png";
var heroReady2 = false;
var heroImage2 = new Image();
heroImage2.onload = function() {
    heroReady2 = true;
};
heroImage2.src = "sprites/brianspritesheet.png";
var heroImageArray = new Array(heroImage, heroImage2);
// amp images
var ampImageArray = [];
var ampTimer = 0;
var currentAmp = 0;
var ampInterval;
var ampArray = [];
var ampReady = false;
var ampImage = new Image();
ampImage.onload = function() {
    ampReady = true;
    //ampImageArray.push(this);
};
ampImage.src = "sprites/ampexplosion2.png";
var ampImage2 = new Image();
ampImage2.onload = function() {
    //ampImageArray.push(this);
};
ampImage2.src = "sprites/ampexplosion5.png";
var ampImage3 = new Image();
ampImage3.onload = function() {
    //ampImageArray.push(this);
};
ampImage3.src = "sprites/ampexplosion3.png";
var ampImage4 = new Image();
ampImage4.onload = function() {
    //ampImageArray.push(this);
};
ampImage4.src = "sprites/ampexplosion4.png";
ampImageArray.push(ampImage, ampImage2, ampImage3, ampImage4);
// Bullet image
var currentBullet = 0;
var bulletArray = [];
var fireReady = true;
var bulletReady = false;
var bulletImage = new Image();
bulletImage.onload = function() {
    bulletReady = true;
};
bulletImage.src = "images/icebullet2.gif";
var cabinetArray = [];
var cabinetImageArray = [];
var cabinetImage = new Image();
cabinetImage.onload = function() {
    cabinetImageArray.push(this);
};
cabinetImage.src = "sprites/cabinet_sprite.jpg";
var roundscreenReady = false;
var roundscreenImage = new Image();
roundscreenImage.onload = function() {
    roundscreenReady = true;
};
roundscreenImage.src = "images/round_overlay.png";
var scoreImageReady = false;
var scoreImg = new Image();
scoreImg.onload = function() {
    scoreImageReady = true;
};
scoreImg.src = "images/score_bar.png";
var shadowImageReady = false;
var shadowImg = new Image();
shadowImg.onload = function() {
    shadowImageReady = true;
};
shadowImg.src = "images/shadow.png";
var blogoReady = false;
var blogo = new Image();
blogo.onload = function() {
    blogoReady = true;
};
blogo.src = "images/blogo.png";
///   GAME OBJECTS
var hero = {
    speed: 384,
    // pixels per second for now
    firing: false,
    firingFrame: 0,
    catching: false,
    catchingFrame: 0,
    colliding: false,
    collideFrame: 0,
    collideComplete: false,
    direction: 0,
    source: heroImage
};

function amp() {}

function bullet() {}

function cabinet() {}
var textItem = {
    interval: 10,
    fading: false,
    showing: false,
    counter: 0,
    text: ""
};
for (var cz = 0; cz < 18; cz++) {
    var c = new cabinet();
    var cx = Math.floor(cz / 6);
    var cc = cz - (6 * cx);
    c.x = cabinetOffsetX + (cc * (cabinetSize + 2));
    c.y = cabinetOffsetY + (cx * (cabinetSize + 2));
    c.currentFrame = 0;
    cabinetArray.push(c);
}
// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);
// Reset hero x and y
var reset = function() {
    hero.x = canvas.width / 2;
    hero.y = canvas.height * 0.78;
};
var score = {
    width: 331,
    height: 22,
    top: 615,
    left: 0,
    turns: 3,
    ampsCaught: 0,
    currentRound: 2,
    score: 0
        //image:scoreImg
};
score.left = canvas.width - score.width;
/// AUDIO
var explosionSound = new Audio("mp3/explosion.wav");
explosionSound.volume = 0.7;
explosionSound.load();
var whooshSound = new Audio("mp3/whoosh.wav");
whooshSound.volume = 0.5;
whooshSound.load();
var booSound = new Audio("mp3/explosionboo.wav");
booSound.volume = 0.4;
booSound.load();
var ampwhooshSound = new Audio("mp3/ampwhoosh.wav");
ampwhooshSound.volume = 0.5;
ampwhooshSound.load();
var descendentsSong = new Audio("mp3/descendents.mp3");
descendentsSong.volume = 0.5;
descendentsSong.load();
var fxArray = new Array(explosionSound, whooshSound, booSound, ampwhooshSound);
var songArray = new Array(descendentsSong);
///
//////////////////
///
///  UPDATE
///
//////////////////
var update = function(modifier) {
    if (gamePlayStatus) {
        var tl = mouseIsDown && mouseDir == 1;
        var tr = mouseIsDown && mouseDir == 2;
        if (32 in keysDown && fireReady && !hero.colliding) { // Player holding up
            fireReady = false;
            setTimeout(function() {
                    fireReady = true;
                }, 400);
                //hero.y -= hero.speed * modifier;
            fireBullet();
        }
        // if (40 in keysDown) { // Player holding down
        // hero.y += hero.speed * modifier;
        // }
        hero.direction = 0;
        if ((tl || 37 in keysDown) && !hero.colliding) { // Player holding left
            hero.direction = 1;
            hero.x -= hero.speed * modifier;
        }
        if (tr || 39 in keysDown && !hero.colliding) { // Player holding right
            hero.direction = 2;
            hero.x += hero.speed * modifier;
        }
        var moddy = 0.8 * (ampCounter / ampsPerRound);
        //alert(ampCounter);
        ampTimer = ampTimer + (1 + moddy);
        if (ampTimer > 70 && currentAmp > -1) {
            if (currentAmp >= ampsPerRound && !hero.colliding) {
                currentAmp = -1;
                newRoundInterval = setTimeout(function() {
                    gamePlayStatus = false;
                    roundOver();
                }, 3000);
            } else {
                ampTimer = 0;
                ampy();
            }
        }
        //Bullet loop
        for (var bloop = 0; bloop < bulletArray.length; bloop++) {
            bulletArray[bloop].y -= 20;
            if (bulletArray[bloop].y < 0) {
                bulletArray.splice(bloop, 1);
            }
        }
        //Amp update loop
        for (var aloop = 0; aloop < ampArray.length; aloop++) {
            if (!ampArray[aloop].explode) {
                var ah = 0;
                if (ampArray[aloop].y > 0) {
                    ah = ampArray[aloop].y;
                }
                ampArray[aloop].y += Math.round(5 + (ah * 0.015));
                ampArray[aloop].x += Math.round((ampArray[aloop].y + 80) /
                    100 * ampArray[aloop].p);
                if (ampArray[aloop].x < canvas.width / 8) {
                    ampArray[aloop].p = -ampArray[aloop].p;
                }
                if (ampArray[aloop].x > (canvas.width / 8) * 7) {
                    ampArray[aloop].p = -ampArray[aloop].p;
                }
            }
            if (ampArray[aloop].y > (canvas.height * 0.88)) {
                if (ampArray[aloop].blackstar && !ampArray[aloop].explode) {
                    ampArray[aloop].completed = true;
                    //score.ampsCaught++;
                    //fxArray[3].play();
                    //placeCabinet();
                }
                ampArray[aloop].explode = true;
                //fxArray[2].play();
                //ampArray.splice(aloop, 1);
            }
            if (ampArray[aloop].remove) {
                ampArray.splice(aloop, 1);
            }
        }
        handleCollisions();
    }
};
/////////////
///
///  RENDER
///
/////////////
var render = function() {
    hero.width = 80;
    var evenRound = 1 - (score.currentRound - Math.floor(score.currentRound /
        2) * 2);
    hero.height = heroRoundSizes[evenRound]; //    
    hero.source = heroImageArray[evenRound];
    var vh = 18 - (138 - hero.height);
    hero.y = (canvas.height * 0.78) - vh;
    if (bgReady) {
        ctx.drawImage(bgImages[score.currentRound - 1], 0, 0);
    }
    //cabs
    if (!hero.colliding) {
        for (var cc = 0; cc < score.ampsCaught; cc++) {
            //setTimeout(function(){},500)
            var ccf = Math.floor(cabinetArray[cc].currentFrame);
            ctx.drawImage(cabinetImageArray[0], (cabinetSize * ccf), 0,
                cabinetSize, cabinetSize, cabinetArray[cc].x,
                cabinetArray[cc].y, cabinetSize, cabinetSize);
            cabinetArray[cc].currentFrame += 0.25;
            if (cabinetArray[cc].currentFrame > 3) {
                cabinetArray[cc].currentFrame = 3;
            }
        }
    }
    if (heroReady) {
        var fl = Math.floor(currentPlayerFrame);
        if (hero.colliding) {
            var corl = Math.floor(hero.collideFrame);
            ctx.drawImage(shadowImg, hero.x, 590);
            ctx.drawImage(hero.source, hero.width * corl, 4 * hero.height,
                hero.width, hero.height, hero.x, hero.y, hero.width,
                hero.height);
            hero.collideFrame += 0.75;
            if (hero.collideFrame == playerFrames) {
                hero.collideFrame = 0;
                //hero.colliding=false;
                if (!hero.collideComplete) {
                    setTimeout(function() {
                        endTurn();
                    }, 2000);
                    hero.collideComplete = true;
                }
            }
        } else if (hero.direction > 0) {
            var m = 0;
            if (hero.direction == 1) {
                m = hero.height;
            }
            ctx.drawImage(shadowImg, hero.x, 590);
            ctx.drawImage(hero.source, hero.width * fl, m, hero.width, hero
                .height, hero.x, hero.y, hero.width, hero.height);
            currentPlayerFrame += 0.50;
            if (currentPlayerFrame == playerFrames) {
                currentPlayerFrame = 0;
            }
        } else if (hero.firing) {
            var frl = Math.floor(hero.firingFrame);
            ctx.drawImage(shadowImg, hero.x, 590);
            ctx.drawImage(hero.source, hero.width * frl, 2 * hero.height,
                hero.width, hero.height, hero.x, hero.y, hero.width,
                hero.height);
            hero.firingFrame += 0.60;
            if (hero.firingFrame >= playerFrames) {
                hero.firingFrame = 0;
                hero.firing = false;
            }
        } else if (hero.catching) {
            var crl = Math.floor(hero.catchingFrame);
            ctx.drawImage(shadowImg, hero.x, 590);
            ctx.drawImage(hero.source, hero.width * crl, 3 * hero.height,
                hero.width, hero.height, hero.x, hero.y, hero.width,
                hero.height);
            hero.catchingFrame += 0.75;
            if (hero.catchingFrame == playerFrames) {
                hero.catchingFrame = 0;
                hero.catching = false;
            }
        } else {
            ctx.drawImage(shadowImg, hero.x, 590);
            ctx.drawImage(hero.source, 0, 2 * hero.height, hero.width, hero
                .height, hero.x, hero.y, hero.width, hero.height);
        }
    }
    if (!hero.colliding) {
        if (ampReady) {
            if (ampArray.length > 0) {
                for (var ac = 0; ac < ampArray.length; ac++) {
                    var bsMod;
                    bsMod = 0;
                    var sn = 0;
                    if (ampArray[ac].blackstar && ampArray[ac].completed) {
                        sn = 2;
                    } // else 
                    if (ampArray[ac].blackstar) {
                        if (ampArray[ac].white) {
                            bsMod = 1;
                        } else {
                            bsMod = 2;
                        }
                    } else {
                        if (ampArray[ac].style == 1) {
                            bsMod = 3;
                        }
                    }
                    if (!ampArray[ac].explode) {
                        //ctx.save();
                        //ctx.rotate(ampArray[ac].y/600);
                        ctx.drawImage(ampImageArray[bsMod], 0, 0, 60, 60,
                            ampArray[ac].x, ampArray[ac].y, 60, 60);
                        var value = ampArray[ac].y / 600;
                        value = value < 0 ? 0 : value;
                        ctx.globalAlpha = value;
                        ctx.drawImage(shadowImg, ampArray[ac].x, 590);
                        ctx.globalAlpha = 1;
                        //ctx.restore();
                    } else {
                        fxArray[sn].play();
                        var cfl = Math.floor(ampArray[ac].currentFrame);
                        ctx.drawImage(ampImageArray[bsMod], (60 * cfl), 0,
                            60, 60, ampArray[ac].x, ampArray[ac].y, 60,
                            60);
                        ampArray[ac].currentFrame += 0.5;
                        if (ampArray[ac].currentFrame > 15) {
                            ampArray[ac].currentFrame = 15;
                            ampArray[ac].remove = true;
                        }
                    }
                }
            }
        }
        if (blogoReady) {
            ctx.drawImage(blogo, 15, 15);
        }
    }
    // SCORE
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = "20px Abel";
    ctx.textAlign = 'left';
    //ctx.textBaseline = "top";
    //ctx.fillRect(score.left,score.top,score.width,score.height);
    if (scoreImageReady) {
        ctx.drawImage(scoreImg, score.left, score.top);
    }
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText(score.score, score.left + 51, score.top + 18);
    ctx.fillText(score.currentRound, score.left + 157, score.top + 18);
    ctx.fillText(score.ampsCaught, score.left + 221, score.top + 18);
    ctx.fillText(score.turns, score.left + 310, score.top + 18);
    if (bulletReady) {
        if (bulletArray.length > 0) {
            for (var ba = 0; ba < bulletArray.length; ba++) {
                ctx.drawImage(bulletImage, bulletArray[ba].x, bulletArray[
                    ba].y);
            }
        }
    }
    if (textItem.showing) {
        //alert("meow");
        var al = 1;
        if (textItem.fading) {
            al = 1 - textItem.counter;
            textItem.counter += 0.05;
            if (textItem.counter >= 1) {
                textItem.fading = false;
                textItem.showing = false;
                textItem.counter = 0;
                if (score.turns > 0) {
                    gamePlayStatus = true;
                }
            }
        }
        ctx.fillStyle = "rgba(255,255,255," + al + ")";
        ctx.font = "52px Abel";
        ctx.textAlign = 'center';
        ctx.shadowColor = "black";
        ctx.shadowBlur = 6;
        ctx.strokeText(textItem.text, canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0;
        ctx.fillText(textItem.text, canvas.width / 2, canvas.height / 2);
    }
};
///
///
///
///
///
var ampy = function() {
    var cw = Math.round(canvas.width / 8);
    var aa = new amp();
    aa.y = -80;
    aa.x = cw + Math.round((Math.random() * (canvas.width - (cw * 2))));
    aa.p = 1 - (Math.random() * 2);
    aa.currentFrame = 0;
    aa.explode = false;
    aa.remove = false;
    aa.style = Math.floor(Math.random() * 2);
    aa.width = 70;
    aa.height = 70;
    aa.white = false;
    aa.blackstar = ampDistroArray[currentAmp];
    if (aa.blackstar) {
        if (whiteAmp == blackstarCount) {
            aa.white = true;
        } else {
            //whiteStatus=false;
        }
        blackstarCount++;
    }
    aa.completed = false;
    ampArray.push(aa);
    currentAmp++;
    if (currentAmp == ampsPerRound) {
        //
    }
    ampCounter++;
};
var endTurn = function() {
    score.turns -= 1;
    shuffle(ampDistroArray);
    hero.firing = false;
    hero.catching = false;
    hero.catchingFrame = 0, hero.colliding = false;
    hero.collideFrame = 0;
    hero.collideComplete = false;
    blackstarCount = 0;
    ampArray = [];
    bulletArray = [];
    score.ampsCaught = 0;
    ampCounter = 0;
    currentAmp = 0;
    if (score.turns === 0) {
        pauseText("GAME OVER");
    } else {
        pauseText("GET READY!");
    }
    //reset();
};
var roundOver = function() {
    shuffle(ampDistroArray);
    hero.firing = false;
    hero.catching = false;
    hero.catchingFrame = 0, hero.colliding = false;
    hero.collideFrame = 0;
    hero.collideComplete = false;
    blackstarCount = 0;
    ampArray = [];
    bulletArray = [];
    score.ampsCaught = 0;
    ampCounter = 0;
    currentAmp = 0;
    score.currentRound++;
    //pauseText("NEXT ROUND<br>GET READY!");
    //then = Date.now();
    reset();
    roundScreen();
};

function handleCollisions() {
    if (!hero.colliding) {
        ampArray.forEach(function(e) {
            bulletArray.forEach(function(b) {
                if (collision(b.x + (b.width / 2), b.y + (b
                        .height / 2), b.width / 2, e.x +
                    (e.width / 2), e.y + (e.height / 2),
                    e.width / 2)) {
                    e.explode = true;
                    removeFromArray(b, bulletArray);
                    var a = 0;
                    if (e.blackstar) {
                        a = 2;
                    } else {
                        score.score += 100;
                    }
                    fxArray[a].play();
                    //   alert("meow");
                    //   //bullet.active = false;
                }
            });
            if (collision(hero.x + (70 / 2), hero.y + (70 / 2), 70 /
                2, e.x + (e.width / 2), e.y + (e.height / 2), e
                .width / 2)) {
                if (e.blackstar) {
                    hero.catching = true;
                    score.ampsCaught++;
                    if (!e.white) {
                        score.score += (score.ampsCaught + 1) * 50;
                    } else {
                        score.score += (score.ampsCaught + 1) * 100;
                    }
                    fxArray[3].play();
                    removeFromArray(e, ampArray);
                } else if (!e.explosion) {
                    hero.colliding = true;
                    clearInterval(newRoundInterval);
                    fxArray[0].play();
                }
            }
        });
    }
}
var fireBullet = function() {
    //alert("fire");
    fxArray[1].play();
    var bb = new bullet();
    bb.x = (hero.x + 35);
    bb.y = hero.y + 28;
    bb.width = 16;
    bb.height = 16;
    bulletArray.push(bb);
    //bulletArray[currentBullet].x=(hero.x+35);
    //bulletArray[currentBullet].y=hero.y+20;
    currentBullet++;
    hero.firing = true;
    //tiles.push(imageObj);
};
var collision = function(x1, y1, size1, x2, y2, size2) {
    var bottom1, bottom2, left1, left2, right1, right2, top1, top2;
    left1 = x1 - size1;
    right1 = x1 + size1;
    top1 = y1 - size1;
    bottom1 = y1 + size1;
    left2 = x2 - size2;
    right2 = x2 + size2;
    top2 = y2 - size2;
    bottom2 = y2 + size2;
    return !(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 >
        bottom1);
};
var shuffle = function(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};
for (var c = 0; c < 6; c++) {
    ampDistroArray.push(true, true, true, false, false, false, false, false);
}
shuffle(ampDistroArray);
ampsPerRound = ampDistroArray.length;
var removeFromArray = function(it, ar) {
    var p = $.inArray(it, ar);
    if (p !== -1) {
        ar.splice(p, 1);
    }
};
var main = function() {
    songArray[0].play();
    //var now = Date.now();
    //var delta = now - then;
    //then = now;
    // Request to do this again ASAP
    //if(gamePlayStatus)
    requestAnimationFrame(main);
    now = Date.now();
    delta = now - then;
    if (delta > interval) {
        // update time stuffs
        // Just `then = now` is not enough.
        // Lets say we set fps at 10 which means
        // each frame must take 100ms
        // Now frame executes in 16ms (60fps) so
        // the loop iterates 7 times (16*7 = 112ms) until
        // delta > interval === true
        // Eventually this lowers down the FPS as
        // 112*10 = 1120ms (NOT 1000ms).
        // So we have to get rid of that extra 12ms
        // by subtracting delta (112) % interval (100).
        // Hope that makes sense.
        then = now - (delta % interval);
        update(delta / 1000);
        if (!roundScreenStatus) {
            render();
        }
    }
};
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame ||
    w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// Let's play this game!
var gameStart = function() {
    then = Date.now();
    reset();
    //main();
    roundScreen();
    if (device.tablet() || device.mobile()) {
        $('body').append(
            '<div id="bl" class="button left" ontouchstart="buttonDown(0)" ontouchend="buttonUp(0)"></div><div id="br" class="button right" ontouchstart="buttonDown(1)" ontouchend="buttonUp(1)"></div>'
        );
        $('body').append(
            '<div id="fbl" class="firebutton left" ontouchstart="fireBullet()"></div><div id="fbr" class="firebutton right" ontouchstart="fireBullet()"></div>'
        );
        $('#bl').css({
            left: (canvasOffsetX + 20) + "px"
        });
        $('#br').css({
            left: (canvasOffsetX + canvas.width - 120) + "px"
        });
    }
    gameStart = false;
};
var pauseText = function(z) {
    gamePlayStatus = false;
    textItem.text = z;
    textItem.showing = true;
    textItem.fading = false;
    textItem.counter = 0;
    setTimeout(function() {
        textItem.fading = true;
    }, 2000);
};
var roundScreen = function() {
    var a = 0;
    roundScreenStatus = true;
    ctx.drawImage(bgImages[score.currentRound - 1], 0, 0);
    ctx.drawImage(roundscreenImage, 0, 0);
    $('body').keyup(function() {
        roundScreenStatus = false;
        $('body').unbind('keyup');
        $('body').unbind('click');
        pauseText('GET READY!');
        main();
    });
    if (device.tablet()) {
        $('body').click(function() {
            //if(a>0){
            roundScreenStatus = false;
            $('body').unbind('click');
            $('body').unbind('keyup');
            //alert("key");
            pauseText('GET READY!');
            main();
            ///}else{
            //	a++;
            //}
            //songArray[0].play();
        });
    }
};
var instructionScreen = function() {
    canvas.onmousedown = null;
    canvas.onmouseup = null;
    canvas.onmouseover = null;
    canvas.onmouseout = null;
    ctx.drawImage(bgImages[score.currentRound - 1], 0, 0);
    inImage.onload = function() {
        inReady = true;
        ctx.drawImage(inImage, 0, 0);
    };
    inImage.src = "images/instructions.png";
    $('body').keyup(function(e) {
        $('body').unbind('keyup');
        gameStart();
    });
};
var titleScreen = function() {
    tsImage.onload = function() {
        tsReady = true;
        ctx.drawImage(tsImage, 0, 0);
        ctx.fillStyle = "#fabe28";
        ctx.fillRect(641, 547, 266, 69);
        ctx.font = "32px Abel";
        ctx.fillStyle = "#000000";
        ctx.textAlign = 'center';
        buttonText();
    };
    tsImage.src = "images/title.jpg";
    canvas.onmouseup = function(e) {
        instructionScreen();
        //gameStart();
    };
    canvas.onmouseover = function(e) {
        ctx.fillStyle = "#ffde42";
        ctx.fillRect(641, 547, 266, 69);
        buttonText();
    };
    canvas.onmouseout = function(e) {
        ctx.fillStyle = "#fabe28";
        ctx.fillRect(641, 547, 266, 69);
        buttonText();
    };
};

function buttonText() {
    ctx.fillStyle = "#000000";
    ctx.strokeText("CLICK TO BEGIN", 774, 590);
    ctx.fillText("CLICK TO BEGIN", 774, 590);
}

function buttonDown(e) {
    if (e === 0) {
        mouseIsDown = true;
        mouseDir = 1;
    } else {
        mouseIsDown = true;
        mouseDir = 2;
    }
}

function buttonUp(e) {
    if (e === 0) {
        mouseIsDown = false; //mouseDir=1;}
    } else {
        mouseIsDown = false; //mouseDir=2;}
    }
}
window.onload = function() {
    $(document).bind('touchmove', false);
    titleScreen();
};