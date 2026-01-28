import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Store,
  Edit2,
  Trash2,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";

interface ManageRestaurantsViewProps {
  restaurants: any[];
  onDelete: (id: number) => void;
}

const ManageRestaurantsView = ({
  restaurants,
  onDelete,
}: ManageRestaurantsViewProps) => {
  const navigate = useNavigate();

  // Stan modala usuwania
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans relative">
      {/* --- MODAL POTWIERDZENIA --- */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1E1E1E] border border-red-500/30 p-6 rounded-2xl max-w-sm w-full shadow-2xl transform scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Usunąć lokal?
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Czy na pewno chcesz usunąć tę restaurację? Tej operacji nie
                można cofnąć.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 rounded-lg bg-[#252525] hover:bg-[#333] text-white font-bold transition"
                >
                  Anuluj
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition shadow-lg shadow-red-900/20"
                >
                  Usuń
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/account")}
              className="text-gray-400 hover:text-white transition"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Panel Partnera
              </p>
              <h1 className="text-3xl font-bold mt-1">Twoje Restauracje</h1>
            </div>
          </div>

          <button
            onClick={() => navigate("/add-restaurant")}
            className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-red-900/20"
          >
            <Plus size={18} /> Dodaj lokal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden hover:border-gray-600 transition group relative"
            >
              {/* BADGE NOWY */}
              {rest.isNew && (
                <div className="absolute top-4 left-4 z-10 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse">
                  NOWY
                </div>
              )}

              <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900 relative flex items-center justify-center overflow-hidden">
                {/* Jeśli jest zdjęcie, pokaż je, w przeciwnym razie ikonka */}
                {rest.image ? (
                  <img
                    src={rest.image}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500"
                    alt={rest.name}
                  />
                ) : (
                  <Store
                    size={48}
                    className="text-gray-700 group-hover:text-gray-600 transition"
                  />
                )}

                <div
                  className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold uppercase border backdrop-blur-md ${
                    rest.status === "Otwarte"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-red-500/20 text-red-400 border-red-500/30"
                  }`}
                >
                  {rest.status}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-1">
                  {rest.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <MapPin size={14} />
                  {rest.address}
                </div>

                <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-4 mt-2">
                  <span className="text-sm font-bold text-yellow-500 flex items-center gap-1">
                    ★ {rest.rating || "New"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-restaurant/${rest.id}`)}
                      className="p-2 hover:bg-[#252525] rounded-lg text-gray-400 hover:text-white transition"
                      title="Edytuj"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteId(rest.id)}
                      className="p-2 hover:bg-[#252525] rounded-lg text-gray-400 hover:text-red-500 transition"
                      title="Usuń"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Karta: Dodaj kolejny */}
          <div
            onClick={() => navigate("/add-restaurant")}
            className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A] hover:border-red-500/50 hover:bg-[#202020] transition cursor-pointer group flex flex-col items-center justify-center min-h-[280px]"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <PlusCircle size={32} className="text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-white">
              Dodaj kolejny lokal
            </h3>
            <p className="text-xs text-gray-500 mt-2">Rozszerz swoją sieć</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageRestaurantsView;
