'use client';

import { useForm } from 'react-hook-form';
import { HealthData, HEALTH_GROUPS, defaultHealthData } from '@/app/api/health-score/types';
import { NumberInput } from '@/components/form/NumberInput';
import { SelectInput } from '@/components/form/SelectInput';
import { BloodPressureInput } from '@/components/form/BloodPressureInput';
import { TimeInput } from '@/components/form/TimeInput';
import { useEffect } from 'react';

interface HealthScoreFormProps {
  onSubmit: (data: HealthData) => Promise<void>;
  loading: boolean;
}

export function HealthScoreForm({ onSubmit, loading }: HealthScoreFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm<HealthData>({
    defaultValues: defaultHealthData
  });

  const calculateBMI = (weight: number, height: number): number => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  // Watch weight and height for BMI calculation
  const weight = watch('bodyMass');
  const height = watch('height');

  useEffect(() => {
    if (weight && height) {
      const bmi = calculateBMI(weight, height);
      setValue('bodyMassIndex', bmi);
    }
  }, [weight, height, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Base Metrics */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Calculating...' : 'Calculate Health Score'}
      </button>
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">Base User Data</legend>
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
            label="Height (cm)"
            name="height"
            register={register}
            min={0}
          />
        </div>
      </fieldset>

      {/* Activity Metrics */}
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">{HEALTH_GROUPS.activity.title} ({HEALTH_GROUPS.activity.weight}%)</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {HEALTH_GROUPS.activity.metrics.map(metric => (
            <NumberInput
              key={metric}
              label={metric.replace(/([A-Z])/g, ' $1').trim()}
              name={metric}
              register={register}
              min={0}
              step='0.1'
            />
          ))}
        </div>
      </fieldset>

      {/* Water Metrics */}
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">{HEALTH_GROUPS.water.title} ({HEALTH_GROUPS.water.weight}%)</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {HEALTH_GROUPS.water.metrics.map(metric => (
            <NumberInput
              key={metric}
              label={metric.replace(/([A-Z])/g, ' $1').trim()}
              name={metric}
              register={register}
              min={0}
              step='0.1'
            />
          ))}
        </div>
      </fieldset>

      {/* Sleep Metrics */}
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">{HEALTH_GROUPS.sleep.title} ({HEALTH_GROUPS.sleep.weight}%)</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {HEALTH_GROUPS.sleep.metrics.map(metric => (
            <TimeInput
              key={metric}
              label={metric.replace(/([A-Z])/g, ' $1').trim()}
              name={metric}
              register={register}
            />
          ))}
        </div>
      </fieldset>

      {/* Nutrition Metrics */}
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">{HEALTH_GROUPS.nutrition.title} ({HEALTH_GROUPS.nutrition.weight}%)</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {HEALTH_GROUPS.nutrition.metrics.map(metric => (
            <NumberInput
              key={metric}
              label={metric.replace(/([A-Z])/g, ' $1').trim()}
              name={metric}
              register={register}
              min={0}
            />
          ))}
        </div>
      </fieldset>

      {/* Weight Metrics */}
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">{HEALTH_GROUPS.weight.title} ({HEALTH_GROUPS.weight.weight}%)</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {HEALTH_GROUPS.weight.metrics.map(metric => (
            <NumberInput
              key={metric}
              label={metric.replace(/([A-Z])/g, ' $1').trim()}
              name={metric}
              register={register}
              min={0}
              step='0.1'
            />
          ))}
        </div>
      </fieldset>

      {/* Heart Health Metrics */}
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">{HEALTH_GROUPS.heartHealth.title} ({HEALTH_GROUPS.heartHealth.weight}%)</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <BloodPressureInput register={register} />
          {HEALTH_GROUPS.heartHealth.metrics.map(metric => (
            <NumberInput
              key={metric}
              label={metric.replace(/([A-Z])/g, ' $1').trim()}
              name={metric}
              register={register}
              min={0}
              step='0.1'
            />
          ))}
        </div>
      </fieldset>

      {/* Mental Health Metrics */}
      <fieldset className="border p-4 rounded">
        <legend className="font-bold">{HEALTH_GROUPS.mentalHealth.title} ({HEALTH_GROUPS.mentalHealth.weight}%)</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {HEALTH_GROUPS.mentalHealth.metrics.map(metric => (
            <NumberInput
              key={metric}
              label={metric.replace(/([A-Z])/g, ' $1').trim()}
              name={metric}
              register={register}
              min={0}
              max={metric.includes('Levels') || metric === 'mood' ? 10 : undefined}
            />
          ))}
        </div>
      </fieldset>
    </form>
  );
} 