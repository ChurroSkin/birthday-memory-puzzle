// Dynamic background grid generation
document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.createElement("div");
    gridContainer.id = "bg-grid-container";
    document.body.prepend(gridContainer);

    const cellSize = 120; 
    const cols = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);
    const totalCells = cols * rows;

    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.className = "bg-cell";
        
        const currentRow = Math.floor(i / cols);
        const currentCol = i % cols;

        if ((currentRow + currentCol) % 2 === 0) {
            cell.classList.add("peru");
        } else {
            cell.classList.add("argentina");
        }
        gridContainer.appendChild(cell);
    }
});

// Game Data
const secretAnswer = "Brian";
const storyGroups = [
    { 
        text: "Las bases de nuestra historia.", 
        images: ["private_assets/picture1.jpeg", "private_assets/picture2.jpeg", "private_assets/picture3.jpeg"] 
    },
    { 
        text: "Creciendo juntos.", 
        images: ["private_assets/picture4.jpeg", "private_assets/picture5.jpeg", "private_assets/picture6.jpeg"] 
    },
    { 
        text: "Momentos inolvidables.", 
        images: ["private_assets/picture7.jpeg", "private_assets/picture8.jpeg", "private_assets/picture9.jpeg"] 
    },
    { 
        text: "Construyendo el futuro.", 
        images: ["private_assets/picture10.jpeg", "private_assets/picture11.jpeg", "private_assets/picture12.jpeg"] 
    },
    { 
        text: "Donde estamos hoy.", 
        images: ["private_assets/picture13.jpeg", "private_assets/picture14.jpeg"] 
    }
];
let currentGroupIndex = 0;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const secretInput = document.getElementById('secret-input');
const submitBtn = document.getElementById('submit-btn');
const errorMsg = document.getElementById('error-msg');
const messageDisplay = document.getElementById('message-display');
const nextBtn = document.getElementById('next-btn');
const gameBoard = document.getElementById('game-board');

// Event Listeners
submitBtn.addEventListener('click', checkAnswer);
secretInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
nextBtn.addEventListener('click', () => {
    gameBoard.classList.add('slide-out-left');

    setTimeout(() => {
        currentGroupIndex++;
        loadChapter(currentGroupIndex);
        
        gameBoard.classList.remove('slide-out-left');
        gameBoard.classList.add('slide-in-right');
        
        setTimeout(() => {
            gameBoard.classList.remove('slide-in-right');
        }, 400);
    }, 400);
});

function playDingSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime); 
        gain1.gain.setValueAtTime(0.1, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.4);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.08); 
        gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime + 0.08);
        osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.log("Audio blocked by browser autoplay policy");
    }
}

function checkAnswer() {
    if (secretInput.value.toLowerCase() === secretAnswer.toLowerCase()) {
        secretInput.classList.add('success-border');
        playDingSound();
        document.body.classList.add('global-success-flash');
        
        const gridContainer = document.getElementById('bg-grid-container');
        if (gridContainer) gridContainer.style.opacity = '0';

        welcomeScreen.querySelector('h1').innerText = "¡Bienvenido!";
        errorMsg.style.display = 'none';

        setTimeout(() => {
            document.body.classList.remove('global-success-flash');
            welcomeScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            gameScreen.classList.add('fade-in');
            loadChapter(0);
        }, 1200); 
    } else {
        welcomeScreen.classList.add('shake');
        errorMsg.style.display = 'block';
        setTimeout(() => welcomeScreen.classList.remove('shake'), 400);
    }
}

function loadChapter(index) {
    if (index >= storyGroups.length) {
        messageDisplay.innerText = "¡Gracias por los recuerdos, hermano!";
        nextBtn.style.display = 'none';
        gameBoard.innerHTML = '';
        return;
    }
    const group = storyGroups[index];
    
    messageDisplay.classList.add('fade-out');
    setTimeout(() => {
        messageDisplay.innerText = group.text;
        messageDisplay.classList.remove('fade-out');
        messageDisplay.classList.add('fade-in-quick');
        setTimeout(() => messageDisplay.classList.remove('fade-in-quick'), 250);
    }, 250);

    nextBtn.style.display = 'none';
    gameBoard.innerHTML = '';

    group.images.forEach((imgSrc, imgIndex) => {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.id = `slot-${imgIndex}`;
        
        if (imgIndex === 0) {
            slot.classList.add('active');
        } else {
            slot.classList.add('locked');
        }
        
        gameBoard.appendChild(slot);
        createPuzzleSlices(slot, imgSrc);
    });
}

function createPuzzleSlices(slotContainer, imgSrc) {
    // Definitive goal positions for a perfect 3x3 layout
    const targetCoordinates = [
        {x: 0, y: 0}, {x: 50, y: 0}, {x: 100, y: 0},
        {x: 0, y: 50}, {x: 50, y: 50}, {x: 100, y: 50},
        {x: 0, y: 100}, {x: 50, y: 100}, {x: 100, y: 100}
    ];

    // Create a scrambled list of background placements
    const scrambledCoordinates = [...targetCoordinates].sort(() => Math.random() - 0.5);

    targetCoordinates.forEach((targetCoord, i) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        
        // Give it a random image placement from the scrambled array
        const randomImageSlice = scrambledCoordinates[i];
        piece.style.backgroundImage = `url('${imgSrc}')`;
        piece.style.backgroundPosition = `${randomImageSlice.x}% ${randomImageSlice.y}%`;
        
        piece.style.opacity = '0';
        setTimeout(() => piece.style.opacity = '1', 50 * i);

        // Keep target solution expectations locked to the static container indexes
        piece.dataset.correctX = targetCoord.x;
        piece.dataset.correctY = targetCoord.y;

        addPointerListeners(piece);
        slotContainer.appendChild(piece);
    });
}

let selectedPiece = null;

function addPointerListeners(piece) {
    piece.addEventListener('click', (e) => {
        const currentSlot = e.target.parentElement;
        
        if (currentSlot.classList.contains('locked')) return;

        if (!selectedPiece) {
            selectedPiece = e.target;
            selectedPiece.style.outline = '3px solid #1e3a8a';
            selectedPiece.style.transform = 'scale(0.95)';
            return;
        }

        if (selectedPiece === e.target) {
            selectedPiece.style.outline = 'none';
            selectedPiece.style.transform = 'scale(1)';
            selectedPiece = null;
            return;
        }

        if (selectedPiece.parentElement === currentSlot) {
            const firstPiece = selectedPiece;
            const secondPiece = e.target;

            firstPiece.classList.add('swapping');
            secondPiece.classList.add('swapping');

            // Swap background images and positions
            const tempBgImg = firstPiece.style.backgroundImage;
            const tempBgPos = firstPiece.style.backgroundPosition;
            
            firstPiece.style.backgroundImage = secondPiece.style.backgroundImage;
            firstPiece.style.backgroundPosition = secondPiece.style.backgroundPosition;
            
            secondPiece.style.backgroundImage = tempBgImg;
            secondPiece.style.backgroundPosition = tempBgPos;

            // Clear selected layout styling
            firstPiece.style.outline = 'none';
            firstPiece.style.transform = 'scale(1)';
            
            setTimeout(() => {
                firstPiece.classList.remove('swapping');
                secondPiece.classList.remove('swapping');
                checkSlotSolved(currentSlot);
            }, 50);
        } else {
            selectedPiece.style.outline = 'none';
            selectedPiece.style.transform = 'scale(1)';
            selectedPiece = e.target;
            selectedPiece.style.outline = '3px solid #1e3a8a';
            selectedPiece.style.transform = 'scale(0.95)';
            return;
        }

        selectedPiece = null;
    });
}

function checkSlotSolved(slotElement) {
    const pieces = slotElement.querySelectorAll('.puzzle-piece');
    let completed = true;

    pieces.forEach(piece => {
        const currentPos = piece.style.backgroundPosition.replace(/\s+/g, '');
        const targetPos = `${piece.dataset.correctX}%${piece.dataset.correctY}%`;
        
        if (currentPos !== targetPos) {
            completed = false;
        }
    });

    if (completed) {
        slotElement.classList.remove('active');
        slotElement.style.borderColor = '#22c55e';
        slotElement.classList.add('puzzle-solved-pop');
        
        if (slotElement.id === 'slot-0') {
            setTimeout(() => unlockNextSlot('slot-1'), 600);
        } else if (slotElement.id === 'slot-1') {
            setTimeout(() => unlockNextSlot('slot-2'), 600);
        } else if (slotElement.id === 'slot-2' || !document.getElementById('slot-2')) {
            nextBtn.style.display = 'block';
            nextBtn.classList.add('fade-in');
        }
    }
}

function unlockNextSlot(id) {
    const nextSlot = document.getElementById(id);
    if (nextSlot) {
        nextSlot.classList.remove('locked');
        nextSlot.classList.add('active');
    } else {
        nextBtn.style.display = 'block';
        nextBtn.classList.add('fade-in');
    }
}