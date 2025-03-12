import {
    Message as VercelChatMessage,
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';

export const dynamic = 'force-dynamic'

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

const userData = {
    age: 77,
    sex: 'male',
    weight: 85,
    height: 158,
    bmi: 30,
    blood_pressure: '120/80',
    heart_rate: 90,
    daily_steps: 500,
    activity: 30,
    deepSlep: 80,
    sleep: 7,
    diet_type: 'average',
    water_intake: 800,
    calories: 2000,
    total_cholesterol: 185,
    ldl_cholesterol: 93  ,
    fasting_glucose: 87,
    hba1c: 5,
};


const TEMPLATE = `Based on the following user data, calculate their Health Score (from 0 to 100), where 100 represents optimal health:

- Age: ${userData.age}
- Sex: ${userData.sex}
- Weight: ${userData.weight} kg
- Height: ${userData.height} cm
- BMI: ${userData.bmi}

- Resting heart rate: ${userData.heart_rate} bpm
- Blood pressuree: ${userData.blood_pressure} mmHg

- Daily steps: ${userData.daily_steps}
- Activity: ${userData.activity} min

- Sleep duration: ${userData.sleep} hours
- Deep Sleep: ${userData.deepSlep} min

- Diet type: ${userData.diet_type}
- water_intake : ${userData.water_intake} ml
- calories : ${userData.calories} kcal

- Cholesterol : ${userData.total_cholesterol} mg/dl
- LDL : ${userData.ldl_cholesterol} mg/dl
- Glucose : ${userData.fasting_glucose} mg/dl
- Hba1c : ${userData.hba1c} %

- Body metrics (Sex, Age, Weight, Height, BMI)
- Vital signs (Blood pressuree, Resting heart rate)
- Activity (Daily steps, Activity)
- Sleep (Sleep duration, Deep Sleep)
- Nutritional intake and hyndration (Diet type, water_intake, calories)
- Blood marker result (Cholesterol, LDL, Glucose, Hba1c)

Consider the following factors:
- Lack of sleep (less than 6 hours) decreases the Health Score.
- High stress levels (above 7) negatively impact the score.
- Optimal resting heart rate is between 50-70 bpm.

Return only the numerical value without any explanations.`;

const TEMPLATE_1 = `You are a medical AI assistant. Your task is to evaluate a user's health based on multiple parameter groups and provide a final Health Score (0-100, where 100 represents optimal health).  

### User health parameters
- Age: ${userData.age}
- Sex: ${userData.sex}
- Weight: ${userData.weight} kg
- Height: ${userData.height} cm
- BMI: ${userData.bmi}

- Resting heart rate: ${userData.heart_rate} bpm
- Blood pressuree: ${userData.blood_pressure} mmHg

- Daily steps: ${userData.daily_steps}
- Activity: ${userData.activity} min

- Sleep duration: ${userData.sleep} hours
- Deep Sleep: ${userData.deepSlep} min

- Diet type: ${userData.diet_type}
- water_intake : ${userData.water_intake} ml
- calories : ${userData.calories} kcal

- Cholesterol : ${userData.total_cholesterol} mg/dl
- LDL : ${userData.ldl_cholesterol} mg/dl
- Glucose : ${userData.fasting_glucose} mg/dl
- Hba1c : ${userData.hba1c} %

### Step 1: Evaluate Parameter Groups  
Assess each group individually and assign a score from 0 to 100 based on medical knowledge:  

1. **Body Metrics** (Sex, Age, Weight, Height, BMI)  
2. **Vital Signs** (Blood pressure, Resting heart rate)  
3. **Activity** (Daily steps, Activity minutes)  
4. **Sleep** (Sleep duration, Deep Sleep)  
5. **Nutrition & Hydration** (Diet type, Water intake, Calories)  
6. **Blood Markers** (Cholesterol, LDL, Glucose, HbA1c)  

Each group should be scored according to evidence-based medical standards.  

### Step 2: Calculate the Overall Health Score  
Combine the individual group scores into a final **Health Score (0-100)** using weighted contributions:  

- **Body Metrics:** 15%  
- **Vital Signs:** 20%  
- **Activity:** 15%  
- **Sleep:** 15%  
- **Nutrition & Hydration:** 15%  
- **Blood Markers:** 20%  

### Step 3: Output Format  
Return only the scores in JSON format without explanations:  

json
{
  "Body Metrics":  **Body Metrics:** ,
  "Vital Signs": **Vital Signs:**,
  "Activity": **Activity:**,
  "Sleep": **Sleep:**,
  "Nutrition & Hydration": **Nutrition & Hydration:**,
  "Blood Markers":  **Blood Markers:** ,
  "Health Score": Calculate FINAL SCORE
}`;
// Return only the numerical value without any explanations.

export async function POST(req: Request) {
    try {
        // Extract the `messages` from the body of the request
        const { messages } = await req.json();

        const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

        const currentMessageContent = messages.at(-1).content;

        const prompt = PromptTemplate.fromTemplate(TEMPLATE_1);

        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
            model: 'gpt-3.5-turbo',
            temperature: 0.5,
            verbose: true,
        });

        /**
       * Chat models stream message chunks rather than bytes, so this
       * output parser handles serialization and encoding.
       */
        const parser = new HttpResponseOutputParser();

        const chain = prompt.pipe(model).pipe(parser);

        // Convert the response into a friendly text-stream
        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join('\n'),
            input: currentMessageContent,
        });

        // Respond with the stream
        return new StreamingTextResponse(
            stream.pipeThrough(createStreamDataTransformer()),
        );
    } catch (e: any) {
        console.log(e);
        return Response.json({ error: e.message }, { status: e.status ?? 500 });
    }
}