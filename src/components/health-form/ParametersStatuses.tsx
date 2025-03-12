'use client';

import { HEALTH_GROUPS } from '@/app/api/health-score/types';

interface ParametersStatusesProps {
  parametersStatus: Record<string, string>;
}

export function ParametersStatuses({ parametersStatus }: ParametersStatusesProps) {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="space-y-4">
        {Object.entries(HEALTH_GROUPS).map(([key, group]) => (
          <div key={key} className="bg-white rounded-lg p-4">
            <h3 className="font-semibold mb-2">{group.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {group.metrics.map((metric) => (
                <div key={metric} className="flex justify-between">
                  <span className="text-gray-600">{metric}:</span>
                  <span className="font-medium">
                    {(() => {
                      let status = parametersStatus[metric as keyof typeof parametersStatus];
                      let color = '';
                      if (status === 'excellent') color = 'text-green-600';
                      else if (status === 'normal') color = 'text-yellow-600';
                      else if (status === 'needs_attention') {
                        color = 'text-red-600';
                        status = 'attention';
                      }
                      return <span className={color}>
                        {status}
                      </span>;
                    })()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 