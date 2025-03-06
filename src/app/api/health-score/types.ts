export interface BloodPressure {
    systolicValue: number;
    diastolicValue: number;
}

export interface HealthData {
    // Body Metrics
    sex: string;
    age: number;
    weight: number; // kg
    height: number; // cm
    bmi: number;
    bodyFatPercentage: number;
    waistCircumference: number; // cm

    // Vital Signs
    heartRate: number; // bpm
    heartRateResting: number; // bpm
    heartRateVariability: number;
    bloodPressure: BloodPressure;
    respiratoryRate: number;
    bodyTemperature: number; // °F
    oxygenSaturation: number;

    // Activity
    stepCount: number;
    flightsClimbed: number;
    activeEnergyBurned: number; // calories
    basalEnergyBurned: number; // calories
    distanceWalkingRunning: number; // km
    distanceSwimming: number; // km
    distanceCycling: number; // km

    // Sleep
    sleep: string; // format: "Xh Ym"
    deepSleep: string; // format: "Xh Ym"

    // Nutrition
    dietaryProtein: number; // grams
    dietaryFiber: number; // grams
    dietaryWater: number; // liters

    // Blood Markers
    bloodGlucose: number;
    insulinDelivery: number;
    bloodAlcoholContent: number;
}

export interface HealthScoreResponse {
    scores: {
        body: number;
        vital: number;
        activity: number;
        sleep: number;
        nutrition: number;
        blood: number;
        overallScore: number;
    };
    recommendations: {
        body: string[];
        vital: string[];
        activity: string[];
        sleep: string[];
        nutrition: string[];
        blood: string[];
    };
} 