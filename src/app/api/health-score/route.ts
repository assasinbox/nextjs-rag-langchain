import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { HealthData, HealthScoreResponse } from './types';
import { HEALTH_SCORE_TEMPLATE } from './template';

export const dynamic = 'force-dynamic';

export const config = {
    runtime: "edge",
  };
interface RequestBody {
    data: HealthData;
    weights: Record<string, number>;
    template?: string | null;
}

export async function POST(req: Request) {
    try {
        const { data: healthData, weights, template }: RequestBody = await req.json();

        // Use custom template if provided, otherwise use default
        const promptTemplate = template || HEALTH_SCORE_TEMPLATE;
        console.log(promptTemplate);
        const prompt = PromptTemplate.fromTemplate(promptTemplate);

        console.log('OPENAI_API_KEY: ', process.env.OPENAI_API_KEY);
        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            verbose: true,
        });

        const parser = new HttpResponseOutputParser();

        const chain = prompt.pipe(model).pipe(parser);

        const response = await chain.invoke({
            // Health Data
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

            // Category Weights
            bodyWeight: weights.body.toString(),
            vitalWeight: weights.vital.toString(),
            activityWeight: weights.activity.toString(),
            sleepWeight: weights.sleep.toString(),
            nutrionWeight: weights.nutrion.toString(),
            bloodWeight: weights.blood.toString()
        });

        const responseString = new TextDecoder().decode(response);
        const parsedResponse = JSON.parse(responseString);

        const formattedResponse: HealthScoreResponse = {
            scores: {
                body: Number(parsedResponse.scores?.body) || 0,
                vital: Number(parsedResponse.scores?.vital) || 0,
                activity: Number(parsedResponse.scores?.activity) || 0,
                sleep: Number(parsedResponse.scores?.sleep) || 0,
                nutrion: Number(parsedResponse.scores?.nutrion) || 0,
                blood: Number(parsedResponse.scores?.blood) || 0,
                overallScore: Number(parsedResponse.scores?.overallScore) || 0
            },
            recommendations: {
                body: Array.isArray(parsedResponse.recommendations?.body) 
                    ? parsedResponse.recommendations.body 
                    : [],
                vital: Array.isArray(parsedResponse.recommendations?.vital) 
                    ? parsedResponse.recommendations.vital 
                    : [],
                activity: Array.isArray(parsedResponse.recommendations?.activity) 
                    ? parsedResponse.recommendations.activity 
                    : [],
                sleep: Array.isArray(parsedResponse.recommendations?.sleep) 
                    ? parsedResponse.recommendations.sleep 
                    : [],
                nutrion: Array.isArray(parsedResponse.recommendations?.nutrion) 
                    ? parsedResponse.recommendations.nutrion 
                    : [],
                blood: Array.isArray(parsedResponse.recommendations?.blood) 
                    ? parsedResponse.recommendations.blood 
                    : []
            }
        };

        return Response.json(formattedResponse);
    } catch (e: any) {
        console.error('Health score calculation error:', e);
        return Response.json(
            { 
                error: e.message || 'Failed to calculate health score',
                scores: {
                    body: 0,
                    vital: 0,
                    activity: 0,
                    sleep: 0,
                    nutrion: 0,
                    blood: 0,
                    overallScore: 0
                },
                recommendations: {
                    body: [],
                    vital: [],
                    activity: [],
                    sleep: [],
                    nutrion: [],
                    blood: []
                }
            },
            { status: e.status ?? 500 }
        );
    }
} 