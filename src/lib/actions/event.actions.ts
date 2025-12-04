'use server';
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export const getSimilarFunctionFromSlug = async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug });

        if (!event) return [];

        // Correct MongoDB query
        return await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean();

    } catch (e) {
        console.error(e);
        return [];
    }
};
