interface NeonInputProps {
    label: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
    type: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

const NeonInput = ({
  label,
  icon: Icon,
  type,
  value,
  onChange,
  required = false,
}: NeonInputProps) => (
  <div className="space-y-1 group">
    <label className="text-xs text-gray-500 font-bold uppercase ml-1 group-focus-within:text-[#FF6B6B] transition-colors duration-300">
      {label}
    </label>
    <div className="relative">
      <Icon
        className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-[#FF6B6B] group-focus-within:drop-shadow-[0_0_5px_rgba(255,107,107,0.8)] transition-all duration-300"
        size={18}
      />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-black/20 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 
          focus:border-[#FF6B6B] focus:bg-black/40 focus:outline-none focus:shadow-[0_0_15px_rgba(255,107,107,0.15)] 
          transition-all duration-300"
      />
    </div>
  </div>
);

export default NeonInput;