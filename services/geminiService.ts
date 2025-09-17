
import { GoogleGenAI, Modality } from "@google/genai";
import { IMAGE_GENERATION_PROMPT } from '../constants';
import type { GeneratedImageResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateImageWithPrompt = async (
  imageFiles: File[],
  prompt?: string
): Promise<GeneratedImageResult> => {
  try {
    if (imageFiles.length === 0) {
      throw new Error("At least one image file is required.");
    }

    const imageParts = await Promise.all(
      imageFiles.map(async (file) => {
        const base64ImageData = await fileToBase64(file);
        return {
          inlineData: {
            data: base64ImageData,
            mimeType: file.type,
          },
        };
      })
    );
    
    const finalPrompt = prompt && prompt.trim() !== '' ? prompt : IMAGE_GENERATION_PROMPT;
    const textPart = { text: finalPrompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [...imageParts, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    // Handle cases where the response might be blocked.
    if (!response.candidates || response.candidates.length === 0) {
        throw new Error("Request blocked: The API response was empty, likely due to safety settings. Please adjust your prompt or image.");
    }
    
    const candidate = response.candidates[0];
    let imageUrl = '';
    let text = '';

    // If candidate content is missing, it might be blocked or just a text response.
    if (!candidate.content || !candidate.content.parts) {
        const responseText = response.text;
        if (responseText) {
            return { imageUrl: '', text: responseText };
        }
        throw new Error("Request blocked: The API response did not contain any content, likely due to safety settings.");
    }

    const parts = candidate.content.parts;
    for (const part of parts) {
      if (part.text) {
        text += part.text;
      } else if (part.inlineData) {
        const base64ImageBytes = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    if (!imageUrl && !text) {
        throw new Error("The API returned an empty result. Please try again.");
    }
    
    return { imageUrl, text };

  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};


export const generateImageFromText = async (
  prompt: string
): Promise<GeneratedImageResult> => {
  try {
    if (!prompt || prompt.trim() === '') {
      throw new Error("Prompt cannot be empty for text-to-image generation.");
    }

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Request blocked: The API did not return an image, likely due to safety settings. Please adjust your prompt.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

    return { imageUrl, text: '' }; 
  } catch (error) {
    console.error("Error generating image from text:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};
