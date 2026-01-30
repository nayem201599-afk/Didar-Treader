
import { GoogleGenAI, Type } from "@google/genai";
import { SignalResponse } from "../types";

const MODEL_NAME = "gemini-3-flash-preview";

/**
 * Validates the API key format on the client side.
 */
export const validateApiKey = (key: string | undefined): { valid: boolean; reason?: 'MISSING' | 'INVALID_FORMAT' } => {
  if (!key || key === "undefined" || key.trim() === "") {
    return { valid: false, reason: 'MISSING' };
  }
  // Gemini API keys typically start with 'AIzaSy' and are substantial in length
  if (!key.startsWith("AIzaSy") || key.length < 30) {
    return { valid: false, reason: 'INVALID_FORMAT' };
  }
  return { valid: true };
};

/**
 * Initialize a fresh GoogleGenAI instance using the current environment variable.
 */
const getAI = () => {
  const validation = validateApiKey(process.env.API_KEY);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY! });
};

/**
 * Simple chat interaction with AI for the chat assistant
 */
export const chatWithAI = async (message: string): Promise<string> => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: 'আপনি একজন বিশেষজ্ঞ বাইনারি অপশন এবং ফরেক্স ট্রেডার (Didar Trader AI)। ব্যবহারকারীকে ট্রেডিং সংক্রান্ত সাহায্য করুন এবং বাংলায় উত্তর দিন।',
      },
    });
    const response = await chat.sendMessage({ message });
    return response.text || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";
  } catch (error: any) {
    console.error("Chat Error:", error);
    if (error.message === 'MISSING' || error.message === 'INVALID_FORMAT') throw error;
    throw new Error("চ্যাট সার্ভারে সমস্যা হচ্ছে। অনুগ্রহ করে API Key চেক করুন।");
  }
};

export const generateSignal = async (market: string, marketType: 'OTC' | 'Real', timeframe: string): Promise<SignalResponse> => {
  try {
    const ai = getAI();
    
    const prompt = `আপনি একজন বিশেষজ্ঞ বাইনারি অপশন এবং ফরেক্স ট্রেডার (Didar Trader AI)।
    মার্কেট: ${market} (${marketType}), টাইমফ্রেম: ${timeframe}।
    
    টাস্ক:
    ১. গুগল সার্চ ব্যবহার করে এই পেয়ারের বর্তমান লাইভ ট্রেন্ড এবং ইকোনমিক নিউজ চেক করুন।
    ২. একটি উচ্চ সম্ভাবনার সিগন্যাল জেনারেট করুন।
    ৩. কেন এই সিগন্যাল দেওয়া হয়েছে তার জন্য ৩-৪টি শক্তিশালী টেকনিক্যাল পয়েন্ট (RSI, Bollinger Bands, Support/Resistance ভিত্তিক) দিন।
    ৪. পুরো বিশ্লেষণটি বাংলায় (Bengali) প্রদান করুন।
    
    JSON আউটপুট ফরম্যাট নিশ্চিত করুন যা নিচের স্কিমা মেনে চলে।`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            market: { type: Type.STRING },
            marketType: { type: Type.STRING, enum: ['OTC', 'Real'] },
            timeframe: { type: Type.STRING },
            signal: { type: Type.STRING },
            entry: { type: Type.STRING },
            confidence: { type: Type.STRING },
            algorithmDescription: { type: Type.STRING },
            strategyExplanation: { type: Type.STRING },
            technicalPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }
            },
          },
          required: ["market", "marketType", "timeframe", "signal", "entry", "confidence", "algorithmDescription", "strategyExplanation", "technicalPoints"],
        },
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());

    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) sources.push({ uri: chunk.web.uri, title: chunk.web.title });
      });
    }

    return { ...result, sources };
  } catch (error: any) {
    console.error("Signal Error:", error);
    if (error.message === 'MISSING' || error.message === 'INVALID_FORMAT') throw error;
    if (error.status === 404 || error.message?.includes("entity was not found")) {
      throw new Error("API Key টি সঠিক নয় বা খুঁজে পাওয়া যায়নি। 'Setup Key' বাটন থেকে পুনরায় সেট করুন।");
    }
    throw new Error(error.message || "সিগন্যাল জেনারেট করতে সমস্যা হচ্ছে।");
  }
};

export const getGlobalMarketOverview = async (): Promise<{ text: string; sources: { uri: string; title: string }[] }> => {
  try {
    const ai = getAI();
    const prompt = `আপনি একজন গ্লোবাল মার্কেট অ্যানালিস্ট। বর্তমানে বৈশ্বিক ট্রেডিং মার্কেটের (Forex, Crypto, Commodities) গভীর বিশ্লেষণ করুন। 
    ১. প্রধান কারেন্সি পেয়ারের মুভমেন্ট।
    ২. কোনো বড় ইকোনমিক ইভেন্ট বা নিউজ।
    ৩. পরবর্তী ১-২ ঘণ্টার জন্য মার্কেটের সম্ভাব্য দিকনির্দেশনা।
    ৪. গুরুত্বপূর্ণ সাপোর্ট ও রেজিস্ট্যান্স জোন।
    
    সবকিছু প্রফেশনাল বাংলায় (Bengali) এবং পয়েন্ট আকারে দিন। উত্তরটি এমনভাবে দিন যাতে মনে হয় এটি সরাসরি সার্ভার থেকে আসা রিয়েল-টিওম ইন্টেলিজেন্স।`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) sources.push({ uri: chunk.web.uri, title: chunk.web.title });
      });
    }

    return { text: response.text || "ডেটা পাওয়া যায়নি।", sources };
  } catch (error: any) {
    if (error.message === 'MISSING' || error.message === 'INVALID_FORMAT') throw error;
    return { text: "মার্কেট ডেটা লোড করতে সমস্যা হচ্ছে। আপনার API Key টি সঠিক কিনা যাচাই করুন।", sources: [] };
  }
};
