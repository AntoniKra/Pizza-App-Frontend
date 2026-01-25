import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { ArrowLeft, UploadCloud, CheckCircle, BarChart3 } from "lucide-react";
import type { Pizza } from "../data/mockPizzas";

interface AddPizzaViewProps {
  onAdd: (pizza: Pizza) => void;
}

const AddPizzaView = ({ onAdd }: AddPizzaViewProps) => {
  const navigate = useNavigate();

  // Stan formularza
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    diameter: "32",
    weight: "450",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Walidacja
    if (!formData.name || !formData.price) return;

    const newPizza: Pizza = {
        id: Date.now(), // Generujemy unikalne ID
        name: formData.name,
        description: formData.description || "Brak opisu",
        price: parseFloat(formData.price),
        image: formData.image,
        diameter: parseInt(formData.diameter),
        weight: parseInt(formData.weight),
        kcal: 0, // Mock
        pizzeria: "Pizza Hut",
        city: "Warszawa",
        dough: "Classic",
        crust: "Classic",
        shape: "Okrągła",
        style: "Własna",
        sauce: "Pomidorowy"
    };

    onAdd(newPizza); // Dodaj do stanu w App.tsx
    navigate("/restaurant"); // Wróć do menu
  };

  // Obliczenia dla sekcji "Calculated Value"
  const priceVal = parseFloat(formData.price) || 0;
  const weightVal = parseFloat(formData.weight) || 1;
  const diameterVal = parseFloat(formData.diameter) || 1;
  const radius = diameterVal / 2;
  const area = Math.PI * (radius * radius); // Pole powierzchni w cm2
  
  const pricePer100g = (priceVal / weightVal) * 100;
  const pricePerCm2 = priceVal / area;

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <Header onSearch={() => {}} />

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        
        {/* Breadcrumb / Header */}
        <div className="flex items-center gap-4 mb-8">
             <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition">
                <ArrowLeft size={24} />
             </button>
             <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wide">Dashboard / Menu Management</p>
                 <h1 className="text-3xl font-bold mt-1">Add New Pizza</h1>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEWA KOLUMNA: FORMULARZ */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Basic Info Card */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                    <div className="flex items-center gap-2 mb-6 text-red-400 font-bold text-sm uppercase tracking-wider">
                         <span className="w-1 h-4 bg-red-500 rounded-full"></span> Basic Information
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Pizza Name</label>
                            <input 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text" 
                                placeholder="e.g. Margherita Speciale" 
                                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors placeholder-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea 
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the ingredients and flavor profile..." 
                                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors placeholder-gray-600 resize-none"
                            />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (Temporary)</label>
                            <input 
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 text-xs text-gray-400"
                            />
                        </div>

                        {/* Upload Placeholder */}
                        <div className="border-2 border-dashed border-[#333] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] transition-colors cursor-pointer group">
                             <div className="w-10 h-10 bg-[#252525] rounded-full flex items-center justify-center mb-3 group-hover:bg-red-500/10 transition-colors">
                                <UploadCloud size={20} className="text-gray-400 group-hover:text-red-500" />
                             </div>
                             <p className="text-sm text-gray-300"><span className="text-red-500 font-bold">Click to upload</span> or drag and drop</p>
                             <p className="text-xs text-gray-600 mt-1">SVG, PNG, JPG or GIF (max. 3MB)</p>
                        </div>
                    </div>
                </div>

                {/* Metrics Card */}
                <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
                    <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
                            <span className="w-1 h-4 bg-red-500 rounded-full"></span> Crucial Metrics
                        </div>
                        <div className="flex items-center gap-3">
                             <span className="text-xs text-gray-500 font-bold uppercase">Shape:</span>
                             <div className="w-10 h-5 bg-[#333] rounded-full relative cursor-pointer">
                                 <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full"></div>
                             </div>
                             <span className="text-xs text-gray-400">Round</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (PLN)</label>
                            <div className="relative">
                                <input 
                                    name="price"
                                    type="number" 
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-red-500 focus:outline-none"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">PLN</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Diameter</label>
                            <div className="relative">
                                <input 
                                    name="diameter"
                                    type="number"
                                    value={formData.diameter}
                                    onChange={handleChange}
                                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-red-500 focus:outline-none"
                                />
                                <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">cm</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-red-400 uppercase mb-1">Total Weight</label>
                            <div className="relative">
                                <input 
                                    name="weight"
                                    type="number"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full bg-[#1A1A1A] border border-red-500/30 rounded-lg p-3 text-white font-mono text-lg focus:border-red-500 focus:outline-none"
                                />
                                <span className="absolute right-3 top-4 text-xs text-red-500 font-bold">g</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


            {/* PRAWA KOLUMNA: PODGLĄD */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-white font-bold mb-2">
                    <CheckCircle size={16} className="text-green-500" /> Real-time Preview
                </div>

                {/* Preview Card */}
                <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#333] shadow-2xl">
                     <div className="h-40 w-full relative">
                         <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                         <span className="absolute top-3 right-3 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg">★ New</span>
                     </div>
                     <div className="p-5">
                         <div className="flex justify-between items-start mb-2">
                             <h3 className="text-xl font-bold text-white">{formData.name || "Pizza Name"}</h3>
                             <span className="text-red-500 font-bold text-lg">{formData.price || "0"} PLN</span>
                         </div>
                         <p className="text-gray-500 text-xs mb-4">Neapolitan • {formData.diameter}cm</p>
                         
                         <div className="flex gap-2 mb-4">
                             <span className="bg-[#252525] text-gray-400 text-[10px] px-2 py-1 rounded border border-[#333]">Mozzarella</span>
                             <span className="bg-[#252525] text-gray-400 text-[10px] px-2 py-1 rounded border border-[#333]">Tomato</span>
                             <span className="bg-[#252525] text-gray-500 text-[10px] px-2 py-1 rounded border border-[#333]">+1 more</span>
                         </div>

                         <button className="w-full bg-[#252525] text-gray-300 py-2 rounded-lg text-sm font-bold border border-[#333]">View Details</button>
                     </div>
                </div>

                {/* Calculated Value Box */}
                <div className="bg-[#121212] p-5 rounded-xl border border-[#27272a]">
                     <div className="flex items-center gap-2 mb-4 text-gray-300 font-bold text-sm">
                        <BarChart3 size={16} className="text-red-500" /> Calculated Value
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mb-4">
                         <div>
                             <p className="text-[10px] text-gray-500 uppercase font-bold">Price per cm²</p>
                             <p className="text-2xl font-bold text-white font-mono">
                                {pricePerCm2 > 0 ? pricePerCm2.toFixed(2) : "0.00"} <span className="text-sm text-gray-600 font-sans">PLN</span>
                             </p>
                         </div>
                         <div>
                             <p className="text-[10px] text-gray-500 uppercase font-bold">Price per 100g</p>
                             <p className="text-2xl font-bold text-red-500 font-mono">
                                {pricePer100g > 0 ? pricePer100g.toFixed(2) : "0.00"} <span className="text-sm text-red-900 font-sans">PLN</span>
                             </p>
                         </div>
                     </div>
                     
                     <div className="bg-green-500/10 border border-green-500/20 p-2 rounded flex items-center gap-2">
                         <span className="text-green-500 text-xs font-bold">↗ Good Value</span>
                         <span className="text-gray-500 text-[10px]">Top 15% in your area</span>
                     </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button className="py-3 rounded-lg bg-[#252525] text-white font-bold border border-[#333] hover:bg-[#333] transition">
                        Save Draft
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/20 hover:to-red-500 transition"
                    >
                        Save & Publish
                    </button>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
};

export default AddPizzaView;