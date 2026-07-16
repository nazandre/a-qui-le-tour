// Noms par défaut
let names = ['Titus', 'Leonitus'];
let isSpinning = false;
let currentRotation = 0;

// Palette de couleurs pour les segments de la roue
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E2', '#F8B88B', '#A9DFBF', '#F5B7B1', '#D5A6BD'
];

// Initialisation
window.addEventListener('load', () => {
    loadNamesFromStorage();
    updateNamesList();
    drawWheel();
    setupFireworks();
});

// Gestion du stockage local
function saveNamesToStorage() {
    localStorage.setItem('wheelNames', JSON.stringify(names));
}

function loadNamesFromStorage() {
    const stored = localStorage.getItem('wheelNames');
    if (stored) {
        names = JSON.parse(stored);
    }
}

// Gestion des noms
function addName() {
    const input = document.getElementById('nameInput');
    const name = input.value.trim();
    
    if (!name) {
        alert('Veuillez entrer un nom');
        return;
    }
    
    if (names.includes(name)) {
        alert('Ce nom existe déjà');
        return;
    }
    
    names.push(name);
    input.value = '';
    saveNamesToStorage();
    updateNamesList();
    drawWheel();
}

function removeName(index) {
    if (names.length <= 1) {
        alert('Vous devez avoir au moins un nom');
        return;
    }
    names.splice(index, 1);
    saveNamesToStorage();
    updateNamesList();
    drawWheel();
}

function updateNamesList() {
    const list = document.getElementById('namesList');
    list.innerHTML = names.map((name, index) => `
        <div class="name-tag">
            ${name}
            <button onclick="removeName(${index})">×</button>
        </div>
    `).join('');
}

// Dessin de la roue
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Au minimum 6 segments
    let segments = Math.max(6, names.length);
    const anglePerSegment = (Math.PI * 2) / segments;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les segments
    for (let i = 0; i < segments; i++) {
        const startAngle = i * anglePerSegment + currentRotation;
        const endAngle = (i + 1) * anglePerSegment + currentRotation;

        // Déterminer quel nom afficher (cycler à travers les noms si segments > noms)
        const nameIndex = i % names.length;

        // Dessiner le segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Dessiner le texte
        const textAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.65;
        const textX = centerX + textRadius * Math.cos(textAngle);
        const textY = centerY + textRadius * Math.sin(textAngle);

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle + Math.PI / 2);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(names[nameIndex], 0, 0);
        ctx.restore();
    }

    // Dessiner le cercle central
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LANCER', centerX, centerY);
}

// Animation de rotation
function spinWheel() {
    if (isSpinning || names.length === 0) return;

    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = true;
    isSpinning = true;

    // Masquer le résultat précédent
    document.getElementById('resultDisplay').classList.add('hidden');

    // Rotation cible aléatoire (10 tours complets + angle aléatoire)
    const spins = 10;
    const randomOffset = Math.random() * Math.PI * 2;
    const targetRotation = currentRotation + (spins * Math.PI * 2) + randomOffset;

    // Paramètres d'animation
    const spinDuration = 10000; // 10 secondes
    const startTime = Date.now();
    const startRotation = currentRotation;

    // Fonction d'assouplissement (ease-out cubic)
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Appliquer l'assouplissement
        const easedProgress = easeOutCubic(progress);
        currentRotation = startRotation + (targetRotation - startRotation) * easedProgress;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinButton.disabled = false;
            
            // Déterminer le nom gagnant
            const segments = Math.max(6, names.length);
            const anglePerSegment = (Math.PI * 2) / segments;
            
            // Le pointeur est en haut (angle 0), donc on doit trouver quel segment il pointe
            const normalizedRotation = ((currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            const pointerAngle = (Math.PI * 2 - normalizedRotation) % (Math.PI * 2);
            const winningSegment = Math.floor(pointerAngle / anglePerSegment);
            const winningNameIndex = winningSegment % names.length;

            // Afficher le résultat
            showResult(names[winningNameIndex]);
            
            // Déclencher les feux d'artifice
            createFireworks();
        }
    }

    animate();
}

function showResult(name) {
    const resultDisplay = document.getElementById('resultDisplay');
    const resultText = document.getElementById('resultText');
    
    resultText.textContent = name;
    resultDisplay.classList.remove('hidden');
}

// Animation des feux d'artifice
let fireworksContext = null;
let particles = [];

function setupFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fireworksContext = canvas.getContext('2d');
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15 - 5;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.015;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 5 + 3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // gravité
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createFireworks() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(centerX, centerY));
    }

    animateFireworks();
}

function animateFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = fireworksContext;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0);

    particles.forEach(p => {
        p.update();
        p.draw(ctx);
    });

    if (particles.length > 0) {
        requestAnimationFrame(animateFireworks);
    }
}

// Permettre la touche Entrée pour ajouter des noms
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addName();
        }
    });
    
    // Setup button handler
    const spinButton = document.getElementById('spinButton');
    spinButton.addEventListener('click', function(e) {
        e.preventDefault();
        const resultDisplay = document.getElementById('resultDisplay');
        
        // Si un résultat est affiché, le masquer et permettre un nouveau spin
        if (!resultDisplay.classList.contains('hidden')) {
            resultDisplay.classList.add('hidden');
        } else {
            // Sinon, lancer la roue
            spinWheel();
        }
    });
});
