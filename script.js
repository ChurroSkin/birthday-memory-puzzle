const secretAnswer = "Brian";
const storyData = [
    { text: "Como olvidar las noches de futbol.", image: "picture1.jpeg" },
    { text: "Las salidas legendarias.", image: "picture2.jpeg" },
    // Add all 14 objects here...
];

let currentChapter = 0;

const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const secretInput = document.getElementById('secret-input');
const submitBtn = document.getElementById('submit-btn');
const errorMsg = document.getElementById('error-msg');
const messageDisplay = document.getElementById('message-display');
const nextBtn = document.getElementById('next-btn');

// Unlock logic
submitBtn.addEventListener('click', checkAnswer);
secretInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });

function checkAnswer() {
    if (secretInput.value.toLowerCase() === secretAnswer.toLowerCase()) {
        welcomeScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        loadChapter(0);
    } else {
        errorMsg.style.display = 'block';
    }
}

// Chapter navigation
nextBtn.addEventListener('click', () => {
    currentChapter++;
    loadChapter(currentChapter);
});

function loadChapter(index) {
    if (index >= storyData.length) {
        messageDisplay.innerText = "¡Gracias por los recuerdos, hermano!";
        nextBtn.style.display = 'none';
        return;
    }
    const data = storyData[index];
    messageDisplay.innerText = data.text;
    nextBtn.style.display = 'block';
    console.log("Loading image for puzzle:", data.image);
}