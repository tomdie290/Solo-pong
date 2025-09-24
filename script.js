const canvas = document.getElementById('canvas'); // Récupère le canvas HTML
const ctx = canvas.getContext('2d'); // Contexte 2D pour dessiner sur le canvas

canvas.width = 350;   // Largeur du canvas (aire de jeu)
canvas.height = 500;  // Hauteur du canvas (aire de jeu)

// --- Raquette ---
const paddleWidth = 100;    // Largeur de la raquette
const paddleHeight = 10;    // Hauteur de la raquette
let paddleX = canvas.width / 2 - paddleWidth / 2; // Position X de la raquette (centrée au départ)
let paddleY = canvas.height - paddleHeight - 10;  // Position Y de la raquette (proche du bas)
const paddleSpeed = 7;      // Vitesse de déplacement de la raquette

// --- Balle ---
let ballX = canvas.width / 2; // Position X de la balle (centrée au départ)
let ballY = canvas.height / 2; // Position Y de la balle (milieu de l’écran)
let ballRadius = 10;           // Rayon de la balle
let ballSpeedX = 8;            // Vitesse horizontale initiale de la balle
let ballSpeedY = 8;            // Vitesse verticale initiale de la balle
let debutPartie = Date.now();  // Moment où la partie a commencé (pour le score)

// --- État du jeu ---
let gaucheAppuyee = false;   // Indique si la flèche gauche est pressée
let droiteAppuyee = false;   // Indique si la flèche droite est pressée
let partieFinie = false;     // Indique si la partie est terminée
let pause = false;           // Indique si le jeu est en pause
let pauseDebut = 0;          // Moment où la pause a commencé
let tempsPauseTotal = 0;     // Temps total passé en pause (pour corriger le score)

// --- Paramètre du rebond latéral ---
let sideSpeedDivider = 10;   // Diviseur pour calculer la vitesse horizontale en fonction de l’endroit où la balle touche la raquette


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

// Touches tactiles
document.querySelector('.fa-arrow-left').addEventListener('touchstart', () => {
    gaucheAppuyee = true;
    if (partieFinie) {
        reinitialiserPartie();
        dessiner();
    }
});
document.querySelector('.fa-arrow-right').addEventListener('touchstart', () => {
    droiteAppuyee = true;
    if (partieFinie) {
        reinitialiserPartie();
        dessiner();
    }
});
document.querySelector('.fa-arrow-left').addEventListener('touchend', () => {
    gaucheAppuyee = false;
});
document.querySelector('.fa-arrow-right').addEventListener('touchend', () => {
    droiteAppuyee = false;
});

// Gestion des touches clavier
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
    if (ballY + ballRadius > canvas.height - paddleHeight - 10) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
            if(ballSpeedX > 0) {
                ballSpeedX = ((ballX - paddleX - paddleWidth/2)/sideSpeedDivider);
            }
            else {
                ballSpeedX = ((ballX - paddleX - paddleWidth/2)/sideSpeedDivider);
            }
        }
        ballSpeedX = ballSpeedX*1.3;
        ballSpeedY = ballSpeedY*1.3;
        console.log(ballSpeedX, ballSpeedY);

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
    let vitesse = 3;
    ballSpeedX = vitesse * Math.cos(angle) * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = -vitesse * Math.sin(angle); 
    debutPartie = Date.now();
    tempsPauseTotal = 0;
    
    partieFinie = false;

    gaucheAppuyee = false;
    droiteAppuyee = false;
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
