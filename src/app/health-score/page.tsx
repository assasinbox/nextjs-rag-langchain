'use client';

import { useState } from 'react';
import { HealthData, HealthScoreResponse } from '../api/health-score/types';
import { HealthScoreForm } from '@/components/health-form/HealthScoreForm';
import { WeightAdjuster } from '@/components/health-form/WeightAdjuster';
import { PromptTemplateEditor } from '@/components/health-form/PromptTemplateEditor';
import { Expandable } from '@/components/ui/Expandable';
import { HealthScoreResults } from '@/components/health-form/HealthScoreResults';
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
                        title="Health Metrics" 
                        defaultExpanded={true}
                    >
                        <HealthScoreForm onSubmit={handleFormSubmit} loading={loading} />
                    </Expandable>        

                    <Expandable 
                        title="Category Weights" 
                        defaultExpanded={true}
                    >
                        <WeightAdjuster onWeightsChange={setWeights} />
                    </Expandable>

                    <Expandable 
                        title="Custom Prompt Template" 
                        defaultExpanded={false}
                    >
                        <PromptTemplateEditor onTemplateChange={setCustomTemplate} />
                    </Expandable>
                </div>

                {/* Results Section */}
                {result && (
                <div className="lg:col-span-2">
                    <HealthScoreResults result={result} error={error} />
                </div>)}
            </div>
        </div>
    );
} 