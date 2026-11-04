// Productos reales de kimicrochet.empretienda.com.ar, cargados a mano.
//
// Cada producto es un objeto con:
//   id          identificador único (también desempata URLs si dos productos se llaman igual)
//   name        nombre que se muestra en la card y en la página del producto
//   description texto propio del producto (opcional). La aclaración de "hecho a mano" la agrega
//               la página del producto, no hace falta repetirla acá
//   price       en pesos, como número
//   category    agrupa los productos en el menú y en los filtros (Amigurumis, Decoración, Keycharms)
//   images      URLs de las fotos; la primera es la portada
//   featured    true para que aparezca primero en "Los más vendidos" (opcional)
//   unavailable true para mostrarlo como "Sin stock" y que no se pueda sumar al carrito (opcional)
//   variants    selector de variantes (opcional):
//                 name    título del selector (Color, Con llavero...)
//                 values  cada opción con su name y sus photos; si una opción tiene fotos,
//                         la galería muestra esas al elegirla (si no, las de images)
//   emoji       se muestra en lugar de la foto si no hay imagen
const PRODUCTS = [
  {
    id: "1",
    name: "Monito",
    description: `
Medidas
Alto: 7cm aprox.
Ancho: 7cm aprox.`,
    price: 4950,
    category: "Amigurumis",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/5647beb81a3c9e183f2f7c787984bfdbb93a4874a5ab0308f04b44dccdfb9011423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/dc836c46b21fc23515f995863b05948850e9bd8c01b93d40130094e7762dd775423370.jpg",
    ],
    variants: {
      name: "Con llavero",
      values: [
        { name: "Si", photos: [] },
        { name: "No", photos: [] },
      ],
    },
    emoji: "🐒",
  },
  {
    id: "2",
    name: "Osito chocolate",
    description: `Medidas
Alto: 10cm aprox.
Ancho: 11cm aprox.`,
    price: 15950,
    category: "Amigurumis",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/2ed5beba241e04f20984598629cd54df55563453d63aaf2494fae8e0bf31bd71423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/579df3946e11773331c968b92f57581257aaa33ef6155d257f33181202820917423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/bfad7289ad63d254a8eb644bf51318f668759d5e81b9c346c8137b2c3d7c3f65423370.jpg",
    ],
    emoji: "🧸",
  },
  {
    id: "3",
    name: "Osito strawberry",
    description: `Medidas
Alto: 10cm aprox.
Ancho: 11cm aprox.`,
    price: 15950,
    category: "Amigurumis",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/42f7a9dccd500f38ff444f182ecb14ac54ba301ce54370dce26177656546575a423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/dcf7f2ed3f3ff3cc01e741cf3b6662543bf8f5d05710e091d00938e456365ac3423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/f223767ff5ecb99e457925688e1192ead1691d5da1ea4855aa4f4059b1cbb470423370.jpg",
    ],
    emoji: "🍓",
  },
  {
    id: "4",
    name: "Plushie bunny frutillita",
    description: `Conejito súper cute con jardinero rosa y vincha pastel, con relleno de vellón.
*ACLARACIÓN* 🚫 La vestimenta NO es removible.
Medidas
Alto: 16cm aprox.
Ancho: 10cm aprox.
¿No sabés como cuidarlo? En nuestras historias destacadas tenemos una guía 😄.`,
    price: 28098,
    category: "Amigurumis",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/dd9d04449d429e0974a6870f96ba1b7da2e1d19267b2da25a5290d075124f939423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/52397663d061042f88b1a33af770efe903ab8d7f267876aa988a9a6fb1dfa192423370.jpg",
    ],
    emoji: "🐰",
  },
  {
    id: "5",
    name: "Plushie bunny tomatito",
    description: `Conejito súper cute con jardinero celeste y vincha de tomatito, con relleno de vellón.
*ACLARACIÓN* 🚫 La vestimenta NO es removible.
Medidas
Alto: 16cm aprox.
Ancho: 10cm aprox.
¿No sabés como cuidarlo? En nuestras historias destacadas tenemos una guía 😄.`,
    price: 28098,
    category: "Amigurumis",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/2c806fb5bf6c67ad4b70e9cee603fa961402ada65d0689b12bca2ab878f5dfea423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/62b215c6bda0175a26354e7aefc2230e4a3388a999761dfd824cc9058d556f70423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/8b178e84e66171a7d9de22c54bd43605db194f5cfcdcbfcee936bfba60079130423370.jpg",
    ],
    emoji: "🍅",
  },
  {
    id: "6",
    name: "Banner heart",
    description: `Filet crochet con dos extremos para colgarlo.
alto: 15cm aprox
ancho: 43cm aprox`,
    price: 22000,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/e81a48f9f80753f9cda4dfd2922417b2eb06f770776a23b2237f47e3e5b3f400423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/84eba1b671456691c7c06eeca1dd7100916b9f6f32a4314bbc6ae6b2bf9a62f9423370.jpg",
    ],
    emoji: "💗",
  },
  {
    id: "7",
    name: "Bunny filet crochet",
    description: `Medidas
Ancho: 10cm aproximadamente
Largo: 12cm aproximadamente`,
    price: 5500,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/dbd06336b8e52531350dcfca987237d5c249a15df35fcb9c43a42cc3ee294f19423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/6a33fc4bfcaabef2ed49289352281dd76f8d3ef192544f25bda680058ed7e031423370.jpg",
    ],
    emoji: "🐰",
  },
  {
    id: "8",
    name: "Colgante de botones",
    description: `Colgante de 3 botones hecho con hilo de algodón
Largo: 40cm aprox
Ancho: 16cm
Los productos pueden tardar hasta 7 días en ser enviados`,
    price: 37950,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/f9d2acb3b15bfa41ac91569eea85e6e4cba5cdd4a42e635fd729d60de56313fd423370.jpg",
    ],
    emoji: "🪡",
  },
  {
    id: "9",
    name: "Enredadera lilies blancas",
    description: `Medidas
Largo: 100cm aprox.`,
    price: 15081,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/e11eb640ae5fbb1759e568dd89281feb757780ad053d8d2eccfe71f6100687c8423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/b43eaf14dc49170748a6dce28712253d9884482627cdc0af8b9c5c76f549a404423370.jpg",
    ],
    emoji: "🤍",
  },
  {
    id: "10",
    name: "Enredadera lilies rosas",
    description: `Medidas
Largo: 100cm aprox.`,
    price: 15081,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/6af237c112af117468f591128ff6473ba128e96a475b5ae888f1a0f583953300423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/8748d4c00b8becf100930836b2f014ecc3ce7c1c806e7e8cbae3e56946ac5929423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/c57f77621ab55496afe9e32c61a10ffec20d60610d607fc21207a8ca97eaaffd423370.jpg",
    ],
    emoji: "🌸",
  },
  {
    id: "11",
    name: "Mini bunny tapiz",
    price: 3300,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/1f9c67b7561e1a94827f150d9be5677b957a93bc8672456e23a55b3bcc37af63423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/4e6dd7de04e1358884a2642a5278d4a7a81a9ce8c1958c9cae034d13439e074b423370.jpg",
    ],
    emoji: "🐇",
  },
  {
    id: "12",
    name: "Moño filet crochet",
    description: `Medidas
Ancho: 12cm aproximadamente
Largo: 15cm aproximadamente`,
    price: 5500,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/438453a342d3ef6816186f99d16f660fcd0f6b0194b8d3e69d63013bd6ff71c5423370.jpg",
    ],
    emoji: "🎀",
  },
  {
    id: "13",
    name: "Tapiz bunny",
    price: 44000,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/68cd21c6cc5eb6500948897a421e5c27a843b32c6d8ed20985f9a55505764953423370.jpg",
    ],
    emoji: "🐰",
  },
  {
    id: "14",
    name: "Tapiz cisne",
    price: 6600,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/a8d4012abff874087e28fca320a2082ecc4b75305d32e2e456f53fe697389d8b423370.jpg",
    ],
    emoji: "🦢",
  },
  {
    id: "15",
    name: "Tapiz gatito",
    description: `Alto:16cm aprox
Ancho: 16cm aprox`,
    price: 8800,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/d95891ce865cbed9eb4818e24a8f8086714d7d77c66c4c31eea2127d7f36bd54423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/693b9e93967b03b29ecb59b9af57ab32d729a1c41d237e0c3eaeb3140bd874c8423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/39ca1000d17152f3f3aec22cb5f08e2964bf8a6a41c91a062e7e2a5edaa7a076423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/b3c10f93533ccdd2b9e718089514ac4c063d2a1a9f92acf4bbd62fa0a18e0713423370.jpg",
    ],
    variants: {
      name: "Color",
      values: [
        { name: "Rosa y marrón", photos: [] },
        { name: "Celeste y blanco", photos: [] },
      ],
    },
    emoji: "🐱",
  },
  {
    id: "16",
    name: "Tapiz gatitos enamorados",
    price: 8360,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/8f59a18beae140cff5e031de73141bc8406858962a47983c789e876ab407c80f423370.jpg",
    ],
    unavailable: true,
    emoji: "😻",
  },
  {
    id: "17",
    name: "Tapiz pajaritos",
    description: `Tapiz hecho con la técnica de fillet crochet e hilo de algodón color crema. Ideal para poner dentro de un cuadro!
Altura: 18cm aprox
Ancho: 40cm aprox
Las medidas son aproximadas porque cada tejido esta hecho a mano!`,
    price: 82500,
    category: "Decoración",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/bd7150bde478c781f657a9b09907a69bc6208d7856c5a00c5b6a03a1bc422951423370.jpg",
    ],
    emoji: "🐦",
  },
  {
    id: "18",
    name: "Keycharm tomatito",
    description: `*ACLARACIÓN* 🚫 La vestimenta NO es removible.
Medidas
Alto: 15cm (+5cm del llavero) aprox.
Ancho: 11cm aprox.`,
    price: 18560,
    category: "Keycharms",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/156a3e1298dc6c7513b20f37afc56736ed06941113e50ec4631ea8dbd3c5314e423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/f5cf1bd3f5e8822106f052d2d7b6d9369480ed99cd13204dd1177d20e90f5f7d423370.jpg",
    ],
    emoji: "🍅",
  },
  {
    id: "19",
    name: "Llavero bunny",
    price: 7700,
    category: "Keycharms",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/25b40a5ec41bfdf9cf5a81e50fef38222be3725be03b2e031f6e5a63c75b33ca423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/9ed8c5d347fbfaf0bbdf45671d4145476f0d683cdfc907a327fe2cd21685c99a423370.jpg",
    ],
    variants: {
      name: "Variante",
      values: [
        { name: "Con moño", photos: [] },
        { name: "Sin moño", photos: [] },
      ],
    },
    emoji: "🐰",
  },
  {
    id: "20",
    name: "Llavero strawberry",
    description: `Medidas
Alto: 7cm aprox.
Ancho: 8cm aprox.
¿No sabés como cuidarlo? En nuestras historias destacadas tenemos una guía 😄.`,
    price: 7035,
    category: "Keycharms",
    images: [
      "https://d22fxaf9t8d39k.cloudfront.net/9ca91c19a833903337f938c8f65624640b03f8affb912f9c4be5a0018d078efa423370.jpg",
      "https://d22fxaf9t8d39k.cloudfront.net/a048340e33104397997cd0ef420e7d822ea9c6d23e9fea113126a4ce40171f34423370.jpg",
    ],
    emoji: "🍓",
  },
];

// completa los campos opcionales para que el resto de la app no tenga que chequearlos
export const products = PRODUCTS.map((p) => ({
  description: "",
  featured: false,
  unavailable: false,
  variants: null,
  emoji: "🧶",
  ...p,
}));
