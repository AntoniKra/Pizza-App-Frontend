import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RestaurantView from "./components/RestaurantView";
import LandingPage from "./components/LandingPage";
import PizzaSearch from "./components/PizzaSearch";
import PizzaDetails from "./components/PizzaDetails";
import AccountView from "./components/AccountView"; // Nowy widok
import AddPizzaView from "./components/AddPizzaView"; // Nowy widok
import type { Pizza } from "./data/mockPizzas";

// Dane z RestaurantView
const INITIAL_MENU: Pizza[] = [
  {
    id: 201,
    name: "Pepperoni",
    pizzeria: "Pizza Hut",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500",
    description: "Klasyk gatunku. Podwójna porcja salami pepperoni i ser mozzarella. Ciasto PAN.",
    weight: 550,
    kcal: 1400,
    dough: "PAN (Grube)",
    crust: "Grube",
    shape: "Okrągła",
    style: "Classic",
    sauce: "Pomidorowy",
  },
  {
    id: 202,
    name: "Texas",
    pizzeria: "Pizza Hut",
    price: 44.99,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=500",
    description: "Kurczak grillowany, czerwona cebula, kukurydza i sos BBQ zamiast pomidorowego.",
    weight: 580,
    kcal: 1350,
    dough: "Tradycyjne",
    crust: "Ze słonecznikiem",
    shape: "Okrągła",
    style: "Spicy",
    sauce: "BBQ",
  },
  {
    id: 203,
    name: "Supreme",
    pizzeria: "Pizza Hut",
    price: 46.99,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500",
    description: "Wszystko co najlepsze: wołowina, pepperoni, szynka, papryka, pieczarki i cebula.",
    weight: 620,
    kcal: 1500,
    dough: "PAN (Grube)",
    crust: "Grube",
    shape: "Okrągła",
    style: "Meat Lover",
    sauce: "Pomidorowy",
  },
];

function App() {
  const [restaurantMenu, setRestaurantMenu] = useState<Pizza[]>(INITIAL_MENU);

  // Funkcja dodająca nową pizzę
  const handleAddPizza = (newPizza: Pizza) => {
    setRestaurantMenu((prevMenu) => [...prevMenu, newPizza]);
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Routes>
        {/* 1. Strona Główna */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Wyszukiwarka */}
        <Route path="/search" element={<PizzaSearch />} />

        {/* 3. Szczegóły */}
        <Route path="/pizza/:id" element={<PizzaDetails />} />

        {/* 4. Menu restauracji */}
        <Route path="/restaurant" element={<RestaurantView menu={restaurantMenu} />} />

        {/* 5. Widok Konta (Dashboard) */}
        <Route path="/account" element={<AccountView />} />

        {/* 6. Formularz dodawania pizzy */}
        <Route path="/add-pizza" element={<AddPizzaView onAdd={handleAddPizza} />} />
      </Routes>
    </div>
  );
}

export default App;