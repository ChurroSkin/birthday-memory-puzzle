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
    currentGroupIndex++;
    loadChapter(currentGroupIndex);
});

// --- Logic ---
function checkAnswer() {
    if (secretInput.value.toLowerCase() === secretAnswer.toLowerCase()) {
        secretInput.classList.add('success-border');
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            gameScreen.style.display = 'block';
            gameScreen.classList.add('fade-in');
            loadChapter(0);
        }, 500);
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
    messageDisplay.innerText = group.text;
    nextBtn.style.display = 'block';
    gameBoard.innerHTML = '';
    group.images.forEach(imgSrc => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.style.backgroundImage = `url('${imgSrc}')`;
        gameBoard.appendChild(piece);
    });
}