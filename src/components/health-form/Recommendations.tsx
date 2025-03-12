'use client';

import { HEALTH_GROUPS } from '@/app/api/health-score/types';

interface RecommendationsProps {
  recommendations: Record<string, string[]>;
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      {Object.entries(HEALTH_GROUPS).map(([key, group]) => {
        const recs = recommendations[key as keyof typeof recommendations];
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
  );
} 