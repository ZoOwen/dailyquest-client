interface FileUploadProps {
    label: string;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

export default function FileUpload({ label, name, onChange, required = false }: FileUploadProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800">{label}</label>
            <input
                type="file"
                name={name}
                accept="image/png, image/jpeg, image/jpg"
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                required={required}
            />
        </div>
    );
}
