'use client';

import { useState, useEffect, useCallback } from 'react';
import { HEALTH_SCORE_TEMPLATE } from '@/app/api/health-score/template';

interface PromptTemplateEditorProps {
    onTemplateChange: (template: string | null) => void;
}

export function PromptTemplateEditor({ onTemplateChange }: PromptTemplateEditorProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [template, setTemplate] = useState(HEALTH_SCORE_TEMPLATE);
    const [isModified, setIsModified] = useState(false);

    // Reset to default template
    const handleReset = () => {
        setTemplate(HEALTH_SCORE_TEMPLATE);
        setIsModified(false);
        onTemplateChange(null);
    };

    // Handle template changes
    const handleTemplateChange = (newTemplate: string) => {
        setTemplate(newTemplate);
        setIsModified(newTemplate !== HEALTH_SCORE_TEMPLATE);
        onTemplateChange(newTemplate !== HEALTH_SCORE_TEMPLATE ? newTemplate : null);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
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
                    <h2 className="text-xl font-bold">Prompt Template Editor</h2>
                </div>
                {isModified && !isExpanded && (
                    <span className="text-blue-600 text-sm">Modified</span>
                )}
            </button>

            {isExpanded && (
                <div className="mt-4 space-y-4">
                    <div className="flex justify-end gap-2 mb-2">
                        <button
                            onClick={handleReset}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            disabled={!isModified}
                        >
                            Reset to Default
                        </button>
                    </div>
                    <textarea
                        value={template}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        className="w-full h-[500px] p-4 font-mono text-sm border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        spellCheck={false}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>
                            {isModified ? 'Template modified - will be used for calculation' : 'Using default template'}
                        </span>
                        <span>
                            {template.length} characters
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
} 