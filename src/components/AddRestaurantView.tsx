import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Bike,
  ShoppingBasket,
  Clock,
  Store,
  CheckCircle,
} from "lucide-react";

const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

interface AddRestaurantViewProps {
  onAdd: (data: any) => void;
}

const AddRestaurantView = ({ onAdd }: AddRestaurantViewProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    deliveryPrice: "",
    minOrder: "",
    time: "",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",
    weekdayOpen: "11:00",
    weekdayClose: "22:00",
    weekendOpen: "12:00",
    weekendClose: "23:00",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Wysyłamy dane do App.tsx
    onAdd(formData);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Panel Partnera / Restauracje
            </p>
            <h1 className="text-3xl font-bold mt-1">Dodaj nowy lokal</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEWA KOLUMNA: FORMULARZ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ... (To samo co wcześniej) ... */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="flex items-center gap-2 mb-6 text-red-400 font-bold text-sm uppercase tracking-wider">
                <span className="w-1 h-4 bg-red-500 rounded-full"></span>{" "}
                Informacje o lokalu
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nazwa Pizzerii
                  </label>
                  <div className="relative">
                    <Store
                      className="absolute left-3 top-3 text-gray-500"
                      size={18}
                    />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text"
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg py-3 pl-10 pr-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Adres
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-3 text-gray-500"
                      size={18}
                    />
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      type="text"
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg py-3 pl-10 pr-4 text-white focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Opis lokalu
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    URL Zdjęcia (Tło)
                  </label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold text-sm uppercase tracking-wider">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>{" "}
                Logistyka i Czas
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Koszt dostawy
                  </label>
                  <div className="relative">
                    <input
                      name="deliveryPrice"
                      type="number"
                      value={formData.deliveryPrice}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">
                      PLN
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Min. Zamówienie
                  </label>
                  <div className="relative">
                    <input
                      name="minOrder"
                      type="number"
                      value={formData.minOrder}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-blue-500 focus:outline-none"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">
                      PLN
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Czas przygotowania (Szacowany)
                  </label>
                  <div className="relative">
                    <input
                      name="time"
                      type="text"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-blue-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">
                      min
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-[#333] pt-6">
                <label className="block text-sm font-bold text-gray-300 uppercase mb-4">
                  Godziny Otwarcia
                </label>
                <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
                  <span className="text-xs text-gray-500 font-bold uppercase w-20">
                    Pon - Pią
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      name="weekdayOpen"
                      value={formData.weekdayOpen}
                      onChange={handleChange}
                      className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-500">-</span>
                    <select
                      name="weekdayClose"
                      value={formData.weekdayClose}
                      onChange={handleChange}
                      className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <span className="text-xs text-gray-500 font-bold uppercase w-20">
                    Sob - Nie
                  </span>
                  <div className="flex items-center gap-2 flex-1">
                    <select
                      name="weekendOpen"
                      value={formData.weekendOpen}
                      onChange={handleChange}
                      className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-500">-</span>
                    <select
                      name="weekendClose"
                      value={formData.weekendClose}
                      onChange={handleChange}
                      className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white text-sm focus:border-blue-500 outline-none cursor-pointer"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRAWA KOLUMNA: PODGLĄD */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <CheckCircle size={16} className="text-green-500" /> Podgląd na
              żywo
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#2A2A2A] shadow-2xl relative overflow-hidden flex flex-col gap-4">
              <div className="w-full h-40 rounded-xl overflow-hidden relative border border-[#333]">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/30 backdrop-blur-sm">
                  ● Otwarte teraz
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
                  {formData.name || "Nazwa Pizzerii"}
                </h1>
                <p className="text-gray-400 flex items-center gap-1 text-xs mb-3">
                  <MapPin size={12} className="text-[#FF6B6B]" />
                  {formData.address || "Adres lokalu"}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                  {formData.description ||
                    "Tu pojawi się opis Twojej restauracji widoczny dla klientów."}
                </p>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <div className="bg-[#252525] px-3 py-2 rounded-lg flex items-center gap-2 border border-[#333] min-w-[100px]">
                    <Bike className="text-[#FF6B6B]" size={16} />
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">
                        Dostawa
                      </p>
                      <p className="text-white font-bold text-xs">
                        {formData.deliveryPrice || "0"} zł
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#252525] px-3 py-2 rounded-lg flex items-center gap-2 border border-[#333] min-w-[100px]">
                    <ShoppingBasket className="text-[#FF6B6B]" size={16} />
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">
                        Min.
                      </p>
                      <p className="text-white font-bold text-xs">
                        {formData.minOrder || "0"} zł
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#252525] px-3 py-2 rounded-lg flex items-center gap-2 border border-[#333] min-w-[100px]">
                    <Clock className="text-[#FF6B6B]" size={16} />
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">
                        Czas
                      </p>
                      <p className="text-white font-bold text-xs">
                        {formData.time ? `${formData.time} min` : "-- min"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#333] pt-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Clock size={10} /> Godziny otwarcia
                  </p>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Pon - Pią</span>{" "}
                      <span>
                        {formData.weekdayOpen} - {formData.weekdayClose}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sob - Nie</span>{" "}
                      <span>
                        {formData.weekendOpen} - {formData.weekendClose}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/20 hover:to-red-500 transition text-lg"
              >
                Opublikuj lokal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddRestaurantView;
