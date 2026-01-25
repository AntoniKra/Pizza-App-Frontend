import { useState } from "react";
import Header from "./Header";
import { RestaurantHero, MenuCard, RightSidebar } from "./RestaurantComponents";
import type { Pizza } from "../data/mockPizzas";

// Teraz komponent przyjmuje props 'menu'
interface RestaurantViewProps {
  menu: Pizza[];
}

const RestaurantView = ({ menu }: RestaurantViewProps) => {
  const [activeTab, setActiveTab] = useState("Pizze");

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      <Header onSearch={() => {}} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <RestaurantHero />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex gap-8 border-b border-[#2A2A2A] mb-8 sticky top-0 bg-[#121212] z-20 pt-2">
              {["Pizze", "Promocje"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold tracking-wide transition relative ${
                    activeTab === tab
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab === "Pizze" && <span className="mr-2">🍕</span>}
                  {tab === "Promocje" && <span className="mr-2">⚡</span>}
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* UŻYWAMY DANYCH PRZEKAZANYCH Z APP.TSX */}
              {activeTab === "Pizze" && menu.map((pizza) => (
                <MenuCard key={pizza.id} data={pizza} />
              ))}
              
              {activeTab !== "Pizze" && (
                <div className="text-center py-20 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] text-gray-500">
                  <p className="text-xl font-bold mb-2">Wkrótce...</p>
                  <p className="text-sm">Pracujemy nad dodaniem tej sekcji do menu.</p>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RestaurantView;