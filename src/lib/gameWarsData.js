const CDN_BASE = import.meta.env.VITE_CDN_BASE;
const imgLocation = `${CDN_BASE}/nonFruitCharacters/`

const gameWarsData = {
    "Backstory": [
        {
            "name": "Buggy",
            "power": 35,
            "img": `${imgLocation}/Buggy.webp`
        },
        {
            "name": "Kaya",
            "power": 25,
            "img": `${imgLocation}/3449c49f8282bbc2427e4e5f98a22bce.jpg`
        },

        {
            "name": "Hogback",
            "power": 15,
            "img": `${imgLocation}/Hogback-Anime-Infobox.webp`
        },

        {
            "name": "Konis",
            "power": 15,
            "img": `${imgLocation}/Conis-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Duval",
            "power": 15,
            "img": `${imgLocation}/755be6a5e4180c4ab00783155cd49b45.webp`,
        },
        {
            "name": "Foxy",
            "power": 15,
            "img": `${imgLocation}/Foxy-Anime-Pre-Timeskip-Infobox.webp`,
        },

        {
            "name": "Crocodile",
            "power": 40,
            "img": `${imgLocation}/Crocodile-Anime-Infobox.webp`
        },
        {
            "name": "Luffy",
            "power": 70,
            "img": `${imgLocation}/Monkey-D-Luffy-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Usopp",
            "power": 52,
            "img": `${imgLocation}/Usopp-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Kaido",
            "power": 55,
            "img": `${imgLocation}/Kaidou-Anime-Infobox.webp`
        },
        {
            "name": "Zoro",
            "power": 60,
            "img": `${imgLocation}/294-C69-BF-16-A8-4978-8701-43-EBDC0-C425-F.webp`
        },
        {
            "name": "Whitebeard",
            "power": 70,
            "img": `${imgLocation}/Edward-Newgate-Anime-Infobox.webp`
        },
        {
            "name": "Brook",
            "power": 90,
            "img": `${imgLocation}/Brook-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Franky",
            "power": 78,
            "img": `${imgLocation}/Franky-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Sabo",
            "power": 80,
            "img": `${imgLocation}/Sabo-Anime-Infobox.webp`
        },
        {
            "name": "Chopper",
            "power": 80,
            "img": `${imgLocation}/Tony-Tony-Chopper-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Nami",
            "power": 75,
            "img": `${imgLocation}/Nami-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Ace",
            "power": 75,
            "img": `${imgLocation}/Portgas-D-Ace-Anime-Infobox.webp`
        },
        {
            "name": "Sanji",
            "power": 92,
            "img": `${imgLocation}/Sanji-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Doflamingo",
            "power": 76,
            "img": `${imgLocation}/Donquixote-Doflamingo-Anime-Infobox.webp`
        },
        {
            "name": "Robin",
            "power": 90,
            "img": `${imgLocation}/Nico-robin-dressrosa-01.webp`
        },
        {
            "name": "Law",
            "power": 82,
            "img": `${imgLocation}/Trafalgar-D-Water-Law-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "BigMom",
            "power": 73,
            "img": `${imgLocation}/Charlotte-Linlin-Anime-Infobox.webp`
        },
        {
            "name": "Kuma",
            "power": 100,
            "img": `${imgLocation}/Bartholomew-Kuma-Anime-Infobox.webp`
        },
        {
            "name": "Random Marine",
            "power": 10,
            "img": `${imgLocation}/Ukkari-Anime-Infobox.webp`
        }
    ],
    "Durability": [
        {
            "name": "Nami",
            "power": 15,
            "img": `${imgLocation}/Nami-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Kaya",
            "power": 25,
            "img": `${imgLocation}/3449c49f8282bbc2427e4e5f98a22bce.jpg`
        },

        {
            "name": "Hogback",
            "power": 15,
            "img": `${imgLocation}/Hogback-Anime-Infobox.webp`
        },

        {
            "name": "Konis",
            "power": 15,
            "img": `${imgLocation}/Conis-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Duval",
            "power": 15,
            "img": `${imgLocation}/755be6a5e4180c4ab00783155cd49b45.webp`,
        },
        {
            "name": "Foxy",
            "power": 15,
            "img": `${imgLocation}/Foxy-Anime-Pre-Timeskip-Infobox.webp`,
        },
        {
            "name": "Usopp",
            "power": 22,
            "img": `${imgLocation}/Usopp-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Brook",
            "power": 36,
            "img": `${imgLocation}/Brook-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Chopper",
            "power": 40,
            "img": `${imgLocation}/Tony-Tony-Chopper-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Buggy",
            "power": 45,
            "img": `${imgLocation}/Buggy.webp`
        },
        {
            "name": "Franky",
            "power": 62,
            "img": `${imgLocation}/Franky-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Sanji",
            "power": 68,
            "img": `${imgLocation}/Sanji-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Jinbe",
            "power": 70,
            "img": `${imgLocation}/Jinbe-Anime-Infobox.webp`
        },
        {
            "name": "Urouge",
            "power": 72,
            "img": `${imgLocation}/Urouge-Anime-Infobox.webp`
        },
        {
            "name": "Zoro",
            "power": 75,
            "img": `${imgLocation}/294-C69-BF-16-A8-4978-8701-43-EBDC0-C425-F.webp`
        },
        {
            "name": "Queen",
            "power": 80,
            "img": `${imgLocation}/queen.webp`
        },
        {
            "name": "Kuma",
            "power": 80,
            "img": `${imgLocation}/Bartholomew-Kuma-Anime-Infobox.webp`
        },
        {
            "name": "Jack",
            "power": 82,
            "img": `${imgLocation}/Jack-Anime-Infobox.webp`
        },
        {
            "name": "Akainu",
            "power": 88,
            "img": `${imgLocation}/Sakazuki-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Garp",
            "power": 90,
            "img": `${imgLocation}/Monkey-D-Garp-Anime-Infobox.webp`
        },
        {
            "name": "BigMom",
            "power": 92,
            "img": `${imgLocation}/Charlotte-Linlin-Anime-Infobox.webp`
        },
        {
            "name": "Whitebeard",
            "power": 95,
            "img": `${imgLocation}/Edward-Newgate-Anime-Infobox.webp`
        },
        {
            "name": "Kaido",
            "power": 99,
            "img": `${imgLocation}/Kaidou-Anime-Infobox.webp`
        },
        {
            "name": "Random Marine",
            "power": 10,
            "img": `${imgLocation}/Ukkari-Anime-Infobox.webp`
        }
    ],
    "Intelligence": [
        {
            "name": "Luffy",
            "power": 32,
            "img": `${imgLocation}/Monkey-D-Luffy-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Kaya",
            "power": 45,
            "img": `${imgLocation}/3449c49f8282bbc2427e4e5f98a22bce.jpg`
        },

        {
            "name": "Hogback",
            "power": 35,
            "img": `${imgLocation}/Hogback-Anime-Infobox.webp`
        },

        {
            "name": "Konis",
            "power": 15,
            "img": `${imgLocation}/Conis-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Duval",
            "power": 15,
            "img": `${imgLocation}/755be6a5e4180c4ab00783155cd49b45.webp`,
        },
        {
            "name": "Foxy",
            "power": 15,
            "img": `${imgLocation}/Foxy-Anime-Pre-Timeskip-Infobox.webp`,
        },
        {
            "name": "Zoro",
            "power": 48,
            "img": `${imgLocation}/294-C69-BF-16-A8-4978-8701-43-EBDC0-C425-F.webp`
        },
        {
            "name": "Garp",
            "power": 60,
            "img": `${imgLocation}/Monkey-D-Garp-Anime-Infobox.webp`
        },
        {
            "name": "Sanji",
            "power": 55,
            "img": `${imgLocation}/Sanji-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Usopp",
            "power": 60,
            "img": `${imgLocation}/Usopp-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Kizaru",
            "power": 70,
            "img": `${imgLocation}/Borsalino-Anime-Infobox.webp`
        },
        {
            "name": "Franky",
            "power": 72,
            "img": `${imgLocation}/Franky-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Random Marine",
            "power": 10,
            "img": `${imgLocation}/Ukkari-Anime-Infobox.webp`
        },
        {
            "name": "Chopper",
            "power": 75,
            "img": `${imgLocation}/Tony-Tony-Chopper-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Crocodile",
            "power": 75,
            "img": `${imgLocation}/Crocodile-Anime-Infobox.webp`
        },
        {
            "name": "Nami",
            "power": 75,
            "img": `${imgLocation}/Nami-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "BigMom",
            "power": 50,
            "img": `${imgLocation}/Charlotte-Linlin-Anime-Infobox.webp`
        },
        {
            "name": "Doflamingo",
            "power": 85,
            "img": `${imgLocation}/Donquixote-Doflamingo-Anime-Infobox.webp`
        },
        {
            "name": "BennBeckman",
            "power": 85,
            "img": `${imgLocation}/Benn-Beckman-Anime-Infobox.webp`
        },
        {
            "name": "Sengoku",
            "power": 82,
            "img": `${imgLocation}/Sengoku-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Law",
            "power": 88,
            "img": `${imgLocation}/Trafalgar-D-Water-Law-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Blackbeard",
            "power": 82,
            "img": `${imgLocation}/Marshall-D-Teach-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Robin",
            "power": 87,
            "img": `${imgLocation}/Nico-robin-dressrosa-01.webp`
        },
        {
            "name": "Vegapunk",
            "power": 99,
            "img": `${imgLocation}/vegapunk.webp`
        }
    ],
    "Haki": [
        {
            "name": "Nami",
            "power": 5,
            "img": `${imgLocation}/Nami-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Kaya",
            "power": 5,
            "img": `${imgLocation}/3449c49f8282bbc2427e4e5f98a22bce.jpg`
        },

        {
            "name": "Hogback",
            "power": 5,
            "img": `${imgLocation}/Hogback-Anime-Infobox.webp`
        },

        {
            "name": "Konis",
            "power": 5,
            "img": `${imgLocation}/Conis-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Duval",
            "power": 5,
            "img": `${imgLocation}/755be6a5e4180c4ab00783155cd49b45.webp`,
        },
        {
            "name": "Foxy",
            "power": 5,
            "img": `${imgLocation}/Foxy-Anime-Pre-Timeskip-Infobox.webp`,
        },
        {
            "name": "Random Marine",
            "power": 10,
            "img": `${imgLocation}/Ukkari-Anime-Infobox.webp`
        },
        {
            "name": "Chopper",
            "power": 8,
            "img": `${imgLocation}/Tony-Tony-Chopper-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Robin",
            "power": 10,
            "img": `${imgLocation}/Nico-robin-dressrosa-01.webp`
        },
        {
            "name": "Brook",
            "power": 15,
            "img": `${imgLocation}/Brook-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Law",
            "power": 55,
            "img": `${imgLocation}/Trafalgar-D-Water-Law-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Doflamingo",
            "power": 60,
            "img": `${imgLocation}/Donquixote-Doflamingo-Anime-Infobox.webp`
        },
        {
            "name": "Sanji",
            "power": 80,
            "img": `${imgLocation}/Sanji-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Ace",
            "power": 55,
            "img": `${imgLocation}/Portgas-D-Ace-Anime-Infobox.webp`
        },
        {
            "name": "Zoro",
            "power": 82,
            "img": `${imgLocation}/294-C69-BF-16-A8-4978-8701-43-EBDC0-C425-F.webp`
        },
        {
            "name": "Akainu",
            "power": 85,
            "img": `${imgLocation}/Sakazuki-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Luffy",
            "power": 91,
            "img": `${imgLocation}/Monkey-D-Luffy-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Kaido",
            "power": 90,
            "img": `${imgLocation}/Kaidou-Anime-Infobox.webp`
        },
        {
            "name": "Katakuri",
            "power": 74,
            "img": `${imgLocation}/Charlotte-Katakuri-Anime-Infobox.webp`
        },
        {
            "name": "Garp",
            "power": 92,
            "img": `${imgLocation}/Monkey-D-Garp-Anime-Infobox.webp`
        },
        {
            "name": "Rayleigh",
            "power": 90,
            "img": `${imgLocation}/Silvers-Rayleigh-Anime-Infobox.webp`
        },
        {
            "name": "Whitebeard",
            "power": 95,
            "img": `${imgLocation}/Edward-Newgate-Anime-Infobox.webp`
        },
        {
            "name": "Shanks",
            "power": 98,
            "img": `${imgLocation}/Shanks-Anime-Infobox.webp`
        },
        {
            "name": "Roger",
            "power": 97,
            "img": `${imgLocation}/Gol-D-Roger.webp`
        },
        {
            "name": "JoyBoy",
            "power": 100,
            "img": `${imgLocation}/Joy_Boy_Anime_Infobox.webp`
        }
    ],
    "DevilFruit": [
        {
            "name": "Zoro",
            "power": 0,
            "img": `${imgLocation}/294-C69-BF-16-A8-4978-8701-43-EBDC0-C425-F.webp`
        },
        {
            "name": "Kaya",
            "power": 0,
            "img": `${imgLocation}/3449c49f8282bbc2427e4e5f98a22bce.jpg`
        },

        {
            "name": "Hogback",
            "power": 0,
            "img": `${imgLocation}/Hogback-Anime-Infobox.webp`
        },

        {
            "name": "Konis",
            "power": 0,
            "img": `${imgLocation}/Conis-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Duval",
            "power": 0,
            "img": `${imgLocation}/755be6a5e4180c4ab00783155cd49b45.webp`,
        },
        {
            "name": "Foxy",
            "power": 40,
            "img": `${imgLocation}/Foxy-Anime-Pre-Timeskip-Infobox.webp`,
        },
        {
            "name": "Random Marine",
            "power": 10,
            "img": `${imgLocation}/Ukkari-Anime-Infobox.webp`
        },
        {
            "name": "Sanji",
            "power": 0,
            "img": `${imgLocation}/Sanji-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Franky",
            "power": 0,
            "img": `${imgLocation}/Franky-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Nami",
            "power": 0,
            "img": `${imgLocation}/Nami-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Brook",
            "power": 35,
            "img": `${imgLocation}/Brook-Anime-Pre-Timeskip-Infobox.webp`
        },
        {
            "name": "Buggy",
            "power": 45,
            "img": `${imgLocation}/Buggy.webp`
        },
        {
            "name": "Chopper",
            "power": 55,
            "img": `${imgLocation}/Tony-Tony-Chopper-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Crocodile",
            "power": 62,
            "img": `${imgLocation}/Crocodile-Anime-Infobox.webp`
        },
        {
            "name": "Robin",
            "power": 65,
            "img": `${imgLocation}/Nico-robin-dressrosa-01.webp`
        },
        {
            "name": "Marco",
            "power": 75,
            "img": `${imgLocation}/Marco-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Ace",
            "power": 78,
            "img": `${imgLocation}/Portgas-D-Ace-Anime-Infobox.webp`
        },
        {
            "name": "Katakuri",
            "power": 82,
            "img": `${imgLocation}/Charlotte-Katakuri-Anime-Infobox.webp`
        },
        {
            "name": "Doflamingo",
            "power": 85,
            "img": `${imgLocation}/Donquixote-Doflamingo-Anime-Infobox.webp`
        },
        {
            "name": "Law",
            "power": 88,
            "img": `${imgLocation}/Trafalgar-D-Water-Law-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "BigMom",
            "power": 90,
            "img": `${imgLocation}/Charlotte-Linlin-Anime-Infobox.webp`
        },
        {
            "name": "Kaido",
            "power": 95,
            "img": `${imgLocation}/Kaidou-Anime-Infobox.webp`
        },
        {
            "name": "Blackbeard",
            "power": 97,
            "img": `${imgLocation}/Marshall-D-Teach-Anime-Post-Timeskip-Infobox.webp`
        },
        {
            "name": "Luffy",
            "power": 99,
            "img": `${imgLocation}/Monkey-D-Luffy-Anime-Post-Timeskip-Infobox.webp`
        }
    ],
    "Weapon": [
        {
            "name": "Kabuto",
            "power": 0,
            "img": `${CDN_BASE}/weapons/Sogeking_Kabuto.webp`
        },
        {
            "name": "Impact Dial",
            "power": 5,
            "img": `${CDN_BASE}/weapons/Dials_Infobox.webp`
        },
        {
            "name": "Clima-Tact",
            "power": 10,
            "img": `${CDN_BASE}/weapons/Sorcery_Clima-Tac2C_Second_Model.webp`
        },
        {
            "name": "Shigure",
            "power": 25,
            "img": `${CDN_BASE}/weapons/Shigure_Infobox.webp`
        },
        {
            "name": "Funkfreed",
            "power": 32,
            "img": `${CDN_BASE}/weapons/Funkfreed_Anime_Infobox.webp`
        },
        {
            "name": "Sandai Kitetsu",
            "power": 48,
            "img": `${CDN_BASE}/weapons/Sandai_Kitetsu_Infobox.webp`
        },
        {
            "name": "Shodai Kitetsu",
            "power": 55,
            "img": `${CDN_BASE}/weapons/Shodai-1.webp`
        },

        {
            "name": "Kikoku",
            "power": 65,
            "img": `${CDN_BASE}/weapons/Kikoku.webp`
        },
        {
            "name": "Murakumogiri",
            "power": 85,
            "img": `${CDN_BASE}/weapons/Murakumogiri_Infobox.webp`
        },
        {
            "name": "Enma",
            "power": 90,
            "img": `${CDN_BASE}/weapons/Enma_Anime.webp`
        },
        {
            "name": "Yoru",
            "power": 99,
            "img": `${CDN_BASE}/weapons/Yoru_Infobox.webp`
        }
    ],
    "Ship": [
        {
            "name": "AlvidaPirates",
            "power": 12,
            "img": `${CDN_BASE}/ships/Miss_Love_Duck_Infobox.webp`
        },
        {
            "name": "BuggyPirates",
            "power": 20,
            "img": `${CDN_BASE}/ships/Big_Top_Blaster_Infobox.webp`
        },
        {
            "name": "ArlongPirates",
            "power": 30,
            "img": `${CDN_BASE}/ships/Shark_Superb_Infobox.webp`
        },
        {
            "name": "GoingMerry",
            "power": 45,
            "img": `${CDN_BASE}/ships/Going_Merry_Infobox.webp`
        },
        {
            "name": "Baratie",
            "power": 50,
            "img": `${CDN_BASE}/ships/Baratie_Before_Timeskip.webp`
        },

        {
            "name": "VictoriaPunk",
            "power": 68,
            "img": `${CDN_BASE}/ships/Victoria_Punk_Infobox.webp`
        },
        {
            "name": "PolarTang",
            "power": 76,
            "img": `${CDN_BASE}/ships/Polar_Tang_Infobox.webp`
        },
        {
            "name": "ThousandSunny",
            "power": 81,
            "img": `${CDN_BASE}/ships/Thousand_Sunny_Infobox.webp`
        },
        {
            "name": "RedForce",
            "power": 80,
            "img": `${CDN_BASE}/ships/Red_Force_Infobox.webp`
        },
        {
            "name": "QueenMamaChanter",
            "power": 83,
            "img": `${CDN_BASE}/ships/Queen_Mama_Chanter_Infobox.webp`
        },
        {
            "name": "MobyDick",
            "power": 90,
            "img": `${CDN_BASE}/ships/Moby_Dick.webp`
        },
        {
            "name": "OroJackson",
            "power": 95,
            "img": `${CDN_BASE}/ships/Oro_Jackson_Infobox.webp`
        }
    ],
    "Crew": [
        {
            "name": "BuggyPirates",
            "power": 28,
            "img": `${CDN_BASE}/crews/Buggy_Pirates_Brand_New_World.webp`
        },
        {
            "name": "ArlongPirates",
            "power": 35,
            "img": `${CDN_BASE}/crews/Fish-Men_Infobox.webp`
        },
        {
            "name": "BaroqueWorks",
            "power": 55,
            "img": `${CDN_BASE}/crews/baroqueWorks.webp`
        },
        {
            "name": "HeartPirates",
            "power": 65,
            "img": `${CDN_BASE}/crews/Heart_Pirates_Members.webp`
        },
        {
            "name": "CrossGuild",
            "power": 85,
            "img": `${CDN_BASE}/crews/Crocodile_and_Mihawk_Threaten_Buggy.webp`
        },
        {
            "name": "Donquixote",
            "power": 78,
            "img": `${CDN_BASE}/crews/Donquixote_Pirates_Arrive_At_Minion_Island.webp`
        },
        {
            "name": "StrawHatPirates",
            "power": 80,
            "img": `${CDN_BASE}/crews/Straw_Hats_Stand_United_Against_Beasts_Pirates.webp`
        },
        {
            "name": "BlackbeardPirates",
            "power": 88,
            "img": `${CDN_BASE}/crews/New_Blackbeard_Pirates.webp`
        },
        {
            "name": "BeastPirates",
            "power": 90,
            "img": `${CDN_BASE}/crews/beast-pirates-v0-o7331u6r9ca41.webp`
        },
        {
            "name": "RedHairPirates",
            "power": 90,
            "img": `${CDN_BASE}/crews/Red_Hair_Pirates_at_Marineford.webp`
        },
        {
            "name": "BigMomPirates",
            "power": 87,
            "img": `${CDN_BASE}/crews/Charlotte_Family_Infobox.webp`
        },
        {
            "name": "WhitebeardPirates",
            "power": 95,
            "img": `${CDN_BASE}/crews/Bscap0010.webp`
        },
        {
            "name": "RocksPirates",
            "power": 99,
            "img": `${CDN_BASE}/crews/rank-all-the-rocks-pirates-in-this-picture-from-weakest-to-v0-4jp6xueoay6f1.webp`
        },
        {
            "name": "RogerPirates",
            "power": 97,
            "img": `${CDN_BASE}/crews/Roger_Pirates_Arrive_At_God_Valley.webp`
        }
    ],
    "Race": [
        {
            "name": "Human",
            "power": 30,
            "img": `${CDN_BASE}/races/Galley_La_Company.webp`
        },
        {
            "name": "Snakeneck",
            "power": 32,
            "img": `${CDN_BASE}/races/Snakeneck_Tribe_Infobox.webp`
        },
        {
            "name": "Longleg",
            "power": 35,
            "img": `${CDN_BASE}/races/LonglegTribe.webp`
        },
        {
            "name": "ModifiedHuman",
            "power": 45,
            "img": `${CDN_BASE}/races/Raid_Suit_Infobox.webp`
        },
        {
            "name": "Dwarf",
            "power": 50,
            "img": `${CDN_BASE}/races/Leo27s_Manga_Color_Scheme.webp`
        },
        {
            "name": "Cyborg",
            "power": 55,
            "img": `${CDN_BASE}/races/PX4_Is_Damaged.webp`
        },
        {
            "name": "Fishman",
            "power": 70,
            "img": `${CDN_BASE}/races/Fish-Men_Infobox.webp`
        },
        {
            "name": "Mink",
            "power": 78,
            "img": `${CDN_BASE}/races/Mink_Tribe_Infobox.webp`
        },
        {
            "name": "Giant",
            "power": 85,
            "img": `${CDN_BASE}/races/Giants_Infobox.webp`
        },

        {
            "name": "Lunarian",
            "power": 92,
            "img": `${CDN_BASE}/races/one-piece-lunarians.webp`
        },
        {
            "name": "Buccaneer",
            "power": 91,
            "img": `${CDN_BASE}/races/Buccaneers_Infobox.webp`
        }
    ]
}


export default gameWarsData;