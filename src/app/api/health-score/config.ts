export const HEALTH_GROUPS = {
    body: {
        title: "Body Metrics",
        params: ["sex", "age", "weight", "height", "bmi", "bodyFatPercentage", "waistCircumference"],
        weight: 15
    },
    vital: {
        title: "Vital Signs",
        params: ["heartRate", "heartRateResting", "heartRateVariability", "bloodPressure", "respiratoryRate", "bodyTemperature", "oxygenSaturation"],
        weight: 25
    },
    activity: {
        title: "Activity",
        params: ["stepCount", "flightsClimbed", "activeEnergyBurned", "basalEnergyBurned", "distanceWalkingRunning", "distanceSwimming", "distanceCycling"],
        weight: 20
    },
    sleep: {
        title: "Sleep",
        params: ["sleep", "deepSleep"],
        weight: 15
    },
    nutrition: {
        title: "Nutrition",
        params: ["dietaryProtein", "dietaryFiber", "dietaryWater"],
        weight: 15
    },
    blood: {
        title: "Blood Markers",
        params: ["bloodGlucose", "insulinDelivery", "bloodAlcoholContent"],
        weight: 10
    }
} as const; 