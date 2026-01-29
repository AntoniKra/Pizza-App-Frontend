import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Store,
  Clock,
  CheckCircle,
  Bike,
  ShoppingBasket,
  AlertCircle,
} from "lucide-react";

// TWORZENIE LOKALU (PIZZERII)
// Wersja z DESIGNEM zgodnym z resztą aplikacji + Logika DTO

const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2)
    .toString()
    .padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

const AddRestaurantView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 1. Odbieramy markę przekazaną z AccountView
  const preSelectedBrand = location.state?.brand;

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    deliveryCost: "",
    minOrderAmount: "",
    averagePreparationTimeMinutes: "30",
    maxDeliveryRange: "10",
    description: "", // Dodane pole opisu dla UI
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",

    // Adres
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
    zipCode: "",
    cityName: "",

    // Godziny
    weekdayOpen: "11:00",
    weekdayClose: "22:00",
    weekendOpen: "12:00",
    weekendClose: "23:00",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!preSelectedBrand) {
      alert("Błąd: Nie wybrano marki!");
      navigate("/account");
      return;
    }

    try {
      console.log("🚀 ROZPOCZYNAM PROCES TWORZENIA LOKALU...");

      // KROK 1: DTO Pizzerii
      const createPizzeriaDto = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        deliveryCost: Number(formData.deliveryCost),
        minOrderAmount: Number(formData.minOrderAmount),
        averagePreparationTimeMinutes: Number(
          formData.averagePreparationTimeMinutes,
        ),
        maxDeliveryRange: Number(formData.maxDeliveryRange),
        serviceFee: 0,
        brand: {
          id: preSelectedBrand.id,
          name: preSelectedBrand.name,
        },
        address: {
          street: formData.street,
          buildingNumber: formData.buildingNumber,
          apartmentNumber: formData.apartmentNumber || null,
          zipCode: formData.zipCode,
          cityName: formData.cityName,
          region: "Mazowieckie",
        },
      };

      console.log(
        "📨 1. Wysyłam POST /api/Pizzeria:",
        JSON.stringify(createPizzeriaDto, null, 2),
      );
      const newPizzeriaId = "nowe-id-123"; // Mock ID

      // KROK 2: Harmonogram
      console.log("📨 2. Wysyłam harmonogramy POST /api/WorkSchedule...");
      const days = [0, 1, 2, 3, 4, 5, 6];
      const schedules = days.map((day) => {
        const isWeekend = day === 0 || day === 6;
        return {
          dayOfWeek: day,
          openTime:
            (isWeekend ? formData.weekendOpen : formData.weekdayOpen) + ":00",
          closeTime:
            (isWeekend ? formData.weekendClose : formData.weekdayClose) + ":00",
          pizzeriaId: newPizzeriaId,
        };
      });

      schedules.forEach((s) =>
        console.log(
          `   - Dzień ${s.dayOfWeek}: ${s.openTime} - ${s.closeTime}`,
        ),
      );

      alert("Lokal został pomyślnie dodany (Symulacja)!");
      navigate("/account");
    } catch (error) {
      console.error("Błąd:", error);
      alert("Wystąpił błąd. Zobacz konsolę.");
    }
  };

  // Zabezpieczenie przed wejściem bez marki
  if (!preSelectedBrand) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center flex-col gap-4">
        <AlertCircle size={48} className="text-red-500 mb-2" />
        <h2 className="text-2xl font-bold">Błąd nawigacji</h2>
        <p className="text-gray-400">
          Musisz wybrać markę z panelu partnera, aby dodać lokal.
        </p>
        <button
          onClick={() => navigate("/account")}
          className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition"
        >
          Wróć do Panelu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* NAGŁÓWEK */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wide font-bold mb-1">
              Panel Partnera / {preSelectedBrand.name}
            </p>
            <h1 className="text-3xl font-bold">Dodaj nowy lokal</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEWA KOLUMNA: FORMULARZ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. INFORMACJE PODSTAWOWE */}
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
                      placeholder="np. Centrum"
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg py-3 pl-10 pr-4 text-white focus:border-red-500 focus:outline-none transition-colors placeholder-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Telefon
                    </label>
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      type="text"
                      placeholder="np. 123 456 789"
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors placeholder-gray-600"
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
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 text-xs focus:outline-none placeholder-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Opis (Dla klienta)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Krótki opis lokalu..."
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-red-500 focus:outline-none transition-colors resize-none placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. ADRES */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="flex items-center gap-2 mb-6 text-purple-400 font-bold text-sm uppercase tracking-wider">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>{" "}
                Adres Lokalu
              </div>
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Ulica
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-3 text-gray-500"
                      size={18}
                    />
                    <input
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg py-3 pl-10 pr-4 text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Nr Bud.
                  </label>
                  <input
                    name="buildingNumber"
                    value={formData.buildingNumber}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Nr Lok.
                  </label>
                  <input
                    name="apartmentNumber"
                    value={formData.apartmentNumber}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Kod
                  </label>
                  <input
                    name="zipCode"
                    placeholder="00-000"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Miasto
                  </label>
                  <input
                    name="cityName"
                    value={formData.cityName}
                    onChange={handleChange}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. LOGISTYKA I CZAS */}
            <div className="bg-[#121212] p-6 rounded-xl border border-[#27272a]">
              <div className="flex items-center gap-2 mb-6 text-blue-400 font-bold text-sm uppercase tracking-wider">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>{" "}
                Logistyka i Czas
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Koszt dostawy
                  </label>
                  <div className="relative">
                    <input
                      name="deliveryCost"
                      type="number"
                      value={formData.deliveryCost}
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
                      name="minOrderAmount"
                      type="number"
                      value={formData.minOrderAmount}
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
                    Czas (Szacowany)
                  </label>
                  <div className="relative">
                    <input
                      name="averagePreparationTimeMinutes"
                      type="number"
                      value={formData.averagePreparationTimeMinutes}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-blue-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">
                      min
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Zasięg
                  </label>
                  <div className="relative">
                    <input
                      name="maxDeliveryRange"
                      type="number"
                      value={formData.maxDeliveryRange}
                      onChange={handleChange}
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-3 text-white font-mono text-lg focus:border-blue-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-4 text-xs text-gray-600 font-bold">
                      km
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-[#333] pt-6">
                <label className="block text-sm font-bold text-gray-300 uppercase mb-4 items-center gap-2">
                  <Clock size={16} /> Godziny Otwarcia
                </label>

                <div className="space-y-4">
                  {/* Pon-Pią */}
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <span className="text-xs text-gray-500 font-bold uppercase w-20">
                      Pon - Pią
                    </span>
                    <div className="flex items-center gap-2 flex-1 w-full">
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

                  {/* Sob-Nie */}
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <span className="text-xs text-gray-500 font-bold uppercase w-20">
                      Sob - Nie
                    </span>
                    <div className="flex items-center gap-2 flex-1 w-full">
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
          </div>

          {/* PRAWA KOLUMNA: PODGLĄD (STICKY) */}
          <div className="space-y-6 sticky top-6">
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <CheckCircle size={16} className="text-green-500" /> Podgląd na
              żywo
            </div>

            <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#2A2A2A] shadow-2xl relative overflow-hidden flex flex-col gap-4 group hover:border-gray-600 transition duration-300">
              {/* Zdjęcie Podglądu */}
              <div className="w-full h-40 rounded-xl overflow-hidden relative border border-[#333]">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000")
                  }
                />
                <span className="absolute top-2 right-2 px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/30 backdrop-blur-sm">
                  ● Otwarte teraz
                </span>
              </div>

              {/* Treść Podglądu */}
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight mb-1">
                  {formData.name || preSelectedBrand.name + "..."}
                </h1>
                <p className="text-gray-400 flex items-center gap-1 text-xs mb-3">
                  <MapPin size={12} className="text-[#FF6B6B]" />
                  {formData.street
                    ? `${formData.street} ${formData.buildingNumber}, ${formData.cityName}`
                    : "Adres lokalu..."}
                </p>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3 min-h-[40px]">
                  {formData.description ||
                    "Tu pojawi się opis Twojej restauracji widoczny dla klientów."}
                </p>

                {/* Ikony w Podglądzie */}
                <div className="flex gap-2 mb-2 overflow-x-auto pb-2 no-scrollbar">
                  <div className="bg-[#252525] px-3 py-2 rounded-lg flex items-center gap-2 border border-[#333] min-w-[90px]">
                    <Bike className="text-[#FF6B6B]" size={16} />
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">
                        Dostawa
                      </p>
                      <p className="text-white font-bold text-xs">
                        {formData.deliveryCost || "0"} zł
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#252525] px-3 py-2 rounded-lg flex items-center gap-2 border border-[#333] min-w-[90px]">
                    <ShoppingBasket className="text-[#FF6B6B]" size={16} />
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">
                        Min.
                      </p>
                      <p className="text-white font-bold text-xs">
                        {formData.minOrderAmount || "0"} zł
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#252525] px-3 py-2 rounded-lg flex items-center gap-2 border border-[#333] min-w-[90px]">
                    <Clock className="text-[#FF6B6B]" size={16} />
                    <div>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">
                        Czas
                      </p>
                      <p className="text-white font-bold text-xs">
                        {formData.averagePreparationTimeMinutes || "30"} min
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#333] pt-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Godziny (Dziś)
                  </p>
                  <p className="text-white text-xs font-mono">
                    {formData.weekdayOpen} - {formData.weekdayClose}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg shadow-red-500/20 hover:to-red-500 transition text-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] duration-200"
            >
              <CheckCircle size={20} /> Opublikuj Lokal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddRestaurantView;
