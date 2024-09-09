//let events = []; // Stelle sicher, dass dies nur einmal in deinem gesamten Code existiert

// Funktion zum Rendern der Event-Liste


function showEventDetails(eventIndex) {
    const event = events[eventIndex];
    alert(`Details für Event: ${event.displayname} (Zeit: ${event.time})`);
    // Hier könntest du weitere Logik einfügen, um ein Bearbeitungsformular anzuzeigen
}
// Function to render the event list with delete, edit, and copy options
function renderEventList() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear previous content

    events.forEach((event, index) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event drop-target';

        const eventDetails = document.createElement('div');
        eventDetails.innerHTML = `<strong>${event.displayname}</strong> (${event.time}) <br> <small>${event.comment}</small>`;
        eventDiv.appendChild(eventDetails);

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => {
            editEvent(index);
        };
        eventDiv.appendChild(editButton);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            deleteEvent(index);
        };
        eventDiv.appendChild(deleteButton);

        // Copy to clipboard button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.onclick = () => {
            copyEventToClipboard(event);
        };
        eventDiv.appendChild(copyButton);

        eventList.appendChild(eventDiv);

    });

    setupDragAndDrop(); // Reinitialize drag-and-drop functionality
}

// Function to delete an event
function deleteEvent(eventIndex) {
    if (confirm('Are you sure you want to delete this event?')) {
        events.splice(eventIndex, 1); // Remove event from array
        renderEventList(); // Re-render event list
        updateJsonOutput(); // Update JSON output
    }
}


// Function to edit an event
function editEvent(eventIndex) {
    const event = events[eventIndex];
    document.getElementById('displayname').value = event.displayname;
    document.getElementById('comment').value = event.comment;
    document.getElementById('time').value = event.time;

    // When form is submitted, replace the event instead of adding new
    document.getElementById('eventForm').onsubmit = function(e) {
        e.preventDefault();
        event.displayname = document.getElementById('displayname').value;
        event.comment = document.getElementById('comment').value;
        event.time = document.getElementById('time').value;
        renderEventList(); // Re-render the updated list
        updateJsonOutput();
        document.getElementById('eventForm').reset();
    };
}

// Function to copy event details to clipboard
function copyEventToClipboard(event) {
    const eventText = `Event: ${event.displayname}\\nTime: ${event.time}\\nComment: ${event.comment}`;
    navigator.clipboard.writeText(eventText).then(() => {
        alert('Event details copied to clipboard');
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}