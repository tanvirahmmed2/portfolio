import { database } from "@/lib/mongoose";
import Project from "@/models/project";
import { NextResponse } from "next/server";
import slugify from "slugify";


export async function POST(req) {
    try {
        await database()

        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get('description')
        const tags = formData.get('tags')
        const category = formData.get('category')
        const siteLink = formData.get('siteLink')
        const repository = formData.get('repository')
        const skills = formData.get('skills')
        const imageFile = formData.get('image')


        if (!title || !description || !tags || !category || !siteLink || !repository || !skills) {
            return NextResponse.json({
                success: false,
                message: "Please fill all inputs"
            }, { status: 400 })
        }

        if (!imageFile) {
            return NextResponse.json({
                success: false,
                message: "Please upload image"
            }, { status: 400 })
        }

        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "portfolio" },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(imageBuffer);
        });

        const slug = slugify(title)

        const existProject = await Project.findOne({ slug })
        if (existProject) {
            return NextResponse.json({
                success: false,
                message: "Please use another title"
            }, { status: 400 })
        }





    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to add project",
            error: error.message
        }, { status: 500 })

    }

}

export async function GET() {
    try {
        await database()

        const projects = await Project.find({}).sort({ createdAt: -1 })

        if (!projects || projects === null) {
            return NextResponse.json({
                success: false,
                message: "No project data found"
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            messgae: 'Successfully fetched project data',
            payload: projects
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to add project",
            error: error.message
        }, { status: 500 })
    }

}