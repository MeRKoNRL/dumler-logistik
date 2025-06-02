'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-300 text-black hover:bg-gray-400',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={\`px-4 py-2 rounded text-sm \${variantClasses[variant]}\`}
    >
      {children}
    </button>
  );
}
