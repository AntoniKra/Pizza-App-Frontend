import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, CheckCircle, ImagePlus, X } from "lucide-react";
// Importujemy instancję axios, bo musimy ręcznie zbudować zapytanie multipart
import { customInstance } from "../api/axiosConfig"; 

const AddBrandView = () => {
  const navigate = useNavigate();

  // Stan formularza
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Czyszczenie URL podglądu, aby uniknąć wycieków pamięci
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Nazwa marki jest wymagana!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Tworzymy obiekt FormData (wymagany dla plików)
      const formData = new FormData();
      formData.append("Name", name);
      
      if (selectedFile) {
        formData.append("LogoFile", selectedFile);
      }

      // 2. Wysyłamy ręcznie, bo wygenerowany kod Orval (postApiBrand) 
      // błędnie wymusza 'application/x-www-form-urlencoded'.
      await customInstance({
        url: "/api/Brand",
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });

      alert(`Marka "${name}" została pomyślnie utworzona!`);
      navigate("/account"); 
      
    } catch (error) {
      console.error("Błąd podczas tworzenia marki:", error);
      alert("Wystąpił błąd podczas wysyłania danych.");
    } finally {
      setIsSubmitting(false);
    }
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
          Marka to szyld Twojej sieci. Tutaj możesz wgrać jej logo.
        </p>

        <div className="bg-[#1A1A1A] p-8 rounded-2xl border border-[#333] shadow-xl">
          
          {/* Pole: Nazwa Marki */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-400 mb-2">
              Nazwa Marki <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Moja Pizzeria"
              className="w-full bg-[#252525] p-4 rounded-xl border border-[#444] text-white focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Pole: Upload Logo */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-400 mb-2">
              Logo (opcjonalnie)
            </label>
            
            <div className="border-2 border-dashed border-[#444] rounded-xl p-6 flex flex-col items-center justify-center bg-[#252525]/50 hover:bg-[#252525] transition relative">
              
              {previewUrl ? (
                // WIDOK PODGLĄDU
                <div className="relative w-full flex flex-col items-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden mb-4 border-4 border-blue-500/20">
                    <img
                      src={previewUrl}
                      alt="Podgląd"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="absolute top-0 right-0 p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
                  >
                    <X size={16} />
                  </button>
                  <span className="text-green-400 text-sm flex items-center gap-1">
                     <CheckCircle size={14} /> Wybrano plik
                  </span>
                </div>
              ) : (
                // WIDOK UPLOADU
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 bg-[#333] rounded-full flex items-center justify-center mb-3 text-gray-400">
                    <ImagePlus size={32} />
                  </div>
                  <p className="text-gray-300 font-medium">Kliknij, aby wgrać zdjęcie</p>
                  <p className="text-gray-500 text-sm mt-1">PNG, JPG (max 5MB)</p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg 
              ${isSubmitting 
                ? "bg-gray-600 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20"
              }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Wysyłanie...</span>
            ) : (
              <>
                <Upload size={20} /> Utwórz Markę
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBrandView;