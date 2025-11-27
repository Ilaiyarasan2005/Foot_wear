// services/geminiService.ts
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

/**
 * Initializes the Gemini API client.
 * NOTE: The API key is assumed to be available via process.env.API_KEY.
 * No UI for API key input is provided or required by this service.
 */
const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API key is not set. Description generation will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const geminiService = {
  /**
   * Generates a product description using the Gemini API.
   * @param productData - Partial product data (title, price, sizes) to inform the description.
   * @returns A promise that resolves to the generated description string, or null if an error occurs.
   */
  generateProductDescription: async (productData: Pick<Product, 'title' | 'price' | 'availableSizes'>): Promise<string | null> => {
    const ai = getGeminiClient();
    if (!ai) {
      return "Gemini API key missing. Please configure process.env.API_KEY to enable AI description generation.";
    }

    const prompt = `Write a compelling and concise product description for a footwear item with the following details:
    Title: ${productData.title}
    Price: $${productData.price.toFixed(2)}
    Available Sizes: ${productData.availableSizes.join(', ')}

    Focus on comfort, style, and potential use cases. Keep it under 80 words.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Using gemini-2.5-flash for basic text generation
        contents: prompt, // Correctly passing the prompt string
        config: {
          temperature: 0.7,
          maxOutputTokens: 100, // Limit output to help keep it concise
        },
      });

      const description = response.text;
      if (description) {
        return description.trim();
      } else {
        console.warn("Gemini API returned an empty description.");
        return "Could not generate description. Please try again or enter manually.";
      }
    } catch (error) {
      console.error("Error generating product description with Gemini API:", error);
      // Check for common API errors and provide user-friendly messages
      if (error instanceof Error) {
        if (error.message.includes("403") || error.message.includes("API key")) {
          return "Authentication error with Gemini API. Please ensure your API key is valid and has access.";
        }
        if (error.message.includes("429")) {
          return "Rate limit exceeded for Gemini API. Please wait a moment and try again.";
        }
      }
      return "Failed to generate description. An unexpected error occurred.";
    }
  },
};