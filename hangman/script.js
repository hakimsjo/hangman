const MAX_WRONG = 10;
let selectedWord = '';
let guessedLetters = [];
let wrongGuesses = 0;
let gameActive = true;

function pickWord() {
    selectedWord = WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase();
}

function drawGallows(stage) {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Om vinst: rita endast glad gubbe med armar uppåt och fötter på marken
    if (typeof wrongGuesses !== 'undefined' && typeof gameActive !== 'undefined' && gameActive === false && selectedWord.split('').every(l => guessedLetters.includes(l))) {
        // Huvud
        ctx.beginPath(); ctx.arc(180, 90, 20, 0, Math.PI * 2); ctx.strokeStyle = '#333'; ctx.lineWidth = 4; ctx.stroke();
        // Kropp
        ctx.beginPath(); ctx.moveTo(180, 110); ctx.lineTo(180, 180); ctx.stroke();
        // Vänster arm uppåt
        ctx.beginPath(); ctx.moveTo(180, 120); ctx.lineTo(140, 70); ctx.stroke();
        // Höger arm uppåt
        ctx.beginPath(); ctx.moveTo(180, 120); ctx.lineTo(220, 70); ctx.stroke();
        // Vänster ben
        ctx.beginPath(); ctx.moveTo(180, 180); ctx.lineTo(160, 270); ctx.stroke();
        // Höger ben
        ctx.beginPath(); ctx.moveTo(180, 180); ctx.lineTo(200, 270); ctx.stroke();
        // Vänster hand (ändpunkt vänster arm)
        ctx.beginPath(); ctx.arc(140, 70, 7, 0, Math.PI * 2); ctx.stroke();
        // Höger hand (ändpunkt höger arm)
        ctx.beginPath(); ctx.arc(220, 70, 7, 0, Math.PI * 2); ctx.stroke();
        // Vänster fot (ändpunkt vänster ben)
        ctx.beginPath(); ctx.arc(160, 270, 7, 0, Math.PI * 2); ctx.stroke();
        // Höger fot (ändpunkt höger ben)
        ctx.beginPath(); ctx.arc(200, 270, 7, 0, Math.PI * 2); ctx.stroke();
        // Vänster öga
        ctx.beginPath(); ctx.arc(172, 85, 3, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
        // Höger öga
        ctx.beginPath(); ctx.arc(188, 85, 3, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
        // Näsa
        ctx.beginPath(); ctx.moveTo(180, 90); ctx.lineTo(180, 98); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
        // Glad mun (uppflyttad till ansiktet, i nivå med de andra munnarna)
        ctx.beginPath(); ctx.arc(180, 105, 8, Math.PI * 0.1, Math.PI * 0.9, false); ctx.strokeStyle = 'green'; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = '#333'; ctx.lineWidth = 4; // återställ
        return;
    }
    // Annars: rita galge och gubbe enligt felsteg
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    // Bas
    ctx.beginPath(); ctx.moveTo(30, 270); ctx.lineTo(270, 270); ctx.stroke();
    // Stolpe
    ctx.beginPath(); ctx.moveTo(60, 270); ctx.lineTo(60, 40); ctx.stroke();
    // Tvärslå
    ctx.beginPath(); ctx.moveTo(60, 40); ctx.lineTo(180, 40); ctx.stroke();
    // Rep
    ctx.beginPath(); ctx.moveTo(180, 40); ctx.lineTo(180, 70); ctx.stroke();

    if (stage > 0) { // Huvud
        ctx.beginPath(); ctx.arc(180, 90, 20, 0, Math.PI * 2); ctx.stroke();
    }
    if (stage > 1) { // Kropp
        ctx.beginPath(); ctx.moveTo(180, 110); ctx.lineTo(180, 180); ctx.stroke();
    }
    // Armar: nedåt om spelet pågår eller förlust, uppåt om vinst
    if (stage > 2) {
        // Vänster arm
        ctx.beginPath(); ctx.moveTo(180, 130); ctx.lineTo(150, 160); ctx.stroke();
    }
    if (stage > 3) {
        // Höger arm
        ctx.beginPath(); ctx.moveTo(180, 130); ctx.lineTo(210, 160); ctx.stroke();
    }
    if (stage > 4) { // Vänster ben
        ctx.beginPath(); ctx.moveTo(180, 180); ctx.lineTo(170, 230); ctx.stroke();
    }
    if (stage > 5) { // Höger ben
        ctx.beginPath(); ctx.moveTo(180, 180); ctx.lineTo(190, 230); ctx.stroke();
    }
    // Händer: alltid i änden av armarna
    if (stage > 6) {
        // Vänster hand (ändpunkt vänster arm)
        ctx.beginPath(); ctx.arc(150, 160, 7, 0, Math.PI * 2); ctx.stroke();
    }
    if (stage > 7) {
        // Höger hand (ändpunkt höger arm)
        ctx.beginPath(); ctx.arc(210, 160, 7, 0, Math.PI * 2); ctx.stroke();
    }
    // Fötter: alltid i änden av benen
    if (stage > 8) {
        // Vänster fot (ändpunkt vänster ben)
        ctx.beginPath(); ctx.arc(170, 230, 7, 0, Math.PI * 2); ctx.stroke();
    }
    if (stage > 9) {
        // Höger fot (ändpunkt höger ben)
        ctx.beginPath(); ctx.arc(190, 230, 7, 0, Math.PI * 2); ctx.stroke();
    }
    // Rita ansikte om spelet är slut
    if (typeof wrongGuesses !== 'undefined' && typeof gameActive !== 'undefined') {
        if (wrongGuesses >= MAX_WRONG) {
            // Ledsen gubbe (förlust)
            // Vänster öga
            ctx.beginPath(); ctx.arc(172, 85, 3, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
            // Höger öga
            ctx.beginPath(); ctx.arc(188, 85, 3, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
            // Näsa
            ctx.beginPath(); ctx.moveTo(180, 90); ctx.lineTo(180, 98); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
            // Ledsen mun
            ctx.beginPath(); ctx.arc(180, 105, 8, Math.PI * 0.1, Math.PI * 0.9, true); ctx.strokeStyle = 'red'; ctx.lineWidth = 2; ctx.stroke();
            ctx.strokeStyle = '#333'; ctx.lineWidth = 4; // återställ
        } else if (stage > 0) {
            // Neutral mun och ögon vid pågående spel
            ctx.beginPath(); ctx.arc(172, 85, 3, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
            ctx.beginPath(); ctx.arc(188, 85, 3, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
            ctx.beginPath(); ctx.moveTo(180, 90); ctx.lineTo(180, 98); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
            // Neutral mun
            ctx.beginPath(); ctx.moveTo(172, 105); ctx.lineTo(188, 105); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
            ctx.strokeStyle = '#333'; ctx.lineWidth = 4;
        }
    }
}

function displayWord() {
    const display = document.getElementById('wordDisplay');
    display.innerHTML = '';
    for (let i = 0; i < selectedWord.length; i++) {
        let letter = selectedWord[i];
        let span = document.createElement('span');
        if (guessedLetters.includes(letter)) {
            span.textContent = letter;
            span.classList.add('correct');
        } else {
            span.textContent = '_';
        }
        display.appendChild(span);
    }
}

function displayWrongLetters() {
    const wrong = guessedLetters.filter(l => !selectedWord.includes(l));
    document.getElementById('wrongLetters').textContent = wrong.length > 0 ? 'Fel: ' + wrong.join(', ') : '';
}

function updateKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyzåäö'.split('');
    alphabet.forEach(letter => {
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-secondary m-1';
        btn.textContent = letter.toUpperCase();
        btn.disabled = guessedLetters.includes(letter) || !gameActive;
        btn.onclick = () => guessLetter(letter);
        keyboard.appendChild(btn);
    });
}

function guessLetter(letter) {
    if (!gameActive || guessedLetters.includes(letter)) return;
    guessedLetters.push(letter);
    if (!selectedWord.includes(letter)) {
        wrongGuesses++;
        drawGallows(wrongGuesses);
    }
    displayWord();
    displayWrongLetters();
    updateKeyboard();
    checkGameStatus();
}

function checkGameStatus() {
    const message = document.getElementById('message');
    if (wrongGuesses >= MAX_WRONG) {
        message.textContent = `Du förlorade! Ordet var: ${selectedWord}`;
        gameActive = false;
        drawGallows(MAX_WRONG); // Rita alltid hela gubben och ansiktet
        document.getElementById('restartBtn').classList.remove('d-none');
    } else if (selectedWord.split('').every(l => guessedLetters.includes(l))) {
        message.textContent = 'Grattis! Du vann!';
        gameActive = false;
        drawGallows(MAX_WRONG + 1); // Rita hela glada gubben oavsett antal fel
        document.getElementById('restartBtn').classList.remove('d-none');
    } else {
        message.textContent = '';
    }
}

document.getElementById('letterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('letterInput');
    let letter = input.value.toLowerCase();
    if (letter && /^[a-zåäö]$/.test(letter)) {
        guessLetter(letter);
    }
    input.value = '';
});

document.getElementById('restartBtn').addEventListener('click', startGame);

function startGame() {
    pickWord();
    guessedLetters = [];
    wrongGuesses = 0;
    gameActive = true;
    drawGallows(0);
    displayWord();
    displayWrongLetters();
    updateKeyboard();
    document.getElementById('message').textContent = '';
    document.getElementById('restartBtn').classList.add('d-none');
}

window.onload = startGame;
