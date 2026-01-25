import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { PlusCircle, Store } from "lucide-react"; // Zmieniono importy ikon

const AccountView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header onSearch={() => {}} />

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel Partnera</h1>
          <p className="text-gray-400">Zarządzaj swoim menu, lokalami i ustawieniami.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KAFELEK 1: DODAJ PIZZĘ */}
          <div 
            onClick={() => navigate("/add-pizza")}
            className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] hover:border-red-500/50 hover:bg-[#202020] transition cursor-pointer group flex flex-col items-center justify-center h-48"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <PlusCircle size={32} className="text-red-500" />
            </div>
            <h3 className="font-bold text-lg">Dodaj nową pizzę</h3>
            <p className="text-xs text-gray-500 mt-2">Utwórz nową pozycję w menu</p>
          </div>

          {/* KAFELEK 2: RESTAURACJE (NOWY) */}
          <div 
            onClick={() => navigate("/manage-restaurants")}
            className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] hover:border-blue-500/50 hover:bg-[#202020] transition cursor-pointer group flex flex-col items-center justify-center h-48"
          >
             <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Store size={32} className="text-blue-500" />
             </div>
             <h3 className="font-bold text-lg">Restauracje</h3>
             <p className="text-xs text-gray-500 mt-2">Zarządzaj restauracjami</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AccountView;