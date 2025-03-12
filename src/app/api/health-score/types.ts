// export type HealthMetric = {
//   [key: string]: number;
// };

// export const HEALTH_GROUPS = [
//   'Activity',
//   'Water',
//   'Sleep',
//   'Nutrition',
//   'Weight',
//   'Heart Health',
//   'Mental Health'
// ] as const;

// export type HealthGroup = (typeof HEALTH_GROUPS)[number];

// export const METRICS_BY_GROUP = {
//   // 'Base Metrics': ['Sex', 'Age', 'Weight', 'Height', 'BMI'],
//   'Activity': ['Active Energy Burned', 'Basal Energy Burned', 'Stand Hours', 
//               'Exercise Minutes', 'Step Count', 'Flights Climbed', 'Distance'],
//   'Water': ['Water'],
//   'Sleep': ['Sleep Analysis', 'Deep Sleep', 'REM Sleep', 'Core Sleep', 
//             'Sleep Awake', 'Sleep Latency', 'Sleep Quality'],
//   'Nutrition': ['Dietary Energy', 'Dietary Carbohydrates', 'Dietary Protein', 
//                'Dietary Fat', 'Dietary Fiber', 'Dietary Sugar', 'Dietary Sodium'],
//   'Weight': ['Height', 'Body Mass', 'Body Mass Index', 'Body Fat Percentage', 
//              'Lean Body Mass', 'Waist Circumference'],
//   'Heart Health': ['Heart Rate', 'Resting Heart Rate', 'Walking Heart Rate Average',
//                   'Heart Rate Variability', 'Blood Pressure Systolic', 
//                   'Blood Pressure Diastolic', 'Respiratory Rate', 
//                   'Blood Oxygen Saturation', 'Body Temperature'],
//   'Mental Health': ['Mindful Minutes', 'Mindful Session', 'Mood', 'Stress Levels',
//                    'Energy Levels', 'Social Interactions']
// } as const;
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
  ECGClassification: string;
  // Mental health metrics
  mindfulMinutes: number;
  mindfulSession: number;
  mood: number;
  stressLevels: number;
  energyLevels: number;
  socialInteractions: number;
}

// Helper function to convert metric names to camelCase
// const toCamelCase = (str: string): string => {
//   return str
//     .split(' ')
//     .map((word, index) => 
//       index === 0 
//         ? word.toLowerCase() 
//         : word.charAt(0).toUpperCase() + word.slice(1)
//     )
//     .join('');
// };

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
  ECGClassification: 'Normal',
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

// Updated mapping to include base health data fields
// export const METRIC_TO_CAMEL_CASE: Record<string, keyof HealthData> = {
//   'Sex': 'sex',
//   'Age': 'age',
//   'Height': 'height',
//   'Active Energy Burned': 'activeEnergyBurned',
//   'Basal Energy Burned': 'basalEnergyBurned',
//   'Stand Hours': 'standHours',
//   'Exercise Minutes': 'exerciseMinutes',
//   'Step Count': 'stepCount',
//   'Flights Climbed': 'flightsClimbed',
//   'Distance': 'distance',
//   'Water': 'water',
//   'Sleep Analysis': 'sleepAnalysis',
//   'Deep Sleep': 'deepSleep',
//   'REM Sleep': 'remSleep',
//   'Core Sleep': 'coreSleep',
//   'Sleep Awake': 'sleepAwake',
//   'Sleep Latency': 'sleepLatency',
//   'Sleep Quality': 'sleepQuality',
//   'Dietary Energy': 'dietaryEnergy',
//   'Dietary Carbohydrates': 'dietaryCarbohydrates',
//   'Dietary Protein': 'dietaryProtein',
//   'Dietary Fat': 'dietaryFat',
//   'Dietary Fiber': 'dietaryFiber',
//   'Dietary Sugar': 'dietarySugar',
//   'Dietary Sodium': 'dietarySodium',
//   'Body Mass': 'bodyMass',
//   'Body Mass Index': 'bodyMassIndex',
//   'Body Fat Percentage': 'bodyFatPercentage',
//   'Lean Body Mass': 'leanBodyMass',
//   'Waist Circumference': 'waistCircumference',
//   'Heart Rate': 'heartRate',
//   'Resting Heart Rate': 'restingHeartRate',
//   'Walking Heart Rate Average': 'walkingHeartRateAverage',
//   'Heart Rate Variability': 'heartRateVariability',
//   'Blood Pressure Systolic': 'bloodPressureSystolic',
//   'Blood Pressure Diastolic': 'bloodPressureDiastolic',
//   'Respiratory Rate': 'respiratoryRate',
//   'Blood Oxygen Saturation': 'bloodOxygenSaturation',
//   'Body Temperature': 'bodyTemperature',
//   'Mindful Minutes': 'mindfulMinutes',
//   'Mindful Session': 'mindfulSession',
//   'Mood': 'mood',
//   'Stress Levels': 'stressLevels',
//   'Energy Levels': 'energyLevels',
//   'Social Interactions': 'socialInteractions'
// };