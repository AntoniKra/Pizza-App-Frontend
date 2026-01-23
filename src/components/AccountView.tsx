import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { PlusCircle, Settings, FileText, BarChart3 } from "lucide-react";

const AccountView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header onSearch={() => {}} />

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Manager Dashboard</h1>
          <p className="text-gray-400">Manage your restaurant menu, orders and settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KAFELEK: DODAJ PIZZĘ */}
          <div 
            onClick={() => navigate("/add-pizza")}
            className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] hover:border-red-500/50 hover:bg-[#202020] transition cursor-pointer group flex flex-col items-center justify-center h-48"
          >
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <PlusCircle size={32} className="text-red-500" />
            </div>
            <h3 className="font-bold text-lg">Add New Pizza</h3>
            <p className="text-xs text-gray-500 mt-2">Create a new listing</p>
          </div>

          {/* Placeholdery na inne opcje */}
          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] opacity-50 cursor-not-allowed flex flex-col items-center justify-center h-48">
            <BarChart3 size={32} className="text-gray-600 mb-4" />
            <h3 className="font-bold text-lg text-gray-400">Analytics</h3>
            <p className="text-xs text-gray-600 mt-2">Coming Soon</p>
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] opacity-50 cursor-not-allowed flex flex-col items-center justify-center h-48">
             <FileText size={32} className="text-gray-600 mb-4" />
             <h3 className="font-bold text-lg text-gray-400">Orders</h3>
             <p className="text-xs text-gray-600 mt-2">Coming Soon</p>
          </div>

          <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] opacity-50 cursor-not-allowed flex flex-col items-center justify-center h-48">
             <Settings size={32} className="text-gray-600 mb-4" />
             <h3 className="font-bold text-lg text-gray-400">Settings</h3>
             <p className="text-xs text-gray-600 mt-2">Coming Soon</p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AccountView;