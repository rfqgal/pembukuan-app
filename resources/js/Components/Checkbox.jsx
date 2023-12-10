export default function Checkbox({ className = '', ...props }) {
  return (
    <input
      {...props}
      type="checkbox"
      className={`${className}
        rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 
      `}
    />
  );
}
