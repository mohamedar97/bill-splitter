"use server";
import { put } from "@vercel/blob";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function processReceipt(url: string) {
  try {
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        items: z.array(
          z.object({
            name: z.string(),
            price: z.number(),
          })
        ),
      }),
      system: `You are an expert at extracting information from receipts.
            
            I have a receipt image that I need to extract items and prices from.
            
            Please analyze the receipt and extract all items with their prices.
            Format your response as a JSON array of objects with 'name' and 'price' properties.
            
            For example:
            [
              { "name": "Burger", "price": 12.99 },
              { "name": "Fries", "price": 4.99 }
            ]
            
            Only include the JSON array in your response, nothing else.`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract items and prices from the receipt.",
            },
            {
              type: "image",
              image: url,
            },
          ],
        },
      ],
    });
    if (!result.object?.items || !Array.isArray(result.object.items)) {
      throw new Error("Failed to extract items from receipt");
    }
    return {
      success: true,
      extractedItems: result.object.items,
    };
  } catch (error) {
    console.error("Unexpected error in processReceipt:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
