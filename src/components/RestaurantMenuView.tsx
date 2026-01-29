import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit3,
  Trash2,
  Flame,
  BookOpen,
  CheckCircle,
  Loader2,
  Scale,
  ChefHat,
  Ruler
} from "lucide-react";

// API
import { getMenu } from "../api/endpoints/menu/menu";
// Importujemy usera getPizza do usuwania pizzy
import { getPizza } from "../api/endpoints/pizza/pizza";
import type { MenuListItemDto, MenuDetailsDto, CreateMenuDto, PizzaSearchResultDto } from "../api/model";

const RestaurantMenuView = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID Pizzerii
  const location = useLocation();
  const { restaurant } = location.state || {}; // Zabezpieczenie przed undefined

  // --- STAN ---
  const [menus, setMenus] = useState<MenuListItemDto[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [currentMenuDetails, setCurrentMenuDetails] = useState<MenuDetailsDto | null>(null);
  
  // Stan formularza dodawania menu
  const [isCreatingMenu, setIsCreatingMenu] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");

  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // 1. Pobierz listę dostępnych menu dla tej pizzerii
  const fetchMenus = async () => {
    if (!id) return;
    try {
      setIsLoadingList(true);
      const response = await getMenu().getApiMenuGetAllMenusPizzeriaId(id);
      setMenus(response);

      // Jeśli mamy menu, a żadne nie jest wybrane -> wybierz aktywne lub pierwsze
      if (response.length > 0 && !selectedMenuId) {
        const active = response.find((m: MenuListItemDto) => m.isActive);
        const toSelect = active ? active.id : response[0].id;
        if(toSelect) handleSelectMenu(toSelect);
      }
    } catch (error) {
      console.error("Błąd pobierania listy menu:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [id]);

  // 2. Pobierz szczegóły konkretnego menu (pizze)
  const handleSelectMenu = async (menuId: string) => {
    setSelectedMenuId(menuId);
    try {
      setIsLoadingDetails(true);
      const response = await getMenu().getApiMenuId(menuId);
      setCurrentMenuDetails(response);
    } catch (error) {
      console.error("Błąd pobierania szczegółów menu:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // 3. Utwórz nowe menu
  const handleCreateMenu = async () => {
    if (!newMenuName.trim() || !id) return;
    try {
      const dto: CreateMenuDto = {
        name: newMenuName,
        pizzeria: {id:id,name:''}, 
      } 
      
      await getMenu().postApiMenuCreate(dto);
      setNewMenuName("");
      setIsCreatingMenu(false);
      alert("Menu utworzone!");
      fetchMenus(); 
    } catch (error) {
      console.error("Błąd tworzenia menu:", error);
      alert("Nie udało się utworzyć menu.");
    }
  };

  // 4. Aktywuj menu
  const handleActivateMenu = async (menuId: string) => {
    try {
      await getMenu().putApiMenuIdActivate(menuId);
      fetchMenus(); 
      alert("Menu zostało aktywowane!");
    } catch (error) {
      console.error("Błąd aktywacji:", error);
    }
  };

  // 5. Usuń menu
  const handleDeleteMenu = async (menuId: string) => {
      if(!confirm("Czy na pewno chcesz usunąć całe menu?")) return;
      try {
          await getMenu().deleteApiMenuId(menuId);
          setSelectedMenuId(null);
          setCurrentMenuDetails(null);
          fetchMenus();
      } catch (error) {
          console.error("Błąd usuwania menu", error);
      }
  }

  // 6. Usuń pizzę
  const handleDeletePizza = async (pizzaId: string) => {
      if(!confirm("Czy na pewno chcesz usunąć tę pizzę?")) return;
      try {
          await getPizza().deleteApiPizzaId(pizzaId);
          // Odśwież widok bieżącego menu
          if(selectedMenuId) handleSelectMenu(selectedMenuId);
      } catch (error) {
          console.error("Błąd usuwania pizzy", error);
          alert("Nie udało się usunąć pizzy.");
      }
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-[#09090b] text-white p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/account")}
                    className="text-gray-400 hover:text-white transition p-2 hover:bg-white/5 rounded-full"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">
                        Zarządzanie Menu
                    </p>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        {restaurant?.name || "Twoja Pizzeria"}
                    </h1>
                </div>
            </div>
        </div>

        {/* --- SEKCJA WYBORU MENU (TABS) --- */}
        <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 border-b border-[#2A2A2A] pb-4">
                {isLoadingList && <Loader2 className="animate-spin text-gray-500" />}
                
                {menus.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => m.id && handleSelectMenu(m.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition border 
                        ${selectedMenuId === m.id 
                            ? "bg-white text-black border-white" 
                            : "bg-[#1A1A1A] text-gray-400 border-[#333] hover:border-gray-500"
                        }`}
                    >
                        {m.isActive && <CheckCircle size={14} className="text-green-500" />}
                        {m.name}
                    </button>
                ))}

                {/* Przycisk dodawania nowego menu */}
                {!isCreatingMenu ? (
                    <button 
                        onClick={() => setIsCreatingMenu(true)}
                        className="px-4 py-2 rounded-lg text-sm font-bold bg-[#1A1A1A] text-blue-400 border border-blue-500/30 hover:bg-blue-500/10 flex items-center gap-2"
                    >
                        <Plus size={16} /> Nowe Menu
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-[#1A1A1A] p-1 rounded-lg border border-blue-500">
                        <input 
                            autoFocus
                            value={newMenuName}
                            onChange={(e) => setNewMenuName(e.target.value)}
                            placeholder="Nazwa menu..."
                            className="bg-transparent text-sm text-white px-2 outline-none w-32"
                        />
                        <button onClick={handleCreateMenu} className="p-1 hover:text-green-400"><CheckCircle size={16}/></button>
                        <button onClick={() => setIsCreatingMenu(false)} className="p-1 hover:text-red-400"><Plus size={16} className="rotate-45"/></button>
                    </div>
                )}
            </div>
        </div>

        {/* --- ZAWARTOŚĆ WYBRANEGO MENU --- */}
        {selectedMenuId ? (
            <div className="animate-in fade-in slide-in-from-bottom-2">
                
                {/* AKCJE MENU */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BookOpen className="text-gray-500" size={24}/> 
                            {currentMenuDetails?.name}
                            {menus.find(m => m.id === selectedMenuId)?.isActive && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">Aktywne</span>
                            )}
                        </h2>
                        <p className="text-gray-500 text-sm">Zarządzaj pozycjami w tym wariancie menu.</p>
                    </div>

                    <div className="flex gap-3">
                        {!menus.find(m => m.id === selectedMenuId)?.isActive && (
                            <button 
                                onClick={() => handleActivateMenu(selectedMenuId)}
                                className="px-4 py-2 bg-green-600/10 text-green-500 border border-green-600/20 hover:bg-green-600 hover:text-white rounded-xl font-bold text-sm transition"
                            >
                                Ustaw jako Aktywne
                            </button>
                        )}

                        <button
                            onClick={() => handleDeleteMenu(selectedMenuId)}
                            className="p-3 bg-[#1A1A1A] text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl border border-[#333] transition"
                            title="Usuń to menu"
                        >
                            <Trash2 size={20} />
                        </button>

                        <button
                            onClick={() =>
                                navigate("/add-pizza", {
                                    state: { 
                                        pizzeriaId: id, 
                                        menuId: selectedMenuId,
                                        pizzeriaName: restaurant?.name 
                                    },
                                })
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 transition transform hover:scale-105"
                        >
                            <Plus size={20} /> Dodaj Pizzę
                        </button>
                    </div>
                </div>

                {/* LISTA PIZZ W TYM MENU */}
                {isLoadingDetails ? (
                     <div className="text-center py-20 text-gray-500 flex flex-col items-center">
                        <Loader2 className="animate-spin mb-2" size={32} />
                        Ładowanie pozycji...
                     </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Zakładamy, że MenuDetailsDto ma pole 'pizzas' (lub products) */}
                        {currentMenuDetails?.pizzas && currentMenuDetails.pizzas.length > 0 ? (
                            currentMenuDetails.pizzas.map((pizza: PizzaSearchResultDto) => (
                                <div
                                    key={pizza.id}
                                    className="group bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] overflow-hidden hover:border-red-500/30 transition duration-300 flex flex-col relative"
                                >
                                    {/* Obrazek Pizzy */}
                                    <div className="h-48 relative overflow-hidden bg-[#111]">
                                        <img
                                            src={pizza.imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500"}
                                            alt={pizza.name}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                                        
                                        {/* STYL PIZZY (BADGE) */}
                                        {pizza.style && (
                                            <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                                                <ChefHat size={12} className="text-yellow-500"/> {pizza.style.name}
                                            </span>
                                        )}

                                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                            <h3 className="text-xl font-bold text-white drop-shadow-md leading-tight">
                                                {pizza.name}
                                            </h3>
                                            <div className="flex flex-col items-end">
                                                <span className="text-yellow-400 font-mono font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-sm border border-yellow-500/20">
                                                    {pizza.price} zł
                                                </span>
                                                {/* Cena za cm2 */}
                                                {pizza.pricePerSqCm && (
                                                    <span className="text-[10px] text-gray-400 mt-1 bg-black/40 px-1 rounded">
                                                        {(Number(pizza.pricePerSqCm) * 100).toFixed(2)} gr/cm²
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Opis i Akcje */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <p className="text-gray-400 text-sm mb-3 line-clamp-2 min-h-[40px]">
                                            {pizza.description || "Pyszna pizza z wybranymi składnikami."}
                                        </p>

                                        {/* SKŁADNIKI (TAGI) */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {pizza.ingredientNames && pizza.ingredientNames.length > 0 ? (
                                                pizza.ingredientNames.slice(0, 4).map((ing, idx) => (
                                                    <span key={idx} className="text-[10px] text-gray-300 bg-[#252525] px-1.5 py-0.5 rounded border border-[#333]">
                                                        {ing}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-gray-600 italic">Brak składników</span>
                                            )}
                                            {pizza.ingredientNames && pizza.ingredientNames.length > 4 && (
                                                <span className="text-[10px] text-gray-500 px-1">+{pizza.ingredientNames.length - 4}</span>
                                            )}
                                        </div>

                                        {/* METADANE (Kcal / Waga / Rozmiar) */}
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 pt-3 border-t border-[#2A2A2A]">
                                            {pizza.kcal && (
                                                <span className="flex items-center gap-1" title="Kalorie">
                                                    <Flame size={12} className="text-orange-500" /> {pizza.kcal}
                                                </span>
                                            )}
                                            {pizza.weightGrams && (
                                                <span className="flex items-center gap-1" title="Waga">
                                                    <Scale size={12} className="text-blue-400" /> {pizza.weightGrams}g
                                                </span>
                                            )}
                                            {pizza.diameterCm && (
                                                <span className="flex items-center gap-1" title="Średnica">
                                                    <Ruler size={12} className="text-green-400" /> {pizza.diameterCm} cm
                                                </span>
                                            )}
                                        </div>

                                        {/* PRZYCISKI */}
                                        <div className="grid grid-cols-2 gap-3 mt-auto">
                                            <button
                                                onClick={() => navigate(`/edit-pizza/${pizza.id}`, { state: { pizzaData: pizza } })} // Przekazujemy dane, żeby nie ładować
                                                className="flex items-center justify-center gap-2 bg-[#252525] hover:bg-[#333] text-white py-2 rounded-lg text-sm font-bold transition border border-[#333]"
                                            >
                                                <Edit3 size={16} /> Edytuj
                                            </button>
                                            <button
                                                onClick={() => pizza.id && handleDeletePizza(pizza.id)}
                                                className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg text-sm font-bold transition border border-red-500/20 hover:border-red-500"
                                            >
                                                <Trash2 size={16} /> Usuń
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center bg-[#1A1A1A]/50 border-2 border-dashed border-[#333] rounded-2xl text-center px-4">
                                <div className="w-16 h-16 bg-[#252525] rounded-full flex items-center justify-center mb-4 text-gray-500">
                                    <BookOpen size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Puste Menu</h3>
                                <p className="text-gray-400 max-w-md mb-6">
                                    To menu nie zawiera jeszcze żadnych pozycji. Dodaj pierwszą pizzę!
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        ) : (
            // STAN GDY NIE MA ŻADNEGO MENU
            <div className="text-center py-20 bg-[#1A1A1A]/30 rounded-3xl border border-[#2A2A2A]/50 flex flex-col items-center">
                <h3 className="text-xl font-bold text-gray-300 mb-2">Brak Menu</h3>
                <p className="text-gray-500 mb-6">Utwórz pierwsze menu dla tej pizzerii, aby zacząć dodawać produkty.</p>
                <button 
                    onClick={() => setIsCreatingMenu(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center gap-2"
                >
                    <Plus size={20}/> Utwórz Pierwsze Menu
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantMenuView;