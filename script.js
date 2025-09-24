const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Taille fixe
canvas.width = 800;
canvas.height = 580;

const paddleWidth = 200, paddleHeight = 10;
let paddleX = canvas.width / 2 - paddleWidth / 2;
let paddleY = canvas.height - paddleHeight - 10;
const paddleSpeed = 7;

let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballRadius = 10;
let ballSpeedX = 4, ballSpeedY = 4;
let debutPartie = Date.now();

let gaucheAppuyee = false, droiteAppuyee = false;
let partieFinie = false;
let pause = false;
let pauseDebut = 0;
let tempsPauseTotal = 0;

const boutonPause = document.getElementById('pauseBtn');
boutonPause.addEventListener('click', () => {
    pause = !pause;
    boutonPause.textContent = pause ? "Reprendre" : "Pause";
    if (pause) {
        pauseDebut = Date.now();
    } else {
        tempsPauseTotal += Date.now() - pauseDebut;
        if (!partieFinie) dessiner();
    }
});
document.querySelector('.fa-arrow-left').addEventListener('mousedown', () => {
    gaucheAppuyee = true;
    if (partieFinie) {
        reinitialiserPartie();
        dessiner();
    }
});
document.querySelector('.fa-arrow-right').addEventListener('mousedown', () => {
    droiteAppuyee = true;
    if (partieFinie) {
        reinitialiserPartie();
        dessiner();
    }
});
document.querySelector('.fa-arrow-left').addEventListener('mouseup', () => {
    gaucheAppuyee = false;
});
document.querySelector('.fa-arrow-right').addEventListener('mouseup', () => {
    droiteAppuyee = false;
});
// Gestion des touches
document.addEventListener('keydown', (e) => {
   if (e.key === 'p' || e.key === 'P') {
        pause = !pause;
        boutonPause.textContent = pause ? "Reprendre" : "Pause";
        if (pause) {
            pauseDebut = Date.now();
        } else {
            tempsPauseTotal += Date.now() - pauseDebut;
            if (!partieFinie) dessiner();
        }
    }
    if (e.key === 'ArrowLeft') gaucheAppuyee = true;
    if (e.key === 'ArrowRight') droiteAppuyee = true;

    if (partieFinie && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        reinitialiserPartie();
        dessiner();
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') gaucheAppuyee = false;
    if (e.key === 'ArrowRight') droiteAppuyee = false;
});

// Affichage du score
function afficherScore() {
    const seconde = Math.floor((Date.now() - debutPartie - tempsPauseTotal) / 1000);
    document.getElementById("Score").innerText = "Score : " + seconde + " secondes";
}

// Affichage de la défaite
function afficherDefaite() {
    const seconde = Math.floor((Date.now() - debutPartie - tempsPauseTotal) / 1000);
    document.getElementById("Score").innerText = "Défaite ! Score final : " + seconde + " secondes";
}

// Dessine la raquette
function dessinerRaquette() {
    ctx.fillStyle='orange';
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

// Dessine la balle
function dessinerBalle() {
    ctx.fillStyle='red';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
}

// Déplacement de la raquette
function deplacerRaquette() {
    if (gaucheAppuyee && paddleX > 0) paddleX -= paddleSpeed;
    if (droiteAppuyee && paddleX < canvas.width - paddleWidth) paddleX += paddleSpeed;
}

// Déplacement de la balle
function deplacerBalle() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

// Collision avec les murs
function verifierCollisionMur() {
    if (ballY - ballRadius < 0) ballSpeedY *= -1;
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) ballSpeedX *= -1;
}

// Collision avec la raquette
function verifierCollisionRaquette() {
    if (
        ballY + ballRadius > paddleY &&
        ballX > paddleX &&
        ballX < paddleX + paddleWidth
    ) {
        ballSpeedY *= -1;
        ballSpeedX *= 1.10;
        ballSpeedY *= 1.10;
    }
}

// Vérifie la défaite
function verifierDefaite() {
    if (ballY + ballRadius > canvas.height) {
        afficherDefaite();
        partieFinie = true;
        return true;
    }
    return false;
}

// Réinitialise la partie
function reinitialiserPartie() {
    paddleX = canvas.width / 2 - paddleWidth / 2;
    paddleY = canvas.height - paddleHeight - 10;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    let angle = Math.random() * Math.PI / 2 + Math.PI / 4; 
    let vitesse = 4;
    ballSpeedX = vitesse * Math.cos(angle) * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = -vitesse * Math.sin(angle); 
    debutPartie = Date.now();
    tempsPauseTotal = 0;
    partieFinie = false;
}

// Boucle principale
function dessiner() {
    if (pause) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    afficherScore();

    dessinerRaquette();
    dessinerBalle();
    deplacerRaquette();
    deplacerBalle();
    verifierCollisionMur();
    verifierCollisionRaquette();

    if (verifierDefaite()) return;

    if (!partieFinie) requestAnimationFrame(dessiner);
}

dessiner();