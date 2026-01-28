import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCity } from "../api/endpoints/city/city";
import type { CityDto } from "../api/model";

interface LandingPageProps {
  onCitySelect?: (city: { id: string; name: string }) => void;
}

const LandingPage = ({ onCitySelect }: LandingPageProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const userRole =
    user?.role ||
    (user as any)?.[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  const isPartner =
    userRole === "Partner" || userRole === "Owner" || userRole === "partner";

  const [address, setAddress] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cities, setCities] = useState<CityDto[]>([]);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const data = (await getCity().getApiCityGetAll()).data;
      setCities(data);
    } catch (error) {
      console.error("Błąd pobierania miast:", error);
    }
  };

  const handleSearch = () => {
    if (!address.trim()) return;

    const searchTerm = address.trim().toLowerCase();

    // Szukamy dokładnego dopasowania
    const matchedCity = cities.find((c) => c.name.toLowerCase() === searchTerm);

    if (matchedCity && matchedCity.id) {
      if (onCitySelect) {
        onCitySelect({
          id: matchedCity.id,
          name: matchedCity.name,
        });
      } else {
        navigate("/search", {
          state: { cityId: matchedCity.id, cityName: matchedCity.name },
        });
      }
    } else {
      alert("Wybierz miasto z listy!");
    }
  };

  // Filtrowanie listy do dropdowna
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(address.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* PRZYCISKI LOGOWANIA (TOP RIGHT) */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
        {isAuthenticated ? (
          <button
            onClick={() => isPartner && navigate("/account")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FF6B6B] bg-[#1E1E1E] transition-all group shadow-lg
                    ${
                      isPartner
                        ? "hover:bg-[#FF6B6B] cursor-pointer"
                        : "cursor-default"
                    }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors
                    ${isPartner ? "bg-white text-[#FF6B6B]" : "bg-[#FF6B6B] text-white"}`}
            >
              <User size={14} />
            </div>
            <span
              className={`text-sm font-medium transition-colors ${isPartner ? "text-white group-hover:text-white" : "text-gray-300"}`}
            >
              {user?.email || "Twój Profil"}
            </span>
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="w-48 flex items-center justify-center gap-2 text-white bg-[#1E1E1E] border border-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white px-5 py-2 rounded-full shadow-md transition-all group"
          >
            <UserCircle
              size={18}
              className="text-[#FF6B6B] group-hover:text-white transition-colors"
            />
            <span className="text-sm font-medium">Zaloguj się</span>
          </button>
        )}
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-[#1a0505] to-[#2b0a0a] z-0"></div>

      <div className="z-10 text-center px-4">
        <div className="w-20 h-20 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,107,107,0.4)] mx-auto mb-6">
          <span className="text-4xl">🍕</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Pizza <span className="text-[#FF6B6B]">Radar</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Znajdź najlepszą pizzę w Twojej okolicy. Porównuj ceny, wielkości i
          opłacalność.
          <br />
        </p>

        <div className="bg-[#1E1E1E] p-2 rounded-full flex flex-col md:flex-row items-center gap-2 border border-gray-700 shadow-2xl max-w-2xl mx-auto focus-within:border-[#FF6B6B] transition-colors relative">
          <input
            type="text"
            placeholder="Wpisz miasto (np. Warszawa)..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="bg-transparent text-white w-full h-12 px-4 outline-none text-lg placeholder-gray-500 text-center md:text-left"
          />

          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-8 py-3 rounded-full font-bold text-lg transition shadow-lg whitespace-nowrap"
          >
            Szukaj ➔
          </button>

          {/* --- LISTA MIAST (DROPDOWN) --- */}
          {isDropdownOpen && filteredCities.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#1E1E1E] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
                {filteredCities.map((city, index) => (
                  <button
                    key={city.id || index}
                    onClick={() => {
                      setAddress(city.name);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-gray-300 hover:bg-[#2A2A2A] hover:text-white transition-colors flex items-center gap-2 border-b border-gray-800 last:border-0"
                  >
                    <span className="text-[#FF6B6B]">📍</span>
                    <span>{city.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
