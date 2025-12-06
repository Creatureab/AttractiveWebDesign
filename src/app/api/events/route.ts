import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "@/lib/mongodb";
import { Event } from "@/database";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const event: any = {};

        formData.forEach((value, key) => {
            event[key] = value;
        });

        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ message: "Image is required" }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to Cloudinary
        const uploadResult: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "DevEvents", resource_type: "image" },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        event.image = uploadResult.secure_url;

        event.tags = JSON.parse(event.tags || "[]");
        event.agenda = JSON.parse(event.agenda || "[]");

        const createdEvent = await Event.create(event);

        return NextResponse.json(
            { message: "Event created successfully", event: createdEvent },
            { status: 201 }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Event creation failed", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json({ events }, { status: 200 });
}
