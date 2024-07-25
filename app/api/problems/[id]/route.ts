import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const problem = await db.problem.findUnique({
      where: { id },
      include: {
        testCases: true,
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const body = await request.json();
    const { title, description, difficulty, topics, testCases } = body;

    const updatedProblem = await db.problem.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        topics,
        testCases: {
          deleteMany: {},
          create: testCases,
        },
      },
    });

    return NextResponse.json(updatedProblem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update problem" },
      { status: 500 }
    );
  }
}
