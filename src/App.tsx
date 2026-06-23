import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import RestaurantView from "./components/RestaurantView";
import LandingPage from "./components/LandingPage";
import PizzaSearch from "./components/PizzaSearch";
import PizzaDetails from "./components/PizzaDetails";
import AccountView from "./components/AccountView";
import AddPizzaView from "./components/AddPizzaView";
import LoginView from "./components/LoginView";
import ManageRestaurantsView from "./components/ManageRestaurantsView";
import AddRestaurantView from "./components/AddRestaurantView";
import NewPizzaPreviewView from "./components/NewPizzaPreviewView";
import type { Pizza } from "./data/mockPizzas";
import RestaurantsList from "./components/RestaurantsList";
import Header from "./components/Header";
import AddBrandView from "./components/AddBrandView";
import EditPizzaView from "./components/EditPizzaView";
import RestaurantMenuView from "./components/RestaurantMenuView";
import { useAuth } from "./hooks/useAuth";
import { customInstance } from "./api/axiosConfig"; // Dodany import do strzałów API

function App() {
  // Zastąpienie mocków pustymi tablicami
  const [restaurantMenu, setRestaurantMenu] = useState<Pizza[]>([]);
  const [myRestaurants, setMyRestaurants] = useState<any[]>([]);
  
  // Nowe stany ładowania i błędów zdefiniowane w zadaniu
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useAuth();

  const [selectedCity, setSelectedCity] = useState<{
    id: string;
    name: string;
  } | null>(() => {
    const savedCity = localStorage.getItem("pizza_city");
    return savedCity ? JSON.parse(savedCity) : null;
  });

  // POBIERANIE DANYCH Z API
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        setIsDataLoading(true);
        setDataError(null);

        // Pobieramy dane z API. Używamy .catch(() => []), aby API nie crashowało UI przy błędzie
        const menuResponse = await customInstance<Pizza[]>({ url: '/api/Pizza/GetAll', method: 'GET' }).catch(() => []);
        const restaurantsResponse = await customInstance<any[]>({ url: '/api/Pizzeria/GetAll', method: 'GET' }).catch(() => []);

        // Zabezpieczenie przed nieprawidłowym formatem (Empty state fallback)
        setRestaurantMenu(Array.isArray(menuResponse) ? menuResponse : []);
        setMyRestaurants(Array.isArray(restaurantsResponse) ? restaurantsResponse : []);

      } catch (error) {
        console.error("Błąd pobierania danych:", error);
        setDataError("Wystąpił problem podczas pobierania danych z serwera.");
        setRestaurantMenu([]);
        setMyRestaurants([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAppData();
  }, []);

  const handleCitySelect = (city: { id: string; name: string }) => {
    setSelectedCity(city);
    localStorage.setItem("pizza_city", JSON.stringify(city));
    navigate("/search", { state: { cityId: city.id, cityName: city.name } });
  };

  const handleHeaderSearch = (term: string) => {
    navigate("/search", {
      state: {
        searchTerm: term,
        cityId: selectedCity?.id,
        cityName: selectedCity?.name,
      },
    });
  };

  const handleAddPizza = (newPizza: Pizza) => {
    setRestaurantMenu((prevMenu) => [...prevMenu, newPizza]);
  };

  const handleDeleteRestaurant = (id: number) => {
    setMyRestaurants((prev) => prev.filter((rest) => rest.id !== id));
  };

  // Obsługa stanu Loading z Auth oraz z pobierania danych
  if (isLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
         <div className="w-12 h-12 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mb-4"></div>
         <div className="text-gray-400 font-medium animate-pulse">Pobieranie danych z serwera...</div>
      </div>
    );
  }

  // Obsługa stanu Error
  if (dataError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-white">
        <div className="text-red-500 mb-4 text-4xl">⚠️</div>
        <div className="text-gray-300 font-bold mb-6">{dataError}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-[#FF6B6B] rounded-full text-white font-bold hover:bg-red-500 transition"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      {location.pathname !== "/" && location.pathname !== "/login" && (
        <Header
          onSearch={handleHeaderSearch}
          address={selectedCity?.name}
          cityId={selectedCity?.id}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={<LandingPage onCitySelect={handleCitySelect} />}
        />
        <Route path="/login" element={<LoginView />} />
        <Route path="/search" element={<PizzaSearch />} />
        <Route path="/restaurants" element={<RestaurantsList />} />
        <Route path="/pizza/:id" element={<PizzaDetails />} />
        <Route
          path="/restaurant"
          element={<RestaurantView menu={restaurantMenu} />}
        />
        <Route path="/account" element={<AccountView />} />
        <Route path="/add-brand" element={<AddBrandView />} />
        <Route path="/restaurant-menu/:id" element={<RestaurantMenuView />} />
        <Route path="/edit-pizza/:id" element={<EditPizzaView />} />
        <Route path="/add-pizza" element={<AddPizzaView />} />
        <Route
          path="/pizza-preview"
          element={<NewPizzaPreviewView onConfirm={handleAddPizza} />}
        />
        <Route
          path="/manage-restaurants"
          element={
            <ManageRestaurantsView
              restaurants={myRestaurants}
              onDelete={handleDeleteRestaurant}
            />
          }
        />
        <Route path="/add-restaurant" element={<AddRestaurantView />} />
      </Routes>
    </div>
  );
}

export default App;