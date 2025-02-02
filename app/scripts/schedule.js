import './../scss/schedule.scss';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('event-form');
   // const eventList = document.getElementById('event-list');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get input values
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const description = document.getElementById('event-description').value;

        if (title && date && description) {
            // Create event item
            const li = document.createElement('li');
            li.innerHTML = `<strong>${title}</strong> - ${date}<br>${description}`;
           // eventList.appendChild(li);

            // Clear form
            form.reset();
        }
    });
});
