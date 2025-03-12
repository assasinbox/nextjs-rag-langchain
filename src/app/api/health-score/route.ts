import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { HealthScoreResponse, RequestBody } from './types';
import { HEALTH_SCORE_TEMPLATE } from './template';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Set maximum duration to 300 seconds for Edge function
export const runtime = 'edge'; // Use Edge runtime for better performance

// function calculateGroupScore(data: HealthMetric, groupMetrics: readonly string[]): number {
//     const validValues = groupMetrics
//         .map(metric => data[metric])
//         .filter(val => typeof val === 'number' && !isNaN(val));
    
//     return validValues.length > 0 
//         ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
//         : 0;
// }
// Calculate group scores
// const groupScores = {
//     activity: calculateGroupScore(healthData, METRICS_BY_GROUP['Activity']),
//     water: calculateGroupScore(healthData, METRICS_BY_GROUP['Water']),
//     sleep: calculateGroupScore(healthData, METRICS_BY_GROUP['Sleep']),
//     nutrition: calculateGroupScore(healthData, METRICS_BY_GROUP['Nutrition']),
//     weight: calculateGroupScore(healthData, METRICS_BY_GROUP['Weight']),
//     heartHealth: calculateGroupScore(healthData, METRICS_BY_GROUP['Heart Health']),
//     mentalHealth: calculateGroupScore(healthData, METRICS_BY_GROUP['Mental Health'])
// };>

export async function POST(req: Request) {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Request timeout - processing took too long'));
        }, 8000); // Set to 8 seconds to ensure we don't hit Vercel's 10s limit
    });

    try {
        const body: RequestBody = await req.json();

        if (!body.data || !body.weights) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields in request' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: healthData, weights, template } = body;

        const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
        if (totalWeight !== 100) {
            return new Response(
                JSON.stringify({ error: `Weight total must be 100% (currently ${totalWeight}%)` }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 1000, // Limit token count
            timeout: 8000, // 8 second timeout
        });

        const prompt = PromptTemplate.fromTemplate(template || HEALTH_SCORE_TEMPLATE);
        const parser = new HttpResponseOutputParser();
        const chain = prompt.pipe(model).pipe(parser);

        // Race between the chain execution and timeout
        const response = await Promise.race([
            chain.invoke({
                ...Object.fromEntries(
                    Object.entries(healthData).map(([key, value]) => [key, value.toString()])
                ),
                ...Object.fromEntries(
                    Object.entries(weights).map(([key, value]) => [`${key}Weight`, value.toString()])
                )
            }),
            timeoutPromise
        ]);

        const responseString = new TextDecoder().decode(response as Uint8Array);
        const parsedResponse = JSON.parse(responseString);

        const formattedResponse: HealthScoreResponse = {
            parameters_status: parsedResponse.parameters_status || {},
            summary: parsedResponse.summary || '',
            scores: {
                activity: Number(parsedResponse.scores?.activity) || 0,
                water: Number(parsedResponse.scores?.water) || 0,
                sleep: Number(parsedResponse.scores?.sleep) || 0,
                nutrition: Number(parsedResponse.scores?.nutrition) || 0,
                weight: Number(parsedResponse.scores?.weight) || 0,
                heartHealth: Number(parsedResponse.scores?.heartHealth) || 0,
                mentalHealth: Number(parsedResponse.scores?.mentalHealth) || 0,
                overallScore: Number(Math.ceil(parsedResponse.scores?.overallScore)) || 0
            },
            recommendations: {
                activity: Array.isArray(parsedResponse.recommendations?.activity) ? parsedResponse.recommendations.activity : [],
                water: Array.isArray(parsedResponse.recommendations?.water) ? parsedResponse.recommendations.water : [],
                sleep: Array.isArray(parsedResponse.recommendations?.sleep) ? parsedResponse.recommendations.sleep : [],
                nutrition: Array.isArray(parsedResponse.recommendations?.nutrition) ? parsedResponse.recommendations.nutrition : [],
                weight: Array.isArray(parsedResponse.recommendations?.weight) ? parsedResponse.recommendations.weight : [],
                heartHealth: Array.isArray(parsedResponse.recommendations?.heartHealth) ? parsedResponse.recommendations.heartHealth : [],
                mentalHealth: Array.isArray(parsedResponse.recommendations?.mentalHealth) ? parsedResponse.recommendations.mentalHealth : []
            }
        };

        console.log(formattedResponse);
        return new Response(
            JSON.stringify(formattedResponse),
            { headers: { 'Content-Type': 'application/json' } }
        );

    } catch (e: any) {
        const isTimeout = e.message.includes('timeout');
        const errorResponse = {
            error: isTimeout ? 'Request timed out. Please try again.' : (e.message || 'Failed to calculate health score'),
            scores: {
                body: 0, vital: 0, activity: 0, sleep: 0, nutrition: 0, blood: 0, overallScore: 0
            },
            recommendations: {
                body: [], vital: [], activity: [], sleep: [], nutrition: [], blood: []
            }
        };

        return new Response(
            JSON.stringify(errorResponse),
            { 
                status: isTimeout ? 408 : (e.status ?? 500),
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
} 