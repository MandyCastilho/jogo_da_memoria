const cards = [
    { id: 1, value: 'A' },
    { id: 2, value: 'B' },
    { id: 3, value: 'C' },
    { id: 4, value: 'D' },
    { id: 5, value: 'E' },
    { id: 6, value: 'F' },
    { id: 7, value: 'G' },
    { id: 8, value: 'H' },
];

let gameCards = [...cards, ...cards]; // Duplicando as cartas
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let timer;
let seconds = 0;
let gameStarted = false;

function initGame() {
    gameCards = shuffle([...cards, ...cards]);
    const memoryBoard = document.getElementById('memory-board');
    memoryBoard.innerHTML = '';
    firstCard = secondCard = null;
    lockBoard = false;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    updateMoves();
    updateTimerDisplay();
    clearInterval(timer);

    gameCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.id = card.id;
        cardElement.dataset.value = card.value;

        const cardText = document.createElement('div');
        cardText.classList.add('card-text');
        cardText.textContent = '';

        cardElement.appendChild(cardText);
        cardElement.addEventListener('click', flipCard);
        memoryBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    const cardText = this.querySelector('.card-text');
    cardText.textContent = this.dataset.value;
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        moves++;
        updateMoves();

        if (firstCard.dataset.value === secondCard.dataset.value) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            resetBoard();
        } else {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.querySelector('.card-text').textContent = '';
                secondCard.querySelector('.card-text').textContent = '';
                resetBoard();
            }, 1000);
        }
    }
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;

    if (document.querySelectorAll('.matched').length === gameCards.length) {
        clearInterval(timer);
        setTimeout(() => {
            alert(`🎉 Parabéns! Você venceu em ${moves} jogadas e ${seconds} segundos!`);
        }, 500);
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateMoves() {
    const movesDisplay = document.getElementById('moves-count');
    if (movesDisplay) movesDisplay.textContent = `Jogadas: ${moves}`;
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) timerDisplay.textContent = `Tempo: ${seconds}s`;
}

document.getElementById('restart-btn').addEventListener('click', initGame);

// Inicializando o jogo quando a página carrega
window.onload = initGame;


