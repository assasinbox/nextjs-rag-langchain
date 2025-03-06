'use client';

interface DietTypeSelectProps {
    register: any;
}

export function DietTypeSelect({ register }: DietTypeSelectProps) {
    const dietOptions = [
        { value: 'balanced', label: 'Balanced' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'keto', label: 'Keto' },
        { value: 'paleo', label: 'Paleo' }
    ];

    return (
        <SelectInput
            label="Diet Type"
            name="diet_type"
            register={register}
            options={dietOptions}
        />
    );
} 