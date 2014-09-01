
Image.prototype.ready=function(){
    if (this.complete) {
        return false;
    }
    if (typeof this.naturalWidth !== "undefined" && this.naturalWidth === 0) {
        return false;
    }
    return true;

}

Image.prototype.drawThis=function(x,y){
    ctx.drawImage(this, x, y);
}

Audio.prototype.setup=function(v){
    this.volume = v;
    this.load();
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame ||
    w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


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
    this.drawThis(378, 304);
};
loadImg.src = "images/loading.png";

/////////////////////////////////////////////////// 

var whiteAmp = Math.floor(Math.random() * 19);
var ampDistroArray = [];
var ampsPerRound;
var cabinetArray = [];
var cabinetOffsetX = 200;
var cabinetOffsetY = 203;
var cabinetSize = 88;

var mouseIsDown;
var mouseDir;
var newRoundInterval;
//var textWindow=false;

var redirects=new Array("index.html","contest.html");
var tabPrefix="";
if(device.tablet()){
    tabPrefix="x";
}

var touches=0;
var ampImageArray = [];
var ampTimer = 0;

var ampArray = [];





// Image.prototype.onload=function(){
//     alert("meow");
//         this.ready=true;
    
// }

///
///   GAME OBJECTS
///
function TitleScreen(){
    this.tsImage=new Image();
    var s=this;
    this.tsImage.onload = function() {
        ctx.drawImage(this, 0, 0);
        ctx.fillStyle = "#fabe28";
        ctx.fillRect(641, 547, 266, 69);
        ctx.font = "36px Squarefont";
        ctx.fillStyle = "#000000";
        ctx.textAlign = 'center';
        s.buttonText();
    };
    this.tsImage.src = "images/title.jpg";
}

TitleScreen.prototype.buttonText=function() {
    //ctx.fillStyle = "#000000";
    //ctx.strokeText("CLICK TO BEGIN", 774, 590);
    //ctx.fillText("CLICK TO BEGIN", 774, 590);
    var tstextImage=new Image();
    tstextImage.src = "images/clickbegin.png";
    tstextImage.onload=function(){
        this.drawThis(641,547);
    }
}

function InstructionScreen(){
    var inImage=new Image();
    ctx.drawImage(bgImages[score.currentRound - 1], 0, 0);
    inImage.onload = function() {
        this.drawThis(0, 0);
    };
    inImage.src = "images/instructions"+tabPrefix+".png";
    
}
    // if(device.tablet()){
    
        
    //     $('body').unbind('click');
    //     $('body').unbind('keyup');
    

 

 
};
}

function Game(){
    this.playStatus=false;
    this.roundScreenStatus=false;
    this.fireReady=true;
    this.walkReady=true;
    this.currentBullet= 0;
    this.ampInterval=0;
    this.currentAmp= 0;
    this.bulletArray=[];
    this.then=Date.now();
    this.now;
    this.fps=30;
    this.interval=1000 / this.fps;
    this.delta;
}

Game.prototype.startGame=function(){
    this.then = Date.now();
    guitarist.reset();
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
}

Game.prototype.main = function() {
    //songArray[0].play();
    var self=this;
    requestAnimationFrame(function(){
        self.main();
    });
    this.now = Date.now();
    this.delta = this.now - this.then;
    if (this.delta > this.interval) {
        this.then = this.now - (this.delta % this.interval);
        update(this.delta / 1000);
        if (!this.roundScreenStatus) {
            render();
        }
    }
};

Game.prototype.titleScreen = function() {
    this.titleScreen=new TitleScreen();
    var self=this;
    canvas.onmouseup = function(e) {
        instructionScreen();
        //gameStart();
    };
    canvas.onmouseover = function(e) {
        ctx.fillStyle = "#ffde42";
        ctx.fillRect(641, 547, 266, 69);
        self.titleScreen.buttonText();
    };
    canvas.onmouseout = function(e) {
        ctx.fillStyle = "#fabe28";
        ctx.fillRect(641, 547, 266, 69);
        self.titleScreen.buttonText();
    };


};

Game.prototype.fireSequence=function(){
     this.fireReady = false;
     this.walkReady=false;
     var self=this;
        var fr = setTimeout(function() {
                self.fireReady = true;
                }, 400);
        var wr = setTimeout(function() {
               self.walkReady = true;
                }, 280);
                //guitarist.y -= guitarist.speed * modifier;
    var bb = new Bullet();
    bb.fire();
}

Game.prototype.resetCanvasMouse=function(){
    canvas.onmousedown = null;
    canvas.onmouseup = null;
    canvas.onmouseover = null;
    canvas.onmouseout = null;
}

Game.prototype.instructionScreen=function(){
    this.resetCanvasMouse();
    this.instructionScreen=new InstructionScreen();
    $('body').keyup(function(e) {
        $('body').unbind('keyup');
         $('body').unbind('click');
        thisGame.startGame();
    });

    //$('body').append('<div id="monkey" style="height:20px; width:20px; background-color:#ffde42;position:absolute;z-index:50;top:500px;left:500px;"></div>');
    if(device.tablet()){
    $('body').bind('touchstart', function(event){
        //$('#monkey').remove();
        $('body').unbind();
        thisGame.startGame();
    })
}

var thisGame=new Game();

function Hero(){
    this.speed= 384;
    // pixels per second for now
    this.firing= false;
    this.firingFrame= 0;
    this.catching= false;
    this.catchingFrame= 0;
    this.colliding= false;
    this.collideFrame= 0;
    this.collideComplete= false;
    this.direction= 0;
    this.source= guitaristImage;
    this.currentFrame=0;
    this.totalFrames= 6;
    this.imageArray=[];
    this.roundSizes=[123, 138];
    this.turns=3;
    
};

Hero.prototype.reset=function(){
        this.x = -40+canvas.width / 2;
        this.y = canvas.height * 0.78;
        this.firing = false;
        this.catching = false;
        this.catchingFrame = 0;
        this.colliding = false;
        this.collideFrame = 0;
        this.collideComplete = false;
}

var guitarist=new Hero();

function Amp(ca) {
    var cw = Math.round(canvas.width / 8);
    this.y = -80;
    this.x = cw + Math.round((Math.random() * (canvas.width - (cw * 2))));
    this.p = 1 - (Math.random() * 2);
    this.currentFrame = 0;
    this.explode = false;
    this.remove = false;
    this.style = Math.floor(Math.random() * 2);
    this.width = 70;
    this.height = 70;
    this.white = false;
    this.blackstar = ampDistroArray[ca];
    if (this.blackstar) {
        if (whiteAmp == score.blackstarCount) {
            this.white = true;
        } else {
            //whiteStatus=false;
        }
        score.blackstarCount++;
    }
    this.completed = false;
}

function Bullet() {
    this.x = (guitarist.x + 35);
    this.y = guitarist.y + 28;
    this.width = 16;
    this.height = 16;
}

Bullet.prototype.fire = function() {
    //alert("fire");
    fxArray[1].play();
    
    thisGame.bulletArray.push(this);
    //thisGame.bulletArray[thisGame.currentBullet].x=(guitarist.x+35);
    //thisGame.bulletArray[thisGame.currentBullet].y=guitarist.y+20;
    thisGame.currentBullet++;
    guitarist.firing = true;
    //tiles.push(imageObj);
};

function Cabinet(id) {
    this.cx=Math.floor(id / 6);
    this.cc=id - (6 * this.cx);
    this.x=cabinetOffsetX + (this.cc * (cabinetSize + 2));
    this.y=cabinetOffsetY + (this.cx * (cabinetSize + 2));
    this.currentFrame=0;
}

var bigDisplayText = {
    interval: 10,
    fading: false,
    showing: false,
    counter: 0,
    text: ""
};

for (var cz = 0; cz < 18; cz++) {
    var c = new Cabinet(cz);
    cabinetArray.push(c);
}

var score = {
    width: 331,
    height: 22,
    top:15,
    left: canvas.width - 331,
    ampsCaught: 0,
    currentRound: 1,
    score: 0,
    blackstarCount:0,
    
        //image:scoreImg
}; 


// Handle keyboard controls
var keysDown = {};
addEventListener("keydown", function(e) {
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function(e) {
    delete keysDown[e.keyCode];
}, false);



/// images new
var bgImage = new Image();
bgImage.src = "images/real_bg_1.jpg";
var bg2Image = new Image();
bg2Image.src = "images/real_bg_2.jpg";
var bg3Image = new Image();
bg3Image.src = "images/real_bg_3.jpg";
var bg4Image = new Image();
bg4Image.src = "images/real_bg_4.jpg";

var bgImages = new Array(bgImage, bg2Image, bg3Image, bg4Image);

var guitaristImage = new Image();
guitaristImage.src = "sprites/testrun4.png";
var guitaristImage2 = new Image()
guitaristImage2.src = "sprites/brianspritesheet.png";

guitarist.imageArray.push(guitaristImage, guitaristImage2);
// amp images

var ampImage = new Image();
ampImage.src = "sprites/ampexplosion2.png";
var ampImage2 = new Image();
ampImage2.src = "sprites/ampexplosion5.png";
var ampImage3 = new Image();
ampImage3.src = "sprites/ampexplosion3.png";
var ampImage4 = new Image();
ampImage4.src = "sprites/ampexplosion4.png";

ampImageArray.push(ampImage, ampImage2, ampImage3, ampImage4);


var bulletImage = new Image();
bulletImage.src = "images/icebullet2.gif";
var cabinetImage = new Image();
cabinetImage.src = "sprites/cabinet_sprite.jpg";


var roundscreenImage = new Image();
roundscreenImage.src = "images/roundscreen1"+tabPrefix+".png";
var roundscreenImage2 = new Image();
roundscreenImage2.src = "images/roundscreen2"+tabPrefix+".png";
var roundscreenImage3 = new Image();
roundscreenImage3.src = "images/roundscreen3"+tabPrefix+".png";
var roundscreenImage4 = new Image();
roundscreenImage4.src = "images/roundscreen4"+tabPrefix+".png";

var roundImageArray=new Array(roundscreenImage,roundscreenImage2,roundscreenImage3,roundscreenImage4);

var scoreImg = new Image();
scoreImg.src = "images/score_bar.png";
var shadowImg = new Image();
shadowImg.src = "images/shadow.png";
var blogo = new Image();
blogo.src = "images/blogo.png";


/// AUDIO
var explosionSound = new Audio("mp3/explosion.wav");
explosionSound.setup(0.7);

var whooshSound = new Audio("mp3/whoosh.wav");
whooshSound.setup(0.5);

var booSound = new Audio("mp3/explosionboo.wav");
booSound.setup(0.4);

var ampwhooshSound = new Audio("mp3/ampwhoosh.wav");
ampwhooshSound.setup(0.5);

var descendentsSong = new Audio("mp3/descendents.mp3");
descendentsSong.setup(0.5);

var fxArray = new Array(explosionSound, whooshSound, booSound, ampwhooshSound);
var songArray = new Array(descendentsSong);
///
//////////////////
///
///  UPDATE
///
//////////////////
var update = function(modifier) {
    if (thisGame.playStatus) {
        var tl = mouseIsDown && mouseDir == 1;
        var tr = mouseIsDown && mouseDir == 2;
        if (32 in keysDown && thisGame.fireReady && !guitarist.colliding) { // Player holding space bar
           thisGame.fireSequence();
        }
        // if (40 in keysDown) { // Player holding down
        // guitarist.y += guitarist.speed * modifier;
        // }
        guitarist.direction = 0;
        if ((tl || 37 in keysDown) && !guitarist.colliding && thisGame.walkReady) { // Player holding left
            guitarist.direction = 1;
            guitarist.x -= guitarist.speed * modifier;
            if(guitarist.x<0){
                guitarist.x=0;
            }
        }
        if (tr || 39 in keysDown && !guitarist.colliding && thisGame.walkReady) { // Player holding right
            guitarist.direction = 2;
            guitarist.x += guitarist.speed * modifier;
            if(guitarist.x>854){
                guitarist.x=854;
            }
        }
        var moddy = 0.8 * (thisGame.currentAmp / ampsPerRound);
        //alert(ampCounter);
        ampTimer = ampTimer + (1 + moddy);
        if (ampTimer > 70 && thisGame.currentAmp > -1) {
            if (thisGame.currentAmp >= ampsPerRound && !guitarist.colliding) {
                thisGame.currentAmp = -1;
                newRoundInterval = setTimeout(function() {
                    thisGame.playStatus = false;
                    roundOver();
                }, 3000);
            } else {
                ampTimer = 0;
                ampy();
            }
        }
        //Bullet loop
        for (var bloop = 0; bloop < thisGame.bulletArray.length; bloop++) {
            thisGame.bulletArray[bloop].y -= 20;
            if (thisGame.bulletArray[bloop].y < 0) {
                thisGame.bulletArray.splice(bloop, 1);
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
    guitarist.width = 80;
    var evenRound = 1 - (score.currentRound - Math.floor(score.currentRound /
        2) * 2);
    guitarist.height = guitarist.roundSizes[evenRound]; //    
    guitarist.source = guitarist.imageArray[evenRound];
    var vh = 18 - (138 - guitarist.height);
    guitarist.y = (canvas.height * 0.78) - vh;
    if (bgImage.ready) {
        ctx.drawImage(bgImages[score.currentRound - 1], 0, 0);
    }
    //cabs
    if (!guitarist.colliding) {
        for (var cc = 0; cc < score.ampsCaught; cc++) {
            //setTimeout(function(){},500)
            var ccf = Math.floor(cabinetArray[cc].currentFrame);
            if(cabinetImage.ready){
            ctx.drawImage(cabinetImage, (cabinetSize * ccf), 0,
                cabinetSize, cabinetSize, cabinetArray[cc].x,
                cabinetArray[cc].y, cabinetSize, cabinetSize);
        }
            cabinetArray[cc].currentFrame += 0.25;
            if (cabinetArray[cc].currentFrame > 3) {
                cabinetArray[cc].currentFrame = 3;
            }
        }
    }
    if (guitarist.source.ready) {
        var fl = Math.floor(guitarist.currentFrame);
        if (guitarist.colliding) {
            var corl = Math.floor(guitarist.collideFrame);
            ctx.drawImage(shadowImg, guitarist.x, 590);
            ctx.drawImage(guitarist.source, guitarist.width * corl, 4 * guitarist.height,
                guitarist.width, guitarist.height, guitarist.x, guitarist.y, guitarist.width,
                guitarist.height);
            guitarist.collideFrame += 0.75;
            if (guitarist.collideFrame == guitarist.totalFrames) {
                guitarist.collideFrame = 0;
                //guitarist.colliding=false;
                if (!guitarist.collideComplete) {
                    setTimeout(function() {
                        endTurn();
                    }, 2000);
                    guitarist.collideComplete = true;
                }
            }
        }  else if (guitarist.firing) {
            var frl = Math.floor(guitarist.firingFrame);
            ctx.drawImage(shadowImg, guitarist.x, 590);
            ctx.drawImage(guitarist.source, guitarist.width * frl, 2 * guitarist.height,
                guitarist.width, guitarist.height, guitarist.x, guitarist.y, guitarist.width,
                guitarist.height);
            guitarist.firingFrame += 0.60;
            if (guitarist.firingFrame >= guitarist.totalFrames) {
                guitarist.firingFrame = 0;
                guitarist.firing = false;
            }
        } else if (guitarist.catching) {
            var crl = Math.floor(guitarist.catchingFrame);
            ctx.drawImage(shadowImg, guitarist.x, 590);
            ctx.drawImage(guitarist.source, guitarist.width * crl, 3 * guitarist.height,
                guitarist.width, guitarist.height, guitarist.x, guitarist.y, guitarist.width,
                guitarist.height);
            guitarist.catchingFrame += 0.75;
            if (guitarist.catchingFrame == guitarist.totalFrames) {
                guitarist.catchingFrame = 0;
                guitarist.catching = false;
            }
        } else if (guitarist.direction > 0) {
            var m = 0;
            if (guitarist.direction == 1) {
                m = guitarist.height;
            }
            ctx.drawImage(shadowImg, guitarist.x, 590);
            ctx.drawImage(guitarist.source, guitarist.width * fl, m, guitarist.width, guitarist
                .height, guitarist.x, guitarist.y, guitarist.width, guitarist.height);
            guitarist.currentFrame += 0.50;
            if (guitarist.currentFrame == guitarist.totalFrames) {
                guitarist.currentFrame = 0;
            }
        }else {
            ctx.drawImage(shadowImg, guitarist.x, 590);
            ctx.drawImage(guitarist.source, 0, 2 * guitarist.height, guitarist.width, guitarist
                .height, guitarist.x, guitarist.y, guitarist.width, guitarist.height);
        }
    }
    if (!guitarist.colliding) {
        //if (ampReady) {

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
                        if(ampImageArray[bsMod].ready){
                        ctx.drawImage(ampImageArray[bsMod], 0, 0, 60, 60,
                            ampArray[ac].x, ampArray[ac].y, 60, 60);
                        }
                        var value = ampArray[ac].y / 600;
                        value = value < 0 ? 0 : value;
                        ctx.globalAlpha = value;
                        ctx.drawImage(shadowImg, ampArray[ac].x, 590);
                        ctx.globalAlpha = 1;
                        //ctx.restore();
                    } else {
                        fxArray[sn].play();
                        var cfl = Math.floor(ampArray[ac].currentFrame);
                        if(ampImageArray[bsMod].ready){
                        ctx.drawImage(ampImageArray[bsMod], (60 * cfl), 0,
                            60, 60, ampArray[ac].x, ampArray[ac].y, 60,
                            60);
                    }
                        ampArray[ac].currentFrame += 0.5;
                        if (ampArray[ac].currentFrame > 15) {
                            ampArray[ac].currentFrame = 15;
                            ampArray[ac].remove = true;
                        }
                    }
                }
            }
        //}
        if (blogo.ready) {
            blogo.drawThis(15, 15);
        }
    }
    // SCORE
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = "20px Abel";
    ctx.textAlign = 'left';
    //ctx.textBaseline = "top";
    //ctx.fillRect(score.left,score.top,score.width,score.height);
    if (scoreImg.ready) {
        scoreImg.drawThis(score.left, score.top);
    }
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText(score.score, score.left + 51, score.top + 18);
    ctx.fillText(score.currentRound, score.left + 157, score.top + 18);
    ctx.fillText(score.ampsCaught, score.left + 221, score.top + 18);
    ctx.fillText(guitarist.turns, score.left + 310, score.top + 18);
    if (bulletImage.ready) {
        if (thisGame.bulletArray.length > 0) {
            for (var ba = 0; ba < thisGame.bulletArray.length; ba++) {
                ctx.drawImage(bulletImage, thisGame.bulletArray[ba].x, thisGame.bulletArray[
                    ba].y);
            }
        }
    }
    if (bigDisplayText.showing) {
        //alert("meow");
        var al = 1;
        if (bigDisplayText.fading) {
            al = 1 - bigDisplayText.counter;
            bigDisplayText.counter += 0.05;
            if (bigDisplayText.counter >= 1) {
                bigDisplayText.fading = false;
                bigDisplayText.showing = false;
                bigDisplayText.counter = 0;
                if (guitarist.turns > 0) {
                    thisGame.playStatus = true;
                }
            }
        }
        ctx.fillStyle = "rgba(255,255,255," + al + ")";
        ctx.font = "52px Abel";
        ctx.textAlign = 'center';
        ctx.shadowColor = "black";
        ctx.shadowBlur = 6;
        ctx.strokeText(bigDisplayText.text, canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0;
        ctx.fillText(bigDisplayText.text, canvas.width / 2, canvas.height / 2);
    }
};
///
///
///
///
///
var ampy = function() {
   
    var aa = new Amp(thisGame.currentAmp);
    ampArray.push(aa);
    thisGame.currentAmp++;
    
};

var roundReset=function(){
    shuffle(ampDistroArray);
    score.blackstarCount = 0;
    ampArray = [];
    thisGame.bulletArray = [];
    score.ampsCaught = 0;
    thisGame.currentAmp = 0;
}

var endTurn = function() {
    guitarist.turns -= 1;
    roundReset();
    if (guitarist.turns === 0) {
        pauseText("GAME OVER");
        gameOver();
    } else {
        pauseText("GET READY!");
    }
    guitarist.reset();
};



var gameOver=function(){
    var go=setTimeout(function(){
        if(score.currentRound>1){
            //redirect[1]
            window.location.replace(redirects[1]);
        } else {
            //redirect[0]
            window.location.replace(redirects[0]);

        }

    },7000);

}
var roundOver = function() {
    roundReset();
    score.currentRound++;
    guitarist.reset();
    roundScreen();
};

function handleCollisions() {
    if (!guitarist.colliding) {
        ampArray.forEach(function(e) {
            thisGame.bulletArray.forEach(function(b) {
                if (collision(b.x + (b.width / 2), b.y + (b
                        .height / 2), b.width / 2, e.x +
                    (e.width / 2), e.y + (e.height / 2),
                    e.width / 2)) {
                    e.explode = true;
                    removeFromArray(b, thisGame.bulletArray);
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
            if (collision(guitarist.x + (70 / 2), guitarist.y + (70 / 2), 70 /
                2, e.x + (e.width / 2), e.y + (e.height / 2), e
                .width / 2)) {
                if (e.blackstar) {
                    
                    
                    guitarist.catching = true;
                    score.ampsCaught++;
                     if(score.ampsCaught==18){
                        for(var jj=0;jj<18;jj++){
                            cabinetArray[jj].currentFrame=0;

                         }

                     }
                    if (!e.white) {
                        score.score += (score.ampsCaught + 1) * 50;
                    } else {
                        score.score += (score.ampsCaught + 1) * 100;
                    }
                    fxArray[3].play();
                    removeFromArray(e, ampArray);
                } else if (!e.explosion) {
                    guitarist.colliding = true;
                    clearInterval(newRoundInterval);
                    fxArray[0].play();
                }
            }
        });
    }
}

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
    ampDistroArray.push(true, true, true, false, false, false);//used to be 2+ more falses
}
shuffle(ampDistroArray);
ampsPerRound = ampDistroArray.length;
var removeFromArray = function(it, ar) {
    var p = $.inArray(it, ar);
    if (p !== -1) {
        ar.splice(p, 1);
    }
};



var pauseText = function(z) {
    thisGame.playStatus = false;
    bigDisplayText.text = z;
    bigDisplayText.showing = true;
    bigDisplayText.fading = false;
    bigDisplayText.counter = 0;
    setTimeout(function() {
        bigDisplayText.fading = true;
    }, 2000);
};
var roundScreen = function() {
    var a = 0;
    thisGame.roundScreenStatus = true;
    var rd=score.currentRound-(Math.floor((score.currentRound-1)/4)*4);
    ctx.drawImage(bgImages[rd - 1], 0, 0);
    ctx.drawImage(roundImageArray[rd-1], 0, 0);
    ctx.font="110px Squarefont";
    ctx.color="#ffffff";
    ctx.textAlign="left"; 
    ctx.shadowColor = "rgba(103,103,103,0.7);";
    ctx.fillStyle="#ffffff";
    ctx.shadowOffsetX = 6; 
    ctx.shadowOffsetY = 6; 
    ctx.shadowBlur = 1;
    ctx.fillText("ROUND "+score.currentRound,136,170);
    ctx.shadowOffsetX = 0; 
    ctx.shadowOffsetY = 0; 
    ctx.shadowBlur = 0;
    $('body').keyup(function() {
        thisGame.roundScreenStatus = false;
        $('body').unbind('keyup');
        $('body').unbind('click');
        pauseText('GET READY!');
        thisGame.main();
    });

    if (device.tablet()) {
         $('body').bind('touchstart', function(event){
            //if(a>0){
                $('body').unbind();
            thisGame.roundScreenStatus = false;
           
            //alert("key");
            pauseText('GET READY!');
            thisGame.main();
            ///}else{
            //	a++;
            //}
            //songArray[0].play();
        });
    }
};





function buttonDown(e) {
    touches++;
    if (e === 0) {
        mouseIsDown = true;
        mouseDir = 1;
    } else {
        mouseIsDown = true;
        mouseDir = 2;
    }
}

function buttonUp(e) {
    touches--;
    if(touches===0){
    if (e === 0) {
        mouseIsDown = false; //mouseDir=1;}
    } else {
        mouseIsDown = false; //mouseDir=2;}
    }
}
}
window.onload = function() {
    $(document).bind('touchmove', false);
    thisGame.titleScreen();
};