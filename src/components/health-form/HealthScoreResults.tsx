'use client';

import { HealthScoreResponse } from '@/app/api/health-score/types';
import { OverallScore } from './OverallScore';
import { FocusesScore } from './FocusesScore';
import { Recommendations } from './Recommendations';
import { Summary } from './Summary';
import { ParametersStatuses } from './ParametersStatuses';
import { Expandable } from '../ui/Expandable';

interface HealthScoreResultsProps {
  result: HealthScoreResponse;
  error: string | null;
}

export function HealthScoreResults({ result, error }: HealthScoreResultsProps) {
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <OverallScore overallScore={result.scores.overallScore} />
      <Expandable  title="Health Metrics" defaultExpanded={false} >
        <FocusesScore scores={result.scores} />
      </Expandable>  
      
      <Recommendations recommendations={result.recommendations} />
      <Summary summary={result.summary} />
      <ParametersStatuses parametersStatus={result.parameters_status} />
    </div>
  );
} 