
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    briefSummary: {
      type: Type.STRING,
      description: 'A clinical yet humanized summary of the patient narrative.'
    },
    extractedSymptoms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Medical symptoms identified from user input.'
    },
    possibleCauses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Potential conditions for clinical context only.'
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Urgent warning signs or complications.'
    },
    riskScore: {
      type: Type.INTEGER,
      description: 'Risk level 0-100.'
    },
    urgency: {
      type: Type.STRING,
      description: 'Low, Medium, High, or Emergency.'
    }
  },
  required: ['briefSummary', 'extractedSymptoms', 'possibleCauses', 'redFlags', 'riskScore', 'urgency']
};

export async function analyzeSymptoms(symptoms: string): Promise<AIAnalysis> {
  try {
    // Using gemini-3-pro-preview for complex clinical reasoning and safety analysis.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this patient's symptoms and provide a structured clinical intake report. 
      Focus on being both clinically accurate and empathetic.
      Patient Input: ${symptoms}`,
      config: {
        systemInstruction: `You are Clinexa, an advanced clinical intake intelligence. 
        Your goal is to parse raw patient symptoms into professional clinical summaries for doctors.
        1. Humanize the summary: Describe how the patient is feeling, not just symptoms.
        2. Be clinical: Use professional terminology where appropriate for the extracted lists.
        3. Safety first: Always identify red flags that might indicate life-threatening conditions.
        4. Triage: Assign a risk score and urgency level based on standard clinical guidelines.`,
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    // Safely extract the generated text from the response object.
    const text = response.text;
    if (!text) {
      throw new Error("No response received from the clinical engine.");
    }

    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Unable to synthesize clinical data. Please check your input and try again.");
  }
}
