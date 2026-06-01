// ── Types ──────────────────────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard";
export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type SpellingWord = {
  word: string;
  hint: string;
  sentence: string;
};

export type Lesson = {
  id: string;
  title: string;
  emoji: string;
  difficulty: Difficulty;
  words: SpellingWord[];
  starsToUnlock: number;
  // New lesson content
  concept: string;      // What spelling rule/concept this teaches
  videoEmoji: string;   // Big emoji for the "video" lesson screen
  explanation: string;  // Simple explanation of the concept
  trick: string;        // Memory trick to help remember
  examples: string[];   // Example words showing the concept
};

export type AvatarPart = "hat" | "face" | "shirt" | "accessory";
export type Gender = "girl" | "boy";

export type ShopItem = {
  id: string;
  name: string;
  emoji: string;
  part: AvatarPart;
  price: number;
};

// ── Starter Avatars (free, pick one during setup) ──────────────────

export type StarterAvatar = {
  id: string;
  name: string;
  hat: string;
  face: string;
  shirt: string;
  accessory: string;
};

export const STARTER_AVATARS: StarterAvatar[] = [
  { id: "star-sweet", name: "Sweetie", hat: "🎀", face: "🥺", shirt: "👗", accessory: "🐣" },
  { id: "star-sunny", name: "Sunny", hat: "🌻", face: "😊", shirt: "🧡", accessory: "🐰" },
  { id: "star-dreamy", name: "Dreamy", hat: "🦋", face: "🥺", shirt: "💜", accessory: "🦄" },
];

// ── Inventory Entry ────────────────────────────────────────────────

export type InventoryEntry = {
  type: "lesson" | "game" | "quiz" | "battle";
  title: string;
  score: number;
  total: number;
  starsEarned: number;
  date: string;
};

// ── Grade-Level Word Banks ─────────────────────────────────────────
// Words organized by grade level. The quiz pulls from these to test
// the student, then lessons and games are built from their level.

type TopicData = {
  topic: string;
  emoji: string;
  concept: string;
  videoEmoji: string;
  explanation: string;
  trick: string;
  examples: string[];
  words: SpellingWord[];
};

export const GRADE_WORDS: Record<Grade, TopicData[]> = {
  1: [
    {
      topic: "Sound It Out! (C-A-T)",
      emoji: "🐾",
      concept: "CVC Words (Consonant-Vowel-Consonant)",
      videoEmoji: "🎬",
      explanation: "CVC words have 3 letters: a consonant, then a vowel (a, e, i, o, u), then another consonant. Like C-A-T! Sound out each letter!",
      trick: "Tap it out! Clap once for each sound. C 👏 A 👏 T 👏 = CAT!",
      examples: ["CAT", "DOG", "PIG", "HEN"],
      words: [
        { word: "CAT", hint: "A furry pet that purrs", sentence: "The ___ sat on the mat." },
        { word: "DOG", hint: "A pet that barks", sentence: "My ___ loves to play fetch." },
        { word: "PIG", hint: "A pink farm animal", sentence: "The ___ rolled in the mud." },
        { word: "HEN", hint: "A female chicken", sentence: "The ___ laid an egg." },
        { word: "BUG", hint: "A tiny crawling creature", sentence: "A ___ sat on the leaf." },
        { word: "FOX", hint: "A clever orange animal", sentence: "The ___ ran through the woods." },
        { word: "ANT", hint: "A tiny insect that works in groups", sentence: "An ___ carried a crumb." },
        { word: "BAT", hint: "An animal that flies at night", sentence: "The ___ hung from the tree." },
      ],
    },
    {
      topic: "Short Vowel Sounds (A, E, U)",
      emoji: "🏠",
      concept: "Short Vowel Sounds",
      videoEmoji: "🏡",
      explanation: "Short vowels make quick sounds! A says 'ah' like in BED. U says 'uh' like in CUP. Listen for the short vowel in the middle!",
      trick: "Short vowels are shy - they only say their short sound, not their name!",
      examples: ["BED", "CUP", "RUG", "MOP"],
      words: [
        { word: "BED", hint: "Where you sleep", sentence: "I made my ___ this morning." },
        { word: "CUP", hint: "You drink from this", sentence: "She filled her ___ with milk." },
        { word: "RUG", hint: "A soft floor cover", sentence: "The ___ is soft and warm." },
        { word: "MOP", hint: "Used to clean floors", sentence: "Dad used the ___ to clean." },
        { word: "TUB", hint: "Where you take a bath", sentence: "The ___ was full of bubbles." },
        { word: "PAN", hint: "Used for cooking food", sentence: "Mom put the ___ on the stove." },
        { word: "JAR", hint: "A glass container", sentence: "The ___ was full of cookies." },
        { word: "FAN", hint: "Keeps you cool", sentence: "Turn on the ___ please." },
      ],
    },
    {
      topic: "First Letter Sounds (B, R, G)",
      emoji: "🌈",
      concept: "Beginning Sounds",
      videoEmoji: "🎨",
      explanation: "Every word starts with a sound! Listen to the FIRST sound: R-ed starts with R, B-lue starts with B. Say the first sound out loud!",
      trick: "Touch your lips and feel the first sound. What letter makes that sound?",
      examples: ["RED", "BLUE", "PINK", "GREEN"],
      words: [
        { word: "RED", hint: "The color of strawberries", sentence: "She wore a ___ dress." },
        { word: "SUN", hint: "The bright star in the sky", sentence: "The ___ shines every day." },
        { word: "HAT", hint: "You wear it on your head", sentence: "She put on her ___." },
        { word: "BOX", hint: "A container with four sides", sentence: "The ___ was full of toys." },
        { word: "MAP", hint: "Shows you where places are", sentence: "We used a ___ to find the park." },
        { word: "BUS", hint: "A big vehicle for passengers", sentence: "The ___ took us to school." },
        { word: "NET", hint: "Used to catch things", sentence: "She caught a fish in the ___." },
        { word: "TOP", hint: "The highest point", sentence: "He climbed to the ___." },
      ],
    },
  ],
  2: [
    {
      topic: "Long Vowels (EE, AI, EA)",
      emoji: "🌿",
      concept: "Long Vowel Sounds",
      videoEmoji: "🌲",
      explanation: "Long vowels say their name! The E in TREE says 'ee'. The A in RAIN says 'ay'. When a vowel says its name, it's a long vowel!",
      trick: "Long vowels are brave - they shout their own name! A says AY, E says EE, I says EYE!",
      examples: ["TREE", "RAIN", "SEED", "BIRD"],
      words: [
        { word: "TREE", hint: "A tall plant with a trunk", sentence: "The ___ had green leaves." },
        { word: "BIRD", hint: "An animal with feathers that flies", sentence: "A ___ sang in the tree." },
        { word: "FISH", hint: "An animal that lives in water", sentence: "The ___ swam in the pond." },
        { word: "FROG", hint: "A green animal that jumps", sentence: "The ___ hopped onto the lily pad." },
        { word: "DUCK", hint: "A bird that swims and goes quack", sentence: "The ___ splashed in the lake." },
        { word: "SEED", hint: "You plant this to grow flowers", sentence: "She planted a ___ in the soil." },
        { word: "RAIN", hint: "Water falling from the sky", sentence: "The ___ made puddles everywhere." },
        { word: "POND", hint: "A small body of water", sentence: "Frogs live in the ___." },
      ],
    },
    {
      topic: "Last Letter Sounds (K, P, N)",
      emoji: "🍎",
      concept: "Ending Sounds",
      videoEmoji: "🍕",
      explanation: "Listen to the LAST sound of each word! CAKE ends with K, MILK ends with K too! The ending sound helps you spell the last letter.",
      trick: "Stretch the word out slooowly and listen to what sound comes last!",
      examples: ["CAKE", "MILK", "SOUP", "CORN"],
      words: [
        { word: "CAKE", hint: "A sweet treat for birthdays", sentence: "We baked a ___ for the party." },
        { word: "MILK", hint: "A white drink from cows", sentence: "She poured ___ on her cereal." },
        { word: "RICE", hint: "Small white grains you cook", sentence: "We had ___ with dinner." },
        { word: "SOUP", hint: "A hot liquid food", sentence: "The ___ was warm and tasty." },
        { word: "PLUM", hint: "A small purple fruit", sentence: "She bit into a juicy ___." },
        { word: "CORN", hint: "A yellow vegetable on a cob", sentence: "We ate ___ at the barbecue." },
        { word: "BEAN", hint: "A small seed you can eat", sentence: "She ate every ___ on her plate." },
        { word: "PEAR", hint: "A green fruit shaped like a bell", sentence: "The ___ was sweet and crunchy." },
      ],
    },
    {
      topic: "Letter Buddies (BL, DR, PL)",
      emoji: "📚",
      concept: "Blends (Two Letters Together)",
      videoEmoji: "✏️",
      explanation: "Some words start with TWO consonants blended together! BL in BLUE, DR in DRAW, PL in PLAY. Say them fast together!",
      trick: "Blends are best friends - they always stick together! BL, DR, PL, SN, TR!",
      examples: ["BOOK", "DRAW", "PLAY", "SING"],
      words: [
        { word: "BOOK", hint: "You read the pages of this", sentence: "She read a ___ at the library." },
        { word: "DESK", hint: "You sit at this to do work", sentence: "His ___ was neat and tidy." },
        { word: "BELL", hint: "It rings at the end of class", sentence: "The ___ rang for lunch." },
        { word: "SING", hint: "Make music with your voice", sentence: "We ___ songs in music class." },
        { word: "DRAW", hint: "Make a picture with a pencil", sentence: "I like to ___ animals." },
        { word: "READ", hint: "Look at words and understand them", sentence: "She can ___ chapter books now." },
        { word: "PLAY", hint: "Have fun doing games", sentence: "They ___ at recess every day." },
        { word: "MATH", hint: "A subject about numbers", sentence: "We did ___ problems today." },
      ],
    },
  ],
  3: [
    {
      topic: "Magic E (Makes Vowels Talk!)",
      emoji: "🌊",
      concept: "Silent E (Magic E)",
      videoEmoji: "🧙",
      explanation: "When a word ends in E, that E is silent but it makes the other vowel say its name! WHALE: the E is quiet but makes the A say 'AY'!",
      trick: "Silent E is like a magic wand ✨ - it doesn't talk, but it changes the vowel's sound!",
      examples: ["WHALE", "COAST", "SHORE", "WAVE"],
      words: [
        { word: "OCEAN", hint: "A very large body of salt water", sentence: "The ___ waves crashed on the shore." },
        { word: "BEACH", hint: "Sandy area next to the sea", sentence: "We built sandcastles at the ___." },
        { word: "WHALE", hint: "The biggest animal in the sea", sentence: "The ___ jumped out of the water." },
        { word: "SHELL", hint: "A hard covering from sea creatures", sentence: "She found a pretty ___ in the sand." },
        { word: "CORAL", hint: "Colorful underwater structures", sentence: "The ___ reef was full of fish." },
        { word: "SHARK", hint: "A large fish with sharp teeth", sentence: "The ___ swam under the boat." },
        { word: "ISLAND", hint: "Land surrounded by water", sentence: "They found a secret ___ in the sea." },
        { word: "COAST", hint: "Where the land meets the sea", sentence: "We drove along the ___." },
      ],
    },
    {
      topic: "Vowel Teams (EA, OA, AI)",
      emoji: "🚀",
      concept: "Vowel Teams (Two Vowels Together)",
      videoEmoji: "🌟",
      explanation: "When two vowels walk together, the first one does the talking! EA in EARTH, OA in SOLAR. The first vowel says its name, the second is quiet.",
      trick: "When two vowels go walking, the first one does the talking! 🚶‍♂️🚶",
      examples: ["PLANET", "EARTH", "SOLAR", "LUNAR"],
      words: [
        { word: "PLANET", hint: "A large object that orbits a star", sentence: "Earth is our home ___." },
        { word: "ROCKET", hint: "A vehicle that flies into space", sentence: "The ___ launched into the sky." },
        { word: "ORBIT", hint: "The path around a planet", sentence: "The moon is in ___ around Earth." },
        { word: "COMET", hint: "An icy object with a glowing tail", sentence: "The ___ streaked across the night sky." },
        { word: "LUNAR", hint: "Related to the moon", sentence: "We watched the ___ eclipse." },
        { word: "SOLAR", hint: "Related to the sun", sentence: "The ___ system has eight planets." },
        { word: "STARS", hint: "Bright dots in the night sky", sentence: "The ___ twinkled above us." },
        { word: "EARTH", hint: "The planet we live on", sentence: "___ is the third planet from the sun." },
      ],
    },
    {
      topic: "Special Pairs (SH, CH, TH)",
      emoji: "🌦️",
      concept: "Digraphs (SH, CH, TH)",
      videoEmoji: "⛈️",
      explanation: "Digraphs are two letters that make ONE new sound! SH says 'shh', CH says 'ch', TH says 'th'. They team up!",
      trick: "SH says 'be quiet! shhh!' CH says 'choo choo!' TH sticks out its tongue! 😛",
      examples: ["CLOUD", "STORM", "FROST", "THUNDER"],
      words: [
        { word: "CLOUD", hint: "White fluffy things in the sky", sentence: "A ___ shaped like a bunny floated past." },
        { word: "STORM", hint: "Bad weather with wind and rain", sentence: "The ___ lasted all night." },
        { word: "FROST", hint: "Thin ice on cold mornings", sentence: "The ___ covered the windows." },
        { word: "SUNNY", hint: "When the sun is shining bright", sentence: "It was a ___ day at the park." },
        { word: "WINDY", hint: "When lots of air is moving", sentence: "The ___ day blew her hat off." },
        { word: "FOGGY", hint: "When you can't see far because of mist", sentence: "The ___ morning made driving hard." },
        { word: "FLOOD", hint: "When water covers dry land", sentence: "The ___ damaged many homes." },
        { word: "BREEZE", hint: "A gentle, light wind", sentence: "A cool ___ blew through the window." },
      ],
    },
  ],
  4: [
    {
      topic: "Word Endings (-ER, -EST, -LY)",
      emoji: "🗺️",
      concept: "Suffixes (-ER, -EST, -LY)",
      videoEmoji: "🗺️",
      explanation: "Suffixes are endings added to words! -ER means 'more' (bigger), -EST means 'most' (biggest), -LY means 'in a way' (quickly).",
      trick: "Suffixes are like tails on a dog 🐕 - they're added to the end and change the meaning!",
      examples: ["DESERT", "GLACIER", "VALLEY", "CANYON"],
      words: [
        { word: "DESERT", hint: "A dry sandy place with little rain", sentence: "The ___ gets very hot during the day." },
        { word: "FOREST", hint: "A large area full of trees", sentence: "The ___ was dark and quiet." },
        { word: "VALLEY", hint: "Low land between hills or mountains", sentence: "The ___ was filled with green grass." },
        { word: "CANYON", hint: "A deep narrow valley with steep sides", sentence: "The ___ was carved by a river." },
        { word: "GLACIER", hint: "A huge slow-moving river of ice", sentence: "The ___ melted very slowly." },
        { word: "VOLCANO", hint: "A mountain that can erupt with lava", sentence: "The ___ erupted with hot lava." },
        { word: "PRAIRIE", hint: "A large flat area of grassland", sentence: "Buffalo roamed the ___." },
        { word: "PLATEAU", hint: "A flat area of land high up", sentence: "The ___ had amazing views." },
      ],
    },
    {
      topic: "Word Beginnings (UN-, RE-, PRE-)",
      emoji: "🔬",
      concept: "Prefixes (UN-, RE-, PRE-)",
      videoEmoji: "🔬",
      explanation: "Prefixes go at the START of words! UN- means 'not' (unhappy), RE- means 'again' (redo), PRE- means 'before' (preview).",
      trick: "Prefixes are like hats 🎩 - they go on top (the start) and change the word's meaning!",
      examples: ["ENERGY", "MAGNET", "INSECT", "OXYGEN"],
      words: [
        { word: "ENERGY", hint: "The power to do work or make things move", sentence: "Solar panels create ___." },
        { word: "MAGNET", hint: "Attracts metal objects", sentence: "The ___ stuck to the fridge." },
        { word: "LIQUID", hint: "A state of matter that flows", sentence: "Water is a ___." },
        { word: "INSECT", hint: "A small creature with six legs", sentence: "A ladybug is an ___." },
        { word: "MUSCLE", hint: "Body tissue that helps you move", sentence: "Exercise makes your ___ strong." },
        { word: "FOSSIL", hint: "Remains of ancient animals in rock", sentence: "They found a dinosaur ___." },
        { word: "OXYGEN", hint: "The gas we breathe", sentence: "Plants give us ___." },
        { word: "CARBON", hint: "An element found in all living things", sentence: "___ dioxide is a greenhouse gas." },
      ],
    },
    {
      topic: "Double Letters (TT, SS, LL)",
      emoji: "🏛️",
      concept: "Double Consonants",
      videoEmoji: "🏛️",
      explanation: "Some words have double consonants in the middle! BATTLE has TT, CASTLE has no double but KNIGHT has a silent K! Watch for tricky doubles.",
      trick: "Double letters are twins! 👯 They look the same and always stand together in a word.",
      examples: ["CASTLE", "BATTLE", "KNIGHT", "COLONY"],
      words: [
        { word: "CASTLE", hint: "A large stone building where kings lived", sentence: "The ___ had a tall tower." },
        { word: "KNIGHT", hint: "A warrior who wore armor", sentence: "The ___ rode a white horse." },
        { word: "EMPIRE", hint: "A large area ruled by one leader", sentence: "The Roman ___ was very powerful." },
        { word: "COLONY", hint: "A territory controlled by another country", sentence: "The ___ declared independence." },
        { word: "BATTLE", hint: "A fight between armies", sentence: "The ___ lasted three days." },
        { word: "TREATY", hint: "A formal agreement between nations", sentence: "They signed a peace ___." },
        { word: "VOYAGE", hint: "A long journey by sea", sentence: "The ___ across the ocean took months." },
        { word: "ANCIENT", hint: "Very very old, from long ago", sentence: "The ___ ruins were thousands of years old." },
      ],
    },
  ],
  5: [
    {
      topic: "Breaking Words Apart (Syllables)",
      emoji: "🌍",
      concept: "Syllables (Breaking Words Apart)",
      videoEmoji: "🌍",
      explanation: "Big words are made of small parts called syllables! CLI-MATE has 2 syllables, HAB-I-TAT has 3. Clap each part!",
      trick: "Put your hand under your chin. Every time your chin drops, that's a syllable! 🤚",
      examples: ["CLIMATE", "RECYCLE", "HABITAT", "EROSION"],
      words: [
        { word: "CLIMATE", hint: "The usual weather in a place over time", sentence: "The ___ is getting warmer." },
        { word: "DROUGHT", hint: "A long time without rain", sentence: "The ___ dried up the rivers." },
        { word: "RECYCLE", hint: "Turn waste into something new", sentence: "We ___ plastic bottles." },
        { word: "HABITAT", hint: "The natural home of an animal", sentence: "The forest is a bear's ___." },
        { word: "EROSION", hint: "When soil is worn away by water or wind", sentence: "The ___ changed the coastline." },
        { word: "EXTINCT", hint: "When a species no longer exists", sentence: "Dinosaurs are ___." },
        { word: "COMPOST", hint: "Decayed plants used as fertilizer", sentence: "We put food scraps in the ___." },
        { word: "POLLUTION", hint: "Harmful substances in the environment", sentence: "Air ___ can cause health problems." },
      ],
    },
    {
      topic: "Two Words in One (Compound Words)",
      emoji: "💻",
      concept: "Compound Words",
      videoEmoji: "💻",
      explanation: "Compound words are two small words stuck together! KEY + BOARD = KEYBOARD, DOWN + LOAD = DOWNLOAD. Find the two words inside!",
      trick: "Compound words are word sandwiches 🥪 - two words smooshed into one!",
      examples: ["SOFTWARE", "DOWNLOAD", "KEYBOARD", "WEBSITE"],
      words: [
        { word: "SOFTWARE", hint: "Programs that run on a computer", sentence: "She learned to write ___." },
        { word: "DOWNLOAD", hint: "Get a file from the internet", sentence: "I need to ___ the update." },
        { word: "KEYBOARD", hint: "You type on this", sentence: "He pressed a key on the ___." },
        { word: "WEBSITE", hint: "A page you visit online", sentence: "She built her own ___." },
        { word: "DIGITAL", hint: "Using computer technology", sentence: "We live in a ___ world." },
        { word: "BATTERY", hint: "Stores power for devices", sentence: "My phone ___ is low." },
        { word: "NETWORK", hint: "Connected computers", sentence: "The Wi-Fi ___ was fast." },
        { word: "PROGRAM", hint: "Instructions for a computer", sentence: "She wrote a computer ___." },
      ],
    },
    {
      topic: "Tricky Endings (-TION, -SION)",
      emoji: "📖",
      concept: "Tricky Spellings (-TION, -SION)",
      videoEmoji: "📖",
      explanation: "The sound 'shun' can be spelled -TION or -SION! FICTION ends in -TION, VISION ends in -SION. Most use -TION!",
      trick: "When you hear 'shun' at the end, try -TION first! It's the most common spelling. 📝",
      examples: ["FICTION", "CHAPTER", "JOURNAL", "PUBLISH"],
      words: [
        { word: "CHAPTER", hint: "A section of a book", sentence: "Read the first ___ tonight." },
        { word: "FICTION", hint: "A made-up story", sentence: "She loves reading ___ books." },
        { word: "VILLAIN", hint: "The bad character in a story", sentence: "The ___ had an evil plan." },
        { word: "MYSTERY", hint: "A story about solving a puzzle", sentence: "The ___ kept us guessing." },
        { word: "JOURNAL", hint: "A book for writing your thoughts", sentence: "She wrote in her ___ every day." },
        { word: "PUBLISH", hint: "Make a book available to buy", sentence: "The author wanted to ___ her novel." },
        { word: "DIALOGUE", hint: "Conversation between characters", sentence: "The ___ in the play was funny." },
        { word: "NARRATOR", hint: "The person telling the story", sentence: "The ___ had a deep voice." },
      ],
    },
  ],
  6: [
    {
      topic: "Word Roots (Greek & Latin)",
      emoji: "⚛️",
      concept: "Greek & Latin Roots",
      videoEmoji: "⚛️",
      explanation: "Many big words come from Greek and Latin roots! 'MOLE' in MOLECULE means 'mass', 'ASTRO' in ASTEROID means 'star'. Learn the root, spell the word!",
      trick: "Roots are like word DNA 🧬 - once you know the root, you can spell lots of words with it!",
      examples: ["MOLECULE", "ASTEROID", "SPECTRUM", "PARTICLE"],
      words: [
        { word: "MOLECULE", hint: "The smallest unit of a substance", sentence: "A water ___ has two hydrogen atoms." },
        { word: "ASTEROID", hint: "A rocky object orbiting the sun", sentence: "The ___ passed close to Earth." },
        { word: "BACTERIA", hint: "Tiny single-celled organisms", sentence: "___ can be helpful or harmful." },
        { word: "EQUATION", hint: "A mathematical statement with an equals sign", sentence: "She solved the ___ quickly." },
        { word: "SPECTRUM", hint: "The range of colors in light", sentence: "A prism splits light into a ___." },
        { word: "PARTICLE", hint: "A tiny piece of matter", sentence: "Each ___ was too small to see." },
        { word: "CATALYST", hint: "Something that speeds up a reaction", sentence: "The ___ made the experiment work faster." },
        { word: "FREQUENCY", hint: "How often something happens", sentence: "The radio ___ was 98.5 FM." },
      ],
    },
    {
      topic: "Sneaky Silent Letters (K, W, B)",
      emoji: "🌏",
      concept: "Silent Letters (K, W, B, G)",
      videoEmoji: "🌏",
      explanation: "Some letters are sneaky and stay silent! The W in WRITE, the K in KNOW, the B in CLIMB. They're there but you don't hear them!",
      trick: "Silent letters are invisible ninjas 🥷 - they hide in words but you have to write them!",
      examples: ["DEMOCRACY", "LANGUAGE", "HERITAGE", "RELIGION"],
      words: [
        { word: "DEMOCRACY", hint: "A government where people vote", sentence: "___ gives everyone a voice." },
        { word: "HERITAGE", hint: "Traditions passed down through generations", sentence: "They celebrated their cultural ___." },
        { word: "LANGUAGE", hint: "A system of communication", sentence: "She learned a new ___." },
        { word: "RELIGION", hint: "A system of beliefs and worship", sentence: "Many people practice their ___." },
        { word: "TRADITION", hint: "A custom handed down over time", sentence: "The holiday ___ was special." },
        { word: "CONTINENT", hint: "One of seven large land masses", sentence: "Africa is a large ___." },
        { word: "IMMIGRANT", hint: "Someone who moves to a new country", sentence: "The ___ started a new life." },
        { word: "CIVILIZE", hint: "To develop a society with culture", sentence: "Ancient peoples helped ___ the world." },
      ],
    },
    {
      topic: "Sound-Alike Words (Homophones)",
      emoji: "🎨",
      concept: "Homophones (Sound-Alike Words)",
      videoEmoji: "🎨",
      explanation: "Homophones sound the same but are spelled differently! THERE/THEIR/THEY'RE, HEAR/HERE. Context tells you which spelling to use!",
      trick: "Homophones are word twins 👯 - they sound alike but dress differently (different spelling)!",
      examples: ["SYMPHONY", "PORTRAIT", "GALLERY", "AUDIENCE"],
      words: [
        { word: "SYMPHONY", hint: "A long piece of music for an orchestra", sentence: "The ___ was beautiful." },
        { word: "SCULPTURE", hint: "Art made by shaping materials", sentence: "The ___ was carved from marble." },
        { word: "PORTRAIT", hint: "A painting or photo of a person", sentence: "The artist painted a ___ of the queen." },
        { word: "CERAMICS", hint: "Art made from baked clay", sentence: "She made a bowl in ___ class." },
        { word: "ARCHITECT", hint: "A person who designs buildings", sentence: "The ___ drew plans for the house." },
        { word: "REHEARSAL", hint: "Practicing before a show", sentence: "The play ___ went well." },
        { word: "GALLERY", hint: "A place that displays art", sentence: "We visited the art ___." },
        { word: "AUDIENCE", hint: "People watching a performance", sentence: "The ___ clapped loudly." },
      ],
    },
  ],
};

// ── Quiz Words ─────────────────────────────────────────────────────
// The quiz tests spelling rules from the 3 grades around each level.
// Each word demonstrates a specific spelling rule/pattern.

export type QuizWord = SpellingWord & {
  rule: string; // The spelling rule this word tests
};

export const QUIZ_WORDS: Record<Grade, QuizWord[]> = {
  1: [
    // Grade 1 rules: CVC words, short vowels, beginning sounds
    { word: "CAT", hint: "CVC word: C-A-T", rule: "CVC Pattern", sentence: "The ___ sat on the mat." },
    { word: "RUN", hint: "Short U sound in the middle", rule: "Short Vowel U", sentence: "She likes to ___." },
    { word: "BIG", hint: "Starts with the B sound", rule: "Beginning Sound B", sentence: "The elephant is ___." },
    { word: "SIT", hint: "Short I sound: s-i-t", rule: "Short Vowel I", sentence: "Please ___ down." },
    { word: "MOP", hint: "Short O sound in the middle", rule: "Short Vowel O", sentence: "Use the ___ to clean." },
    { word: "RED", hint: "Starts with the R sound", rule: "Beginning Sound R", sentence: "She wore a ___ dress." },
    { word: "HOP", hint: "CVC word: H-O-P", rule: "CVC Pattern", sentence: "The bunny likes to ___." },
    { word: "BED", hint: "Short E sound: b-e-d", rule: "Short Vowel E", sentence: "I made my ___ this morning." },
  ],
  2: [
    // Grade 2 rules: long vowels, ending sounds, blends
    { word: "TREE", hint: "Long E sound: EE says 'ee'", rule: "Long Vowel EE", sentence: "The ___ had green leaves." },
    { word: "MILK", hint: "Ends with the K sound", rule: "Ending Sound K", sentence: "She poured ___ on her cereal." },
    { word: "PLAY", hint: "Starts with PL blend", rule: "Blend PL", sentence: "They ___ at recess every day." },
    { word: "FROG", hint: "Starts with FR blend", rule: "Blend FR", sentence: "The ___ hopped to the pond." },
    { word: "RAIN", hint: "Long A sound: AI says 'ay'", rule: "Long Vowel AI", sentence: "The ___ made puddles." },
    { word: "BOOK", hint: "OO makes the 'oo' sound", rule: "Vowel Team OO", sentence: "She read a ___ at the library." },
    { word: "SING", hint: "Ends with NG blend", rule: "Ending Blend NG", sentence: "We ___ songs in music class." },
    { word: "DRAW", hint: "Starts with DR blend", rule: "Blend DR", sentence: "I like to ___ animals." },
  ],
  3: [
    // Grade 3 rules: silent E, vowel teams, digraphs
    { word: "WHALE", hint: "Silent E makes A say its name", rule: "Silent E (Magic E)", sentence: "The ___ jumped out of the water." },
    { word: "BEACH", hint: "EA vowel team says 'ee'", rule: "Vowel Team EA", sentence: "We built sandcastles at the ___." },
    { word: "SHARK", hint: "SH digraph makes one sound", rule: "Digraph SH", sentence: "The ___ swam under the boat." },
    { word: "CLOUD", hint: "OU vowel team says 'ow'", rule: "Vowel Team OU", sentence: "A ___ floated past." },
    { word: "SHINE", hint: "Silent E makes I say its name", rule: "Silent E (Magic E)", sentence: "The sun will ___ today." },
    { word: "TEETH", hint: "TH digraph + EE vowel team", rule: "Digraph TH", sentence: "Brush your ___ every night." },
    { word: "CHASE", hint: "CH digraph + Silent E", rule: "Digraph CH", sentence: "The dog likes to ___ balls." },
    { word: "STORM", hint: "ST blend at the start", rule: "Blend ST", sentence: "The ___ lasted all night." },
  ],
  4: [
    // Grade 4 rules: suffixes, prefixes, double consonants
    { word: "BIGGER", hint: "-ER suffix means 'more'", rule: "Suffix -ER", sentence: "This box is ___ than that one." },
    { word: "UNKIND", hint: "UN- prefix means 'not'", rule: "Prefix UN-", sentence: "It is ___ to be mean." },
    { word: "RUNNING", hint: "Double N before -ING", rule: "Double Consonant + ING", sentence: "She is ___ in the race." },
    { word: "KNIGHT", hint: "Silent K at the start", rule: "Silent Letter K", sentence: "The ___ rode a white horse." },
    { word: "HAPPILY", hint: "Change Y to I, add -LY", rule: "Suffix -LY (Y to I)", sentence: "She ___ skipped to school." },
    { word: "REWRITE", hint: "RE- prefix means 'again'", rule: "Prefix RE-", sentence: "Please ___ your essay neatly." },
    { word: "BIGGEST", hint: "-EST suffix means 'most'", rule: "Suffix -EST", sentence: "That is the ___ dog I have ever seen." },
    { word: "FOSSIL", hint: "Double S in the middle", rule: "Double Consonant SS", sentence: "They found a dinosaur ___." },
  ],
  5: [
    // Grade 5 rules: syllables, compound words, -tion/-sion
    { word: "CLIMATE", hint: "CLI-MATE has 2 syllables", rule: "Syllable Division", sentence: "The ___ is getting warmer." },
    { word: "KEYBOARD", hint: "KEY + BOARD = compound word", rule: "Compound Word", sentence: "He typed on the ___." },
    { word: "FICTION", hint: "-TION ending says 'shun'", rule: "Suffix -TION", sentence: "She loves reading ___ books." },
    { word: "HABITAT", hint: "HAB-I-TAT has 3 syllables", rule: "Syllable Division", sentence: "The forest is a bear's ___." },
    { word: "DOWNLOAD", hint: "DOWN + LOAD = compound word", rule: "Compound Word", sentence: "I need to ___ the update." },
    { word: "RECYCLE", hint: "RE- prefix + cycle", rule: "Prefix RE- + Syllables", sentence: "We ___ plastic bottles." },
    { word: "MYSTERY", hint: "MYS-TER-Y has 3 syllables", rule: "Syllable Division", sentence: "The ___ kept us guessing." },
    { word: "VISION", hint: "-SION ending says 'zhun'", rule: "Suffix -SION", sentence: "She had perfect ___." },
  ],
  6: [
    // Grade 6 rules: Greek/Latin roots, silent letters, homophones
    { word: "MOLECULE", hint: "'Mole' is a Latin root for mass", rule: "Latin Root", sentence: "A water ___ has two hydrogen atoms." },
    { word: "KNOWLEDGE", hint: "Silent K + silent D + DGE", rule: "Silent Letters K, D", sentence: "___ is power." },
    { word: "THEIR", hint: "Homophone: THEIR/THERE/THEY'RE", rule: "Homophone", sentence: "___ house is blue." },
    { word: "ASTEROID", hint: "'Aster' is Greek for star", rule: "Greek Root", sentence: "The ___ passed close to Earth." },
    { word: "WRINKLE", hint: "Silent W at the start", rule: "Silent Letter W", sentence: "She ironed out every ___." },
    { word: "SYMPHONY", hint: "'Sym' means together, 'phon' means sound", rule: "Greek Roots", sentence: "The ___ was beautiful." },
    { word: "WEATHER", hint: "Homophone: WEATHER vs WHETHER", rule: "Homophone", sentence: "The ___ was sunny today." },
    { word: "ARCHITECT", hint: "'Arch' is Greek for chief/ruler", rule: "Greek Root", sentence: "The ___ designed the building." },
  ],
};

// ── Build Lessons from Grade Level ─────────────────────────────────
// Given an assessed level, build lessons from that level plus one
// level below (review) and one above (challenge).

export function buildLessonsForLevel(level: Grade): Lesson[] {
  const levels: Grade[] = [];
  if (level > 1) levels.push((level - 1) as Grade);
  levels.push(level);
  if (level < 6) levels.push((level + 1) as Grade);

  const difficultyMap: Record<number, Difficulty> = {};
  if (level > 1) difficultyMap[level - 1] = "easy";
  difficultyMap[level] = "medium";
  if (level < 6) difficultyMap[level + 1] = "hard";

  const lessons: Lesson[] = [];
  let starCost = 0;

  for (const g of levels) {
    const topics = GRADE_WORDS[g];
    const diff = difficultyMap[g] ?? "medium";
    for (const topic of topics) {
      lessons.push({
        id: `g${g}-${topic.topic.toLowerCase().replace(/\s+/g, "-")}`,
        title: topic.topic,
        emoji: topic.emoji,
        difficulty: diff,
        words: topic.words,
        starsToUnlock: starCost,
        concept: topic.concept,
        videoEmoji: topic.videoEmoji,
        explanation: topic.explanation,
        trick: topic.trick,
        examples: topic.examples,
      });
      starCost += 8;
    }
  }

  return lessons;
}

// ── Get all words for a level (for games) ──────────────────────────

export function getWordsForLevel(level: Grade): SpellingWord[] {
  const levels: Grade[] = [];
  if (level > 1) levels.push((level - 1) as Grade);
  levels.push(level);
  if (level < 6) levels.push((level + 1) as Grade);

  return levels.flatMap((g) => GRADE_WORDS[g].flatMap((t) => t.words));
}

// ── Shop Items ─────────────────────────────────────────────────────

export const SHOP_ITEMS: ShopItem[] = [
  // Hats
  { id: "hat-tophat", name: "Top Hat", emoji: "🎩", part: "hat", price: 5 },
  { id: "hat-crown", name: "Crown", emoji: "👑", part: "hat", price: 10 },
  { id: "hat-grad", name: "Grad Cap", emoji: "🎓", part: "hat", price: 8 },
  { id: "hat-cap", name: "Baseball Cap", emoji: "🧢", part: "hat", price: 3 },
  // Faces
  { id: "face-pleading", name: "Pleading", emoji: "🥺", part: "face", price: 5 },
  { id: "face-loving", name: "In Love", emoji: "🥰", part: "face", price: 8 },
  { id: "face-sparkle", name: "Sparkly", emoji: "🤩", part: "face", price: 10 },
  { id: "face-angel", name: "Angel", emoji: "😇", part: "face", price: 6 },
  // Shirts
  { id: "shirt-rainbow", name: "Rainbow", emoji: "🌈", part: "shirt", price: 8 },
  { id: "shirt-star", name: "Star", emoji: "⭐", part: "shirt", price: 5 },
  { id: "shirt-fire", name: "Fire", emoji: "🔥", part: "shirt", price: 10 },
  { id: "shirt-heart", name: "Purple Heart", emoji: "💜", part: "shirt", price: 3 },
  // Baby Pets
  { id: "acc-chick", name: "Baby Chick", emoji: "🐣", part: "accessory", price: 4 },
  { id: "acc-bunny", name: "Baby Bunny", emoji: "🐰", part: "accessory", price: 5 },
  { id: "acc-kitten", name: "Baby Kitten", emoji: "🐱", part: "accessory", price: 6 },
  { id: "acc-unicorn", name: "Baby Unicorn", emoji: "🦄", part: "accessory", price: 10 },
];

// ── Defaults ───────────────────────────────────────────────────────

export const DEFAULT_AVATAR: Record<AvatarPart, string> = {
  hat: "🎀",
  face: "🥺",
  shirt: "👗",
  accessory: "🐣",
};
