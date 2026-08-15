const canvas = document.getElementById("dinoCanvas");
const ctx = canvas.getContext("2d");

// Maximized raw internal hardware workspace dimensions
canvas.width = 1000;
canvas.height = 400;

const groundY = 340; // Floor guide height row mapping

let score = 0;
let highScore = localStorage.getItem("dino_hi_fixed") || 0;
let isGameOver = false;
let gameActive = false;
let speed = 7.5; 
let spawnTimer = 0;
let hatSpawnTimer = 0;
let birdSpawnTimer = 0;

let gameMode = 'normal'; 
let lives = 1;
let invulnerabilityTimer = 0;
let dinoFlyTimer = 0; // Flight duration countdown loop (measured in frames)

let obstacles = [];
let hats = [];
let birds = [];
let confettiParticles = [];

document.getElementById("hi-score").innerText = `HI ${String(highScore).padStart(5, '0')}`;

// Re-proportioned player configurations matching massive display boundaries
let dino = { 
    x: 80, 
    y: groundY - 56, 
    w: 52, 
    h: 56, 
    vy: 0, 
    gravity: 0.85, 
    jump: -16.5,   
    grounded: true, 
    legToggle: false, 
    timer: 0 
};

document.getElementById("btn-hardcore").addEventListener("click", (e) => selectMode('hardcore'));
document.getElementById("btn-normal").addEventListener("click", (e) => selectMode('normal'));
document.getElementById("btn-birthday").addEventListener("click", (e) => selectMode('birthday'));

function selectMode(mode) {
    gameMode = mode;
    document.getElementById("start-overlay").style.display = "none";
    gameActive = true;
    
    const restartBtn = document.getElementById("restart-btn");
    const menuBtn = document.getElementById("menu-btn");

    if (gameMode === 'hardcore') {
        lives = 1;
        document.body.style.backgroundColor = "#e0e0e0";
        document.getElementById("lives-display").style.color = "#000000";
        restartBtn.style.backgroundColor = "#212121";
        menuBtn.style.backgroundColor = "#212121";
    } else if (gameMode === 'normal') {
        lives = 1;
        document.body.style.backgroundColor = "#f7f7f7";
        document.getElementById("lives-display").style.color = "#535353";
        restartBtn.style.backgroundColor = "#535353";
        menuBtn.style.backgroundColor = "#535353";
    } else if (gameMode === 'birthday') {
        lives = 2;
        document.body.style.backgroundColor = "#fce4ec";
        document.getElementById("lives-display").style.color = "#e91e63";
        restartBtn.style.backgroundColor = "#e91e63";
        menuBtn.style.backgroundColor = "#e91e63";
    }
    
    document.getElementById("lives-display").innerText = `LIVES: ${lives}`;
    triggerJump();
}

function triggerJump() {
    if (dino.grounded) {
        dino.vy = dino.jump;
        dino.grounded = false;
    }
}

// Safely closed listener from the end of your snippet
window.addEventListener("keydown", (e) => {
    if ([" ", "ArrowUp", "w"].includes(e.key) && gameActive && !isGameOver) {
        triggerJump();
    }
});
