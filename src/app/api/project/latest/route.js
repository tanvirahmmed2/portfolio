import { database } from "@/lib/mongoose";
import Project from "@/models/project";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await database();

    const projects = await Project
      .find({})
      .sort({ createdAt: -1 })
      .limit(4);

    if (projects.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No project found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully fetched data",
        payload: projects,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
