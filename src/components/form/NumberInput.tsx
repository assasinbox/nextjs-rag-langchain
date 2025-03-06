'use client';

interface NumberInputProps {
    label: string;
    name: string;
    register: any;
    step?: string;
    readOnly?: boolean;
    required?: boolean;
    min?: number;
    max?: number;
}

export function NumberInput({ 
    label, 
    name, 
    register, 
    step = "1", 
    readOnly = false,
    required = true,
    min,
    max
}: NumberInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                type="number"
                step={step}
                {...register(name, { required, min, max })}
                className={`w-full p-2 border rounded ${readOnly ? 'bg-gray-50' : ''}`}
                readOnly={readOnly}
            />
        </div>
    );
} 