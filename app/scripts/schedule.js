import './../scss/schedule.scss';


// Create event
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('event-form');
   // const eventList = document.getElementById('event-list');

   if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
        // Get input values
            const title = document.getElementById('title').value;
            const date = document.getElementById('date').value;
            const description = document.getElementById('description').value;

      const eventData = {
          title,
          date,
          description
        };

        try {

            const res = await fetch('http://localhost:3001/api/schedule', {
              method: 'POST',
              headers: {
                'Content-Type' : 'application/json'
              },
              body: JSON.stringify(eventData) //to send to the connection
            });
            if(res.ok){
              alert('Event scheduled successfully!');
              form.reset();
            }else{
              const errorData = await res.json();
              alert(`Error: ${errorData.error}`)
            }
          } catch (error) {
              console.error(`Error: ${error}`);
              alert('An error occured while scheduling the eventData.');   
          }
        })
    }
});

//Remove Event
async function deleteEvent() {
  const eventId = document,getElementById('event-id').value;

  if (!eventId) {
    alert('Please enter a valid event ID.');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3001/api/schedule/${eventId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      alert('Event deleted successully!');
      document.getElementById('delete-event-form').reset();
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    alert('An error occured while deleting the event.');
  }
}

// Filter event by date function
async function filterEventsByDate() {
  const filterDate = document.getElementById('filter-date').value;
  const eventList = document.getElementById('event-list');

  if (!filterDate) {
    alert('Please enter a valid Date.');
    return; 
  }

  try {
    const events = await fetch(`http://localhost:3001/api/schedule?date=${filterDate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (res.ok) {
      const events = await res.json();
      eventList.innerHTML = events.map(event => `<li>${event.title} - ${event.date}</li>`).join('');      
    } else {
      const errorData = await res.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    alert('An error occured while filtering events.');
  }
}