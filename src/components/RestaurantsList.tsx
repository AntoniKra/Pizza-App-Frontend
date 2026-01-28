import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock, Star, Truck, MapPin } from "lucide-react";

// Importujemy TYPY z Orvala (to jest klucz do łatwego podpięcia potem!)
import type { PizzeriaDetailsDto } from "../api/model";
import Header from "./Header";

// --- MOCK DATA (Zgodny z typem z Orvala) ---
// Kolega usunie to i odkomentuje pobieranie z API
const MOCK_RESTAURANTS: PizzeriaDetailsDto[] = [
  {
    id: "1",
    name: "Pizza Hut Centrum",
    brandName: "Pizza Hut",
    phoneNumber: "22 123 45 67",
    deliveryCost: 6.99,
    minOrderAmount: 35.0,
    averagePreparationTimeMinutes: 30,
    isOpen: true,
    address: {
      street: "Marszałkowska 100",
      city: "Warszawa",
      fullAddress: "Marszałkowska 100, Warszawa",
    },
  },
  {
    id: "2",
    name: "Da Grasso Ursynów",
    brandName: "Da Grasso",
    phoneNumber: "22 987 65 43",
    deliveryCost: 0, // Darmowa dostawa
    minOrderAmount: 50.0,
    averagePreparationTimeMinutes: 45,
    isOpen: true,
    address: {
      street: "KEN 50",
      city: "Warszawa",
      fullAddress: "KEN 50, Warszawa",
    },
  },
  {
    id: "3",
    name: "Dominos Mokotów",
    brandName: "Dominos",
    phoneNumber: "22 555 55 55",
    deliveryCost: 9.99,
    minOrderAmount: 30.0,
    averagePreparationTimeMinutes: 25,
    isOpen: false, // Zamknięte
    address: {
      street: "Wołoska 12",
      city: "Warszawa",
      fullAddress: "Wołoska 12, Warszawa",
    },
  },
];

const RestaurantsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [restaurants, setRestaurants] = useState<PizzeriaDetailsDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cityId, cityName } = location.state || {};

  useEffect(() => {
    // --- SYMULACJA API ---
    // Tutaj normalnie byłoby: getPizzeria().getAll().then(...)
    const fetchRestaurants = async () => {
      setIsLoading(true);
      // Symulujemy opóźnienie sieci
      setTimeout(() => {
        setRestaurants(MOCK_RESTAURANTS);
        setIsLoading(false);
      }, 800);
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantClick = (id: string) => {
    // Przekierowanie do menu konkretnej restauracji
    navigate(`/restaurant/${id}`);
    // Uwaga: Upewnij się, że masz taki routing w App.tsx!
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <span className="bg-[#FF6B6B] w-2 h-8 rounded-full"></span>
          {/* 👇 Tutaj zmiana: Jeśli mamy miasto, to je pokazujemy */}
          Dostępne Restauracje {cityName ? `w mieście ${cityName}` : ""}
        </h2>
        {/* Tu można dodać filtry w przyszłości */}
      </div>

      {isLoading ? (
        // --- SKELETON LOADING (Ładowanie) ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#1E1E1E] rounded-2xl h-64 animate-pulse border border-gray-800"
            ></div>
          ))}
        </div>
      ) : (
        // --- LISTA KAFELKÓW ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              onClick={() => handleRestaurantClick(rest.id!)}
              className="group bg-[#1E1E1E] rounded-2xl border border-gray-800 hover:border-[#FF6B6B]/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,107,107,0.15)] hover:-translate-y-1"
            >
              {/* HEADER KAFELKA (Obrazek/Gradient) */}
              <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-700 relative">
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>4.8</span>{" "}
                  {/* Ocena - na razie hardcoded, bo w DTO jej nie ma */}
                </div>

                {/* Status Otwarta/Zamknięta */}
                <div
                  className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border ${
                    rest.isOpen
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${rest.isOpen ? "bg-green-400 animate-pulse" : "bg-red-400"}`}
                  ></div>
                  {rest.isOpen ? "OTWARTE" : "ZAMKNIĘTE"}
                </div>
              </div>

              {/* TREŚĆ KAFELKA */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF6B6B] transition-colors">
                      {rest.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                      <MapPin size={14} />
                      <span className="truncate max-w-[200px]">
                        {rest.address?.fullAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-full h-[1px] bg-gray-800 my-4"></div>

                {/* Szczegóły (Dostawa, Czas, Min) */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-gray-500 mb-1">
                      <Truck size={18} />
                    </div>
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                      Dostawa
                    </span>
                    <span className="text-sm font-bold text-white">
                      {Number(rest.deliveryCost) === 0
                        ? "FREE"
                        : `${rest.deliveryCost} zł`}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1 border-x border-gray-800 px-2">
                    <div className="text-gray-500 mb-1">
                      <Clock size={18} />
                    </div>
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                      Czas
                    </span>
                    <span className="text-sm font-bold text-white">
                      {rest.averagePreparationTimeMinutes} min
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="text-gray-500 mb-1">
                      <span className="text-lg leading-none">Min.</span>
                    </div>
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                      Zamówienie
                    </span>
                    <span className="text-sm font-bold text-white">
                      {rest.minOrderAmount} zł
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
