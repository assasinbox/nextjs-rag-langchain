export interface RequestBody {
  data: HealthData;
  weights: CategoryWeights;
  template?: string | null;
}

export interface CategoryWeights {
  activity: number;
  water: number;
  sleep: number;
  nutrition: number;
  weight: number;
  heartHealth: number;
  mentalHealth: number;
}

export interface BloodPressure {
    systolicValue: number;
    diastolicValue: number;
}

export interface BaseHealthData {
  sex: 'male' | 'female';
  age: number;
  height: number;
}

export interface HealthData extends BaseHealthData {
  // Activity metrics
  activeEnergyBurned: number;
  basalEnergyBurned: number;
  standHours: number;
  exerciseMinutes: number;
  stepCount: number;
  flightsClimbed: number;
  distance: number;
  walkingSpeed: number;
  walkingSteadiness: number;
  stairSpeedDown: number;
  stairSpeedUp: number;
  sixMinuteWalkTestDistance: number;
  // Water metrics
  water: number;
  // Sleep metrics
  sleepAnalysis: number;
  deepSleep: number;
  remSleep: number;
  coreSleep: number;
  sleepAwake: number;
  sleepLatency: number;
  sleepQuality: number;
  // Nutrition metrics  
  dietaryEnergy: number;
  dietaryCarbohydrates: number;
  dietaryProtein: number;
  dietaryFat: number;
  dietaryFiber: number;
  dietarySugar: number;
  dietarySodium: number;
  // Weight metrics
  bodyMass: number,
  bodyMassIndex: number,
  bodyFatPercentage: number;
  leanBodyMass: number;
  waistCircumference: number;
  // Heart health metrics
  heartRate: number;
  restingHeartRate: number;
  walkingHeartRateAverage: number;
  heartRateVariability: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  respiratoryRate: number;
  bloodOxygenSaturation: number;
  bodyTemperature: number;
  ECGOutput: number;
  ECGClassification: number;
  // Mental health metrics
  mindfulMinutes: number;
  mindfulSession: number;
  mood: number;
  stressLevels: number;
  energyLevels: number;
  socialInteractions: number;
}

// Default base health data
export const defaultBaseHealthData: BaseHealthData = {
  sex: 'male',
  age: 30,
  height: 170,
};

// Default health data including base data
export const defaultHealthData: HealthData = {
  // Base metrics
  ...defaultBaseHealthData,
  // Activity metrics
  activeEnergyBurned: 400,
  basalEnergyBurned: 1800,
  standHours: 12,
  exerciseMinutes: 30,
  stepCount: 8000,
  flightsClimbed: 10,
  distance: 6.5,
  walkingSpeed: 1.2,
  walkingSteadiness: 95,
  stairSpeedDown: 0.5,
  stairSpeedUp: 0.4,
  sixMinuteWalkTestDistance: 400,
  // Water metrics
  water: 2000,
  // Sleep metrics
  sleepAnalysis: 7.5,
  deepSleep: 1.5,
  remSleep: 2,
  coreSleep: 4,
  sleepAwake: 0.5,
  sleepLatency: 15,
  sleepQuality: 85,
  // Nutrition metrics
  dietaryEnergy: 2200,
  dietaryCarbohydrates: 250,
  dietaryProtein: 80,
  dietaryFat: 70,
  dietaryFiber: 25,
  dietarySugar: 40,
  dietarySodium: 2300,
  // Weight metrics
  bodyMass: 70,
  bodyMassIndex: 24.2,
  bodyFatPercentage: 20,
  leanBodyMass: 56,
  waistCircumference: 80,
  // Heart health metrics
  heartRate: 70,
  restingHeartRate: 60,
  walkingHeartRateAverage: 100,
  heartRateVariability: 50,
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  respiratoryRate: 16,
  bloodOxygenSaturation: 98,
  bodyTemperature: 36.6,
  ECGOutput: 0,
  ECGClassification: 1,
  // Mental health metrics
  mindfulMinutes: 15,
  mindfulSession: 1,
  mood: 8,
  stressLevels: 3,
  energyLevels: 7,
  socialInteractions: 5
};

export interface HealthScoreResponse {
  scores: {
      activity: number;
      water: number;
      sleep: number;
      nutrition: number;
      weight: number;
      heartHealth: number;
      mentalHealth: number;
      overallScore: number;
  };
  recommendations: {
      activity: string[];
      water: string[];
      sleep: string[];
      nutrition: string[];
      weight: string[];
      heartHealth: string[];
      mentalHealth: string[];
  };
} 

export const HEALTH_GROUPS = {
  activity: {
    title: 'Activity',
    metrics: ['activeEnergyBurned', 'basalEnergyBurned', 'standHours', 'exerciseMinutes', 'stepCount', 'flightsClimbed', 'distance', 'walkingSpeed', 'walkingSteadiness', 'stairSpeedDown', 'stairSpeedUp', 'sixMinuteWalkTestDistance'],
    weight: 20
  },
  water: {
    title: 'Water',
    metrics: ['water'],
    weight: 15
  },
  sleep: {
    title: 'Sleep',
    metrics: ['sleepAnalysis', 'deepSleep', 'remSleep', 'coreSleep', 'sleepAwake', 'sleepLatency', 'sleepQuality'],
    weight: 15
  },
  nutrition: {
    title: 'Nutrition',
    metrics: ['dietaryEnergy', 'dietaryCarbohydrates', 'dietaryProtein', 'dietaryFat', 'dietaryFiber', 'dietarySugar', 'dietarySodium'],
    weight: 15
  },
  weight: {
    title: 'Weight',
    metrics: ['bodyMass', 'bodyMassIndex', 'bodyFatPercentage', 'leanBodyMass', 'waistCircumference'],
    weight: 15
  },
  heartHealth: {
    title: 'Heart Health',
    metrics: ['heartRate', 'restingHeartRate', 'walkingHeartRateAverage', 'heartRateVariability', 'bloodPressureSystolic', 'bloodPressureDiastolic', 'respiratoryRate', 'bloodOxygenSaturation', 'bodyTemperature', 'ECGOutput', 'ECGClassification'],
    weight: 10
  },
  mentalHealth: {
    title: 'Mental Health',
    metrics: ['mindfulMinutes', 'mindfulSession', 'mood', 'stressLevels', 'energyLevels', 'socialInteractions'],
    weight: 10  
  }
 } as const;
