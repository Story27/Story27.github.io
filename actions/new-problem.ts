"use server";

import { db } from "@/lib/db";
import { ProblemSchema, ProblemInput } from "@/schemas";
import { UserRole } from "@prisma/client";

export const addProblem = async (
  data: ProblemInput,
  userId: string,
  userRole: UserRole
) => {
  console.log("Received data:", data);
  const validatedFields = ProblemSchema.safeParse({ ...data, userId });

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error);
    return { error: "Invalid Fields!" };
  }

  const { title, difficulty, topics, description, testCases } =
    validatedFields.data;

  // Check user role
  if (userRole !== UserRole.ADMIN) {
    return { error: "Forbidden" };
  }

  try {
    // Create problem with basic details
    const createdProblem = await db.problem.create({
      data: {
        title,
        difficulty,
        topics,
        description,
        userId,
        testCases: {
          create: testCases.map((testCase) => ({
            input: testCase.input,
            output: testCase.output,
            isSampleTestCase: testCase.isSampleTestCase,
          })),
        },
      },
      include: {
        testCases: true,
      },
    });

    return { success: "Problem created successfully!" };
  } catch (error) {
    console.error("Error creating problem:", error);
    return { error: "Failed to create problem." };
  }
};
