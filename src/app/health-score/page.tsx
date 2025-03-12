'use client';

import { useState } from 'react';
import { HealthData, HealthScoreResponse } from '../api/health-score/types';
import { HealthScoreForm } from '@/components/health-form/HealthScoreForm';
import { WeightAdjuster } from '@/components/health-form/WeightAdjuster';
import { PromptTemplateEditor } from '@/components/health-form/PromptTemplateEditor';
import { Expandable } from '@/components/ui/Expandable';
import { HEALTH_GROUPS } from '../api/health-score/types';

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

    const handleFormSubmit = async (data: HealthData) => {
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
                throw new Error(errorData.error || 'Failed to calculate health score');
            }

            const result = await response.json();
            setResult(result);
        } catch (err: any) {
                setError(err.message || 'An error occurred during calculation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Health Score Calculator and Recommendations</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Expandable 
                        title="Custom Prompt Template" 
                        defaultExpanded={false}
                    >
                        <PromptTemplateEditor onTemplateChange={setCustomTemplate} />
                    </Expandable>

                    <Expandable 
                        title="Category Weights" 
                        defaultExpanded={false}
                    >
                        <WeightAdjuster onWeightsChange={setWeights} />
                    </Expandable>

                    <Expandable 
                        title="Health Metrics" 
                        defaultExpanded={true}
                    >
                        <HealthScoreForm onSubmit={handleFormSubmit} loading={loading} />
                    </Expandable>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {result && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg">
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

                                <Expandable 
                                    title="Detailed Scores" 
                                    defaultExpanded={false}
                                >
                                    <div className="space-y-4">
                                        {Object.entries(HEALTH_GROUPS).map(([key, group]) => (
                                            <div key={key} className="bg-white rounded-lg">
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
                                </Expandable>

                                <div className="bg-white rounded-lg">
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