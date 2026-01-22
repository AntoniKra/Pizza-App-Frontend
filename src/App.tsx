import { Routes, Route } from "react-router-dom";
import RestaurantView from "./components/RestaurantView";
import LandingPage from "./components/LandingPage";
import PizzaSearch from "./components/PizzaSearch";
import PizzaDetails from "./components/PizzaDetails";


function App() {
  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <Routes>
        {/* 1. Strona Główna (Landing Page) */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Wyszukiwarka i Lista Pizz (Tu wyświetli się Twój PizzaSearch) */}
        <Route path="/search" element={<PizzaSearch />} />

        {/* 3. Szczegóły konkretnej pizzy */}
        <Route path="/pizza/:id" element={<PizzaDetails />} />

        {/* 4. Menu konkretnej pizzeri */}
        <Route path="/restaurant" element={<RestaurantView />} />
      </Routes>
    </div>
  );
}

export default App;
