// --- Pokémon Data ---
const pokemonData = {
    pikachu: {
        id: 25, speciesName: 'pikachu', name: "Pikachu", hp: 100, maxHp: 100,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        moves: [ { name: "Thunder Shock", power: 40 }, { name: "Quick Attack", power: 35 }, { name: "Iron Tail", power: 50 }, { name: "Spark", power: 30 } ],
        evolvesAtWins: 5, evolution: 'raichu'
    },
    raichu: {
        id: 26, speciesName: 'raichu', name: "Raichu", hp: 130, maxHp: 130,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png',
        moves: [ { name: "Thunder Punch", power: 75 }, { name: "Quick Attack", power: 40 }, { name: "Iron Tail", power: 60 }, { name: "Thunderbolt", power: 90 } ]
    },
    charmander: {
        id: 4, speciesName: 'charmander', name: "Charmander", hp: 120, maxHp: 120,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
        moves: [ { name: "Scratch", power: 40 }, { name: "Ember", power: 45 }, { name: "Dragon Breath", power: 50 }, { name: "Fire Fang", power: 48 } ]
    },
    rattata: {
        id: 19, speciesName: 'rattata', name: "Rattata", hp: 80, maxHp: 80,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png',
        moves: [ { name: "Tackle", power: 35 }, { name: "Quick Attack", power: 35 }, { name: "Hyper Fang", power: 60 } ]
    }
};

// --- Player Object ---
let player = {
    party: [],
    inventory: {
        potions: 2,
        pokeballs: 5
    },
    wins: 0,
    activePokemonIndex: 0,
    money: 150 // Starting money for store
};

// --- Game State Variables ---
let currentMode = 'map'; // map, battle, store
let opponentPokemon;
let isPlayerTurn = true;
let battleOver = false;
let justEvolved = false;

// --- Map State ---
const dungeonLayout = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 3, 0, 0, 3, 1], // 2=start, 3=encounter
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 3, 0, 0, 0, 1, 0, 1],
    [1, 5, 1, 1, 1, 1, 0, 1, 3, 1], // 5=store
    [1, 3, 0, 0, 3, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// Added STORE type
const TILE_TYPES = { EMPTY: 0, WALL: 1, PLAYER_START: 2, ENCOUNTER: 3, STORE: 5 };
let playerPos = { x: 0, y: 0 };
const mapRows = dungeonLayout.length;
const mapCols = dungeonLayout[0].length;

// --- Store Item Prices ---
const itemPrices = {
    potion: 50,
    pokeball: 100
};

// --- DOM Element References ---
// Declare globally, but assign *after* DOM load
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

// Store View Elements - Declared globally, assigned in initializeGame
let storeMoneyDisplay = null;
let storeItemList = null;
let storeMessage = null;


// --- Game Initialization ---
function initializeGame() {
    // --- Assign Store DOM References ---
    // Moved from global scope to ensure DOM is loaded before accessing these elements
    storeMoneyDisplay = document.getElementById('store-money');
    storeItemList = document.getElementById('store-item-list');
    storeMessage = document.getElementById('store-message');
    // --- End Assignment ---

    // Check if store elements were found (basic validation)
    if (!storeView || !storeMoneyDisplay || !storeItemList || !storeMessage) {
         console.error("Error: One or more store DOM elements not found! Make sure IDs match the HTML.");
         // Optionally disable store functionality or alert user
         // return; // Stop initialization if store is broken
    }


    // Setup initial player party and state
    player.party = [];
    const startingPokemon = JSON.parse(JSON.stringify(pokemonData.pikachu));
    startingPokemon.hp = startingPokemon.maxHp;
    player.party.push(startingPokemon);
    player.activePokemonIndex = 0;
    player.wins = 0;
    player.inventory = { potions: 2, pokeballs: 5 };
    player.money = 150; // Starting money

    // Find player starting position on the map
    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            if (dungeonLayout[y][x] === TILE_TYPES.PLAYER_START) {
                playerPos = { x, y };
                break;
            }
        }
    }
    // Setup map and initial view
    setupMapGrid();
    renderMap();
    updateInventoryDisplay();
    switchMode('map'); // Start in map mode
}

// --- Inventory Display ---
function updateInventoryDisplay() {
    // Update the text content of the inventory display element
    if (inventoryDisplay) {
        inventoryDisplay.innerHTML = `
            Inventory:
            Potions: ${player.inventory.potions} |
            Poké Balls: ${player.inventory.pokeballs} |
            Wins: ${player.wins} |
            Money: $${player.money}
        `; // Added Money display
    }
}

// --- Mode Switching ---
function switchMode(newMode) {
    // Toggle visibility of map, battle, and store views
    currentMode = newMode;
    // Ensure all views are hidden before showing the target one
    if (mapView) mapView.classList.add('hidden');
    if (battleView) battleView.classList.add('hidden');
    if (storeView) storeView.classList.add('hidden');

    // Show the correct view based on the new mode
    if (newMode === 'map') {
        if (mapView) {
            mapView.classList.remove('hidden');
            renderMap(); // Re-render map when returning
            updateInventoryDisplay(); // Update inventory display
        } else { console.error("Map view element not found"); }
    } else if (newMode === 'battle') {
        if (battleView) {
            battleView.classList.remove('hidden');
            // Battle initialization happens in startBattle() before switching
        } else { console.error("Battle view element not found"); }
    } else if (newMode === 'store') {
        if (storeView) {
            storeView.classList.remove('hidden');
            openStore(); // Populate store UI when switching to it
        } else { console.error("Store view element not found"); }
    }
}

// --- Map Rendering and Logic ---
function setupMapGrid() {
    // Create the grid cells for the map based on dimensions
    if (!dungeonGrid) { console.error("Dungeon grid element not found"); return; }
    dungeonGrid.innerHTML = ''; // Clear previous grid
    dungeonGrid.style.gridTemplateColumns = `repeat(${mapCols}, 40px)`;
    dungeonGrid.style.gridTemplateRows = `repeat(${mapRows}, 40px)`;

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.id = `cell-${x}-${y}`; // Assign unique ID for later reference
            dungeonGrid.appendChild(cell);
        }
    }
}

function renderMap() {
    // Update the appearance of map cells based on layout and player position
    if (currentMode !== 'map') return; // Only render if in map mode

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const cell = document.getElementById(`cell-${x}-${y}`);
            if (!cell) continue; // Skip if cell not found
            cell.className = 'grid-cell'; // Reset classes
            cell.innerHTML = ''; // Clear player marker or other content

            const tileType = dungeonLayout[y][x];

            // Apply styles based on tile type
            if (tileType === TILE_TYPES.WALL) cell.classList.add('wall');
            else if (tileType === TILE_TYPES.ENCOUNTER) cell.classList.add('encounter');
            else if (tileType === TILE_TYPES.STORE) cell.classList.add('store'); // Add store style

            // Draw player marker in the current cell
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
    // Handle player movement input via arrow keys
    // Only allow movement if in map mode and not in another process like battle end
    if (currentMode !== 'map' || battleOver) return;

    let dx = 0;
    let dy = 0;

    // Determine direction from key press
    switch (event.key) {
        case 'ArrowUp': dy = -1; break;
        case 'ArrowDown': dy = 1; break;
        case 'ArrowLeft': dx = -1; break;
        case 'ArrowRight': dx = 1; break;
        default: return; // Ignore other keys
    }

    event.preventDefault(); // Prevent page scrolling with arrow keys

    const targetX = playerPos.x + dx;
    const targetY = playerPos.y + dy;

    // Check map boundaries
    if (targetX < 0 || targetX >= mapCols || targetY < 0 || targetY >= mapRows) {
        return; // Out of bounds
    }

    // Check target tile type
    const targetTileType = dungeonLayout[targetY][targetX];
    if (targetTileType === TILE_TYPES.WALL) {
        return; // Cannot move into wall
    }

    // Store Interaction: Trigger store *before* updating position
    if (targetTileType === TILE_TYPES.STORE) {
        switchMode('store'); // Switch to store view
        return; // Stop movement processing for this turn, player stays put
    }

    // Update player position if not a wall or store
    playerPos.x = targetX;
    playerPos.y = targetY;

    renderMap(); // Update map display

    // Check for encounter *after* moving
    if (targetTileType === TILE_TYPES.ENCOUNTER) {
        startBattle();
    }
}

// --- Store Logic ---
function openStore() {
    console.log("Opening Store");
    // Ensure DOM elements are available (they should be if assigned in initializeGame)
    if (!storeView || !storeMoneyDisplay || !storeItemList || !storeMessage) {
        console.error("Store DOM elements not ready or found!");
        // Attempt to re-assign them just in case, though this indicates an earlier issue
        storeMoneyDisplay = document.getElementById('store-money');
        storeItemList = document.getElementById('store-item-list');
        storeMessage = document.getElementById('store-message');
        if (!storeView || !storeMoneyDisplay || !storeItemList || !storeMessage) {
             switchMode('map'); // Fallback to map if store is broken
             alert("Error opening store!");
             return;
        }
    }
    storeMessage.textContent = "Welcome! What would you like to buy?"; // Reset message
    storeMoneyDisplay.textContent = `Your Money: $${player.money}`;
    storeItemList.innerHTML = ''; // Clear previous items

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

     // Ensure Leave button exists (it should be in the HTML now)
     const leaveButton = document.getElementById('leave-store-button');
     if (!leaveButton) {
         console.error("Leave store button not found in HTML!");
         // Optionally create it dynamically as a fallback
         const btn = document.createElement('button');
         btn.id = 'leave-store-button';
         btn.textContent = 'Leave Store';
         btn.onclick = closeStore;
         storeView.appendChild(btn);
     }
}

function buyItem(itemName) {
    // Handle item purchase logic
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

function closeStore() {
    // Exit the store view and return to map mode
    console.log("Closing Store");
    switchMode('map');
    // Player remains on the store tile, needs to move off it to re-enter or go elsewhere.
}


// --- Battle Logic ---

function startBattle() {
    // Initiate a battle sequence
    console.log("Starting battle!");
    // Select a random opponent
    const opponents = [pokemonData.charmander, pokemonData.rattata];
    const randomOpponentData = opponents[Math.floor(Math.random() * opponents.length)];
    opponentPokemon = JSON.parse(JSON.stringify(randomOpponentData)); // Deep copy

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

    // Set Pokémon sprites
    playerSpriteEl.src = activePokemon.sprite;
    playerSpriteEl.onerror = () => playerSpriteEl.src = 'placeholder.png'; // Fallback image
    opponentSpriteEl.src = opponentPokemon.sprite;
    opponentSpriteEl.onerror = () => opponentSpriteEl.src = 'placeholder.png'; // Fallback image

    // Log initial battle messages
    logMessage(`A wild ${opponentPokemon.name} appeared!`);
    // Adjust initial message based on whether a switch was forced
    if (activePokemon.hp > 0) {
        logMessage(`Go, ${activePokemon.name}!`);
    } else {
         // This case should ideally be handled before init, but log as fallback
         logMessage(`Previous Pokémon fainted! Sending out ${activePokemon.name}!`);
    }

    actionPrompt.textContent = "Choose your action:";
    returnToMapButton.classList.add('hidden'); // Hide return button until battle ends
}

// Generates the main action buttons (Fight, Items, Switch)
function generateBattleActionButtons() {
    if (!battleButtonsContainer) { console.error("Battle buttons container not found"); return; }
    battleButtonsContainer.innerHTML = `
        <button onclick="showMoveButtons()">Fight</button>
        <button onclick="showItemButtons()">Items</button>
        <button onclick="showSwitchButtons()">Switch</button>
    `;
    battleButtonsContainer.classList.remove('hidden'); // Ensure this row is visible
}

// --- UI Visibility Toggles ---
function showMoveButtons() {
    if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return; // Safety check
    // Check if the current Pokémon can fight
    if (getActivePlayerPokemon().hp <= 0) {
        logMessage(`${getActivePlayerPokemon().name} has fainted and cannot fight!`);
        actionPrompt.textContent = "Choose another action (Switch recommended).";
        return; // Don't show moves
    }
    // Show move buttons, hide others
    playerMovesContainer.classList.remove('hidden');
    battleButtonsContainer.classList.add('hidden');
    itemButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose your move:";
    if(isPlayerTurn && !battleOver) enableMoveButtons(); // Enable them if it's player's turn
}

function showItemButtons() {
     if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return; // Safety check
    // Generate and show item buttons, hide others
    generateItemButtons();
    itemButtonsContainer.classList.remove('hidden');
    playerMovesContainer.classList.add('hidden');
    battleButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose an item:";
}

function showSwitchButtons() {
     if (!playerMovesContainer || !battleButtonsContainer || !itemButtonsContainer || !switchPokemonContainer || !actionPrompt) return; // Safety check
    // Generate and show switch buttons, hide others
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
    playerMovesContainer.innerHTML = ''; // Clear previous buttons
    const currentPokemon = getActivePlayerPokemon();
    // Safety check for pokemon data
    if (!currentPokemon || !currentPokemon.moves) {
        console.error("Error generating moves: Active Pokemon or moves undefined", currentPokemon);
        return;
    }
    // Create a button for each move
    currentPokemon.moves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move.name;
        button.addEventListener('click', () => handlePlayerMove(move));
        playerMovesContainer.appendChild(button);
    });
    // Note: Visibility is controlled by showMoveButtons()
}

// Updates the battle display (names, HP, health bars, sprites)
function updateBattleDisplay() {
    // Safety checks for DOM elements
    if (!playerNameEl || !playerHpEl || !playerMaxHpEl || !playerHealthBarEl || !playerSpriteEl ||
        !opponentNameEl || !opponentHpEl || !opponentMaxHpEl || !opponentHealthBarEl || !opponentSpriteEl) {
        console.error("One or more battle display elements are missing!");
        return;
    }

    const activePokemon = getActivePlayerPokemon();
    // Player side display update
    playerNameEl.textContent = activePokemon.name;
    playerHpEl.textContent = activePokemon.hp;
    playerMaxHpEl.textContent = activePokemon.maxHp;
    updateHealthBar(playerHealthBarEl, activePokemon.hp, activePokemon.maxHp);
    // Update sprite only if it changed (e.g., evolution)
    if (playerSpriteEl.src !== activePokemon.sprite && activePokemon.sprite) {
         playerSpriteEl.src = activePokemon.sprite;
    }

    // Opponent side display update
    opponentNameEl.textContent = opponentPokemon.name;
    opponentHpEl.textContent = opponentPokemon.hp;
    opponentMaxHpEl.textContent = opponentPokemon.maxHp;
    updateHealthBar(opponentHealthBarEl, opponentPokemon.hp, opponentPokemon.maxHp);
}

// Updates a single health bar's width and color class
function updateHealthBar(barElement, currentHp, maxHp) {
    if (!barElement) return; // Safety check
    const percentage = Math.max(0, (currentHp / maxHp) * 100); // Calculate HP percentage
    barElement.style.width = `${percentage}%`; // Set width
    // Apply color classes based on HP percentage
    barElement.className = 'health-bar'; // Reset classes first
    if (percentage <= 0) barElement.style.backgroundColor = '#888'; // Optional: Grey out fainted bar
    else if (percentage < 25) barElement.classList.add('critical'); // Red
    else if (percentage < 50) barElement.classList.add('low'); // Yellow/Orange
    else barElement.style.backgroundColor = ''; // Reset to default green if needed
}

// Adds a message paragraph to the battle log
function logMessage(message) {
    if (!messageLog) return; // Safety check
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    messageLog.appendChild(newMessage);
    // Auto-scroll to the latest message
    messageLog.scrollTop = messageLog.scrollHeight;
}

// --- Battle Actions ---

// Handles the player selecting and using a move
function handlePlayerMove(move) {
    // Check if action is allowed
    if (!isPlayerTurn || battleOver || getActivePlayerPokemon().hp <= 0) return;
    disableAllButtons(); // Disable buttons during animation/opponent turn

    const activePokemon = getActivePlayerPokemon();
    const damage = calculateDamage(move.power); // Calculate damage
    opponentPokemon.hp = Math.max(0, opponentPokemon.hp - damage); // Apply damage

    logMessage(`${activePokemon.name} used ${move.name}! It dealt ${damage} damage.`);
    updateBattleDisplay(); // Update HP bars

    // Check if opponent fainted
    if (opponentPokemon.hp <= 0) {
        logMessage(`${opponentPokemon.name} fainted!`);
        endBattle(true); // Player wins
    } else {
        // If opponent survived, switch turns
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500); // Opponent attacks after a delay
    }
}

// Generates buttons for usable items in the inventory
function generateItemButtons() {
    if (!itemButtonsContainer) return; // Safety check
    itemButtonsContainer.innerHTML = ''; // Clear previous buttons
    let hasUsableItem = false;

    // Create Potion button if available and usable
    if (player.inventory.potions > 0) {
        const button = document.createElement('button');
        button.textContent = `Potion (${player.inventory.potions})`;
        button.onclick = () => usePotion();
        // Disable if active Pokemon is fainted
        if(getActivePlayerPokemon().hp <= 0) {
            button.disabled = true;
            button.title = "Cannot use on fainted Pokémon.";
        } else {
             hasUsableItem = true; // Mark as usable if Pokemon isn't fainted
        }
        itemButtonsContainer.appendChild(button);
    }
    // Create Poké Ball button if available and usable
    if (player.inventory.pokeballs > 0) {
        const button = document.createElement('button');
        button.textContent = `Poké Ball (${player.inventory.pokeballs})`;
        // Disable if opponent is fainted or HP is too high
        if (opponentPokemon.hp >= opponentPokemon.maxHp * 0.5 || opponentPokemon.hp <= 0) {
             button.disabled = true;
             button.title = opponentPokemon.hp <= 0 ? "Opponent already fainted!" : "Opponent HP must be below 50%!";
        } else {
             button.onclick = () => usePokeball();
             hasUsableItem = true; // Mark as usable
        }
        itemButtonsContainer.appendChild(button);
    }

    // Add a "Back" button to return to the main action menu
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => {
        itemButtonsContainer.classList.add('hidden'); // Hide item buttons
        generateBattleActionButtons(); // Show main action buttons again
        actionPrompt.textContent = "Choose your action:";
    };
    itemButtonsContainer.appendChild(backButton);

    // Display message if no items are currently usable
    if (!hasUsableItem && itemButtonsContainer.children.length <= 1) { // Check if only Back button exists
        const p = document.createElement('p');
        p.textContent = "No usable items in this situation.";
        itemButtonsContainer.prepend(p); // Add message before the Back button
    }
}


// Logic for using a Potion item
function usePotion() {
    // Check conditions for using potion
    if (!isPlayerTurn || battleOver || player.inventory.potions <= 0 || getActivePlayerPokemon().hp <= 0) return;
    disableAllButtons(); // Disable buttons during action

    const activePokemon = getActivePlayerPokemon();
    const healAmount = Math.floor(activePokemon.maxHp * 0.4); // Heal 40% of max HP
    const hpBefore = activePokemon.hp;
    activePokemon.hp = Math.min(activePokemon.maxHp, activePokemon.hp + healAmount); // Heal up to max HP
    const healedBy = activePokemon.hp - hpBefore; // Calculate actual amount healed

    if (healedBy > 0) {
        // If healing occurred, consume item and turn
        player.inventory.potions--;
        logMessage(`${activePokemon.name} used a Potion! Healed ${healedBy} HP.`);
        updateBattleDisplay(); // Update HP bar
        updateInventoryDisplay(); // Update inventory count display
        isPlayerTurn = false;
        setTimeout(opponentTurn, 1500); // Potion use takes the turn
    } else {
        // If no healing occurred (already full HP)
        logMessage(`${activePokemon.name}'s HP is already full!`);
         // Don't consume turn or item, re-enable item buttons
        generateItemButtons(); // Regenerate to reflect correct state
        itemButtonsContainer.querySelectorAll('button').forEach(b => b.disabled=false); // Re-enable buttons
        actionPrompt.textContent = "Choose an item:";
    }
}

// Logic for using a Poké Ball item
function usePokeball() {
     // Check conditions for using Poké Ball
     if (!isPlayerTurn || battleOver || player.inventory.pokeballs <= 0) return;
     // Double check usability conditions
     if (opponentPokemon.hp >= opponentPokemon.maxHp * 0.5 || opponentPokemon.hp <= 0) {
         logMessage("Cannot throw Poké Ball now!");
         generateItemButtons(); // Show items again, buttons should be correctly disabled/enabled
         return;
     }
    disableAllButtons(); // Disable buttons during capture attempt

    player.inventory.pokeballs--; // Consume the Poké Ball
    logMessage(`You threw a Poké Ball!`);
    updateInventoryDisplay(); // Update inventory count

    // Calculate capture chance (higher chance at lower HP)
    const hpPercent = opponentPokemon.hp / opponentPokemon.maxHp; // Range: 0.0 to < 0.5
    const captureChance = 0.50 + (0.5 - hpPercent) * 0.9; // Example formula: 50% base + up to 45% bonus (max 95%)

    setTimeout(() => { // Add delay for suspense
        if (Math.random() < captureChance) {
            // --- Capture Successful ---
            logMessage(`Gotcha! ${opponentPokemon.name} was caught!`);
            battleOver = true; // End the battle immediately upon capture

            // Add caught Pokémon to party if space allows (max 6)
            if (player.party.length < 6) {
                const caughtPokemon = JSON.parse(JSON.stringify(opponentPokemon));
                // Keep the opponent's current HP when caught
                player.party.push(caughtPokemon);
                logMessage(`${caughtPokemon.name} added to your party.`);
            } else {
                logMessage("Your party is full! Cannot add Pokémon.");
                // In a full game, this might send to a "Box" system
            }

            // Update UI for capture end state
            actionPrompt.textContent = "Captured!";
            returnToMapButton.classList.remove('hidden'); // Show return button
            returnToMapButton.disabled = false; // Explicitly enable the return button

        } else {
            // --- Capture Failed ---
            logMessage(`Oh no! The Pokémon broke free!`);
            // Failed attempt takes the turn, opponent attacks
            isPlayerTurn = false;
            setTimeout(opponentTurn, 1500);
        }
    }, 1000); // 1 second delay for capture animation effect
}

// Generates buttons for switching Pokémon
function generateSwitchButtons() {
    if (!switchPokemonContainer) return; // Safety check
    switchPokemonContainer.innerHTML = ''; // Clear previous buttons
    let canSwitch = false; // Flag to check if any valid switch options exist

    // Create a button for each Pokémon in the party
    player.party.forEach((pokemon, index) => {
        const button = document.createElement('button');
        button.textContent = `${pokemon.name} (HP: ${pokemon.hp}/${pokemon.maxHp})`;

        // Disable button if it's the active Pokémon or if it has fainted
        if (index === player.activePokemonIndex || pokemon.hp <= 0) {
            button.disabled = true;
            if (index === player.activePokemonIndex) button.textContent += " - Active";
            if (pokemon.hp <= 0) button.textContent += " - Fainted";
        } else {
            // Enable button and add click handler for valid switches
            button.onclick = () => handleSwitchPokemon(index);
            canSwitch = true; // Mark that switching is possible
        }
        switchPokemonContainer.appendChild(button);
    });

     // Add a "Back" button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => {
        switchPokemonContainer.classList.add('hidden'); // Hide switch buttons
        generateBattleActionButtons(); // Show main actions again
        actionPrompt.textContent = "Choose your action:";
    };
    switchPokemonContainer.appendChild(backButton);

    // Display message if no valid Pokémon to switch to
    if (!canSwitch) {
         const p = document.createElement('p');
        p.textContent = "No other Pokémon available to switch.";
        switchPokemonContainer.prepend(p); // Add message before Back button
    }
}

// Handles the logic for switching the active Pokémon
function handleSwitchPokemon(partyIndex) {
    // Check if switch is valid
    if (!isPlayerTurn || battleOver || partyIndex === player.activePokemonIndex || player.party[partyIndex].hp <= 0) return;
    disableAllButtons(); // Disable buttons during switch

    const oldPokemonName = getActivePlayerPokemon().name;
    player.activePokemonIndex = partyIndex; // Update the active Pokémon index
    const newPokemon = getActivePlayerPokemon();

    logMessage(`Come back, ${oldPokemonName}!`);
    logMessage(`Go, ${newPokemon.name}!`);

    updateBattleDisplay(); // Update battle UI with new Pokémon info
    generatePlayerMoveButtons(); // Generate moves for the new active Pokémon (will be hidden initially)

    // Switching takes the player's turn
    isPlayerTurn = false;
    setTimeout(opponentTurn, 1500); // Opponent attacks after switch
}

// Handles the opponent's turn logic
function opponentTurn() {
    if (battleOver) return; // Don't act if battle is over
    const activePokemon = getActivePlayerPokemon(); // Get player's current Pokémon

    // Safety check: If player's Pokemon fainted before opponent's turn
    if (activePokemon.hp <= 0) {
         logMessage(`${activePokemon.name} has already fainted.`);
         isPlayerTurn = true; // Give turn back to player to switch
         generateBattleActionButtons();
         actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
         // Disable fight button directly
         if(battleButtonsContainer && battleButtonsContainer.querySelector('button:first-child')) {
            battleButtonsContainer.querySelector('button:first-child').disabled = true;
         }
         return; // Skip opponent's attack
    }

    logMessage(`${opponentPokemon.name}'s turn...`);
    // Simple AI: Choose a random move
    const chosenMove = opponentPokemon.moves[Math.floor(Math.random() * opponentPokemon.moves.length)];
    const damage = calculateDamage(chosenMove.power); // Calculate damage

    activePokemon.hp = Math.max(0, activePokemon.hp - damage); // Apply damage to player's active Pokémon
    logMessage(`${opponentPokemon.name} used ${chosenMove.name}! It dealt ${damage} damage.`);
    updateBattleDisplay(); // Update HP bars

    // Check if player's active Pokémon fainted
    if (activePokemon.hp <= 0) {
        logMessage(`${activePokemon.name} fainted!`);
        // Check if player has other usable Pokémon
        const availableIndex = player.party.findIndex((p, index) => index !== player.activePokemonIndex && p.hp > 0);
        if(availableIndex !== -1) {
            // If other Pokémon available, prompt player to switch on their turn
            isPlayerTurn = true;
            generateBattleActionButtons(); // Show main actions
            actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
             // Disable fight button directly as current Pokemon is fainted
             if(battleButtonsContainer && battleButtonsContainer.querySelector('button:first-child')) {
                battleButtonsContainer.querySelector('button:first-child').disabled = true;
             }
        } else {
             // No other Pokémon left - Player loses
             endBattle(false);
        }
    } else {
        // Player's Pokémon survived, switch back to player's turn
        isPlayerTurn = true;
        generateBattleActionButtons(); // Show main action buttons
        actionPrompt.textContent = "Choose your action:";
    }
}

// Damage calculation (scaled down)
function calculateDamage(basePower) {
    const variation = basePower * 0.2; // +/- 20% randomness
    const randomFactor = Math.random() * variation * 2 - variation;
    const rawDamage = basePower + randomFactor;
    const scalingFactor = 3.0; // Damage reduction factor (higher = less damage)
    const scaledDamage = rawDamage / scalingFactor;
    return Math.max(1, Math.round(scaledDamage)); // Ensure min 1 damage, round result
}

// --- Utility Functions for Buttons ---
function disableAllButtons() {
    // Disable all buttons within the battle view, except Return to Map if visible
    if (!battleView) return;
    battleView.querySelectorAll('button').forEach(button => {
        // Keep return to map button enabled if it's meant to be shown and enabled
        if (button.id === 'return-to-map-button' && !button.classList.contains('hidden')) {
             // Don't disable return button if it's visible (it's enabled separately)
        } else {
            button.disabled = true;
        }
    });
}
function enableMoveButtons() {
    // Enable move buttons only if the move container is visible
    if (playerMovesContainer && !playerMovesContainer.classList.contains('hidden')) {
        playerMovesContainer.querySelectorAll('button').forEach(button => button.disabled = false);
    }
}
// Enabling other buttons (Items, Switch, Actions) is handled when they are generated/shown


// --- End Battle Logic ---
function endBattle(playerWon) {
    battleOver = true; // Set battle over flag
    disableAllButtons(); // Disable most actions
    justEvolved = false; // Reset evolution flag for this battle end sequence

    // Check if the win was due to fainting the opponent (not capture)
    if (playerWon && opponentPokemon.hp <= 0) {
        logMessage("You won the battle!");
        player.wins++; // Increment win counter

        // --- Calculate Drops (Potion x2 Guaranteed, Money Added) ---
        calculateDrops(); // Now includes money

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
        const pokemonThatWon = getActivePlayerPokemon(); // Check the Pokémon active at the end
        // Check if it exists and has evolution data
         if (pokemonThatWon && pokemonThatWon.evolvesAtWins && player.wins >= pokemonThatWon.evolvesAtWins && pokemonThatWon.evolution) {
            evolvePokemon(player.activePokemonIndex, pokemonThatWon.evolution);
            justEvolved = true; // Set flag if evolution occurs
         }

        // --- Update Displays ---
        updateInventoryDisplay(); // Update wins/money/items display data
        // Update battle display immediately if healing happened and no evolution, or after evolution message delay
        if (didHeal && !justEvolved) updateBattleDisplay();
        if (justEvolved) {
             // Update display after evolution message delay
             setTimeout(() => { updateBattleDisplay(); generatePlayerMoveButtons(); }, 1100);
        }

    } else if (!playerWon) { // Lost battle
        logMessage("You lost the battle...");
        const allFainted = player.party.every(p => p.hp <= 0);
        if (allFainted) {
            logMessage("All your Pokémon have fainted! Returning to map...");
            // Future: Implement proper game over handling
        }
    }
    // Note: Capture success bypasses this function's win logic

    // Set final prompt and show Return button (with delay if evolution happened)
     setTimeout(() => {
        // Avoid double-setting prompt if capture flow already set it.
        // Only set prompt/button if return button is still hidden (meaning capture didn't happen)
        if (returnToMapButton && returnToMapButton.classList.contains('hidden')) {
             actionPrompt.textContent = playerWon ? "Victory!" : "Defeated!";
             if (justEvolved) actionPrompt.textContent += " ...and Evolved!";
             returnToMapButton.classList.remove('hidden');
             returnToMapButton.disabled = false; // Ensure button is usable
        }
     }, justEvolved ? 1200 : 100); // Longer delay if evolution occurred
}


// --- Item Drop Logic (Potion x2 Guaranteed, Money Added) ---
function calculateDrops() {
    let dropsMessage = "Spoils: ";
    let droppedSomething = true; // Potion is guaranteed

    // --- Potion Drop (Guaranteed x2) ---
    player.inventory.potions += 2; // Add 2 potions
    dropsMessage += "Potion x2 ";
    // --- End Potion Drop ---

    // --- Money Drop (Random Amount) ---
    const moneyFound = Math.floor(Math.random() * 21) + 10; // Random amount between 10 and 30 ($10-$30)
    player.money += moneyFound;
    dropsMessage += `$${moneyFound} `;
    // --- End Money Drop ---

    // --- Poké Ball Drop (Random Chance) ---
    if (Math.random() < 0.40) { // 40% chance for Poké Ball
        player.inventory.pokeballs++;
        dropsMessage += "Poké Ball x1 ";
        // droppedSomething = true; // Already true
    }
    // --- End Poké Ball Drop ---

    // Log the combined drops message
    logMessage(dropsMessage);
    updateInventoryDisplay(); // Update inventory display on map immediately
}

// --- Evolution Logic ---
function evolvePokemon(partyIndex, evolutionSpeciesName) {
    // Handle the evolution of a Pokémon in the player's party
    const pokemonToEvolve = player.party[partyIndex];
    const evolutionData = pokemonData[evolutionSpeciesName]; // Get data for the evolved form

    // Safety check
    if (!evolutionData || !pokemonToEvolve) {
        console.error("Evolution data or Pokémon not found:", evolutionSpeciesName, pokemonToEvolve);
        return;
    }

    logMessage(`What? ${pokemonToEvolve.name} is evolving!`);

    // Update Pokémon stats and info, maintaining current HP percentage
    const hpPercent = pokemonToEvolve.hp / pokemonToEvolve.maxHp;
    pokemonToEvolve.speciesName = evolutionData.speciesName;
    pokemonToEvolve.name = evolutionData.name;
    pokemonToEvolve.maxHp = evolutionData.maxHp;
    pokemonToEvolve.hp = Math.max(1, Math.round(evolutionData.maxHp * hpPercent)); // Apply HP percent to new max HP
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
// Listen for clicks on the "Return to Map" button
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
window.onload = initializeGame;
