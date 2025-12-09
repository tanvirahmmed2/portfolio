import cloudinary from "@/lib/cloudinary";
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



        const slug = slugify(title)

        const existProject = await Project.findOne({ slug })
        if (existProject) {
            return NextResponse.json({
                success: false,
                message: "Please use another title"
            }, { status: 400 })
        }

        const tagsArr = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        const skillsArr = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)

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

        const newProject = new Project({
            title, description, slug, category, repository, siteLink, image: cloudImage.secure_url, imageId: cloudImage.public_id, tags: tagsArr, skills: skillsArr
        })

        await newProject.save()

        return NextResponse.json({
            success: true,
            message: ' Successfully submitted project'
        })


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
            message: 'Successfully fetched project data',
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


export async function DELETE(req) {
    try {
        await database()

        const { id } = await req.json()
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "Project id not recieved"
            }, { status: 400 })
        }

        const project = await Project.findById(id)

        if (!project) {
            return NextResponse.json({
                success: false,
                message: "Project not found"
            }, { status: 400 })
        }

        await cloudinary.uploader.destroy(project.imageId)

        await Project.findByIdAndDelete(id)

        return NextResponse.json({
            success: true,
            message: "successfully deleted project data"
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to delete project',
            error: error.message
        }, { status: 500 })

    }

}

export async function PUT(req) {
    try {
        await database()

        const { id, title, description, siteLink, repository, tags, skills, category } = await req.json()

        const project = await Project.findById(id)

        if (!project) {
            return NextResponse.json({
                success: false,
                message: 'Project not found'
            }, { status: 400 })
        }

        if (skills !== undefined && skills !== null) {
            const skillArr = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
            project.skills = skillArr

        }

        if (tags !== undefined && tags !== null) {
            const tagArr = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            project.tags = tagArr
        }

        const slug = slugify(title)

        project.slug = slug
        project.title = title,
        project.category = category
        project.description = description
        project.siteLink = siteLink
        project.repository = repository

        await project.save()

        return NextResponse.json({
            success: true,
            message: 'Successfully updated project'
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to update project',
            error: error.message
        }, { status: 500 })
    }

}