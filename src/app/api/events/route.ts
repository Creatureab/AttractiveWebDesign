import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary';
import { Upload } from 'lucide-react';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();

    // Parse form data and handle array fields
    const eventData: Record<string, unknown> = {};

    for (const [key, value] of formData.entries()) {
      if (key === 'agenda' || key === 'tags') {
        // Parse JSON arrays
        try {
          eventData[key] = JSON.parse(value as string);
        } catch {
          // Fallback: split by comma if not valid JSON
          eventData[key] = (value as string).split(',').map(s => s.trim());
        }
      } else {
        eventData[key] = value;
      }
    }
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({
        message: 'Image file is required',
      }, { status: 400 });
    }

    const arraybuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arraybuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'DevEvents',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    eventData.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create(eventData);

    return NextResponse.json({
      message: 'Event created successfully',
      event: createdEvent
    }, { status: 201 });
  }
  catch (e) {
    console.error('Error creating event:', e);
    return NextResponse.json({
      message: 'Event creation failed',
      error: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}