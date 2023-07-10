const playboard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highscoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;

let foodX , foodY;
let snakeX = 5 , snakeY = 10;
let velocityX=0,velocityY=0;
let snakeBody = [];
let setIntervalId;
let score = 0;


// getting high score from localstorage  and 
let highscore = localStorage.getItem("high-score") || 0 ; // zero bcoz currently no high in localstorage
highscoreElement.innerText = `High Score: ${highscore}`;

const changefoodposition = () =>{
    // passing a random 0-30 value as food position
    foodX = Math.floor(Math.random() * 30)+1;
    foodY = Math.floor(Math.random() * 30)+1;
}

const handlegameover = () => {
    // clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game over! press OK to reply...")
    location.reload();
    
}

const changedirection = (e) =>{
    // changing velocity value based on key press and restricting the snake from changing direction to opp. side
    if(e.key ==="ArrowUp"  && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }else if(e.key === "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }else if(e.key === "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }else if(e.key === "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
    
}

controls.forEach(key =>{
    // calling changedirection on each key click and passing key dataset value as an object
    key.addEventListener("click", () => changedirection({key: key.dataset.press}));
})


const initgame = () =>{
    if(gameOver) return handlegameover();
    let htmlmarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`; // row/ column
    
    // updating food when snake eat food
    if(snakeX === foodX && snakeY === foodY){
        changefoodposition();
        
        // pushing food position to snakebody array
        snakeBody.push([foodX,foodY]);
        console.log(snakeBody);
        score++; // increment in score when snake eat food
        
        highscore = score >= highscore ? score : highscore;
        localStorage.setItem("high-score",highscore);
        scoreElement.innerText = `Score: ${score}`;
        highscoreElement.innerText = `High Score: ${highscore}`;
    }

    for(let i = snakeBody.length-1; i>0; i--){
        // shifting forward the values of the elements in the snake body by one
        snakeBody[i] = snakeBody[i-1];
    }

    snakeBody[0]  = [snakeX,snakeY]; // setting first element of snakebody to current snake position
    
    // updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // checking the snake's head is out of wall, if so setting gameover to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }
    
    for(let i = 0; i<snakeBody.length; i++){
        // adding a div for each part of the snake's body
        htmlmarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // checking if the snake head hit his body, if so set gameover to true
        if(i!=0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }
    

   

    playboard.innerHTML = htmlmarkup;
}

changefoodposition();

// to move head after every 125 miliseconds. 125 is the speed of snake
setIntervalId = setInterval(initgame, 125); 

document.addEventListener("keydown",changedirection);
