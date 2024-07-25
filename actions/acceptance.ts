"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const updateAcceptances = async (problemId: string) => {
  const user = await currentUser();

  if (!user?.email) {
    return { error: "User not authenticated" };
  }

  try {
    const problem = await db.problem.findUnique({
      where: { id: problemId },
      select: { acceptances: true },
    });

    if (!problem) {
      return { error: "Problem not found" };
    }

    if (!problem.acceptances.includes(user.email)) {
      await db.problem.update({
        where: { id: problemId },
        data: {
          acceptances: {
            push: user.email,
          },
        },
      });
    }

    return { success: "Acceptance recorded" };
  } catch (error) {
    console.error("Error updating acceptances:", error);
    return { error: "Failed to update acceptances" };
  }
};
