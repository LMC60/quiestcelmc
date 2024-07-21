const characters = [
    'Character 1', 'Character 2', 'Character 3', 'Character 4', 'Character 5', 'Character 6',
    'Character 7', 'Character 8', 'Character 9', 'Character 10', 'Character 11', 'Character 12',
    'Character 13', 'Character 14', 'Character 15', 'Character 16', 'Character 17', 'Character 18',
    'Character 19', 'Character 20', 'Character 21', 'Character 22', 'Character 23', 'Character 24',
];

// Select 24 random characters from the 60 available
const selectedCharacters = characters.sort(() => 0.5 - Math.random()).slice(0, 24);

// Helper function to get the image path
function getImagePath(character) {
    const formats = ['jpg', 'png', 'gif', 'jpeg', 'webp'];
    const baseName = `images/${character.replace(' ', '_').toLowerCase()}`;
    
    for (const format of formats) {
        const path = `${baseName}.${format}`;
        if (imageExists(path)) {
            return path;
        }
    }
    return null;
}

// Check if an image exists
function imageExists(url) {
    const http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status !== 404;
}

// Generate the character grid
const gameBoard = document.getElementById('game-board');
const characterElements = [];

selectedCharacters.forEach(character => {
    const charDiv = document.createElement('div');
    charDiv.className = 'character';
    
    const imgPath = getImagePath(character);
    if (imgPath) {
        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = character;
        charDiv.appendChild(img);
    } else {
        charDiv.textContent = character;
    }
    
    charDiv.addEventListener('click', () => {
        charDiv.classList.toggle('flipped');
    });
    gameBoard.appendChild(charDiv);
    characterElements.push(charDiv);
});

const questionInput = document.getElementById('question');
const submitQuestionBtn = document.getElementById('submit-question-btn');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const resetBtn = document.getElementById('reset-btn');

submitQuestionBtn.addEventListener('click', () => {
    const question = questionInput.value;
    if (question.trim()) {
        fetch('update_game.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'question', text: question })
        });
        questionInput.value = '';
    }
});

yesBtn.addEventListener('click', () => {
    fetch('update_game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'response', text: 'Yes' })
    });
});

noBtn.addEventListener('click', () => {
    fetch('update_game.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'response', text: 'No' })
    });
});

resetBtn.addEventListener('click', () => {
    characterElements.forEach(character => {
        character.classList.remove('flipped');
    });
});

function checkForUpdates() {
    fetch('get_updates.php')
        .then(response => response.json())
        .then(data => {
            if (data.type === 'question') {
                alert(`Question: ${data.text}`);
            } else if (data.type === 'response') {
                alert(`Response: ${data.text}`);
            }
        });
}

setInterval(checkForUpdates, 3000); // Poll every 3 seconds
