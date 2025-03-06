import { HEALTH_GROUPS } from './config';

export const HEALTH_SCORE_TEMPLATE = `You are a medical AI assistant. 
Your task is to evaluate a user's health based on multiple parameter groups and provide a final Health Score 
(0-100, where 100 represents optimal health) along with recommendations for improvement.

### User health parameters
Body Metrics:
- Sex: {sex}
- Age: {age}
- Weight: {weight} kg
- Height: {height} cm
- BMI: {bmi}
- Body Fat: {bodyFatPercentage}%
- Waist: {waistCircumference} cm

Vital Signs:
- Heart Rate: {heartRate} bpm
- Resting Heart Rate: {heartRateResting} bpm
- Heart Rate Variability: {heartRateVariability}
- Blood Pressure: {bloodPressure.systolicValue}/{bloodPressure.diastolicValue} mmHg
- Respiratory Rate: {respiratoryRate} breaths/min
- Body Temperature: {bodyTemperature}°F
- Oxygen Saturation: {oxygenSaturation}%

Activity:
- Steps: {stepCount} steps
- Flights Climbed: {flightsClimbed}
- Active Energy: {activeEnergyBurned} calories
- Basal Energy: {basalEnergyBurned} calories
- Walking/Running: {distanceWalkingRunning} km
- Swimming: {distanceSwimming} km
- Cycling: {distanceCycling} km

Sleep:
- Total Sleep: {sleep}
- Deep Sleep: {deepSleep}

Nutrition:
- Protein: {dietaryProtein} g
- Fiber: {dietaryFiber} g
- Water: {dietaryWater} L

Blood Markers:
- Glucose: {bloodGlucose} mmol/L
- Insulin: {insulinDelivery} units
- Blood Alcohol: {bloodAlcoholContent}%

### Step 1: Evaluate Parameter Groups
Assess each group individually and assign a score from 0 to 100 based on medical knowledge.

### Step 2: Calculate the Overall Health Score
Use the following custom weights to calculate the final Health Score (0-100):
- Body Metrics: {bodyWeight}%
- Vital Signs: {vitalWeight}%
- Activity: {activityWeight}%
- Sleep: {sleepWeight}%
- Nutrition: {nutrionWeight}%
- Blood Markers: {bloodWeight}%

Calculate the weighted average of all scores using these percentages.

### Step 3: Provide Recommendations
For each group of parameters that scored less than 70, make specific, actionable recommendations for improvement,
 taking into account those parameters that had a greater impact on reducing this score.

Return the response in the following JSON format:
{{
    "scores": {{
        "body": number,
        "vital": number,
        "activity": number,
        "sleep": number,
        "nutrion": number,
        "blood": number,
        "overallScore": number
    }},
    "recommendations": {{
        "body": string[],
        "vital": string[],
        "activity": string[],
        "sleep": string[],
        "nutrion": string[],
        "blood": string[]
    }}
}}`; 