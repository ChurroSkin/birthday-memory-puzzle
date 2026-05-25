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

submitBtn.addEventListener('click', () => {
    if (secretInput.value.toLowerCase() === secretAnswer.toLowerCase()) {
        welcomeScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        loadChapter(0);
    } else {
        errorMsg.style.display = 'block';
    }
});

function loadChapter(index) {
    if (index >= storyData.length) {
        messageDisplay.innerText = "The End. Thanks for the memories!";
        return;
    }
    const data = storyData[index];
    messageDisplay.innerText = data.text;
    console.log("Displaying image:", data.image);
    // Puzzle logic will be added here!
}