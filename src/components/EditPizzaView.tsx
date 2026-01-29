import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  BarChart3,
  Flame,
  Save,
  Trash2,
} from "lucide-react";

// Opcje (te same co w AddPizzaView)
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

const EditPizzaView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  // Próbujemy wziąć dane przekazane z listy, żeby nie strzelać do API (optymalizacja UX)
  const initialData = location.state?.pizzaData;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "450",
    kcal: "",
    image: "",
    ingredients: [] as string[],
    style: "Neapolitańska",
    dough: "Pszenne",
    crust: "Cienkie",
    sauce: "Sos pomidorowy",
    shape: "Okrągła",
    diameter: "32",
    length: "40",
    width: "30",
  });

  useEffect(() => {
    if (initialData) {
      // Jeśli mamy dane z nawigacji, użyj ich
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price.toString(),
        weight: initialData.weight?.toString() || "450",
        kcal: initialData.kcal?.toString() || "0",
        image: initialData.image,
        ingredients: initialData.ingredients || [],
        style: initialData.style || "Neapolitańska",
        dough: initialData.dough || "Pszenne",
        crust: initialData.crust || "Cienkie",
        sauce: initialData.sauce || "Sos pomidorowy",
        shape: initialData.shape || "Okrągła",
        diameter: initialData.diameter?.toString() || "32",
        length: initialData.length?.toString() || "40",
        width: initialData.width?.toString() || "30",
      });
    } else {
      // Fallback: Tu byśmy pobierali pizzę z API po ID, jeśli user wszedł z linku
      console.log("Brak danych w state, pobieram dla ID:", id);
    }
  }, [initialData, id]);

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

  const handleSave = () => {
    console.log("🚀 Zapisuję zmiany pizzy ID:", id, formData);
    // Tutaj strzał: PUT /api/Pizza/{id}
    alert("Pizza zaktualizowana!");
    navigate(-1); // Wróć do listy menu
  };

  // --- KOMPONENTY POMOCNICZE (Kafelki) ---
  const OptionTile = ({ label, selected, onClick }: any) => (
    <div
      onClick={onClick}
      className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-bold border transition-all text-center flex items-center justify-center
        ${selected ? "bg-red-500/20 border-red-500 text-red-400" : "bg-[#1A1A1A] border-[#333] text-gray-400 hover:border-gray-500"}`}
    >
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <p className="text-xs text-yellow-500 uppercase tracking-wide font-bold mb-1">
                Edycja Produktu
              </p>
              <h1 className="text-3xl font-bold">Edytuj Pizzę</h1>
            </div>
          </div>
          <button className="text-red-500 flex items-center gap-2 text-sm font-bold border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 transition">
            <Trash2 size={16} /> Usuń
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEWA KOLUMNA */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nazwa
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Cena (zł)
                    </label>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-yellow-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Opis
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-yellow-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    URL Zdjęcia
                  </label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white text-xs focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Specyfikacja (Skrócona wersja dla edycji) */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
                Parametry
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-gray-500">Styl</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {STYLE_OPTIONS.slice(0, 2).map((opt) => (
                      <OptionTile
                        key={opt}
                        label={opt}
                        selected={formData.style === opt}
                        onClick={() => handleOptionSelect("style", opt)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Ciasto</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {DOUGH_OPTIONS.slice(0, 2).map((opt) => (
                      <OptionTile
                        key={opt}
                        label={opt}
                        selected={formData.dough === opt}
                        onClick={() => handleOptionSelect("dough", opt)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {POPULAR_INGREDIENTS.slice(0, 6).map((ing) => (
                  <label
                    key={ing}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-300"
                  >
                    <input
                      type="checkbox"
                      checked={formData.ingredients.includes(ing)}
                      onChange={() => handleIngredientChange(ing)}
                      className="accent-yellow-500"
                    />
                    {ing}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* PRAWA KOLUMNA: PODGLĄD */}
          <div className="space-y-6 sticky top-6">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <CheckCircle size={16} className="text-green-500" /> Podgląd
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#333] shadow-2xl">
              <div className="h-40 w-full relative">
                <img
                  src={formData.image}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {formData.name}
                  </h3>
                  <span className="text-yellow-500 font-bold text-lg">
                    {formData.price} zł
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                  {formData.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {formData.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="bg-[#252525] text-gray-400 text-[10px] px-2 py-1 rounded border border-[#333]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/20 hover:to-yellow-500 transition text-lg flex items-center justify-center gap-2"
            >
              <Save size={20} /> Zapisz Zmiany
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditPizzaView;
