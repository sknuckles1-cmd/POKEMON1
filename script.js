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
const mapView = document.getElementById('map-view');
const battleView = document.getElementById('battle-view');
const storeView = document.getElementById('store-view'); // Added Store View
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

// Store View Elements (Assuming IDs exist in HTML)
const storeMoneyDisplay = document.getElementById('store-money');
const storeItemList = document.getElementById('store-item-list');
const storeMessage = document.getElementById('store-message');


// --- Game Initialization ---
function initializeGame() {
    player.party = [];
    const startingPokemon = JSON.parse(JSON.stringify(pokemonData.pikachu));
    startingPokemon.hp = startingPokemon.maxHp;
    player.party.push(startingPokemon);
    player.activePokemonIndex = 0;
    player.wins = 0;
    player.inventory = { potions: 2, pokeballs: 5 };
    player.money = 150; // Starting money

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            if (dungeonLayout[y][x] === TILE_TYPES.PLAYER_START) {
                playerPos = { x, y };
                break;
            }
        }
    }
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
        `; // Added Money display
    }
}

// --- Mode Switching ---
function switchMode(newMode) {
    currentMode = newMode;
    mapView.classList.add('hidden');
    battleView.classList.add('hidden');
    storeView.classList.add('hidden'); // Hide store by default

    if (newMode === 'map') {
        mapView.classList.remove('hidden');
        renderMap();
        updateInventoryDisplay();
    } else if (newMode === 'battle') {
        battleView.classList.remove('hidden');
        // Battle init called by startBattle
    } else if (newMode === 'store') {
        storeView.classList.remove('hidden');
        openStore(); // Populate store UI when switching to it
    }
}

// --- Map Rendering and Logic ---
function setupMapGrid() {
    dungeonGrid.innerHTML = '';
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
    if (currentMode !== 'map') return;

    for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
            const cell = document.getElementById(`cell-${x}-${y}`);
            cell.className = 'grid-cell';
            cell.innerHTML = '';

            const tileType = dungeonLayout[y][x];

            if (tileType === TILE_TYPES.WALL) cell.classList.add('wall');
            else if (tileType === TILE_TYPES.ENCOUNTER) cell.classList.add('encounter');
            else if (tileType === TILE_TYPES.STORE) cell.classList.add('store'); // Add store style

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
    // Only allow movement if in map mode and not in another process like battle end
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

    const targetTileType = dungeonLayout[targetY][targetX];
    if (targetTileType === TILE_TYPES.WALL) return;

    // Store Interaction: Trigger store *before* updating position
    if (targetTileType === TILE_TYPES.STORE) {
        switchMode('store'); // Switch to store view
        return; // Stop movement processing for this turn
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
    if (!storeView || !storeMoneyDisplay || !storeItemList || !storeMessage) {
        console.error("Store DOM elements not found!");
        return;
    }
    storeMessage.textContent = "Welcome! What would you like to buy?"; // Reset message
    storeMoneyDisplay.textContent = `Your Money: $${player.money}`;
    storeItemList.innerHTML = ''; // Clear previous items

    // Add Potion to store
    const potionItem = document.createElement('li');
    potionItem.innerHTML = `
        Potion - $${itemPrices.potion}
        <button onclick="buyItem('potion')">Buy</button>
        <span>(Heals ~40% HP)</span>
    `;
    storeItemList.appendChild(potionItem);

    // Add Poké Ball to store
    const pokeballItem = document.createElement('li');
    pokeballItem.innerHTML = `
        Poké Ball - $${itemPrices.pokeball}
        <button onclick="buyItem('pokeball')">Buy</button>
        <span>(Chance to catch wild Pokémon)</span>
    `;
    storeItemList.appendChild(pokeballItem);

     // Add Leave button dynamically if not already present in HTML
     if (!document.getElementById('leave-store-button')) {
         const leaveButton = document.createElement('button');
         leaveButton.id = 'leave-store-button';
         leaveButton.textContent = 'Leave Store';
         leaveButton.onclick = closeStore;
         // Append after the list or in a dedicated actions area
         storeView.appendChild(leaveButton); // Adjust placement as needed
     }
}

function buyItem(itemName) {
    if (!itemPrices[itemName]) {
        console.error("Unknown item:", itemName);
        storeMessage.textContent = "Sorry, we don't sell that.";
        return;
    }

    const price = itemPrices[itemName];

    if (player.money >= price) {
        player.money -= price; // Deduct money

        // Add item to inventory
        if (itemName === 'potion') player.inventory.potions++;
        else if (itemName === 'pokeball') player.inventory.pokeballs++;

        storeMessage.textContent = `Purchased ${itemName}!`;
        storeMoneyDisplay.textContent = `Your Money: $${player.money}`; // Update displayed money
        updateInventoryDisplay(); // Update main inventory display data
        console.log(`Bought ${itemName}. Money left: ${player.money}, Inventory:`, player.inventory);
    } else {
        storeMessage.textContent = "Sorry, you don't have enough money.";
    }
}

function closeStore() {
    console.log("Closing Store");
    switchMode('map'); // Switch back to map view
    // Player remains on the store tile, needs to move off it.
}


// --- Battle Logic ---

function startBattle() {
    console.log("Starting battle!");
    const opponents = [pokemonData.charmander, pokemonData.rattata];
    const randomOpponentData = opponents[Math.floor(Math.random() * opponents.length)];
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

function getActivePlayerPokemon() {
    if (!player.party || player.party.length === 0 || player.activePokemonIndex >= player.party.length || player.activePokemonIndex < 0) {
        console.error("Invalid player party state!");
        return { id: 0, speciesName: 'error', name: "Error", hp: 0, maxHp: 0, sprite: "", moves: [], evolvesAtWins: undefined, evolution: undefined };
    }
    return player.party[player.activePokemonIndex];
}


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

function generateBattleActionButtons() {
    battleButtonsContainer.innerHTML = `
        <button onclick="showMoveButtons()">Fight</button>
        <button onclick="showItemButtons()">Items</button>
        <button onclick="showSwitchButtons()">Switch</button>
    `;
    battleButtonsContainer.classList.remove('hidden');
}

// --- UI Visibility Toggles ---
function showMoveButtons() {
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
    generateItemButtons();
    itemButtonsContainer.classList.remove('hidden');
    playerMovesContainer.classList.add('hidden');
    battleButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose an item:";
}

function showSwitchButtons() {
    generateSwitchButtons();
    switchPokemonContainer.classList.remove('hidden');
    playerMovesContainer.classList.add('hidden');
    battleButtonsContainer.classList.add('hidden');
    itemButtonsContainer.classList.add('hidden');
    actionPrompt.textContent = "Choose a Pokémon to switch to:";
}
// --- End UI Visibility Toggles ---

function generatePlayerMoveButtons() {
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

function updateBattleDisplay() {
    const activePokemon = getActivePlayerPokemon();
    // Player side
    playerNameEl.textContent = activePokemon.name;
    playerHpEl.textContent = activePokemon.hp;
    playerMaxHpEl.textContent = activePokemon.maxHp;
    updateHealthBar(playerHealthBarEl, activePokemon.hp, activePokemon.maxHp);
    if (playerSpriteEl.src !== activePokemon.sprite && activePokemon.sprite) {
         playerSpriteEl.src = activePokemon.sprite;
    }

    // Opponent side
    opponentNameEl.textContent = opponentPokemon.name;
    opponentHpEl.textContent = opponentPokemon.hp;
    opponentMaxHpEl.textContent = opponentPokemon.maxHp;
    updateHealthBar(opponentHealthBarEl, opponentPokemon.hp, opponentPokemon.maxHp);
}

function updateHealthBar(barElement, currentHp, maxHp) {
    const percentage = Math.max(0, (currentHp / maxHp) * 100);
    barElement.style.width = `${percentage}%`;
    barElement.className = 'health-bar';
    if (percentage < 25) barElement.classList.add('critical');
    else if (percentage < 50) barElement.classList.add('low');
}

function logMessage(message) {
    const newMessage = document.createElement('p');
    newMessage.textContent = message;
    messageLog.appendChild(newMessage);
    messageLog.scrollTop = messageLog.scrollHeight;
}

// --- Battle Actions ---

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

function generateItemButtons() {
    itemButtonsContainer.innerHTML = '';
    let hasUsableItem = false;

    if (player.inventory.potions > 0) {
        const button = document.createElement('button');
        button.textContent = `Potion (${player.inventory.potions})`;
        button.onclick = () => usePotion();
        if(getActivePlayerPokemon().hp <= 0) button.disabled = true; // Cannot heal fainted
        itemButtonsContainer.appendChild(button);
        if(getActivePlayerPokemon().hp > 0) hasUsableItem = true;
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

function generateSwitchButtons() {
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

function opponentTurn() {
    if (battleOver) return;
    const activePokemon = getActivePlayerPokemon();

    if (activePokemon.hp <= 0) {
         logMessage(`${activePokemon.name} has already fainted.`);
         isPlayerTurn = true;
         generateBattleActionButtons();
         actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
         if(battleButtonsContainer.querySelector('button:first-child')) {
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
             if(battleButtonsContainer.querySelector('button:first-child')) {
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
    battleView.querySelectorAll('button').forEach(button => {
        if (button.id !== 'return-to-map-button' || button.classList.contains('hidden')) {
            button.disabled = true;
        }
    });
}
function enableMoveButtons() {
    if (!playerMovesContainer.classList.contains('hidden')) {
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
        const pokemonThatWon = getActivePlayerPokemon();
         if (pokemonThatWon && pokemonThatWon.evolvesAtWins && player.wins >= pokemonThatWon.evolvesAtWins && pokemonThatWon.evolution) {
            evolvePokemon(player.activePokemonIndex, pokemonThatWon.evolution);
            justEvolved = true;
         }

        updateInventoryDisplay(); // Update wins/money/items display data
        if (didHeal && !justEvolved) updateBattleDisplay(); // Update HP display immediately if needed
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
        if (returnToMapButton.classList.contains('hidden')) {
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
    let droppedSomething = true; // Potion is guaranteed

    // --- Potion Drop (Guaranteed x2) ---
    player.inventory.potions += 2; // Add 2 potions
    dropsMessage += "Potion x2 ";
    // --- End Potion Drop ---

    // --- Money Drop (Random Amount) ---
    const moneyFound = Math.floor(Math.random() * 21) + 10; // Random amount between 10 and 30
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

    // Only log if something was actually listed (always true now with money/potions)
    logMessage(dropsMessage);
    updateInventoryDisplay(); // Update inventory display on map immediately
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

// --- Initial Game Setup ---
window.onload = initializeGame;
