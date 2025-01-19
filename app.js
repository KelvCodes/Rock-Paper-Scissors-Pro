const pChoice = document.querySelector(".p-choice");
const pImg = pChoice.previousElementSibling;

const cChoice = document.querySelector(".c-choice");
const cImg = cChoice.previousElementSibling;

const weapons = document.querySelectorAll(".img");
const result = document.querySelector(".result");

const playerScoreDisplay = document.getElementById("player-score");
const computerScoreDisplay = document.getElementById("computer-score");
const tieScoreDisplay = document.getElementById("tie-score");

let playerScore = 0;
let computerScore = 0;
let tieScore = 0;

function randomNumber() {
  return Math.floor(Math.random() * 3);
}

function computer() {
  const choices = ["rock", "paper", "scissors"];
  const ele = choices[randomNumber()];
  cImg.src = `images/${ele}.png`;
  cImg.id = ele;
  cChoice.innerHTML = ele;
  return ele;
}

weapons.forEach((weapon) => {
  weapon.addEventListener("click", () => {
    const playerSelection = weapon.id;
    pImg.src = `images/${playerSelection}.png`;
    pImg.id = playerSelection;
    pChoice.innerHTML = playerSelection;

    const computerSelection = computer();
    checkResult(computerSelection, playerSelection);
  });
});

function checkResult(computerSelection, playerSelection) {
  let message;

  if (computerSelection === playerSelection) {
    message = "It's a Draw!";
    tieScore++; // Increment tie score
  } else if (
    (computerSelection === "rock" && playerSelection === "scissors") ||
    (computerSelection === "scissors" && playerSelection === "paper") ||
    (computerSelection === "paper" && playerSelection === "rock")
  ) {
    message = "You Lose!";
    computerScore++;
  } else {
    message = "You Win!";
    playerScore++;
  }

  updateScore();
  displayResult(message);
}

function updateScore() {
  playerScoreDisplay.textContent = playerScore;
  computerScoreDisplay.textContent = computerScore;
  tieScoreDisplay.textContent = tieScore; // Update tie score
}

function displayResult(message) {
  result.textContent = message;

  // Brief delay for the next round
  setTimeout(() => {
    result.textContent = "Make your next move!";
  }, 1500);
}
