//let events = []; // Stelle sicher, dass dies nur einmal in deinem gesamten Code existiert

// Funktion zum Rendern der Event-Liste
function renderEventList() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Leeren des bisherigen Inhalts

    events.forEach((event, index) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event drop-target';
        eventDiv.textContent = `${event.displayname} (${event.time})`;
        eventDiv.setAttribute('data-index', index);

        eventList.appendChild(eventDiv);
    });

    setupDragAndDrop(); // Drag-and-Drop neu einrichten
}

function showEventDetails(eventIndex) {
    const event = events[eventIndex];
    alert(`Details für Event: ${event.displayname} (Zeit: ${event.time})`);
    // Hier könntest du weitere Logik einfügen, um ein Bearbeitungsformular anzuzeigen
}
