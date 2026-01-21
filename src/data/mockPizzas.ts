export interface Pizza {
  id: number;
  name: string;
  pizzeria: string;
  price: number;
  image: string;
  description: string;
  dough: string;
  crust: string;
  shape: string;
  style: string;
  sauce: string;
  diameter: number;
  weight: number;
  pricePer100g: number;
}

export const pizzas: Pizza[] = [
  {
    id: 1,
    name: "Margherita",
    pizzeria: "Da Grasso",
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
    pricePer100g: 7.11,
  },
  {
    id: 2,
    name: "Pepperoni Feast",
    pizzeria: "Pizza Hut",
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
    pricePer100g: 8.12,
  },
  {
    id: 3,
    name: "Vege Delight",
    pizzeria: "Dominos",
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
    pricePer100g: 6.66,
  },
  {
    id: 4,
    name: "BBQ Chicken",
    pizzeria: "Dominos",
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
    pricePer100g: 8.57,
  },
  {
    id: 5,
    name: "Carbonara",
    pizzeria: "Da Grasso",
    price: 31.5,
    image:
      "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?w=800&auto=format&fit=crop&q=60",
    description: "Biały sos, boczek, cebula i duuużo sera.",
    dough: "Na zakwasie",
    crust: "Cienkie",
    shape: "Prostokątna",
    style: "Sycylijska",
    sauce: "Śmietanowy (Biały)",
    diameter: 42,
    weight: 480,
    pricePer100g: 6.56,
  },
  {
    id: 6,
    name: "Truffle & Mushroom",
    pizzeria: "Pizza Hut",
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
    pricePer100g: 11.66,
  },
  {
    id: 7,
    name: "Diablo",
    pizzeria: "Da Grasso",
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
    pricePer100g: 7.36,
  },
];
