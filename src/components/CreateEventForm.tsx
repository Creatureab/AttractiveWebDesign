
"use client";

import { useState } from "react";

const CreateEventForm = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        overview: "",
        image: "",
        venue: "",
        location: "",
        date: "",
        time: "",
        mode: "",
        audience: "",
        agenda: [""],
        organizer: "",
        tags: [""],
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Handle input fields
    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (index: number, value: string, field: string) => {
        const updated = [...(form as any)[field]];
        updated[index] = value;
        setForm({ ...form, [field]: updated });
    };

    const addArrayItem = (field: string) => {
        setForm({ ...form, [field]: [...(form as any)[field], ""] });
    };

    // Handle file selection
    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);
    };

    // Submit form as FormData
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData = new FormData();

        // Add form fields (excluding image since we'll add the file separately)
        Object.keys(form).forEach((key) => {
            if (key !== "image") { // Skip image field since we're sending the file
                if (key === "agenda" || key === "tags") {
                    formData.append(key, JSON.stringify((form as any)[key]));
                } else {
                    formData.append(key, (form as any)[key]);
                }
            }
        });

        // Add the selected file
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {
            const response = await fetch("/api/events", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Event Created:", data);

            if (response.ok) {
                setShowSuccessPopup(true);
                // Reset form
                setForm({
                    title: "",
                    description: "",
                    overview: "",
                    image: "",
                    venue: "",
                    location: "",
                    date: "",
                    time: "",
                    mode: "",
                    audience: "",
                    agenda: [""],
                    organizer: "",
                    tags: [""],
                });
                setSelectedFile(null);
            } else {
                alert(`Error: ${data.message || 'Failed to create event'}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to create event. Please try again.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-xl">
            <h1 className="text-2xl font-bold">Create Event</h1>

            {[
                "title",
                "description",
                "overview",
                "venue",
                "location",
                "date",
                "time",
                "mode",
                "audience",
                "organizer",
            ].map((field) => (
                <div key={field}>
                    <label className="font-semibold capitalize">{field}</label>
                    <input
                        type="text"
                        name={field}
                        value={(form as any)[field]}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded-lg"
                        required
                    />
                </div>
            ))}

            {/* IMAGE UPLOAD */}
            <div>
                <label className="font-semibold">Event Image (PNG, JPEG allowed)</label>
                <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="w-full border px-3 py-2 rounded-lg"
                    required
                />
                {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                        Selected: {selectedFile.name}
                    </p>
                )}
            </div>

            {/* AGENDA */}
            <div>
                <label className="font-semibold">Agenda</label>
                {form.agenda.map((item, idx) => (
                    <input
                        key={idx}
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(idx, e.target.value, "agenda")}
                        className="w-full border px-3 py-2 rounded-lg mt-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem("agenda")}
                    className="mt-2 px-3 py-1 bg-white-200 rounded"
                >
                    + Add Agenda Item
                </button>
            </div>

            {/* TAGS */}
            <div>
                <label className="font-semibold">Tags</label>
                {form.tags.map((item, idx) => (
                    <input
                        key={idx}
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayChange(idx, e.target.value, "tags")}
                        className="w-full border px-3 py-2 rounded-lg mt-2"
                    />
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem("tags")}
                    className="mt-2 px-3 py-1 bg-white-20 rounded"
                >
                    + Add Tag
                </button>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                Create Event
            </button>
        </form>

        {/* Success Popup */}
        {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100 opacity-100">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
                        <p className="text-gray-600 mb-6">Event created successfully</p>
                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                            Great!
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default CreateEventForm;
