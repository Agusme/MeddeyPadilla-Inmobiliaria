export type Property = {
  slug: string;
  title: string;
  location: string;
  type: string;
  operation: string;
  price: string;
  image: string;
  images: string[];
  description: string;
  features: { label: string; value: string | number }[];
  address: string;
};

export const properties: Property[] = [
  {
    slug: "casa-con-jardin-y-piscina",
    title: "Casa con jardín y piscina",
    location: "Yerba Buena, Tucumán",
    type: "Casa",
    operation: "Venta",
    price: "USD 185.000",
    image: "/image1.webp",
    images: ["/image1.webp", "/image2.webp", "/image.jpg"],
    description: "Una casa pensada para disfrutar de espacios amplios, luminosos y conectados con el exterior. Ideal para quienes buscan comodidad, privacidad y una ubicación privilegiada.",
    features: [
      { label: "Dormitorios", value: "3" },
      { label: "Baños", value: "2" },
      { label: "Superficie cubierta", value: "180 m²" },
      { label: "Superficie total", value: "420 m²" },
      { label: "Cochera", value: "2 vehículos" },
      { label: "Antigüedad", value: "8 años" },
    ],
    address: "Yerba Buena, Tucumán",
  },
  {
    slug: "departamento-luminoso",
    title: "Departamento luminoso",
    location: "San Miguel de Tucumán",
    type: "Departamento",
    operation: "Alquiler",
    price: "$ 650.000 / mes",
    image: "/image2.webp",
    images: ["/image2.webp", "/image1.webp", "/image.jpg"],
    description: "Departamento con ambientes cómodos y excelente entrada de luz natural. Una alternativa práctica para vivir cerca de los principales servicios de la ciudad.",
    features: [
      { label: "Dormitorios", value: "2" },
      { label: "Baños", value: "1" },
      { label: "Superficie cubierta", value: "72 m²" },
      { label: "Superficie total", value: "78 m²" },
      { label: "Cochera", value: "No" },
      { label: "Antigüedad", value: "5 años" },
    ],
    address: "San Miguel de Tucumán, Tucumán",
  },
  {
    slug: "terreno-con-excelente-ubicacion",
    title: "Terreno con excelente ubicación",
    location: "Lomas de Tafí, Tucumán",
    type: "Terreno",
    operation: "Venta",
    price: "USD 72.000",
    image: "/image.jpg",
    images: ["/image.jpg", "/image1.webp", "/image2.webp"],
    description: "Terreno con una excelente proyección, ideal para desarrollar una vivienda o inversión. Ubicado en una zona consolidada y de fácil acceso.",
    features: [
      { label: "Superficie total", value: "600 m²" },
      { label: "Frente", value: "20 m" },
      { label: "Fondo", value: "30 m" },
      { label: "Servicios", value: "Agua y luz" },
      { label: "Estado", value: "Escriturable" },
      { label: "Orientación", value: "Norte" },
    ],
    address: "Lomas de Tafí, Tucumán",
  },
];

export const propertyBySlug = Object.fromEntries(properties.map((property) => [property.slug, property]));
