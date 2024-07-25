import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const problems = await db.problem.findMany({
      include: {
        testCases: true,
      },
    });

    if (!problems || problems.length === 0) {
      return NextResponse.json({ error: "No problems found" }, { status: 404 });
    }

    return NextResponse.json(problems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch problems" },
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
