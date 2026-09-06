type Props = {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function Input({ label, value, placeholder, onChange }: Props) {
  return (
    <div className="w-full">
      <div className="font-bold text-gray-600 mb-1">{label}</div>
      <input
        value={value}
        placeholder={placeholder}
        className="w-full p-3 overflow-hidden resize-none border-2 border-gray-500 rounded outline-none"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
