import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Save,
  Trash2,
  DollarSign,
  ImagePlus,
  X,
  Loader2
} from "lucide-react";

// API
import { customInstance } from "../api/axiosConfig";
import { getPizza } from "../api/endpoints/pizza/pizza";
import { getIngredient } from "../api/endpoints/ingredient/ingredient";
import { getLookUp } from "../api/endpoints/look-up/look-up";
import type { IngredientDto, LookUpItemDto, PizzaDetailsDto } from "../api/model";

// Helper UI Component
const OptionTile = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-bold border transition-all text-center flex items-center justify-center select-none h-full
      ${selected 
          ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]" 
          : "bg-[#1A1A1A] border-[#333] text-gray-400 hover:border-gray-500 hover:text-gray-300"}`}
  >
    {label}
  </div>
);

const EditPizzaView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Opcjonalnie: dane przekazane z listy (dla szybszego renderowania, zanim API odpowie)
  const initialData = location.state?.pizzaData as PizzaDetailsDto | undefined;

  // --- STAN OPCJI (Słowniki) ---
  const [options, setOptions] = useState({
    styles: [] as LookUpItemDto[],
    doughs: [] as LookUpItemDto[],
    crusts: [] as LookUpItemDto[],
    sauces: [] as LookUpItemDto[],
    shapes: [] as LookUpItemDto[],
  });

  const [availableIngredients, setAvailableIngredients] = useState<IngredientDto[]>([]);

  // --- STAN FORMULARZA ---
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    weight: "450",
    kcal: "",
    ingredients: [] as string[], // Tablica ID wybranych składników

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // URL lokalny (blob) lub z API
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. POBIERANIE DANYCH (Słowniki + Pizza + Składniki)
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        // 1a. Pobieramy opcje i składniki
        const [
            ingRes, 
            styleRes, 
            doughRes, 
            crustRes, 
            sauceRes, 
            shapeRes
        ] = await Promise.all([
            getIngredient().getApiIngredientGetAll(),
            getLookUp().getApiLookUpEnumAll({ type: "PizzaStyleEnum" }),
            getLookUp().getApiLookUpEnumAll({ type: "DoughTypeEnum" }),
            getLookUp().getApiLookUpEnumAll({ type: "CrustThicknessEnum" }),
            getLookUp().getApiLookUpEnumAll({ type: "SauceTypeEnum" }),
            getLookUp().getApiLookUpEnumAll({ type: "PizzaShapeEnum" }),
        ]);

        // Helper do wyciągania danych (jeśli axios zwraca response lub data bezpośrednio)

        setAvailableIngredients(ingRes);
        setOptions({
            styles: styleRes,
            doughs: doughRes,
            crusts: crustRes,
            sauces: sauceRes,
            shapes: shapeRes,
        });

        // 1b. Pobieranie danych pizzy (jeśli nie ma w initialData, lub by odświeżyć)
        let pizzaData = initialData;
        
        // Zawsze pobieramy świeże dane z API, żeby mieć pewność co do ID
        if (id) {
            const pizzaRes = await getPizza().getApiPizzaId(id);
            pizzaData = pizzaRes;
        }

        if (pizzaData) {
            // Mapowanie DTO na Formularz
            setFormData({
                name: pizzaData.name,
                description: pizzaData.description || "",
                price: pizzaData.price?.toString() || "",
                weight: pizzaData.weightGrams?.toString() || "0",
                kcal: pizzaData.kcal?.toString() || "",
                // Mapujemy obiekty składników na tablicę ich ID
                ingredients: pizzaData.ingredients?.map(i => i.id!).filter(Boolean) || [],
                
                // Mapowanie zagnieżdżonych obiektów DTO na ID
                styleId: pizzaData.style?.id || "",
                doughId: pizzaData.dough?.id || "",
                crustId: pizzaData.thickness?.id || "", // thickness w DTO -> crustId w formularzu
                sauceId: pizzaData.baseSauce?.id || "",
                shapeId: pizzaData.shape?.id || "",

                diameter: pizzaData.diameterCm?.toString() || "32",
                width: pizzaData.widthCm?.toString() || "30",
                length: pizzaData.lengthCm?.toString() || "40",
            });

            // Ustawienie zdjęcia (jeśli istnieje w bazie)
            if (pizzaData.imageUrl) {
                setPreviewUrl(pizzaData.imageUrl);
            }
        }

      } catch (error) {
        console.error("Błąd inicjalizacji widoku edycji:", error);
        alert("Nie udało się pobrać danych pizzy.");
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, [id, initialData]);

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

  const handleIngredientChange = (ingredientId: string) => {
    setFormData((prev) => {
      const exists = prev.ingredients.includes(ingredientId);
      const newIngredients = exists
        ? prev.ingredients.filter((i) => i !== ingredientId)
        : [...prev.ingredients, ingredientId];
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleDelete = async () => {
      if(!id) return;
      if(confirm("Czy na pewno chcesz usunąć tę pizzę? Operacja jest nieodwracalna.")) {
          try {
              await getPizza().deleteApiPizzaId(id);
              alert("Pizza usunięta.");
              navigate(-1);
          } catch (error) {
              console.error("Błąd usuwania:", error);
              alert("Nie udało się usunąć pizzy.");
          }
      }
  }

  const handleSave = async () => {
    if (!id) return;
    if (!formData.name || !formData.price) {
      alert("Nazwa i cena są wymagane!");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      
      // Id jest w URL, ale DTO UPDATE też go wymaga
      data.append("Id", id); 
      data.append("Name", formData.name);
      data.append("Description", formData.description);
      data.append("Price", formData.price);
      data.append("WeightGrams", formData.weight);
      if(formData.kcal) data.append("Kcal", formData.kcal);

      // Jeśli wybrano nowy plik, wysyłamy go.
      // Jeśli nie, backend powinien zachować stare zdjęcie.
      if (selectedFile) data.append("ImageFile", selectedFile);

      // Składniki
      formData.ingredients.forEach(iid => data.append("IngredientIds", iid));

      // Helper do znajdowania nazw na podstawie ID
      const findName = (list: LookUpItemDto[], itemId: string) => list.find(x => x.id === itemId)?.name || "";

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

      console.log("🚀 Wysyłam PUT /api/Pizza (FormData):", Object.fromEntries(data));

      await customInstance({
          url: `/api/Pizza/${id}`,
          method: "PUT",
          headers: { "Content-Type": "multipart/form-data" },
          data: data
      });

      alert(`Pizza "${formData.name}" została zaktualizowana!`);
      navigate(-1);

    } catch (error) {
      console.error("Błąd aktualizacji pizzy:", error);
      alert("Wystąpił błąd podczas zapisywania zmian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentShapeName = () => options.shapes.find(s => s.id === formData.shapeId)?.name || "";

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
          <button 
            onClick={handleDelete}
            className="text-red-500 flex items-center gap-2 text-sm font-bold border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10 transition"
          >
            <Trash2 size={16} /> Usuń
          </button>
        </div>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p>Pobieranie danych...</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEWA KOLUMNA */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Podstawowe */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Nazwa</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-yellow-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Cena (zł)</label>
                            <div className="relative">
                                <DollarSign size={14} className="absolute left-3 top-3.5 text-gray-500" />
                                <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 pl-8 text-white focus:border-yellow-500 outline-none" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Opis</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-yellow-500 outline-none resize-none" />
                    </div>
                    
                    {/* ZDJĘCIE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Zdjęcie</label>
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
                                    <p className="text-gray-400 text-xs font-medium">Zmień zdjęcie</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                </div>

                {/* 2. Parametry (Enumy) */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Parametry</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Styl</label>
                        <div className="grid grid-cols-2 gap-2">
                            {options.styles.slice(0, 4).map((opt) => (
                                <OptionTile key={opt.id} label={opt.name} selected={formData.styleId === opt.id} onClick={() => handleOptionSelect("styleId", opt.id!)} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Ciasto</label>
                        <div className="grid grid-cols-2 gap-2">
                            {options.doughs.slice(0, 4).map((opt) => (
                                <OptionTile key={opt.id} label={opt.name} selected={formData.doughId === opt.id} onClick={() => handleOptionSelect("doughId", opt.id!)} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Grubość</label>
                        <div className="grid grid-cols-2 gap-2">
                            {options.crusts.slice(0, 4).map((opt) => (
                                <OptionTile key={opt.id} label={opt.name} selected={formData.crustId === opt.id} onClick={() => handleOptionSelect("crustId", opt.id!)} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Sos</label>
                        <div className="grid grid-cols-2 gap-2">
                            {options.sauces.slice(0, 4).map((opt) => (
                                <OptionTile key={opt.id} label={opt.name} selected={formData.sauceId === opt.id} onClick={() => handleOptionSelect("sauceId", opt.id!)} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Wymiary i Kcal */}
                <div className="grid grid-cols-3 gap-4">
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">Kształt</label>
                        <select name="shapeId" value={formData.shapeId} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2 text-white text-xs focus:border-yellow-500 outline-none">
                            {options.shapes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                     </div>
                     {getCurrentShapeName() === "Okrągła" && (
                         <div>
                            <label className="text-xs text-gray-500 block mb-1">Średnica</label>
                            <input name="diameter" type="number" value={formData.diameter} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2 text-white text-xs focus:border-yellow-500 outline-none" />
                         </div>
                     )}
                     <div>
                        <label className="text-xs text-gray-500 block mb-1">Waga (g)</label>
                        <input name="weight" type="number" value={formData.weight} onChange={handleChange} className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2 text-white text-xs focus:border-yellow-500 outline-none" />
                     </div>
                </div>
                
                {/* Składniki */}
                <div className="mt-6 pt-4 border-t border-[#333]">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-3">Składniki</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto custom-scrollbar">
                        {availableIngredients.map((ing) => (
                            <div 
                                key={ing.id} 
                                onClick={() => ing.id && handleIngredientChange(ing.id)} 
                                className="flex items-center gap-2 cursor-pointer group select-none"
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.ingredients.includes(ing.id!) ? "bg-yellow-500 border-yellow-500" : "border-gray-600 group-hover:border-gray-400"}`}>
                                    {formData.ingredients.includes(ing.id!) && <CheckCircle size={12} className="text-black" />}
                                </div>
                                <span className={`text-sm ${formData.ingredients.includes(ing.id!) ? "text-white" : "text-gray-400"}`}>
                                    {ing.name}
                                </span>
                            </div>
                        ))}
                    </div>
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
                    src={previewUrl || "https://via.placeholder.com/400x200?text=Brak+zdjęcia"}
                    className="w-full h-full object-cover"
                    alt="Preview"
                    />
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{formData.name}</h3>
                    <span className="text-yellow-500 font-bold text-lg">{formData.price} zł</span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{formData.description}</p>
                    <div className="flex flex-wrap gap-1">
                        {formData.ingredients.map(id => {
                            const ing = availableIngredients.find(i => i.id === id);
                            return ing ? (
                                <span key={id} className="bg-[#252525] text-gray-400 text-[10px] px-2 py-1 rounded border border-[#333]">{ing.name}</span>
                            ) : null;
                        })}
                    </div>
                </div>
                </div>

                <button
                onClick={handleSave}
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition text-lg
                    ${isSubmitting ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/20 hover:to-yellow-500"}`}
                >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Zapisz Zmiany</>}
                </button>
            </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default EditPizzaView;