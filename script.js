// --- Pokémon Data (Keep as before) ---
const pokemonData = {
    pikachu: { /* ... Pikachu data with moves ... */
        name: "Pikachu", hp: 100, maxHp: 100,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        moves: [
            { name: "Thunder Shock", power: 40 }, { name: "Quick Attack", power: 35 },
            { name: "Iron Tail", power: 50 }, { name: "Spark", power: 30 }
        ]
    },
    charmander: { /* ... Charmander data with moves ... */
        name: "Charmander", hp: 120, maxHp: 120,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        moves: [
            { name: "Scratch", power: 40 }, { name: "Ember", power: 45 },
            { name: "Dragon Breath", power: 50 }, { name: "Fire Fang", power: 48 }
        ]
    },
    // Add more potential opponents later
    rattata: {
         name: "Rattata", hp: 80, maxHp: 80,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png',
        moves: [
            { name: "Tackle", power: 35 }, { name: "Quick Attack", power: 35 },
            { name: "Hyper Fang", power: 60 }
        ]
    }
};

// --- Game State Variables ---
let currentMode = 'map'; // 'map' or 'battle'
let playerPokemon; // The player's current Pokémon (initially Pikachu)
let opponentPokemon; // Current battle opponent
let isPlayerTurn = true;
let battleOver = false;

// --- Map State ---
const dungeonLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 3, 0, 1], // 2 is player start
    [1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 3, 0, 0, 0, 1], // 3 is encounter
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 3, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];
const TILE_TYPES = { EMPTY: 0, WALL: 1, PLAYER_START: 2, ENCOUNTER: 3 };
let playerPos = { x: 0, y: 0 };
const mapRows = dungeonLayout.length;
const mapCols = dungeonLayout[0].length;

// --- DOM Element References ---
const mapView = document.getElementById('map-view');
const battleView = document.getElementById('battle-view');
const dungeonGrid = document.getElementById('dungeon-grid');

// Battle View Elements
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

const playerMovesContainer = document.getElementById('player-moves');
const messageLog = document.getElementById('message-log');
const returnToMapButton = document.getElementById('return-to-map-button');
const actionPrompt = document.getElementById('action-prompt');


// --- Game Initialization ---
function initializeGame() {
    // Set player's starting Pokémon (needs full HP)
    playerPokemon = JSON.parse(JSON.stringify(pokemonData.pikachu));
    playerPokemon.hp = playerPokemon.maxHp; // Ensure full health at start

    // Find player starting position
    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            if (dungeonLayout[y][x] === TILE_TYPES.PLAYER_START) {
                playerPos = { x, y };
                // Change start tile to empty after finding player
                // dungeonLayout[y][x] = TILE_TYPES.EMPTY; // Optional: remove the '2'
                break;
            }
        }
    }
    setupMapGrid();
    renderMap();
    switchMode('map'); // Start in map mode
}

// --- Mode Switching ---
function switchMode(newMode) {
    currentMode = newMode;
    if (newMode === 'map') {
        mapView.classList.remove('hidden');
        battleView.classList.add('hidden');
        renderMap(); // Re-render map when returning
    } else { // 'battle'
        mapView.classList.add('hidden');
        battleView.classList.remove('hidden');
        // Battle initialization happens in startBattle()
    }
}

// --- Map Rendering and Logic ---
function setupMapGrid() {
    dungeonGrid.innerHTML = ''; // Clear previous grid
    dungeonGrid.style.gridTemplateColumns = `repeat(${mapCols}, 40px)`;
    dungeonGrid.style.gridTemplateRows = `repeat(${mapRows}, 40px)`;

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.id = `cell-${x}-${y}`;
            dungeonGrid.appendChild(cell);
        }
    }
}

function renderMap() {
    if (currentMode !== 'map') return; // Only render if in map mode

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const cell = document.getElementById(`cell-${x}-${y}`);
            cell.className = 'grid-cell'; // Reset classes
            cell.innerHTML = ''; // Clear player marker

            const tileType = dungeonLayout[y][x];

            if (tileType === TILE_TYPES.WALL) {
                cell.classList.add('wall');
            } else if (tileType === TILE_TYPES.ENCOUNTER) {
                cell.classList.add('encounter');
            }
            // Add other tile types here if needed (e.g., items)

            // Draw player marker
            if (x === playerPos.x && y === playerPos.y) {
                const playerMarker = document.createElement('div');
                playerMarker.classList.add('player');
                cell.appendChild(playerMarker);
            }
        }
    }
}

// --- Player Movement ---
function handleKeydown(event) {
    if (currentMode !== 'map' || battleOver) return; // Only move on map, not during/after battle modal

    let dx = 0;
    let dy = 0;

    switch (event.key) {
        case 'ArrowUp': dy = -1; break;
        case 'ArrowDown': dy = 1; break;
        case 'ArrowLeft': dx = -1; break;
        case 'ArrowRight': dx = 1; break;
        default: return; // Ignore other keys
    }

    event.preventDefault(); // Prevent page scrolling

    const targetX = playerPos.x + dx;
    const targetY = playerPos.y + dy;

    // Check boundaries
    if (targetX < 0 || targetX >= mapCols || targetY < 0 || targetY >= mapRows) {
        return;
    }

    // Check for walls
    const targetTile = dungeonLayout[targetY][targetX];
    if (targetTile === TILE_TYPES.WALL) {
        return;
    }

    // Move player
    playerPos.x = targetX;
    playerPos.y = targetY;

    renderMap(); // Update map display

    // Check for encounter after moving
    if (targetTile === TILE_TYPES.ENCOUNTER) {
        // Potentially remove the encounter after triggering it
        // dungeonLayout[targetY][targetX] = TILE_TYPES.EMPTY; // Make it single-use
        startBattle();
    }
}

// --- Battle Logic ---

function startBattle() {
    console.log("Starting battle!");
    // Choose opponent (e.g., random or based on tile)
    // For now, let's randomly pick between Charmander and Rattata
    const opponents = [pokemonData.charmander, pokemonData.rattata];
    const randomOpponentData = opponents[Math.floor(Math.random() * opponents.length)];
    opponentPokemon = JSON.parse(JSON.stringify(randomOpponentData)); // Deep copy

    // Reset player health for the battle (or use current map health if implemented)
    // playerPokemon.hp = playerPokemon.maxHp; // Reset player for each battle? Or keep damage? Let's keep damage for now.
    // Ensure player HP isn't 0 before battle starts (if carrying over damage)
    if (playerPokemon.hp <= 0) {
         console.log("Player has no HP to battle!");
         // Handle game over or recovery? For now, maybe heal a bit?
         playerPokemon.hp = Math.floor(playerPokemon.maxHp * 0.1); // Heal 10%
         if (playerPokemon.hp === 0) playerPokemon.hp = 1; // Minimum 1 HP
    }


    initializeBattleScreen(); // Setup the battle UI elements
    switchMode('battle');
}

// Sets up the battle screen UI - called by startBattle
function initializeBattleScreen() {
    isPlayerTurn = true;
    battleOver = false;

    updateBattleDisplay(); // Update UI with initial battle values
    generatePlayerMoveButtons();

    // Set Sprites
    playerSpriteEl.src = playerPokemon.sprite;
    playerSpriteEl.onerror = () => playerSpriteEl.src = 'placeholder.png';
    opponentSpriteEl.src = opponentPokemon.sprite;
    opponentSpriteEl.onerror = () => opponentSpriteEl.src = 'placeholder.png';

    messageLog.innerHTML = ''; // Clear log for new battle
    logMessage(`A wild ${opponentPokemon.name} appeared!`);
    logMessage(`Go, ${playerPokemon.name}!`);

    enableMoveButtons();
    actionPrompt.textContent = "Choose your move:";
    returnToMapButton.classList.add('hidden'); // Hide return button initially
}

// Create buttons for the player's moves
function generatePlayerMoveButtons() {
    playerMovesContainer.innerHTML = ''; // Clear existing buttons
    playerPokemon.moves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move.name;
        button.addEventListener('click', () => handlePlayerMove(move));
        playerMovesContainer.appendChild(button);
    });
}

// Update the battle UI elements (HP, names, etc.)
function updateBattleDisplay() {
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

// Add a message to the battle log
function logMessage(message) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    messageLog.appendChild(newMessage);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// Handle the player choosing a move
function handlePlayerMove(move) {
    if (!isPlayerTurn || battleOver) return;
    disableMoveButtons();

    const damage = calculateDamage(move.power);
    opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage);
    logMessage(`${playerPokemon.name} used ${move.name}! It dealt ${damage} damage.`);
    updateBattleDisplay();

    if (opponentPokemon.hp <= 0) {
        logMessage(`${opponentPokemon.name} fainted!`);
        endBattle(true); // Player wins
    } else {
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500);
    }
}

// Handle the opponent's turn
function opponentTurn() {
    if (battleOver) return;
    logMessage(`${opponentPokemon.name}'s turn...`);

    const availableMoves = opponentPokemon.moves;
    const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
    const chosenMove = availableMoves[randomMoveIndex];

    const damage = calculateDamage(chosenMove.power);
    playerPokemon.hp = Math.max(0, playerPokemon.hp - damage); // Player takes damage
    logMessage(`${opponentPokemon.name} used ${chosenMove.name}! It dealt ${damage} damage.`);
    updateBattleDisplay();

    if (playerPokemon.hp <= 0) {
        logMessage(`${playerPokemon.name} fainted!`);
        endBattle(false); // Player loses
    } else {
        isPlayerTurn = true;
        enableMoveButtons();
    }
}

// Damage calculation
function calculateDamage(basePower) {
    const variation = basePower * 0.2;
    const randomFactor = Math.random() * variation * 2 - variation;
    return Math.max(1, Math.round(basePower + randomFactor));
}

// Disable/Enable player move buttons
function disableMoveButtons() {
    playerMovesContainer.querySelectorAll('button').forEach(button => button.disabled = true);
}
function enableMoveButtons() {
    playerMovesContainer.querySelectorAll('button').forEach(button => button.disabled = false);
}

// End the battle
function endBattle(playerWon) {
    battleOver = true;
    disableMoveButtons();

    if (playerWon) {
        logMessage("You won the battle!");
         // Optional: Clear the encounter tile the player is on
         if (dungeonLayout[playerPos.y][playerPos.x] === TILE_TYPES.ENCOUNTER) {
            dungeonLayout[playerPos.y][playerPos.x] = TILE_TYPES.EMPTY;
            console.log(`Encounter tile at ${playerPos.x},${playerPos.y} cleared.`);
         }
    } else {
        logMessage("You lost the battle...");
        // Handle loss - maybe return to start, game over screen, etc.
        // For now, just allow returning to map with low HP.
    }

    actionPrompt.textContent = playerWon ? "Victory!" : "Defeated!";
    returnToMapButton.classList.remove('hidden'); // Show the return button
}


// --- Event Listeners ---
document.addEventListener('keydown', handleKeydown);
returnToMapButton.addEventListener('click', () => {
     switchMode('map');
     battleOver = false; // Reset battle flag when returning
});

// --- Initial Game Setup ---
window.onload = initializeGame; // Start the game setup when the page loads
