// creates a space in computer
var monkey,monkey_running;
var banana ,bananaImage,foodGroup;
var obstacle, obstacleImage,obstacleGroup;
var forest,ground,forestImg;
var survivalTime = 0,score = 0,highScore = 0;
var PLAY = 1;
var END = 0
var gameState = PLAY;
var gameover,gameoverImage;
var restart,restartImage;

function preload(){
  
  monkey_running =            loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  
  monkeyImage = loadImage("sprite_1.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  forestImg = loadImage("forest.png.jpg");
  restartImage = loadImage("restart.jpg");
  gameoverImage = loadImage("gameover.png");
  startImage = loadImage("start.png");
}



function setup() {
  //create canvas
  createCanvas(windowWidth,windowHeight);
  
  //create forest as sprite object,gives velocity & add image 
  forest = createSprite(100,height/10,10,10);
  forest.velocityX = -5;
  forest.addImage(forestImg);
  forest.scale = 5;
  
  //create monkey as sprite object & add animation to monkey
  monkey = createSprite(50,height-30,10,10);
  monkey.addAnimation("running",monkey_running);
  monkey.scale = 0.08;
  //monkey.debug = true;
  monkey.setCollider("rectangle",100,0,280,570);
  
  //create ground as sprite object & makes invisible
  ground = createSprite(width/2,height-1,width,2);
  ground.visible = false;
  
  //create gameover as sprite object & add image to gameover
  gameover = createSprite(width/2,height/2-70,10,10);
  gameover.addImage(gameoverImage);
  gameover.scale = 0.05;
  
  //create restart as sprite object & add image to restart
  restart = createSprite(width/2,height/2+70,10,10);
  restart.addImage(restartImage);
  restart.scale = 0.1;
  
  //create new groups
  foodGroup = new Group();
  obstacleGroup = new Group();
  
}

function draw() {
  //set background colour
  background("white");
  
  //makes monkey to collide ground
  monkey.collide(ground);

  
  if (gameState === PLAY){ 
      
      //increase speed as much as score increases
      forest.velocityX = -(5 + score/20);
      //console.log(Math.round(forest.velocityX));
      
      
      survivalTime = Math.ceil(frameCount/getFrameRate());
      
      //gives gravity to monkey
      monkey.velocityY = monkey.velocityY+0.8;
      //console.log(Math.round(monkey.y));
      
      //calls food and rock functions
      food();
      rock();
      
      //makes gameover and restart invisible
      gameover.visible = false;
      restart.visible = false;
      
      //gives infinite scrolling effect
      if (forest.x < 0){
          forest.x = forest.width/2;
      }
      
      //makes monkey to jump when space key pressed
      if (touches.length > 0||keyDown("space") && monkey.y > height-50){
          monkey.velocityY = -19;
          touches = [];
      }
      
      //destroy banana and calculats score when monkey touches banana
      if (foodGroup.isTouching(monkey)){
          foodGroup.destroyEach();
          score = score+2;
      }
      
      //calculats high score
      if (highScore < score){
          highScore = score;
      }
      
      if (score > 0 && score%40 === 0){ 
          var rand = Math.round(1,4);
          switch (rand){

            case 1 : monkey.scale = 0.1;
            break;            
            case 2 : monkey.scale = 0.12;
            break;            
            case 3 : monkey.scale = 0.14;
            break;
            case 4 : monkey.scale = 0.16;
            break;
            default : break;
          }
      }
      
      //drceases the size of monkey if it touches obstacle
      if (monkey.isTouching(obstacleGroup)){
          monkey.scale = monkey.scale - 0.03
          obstacleGroup.destroyEach();
          score = score - 20;
      }
      
      //changes State to END when monkey scale is less than 0.07
      if (monkey.scale < 0.07){
          gameState = END;
      }
  } 
  else if (gameState === END){
      
      //makes gameover and restart visible
      gameover.visible = true;
      restart.visible = true;
      
      //forest and monkey invisible
      forest.visible = false;
      monkey.visible = false;
    
      //destroy bananas and obstacles
      foodGroup.destroyEach();
      obstacleGroup.destroyEach();
      
      //writes text
      stroke("red");
      fill("red");
      textSize(15);
      text("High Score = "+highScore,width/2-50,height/2);
     
      //call restart function when restart pressed
      if (mousePressedOver(restart)||touches.lenght>1){
          reset();
      }
      
  }
  
  //draws sprite objects
  drawSprites();
  
  //writes text
  stroke("black");
  fill("blue");
  textSize(15);
  text("score = "+ score,width-100,30);
  
  //writes text
  stroke("black");
  fill("blue");
  textSize(15);
  text("Survival Time = "+survivalTime,10,30);
  
}  

function food (){
  //create banana as sprite object,gives it properties after every 80 frames
  if (frameCount%130 === 0 ){ 
     banana = createSprite(width,Math.round(random(height/2,height/2+30)),5,5); 
     banana.velocityX = forest.velocityX +(-1);
     banana.addImage(bananaImage);
     banana.scale = 0.06;
     banana.lifetime = width/banana.velocityX;
     //banana.debug = true;
     banana.setCollider("rectangle",0,0,700,150);
    
     //add banana in foodGroup
     foodGroup.add(banana);
  }
  
}

function rock (){
  //create obstacle as sprite object,give it properties after every 100 frames
  if (frameCount%300 === 0){
     obstacle = createSprite(width,height-15,10,10);
     obstacle.velocityX = banana.velocityX + (-1);
     obstacle.addImage(obstacleImage);
     obstacle.scale = 0.19;
     obstacle.lifetime = width/obstacle.velocityX;
     //obstacle.debug = true;
     obstacle.setCollider("rectangle",0,0,350,400);
    
     //add obstacle in obstacleGroup
     obstacleGroup.add(obstacle);
  }  
}

function reset (){
  gameState = PLAY;
  forest.visible = true;
  monkey.visible = true;
  monkey.y = height-30;
  monkey.scale = 0.08;
  forest.velocityX = -4;
  survivalTime = 0;
  score = 0;        
  
  
  
}

