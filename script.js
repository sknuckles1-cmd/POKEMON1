// --- Pokémon Data (Expanded - Ensure starters are present) ---
const pokemonData = {
    pikachu: { id: 25, speciesName: 'pikachu', name: "Pikachu", hp: 100, maxHp: 100, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', moves: [ { name: "Thunder Shock", power: 40 }, { name: "Quick Attack", power: 35 }, { name: "Iron Tail", power: 50 }, { name: "Spark", power: 30 } ], evolvesAtWins: 5, evolution: 'raichu' },
    raichu: { id: 26, speciesName: 'raichu', name: "Raichu", hp: 130, maxHp: 130, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png', moves: [ { name: "Thunder Punch", power: 75 }, { name: "Quick Attack", power: 40 }, { name: "Iron Tail", power: 60 }, { name: "Thunderbolt", power: 90 } ] },
    charmander: { id: 4, speciesName: 'charmander', name: "Charmander", hp: 120, maxHp: 120, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', moves: [ { name: "Scratch", power: 40 }, { name: "Ember", power: 45 }, { name: "Dragon Breath", power: 50 }, { name: "Fire Fang", power: 48 } ] },
    rattata: { id: 19, speciesName: 'rattata', name: "Rattata", hp: 80, maxHp: 80, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png', moves: [ { name: "Tackle", power: 35 }, { name: "Quick Attack", power: 35 }, { name: "Hyper Fang", power: 60 } ] },
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
    party: [], // Holds the player's current Pokémon
    inventory: { potions: 2, pokeballs: 5 }, // Items the player possesses
    wins: 0, // Counter for battles won (used for evolution)
    activePokemonIndex: 0, // Index in the party array of the currently fighting Pokémon
    money: 150 // Currency for the store
};

// --- Game State Variables ---
let currentMode = 'starter-select'; // Current view ('map', 'battle', 'store', 'starter-select')
let opponentPokemon; // Holds the data for the current wild opponent
let isPlayerTurn = true; // Flag indicating whose turn it is in battle
let battleOver = false; // Flag indicating if the current battle has ended
let justEvolved = false; // Flag used for displaying evolution messages correctly

// --- Map State ---
const mapRows = 15; // Height of the map grid
const mapCols = 20; // Width of the map grid
let dungeonLayout = []; // 2D array representing the map layout (generated)
// Tile type definitions
const TILE_TYPES = { EMPTY: 0, WALL: 1, PLAYER_START: 2, ENCOUNTER: 3, STORE: 5 };
let playerPos = { x: 0, y: 0 }; // Player's current coordinates on the map

// --- Store Item Prices ---
const itemPrices = {
    potion: 50,
    pokeball: 100
};

// --- DOM Element References ---
// Get references to the main view containers
const starterSelectView = document.getElementById('starter-select-view');
const starterOptionsContainer = document.getElementById('starter-options');
const mapView = document.getElementById('map-view');
const battleView = document.getElementById('battle-view');
const storeView = document.getElementById('store-view');
// Map elements
const dungeonGrid = document.getElementById('dungeon-grid');
const inventoryDisplay = document.getElementById('inventory-display');
// Battle View Elements (Player)
const playerNameEl = document.getElementById('player-name');
const playerHpEl = document.getElementById('player-hp');
const playerMaxHpEl = document.getElementById('player-max-hp');
const playerHealthBarEl = document.getElementById('player-health-bar');
const playerSpriteEl = document.getElementById('player-sprite');
// Battle View Elements (Opponent)
const opponentNameEl = document.getElementById('opponent-name');
const opponentHpEl = document.getElementById('opponent-hp');
const opponentMaxHpEl = document.getElementById('opponent-max-hp');
const opponentHealthBarEl = document.getElementById('opponent-health-bar');
const opponentSpriteEl = document.getElementById('opponent-sprite');
// Battle View Elements (Actions & Log)
const actionPrompt = document.getElementById('action-prompt');
const battleButtonsContainer = document.getElementById('battle-buttons');
const playerMovesContainer = document.getElementById('player-moves');
const itemButtonsContainer = document.getElementById('item-buttons');
const switchPokemonContainer = document.getElementById('switch-pokemon-buttons');
const messageLog = document.getElementById('message-log');
const returnToMapButton = document.getElementById('return-to-map-button');
// Store View Elements (Assigned in initializeGame)
let storeMoneyDisplay = null;
let storeItemList = null;
let storeMessage = null;


// --- Map Generation ---
/**
 * Generates a random map layout.
 * @param {number} rows - Number of rows for the map.
 * @param {number} cols - Number of columns for the map.
 * @returns {Array<Array<number>>} - The generated 2D map array.
 */
function generateMap(rows, cols) {
    console.log(`Generating map (${rows}x${cols})`);
    // Initialize map with empty tiles
    let map = Array.from({ length: rows }, () => Array(cols).fill(TILE_TYPES.EMPTY));

    // Place walls randomly (with density) and ensure borders are walls
    const wallDensity = 0.20; // 20% chance for a non-border tile to be a wall
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (y === 0 || y === rows - 1 || x === 0 || x === cols - 1) {
                map[y][x] = TILE_TYPES.WALL; // Border walls
            } else if (Math.random() < wallDensity) {
                map[y][x] = TILE_TYPES.WALL; // Random inner walls
            }
        }
    }

    // --- Place Player Start ---
    // Find an empty spot for the player to start and store the coordinates
    let startX, startY;
     let startPlaced = false;
     while (!startPlaced) {
         startX = Math.floor(Math.random() * (cols - 2)) + 1; // Avoid placing on borders
         startY = Math.floor(Math.random() * (rows - 2)) + 1;
         if (map[startY][startX] === TILE_TYPES.EMPTY) {
             // Don't set tile type here, just store starting position
             playerPos = { x: startX, y: startY };
             startPlaced = true;
             console.log(`Player start position determined: ${startX}, ${startY}`);
         }
     }

    // --- Place Store ---
    // Find an empty spot for the store, avoiding the player start position
    let storePlaced = false;
    while (!storePlaced) {
        const storeX = Math.floor(Math.random() * (cols - 2)) + 1;
        const storeY = Math.floor(Math.random() * (rows - 2)) + 1;
        // Ensure it's empty and not the player's starting tile
        if (map[storeY][storeX] === TILE_TYPES.EMPTY && !(storeX === startX && storeY === startY)) {
            map[storeY][storeX] = TILE_TYPES.STORE;
            storePlaced = true;
             console.log(`Store placed at: ${storeX}, ${storeY}`);
        }
    }

    // --- Place Encounters ---
    // Randomly place encounter tiles on empty spaces
    const numEncounters = Math.floor(rows * cols * 0.08); // Target ~8% encounter density
    let encountersPlaced = 0;
    let attempts = 0; // Prevent potential infinite loop if map is too full
    while (encountersPlaced < numEncounters && attempts < rows * cols * 2) {
        const encounterX = Math.floor(Math.random() * (cols - 2)) + 1;
        const encounterY = Math.floor(Math.random() * (rows - 2)) + 1;
        // Ensure it's empty and not the start or store tile
        if (map[encounterY][encounterX] === TILE_TYPES.EMPTY && !(encounterX === startX && encounterY === startY)) {
            map[encounterY][encounterX] = TILE_TYPES.ENCOUNTER;
            encountersPlaced++;
        }
        attempts++;
    }
     console.log(`Placed ${encountersPlaced} encounter tiles.`);

    // NOTE: This simple generation doesn't guarantee reachability of store/encounters.
    // A more complex algorithm (like flood fill or maze generation) would be needed for that.

    return map;
}


// --- Game Initialization ---
/**
 * Initializes the game state, assigns DOM elements, and shows the starter selection screen.
 */
function initializeGame() {
    // Assign Store DOM References (ensures DOM is loaded)
    storeMoneyDisplay = document.getElementById('store-money');
    storeItemList = document.getElementById('store-item-list');
    storeMessage = document.getElementById('store-message');
    // Basic check to ensure store elements exist in HTML
    if (!storeView || !storeMoneyDisplay || !storeItemList || !storeMessage) {
         console.error("Error: One or more store DOM elements not found! Make sure IDs match the HTML.");
         // Consider disabling store functionality or alerting the user
    }

    // --- Show Starter Selection Screen ---
    console.log("Initializing game - showing starter selection.");
    populateStarterSelection(); // Create the starter options UI
    // Hide other game views initially
    if (mapView) mapView.classList.add('hidden');
    if (battleView) battleView.classList.add('hidden');
    if (storeView) storeView.classList.add('hidden');
    // Show the starter selection view
    if (starterSelectView) starterSelectView.classList.remove('hidden');
    currentMode = 'starter-select'; // Set the initial game mode
}

// --- Populate Starter Selection UI ---
/**
 * Creates and displays the UI elements for choosing a starter Pokémon.
 */
function populateStarterSelection() {
    if (!starterOptionsContainer) {
        console.error("Starter options container not found!");
        return;
    }
    starterOptionsContainer.innerHTML = ''; // Clear any previous options

    // Define which Pokémon are available as starters
    const starterKeys = ['pikachu', 'charmander', 'oddish']; // Use speciesName keys

    // Create a card for each starter choice
    starterKeys.forEach(key => {
        const data = pokemonData[key]; // Get data from pokemonData object
        if (data) {
            // Create elements for the card
            const card = document.createElement('div');
            card.classList.add('starter-card');

            const img = document.createElement('img');
            img.src = data.sprite;
            img.alt = data.name;
            img.onerror = () => img.src = 'placeholder.png'; // Fallback sprite

            const name = document.createElement('h3');
            name.textContent = data.name;

            const button = document.createElement('button');
            button.textContent = `Choose ${data.name}`;
            // Set button click handler to call selectStarter with the chosen key
            button.onclick = () => selectStarter(key);

            // Append elements to the card
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(button);
            // Add the card to the options container
            starterOptionsContainer.appendChild(card);
        } else {
             console.warn(`Starter data not found for key: ${key}`);
        }
    });
}

// --- Starter Selection Logic ---
/**
 * Handles the player's starter selection, initializes the player state,
 * generates the map, and switches to the map view to start the game.
 * @param {string} starterKey - The speciesName key of the chosen starter.
 */
function selectStarter(starterKey) {
    console.log(`Starter selected: ${starterKey}`);
    const starterData = pokemonData[starterKey];

    if (!starterData) {
        console.error(`Invalid starter key selected: ${starterKey}`);
        return; // Exit if data is missing
    }

    // --- Initialize Player State with Chosen Starter ---
    player.party = []; // Ensure party is empty before adding starter
    const chosenStarter = JSON.parse(JSON.stringify(starterData)); // Deep copy starter data
    chosenStarter.hp = chosenStarter.maxHp; // Start at full health
    player.party.push(chosenStarter); // Add to party
    player.activePokemonIndex = 0; // Set as active

    // Reset other player stats for a new game
    player.wins = 0;
    player.inventory = { potions: 2, pokeballs: 5 }; // Reset inventory
    player.money = 150; // Reset money

    // --- Generate Map and Setup Game ---
    dungeonLayout = generateMap(mapRows, mapCols); // Generate the map layout
    // Player starting position `playerPos` is set within generateMap

    setupMapGrid(); // Setup the HTML grid element based on new dimensions/layout
    updateInventoryDisplay(); // Show initial inventory/stats

    // --- Switch to Map View ---
    if (starterSelectView) starterSelectView.classList.add('hidden'); // Hide starter screen
    switchMode('map'); // Change game mode to 'map'
    // renderMap(); // Initial render is handled by switchMode('map') now
    console.log("Game started with chosen starter!");
}


// --- Inventory Display ---
/**
 * Updates the inventory display element on the map view.
 */
function updateInventoryDisplay() {
    if (inventoryDisplay) {
        inventoryDisplay.innerHTML = `
            Inventory:
            Potions: ${player.inventory.potions} |
            Poké Balls: ${player.inventory.pokeballs} |
            Wins: ${player.wins} |
            Money: $${player.money}
        `;
    } else {
        console.warn("Inventory display element not found.");
    }
}

// --- Mode Switching ---
/**
 * Switches the visible game view (map, battle, store).
 * @param {string} newMode - The mode to switch to ('map', 'battle', 'store').
 */
function switchMode(newMode) {
    currentMode = newMode;
    // Hide all views first
    if (mapView) mapView.classList.add('hidden');
    if (battleView) battleView.classList.add('hidden');
    if (storeView) storeView.classList.add('hidden');
    if (starterSelectView) starterSelectView.classList.add('hidden'); // Also hide starter select

    // Show the target view
    if (newMode === 'map') {
        if (mapView) {
            mapView.classList.remove('hidden');
            renderMap(); // Render map when switching to it
            updateInventoryDisplay(); // Update inventory display
        } else { console.error("Map view element not found"); }
    } else if (newMode === 'battle') {
        if (battleView) {
            battleView.classList.remove('hidden');
            // Battle initialization is called by startBattle before this switch
        } else { console.error("Battle view element not found"); }
    } else if (newMode === 'store') {
        if (storeView) {
            storeView.classList.remove('hidden');
            openStore(); // Populate store UI when opening
        } else { console.error("Store view element not found"); }
    }
    // No action needed for 'starter-select' as it's handled by initializeGame
}

// --- Map Rendering and Logic ---
/**
 * Sets up the CSS Grid container for the map based on dimensions.
 */
function setupMapGrid() {
    if (!dungeonGrid) { console.error("Dungeon grid element not found"); return; }
    dungeonGrid.innerHTML = ''; // Clear previous grid cells
    // Set grid dimensions using CSS variables or direct style manipulation
    dungeonGrid.style.gridTemplateColumns = `repeat(${mapCols}, 35px)`; // Adjust cell size if needed
    dungeonGrid.style.gridTemplateRows = `repeat(${mapRows}, 35px)`;

    // Create grid cell elements
    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.id = `cell-${x}-${y}`; // Unique ID for each cell
            dungeonGrid.appendChild(cell);
        }
    }
}

/**
 * Renders the current state of the map, including tiles and player position.
 */
function renderMap() {
    if (currentMode !== 'map') return; // Only render when map is active

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const cell = document.getElementById(`cell-${x}-${y}`);
            if (!cell) continue; // Skip if cell element doesn't exist
            cell.className = 'grid-cell'; // Reset classes
            cell.innerHTML = ''; // Clear previous content (like player marker)

            // Safety check for map layout data
            if (!dungeonLayout[y] || dungeonLayout[y][x] === undefined) {
                 console.warn(`Map data missing for cell ${x},${y}`);
                 cell.classList.add('wall'); // Default to wall if data is missing
                 continue;
            }

            const tileType = dungeonLayout[y][x];

            // Apply CSS class based on the tile type
            if (tileType === TILE_TYPES.WALL) cell.classList.add('wall');
            else if (tileType === TILE_TYPES.ENCOUNTER) cell.classList.add('encounter');
            else if (tileType === TILE_TYPES.STORE) cell.classList.add('store');
            // Add more tile types here if needed

            // Draw the player marker if this cell is the player's position
            if (x === playerPos.x && y === playerPos.y) {
                const playerMarker = document.createElement('div');
                playerMarker.classList.add('player');
                cell.appendChild(playerMarker);
            }
        }
    }
}

// --- Player Movement ---
/**
 * Handles keyboard input for player movement on the map.
 * @param {KeyboardEvent} event - The keydown event object.
 */
function handleKeydown(event) {
    // Ignore input if not in map mode or if a battle just ended (waiting for transition)
    if (currentMode !== 'map' || battleOver) return;

    let dx = 0; // Change in x
    let dy = 0; // Change in y

    // Determine movement direction based on arrow key pressed
    switch (event.key) {
        case 'ArrowUp': dy = -1; break;
        case 'ArrowDown': dy = 1; break;
        case 'ArrowLeft': dx = -1; break;
        case 'ArrowRight': dx = 1; break;
        default: return; // Ignore keys other than arrows
    }

    event.preventDefault(); // Prevent arrow keys from scrolling the page

    // Calculate target coordinates
    const targetX = playerPos.x + dx;
    const targetY = playerPos.y + dy;

    // Check if target is within map boundaries
    if (targetX < 0 || targetX >= mapCols || targetY < 0 || targetY >= mapRows) {
        return; // Cannot move outside map
    }

    // Check the type of the target tile
     if (!dungeonLayout[targetY] || dungeonLayout[targetY][targetX] === undefined) {
         console.warn(`Attempted move to invalid map coordinates: ${targetX},${targetY}`);
         return; // Prevent moving to undefined area
     }
    const targetTileType = dungeonLayout[targetY][targetX];

    // Check for obstacles (walls)
    if (targetTileType === TILE_TYPES.WALL) {
        return; // Cannot move into a wall
    }

    // Check for store interaction
    if (targetTileType === TILE_TYPES.STORE) {
        switchMode('store'); // Open the store UI
        // Player position doesn't change yet, they interact with the store from adjacent tile conceptually
        return; // Stop further processing for this move
    }

    // If the move is valid (not wall, not store), update player position
    playerPos.x = targetX;
    playerPos.y = targetY;

    renderMap(); // Update the map display to show the new player position

    // Check for encounter on the new tile *after* moving
    if (targetTileType === TILE_TYPES.ENCOUNTER) {
        startBattle(); // Initiate a battle
    }
}

// --- Store Logic ---
/**
 * Populates and displays the store UI.
 */
function openStore() {
    console.log("Opening Store");
    // Ensure store DOM elements are available
    if (!storeView || !storeMoneyDisplay || !storeItemList || !storeMessage) {
        console.error("Store DOM elements not ready or found!");
        switchMode('map'); // Fallback to map if store UI is broken
        alert("Error opening store!");
        return;
    }
    // Reset store message and update player money display
    storeMessage.textContent = "Welcome! What would you like to buy?";
    storeMoneyDisplay.textContent = `Your Money: $${player.money}`;
    storeItemList.innerHTML = ''; // Clear previous item listings

    // --- Add Items to Store List ---
    // Potion
    const potionItem = document.createElement('li');
    potionItem.innerHTML = `
        Potion - $${itemPrices.potion}
        <button onclick="buyItem('potion')">Buy</button>
        <span>(Heals ~40% HP)</span>
    `;
    storeItemList.appendChild(potionItem);

    // Poké Ball
    const pokeballItem = document.createElement('li');
    pokeballItem.innerHTML = `
        Poké Ball - $${itemPrices.pokeball}
        <button onclick="buyItem('pokeball')">Buy</button>
        <span>(Chance to catch wild Pokémon)</span>
    `;
    storeItemList.appendChild(pokeballItem);
    // --- End Adding Items ---

     // Ensure Leave button exists and is correctly configured
     const leaveButton = document.getElementById('leave-store-button');
     if (!leaveButton) {
         console.error("Leave store button not found in HTML!");
         // As a fallback, create it dynamically if missing from HTML
         const btn = document.createElement('button');
         btn.id = 'leave-store-button';
         btn.textContent = 'Leave Store';
         btn.onclick = closeStore;
         storeView.appendChild(btn); // Append it somewhere reasonable
     } else {
         // Ensure the onclick is set if it wasn't hardcoded in HTML
         leaveButton.onclick = closeStore;
     }
}

/**
 * Handles the logic for buying an item from the store.
 * @param {string} itemName - The key ('potion' or 'pokeball') of the item to buy.
 */
function buyItem(itemName) {
    // Check if item exists in price list
    if (!itemPrices[itemName]) {
        console.error("Unknown item:", itemName);
        if(storeMessage) storeMessage.textContent = "Sorry, we don't sell that.";
        return;
    }

    const price = itemPrices[itemName];

    // Check if player has enough money
    if (player.money >= price) {
        player.money -= price; // Deduct cost

        // Add item to player inventory
        if (itemName === 'potion') player.inventory.potions++;
        else if (itemName === 'pokeball') player.inventory.pokeballs++;
        // Add more items here if needed

        // Update UI and provide feedback
        if(storeMessage) storeMessage.textContent = `Purchased ${itemName}!`;
        if(storeMoneyDisplay) storeMoneyDisplay.textContent = `Your Money: $${player.money}`;
        updateInventoryDisplay(); // Update the main inventory display as well
        console.log(`Bought ${itemName}. Money left: ${player.money}, Inventory:`, player.inventory);
    } else {
        // Not enough money
        if(storeMessage) storeMessage.textContent = "Sorry, you don't have enough money.";
    }
}

/**
 * Closes the store UI and returns to the map view.
 */
function closeStore() {
    console.log("Closing Store");
    switchMode('map'); // Switch back to map view
    // Player remains on the tile they were on when they entered the store.
    // They need to move off the store tile to explore further.
}


// --- Battle Logic ---
/**
 * Initiates a battle with a randomly selected opponent.
 */
function startBattle() {
    console.log("Starting battle!");
    // Select a random opponent from the available pool
    const opponentsPool = [
        pokemonData.charmander, pokemonData.rattata, pokemonData.pidgey, pokemonData.spearow,
        pokemonData.ekans, pokemonData.sandshrew, pokemonData.nidoran_f, pokemonData.nidoran_m,
        pokemonData.vulpix, pokemonData.zubat, pokemonData.oddish, pokemonData.geodude
    ];
    const randomOpponentData = opponentsPool[Math.floor(Math.random() * opponentsPool.length)];
    opponentPokemon = JSON.parse(JSON.stringify(randomOpponentData)); // Deep copy opponent data

    // Check if player's current Pokemon is fainted, force switch if possible
    if (getActivePlayerPokemon().hp <= 0) {
        const availableIndex = player.party.findIndex((p, index) => index !== player.activePokemonIndex && p.hp > 0);
        if (availableIndex !== -1) {
            player.activePokemonIndex = availableIndex; // Switch to first available
            console.log(`Forced switch to ${getActivePlayerPokemon().name}!`);
        } else {
             // Game Over scenario
             alert("All your Pokémon have fainted! Game Over (conceptually). Returning to map.");
             switchMode('map'); // Go back to map
             return; // Stop battle initiation
        }
    }

    // Setup the battle screen UI and switch modes
    initializeBattleScreen();
    switchMode('battle');
}

/**
 * Safely retrieves the player's currently active Pokémon object from the party.
 * @returns {object} The active Pokémon object, or a dummy object if state is invalid.
 */
function getActivePlayerPokemon() {
    // Safety checks for invalid party state
    if (!player.party || player.party.length === 0 || player.activePokemonIndex >= player.party.length || player.activePokemonIndex < 0) {
        console.error("Invalid player party state!");
        // Return a dummy object to prevent errors
        return { id: 0, speciesName: 'error', name: "Error", hp: 0, maxHp: 0, sprite: "", moves: [], evolvesAtWins: undefined, evolution: undefined };
    }
    return player.party[player.activePokemonIndex];
}


/**
 * Sets up the battle screen UI elements for a new battle.
 */
function initializeBattleScreen() {
    // Reset battle state variables
    isPlayerTurn = true;
    battleOver = false;
    justEvolved = false;

    messageLog.innerHTML = ''; // Clear previous battle log
    const activePokemon = getActivePlayerPokemon();

    // Update UI elements with current battle data
    updateBattleDisplay();
    generatePlayerMoveButtons(); // Generate moves for the active Pokemon
    generateBattleActionButtons(); // Generate Fight/Item/Switch buttons

    // Hide sub-action containers initially
    itemButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    playerMovesContainer.classList.add('hidden'); // Moves shown only after clicking "Fight"

    // Set Pokémon sprites, with error handling for broken links
    playerSpriteEl.src = activePokemon.sprite;
    playerSpriteEl.onerror = () => playerSpriteEl.src = 'placeholder.png';
    opponentSpriteEl.src = opponentPokemon.sprite;
    opponentSpriteEl.onerror = () => opponentSpriteEl.src = 'placeholder.png';

    // Log initial battle messages
    logMessage(`A wild ${opponentPokemon.name} appeared!`);
    // Adjust message if a switch was forced due to fainting
    if (activePokemon.hp > 0) {
        logMessage(`Go, ${activePokemon.name}!`);
    } else {
         // This message implies a forced switch happened before this function
         logMessage(`Sending out ${activePokemon.name}!`);
    }

    actionPrompt.textContent = "Choose your action:";
    returnToMapButton.classList.add('hidden'); // Hide return button until battle ends
}

/**
 * Generates the main action buttons (Fight, Items, Switch).
 */
function generateBattleActionButtons() {
    if (!battleButtonsContainer) { console.error("Battle buttons container not found"); return; }
    // Set inner HTML to create the three main action buttons
    battleButtonsContainer.innerHTML = `
        <button onclick="showMoveButtons()">Fight</button>
        <button onclick="showItemButtons()">Items</button>
        <button onclick="showSwitchButtons()">Switch</button>
    `;
    battleButtonsContainer.classList.remove('hidden'); // Make sure the container is visible
}

// --- UI Visibility Toggles ---
/** Shows the move buttons and hides other action buttons. */
function showMoveButtons() {
    if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return;
    // Prevent fighting if the active Pokémon has fainted
    if (getActivePlayerPokemon().hp <= 0) {
        logMessage(`${getActivePlayerPokemon().name} has fainted and cannot fight!`);
        actionPrompt.textContent = "Choose another action (Switch recommended).";
        return;
    }
    // Toggle visibility
    playerMovesContainer.classList.remove('hidden');
    battleButtonsContainer.classList.add('hidden');
    itemButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose your move:";
    // Enable buttons if it's the player's turn and the battle isn't over
    if(isPlayerTurn && !battleOver) enableMoveButtons();
}

/** Shows the item selection buttons and hides other action buttons. */
function showItemButtons() {
     if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return;
    // Generate buttons for currently held items
    generateItemButtons();
    // Toggle visibility
    itemButtonsContainer.classList.remove('hidden');
    playerMovesContainer.classList.add('hidden');
    battleButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose an item:";
}

/** Shows the Pokémon switching buttons and hides other action buttons. */
function showSwitchButtons() {
     if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return;
    // Generate buttons for switchable party members
    generateSwitchButtons();
    // Toggle visibility
    switchPokemonContainer.classList.remove('hidden');
    playerMovesContainer.classList.add('hidden');
    battleButtonsContainer.classList.add('hidden');
    itemButtonsContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose a Pokémon to switch to:";
}
// --- End UI Visibility Toggles ---

/**
 * Generates the move buttons based on the active Pokémon's moveset.
 */
function generatePlayerMoveButtons() {
    if (!playerMovesContainer) { console.error("Player moves container not found"); return; }
    playerMovesContainer.innerHTML = ''; // Clear existing buttons
    const currentPokemon = getActivePlayerPokemon();
    // Safety check
    if (!currentPokemon || !currentPokemon.moves) {
        console.error("Error generating moves: Active Pokemon or moves undefined", currentPokemon);
        return;
    }
    // Create a button for each move
    currentPokemon.moves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move.name;
        // Add click listener to execute the move
        button.addEventListener('click', () => handlePlayerMove(move));
        playerMovesContainer.appendChild(button);
    });
    // Note: Buttons start hidden, visibility controlled by showMoveButtons
}

/**
 * Updates the battle display elements (names, HP, bars, sprites).
 */
function updateBattleDisplay() {
    // Safety checks for essential DOM elements
    if (!playerNameEl || !playerHpEl || !playerMaxHpEl || !playerHealthBarEl || !playerSpriteEl ||
        !opponentNameEl || !opponentHpEl || !opponentMaxHpEl || !opponentHealthBarEl || !opponentSpriteEl) {
        console.error("One or more battle display elements are missing!");
        return;
    }

    const activePokemon = getActivePlayerPokemon();
    // Update Player's side
    playerNameEl.textContent = activePokemon.name;
    playerHpEl.textContent = activePokemon.hp;
    playerMaxHpEl.textContent = activePokemon.maxHp;
    updateHealthBar(playerHealthBarEl, activePokemon.hp, activePokemon.maxHp);
    // Update sprite if it has changed (e.g., after evolution)
    if (playerSpriteEl.src !== activePokemon.sprite && activePokemon.sprite) {
         playerSpriteEl.src = activePokemon.sprite;
    }

    // Update Opponent's side
    opponentNameEl.textContent = opponentPokemon.name;
    opponentHpEl.textContent = opponentPokemon.hp;
    opponentMaxHpEl.textContent = opponentPokemon.maxHp;
    updateHealthBar(opponentHealthBarEl, opponentPokemon.hp, opponentPokemon.maxHp);
}

/**
 * Updates the visual appearance (width, color) of a health bar element.
 * @param {HTMLElement} barElement - The health bar's inner element.
 * @param {number} currentHp - Current HP value.
 * @param {number} maxHp - Maximum HP value.
 */
function updateHealthBar(barElement, currentHp, maxHp) {
    if (!barElement) return; // Safety check
    const percentage = Math.max(0, (currentHp / maxHp) * 100); // Calculate HP percentage
    barElement.style.width = `${percentage}%`; // Set width based on percentage
    // Apply CSS classes for color coding based on HP level
    barElement.className = 'health-bar'; // Reset classes first
    if (percentage <= 0) {
         barElement.style.backgroundColor = '#888'; // Grey out fainted bar
         barElement.style.width = '0%'; // Ensure it's visually empty
    } else if (percentage < 25) {
        barElement.classList.add('critical'); // Red
        barElement.style.backgroundColor = ''; // Use class style
    } else if (percentage < 50) {
        barElement.classList.add('low'); // Yellow/Orange
        barElement.style.backgroundColor = ''; // Use class style
    } else {
        barElement.style.backgroundColor = ''; // Reset to default (green via CSS)
    }
}

/**
 * Adds a paragraph element with the given message to the battle log.
 * @param {string} message - The message to log.
 */
function logMessage(message) {
    if (!messageLog) return; // Safety check
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    messageLog.appendChild(newMessage);
    // Automatically scroll the log to the bottom
    messageLog.scrollTop = messageLog.scrollHeight;
}

// --- Battle Actions ---

/**
 * Handles the player selecting and executing a Pokémon move.
 * @param {object} move - The move object ({ name, power }).
 */
function handlePlayerMove(move) {
    // Check if the player can act
    if (!isPlayerTurn || battleOver || getActivePlayerPokemon().hp <= 0) return;
    disableAllButtons(); // Disable controls during the action sequence

    const activePokemon = getActivePlayerPokemon();
    const damage = calculateDamage(move.power); // Calculate damage dealt
    opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage); // Apply damage to opponent

    logMessage(`${activePokemon.name} used ${move.name}! It dealt ${damage} damage.`);
    updateBattleDisplay(); // Update health bars

    // Check if the opponent fainted
    if (opponentPokemon.hp <= 0) {
        logMessage(`${opponentPokemon.name} fainted!`);
        endBattle(true); // Player wins the battle
    } else {
        // If opponent survives, pass the turn
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500); // Opponent's turn after a delay
    }
}

/**
 * Generates the buttons for the item selection menu based on player inventory.
 */
function generateItemButtons() {
    if (!itemButtonsContainer) return; // Safety check
    itemButtonsContainer.innerHTML = ''; // Clear previous buttons
    let hasUsableItem = false; // Flag to track if any item can be used

    // Create Potion button
    if (player.inventory.potions > 0) {
        const button = document.createElement('button');
        button.textContent = `Potion (${player.inventory.potions})`;
        button.onclick = () => usePotion();
        // Disable if active Pokémon is fainted
        if(getActivePlayerPokemon().hp <= 0) {
            button.disabled = true;
            button.title = "Cannot use on fainted Pokémon.";
        } else {
             hasUsableItem = true; // Potion is usable
        }
        itemButtonsContainer.appendChild(button);
    }
    // Create Poké Ball button
    if (player.inventory.pokeballs > 0) {
        const button = document.createElement('button');
        button.textContent = `Poké Ball (${player.inventory.pokeballs})`;
        // Disable if opponent is fainted or HP too high for capture
        if (opponentPokemon.hp >= opponentPokemon.maxHp * 0.5 || opponentPokemon.hp <= 0) {
             button.disabled = true;
             button.title = opponentPokemon.hp <= 0 ? "Opponent already fainted!" : "Opponent HP must be below 50%!";
        } else {
             button.onclick = () => usePokeball();
             hasUsableItem = true; // Poké Ball is usable
        }
        itemButtonsContainer.appendChild(button);
    }

    // Add a "Back" button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => {
        itemButtonsContainer.classList.add('hidden'); // Hide item menu
        generateBattleActionButtons(); // Show main action buttons
        actionPrompt.textContent = "Choose your action:";
    };
    itemButtonsContainer.appendChild(backButton);

    // If no items were usable, display a message
    if (!hasUsableItem && itemButtonsContainer.children.length <= 1) { // Only Back button exists
        const p = document.createElement('p');
        p.textContent = "No usable items in this situation.";
        itemButtonsContainer.prepend(p); // Add message at the top
    }
}


/**
 * Handles the logic for using a Potion.
 */
function usePotion() {
    // Check if potion can be used
    if (!isPlayerTurn || battleOver || player.inventory.potions <= 0 || getActivePlayerPokemon().hp <= 0) return;
    disableAllButtons(); // Disable controls

    const activePokemon = getActivePlayerPokemon();
    const healAmount = Math.floor(activePokemon.maxHp * 0.4); // Potion heals 40%
    const hpBefore = activePokemon.hp;
    activePokemon.hp = Math.min(activePokemon.maxHp, activePokemon.hp + healAmount); // Heal, cap at max HP
    const healedBy = activePokemon.hp - hpBefore; // Amount actually healed

    if (healedBy > 0) {
        // If healing occurred: consume item, log, update UI, pass turn
        player.inventory.potions--;
        logMessage(`${activePokemon.name} used a Potion! Healed ${healedBy} HP.`);
        updateBattleDisplay();
        updateInventoryDisplay(); // Update main inventory count
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500); // Using item takes the turn
    } else {
        // If already at full HP: log message, re-enable item buttons
        logMessage(`${activePokemon.name}'s HP is already full!`);
        generateItemButtons(); // Regenerate item buttons
        // Manually re-enable buttons in the item container
        itemButtonsContainer.querySelectorAll('button').forEach(b => b.disabled=false);
        actionPrompt.textContent = "Choose an item:";
    }
}

/**
 * Handles the logic for using a Poké Ball to attempt capture.
 */
function usePokeball() {
     // Check if Poké Ball can be used
     if (!isPlayerTurn || battleOver || player.inventory.pokeballs <= 0) return;
     // Double check capture conditions
     if (opponentPokemon.hp >= opponentPokemon.maxHp * 0.5 || opponentPokemon.hp <= 0) {
         logMessage("Cannot throw Poké Ball now!");
         generateItemButtons(); // Show items again
         return;
     }
    disableAllButtons(); // Disable controls during attempt

    player.inventory.pokeballs--; // Consume ball
    logMessage(`You threw a Poké Ball!`);
    updateInventoryDisplay(); // Update inventory count

    // Calculate capture chance based on opponent's remaining HP percentage
    const hpPercent = opponentPokemon.hp / opponentPokemon.maxHp;
    const captureChance = 0.50 + (0.5 - hpPercent) * 0.9; // Example: 50% base + up to 45% bonus

    // Simulate capture attempt after a delay
    setTimeout(() => {
        if (Math.random() < captureChance) {
            // --- Capture Successful ---
            logMessage(`Gotcha! ${opponentPokemon.name} was caught!`);
            battleOver = true; // End battle

            // Add to party if space available (max 6)
            if (player.party.length < 6) {
                const caughtPokemon = JSON.parse(JSON.stringify(opponentPokemon));
                player.party.push(caughtPokemon); // Add copy to party
                logMessage(`${caughtPokemon.name} added to your party.`);
            } else {
                logMessage("Your party is full! Cannot add Pokémon.");
            }

            // Update UI for capture end state
            actionPrompt.textContent = "Captured!";
            returnToMapButton.classList.remove('hidden'); // Show return button
            returnToMapButton.disabled = false; // Ensure it's clickable

        } else {
            // --- Capture Failed ---
            logMessage(`Oh no! The Pokémon broke free!`);
            // Failed attempt uses the turn, opponent attacks
            isPlayerTurn = false;
            setTimeout(opponentTurn, 1500);
        }
    }, 1000); // 1 second delay for effect
}

/**
 * Generates the buttons for the Pokémon switching menu.
 */
function generateSwitchButtons() {
    if (!switchPokemonContainer) return; // Safety check
    switchPokemonContainer.innerHTML = ''; // Clear previous buttons
    let canSwitch = false; // Flag

    // Create button for each party member
    player.party.forEach((pokemon, index) => {
        const button = document.createElement('button');
        button.textContent = `${pokemon.name} (HP: ${pokemon.hp}/${pokemon.maxHp})`;

        // Disable if active or fainted
        if (index === player.activePokemonIndex || pokemon.hp <= 0) {
            button.disabled = true;
            if (index === player.activePokemonIndex) button.textContent += " - Active";
            if (pokemon.hp <= 0) button.textContent += " - Fainted";
        } else {
            // Enable for healthy, non-active Pokémon
            button.onclick = () => handleSwitchPokemon(index);
            canSwitch = true;
        }
        switchPokemonContainer.appendChild(button);
    });

     // Add "Back" button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => {
        switchPokemonContainer.classList.add('hidden'); // Hide switch menu
        generateBattleActionButtons(); // Show main actions
        actionPrompt.textContent = "Choose your action:";
    };
    switchPokemonContainer.appendChild(backButton);

    // Add message if no valid switch options
    if (!canSwitch) {
         const p = document.createElement('p');
        p.textContent = "No other Pokémon available to switch.";
        switchPokemonContainer.prepend(p);
    }
}

/**
 * Handles the logic for switching the player's active Pokémon.
 * @param {number} partyIndex - The index in the player's party of the Pokémon to switch to.
 */
function handleSwitchPokemon(partyIndex) {
    // Check if switch is valid
    if (!isPlayerTurn || battleOver || partyIndex === player.activePokemonIndex || player.party[partyIndex].hp <= 0) return;
    disableAllButtons(); // Disable controls

    const oldPokemonName = getActivePlayerPokemon().name;
    player.activePokemonIndex = partyIndex; // Update active index
    const newPokemon = getActivePlayerPokemon();

    logMessage(`Come back, ${oldPokemonName}!`);
    logMessage(`Go, ${newPokemon.name}!`);

    updateBattleDisplay(); // Update UI with new Pokémon
    generatePlayerMoveButtons(); // Generate moves for the new Pokémon (initially hidden)

    // Switching takes the turn
    isPlayerTurn = false;
    setTimeout(opponentTurn, 1500); // Opponent attacks after switch
}

/**
 * Handles the opponent's turn, including move selection and attack.
 */
function opponentTurn() {
    if (battleOver) return; // Check if battle already ended
    const activePokemon = getActivePlayerPokemon(); // Get player's current battler

    // Safety check: If player's Pokémon fainted before opponent's turn starts
    if (activePokemon.hp <= 0) {
         logMessage(`${activePokemon.name} has already fainted.`);
         isPlayerTurn = true; // Give turn back to player
         generateBattleActionButtons(); // Show actions
         actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
         // Disable fight button directly
         if(battleButtonsContainer && battleButtonsContainer.querySelector('button:first-child')) {
            battleButtonsContainer.querySelector('button:first-child').disabled = true;
         }
         return; // Skip opponent's attack
    }

    logMessage(`${opponentPokemon.name}'s turn...`);
    // Simple AI: Choose a random move from opponent's moveset
    const chosenMove = opponentPokemon.moves[Math.floor(Math.random() * opponentPokemon.moves.length)];
    const damage = calculateDamage(chosenMove.power); // Calculate damage

    activePokemon.hp = Math.max(0, activePokemon.hp - damage); // Apply damage to player's Pokémon
    logMessage(`${opponentPokemon.name} used ${chosenMove.name}! It dealt ${damage} damage.`);
    updateBattleDisplay(); // Update HP bars

    // Check if player's Pokémon fainted
    if (activePokemon.hp <= 0) {
        logMessage(`${activePokemon.name} fainted!`);
        // Check if player has other Pokémon available
        const availableIndex = player.party.findIndex((p, index) => index !== player.activePokemonIndex && p.hp > 0);
        if(availableIndex !== -1) {
            // If yes, prompt player to switch on their turn
            isPlayerTurn = true;
            generateBattleActionButtons(); // Show main actions
            actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
             // Disable fight button directly
             if(battleButtonsContainer && battleButtonsContainer.querySelector('button:first-child')) {
                battleButtonsContainer.querySelector('button:first-child').disabled = true;
             }
        } else {
             // If no other Pokémon, player loses
             endBattle(false);
        }
    } else {
        // If player's Pokémon survived, it's player's turn again
        isPlayerTurn = true;
        generateBattleActionButtons(); // Show main action buttons
        actionPrompt.textContent = "Choose your action:";
    }
}

/**
 * Calculates damage based on move power, including randomness and scaling.
 * @param {number} basePower - The base power of the move used.
 * @returns {number} The calculated damage amount (at least 1).
 */
function calculateDamage(basePower) {
    if(basePower <= 0) return 0; // Handle non-damaging moves explicitly
    const variation = basePower * 0.2; // +/- 20% randomness factor
    const randomFactor = Math.random() * variation * 2 - variation;
    const rawDamage = basePower + randomFactor;
    const scalingFactor = 3.0; // Damage reduction factor (higher = less damage)
    const scaledDamage = rawDamage / scalingFactor;
    // Ensure minimum 1 damage for damaging moves, and round the result
    return Math.max(1, Math.round(scaledDamage));
}

// --- Utility Functions for Buttons ---
/** Disables most buttons in the battle view. */
function disableAllButtons() {
    if (!battleView) return;
    battleView.querySelectorAll('button').forEach(button => {
        // Don't disable the Return to Map button if it's currently visible
        if (button.id === 'return-to-map-button' && !button.classList.contains('hidden')) {
            // Keep it enabled
        } else {
            button.disabled = true; // Disable all other buttons
        }
    });
}
/** Enables the move buttons if the move container is visible. */
function enableMoveButtons() {
    if (playerMovesContainer && !playerMovesContainer.classList.contains('hidden')) {
        playerMovesContainer.querySelectorAll('button').forEach(button => button.disabled = false);
    }
}
// Note: Enabling other button groups (Items, Switch, Actions) is handled when they are generated/shown.


// --- End Battle Logic ---
/**
 * Handles the end of a battle, including win/loss conditions, drops, healing, and evolution.
 * @param {boolean} playerWon - True if the player won, false otherwise.
 */
function endBattle(playerWon) {
    battleOver = true; // Set battle over flag
    disableAllButtons(); // Disable most actions
    justEvolved = false; // Reset evolution flag

    // --- Win Condition (Opponent Fainted) ---
    if (playerWon && opponentPokemon.hp <= 0) {
        logMessage("You won the battle!");
        player.wins++; // Increment win counter

        // Calculate drops (Potions, Money, Poké Balls)
        calculateDrops();

        // --- Post-Battle Healing ---
        let healMessages = [];
        let didHeal = false;
        player.party.forEach(pokemon => {
            if (pokemon.hp <= 0) { // Revive fainted Pokemon to 50% HP
                pokemon.hp = Math.floor(pokemon.maxHp * 0.5);
                healMessages.push(`${pokemon.name} was revived to ${pokemon.hp} HP!`);
                didHeal = true;
            } else if (pokemon.hp < pokemon.maxHp) { // Heal non-fainted, non-full HP Pokemon by 25%
                const healAmount = Math.floor(pokemon.maxHp * 0.25);
                const hpBefore = pokemon.hp;
                pokemon.hp = Math.min(pokemon.maxHp, pokemon.hp + healAmount);
                if (pokemon.hp > hpBefore) {
                    healMessages.push(`${pokemon.name} recovered ${pokemon.hp - hpBefore} HP.`);
                    didHeal = true;
                }
            }
        });
        // Log healing messages if any healing occurred
        if (didHeal) {
             logMessage("Your team recovered some energy!");
             healMessages.forEach(msg => logMessage(msg));
        }
        // --- END HEALING ---

        // --- Evolution Check ---
        const pokemonThatWon = getActivePlayerPokemon(); // Check the Pokémon active at the end
         if (pokemonThatWon && pokemonThatWon.evolvesAtWins && player.wins >= pokemonThatWon.evolvesAtWins && pokemonThatWon.evolution) {
            evolvePokemon(player.activePokemonIndex, pokemonThatWon.evolution);
            justEvolved = true; // Set flag if evolution occurs
         }

        // --- Update Displays ---
        updateInventoryDisplay(); // Update wins/money/items display data immediately
        // Update battle display now if healing happened and no evolution occurred
        if (didHeal && !justEvolved) updateBattleDisplay();
        // If evolution happened, update battle display after evolution message delay
        if (justEvolved) {
             setTimeout(() => { updateBattleDisplay(); generatePlayerMoveButtons(); }, 1100);
        }

    } else if (!playerWon) { // --- Loss Condition ---
        logMessage("You lost the battle...");
        // Check if all Pokémon fainted
        const allFainted = player.party.every(p => p.hp <= 0);
        if (allFainted) {
            logMessage("All your Pokémon have fainted! Returning to map...");
            // Future: Implement proper game over handling (e.g., return to start, lose money)
        }
    }
    // Note: Capture success bypasses this function's win logic and handles its own end state.

    // Set final prompt and show Return button (with delay if evolution happened)
     setTimeout(() => {
        // Only update prompt/button if capture didn't already do it
        if (returnToMapButton && returnToMapButton.classList.contains('hidden')) {
             actionPrompt.textContent = playerWon ? "Victory!" : "Defeated!";
             if (justEvolved) actionPrompt.textContent += " ...and Evolved!";
             returnToMapButton.classList.remove('hidden');
             returnToMapButton.disabled = false; // Ensure button is usable
        }
     }, justEvolved ? 1200 : 100); // Longer delay allows evolution message to display
}


// --- Item Drop Logic (Potion x2 Guaranteed, Money Added) ---
/** Calculates and adds item/money drops after winning a battle. */
function calculateDrops() {
    let dropsMessage = "Spoils: "; // Start log message

    // --- Potion Drop (Guaranteed x2) ---
    player.inventory.potions += 2; // Add 2 potions
    dropsMessage += "Potion x2 ";
    // --- End Potion Drop ---

    // --- Money Drop (Random Amount) ---
    const moneyFound = Math.floor(Math.random() * 21) + 10; // Random amount: $10-$30
    player.money += moneyFound;
    dropsMessage += `$${moneyFound} `;
    // --- End Money Drop ---

    // --- Poké Ball Drop (Random Chance) ---
    if (Math.random() < 0.40) { // 40% chance for Poké Ball
        player.inventory.pokeballs++;
        dropsMessage += "Poké Ball x1 ";
    }
    // --- End Poké Ball Drop ---

    logMessage(dropsMessage); // Log the summary of drops
    updateInventoryDisplay(); // Update map inventory display immediately
}

// --- Evolution Logic ---
/**
 * Handles the evolution process for a Pokémon in the player's party.
 * @param {number} partyIndex - Index of the Pokémon in the party to evolve.
 * @param {string} evolutionSpeciesName - The speciesName key for the evolved form.
 */
function evolvePokemon(partyIndex, evolutionSpeciesName) {
    const pokemonToEvolve = player.party[partyIndex];
    const evolutionData = pokemonData[evolutionSpeciesName]; // Get data for the evolved form

    // Safety check for data
    if (!evolutionData || !pokemonToEvolve) {
        console.error("Evolution data or Pokémon not found:", evolutionSpeciesName, pokemonToEvolve);
        return;
    }

    logMessage(`What? ${pokemonToEvolve.name} is evolving!`);

    // Update Pokémon data while maintaining current HP percentage
    const hpPercent = pokemonToEvolve.hp / pokemonToEvolve.maxHp;
    pokemonToEvolve.speciesName = evolutionData.speciesName;
    pokemonToEvolve.name = evolutionData.name;
    pokemonToEvolve.maxHp = evolutionData.maxHp;
    // Apply HP percentage to new max HP, ensure at least 1 HP
    pokemonToEvolve.hp = Math.max(1, Math.round(evolutionData.maxHp * hpPercent));
    pokemonToEvolve.sprite = evolutionData.sprite;
    pokemonToEvolve.moves = JSON.parse(JSON.stringify(evolutionData.moves)); // Get new moveset (deep copy)
    // Remove evolution condition after evolving
    pokemonToEvolve.evolvesAtWins = undefined;
    pokemonToEvolve.evolution = undefined;

    // Log completion message after a short delay for effect
    setTimeout(() => {
        logMessage(`Congratulations! Your ${pokemonToEvolve.speciesName} evolved into ${evolutionData.name}!`);
    }, 1000); // 1 second delay
}


// --- Event Listeners ---
// Listen for keyboard input for map movement
document.addEventListener('keydown', handleKeydown);
// Listen for clicks on the "Return to Map" button after battle/capture
if (returnToMapButton) {
    returnToMapButton.addEventListener('click', () => {
        // Before returning, check if the active Pokemon fainted during the battle end sequence
        if (getActivePlayerPokemon().hp <= 0) {
            // Find the first available healthy Pokemon to switch to
            const availableIndex = player.party.findIndex((p, index) => index !== player.activePokemonIndex && p.hp > 0);
            if (availableIndex !== -1) {
                player.activePokemonIndex = availableIndex; // Set new active Pokemon
                console.log(`Switched active Pokemon to ${getActivePlayerPokemon().name} before returning to map.`);
            } else {
                // Handle case where all Pokemon are fainted upon trying to return
                console.log("Returning to map with all Pokemon fainted.");
                // Future: Could trigger game over or forced heal here
            }
        }
       // Switch back to map view
       switchMode('map');
       battleOver = false; // Reset battle flag
    });
} else {
    console.error("Return to map button not found for event listener attachment!");
}


// --- Initial Game Setup ---
// Start the game initialization process when the window finishes loading
window.onload = initializeGame; // Calls initializeGame, which now shows starter select first
