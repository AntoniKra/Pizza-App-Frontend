import axios from "axios";
import type {
  PizzaSearchResult,
  PizzaDetails,
  PizzaSearchCriteria,
  City,
} from "../types/apiTypes";
import { getCity } from "./endpoints/city/city";
import { getPizza } from "./endpoints/pizza/pizza";

// Zmień port na ten, na którym działa Twój backend (sprawdź w launchSettings.json API)
// Zazwyczaj to https://localhost:7097 lub http://localhost:5000
const API_URL = "https://localhost:7115/api";

export const pizzaService = {
  // Wyszukiwanie pizz (z filtrowaniem)
  searchPizzas: async (criteria: PizzaSearchCriteria) => {
    // Axios sam zamieni obiekt criteria na query string (np. ?cityId=1&minPrice=20)
    const response = await getPizza().getApiPizzaSearch({
      CityId: criteria.cityId,
    });
    return response;
  },

  // Pobieranie szczegółów jednej pizzy
  getPizzaDetails: async (id: string) => {
    const response = await axios.get<PizzaDetails>(`${API_URL}/Pizza/${id}`);
    return response.data;
  },

  // Pobieranie miast (potrzebujemy tego do LandingPage!)
  // Backend musi mieć endpoint do miast. Jeśli nie ma, użyjemy mocka na razie.

  // Pobieranie miast z backendu (.NET)
  getCities: async () => {
    // Endpoint z CityController: [HttpGet("GetAll")] -> api/City/GetAll
    const response = await getCity().getApiCityGetAll();
    return response.data;
  },
};
