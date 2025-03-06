'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HealthData, HealthScoreResponse } from '../api/health-score/types';
import { NumberInput } from '@/components/form/NumberInput';
import { SelectInput } from '@/components/form/SelectInput';
import { BloodPressureInput } from '@/components/form/BloodPressureInput';
import { TimeInput } from '@/components/form/TimeInput';
import { HEALTH_GROUPS } from '../api/health-score/config';
import { WeightAdjuster } from '@/components/health-form/WeightAdjuster';
import { PromptTemplateEditor } from '@/components/health-form/PromptTemplateEditor';

export default function HealthScorePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<HealthScoreResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [weights, setWeights] = useState(() => {
        return Object.entries(HEALTH_GROUPS).reduce((acc, [key, group]) => ({
            ...acc,
            [key]: group.weight
        }), {} as Record<string, number>);
    });
    const [customTemplate, setCustomTemplate] = useState<string | null>(null);

    const { register, handleSubmit, watch, setValue } = useForm<HealthData>({
        defaultValues: {
            // Body Metrics
            sex: 'male',
            age: 25,
            weight: 72,
            height: 180,
            bmi: 22.2,
            bodyFatPercentage: 16.5,
            waistCircumference: 38.5,

            // Vital Signs
            heartRate: 80,
            heartRateResting: 68.5,
            heartRateVariability: 0.5,
            bloodPressure: {
                systolicValue: 120,
                diastolicValue: 80
            },
            respiratoryRate: 16,
            bodyTemperature: 98.6,
            oxygenSaturation: 0.98,

            // Activity
            stepCount: 10567,
            flightsClimbed: 12,
            activeEnergyBurned: 250,
            basalEnergyBurned: 60,
            distanceWalkingRunning: 7.8,
            distanceSwimming: 1.8,
            distanceCycling: 11.8,

            // Sleep
            sleep: '6h 30m',
            deepSleep: '1h 30m',

            // Nutrition
            dietaryProtein: 39,
            dietaryFiber: 39,
            dietaryWater: 0.6,

            // Blood Markers
            bloodGlucose: 5.7,
            insulinDelivery: 5,
            bloodAlcoholContent: 0.00015
        }
    });

    const calculateBMI = (weight: number, height: number): number => {
        const heightInMeters = height / 100;
        return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    };

    const weight = watch('weight');
    const height = watch('height');

    useEffect(() => {
        if (weight && height) {
            const bmi = calculateBMI(weight, height);
            setValue('bmi', bmi);
        }
    }, [weight, height, setValue]);

    const onSubmit = async (data: HealthData) => {
        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        
        if (totalWeight !== 100) {
            setError(`Total weight must equal 100% (currently ${totalWeight}%)`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/health-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data,
                    weights,
                    template: customTemplate
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 408) {
                    throw new Error('Request timed out. Please try again with a simpler template or fewer parameters.');
                }
                throw new Error(errorData.error || 'Failed to calculate health score');
            }

            const result = await response.json();
            setResult(result);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError('Calculation cancelled');
            } else {
                setError(err.message || 'An error occurred during calculation');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Health Score Calculator and Recomendations</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-2">
                    <PromptTemplateEditor onTemplateChange={setCustomTemplate} />
                    <WeightAdjuster onWeightsChange={setWeights} />
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Body Metrics */}
                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.body.title} ({HEALTH_GROUPS.body.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <SelectInput
                                    label="Sex"
                                    name="sex"
                                    register={register}
                                    options={[
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' }
                                    ]}
                                />
                                <NumberInput
                                    label="Age"
                                    name="age"
                                    register={register}
                                    min={0}
                                    max={120}
                                />
                                <NumberInput
                                    label="Weight (kg)"
                                    name="weight"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Height (cm)"
                                    name="height"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="BMI"
                                    name="bmi"
                                    register={register}
                                    step="0.1"
                                    readOnly={true}
                                />
                                <NumberInput
                                    label="Body Fat %"
                                    name="bodyFatPercentage"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                    max={100}
                                />
                                <NumberInput
                                    label="Waist (cm)"
                                    name="waistCircumference"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                            </div>
                        </fieldset>

                        {/* Vital Signs */}
                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.vital.title} ({HEALTH_GROUPS.vital.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <BloodPressureInput register={register} />
                                <NumberInput
                                    label="Heart Rate (bpm)"
                                    name="heartRate"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Resting HR (bpm)"
                                    name="heartRateResting"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="HRV"
                                    name="heartRateVariability"
                                    register={register}
                                    step="0.01"
                                    min={0}
                                />
                                <NumberInput
                                    label="Respiratory Rate"
                                    name="respiratoryRate"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Body Temp (°F)"
                                    name="bodyTemperature"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="O₂ Saturation"
                                    name="oxygenSaturation"
                                    register={register}
                                    step="0.01"
                                    min={0}
                                    max={1}
                                />
                            </div>
                        </fieldset>

                        {/* Activity */}
                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.activity.title} ({HEALTH_GROUPS.activity.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Steps"
                                    name="stepCount"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Flights Climbed"
                                    name="flightsClimbed"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Active Energy (cal)"
                                    name="activeEnergyBurned"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Basal Energy (cal)"
                                    name="basalEnergyBurned"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Walking/Running (km)"
                                    name="distanceWalkingRunning"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Swimming (km)"
                                    name="distanceSwimming"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Cycling (km)"
                                    name="distanceCycling"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                            </div>
                        </fieldset>

                        {/* Sleep */}
                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.sleep.title} ({HEALTH_GROUPS.sleep.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <TimeInput
                                    label="Total Sleep"
                                    name="sleep"
                                    register={register}
                                />
                                <TimeInput
                                    label="Deep Sleep"
                                    name="deepSleep"
                                    register={register}
                                />
                            </div>
                        </fieldset>

                        {/* Nutrition */}
                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.nutrition.title} ({HEALTH_GROUPS.nutrition.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Protein (g)"
                                    name="dietaryProtein"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Fiber (g)"
                                    name="dietaryFiber"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Water (L)"
                                    name="dietaryWater"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                            </div>
                        </fieldset>

                        {/* Blood Markers */}
                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.blood.title} ({HEALTH_GROUPS.blood.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Blood Glucose"
                                    name="bloodGlucose"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Insulin Delivery"
                                    name="insulinDelivery"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Blood Alcohol"
                                    name="bloodAlcoholContent"
                                    register={register}
                                    step="0.00001"
                                    min={0}
                                />
                            </div>
                        </fieldset>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? 'Calculating...' : 'Calculate Health Score'}
                        </button>
                    </form>
                </div>

                {/* Results Section - Takes 1 column */}
                <div className="lg:col-span-2">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 sticky top-4">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-bold mb-4">Overall Score</h2>
                                <div className="text-4xl font-bold text-center mb-4">
                                    {result.scores.overallScore}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-blue-500 h-4 rounded-full"
                                        style={{ width: `${result.scores.overallScore}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(HEALTH_GROUPS).map(([key, group]) => (
                                    <div key={key} className="bg-white p-4 rounded-lg shadow">
                                        <h3 className="font-semibold mb-2">
                                            {group.title} ({group.weight}%)
                                        </h3>
                                        <div className="text-2xl font-bold mb-2">
                                            {result.scores[key as keyof typeof result.scores]}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${result.scores[key as keyof typeof result.scores]}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
                                {Object.entries(HEALTH_GROUPS).map(([key, group]) => {
                                    const recs = result.recommendations[key as keyof typeof result.recommendations];
                                    return recs && recs.length > 0 ? (
                                        <div key={key} className="mb-4">
                                            <h3 className="font-semibold mb-2">{group.title}</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                {recs.map((rec, index) => (
                                                    <li key={index} className="text-gray-700">{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 