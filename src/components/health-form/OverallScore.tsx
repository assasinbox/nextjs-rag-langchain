'use client';

interface OverallScoreProps {
  overallScore: number;
}

export function OverallScore({ overallScore }: OverallScoreProps) {
  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Health Score</h2>
      <div className="text-4xl font-bold text-center mb-4">
        {overallScore}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${overallScore}%` }}
        ></div>
      </div>
    </div>
  );
} 