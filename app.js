const elements = {
  startScreen: document.getElementById("startScreen"),
  gameScreen: document.getElementById("gameScreen"),
  pvpMode: document.getElementById("pvpMode"),
  pvcMode: document.getElementById("pvcMode"),
  difficultySelection: document.getElementById("difficultySelection"),
  playerSetup: document.getElementById("playerSetup"),
  player1Name: document.getElementById("player1Name"),
  player2Name: document.getElementById("player2Name"),
  player2Input: document.getElementById("player2Input"),
  startGame: document.getElementById("startGame"),
  diffButtons: document.querySelectorAll(".diff-btn"),
  boxes: document.querySelectorAll(".box"),
  gameBoard: document.getElementById("gameBoard"),
  backBtn: document.getElementById("backBtn"),
  resetBtn: document.getElementById("resetBtn"),
  newGameBtn: document.getElementById("newGameBtn"),
  modeDisplay: document.getElementById("modeDisplay"),
  displayPlayer1: document.getElementById("displayPlayer1"),
  displayPlayer2: document.getElementById("displayPlayer2"),
  scoreX: document.getElementById("scoreX"),
  scoreO: document.getElementById("scoreO"),
  drawsCount: document.getElementById("drawsCount"),
  playerXCard: document.getElementById("playerXCard"),
  playerOCard: document.getElementById("playerOCard"),
  turnText: document.getElementById("turnText"),
  winLine: document.getElementById("winLine"),
  resultModal: document.getElementById("resultModal"),
  resultIcon: document.getElementById("resultIcon"),
  resultTitle: document.getElementById("resultTitle"),
  resultMessage: document.getElementById("resultMessage"),
  modalMenu: document.getElementById("modalMenu"),
  modalPlayAgain: document.getElementById("modalPlayAgain"),
  confetti: document.getElementById("confetti"),
  themeToggle: document.getElementById("themeToggle"),
  soundToggle: document.getElementById("soundToggle"),
  particles: document.getElementById("particles"),
};

const gameState = {
  mode: "pvp",
  difficulty: "medium",
  currentPlayer: "X",
  board: ["", "", "", "", "", "", "", "", ""],
  gameActive: true,
  scores: { X: 0, O: 0, draws: 0 },
  players: { X: "Player 1", O: "Player 2" },
  soundEnabled: true,
  theme: "dark",
};

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getLineCoords(patternIndex) {
  const board = elements.gameBoard;
  const boardRect = board.getBoundingClientRect();
  function getBoxCenter(boxIndex) {
    const box = elements.boxes[boxIndex];
    const boxRect = box.getBoundingClientRect();
    return {
      x: boxRect.left - boardRect.left + boxRect.width / 2,
      y: boxRect.top - boardRect.top + boxRect.height / 2,
    };
  }
  const pattern = winPatterns[patternIndex];
  const start = getBoxCenter(pattern[0]);
  const end = getBoxCenter(pattern[2]);
  return {
    x1: start.x,
    y1: start.y,
    x2: end.x,
    y2: end.y,
  };
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
};
const playSound = (type) => {
  if (!gameState.soundEnabled || !audioCtx) return;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  switch (type) {
    case "click":
      oscillator.frequency.value = 600;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.1
      );
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.1);
      break;
    case "win":
      oscillator.frequency.value = 523.25;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      oscillator.start(audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.4
      );
      oscillator.stop(audioCtx.currentTime + 0.4);
      break;
    case "draw":
      oscillator.frequency.value = 300;
      oscillator.type = "triangle";
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.3
      );
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
      break;
    case "reset":
      oscillator.frequency.value = 400;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(300, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.2
      );
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.2);
      break;
  }
};

const createParticles = () => {
  const colors = ["#6366f1", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 15 + "s";
    particle.style.animationDuration = 10 + Math.random() * 10 + "s";
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.width = 4 + Math.random() * 4 + "px";
    particle.style.height = particle.style.width;
    elements.particles.appendChild(particle);
  }
};

const createConfetti = () => {
  elements.confetti.innerHTML = "";
  const colors = [
    "#6366f1",
    "#ec4899",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#f472b6",
    "#38bdf8",
  ];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti-piece";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDelay = Math.random() * 0.5 + "s";
    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    elements.confetti.appendChild(confetti);
  }
};

const toggleTheme = () => {
  gameState.theme = gameState.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", gameState.theme);
  elements.themeToggle.innerHTML =
    gameState.theme === "dark"
      ? '<i class="fas fa-moon"></i>'
      : '<i class="fas fa-sun"></i>';
  localStorage.setItem("ttt-theme", gameState.theme);
};

const toggleSound = () => {
  gameState.soundEnabled = !gameState.soundEnabled;
  elements.soundToggle.classList.toggle("muted", !gameState.soundEnabled);
  elements.soundToggle.innerHTML = gameState.soundEnabled
    ? '<i class="fas fa-volume-high"></i>'
    : '<i class="fas fa-volume-xmark"></i>';
  localStorage.setItem("ttt-sound", gameState.soundEnabled);
};

const initSettings = () => {
  const savedTheme = localStorage.getItem("ttt-theme");
  const savedSound = localStorage.getItem("ttt-sound");
  if (savedTheme) {
    gameState.theme = savedTheme;
    document.documentElement.setAttribute("data-theme", savedTheme);
    elements.themeToggle.innerHTML =
      savedTheme === "dark"
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
  }
  if (savedSound !== null) {
    gameState.soundEnabled = savedSound === "true";
    elements.soundToggle.classList.toggle("muted", !gameState.soundEnabled);
    elements.soundToggle.innerHTML = gameState.soundEnabled
      ? '<i class="fas fa-volume-high"></i>'
      : '<i class="fas fa-volume-xmark"></i>';
  }
};

const showScreen = (screen) => {
  elements.startScreen.classList.add("hide");
  elements.gameScreen.classList.add("hide");
  if (screen === "start") {
    elements.startScreen.classList.remove("hide");
    resetStartScreen();
  } else if (screen === "game") {
    elements.gameScreen.classList.remove("hide");
  }
};

const resetStartScreen = () => {
  elements.difficultySelection.classList.add("hide");
  elements.playerSetup.classList.add("hide");
  elements.player1Name.value = "";
  elements.player2Name.value = "";
};

const selectPvP = () => {
  gameState.mode = "pvp";
  elements.player2Input.style.display = "flex";
  elements.player2Name.placeholder = "Player 2";
  elements.difficultySelection.classList.add("hide");
  elements.playerSetup.classList.remove("hide");
};

const selectPvC = () => {
  gameState.mode = "pvc";
  elements.difficultySelection.classList.remove("hide");
};

const selectDifficulty = (difficulty) => {
  gameState.difficulty = difficulty;
  elements.player2Input.style.display = "none";
  elements.playerSetup.classList.remove("hide");
  elements.diffButtons.forEach((btn) => {
    btn.style.borderColor =
      btn.dataset.difficulty === difficulty ? "var(--primary)" : "transparent";
  });
};

const startGameHandler = () => {
  initAudio();
  gameState.players.X = elements.player1Name.value.trim() || "Player 1";
  gameState.players.O =
    gameState.mode === "pvc"
      ? `AI (${
          gameState.difficulty.charAt(0).toUpperCase() +
          gameState.difficulty.slice(1)
        })`
      : elements.player2Name.value.trim() || "Player 2";

  elements.displayPlayer1.textContent = gameState.players.X;
  elements.displayPlayer2.textContent = gameState.players.O;
  elements.modeDisplay.textContent =
    gameState.mode === "pvp" ? "Player vs Player" : "Player vs AI";
  resetGame();
  showScreen("game");
};

const updateTurnDisplay = () => {
  elements.playerXCard.classList.toggle(
    "active",
    gameState.currentPlayer === "X"
  );
  elements.playerOCard.classList.toggle(
    "active",
    gameState.currentPlayer === "O"
  );
  elements.turnText.textContent = `${
    gameState.players[gameState.currentPlayer]
  }'s Turn`;
  elements.turnText.className =
    gameState.currentPlayer === "X" ? "x-turn" : "o-turn";
  elements.boxes.forEach((box) => {
    if (!box.classList.contains("x") && !box.classList.contains("o")) {
      box.setAttribute("data-preview", gameState.currentPlayer);
    }
  });
};

const handleBoxClick = (index) => {
  if (!gameState.gameActive || gameState.board[index] !== "") return;
  makeMove(index);
  if (
    gameState.mode === "pvc" &&
    gameState.gameActive &&
    gameState.currentPlayer === "O"
  ) {
    elements.gameBoard.classList.add("ai-thinking");
    setTimeout(() => {
      const aiMove = getAIMove();
      if (aiMove !== -1) {
        makeMove(aiMove);
      }
      elements.gameBoard.classList.remove("ai-thinking");
    }, 500);
  }
};

const makeMove = (index) => {
  gameState.board[index] = gameState.currentPlayer;
  const box = elements.boxes[index];
  box.textContent = gameState.currentPlayer;
  box.classList.add(gameState.currentPlayer.toLowerCase());
  box.disabled = true;
  playSound("click");
  const winResult = checkWin();
  if (winResult) {
    handleWin(winResult);
  } else if (checkDraw()) {
    handleDraw();
  } else {
    gameState.currentPlayer = gameState.currentPlayer === "X" ? "O" : "X";
    updateTurnDisplay();
  }
};

const checkWin = () => {
  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i];
    if (
      gameState.board[a] &&
      gameState.board[a] === gameState.board[b] &&
      gameState.board[a] === gameState.board[c]
    ) {
      return {
        winner: gameState.board[a],
        pattern: winPatterns[i],
        patternIndex: i,
      };
    }
  }
  return null;
};

const checkDraw = () => {
  return gameState.board.every((cell) => cell !== "");
};

const handleWin = (result) => {
  gameState.gameActive = false;
  gameState.scores[result.winner]++;
  elements.scoreX.textContent = gameState.scores.X;
  elements.scoreO.textContent = gameState.scores.O;
  result.pattern.forEach((index) => {
    elements.boxes[index].classList.add("win");
  });
  drawWinLine(result.patternIndex);
  elements.boxes.forEach((box) => (box.disabled = true));
  playSound("win");
  setTimeout(() => {
    showResultModal(result.winner);
  }, 800);
};

const drawWinLine = (patternIndex) => {
  const line = elements.winLine.querySelector("line");
  const coords = getLineCoords(patternIndex);
  const board = elements.gameBoard;
  const w = board.offsetWidth;
  const h = board.offsetHeight;
  elements.winLine.setAttribute("viewBox", "0 0 " + w + " " + h);
  line.setAttribute("x1", coords.x1);
  line.setAttribute("y1", coords.y1);
  line.setAttribute("x2", coords.x2);
  line.setAttribute("y2", coords.y2);
  elements.winLine.classList.add("animate");
};

const handleDraw = () => {
  gameState.gameActive = false;
  gameState.scores.draws++;
  elements.drawsCount.textContent = gameState.scores.draws;
  playSound("draw");
  setTimeout(() => {
    showResultModal(null);
  }, 500);
};

const showResultModal = (winner) => {
  if (winner) {
    createConfetti();
    elements.resultIcon.className = "result-icon winner";
    elements.resultIcon.innerHTML = '<i class="fas fa-trophy"></i>';
    elements.resultTitle.textContent = "Winner!";
    elements.resultTitle.className = `result-title ${winner.toLowerCase()}-winner`;
    elements.resultMessage.textContent = `${gameState.players[winner]} wins the game!`;
  } else {
    elements.resultIcon.className = "result-icon draw";
    elements.resultIcon.innerHTML = '<i class="fas fa-handshake"></i>';
    elements.resultTitle.textContent = "It's a Draw!";
    elements.resultTitle.className = "result-title draw";
    elements.resultMessage.textContent = "No winner this round. Try again!";
  }

  elements.resultModal.classList.remove("hide");
};

const hideResultModal = () => {
  elements.resultModal.classList.add("hide");
};

const resetGame = () => {
  gameState.board = ["", "", "", "", "", "", "", "", ""];
  gameState.currentPlayer = "X";
  gameState.gameActive = true;
  elements.boxes.forEach((box) => {
    box.textContent = "";
    box.className = "box";
    box.disabled = false;
    box.removeAttribute("data-preview");
  });
  elements.winLine.classList.remove("animate");
  elements.winLine.querySelector("line").setAttribute("x1", 0);
  elements.winLine.querySelector("line").setAttribute("y1", 0);
  elements.winLine.querySelector("line").setAttribute("x2", 0);
  elements.winLine.querySelector("line").setAttribute("y2", 0);
  updateTurnDisplay();
  playSound("reset");
};

const newGame = () => {
  gameState.scores = { X: 0, O: 0, draws: 0 };
  elements.scoreX.textContent = "0";
  elements.scoreO.textContent = "0";
  elements.drawsCount.textContent = "0";
  resetGame();
};

const getAIMove = () => {
  const emptyIndices = gameState.board
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);

  if (emptyIndices.length === 0) return -1;
  switch (gameState.difficulty) {
    case "easy":
      return getRandomMove(emptyIndices);
    case "medium":
      return Math.random() < 0.6 ? getBestMove() : getRandomMove(emptyIndices);
    case "hard":
      return getBestMove();
    default:
      return getRandomMove(emptyIndices);
  }
};

const getRandomMove = (emptyIndices) => {
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
};

const getBestMove = () => {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (gameState.board[i] === "") {
      gameState.board[i] = "O";
      const score = minimax(gameState.board, 0, false);
      gameState.board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
};

const minimax = (board, depth, isMaximizing) => {
  const winner = checkWinnerMinimax(board);

  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every((cell) => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        const score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        const score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

const checkWinnerMinimax = (board) => {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

elements.pvpMode.addEventListener("click", selectPvP);
elements.pvcMode.addEventListener("click", selectPvC);

elements.diffButtons.forEach((btn) => {
  btn.addEventListener("click", () => selectDifficulty(btn.dataset.difficulty));
});

elements.startGame.addEventListener("click", startGameHandler);

elements.boxes.forEach((box, index) => {
  box.addEventListener("click", () => handleBoxClick(index));
});

elements.backBtn.addEventListener("click", () => {
  newGame();
  showScreen("start");
});
elements.resetBtn.addEventListener("click", resetGame);
elements.newGameBtn.addEventListener("click", newGame);

elements.modalMenu.addEventListener("click", () => {
  hideResultModal();
  newGame();
  showScreen("start");
});
elements.modalPlayAgain.addEventListener("click", () => {
  hideResultModal();
  resetGame();
});

elements.themeToggle.addEventListener("click", toggleTheme);
elements.soundToggle.addEventListener("click", toggleSound);

const init = () => {
  createParticles();
  initSettings();
  showScreen("start");
};

init();
