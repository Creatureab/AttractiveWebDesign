import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Event, type IEvent } from '@/database';

interface EventResponse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing slug parameter" },
        { status: 400 }
      );
    }

    const normalizedSlug = slug.trim().toLowerCase();

    await connectDB();

    const event = await Event.findOne({ slug: normalizedSlug }).lean() as IEvent | null;

    if (!event) {
      return NextResponse.json(
        { error: `Event with slug "${normalizedSlug}" not found` },
        { status: 404 }
      );
    }

    const eventData: EventResponse = {
      _id: event._id.toString(),
      title: event.title,
      slug: event.slug,
      description: event.description,
      overview: event.overview,
      image: event.image,
      venue: event.venue,
      location: event.location,
      date: event.date,
      time: event.time,
      mode: event.mode,
      audience: event.audience,
      agenda: event.agenda,
      organizer: event.organizer,
      tags: event.tags,
      createdAt: new Date(event.createdAt).toISOString(),
      updatedAt: new Date(event.updatedAt).toISOString(),
    };

    return NextResponse.json(eventData, { status: 200 });
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
