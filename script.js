// --- Updated Pokémon Data with Movesets ---
const pokemonData = {
    pikachu: {
        name: "Pikachu",
        hp: 100,
        maxHp: 100,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        moves: [
            { name: "Thunder Shock", power: 40, type: "Electric" },
            { name: "Quick Attack", power: 35, type: "Normal" },
            { name: "Iron Tail", power: 50, type: "Steel" },
            { name: "Spark", power: 30, type: "Electric" }
        ]
    },
    charmander: {
        name: "Charmander",
        hp: 120,
        maxHp: 120,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        moves: [
            { name: "Scratch", power: 40, type: "Normal" },
            { name: "Ember", power: 45, type: "Fire" },
            { name: "Dragon Breath", power: 50, type: "Dragon" },
            { name: "Fire Fang", power: 48, type: "Fire" }
        ]
    }
};

// --- Game State Variables ---
let playerPokemon;
let opponentPokemon;
let isPlayerTurn = true;
let battleOver = false;

// --- DOM Element References ---
const playerNameEl = document.getElementById('player-name');
const playerHpEl = document.getElementById('player-hp');
const playerMaxHpEl = document.getElementById('player-max-hp');
const playerHealthBarEl = document.getElementById('player-health-bar');
const playerSpriteEl = document.getElementById('player-sprite');

const opponentNameEl = document.getElementById('opponent-name');
const opponentHpEl = document.getElementById('opponent-hp');
const opponentMaxHpEl = document.getElementById('opponent-max-hp');
const opponentHealthBarEl = document.getElementById('opponent-health-bar');
const opponentSpriteEl = document.getElementById('opponent-sprite');

const playerMovesContainer = document.getElementById('player-moves'); // Container for move buttons
const messageLog = document.getElementById('message-log');
const resetButton = document.getElementById('reset-button');

// --- Game Functions ---

function initializeBattle() {
    playerPokemon = JSON.parse(JSON.stringify(pokemonData.pikachu)); // Deep copy
    opponentPokemon = JSON.parse(JSON.stringify(pokemonData.charmander)); // Deep copy

    isPlayerTurn = true;
    battleOver = false;

    updateDisplay();
    generatePlayerMoveButtons(); // Create move buttons for the player

    playerSpriteEl.src = playerPokemon.sprite;
    playerSpriteEl.onerror = () => playerSpriteEl.src = 'placeholder.png';
    opponentSpriteEl.src = opponentPokemon.sprite;
    opponentSpriteEl.onerror = () => opponentSpriteEl.src = 'placeholder.png';

    messageLog.innerHTML = '<p>Battle starts!</p>';
    logMessage(`Your ${playerPokemon.name} faces ${opponentPokemon.name}!`);

    enableMoveButtons(); // Make sure buttons are usable
    resetButton.style.display = 'none';
}

// Create buttons for the player's moves
function generatePlayerMoveButtons() {
    playerMovesContainer.innerHTML = ''; // Clear existing buttons

    playerPokemon.moves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move.name;
        // Add type/power as data attributes if needed later
        // button.dataset.type = move.type;
        // button.dataset.power = move.power;
        button.addEventListener('click', () => handlePlayerMove(move));
        playerMovesContainer.appendChild(button);
    });
}

// Update the UI elements
function updateDisplay() {
    // Player
    playerNameEl.textContent = playerPokemon.name;
    playerHpEl.textContent = playerPokemon.hp;
    playerMaxHpEl.textContent = playerPokemon.maxHp;
    updateHealthBar(playerHealthBarEl, playerPokemon.hp, playerPokemon.maxHp);

    // Opponent
    opponentNameEl.textContent = opponentPokemon.name;
    opponentHpEl.textContent = opponentPokemon.hp;
    opponentMaxHpEl.textContent = opponentPokemon.maxHp;
    updateHealthBar(opponentHealthBarEl, opponentPokemon.hp, opponentPokemon.maxHp);
}

// Update a specific health bar
function updateHealthBar(barElement, currentHp, maxHp) {
    const percentage = Math.max(0, (currentHp / maxHp) * 100);
    barElement.style.width = `${percentage}%`;
    barElement.className = 'health-bar'; // Reset classes
    if (percentage < 25) barElement.classList.add('critical');
    else if (percentage < 50) barElement.classList.add('low');
}

// Add a message to the log
function logMessage(message) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    messageLog.appendChild(newMessage);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// Handle the player choosing a move
function handlePlayerMove(move) {
    if (!isPlayerTurn || battleOver) return;

    disableMoveButtons(); // Disable buttons during attack sequence

    // Calculate damage based on the chosen move's power
    const damage = calculateDamage(move.power);
    opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage);

    logMessage(`${playerPokemon.name} used ${move.name}! Deals ${damage} damage.`);
    updateDisplay();

    // Check faint
    if (opponentPokemon.hp <= 0) {
        logMessage(`${opponentPokemon.name} fainted! You win!`);
        endBattle();
    } else {
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500); // Opponent's turn after delay
    }
}

// Handle the opponent's turn (chooses a random move)
function opponentTurn() {
    if (battleOver) return;

    logMessage(`${opponentPokemon.name}'s turn...`);

    // Simple AI: Choose a random move from the opponent's moveset
    const availableMoves = opponentPokemon.moves;
    const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
    const chosenMove = availableMoves[randomMoveIndex];

    // Calculate damage based on the opponent's chosen move
    const damage = calculateDamage(chosenMove.power);
    playerPokemon.hp = Math.max(0, playerPokemon.hp - damage);

    logMessage(`${opponentPokemon.name} used ${chosenMove.name}! Deals ${damage} damage.`);
    updateDisplay();

    // Check faint
    if (playerPokemon.hp <= 0) {
        logMessage(`${playerPokemon.name} fainted! You lose!`);
        endBattle();
    } else {
        isPlayerTurn = true;
        enableMoveButtons(); // Re-enable player's move buttons
    }
}

// Damage calculation (uses move power)
function calculateDamage(basePower) {
    // Add randomness: +/- 20%
    const variation = basePower * 0.2;
    const randomFactor = Math.random() * variation * 2 - variation;
    return Math.max(1, Math.round(basePower + randomFactor)); // Minimum 1 damage
}

// Disable player move buttons
function disableMoveButtons() {
    const buttons = playerMovesContainer.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
}

// Enable player move buttons
function enableMoveButtons() {
    const buttons = playerMovesContainer.querySelectorAll('button');
    buttons.forEach(button => button.disabled = false);
}

// End the battle
function endBattle() {
    battleOver = true;
    disableMoveButtons(); // Disable moves
    resetButton.style.display = 'block'; // Show reset button
}

// --- Event Listeners ---
// Move button listeners are added in generatePlayerMoveButtons()
resetButton.addEventListener('click', initializeBattle);

// --- Initial Game Setup ---
window.onload = initializeBattle;
