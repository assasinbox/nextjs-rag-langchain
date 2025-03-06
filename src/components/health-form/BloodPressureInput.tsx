'use client';

import { TextInput } from "../form/TextInput";

interface BloodPressureInputProps {
    register: any;
}

export function BloodPressureInput({ register }: BloodPressureInputProps) {
    return (
        <TextInput
            label="Blood Pressure"
            name="blood_pressure"
            register={register}
            pattern={/^\d{2,3}\/\d{2,3}$/}
        />
    );
} 