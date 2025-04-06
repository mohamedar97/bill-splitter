"use server";

import { db } from "@/server/db";
import { usersProfile } from "@/server/db/schema";

/**
 * Server action to create a user profile
 * @param input - The user profile data including user ID
 * @returns The creation result with success status and message
 */
export async function createUserProfile(userId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Check if a profile already exists for this user
    const existingProfile = await db.query.usersProfile.findFirst({
      where: (profile, { eq }) => eq(profile.userId, userId),
    });

    if (existingProfile) {
      throw new Error("A profile for this user already exists");
    }

    // Insert user profile data into the database
    const [newProfile] = await db
      .insert(usersProfile)
      .values({
        userId,
      })
      .returning();

    if (!newProfile) {
      throw new Error("Failed to create user profile");
    }

    return {
      success: true,
      message: "User profile created successfully",
    };
  } catch (error) {
    console.error("Error during user profile creation:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Profile creation failed",
    };
  }
}
