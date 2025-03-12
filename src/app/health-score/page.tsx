'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { HealthData, HealthScoreResponse, defaultHealthData } from '../api/health-score/types';
import { NumberInput } from '@/components/form/NumberInput';
// import { SelectInput } from '@/components/form/SelectInput';
// import { BloodPressureInput } from '@/components/form/BloodPressureInput';
// import { TimeInput } from '@/components/form/TimeInput';
import { HEALTH_GROUPS } from '../api/health-score/types';
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
        defaultValues: defaultHealthData
    });

    const calculateBMI = (weight: number, height: number): number => {
        const heightInMeters = height / 100;
        return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    };

    const weight = watch('bodyMass');
    const height = watch('height');

    useEffect(() => {
        if (weight && height) {
            const bmi = calculateBMI(weight, height);
            setValue('bodyMassIndex', bmi);
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
                        {/* Activity Metrics */}
                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.activity.title} ({HEALTH_GROUPS.activity.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {/* <SelectInput
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
                                    label="Body Mass (kg)"
                                    name="bodyMass"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Height (cm)"
                                    name="height"
                                    register={register}
                                    min={0}
                                /> */}
                                <NumberInput
                                    label="Active Energy Burned (cal)"
                                    name="activeEnergyBurned"
                                    register={register}
                                    step="0.1"
                                    readOnly={true}
                                />
                                <NumberInput
                                    label="Basal Energy Burned (cal)"
                                    name="basalEnergyBurned"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                    // max={100}
                                />
                                <NumberInput
                                    label="Stand Hours"
                                    name="standHours"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Exercise Minutes"
                                    name="exerciseMinutes"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Step Count"
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
                                    label="Distance (km)"
                                    name="distance"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Walking Speed (km/h)"
                                    name="walkingSpeed"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Walking Steadiness"
                                    name="walkingSteadiness"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Stair Speed Down (km/h)"
                                    name="stairSpeedDown"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Stair Speed Up (km/h)"
                                    name="stairSpeedUp"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Six Minute Walk Test Distance (m)"
                                    name="sixMinuteWalkTestDistance"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.water.title} ({HEALTH_GROUPS.water.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Water (L)"
                                    name="water"
                                    register={register}
                                    min={0}
                                />

                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.sleep.title} ({HEALTH_GROUPS.sleep.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Sleep Analysis"
                                    name="sleepAnalysis"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Deep Sleep"
                                    name="deepSleep"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="REM Sleep"
                                    name="remSleep"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Core Sleep"
                                    name="coreSleep"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Sleep Awake"
                                    name="sleepAwake"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Sleep Latency"
                                    name="sleepLatency"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Sleep Quality"
                                    name="sleepQuality"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.nutrition.title} ({HEALTH_GROUPS.nutrition.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Dietary Energy (cal)"
                                    name="dietaryEnergy"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Dietary Carbohydrates (g)"
                                    name="dietaryCarbohydrates"
                                    register={register}
                                    min={0}
                                />  
                                <NumberInput
                                    label="Dietary Protein (g)"
                                    name="dietaryProtein"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Dietary Fat (g)"
                                    name="dietaryFat"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Dietary Fiber (g)"
                                    name="dietaryFiber"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Dietary Sugar (g)"
                                    name="dietarySugar"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Dietary Sodium (mg)"
                                    name="dietarySodium"
                                    register={register}
                                    min={0}
                                />
                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.weight.title} ({HEALTH_GROUPS.weight.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Body Mass (kg)"
                                    name="bodyMass"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Body Mass Index"
                                    name="bodyMassIndex"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Body Fat Percentage (%)"
                                    name="bodyFatPercentage"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                    />
                                <NumberInput
                                    label="Lean Body Mass (kg)"
                                    name="leanBodyMass"
                                    register={register}
                                    min={0}
                                />
                                <NumberInput
                                    label="Waist Circumference (cm)"
                                    name="waistCircumference"
                                    register={register}
                                    min={0}
                                />
                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.heartHealth.title} ({HEALTH_GROUPS.heartHealth.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Heart Rate (bpm)"
                                    name="heartRate"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Resting Heart Rate (bpm)"
                                    name="restingHeartRate"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Walking Heart Rate Average (bpm)"
                                    name="walkingHeartRateAverage"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                    />
                                <NumberInput
                                    label="Heart Rate Variability"
                                    name="heartRateVariability"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Blood Pressure Systolic (mmHg)"
                                    name="bloodPressureSystolic"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Blood Pressure Diastolic (mmHg)"
                                    name="bloodPressureDiastolic"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Respiratory Rate (bpm)"
                                    name="respiratoryRate"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />
                                <NumberInput
                                    label="Blood Oxygen Saturation (%)"
                                    name="bloodOxygenSaturation"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />  
                                <NumberInput
                                    label="Body Temperature (°C)"
                                    name="bodyTemperature"
                                    register={register}
                                    step="0.1"
                                    min={0}
                                />  
                                <NumberInput
                                    label="ECG Output"
                                    name="ECGOutput"
                                    register={register}
                                    step="0.1"
                                    min={0} 
                                />
                                <NumberInput
                                    label="ECG Classification"
                                    name="ECGClassification"
                                    register={register} 
                                />  
                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.mentalHealth.title} ({HEALTH_GROUPS.mentalHealth.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <NumberInput
                                    label="Mindful Minutes"
                                    name="mindfulMinutes"
                                    register={register}
                                    step="0.1"  
                                    min={0}
                                />
                                <NumberInput
                                    label="Mindful Session"
                                    name="mindfulSession"
                                    register={register}
                                    step="0.1"  
                                    min={0}
                                />
                                <NumberInput
                                    label="Mood"
                                    name="mood"
                                    register={register}
                                    step="0.1"  
                                    min={0}
                                />
                                <NumberInput
                                    label="Stress Levels"
                                    name="stressLevels" 
                                    register={register} 
                                    step="0.1"  
                                    min={0}
                                />
                                <NumberInput
                                    label="Energy Levels"
                                    name="energyLevels"
                                    register={register}
                                    step="0.1"  
                                    min={0}
                                />
                                <NumberInput
                                    label="Social Interactions"
                                    name="socialInteractions"
                                    register={register}
                                    step="0.1"  
                                    min={0}
                                />  
                            </div>
                        </fieldset>

                        <fieldset className="border p-4 rounded">
                            <legend className="font-bold">{HEALTH_GROUPS.mentalHealth.title} ({HEALTH_GROUPS.mentalHealth.weight}%)</legend>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                
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