// let num=prompt("hello anuj");
// if (num%5==0){
//     console.log(num,"divisible by 5");

// }else{
//     console.log(num,"i snot divisible by5");
// }
// let a=0;
// for(let i=0;i<=5;i++){
//     a=a+i;
// }
// console.log("a",a);
// for(let i=1;i<=100;i++){
//     if(i%2==0){
//         console.log(i);
//     }
// }
//average of numbers in js 
// let student=[1,2,3,4,5,3]
// let sum=0;
// for(let i=0;i<student.length;i++){
//     sum=sum+student[i]
// }
// console.log(sum)
// let num=student.length;
// console.log(sum/num);
//arrow function
// const arrowFun=(a,b) => {
//     s=a+b;
//     return s;
    
// }
// let boxes= document.querySelectorAll(".box");

// let turnO=true;
// const winningPattern=[
//     [0,1,2],[0,3,6],[0,4,8],[3,4,5],[6,7,8],[1,4,7],[2,5,8],[2,4,6]
// ]
// // const resetgame=()=>{
// //     turnO="true";
// //     enableboxes();
// // }
// boxes.forEach((box) => {
// box.addEventListener("click",()=>{
//     // console.log("box was clicked");
//     if(turnO){
//         box.innerText="O";
//         turnO=false;
//     }else{
//         box.innerText="X";
//         turnO=true;
//     }
//     box.disabled="true";
//    checkWinner(); 
//     });
// });

// const checkWinner = () => {
//     for (let pattern of winningPattern) {
//         let pos1 = boxes[pattern[0]].innerText;
//         let pos2 = boxes[pattern[1]].innerText;
//         let pos3 = boxes[pattern[2]].innerText;

//         if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
//             if (pos1 === pos2 && pos2 === pos3) {
//                 alert(`Winner is ${pos1}`);
                
//             }
//         }
//     }
// };
// //reset game  to learn how to reset the game after winning of the person
const cells = [...document.querySelectorAll(".cell")];
const statusText = document.getElementById("status");
const statusRow = document.querySelector(".status-row");
const playerXCard = document.getElementById("playerXCard");
const playerOCard = document.getElementById("playerOCard");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const newGameBtn = document.getElementById("newGame");
const resetScoresBtn = document.getElementById("resetScores");
const soundToggle = document.getElementById("soundToggle");
const toast = document.getElementById("toast");

const winningPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let scores = { X: 0, O: 0 };
let soundOn = false;
let toastTimer;

function playTone(frequency = 440, duration = 0.07) {
  if (!soundOn) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.055, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    oscillator.onended = () => context.close();
  } catch (_) {
    // Sound is an optional enhancement; the game works without it.
  }
}

function setStatus(message, result = false) {
  statusText.textContent = message;
  statusRow.classList.toggle("winner", result);
}

function updateTurnUI() {
  playerXCard.classList.toggle("active", !gameOver && currentPlayer === "X");
  playerOCard.classList.toggle("active", !gameOver && currentPlayer === "O");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function findWinner() {
  for (const pattern of winningPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { player: board[a], pattern };
    }
  }
  return null;
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer === "X" ? "×" : "○";
  cell.classList.add(currentPlayer === "X" ? "mark-x" : "mark-o");
  cell.disabled = true;
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, ${currentPlayer}`);
  playTone(currentPlayer === "X" ? 520 : 390);

  const result = findWinner();
  if (result) {
    gameOver = true;
    result.pattern.forEach(i => cells[i].classList.add("winning"));
    scores[result.player]++;
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    setStatus(`Lovely move! Player ${result.player} wins! ✨`, true);
    updateTurnUI();
    playTone(660, 0.18);
    showToast(`Player ${result.player} takes this round!`);
    return;
  }

  if (board.every(Boolean)) {
    gameOver = true;
    setStatus("It's a draw — great game, play another? ☁");
    updateTurnUI();
    showToast("A perfect tie. Rematch?");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setStatus(`${currentPlayer}'s turn — make your move!`);
  updateTurnUI();
}

function newRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("mark-x", "mark-o", "winning");
    const labels = ["Top left", "Top center", "Top right", "Middle left", "Center", "Middle right", "Bottom left", "Bottom center", "Bottom right"];
    cell.setAttribute("aria-label", labels[index]);
  });
  setStatus("X's turn — make your move!");
  updateTurnUI();
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
newGameBtn.addEventListener("click", () => {
  newRound();
  showToast("Fresh board, fresh start ✳");
  playTone(480);
});
resetScoresBtn.addEventListener("click", () => {
  scores = { X: 0, O: 0 };
  scoreXEl.textContent = "0";
  scoreOEl.textContent = "0";
  newRound();
  showToast("Scores are all fresh again.");
});
soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.setAttribute("aria-pressed", String(soundOn));
  soundToggle.textContent = soundOn ? "♫" : "♪";
  showToast(soundOn ? "Soft sounds on" : "Playing quietly");
  if (soundOn) playTone(520);
});

newRound();
