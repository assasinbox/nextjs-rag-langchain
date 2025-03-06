'use client';

interface TextInputProps {
    label: string;
    name: string;
    register: any;
    required?: boolean;
    pattern?: RegExp;
}

export function TextInput({ 
    label, 
    name, 
    register,
    required = true,
    pattern
}: TextInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                type="text"
                {...register(name, { required, pattern })}
                className="w-full p-2 border rounded"
            />
        </div>
    );
} 