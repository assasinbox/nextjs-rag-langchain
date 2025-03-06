import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { HealthData, HealthScoreResponse } from './types';
import { HEALTH_SCORE_TEMPLATE } from './template';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Set maximum duration to 300 seconds for Edge function
export const runtime = 'edge'; // Use Edge runtime for better performance

interface RequestBody {
    data: HealthData;
    weights: {
        body: number;
        vital: number;
        activity: number;
        sleep: number;
        nutrition: number;
        blood: number;
    };
    template?: string | null;
}

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
                sex: healthData.sex,
                age: healthData.age.toString(),
                weight: healthData.weight.toString(),
                height: healthData.height.toString(),
                bmi: healthData.bmi.toString(),
                bodyFatPercentage: healthData.bodyFatPercentage.toString(),
                waistCircumference: healthData.waistCircumference.toString(),
                
                heartRate: healthData.heartRate.toString(),
                heartRateResting: healthData.heartRateResting.toString(),
                heartRateVariability: healthData.heartRateVariability.toString(),
                'bloodPressure.systolicValue': healthData.bloodPressure.systolicValue.toString(),
                'bloodPressure.diastolicValue': healthData.bloodPressure.diastolicValue.toString(),
                respiratoryRate: healthData.respiratoryRate.toString(),
                bodyTemperature: healthData.bodyTemperature.toString(),
                oxygenSaturation: (healthData.oxygenSaturation * 100).toString(),
                
                stepCount: healthData.stepCount.toString(),
                flightsClimbed: healthData.flightsClimbed.toString(),
                activeEnergyBurned: healthData.activeEnergyBurned.toString(),
                basalEnergyBurned: healthData.basalEnergyBurned.toString(),
                distanceWalkingRunning: healthData.distanceWalkingRunning.toString(),
                distanceSwimming: healthData.distanceSwimming.toString(),
                distanceCycling: healthData.distanceCycling.toString(),
                
                sleep: healthData.sleep,
                deepSleep: healthData.deepSleep,
                
                dietaryProtein: healthData.dietaryProtein.toString(),
                dietaryFiber: healthData.dietaryFiber.toString(),
                dietaryWater: healthData.dietaryWater.toString(),
                
                bloodGlucose: healthData.bloodGlucose.toString(),
                insulinDelivery: healthData.insulinDelivery.toString(),
                bloodAlcoholContent: (healthData.bloodAlcoholContent * 100).toString(),

                bodyWeight: weights.body.toString(),
                vitalWeight: weights.vital.toString(),
                activityWeight: weights.activity.toString(),
                sleepWeight: weights.sleep.toString(),
                nutritionWeight: weights.nutrition.toString(),
                bloodWeight: weights.blood.toString()
            }),
            timeoutPromise
        ]);

        const responseString = new TextDecoder().decode(response as Uint8Array);
        const parsedResponse = JSON.parse(responseString);

        const formattedResponse: HealthScoreResponse = {
            scores: {
                body: Number(parsedResponse.scores?.body) || 0,
                vital: Number(parsedResponse.scores?.vital) || 0,
                activity: Number(parsedResponse.scores?.activity) || 0,
                sleep: Number(parsedResponse.scores?.sleep) || 0,
                nutrition: Number(parsedResponse.scores?.nutrition) || 0,
                blood: Number(parsedResponse.scores?.blood) || 0,
                overallScore: Number(Math.ceil(parsedResponse.scores?.overallScore)) || 0
            },
            recommendations: {
                body: Array.isArray(parsedResponse.recommendations?.body) ? parsedResponse.recommendations.body : [],
                vital: Array.isArray(parsedResponse.recommendations?.vital) ? parsedResponse.recommendations.vital : [],
                activity: Array.isArray(parsedResponse.recommendations?.activity) ? parsedResponse.recommendations.activity : [],
                sleep: Array.isArray(parsedResponse.recommendations?.sleep) ? parsedResponse.recommendations.sleep : [],
                nutrition: Array.isArray(parsedResponse.recommendations?.nutrition) ? parsedResponse.recommendations.nutrition : [],
                blood: Array.isArray(parsedResponse.recommendations?.blood) ? parsedResponse.recommendations.blood : []
            }
        };

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