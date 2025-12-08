import { database } from "@/lib/mongoose"
import { User } from "@/models/user"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@/lib/secure"
import bcrypt from 'bcryptjs'


export async function POST(req) {
    try {
        await database()
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Please enter email and password"
            }, { status: 400 })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'Please sign up'
            }, { status: 400 })
        }

        const passMatch = await bcrypt.compare(password, user.password)

        if (!passMatch) {
            return NextResponse.json({
                success: false,
                message: "Incorrect password"
            }, { status: 4000 })
        }

        return NextResponse.json({
            success: true,
            message: "Successfully signed in"
        }, { status: 200 })



    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to sign in",
            error: error.message
        }, { status: 500 })

    }

}