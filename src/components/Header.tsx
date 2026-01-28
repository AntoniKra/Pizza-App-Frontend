import React from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, UtensilsCrossed, Map } from "lucide-react";
// 1. Importujemy nasz "Mózg" logowania
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  onSearch: (term: string) => void;
  address?: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, address }) => {
  const navigate = useNavigate();
  // 2. Wyciągamy dane użytkownika i funkcję wylogowania
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/"); // Po wylogowaniu wracamy na główną
  };

  /// 1. Pobieramy rolę bezpiecznie (obsługa .NET i zwykłego API)
  // Używamy rzutowania (user as any), bo TypeScript nie widzi tego długiego klucza w interfejsie
  const userRole =
    user?.role ||
    (user as any)?.[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];

  // 2. Sprawdzamy uprawnienia (ignorując wielkość liter dla pewności)
  const isPartner =
    userRole === "Partner" || userRole === "Owner" || userRole === "partner";

  const handleProfileClick = () => {
    // Przekieruj tylko jeśli system rozpoznał Partnera
    if (isPartner) {
      navigate("/account");
    } else {
      console.log("Kliknięto, ale nie jesteś rozpoznany jako Partner.");
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-50">
      {/* LEWA STRONA: LOGO */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer hover:opacity-80 flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
          <span className="text-xl">🍕</span>
        </div>
        <span className="text-xl font-bold text-white tracking-wide hidden sm:block">
          Pizza Radar
        </span>
      </div>

      {/* ŚRODEK: WYSZUKIWARKA */}
      <div className="flex-1 max-w-2xl mx-4 sm:mx-8 bg-[#1E1E1E] rounded-full flex items-center p-1 border border-gray-700 focus-within:border-[#FF6B6B] focus-within:shadow-[0_0_15px_rgba(255,107,107,0.15)] transition-all duration-300">
        <div className="pl-3 text-gray-400">🔍</div>
        <input
          type="text"
          placeholder="Szukaj pizzy, lokalu..."
          className="bg-transparent text-gray-200 w-full outline-none px-3 placeholder-gray-500 text-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="w-[1px] h-6 bg-gray-700 mx-2 hidden sm:block"></div>

        <div className="hidden sm:flex items-center gap-2 ">
          <div
            title={address || "Brak lokalizacji"}
            className="flex items-center gap-1 text-gray-300 text-sm cursor-pointer hover:text-white transition"
          >
            <span>📍</span>
            <span className="font-medium text-sm max-w-[100px] truncate">
              {address || "Lokalizacja"}
            </span>
          </div>
          <button className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:from-[#ff5252] hover:to-[#ff7b3b] text-white px-5 py-2 rounded-full font-semibold transition shadow-lg shadow-red-900/40 text-sm whitespace-nowrap">
            Szukaj
          </button>
        </div>
      </div>

      {/* PRAWA STRONA: INTERAKTYWNA (ZALOGOWANY vs NIEZALOGOWANY) */}
      <div className="flex items-center gap-4 text-sm font-medium">
        {/* 1. Znajdź Pizzę (PizzaSearch) */}
        <button
          onClick={() => navigate("/search")}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition hover:bg-white/5 px-3 py-1.5 rounded-lg"
        >
          <UtensilsCrossed size={18} className="text-[#FF6B6B]" />
          <span>Znajdź Pizzę</span>
        </button>

        {/* 2. Restauracje (Placeholder - czekamy na widok od kolegi) */}
        <button className="flex items-center gap-2 text-gray-300 hover:text-white transition hover:bg-white/5 px-3 py-1.5 rounded-lg">
          <Map size={18} className="text-gray-400" />
          <span>Restauracje</span>
        </button>

        {/* Mała kreska oddzielająca menu od logowania */}
        <div className="w-[1px] h-6 bg-gray-800 mx-1"></div>

        {isAuthenticated ? (
          // --- WIDOK ZALOGOWANEGO UŻYTKOWNIKA ---
          <>
            {/* Przycisk Konta (z Emailem) */}
            <button
              onClick={handleProfileClick}
              // Logika wyglądu: Partner ma "rączkę" i podświetlenie, User ma zwykły kursor
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-700 transition-all
                    ${
                      isPartner
                        ? "hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/10 cursor-pointer text-white"
                        : "cursor-default text-gray-300 border-transparent bg-transparent"
                    }`}
            >
              <div className="w-6 h-6 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white text-xs shadow-md">
                <User size={14} />
              </div>
              <span className="hidden lg:inline max-w-[120px] truncate font-medium">
                {user?.email || "Konto"}
              </span>
            </button>

            {/* Przycisk Wyloguj */}
            <button
              onClick={handleLogout}
              title="Wyloguj się"
              className="text-gray-500 hover:text-red-400 transition p-2 hover:bg-red-500/10 rounded-full"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          // NIEZALOGOWANY:
          <>
            {/* Otwiera logowanie od razu na zakładce Partner */}
            <button
              onClick={() => navigate("/login", { state: { role: "partner" } })}
              className="hidden lg:block text-[#FF6B6B] hover:text-white transition px-3 py-1 whitespace-nowrap"
            >
              Strefa Partnera
            </button>

            {/* Otwiera logowanie domyślnie (zakładka User) */}
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-gray-200 transition text-sm shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            >
              Zaloguj
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
