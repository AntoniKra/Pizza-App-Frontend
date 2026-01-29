import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Store, ChevronRight, MapPin } from "lucide-react";
// Importujemy typy, żeby TypeScript był zadowolony
import type { BrandDto, BrandDetailsDto } from "../api/model";

// --- DANE TESTOWE (MOCKI) ---
// To udaje bazę danych. Backendowiec to usunie i podepnie API.
const MOCK_BRANDS: BrandDto[] = [
  { id: "brand-1", name: "Da Grasso" },
  { id: "brand-2", name: "Pizza Hut" },
  { id: "brand-3", name: "Dominos" },
];

const MOCK_BRAND_DETAILS: Record<string, BrandDetailsDto> = {
  "brand-1": {
    id: "brand-1",
    name: "Da Grasso",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Da_Grasso_Logo.svg/1200px-Da_Grasso_Logo.svg.png",
    pizzerias: [
      { id: "rest-1", name: "Da Grasso Ursynów", city: "Warszawa" },
      { id: "rest-2", name: "Da Grasso Centrum", city: "Warszawa" },
    ],
  },
  "brand-2": {
    id: "brand-2",
    name: "Pizza Hut",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Pizza_Hut_logo.svg/1200px-Pizza_Hut_logo.svg.png",
    pizzerias: [
      { id: "rest-3", name: "Pizza Hut Złote Tarasy", city: "Warszawa" },
    ],
  },
};

const AccountView = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [selectedBrandDetails, setSelectedBrandDetails] =
    useState<BrandDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Symulacja pobierania listy marek
  useEffect(() => {
    // Normalnie tu byłoby: const { data } = await getBrand().getApiBrandGetAll();
    setBrands(MOCK_BRANDS);
  }, []);

  // 2. Symulacja pobierania szczegółów marki (lokali)
  const handleBrandClick = async (brandId: string) => {
    setIsLoading(true);

    // Symulujemy opóźnienie sieci (żebyś widział, że "coś się dzieje")
    setTimeout(() => {
      const details = MOCK_BRAND_DETAILS[brandId] || {
        id: brandId,
        name: "Nieznana",
        pizzerias: [],
      };
      setSelectedBrandDetails(details);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Panel Partnera</h1>
        <p className="text-gray-400 mb-8">
          Wybierz markę, aby zarządzać lokalami.
        </p>

        {/* --- SEKCJA 1: LISTA MAREK --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* KAFELEK: DODAJ MARKĘ */}
          <div
            onClick={() => navigate("/add-brand")} // Odkomentuj jak zrobimy widok dodawania marki
            className="bg-[#1A1A1A] h-32 rounded-2xl border-2 border-dashed border-[#333] hover:border-blue-500 hover:bg-[#202020] transition cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white"
          >
            <PlusCircle size={32} className="mb-2" />
            <span className="font-bold">Dodaj Markę</span>
          </div>

          {/* KAFELKI: ISTNIEJĄCE MARKI */}
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => brand.id && handleBrandClick(brand.id)}
              className={`relative bg-[#1A1A1A] h-32 p-6 rounded-2xl border transition cursor-pointer flex items-center justify-between group
                ${selectedBrandDetails?.id === brand.id ? "border-blue-500 bg-[#1e2329]" : "border-[#2A2A2A] hover:border-gray-500"}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 font-bold text-xl">
                  {brand.name.charAt(0)}
                </div>
                <h3 className="font-bold text-xl">{brand.name}</h3>
              </div>
              <ChevronRight
                className={`text-gray-600 transition ${selectedBrandDetails?.id === brand.id ? "rotate-90 text-blue-500" : ""}`}
              />
            </div>
          ))}
        </div>

        {/* --- SEKCJA 2: LOKALE WYBRANEJ MARKI --- */}
        {isLoading ? (
          <div className="text-gray-500 animate-pulse">Ładowanie lokali...</div>
        ) : selectedBrandDetails ? (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Store className="text-blue-500" />
                Lokale:{" "}
                <span className="text-blue-400">
                  {selectedBrandDetails.name}
                </span>
              </h2>
              <button
                onClick={() =>
                  navigate("/add-restaurant", {
                    state: { brand: selectedBrandDetails },
                  })
                }
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition"
              >
                <PlusCircle size={16} /> Dodaj Lokal
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {selectedBrandDetails.pizzerias &&
              selectedBrandDetails.pizzerias.length > 0 ? (
                selectedBrandDetails.pizzerias.map((pizzeria) => (
                  <div
                    key={pizzeria.id}
                    className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] hover:border-blue-500/30 transition flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-lg">{pizzeria.name}</h3>
                      <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {pizzeria.city || "Brak miasta"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {/* PRZYCISKI AKCJI */}
                      <button
                        onClick={() =>
                          navigate(`/edit-restaurant/${pizzeria.id}`)
                        }
                        className="bg-[#2A2A2A] hover:bg-[#333] px-3 py-1.5 rounded text-xs font-bold border border-[#444] text-white"
                      >
                        Edytuj Pizzerię
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/restaurant-menu/${pizzeria.id}`, {
                            state: { restaurantName: pizzeria.name },
                          })
                        }
                        className="bg-[#2A2A2A] hover:bg-[#333] px-3 py-1.5 rounded text-xs font-bold border border-[#444] text-white"
                      >
                        Menu
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 bg-[#1A1A1A] rounded-xl border border-dashed border-[#333]">
                  Brak lokali dla tej marki. Dodaj pierwszy!
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-600">
            Kliknij markę powyżej, aby zarządzać jej lokalami.
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountView;
