import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, Mail, User, Store, FileText, CheckCircle } from "lucide-react";

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const role = location.state?.role || "user"; 
  const isPartner = role === "partner";

  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPartner) {
        navigate("/account");
    } else {
        alert("Zalogowano pomyślnie! (Dashboard użytkownika w budowie)");
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-[#1a0505] to-[#090202] z-0"></div>

      {/* PRZYCISK POWROTU */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-5 py-2 rounded-full bg-[#1E1E1E] border border-gray-700 text-white hover:bg-white/10 transition-all z-20 shadow-lg group"
      >
        <ArrowLeft size={18} className="text-gray-400 group-hover:text-white transition-colors" /> 
        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Wróć do strony głównej</span>
      </button>

      <div className="w-full max-w-md bg-[#1E1E1E] border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF6B6B]/20">
            <span className="text-3xl">{isPartner ? "💼" : "🍕"}</span>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {isPartner 
                ? (isLogin ? "Panel Partnera" : "Zostań Partnerem")
                : (isLogin ? "Witaj ponownie!" : "Załóż konto")
            }
          </h2>
          <p className="text-gray-400 text-sm">
            {isPartner 
              ? "Zarządzaj swoją restauracją w Pizza Radar" 
              : "Zapisuj ulubione pizze i oceniaj lokale"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* --- POLA DLA REJESTRACJI PARTNERA (SPECIFICZNE) --- */}
          {!isLogin && isPartner && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                
                {/* 1. Nazwa Restauracji */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Nazwa Restauracji</label>
                    <div className="relative">
                        <Store className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input 
                        type="text" 
                        placeholder=""
                        className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF6B6B] focus:outline-none transition"
                        />
                    </div>
                </div>

                {/* 2. NIP */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">NIP</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input 
                        type="text" 
                        placeholder=""
                        className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF6B6B] focus:outline-none transition"
                        />
                    </div>
                </div>

                {/* 3. Nazwa Użytkownika (Partner) */}
                <div className="space-y-1">
                    <label className="text-xs text-gray-500 font-bold uppercase ml-1">Nazwa Użytkownika</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-500" size={18} />
                        <input 
                        type="text" 
                        placeholder=""
                        className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF6B6B] focus:outline-none transition"
                        />
                    </div>
                </div>
            </div>
          )}

          {/* --- POLA DLA REJESTRACJI USERA (SPECIFICZNE) --- */}
          {!isLogin && !isPartner && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
              {/* ZMIANA: Etykieta "Nazwa Użytkownika" zamiast "Twoje Imię" */}
              <label className="text-xs text-gray-500 font-bold uppercase ml-1">Nazwa Użytkownika</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder=""
                  className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF6B6B] focus:outline-none transition"
                />
              </div>
            </div>
          )}

          {/* --- WSPÓLNE POLE: EMAIL (LUB LOGIN) --- */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-bold uppercase ml-1">
                {/* ZMIANA: Teraz dla wszystkich przy logowaniu jest "Email lub Nazwa" */}
                {isLogin ? "Email lub Nazwa Użytkownika" : "Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder=""
                className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF6B6B] focus:outline-none transition"
              />
            </div>
          </div>

          {/* --- WSPÓLNE POLE: HASŁO --- */}
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-bold uppercase ml-1">Hasło</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input 
                type="password" 
                placeholder=""
                className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF6B6B] focus:outline-none transition"
              />
            </div>
          </div>

          {/* --- WSPÓLNE POLE: POWTÓRZ HASŁO (DLA KAŻDEJ REJESTRACJI) --- */}
          {!isLogin && (
             <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs text-gray-500 font-bold uppercase ml-1">Powtórz hasło</label>
                <div className="relative">
                    <CheckCircle className="absolute left-3 top-3 text-gray-500" size={18} />
                    <input 
                    type="password" 
                    placeholder=""
                    className="w-full bg-[#121212] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-[#FF6B6B] focus:outline-none transition"
                    />
                </div>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/20 transition-all mt-4"
          >
            {isLogin ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Nie masz jeszcze konta?" : "Masz już konto?"}{" "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#FF6B6B] font-bold hover:underline"
            >
              {isLogin ? "Zarejestruj się" : "Zaloguj się"}
            </button>
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
                Jesteś w strefie: <span className="text-gray-400 font-bold uppercase">{isPartner ? "Dla Biznesu" : "Dla Klienta"}</span>
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginView;