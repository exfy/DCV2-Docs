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
/*function updateJsonOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    if (jsonOutput) {
        jsonOutput.textContent = JSON.stringify(events, null, 2);
    }
}*/
renderEventList();
// Assuming you call renderEventList to initialize everything
//renderEventList();
// Debugging-Informationen hinzufügen
console.log("Initialisiertes events-Objekt:", events);
// Funktion zum Einfügen einer Variable in ein spezifisches Event
function insertChatVariable(eventIndex) {
    // Überprüfen, ob events vorhanden ist und ob es ein Array ist
    if (!Array.isArray(events) || events.length === 0) {
        console.error('Events ist nicht definiert oder leer.');
        return;
    }

    console.log("Event Index:", eventIndex);
    console.log("Events Array Länge:", events.length);

    // Sicherstellen, dass der Event-Index gültig ist
    if (eventIndex < 0 || eventIndex >= events.length) {
        console.error(`Ungültiger Event-Index: ${eventIndex}. Der Index muss zwischen 0 und ${events.length - 1} liegen.`);
        return;
    }

    console.log("Aktuelles Event, dem eine Variable hinzugefügt wird:", events[eventIndex]);

    const chatPopupHtml = `
        <div class="chat-popup-overlay">
            <div class="chat-popup-content">
                <h3>Variable einfügen</h3>
                <label for="chatPastedVariable">Füge das kopierte JSON der Variable hier ein:</label>
                <textarea id="chatPastedVariable" rows="10" cols="50"></textarea>
                <div class="chat-popup-buttons">
                    <button id="chat-popup-cancel">Abbrechen</button>
                    <button id="chat-popup-ok">OK</button>
                </div>
            </div>
        </div>
    `;

    const chatPopup = document.createElement('div');
    chatPopup.className = 'chat-popup';
    chatPopup.innerHTML = chatPopupHtml;
    document.body.appendChild(chatPopup);

    // CSS für Popup Overlay
    const style = document.createElement('style');
    style.innerHTML = `
        .chat-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .chat-popup-content {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            width: 400px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);

    // Event-Handler für den OK-Button
    document.getElementById('chat-popup-ok').onclick = function () {
        const pastedVariableJson = document.getElementById('chatPastedVariable').value;
        try {
            const newVariable = JSON.parse(pastedVariableJson);

            // Prüfen, ob die Eigenschaften vorhanden sind
            if (newVariable.hasOwnProperty('variableName') && newVariable.hasOwnProperty('filters') && Array.isArray(newVariable.filters)) {
                console.log(`Füge Variable zum Event ${eventIndex} hinzu.`);
                events[eventIndex].variables.push(newVariable); // Variable zum Event hinzufügen
                updateJsonOutput();
                renderEventList(); // Aktualisiere die Liste
                closeChatPopup();
            } else {
                alert('Ungültiges JSON: Das Objekt muss mindestens "variableName" und "filters" enthalten.');
            }
        } catch (error) {
            alert('Ungültiges JSON: ' + error.message);
        }
    };

    // Event-Handler für den Abbrechen-Button
    document.getElementById('chat-popup-cancel').onclick = function () {
        closeChatPopup();
    };

    // Funktion zum Schließen des Popups
    function closeChatPopup() {
        document.body.removeChild(chatPopup);
    }
}

// Beispiel: Ruft die Funktion für ein bestimmtes Event auf (wird in der Praxis dynamisch sein)
document.querySelectorAll('.addVariableButton').forEach(button => {
    button.addEventListener('click', function() {
        const eventIndex = parseInt(this.getAttribute('data-event-index'));
        insertChatVariable(eventIndex);
    });
});