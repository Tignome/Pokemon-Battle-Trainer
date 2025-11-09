function playCorrect() {}
function playWrong() {}

const APP_VERSION = "0.69.0";

const TYPE_CHART = {
  normal: { super: [], not: ["rock", "steel"], immune: ["ghost"] },
  fire: { super: ["grass", "ice", "bug", "steel"], not: ["fire", "water", "rock", "dragon"], immune: [] },
  water: { super: ["fire", "ground", "rock"], not: ["water", "grass", "dragon"], immune: [] },
  electric: { super: ["water", "flying"], not: ["electric", "grass", "dragon"], immune: ["ground"] },
  grass: { super: ["water", "ground", "rock"], not: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"], immune: [] },
  ice: { super: ["grass", "ground", "flying", "dragon"], not: ["fire", "water", "ice", "steel"], immune: [] },
  fighting: { super: ["normal", "ice", "rock", "dark", "steel"], not: ["poison", "flying", "psychic", "bug", "fairy"], immune: ["ghost"] },
  poison: { super: ["grass", "fairy"], not: ["poison", "ground", "rock", "ghost"], immune: ["steel"] },
  ground: { super: ["fire", "electric", "poison", "rock", "steel"], not: ["grass", "bug"], immune: ["flying"] },
  flying: { super: ["grass", "fighting", "bug"], not: ["electric", "rock", "steel"], immune: [] },
  psychic: { super: ["fighting", "poison"], not: ["psychic", "steel"], immune: ["dark"] },
  bug: { super: ["grass", "psychic", "dark"], not: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"], immune: [] },
  rock: { super: ["fire", "ice", "flying", "bug"], not: ["fighting", "ground", "steel"], immune: [] },
  ghost: { super: ["psychic", "ghost"], not: ["dark"], immune: ["normal"] },
  dragon: { super: ["dragon"], not: ["steel"], immune: ["fairy"] },
  dark: { super: ["psychic", "ghost"], not: ["fighting", "dark", "fairy"], immune: [] },
  steel: { super: ["ice", "rock", "fairy"], not: ["fire", "water", "electric", "steel"], immune: [] },
  fairy: { super: ["fighting", "dragon", "dark"], not: ["fire", "poison", "steel"], immune: [] },
};

const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const TYPE_LIST = Object.keys(TYPE_CHART);

const TYPE_ICON_OVERRIDES =
  typeof window !== "undefined" && window.TYPE_ICON_OVERRIDES
    ? window.TYPE_ICON_OVERRIDES
    : null;

function isRemoteAsset(url) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(url);
}

function appendCacheBust(url) {
  if (!url || !APP_VERSION) return url;
  let base = url;
  let hash = "";
  const hashIndex = url.indexOf("#");
  if (hashIndex >= 0) {
    base = url.slice(0, hashIndex);
    hash = url.slice(hashIndex);
  }
  const questionIndex = base.indexOf("?");
  if (questionIndex >= 0) {
    const path = base.slice(0, questionIndex);
    const query = base.slice(questionIndex + 1);
    try {
      const params = new URLSearchParams(query);
      if (!params.has("v")) {
        params.set("v", APP_VERSION);
      }
      base = `${path}?${params.toString()}`;
    } catch (error) {
      base = `${base}&v=${APP_VERSION}`;
    }
  } else {
    base = `${base}?v=${APP_VERSION}`;
  }
  return `${base}${hash}`;
}

function withCacheBust(url) {
  if (!url) return url;
  if (isRemoteAsset(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  return appendCacheBust(url);
}

function toAbsoluteUrl(url) {
  if (!url) return url;
  try {
    return new URL(url, document.baseURI).href;
  } catch (error) {
    return url;
  }
}

const SPRITE_SOURCE_PRIMARY_HTML =
  "https://raw.githubusercontent.com/Tignome/pokedex-assets/main/pokedex_sprites_1_1025.html";
const SPRITE_SOURCE_PRIMARY_CSV =
  "https://raw.githubusercontent.com/Tignome/pokedex-assets/main/pokedex_sprites_1_1025.csv";
const SPRITE_SOURCE_FALLBACK_HTML =
  "https://cdn.jsdelivr.net/gh/Tignome/pokedex-assets@main/pokedex_sprites_1_1025.html";
const SPRITE_SOURCE_FALLBACK_CSV =
  "https://cdn.jsdelivr.net/gh/Tignome/pokedex-assets@main/pokedex_sprites_1_1025.csv";

const LOCAL_SPRITE_DIRECTORY = "sugimori";
const LOCAL_SPRITE_EXTENSION = ".png";

const SPRITE_SOURCES = [
  SPRITE_SOURCE_PRIMARY_HTML,
  SPRITE_SOURCE_PRIMARY_CSV,
  SPRITE_SOURCE_FALLBACK_HTML,
  SPRITE_SOURCE_FALLBACK_CSV,
];

const FALLBACK_SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

const POKEMON_DATA = `
Corsola (Galarian), 222, ghost, none
Cradily, 346, rock, grass
Gastrodon, 423, water, ground
Azumarill, 184, water, fairy
Marowak (Shadow), 105, ground, none
Dusclops, 356, ghost, none
Stunfisk, 618, ground, electric
Dusknoir (Shadow), 477, ghost, none
Marowak, 105, ground, none
Bastiodon, 411, rock, steel
Altaria, 334, dragon, flying
Dragonair (Shadow), 148, dragon, none
Dusknoir, 477, ghost, none
Corviknight, 823, flying, steel
Goodra, 706, dragon, none
Araquanid, 752, water, bug
Bellibolt, 939, electric, none
Gligar, 207, ground, flying
Lickitung, 108, normal, none
Dusclops (Shadow), 356, ghost, none
Zweilous, 634, dark, dragon
Toedscruel, 949, ground, grass
Annihilape, 979, fighting, ghost
Dragonair, 148, dragon, none
Empoleon, 395, water, steel
Furret, 162, normal, none
Regidrago, 895, dragon, none
Wigglytuff, 40, normal, fairy
Clodsire, 980, poison, ground
Dedenne, 702, electric, fairy
Gligar (Shadow), 207, ground, flying
Lapras, 131, water, ice
Forretress, 205, bug, steel
Bastiodon (Shadow), 411, rock, steel
Jellicent, 593, water, ghost
Empoleon (Shadow), 395, water, steel
Golisopod, 768, bug, water
Guzzlord, 799, dark, dragon
Crustle, 558, bug, rock
Turtonator, 776, fire, dragon
Annihilape (Shadow), 979, fighting, ghost
Giratina (Altered) (Shadow), 487, ghost, dragon
Sableye (Shadow), 302, dark, ghost
Steelix (Shadow), 208, steel, ground
Tinkaton, 959, fairy, steel
Dunsparce, 206, normal, none
Runerigus, 867, ground, ghost
Scizor (Shadow), 212, bug, steel
Spidops, 918, bug, none
Cradily, 346, rock, grass
Lapras (Shadow), 131, water, ice
Oranguru, 765, normal, psychic
Sableye, 302, dark, ghost
Blastoise, 9, water, none
Kommo-o, 784, dragon, fighting
Lickilicky, 463, normal, none
Malamar, 687, dark, psychic
Primeape (Shadow), 57, fighting, none
Kingdra, 230, water, dragon
Samurott, 503, water, none
Charjabug, 737, bug, electric
Moltres (Galarian), 146, dark, flying
Weezing (Galarian) (Shadow), 110, poison, fairy
Zweilous (Shadow), 634, dark, dragon
Grumpig, 326, psychic, none
Grumpig (Shadow), 326, psychic, none
Malamar (Shadow), 687, dark, psychic
Spiritomb, 442, ghost, dark
Claydol, 344, ground, psychic
Drapion (Shadow), 452, poison, dark
Forretress (Shadow), 205, bug, steel
Metang, 375, steel, psychic
Hakamo-o, 783, dragon, fighting
Scizor, 212, bug, steel
Hydreigon (Shadow), 635, dark, dragon
Metang (Shadow), 375, steel, psychic
Stunfisk (Galarian), 618, ground, steel
Linoone, 264, normal, none
Murkrow, 198, dark, flying
Togekiss, 468, fairy, flying
Primeape, 57, fighting, none
Drapion, 452, poison, dark
Golurk (Shadow), 623, ground, ghost
Feraligatr, 160, water, none
Hippowdon (Shadow), 450, ground, none
Quagsire (Shadow), 195, water, ground
Talonflame, 663, fire, flying
Feraligatr (Shadow), 160, water, none
Melmetal, 809, steel, none
Ninetales, 38, fire, none
Florges, 671, fairy, none
Kingdra (Shadow), 230, water, dragon
Cresselia, 488, psychic, none
Dewott (Shadow), 502, water, none
Gliscor, 472, ground, flying
Samurott (Shadow), 503, water, none
Talonflame (Shadow), 663, fire, flying
Weezing (Galarian), 110, poison, fairy
Clefable, 36, fairy, none
Latias, 380, dragon, psychic
Altaria (Shadow), 334, dragon, flying
Aurorus, 699, rock, ice
Castform (Sunny), 351, fire, none
Diggersby, 660, normal, ground
Medicham, 308, fighting, psychic
Quagsire, 195, water, ground
Sealeo (Shadow), 364, ice, water
Klefki, 707, steel, fairy
Ninetales (Shadow), 38, fire, none
Pangoro, 675, fighting, dark
Seaking, 119, water, none
Thievul, 828, dark, none
Carbink, 703, rock, fairy
Cradily (Shadow), 346, rock, grass
Sandslash (Alolan), 28, ice, steel
Diggersby (Shadow), 660, normal, ground
Charjabug (Shadow), 737, bug, electric
Dragonite (Shadow), 149, dragon, flying
Gyarados (Shadow), 130, water, flying
Hippopotas (Shadow), 449, ground, none
Miltank, 241, normal, none
Ninetales (Alolan) (Shadow), 38, ice, fairy
Gliscor (Shadow), 472, ground, flying
Nidoqueen, 31, poison, ground
Steelix, 208, steel, ground
Amoonguss, 591, grass, poison
Dewgong, 87, water, ice
Dewott, 502, water, none
Murkrow (Shadow), 198, dark, flying
Machamp (Shadow), 68, fighting, none
Registeel, 379, steel, none
Hippowdon, 450, ground, none
Swalot, 317, poison, none
Hydreigon, 635, dark, dragon
Machoke (Shadow), 67, fighting, none
Marowak (Alolan), 105, fire, ghost
Morpeko (Full Belly), 877, electric, dark
Nidoqueen (Shadow), 31, poison, ground
Sandslash (Alolan) (Shadow), 28, ice, steel
Sealeo, 364, ice, water
Dragalge, 691, poison, dragon
Marowak (Alolan) (Shadow), 105, fire, ghost
Fearow, 22, normal, flying
Lanturn, 171, water, electric
Pachirisu, 417, electric, none
Aegislash (Shield), 681, steel, ghost
Greedent, 820, normal, none
Togetic, 176, fairy, flying
Trevenant, 709, ghost, grass
Machamp, 68, fighting, none
Golurk, 623, ground, ghost
Hippopotas, 449, ground, none
Ninetales (Alolan), 38, ice, fairy
Torkoal, 324, fire, none
Arctibax, 997, dragon, ice
Dodrio, 85, normal, flying
Dubwool, 832, normal, none
Hypno, 97, psychic, none
Victreebel, 71, grass, poison
Mandibuzz, 630, dark, flying
Raikou, 243, electric, none
Castform, 351, normal, none
Swampert (Shadow), 260, water, ground
Claydol (Shadow), 344, ground, psychic
Crustle (Shadow), 558, bug, rock
Donphan (Shadow), 232, ground, none
Gyarados, 130, water, flying
Jirachi, 385, steel, psychic
Trevenant (Shadow), 709, ghost, grass
Victreebel (Shadow), 71, grass, poison
Regirock, 377, rock, none
Swampert, 260, water, ground
Drampa, 780, normal, dragon
Abomasnow (Shadow), 460, grass, ice
Amoonguss (Shadow), 591, grass, poison
Greninja, 658, water, dark
Aurorus (Shadow), 699, rock, ice
Dartrix, 723, grass, flying
Tinkatuff, 958, fairy, steel
Wormadam (Trash), 413, bug, steel
Abomasnow, 460, grass, ice
Castform (Rainy), 351, water, none
Latias (Shadow), 380, dragon, psychic
Whiscash, 340, water, ground
Umbreon, 197, dark, none
Blastoise (Shadow), 9, water, none
Toxapex, 748, poison, water
Jumpluff (Shadow), 189, grass, flying
Qwilfish (Shadow), 211, water, poison
Tentacruel, 73, water, poison
Ursaring (Shadow), 217, normal, none
Venusaur, 3, grass, poison
Whiscash (Shadow), 340, water, ground
Dachsbun, 927, fairy, none
Bronzong, 437, steel, psychic
Mightyena (Shadow), 262, dark, none
Bellossom, 182, grass, none
Emolga, 587, electric, flying
Walrein, 365, ice, water
Hypno (Shadow), 97, psychic, none
Lairon, 305, steel, rock
Toucannon (Shadow), 733, normal, flying
Ampharos, 181, electric, none
Bellossom (Shadow), 182, grass, none
Golisopod, 768, bug, water
Qwilfish, 211, water, poison
Scrafty, 560, dark, fighting
Trumbeak (Shadow), 732, normal, flying
Mightyena, 262, dark, none
Urshifu (Single Strike), 892, fighting, dark
Charizard (Shadow), 6, fire, flying
Cetoddle, 974, ice, none
Donphan, 232, ground, none
Shelgon, 372, dragon, none
Farfetch'd (Galarian), 83, fighting, none
Oinkologne (Female), 916, normal, none
Palkia (Shadow), 484, water, dragon
Rufflet, 627, normal, flying
Salamence (Shadow), 373, dragon, flying
Drifblim, 426, ghost, flying
Venusaur (Shadow), 3, grass, poison
Avalugg, 713, ice, none
Vespiquen, 416, bug, flying
Fletchinder (Shadow), 662, fire, flying
Lurantis, 754, grass, none
Spinda, 327, normal, none
Torterra, 389, grass, ground
Cetitan, 975, ice, none
Dragonite, 149, dragon, flying
Pumpkaboo (Super), 710, ghost, grass
Qwilfish (Hisuian), 211, dark, poison
Wartortle, 8, water, none
Froslass, 478, ice, ghost
Lairon (Shadow), 305, steel, rock
Gourgeist (Super), 711, ghost, grass
Raikou (Shadow), 243, electric, none
Ampharos (Shadow), 181, electric, none
Magcargo, 219, fire, rock
Slowking (Galarian), 199, poison, psychic
Walrein (Shadow), 365, ice, water
Aron, 304, steel, rock
Glalie, 362, ice, none
Hariyama (Shadow), 297, fighting, none
Jumpluff, 189, grass, flying
Magnezone, 462, electric, steel
Raichu, 26, electric, none
Sandslash, 28, ground, none
Gourgeist (Large), 711, ghost, grass
Shelgon (Shadow), 372, dragon, none
Dudunsparce, 982, normal, none
Munchlax, 446, normal, none
Ursaring, 217, normal, none
Wailmer (Shadow), 320, water, none
Zapdos, 145, electric, flying
Ferrothorn, 598, grass, steel
Amaura (Shadow), 698, rock, ice
Aromatisse, 683, fairy, none
Kingambit, 983, dark, steel
Lokix, 920, bug, dark
Overqwil, 904, dark, poison
Skuntank, 435, poison, dark
Snorlax, 143, normal, none
Uxie, 480, psychic, none
Wailmer, 320, water, none
Latios, 381, dragon, psychic
Lucario, 448, fighting, steel
Pawniard, 624, dark, steel
Sandslash (Shadow), 28, ground, none
Aron (Shadow), 304, steel, rock
Barbaracle, 689, rock, water
Castform (Snowy), 351, ice, none
Fletchinder, 662, fire, flying
Gogoat, 673, grass, none
Skeledirge, 911, fire, ghost
Typhlosion (Shadow), 157, fire, none
Zapdos (Shadow), 145, electric, flying
Genesect, 649, bug, steel
Piloswine, 221, ice, ground
Sirfetch'd, 865, fighting, none
Snorlax (Shadow), 143, normal, none
Whimsicott, 547, grass, fairy
Hariyama, 297, fighting, none
Lugia, 249, psychic, flying
Meganium, 154, grass, none
Perrserker, 863, steel, none
Trumbeak, 732, normal, flying
Cofagrigus, 563, ghost, none
Drifblim (Shadow), 426, ghost, flying
Gourgeist (Average), 711, ghost, grass
Lileep, 345, rock, grass
Piloswine (Shadow), 221, ice, ground
Gallade, 475, psychic, fighting
Gallade (Shadow), 475, psychic, fighting
Amaura, 698, rock, ice
Decidueye (Hisuian), 724, grass, fighting
Mew, 151, psychic, none
Toucannon, 733, normal, flying
Armarouge, 936, fire, psychic
Sceptile (Shadow), 254, grass, none
`;

const ROSTER = parsePokemonData(POKEMON_DATA);
applyLocalSprites(ROSTER);

const state = {
  score: 0,
  rounds: 0,
  streak: 0,
  defender: null,
  hand: [],
  matchups: [],
  bestIndex: null,
  bestMultiplier: 1,
  chosenIndex: null,
  chosenType: null,
  chosenResult: null,
  previewIndex: null,
  previewResult: null,
  locked: false,
  typePickerOpen: false,
  pendingIndex: null,
  handButtons: [],
  comparisonRows: [],
  spriteMap: new Map(),
};

const elements = {
  defenderName: null,
  defenderTypes: null,
  defenderCard: null,
  hand: null,
  announcement: null,
  score: null,
  streak: null,
  nextBtn: null,
  modalBackdrop: null,
  resultAdvice: null,
  resultVerdict: null,
  resultDefender: null,
  explanations: null,
  comparisonBody: null,
  closeModal: null,
  nextRound: null,
  typePickerBackdrop: null,
  typePickerTitle: null,
  typePickerPrompt: null,
  typePickerOptions: null,
  typePickerCancel: null,
  versionTag: null,
};

let pendingResize = null;

function cacheElements() {
  elements.defenderName = document.getElementById("defender-name");
  elements.defenderTypes = document.getElementById("defender-types");
  elements.defenderCard = document.getElementById("defender-card");
  elements.hand = document.getElementById("hand");
  elements.announcement = document.getElementById("announcement");
  elements.score = document.getElementById("score");
  elements.streak = document.getElementById("streak");
  elements.nextBtn = document.getElementById("next-btn");
  elements.modalBackdrop = document.getElementById("modal-backdrop");
  elements.resultAdvice = document.getElementById("result-advice");
  elements.resultVerdict = document.getElementById("result-verdict");
  elements.resultDefender = document.getElementById("result-defender");
  elements.explanations = document.getElementById("explanations");
  elements.comparisonBody = document.getElementById("comparison-body");
  elements.closeModal = document.getElementById("close-modal");
  elements.nextRound = document.getElementById("next-round");
  elements.typePickerBackdrop = document.getElementById("type-picker-backdrop");
  elements.typePickerTitle = document.getElementById("type-picker-title");
  elements.typePickerPrompt = document.getElementById("type-picker-prompt");
  elements.typePickerOptions = document.getElementById("type-picker-options");
  elements.typePickerCancel = document.getElementById("type-picker-cancel");
  elements.versionTag = document.querySelector(".version-tag");
  if (elements.versionTag) {
    elements.versionTag.textContent = `Version ${APP_VERSION}`;
  }
}

function bindEvents() {
  if (elements.nextBtn) {
    elements.nextBtn.addEventListener("click", startNextRound);
  }
  if (elements.closeModal) {
    elements.closeModal.addEventListener("click", () => closeModal(true));
  }
  if (elements.nextRound) {
    elements.nextRound.addEventListener("click", () => {
      closeModal(false);
      startNextRound();
    });
  }

  if (elements.typePickerCancel) {
    elements.typePickerCancel.addEventListener("click", () => closeTypePicker(true));
  }

  if (elements.typePickerBackdrop) {
    elements.typePickerBackdrop.addEventListener("click", (event) => {
      if (event.target === elements.typePickerBackdrop) {
        closeTypePicker(true);
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (elements.typePickerBackdrop && !elements.typePickerBackdrop.hidden) {
        closeTypePicker(true);
        return;
      }
      if (elements.modalBackdrop && !elements.modalBackdrop.hidden) {
        closeModal(true);
      }
    }
  });

  window.addEventListener("resize", () => {
    if (pendingResize) {
      cancelAnimationFrame(pendingResize);
    }
    pendingResize = requestAnimationFrame(() => {
      pendingResize = null;
      alignHandFan();
    });
  });
}

async function init() {
  cacheElements();
  bindEvents();
  await primeSpriteAtlas();
  startNextRound();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

function startNextRound() {
  if (elements.nextBtn) {
    elements.nextBtn.hidden = true;
    elements.nextBtn.disabled = true;
  }
  if (elements.modalBackdrop) {
    elements.modalBackdrop.hidden = true;
  }
  if (elements.closeModal) {
    elements.closeModal.disabled = true;
  }
  if (elements.nextRound) {
    elements.nextRound.disabled = true;
  }
  if (elements.resultAdvice) {
    elements.resultAdvice.textContent = "";
  }
  state.locked = false;
  state.chosenIndex = null;
  state.chosenType = null;
  state.chosenResult = null;
  state.previewIndex = null;
  state.previewResult = null;
  state.bestIndex = null;
  state.bestMultiplier = 1;
  state.typePickerOpen = false;
  state.pendingIndex = null;
  state.matchups = [];
  state.handButtons = [];
  state.comparisonRows = [];
  closeTypePicker(true);
  dealRound();
}

function dealRound() {
  const defender = pickDefender();
  state.defender = defender;
  let attempts = 0;
  let hand = [];
  let matchups = [];
  let winners = [];
  do {
    hand = dealHand(defender);
    matchups = hand.map((pokemon) => computeMatchup(pokemon, defender.types));
    const evaluation = evaluateBest(matchups);
    winners = evaluation.winners;
    state.bestIndex = winners[0] ?? 0;
    state.bestMultiplier = evaluation.bestMultiplier;
    attempts += 1;
    if (winners.length === 1) {
      break;
    }
  } while (attempts < 200);

  if (winners.length !== 1) {
    const fallback = evaluateBest(matchups);
    state.bestIndex = fallback.winners[0];
    state.bestMultiplier = fallback.bestMultiplier;
  }

  state.hand = hand;
  state.matchups = matchups;

  renderDefender(defender);
  renderHand(hand);
  updateAnnouncement("Choose the Pokémon card with the most effective attack!");
}

function pickDefender() {
  const index = Math.floor(Math.random() * ROSTER.length);
  return ROSTER[index];
}

function dealHand(defender) {
  const chosen = new Set();
  while (chosen.size < 3) {
    const index = Math.floor(Math.random() * ROSTER.length);
    if (ROSTER[index] === defender) {
      continue;
    }
    chosen.add(index);
  }
  return Array.from(chosen).map((idx) => ROSTER[idx]);
}

function computeMatchup(pokemon, defenderTypes) {
  const typeResults = pokemon.types.map((type) => {
    const multiplier = outcome(type, defenderTypes);
    const perType = defenderTypes.map((def) => ({
      defender: def,
      multiplier: singleTypeMultiplier(type, def),
    }));
    return { type, multiplier, perType };
  });

  const bestMultiplier = typeResults.reduce((max, entry) => {
    return entry.multiplier > max ? entry.multiplier : max;
  }, 0);

  const bestTypes = typeResults.filter((entry) => nearlyEqual(entry.multiplier, bestMultiplier));

  return {
    pokemon,
    results: typeResults,
    bestMultiplier,
    bestTypes,
    primaryType: bestTypes.length > 0 ? bestTypes[0].type : pokemon.types[0],
  };
}

function outcome(attackingType, defenderTypes) {
  if (!attackingType) {
    return 0;
  }
  const typeInfo = TYPE_CHART[attackingType];
  if (!typeInfo) {
    return 1;
  }
  let multiplier = 1;
  for (const def of defenderTypes) {
    if (!def) continue;
    if (typeInfo.immune.includes(def)) {
      return 0;
    }
    if (typeInfo.super.includes(def)) {
      multiplier *= 2;
    } else if (typeInfo.not.includes(def)) {
      multiplier *= 0.5;
    }
  }
  return normalizeMultiplier(multiplier);
}

function singleTypeMultiplier(attackingType, defenderType) {
  if (!attackingType || !defenderType) return 1;
  const chart = TYPE_CHART[attackingType];
  if (!chart) return 1;
  if (chart.immune.includes(defenderType)) return 0;
  if (chart.super.includes(defenderType)) return 2;
  if (chart.not.includes(defenderType)) return 0.5;
  return 1;
}

function evaluateBest(matchups) {
  let best = -Infinity;
  let winners = [];
  matchups.forEach((match, index) => {
    if (match.bestMultiplier > best + 0.0001) {
      best = match.bestMultiplier;
      winners = [index];
    } else if (nearlyEqual(match.bestMultiplier, best)) {
      winners.push(index);
    }
  });
  return { bestMultiplier: best, winners };
}

function renderDefender(defender) {
  if (!elements.defenderCard) return;
  if (elements.defenderName) {
    elements.defenderName.textContent = defender.name;
  }
  if (elements.defenderTypes) {
    renderTypeBadges(elements.defenderTypes, defender.types);
  }
  elements.defenderCard.innerHTML = "";
  elements.defenderCard.appendChild(buildCard(defender, { variant: "defender" }));
  requestAnimationFrame(() => alignHandFan());
}

function renderHand(hand) {
  if (!elements.hand) return;
  elements.hand.innerHTML = "";
  state.handButtons = [];
  elements.hand.style.setProperty("--fan-adjust", "0px");
  hand.forEach((pokemon, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hand-card dealing";
    button.style.setProperty("--fan-index", index);
    button.dataset.index = String(index);
    button.setAttribute("aria-label", `Play ${pokemon.name}`);
    const card = buildCard(pokemon, { variant: "hand" });
    button.appendChild(card);
    button.addEventListener("click", () => resolveSelection(index));
    button.addEventListener("keydown", (event) => {
      if (!state.locked && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        resolveSelection(index);
      }
    });
    button.addEventListener(
      "animationend",
      () => {
        button.classList.remove("dealing");
      },
      { once: true }
    );
    elements.hand.appendChild(button);
    state.handButtons.push(button);
  });
  requestAnimationFrame(() => alignHandFan());
}

function alignHandFan() {
  if (!elements.hand) return;
  const cards = Array.from(elements.hand.querySelectorAll(".hand-card"));
  if (cards.length === 0) {
    elements.hand.style.setProperty("--fan-adjust", "0px");
    return;
  }
  const defenderNode = elements.defenderCard?.firstElementChild || elements.defenderCard;
  const handRect = elements.hand.getBoundingClientRect();
  const anchorRect = defenderNode ? defenderNode.getBoundingClientRect() : handRect;
  const anchorCenter = anchorRect.left + anchorRect.width / 2;
  const cardRects = cards.map((card) => card.getBoundingClientRect());
  const fanLeft = Math.min(...cardRects.map((rect) => rect.left));
  const fanRight = Math.max(...cardRects.map((rect) => rect.right));
  const fanCenter = (fanLeft + fanRight) / 2;
  const delta = anchorCenter - fanCenter;
  elements.hand.style.setProperty("--fan-adjust", `${delta}px`);
}

function resolveSelection(index) {
  if (state.locked || state.typePickerOpen) return;
  if (!Number.isInteger(index) || index < 0 || index >= state.matchups.length) {
    return;
  }
  const pokemon = state.hand[index];
  if (!pokemon) return;
  if (pokemon.types.length > 1) {
    openTypePicker(index);
    return;
  }
  finalizeSelection(index, pokemon.types[0]);
}

function finalizeSelection(index, type) {
  const match = state.matchups[index];
  const pokemon = state.hand[index];
  if (!match || !pokemon) return;

  const chosenResult = match.results.find((entry) => entry.type === type) || match.bestTypes[0] || match.results[0];
  state.locked = true;
  state.typePickerOpen = false;
  state.pendingIndex = null;
  state.chosenIndex = index;
  state.chosenType = chosenResult?.type || type || pokemon.types[0];
  state.chosenResult = chosenResult;
  state.previewIndex = index;
  state.previewResult = chosenResult;
  state.rounds += 1;

  const chosenMultiplier = chosenResult ? chosenResult.multiplier : 0;
  const bestMatch = state.matchups[state.bestIndex];
  const bestMultiplier = bestMatch ? bestMatch.bestMultiplier : state.bestMultiplier;
  const correct = index === state.bestIndex && nearlyEqual(chosenMultiplier, bestMultiplier);

  if (correct) {
    state.score += 1;
    state.streak += 1;
    playCorrect();
    updateAnnouncement("Correct! You found the optimal matchup.");
  } else {
    state.streak = 0;
    playWrong();
  updateAnnouncement("That wasn't the strongest option. Review the breakdown below.");
  }

  updateScorebar();
  lockHand(index);
  showResult();
}

function openTypePicker(index) {
  const pokemon = state.hand[index];
  if (!pokemon) return;
  if (!elements.typePickerBackdrop || !elements.typePickerOptions) {
    finalizeSelection(index, pokemon.types[0]);
    return;
  }

  state.typePickerOpen = true;
  state.pendingIndex = index;
  elements.typePickerBackdrop.hidden = false;

  if (elements.typePickerTitle) {
    elements.typePickerTitle.textContent = "Choose attack type";
  }
  if (elements.typePickerPrompt) {
    const formattedTypes = pokemon.types.map((type) => formatType(type)).join(" or ");
    const prompt = `${pokemon.name} can attack as ${formattedTypes}. Select one.`;
    renderTextWithTypeIcons(elements.typePickerPrompt, prompt);
  }

  elements.typePickerOptions.innerHTML = "";
  const buttons = [];
  pokemon.types.forEach((type) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "type-picker-option";
    option.dataset.type = type;
    const badge = createTypeBadge(type);
    option.appendChild(badge);
    const label = document.createElement("span");
    label.className = "type-picker-label sr-only";
    label.textContent = formatType(type);
    option.appendChild(label);
    option.addEventListener("click", () => {
      closeTypePicker(false);
      finalizeSelection(index, type);
    });
    elements.typePickerOptions.appendChild(option);
    buttons.push(option);
  });

  requestAnimationFrame(() => {
    if (buttons[0]) {
      buttons[0].focus();
    }
  });
}

function closeTypePicker(cancelled) {
  const previousIndex = state.pendingIndex;
  state.typePickerOpen = false;
  state.pendingIndex = null;

  if (!elements.typePickerBackdrop) {
    if (cancelled && Number.isInteger(previousIndex)) {
      const button = state.handButtons[previousIndex];
      if (button) {
        button.focus();
      }
    }
    return;
  }

  if (!elements.typePickerBackdrop.hidden) {
    elements.typePickerBackdrop.hidden = true;
  }

  if (elements.typePickerOptions) {
    elements.typePickerOptions.innerHTML = "";
  }
  if (elements.typePickerPrompt) {
    elements.typePickerPrompt.textContent = "";
  }

  if (cancelled && Number.isInteger(previousIndex)) {
    const button = state.handButtons[previousIndex];
    if (button) {
      button.focus();
    }
  }
}

function lockHand(chosenIndex) {
  state.handButtons.forEach((button, index) => {
    if (index === chosenIndex) {
      button.classList.add("selected");
    } else {
      button.classList.add("disabled");
    }
    button.disabled = true;
  });
}

function showResult() {
  if (state.chosenIndex == null || !state.matchups[state.chosenIndex]) {
    return;
  }
  if (elements.nextBtn) {
    elements.nextBtn.hidden = false;
    elements.nextBtn.disabled = false;
  }
  if (elements.modalBackdrop) {
    elements.modalBackdrop.hidden = false;
  }
  if (elements.closeModal) {
    elements.closeModal.disabled = false;
  }
  if (elements.nextRound) {
    elements.nextRound.disabled = false;
  }
  renderDefenderBadges();
  renderComparison();
  updateResultAdvice();
  previewMatch(state.chosenIndex, false);
  if (elements.closeModal) {
    elements.closeModal.focus();
  }
}

function renderDefenderBadges() {
  if (!elements.resultDefender) return;
  renderTypeBadges(elements.resultDefender, state.defender.types);
}

function updateResultAdvice() {
  if (!elements.resultAdvice) return;
  const { chosenIndex, bestIndex, matchups, chosenResult } = state;
  const chosenMatch = Number.isInteger(chosenIndex) ? matchups[chosenIndex] : null;
  const bestMatch = Number.isInteger(bestIndex) ? matchups[bestIndex] : null;

  if (!chosenMatch) {
    elements.resultAdvice.textContent = "Review the matchup breakdown below to see which Pokémon was strongest and why.";
    return;
  }

  const chosen = chosenResult || chosenMatch.bestTypes[0] || chosenMatch.results[0] || null;
  const best = bestMatch ? bestMatch.bestTypes[0] || bestMatch.results[0] || null : null;
  const chosenMultiplier = chosen ? chosen.multiplier : 0;
  const bestMultiplier = best ? best.multiplier : chosenMultiplier;
  let message = "";

  if (bestMatch && chosenIndex === bestIndex && nearlyEqual(chosenMultiplier, bestMultiplier)) {
    const reason = describeResultReason(best);
    if (reason) {
      message = `You made the best call. ${chosenMatch.pokemon.name} reached ×${bestMultiplier} because ${reason}.`;
    } else {
      message = `You made the best call. ${chosenMatch.pokemon.name} delivered the top multiplier of ×${bestMultiplier}.`;
    }
  } else if (bestMatch && best) {
    const bestReason = describeResultReason(best);
    const chosenReason = describeResultReason(chosen);
    const firstSentence = `A stronger play was ${bestMatch.pokemon.name} for ×${bestMultiplier}${
      bestReason ? ` because ${bestReason}` : ""
    }.`;
    let secondSentence = `Your pick ${chosenMatch.pokemon.name} only managed ×${chosenMultiplier}`;
    if (chosenReason) {
      secondSentence += ` because ${chosenReason}`;
    }
    secondSentence += ".";
    message = `${firstSentence} ${secondSentence}`;
  } else {
    message = "Review the matchup breakdown below to see which Pokémon was strongest and why.";
  }

  if (!message || !message.trim()) {
    message = "Review the matchup breakdown below to see which Pokémon was strongest and why.";
  }

  renderTextWithTypeIcons(elements.resultAdvice, message);
}

function describeResultReason(result) {
  if (!result || !Array.isArray(result.perType)) return "";

  const supers = [];
  const resisted = [];
  const immune = [];
  const neutral = [];

  result.perType.forEach((entry) => {
    if (!entry) return;
    const label = formatType(entry.defender);
    if (nearlyEqual(entry.multiplier, 2)) {
      supers.push(label);
    } else if (nearlyEqual(entry.multiplier, 1)) {
      neutral.push(label);
    } else if (nearlyEqual(entry.multiplier, 0)) {
      immune.push(label);
    } else if (nearlyEqual(entry.multiplier, 0.5) || nearlyEqual(entry.multiplier, 0.25)) {
      resisted.push(label);
    }
  });

  const multiplier = result.multiplier;
  const typeName = result.type ? formatType(result.type) : "This attack";

  if (nearlyEqual(multiplier, 0)) {
    if (immune.length) {
      return `${typeName} can't affect ${formatList(immune)} because they're immune`;
    }
    return `${typeName} couldn't damage the defender`;
  }

  if (multiplier >= 4 - 0.0001) {
    if (supers.length >= 2) {
      return `${typeName} strikes both ${formatList(supers)} super effectively`;
    }
    if (supers.length) {
      return `${typeName} lands doubly super-effective damage on ${formatList(supers)}`;
    }
    return `${typeName} overwhelms the defender`;
  }

  if (nearlyEqual(multiplier, 2)) {
    if (supers.length) {
      return `${typeName} hits ${formatList(supers)} super effectively`;
    }
    return `${typeName} finds a weakness to exploit`;
  }

  if (nearlyEqual(multiplier, 1)) {
    if (supers.length && resisted.length) {
      return `${typeName}'s hit on ${formatList(supers)} offsets the resistance from ${formatList(resisted)}`;
    }
    if (supers.length) {
      return `${typeName} strikes ${formatList(supers)} super effectively while staying neutral elsewhere`;
    }
    if (neutral.length === result.perType.length) {
      return `${typeName} deals only neutral damage`;
    }
    if (resisted.length) {
      return `${typeName} avoids the harsher resistances other cards faced`;
    }
    return `${typeName} deals neutral damage`;
  }

  if (nearlyEqual(multiplier, 0.5) || nearlyEqual(multiplier, 0.25)) {
    if (resisted.length) {
      return `${typeName} is partially resisted by ${formatList(resisted)}`;
    }
    return `${typeName} struggles to get through the defenses`;
  }

  return "";
}

function previewMatch(index, announce = true) {
  const match = state.matchups[index];
  if (!match) return;
  state.previewIndex = index;
  const isChosen = index === state.chosenIndex;
  let displayResult = null;
  if (isChosen && state.chosenResult) {
    displayResult = state.chosenResult;
  } else {
    displayResult = match.bestTypes[0] ?? match.results[0];
  }

  state.previewResult = displayResult;

  const bestMultiplier = displayResult ? displayResult.multiplier : match.bestMultiplier;
  const verdictClass = verdictClassName(bestMultiplier);
  if (elements.resultVerdict) {
    elements.resultVerdict.textContent = verdictText(bestMultiplier);
    elements.resultVerdict.className = `result-verdict ${verdictClass}`;
  }
  renderExplanationList(displayResult);
  highlightPreviewRow(index);
  if (!isChosen && announce) {
    updateAnnouncement(`Previewing ${match.pokemon.name}'s matchup details.`);
  }
}

function renderExplanationList(bestType) {
  if (!elements.explanations) return;
  elements.explanations.innerHTML = "";
  if (!bestType) return;
  bestType.perType.forEach((entry) => {
    const li = document.createElement("li");
    const descriptor = verdictText(entry.multiplier);
    const text = `×${entry.multiplier} vs ${formatType(entry.defender)} (${descriptor})`;
    renderTextWithTypeIcons(li, text);
    elements.explanations.appendChild(li);
  });
}

function renderComparison() {
  if (!elements.comparisonBody) return;
  const sorted = state.matchups
    .map((match, index) => ({ match, index }))
    .sort((a, b) => {
      if (!nearlyEqual(b.match.bestMultiplier, a.match.bestMultiplier)) {
        return b.match.bestMultiplier - a.match.bestMultiplier;
      }
      return a.match.pokemon.name.localeCompare(b.match.pokemon.name);
    });

  elements.comparisonBody.innerHTML = "";
  state.comparisonRows = [];

  sorted.forEach(({ match, index }) => {
    const row = document.createElement("tr");
    row.className = "comparison-row";
    if (index === state.bestIndex) {
      row.classList.add("optimal");
    }
    if (index === state.chosenIndex) {
      row.classList.add("chosen");
    }
    row.dataset.index = String(index);
    row.tabIndex = 0;

    row.addEventListener("click", () => previewMatch(index));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        previewMatch(index);
      }
    });

    const pokemonCell = document.createElement("td");
    pokemonCell.appendChild(buildTablePokemonCell(match.pokemon));

    const multiplierCell = document.createElement("td");
    const chosenMultiplier =
      index === state.chosenIndex && state.chosenResult ? state.chosenResult.multiplier : null;
    const displayMultiplier = chosenMultiplier ?? match.bestMultiplier;
    multiplierCell.textContent = `×${displayMultiplier}`;
    if (
      chosenMultiplier != null &&
      !nearlyEqual(chosenMultiplier, match.bestMultiplier)
    ) {
      const sub = document.createElement("div");
      sub.className = "multiplier-note";
      sub.textContent = `(Max ×${match.bestMultiplier})`;
      multiplierCell.appendChild(sub);
    }

    const notesCell = document.createElement("td");
    const notes = [];
    if (index === state.chosenIndex) notes.push("Chosen");
    if (index === state.bestIndex) notes.push("Optimal");
    if (index === state.chosenIndex && state.chosenType) {
      notes.push(`Using ${formatType(state.chosenType)}`);
    }
    notes.forEach((note) => {
      const pill = document.createElement("span");
      pill.className = "note-pill";
      renderTextWithTypeIcons(pill, note);
      notesCell.appendChild(pill);
    });

    const whyCell = document.createElement("td");
    whyCell.appendChild(buildWhyLines(match, index));

    row.appendChild(pokemonCell);
    row.appendChild(multiplierCell);
    row.appendChild(notesCell);
    row.appendChild(whyCell);

    elements.comparisonBody.appendChild(row);
    state.comparisonRows.push(row);
  });

  updateWhyHighlights();
}

function highlightPreviewRow(index) {
  state.comparisonRows.forEach((row) => {
    row.classList.toggle("preview", row.dataset.index === String(index));
  });
  updateWhyHighlights();
}

function updateWhyHighlights() {
  state.comparisonRows.forEach((row) => {
    const rowIndex = parseInt(row.dataset.index, 10);
    if (Number.isNaN(rowIndex)) return;
    const match = state.matchups[rowIndex];
    if (!match) return;
    const previewType = getPreviewTypeForRow(rowIndex, match);
    const isChosenRow = state.chosenIndex === rowIndex;
    row.querySelectorAll(".why-line").forEach((line) => {
      const lineType = line.dataset.type;
      const isChosenType = isChosenRow && state.chosenType === lineType;
      const isPreviewType = previewType === lineType;
      line.classList.toggle("used", Boolean(isChosenType));
      line.classList.toggle("previewed", Boolean(isPreviewType));
    });
  });
}

function getPreviewTypeForRow(index, match) {
  if (state.previewIndex === index && state.previewResult) {
    return state.previewResult.type;
  }
  if (state.chosenIndex === index && state.chosenResult) {
    return state.chosenResult.type;
  }
  const fallback = match.bestTypes[0] || match.results[0];
  return fallback ? fallback.type : null;
}

function buildCard(pokemon, { variant }) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  if (variant === "defender") {
    card.classList.add("defender-card");
  }
  const inner = document.createElement("div");
  inner.className = "card-inner";

  const header = document.createElement("div");
  header.className = "card-header";
  const typesStack = document.createElement("div");
  typesStack.className = "card-types";
  pokemon.types.forEach((type) => {
    typesStack.appendChild(createTypeBadge(type));
  });
  header.appendChild(typesStack);

  const art = document.createElement("div");
  art.className = "card-art";
  art.style.setProperty("--card-art-bg", cardGradient(pokemon.types));
  const spriteCandidates = collectSpriteCandidates(pokemon);
  if (spriteCandidates.length) {
    const img = document.createElement("img");
    img.alt = `${pokemon.name} sprite`;
    img.className = "card-sprite";
    img.loading = "lazy";
    img.decoding = "async";
    loadSpriteFromCandidates(img, art, spriteCandidates, initialsFor(pokemon.name));
  } else {
    art.textContent = initialsFor(pokemon.name);
  }

  const body = document.createElement("div");
  body.className = "card-body";
  const nameHeading = document.createElement("h3");
  nameHeading.className = "card-name";
  nameHeading.textContent = pokemon.name;
  body.appendChild(nameHeading);

  inner.appendChild(header);
  inner.appendChild(art);
  inner.appendChild(body);
  card.appendChild(inner);
  return card;
}

function collectSpriteCandidates(pokemon) {
  const candidates = [];
  const seen = new Set();
  const add = (value) => {
    if (!value || seen.has(value)) return;
    seen.add(value);
    candidates.push(value);
  };
  (pokemon.localSprites || []).forEach(add);
  add(pokemon.sprite);
  const mapped = state.spriteMap.get(pokemon.dex);
  add(mapped);
  add(fallbackSpriteUrl(pokemon.dex));
  return candidates;
}

function loadSpriteFromCandidates(img, container, candidates, fallbackText) {
  const unique = [];
  const seen = new Set();
  candidates.forEach((candidate) => {
    if (candidate && !seen.has(candidate)) {
      seen.add(candidate);
      unique.push(candidate);
    }
  });

  if (!unique.length) {
    container.textContent = fallbackText;
    container.classList.remove("with-sprite");
    return;
  }

  let index = 0;
  const tryNext = () => {
    if (index >= unique.length) {
      container.classList.remove("with-sprite");
      if (img.parentElement === container) {
        container.removeChild(img);
      }
      container.textContent = fallbackText;
      return;
    }
    const nextSrc = unique[index++];
    container.textContent = "";
    if (img.parentElement !== container) {
      container.appendChild(img);
    }
    img.src = nextSrc;
  };

  img.addEventListener("error", () => {
    img.removeAttribute("src");
    tryNext();
  });
  img.addEventListener("load", () => {
    container.classList.add("with-sprite");
  });

  tryNext();
}

function buildTablePokemonCell(pokemon) {
  const wrapper = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = pokemon.name;
  wrapper.appendChild(name);
  const stack = document.createElement("div");
  stack.className = "card-types";
  pokemon.types.forEach((type) => stack.appendChild(createTypeBadge(type)));
  wrapper.appendChild(stack);
  return wrapper;
}

function buildWhyLines(match, index) {
  const container = document.createElement("div");
  container.className = "why-lines";
  const previewType = getPreviewTypeForRow(index, match);
  match.results.forEach((result) => {
    const line = document.createElement("div");
    line.className = "why-line";
    line.dataset.type = result.type;
    const typeSpan = document.createElement("span");
    typeSpan.className = "why-type";
    renderTextWithTypeIcons(typeSpan, formatType(result.type));
    line.appendChild(typeSpan);
    const detail = document.createElement("span");
    detail.className = "why-detail";
    const segments = result.perType.map((entry) => {
      const descriptor = verdictText(entry.multiplier);
      return `${formatType(entry.defender)} ×${entry.multiplier} (${descriptor})`;
    });
    renderTextWithTypeIcons(detail, segments.join(" • "));
    line.appendChild(detail);
    if (state.chosenIndex === index && state.chosenType === result.type) {
      line.classList.add("used");
    }
    if (previewType === result.type) {
      line.classList.add("previewed");
    }
    container.appendChild(line);
  });
  return container;
}

function renderTypeBadges(container, types) {
  if (!container) return;
  container.innerHTML = "";
  types.forEach((type) => {
    container.appendChild(createTypeBadge(type));
  });
}

function typeIconCandidates(type) {
  if (!type) return [];
  const canonical = String(type).toLowerCase();
  if (canonical === "none") return [];
  const capitalized = canonical.charAt(0).toUpperCase() + canonical.slice(1);
  const upper = canonical.toUpperCase();
  const nameVariants = new Set([canonical, capitalized, upper]);
  const prefixes = ["Types/", "./Types/", "types/", "./types/"];
  const extensions = [".png", ".PNG", ".webp", ".WEBP"];
  const seen = new Set();
  const candidates = [];

  const addCandidate = (candidate) => {
    if (!candidate) return;
    const normalized = withCacheBust(candidate);
    if (seen.has(normalized)) return;
    seen.add(normalized);
    candidates.push(normalized);
  };

  if (TYPE_ICON_OVERRIDES && TYPE_ICON_OVERRIDES[canonical]) {
    const override = TYPE_ICON_OVERRIDES[canonical];
    if (Array.isArray(override)) {
      override.forEach((entry) => addCandidate(entry));
    } else {
      addCandidate(override);
    }
  }

  prefixes.forEach((prefix) => {
    nameVariants.forEach((name) => {
      extensions.forEach((ext) => {
        addCandidate(`${prefix}${name}${ext}`);
      });
    });
  });

  return candidates;
}

function createTypeBadge(type, options = {}) {
  const { variant = "badge" } = options;
  const span = document.createElement("span");
  const classes = [variant === "inline" ? "type-icon-inline" : "type-badge", "type-no-icon"];
  span.className = classes.join(" ");
  span.dataset.type = type;

  if (variant === "badge") {
    const base = TYPE_COLORS[type] ?? "#9aa5b1";
    const lighter = mixColor(base, "#ffffff", 0.25);
    span.style.background = `linear-gradient(135deg, ${lighter}, ${base})`;
    span.style.color = readableTextColor(base);
  }

  const candidates = typeIconCandidates(type);
  const iconWrap = document.createElement("span");
  iconWrap.className = "type-icon-wrap";
  iconWrap.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.className = "type-icon";
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";

  const fallback = document.createElement("span");
  fallback.className = "type-fallback";
  fallback.textContent = formatType(type).charAt(0);

  const srLabel = document.createElement("span");
  srLabel.className = "sr-only";
  srLabel.textContent = formatType(type);

  if (candidates.length) {
    let index = 0;
    const tryNext = () => {
      if (index >= candidates.length) {
        iconWrap.remove();
        span.classList.remove("type-has-icon");
        span.classList.add("type-no-icon");
        return;
      }
      const nextSrc = candidates[index++];
      img.removeAttribute("src");
      img.src = toAbsoluteUrl(nextSrc);
    };
    img.addEventListener("error", () => {
      tryNext();
    });
    img.addEventListener("load", () => {
      span.classList.add("type-has-icon");
      span.classList.remove("type-no-icon");
    });
    iconWrap.appendChild(img);
    span.appendChild(iconWrap);
    tryNext();
  }

  span.appendChild(fallback);
  span.appendChild(srLabel);
  return span;
}

function cardGradient(types) {
  const base = TYPE_COLORS[types[0]] ?? "#1d4e89";
  const second = types[1] ? TYPE_COLORS[types[1]] ?? base : mixColor(base, "#000000", 0.35);
  return `linear-gradient(135deg, ${base}, ${second})`;
}

function initialsFor(name) {
  return name
    .split(/\s|\(|\)|-/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function updateScorebar() {
  if (elements.score) {
    elements.score.textContent = `${state.score}/${state.rounds}`;
  }
  if (elements.streak) {
    elements.streak.textContent = String(state.streak);
  }
}

function updateAnnouncement(message) {
  if (elements.announcement) {
    elements.announcement.textContent = message;
  }
}

function closeModal(focusNext) {
  if (elements.modalBackdrop) {
    elements.modalBackdrop.hidden = true;
  }
  if (elements.closeModal) {
    elements.closeModal.disabled = true;
  }
  if (elements.nextRound) {
    elements.nextRound.disabled = true;
  }
  if (focusNext && elements.nextBtn) {
    elements.nextBtn.focus();
  }
}

function verdictText(multiplier) {
  if (multiplier >= 2) return "Super-effective";
  if (multiplier === 1) return "Neutral";
  if (multiplier === 0.5 || multiplier === 0.25) return "Not very effective";
  if (multiplier === 0) return "No effect";
  return multiplier > 1 ? "Super-effective" : "Not very effective";
}

function verdictClassName(multiplier) {
  if (multiplier >= 2) return "good";
  if (multiplier === 1 || multiplier === 0.5) return "mid";
  return "bad";
}

function normalizeMultiplier(value) {
  const targets = [0, 0.25, 0.5, 1, 2, 4];
  let best = targets[0];
  let bestDiff = Math.abs(value - best);
  for (let i = 1; i < targets.length; i += 1) {
    const diff = Math.abs(value - targets[i]);
    if (diff < bestDiff) {
      best = targets[i];
      bestDiff = diff;
    }
  }
  return best;
}

function formatList(items) {
  if (!items || items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const allButLast = items.slice(0, -1).join(", ");
  const last = items[items.length - 1];
  return `${allButLast}, and ${last}`;
}

function formatType(type) {
  if (!type) return "None";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

const TYPE_DISPLAY_TO_CANONICAL = TYPE_LIST.reduce((acc, type) => {
  acc[formatType(type)] = type;
  return acc;
}, {});

const TYPE_NAME_REGEX = new RegExp(
  `\\b(${TYPE_LIST.map((type) => formatType(type)).join("|")})\\b`,
  "g"
);

function renderTextWithTypeIcons(element, text) {
  if (!element) return;
  element.innerHTML = "";
  if (!text) return;

  TYPE_NAME_REGEX.lastIndex = 0;
  let lastIndex = 0;
  let match;
  while ((match = TYPE_NAME_REGEX.exec(text)) !== null) {
    const preceding = text.slice(lastIndex, match.index);
    if (preceding) {
      element.append(preceding);
    }
    const display = match[1];
    const canonical = TYPE_DISPLAY_TO_CANONICAL[display] || display.toLowerCase();
    if (canonical && canonical !== "none") {
      element.appendChild(createTypeBadge(canonical, { variant: "inline" }));
    } else {
      element.append(display);
    }
    lastIndex = TYPE_NAME_REGEX.lastIndex;
  }

  if (lastIndex < text.length) {
    element.append(text.slice(lastIndex));
  }
}

function readableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a253a" : "#fdfdfd";
}

function mixColor(hexA, hexB, ratio) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const mix = {
    r: Math.round(a.r * (1 - ratio) + b.r * ratio),
    g: Math.round(a.g * (1 - ratio) + b.g * ratio),
    b: Math.round(a.b * (1 - ratio) + b.b * ratio),
  };
  return rgbToHex(mix);
}

function hexToRgb(hex) {
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((component) => component.toString(16).padStart(2, "0"))
    .join("")}`;
}

function nearlyEqual(a, b) {
  return Math.abs(a - b) < 0.0001;
}

function parsePokemonData(raw) {
  return raw
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",").map((part) => part.trim());
      const name = parts[0];
      const dex = parseInt(parts[1], 10);
      const typeOne = normalizeType(parts[2]);
      const typeTwo = normalizeType(parts[3]);
      const types = [];
      if (typeOne && typeOne !== "none") {
        types.push(typeOne);
      }
      if (typeTwo && typeTwo !== "none") {
        types.push(typeTwo);
      }
      if (types.length === 0) {
        types.push("normal");
      }
      return {
        name,
        dex,
        types,
        sprite: null,
        localSprites: [],
      };
    });
}

function normalizeType(value) {
  if (!value) return null;
  return value.toLowerCase();
}

function applyLocalSprites(roster) {
  roster.forEach((pokemon) => {
    const candidates = buildLocalSpriteCandidates(pokemon.dex);
    pokemon.localSprites = candidates;
    if (!pokemon.sprite && candidates.length) {
      [pokemon.sprite] = candidates;
    }
  });
}

function buildLocalSpriteCandidates(dex) {
  if (!Number.isInteger(dex) || dex <= 0) {
    return [];
  }
  const ids = new Set();
  const raw = String(dex);
  ids.add(raw);
  ids.add(raw.padStart(3, "0"));
  ids.add(raw.padStart(4, "0"));
  ids.add(raw.padStart(5, "0"));
  const candidates = [];
  ids.forEach((id) => {
    candidates.push(`${LOCAL_SPRITE_DIRECTORY}/${id}${LOCAL_SPRITE_EXTENSION}`);
  });
  return candidates;
}

async function primeSpriteAtlas() {
  if (typeof fetch !== "function") {
    return;
  }

  const needsRemote = ROSTER.some(
    (pokemon) => !pokemon.localSprites || pokemon.localSprites.length === 0
  );
  if (!needsRemote) {
    state.spriteMap = new Map();
    return;
  }

  let resolvedMap = null;
  for (const source of SPRITE_SOURCES) {
    try {
      const map = await loadSpriteMap(source);
      if (!resolvedMap) {
        resolvedMap = map;
      }
      if (map.size) {
        resolvedMap = map;
        break;
      }
    } catch (error) {
      console.warn(`Failed to load sprite atlas from ${source}`, error);
    }
  }

  state.spriteMap = resolvedMap || new Map();

  ROSTER.forEach((pokemon) => {
    if (!pokemon.sprite) {
      const mappedSprite = state.spriteMap.get(pokemon.dex);
      if (mappedSprite) {
        pokemon.sprite = mappedSprite;
      } else {
        const fallback = fallbackSpriteUrl(pokemon.dex);
        if (fallback) {
          pokemon.sprite = fallback;
        }
      }
    }
  });
}

async function loadSpriteMap(url) {
  const response = await fetch(url, { cache: "no-store", mode: "cors" });
  if (!response.ok) {
    throw new Error(`Sprite atlas request failed with status ${response.status}`);
  }
  const text = await response.text();
  return parseSpriteText(text, response.url || url);
}

function fallbackSpriteUrl(dex) {
  if (!Number.isInteger(dex) || dex <= 0) {
    return "";
  }
  return `${FALLBACK_SPRITE_BASE}${dex}.png`;
}

function parseSpriteText(text, baseUrl) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return new Map();
  }
  if (trimmed.startsWith("<")) {
    const htmlMap = parseSpriteHtml(trimmed, baseUrl);
    if (htmlMap.size > 0) {
      return htmlMap;
    }
  }
  return parseSpriteCsv(trimmed, baseUrl);
}

function parseSpriteHtml(html, baseUrl) {
  const map = new Map();
  if (typeof DOMParser !== "function") {
    return map;
  }
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const rows = Array.from(doc.querySelectorAll("table tr"));
    if (!rows.length) {
      return map;
    }

    let headerCells = null;
    let dexIndex = 0;
    let urlIndex = 1;
    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      if (!cells.length) {
        return;
      }
      if (!headerCells) {
        headerCells = cells.map((cell) => cell.textContent.trim().toLowerCase());
        dexIndex = resolveIndex(headerCells, "pokedex", 0);
        urlIndex = resolveIndex(headerCells, "sprite", Math.max(headerCells.length - 1, 1));
        return;
      }
      const dexText = cells[dexIndex] ? cells[dexIndex].textContent.trim() : "";
      const urlCell = cells[urlIndex];
      const image = urlCell ? urlCell.querySelector("img") : null;
      const rawUrl = image ? image.getAttribute("src") : urlCell?.textContent.trim();
      const spriteUrl = normalizeSpriteUrl(rawUrl, baseUrl);
      const dex = parseInt(dexText, 10);
      if (!Number.isInteger(dex) || !spriteUrl) {
        return;
      }
      map.set(dex, spriteUrl);
    });
  } catch (error) {
    console.warn("Failed to parse sprite HTML", error);
  }
  return map;
}

function parseSpriteCsv(text, baseUrl) {
  const map = new Map();
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) {
    return map;
  }
  const header = lines.shift();
  const columns = header.split(",").map((col) => col.trim().toLowerCase());
  const dexIndex = resolveIndex(columns, "pokedex", 0);
  const urlIndex = resolveIndex(columns, "sprite", Math.max(columns.length - 1, 1));
  lines.forEach((line) => {
    if (!line) return;
    const parts = line.split(",");
    const dexValue = parts[dexIndex] ?? parts[0];
    const urlValue = parts[urlIndex] ?? parts[parts.length - 1];
    const dex = parseInt(dexValue, 10);
    const spriteUrl = normalizeSpriteUrl(urlValue ? urlValue.trim() : "", baseUrl);
    if (Number.isInteger(dex) && spriteUrl) {
      map.set(dex, spriteUrl);
    }
  });
  return map;
}

function resolveIndex(columns, keyword, fallback) {
  const index = columns.findIndex((col) => col.includes(keyword));
  return index >= 0 ? index : fallback;
}

function normalizeSpriteUrl(rawUrl, baseUrl) {
  if (!rawUrl) {
    return "";
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return "";
  }
  try {
    const resolved = new URL(trimmed, baseUrl);
    return resolved.href;
  } catch (error) {
    return trimmed;
  }
}
