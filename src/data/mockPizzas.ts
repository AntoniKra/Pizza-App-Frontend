export interface Pizza {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  kcal: number;

  // 👇 ZMIANA: Dodajemy '?' żeby te pola były OPCJONALNE
  weight: number;
  pizzeria?: string;
  city?: string;

  // Specyfikacja (też opcjonalna)
  style?: string;
  dough?: string;
  crust?: string;
  sauce?: string;
  shape?: string;
  diameter?: number;
  width?: number;
  length?: number;

  // Opcjonalne flagi (na przyszłość)
  isNew?: boolean;
  ingredients?: string[];
}

export const pizzas: Pizza[] = [
  // --- WARSZAWA ---
  {
    id: 1,
    name: "Margherita",
    pizzeria: "Da Grasso",
    city: "Warszawa",
    price: 24.9,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=60",
    description:
      "Klasyk nad klasykami. Sos pomidorowy, mozzarella i świeża bazylia.",
    dough: "Pszenne",
    crust: "Cienkie",
    shape: "Okrągła",
    style: "Neapolitańska",
    sauce: "Pomidorowy",
    diameter: 32,
    weight: 350,
    kcal: 850,
  },
  {
    id: 2,
    name: "Pepperoni Feast",
    pizzeria: "Pizza Hut",
    city: "Warszawa",
    price: 32.5,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=60",
    description:
      "Uczta dla fanów ostrości. Podwójne pepperoni i ser mozzarella.",
    dough: "Pszenne",
    crust: "Grube",
    shape: "Okrągła",
    style: "Amerykańska",
    sauce: "Pomidorowy",
    diameter: 30,
    weight: 400,
    kcal: 1100,
  },
  {
    id: 3,
    name: "Vege Delight",
    pizzeria: "Dominos",
    city: "Warszawa",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
    description: "Pełna warzyw: papryka, kukurydza, pieczarki i cebula.",
    dough: "Pełnoziarniste",
    crust: "Tradycyjne",
    shape: "Okrągła",
    style: "Rzymska",
    sauce: "Śmietanowy (Biały)",
    diameter: 40,
    weight: 450,
    kcal: 920,
  },

  // --- WROCŁAW ---
  {
    id: 4,
    name: "BBQ Chicken",
    pizzeria: "Dominos",
    city: "Wrocław",
    price: 36.0,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60",
    description: "Grillowany kurczak, sos BBQ, czerwona cebula i kukurydza.",
    dough: "Pszenne",
    crust: "Z wypełnionymi brzegami",
    shape: "Okrągła",
    style: "Amerykańska",
    sauce: "BBQ",
    diameter: 35,
    weight: 420,
    kcal: 1050,
  },
  {
    id: 5,
    name: "Carbonara Rect",
    pizzeria: "Da Grasso",
    city: "Wrocław",
    price: 31.5,
    image:
      "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?w=800&auto=format&fit=crop&q=60",
    description: "Biały sos, boczek, cebula i duuużo sera. Wersja prostokątna.",
    dough: "Na zakwasie",
    crust: "Cienkie",
    shape: "Prostokątna",
    style: "Sycylijska",
    sauce: "Śmietanowy (Biały)",
    width: 30,
    length: 40,
    weight: 480,
    kcal: 1250,
  },
  {
    id: 8,
    name: "Hawajska",
    pizzeria: "Pizza Station",
    city: "Wrocław",
    price: 27.5,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60",
    description:
      "Kontrowersyjna, ale kochana. Szynka i ananas na cienkim cieście.",
    dough: "Pszenne",
    crust: "Cienkie",
    shape: "Okrągła",
    style: "Włoska",
    sauce: "Pomidorowy",
    diameter: 32,
    weight: 390,
    kcal: 880,
  },

  // --- KRAKÓW ---
  {
    id: 6,
    name: "Truffle & Mushroom",
    pizzeria: "Pizza Hut",
    city: "Kraków",
    price: 42.0,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
    description: "Wykwintna kompozycja z kremem truflowym i pieczarkami.",
    dough: "Bezglutenowe",
    crust: "Cienkie",
    shape: "Okrągła",
    style: "Neapolitańska",
    sauce: "Krem truflowy",
    diameter: 32,
    weight: 360,
    kcal: 780,
  },

  {
    id: 7,
    name: "Diablo",
    pizzeria: "Da Grasso",
    city: "Gdańsk",
    price: 28.0,
    image:
      "https://images.unsplash.com/photo-1593560708920-6316e4e6d0e5?w=800&auto=format&fit=crop&q=60",
    description: "Dla odważnych. Jalapeno, chilli i pikantne salami.",
    dough: "Pszenne",
    crust: "Tradycyjne",
    shape: "Okrągła",
    style: "Rzymska",
    sauce: "Ostry pomidorowy",
    diameter: 32,
    weight: 380,
    kcal: 900,
  },
  {
    id: 9,
    name: "Morska Uczta",
    pizzeria: "Portowa Pizza",
    city: "Gdańsk",
    price: 39.9,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60",
    description: "Krewetki, małże i czosnek na białym sosie.",
    dough: "Pszenne",
    crust: "Grube",
    shape: "Okrągła",
    style: "Włoska",
    sauce: "Biały",
    diameter: 30,
    weight: 410,
    kcal: 850,
  },
];
