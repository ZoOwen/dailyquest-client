interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

export default function InputField({ label, type, name, value, onChange, required = false }: InputFieldProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={required}
            />
        </div>
    );
}
