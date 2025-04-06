"use server";

import { db } from "@/server/db";
import { usersProfile } from "@/server/db/schema";

/**
 * Get the approval status of a user's profile
 * @param userId - The ID of the user to check
 * @returns Object containing success, approval status, and message
 */
export async function getApprovalStatus(userId: string): Promise<boolean> {
  try {
    // Check if a profile exists for this user
    const profile = await db.query.usersProfile.findFirst({
      where: (profile, { eq }) => eq(profile.userId, userId),
    });

    if (!profile) {
      return false;
    }

    return profile.profileApproved;
  } catch (error) {
    console.error("Error checking approval status:", error);

    return false;
  }
}
