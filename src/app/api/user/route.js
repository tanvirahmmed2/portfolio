
import { NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { User } from "@/models/user"
import { database } from "@/lib/mongoose"


export async function POST(req) {
    try {
        await database()

        const { name, email, password } = await req.json()

        if (!name || !email || !password) {
            return NextResponse.json({
                success: false,
                messgae: "PLease filll all details"
            }, { status: 400 })
        }

        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({
                success: false,
                message: 'User already exists'
            }, { status: 400 })
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPass })

        await newUser.save()

        return NextResponse.json({
            success: true,
            message: "Successfully signed up"
        }, { status: 200 })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to sign up",
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
                message: "Account id not found"
            }, { status: 400 })
        }

        const user = await User.findById(id)
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User no exists'
            }, { status: 400 })
        }

        

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete account",
            error: error.message
        }, { status: 500 })
    }

}