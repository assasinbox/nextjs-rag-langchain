'use client';

import { useState, useEffect } from 'react';
import { HEALTH_GROUPS } from '@/app/api/health-score/types';

interface WeightAdjusterProps {
    onWeightsChange: (weights: Record<string, number>) => void;
}

export function WeightAdjuster({ onWeightsChange }: WeightAdjusterProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [weights, setWeights] = useState(() => {
        return Object.entries(HEALTH_GROUPS).reduce((acc, [key, group]) => ({
            ...acc,
            [key]: group.weight
        }), {} as Record<string, number>);
    });

    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

    const handleWeightChange = (key: string, newValue: number) => {
        // Don't allow values below 1
        if (newValue < 1) return;

        // Calculate new total if we apply this change
        const potentialTotal = totalWeight - weights[key] + newValue;

        // Don't allow increasing if total would exceed 100
        if (potentialTotal > 100) return;

        // Update the weight
        setWeights(prev => ({
            ...prev,
            [key]: newValue
        }));
    };

    useEffect(() => {
        onWeightsChange(weights);
    }, [weights, onWeightsChange]);

    return (
        <div className="mt-4 space-y-4">
        {Object.entries(HEALTH_GROUPS).map(([key, group]) => (
            <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="font-medium">{group.title}</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={weights[key]}
                            onChange={(e) => handleWeightChange(key, Number(e.target.value))}
                            className="w-16 p-1 border rounded text-right"
                        />
                        <span className="text-sm font-mono w-8">%</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={weights[key]}
                        onChange={(e) => handleWeightChange(key, Number(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>
        ))}

        <div className="flex justify-between pt-2 border-t">
            <span className="font-bold">Total</span>
            <div className="flex items-center gap-2">
                <span className={`font-mono font-bold ${
                    totalWeight === 100 
                        ? 'text-green-600' 
                        : totalWeight > 100 
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                }`}>
                    {totalWeight}%
                </span>
                <span className="text-sm text-gray-500">
                    {totalWeight !== 100 && (
                        totalWeight < 100 
                            ? `(${100 - totalWeight}% remaining)` 
                            : '(exceeds 100%)'
                    )}
                </span>
            </div>
        </div>

        {totalWeight !== 100 && (
            <div className={`mt-4 p-3 rounded text-sm ${
                totalWeight < 100 
                    ? 'bg-yellow-50 text-yellow-800' 
                    : 'bg-red-50 text-red-800'
            }`}>
                {totalWeight < 100 
                    ? 'Total weight must equal 100% to calculate health score.' 
                    : 'Total weight exceeds 100%. Please adjust values.'}
            </div>
        )}
    </div>
    );
} 