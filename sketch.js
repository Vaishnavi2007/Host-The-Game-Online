var PLAY = 1;
var END = 0;
var gameState = PLAY;
var monkey, monkey_running
var banana, bananaImage, obstacle, obstacleImage
var FoodGroup, obstacleGroup
var score;
var ground;
var gameOver, GameOverSound, GameOverImage;
var reset, resetImage;
var JumpSound;
var eatSound;
var invisibleGround

function preload() {


  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png")

  bananaImage = loadImage("banana.png");
  obstaceImage = loadImage("obstacle.png");

  GameOverImage = loadImage("27f440a8-1359-47ec-a1d6-bb7520a1cf29.png");
  resetImage = loadImage("42a21ff6-8e73-41be-a4d7-44901134bd0d.png");
  GameOverSound = loadSound("ae2da984-5f09-45b9-8a4d-8d8f9eeee058.mp3");
  JumpSound = loadSound("50955843-cdd1-4cfa-ba4a-1bdc69e0b41f.mp3");
  eatSound = loadSound("803afb91-905d-4e57-875d-1b2006a51210.mp3");
}



function setup() {
  createCanvas(600, 400);

  ground = createSprite(400, 380, 400, 20);;


  monkey = createSprite(50, 160, 20, 50);
  monkey.addAnimation("running", monkey_running);


  gameOver = createSprite(300, 100);
  gameOver.addImage(GameOverImage);

  reset = createSprite(300, 140);
  reset.addImage(resetImage);



  monkey.setCollider("rectangle", 0, 0, monkey.width, monkey.height);
  monkey.debug = true


  gameOver.scale = 0.5;
  reset.scale = 0.5;






  obstaclesGroup = new Group();
  FoodGroup = new Group();

  score = 0;

}


function draw() {

  ground.velocityX = -3

  if (ground.x < 0) {
    ground.x = ground.width / 2;

  }


  if (FoodGroup.isTouching(monkey)) {
    FoodGroup.destroyEach();
    score = score + 8;

    text("Score: " + score, 500, 50);


    if (gameState === PLAY) {

      gameOver.visible = false;
      reset.visible = false;

      ground.velocityX = -(4 + 3 * score / 100)
      //scoring
      score = score + Math.round(getFrameRate() / 60);


      //jump when the space key is pressed
      if (keyDown("space") && monkey.y >= 100) {
        monkey.velocityY = -12;
        JumpSound.play();
      }

      //add gravity
      monkey.velocityY = monkey.velocityY + 0.8


      //spawn obstacles on the ground
      spawnObstacles();
      spawnBanana();

      if (obstaclesGroup.isTouching(monkey)) {

        gameState = END;


      }
    } else if (gameState === END) {
      gameOver.visible = true;
      reset.visible = true;


      if (mousePressedOver(reset)) {
        reset();
      }

      ground.velocityX = 0;
      monkey.velocityY = 0


      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      FoodGroup.setLifetimeEach(-1);

      obstaclesGroup.setVelocityXEach(0);
      FoodGroup.setVelocityXEach(0);


    }


    drawSprites();


  }

  function reset() {
    // console.log("game is restarted");
    gameState = PLAY;
    score = 0;
    obstaclesGroup.destroyEach();
    FoodGroup.destroyEach();
    monkey.changeAnimation("running", monkey_running);
  }

  function spawnObstacles() {
    if (frameCount % 60 === 0) {
      var obstacle = createSprite(600, 165, 10, 40);
      obstacle.velocityX = -(6 + score / 100);

      //generate random obstacles
      var rand = Math.round(random(1, 6));
    }


    obstacle.scale = 0.5;
    obstacles.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);

  }

  function spawnBanana() {
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
      var banana = createSprite(600, 120, 40, 10);
      banana.y = Math.round(random(80, 120));
      banana.addImage(bananaImage);
      banana.scale = 0.5;
      banana.velocityX = -3;

      //assign lifetime to the variable
      banana.lifetime = 200;

      //adjust the depth
      banana.depth = monkey.depth;
      monkey.depth = monkey.depth + 1;

      //add each cloud to the group
      FoodGroup.add(banana);
    }
  }

}