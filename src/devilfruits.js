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

    {
        id: 21,
        img: {
            user: 'https://i.postimg.cc/50rtR3Fq/Hina-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/9Qm8Q5MM/qweqweqwe.png'
        },
        name: 'Bind-Bind Fruit',
        user: 'Hina',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Ori Ori no Mi is a Paramecia-type Devil Fruit that allows the user to bind their foes in iron shackles created by the user's body."
    },

    {
        id: 22,
        img: {
            user: 'https://www.gamescooper.com/wp-content/uploads/2023/10/Bellamy_talking_with_his_crew1-1.jpg',
            fruit: 'https://i.postimg.cc/zvJysjzy/qweqweqwe.png'
        },
        name: 'Spring-Spring Fruit',
        user: 'Bellamy',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Bane Bane no Mi is a Paramecia-type Devil Fruit that allows the user to turn their limbs into springs, making the user a Spring Human."
    },

    {
        id: 23,
        img: {
            user: 'https://i.postimg.cc/BQPjdXsc/Donquixote-Doflamingo-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/x80P6MBR/stringfruit.png'
        },
        name: 'String-String Fruit',
        user: 'Donquixote Doflamingo',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Ito Ito no Mi is a Paramecia-type Devil Fruit that allows the user to create and manipulate strings, making the user a String Human."
    },

    {
        id: 24,
        img: {
            user: 'https://i.postimg.cc/mrnNGhhY/Uma-Uma-no-Mi-Infobox.webp',
            fruit: 'https://i.postimg.cc/0j740DDd/38fb1bc3-c64e-416f-bfd5-bfe23ebfc12c.png'
        },
        name: 'Horse-Horse Fruit',
        user: 'Pierre',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Uma Uma no Mi is a Zoan-type Devil Fruit that allows its user to transform into a horse hybrid and a full horse at will."
    },

    {
        id: 25,
        img: {
            user: 'https://i.postimg.cc/qvF90JJK/Enel-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/rmGf3cZ5/38fb1bc3-c64e-416f-bfd5-bfe23ebfc12c.png'
        },
        name: 'Rumble-Rumble Fruit',
        user: 'Enel',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Logia',
        about: "The Goro Goro no Mi is a Logia-type Devil Fruit that grants the power to create, control, and become lightning at will, making the user a Lightning Human, it is one of the few abilities touted as 'invincible' according to Nico Robin."
    },

    {
        id: 26,
        img: {
            user: 'https://i.postimg.cc/VNm4xvp4/Foxy-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/RFnkFNCf/qweqe.png'
        },
        name: 'Slow-Slow Fruit',
        user: 'Foxy',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Noro Noro no Mi is a Paramecia-type Devil Fruit that allows the user to emit beams which temporarily slow down their target, making the user a Noroma Human."
    },

    {
        id: 27,
        img: {
            user: 'https://i.postimg.cc/GhYSsWC0/One-Piece-Kuzan-Cropped.avif',
            fruit: 'https://i.postimg.cc/bN3SLJ81/Icicle-fruit.webp'
        },
        name: 'Ice-Ice Fruit',
        user: 'Kuzan',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Logia',
        about: "The Hie Hie no Mi is a Logia-type Devil Fruit that allows the user to create, control, and transform into ice at will, turning them into a Freezing Human."
    },

    {
        id: 28,
        img: {
            user: 'https://i.postimg.cc/PxQ1jMGR/Blueno-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/JnN5hLXK/door-door-fruit.png'
        },
        name: 'Door-Door Fruit',
        user: 'Blueno',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Doa Doa no Mi is a Paramecia-type Devil Fruit that allows the user to create doors through anything they touch, making the user a Door Human. The doors they create can be created from any part of their body, from the palm of their hands to their whole body itself, and usually take the shape and form of the body part creating it. The doors remain as passageways anyone can pass through until closed completely."
    },

    {
        id: 29,
        img: {
            user: 'https://i.postimg.cc/sxydBsN2/Rob-Lucci-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/xdCK2mjf/1231231.png'
        },
        name: 'Cat-Cat Fruit Leopard Model',
        user: 'Rob Lucci',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Neko Neko no Mi, Model: Leopard is a Zoan-type Devil Fruit that allows its user to transform into a leopard hybrid and a full leopard at will, making the user a Leopard Human."
    },

    {
        id: 30,
        img: {
            user: 'https://i.postimg.cc/P5NWGZ5t/Funkfreed-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/GtWRxVzB/dwew.png'
        },
        name: 'Eleph-Eleph Fruit',
        user: 'Funkfreed',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Zou Zou no Mi is a Zoan-type Devil Fruit that allows the user to transform into an elephant hybrid and a full elephant at will."
    },

    {
        id: 31,
        img: {
            user: 'https://i.postimg.cc/L8DmPCdT/Jabra-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/L8LNQw4t/38fb1bc3-c64e-416f-bfd5-bfe23ebfc12c.png'
        },
        name: 'Mutt-Mutt Fruit Wolf Model',
        user: 'Jabra',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Inu Inu no Mi, Model: Wolf is a Zoan-type Devil Fruit that allows its user to transform into a wolf hybrid (which almost resembles a werewolf) and a full wolf at will, making the user a Wolf Human."
    },

    {
        id: 32,
        img: {
            user: 'https://i.postimg.cc/5NMbjHKb/Kaku-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/28q8BRr7/q.png'
        },
        name: 'Ox-Ox Fruit, Model: Giraffe',
        user: 'Kaku',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Ushi Ushi no Mi, Model: Giraffe is a Zoan-type Devil Fruit that allows its user to transform into a giraffe hybrid and a full giraffe at will, making the user a Giraffe Human."
    },


    {
        id: 33,
        img: {
            user: 'https://i.postimg.cc/sDF7XcRx/Kalifa-Anime-Post-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/QCZQRk8F/asssaads.png'
        },
        name: 'Bubble-Bubble Fruit',
        user: 'Kalifa',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Awa Awa no Mi is a Paramecia type Devil Fruit that allows the user to emit and control soap and bubbles that can not only clean off dirt but can also 'clean off' power, making the user a Soap Human."
    },

    {
        id: 34,
        img: {
            user: 'https://i.postimg.cc/6p8h4Qm5/Very-Good-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/FznDwkB8/qweqwe.png'
        },
        name: 'Berry-Berry Fruit',
        user: 'Very Good',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Beri Beri no Mi is a Paramecia-type Devil Fruit that allows the user to transform their body parts into a multitude of berry-like balls, making the user a Grape Human."
    },

    {
        id: 35,
        img: {
            user: 'https://i.postimg.cc/vTWSxZqN/Shu-Portrait.webp',
            fruit: 'https://i.postimg.cc/FHQD8SFd/qqweqweqe.png'
        },
        name: 'Rust-Rust Fruit',
        user: 'Shu',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Sabi Sabi no Mi is a Paramecia-type Devil Fruit that allows the user to cause metallic items to rust and break, making the user a Rust Human."
    },

    {
        id: 36,
        img: {
            user: 'https://i.postimg.cc/vmsQGNKv/Sharinguru-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Wheel-Wheel Fruit',
        user: 'Sharinguru',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Shari Shari no Mi is a Paramecia-type Devil Fruit that allows the user to rotate their body parts like wheels, making the user a Wheel Human."
    },

    {
        id: 37,
        img: {
            user: 'https://i.postimg.cc/g0t6fbzn/qweqwe.webp',
            fruit: 'https://i.postimg.cc/Gm1PQRtR/qwdeqeqweqweqwe.png'
        },
        name: 'Dark-Dark Fruit',
        user: 'Marshall D. Teach',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Logia',
        about: "The Yami Yami no Mi is a Logia-type Devil Fruit that allows the user to create, control, and transform into darkness at will, making the user a Darkness Human. This fruit is considered unique even for a Logia, and the ability it grants is said to be the most evil of all Devil Fruits."
    },

    {
        id: 38,
        img: {
            user: 'https://images.alphacoders.com/138/1381546.png',
            fruit: 'https://i.postimg.cc/mD6NNFzp/reviving-fruit.png'
        },
        name: 'Revive-Revive Fruit',
        user: 'Brook',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Yomi Yomi no Mi is a Paramecia-type Devil Fruit which enhances the user's soul to the point where they resurrect after their first death, allowing them to live a second time and to use several other soul-based abilities, making the user a Reviving Human."
    },

    {
        id: 39,
        img: {
            user: 'https://i.postimg.cc/TwfWsz4D/Perona-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/t4qwXJnS/aaad.png'
        },
        name: 'Hollow-Hollow Fruit',
        user: 'Perona',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Horo Horo no Mi is a Paramecia-type Devil Fruit that allows the user to conjure ghosts,[2] making the user a Ghost Human."
    },

    {
        id: 40,
        img: {
            user: 'https://i.postimg.cc/bvNKyJWY/Gecko-Moria-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/3ND1r53x/shadow-fruit.png'
        },
        name: 'Shadow-Shadow Fruit',
        user: 'Gecko Moria',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Kage Kage no Mi is a Paramecia-type Devil Fruit that gives the user the ability to manifest and control shadows of living creatures, including their own, as physical and tangible forms. The user, becoming a Ruler of Shadows, can steal the shadows of other beings and insert them into different bodies, living or dead, which in the latter case enables the creation of zombies."
    },

    {
        id: 41,
        img: {
            user: 'https://i.postimg.cc/1RC02zcc/Shiryu-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/Dy4pnNgN/transparent.png'
        },
        name: 'Clear-Clear Fruit',
        user: 'Shiryu',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Suke Suke no Mi is a Paramecia-type Devil Fruit that gives its user the ability to turn themselves and whatever they touch (living or nonliving) invisible, making them a Clear Human."
    },

    {
        id: 42,
        img: {
            user: 'https://i.postimg.cc/CKHYx5Fz/Eustass-Kid-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/BbRRgfqr/advvvvv.png'
        },
        name: 'Magnet-Magnet Fruit',
        user: 'Eustass Kid',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Jiki Jiki no Mi is a Paramecia-type Devil Fruit which allows the user to create magnetic forces and use them to control metal."
    },

    {
        id: 43,
        img: {
            user: 'https://i.postimg.cc/6p8gP37D/Trafalgar-D-Water-Law-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/TwVZc4y1/op-opfruit.png'
        },
        name: 'Op-Op Fruit',
        user: 'Trafalgar D. Water Law',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Ope Ope no Mi is a Paramecia-type Devil Fruit whose ability is to create a spherical domain, inside of which the user can freely rearrange, dismantle (without harm), and generally remodel/restructure anything and anyone (themself included) in a surgical way, making the user a Free Modification Human."
    },

    {
        id: 44,
        img: {
            user: 'https://criticalhits.com.br/wp-content/uploads/2022/12/880b1-16707165590366-1920.jpg',
            fruit: 'https://i.postimg.cc/rF5z68vY/light-fruit.png'
        },
        name: 'Glint-Glint Fruit',
        user: 'Borsalino',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Logia',
        about: "The Pika Pika no Mi is a Logia-type Devil Fruit that allows the user to create, control, and transform into light at will, turning the user into a Light Human. It enables the user to move at the speed of light and transport themself by means of reflection."
    },

    {
        id: 45,
        img: {
            user: 'https://i.postimg.cc/PJVsLVV7/Jewelry-Bonney-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Age-Age Fruit',
        user: 'Jewelry Bonney',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Toshi Toshi no Mi is a Paramecia-type Devil Fruit that allows the user to manipulate the ages of people or objects, making them an Age Manipulation Human."
    },

    {
        id: 46,
        img: {
            user: 'https://i.postimg.cc/nrFT8H28/Capone-Bege-Anime-Post-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Castle-Castle Fruit',
        user: 'Capone Bege',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Shiro Shiro no Mi is a Paramecia-type Devil Fruit that allows the user to become a living fortress, making the user a Castle Human."
    },

    {
        id: 47,
        img: {
            user: 'https://i.postimg.cc/jjRhnqVD/X-Drake-Anime-Post-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Dragon-Dragon Fruit, Allosaurus Model',
        user: 'X Drake',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Ancient Zoan',
        about: "The Ryu Ryu no Mi, Model: Allosaurus is an Ancient Zoan-type Devil Fruit that allows the user to transform into an allosaurus hybrid and a full allosaurus at will."
    },

    {
        id: 48,
        img: {
            user: 'https://i.postimg.cc/RZGzHF38/Basil-Hawkins-Anime-Post-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/5tNb7vdb/Wara-Wara-no-Mi.webp'
        },
        name: 'Straw-Straw Fruit',
        user: 'Basil Hawkinse',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Wara Wara no Mi is a Paramecia-type Devil Fruit that allows the user to create and manipulate straw at will, with the straw having damage-redirecting properties."
    },

    {
        id: 49,
        img: {
            user: 'https://i.postimg.cc/nVs7S9p4/Scratchmen-Apoo-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Tone-Tone Fruit',
        user: 'Scratchmen Apoo',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Oto Oto no Mi is a Paramecia-type Devil Fruit which allows the user to transform parts of their body into musical instruments and play music with a variety of destructive effects."
    },

    {
        id: 50,
        img: {
            user: 'https://i.postimg.cc/wvgfc5SQ/how-strong-is-boa-hancock-v0-6liup9grad9b1.jpg',
            fruit: 'https://i.postimg.cc/T2Zkt6MP/ss.png'
        },
        name: 'Love-Love Fruit',
        user: 'Boa Hancock',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Mero Mero no Mi is a Paramecia-type Devil Fruit that allows a range of attacks which use emotions of love, lust or adoration to transform opponents into stone."
    },

    {
        id: 51,
        img: {
            user: 'https://i.postimg.cc/kXH71DMb/Hebi-Hebi-no-Mi-Model-Anaconda-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Snake-Snake Fruit: Model Anaconda',
        user: 'Boa Sandersonia',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Hebi Hebi no Mi, Model: Anaconda is a Zoan-type Devil Fruit that allows its user to transform into an anaconda hybrid and a full anaconda at will."
    },

    {
        id: 52,
        img: {
            user: 'https://i.postimg.cc/CxyxMzyV/Hebi-Hebi-no-Mi-Modelo-Cobra.webp',
            fruit: 'https://i.postimg.cc/sgS91QvP/yuki.png'
        },
        name: 'Snake-Snake Fruit, Model: King Cobra',
        user: 'Boa Marigold',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Zoan',
        about: "The Hebi Hebi no Mi, Model: King Cobra is a Zoan-type Devil Fruit that allows its user to turn into a king cobra hybrid and a full king cobra at will. It can also give the user the ability to create and spit venom."
    },

    {
        id: 53,
        img: {
            user: 'https://i.postimg.cc/28BCtvcf/Magellan-01.webp',
            fruit: 'https://i.postimg.cc/wvdNtg11/poison-Fruit.png'
        },
        name: 'Venom-Venom Fruit',
        user: 'Magellan',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Doku Doku no Mi is a Paramecia-type Devil Fruit that grants the user the ability to produce and control different types of poison, as well as grants immunity to all forms of poison, making the user a Poison Human."
    },

    {
        id: 54,
        img: {
            user: 'https://criticalhits.com.br/wp-content/uploads/2023/12/shiki-from-one-piece.jpg',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Float-Float Fruit',
        user: 'Shiki',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Fuwa Fuwa no Mi is a Paramecia-type Devil Fruit that allows the user to levitate themselves and non-living things into the air."
    },

    {
        id: 55,
        img: {
            user: 'https://i.postimg.cc/qv1P1vs3/Emporio-Ivankov.jpg',
            fruit: 'https://i.postimg.cc/JnNBWv4j/Horu-Horu-no-Mi.webp'
        },
        name: 'Horm-Horm Fruit',
        user: 'Emporio Ivankov',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Horu Horu no Mi is a Paramecia-type Devil Fruit that grants the user the ability to create a variety of special hormones that can alter the recipient's body in any way the user desires, making the user a Hormone Controlling Human."
    },

    {
        id: 56,
        img: {
            user: 'https://i.postimg.cc/QCk8CZRJ/Fem-inazuma.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Snip-Snip Fruit',
        user: 'Inazuma',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Choki Choki no Mi is a Paramecia-type Devil Fruit that allows the user to transform parts of their body into scissors and cut solid objects as if they were paper, making the user a Scissors Human."
    },

    {
        id: 57,
        img: {
            user: 'https://i.postimg.cc/2SnsfxNn/Edward-Newgate-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/LXvRF3fx/quake-fruit.png'
        },
        name: 'Tremor-Tremor Fruit',
        user: 'Edward Newgate / Marshall D. Teach',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Gura Gura no Mi is a Paramecia-type Devil Fruit which allows the user to create vibrations, or quakes, making the user a Tremor Human."
    },

    {
        id: 58,
        img: {
            user: 'https://i.postimg.cc/W1R4nS7Z/Jozu-Burning-Will.webp',
            fruit: 'https://i.postimg.cc/6TxNdbN5/Gira-Gira-no-Mi.webp'
        },
        name: 'Twinkle-Twinkle Fruit',
        user: 'Jozu',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Kira Kira no Mi is a Paramecia-type Devil Fruit which allows the user to transform their body into diamond."
    },

    {
        id: 59,
        img: {
            user: 'https://i.postimg.cc/cLV56t00/Marco-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/2Sp4ZQbc/Phoenix-Fruit.webp'
        },
        name: 'Bird-Bird Fruit, Model: Phoenix',
        user: 'Marco',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Mythical Zoan',
        about: "The Tori Tori no Mi, Model: Phoenix is a Mythical Zoan-type Devil Fruit which bestows the power to transform into a phoenix (and phoenix hybrid) at will."
    },

    {
        id: 60,
        img: {
            user: 'https://i.postimg.cc/wv0KG5sg/Blamenco-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Pocket-Pocket Fruit',
        user: 'Blamenco',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Poke Poke no Mi is a Paramecia-type Devil Fruit that allows the user to create pockets on their body."
    },

    {
        id: 61,
        img: {
            user: 'https://i.postimg.cc/CxTFDNGQ/Sakazuki-Anime-Post-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/pX9fy2CB/qwfdfdsdf.png'
        },
        name: 'Mag-Mag Fruit',
        user: 'Sakazuki',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Logia',
        about: "The Magu Magu no Mi is a Logia-type Devil Fruit that allows the user to create, control, and transform into magma at will, turning the user into a Magma Human."
    },

    {
        id: 62,
        img: {
            user: 'https://i.postimg.cc/HkrdfNpn/Tsuru-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Wash-Wash Fruit',
        user: 'Tsuru',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Woshu Woshu no Mi is a Paramecia-type Devil Fruit that allows the user to literally wash and hang out to dry people and objects as if they were clothes, making the user a Laundry Human."
    },

    {
        id: 63,
        img: {
            user: 'https://i.postimg.cc/Wp79vb3Y/Black-Maria-Anime-Infobox.webp',
            fruit: 'https://i.postimg.cc/52zLfng9/Tsuchigumo-Fruit.webp'
        },
        name: 'Spider-Spider Fruit',
        user: 'Black Maria',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Ancient Zoan',
        about: "The Kumo Kumo no Mi, Model: Rosamygale Grauvogeli is an Ancient Zoan-type Devil Fruit that allows the user to transform into a hybrid and full version of a Rosamygale grauvogeli, an ancient species of spider. "
    },

    {
        id: 64,
        img: {
            user: 'https://i.postimg.cc/t4L0xCFt/Sengoku-Anime-Pre-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Human-Human Fruit, Model: Buddha',
        user: 'Sengoku',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Mythical Zoan',
        about: "The Hito Hito no Mi, Model: Daibutsu is a Mythical Zoan-type Devil Fruit that allows its user to transform into a Daibutsu (a giant gold Buddha) at will. "
    },

    {
        id: 63,
        img: {
            user: 'https://i.postimg.cc/CKBqcJBp/Sanjuan-Wolf-Anime-Post-Timeskip-Infobox.webp',
            fruit: 'https://i.postimg.cc/Sxp09zGS/unkown.png'
        },
        name: 'Huge-Huge Fruit',
        user: 'Sanjuan Wolf',
        previousUser: 'Unkown',
        rarity: 5,
        power: 9,
        type: 'Paramecia',
        about: "The Deka Deka no Mi is a Paramecia-type Devil Fruit that allows its user to drastically enlarge their body, making them a Gigantification Human. "
    },


























]

export default allFruits