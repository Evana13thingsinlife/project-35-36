//Create variables here
var fedTime, lastFed;
var foodObj, feed, addFood;
var dog, happyDog, foodS, foodStock, database, dogImg, happyDogImg;

function preload() {
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png")
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  dog = createSprite(250, 300, 150, 150);
  dog.scale = 0.15;
  dog.addImage(dogImg);

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);
  foodObj = new Food();

  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}


function draw() {
  background(46, 139, 87);

  foodObj.display();

  fedTime = database.ref('FeedTime')
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed :" + lastFed % 12 + "PM", 350, 30);
  } else if (lastFed == 0) {
    text("Last Feed : 12AM", 350, 30);
  } else {
    text("Last Feed : " + lastFed + "AM", 350, 30);
  }

  stroke("black");
  text("Food remaining :" + foodS, 170, 200);
  textSize(13);
  fill("white");
  text("Press UP_ARROW key to feed Drago milk", 200, 20);




  drawSprites();
  //add styles here

}
function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }
  database.ref('/').update({
    Food: x
  })


}

function feedDog() {
  dog.addImage(happyDogImg);
  if (foodObj.getFoodStock() <= 0) {
    foodObj.updateFoodStock(foodObj.getFoodStock() * 0);
  }
  else {
    foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  }
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
foodS++;
database.ref('/').update({
  Food:foodS
})


}

