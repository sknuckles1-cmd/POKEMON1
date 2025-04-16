// --- Pokémon Data (Expanded) ---
const pokemonData = {
    // Original
    pikachu: { id: 25, speciesName: 'pikachu', name: "Pikachu", hp: 100, maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', moves: [ { name: "Thunder Shock", power: 40 }, { name: "Quick Attack", power: 35 }, { name: "Iron Tail", power: 50 }, { name: "Spark", power: 30 } ], evolvesAtWins: 5, evolution: 'raichu' },
    raichu: { id: 26, speciesName: 'raichu', name: "Raichu", hp: 130, maxHp: 130, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png', moves: [ { name: "Thunder Punch", power: 75 }, { name: "Quick Attack", power: 40 }, { name: "Iron Tail", power: 60 }, { name: "Thunderbolt", power: 90 } ] },
    charmander: { id: 4, speciesName: 'charmander', name: "Charmander", hp: 120, maxHp: 120, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', moves: [ { name: "Scratch", power: 40 }, { name: "Ember", power: 45 }, { name: "Dragon Breath", power: 50 }, { name: "Fire Fang", power: 48 } ] },
    rattata: { id: 19, speciesName: 'rattata', name: "Rattata", hp: 80, maxHp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png', moves: [ { name: "Tackle", power: 35 }, { name: "Quick Attack", power: 35 }, { name: "Hyper Fang", power: 60 } ] },
    // Added Pokemon
    pidgey: { id: 16, speciesName: 'pidgey', name: "Pidgey", hp: 90, maxHp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png', moves: [ { name: "Tackle", power: 35 }, { name: "Gust", power: 40 }, { name: "Quick Attack", power: 35 } ] },
    spearow: { id: 21, speciesName: 'spearow', name: "Spearow", hp: 95, maxHp: 95, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png', moves: [ { name: "Peck", power: 35 }, { name: "Fury Attack", power: 15 }, { name: "Leer", power: 0 } ] }, // Leer needs effect logic later
    ekans: { id: 23, speciesName: 'ekans', name: "Ekans", hp: 100, maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png', moves: [ { name: "Poison Sting", power: 15 }, { name: "Bite", power: 50 }, { name: "Wrap", power: 15 } ] }, // Poison/Wrap need effects
    sandshrew: { id: 27, speciesName: 'sandshrew', name: "Sandshrew", hp: 110, maxHp: 110, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png', moves: [ { name: "Scratch", power: 40 }, { name: "Sand Attack", power: 0 }, { name: "Swift", power: 50 } ] }, // Sand Attack needs effect
    nidoran_f: { id: 29, speciesName: 'nidoran_f', name: "Nidoran♀", hp: 105, maxHp: 105, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png', moves: [ { name: "Scratch", power: 40 }, { name: "Poison Sting", power: 15 }, { name: "Growl", power: 0 } ] },
    nidoran_m: { id: 32, speciesName: 'nidoran_m', name: "Nidoran♂", hp: 100, maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png', moves: [ { name: "Peck", power: 35 }, { name: "Leer", power: 0 }, { name: "Focus Energy", power: 0 } ] },
    vulpix: { id: 37, speciesName: 'vulpix', name: "Vulpix", hp: 95, maxHp: 95, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png', moves: [ { name: "Ember", power: 45 }, { name: "Quick Attack", power: 35 }, { name: "Tail Whip", power: 0 } ] },
    zubat: { id: 41, speciesName: 'zubat', name: "Zubat", hp: 90, maxHp: 90, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png', moves: [ { name: "Leech Life", power: 25 }, { name: "Supersonic", power: 0 }, { name: "Bite", power: 50 } ] }, // Supersonic needs effect
    oddish: { id: 43, speciesName: 'oddish', name: "Oddish", hp: 100, maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png', moves: [ { name: "Absorb", power: 25 }, { name: "Acid", power: 40 }, { name: "Sleep Powder", power: 0 } ] }, // Sleep Powder needs effect
    geodude: { id: 74, speciesName: 'geodude', name: "Geodude", hp: 115, maxHp: 115, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png', moves: [ { name: "Tackle", power: 35 }, { name: "Rock Throw", power: 50 }, { name: "Defense Curl", power: 0 } ] }
};

// --- Player Object ---
let player = {
    party: [],
    inventory: { potions: 2, pokeballs: 5 },
    wins: 0,
    activePokemonIndex: 0,
    money: 150
};

// --- Game State Variables ---
let currentMode = 'map'; // map, battle, store
let opponentPokemon;
let isPlayerTurn = true;
let battleOver = false;
let justEvolved = false;

// --- Map State ---
// Increased Map Size
const mapRows = 15;
const mapCols = 20;
let dungeonLayout = []; // Will be generated
const TILE_TYPES = { EMPTY: 0, WALL: 1, PLAYER_START: 2, ENCOUNTER: 3, STORE: 5 };
let playerPos = { x: 0, y: 0 };

// --- Store Item Prices ---
const itemPrices = { potion: 50, pokeball: 100 };

// --- DOM Element References ---
const mapView = document.getElementById('map-view');
const battleView = document.getElementById('battle-view');
const storeView = document.getElementById('store-view');
const dungeonGrid = document.getElementById('dungeon-grid');
const inventoryDisplay = document.getElementById('inventory-display');
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
const actionPrompt = document.getElementById('action-prompt');
const battleButtonsContainer = document.getElementById('battle-buttons');
const playerMovesContainer = document.getElementById('player-moves');
const itemButtonsContainer = document.getElementById('item-buttons');
const switchPokemonContainer = document.getElementById('switch-pokemon-buttons');
const messageLog = document.getElementById('message-log');
const returnToMapButton = document.getElementById('return-to-map-button');
// Store View Elements
let storeMoneyDisplay = null;
let storeItemList = null;
let storeMessage = null;


// --- Map Generation ---
function generateMap(rows, cols) {
    console.log(`Generating map (${rows}x${cols})`);
    let map = Array.from({ length: rows }, () => Array(cols).fill(TILE_TYPES.EMPTY));

    // Simple random wall placement (adjust density as needed)
    const wallDensity = 0.20; // 20% chance for a tile to be a wall
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Ensure borders are walls
            if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) {
                map[y][x] = TILE_TYPES.WALL;
            } else if (Math.random() < wallDensity) {
                map[y][x] = TILE_TYPES.WALL;
            }
        }
    }

    // --- Place Player Start ---
    let startPlaced = false;
    while (!startPlaced) {
        const startX = Math.floor(Math.random() * (cols - 2)) + 1; // Avoid borders
        const startY = Math.floor(Math.random() * (rows - 2)) + 1;
        if (map[startY][startX] === TILE_TYPES.EMPTY) {
            map[startY][startX] = TILE_TYPES.PLAYER_START;
            playerPos = { x: startX, y: startY }; // Set initial player position
            startPlaced = true;
            console.log(`Player start placed at: ${startX}, ${startY}`);
        }
    }

    // --- Place Store ---
    let storePlaced = false;
    while (!storePlaced) {
        const storeX = Math.floor(Math.random() * (cols - 2)) + 1;
        const storeY = Math.floor(Math.random() * (rows - 2)) + 1;
        // Ensure it's not the start tile and is empty
        if (map[storeY][storeX] === TILE_TYPES.EMPTY) {
            map[storeY][storeX] = TILE_TYPES.STORE;
            storePlaced = true;
             console.log(`Store placed at: ${storeX}, ${storeY}`);
        }
    }

    // --- Place Encounters ---
    const numEncounters = Math.floor(rows * cols * 0.08); // ~8% of floor tiles are encounters
    let encountersPlaced = 0;
    let attempts = 0; // Prevent infinite loop if map is too full
    while (encountersPlaced < numEncounters && attempts < rows * cols * 2) {
        const encounterX = Math.floor(Math.random() * (cols - 2)) + 1;
        const encounterY = Math.floor(Math.random() * (rows - 2)) + 1;
        if (map[encounterY][encounterX] === TILE_TYPES.EMPTY) {
            map[encounterY][encounterX] = TILE_TYPES.ENCOUNTER;
            encountersPlaced++;
        }
        attempts++;
    }
     console.log(`Placed ${encountersPlaced} encounter tiles.`);

    // TODO: Add connectivity check (e.g., flood fill from start) to ensure store/encounters are reachable.
    // For now, this simple random placement might create unreachable areas.

    return map;
}


// --- Game Initialization ---
function initializeGame() {
    // Assign Store DOM References (ensure DOM is loaded)
    storeMoneyDisplay = document.getElementById('store-money');
    storeItemList = document.getElementById('store-item-list');
    storeMessage = document.getElementById('store-message');
    if (!storeView || !storeMoneyDisplay || !storeItemList || !storeMessage) {
         console.error("Error: One or more store DOM elements not found! Make sure IDs match the HTML.");
    }

    // Generate the map layout
    dungeonLayout = generateMap(mapRows, mapCols); // Generate the map

    // Setup initial player party and state
    player.party = [];
    const startingPokemon = JSON.parse(JSON.stringify(pokemonData.pikachu));
    startingPokemon.hp = startingPokemon.maxHp;
    player.party.push(startingPokemon);
    player.activePokemonIndex = 0;
    player.wins = 0;
    player.inventory = { potions: 2, pokeballs: 5 };
    player.money = 150;

    // Player position is set during map generation now
    // setupMapGrid needs to run *after* map generation sets dimensions
    setupMapGrid();
    renderMap();
    updateInventoryDisplay();
    switchMode('map');
}

// --- Inventory Display ---
function updateInventoryDisplay() {
    if (inventoryDisplay) {
        inventoryDisplay.innerHTML = `
            Inventory:
            Potions: ${player.inventory.potions} |
            Poké Balls: ${player.inventory.pokeballs} |
            Wins: ${player.wins} |
            Money: $${player.money}
        `;
    }
}

// --- Mode Switching ---
function switchMode(newMode) {
    currentMode = newMode;
    if (mapView) mapView.classList.add('hidden');
    if (battleView) battleView.classList.add('hidden');
    if (storeView) storeView.classList.add('hidden');

    if (newMode === 'map') {
        if (mapView) {
            mapView.classList.remove('hidden');
            renderMap();
            updateInventoryDisplay();
        } else { console.error("Map view element not found"); }
    } else if (newMode === 'battle') {
        if (battleView) {
            battleView.classList.remove('hidden');
        } else { console.error("Battle view element not found"); }
    } else if (newMode === 'store') {
        if (storeView) {
            storeView.classList.remove('hidden');
            openStore(); // Populate store UI
        } else { console.error("Store view element not found"); }
    }
}

// --- Map Rendering and Logic ---
function setupMapGrid() {
    if (!dungeonGrid) { console.error("Dungeon grid element not found"); return; }
    dungeonGrid.innerHTML = '';
    // Use mapCols and mapRows which are now larger constants
    dungeonGrid.style.gridTemplateColumns = `repeat(${mapCols}, 35px)`; // Slightly smaller cells for bigger map
    dungeonGrid.style.gridTemplateRows = `repeat(${mapRows}, 35px)`; // Slightly smaller cells

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
    if (currentMode !== 'map') return;

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const cell = document.getElementById(`cell-${x}-${y}`);
            if (!cell) continue;
            cell.className = 'grid-cell';
            cell.innerHTML = '';

            // Check if layout exists for this cell (it should)
            if (!dungeonLayout[y] || dungeonLayout[y][x] === undefined) {
                 console.warn(`Map data missing for cell ${x},${y}`);
                 cell.classList.add('wall'); // Default to wall if data missing
                 continue;
            }

            const tileType = dungeonLayout[y][x];

            if (tileType === TILE_TYPES.WALL) cell.classList.add('wall');
            else if (tileType === TILE_TYPES.ENCOUNTER) cell.classList.add('encounter');
            else if (tileType === TILE_TYPES.STORE) cell.classList.add('store');

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
    if (currentMode !== 'map' || battleOver) return;

    let dx = 0;
    let dy = 0;

    switch (event.key) {
        case 'ArrowUp': dy = -1; break;
        case 'ArrowDown': dy = 1; break;
        case 'ArrowLeft': dx = -1; break;
        case 'ArrowRight': dx = 1; break;
        default: return;
    }

    event.preventDefault();

    const targetX = playerPos.x + dx;
    const targetY = playerPos.y + dy;

    if (targetX < 0 || targetX >= mapCols || targetY < 0 || targetY >= mapRows) return;

    // Check target tile type using the generated dungeonLayout
     if (!dungeonLayout[targetY] || dungeonLayout[targetY][targetX] === undefined) {
         console.warn(`Attempted move to invalid map coordinates: ${targetX},${targetY}`);
         return; // Prevent moving to undefined area
     }
    const targetTileType = dungeonLayout[targetY][targetX];

    if (targetTileType === TILE_TYPES.WALL) return;

    if (targetTileType === TILE_TYPES.STORE) {
        switchMode('store');
        return;
    }

    playerPos.x = targetX;
    playerPos.y = targetY;

    renderMap();

    if (targetTileType === TILE_TYPES.ENCOUNTER) {
        startBattle();
    }
}

// --- Store Logic ---
function openStore() {
    console.log("Opening Store");
    if (!storeView || !storeMoneyDisplay || !storeItemList || !storeMessage) {
        console.error("Store DOM elements not ready or found!");
        switchMode('map'); // Fallback
        alert("Error opening store!");
        return;
    }
    storeMessage.textContent = "Welcome! What would you like to buy?";
    storeMoneyDisplay.textContent = `Your Money: $${player.money}`;
    storeItemList.innerHTML = '';

    // Add Potion
    const potionItem = document.createElement('li');
    potionItem.innerHTML = `Potion - $${itemPrices.potion} <button onclick="buyItem('potion')">Buy</button> <span>(Heals ~40% HP)</span>`;
    storeItemList.appendChild(potionItem);

    // Add Poké Ball
    const pokeballItem = document.createElement('li');
    pokeballItem.innerHTML = `Poké Ball - $${itemPrices.pokeball} <button onclick="buyItem('pokeball')">Buy</button> <span>(Chance to catch wild Pokémon)</span>`;
    storeItemList.appendChild(pokeballItem);

     // Ensure Leave button exists
     const leaveButton = document.getElementById('leave-store-button');
     if (!leaveButton) {
         console.error("Leave store button not found in HTML!");
         const btn = document.createElement('button');
         btn.id = 'leave-store-button';
         btn.textContent = 'Leave Store';
         btn.onclick = closeStore;
         storeView.appendChild(btn);
     }
}

function buyItem(itemName) {
    if (!itemPrices[itemName]) {
        console.error("Unknown item:", itemName);
        if(storeMessage) storeMessage.textContent = "Sorry, we don't sell that.";
        return;
    }
    const price = itemPrices[itemName];
    if (player.money >= price) {
        player.money -= price;
        if (itemName === 'potion') player.inventory.potions++;
        else if (itemName === 'pokeball') player.inventory.pokeballs++;
        if(storeMessage) storeMessage.textContent = `Purchased ${itemName}!`;
        if(storeMoneyDisplay) storeMoneyDisplay.textContent = `Your Money: $${player.money}`;
        updateInventoryDisplay();
        console.log(`Bought ${itemName}. Money left: ${player.money}, Inventory:`, player.inventory);
    } else {
        if(storeMessage) storeMessage.textContent = "Sorry, you don't have enough money.";
    }
}

function closeStore() {
    console.log("Closing Store");
    switchMode('map');
}


// --- Battle Logic ---
function startBattle() {
    console.log("Starting battle!");
    // Expanded opponent pool
    const opponentsPool = [
        pokemonData.charmander, pokemonData.rattata, pokemonData.pidgey, pokemonData.spearow,
        pokemonData.ekans, pokemonData.sandshrew, pokemonData.nidoran_f, pokemonData.nidoran_m,
        pokemonData.vulpix, pokemonData.zubat, pokemonData.oddish, pokemonData.geodude
    ];
    const randomOpponentData = opponentsPool[Math.floor(Math.random() * opponentsPool.length)];
    opponentPokemon = JSON.parse(JSON.stringify(randomOpponentData));

    if (getActivePlayerPokemon().hp <= 0) {
        const availableIndex = player.party.findIndex((p, index) => index !== player.activePokemonIndex && p.hp > 0);
        if (availableIndex !== -1) {
            player.activePokemonIndex = availableIndex;
            console.log(`Forced switch to ${getActivePlayerPokemon().name}!`);
        } else {
             alert("All your Pokémon have fainted! Game Over (conceptually). Returning to map.");
             switchMode('map');
             return;
        }
    }
    initializeBattleScreen();
    switchMode('battle');
}

// --- (Keep getActivePlayerPokemon, initializeBattleScreen, generateBattleActionButtons) ---
// --- (Keep showMoveButtons, showItemButtons, showSwitchButtons) ---
// --- (Keep generatePlayerMoveButtons, updateBattleDisplay, updateHealthBar, logMessage) ---
// --- (Keep handlePlayerMove, generateItemButtons, usePotion, usePokeball) ---
// --- (Keep generateSwitchButtons, handleSwitchPokemon, opponentTurn) ---

// Helper function to safely get the currently active player Pokémon
function getActivePlayerPokemon() {
    if (!player.party || player.party.length === 0 || player.activePokemonIndex >= player.party.length || player.activePokemonIndex < 0) {
        console.error("Invalid player party state!");
        return { id: 0, speciesName: 'error', name: "Error", hp: 0, maxHp: 0, sprite: "", moves: [], evolvesAtWins: undefined, evolution: undefined };
    }
    return player.party[player.activePokemonIndex];
}


// Sets up the battle screen UI elements
function initializeBattleScreen() {
    isPlayerTurn = true;
    battleOver = false;
    justEvolved = false;

    messageLog.innerHTML = '';
    const activePokemon = getActivePlayerPokemon();

    updateBattleDisplay();
    generatePlayerMoveButtons();
    generateBattleActionButtons();

    itemButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    playerMovesContainer.classList.add('hidden');

    playerSpriteEl.src = activePokemon.sprite;
    playerSpriteEl.onerror = () => playerSpriteEl.src = 'placeholder.png';
    opponentSpriteEl.src = opponentPokemon.sprite;
    opponentSpriteEl.onerror = () => opponentSpriteEl.src = 'placeholder.png';

    logMessage(`A wild ${opponentPokemon.name} appeared!`);
    if (activePokemon.hp > 0) {
        logMessage(`Go, ${activePokemon.name}!`);
    } else {
         logMessage(`Previous Pokémon fainted! Sending out ${activePokemon.name}!`);
    }

    actionPrompt.textContent = "Choose your action:";
    returnToMapButton.classList.add('hidden');
}

// Generates the main action buttons (Fight, Items, Switch)
function generateBattleActionButtons() {
    if (!battleButtonsContainer) { console.error("Battle buttons container not found"); return; }
    battleButtonsContainer.innerHTML = `
        <button onclick="showMoveButtons()">Fight</button>
        <button onclick="showItemButtons()">Items</button>
        <button onclick="showSwitchButtons()">Switch</button>
    `;
    battleButtonsContainer.classList.remove('hidden');
}

// --- UI Visibility Toggles ---
function showMoveButtons() {
    if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return;
    if (getActivePlayerPokemon().hp <= 0) {
        logMessage(`${getActivePlayerPokemon().name} has fainted and cannot fight!`);
        actionPrompt.textContent = "Choose another action (Switch recommended).";
        return;
    }
    playerMovesContainer.classList.remove('hidden');
    battleButtonsContainer.classList.add('hidden');
    itemButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose your move:";
    if(isPlayerTurn && !battleOver) enableMoveButtons();
}

function showItemButtons() {
     if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return;
    generateItemButtons();
    itemButtonsContainer.classList.remove('hidden');
    playerMovesContainer.classList.add('hidden');
    battleButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose an item:";
}

function showSwitchButtons() {
     if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return;
    generateSwitchButtons();
    switchPokemonContainer.classList.remove('hidden');
    playerMovesContainer.classList.add('hidden');
    battleButtonsContainer.classList.add('hidden');
    itemButtonsContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose a Pokémon to switch to:";
}
// --- End UI Visibility Toggles ---

// Generates move buttons for the currently active Pokémon
function generatePlayerMoveButtons() {
    if (!playerMovesContainer) { console.error("Player moves container not found"); return; }
    playerMovesContainer.innerHTML = '';
    const currentPokemon = getActivePlayerPokemon();
    if (!currentPokemon || !currentPokemon.moves) {
        console.error("Error generating moves: Active Pokemon or moves undefined", currentPokemon);
        return;
    }
    currentPokemon.moves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move.name;
        button.addEventListener('click', () => handlePlayerMove(move));
        playerMovesContainer.appendChild(button);
    });
}

// Updates the battle display (names, HP, health bars, sprites)
function updateBattleDisplay() {
    if (!playerNameEl || !playerHpEl || !playerMaxHpEl || !playerHealthBarEl || !playerSpriteEl ||
        !opponentNameEl || !opponentHpEl || !opponentMaxHpEl || !opponentHealthBarEl || !opponentSpriteEl) {
        console.error("One or more battle display elements are missing!");
        return;
    }

    const activePokemon = getActivePlayerPokemon();
    playerNameEl.textContent = activePokemon.name;
    playerHpEl.textContent = activePokemon.hp;
    playerMaxHpEl.textContent = activePokemon.maxHp;
    updateHealthBar(playerHealthBarEl, activePokemon.hp, activePokemon.maxHp);
    if (playerSpriteEl.src !== activePokemon.sprite && activePokemon.sprite) {
         playerSpriteEl.src = activePokemon.sprite;
    }

    opponentNameEl.textContent = opponentPokemon.name;
    opponentHpEl.textContent = opponentPokemon.hp;
    opponentMaxHpEl.textContent = opponentPokemon.maxHp;
    updateHealthBar(opponentHealthBarEl, opponentPokemon.hp, opponentPokemon.maxHp);
}

// Updates a single health bar's width and color class
function updateHealthBar(barElement, currentHp, maxHp) {
    if (!barElement) return;
    const percentage = Math.max(0, (currentHp / maxHp) * 100);
    barElement.style.width = `${percentage}%`;
    barElement.className = 'health-bar';
    if (percentage <= 0) barElement.style.backgroundColor = '#888';
    else if (percentage < 25) barElement.classList.add('critical');
    else if (percentage < 50) barElement.classList.add('low');
    else barElement.style.backgroundColor = ''; // Reset to default green
}

// Adds a message paragraph to the battle log
function logMessage(message) {
    if (!messageLog) return;
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    messageLog.appendChild(newMessage);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// --- Battle Actions ---

// Handles the player selecting and using a move
function handlePlayerMove(move) {
    if (!isPlayerTurn || battleOver || getActivePlayerPokemon().hp <= 0) return;
    disableAllButtons();

    const activePokemon = getActivePlayerPokemon();
    const damage = calculateDamage(move.power);
    opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage);

    logMessage(`${activePokemon.name} used ${move.name}! It dealt ${damage} damage.`);
    updateBattleDisplay();

    if (opponentPokemon.hp <= 0) {
        logMessage(`${opponentPokemon.name} fainted!`);
        endBattle(true);
    } else {
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500);
    }
}

// Generates buttons for usable items in the inventory
function generateItemButtons() {
    if (!itemButtonsContainer) return;
    itemButtonsContainer.innerHTML = '';
    let hasUsableItem = false;

    if (player.inventory.potions > 0) {
        const button = document.createElement('button');
        button.textContent = `Potion (${player.inventory.potions})`;
        button.onclick = () => usePotion();
        if(getActivePlayerPokemon().hp <= 0) {
            button.disabled = true;
            button.title = "Cannot use on fainted Pokémon.";
        } else {
             hasUsableItem = true;
        }
        itemButtonsContainer.appendChild(button);
    }
    if (player.inventory.pokeballs > 0) {
        const button = document.createElement('button');
        button.textContent = `Poké Ball (${player.inventory.pokeballs})`;
        if (opponentPokemon.hp >= opponentPokemon.maxHp * 0.5 || opponentPokemon.hp <= 0) {
             button.disabled = true;
             button.title = opponentPokemon.hp <= 0 ? "Opponent already fainted!" : "Opponent HP must be below 50%!";
        } else {
             button.onclick = () => usePokeball();
             hasUsableItem = true;
        }
        itemButtonsContainer.appendChild(button);
    }

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => {
        itemButtonsContainer.classList.add('hidden');
        generateBattleActionButtons();
        actionPrompt.textContent = "Choose your action:";
    };
    itemButtonsContainer.appendChild(backButton);

    if (!hasUsableItem && itemButtonsContainer.children.length <= 1) {
        const p = document.createElement('p');
        p.textContent = "No usable items in this situation.";
        itemButtonsContainer.prepend(p);
    }
}


// Logic for using a Potion item
function usePotion() {
    if (!isPlayerTurn || battleOver || player.inventory.potions <= 0 || getActivePlayerPokemon().hp <= 0) return;
    disableAllButtons();

    const activePokemon = getActivePlayerPokemon();
    const healAmount = Math.floor(activePokemon.maxHp * 0.4);
    const hpBefore = activePokemon.hp;
    activePokemon.hp = Math.min(activePokemon.maxHp, activePokemon.hp + healAmount);
    const healedBy = activePokemon.hp - hpBefore;

    if (healedBy > 0) {
        player.inventory.potions--;
        logMessage(`${activePokemon.name} used a Potion! Healed ${healedBy} HP.`);
        updateBattleDisplay();
        updateInventoryDisplay();
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500);
    } else {
        logMessage(`${activePokemon.name}'s HP is already full!`);
        generateItemButtons();
        itemButtonsContainer.querySelectorAll('button').forEach(b => b.disabled=false);
        actionPrompt.textContent = "Choose an item:";
    }
}

// Logic for using a Poké Ball item
function usePokeball() {
     if (!isPlayerTurn || battleOver || player.inventory.pokeballs <= 0) return;
     if (opponentPokemon.hp >= opponentPokemon.maxHp * 0.5 || opponentPokemon.hp <= 0) {
         logMessage("Cannot throw Poké Ball now!");
         generateItemButtons();
         return;
     }
    disableAllButtons();

    player.inventory.pokeballs--;
    logMessage(`You threw a Poké Ball!`);
    updateInventoryDisplay();

    const hpPercent = opponentPokemon.hp / opponentPokemon.maxHp;
    const captureChance = 0.50 + (0.5 - hpPercent) * 0.9;

    setTimeout(() => {
        if (Math.random() < captureChance) {
            logMessage(`Gotcha! ${opponentPokemon.name} was caught!`);
            battleOver = true;

            if (player.party.length < 6) {
                const caughtPokemon = JSON.parse(JSON.stringify(opponentPokemon));
                player.party.push(caughtPokemon);
                logMessage(`${caughtPokemon.name} added to your party.`);
            } else {
                logMessage("Your party is full! Cannot add Pokémon.");
            }

            actionPrompt.textContent = "Captured!";
            returnToMapButton.classList.remove('hidden');
            returnToMapButton.disabled = false; // Enable return button

        } else {
            logMessage(`Oh no! The Pokémon broke free!`);
            isPlayerTurn = false;
            setTimeout(opponentTurn, 1500);
        }
    }, 1000);
}

// Generates buttons for switching Pokémon
function generateSwitchButtons() {
    if (!switchPokemonContainer) return;
    switchPokemonContainer.innerHTML = '';
    let canSwitch = false;

    player.party.forEach((pokemon, index) => {
        const button = document.createElement('button');
        button.textContent = `${pokemon.name} (HP: ${pokemon.hp}/${pokemon.maxHp})`;

        if (index === player.activePokemonIndex || pokemon.hp <= 0) {
            button.disabled = true;
            if (index === player.activePokemonIndex) button.textContent += " - Active";
            if (pokemon.hp <= 0) button.textContent += " - Fainted";
        } else {
            button.onclick = () => handleSwitchPokemon(index);
            canSwitch = true;
        }
        switchPokemonContainer.appendChild(button);
    });

     const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => {
        switchPokemonContainer.classList.add('hidden');
        generateBattleActionButtons();
        actionPrompt.textContent = "Choose your action:";
    };
    switchPokemonContainer.appendChild(backButton);

    if (!canSwitch) {
         const p = document.createElement('p');
        p.textContent = "No other Pokémon available to switch.";
        switchPokemonContainer.prepend(p);
    }
}

// Handles the logic for switching the active Pokémon
function handleSwitchPokemon(partyIndex) {
    if (!isPlayerTurn || battleOver || partyIndex === player.activePokemonIndex || player.party[partyIndex].hp <= 0) return;
    disableAllButtons();

    const oldPokemonName = getActivePlayerPokemon().name;
    player.activePokemonIndex = partyIndex;
    const newPokemon = getActivePlayerPokemon();

    logMessage(`Come back, ${oldPokemonName}!`);
    logMessage(`Go, ${newPokemon.name}!`);

    updateBattleDisplay();
    generatePlayerMoveButtons();

    isPlayerTurn = false;
    setTimeout(opponentTurn, 1500);
}

// Handles the opponent's turn logic
function opponentTurn() {
    if (battleOver) return;
    const activePokemon = getActivePlayerPokemon();

    if (activePokemon.hp <= 0) {
         logMessage(`${activePokemon.name} has already fainted.`);
         isPlayerTurn = true;
         generateBattleActionButtons();
         actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
         if(battleButtonsContainer && battleButtonsContainer.querySelector('button:first-child')) {
            battleButtonsContainer.querySelector('button:first-child').disabled = true;
         }
         return;
    }

    logMessage(`${opponentPokemon.name}'s turn...`);
    const chosenMove = opponentPokemon.moves[Math.floor(Math.random() * opponentPokemon.moves.length)];
    const damage = calculateDamage(chosenMove.power);

    activePokemon.hp = Math.max(0, activePokemon.hp - damage);
    logMessage(`${opponentPokemon.name} used ${chosenMove.name}! It dealt ${damage} damage.`);
    updateBattleDisplay();

    if (activePokemon.hp <= 0) {
        logMessage(`${activePokemon.name} fainted!`);
        const availableIndex = player.party.findIndex((p, index) => index !== player.activePokemonIndex && p.hp > 0);
        if(availableIndex !== -1) {
            isPlayerTurn = true;
            generateBattleActionButtons();
            actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
             if(battleButtonsContainer && battleButtonsContainer.querySelector('button:first-child')) {
                battleButtonsContainer.querySelector('button:first-child').disabled = true;
             }
        } else {
             endBattle(false); // Player loses
        }
    } else {
        isPlayerTurn = true;
        generateBattleActionButtons();
        actionPrompt.textContent = "Choose your action:";
    }
}

// Damage calculation (scaled down)
function calculateDamage(basePower) {
    const variation = basePower * 0.2;
    const randomFactor = Math.random() * variation * 2 - variation;
    const rawDamage = basePower + randomFactor;
    const scalingFactor = 3.0; // Damage reduction factor
    const scaledDamage = rawDamage / scalingFactor;
    return Math.max(1, Math.round(scaledDamage));
}

// --- Utility Functions for Buttons ---
function disableAllButtons() {
    if (!battleView) return;
    battleView.querySelectorAll('button').forEach(button => {
        if (button.id === 'return-to-map-button' && !button.classList.contains('hidden')) {
            // Keep return button enabled if visible
        } else {
            button.disabled = true;
        }
    });
}
function enableMoveButtons() {
    if (playerMovesContainer && !playerMovesContainer.classList.contains('hidden')) {
        playerMovesContainer.querySelectorAll('button').forEach(button => button.disabled = false);
    }
}

// --- End Battle Logic ---
function endBattle(playerWon) {
    battleOver = true;
    disableAllButtons();
    justEvolved = false;

    if (playerWon && opponentPokemon.hp <= 0) {
        logMessage("You won the battle!");
        player.wins++;

        // --- Calculate Drops (Potion x2 Guaranteed, Money Added) ---
        calculateDrops();

        // --- Post-Battle Healing (Fainted to 50%, Others +25%) ---
        let healMessages = [];
        let didHeal = false;
        player.party.forEach(pokemon => {
            if (pokemon.hp <= 0) { // Revive fainted Pokemon
                pokemon.hp = Math.floor(pokemon.maxHp * 0.5); // Heal to 50%
                healMessages.push(`${pokemon.name} was revived to ${pokemon.hp} HP!`);
                didHeal = true;
            } else if (pokemon.hp < pokemon.maxHp) { // Heal non-fainted, non-full HP Pokemon
                const healAmount = Math.floor(pokemon.maxHp * 0.25); // Heal 25%
                const hpBefore = pokemon.hp;
                pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
                if (pokemon.hp > hpBefore) {
                    healMessages.push(`${pokemon.name} recovered ${pokemon.hp - hpBefore} HP.`);
                    didHeal = true;
                }
            }
        });
        if (didHeal) {
             logMessage("Your team recovered some energy!");
             healMessages.forEach(msg => logMessage(msg));
        }
        // --- END HEALING ---

        // --- Evolution Check ---
        const pokemonThatWon = getActivePlayerPokemon();
         if (pokemonThatWon && pokemonThatWon.evolvesAtWins && player.wins >= pokemonThatWon.evolvesAtWins && pokemonThatWon.evolution) {
            evolvePokemon(player.activePokemonIndex, pokemonThatWon.evolution);
            justEvolved = true;
         }

        updateInventoryDisplay();
        if (didHeal && !justEvolved) updateBattleDisplay(); // Update HP display now if needed
        if (justEvolved) {
             setTimeout(() => { updateBattleDisplay(); generatePlayerMoveButtons(); }, 1100);
        }

    } else if (!playerWon) {
        logMessage("You lost the battle...");
        const allFainted = player.party.every(p => p.hp <= 0);
        if (allFainted) {
            logMessage("All your Pokémon have fainted! Returning to map...");
        }
    }

     setTimeout(() => {
        if (returnToMapButton && returnToMapButton.classList.contains('hidden')) {
             actionPrompt.textContent = playerWon ? "Victory!" : "Defeated!";
             if (justEvolved) actionPrompt.textContent += " ...and Evolved!";
             returnToMapButton.classList.remove('hidden');
             returnToMapButton.disabled = false;
        }
     }, justEvolved ? 1200 : 100);
}


// --- Item Drop Logic (Potion x2 Guaranteed, Money Added) ---
function calculateDrops() {
    let dropsMessage = "Spoils: ";
    // --- Potion Drop (Guaranteed x2) ---
    player.inventory.potions += 2; // Add 2 potions
    dropsMessage += "Potion x2 ";
    // --- End Potion Drop ---

    // --- Money Drop (Random Amount) ---
    const moneyFound = Math.floor(Math.random() * 21) + 10; // $10-$30
    player.money += moneyFound;
    dropsMessage += `$${moneyFound} `;
    // --- End Money Drop ---

    // --- Poké Ball Drop (Random Chance) ---
    if (Math.random() < 0.40) { // 40% chance
        player.inventory.pokeballs++;
        dropsMessage += "Poké Ball x1 ";
    }
    // --- End Poké Ball Drop ---

    logMessage(dropsMessage);
    updateInventoryDisplay(); // Update map inventory immediately
}

// --- Evolution Logic ---
function evolvePokemon(partyIndex, evolutionSpeciesName) {
    const pokemonToEvolve = player.party[partyIndex];
    const evolutionData = pokemonData[evolutionSpeciesName];

    if (!evolutionData || !pokemonToEvolve) {
        console.error("Evolution data or Pokémon not found:", evolutionSpeciesName, pokemonToEvolve);
        return;
    }

    logMessage(`What? ${pokemonToEvolve.name} is evolving!`);

    const hpPercent = pokemonToEvolve.hp / pokemonToEvolve.maxHp;
    pokemonToEvolve.speciesName = evolutionData.speciesName;
    pokemonToEvolve.name = evolutionData.name;
    pokemonToEvolve.maxHp = evolutionData.maxHp;
    pokemonToEvolve.hp = Math.max(1, Math.round(evolutionData.maxHp * hpPercent));
    pokemonToEvolve.sprite = evolutionData.sprite;
    pokemonToEvolve.moves = JSON.parse(JSON.stringify(evolutionData.moves));
    pokemonToEvolve.evolvesAtWins = undefined;
    pokemonToEvolve.evolution = undefined;

    setTimeout(() => {
        logMessage(`Congratulations! Your ${pokemonToEvolve.speciesName} evolved into ${evolutionData.name}!`);
    }, 1000);
}


// --- Event Listeners ---
document.addEventListener('keydown', handleKeydown);
if (returnToMapButton) {
    returnToMapButton.addEventListener('click', () => {
        if (getActivePlayerPokemon().hp <= 0) {
            const availableIndex = player.party.findIndex((p, index) => index !== player.activePokemonIndex && p.hp > 0);
            if (availableIndex !== -1) {
                player.activePokemonIndex = availableIndex;
                console.log(`Switched active Pokemon to ${getActivePlayerPokemon().name} before returning to map.`);
            } else {
                console.log("Returning to map with all Pokemon fainted.");
            }
        }
       switchMode('map');
       battleOver = false;
    });
} else {
    console.error("Return to map button not found for event listener attachment!");
}

// --- Initial Game Setup ---
window.onload = initializeGame;
