'use client';

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Summary</h2>
      <p className="text-gray-700">{summary}</p>
    </div>
  );
} 