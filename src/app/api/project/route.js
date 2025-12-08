import { database } from "@/lib/mongoose";
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