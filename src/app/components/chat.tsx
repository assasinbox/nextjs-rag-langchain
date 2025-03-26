'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChat } from "ai/react"
import { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Expandable } from "@/components/ui/Expandable"

interface HealthData {
    Name: string;
    Sex: string;
    Age: number;
    Summary: string;
    ActiveEnergyBurned: string;
    AppleExerciseTime: string;
    AppleStandTime: string;
    AppleWalkingSteadiness: string;
    BasalEnergyBurned: string;
    BloodPressureDiastolic: string;
    BloodPressureSystolic: string;
    BodyFatPercentage: string;
    BodyMass: string;
    BodyMassIndex: string;
    BodyTemperature: string;
    DietaryCarbohydrates: string;
    DietaryEnergyConsumed: string;
    DietaryFatTotal: string;
    DietaryFiber: string;
    DietaryProtein: string;
    DietarySodium: string;
    DietarySugar: string;
    DietaryWater: string;
    DistanceCycling: string;
    DistanceSwimming: string;
    DistanceWalkingRunning: string;
    FlightsClimbed: string;
    HeartRate: string;
    HeartRateVariabilitySDNN: string;
    Height: string;
    LeanBodyMass: string;
    MindfulSession: string;
    MoodChanges: string;
    OxygenSaturation: string;
    RespiratoryRate: string;
    RestingHeartRate: string;
    SixMinuteWalkTestDistance: string;
    SleepAnalysis: string;
    SleepChanges: string;
    StairAscentSpeed: any;
    StairDescentSpeed: string;
    StepCount: string;
    WaistCircumference: string;
    WalkingHeartRateAverage: string;
    WalkingSpeed: string;
}

const defaultHealthData: HealthData = {
    Name: "Oleksandr Nechaiev",
    Sex: "Male",
    Age: 39,
    Summary: "The overall health score for the individual is below optimal levels, indicating areas that require attention for improvement.",
    ActiveEnergyBurned: "1000 cal",
    AppleExerciseTime: "10 min",
    AppleStandTime: "10 min",
    AppleWalkingSteadiness: "10",
    BasalEnergyBurned: "1000 cal",
    BloodPressureDiastolic: "130",
    BloodPressureSystolic: "165",
    BodyFatPercentage: "30%",
    BodyMass: "110 kg",
    BodyMassIndex: "38",
    BodyTemperature: "36.5°C",
    DietaryCarbohydrates: "100 g",
    DietaryEnergyConsumed: "2000 cal",
    DietaryFatTotal: "50 g",
    DietaryFiber: "10 g",
    DietaryProtein: "50 g",
    DietarySodium: "1000 mg",
    DietarySugar: "50 g",
    DietaryWater: "1000 ml",
    DistanceCycling: "1 km",
    DistanceSwimming: "1 km",
    DistanceWalkingRunning: "1 km",
    FlightsClimbed: "2",
    HeartRate: "75 bpm",
    HeartRateVariabilitySDNN: "50",
    Height: "175 cm",
    LeanBodyMass: "60 kg",
    MindfulSession: "10",
    MoodChanges: "10",
    OxygenSaturation: "93%",
    RespiratoryRate: "12",
    RestingHeartRate: "60 bpm",
    SixMinuteWalkTestDistance: "10 m",
    SleepAnalysis: "8 h",
    SleepChanges: "10",
    StairAscentSpeed: {},
    StairDescentSpeed: "10",
    StepCount: "10",
    WaistCircumference: "10",
    WalkingHeartRateAverage: "10",
    WalkingSpeed: "10"
};

export function Chat() {
    const [healthData, setHealthData] = useState<HealthData>(defaultHealthData);
    const [isEditing, setIsEditing] = useState(true);

    const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit } = useChat({
        api: 'api/ex4',
        onError: (e) => {
            console.log(e)
        }
    })
    const chatParent = useRef<HTMLUListElement>(null)

    useEffect(() => {
        const domNode = chatParent.current
        if (domNode) {
            domNode.scrollTop = domNode.scrollHeight
        }
    })

    const handleHealthDataChange = (field: keyof HealthData, value: string) => {
        setHealthData({ ...healthData, [field]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Create a message that includes both the user's input and health data
        const messageWithHealthData = {
            content: input,
            healthData: JSON.stringify(healthData)
        };

        // Call the original handleSubmit with the modified message
        await originalHandleSubmit(e, { data: messageWithHealthData });
    };

    return (
        <main className="flex flex-col w-full h-screen max-h-dvh bg-background">
            <header className="p-4 border-b w-full max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold">Health Assistant</h1>
            </header>

            <section className="p-4">
                <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto items-center">
                    <Input className="flex-1 min-h-[40px]" placeholder="Type your question here..." type="text" value={input} onChange={handleInputChange} />
                    <Button className="ml-2" type="submit">
                        Submit
                    </Button>
                </form>
            </section>

            <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl">
                <ul ref={chatParent} className="h-1 p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4">
                    {messages.map((m, index) => (
                        <div key={index}>
                            {m.role === 'user' ? (
                                <li key={m.id} className="flex flex-row">
                                    <div className="rounded-xl p-4 bg-background shadow-md flex">
                                        <p className="text-primary">{m.content}</p>
                                    </div>
                                </li>
                            ) : (
                                <li key={m.id} className="flex flex-row-reverse">
                                    <div className="rounded-xl p-4 bg-background shadow-md flex w-3/4">
                                        <p className="text-primary">{m.content}</p>
                                    </div>
                                </li>
                            )}
                        </div>
                    ))}
                </ul>
            </section>

            
            <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl">
            <Card className="mb-4">
                
            <Expandable title="Health Data" defaultExpanded={false} >

                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(healthData).map(([key, value]) => (
                            <div key={key} className="space-y-2">
                                <Label htmlFor={key}>{key}</Label>
                                {isEditing ? (
                                    <Input
                                        id={key}
                                        value={typeof value === 'object' ? JSON.stringify(value) : value as string}
                                        onChange={(e) => handleHealthDataChange(key as keyof HealthData, e.target.value)}
                                    />
                                ) : (
                                    <div className="text-sm">
                                        {typeof value === 'object' ? JSON.stringify(value) : value as string}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    </CardContent>
                    <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                    </CardTitle>
                </CardHeader>
                </Expandable>
            </Card>
            </section>
        </main>
    )
}
