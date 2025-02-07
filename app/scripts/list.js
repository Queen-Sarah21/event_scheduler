import './../scss/list.scss';

document.addEventListener('DOMContentLoaded', () => {
    const scheduleListContainer = document.getElementById('scheduleList');
    const filterDateInput = document.getElementById('filterDate');
    const filterButton = document.getElementById('filterButton');

    const fetchSchedules = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/schedule');
            if (!res.ok) throw new Error("Failed");

            const schedules = await res.json();
            renderSchedules(schedules);
        } catch (error) {
            console.error(error);
            scheduleListContainer.innerHTML = '<p>Error loading schedule list</p>';
        }
    };

    const renderSchedules = (schedules) => {
        if (schedules.length === 0) {
            scheduleListContainer.innerHTML = '<p>No schedules found</p>';
            return;
        }

        const scheduleListHTML = schedules.map(schedule => `
            <div class="schedule-card" id="schedule-${schedule.id}">
                <p><b>Title:</b> ${schedule.title}</p>
                <p><b>Date:</b> ${schedule.date.split('T')[0]}</p>
                <p><b>Description:</b> ${schedule.description}</p>
                <p><b>Created At:</b> ${new Date(schedule.created_at).toLocaleString()}</p>
                <button class="edit-btn" data-id="${schedule.id}">Edit</button>
                <button class="delete-btn" data-id="${schedule.id}">Delete</button>
            </div>
        `).join('');

        scheduleListContainer.innerHTML = scheduleListHTML;

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', deleteSchedule);
        });
        // Add event listeners to edit buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            window.location.href = `edit.html?id=${id}`;
        });
    });
    };

    const filterSchedules = async () => {
        const selectedDate = filterDateInput.value;

        if (!selectedDate) {
            alert("Please select a date");
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/schedule');
            if (!res.ok) throw new Error("Failed");

            const schedules = await res.json();
            const filteredSchedules = schedules.filter(schedule => schedule.date.split('T')[0] === selectedDate);

            if (filteredSchedules.length === 0) {
                scheduleListContainer.innerHTML = `<p>No events found for the date: ${selectedDate}</p>`;
            } else {
                renderSchedules(filteredSchedules);
            }
        } catch (error) {
            console.error(error);
            scheduleListContainer.innerHTML = '<p>Error filtering events</p>';
        }
    };

    const deleteSchedule = async (e) => {
        const id = e.target.getAttribute('data-id');
        try {
            const res = await fetch(`http://localhost:3000/api/schedule/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete event');
            e.target.closest('.schedule-card').remove();
        } catch (error) {
            console.error(error);
            alert("Failed to delete the event");
        }
    };

    // Add event listener for the filter button
    filterButton.addEventListener('click', filterSchedules);

    // Load all schedules initially
    fetchSchedules();
});
