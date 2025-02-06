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
document.addEventListener('DOMContentLoaded', () =>{
  const form = document.getElementById('delete-event-form');

  if(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const eventId = document.getAnimations('event-id').values;

      if (!eventId) {
        alert('Please enter a valid event ID.');
        return;
      }

      try {
        const res = await fetch(`http://localhost:3001/api/schedule/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          alert('Event deleted successfully!');
          form.reset();
        } else {
          const errorData = await res.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error(`Error: ${error}`);
        alert('An error occured while deleting the event.')
      }
    })
  }
})
