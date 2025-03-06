'use client';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectInputProps {
    label: string;
    name: string;
    register: any;
    options: SelectOption[];
    required?: boolean;
}

export function SelectInput({ 
    label, 
    name, 
    register, 
    options,
    required = true 
}: SelectInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <select
                {...register(name, { required })}
                className="w-full p-2 border rounded"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
} 