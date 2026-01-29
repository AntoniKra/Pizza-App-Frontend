import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Flame, Plus, DollarSign } from "lucide-react";

// --- STAŁE (OPCJE) ---
const STYLE_OPTIONS = ["Neapolitańska", "Rzymska", "Sycylijska", "Amerykańska"];
const DOUGH_OPTIONS = [
  "Pszenne",
  "Pełnoziarniste",
  "Orkiszowe",
  "Bezglutenowe",
];
const CRUST_OPTIONS = ["Cienkie", "Grube", "Serowe brzegi"];
const SAUCE_OPTIONS = [
  "Sos pomidorowy",
  "Sos BBQ",
  "Sos śmietanowy",
  "Oliwa z czosnkiem",
];
const POPULAR_INGREDIENTS = [
  "Mozzarella",
  "Oregano",
  "Pepperoni",
  "Szynka (Cotto)",
  "Salami",
  "Boczek",
  "Pieczarki",
  "Cebula",
  "Papryka",
  "Kukurydza",
  "Pomidory",
  "Rukola",
  "Ananas",
];

const AddPizzaView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Odbieramy kontekst: Do której pizzerii dodajemy pizzę?
  const { pizzeriaId, pizzeriaName } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "450",
    kcal: "",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500",
    ingredients: [] as string[],

    // Specyfikacja
    style: "Neapolitańska",
    dough: "Pszenne",
    crust: "Cienkie",
    sauce: "Sos pomidorowy",

    // Wymiary (Domyślnie okrągła 32cm)
    shape: "Okrągła",
    diameter: "32",
    width: "30",
    length: "40",
  });

  // Zabezpieczenie: Jeśli ktoś wejdzie z linku bez kontekstu
  if (!pizzeriaId) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-red-500 mb-2">Błąd kontekstu</h2>
        <p className="text-gray-400 mb-4">
          Nie wybrano pizzerii. Wejdź przez Panel Partnera.
        </p>
        <button
          onClick={() => navigate("/account")}
          className="px-6 py-2 bg-[#252525] rounded-lg hover:bg-[#333] transition"
        >
          Wróć
        </button>
      </div>
    );
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (ingredient: string) => {
    setFormData((prev) => {
      const exists = prev.ingredients.includes(ingredient);
      const newIngredients = exists
        ? prev.ingredients.filter((i) => i !== ingredient)
        : [...prev.ingredients, ingredient];
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
      alert("Nazwa i cena są wymagane!");
      return;
    }

    // --- PRZYGOTOWANIE DTO (CreatePizzaDto) ---
    const createPizzaDto = {
      menuId: pizzeriaId, // 👈 KLUCZOWE: Powiązanie z lokalem
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      weightGrams: Number(formData.weight),
      kcal: formData.kcal ? Number(formData.kcal) : undefined,
      imageUrl: formData.image,
      ingredientIds: formData.ingredients, // Tu normalnie byłyby ID składników, mockujemy nazwami

      // Specyfikacja (Enumy/Stringi)
      style: formData.style,
      dough: formData.dough,
      thickness: formData.crust,
      baseSauce: formData.sauce,
      shape: formData.shape,

      // Wymiary (zależne od kształtu)
      diameterCm:
        formData.shape === "Okrągła" ? Number(formData.diameter) : null,
      widthCm: formData.shape !== "Okrągła" ? Number(formData.width) : null,
      lengthCm: formData.shape !== "Okrągła" ? Number(formData.length) : null,
    };

    console.log(
      "🚀 WYSYŁAM POST /api/Pizza:",
      JSON.stringify(createPizzaDto, null, 2),
    );

    alert(
      `Pizza "${formData.name}" została dodana do menu lokalu: ${pizzeriaName}!`,
    );
    navigate(-1); // Wracamy do listy menu
  };

  // Komponent pomocniczy do kafelków opcji
  const OptionTile = ({ label, selected, onClick }: any) => (
    <div
      onClick={onClick}
      className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-bold border transition-all text-center flex items-center justify-center
        ${
          selected
            ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
            : "bg-[#1A1A1A] border-[#333] text-gray-400 hover:border-gray-500 hover:text-gray-300"
        }`}
    >
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* NAGŁÓWEK */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <p className="text-xs text-red-500 uppercase tracking-wide font-bold mb-1">
              Dodawanie do menu: {pizzeriaName}
            </p>
            <h1 className="text-3xl font-bold">Nowa Pizza</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEWA STRONA: FORMULARZ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Podstawowe Dane */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="flex items-center gap-2 mb-6 text-gray-300 font-bold text-sm uppercase tracking-wider">
                <span className="w-1 h-4 bg-gray-500 rounded-full"></span>{" "}
                Podstawowe
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Nazwa
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="np. Capricciosa"
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Cena (PLN)
                    </label>
                    <div className="relative">
                      <DollarSign
                        size={14}
                        className="absolute left-3 top-3.5 text-gray-500"
                      />
                      <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 pl-8 text-white focus:border-red-500 focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Opis
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none resize-none"
                    placeholder="Składniki, smak..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    URL Zdjęcia
                  </label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Specyfikacja */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="flex items-center gap-2 mb-6 text-orange-400 font-bold text-sm uppercase tracking-wider">
                <span className="w-1 h-4 bg-orange-500 rounded-full"></span>{" "}
                Ciasto i Baza
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                    Styl
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {STYLE_OPTIONS.map((opt) => (
                      <OptionTile
                        key={opt}
                        label={opt}
                        selected={formData.style === opt}
                        onClick={() => handleOptionSelect("style", opt)}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Rodzaj Ciasta
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DOUGH_OPTIONS.map((opt) => (
                        <OptionTile
                          key={opt}
                          label={opt}
                          selected={formData.dough === opt}
                          onClick={() => handleOptionSelect("dough", opt)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                      Sos Bazowy
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SAUCE_OPTIONS.map((opt) => (
                        <OptionTile
                          key={opt}
                          label={opt}
                          selected={formData.sauce === opt}
                          onClick={() => handleOptionSelect("sauce", opt)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Parametry Techniczne */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold text-sm uppercase tracking-wider">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>{" "}
                Parametry
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Kształt
                  </label>
                  <select
                    name="shape"
                    value={formData.shape}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="Okrągła">Okrągła</option>
                    <option value="Prostokątna">Prostokątna</option>
                  </select>
                </div>
                {formData.shape === "Okrągła" ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                      Średnica (cm)
                    </label>
                    <input
                      name="diameter"
                      type="number"
                      value={formData.diameter}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Szer. (cm)
                      </label>
                      <input
                        name="width"
                        type="number"
                        value={formData.width}
                        onChange={handleChange}
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Dł. (cm)
                      </label>
                      <input
                        name="length"
                        type="number"
                        value={formData.length}
                        onChange={handleChange}
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Waga (g)
                  </label>
                  <input
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Kcal
                  </label>
                  <input
                    name="kcal"
                    type="number"
                    value={formData.kcal}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Składniki */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="flex items-center gap-2 mb-6 text-green-400 font-bold text-sm uppercase tracking-wider">
                <span className="w-1 h-4 bg-green-500 rounded-full"></span>{" "}
                Składniki
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {POPULAR_INGREDIENTS.map((ing) => (
                  <label
                    key={ing}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.ingredients.includes(ing) ? "bg-green-500 border-green-500" : "border-gray-600 group-hover:border-gray-400"}`}
                    >
                      {formData.ingredients.includes(ing) && (
                        <CheckCircle size={12} className="text-black" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.ingredients.includes(ing)}
                      onChange={() => handleIngredientChange(ing)}
                    />
                    <span
                      className={`text-sm transition-colors ${formData.ingredients.includes(ing) ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}
                    >
                      {ing}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* PRAWA STRONA: PODGLĄD (STICKY) */}
          <div className="space-y-6 sticky top-6">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <CheckCircle size={16} className="text-green-500" /> Podgląd Karty
            </div>

            <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-2xl relative group">
              {/* Obrazek */}
              <div className="h-48 relative overflow-hidden">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000")
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">
                    {formData.name || "Nazwa Pizzy"}
                  </h3>
                  <span className="text-yellow-400 font-mono font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                    {formData.price || "0"} zł
                  </span>
                </div>
              </div>

              {/* Opis */}
              <div className="p-5">
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                  {formData.description || "Tu pojawi się opis pizzy..."}
                </p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1 bg-[#252525] px-2 py-1 rounded border border-[#333]">
                    <Flame size={12} className="text-orange-500" />{" "}
                    {formData.kcal || "0"} kcal
                  </span>
                  <span className="bg-[#252525] px-2 py-1 rounded border border-[#333]">
                    {formData.weight}g
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  <span className="text-[10px] text-gray-500 bg-[#222] px-1.5 py-0.5 rounded border border-[#333]">
                    {formData.style}
                  </span>
                  <span className="text-[10px] text-gray-500 bg-[#222] px-1.5 py-0.5 rounded border border-[#333]">
                    {formData.dough}
                  </span>
                  {formData.ingredients.slice(0, 3).map((ing) => (
                    <span
                      key={ing}
                      className="text-[10px] text-green-400 bg-green-900/10 px-1.5 py-0.5 rounded border border-green-900/20"
                    >
                      {ing}
                    </span>
                  ))}
                  {formData.ingredients.length > 3 && (
                    <span className="text-[10px] text-gray-500">
                      +{formData.ingredients.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg shadow-red-900/20 hover:to-red-600 transition text-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] duration-200"
            >
              <Plus size={20} /> Dodaj do Menu
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddPizzaView;
