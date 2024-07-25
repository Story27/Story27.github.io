"use server";

import { db } from "@/lib/db";
import { ContestSchema } from "@/schemas";
import { UserRole } from "@prisma/client";
import * as z from "zod";

export async function addContest(
  data: z.infer<typeof ContestSchema>,
  userId: string,
  userRole: UserRole
) {
  console.log("Received data:", data);
  const validatedFields = ContestSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error);
    return { error: "Invalid Fields!" };
  }

  const { name, startTime, endTime, problemIds } = validatedFields.data;

  // Check user role
  if (userRole !== UserRole.ADMIN) {
    return { error: "Forbidden" };
  }

  try {
    const createdContest = await db.contest.create({
      data: {
        name,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        userId,
        problems: {
          connect: problemIds.map((id) => ({ id })),
        },
      },
    });

    return { success: "Contest created successfully!" };
  } catch (error) {
    console.error("Error creating contest:", error);
    return { error: "Failed to create contest." };
  }
}
