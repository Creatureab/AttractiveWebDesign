import ExploreBtn from "@/components/ExploreBtn";
import EventCards from "@/components/EventCards";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";

const Page = async () => {
    'use cache';
    cacheLife('hours');

    // FIX: Read env variable INSIDE the component
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // Helpful error during build:
    if (!BASE_URL) {
        throw new Error("❌ NEXT_PUBLIC_BASE_URL is undefined during build! Check Vercel env vars.");
    }

    const response = await fetch(`${BASE_URL}/api/events`);
    const { events } = await response.json();

    return (
        <section>
            <h1 className="text-center">The Hub for Every Dev <br /> Event You Can't Miss</h1>
            <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

            <ExploreBtn />

            <div className="mt-20 space-y-7">
                <h3>Featured Events</h3>

                <ul className="events">
                    {events && events.length > 0 && events.map((event: IEvent) => (
                        <li key={event.title} className="list-none">
                            <EventCards {...event} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Page;
