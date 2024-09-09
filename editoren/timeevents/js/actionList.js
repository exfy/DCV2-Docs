let events = [];

function renderEventList() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';

    events.forEach((event, index) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.textContent = `${event.displayname} (${event.time})`;
        eventDiv.addEventListener('click', () => showEventDetails(index));
        eventList.appendChild(eventDiv);
    });
}
function copyToClipboard() {
    const jsonOutput = document.getElementById('jsonOutput');
    navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
        alert('JSON erfolgreich in die Zwischenablage kopiert!');
    }).catch(err => {
        console.error('Fehler beim Kopieren in die Zwischenablage: ', err);
    });
}
