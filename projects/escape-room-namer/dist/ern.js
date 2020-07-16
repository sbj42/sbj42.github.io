(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.target = "browser";
FuseBox.pkg("default", {}, function(___scope___){
___scope___.file("ern.js", function(exports, require, module, __filename, __dirname){

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBoolean(chance) {
    return Math.random() < chance;
}
function getElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
var MAX_LENGTH = 100;
var Node = /** @class */ (function () {
    function Node(c) {
        this.nextNodes = [];
        this.c = c;
    }
    return Node;
}());
exports.Node = Node;
var MarkovChain = /** @class */ (function () {
    function MarkovChain(corpus, order) {
        this._start = new Node('');
        if (corpus.length === 0) {
            throw new Error("empty corpus");
        }
        if (order < 1) {
            throw new Error("invalid order " + order);
        }
        var nodeMap = {};
        var maxCorpusLength = 0;
        for (var _i = 0, corpus_1 = corpus; _i < corpus_1.length; _i++) {
            var str = corpus_1[_i];
            if (str.length === 0) {
                continue;
            }
            var node = this._start;
            for (var i = 0; i < str.length; i++) {
                var c = str[i];
                var key = str.substring(Math.max(0, i + 1 - order), i + 1).toLowerCase();
                var nextNode = nodeMap[key];
                if (!nextNode) {
                    nodeMap[key] = nextNode = new Node(c);
                }
                node.nextNodes.push(nextNode);
                node = nextNode;
            }
            node.nextNodes.push(undefined);
            maxCorpusLength = Math.max(maxCorpusLength, str.length);
        }
        this.maxCorpusLength = maxCorpusLength;
    }
    MarkovChain.prototype.get = function (maxLength) {
        if (typeof maxLength === 'undefined' || maxLength < 0) {
            maxLength = MAX_LENGTH;
        }
        var node = getElement(this._start.nextNodes);
        var name = '';
        while (node && name.length < maxLength) {
            name += node.c;
            node = getElement(node.nextNodes);
        }
        return name;
    };
    return MarkovChain;
}());
exports.MarkovChain = MarkovChain;
var MAX_ATTEMPTS = 100;
var MarkovNamer = /** @class */ (function () {
    function MarkovNamer(param) {
        this._avoid = {};
        this._corpus = param.corpus;
        this._chain = new MarkovChain(param.corpus, param.order || 3);
        if (param.avoid) {
            for (var _i = 0, _a = param.avoid; _i < _a.length; _i++) {
                var str = _a[_i];
                this._avoid[str.toLowerCase()] = true;
            }
        }
        this._prefix = param.prefix;
        this._suffix = param.suffix;
        if (param.prefix) {
            for (var _b = 0, _c = param.prefix.words; _b < _c.length; _b++) {
                var str = _c[_b];
                this._avoid[str.toLowerCase()] = true;
            }
        }
        if (param.suffix) {
            for (var _d = 0, _e = param.suffix.words; _d < _e.length; _d++) {
                var str = _e[_d];
                this._avoid[str.toLowerCase()] = true;
            }
        }
        if (typeof param.avoidCorpus === 'undefined' || param.avoidCorpus) {
            for (var _f = 0, _g = param.corpus; _f < _g.length; _f++) {
                var str = _g[_f];
                this._avoid[str.toLowerCase()] = true;
            }
        }
    }
    MarkovNamer.prototype.get = function () {
        var word = '';
        var attempts = MAX_ATTEMPTS;
        for (; attempts > 0; attempts--) {
            word = this._chain.get();
            if (word.length > this._chain.maxCorpusLength) {
                continue;
            }
            if (!this._avoid[word.toLowerCase()]) {
                var nope = false;
                for (var _i = 0, _a = this._corpus; _i < _a.length; _i++) {
                    var c = _a[_i];
                    if (c.indexOf(word) >= 0) {
                        nope = true;
                    }
                }
                if (!nope) {
                    break;
                }
            }
        }
        if (attempts === 0) {
            throw new Error("unable to generate name in " + MAX_ATTEMPTS + " attempts");
        }
        if (word.indexOf(' ') < 0) {
            if (this._prefix && getBoolean(0.5)) {
                word = getElement(this._prefix.words) + ' ' + word;
            }
            else if (this._suffix) {
                word = word + ' ' + getElement(this._suffix.words);
            }
        }
        if (this._prefix && getBoolean(this._prefix.chance)) {
            word = getElement(this._prefix.words) + ' ' + word;
        }
        else if (this._suffix && getBoolean(this._suffix.chance)) {
            word = word + ' ' + getElement(this._suffix.words);
        }
        return word;
    };
    return MarkovNamer;
}());
exports.MarkovNamer = MarkovNamer;
var corpus = [
    "Chamber of Illusions",
    "Sector X",
    "Houdini's Great Escape",
    "Top Secret",
    "School of Hard Locks",
    "Platoon",
    "Trouble in Paradise",
    "Hidden Treasures",
    "Architect's Studio",
    "Return to Planet Earth",
    "The Dig",
    "Billy's Nightmare",
    "Operation Blitzkrieg",
    "Ehrlich's Manor",
    "Mission is a Gogh!",
    "Opposing Forces: Onyx",
    "Travel to the 1920's",
    "Not All Superheroes Wear Capes",
    "Masquerade",
    "The Study",
    "Escape the Thai Prison",
    "Downfall of the Don",
    "Captain Graybeard's Trials",
    "Exit Protocol",
    "Dragonborne",
    "The Notorious Speakeasy",
    "The Museum Heist",
    "Escape the Decade, 1980's",
    "Escape from Oz",
    "The Hostel",
    "The Detective's Office",
    "The Game Room",
    "Mission: Homeland",
    "Escape the Serial Killer",
    "Bootlegger's Escape",
    "Chancellor's Office",
    "Abducted: Escape from the Madman",
    "The London Blitz",
    "Carnival",
    "Elude the Illusionist",
    "The Quest of Fortune's Galley",
    "Outbreak",
    "Lost Jewel of Zanzibar",
    "Containment X - Zombie Outbreak",
    "Prohibition: Lucky Duck Speakeasy",
    "Pharoah's Revenge",
    "Sherlock Holmes: Case of the White Lady",
    "The Remedy",
    "The Dimension Gate",
    "SpellCaster",
    "King Tut's Gilded Box",
    "50's Style Diner",
    "Camp Sycamore Sabotage",
    "Escape Blackbeard's Brig",
    "Area 51",
    "The Psychic",
    "The Mall",
    "Dr. Popwell and Mrs. Young",
    "The Wonky Chocolate Factory",
    "Rendezvous with the Renaissance",
    "Empire of the Golden Skull",
    "The Library",
    "Wiseguy Lounge",
    "Computer Countdown",
    "Exodus",
    "The Slasher",
    "The Island",
    "Mayan Temple",
    "Enchanted",
    "The Mad Doctor",
    "The Frozen Grove",
    "Super Trapped",
    "Disco 54 NYC",
    "Taken",
    "This Isn't Child's Play!",
    "CSI: Search and Rescue",
    "Rashi Room",
    "The Shady Hat Shop Heist",
    "Saint Angelo's Castle",
    "Pirate Ship",
    "Royal Flush Casino",
    "The Butcher",
    "The Lost Cabin: Book of Souls",
    "Secret of the Study",
    "Slime Factory",
    "Murder Mystery 2: A Killer's Revenge",
    "Escape from Death Row",
    "Starry Night",
    "The Bank Heist",
    "Crime at the Casino",
    "Decomposed",
    "The Agency",
    "Dansa Pausa",
    "Panacea",
    "Escape the Colosseum",
    "The Sunrise Killer Case",
    "Tesla's Mystery",
    "Diamond Heist",
    "KGBe Careful",
    "Laboratory of Biohazard",
    "Prohibition Pandemonion",
    "The Great Museum Heist Caper Job",
    "Sunken Submarine Tour",
    "The Pumpkin King's Christmas",
    "Prison Break 2.0",
    "The Pirate Ship",
    "The Shadow's Nest",
    "Vendetta",
    "The Gauntlet",
    "What Happened in ManchVegas",
    "Raiders of the Lost Room",
    "Haunted B & B",
    "Crush Depth",
    "Shipwrecked",
    "Jail Break",
    "The List",
    "Gangsters Gamble",
    "Underworld",
    "The Boardwalk",
    "Casino Cage",
    "Big Top Carnival",
    "Superbanan",
    "Mystery Casino Royale Heist",
    "The Robbery Job",
    "Temple Escape",
    "The Body Shop",
    "Conundrum Museum",
    "Carnevil",
    "The Lost Spy",
    "The Apartment",
    "Redemption",
    "White Lady's Castle",
    "A Christmas Story Escape",
    "The General Store",
    "Seal Team Alpha",
    "Mission: Space",
    "The Hideout",
    "The Lost City",
    "Skull & Bones",
    "Operation Drive",
    "May Day",
    "Keeper of the Light",
    "The Archaeologist",
    "Mystery at the Art Gallery",
    "The Vampire's Lair",
    "The Accountant",
    "X-file: The Alient Activist Infiltration",
    "The Jungle",
    "Ex Machina",
    "Spook House",
    "Cabin Fever",
    "Super Hero Adventure",
    "Escape the Game Show",
    "Pharaoh's Revenge",
    "Escape the Doctor's Study",
    "Subway Escape",
    "Cursed Tomb",
    "Alice's Wonderescape",
    "Hollywood Premiere",
    "Valley of the Kings",
    "The Curse of the Pharaoh",
    "50 Shades of Escape",
    "Like, Totally the ‘80s to the Max!",
    "Secret of Dragon’s Spire",
    "The Quest for Aztec Wealth",
    "Patient Zero",
    "The Mission",
    "Bigfoot's Revenge",
    "Find Our National Treasure",
    "Power Surge",
    "Lock N Roll",
    "Antidote",
    "High stakes",
    "Cabin in the Woods",
    "Wanted",
    "Bates Manor",
    "Time Trap",
    "Funeral Parlor",
    "Ichabod's Revenge",
    "Queen Anne's Revenge",
    "Pirate's Pizzas of 8",
    "The Lighthouse",
    "Mission Impossible",
    "The Safe Zone",
    "The Recruits",
    "The Anomaly",
    "Casino Heist",
    "Fairly Odd Tales",
    "Escape the Apartment",
    "Hex of the Chinese Jewelry Box",
    "The Office of Secret Agent 22",
    "Gimme Shelter",
    "The Pittsburgh Job",
    "Son of the Zodiac",
    "Mob Hit",
    "Nuclear Annihilation",
    "The Maine Room",
    "Seeking Sasquatch",
    "Harry Potter: Search for the Stone",
    "Great Arctic Diamond Heist",
    "Lockup",
    "The Knight's Quest",
    "The Illusionist",
    "The Spell",
    "Disease X",
    "7 Wonders Heist",
    "Spellcaster",
    "The Lost Record",
    "The Setup",
    "End of the Line",
    "Cabin of the Jersey Devil",
    "The Hotel Luxeva",
    "The Voyage of the Nautilus",
    "Miner Problems",
    "The Missing Doctor",
    "Art of the Heist",
    "The Deception",
    "Death Row",
    "High Noon at the Saloon",
    "Prey",
    "Escape the Farm House",
    "Da Vinci's Study",
    "Grandma's Kitchen",
    "The Moonlight Club",
    "Tohua Island",
    "Jet Set",
    "Ice Station Zero",
    "John Murphy, Private Investigator",
    "Dixmonte",
    "Escape the Plague",
    "Tremors on the Tracks",
    "The Haunting of Chestnut Hill",
    "Escape the Final Act: The Houdini Experience",
    "Snatched",
    "Detective Room",
    "The Boardroom",
    "The Mad Scientist",
    "Escape the Museum Heist",
    "Doctor Frankenstein",
    "Escape the Forest",
    "The Roswell Incident",
    "Tower",
    "School of Magic",
    "Locked! At the Bistro!",
    "The Wizard's Secret",
    "Wayward Simulator",
    "Fear",
    "Secret Society",
    "Hijacked Holidays!",
    "Crash Landing",
    "Rebel Recon",
    "Apartment Arrr",
    "Haunted Locker Room",
    "The Interview",
    "Fairy Tailor",
    "Da Vinci's Secret",
    "Legends of a Hidden Temple",
    "The Last Vampire",
    "Aunt Edna's Condo",
    "Wild West Heist",
    "Mischief And Mayhem ... An Elf Story",
    "Game of Pirates",
    "Butcher Barn",
    "Lost Book of Spells",
    "The Family Fortune",
    "The Magician's Secret",
    "Abandoned Subway",
    "Fallout Shelter",
    "Alice in Wonderland",
    "Mojo's Museum",
    "The Time Paradox",
    "Eleanor's Eccentricities",
    "44 Winter Wood Lane",
    "The Cursed Caravan",
    "The Asylum",
    "The Sanctum",
    "Gold Ball Pursuit",
    "Copperhead Saloon",
    "The Game Show",
    "Possessed Puppeteer",
    "Lost Treasure of Captain Lawrence",
    "Genie's Lamp",
    "Federal Treasure",
    "BogeyMan",
    "The Inheritance",
    "Alice's Dream",
    "The Subway",
    "Haunted Estates",
    "Bait Room",
    "Codebreakers",
    "The Clock Tower",
    "Mad Hatter",
    "Alcatraz Prison Escape Room",
    "Save the World: Rise of Cthulhu",
    "Home Alone",
    "Cele-Break Out",
    "Spooky Room 479",
    "Gettysburg Address Heist",
    "Ben Franklin's Inferno",
    "Santa's Dilemma",
    "Pandora's Box",
    "The Sanatorium",
    "Pirate Plunder",
    "Abigail's Playroom",
    "Cure Z",
    "Off the Radar",
    "The Basement: Halloween Edition",
    "The Lost Soul",
    "Decomposed: Breakout of the Mansion",
    "Zombie Virus",
    "The Sanctuary",
    "Detective Story",
    "The Alchemy Lab",
    "The Secret Chamber",
    "Medieval Dungeon",
    "Room #9",
    "Step Up",
    "Boom Room",
    "Ultra Violet",
    "Nightmare on Main Street",
    "Sleeping Spirits",
    "The Submarine",
    "Meltdown",
    "Graveyard Inlet",
    "Under the Sea",
    "Superheroes",
    "Escape #109 Mine",
    "Alien Conspiracy",
    "Awaken",
    "The Surgeon",
    "The Wild West",
    "Room X",
    "The Infiltrator",
    "The Toy Box",
    "Train Heist: A Steampunk Adventure",
    "The Wizarding Hour",
    "The Room of the Serial Killer",
    "Speakeasy - Tallulah Darling's Shore Club",
    "Joker's Cafe",
    "Outer Space",
    "Zombie Nation",
    "The Cookhouse",
    "The Ski Chalet",
    "Blackbeard's Revenge",
    "Dorm Daze",
    "Down the Rabbit Hole",
    "The Paradox",
    "Enter the Underground",
    "Secrets of the Pharaoh",
    "Locked in a Room with a Zombie",
    "The Witch's Lair",
    "Midnight City",
    "Room 113",
    "Missing Baby",
    "The Terminal",
    "Find Pharaoh's Gold",
    "Tick Tok",
    "Caramella's Candy Shoppe",
    "Dragon’s Spire",
    "Escape Plan 2",
    "Do Not Disturb",
    "The Search for the Jade Skull",
    "Hyperborea",
    "Lost Teddy",
    "Egyptian Tomb",
    "Zombie Apocalypse",
    "The Perfect Crime",
    "The Estate",
    "Cuckoo's Nest",
    "Ice Cream Truck",
    "Dark Light Disco Fight",
    "National Heist",
    "Mission: Reactor",
    "Where have all the colors gone?",
    "The Capture",
    "Nonna's House",
    "The Botanist",
    "Escape the Tomb",
    "Time Chasers",
    "The Grand Parlor",
    "Special Agent",
    "Blue Plate Special",
    "Save the Queen",
    "The Speakeasy",
    "The Missing Remote",
    "Mystery Mansion",
    "The Prom",
    "The Assistant",
    "Vampire",
    "Escape from 20,000 Leagues",
    "Mystery at the Ballpark",
    "Escape the Freak Show",
    "The Butcher Shoppe",
    "The Great Room",
    "Escape the Bar",
    "Vanished",
    "The Minimalist",
    "Pirates of the Dark Sea",
    "Wizards and Wands",
    "The Zany Zoo",
    "Countdown",
    "Escape the Decade, 1970's",
    "Titanic",
    "Once Upon a Time",
    "Tomb of the Red Queen",
    "Last Resort",
    "Western Bank Heist",
    "The Contraption",
    "Ocean's 10: The Gardner Heist",
    "The Missing Five",
    "Alice in Wonderland: In the Nick of Time",
    "Prison of the Dead Escape",
    "The Wizard's Keep",
    "Swamp",
    "Cold Case",
    "Checkmate",
    "Wandering Wizard",
    "The Chicken Wing Sting",
    "Chamber of Horrors",
    "The Basement",
    "Andromeda Station",
    "Farm",
    "The Crew",
    "Calcifer's Conjuring",
    "The Enigma",
    "Case Closed Philadelphia",
    "The Mausoleum",
    "Break Out",
    "T.A.C.O. Tuesday",
    "Inventor's Work Shop",
    "Save the Revolution",
    "Museum Mayhem",
    "Finding Cottontail",
    "The Z Virus: Trying to Find the Cure",
    "Detention",
    "The Lost Temple",
    "The Dungeon of Elements",
    "Mutiny",
    "Echo Chamber",
    "Baker Street Mystery",
    "Deadwood Cabin",
    "Shpola Room",
    "The Magical Land of Swirly Twirly Gumdrops",
    "Haunted",
    "The Reporter",
    "Abducted",
    "Victim No. 7",
    "Lake Effect",
    "Date Night: The Missing Starlet",
    "Budapest Express",
    "High Speed NYC",
    "The Da Vinci Obsession",
    "Mafia Blackout",
    "The Laboratory in 4D / Gateway",
    "The Big Score",
    "Grand Theft Jersey City",
    "The Half Treasure Map",
    "The Candy Shop",
    "World's Fair Hotel",
    "File X: Area 51 Incident",
    "The Upside Down",
    "Mayan Curse",
    "SpecialOps",
    "Rescue Mission",
    "The Russian Connection",
    "Mission to Mars",
    "Mission to 1978",
    "Crusader's Alley",
    "Museum",
    "Vintage Circus",
    "Consequences",
    "The Penitentiary",
    "The Castle",
    "King Arthur's Quest",
    "Magician's Study",
    "The Ransom",
    "Sherlock: The Baker Street Five",
    "Over the Falls",
    "Al Capone's Speakeasy",
    "Western Whistle",
    "Manhattan Mayhem",
    "The Loft",
    "Hidden Below",
    "The Tornado Room (3.0)",
    "Sweet Revenge",
    "Pirates",
    "Mark Twain",
    "CSI Murder Mystery",
    "Riddler's Funhouse (Poison Ivy)",
    "The Relic Robber",
    "Under the Big Top",
    "Philadelphia Phrenzy",
    "Sherlock Holmes' Library",
    "The Laboratory",
    "The Pazziolis",
    "Trapped in a Horror Movie",
    "Dr. Stein's Laboratory",
    "Spring",
    "The Space Station",
    "Aunt Sue's Apartment",
    "The Dollhouse",
    "Disorderly Conduct",
    "The Arcade",
    "Let's Get Take-Out!",
    "Doomsday",
    "Conspiracy",
    "The Virus",
    "Dragon Heart",
    "The Retreat",
    "The Pirate's Booty II: The Lost Ship",
    "Save Philadelphia",
    "The Jungle Dimension",
    "The Valentine Mystery",
    "The Hole",
    "Pepe's Wild West Adventure",
    "The Magician",
    "The Midnighters",
    "Penalty Box",
    "Aunt Millie's Beach Condo",
    "Cabin Caper",
    "The Unsolved Case",
    "Lost in Space",
    "The Sorcerer's Curse",
    "Photoshop Panic",
    "Boardwalk Blast",
    "Road Trip USA",
    "Runaway Train",
    "The Moonshiner",
    "Prohibition Pandemonium",
    "The Crypt",
    "Sherlock Holmes and the Haunted Cemetery",
    "Wild West",
    "Summerfield Place",
    "Under Pressure",
    "Operation: Infiltrate 358",
    "Escape Jack the Ripper",
    "Fly Into Fantasy",
    "F5 Tornado Escape",
    "The Diamond Mine",
    "The Zen Room",
    "The Starship: Space Rescue",
    "Journey on the Nautilus",
    "Carnival Conundrum",
    "Christmas at Grandma's",
    "Backstage",
    "The Lost City of the Monkey God",
    "The Curse of Osiris",
    "Believe - The Magic Show",
    "Hideout",
    "D.J. Death",
    "The Mad Hatter",
    "Curse of the Pharaoh",
    "Finding White Rabbit",
    "Revive & Survive",
    "Sherlock's Study",
    "Date Night",
    "The Home",
    "Escape from Escobar's",
    "Forbidden Forest",
    "The Haunted Hotel",
    "Wild Wild West",
    "Wallingford Five",
    "September 1777",
    "Vacation Vandals",
    "Escape the 90s Video Store",
    "The Cage, the Cards, and the Cash",
    "Cure of the Alchemist",
    "Axe Murder Hollow",
    "Escape from Alcatraz",
    "Bank Heist",
    "Virus",
    "Apocalyptic Mission",
    "Alien Attack",
    "The Bunker",
    "The Experiment",
    "27 Seconds",
    "DEFCON 1",
    "The Fortune Teller",
    "1408 Escape",
    "The Meltdown",
    "Killer Feature",
    "The Duke's Palace",
    "High Rollers Lounge",
    "Escape From Pirate's Cove",
    "Stealing Mona",
    "The Show Must Go On",
    "Houdini's Magic Cell",
    "The Haunted",
    "The Brain Game",
    "Top Secret Mission",
    "Poker Room",
    "The Motherboard",
    "Granny's Kitchen",
    "King Tut's Catacomb",
    "Uncle Ned’s Cabin",
    "The Eckstein Experiment",
    "Stephen King Room",
    "Spy Academy",
    "Tomb Explorer",
    "Dr. Watson's Infirmary",
    "The Garage",
    "Mayan Tomb",
    "The Murder Mystery",
    "Tough/Tougher/Toughest",
    "The Green Room",
    "A Broken Mind",
    "The Time Bender",
    "Shanghaied",
    "A Stay of Execution",
    "Crime Scene",
    "Curse of the Bambino",
    "Operation: Rudolph",
    "Pulse",
    "Our Lady Atocha",
    "Quest for the Throne",
    "Wrongfully Accused",
    "Finding Sherlock Holmes",
    "Vampire Hunter",
    "Opposing Forces: Ivory",
    "Trapped in a Room with a Zombie",
    "Weird Science: Escape the Oddities",
    "The Hidden Cabin",
    "La Cosa Nostra",
    "The News Room",
    "Escape the 1980's",
    "Zoe's Torment",
    "Remedy...25 Years Later",
    "Ancient Greek Temple",
    "Island Escape",
    "Amazing Adventure Society: The Forgotten Room",
    "T-Rex Lockdown",
    "Westower's Study",
    "Sherlock's Office",
    "Mysterious Mansion",
    "Excalibur",
    "Poseidon's Jewel",
    "WinterKeep",
    "Cleopatra's Tomb",
    "Escape the Lost Pyramid",
    "Zombie Uprising",
    "The Curse of Cap’n Scurvy",
    "Hysteria",
    "Treasure Island",
    "Murder She Wrote (Castle)",
    "Search for the Grail",
    "Hostage",
    "Escape From Paradise",
    "Extinction Level Event",
    "Hungover: The Reunion",
    "The Hustler",
    "Sweet Shoppe",
    "Space Escape",
    "The Secret Society",
    "The Lost Pharaoh",
    "A Reel Prize",
    "Asylum",
    "Steampunk Train",
    "Travel to the 1980's",
    "Defuse the Bomb",
    "The Haunted Cabin",
    "Prison Escape",
    "The Cellar",
    "Superhero's Adventure",
    "Santa's Workshop",
    "Kids Escape Game",
    "Lenny Thompkins Sold his Soul to Play the Blues",
    "Cold Case Investigators",
    "Wizard Chamber",
    "Room 101",
    "The Precinct",
    "Murder for Hire",
    "House in the Woods",
    "The Challenge",
    "Carribean Pirate Ship",
    "Blackbeard's Brig",
    "The Order",
    "McWhirley's Mystery",
    "Espionage",
    "Black Widow",
    "Pirate's Cove Plunder",
    "The Initiative",
    "Escape the Hydeout",
    "Castaway",
    "Escape the Lab",
    "The Butcher's Basement",
    "Secrets of the Abandoned Circus",
    "Room 1409",
    "Jurassic Escape",
    "Riddler's Funhouse (Joker's Revenge)",
    "John Hayden's Room",
    "The Wizard of Greystone Abbey",
    "The Jewel Heist",
    "Animal Kingdom",
    "Escape the Hydeout: The Mystery of Henry Jekyll",
    "The Legend of the Fairy Queen",
    "Dual Challenge",
    "Curse of the Jade Skull",
    "Jungle",
    "The Ornithologist's Secret",
    "The Otherside (Scary Version)",
    "Wigwam Escape",
    "Diamonds in the Rough",
    "Watson's Revenge",
    "Fallout",
    "Drago's Castle",
    "Stranded",
    "Witch Hunt",
    "The Outbreak",
    "The Otherside (Detective Version)",
    "Ewan Watarmy's Bunker",
    "Submerged",
    "Professor Moriarty's Gameroom",
    "Shipshape, Scallywag",
    "Organized Chaos",
    "Curse of the Golden Touch",
    "Escape the Midnight Carnival",
    "Medieval Manor",
    "Viking Raid",
    "The Game Museum",
    "The Heist",
    "Villain on the loose!",
    "Serial Killer Sleuth",
    "Sherlock's Library",
    "Spirit of Harlem",
    "The 13th Floor",
    "Mayday",
    "Wicked Workshop",
    "20,000 Leagues Under the Sea",
    "Killer Countdown",
    "Biker's Revenge",
    "1920’s Paris: A Moveable Mystery",
    "The Backstage",
    "Travel to the 1960's",
    "The City of Ashes",
    "Da Vinci’s Mystery",
    "Art Heist",
    "Curse of the Evil Genie",
    "Off The Rocker Doctor",
    "1970's Mojo Room",
    "The Temple of the Laughing God",
    "Operation: Gambit",
    "Candy Factory 2: Land of Sweets",
    "Children's Carnival Challenge",
    "The Lost Wand (Kids Version)",
    "Survival",
    "Shipwreck",
    "The Quest for the King's Crown",
    "Long Island Bomb Threat",
    "Hairy Women of Klipnocky",
    "Cuban Crisis",
    "Framed: Agent 24",
    "Escape the Niagara",
    "The Office",
    "The Twilight Zone",
    "Hack Attack",
    "20,000 Leagues",
    "Shelter R",
    "Surgery",
    "Museum Heist",
    "Lazer Maze",
    "The Library Part 2 - The Lion's Den",
    "Escape From Alcatraz",
    "Cat Burglar",
    "Mansion Murder",
    "The Secret of the Alchemist",
    "Mission: Z",
    "Rats",
    "Battle for the Throne",
    "The Toy Maker's Office",
    "Escape from 108 Ocean Ave.",
    "The Incident",
    "Ultimate Heist",
    "The Blind Tiger Speakeasy",
    "Cell Block 4",
    "The Lodge",
    "The Royal Heist",
    "The Dungeon",
    "The Vampire's Tomb",
    "Game of Stones",
    "Awesome",
    "Pharaoh's Curse",
    "Pharaoh's Tomb",
    "Andy's Room",
    "Hide and Seek",
    "The Inside Job",
    "Revolution Spies",
    "Breaking Beaker",
    "The Wizard's Apprentice",
    "File X",
    "Sunken Dreams",
    "The Attic",
    "The Cabin Trip",
    "The Cellar 2: Saul's Revenge",
    "1909, A Love Story",
    "Pirates: Captured!",
    "The Stolen Relic",
    "Rock Stars",
    "Cold War",
    "Site 3 Crash Site",
    "The Gallery",
    "The Inventor's Paradox",
    "A Quest for Freedom",
    "The Submarine Room",
    "Sabotage!",
    "Time-Traveling Jen",
    "The Vault",
    "Dr. Chen's Office",
    "Blackout",
    "Mr. Jenkins Basement",
    "The Classroom",
    "The Jungle Escape",
    "Centralia Mineshaft Room",
    "Pirates of the Golden Skull",
    "Nuclear Meltdown",
    "Framed",
    "Roaring 1920's Investigation",
    "Tin Star Saloon",
    "The Hatter's Hideout",
    "Pyramid Heist",
    "Zoo Eggstraction",
    "Scarab",
    "Case Closed Montclair",
    "Serial Killer Charade",
    "Jewel Heist",
    "The Cure",
    "Game Night Gone Wrong",
    "Cannibal Lair",
    "The Lost Wand",
    "The Magician's Assistant",
    "Quarantine",
    "New Orleans Escape",
    "Heist of the Moon Diamond",
    "Body Collectors",
    "Black Ops",
    "Alien Invasion",
    "The Cabin",
    "Secret Agent",
    "Escape from Wonderland",
    "Escape: Wonderland",
    "Alcatraz",
    "Bullet and Broken Hearts",
    "Santa's Naughty List",
    "Ghost Light",
    "The Heist Part 1",
    "Huxley",
    "Harry Potter Escape",
    "The Ultimate Nightmare",
    "The Protocol",
    "Find the Professor of the Occult",
    "Operation: End of Days",
    "Robin Hood's Dungeon Escape",
    "Whisper Sister",
    "The Drunk Tank",
    "The Pharaoh's Tomb",
    "Shape",
    "Game of Clans",
    "Safe House",
    "Wizard's Laboratory",
    "Escape the Pharaoh's Tomb",
    "Treasure of Blackbeard",
    "The da Vinci Room",
    "Beyond Medusa's Gate",
    "Revenge of the Serial Killer",
    "Contagion",
    "Carnegie's Millions",
    "Tomb",
    "Coach",
    "Night at the Museum",
    "Da Vinci's Mystery",
    "Spirited Study",
    "The Great Train Heist",
    "Swan Song",
    "The Enigma Room",
    "Dracula's Tomb",
    "Escape from Twenty Thousand Leagues",
    "Da Vinci's Office",
    "Forgotten Laboratory",
    "The Hangover",
    "The Missing Starlet",
    "The Detective's Dinner Party",
    "Gold Rush",
    "Valentine's Massacre",
    "Time Shift",
    "Swiss Original",
    "The Grimm Escape",
    "The Art Gallery",
    "Kidnapped",
    "Cypherspace",
    "The Gold Digger",
    "The Tavern",
    "Escape the Ship",
    "Sorcerer's Study",
    "Alien Encounter",
    "Hungover",
    "Dragon's Descent",
    "Z51",
    "Dreamscape",
    "Trapped",
    "Hostage Crisis",
    "Galahad",
    "The Titletown Ring Thief",
    "Montauk Project",
    "The Abandoned Factory",
    "Nosferatu: A Vampire’s Revenge",
    "The Dame Disappears",
    "Defeat the Biz!",
    "Area 412",
    "Operation: Casino",
    "Prison Break",
    "Alien Abduction",
    "Bomb Room",
    "Operation 26",
    "The Mayan Tomb",
    "The President's Bunker",
    "Serial",
    "Zombie Experience",
    "Quiz Show",
    "Battleship",
    "Dr. Demento",
    "The Time Travel Room",
    "The Unknown",
    "Magician's Apparition",
    "Intergalactic Escape",
    "The Treasure of Dungeon Rock",
    "The Tomb",
    "Lost Temple",
    "The Revenge of DJ Unstabl3",
    "Undercover",
    "Aftermath",
    "The Pirate's Chamber",
    "The Egyptian Tomb",
    "Light and Dark",
    "Wayward Voyage",
    "Pandora's Clock",
    "John Doe",
    "S.W.A.T.",
    "Under The Bedskirt",
    "Time Machine Trouble",
    "Escape Your Fears!",
    "Boxed Up",
    "Captive",
    "Holiday Madness",
    "The Kidnapping",
    "The Last Will of Uncle Joe",
    "The Space Program",
    "Biohazard",
    "Redrum",
    "Top Secret: The Philadelphia Experiment",
    "Strange Escape",
    "The Observatory",
    "Bollkoll",
    "Access",
    "Sweet Nightmares",
    "Stolen Diamond",
    "The Submarine Ship",
    "The Ghost Ship",
    "Backstage Pass",
    "Sherlock Holmes: Case of the White Ghost",
    "The Showdown",
    "Killer Virus",
    "The Time Machine",
    "Police Station",
    "Futoratec Laboratory",
    "Wild West Saloon",
    "The Hurricane",
    "The Billionaire's Den",
    "Escape the Lost Temple",
    "The Secret Lab",
    "Th3 C0d3",
    "Sealed with a Bang",
    "Fallout: The Aftermath",
    "Riddler's Funhouse (Riddler's Challenge)",
    "Deep Space",
    "Floor Grid",
    "Philly Philly",
    "The Cloning Experiment",
    "Catch Me If You Can",
];
function removePrefix(w, p) {
    if (w.toLowerCase().indexOf(p) === 0) {
        w = w.substr(p.length);
    }
    return w;
}
function removeSuffix(w, s) {
    if (w.toLowerCase().lastIndexOf(s) === w.length - s.length) {
        w = w.substr(0, w.length - s.length);
    }
    return w;
}
function make(order) {
    return new MarkovNamer({
        corpus: corpus.map(function (w) {
            w = w.replace('&', 'and');
            w = w.replace('?', '');
            w = w.replace('!', '');
            w = w.replace('(', '');
            w = w.replace(')', '');
            w = w.replace('‘', '\'');
            w = w.replace('’', '\'');
            w = w.replace(',', '');
            w = w.replace(' - ', ': ');
            w = w.replace(' / ', ': ');
            w = w.replace(' ... ', ': ');
            w = w.replace('...', ': ');
            w = w.replace('.', '');
            w = w.replace('/', ' ');
            w = removePrefix(w, 'escape ');
            w = removePrefix(w, 'the ');
            w = removePrefix(w, 'from ');
            w = removeSuffix(w, ' room');
            w = removeSuffix(w, ' escape');
            w = removeSuffix(w, ' quest');
            w = removeSuffix(w, ' adventure');
            w = removeSuffix(w, ' heist');
            return w;
        }),
        order: order,
        prefix: {
            words: [
                'The',
                'Escape the',
                'Escape from',
            ],
            chance: 0.1,
        },
        suffix: {
            words: [
                'Room',
                'Escape',
                'Quest',
                'Adventure',
                'Heist'
            ],
            chance: 0.1,
        }
    });
}
var namer3 = make(3);
var namer4 = make(4);
var namer5 = make(5);
function generate() {
    var list = document.createElement('div');
    list.innerHTML = '';
    for (var i = 0; i < 4; i++) {
        var name = namer5.get();
        var item = document.createElement('div');
        item.textContent = item.innerText = name;
        list.appendChild(item);
    }
    for (var i = 0; i < 1; i++) {
        var name = namer3.get();
        var item = document.createElement('div');
        item.textContent = item.innerText = name;
        list.appendChild(item);
    }
    for (var i = 0; i < 3; i++) {
        var name = namer4.get();
        var item = document.createElement('div');
        item.textContent = item.innerText = name;
        list.appendChild(item);
    }
    return list;
}
var list = document.getElementById('list');
if (list) {
    list.appendChild(generate());
}
var step = function () {
    var list = document.getElementById('list');
    var next = document.getElementById('next');
    if (list && next) {
        next.appendChild(generate());
        list.style.left = '-800px';
        next.style.left = '0px';
        setTimeout(function () {
            if (list.parentNode) {
                list.parentNode.removeChild(list);
            }
            next.id = 'list';
            next.className = 'l';
            var newList = document.createElement('div');
            newList.id = 'next';
            newList.className = 'n';
            if (next.parentNode) {
                next.parentNode.insertBefore(newList, next);
            }
        }, 200);
    }
};
window.generate = step;

});
return ___scope___.entry = "ern.js";
});

FuseBox.import("default/ern.js");
FuseBox.main("default/ern.js");
})
(function(e){function r(e){var r=e.charCodeAt(0),n=e.charCodeAt(1);if((m||58!==n)&&(r>=97&&r<=122||64===r)){if(64===r){var t=e.split("/"),i=t.splice(2,t.length).join("/");return[t[0]+"/"+t[1],i||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var a=e.substring(0,o),f=e.substring(o+1);return[a,f]}}function n(e){return e.substring(0,e.lastIndexOf("/"))||"./"}function t(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var o=[],t=0,i=n.length;t<i;t++){var a=n[t];a&&"."!==a&&(".."===a?o.pop():o.push(a))}return""===n[0]&&o.unshift(""),o.join("/")||(o.length?"/":".")}function i(e){var r=e.match(/\.(\w{1,})$/);return r&&r[1]?e:e+".js"}function o(e){if(m){var r,n=document,t=n.getElementsByTagName("head")[0];/\.css$/.test(e)?(r=n.createElement("link"),r.rel="stylesheet",r.type="text/css",r.href=e):(r=n.createElement("script"),r.type="text/javascript",r.src=e,r.async=!0),t.insertBefore(r,t.firstChild)}}function a(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])}function f(e){return{server:require(e)}}function u(e,n){var o=n.path||"./",a=n.pkg||"default",u=r(e);if(u&&(o="./",a=u[0],n.v&&n.v[a]&&(a=a+"@"+n.v[a]),e=u[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),o="./";else if(!m&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return f(e);var s=x[a];if(!s){if(m&&"electron"!==_.target)throw"Package not found "+a;return f(a+(e?"/"+e:""))}e=e?e:"./"+s.s.entry;var l,d=t(o,e),c=i(d),p=s.f[c];return!p&&c.indexOf("*")>-1&&(l=c),p||l||(c=t(d,"/","index.js"),p=s.f[c],p||"."!==d||(c=s.s&&s.s.entry||"index.js",p=s.f[c]),p||(c=d+".js",p=s.f[c]),p||(p=s.f[d+".jsx"]),p||(c=d+"/index.jsx",p=s.f[c])),{file:p,wildcard:l,pkgName:a,versions:s.v,filePath:d,validPath:c}}function s(e,r,n){if(void 0===n&&(n={}),!m)return r(/\.(js|json)$/.test(e)?h.require(e):"");if(n&&n.ajaxed===e)return console.error(e,"does not provide a module");var i=new XMLHttpRequest;i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var n=i.getResponseHeader("Content-Type"),o=i.responseText;/json/.test(n)?o="module.exports = "+o:/javascript/.test(n)||(o="module.exports = "+JSON.stringify(o));var a=t("./",e);_.dynamic(a,o),r(_.import(e,{ajaxed:e}))}else console.error(e,"not found on request"),r(void 0)},i.open("GET",e,!0),i.send()}function l(e,r){var n=y[e];if(n)for(var t in n){var i=n[t].apply(null,r);if(i===!1)return!1}}function d(e){if(null!==e&&["function","object","array"].indexOf(typeof e)!==-1&&!e.hasOwnProperty("default"))return Object.isFrozen(e)?void(e.default=e):void Object.defineProperty(e,"default",{value:e,writable:!0,enumerable:!1})}function c(e,r){if(void 0===r&&(r={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return o(e);var t=u(e,r);if(t.server)return t.server;var i=t.file;if(t.wildcard){var a=new RegExp(t.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@@/g,".*").replace(/@/g,"[a-z0-9$_-]+"),"i"),f=x[t.pkgName];if(f){var p={};for(var v in f.f)a.test(v)&&(p[v]=c(t.pkgName+"/"+v));return p}}if(!i){var g="function"==typeof r,y=l("async",[e,r]);if(y===!1)return;return s(e,function(e){return g?r(e):null},r)}var w=t.pkgName;if(i.locals&&i.locals.module)return i.locals.module.exports;var b=i.locals={},j=n(t.validPath);b.exports={},b.module={exports:b.exports},b.require=function(e,r){var n=c(e,{pkg:w,path:j,v:t.versions});return _.sdep&&d(n),n},m||!h.require.main?b.require.main={filename:"./",paths:[]}:b.require.main=h.require.main;var k=[b.module.exports,b.require,b.module,t.validPath,j,w];return l("before-import",k),i.fn.apply(k[0],k),l("after-import",k),b.module.exports}if(e.FuseBox)return e.FuseBox;var p="undefined"!=typeof ServiceWorkerGlobalScope,v="undefined"!=typeof WorkerGlobalScope,m="undefined"!=typeof window&&"undefined"!=typeof window.navigator||v||p,h=m?v||p?{}:window:global;m&&(h.global=v||p?{}:window),e=m&&"undefined"==typeof __fbx__dnm__?e:module.exports;var g=m?v||p?{}:window.__fsbx__=window.__fsbx__||{}:h.$fsbx=h.$fsbx||{};m||(h.require=require);var x=g.p=g.p||{},y=g.e=g.e||{},_=function(){function r(){}return r.global=function(e,r){return void 0===r?h[e]:void(h[e]=r)},r.import=function(e,r){return c(e,r)},r.on=function(e,r){y[e]=y[e]||[],y[e].push(r)},r.exists=function(e){try{var r=u(e,{});return void 0!==r.file}catch(e){return!1}},r.remove=function(e){var r=u(e,{}),n=x[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},r.main=function(e){return this.mainFile=e,r.import(e,{})},r.expose=function(r){var n=function(n){var t=r[n].alias,i=c(r[n].pkg);"*"===t?a(i,function(r,n){return e[r]=n}):"object"==typeof t?a(t,function(r,n){return e[n]=i[r]}):e[t]=i};for(var t in r)n(t)},r.dynamic=function(r,n,t){this.pkg(t&&t.pkg||"default",{},function(t){t.file(r,function(r,t,i,o,a){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,o,a,e)})})},r.flush=function(e){var r=x.default;for(var n in r.f)e&&!e(n)||delete r.f[n].locals},r.pkg=function(e,r,n){if(x[e])return n(x[e].s);var t=x[e]={};return t.f={},t.v=r,t.s={file:function(e,r){return t.f[e]={fn:r}}},n(t.s)},r.addPlugin=function(e){this.plugins.push(e)},r.packages=x,r.isBrowser=m,r.isServer=!m,r.plugins=[],r}();return m||(h.FuseBox=_),e.FuseBox=_}(this))