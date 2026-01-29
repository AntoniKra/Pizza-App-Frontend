import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Flame, Plus, DollarSign, ImagePlus, X, Loader2 } from "lucide-react";

// API
import { customInstance } from "../api/axiosConfig";
import { getIngredient } from "../api/endpoints/ingredient/ingredient";
import { getLookUp } from "../api/endpoints/look-up/look-up"; 
import type { IngredientDto, LookUpItemDto } from "../api/model";

// Jeśli nie masz pliku OptionTile, dodaję prostą definicję poniżej (możesz to przenieść do osobnego pliku)
const OptionTile = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-bold border transition-all text-center flex items-center justify-center select-none h-full
      ${selected 
          ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
          : "bg-[#1A1A1A] border-[#333] text-gray-400 hover:border-gray-500 hover:text-gray-300"}`}
  >
    {label}
  </div>
);

const AddPizzaView = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { menuId, pizzeriaName } = location.state || {};

  // --- STAN OPCJI (Lookups) ---
  const [options, setOptions] = useState({
    styles: [] as LookUpItemDto[],
    doughs: [] as LookUpItemDto[],
    crusts: [] as LookUpItemDto[], 
    sauces: [] as LookUpItemDto[], 
    shapes: [] as LookUpItemDto[],
  });

  // --- STAN FORMULARZA ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "450",
    kcal: "",
    ingredients: [] as string[],

    // Wybrane ID opcji
    styleId: "",
    doughId: "",
    crustId: "", 
    sauceId: "", 
    shapeId: "",

    // Wymiary
    diameter: "32",
    width: "30",
    length: "40",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [availableIngredients, setAvailableIngredients] = useState<IngredientDto[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. POBIERANIE DANYCH
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoadingData(true);
      try {
        const [
            ingRes, 
            styleRes, 
            doughRes, 
            crustRes, 
            sauceRes, 
            shapeRes
        ] = await Promise.all([
            getIngredient().getApiIngredientGetAll(),
            getLookUp().getApiLookUpEnumAll({ type: "PizzaStyleEnum" }), // Poprawione enumName zgodnie z API Orval
            getLookUp().getApiLookUpEnumAll({ type: "DoughTypeEnum" }),
            getLookUp().getApiLookUpEnumAll({ type: "CrustThicknessEnum" }),
            getLookUp().getApiLookUpEnumAll({ type: "SauceTypeEnum" }),
            getLookUp().getApiLookUpEnumAll({ type: "PizzaShapeEnum" }),
        ]);

        // Obsługa danych z axios (jeśli zwraca .data lub bezpośrednio tablicę)

        setAvailableIngredients(ingRes);
        
        const styles = styleRes;
        const doughs = doughRes;
        const crusts = crustRes;
        const sauces = sauceRes;
        const shapes = shapeRes;

        setOptions({ styles, doughs, crusts, sauces, shapes });

        // Ustaw domyślne wartości
        setFormData(prev => ({
            ...prev,
            styleId: styles[0]?.id || "",
            doughId: doughs[0]?.id || "",
            crustId: crusts[0]?.id || "",
            sauceId: sauces[0]?.id || "",
            shapeId: shapes.find((s: LookUpItemDto) => s.name === "Okrągła")?.id || shapes[0]?.id || ""
        }));

      } catch (error) {
        console.error("Błąd pobierania danych słownikowych:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchAllData();
  }, []);

  // --- HANDLERY ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field: string, id: string) => {
    setFormData((prev) => ({ ...prev, [field]: id }));
  };

  // ✅ Ta funkcja jest teraz podpięta w JSX
  const handleIngredientChange = (ingredientId: string) => {
    setFormData((prev) => {
      const exists = prev.ingredients.includes(ingredientId);
      const newIngredients = exists
        ? prev.ingredients.filter((i) => i !== ingredientId)
        : [...prev.ingredients, ingredientId];
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleSubmit = async () => {
    if (!menuId) {
        alert("Błąd kontekstu: Brak Menu ID.");
        return;
    }
    if (!formData.name || !formData.price) {
      alert("Nazwa i cena są wymagane!");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      data.append("MenuId", menuId);
      data.append("Name", formData.name);
      data.append("Description", formData.description);
      data.append("Price", formData.price);
      data.append("WeightGrams", formData.weight);
      if(formData.kcal) data.append("Kcal", formData.kcal);

      if (selectedFile) data.append("ImageFile", selectedFile);

      formData.ingredients.forEach(id => data.append("IngredientIds", id));

      const findName = (list: LookUpItemDto[], id: string) => list.find(x => x.id === id)?.name || "";

      data.append("Style.Id", formData.styleId);
      data.append("Style.Name", findName(options.styles, formData.styleId));

      data.append("Dough.Id", formData.doughId);
      data.append("Dough.Name", findName(options.doughs, formData.doughId));

      data.append("Thickness.Id", formData.crustId);
      data.append("Thickness.Name", findName(options.crusts, formData.crustId));

      data.append("BaseSauce.Id", formData.sauceId);
      data.append("BaseSauce.Name", findName(options.sauces, formData.sauceId));

      const selectedShapeName = findName(options.shapes, formData.shapeId);
      data.append("Shape.Id", formData.shapeId);
      data.append("Shape.Name", selectedShapeName);

      if (selectedShapeName === "Okrągła") {
        data.append("DiameterCm", formData.diameter);
      } else {
        data.append("WidthCm", formData.width);
        data.append("LengthCm", formData.length);
      }

      await customInstance({
          url: "/api/Pizza",
          method: "POST",
          headers: { "Content-Type": "multipart/form-data" },
          data: data
      });

      alert(`Pizza "${formData.name}" została dodana!`);
      navigate(-1);

    } catch (error) {
      console.error("Błąd zapisu pizzy:", error);
      alert("Wystąpił błąd podczas zapisywania.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentShapeName = () => options.shapes.find(s => s.id === formData.shapeId)?.name || "";

  if (!menuId) return <div className="p-10 text-white text-center">Błąd: Brak kontekstu Menu.</div>;

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* NAGŁÓWEK */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div>
            <p className="text-xs text-red-500 uppercase tracking-wide font-bold mb-1">
              Dodawanie do: {pizzeriaName}
            </p>
            <h1 className="text-3xl font-bold">Nowa Pizza</h1>
          </div>
        </div>

        {isLoadingData ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p>Ładowanie konfiguratora...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEWA STRONA: FORMULARZ */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Podstawowe Dane */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                <div className="flex items-center gap-2 mb-6 text-gray-300 font-bold text-sm uppercase tracking-wider">
                    <span className="w-1 h-4 bg-gray-500 rounded-full"></span> Podstawowe
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nazwa</label>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="np. Capricciosa" className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cena (PLN)</label>
                        <div className="relative">
                        <DollarSign size={14} className="absolute left-3 top-3.5 text-gray-500" />
                        <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 pl-8 text-white focus:border-red-500 focus:outline-none" placeholder="0.00" />
                        </div>
                    </div>
                    </div>
                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Opis</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none resize-none" placeholder="Składniki, smak..." />
                    </div>
                    
                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Zdjęcie</label>
                    <div className="border-2 border-dashed border-[#333] rounded-xl p-4 flex flex-col items-center justify-center bg-[#1A1A1A] hover:bg-[#202020] transition relative h-32">
                        {previewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img src={previewUrl} alt="Preview" className="h-full object-contain rounded-lg" />
                                <button onClick={handleRemoveFile} className="absolute top-0 right-0 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition">
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <ImagePlus size={24} className="text-gray-500 mb-2" />
                                <p className="text-gray-400 text-xs font-medium">Kliknij lub upuść zdjęcie</p>
                            </>
                        )}
                    </div>
                    </div>
                </div>
                </div>

                {/* 2. Specyfikacja */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                <div className="flex items-center gap-2 mb-6 text-orange-400 font-bold text-sm uppercase tracking-wider">
                    <span className="w-1 h-4 bg-orange-500 rounded-full"></span> Ciasto i Baza
                </div>
                <div className="space-y-6">
                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Styl</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {options.styles.map((opt) => (
                        <OptionTile key={opt.id} label={opt.name} selected={formData.styleId === opt.id} onClick={() => handleOptionSelect("styleId", opt.id!)} />
                        ))}
                    </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rodzaj Ciasta</label>
                        <div className="flex flex-wrap gap-2">
                        {options.doughs.map((opt) => (
                            <OptionTile key={opt.id} label={opt.name} selected={formData.doughId === opt.id} onClick={() => handleOptionSelect("doughId", opt.id!)} />
                        ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Grubość / Brzeg</label>
                        <div className="flex flex-wrap gap-2">
                        {options.crusts.map((opt) => (
                            <OptionTile key={opt.id} label={opt.name} selected={formData.crustId === opt.id} onClick={() => handleOptionSelect("crustId", opt.id!)} />
                        ))}
                        </div>
                    </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sos Bazowy</label>
                        <div className="flex flex-wrap gap-2">
                        {options.sauces.map((opt) => (
                            <OptionTile key={opt.id} label={opt.name} selected={formData.sauceId === opt.id} onClick={() => handleOptionSelect("sauceId", opt.id!)} />
                        ))}
                        </div>
                    </div>
                </div>
                </div>

                {/* 3. Parametry */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold text-sm uppercase tracking-wider">
                    <span className="w-1 h-4 bg-blue-500 rounded-full"></span> Parametry
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kształt</label>
                    <select name="shapeId" value={formData.shapeId} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white text-sm focus:border-blue-500 outline-none cursor-pointer">
                        {options.shapes.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                    </div>
                    
                    {getCurrentShapeName() === "Okrągła" ? (
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Średnica (cm)</label>
                        <input name="diameter" type="number" value={formData.diameter} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
                    </div>
                    ) : (
                    <>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Szer. (cm)</label><input name="width" type="number" value={formData.width} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none" /></div>
                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dł. (cm)</label><input name="length" type="number" value={formData.length} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none" /></div>
                    </>
                    )}
                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Waga (g)</label>
                    <input name="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kcal</label>
                    <input name="kcal" type="number" value={formData.kcal} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-blue-500 outline-none" />
                    </div>
                </div>
                </div>

                {/* 4. Składniki (Z API) - POPRAWIONE */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                <div className="flex items-center gap-2 mb-6 text-green-400 font-bold text-sm uppercase tracking-wider">
                    <span className="w-1 h-4 bg-green-500 rounded-full"></span> Składniki
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {availableIngredients.length > 0 ? availableIngredients.map((ing) => (
                        <div 
                            key={ing.id} 
                            onClick={() => ing.id && handleIngredientChange(ing.id)} // 👈 DODANO onClick
                            className="flex items-center gap-2 cursor-pointer group hover:bg-[#1f1f1f] p-1 rounded transition select-none"
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.ingredients.includes(ing.id!) ? "bg-green-500 border-green-500" : "border-gray-600 group-hover:border-gray-400"}`}>
                            {formData.ingredients.includes(ing.id!) && <CheckCircle size={12} className="text-black" />}
                            </div>
                            <span className={`text-sm ${formData.ingredients.includes(ing.id!) ? "text-white" : "text-gray-400 group-hover:text-gray-300"}`}>
                                {ing.name}
                            </span>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm col-span-full">Brak składników w bazie.</p>
                    )}
                </div>
                </div>

                <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition text-lg
                    ${isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-red-900/20 hover:to-red-600 hover:scale-[1.02]"}`}
                >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Dodaj do Menu</>}
                </button>
            </div>

            {/* PRAWA STRONA: PODGLĄD */}
            <div className="space-y-6 sticky top-6">
                <div className="flex items-center gap-2 text-white font-bold mb-2">
                <CheckCircle size={16} className="text-green-500" /> Podgląd Karty
                </div>

                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#2A2A2A] shadow-2xl relative group">
                <div className="h-48 relative overflow-hidden bg-[#111]">
                    <img
                    src={previewUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000"}
                    alt="Preview"
                    className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{formData.name || "Nazwa Pizzy"}</h3>
                    <span className="text-yellow-400 font-mono font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-sm">{formData.price || "0"} zł</span>
                    </div>
                </div>

                <div className="p-5">
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{formData.description || "Opis..."}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1 bg-[#252525] px-2 py-1 rounded border border-[#333]">
                        <Flame size={12} className="text-orange-500" /> {formData.kcal || "0"} kcal
                    </span>
                    <span className="bg-[#252525] px-2 py-1 rounded border border-[#333]">{formData.weight}g</span>
                    </div>
                    
                    {/* Wybrane składniki w podglądzie */}
                    <div className="flex flex-wrap gap-1 mt-3">
                        {formData.ingredients.slice(0, 4).map(id => {
                            const ing = availableIngredients.find(i => i.id === id);
                            return ing ? (
                                <span key={id} className="text-[10px] text-green-400 bg-green-900/10 px-1.5 py-0.5 rounded border border-green-900/20">{ing.name}</span>
                            ) : null;
                        })}
                        {formData.ingredients.length > 4 && <span className="text-[10px] text-gray-500">+{formData.ingredients.length - 4}</span>}
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default AddPizzaView;