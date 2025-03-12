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
          <div className="text-2xl font-bold mb-2 text-center">
            {scores[key as keyof typeof scores]}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 ">
            <div
              className={`h-2 rounded-full ${
                scores[key as keyof typeof scores] <=  50
                  ? 'bg-red-500'
                  : scores[key as keyof typeof scores] < 75
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              // className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${scores[key as keyof typeof scores]}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
} 