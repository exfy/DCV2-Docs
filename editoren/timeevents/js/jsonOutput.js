function updateJsonOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.textContent = JSON.stringify({ timeevents: events }, null, 4);
}
