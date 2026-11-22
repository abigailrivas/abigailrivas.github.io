// Productos reales de kimicrochet.empretienda.com.ar, cargados a mano.
//
// Cada producto es un objeto con:
//   id          identificador único; también es su URL (/productos/2)
//   name        nombre que se muestra en la card y en la página del producto
//   description texto propio del producto (opcional). La aclaración de "hecho a mano" la agrega
//               la página del producto, no hace falta repetirla acá
//   price       en pesos, como número
//   category    agrupa los productos en el menú y en los filtros (Amigurumis, Decoración, Keycharms)
//   images      URLs de las fotos; la primera es la portada
//   featured    true para que aparezca primero en "Los más vendidos" (opcional)
//   unavailable true para mostrarlo como "Sin stock" y que no se pueda sumar al carrito (opcional)
//   variants    lista de selectores de variantes (opcional); cada uno con:
//                 name    título del selector (Color, Con llavero...)
//                 values  cada opción con su name y sus photos; si una opción tiene fotos,
//                         la galería muestra esas al elegirla (si no, las de images).
//                         Con color (ej. '#78412c') la opción se muestra como una cajita de ese color.
//                         Con extra (ej. 200) elegirla suma eso al precio
//   emoji       se muestra en lugar de la foto si no hay imagen
const PRODUCTS = [
  {
    id: "1",
    name: "Monito",
    description: `
Medidas
Alto: 7cm aprox.
Ancho: 7cm aprox.`,
    price: 3500,
    category: "Amigurumis",
    images: [
      "/img/productos/monito-1.jpg",
      "/img/productos/monito-2.jpg",
    ],
    variants: [
      {
        name: "Con llavero",
        values: [
          { name: "No", photos: [] },
          { name: "Sí", extra: 200, photos: [] },
        ],
      },
      {
        name: "Color",
        values: [
          {
            name: "Chocolate",
            color: "#78412c",
            photos: [],
          },
          { name: "Caramelo", color: "#C26C0F", photos: [] },
          { name: "Naranja", color: "#d75113ff", photos: [] },
        ],
      },
    ],
    emoji: "🐒",
  },
  {
    id: "2",
    name: "Osito con bufanda",
    description: `Material:
    Hilo de algodón.
    Medidas:
Alto: 10cm aprox.
Ancho: 11cm aprox.`,
    price: 13500,
    category: "Amigurumis",
    images: [
      "/img/productos/osito-con-bufanda-1.jpg",
      "/img/productos/osito-con-bufanda-2.jpg",
      "/img/productos/osito-con-bufanda-3.jpg",
      "/img/productos/osito-con-bufanda-4.jpg",
      "/img/productos/osito-con-bufanda-5.jpg",
      "/img/productos/osito-con-bufanda-6.jpg",
    ],
    variants: [
      {
        name: "Color del osito",
        values: [
          {
            name: "Chocolate",
            color: "#78412c",
            photos: [
              "/img/productos/osito-con-bufanda-1.jpg",
              "/img/productos/osito-con-bufanda-2.jpg",
              "/img/productos/osito-con-bufanda-3.jpg",
            ],
          },
          { name: "Caramelo", color: "#C26C0F", photos: [] },
          { name: "Blanco", color: "#FFFFFF", photos: [] },
          { name: "Frutilla", color: "#FFCCD3", photos: [] },
        ],
      },
      {
        name: "Color de bufanda",
        values: [
          { name: "Frutilla", color: "#FFCCD3", photos: [] },
          { name: "Blanco", color: "#FFFFFF", photos: [] },
          { name: "Manteca", color: "#FFF1A8", photos: [] },
          { name: "Caramelo", color: "#C26C0F", photos: [] },
          { name: "Chocolate", color: "#78412c", photos: [] },
          { name: "Celeste", color: "#A9D8F5", photos: [] },
          { name: "Verde musgo", color: "#6B7A3A", photos: [] },
          { name: "Sin bufanda", photos: [] },
        ],
      },
      {
        name: "Color de moño",
        values: [
          { name: "Frutilla", color: "#FFCCD3", photos: [] },
          { name: "Blanco", color: "#FFFFFF", photos: [] },
          { name: "Manteca", color: "#FFF1A8", photos: [] },
          { name: "Caramelo", color: "#C26C0F", photos: [] },
          { name: "Chocolate", color: "#78412c", photos: [] },
          { name: "Celeste", color: "#A9D8F5", photos: [] },
          { name: "Verde musgo", color: "#6B7A3A", photos: [] },
          { name: "Sin moño", photos: [] },
        ],
      },
      {
        name: "Con llavero",
        values: [
          { name: "No", photos: [] },
          { name: "Sí", extra: 200, photos: [] },
        ],
      },
    ],
    emoji: "🧸",
  },
  {
    id: "4",
    name: "Conejo tomatito",
    description: `Conejito súper cute con jardinero celeste y vincha de tomatito, con relleno de vellón.
*ACLARACIÓN* 🚫 La vestimenta NO es removible.
Medidas
Alto: 16cm aprox.
Ancho: 10cm aprox.
`,
    price: 16200,
    category: "Amigurumis",
    images: [
      "/img/productos/conejo-tomatito-1.jpg",
      "/img/productos/conejo-tomatito-2.jpg",
    ],
    emoji: "🍅",
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
      "/img/productos/bunny-filet-crochet-1.jpg",
      "/img/productos/bunny-filet-crochet-2.jpg",
    ],
    emoji: "🐰",
  },
  {
    id: "8",
    name: "Colgante de botones",
    description: `Colgante de 3 botones hecho con hilo de algodón
Largo: 40cm aprox
Ancho: 16cm`,
    price: 37950,
    category: "Decoración",
    images: [
      "/img/productos/colgante-de-botones-1.jpg",
    ],
    emoji: "🪡",
  },
  {
    id: "9",
    name: "Enredadera lilies blancas",
    description: `Medidas
Largo: 100cm aprox.`,
    price: 15080,
    category: "Decoración",
    images: [
      "/img/productos/enredadera-lilies-blancas-1.jpg",
      "/img/productos/enredadera-lilies-blancas-2.jpg",
    ],
    emoji: "🤍",
  },
  {
    id: "10",
    name: "Enredadera lilies rosas",
    description: `Medidas
Largo: 100cm aprox.`,
    price: 15080,
    category: "Decoración",
    images: [
      "/img/productos/enredadera-lilies-rosas-1.jpg",
      "/img/productos/enredadera-lilies-rosas-2.jpg",
      "/img/productos/enredadera-lilies-rosas-3.jpg",
    ],
    emoji: "🌸",
  },
  {
    id: "11",
    name: "Mini bunny tapiz",
    price: 3300,
    category: "Decoración",
    images: [
      "/img/productos/mini-bunny-tapiz-1.jpg",
      "/img/productos/mini-bunny-tapiz-2.jpg",
    ],
    emoji: "🐇",
  },
  {
    id: "12",
    name: "Moño filet crochet",
    description: `Medidas
Ancho: 12cm aproximadamente
Largo: 15cm aproximadamente`,
    price: 6000,
    category: "Decoración",
    images: [
      "/img/productos/mono-filet-crochet-1.jpg",
    ],
    emoji: "🎀",
  },
  {
    id: "13",
    name: "Tapiz bunny",
    price: 44000,
    category: "Decoración",
    images: [
      "/img/productos/tapiz-bunny-1.jpg",
    ],
    emoji: "🐰",
  },
  {
    id: "14",
    name: "Tapiz cisne",
    price: 6600,
    category: "Decoración",
    images: [
      "/img/productos/tapiz-cisne-1.jpg",
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
      "/img/productos/tapiz-gatito-1.jpg",
      "/img/productos/tapiz-gatito-2.jpg",
      "/img/productos/tapiz-gatito-3.jpg",
      "/img/productos/tapiz-gatito-4.jpg",
    ],
    variants: [
      {
        name: "Color",
        values: [
          { name: "Rosa y marrón", photos: [] },
          { name: "Celeste y blanco", photos: [] },
        ],
      },
    ],
    emoji: "🐱",
  },
  {
    id: "16",
    name: "Tapiz gatitos enamorados",
    price: 8360,
    category: "Decoración",
    images: [
      "/img/productos/tapiz-gatitos-enamorados-1.jpg",
    ],
    unavailable: true,
    emoji: "😻",
  },
  {
    id: "17",
    name: "Tapiz pajaritos",
    description: `Tapiz hecho con la técnica de fillet crochet e hilo de algodón color crema. Ideal para poner dentro de un cuadro!
Altura: 18cm aprox
Ancho: 40cm aprox`,
    price: 48000,
    category: "Decoración",
    images: [
      "/img/productos/tapiz-pajaritos-1.jpg",
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
    price: 16000,
    category: "Keycharms",
    images: [
      "/img/productos/keycharm-tomatito-1.jpg",
      "/img/productos/keycharm-tomatito-2.jpg",
    ],
    emoji: "🍅",
  },
  {
    id: "19",
    name: "Llavero bunny",
    price: 7700,
    category: "Keycharms",
    images: [
      "/img/productos/llavero-bunny-1.jpg",
      "/img/productos/llavero-bunny-2.jpg",
    ],
    variants: [
      {
        name: "Variante",
        values: [
          { name: "Con moño", photos: [] },
          { name: "Sin moño", photos: [] },
        ],
      },
    ],
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
      "/img/productos/llavero-strawberry-1.jpg",
      "/img/productos/llavero-strawberry-2.jpg",
    ],
    emoji: "🍓",
  },
];

// completa los campos opcionales para que el resto de la app no tenga que chequearlos
export const products = PRODUCTS.map((p) => ({
  description: "",
  featured: false,
  unavailable: false,
  variants: [],
  emoji: "🧶",
  ...p,
}));
