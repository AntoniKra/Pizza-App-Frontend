import { useState } from "react";
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
import EditRestaurantView from "./components/EditRestaurantView";
import NewPizzaPreviewView from "./components/NewPizzaPreviewView"; // Import podglądu
import type { Pizza } from "./data/mockPizzas";
import RestaurantsList from "./components/RestaurantsList";
import Header from "./components/Header";

// --- DANE PIZZ ---
const INITIAL_MENU: Pizza[] = [
  {
    id: 201,
    name: "Pepperoni",
    pizzeria: "Pizza Hut",
    city: "Warszawa",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500",
    description:
      "Klasyk gatunku. Podwójna porcja salami pepperoni i ser mozzarella. Ciasto PAN.",
    weight: 550,
    kcal: 1400,
    dough: "PAN (Grube)",
    crust: "Grube",
    shape: "Okrągła",
    style: "Classic",
    sauce: "Pomidorowy",
  },
  // ... (reszta Twoich pizz - nie usuwaj ich)
];

const INITIAL_RESTAURANTS = [
  {
    id: 1,
    name: "Pizza Hut Centrum",
    address: "Al. Jerozolimskie 54, Warszawa",
    status: "Otwarte",
    rating: 4.5,
    isNew: false,
    description: "Najpopularniejsza sieć pizzerii na świecie.",
    deliveryPrice: "6.99",
    minOrder: "35.00",
    time: "30",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",
    weekdayOpen: "11:00",
    weekdayClose: "22:00",
    weekendOpen: "12:00",
    weekendClose: "23:00",
  },
];

function App() {
  const [restaurantMenu, setRestaurantMenu] = useState<Pizza[]>(INITIAL_MENU);
  const [myRestaurants, setMyRestaurants] = useState(INITIAL_RESTAURANTS);
  const navigate = useNavigate();

  // 1. Sprawdzamy gdzie jesteśmy (np. czy to strona "/")
  const location = useLocation();

  // 2. To jest nasza "Pamięć Globalna". Tu trzymamy miasto, niezależnie od strony.
  const [selectedCity, setSelectedCity] = useState<{
    id: string;
    name: string;
  } | null>(() => {
    const savedCity = localStorage.getItem("pizza_city");
    return savedCity ? JSON.parse(savedCity) : null;
  });

  // 3. Funkcja: "Szefie, klient wybrał miasto na Landing Page!"
  // Zapisujemy miasto w pamięci i przenosimy klienta do wyszukiwarki.
  const handleCitySelect = (city: { id: string; name: string }) => {
    setSelectedCity(city);
    localStorage.setItem("pizza_city", JSON.stringify(city));
    // Przekazujemy miasto w 'state' nawigacji, żeby PizzaSearch od razu wiedział co robić
    navigate("/search", { state: { cityId: city.id, cityName: city.name } });
  };

  // 4. Funkcja: "Szefie, klient wpisał coś w lupkę w Headerze!"
  // Używamy zapamiętanego miasta (selectedCity) i szukamy.
  const handleHeaderSearch = (term: string) => {
    navigate("/search", {
      state: {
        searchTerm: term,
        cityId: selectedCity?.id, // Szef wyciąga ID miasta z pamięci
        cityName: selectedCity?.name, // i nazwę też
      },
    });
  };

  // Funkcja dodawania pizzy (wywoływana teraz przez NewPizzaPreviewView)
  const handleAddPizza = (newPizza: Pizza) => {
    setRestaurantMenu((prevMenu) => [...prevMenu, newPizza]);
  };

  // Logika restauracji (bez zmian)
  const handleAddRestaurant = (newRestaurant: any) => {
    setMyRestaurants((prev) => [
      ...prev,
      {
        ...newRestaurant,
        id: Date.now(),
        isNew: true,
        status: "Otwarte",
        rating: 0,
      },
    ]);
    navigate("/manage-restaurants");
  };

  const handleEditRestaurant = (updatedRestaurant: any) => {
    setMyRestaurants((prev) =>
      prev.map((rest) =>
        rest.id === updatedRestaurant.id
          ? { ...rest, ...updatedRestaurant }
          : rest,
      ),
    );
    navigate("/manage-restaurants");
  };

  const handleDeleteRestaurant = (id: number) => {
    setMyRestaurants((prev) => prev.filter((rest) => rest.id !== id));
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      {/* 👇 TU JEST GLOBALNY HEADER */}
      {/* Logika: Jeśli NIE jesteśmy na stronie głównej ("/") I NIE na logowaniu... */}
      {location.pathname !== "/" && location.pathname !== "/login" && (
        <Header
          onSearch={handleHeaderSearch} // Przekazujemy funkcję szukania
          address={selectedCity?.name} // Przekazujemy nazwę miasta do wyświetlenia
          cityId={selectedCity?.id}
        />
      )}

      <Routes>
        {/* 👇 ZMIANA W LANDING PAGE */}
        {/* Przekazujemy funkcję handleCitySelect, żeby LandingPage mógł zameldować wybór miasta */}
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

        {/* --- POPRAWIONA TRASA ADD-PIZZA (Usunięto onAdd) --- */}
        <Route
          path="/add-pizza"
          element={<AddPizzaView restaurants={myRestaurants} />}
        />

        {/* --- TRASA PODGLĄDU (Tutaj przekazujemy onConfirm) --- */}
        <Route
          path="/pizza-preview"
          element={<NewPizzaPreviewView onConfirm={handleAddPizza} />}
        />

        {/* Restauracje */}
        <Route
          path="/manage-restaurants"
          element={
            <ManageRestaurantsView
              restaurants={myRestaurants}
              onDelete={handleDeleteRestaurant}
            />
          }
        />
        <Route
          path="/add-restaurant"
          element={<AddRestaurantView onAdd={handleAddRestaurant} />}
        />
        <Route
          path="/edit-restaurant/:id"
          element={
            <EditRestaurantView
              restaurants={myRestaurants}
              onEdit={handleEditRestaurant}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
