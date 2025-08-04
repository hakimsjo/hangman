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
    if (stage > 2) { // Vänster arm
        ctx.beginPath(); ctx.moveTo(180, 130); ctx.lineTo(150, 160); ctx.stroke();
    }
    if (stage > 3) { // Höger arm
        ctx.beginPath(); ctx.moveTo(180, 130); ctx.lineTo(210, 160); ctx.stroke();
    }
    if (stage > 4) { // Vänster ben
        ctx.beginPath(); ctx.moveTo(180, 180); ctx.lineTo(160, 230); ctx.stroke();
    }
    if (stage > 5) { // Höger ben
        ctx.beginPath(); ctx.moveTo(180, 180); ctx.lineTo(200, 230); ctx.stroke();
    }
    if (stage > 6) { // Vänster hand
        ctx.beginPath(); ctx.arc(145, 165, 7, 0, Math.PI * 2); ctx.stroke();
    }
    if (stage > 7) { // Höger hand
        ctx.beginPath(); ctx.arc(215, 165, 7, 0, Math.PI * 2); ctx.stroke();
    }
    if (stage > 8) { // Vänster fot
        ctx.beginPath(); ctx.arc(155, 235, 7, 0, Math.PI * 2); ctx.stroke();
    }
    if (stage > 9) { // Höger fot
        ctx.beginPath(); ctx.arc(205, 235, 7, 0, Math.PI * 2); ctx.stroke();
    }
    // Rita ansikte om spelet är slut (förlorat)
    if (typeof wrongGuesses !== 'undefined' && typeof gameActive !== 'undefined' && wrongGuesses >= MAX_WRONG) {
        // Vänster öga
        ctx.beginPath(); ctx.arc(172, 85, 3, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
        // Höger öga
        ctx.beginPath(); ctx.arc(188, 85, 3, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
        // Näsa
        ctx.beginPath(); ctx.moveTo(180, 90); ctx.lineTo(180, 98); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
        // Ledsen mun
        ctx.beginPath(); ctx.arc(180, 105, 8, Math.PI * 0.1, Math.PI * 0.9, true); ctx.strokeStyle = 'red'; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = '#333'; ctx.lineWidth = 4; // återställ
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
