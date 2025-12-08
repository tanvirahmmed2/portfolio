import { database } from "@/lib/mongoose";
import Project from "@/models/project";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        await database()
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to add project",
            error: error.message
        }, {status: 500})
        
    }
    
}

export async function GET() {
    try {
        await database()

        const projects=await Project.find({}).sort({createdAt: -1})

        if(!projects || projects=== null){
            return NextResponse.json({
                success: false,
                message: "No project data found"
            }, {status: 400})
        }

        return NextResponse.json({
            success: true,
            messgae: 'Successfully fetched project data',
            payload: projects
        }, {status: 200})
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to add project",
            error: error.message
        }, {status: 500})
    }
    
}