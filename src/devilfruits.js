const allFruits = [

    {
        id: 1,
        img: {
            user: 'https://img.assinaja.com/upl/lojas/mundosinfinitos/imagens/foto-one-piece.png',
            fruit: 'https://i.postimg.cc/C1XQnH1s/devil-fruits-gum-gum-v0-jg23fdldypdc1.png'
        },
        name: 'Gum-Gum Fruit',
        user: 'Monkey D. Luffy',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: "Paramecia",
        about: "The Gomu Gomu no Mi is a Paramecia-type Devil Fruit that grants the user's body the properties of rubber, effectively making them a Rubber Human"
    },


    {
        id: 2,
        img: {
            user: 'https://geekdama.com.br/wp-content/uploads/2022/08/one-piece-fanart-buggy-postcover.jpg',
            fruit: 'https://64.media.tumblr.com/53bd13ba1a46aaedeb374b1c382fcb1f/0f31d8a34c73b840-46/s1280x1920/619703eb7ef29fd79e60217e18169663e029f5fe.pnj'
        },
        name: 'Chop-Chop Fruit',
        user: 'Buggy',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Bara Bara no Mi is a Paramecia-type Devil Fruit that allows the user to split their own body into pieces and control said pieces however they wish, as well as making the user immune to slashing attacks, making the user a Splitting Human"
    },


    {
        id: 3,
        img: {
            user: 'https://staticg.sportskeeda.com/editor/2023/05/ca5cb-16833681547269-1920.jpg?w=640',
            fruit: 'https://i.postimg.cc/fbj81zjf/Moku-Moku-no-Mi-Infobox.png'
        },
        name: 'Plume-Plume Fruit',
        user: 'Smoker',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Logia',
        about: "The Moku Moku no Mi is a Logia-type Devil Fruit that allows the user to create, control, and transform into smoke at will, making the user a Smoke Human."
    },


    {
        id: 4,
        img: {
            user: 'https://i.ytimg.com/vi/lMKAu4rSpT0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLB4k9lVIPvS86NYWRjil6h9c9sKFw',
            fruit: 'https://i.postimg.cc/MZDmw3Bq/Moku-Moku-no-Mi-Infobox.png'
        },
        name: 'Smooth-Smooth Fruit',
        user: 'Alvida',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Sube Sube no Mi is a Paramecia-type Devil Fruit that makes the user's body smooth and slippery, which in turn makes most attacks and objects slide off their body, protecting the user from harm in most situations. As seen with Alvida, if one is overweight in any way they will become slim by having the excess fat 'slip off'."
    },

    {
        id: 5,
        img: {
            user: 'https://upload.wikimedia.org/wikipedia/fi/3/3b/Miss_Valentine.png',
            fruit: 'https://i.postimg.cc/rw6mPMpm/Moku-Moku-no-Mi-Infobox.png'
        },
        name: 'Kilo-Kilo fruit',
        user: 'Mikita',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Kiro Kiro no Mi is a Paramecia-type Devil Fruit that allows the user to change their weight from 1 to 10,000 kilograms without, in any way, affecting the overall size of their body."
    },

    {
        id: 6,
        img: {
            user: 'https://i.ytimg.com/vi/j5erACa2vRU/maxresdefault.jpg',
            fruit: 'https://i.postimg.cc/Y04jbktw/1231.png'
        },
        name: 'Bomb-Bomb fruit',
        user: 'Gem',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Bomu Bomu no Mi is a Paramecia-type Devil Fruit that allows the user to make any part of their body explode, whether it be their limbs, hair, mucus, even breath or cough, making the user a Bomb Human."
    },

    {
        id: 7,
        img: {
            user: 'https://geekdama.com.br/wp-content/uploads/2023/05/one-piece-nico-robin-postcover.jpg',
            fruit: 'https://i.postimg.cc/j2ZKx0K6/flower-flower-fruit.gif'
        },
        name: 'Flower-Flower fruit',
        user: 'Nico Robin',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Hana Hana no Mi is a Paramecia-type Devil Fruit that allows the user to replicate and sprout pieces of their body from the surface of any object or living thing. As further allusion to this, pinkish-white petal-like particles form at and then swirl away from where the parts sprout and vanish, as well as around the user itself. "
    },

    {
        id: 8,
        img: {
            user: 'https://i.postimg.cc/xC1R0zMR/ImageMr3.webp',
            fruit: 'https://i.postimg.cc/85zFFdy7/Doru-Doru-no-Mi-Infobox.png'
        },
        name: 'Wax-Wax Fruit',
        user: 'Galdino',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Doru Doru no Mi is a Paramecia-type Devil Fruit that allows the user to create large quantities of candle wax from their body and control it, making the user a Candle Human"
    },

    {
        id: 9,
        img: {
            user: 'https://i.pinimg.com/736x/74/09/9f/74099f7eaf674d881e776d3a25e3d4a2.jpg',
            fruit: 'https://i.postimg.cc/3N3LVxZM/sandsandfruit.png'
        },
        name: 'Sand-Sand Fruit',
        user: 'Crocodile',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Logia',
        about: "The Suna Suna no Mi is a Logia-type Devil Fruit that allows the user to create, control, and transform into sand at will, turning the user into a Sand Human"
    },

    {
        id: 10,
        img: {
            user: 'https://i.postimg.cc/CxwzyDYJ/Wapol-Anime-Post-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/GpQthp3r/Baku-Baku-no-Mi-Infobox.png'
        },
        name: 'Munch-Munch Fruit',
        user: 'Wapol',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Baku Baku no Mi is a Paramecia-type Devil Fruit that allows the user to eat otherwise-inedible objects, then later manifesting them from their body. It was eaten by Wapol."
    },

    {
        id: 11,
        img: {
            user: 'https://i.postimg.cc/wxZ8TDC6/Dalton-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/KcPGVqK6/ox-oxfruit.png'
        },
        name: 'Ox-Ox Fruit',
        user: 'Dalton',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Ushi Ushi no Mi, Model: Bison is a Zoan-type Devil Fruit that allows its user to transform into a full bison or a half-bison hybrid at will."
    },

    {
        id: 12,
        img: {
            user: 'https://i.postimg.cc/YCkXpxxL/Tony-Tony-Chopper.webp',
            fruit: 'https://i.postimg.cc/jd8XbrCm/humahumafruit.png'
        },
        name: 'Human-Human Fruit',
        user: 'Tony Tony Chopper',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Hito Hito no Mi is a Zoan-type Devil Fruit that allows its user to transform into a human hybrid or a human at will."
    },

    {
        id: 13,
        img: {
            user: 'https://i.postimg.cc/Dzmj4w4q/Bentham-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/fTmhkBQw/Ushi-Ushi-no-Mi-Model-Bison-Infobox.png'
        },
        name: 'Clone-Clone Fruit',
        user: 'Bentham',
        previousUser: 'Kurozumi Higurashi',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Mane Mane no Mi is a Paramecia-type Devil Fruit that allows the user to turn themselves into a physical double of anyone they touch, making the user an Imitating Human"
    },

    {
        id: 14,
        img: {
            user: 'https://i.postimg.cc/Gmkt0Yc2/Sabo-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/cHS0R12b/flameflamefruit.png'
        },
        name: 'Flame-Flame Fruit',
        user: 'Portgas D. Ace / Sabo',
        previousUser: 'Portgas D. Ace',
        rarity: 5,
        power: 9,
        type: 'Logia',
        about: "The Mera Mera no Mi is a Logia-type Devil Fruit that allows the user to create, control, and transform into fire at will."
    },

    {
        id: 15,
        img: {
            user: 'https://i.postimg.cc/rsDwwVHZ/daz-bonez-5c56fffc682f7p.jpg',
            fruit: 'https://i.postimg.cc/t4BSb9hV/Supa-Supa-no-Mi-Infobox.png'
        },
        name: 'Dice-Dice Fruit',
        user: 'Daz Bonez',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Supa Supa no Mi is a Paramecia-type Devil Fruit that enables the user's body to gain characteristics of a steel blade to attack opponents with, making the user a Full-Body Bladed Human."
    },


    {
        id: 16,
        img: {
            user: 'https://i.postimg.cc/1t1sG0fS/Pell-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/7LVTdL7p/Supa-Supa-no-Mi-Infobox.png'
        },
        name: 'Tweet-Tweet Fruit',
        user: 'Pell',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Tori Tori no Mi, Model: Falcon is a Zoan-type Devil Fruit that allows its user to transform into a falcon hybrid and a full falcon at will. It was eaten by Pell, and according to him, it is one of the only five types of flying powers ever discovered."
    },

    {
        id: 17,
        img: {
            user: 'https://i.postimg.cc/6qWPNcHB/Yamato-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/SNjQpfYS/qweqew.png'
        },
        name: 'Dog-Dog Fruit, Model: Okuchi',
        user: 'Yamato',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Mythical Zoan',
        about: "The Inu Inu no Mi, Model: Okuchi no Makami is a Mythical Zoan-type Devil Fruit that allows the user to transform into a hybrid and full version of an ancient wolf deity at will."
    },

    {
        id: 18,
        img: {
            user: 'https://i.postimg.cc/bJCjMwbv/b287798-qpmo-QUPvyr-QE.png',
            fruit: 'https://i.postimg.cc/0jqZvLSJ/d4304e25-4945-44f6-9482-8b51b8eeb0cb.png'
        },
        name: 'Mutt-Mutt Fruit',
        user: 'Lassoo',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Inu Inu no Mi, Model: Dachshund is a Zoan-type Devil Fruit that allows its user to transform into a dachshund hybrid and a full dachshund at will."
    },


    {
        id: 19,
        img: {
            user: 'https://i.postimg.cc/t4bn9975/Mogu-Mogu-no-Mi-Infobox.webp',
            fruit: 'https://i.postimg.cc/CKBRN52w/Mogu-Mogu-8359.png'
        },
        name: 'Mole-Mole Fruit',
        user: 'Drophy',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Mogu Mogu no Mi is a Zoan-type Devil Fruit that allows its user to transform into a mole hybrid and a full mole at will, making the user a Mole Human."
    },


    {
        id: 20,
        img: {
            user: 'https://i.postimg.cc/hPqgZrCJ/Toge-Toge-no-Mi-Infobox.webp',
            fruit: 'https://i.postimg.cc/15JF9fVK/spike-fruit.png'
        },
        name: 'Spike-Spike Fruit',
        user: 'Zala',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Toge Toge no Mi is a Paramecia-type Devil Fruit that allows the user to grow spikes on any part of their body, and turn any body part entirely into a spike, making the user a Spike Human."
    },

    {
        id: 20,
        img: {
            user: 'https://i.postimg.cc/fWgG9vdt/Chaka.webp',
            fruit: 'https://i.postimg.cc/VNSwWdYY/jackal.png'
        },
        name: 'Dog-Dog Fruit, Model: Jackal',
        user: 'Chaka',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Inu Inu no Mi, Model: Jackal[1] is a Zoan-type Devil Fruit that allows its user to transform into a jackal hybrid and a full jackal at will."
    },























]

export default allFruits