const pChoice = document.querySelector(".p-choice");
const pImg = pChoice.previousElementSibling;

const cChoice = document.querySelector(".c-choice");
const cImg = cChoice.previousElementSibling;

const weapons = document.querySelectorAll(".img");
const result = document.querySelector(".result");

function randomNumber() {
  return Math.floor(Math.random() * 3);
}

// console.log(randomNumber())

function computer() {
  const choices = ["paper", "rock", "scissors"];
  const ele = choices[randomNumber()];
  cImg.src = `images/${ele}.png`;
  cImg.id = ele;
  cChoice.innerHTML = ele;
}

weapons.forEach((weapon) => {
  weapon.addEventListener("click", () => {
    const item = weapon.childNodes[1];
    pImg.src = item.src;
    pImg.id = weapon.id;
    pChoice.innerHTML = weapon.id;

    computer();
    check(cImg.id, pImg.id);
  });
});

function check(a, b) {
  let msg;
  if (a == b) {
    msg = "DRAW";
  }
  if (a == "rock" && b == "paper") {
    msg = "You Win!";
  } else if (a == "rock" && b == "scissors") {
    msg = "You Lose!";
  }

  if (a == "paper" && b == "scissors") {
    msg = "You Win!";
  } else if (a == "paper" && b == "rock") {
    msg = "You Lose!";
  }

  if (a == "scissors" && b == "rock") {
    msg = "You Win!";
  } else if (a == "scissors" && b == "paper") {
    msg = "You Lose!";
  }

  result.innerHTML = msg;
  document.body.style.pointerEvents = "none";

  setInterval(() => {
    result.innerHTML += ".";
  }, 700);
  setTimeout(() => {
    location.reload();
  }, 2200);
}
