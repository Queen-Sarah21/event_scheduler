import './../scss/edit.scss';

document.addEventListener("DOMContentLoaded", () => {
    const editForm = document.getElementById("editForm");
    const titleInput = document.getElementById("title");
    const dateInput = document.getElementById("date");
    const descriptionInput = document.getElementById("description");

    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");
    console.log("Event ID from URL:", eventId); // Ensure this is correct

    const fetchEvent = async () => {
        try {
            const res = await fetch(`/api/schedule`);
            if (!res.ok) throw new Error("Failed to fetch event data");

            const events = await res.json();
            console.log("Fetched events:", events); // Debugging

            const event = events.find(e => e.id == eventId);

            if (event) {
                titleInput.value = event.title || "";
                dateInput.value = event.date.split('T')[0] || ""; // Ensure date format compatibility
                descriptionInput.value = event.description || "";
            } else {
                alert("Event not found");
            }
        } catch (error) {
            console.error("Error fetching event data:", error);
            alert("Failed to load event data");
        }
    };

    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedTitle = titleInput.value.trim();
        const updatedDate = dateInput.value.trim();
        const updatedDescription = descriptionInput.value.trim();

        if (!updatedTitle || !updatedDate || !updatedDescription) {
            alert("All fields are required");
            return;
        }

        try {
            console.log("Updating event with ID:", eventId); // Debugging
            const res = await fetch(`/api/schedule/${eventId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    date: updatedDate,
                    description: updatedDescription
                })
            });

            if (!res.ok) throw new Error("Failed to update event");

            alert("Event updated successfully");
            window.location.href = "list.html"; // Redirect to the list page after success
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Failed to update event");
        }
    });

    fetchEvent(); 
});
