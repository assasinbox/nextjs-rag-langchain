'use client';

interface TimeInputProps {
    label: string;
    name: string;
    register: any;
    required?: boolean;
}

export function TimeInput({ 
    label, 
    name, 
    register,
    required = true
}: TimeInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                type="text"
                {...register(name, { 
                    required,
                    pattern: {
                        value: /^\d+h\s\d+m$/,
                        message: "Format should be like '6h 30m'"
                    }
                })}
                placeholder="6h 30m"
                className="w-full p-2 border rounded"
            />
        </div>
    );
} 