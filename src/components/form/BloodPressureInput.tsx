'use client';

interface BloodPressureInputProps {
    register: any;
    required?: boolean;
}

export function BloodPressureInput({ 
    register,
    required = true
}: BloodPressureInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">Blood Pressure</label>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <input
                        type="number"
                        {...register('bloodPressure.systolicValue', { 
                            required,
                            min: 70,
                            max: 200
                        })}
                        placeholder="Systolic (120)"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        {...register('bloodPressure.diastolicValue', { 
                            required,
                            min: 40,
                            max: 130
                        })}
                        placeholder="Diastolic (80)"
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        </div>
    );
} 