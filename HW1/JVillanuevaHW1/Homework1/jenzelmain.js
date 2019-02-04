var AM = new AssetManager();

function Animation(spriteSheet, frameRow, frameCol, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet; // sprite sheet being used
    this.frameRow = frameRow; // row position in sprite sheet
    this.frameCol = frameCol; // column position in sprite sheet
    this.frameWidth = frameWidth; // width of sprite frame
    this.frameDuration = frameDuration; // how long the animation lasts
    this.frameHeight = frameHeight; // height of sprite frame
    this.sheetWidth = sheetWidth; // number of sprites * frameWidth
    this.frames = frames; // how many frames an animation has
    this.totalTime = frameDuration * frames; // total time of animation
    this.elapsedTime = 0; // amount of time animation has been running
    this.loop = loop; // boolean if the animation loops or not
    this.scale = scale; // scale size of sprite ie: 1 = 100% normal scale
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = this.frameRow + frame % this.sheetWidth;
    yindex = this.frameCol;

    // draw image onto visible page
    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
        this.frameWidth, this.frameHeight,                    // width and height
        x, y,                                                 // position in canvas
        this.frameWidth * this.scale,                         // x (width) scale
        this.frameHeight * this.scale);                       // y (height) scale
}

// returns the current frame the animation is running on
Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

// checks if the animation is done
Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// currently no inheritance from Entity
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Yamada(game, spriteSheet) {
    // spriteSheet, frameRow, frameCol, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale
    this.animationWalkR = new Animation(spriteSheet, 0, 2, 32, 32, 8, 0.10, 8, true, 2);
    this.animationWalkL = new Animation(spriteSheet, 0, 3, 32, 32, 8, 0.10, 8, true, 2);
    this.animationJumpR = new Animation(spriteSheet, 1, 5, 32, 32, 1, 0.10, 8, true, 2);
    this.animationFallR = new Animation(spriteSheet, 2, 5, 32, 32, 1, 0.10, 8, true, 2);
    this.animationJumpL = new Animation(spriteSheet, 6, 5, 32, 32, 1, 0.10, 8, true, 2);
    this.animationFallL = new Animation(spriteSheet, 5, 5, 32, 32, 1, 0.10, 8, true, 2);
    //this.animationAimR = new Animation(0, 0, 32, 32, 1, 0.10, 8, true, 4);
    //this.animationAimL
    this.animation = this.animationWalkR; // this.animation must be used for initial animation
    this.x = -20; // position x on the screen
    this.y = 300; // position y on the screen
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
}

Yamada.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
}

Yamada.prototype.update = function () {
    // left and right side bounds
    if (this.x > 600) {
        // reached right side
        this.animation = this.animationWalkL;
    } else if (this.x < -20) {
        // reached left side
        this.animation = this.animationWalkR;
    }

    // walking
    if (this.animation == this.animationWalkR) {
        // forward direction, to right of screen
        this.x += this.game.clockTick * this.speed;
        // jump
        if (this.x > 200 && this.x < 210) {
            this.animation = this.animationJumpR;
        }
    } else if (this.animation == this.animationWalkL) {
        // reverse direction, to left of screen
        this.x -= this.game.clockTick * this.speed;
        if (this.x > 390 && this.x < 400) {
            this.animation = this.animationJumpL;
        }
    }

    // jumping
    if (this.animation == this.animationJumpR) {
        this.x += this.game.clockTick * this.speed;
        this.y -= this.game.clockTick * this.speed * 2;
        if (this.x > 300) {
            this.animation = this.animationFallR;
        }
    } else if (this.animation == this.animationJumpL) {
        this.x -= this.game.clockTick * this.speed;
        this.y -= this.game.clockTick * this.speed * 2;
        if (this.x < 300) {
            this.animation = this.animationFallL;
        }
    }

    // falling from jump
    if (this.animation == this.animationFallR) {
        this.x += this.game.clockTick * this.speed;
        this.y += this.game.clockTick * this.speed * 2;
        if (this.x > 400) {
            this.animation = this.animationWalkR;
        }
    } if (this.animation == this.animationFallL) {
        this.x -= this.game.clockTick * this.speed;
        this.y += this.game.clockTick * this.speed * 2;
        if (this.x <200) {
            this.animation = this.animationWalkL;
        }
    }
    
}

// 
AM.queueDownload("./Homework1/img/Yamada.png");
AM.queueDownload("./Homework1/img/background.png");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false; // disables pixel smoothing/blurring

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./Homework1/img/background.png")));
    gameEngine.addEntity(new Yamada(gameEngine, AM.getAsset("./Homework1/img/Yamada.png")));

    console.log("All Done!");
});