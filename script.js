// --- Data ---
const secretAnswer = "Brian";
const storyGroups = [
    { text: "Las bases de nuestra historia.", images: ["picture1.jpeg", "picture2.jpeg", "picture3.jpeg"] },
    { text: "Creciendo juntos.", images: ["picture4.jpeg", "picture5.jpeg", "picture6.jpeg"] },
    { text: "Momentos inolvidables.", images: ["picture7.jpeg", "picture8.jpeg", "picture9.jpeg"] },
    { text: "Construyendo el futuro.", images: ["picture10.jpeg", "picture11.jpeg", "picture12.jpeg"] },
    { text: "Donde estamos hoy.", images: ["picture13.jpeg", "picture14.jpeg"] }
];
let currentGroupIndex = 0;

// --- Selectors ---
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const secretInput = document.getElementById('secret-input');
const submitBtn = document.getElementById('submit-btn');
const errorMsg = document.getElementById('error-msg');
const messageDisplay = document.getElementById('message-display');
const nextBtn = document.getElementById('next-btn');
const gameBoard = document.getElementById('game-board');

// --- Listeners ---
submitBtn.addEventListener('click', checkAnswer);
secretInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });
nextBtn.addEventListener('click', () => {
    // 1. Begin exit animation for the old stage
    gameBoard.classList.add('slide-out-left');

    // 2. Wait for the exit animation (400ms) to complete before swapping data
    setTimeout(() => {
        currentGroupIndex++;
        loadChapter(currentGroupIndex);
        
        // 3. Clean up the exit class and begin the entrance animation
        gameBoard.classList.remove('slide-out-left');
        gameBoard.classList.add('slide-in-right');
        
        // 4. Clean up the entrance class so it can be re-played later
        setTimeout(() => {
            gameBoard.classList.remove('slide-in-right');
        }, 400);
    }, 400);
});

// --- Sound Synthesizer Engine (Web Audio API) ---
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
        console.log("Audio presentation blocked or unsupported on initial interaction context.");
    }
}

// --- Logic ---
function checkAnswer() {
    if (secretInput.value.toLowerCase() === secretAnswer.toLowerCase()) {
        secretInput.classList.add('success-border');
        
        playDingSound();
        
        document.body.classList.add('global-success-flash');
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
    
    // Add smooth message transition
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
    const coordinates = [
        {x: 0, y: 0}, {x: 50, y: 0}, {x: 100, y: 0},
        {x: 0, y: 50}, {x: 50, y: 50}, {x: 100, y: 50},
        {x: 0, y: 100}, {x: 50, y: 100}, {x: 100, y: 100}
    ];

    const scrambledCoordinates = [...coordinates].sort(() => Math.random() - 0.5);

    scrambledCoordinates.forEach((coord, i) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.backgroundImage = `url('${imgSrc}')`;
        piece.style.backgroundPosition = `${coord.x}% ${coord.y}%`;
        
        // Stagger the pieces coming into view for extra smoothness
        piece.style.opacity = '0';
        setTimeout(() => piece.style.opacity = '1', 50 * i);

        piece.dataset.correctX = coord.x;
        piece.dataset.correctY = coord.y;

        addPointerListeners(piece);
        slotContainer.appendChild(piece);
    });
}

let activePiece = null;
let originalSlot = null;

function addPointerListeners(piece) {
    piece.addEventListener('pointerdown', (e) => {
        if (e.target.parentElement.classList.contains('locked')) return;

        activePiece = e.target;
        originalSlot = activePiece.parentElement;
        
        activePiece.style.opacity = '0.6';
        activePiece.style.transform = 'scale(1.04)'; // Subtle lift on press
        activePiece.setPointerCapture(e.pointerId);
    });

    piece.addEventListener('pointerup', (e) => {
        if (!activePiece) return;

        activePiece.style.opacity = '1';
        activePiece.style.transform = 'scale(1)';
        activePiece.releasePointerCapture(e.pointerId);

        const dropTarget = document.elementFromPoint(e.clientX, e.clientY);

        if (
            dropTarget && 
            dropTarget.classList.contains('puzzle-piece') && 
            dropTarget !== activePiece &&
            dropTarget.parentElement === originalSlot
        ) {
            // Smooth swap logic: Add visual feedback during the swap
            activePiece.classList.add('swapping');
            dropTarget.classList.add('swapping');

            setTimeout(() => {
                const originalBgImg = activePiece.style.backgroundImage;
                const originalBgPos = activePiece.style.backgroundPosition;
                
                activePiece.style.backgroundImage = dropTarget.style.backgroundImage;
                activePiece.style.backgroundPosition = dropTarget.style.backgroundPosition;
                
                dropTarget.style.backgroundImage = originalBgImg;
                dropTarget.style.backgroundPosition = originalBgPos;

                const originalX = activePiece.dataset.correctX;
                const originalY = activePiece.dataset.correctY;

                activePiece.dataset.correctX = dropTarget.dataset.correctX;
                activePiece.dataset.correctY = dropTarget.dataset.correctY;

                dropTarget.dataset.correctX = originalX;
                dropTarget.dataset.correctY = originalY;

                activePiece.classList.remove('swapping');
                dropTarget.classList.remove('swapping');

                checkSlotSolved(originalSlot);
            }, 50); // Short delay makes the swap look cleaner
        }

        activePiece = null;
        originalSlot = null;
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
        
        // Slightly longer delay before unlocking next slot to admire the complete image
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