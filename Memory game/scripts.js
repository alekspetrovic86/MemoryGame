const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let name = "";

let jsonString =
  `[
    "./img/stark.png",
    "./img/lannister.png",
    "./img/targaryen.png",
    "./img/tully.png",
    "./img/greyjoy.png",
    "./img/tyrell.png", 
    "./img/baratheon.png",
    "./img/arryn.png"
  ]`

let strana = document.querySelectorAll('.front-face');
let backgrounds = JSON.parse(jsonString);
let i = 0;
for (let t = 0; t < strana.length; t += 2) {
  if (i < backgrounds.length) {
    strana[t].setAttribute('src', backgrounds[i]);
    strana[(t + 1)].setAttribute('src', backgrounds[i]);
    i++;
  }
}



function flipCard() {
  if (!startedGame) return;
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();

}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 800);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));


let startedGame = false;

//timer
var time = [];
document.getElementById('button').addEventListener('click', timerOn);
let sec = 60;
function timer() {
  if (sec >= 0) {
    var m = parseInt(sec / 60);
    var s = sec % 60;
    time[1] = (m + 'm');
    time[2] = (s + 's');

    var countdown = time.join(' ');
    document.getElementById('time').innerText = countdown;
    sec--;
    win();
  } else {
    clearInterval(timesUp);
    clearInterval(countTime);
    document.getElementById('audio').pause();
    console.log(counter());
    alert('Vreme je isteklo!');
    location.reload();
    document.getElementById('audio').pause();
  }

}
function timerOn() {
  name = prompt("Enter your name:");
  //music
  if(name != undefined){
    document.getElementById('mute').style.display = 'block';
    document.getElementById('audio').volume = 0.1;
    document.getElementById('audio').play();
  }
  if (name != null && name != "") {
    startedGame = true;
    countTime = setInterval(counter, 1000);
    sec = document.getElementById('level').value;
    if (sec == "60") {
      gamelevel = 'easy';
    } else if (sec == "30") {
      gamelevel = 'medium';
    } else {
      gamelevel = 'hard';
    }
    timesUp = setInterval(timer, 1000);
    document.getElementById("button").disabled = true;
    document.getElementById("level").disabled = true;
  }
}


let count = -2;
var counter = function () {
  count += 1;
  let timerecord = count + 's';
  return timerecord;
}

function win() {
  let c = 0;
  for (i = 0; i < cards.length; i++) {
    if (cards[i].classList.contains('flip')) {
      c = c + 1;
    }
  }
  if (c == cards.length) {
    showHighscore();
    clearInterval(timesUp);
    clearInterval(countTime);
    document.getElementById('audio').pause();
  }
}

document.getElementById('confirmHS').addEventListener('click', OK);

function OK(e) {
  e.preventDefault();
  document.getElementById('highscore').style.display = 'block';
  location.reload();
}

var gamelevel = "";



//Highscore storrage
var highscore = [];
//var n = 0;


function showHighscore() {
  function appear(){
    document.getElementById('highscore').style.display = 'block';
  }
  let recordtime = counter();
  let listol = document.querySelector('.highscore-records');
  if (localStorage['highscore'] === undefined || localStorage['highscore'] === '') {
    localStorage['highscore'] = JSON.stringify(highscore);
  }
  highscore = JSON.parse(localStorage['highscore']);
  var obj = {
    name: name,
    score: recordtime,
    gamelevel: gamelevel
  };
  highscore.push(obj);
  for (let n = 0; n < highscore.length; n++) {
    var str = '<p>' + (n + 1) + '. ' + highscore[n].name + ' ' + highscore[n].score + " " + "(" + highscore[n].gamelevel + ")" + '</p>';
    listol.innerHTML += str;
    //sort highscore by time
    function compare(a, b) {
      if (a.score < b.score) {
        return -1;
      }
      if (a.score > b.score) {
        return 1;
      }
      return 0;
    }
    highscore.sort(compare);
    let slice = highscore.slice(0, 10);
    highscore = slice;
  }
  localStorage['highscore'] = JSON.stringify(highscore);
  
  setTimeout(appear,400);
}


document.querySelector('.mute').addEventListener('click', mute);
function mute(){
  document.getElementById('mute').style.display = 'none';
  document.getElementById('audio').pause();
}
