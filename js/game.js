Auth.require();

const EMOJIS = Array.from('🐀🐁🐂🐃🐄🐅🐆🐇🐈🐉🐊🐋🐌🐍🐎🐏🐐🐑🐒🐓🐔🐕🐖🐗🐘🐙🐚🐛🐜🐝' +
    '🐞🐟🐠🐡🐢🐣🐤🐥🐦🐧🐨🐩🐪🐫🐬🐭🐮🐯🐰🐱🐲🐳🐴🐵🐶🐷🐸🐹🐺🐻🐼🐽🐾🍅🍆🍇🍈🍉🍊' +
    '🍋🍌🍍🍎🍏🍐🍑🍒🍓🍔🍕🍖🍗🍘🍙🍚🍛🍜🍝🍞🍟🍠🍡🍢🍣🍤🍥🍦🍧🍨🍩🍪🍫🍬🍭🍮🍯🍰🍱' +
    '🍲🍳🍴🍵🍶🍷🍸🍹🍺🍻');

const DIFFICULTIES = {
    '3x3': { 
        n: 3, 
        time: 60, 
        mult: 1, 
        cols: 'grid-cols-3', 
        text: 'text-4xl', 
        width: 'max-w-xs' 
    },

    '6x6': { 
        n: 6, 
        time: 150, 
        mult: 2, 
        cols: 'grid-cols-6', 
        text: 'text-2xl', 
        width: 'max-w-md' 
    },
    '9x9': { 
        n: 9, 
        time: 360, mult: 3, cols: 'grid-cols-9', text: 'text-lg', width: 'max-w-xl' },
    '12x12': { n: 12, time: 720, mult: 4, cols: 'grid-cols-12', text: 'text-sm', width: 'max-w-2xl' },
    '15x15': { n: 15, time: 1200, mult: 5, cols: 'grid-cols-[repeat(15,minmax(0,1fr))]', text: 'text-xs', width: 'max-w-3xl' },
};

const FLIP = '[transform:rotateY(180deg)]';

const board = $('#board');

let difficultyKey = '';
let config = null;
let cards = [];
let cardButtons = [];
let firstIndex = null;
let locked = false;
let running = false;
let totalPairs = 0;
let pairs = 0;
let tries = 0;
let errors = 0;
let timeLeft = 0;
let timer = null;

function calculateScore(won) {
    let score = pairs * 100 * config.mult - errors * 10 * config.mult;
    if (won) {
        score += timeLeft * 2 * config.mult;
    }
    return Math.max(0, score);
}

function startGame(key) {
    clearInterval(timer);

    difficultyKey = key;
    config = DIFFICULTIES[key];

    const n = config.n;
    totalPairs = Math.floor((n * n) / 2);

    const list = [];
    for (let i = 0; i < totalPairs; i++) {
        list.push(EMOJIS[i]);
        list.push(EMOJIS[i]);
    }
    shuffle(list);

    cards = list.map((emoji) => ({ emoji: emoji, open: false, done: false, joker: false }));

    if (n % 2 === 1) {
        cards.splice(Math.floor((n * n) / 2), 0, { emoji: '⭐', open: true, done: true, joker: true });
    }

    firstIndex = null;
    locked = false;
    running = true;
    pairs = 0;
    tries = 0;
    errors = 0;
    timeLeft = config.time;

    $('#select').classList.add('hidden');
    $('#play').classList.remove('hidden');
    $('#modal').classList.add('hidden');

    drawBoard();
    updateStats();
    timer = setInterval(tick, 1000);
}

function drawBoard() {
    board.className = 'grid gap-1 mx-auto ' + config.cols + ' ' + config.width;

    board.innerHTML = cards
        .map((card, i) => {
            const flipped = card.joker ? FLIP : '';
            const frontColor = card.joker ? 'bg-yellow-200' : 'bg-white';
            const disabled = card.joker ? 'disabled' : '';

            return `
            <button type="button" data-i="${i}" ${disabled} aria-label="Carta ${i + 1}"
                class="aspect-square [perspective:600px]">
                <div class="relative w-full h-full transition-transform duration-300 [transform-style:preserve-3d] ${flipped}">
                    <div class="absolute inset-0 rounded bg-blue-600 border border-blue-800 [backface-visibility:hidden]"></div>
                    <div class="absolute inset-0 flex items-center justify-center rounded border border-gray-500 ${frontColor} ${config.text} [backface-visibility:hidden] [transform:rotateY(180deg)]">${card.emoji}</div>
                </div>
            </button>`;
        })
        .join('');

    cardButtons = Array.from(board.children);
}

function setOpen(i, open) {
    cards[i].open = open;
    cardButtons[i].firstElementChild.classList.toggle(FLIP, open);
}

function markMatched(i) {
    cards[i].done = true;
    const front = cardButtons[i].firstElementChild.lastElementChild;
    front.classList.remove('bg-white');
    front.classList.add('bg-green-200', 'border-green-600');
}

board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-i]');
    if (!button || !running || locked) return;

    const i = Number(button.dataset.i);
    if (cards[i].open || cards[i].done) return;

    setOpen(i, true);

    if (firstIndex === null) {
        firstIndex = i;
        return;
    }

    const j = firstIndex;
    firstIndex = null;
    tries++;

    if (cards[i].emoji === cards[j].emoji) {
        markMatched(i);
        markMatched(j);
        pairs++;
        updateStats();
        if (pairs === totalPairs) {
            finishGame(true);
        }
    } else {
        errors++;
        locked = true;
        updateStats();
        setTimeout(() => {
            setOpen(i, false);
            setOpen(j, false);
            locked = false;
        }, 700);
    }
});

function tick() {
    timeLeft--;
    updateStats();
    if (timeLeft <= 0) {
        finishGame(false);
    }
}

function updateStats() {
    const time = $('#time');
    time.textContent = formatTime(timeLeft);
    time.classList.toggle('text-red-600', timeLeft <= 10);

    $('#score').textContent = calculateScore(false);
    $('#pairs').textContent = pairs + '/' + totalPairs;
    $('#tries').textContent = tries;
    $('#diff').textContent = difficultyKey;
}

function finishGame(won) {
    clearInterval(timer);
    running = false;

    const score = calculateScore(won);
    const usedTime = config.time - timeLeft;

    if (won) {
        Scores.add({
            name: Auth.current().name,
            score: score,
            difficulty: difficultyKey,
            time: usedTime,
            date: Date.now(),
        });
    }

    $('#score').textContent = score;

    const bonus = timeLeft * 2 * config.mult;

    $('#modal-title').textContent = won ? 'Você venceu!' : 'Tempo esgotado!';
    $('#modal-text').textContent = won
        ? 'Pontuação: ' + score + ' (inclui bônus de tempo: ' + bonus + ') | Tempo: ' + formatTime(usedTime) + ' | Tentativas: ' + tries
        : 'Você encontrou ' + pairs + ' de ' + totalPairs + ' pares. Pontuação: ' + score;
    $('#modal-board').classList.toggle('hidden', !won);

    setTimeout(() => {
        $('#modal').classList.remove('hidden');
    }, 500);
}

function showSelect() {
    clearInterval(timer);
    running = false;
    $('#play').classList.add('hidden');
    $('#modal').classList.add('hidden');
    $('#select').classList.remove('hidden');
}

const user = Auth.current();
$('#user-name').textContent = user ? user.name : '';
$('#logout').addEventListener('click', Auth.logout);

const difficultiesBox = $('#difficulties');
difficultiesBox.innerHTML = Object.keys(DIFFICULTIES)
    .map((key) => {
        const c = DIFFICULTIES[key];
        const pairsCount = Math.floor((c.n * c.n) / 2);
        return `
        <button data-key="${key}" class="border border-gray-400 bg-white rounded p-4 text-left hover:bg-gray-100">
            <span class="block text-2xl font-bold">${key}</span>
            <span class="block text-sm text-gray-600">${pairsCount} pares | ${formatTime(c.time)} | x${c.mult} pontos</span>
        </button>`;
    })
    .join('');

difficultiesBox.addEventListener('click', (event) => {
    const button = event.target.closest('[data-key]');
    if (button) startGame(button.dataset.key);
});

$('#restart').addEventListener('click', () => startGame(difficultyKey));
$('#modal-again').addEventListener('click', () => startGame(difficultyKey));
$('#modal-change').addEventListener('click', showSelect);
$('#abandon').addEventListener('click', () => {
    if (confirm('Abandonar a partida atual?')) showSelect();
});
