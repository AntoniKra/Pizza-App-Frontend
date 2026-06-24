import { useState, useEffect, useCallback } from "react";
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
import RestaurantsList from "./components/RestaurantsList";
import Header from "./components/Header";
import AddBrandView from "./components/AddBrandView";
import EditPizzaView from "./components/EditPizzaView";
import RestaurantMenuView from "./components/RestaurantMenuView";
import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import { useAuth } from "./hooks/useAuth";
import { customInstance } from "./api/axiosConfig"; // Dodany import do strzałów API
import { getPizza } from "./api/generated/pizza/pizza";
import type { PizzeriaSimpleDto, PizzaSearchResultDto } from "./api/generated/models";

function App() {
  // Zastąpienie mocków pustymi tablicami
  const [restaurantMenu, setRestaurantMenu] = useState<PizzaSearchResultDto[]>([]);
  const [myRestaurants, setMyRestaurants] = useState<PizzeriaSimpleDto[]>([]);
  
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
  const fetchAppData = useCallback(async () => {
    try {
      setIsDataLoading(true);
      setDataError(null);

      const menuResponse = await getPizza().getApiPizzaGetAll();
      const restaurantsResponse = await customInstance<PizzeriaSimpleDto[]>({ url: "/api/Pizzeria/GetAll", method: "GET" });

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
  }, []);

  useEffect(() => {
    fetchAppData();
  }, [fetchAppData]);

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

  const handleAddPizza = (newPizza: PizzaSearchResultDto) => {
    setRestaurantMenu((prevMenu) => [...prevMenu, newPizza]);
  };

  const handleDeleteRestaurant = (id: string) => {
    setMyRestaurants((prev) => prev.filter((rest) => rest.id !== id));
  };

  // Obsługa stanu Loading z Auth oraz z pobierania danych
  if (isLoading || isDataLoading) {
    return <Loader message="Pobieranie danych z serwera..." />;
  }

  // Obsługa stanu Error
  if (dataError) {
    return <ErrorState message={dataError} onButtonClick={fetchAppData} />;
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