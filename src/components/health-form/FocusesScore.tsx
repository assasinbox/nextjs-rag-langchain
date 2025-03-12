'use client';

import { HEALTH_GROUPS } from '@/app/api/health-score/types';

interface FocusesScoreProps {
  scores: Record<string, number>;
}

export function FocusesScore({ scores }: FocusesScoreProps) {
  return (
    <div className="space-y-4">
      {Object.entries(HEALTH_GROUPS).map(([key, group]) => (
        <div key={key} className="bg-white rounded-lg">
          <h3 className="font-semibold mb-2">
            {group.title} ({group.weight}%)
          </h3>
          <div className="text-2xl font-bold mb-2">
            {scores[key as keyof typeof scores]}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${scores[key as keyof typeof scores]}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
} 