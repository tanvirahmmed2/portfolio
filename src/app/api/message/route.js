
import { database } from "@/lib/mongoose";
import { Message } from "@/models/message";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await database()

        const { name, email, message } = await req.json()

        if (!name || !email || !message) {
            return NextResponse.json({
                success: false,
                message: 'Please fill all inputs'
            }, { status: 400 })
        }



        const newMessgae = new Message({ name, email, message })

        await newMessgae.save()

        return NextResponse.json({
            success: true,
            message: 'Successfully sent message'
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to send message",
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
                message: "Message id not found"
            }, { status: 400 })
        }

        const message = await Message.findById(id)
        if (!message) {
            return NextResponse.json({
                success: false,
                message: "Message not found"
            }, { status: 400 })
        }

        await Message.findOneAndDelete({ id })

        return NextResponse.json({
            success: true,
            message: " Successfully deleted messgae"
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete message",
            error: error.message
        }, { status: 500 })
    }

}


export async function GET() {
    try {
        await database()

        const messages = await Message.find({}).sort({ createdAt: -1 })

        if (!messages || messages === null) {
            return NextResponse.json({
                success: false,
                messgae: 'Failed to fetch message'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true,
            message: "SUccessfully fetched message",
            pyload: messages
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete message",
            error: error.message
        }, { status: 500 })
    }

}