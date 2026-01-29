import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Store, ChevronRight, MapPin, Image as ImageIcon } from "lucide-react";
import type { BrandDto, BrandDetailsDto } from "../api/model";
import { getBrand } from "../api/endpoints/brand/brand";

function AccountView() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [selectedBrandDetails, setSelectedBrandDetails] =
    useState<BrandDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Symulacja pobierania listy marek
  useEffect(() => {
    // setIsLoading(true); // Odkomentuj, gdy backend będzie gotowy
    const getBrands = async () => {
      try {
        setIsLoading(true);
        const response = await getBrand().getApiBrandGetAll();
        // Zakładamy, że response to tablica (zależnie od konfiguracji axios/orval może być response.data)
        setBrands(response || []); 
      } catch (error) {
        console.error("Błąd pobierania marek:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getBrands();
  }, []);

  // 2. Pobieranie szczegółów marki (lokali + logo)
  const handleBrandClick = async (brandId: string) => {
    setIsLoading(true);
    try {
      const details = await getBrand().getApiBrandId(brandId);
      setSelectedBrandDetails(details);
    } catch (error) {
      console.error("Błąd pobierania szczegółów marki:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        <div className="text-[#FF6B6B] animate-pulse text-xl font-bold">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Panel Partnera</h1>
        <p className="text-gray-400 mb-8">
          Wybierz markę, aby zarządzać jej lokalami i menu.
        </p>

        {/* --- SEKCJA 1: LISTA MAREK (Grid) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* KAFELEK: DODAJ MARKĘ */}
          <div
            onClick={() => navigate("/add-brand")}
            className="bg-[#1A1A1A] h-32 rounded-2xl border-2 border-dashed border-[#333] hover:border-[#FF6B6B] hover:bg-[#202020] transition cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-white group"
          >
            <PlusCircle size={32} className="mb-2 group-hover:text-[#FF6B6B] transition-colors" />
            <span className="font-bold">Dodaj Markę</span>
          </div>

          {/* KAFELKI: ISTNIEJĄCE MARKI */}
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => brand.id && handleBrandClick(brand.id)}
              className={`relative bg-[#1A1A1A] h-32 p-6 rounded-2xl border transition cursor-pointer flex items-center justify-between group overflow-hidden
                ${selectedBrandDetails?.id === brand.id ? "border-[#FF6B6B] bg-[#1e1e1e] shadow-[0_0_15px_rgba(255,107,107,0.15)]" : "border-[#2A2A2A] hover:border-gray-500"}`}
            >
              <div className="flex items-center gap-4 z-10">
                {/* Mini logo w liście */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border 
                  ${selectedBrandDetails?.id === brand.id ? "bg-[#FF6B6B] text-white border-[#FF6B6B]" : "bg-[#252525] text-gray-300 border-[#333]"}`}>
                  {brand.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-xl truncate max-w-[140px]">{brand.name}</h3>
              </div>
              <ChevronRight
                className={`text-gray-600 transition z-10 ${selectedBrandDetails?.id === brand.id ? "rotate-90 text-[#FF6B6B]" : ""}`}
              />
              {/* Dekoracyjne tło */}
              {selectedBrandDetails?.id === brand.id && (
                 <div className="absolute -right-4 -bottom-4 text-[#FF6B6B]/5">
                    <Store size={80} />
                 </div>
              )}
            </div>
          ))}
        </div>

        {/* --- SEKCJA 2: SZCZEGÓŁY WYBRANEJ MARKI --- */}
        {selectedBrandDetails ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 2A. HEADER MARKI (Logo + Nazwa + Przycisk Dodaj Lokal) */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 w-full md:w-auto">
                {/* LOGIKA WYŚWIETLANIA LOGO */}
                {selectedBrandDetails.logo ? (
                  <img 
                    src={selectedBrandDetails.logo} 
                    alt={`${selectedBrandDetails.name} logo`}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-[#333] shadow-lg bg-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#252525] to-[#151515] border border-[#333] flex items-center justify-center shadow-lg">
                     <span className="text-4xl font-bold text-[#FF6B6B]">
                        {selectedBrandDetails.name.charAt(0).toUpperCase()}
                     </span>
                  </div>
                )}
                
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                        {selectedBrandDetails.name}
                    </h2>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                        <Store size={14} /> Zarządzanie siecią pizzerii
                    </p>
                </div>
              </div>

              {/* Przycisk w headerze */}
              <button
                onClick={() =>
                  navigate("/add-restaurant", {
                    state: { brand: selectedBrandDetails },
                  })
                }
                className="w-full md:w-auto bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-red-900/20"
              >
                <PlusCircle size={18} /> Dodaj Lokal
              </button>
            </div>

            {/* 2B. LISTA LOKALI */}
            <div className="mb-4">
               <h3 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
                  Twoje Lokale <span className="text-xs bg-[#333] px-2 py-1 rounded-full text-gray-400">{selectedBrandDetails.pizzerias?.length || 0}</span>
               </h3>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {selectedBrandDetails.pizzerias && selectedBrandDetails.pizzerias.length > 0 ? (
                  selectedBrandDetails.pizzerias.map((pizzeria) => (
                    <div
                      key={pizzeria.id}
                      className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2A2A2A] hover:border-[#FF6B6B]/50 transition group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div>
                        <h3 className="font-bold text-lg text-white group-hover:text-[#FF6B6B] transition-colors">{pizzeria.name}</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                          <MapPin size={14} className="text-gray-500" /> {pizzeria.city || "Nie podano miasta"}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto">
                       
                        <button
                          onClick={() =>
                            navigate(`/restaurant-menu/${pizzeria.id}`, {
                              state: {restaurant:pizzeria },
                            })
                          }
                          className="flex-1 sm:flex-none bg-[#FF6B6B]/10 hover:bg-[#FF6B6B] text-[#FF6B6B] hover:text-white px-4 py-2 rounded-lg text-xs font-bold border border-[#FF6B6B]/20 transition"
                        >
                          Menu
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  /* 2C. PUSTY STAN (BRAK LOKALI) */
                  <div className="col-span-full py-16 flex flex-col items-center justify-center bg-[#1A1A1A]/50 border-2 border-dashed border-[#333] rounded-2xl text-center px-4">
                    <div className="w-16 h-16 bg-[#252525] rounded-full flex items-center justify-center mb-4 text-gray-500">
                        <Store size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Brak lokali dla tej marki</h3>
                    <p className="text-gray-400 max-w-md mb-6">
                        Ta marka nie ma jeszcze przypisanych żadnych pizzerii. Dodaj swój pierwszy lokal, aby zacząć sprzedawać.
                    </p>
                    <button
                        onClick={() =>
                        navigate("/add-restaurant", {
                            state: { brand: selectedBrandDetails },
                        })
                        }
                        className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition"
                    >
                        <PlusCircle size={18} /> Dodaj Lokal Teraz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* STAN POCZĄTKOWY (NIC NIE WYBRANO) */
          <div className="text-center py-20 bg-[#1A1A1A]/30 rounded-3xl border border-[#2A2A2A]/50 flex flex-col items-center">
            <div className="w-20 h-20 bg-[#252525] rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ImageIcon size={32} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Wybierz markę</h3>
            <p className="text-gray-500">Kliknij na jedną z marek powyżej, aby zarządzać jej lokalami.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountView;