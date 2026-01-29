interface OptionTileProps {
    label: string;
    selected: boolean;
    onClick: () => void;
}  
  const OptionTile = ({ label, selected, onClick }: OptionTileProps) => (
    <div
      onClick={onClick}
      className={`cursor-pointer px-3 py-2 rounded-lg text-xs font-bold border transition-all text-center flex items-center justify-center select-none
        ${selected ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "bg-[#1A1A1A] border-[#333] text-gray-400 hover:border-gray-500 hover:text-gray-300"}`}
    >
      {label}
    </div>
  );
export default OptionTile;