import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const contest = await db.contest.findUnique({
      where: { id },
      include: {
        problems: true,
      },
    });

    if (!contest) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    return NextResponse.json(contest);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contest" },
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
    const { name, startTime, endTime } = body;

    const updatedContest = await db.contest.update({
      where: { id },
      data: {
        name,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        // Add other fields as necessary
      },
    });

    return NextResponse.json(updatedContest);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update contest" },
      { status: 500 }
    );
  }
}
