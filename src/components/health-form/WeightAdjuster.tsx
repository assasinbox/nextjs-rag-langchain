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
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            {/* Header - Always Visible */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between py-2"
            >
                <div className="flex items-center gap-2">
                    <svg 
                        className={`w-5 h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 9l-7 7-7-7" 
                        />
                    </svg>
                    <h2 className="text-xl font-bold">Adjust Category Weights</h2>
                </div>
                <div className={`flex items-center gap-2 ${
                    totalWeight === 100 
                        ? 'text-green-600' 
                        : totalWeight > 100 
                            ? 'text-red-600' 
                            : 'text-yellow-600'
                }`}>
                    <span className="font-mono font-bold">{totalWeight}%</span>
                    {!isExpanded && totalWeight !== 100 && (
                        <svg 
                            className="w-5 h-5" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            {isExpanded && (
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
            )}
        </div>
    );
} 