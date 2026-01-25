import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
// Importujemy funkcje wygenerowane przez Orval
import { getAuth } from "../api/endpoints/auth/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Pobieramy funkcję logowania z Orvala
      const { postApiAuthLogin } = getAuth();

      // 2. Wysyłamy prawdziwe zapytanie do backendu!
      // Orval wie, że backend oczekuje obiektu LoginDto (email, password)
      await postApiAuthLogin({
        email: email,
        password: password,
      });

      // 3. Jeśli backend nie rzuci błędem -> Sukces!
      alert("Zalogowano pomyślnie!");
      navigate("/"); // Wracamy na stronę główną
    } catch (err: any) {
      console.error("Błąd logowania:", err);
      // Jeśli backend zwróci błąd (np. złe hasło), wyświetlamy go
      setError("Nie udało się zalogować. Sprawdź email i hasło.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col">
      <Header onSearch={() => {}} address="" />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-[#1E1E1E] border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-2">
            Witaj ponownie! 👋
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Zaloguj się do Pizza Radar
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B6B]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Hasło</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF6B6B]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] hover:from-[#ff5252] hover:to-[#ff7b3b] text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-500 text-sm">
            Nie masz konta?{" "}
            <Link to="/register" className="text-[#FF6B6B] hover:underline">
              Zarejestruj się
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
