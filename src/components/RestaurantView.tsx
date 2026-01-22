import { useState } from "react";
import Header from "./Header";
import { RestaurantHero, MenuCard, RightSidebar } from "./RestaurantComponents";
import type { Pizza } from "../data/mockPizzas";

// DANE MENU
const pizzaHutMenu: Pizza[] = [
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
  {
    id: 204,
    name: "Vegetariańska",
    pizzeria: "Pizza Hut",
    price: 37.99,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500",
    description: "Świeża papryka, pomidory, pieczarki i czerwona cebula na serze mozzarella.",
    weight: 500,
    kcal: 980,
    dough: "Cienkie",
    crust: "Tradycyjne",
    shape: "Okrągła",
    style: "Vegetarian",
    sauce: "Pomidorowy",
  },
  {
    id: 205,
    name: "Carbonara",
    pizzeria: "Pizza Hut",
    price: 41.99,
    image: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?auto=format&fit=crop&q=80&w=500",
    description: "Biały sos śmietanowy, boczek, cebula, ser mozzarella i parmezan.",
    weight: 530,
    kcal: 1450,
    dough: "Tradycyjne",
    crust: "Ser w brzegach",
    shape: "Okrągła",
    style: "White Sauce",
    sauce: "Śmietanowy",
  },
];

const RestaurantView = () => {
  const [activeTab, setActiveTab] = useState("Pizzas");

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      <Header onSearch={() => {}} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* HERO SECTION */}
        <RestaurantHero />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEWA KOLUMNA: MENU */}
          <div className="lg:col-span-2">
            
            {/* Zakładki */}
            <div className="flex gap-8 border-b border-[#2A2A2A] mb-8 sticky top-0 bg-[#121212] z-20 pt-2">
              {["Pizzas", "Drinks", "Promotions"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold tracking-wide transition relative ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab === "Pizzas" && <span className="mr-2">🍕</span>}
                  {tab === "Drinks" && <span className="mr-2">🍸</span>}
                  {tab === "Promotions" && <span className="mr-2">⚡</span>}
                  {tab}
                  
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Lista Menu */}
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "Pizzas" && pizzaHutMenu.map((pizza) => (
                <MenuCard key={pizza.id} data={pizza} />
              ))}
              
              {activeTab !== "Pizzas" && (
                <div className="text-center py-20 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] text-gray-500">
                  <p className="text-xl font-bold mb-2">Coming soon...</p>
                  <p className="text-sm">We are working on adding {activeTab.toLowerCase()} to the menu.</p>
                </div>
              )}
            </div>
          </div>

          {/* PRAWA KOLUMNA: SIDEBAR */}
          <div className="hidden lg:block">
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantView;