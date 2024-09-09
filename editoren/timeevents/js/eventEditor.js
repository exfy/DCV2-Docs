function initEventEditor() {
    document.getElementById('eventForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from refreshing the page

        const displayname = document.getElementById('displayname').value;
        const comment = document.getElementById('comment').value;
        const time = document.getElementById('time').value;

        const systemname = displayname.toLowerCase().replace(/[^a-z]/g, '');

        const newEvent = {
            systemname: systemname,
            displayname: displayname,
            minimalReqVersion: 1,
            conditions: [],
            comment: comment || '',
            time: time,
            actions: []
        };

        events.push(newEvent);
        renderEventList();
        updateJsonOutput();

        document.getElementById('eventForm').reset();
    });
}
