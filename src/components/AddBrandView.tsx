import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";

// TWORZENIE MARKI
// To jest formularz "ojca". Wszystkie restauracje będą podpięte pod to, co tu stworzysz.

const AddBrandView = () => {
  const navigate = useNavigate();

  // Stan formularza - zgodny z CreateBrandDto
  const [formData, setFormData] = useState({
    name: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg", // Domyślne logo
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("Nazwa marki jest wymagana!");
      return;
    }

    // --- SYMULACJA WYSŁANIA DO BACKENDU ---
    // Tutaj normalnie byłoby: await getBrand().postApiBrand(formData);

    console.log("🚀 WYSYŁAM DO API (CreateBrandDto):", {
      name: formData.name,
      logo: formData.logo,
    });

    alert(`Marka "${formData.name}" została utworzona (symulacja)!`);
    navigate("/account"); // Wracamy do panelu partnera
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Przycisk powrotu */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition"
        >
          <ArrowLeft size={20} /> Anuluj
        </button>

        <h1 className="text-3xl font-bold mb-2">Dodaj Nową Markę</h1>
        <p className="text-gray-500 mb-8">
          Marka to szyld Twojej sieci (np. "Da Grasso"). Pod nią będziesz
          dodawać lokale.
        </p>

        <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-[#333] shadow-xl">
          {/* Pole: Nazwa Marki */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-400 mb-2">
              Nazwa Marki
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="np. Moja Pizzeria"
              className="w-full bg-[#252525] p-4 rounded-xl border border-[#444] text-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Pole: Logo URL */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-400 mb-2">
              Logo URL (opcjonalnie)
            </label>
            <div className="flex gap-4 items-center">
              <input
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://..."
                className="flex-1 bg-[#252525] p-4 rounded-xl border border-[#444] text-white focus:border-blue-500 focus:outline-none transition text-sm"
              />
              {/* Podgląd logo */}
              <div className="w-14 h-14 bg-white rounded-full overflow-hidden flex items-center justify-center border-2 border-blue-500/30">
                <img
                  src={formData.logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
          >
            <CheckCircle size={20} />
            Utwórz Markę
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBrandView;
