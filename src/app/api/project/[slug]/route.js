import { database } from "@/lib/mongoose";
import Project from "@/models/project";
import { NextResponse } from "next/server";




export async function GET(req, { params }) {
    try {
        await database()

        const tempSlug = await params
        const slug = tempSlug.slug

        if (!slug) {
            return NextResponse.json({
                success: false,
                message: 'Slug not found'
            }, { status: 400 })
        }

        const project = await Project.findOne({ slug })

        if (!project) {
            return NextResponse.json({
                success: false,
                message: "Project data not found"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: "Successfully fetched project data",
            payload: project
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to fecth project data",
            error: error.message
        }, { status: 500 })

    }

}