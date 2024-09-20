// Function to delete a variable from the JSON structure
// Function to delete a variable
function deleteVariable(eventIndex, variablesIndex) {
    if (confirm('Willst du diese Variable wirklich löschen?')) {
        events[eventIndex].variables.splice(variablesIndex, 1); // Remove variable from array
        renderEventList(); // Re-render event list
        updateJsonOutput(); // Update JSON output
    }
}

// This function ensures the buttons are correctly set up with event listeners
function setupDeleteVariableButtons() {
    document.querySelectorAll('.deleteVariable').forEach(button => {
        button.addEventListener('click', function() {
            const eventIndex = this.getAttribute('data-event-index');
            const variablesIndex = this.getAttribute('data-variables-index');
            deleteVariable(eventIndex, variablesIndex);
        });
    });
}

renderEventList();
setupDeleteVariableButtons();



// Call the function to set up delete button listeners after rendering the event list


// Example function to update JSON output
function updateJsonOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    if (jsonOutput) {
        jsonOutput.textContent = JSON.stringify(events, null, 2);
    }
}
renderEventList();
// Assuming you call renderEventList to initialize everything
//renderEventList();


// Add event listener for the delete button


