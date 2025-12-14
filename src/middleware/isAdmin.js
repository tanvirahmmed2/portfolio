import { database } from "@/lib/mongoose";
import User from "@/models/user";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "@/lib/secure";

export async function isAdmin() {
    await database();

    const token = (await cookies()).get("user_token")?.value;
    if (!token) return { success: false, message: "Token not found" };

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return { success: false, message: "User not found" };

        if (user.role !== 'admin') {
            return { success: false, message: "User not an admin" };
        }

        return { success: true, user };

    } catch (err) {
        return { success: false, message: err.message };
    }
}
