// --- Pokémon Data ---
const pokemonData = {
    pikachu: {
        id: 25, speciesName: 'pikachu', name: "Pikachu", hp: 100, maxHp: 100,
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        moves: [ { name: "Thunder Shock", power: 40 }, { name: "Quick Attack", power: 35 }, { name: "Iron Tail", power: 50 }, { name: "Spark", power: 30 } ],
        evolvesAtWins: 5, evolution: 'raichu' // Evolution condition
    },
    raichu: {
        id: 26, speciesName: 'raichu', name: "Raichu", hp: 130, maxHp: 130, // Evolved stats
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
    party: [], // Array of Pokémon objects
    inventory: {
        potions: 2,
        pokeballs: 5
    },
    wins: 0,
    activePokemonIndex: 0
};

// --- Game State Variables ---
let currentMode = 'map';
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
    [1, 0, 1, 1, 1, 1, 0, 1, 3, 1],
    [1, 3, 0, 0, 3, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const TILE_TYPES = { EMPTY: 0, WALL: 1, PLAYER_START: 2, ENCOUNTER: 3 };
let playerPos = { x: 0, y: 0 };
const mapRows = dungeonLayout.length;
const mapCols = dungeonLayout[0].length;

// --- DOM Element References ---
const mapView = document.getElementById('map-view');
const battleView = document.getElementById('battle-view');
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


// --- Game Initialization ---
function initializeGame() {
    player.party = [];
    const startingPokemon = JSON.parse(JSON.stringify(pokemonData.pikachu));
    startingPokemon.hp = startingPokemon.maxHp;
    player.party.push(startingPokemon);
    player.activePokemonIndex = 0;
    player.wins = 0;
    player.inventory = { potions: 2, pokeballs: 5 }; // Reset inventory too

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
            Wins: ${player.wins}
        `;
    }
}

// --- Mode Switching ---
function switchMode(newMode) {
    currentMode = newMode;
    if (newMode === 'map') {
        mapView.classList.remove('hidden');
        battleView.classList.add('hidden');
        renderMap();
        updateInventoryDisplay();
    } else { // 'battle'
        mapView.classList.add('hidden');
        battleView.classList.remove('hidden');
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

    const targetTile = dungeonLayout[targetY][targetX];
    if (targetTile === TILE_TYPES.WALL) return;

    playerPos.x = targetX;
    playerPos.y = targetY;

    renderMap();

    if (targetTile === TILE_TYPES.ENCOUNTER) {
        startBattle();
    }
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
            // Need to log this better in initializeBattleScreen
        } else {
             alert("All your Pokémon have fainted! Game Over (conceptually). Returning to map.");
             // Ideally, implement proper game over or heal station
             switchMode('map');
             return;
        }
    }

    initializeBattleScreen();
    switchMode('battle');
}

function getActivePlayerPokemon() {
    // Add a check in case party is empty or index is invalid (shouldn't happen with current logic, but safe)
    if (!player.party || player.party.length === 0 || player.activePokemonIndex >= player.party.length || player.activePokemonIndex < 0) {
        console.error("Invalid player party state!");
        // Return a dummy object or handle error appropriately
        return { name: "Error", hp: 0, maxHp: 0, sprite: "", moves: [] };
    }
    return player.party[player.activePokemonIndex];
}


function initializeBattleScreen() {
    isPlayerTurn = true;
    battleOver = false;
    justEvolved = false;

    messageLog.innerHTML = ''; // Clear log first
    const activePokemon = getActivePlayerPokemon();

    // Log forced switch if needed
     if (activePokemon.hp <= 0) {
         // This case should be handled by startBattle now, but log just in case.
         logMessage(`Previous Pokémon fainted! Sending out ${activePokemon.name}!`);
     }


    updateBattleDisplay();
    generatePlayerMoveButtons(); // Needs to be called *after* activePokemon is set
    generateBattleActionButtons();

    itemButtonsContainer.classList.add('hidden');
    switchPokemonContainer.classList.add('hidden');
    playerMovesContainer.classList.add('hidden'); // Moves are hidden until "Fight" is clicked

    playerSpriteEl.src = activePokemon.sprite;
    playerSpriteEl.onerror = () => playerSpriteEl.src = 'placeholder.png';
    opponentSpriteEl.src = opponentPokemon.sprite;
    opponentSpriteEl.onerror = () => opponentSpriteEl.src = 'placeholder.png';

    logMessage(`A wild ${opponentPokemon.name} appeared!`);
    if (activePokemon.hp > 0) { // Only log go if the Pokémon wasn't just force-switched in fainted
        logMessage(`Go, ${activePokemon.name}!`);
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

function showMoveButtons() {
    // Don't allow fighting if current pokemon is fainted
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

function generatePlayerMoveButtons() {
    playerMovesContainer.innerHTML = '';
    const currentPokemon = getActivePlayerPokemon();
    // Check if currentPokemon and moves exist
    if (!currentPokemon || !currentPokemon.moves) {
        console.error("Error generating moves: Active Pokemon or moves undefined", currentPokemon);
        return; // Prevent error if state is somehow invalid
    }
    currentPokemon.moves.forEach(move => {
        const button = document.createElement('button');
        button.textContent = move.name;
        button.addEventListener('click', () => handlePlayerMove(move));
        playerMovesContainer.appendChild(button);
    });
     // Keep hidden until "Fight" clicked, handled by showMoveButtons
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

// --- Actions ---

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
         // Cannot heal fainted pokemon with this potion
        if(getActivePlayerPokemon().hp <= 0) button.disabled = true;
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

    if (!hasUsableItem && itemButtonsContainer.children.length <= 1) { // Check if only Back button exists
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
         // Don't consume turn or item if no healing occurred
        generateItemButtons(); // Regenerate item buttons to re-enable them
         actionPrompt.textContent = "Choose an item:";
         itemButtonsContainer.querySelectorAll('button').forEach(b => b.disabled=false); // Re-enable buttons
    }
}

function usePokeball() {
     if (!isPlayerTurn || battleOver || player.inventory.pokeballs <= 0) return;
     if (opponentPokemon.hp >= opponentPokemon.maxHp * 0.5 || opponentPokemon.hp <= 0) {
         logMessage("Cannot throw Poké Ball now!");
         generateItemButtons(); // Show items again
         return;
     }
    disableAllButtons();

    player.inventory.pokeballs--;
    logMessage(`You threw a Poké Ball!`);
    updateInventoryDisplay();

    const hpPercent = opponentPokemon.hp / opponentPokemon.maxHp;
    const captureChance = 0.50 + (0.5 - hpPercent) * 0.9; // Max 95%

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
    generatePlayerMoveButtons(); // Setup moves for the new pokemon (hidden initially)

    isPlayerTurn = false;
    setTimeout(opponentTurn, 1500);
}

function opponentTurn() {
    if (battleOver) return;
    const activePokemon = getActivePlayerPokemon();

    // If player's active Pokemon fainted before opponent's turn (e.g. recoil, status)
    // Opponent shouldn't attack. This shouldn't happen with current moves, but good practice.
    if (activePokemon.hp <= 0) {
         logMessage(`${activePokemon.name} has already fainted.`);
         isPlayerTurn = true;
         generateBattleActionButtons();
         actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
         disableMoveButtons(); // Can't fight
         return; // Skip opponent attack
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
            generateBattleActionButtons(); // Let player choose action (likely switch)
             actionPrompt.textContent = "Your Pokémon fainted! Choose another action (Switch recommended).";
             // Disable fight button directly might be better
             battleButtonsContainer.querySelector('button:first-child').disabled = true; // Disable "Fight"

        } else {
             endBattle(false); // Player loses - no more Pokémon
        }

    } else {
        isPlayerTurn = true;
        generateBattleActionButtons();
        actionPrompt.textContent = "Choose your action:";
    }
}

// Damage calculation (uses move power, scaled down)
function calculateDamage(basePower) {
    // Add randomness: +/- 20%
    const variation = basePower * 0.2;
    const randomFactor = Math.random() * variation * 2 - variation; // Between -variation and +variation
    const rawDamage = basePower + randomFactor;

    // --- SCALING ---
    // Divide the raw damage to make battles last longer.
    // Adjust the divisor (e.g., 1.5, 2.0, 2.5) to fine-tune battle length.
    const scalingFactor = 2.0;
    const scaledDamage = rawDamage / scalingFactor;
    // --- END SCALING ---

    // Ensure at least 1 damage is dealt and round the result
    return Math.max(1, Math.round(scaledDamage));
}

function disableAllButtons() {
    battleView.querySelectorAll('button').forEach(button => {
        // Keep return to map button enabled if it's shown
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


function endBattle(playerWon) {
    battleOver = true;
    disableAllButtons(); // Disable actions except potentially Return to Map
    justEvolved = false;

    if (playerWon && opponentPokemon.hp <= 0) { // Ensure opponent actually fainted (not capture)
        logMessage("You won the battle!");
        player.wins++;

        calculateDrops();

        const pokemonThatWon = getActivePlayerPokemon(); // Check the Pokémon active at the end
        // Check if it exists and has evolution data
         if (pokemonThatWon && pokemonThatWon.evolvesAtWins && player.wins >= pokemonThatWon.evolvesAtWins && pokemonThatWon.evolution) {
            evolvePokemon(player.activePokemonIndex, pokemonThatWon.evolution);
            justEvolved = true;
         }

        updateInventoryDisplay();
        if (justEvolved) {
             setTimeout(() => { // Delay update slightly after evolution message
                 updateBattleDisplay();
                 generatePlayerMoveButtons(); // Update moves display if needed
             }, 1100); // After evolution log message
        }

    } else if (!playerWon) { // Lost battle
        logMessage("You lost the battle...");
        const allFainted = player.party.every(p => p.hp <= 0);
        if (allFainted) {
            logMessage("All your Pokémon have fainted! Returning to start...");
            // Could implement a penalty or forced heal here
        }
    }
    // Handle capture case (already handled in usePokeball)

    // Determine final prompt after potential evolution message delay
     setTimeout(() => {
        if (battleOver && !returnToMapButton.classList.contains('hidden')) return; // Don't overwrite if capture happened

         actionPrompt.textContent = playerWon ? "Victory!" : "Defeated!";
         if (justEvolved) actionPrompt.textContent += " ...and Evolved!";
         returnToMapButton.classList.remove('hidden');
         returnToMapButton.disabled = false; // Ensure it's usable
     }, justEvolved ? 1200 : 100); // Longer delay if evolution occurred

}


function calculateDrops() {
    let dropsMessage = "Spoils: ";
    let droppedSomething = false;

    if (Math.random() < 0.25) { // 25% Potion
        player.inventory.potions++;
        dropsMessage += "Potion x1 ";
        droppedSomething = true;
    }
    if (Math.random() < 0.40) { // 40% Poké Ball
        player.inventory.pokeballs++;
        dropsMessage += "Poké Ball x1 ";
        droppedSomething = true;
    }

    if (droppedSomething) {
        logMessage(dropsMessage);
        updateInventoryDisplay(); // Update map inventory immediately
    }
}

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
     // Check if active pokemon fainted and force switch if needed before going to map
      if (getActivePlayerPokemon().hp <= 0) {
          const availableIndex = player.party.findIndex((p, index) => index !== player.activePokemonIndex && p.hp > 0);
          if (availableIndex !== -1) {
              player.activePokemonIndex = availableIndex;
              console.log(`Switched active Pokemon to ${getActivePlayerPokemon().name} before returning to map.`);
          } else {
              // Handle game over state if needed upon returning to map
              console.log("Returning to map with all Pokemon fainted.");
          }
      }

     switchMode('map');
     battleOver = false;
});

// --- Initial Game Setup ---
window.onload = initializeGame;
