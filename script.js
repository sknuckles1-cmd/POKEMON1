// --- Basic Pokémon Data ---
// In a real game, this would come from a larger database or API
const pokemonData = {
    pikachu: {
        name: "Pikachu",
        hp: 100,
        maxHp: 100,
        attack: 18, // Base attack power
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' // Example sprite URL
    },
    charmander: {
        name: "Charmander",
        hp: 120,
        maxHp: 120,
        attack: 15,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' // Example sprite URL
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

const attackButton = document.getElementById('attack-button');
const messageLog = document.getElementById('message-log');
const resetButton = document.getElementById('reset-button');


// --- Game Functions ---

// Initialize the game state and UI
function initializeBattle() {
    // Create deep copies to avoid modifying original data during battle
    playerPokemon = { ...pokemonData.pikachu };
    opponentPokemon = { ...pokemonData.charmander };

    isPlayerTurn = true;
    battleOver = false;

    updateDisplay(); // Update UI with initial values

    // Set Sprites (handle potential errors)
    playerSpriteEl.src = playerPokemon.sprite;
    playerSpriteEl.onerror = () => playerSpriteEl.src = 'placeholder.png'; // Fallback image
    opponentSpriteEl.src = opponentPokemon.sprite;
    opponentSpriteEl.onerror = () => opponentSpriteEl.src = 'placeholder.png'; // Fallback image


    // Clear message log and add start message
    messageLog.innerHTML = '<p>Battle starts!</p>';
    logMessage(`Your ${playerPokemon.name} faces ${opponentPokemon.name}!`);

    // Ensure buttons are in the correct state
    attackButton.disabled = false;
    resetButton.style.display = 'none'; // Hide reset button initially
}

// Update the UI elements (names, HP, health bars)
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

// Update a specific health bar's width and color
function updateHealthBar(barElement, currentHp, maxHp) {
    const percentage = Math.max(0, (currentHp / maxHp) * 100); // Ensure percentage doesn't go below 0
    barElement.style.width = `${percentage}%`;

    // Remove previous color classes
    barElement.classList.remove('low', 'critical');

    // Add new color class based on percentage
    if (percentage < 25) {
        barElement.classList.add('critical');
    } else if (percentage < 50) {
        barElement.classList.add('low');
    }
}


// Add a message to the battle log
function logMessage(message) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    messageLog.appendChild(newMessage);
    // Auto-scroll to the bottom
    messageLog.scrollTop = messageLog.scrollHeight;
}

// Handle the player's attack action
function playerAttack() {
    if (!isPlayerTurn || battleOver) return; // Do nothing if not player's turn or battle is over

    attackButton.disabled = true; // Disable button during attack sequence

    // Calculate damage (add slight randomness)
    const damage = calculateDamage(playerPokemon.attack);
    opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage); // Prevent HP < 0

    logMessage(`${playerPokemon.name} attacks! Deals ${damage} damage.`);
    updateDisplay();

    // Check if opponent fainted
    if (opponentPokemon.hp <= 0) {
        logMessage(`${opponentPokemon.name} fainted! You win!`);
        endBattle();
    } else {
        // Switch to opponent's turn after a short delay
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500); // Wait 1.5 seconds before opponent attacks
    }
}

// Handle the opponent's turn (simple AI)
function opponentTurn() {
    if (battleOver) return;

    logMessage(`${opponentPokemon.name}'s turn...`);

    // Calculate damage
    const damage = calculateDamage(opponentPokemon.attack);
    playerPokemon.hp = Math.max(0, playerPokemon.hp - damage); // Prevent HP < 0

    logMessage(`${opponentPokemon.name} attacks! Deals ${damage} damage.`);
    updateDisplay();

    // Check if player fainted
    if (playerPokemon.hp <= 0) {
        logMessage(`${playerPokemon.name} fainted! You lose!`);
        endBattle();
    } else {
        // Switch back to player's turn
        isPlayerTurn = true;
        attackButton.disabled = false; // Re-enable attack button
    }
}

// Simple damage calculation (can be expanded)
function calculateDamage(baseAttack) {
    // Add some randomness: damage = baseAttack +/- 20% (approx)
    const variation = baseAttack * 0.2;
    const randomFactor = Math.random() * variation * 2 - variation; // Between -variation and +variation
    return Math.max(1, Math.round(baseAttack + randomFactor)); // Ensure at least 1 damage
}

// End the battle
function endBattle() {
    battleOver = true;
    attackButton.disabled = true;
    resetButton.style.display = 'block'; // Show reset button
}

// --- Event Listeners ---
attackButton.addEventListener('click', playerAttack);
resetButton.addEventListener('click', initializeBattle); // Reset button restarts the game

// --- Initial Game Setup ---
window.onload = initializeBattle; // Start the game when the page loads
