import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  Store,
  FileText,
  CheckCircle,
  ChefHat,
  Utensils,
} from "lucide-react";
import { getAuth } from "../api/endpoints/auth/auth";

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const initialRole = location.state?.role || "user";
  const [activeTab, setActiveTab] = useState<"user" | "partner">(initialRole);

  const isPartner = activeTab === "partner";
  const [isLogin, setIsLogin] = useState(true);

  // --- STATE FORMULARZA ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [storeName, setStoreName] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [activeTab, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { postApiAuthLogin, postApiAuthRegister } = getAuth();

      if (isLogin) {
        const response = await postApiAuthLogin({
          email: email,
          password: password,
        });
        const token = (response.data as any).token;
        login(token);
        alert("Zalogowano pomyślnie!");
        if (isPartner) navigate("/account");
        else navigate("/");
      } else {
        if (password !== confirmPassword) {
          setError("Hasła nie są identyczne!");
          setIsLoading(false);
          return;
        }
        await postApiAuthRegister({
          email: email,
          password: password,
          firstName: firstName,
          lastName: storeName || "",
          taxId: isPartner ? taxId : undefined,
          isOwner: isPartner,
        });
        alert("Rejestracja udana! Możesz się teraz zalogować.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error("Błąd API:", err);
      if (err.response?.status === 401) {
        setError("Błędny email lub hasło.");
      } else if (err.response?.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "Wystąpił błąd.",
        );
      } else {
        setError("Błąd połączenia z serwerem.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#FF6B6B] selection:text-white">
      {/* 1. AMBIENT BACKGROUND (Żywe tło) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6B6B]/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 z-0"></div>

      {/* PRZYCISK POWROTU */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all z-20 shadow-lg group hover:border-[#FF6B6B]/50"
      >
        <ArrowLeft
          size={18}
          className="text-gray-400 group-hover:text-[#FF6B6B] transition-colors"
        />
        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
          Strona główna
        </span>
      </button>

      {/* 2. GLASSMORPHISM CONTAINER */}
      <div className="w-full max-w-md bg-[#181818]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500 overflow-hidden ring-1 ring-white/5">
        {/* --- 3. SMOOTH TABS (Animowane Zakładki) --- */}
        <div className="relative flex border-b border-white/10">
          {/* Animowany pasek ("Laser") */}
          <div
            className={`absolute bottom-0 h-[2px] bg-[#FF6B6B] shadow-[0_0_15px_#FF6B6B] transition-all duration-300 ease-out w-1/2 
            ${activeTab === "user" ? "left-0 translate-x-0" : "left-0 translate-x-full"}`}
          />

          <button
            onClick={() => setActiveTab("user")}
            className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
              ${activeTab === "user" ? "text-white" : "text-gray-500 hover:text-gray-300 bg-black/20"}`}
          >
            <Utensils
              size={18}
              className={
                activeTab === "user"
                  ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  : ""
              }
            />
            Dla Klienta
          </button>
          <button
            onClick={() => setActiveTab("partner")}
            className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
              ${activeTab === "partner" ? "text-white" : "text-gray-500 hover:text-gray-300 bg-black/20"}`}
          >
            <ChefHat
              size={18}
              className={
                activeTab === "partner"
                  ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  : ""
              }
            />
            Dla Partnera
          </button>
        </div>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isPartner
                ? isLogin
                  ? "Panel Partnera"
                  : "Zostań Partnerem"
                : isLogin
                  ? "Witaj ponownie!"
                  : "Załóż konto"}
            </h2>
            <p className="text-gray-400 text-sm">
              {isPartner
                ? "Zarządzaj swoją restauracją w Pizza Radar"
                : "Zapisuj ulubione pizze i oceniaj lokale"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* --- 4. NEON INPUTS (Komponent wielokrotnego użytku wewnątrz) --- */}

            {/* PARTNER FIELDS */}
            {!isLogin && isPartner && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-4">
                <NeonInput
                  label="Nazwa Użytkownika"
                  icon={User}
                  type="text"
                  value={firstName}
                  onChange={setFirstName}
                />
                <NeonInput
                  label="Nazwa Restauracji"
                  icon={Store}
                  type="text"
                  value={storeName}
                  onChange={setStoreName}
                />
                <NeonInput
                  label="NIP"
                  icon={FileText}
                  type="text"
                  value={taxId}
                  onChange={setTaxId}
                />
              </div>
            )}

            {/* USER FIELDS */}
            {!isLogin && !isPartner && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
                <NeonInput
                  label="Nazwa Użytkownika"
                  icon={User}
                  type="text"
                  value={firstName}
                  onChange={setFirstName}
                />
              </div>
            )}

            {/* COMMON FIELDS */}
            <NeonInput
              label={isLogin ? "Email" : "Email"}
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <NeonInput
              label="Hasło"
              icon={Lock}
              type="password"
              value={password}
              onChange={setPassword}
              required
            />

            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <NeonInput
                  label="Powtórz hasło"
                  icon={CheckCircle}
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#ff4757] hover:from-[#ff5252] hover:to-[#ff3333] text-white font-bold py-4 rounded-xl shadow-[0_5px_20px_rgba(255,107,107,0.3)] hover:shadow-[0_8px_25px_rgba(255,107,107,0.5)] transition-all transform hover:-translate-y-0.5 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Przetwarzanie..."
                : isLogin
                  ? "Zaloguj się"
                  : "Zarejestruj się"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Nie masz jeszcze konta?" : "Masz już konto?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-[#FF6B6B] font-bold hover:text-white transition-colors ml-1"
              >
                {isLogin ? "Zarejestruj się" : "Zaloguj się"}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold">
              Strefa:{" "}
              <span
                className={
                  isPartner
                    ? "text-[#FF6B6B] drop-shadow-[0_0_5px_rgba(255,107,107,0.8)]"
                    : "text-gray-400"
                }
              >
                {isPartner ? "Dla Biznesu" : "Dla Klienta"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- POMOCNICZY KOMPONENT DLA PÓL (NEON EFFECT) ---
const NeonInput = ({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  required = false,
}: any) => (
  <div className="space-y-1 group">
    <label className="text-xs text-gray-500 font-bold uppercase ml-1 group-focus-within:text-[#FF6B6B] transition-colors duration-300">
      {label}
    </label>
    <div className="relative">
      <Icon
        className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-[#FF6B6B] group-focus-within:drop-shadow-[0_0_5px_rgba(255,107,107,0.8)] transition-all duration-300"
        size={18}
      />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-black/20 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 
          focus:border-[#FF6B6B] focus:bg-black/40 focus:outline-none focus:shadow-[0_0_15px_rgba(255,107,107,0.15)] 
          transition-all duration-300"
      />
    </div>
  </div>
);

export default LoginView;
