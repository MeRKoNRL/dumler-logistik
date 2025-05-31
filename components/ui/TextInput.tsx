'use client';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function TextInput({ label, ...props }: TextInputProps) {
  return (
    <div className="flex flex-col gap-1 text-sm w-full">
      {label && <label className="text-gray-700">{label}</label>}
      <input
        {...props}
        className="border p-2 rounded w-full focus:outline-blue-400"
      />
    </div>
  );
}
