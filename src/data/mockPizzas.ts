export interface Pizza {
  id: number;
  name: string;
  pizzeria: string;
  price: number;
  diameter: number;
  weight: number;
  pricePer100g: number;
  image: string;
  isBestValue: boolean;
}

export const pizzas: Pizza[] = [
  {
    id: 1,
    name: "Double Pepperoni",
    pizzeria: "Domino's Pizza",
    price: 45.0,
    diameter: 42,
    weight: 850,
    pricePer100g: 5.63,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop",
    isBestValue: true,
  },
  {
    id: 2,
    name: "Margherita Classico",
    pizzeria: "Pizza Hut",
    price: 36.5,
    diameter: 32,
    weight: 600,
    pricePer100g: 6.1,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop",
    isBestValue: false,
  },
  {
    id: 3,
    name: "Veggie Supreme",
    pizzeria: "Papa John's",
    price: 53.0,
    diameter: 40,
    weight: 780,
    pricePer100g: 6.8,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop",
    isBestValue: false,
  },
  {
    id: 4,
    name: "Hawaiian Party",
    pizzeria: "Local Pizzeria",
    price: 46.2,
    diameter: 50,
    weight: 1100,
    pricePer100g: 4.2,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop",
    isBestValue: true,
  },
];
