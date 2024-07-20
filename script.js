// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCxWyoCHLnuesYxy12XSkUWrcv3lqEuZtg",
    authDomain: "quiestcelmc.firebaseapp.com",
    databaseURL: "https://quiestcelmc-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "quiestcelmc",
    storageBucket: "quiestcelmc.appspot.com",
    messagingSenderId: "1053648071695",
    appId: "1:1053648071695:web:59b2830fe333e682e2477a"
};


// Liste des personnages
const characters = [
    'Character 1', 'Character 2', 'Character 3', 'Character 4', 'Character 5', 'Character 6',
    'Character 7', 'Character 8', 'Character 9', 'Character 10', 'Character 11', 'Character 12',
    'Character 13', 'Character 14', 'Character 15', 'Character 16', 'Character 17', 'Character 18',
    'Character 19', 'Character 20', 'Character 21', 'Character 22', 'Character 23', 'Character 24'
];

const gameBoard = document.getElementById('game-board');
const questionInput = document.getElementById('question');
const submitQuestionBtn = document.getElementById('submit-question-btn');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const resetBtn = document.getElementById('reset-btn');
const displayQuestion = document.getElementById('display-question');
const displayResponse = document.getElementById('display-response');

// Liste des formats d'image à tester
const imageFormats = ['jpg', 'png', 'webp'];

// Fonction pour tester un chemin d'image
function checkImageExists(url, callback) {
    const img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
}

// Fonction pour générer le plateau de jeu
function generateBoard() {
    const shuffledCharacters = shuffle([...characters]); // Cloner et mélanger les caractères
    gameBoard.innerHTML = ''; // Effacer le plateau existant

    shuffledCharacters.forEach(character => {
        const charDiv = document.createElement('div');
        charDiv.className = 'character';

        // Essayer chaque format d'image
        let imageLoaded = false;
        const tryFormats = (index) => {
            if (index >= imageFormats.length) {
                console.error(`Image not found for character: ${character}`);
                return;
            }

            const format = imageFormats[index];
            const imgPath = `images/${character.replace(' ', '_').toLowerCase()}.${format}`;
            checkImageExists(imgPath, (exists) => {
                if (exists) {
                    const img = document.createElement('img');
                    img.src = imgPath;
                    img.alt = character;
                    charDiv.appendChild(img);
                    imageLoaded = true;
                } else {
                    tryFormats(index + 1);
                }
            });
        };

        tryFormats(0);

        charDiv.addEventListener('click', () => {
            if (imageLoaded) {
                charDiv.classList.toggle('flipped');
            }
        });

        gameBoard.appendChild(charDiv);
    });
}

// Fonction pour mélanger les caractères
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Initialiser le plateau de jeu
generateBoard();

// Gérer la soumission de la question
submitQuestionBtn.addEventListener('click', () => {
    const question = questionInput.value.trim();
    if (question) {
        database.ref('game/question').set({
            text: question,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        questionInput.value = '';
    }
});

// Gérer les réponses Oui / Non
yesBtn.addEventListener('click', () => {
    database.ref('game/answer').set('Oui');
});

noBtn.addEventListener('click', () => {
    database.ref('game/answer').set('Non');
});

// Réinitialiser le plateau
resetBtn.addEventListener('click', () => {
    database.ref('game').remove();
    generateBoard();
});

// Écouter les changements dans la base de données
database.ref('game/question').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data && data.text) {
        displayQuestion.textContent = `Question: ${data.text}`;
    }
});

database.ref('game/answer').on('value', (snapshot) => {
    const answer = snapshot.val();
    if (answer) {
        displayResponse.textContent = `Dernière Réponse: ${answer}`;
    }
});