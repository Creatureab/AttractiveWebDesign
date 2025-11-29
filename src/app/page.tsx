import EventCards from "@/components/EventCards";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";


export default function Home() {
  return (
    <section>
      <h1 className="text-center">Welcome to Events Handling App</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in one Place</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

       <ul className="events">
        {events.map((event) => (
          <li key={event.title}>
            <EventCards {...event} />
          </li>
         

         
        
        ))}


        </ul>

      </div>
    </section>
  );
}

