// src/types/apiTypes.ts

export interface PizzaSearchResult {
  id: string; // Guid w C# to string w TS
  name: string;
  brandName: string;
  description: string;
  price: number;
  imageUrl: string;
  weightGrams: number;
  kcal: number;
  diameterCm?: number;
  styleName: string;
  pricePerSqCm: number;
  ingredientNames: string[];
}

export interface PizzaDetails {
  id: string;
  menuId: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  weightGrams: number;
  kcal: number;

  // Te pola mogą być obiektami {id, name} jeśli backend tak zwraca LookUpItemDto
  // Ale na podstawie kontrolera widzę, że to proste typy w DTO szczegółów
  diameterCm: number;
  widthCm: number;
  lengthCm: number;

  ingredients: {
    id: number;
    name: string;
    isAllergen: boolean;
    isMeat: boolean;
  }[];
}

export interface PizzaSearchCriteria {
  cityId?: string; // Ważne: Backend wymaga CityId, nie nazwy miasta!
  brandIds?: number[];
  styles?: number[]; // Enumy jako int
  minPrice?: number;
  maxPrice?: number;
  sortBy?: number; // Enum
  pageNumber: number;
  pageSize: number;
}

export interface City {
  id: string; // Guid
  name: string;
  region?: string;
  countryName?: string;
}
