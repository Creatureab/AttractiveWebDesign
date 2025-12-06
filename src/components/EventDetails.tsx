import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import EventCards from "@/components/EventCards";
import { IEvent } from "@/database/event.model";
import { getSimilarFunctionFromSlug } from "@/lib/actions/event.actions";

// Helper Components
const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
);

const EventAgenda = ({ agendaItem }: { agendaItem: string[] }) => {
    return (
        <div className="agenda">
            <h2>Agenda</h2>
            <ul>
                {agendaItem.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

const EventTags = ({ tags }: { tags: string[] }) => {
    return (
        <div className="flex flex-row gap-1.5 flex-wrap">
            {tags.map((tag) => (
                <div className="pill" key={tag}>{tag}</div>
            ))}
        </div>
    );
};

const EventDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
    // Extract slug from URL params (Next.js 15+ makes params a Promise)
    const { slug } = await params;

    let event;
    try {
        // Build full API URL for server-side fetch
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const apiUrl = `${baseUrl}/api/events/${slug}`;

        const request = await fetch(apiUrl, {
            next: { revalidate: 60 }
        });

        if (!request.ok) {
            if (request.status === 404) {
                return (
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Not Found</h1>
                            <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
                            <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Go Home
                            </a>
                        </div>
                    </div>
                );
            }
            throw new Error(`Failed to fetch event: ${request.statusText}`);
        }

        const response = await request.json();
        event = response.event;

        if (!event) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Not Found</h1>
                        <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
                        <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Go Home
                        </a>
                    </div>
                </div>
            );
        }
    } catch (error) {
        console.error("Error fetching event:", error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Error Loading Event</h1>
                    <p className="text-gray-600 mb-8">There was an error loading this event. Please try again later.</p>
                    <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Go Home
                    </a>
                </div>
            </div>
        );
    }
    const bookings = 10;
    const similarEvents = await getSimilarFunctionFromSlug(slug);
    const {
        description,
        image,
        title,
        location,
        date,
        time,
        overview,
        mode,
        agenda,
        tags,
        audience,
        organizer,
        _id
    } = event;

    if (!description) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Not Available</h1>
                    <p className="text-gray-600 mb-8">This event doesn't have a description.</p>
                    <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <section id="event">
            <div className="header">
                <h1>Event Description: <br /></h1>
                <p className="mt-2">{description}</p>
            </div>

            <div className="details">
                <div className="content">
                    <Image src={image} alt="event baner" width={800} height={800} className="banner" />

                    <section className="flex-col-gap-2">
                        <h2>{overview}</h2>
                        <p>{overview}</p>
                    </section>

                    <section className="flex-col-gap-2">
                        <h2>Event Details</h2>

                        <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    </section>

                    <EventAgenda agendaItem={agenda} />

                    <section className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>

                    <EventTags tags={tags} />
                </div>

                <aside className="booking">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className="text-sm">
                                Join {bookings} people who already booked their spot!
                            </p>
                        ) : (
                            <p className="text-sm">
                                Be the first to book your spot!
                            </p>
                        )}
                        <BookEvent eventId={_id} slug={slug} />
                    </div>
                </aside>
            </div>

            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 &&
                        similarEvents.map((similarEvent: IEvent) => (
                            <EventCards key={similarEvent.title} {...similarEvent} />
                        ))}
                </div>
            </div>
        </section>
    );
};
export default EventDetails;