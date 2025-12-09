import { database } from "@/lib/mongoose"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { JWT_SECRET, NODE_ENV } from "@/lib/secure"
import bcrypt from 'bcryptjs'
import User from "@/models/user"


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
            }, { status: 400 })
        }

        if (user.role !== 'admin') {
            return NextResponse.json({
                success: false,
                message: 'Only admin can login'
            }, { status: 400 })
        }




        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const response = NextResponse.json(
            {
                success: true,
                message: "Successfully logged in",
                payload: user,
            },
            { status: 200 }
        );

        response.cookies.set("user_token", token, {
            httpOnly: true,
            secure: NODE_ENV,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to sign in",
            error: error.message
        }, { status: 500 })

    }

}