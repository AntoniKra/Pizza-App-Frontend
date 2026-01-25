import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { ArrowLeft, CheckCircle, BarChart3, Store, Flame } from "lucide-react";
import type { Pizza } from "../data/mockPizzas";

// --- DANE OPCJI ---
const POPULAR_INGREDIENTS = [
    "Mozzarella", "Oregano", "Pepperoni", "Szynka (Cotto)", 
    "Salami", "Boczek", "Kurczak", "Szynka parmeńska", "Pieczarki", 
    "Cebula", "Papryka", "Kukurydza", "Pomidory", "Oliwki", 
    "Czosnek", "Parmezan", "Rukola", "Ser pleśniowy", "Ananas"
];

const STYLE_OPTIONS = ["Neapolitańska", "Rzymska", "Sycylijska", "Amerykańska"];
const DOUGH_OPTIONS = ["Pszenne", "Pełnoziarniste", "Orkiszowe", "Bezglutenowe"];
const CRUST_OPTIONS = ["Cienkie", "Grube", "Serowe brzegi"];
const SAUCE_OPTIONS = ["Sos pomidorowy", "Sos BBQ", "Sos śmietanowy", "Oliwa z czosnkiem"];

interface AddPizzaViewProps {
  restaurants: any[];
}

const AddPizzaView = ({ restaurants }: AddPizzaViewProps) => {
  const navigate = useNavigate();

  // Stan formularza
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "450",
    kcal: "", 
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500",
    pizzeriaId: restaurants.length > 0 ? restaurants[0].id : 0,
    ingredients: [] as string[],
    otherIngredient: "",
    showOtherInput: false,
    
    // Specyfikacja
    style: "Neapolitańska",
    dough: "Pszenne",
    crust: "Cienkie",
    sauce: "Sos pomidorowy",

    // Kształt
    shape: "Okrągła",
    diameter: "32",
    length: "40",
    width: "30"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (ingredient: string) => {
      setFormData(prev => {
          const exists = prev.ingredients.includes(ingredient);
          const newIngredients = exists 
            ? prev.ingredients.filter(i => i !== ingredient)
            : [...prev.ingredients, ingredient];
          return { ...prev, ingredients: newIngredients };
      });
  };

  const handleOtherIngredientToggle = () => {
      setFormData(prev => ({ ...prev, showOtherInput: !prev.showOtherInput }));
  };

  const selectedRestaurant = restaurants.find(r => r.id === Number(formData.pizzeriaId)) || restaurants[0];

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
        alert("Proszę uzupełnić nazwę i cenę pizzy!");
        return;
    }

    let finalIngredients = [...formData.ingredients];
    if (formData.showOtherInput && formData.otherIngredient) {
        const customs = formData.otherIngredient.split(',').map(s => s.trim()).filter(s => s.length > 0);
        finalIngredients = [...finalIngredients, ...customs];
    }

    const description = formData.description || finalIngredients.join(", ");

    const newPizza: Pizza = {
        id: Date.now(),
        name: formData.name,
        description: description,
        price: parseFloat(formData.price),
        image: formData.image,
        
        shape: formData.shape,
        diameter: formData.shape === "Okrągła" ? parseInt(formData.diameter) : undefined,
        width: formData.shape === "Prostokątna" ? parseInt(formData.width) : undefined,
        length: formData.shape === "Prostokątna" ? parseInt(formData.length) : undefined,
        
        weight: parseInt(formData.weight),
        kcal: parseInt(formData.kcal) || 0,
        pizzeria: selectedRestaurant?.name || "Moja Pizzeria",
        city: "Warszawa",
        
        style: formData.style,
        dough: formData.dough,
        crust: formData.crust,
        sauce: formData.sauce,
        
        isNew: true 
    };

    navigate("/pizza-preview", { state: { pizzaData: newPizza, ingredientsList: finalIngredients } });
  };

  // --- OBLICZENIA ---
  const priceVal = parseFloat(formData.price) || 0;
  const weightVal = parseFloat(formData.weight) || 1;
  let area = 0;

  if (formData.shape === "Okrągła") {
      const radius = (parseFloat(formData.diameter) || 0) / 2;
      area = Math.PI * (radius * radius);
  } else {
      area = (parseFloat(formData.width) || 0) * (parseFloat(formData.length) || 0);
  }
  
  const pricePer100g = (priceVal / weightVal) * 100;
  const pricePerCm2 = area > 0 ? priceVal / area : 0;

  const previewIngredients = [...formData.ingredients];
  if (formData.showOtherInput && formData.otherIngredient) {
      previewIngredients.push(...formData.otherIngredient.split(',').map(s => s.trim()).filter(s => s));
  }

  // --- KOMPONENT KAFELKA ---
  const OptionTile = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => (
      <div 
        onClick={onClick}
        className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-bold border transition-all text-center flex items-center justify-center
        ${selected 
            ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
            : "bg-[#1A1A1A] border-[#333] text-gray-400 hover:border-gray-500 hover:text-gray-300"
        }`}
      >
          {label}
      </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <Header onSearch={() => {}} />

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        
        <div className="flex items-center gap-4 mb-8">
             <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wide">Panel Partnera / Menu</p>
                 <h1 className="text-3xl font-bold mt-1">Dodaj nową pizzę</h1>
             </div>
        </div>

        {/* ZMIANA: items-start jest kluczowe dla sticky sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEWA KOLUMNA */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Lokalizacja & Info */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                    <div className="flex items-center gap-2 mb-4 text-blue-400 font-bold text-sm uppercase tracking-wider">
                         <span className="w-1 h-4 bg-blue-500 rounded-full"></span> Podstawowe informacje
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Restauracja</label>
                            <div className="relative">
                                <Store className="absolute left-3 top-3 text-gray-500" size={18} />
                                <select 
                                    name="pizzeriaId"
                                    value={formData.pizzeriaId}
                                    onChange={handleChange}
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none appearance-none cursor-pointer"
                                >
                                    {restaurants.map(rest => (
                                        <option key={rest.id} value={rest.id}>
                                            {rest.name} - {rest.address}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-3.5 text-gray-500 pointer-events-none text-xs">▼</div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nazwa Pizzy</label>
                            <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="" className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Opis (Opcjonalnie)</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} placeholder="" className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors resize-none" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">URL Zdjęcia</label>
                            <input name="image" value={formData.image} onChange={handleChange} type="text" className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 text-xs text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* 2. Specyfikacja */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                    <div className="flex items-center gap-2 mb-6 text-purple-400 font-bold text-sm uppercase tracking-wider">
                         <span className="w-1 h-4 bg-purple-500 rounded-full"></span> Specyfikacja
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Styl Pizzy</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {STYLE_OPTIONS.map(opt => (
                                    <OptionTile key={opt} label={opt} selected={formData.style === opt} onClick={() => handleOptionSelect("style", opt)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rodzaj Ciasta</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {DOUGH_OPTIONS.map(opt => (
                                    <OptionTile key={opt} label={opt} selected={formData.dough === opt} onClick={() => handleOptionSelect("dough", opt)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brzegi</label>
                            <div className="grid grid-cols-3 gap-2">
                                {CRUST_OPTIONS.map(opt => (
                                    <OptionTile key={opt} label={opt} selected={formData.crust === opt} onClick={() => handleOptionSelect("crust", opt)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sos Bazowy</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {SAUCE_OPTIONS.map(opt => (
                                    <OptionTile key={opt} label={opt} selected={formData.sauce === opt} onClick={() => handleOptionSelect("sauce", opt)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Parametry (Shape + KCAL) */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm uppercase tracking-wider">
                            <span className="w-1 h-4 bg-yellow-500 rounded-full"></span> Parametry
                        </div>
                        
                        <div className="flex bg-[#1A1A1A] p-1 rounded-lg border border-[#333]">
                            <button onClick={() => setFormData(prev => ({ ...prev, shape: "Okrągła" }))} className={`px-3 py-1 rounded text-xs font-bold transition ${formData.shape === "Okrągła" ? "bg-yellow-500 text-black shadow" : "text-gray-500 hover:text-white"}`}>Okrągła</button>
                            <button onClick={() => setFormData(prev => ({ ...prev, shape: "Prostokątna" }))} className={`px-3 py-1 rounded text-xs font-bold transition ${formData.shape === "Prostokątna" ? "bg-yellow-500 text-black shadow" : "text-gray-500 hover:text-white"}`}>Prostokątna</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cena</label>
                            <div className="relative">
                                <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-yellow-500 focus:outline-none" placeholder="0.00" />
                                <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">PLN</span>
                            </div>
                        </div>

                        {formData.shape === "Okrągła" ? (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Średnica</label>
                                <div className="relative">
                                    <input name="diameter" type="number" value={formData.diameter} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-yellow-500 focus:outline-none" />
                                    <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">cm</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Długość</label>
                                    <div className="relative">
                                        <input name="length" type="number" value={formData.length} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-yellow-500 focus:outline-none" />
                                        <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">cm</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Szerokość</label>
                                    <div className="relative">
                                        <input name="width" type="number" value={formData.width} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-yellow-500 focus:outline-none" />
                                        <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">cm</span>
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Waga</label>
                            <div className="relative">
                                <input name="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-yellow-500 focus:outline-none" />
                                <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">g</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kcal</label>
                            <div className="relative">
                                <input name="kcal" type="number" value={formData.kcal} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-yellow-500 focus:outline-none" placeholder="0" />
                                <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold flex items-center gap-1"><Flame size={10} /></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Składniki (Zmieniono label na Składniki) */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                    <div className="flex items-center gap-2 mb-6 text-green-400 font-bold text-sm uppercase tracking-wider">
                         <span className="w-1 h-4 bg-green-500 rounded-full"></span> Składniki
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {POPULAR_INGREDIENTS.map(ing => (
                            <label key={ing} className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.ingredients.includes(ing) ? "bg-green-500 border-green-500" : "border-gray-600 group-hover:border-gray-400"}`}>
                                    {formData.ingredients.includes(ing) && <CheckCircle size={12} className="text-black" />}
                                </div>
                                <input type="checkbox" className="hidden" checked={formData.ingredients.includes(ing)} onChange={() => handleIngredientChange(ing)} />
                                <span className={`text-sm transition-colors ${formData.ingredients.includes(ing) ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}>{ing}</span>
                            </label>
                        ))}
                    </div>
                    <div className="border-t border-[#333] pt-4">
                        <label className="flex items-center gap-2 cursor-pointer mb-3">
                             <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.showOtherInput ? "bg-green-500 border-green-500" : "border-gray-600"}`}>
                                {formData.showOtherInput && <CheckCircle size={12} className="text-black" />}
                             </div>
                             <input type="checkbox" className="hidden" checked={formData.showOtherInput} onChange={handleOtherIngredientToggle} />
                             <span className="text-sm text-gray-300 font-bold">Inne składniki</span>
                        </label>
                        {formData.showOtherInput && (
                            <input name="otherIngredient" value={formData.otherIngredient} onChange={handleChange} type="text" placeholder="Wpisz składniki oddzielone przecinkiem" className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-green-500 focus:outline-none text-sm placeholder-gray-600 animate-in fade-in slide-in-from-top-2" />
                        )}
                    </div>
                </div>

            </div>

            {/* PRAWA KOLUMNA: PODGLĄD (STICKY) */}
            <div className="space-y-6 sticky top-28 h-fit">
                <div className="flex items-center gap-2 text-white font-bold mb-2">
                    <CheckCircle size={16} className="text-green-500" /> Podgląd na żywo
                </div>

                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#333] shadow-2xl">
                      <div className="h-40 w-full relative">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <span className="absolute top-3 right-3 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">★ NOWOŚĆ</span>
                      </div>
                      <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold text-white">{formData.name || "Nazwa Pizzy"}</h3>
                              <span className="text-red-500 font-bold text-lg">{formData.price || "0"} zł</span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 mb-3">
                                <span className="bg-[#252525] px-2 py-1 rounded border border-[#333]">{selectedRestaurant?.name || "Restauracja"}</span>
                                <span>•</span>
                                <span>{formData.shape === "Okrągła" ? `${formData.diameter} cm` : `${formData.width}x${formData.length} cm`}</span>
                                {formData.kcal && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1 text-orange-400"><Flame size={10} /> {formData.kcal} kcal</span>
                                    </>
                                )}
                          </div>
                          
                          <p className="text-gray-400 text-xs mb-3 min-h-[20px] line-clamp-2">
                              {formData.description || "Brak opisu"}
                          </p>

                          <div className="flex flex-wrap gap-1 mb-3">
                              {[formData.style, formData.dough, formData.crust, formData.sauce].map((spec, i) => (
                                  <span key={i} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px] px-1.5 py-0.5 rounded">
                                      {spec}
                                  </span>
                              ))}
                          </div>
                          
                          {previewIngredients.length > 0 ? (
                              <div className="flex gap-2 flex-wrap mb-2">
                                 {previewIngredients.map((ing, idx) => (
                                    <span key={idx} className="bg-[#252525] text-gray-400 text-[10px] px-2 py-1 rounded border border-[#333] whitespace-nowrap">
                                        {ing}
                                    </span>
                                 ))}
                              </div>
                          ) : (
                              <p className="text-[10px] text-gray-600 italic mb-2">Brak wybranych składników</p>
                          )}
                      </div>
                </div>

                <div className="bg-[#121212] p-5 rounded-xl border border-[#27272a]">
                      <div className="flex items-center gap-2 mb-4 text-gray-300 font-bold text-sm">
                         <BarChart3 size={16} className="text-red-500" /> Analiza Ceny
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                              <p className="text-[10px] text-gray-500 uppercase font-bold">Cena za cm²</p>
                              <p className="text-2xl font-bold text-white font-mono">{pricePerCm2 > 0 ? pricePerCm2.toFixed(2) : "0.00"} <span className="text-sm text-gray-600 font-sans">zł</span></p>
                          </div>
                          <div>
                              <p className="text-[10px] text-gray-500 uppercase font-bold">Cena za 100g</p>
                              <p className="text-2xl font-bold text-red-500 font-mono">{pricePer100g > 0 ? pricePer100g.toFixed(2) : "0.00"} <span className="text-sm text-red-900 font-sans">zł</span></p>
                          </div>
                      </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleSubmit}
                        className="w-full py-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/20 hover:to-red-500 transition text-lg"
                    >
                        Zapisz i Opublikuj
                    </button>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
};

export default AddPizzaView;