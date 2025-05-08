"use server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getApprovalStatus } from "@/server/actions/getApprovalStatus";
export async function processReceipt(url: string) {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const isEmailApproved = session
    ? await getApprovalStatus(session.user.id)
    : false;

  if (!isEmailApproved || !session) {
    throw new Error(
      "You must be logged in and have your email approved to process receipts."
    );
  }

  try {
    const result = await generateObject({
      model: google("gemini-2.5-flash-preview-04-17"),
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
            If a certain item has more than one piece, please split it into multiple items.
            
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
