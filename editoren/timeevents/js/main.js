let events = [];

document.addEventListener('DOMContentLoaded', () => {
    initEventEditor();
    setupDragAndDrop();
    setupPopupHandling();
});

function initEventEditor() {
    document.getElementById('eventForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const displayname = document.getElementById('displayname').value;
        const time = document.getElementById('time').value;

        const systemname = displayname.toLowerCase().replace(/[^a-z]/g, '');

        const newEvent = {
            systemname: systemname,
            displayname: displayname,
            minimalReqVersion: 1,
            conditions: [],
            time: time,
            actions: []
        };

        events.push(newEvent);
        renderEventList();
        updateJsonOutput();
        document.getElementById('eventForm').reset();
    });
}

// Funktion zum Rendern der Event-Liste mit den zugewiesenen Actions
function renderEventList() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Leeren des bisherigen Inhalts

    events.forEach((event, eventIndex) => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event drop-target';
        eventDiv.textContent = `${event.displayname} (${event.time})`;
        eventDiv.setAttribute('data-index', eventIndex);

        // Liste der Actions für dieses Event rendern
        const actionList = document.createElement('ul');
        event.actions.forEach((action, actionIndex) => {
            const actionItem = document.createElement('li');
            actionItem.innerHTML = `
                ${action.actiondisplayname} 
                <button class="editAction" data-event-index="${eventIndex}" data-action-index="${actionIndex}">Edit</button>
                <button class="deleteAction" data-event-index="${eventIndex}" data-action-index="${actionIndex}">Delete</button>
            `;
            actionList.appendChild(actionItem);
        });

        eventDiv.appendChild(actionList);
        eventList.appendChild(eventDiv);
    });

    setupDragAndDrop(); // Drag-and-Drop neu einrichten
    setupActionButtons(); // Editieren und Löschen für Actions einrichten
}

// Funktion zum Bearbeiten und Löschen von Actions
function setupActionButtons() {
    // Bearbeiten-Button
    document.querySelectorAll('.editAction').forEach(button => {
        button.addEventListener('click', (e) => {
            const eventIndex = e.target.getAttribute('data-event-index');
            const actionIndex = e.target.getAttribute('data-action-index');
            const action = events[eventIndex].actions[actionIndex];
            renderActionForm(action.actionname, eventIndex, actionIndex);
        });
    });

    // Löschen-Button
    document.querySelectorAll('.deleteAction').forEach(button => {
        button.addEventListener('click', (e) => {
            const eventIndex = e.target.getAttribute('data-event-index');
            const actionIndex = e.target.getAttribute('data-action-index');
            events[eventIndex].actions.splice(actionIndex, 1);
            renderEventList(); // Neu rendern, nachdem die Action gelöscht wurde
            updateJsonOutput(); // JSON-Ausgabe aktualisieren
        });
    });
}

function setupDragAndDrop() {
    const actionItems = document.querySelectorAll('#actionList .action');
    const eventTargets = document.querySelectorAll('#eventList .event');

    actionItems.forEach(actionItem => {
        actionItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('action', e.target.getAttribute('data-action'));
        });
    });

    eventTargets.forEach(eventTarget => {
        eventTarget.addEventListener('dragover', (e) => {
            e.preventDefault(); // Ermöglicht das Droppen
        });

        eventTarget.addEventListener('drop', (e) => {
            e.preventDefault();

            const actionType = e.dataTransfer.getData('action');
            const eventIndex = e.target.getAttribute('data-index');

            if (actionType && eventIndex !== null) {
                renderActionForm(actionType, eventIndex);
            }
        });
    });
}

// Funktion zum Öffnen des Action-Formulars in einem Popup
function renderActionForm(actionType, eventIndex, actionIndex = null) {
    let actionForm = '';

    // Basierend auf dem Action-Typ das entsprechende Formular erstellen
    switch (actionType) {
        case 'PrivateMessageAction':
            actionForm = `
                <label>Player:</label><input type="text" id="player" required>
                <label>Message:</label><input type="text" id="message" required>
                <label>Command Priority:</label><input type="text" id="cmdPrio" required>
            `;
            break;
        case 'CommandAction':
            actionForm = `
                <label>Command:</label><input type="text" id="command" required>
                <label>Command Priority:</label><input type="text" id="cmdPrio" required>
            `;
            break;
        case 'ChatMessageAction':
            actionForm = `
                <label>Message:</label><input type="text" id="message" required>
                <label>Command Priority:</label><input type="text" id="cmdPrio" required>
            `;
            break;
        case 'QuitClientAction':
            actionForm = 'This action does not require additional fields.';
            break;
        case 'QuitServerAction':
            actionForm = 'This action does not require additional fields.';
            break;
        case 'SendSimpleMessageWebhookAction':
            actionForm = `
                <label>Content:</label><input type="text" id="content" required>
                <label>Webhook URL:</label><input type="url" id="webhookUrl" required>
            `;
            break;
        case 'EmbedDiscordAction':
            actionForm = `
                <label>Title:</label><input type="text" id="title" required>
                <label>Description:</label><input type="text" id="description" required>
                <label>Content:</label><input type="text" id="content" required>
                <label>Webhook URL:</label><input type="url" id="webhookUrl" required>
                <label>Color:</label><input type="text" id="color">
            `;
            break;
        case 'OfflinePayAction':
            actionForm = `
                <label>Player:</label><input type="text" id="player" required>
                <label>UUID:</label><input type="text" id="uuid" required>
                <label>Betrag:</label><input type="number" id="betrag" required>
            `;
            break;
        case 'OfflineMsgAction':
            actionForm = `
                <label>Player:</label><input type="text" id="player" required>
                <label>UUID:</label><input type="text" id="uuid" required>
                <label>Message:</label><input type="text" id="message" required>
            `;
            break;
        case 'SetString':
            actionForm = `
                <label>Variable Name:</label><input type="text" id="varname" required>
                <label>Value:</label><input type="text" id="value" required>
            `;
            break;
        default:
            console.error(`Unknown Action Type: ${actionType}`);
            return;
    }

    // Popup-Feld für die Formulareingabe
    const formContainer = document.getElementById('actionFormContainer');
    formContainer.innerHTML = `
        <h3>Fill Action: ${actionType}</h3>
        <form id="actionForm">
            ${actionForm}
            <button type="submit">Save Action</button>
        </form>
    `;

    // Popup öffnen
    showPopup();

    // Wenn die Aktion bereits existiert (bearbeiten), Felder mit den vorhandenen Werten füllen
    if (actionIndex !== null) {
        const action = events[eventIndex].actions[actionIndex];
        switch (actionType) {
            case 'PrivateMessageAction':
                document.getElementById('player').value = action.data.player;
                document.getElementById('message').value = action.data.message;
                document.getElementById('cmdPrio').value = action.data.cmdPrio;
                break;
            case 'ChatMessageAction':
                document.getElementById('message').value = action.data.message;
                document.getElementById('cmdPrio').value = action.data.cmdPrio;
                break;
            case 'CommandAction':
                document.getElementById('command').value = action.data.command;
                document.getElementById('cmdPrio').value = action.data.cmdPrio;
                break;
            case 'SendSimpleMessageWebhookAction':
                document.getElementById('content').value = action.data.content;
                document.getElementById('webhookUrl').value = action.data.webhookUrl;
                break;
            case 'EmbedDiscordAction':
                document.getElementById('title').value = action.data.title;
                document.getElementById('description').value = action.data.description;
                document.getElementById('content').value = action.data.content;
                document.getElementById('webhookUrl').value = action.data.webhookUrl;
                document.getElementById('color').value = action.data.color;
                break;
            case 'OfflinePayAction':
                document.getElementById('player').value = action.data.player;
                document.getElementById('uuid').value = action.data.uuid;
                document.getElementById('betrag').value = action.data.betrag;
                break;
            case 'OfflineMsgAction':
                document.getElementById('player').value = action.data.player;
                document.getElementById('uuid').value = action.data.uuid;
                document.getElementById('message').value = action.data.message;
                break;
            case 'SetString':
                document.getElementById('varname').value = action.data.varname;
                document.getElementById('value').value = action.data.value;
                break;
            // Weitere Aktionen falls erforderlich...
        }
    }

    // Speichern der Aktion und Schließen des Popups
    document.getElementById('actionForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveActionToEvent(actionType, eventIndex, actionIndex);
        closePopup(); // Schließen des Popups nach dem Speichern
    });
}

// Funktion zum Speichern der Action-Daten im Event
function saveActionToEvent(actionType, eventIndex, actionIndex = null) {
    let actionData = {};
    switch (actionType) {
        case 'PrivateMessageAction':
            actionData = {
                player: document.getElementById('player').value,
                message: document.getElementById('message').value,
                cmdPrio: document.getElementById('cmdPrio').value
            };
            break;
        case 'CommandAction':
            actionData = {
                command: document.getElementById('command').value,
                cmdPrio: document.getElementById('cmdPrio').value
            };
            break;
        case 'ChatMessageAction':
            actionData = {
                command: document.getElementById('message').value,
                cmdPrio: document.getElementById('cmdPrio').value
            };
            break;
        case 'QuitClientAction':
            break;
        case 'QuitServerAction':
            // Quit-Aktionen haben keine zusätzlichen Felder
            actionData = {};
            break;
        case 'SendSimpleMessageWebhookAction':
            actionData = {
                content: document.getElementById('content').value,
                webhookUrl: document.getElementById('webhookUrl').value
            };
            break;
        case 'EmbedDiscordAction':
            actionData = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                content: document.getElementById('content').value,
                webhookUrl: document.getElementById('webhookUrl').value,
                color: document.getElementById('color').value
            };
            break;
        case 'OfflinePayAction':
            actionData = {
                player: document.getElementById('player').value,
                uuid: document.getElementById('uuid').value,
                betrag: document.getElementById('betrag').value
            };
            break;
        case 'OfflineMsgAction':
            actionData = {
                player: document.getElementById('player').value,
                uuid: document.getElementById('uuid').value,
                message: document.getElementById('message').value
            };
            break;
        case 'SetString':
            actionData = {
                varname: document.getElementById('varname').value,
                value: document.getElementById('value').value
            };
            break;
        default:
            console.error(`Unknown Action Type: ${actionType}`);
            return;
        // Füge weitere Action-Typen hinzu...
    }

    const event = events[eventIndex];
    const newAction = {
        actionname: actionType,
        actiondisplayname: actionType,
        minimalReqVersion: 1,
        data: actionData
    };

    if (actionIndex !== null) {
        // Bearbeiten einer bestehenden Action
        event.actions[actionIndex] = newAction;
    } else {
        // Hinzufügen einer neuen Action
        event.actions.push(newAction);
    }

    renderEventList();
    updateJsonOutput();
}

// Funktion, um das Popup anzuzeigen
function showPopup() {
    const popup = document.getElementById('actionPopup');
    popup.style.display = 'block';
}

// Funktion, um das Popup zu schließen
function closePopup() {
    const popup = document.getElementById('actionPopup');
    popup.style.display = 'none';
}

function setupPopupHandling() {
    const popup = document.getElementById('actionPopup');
    const closeButton = document.getElementById('closePopup');

    // Schließen des Popups durch Klick auf das "X"
    closeButton.onclick = function () {
        closePopup();
    };

    // Schließen des Popups durch Klick außerhalb des Popup-Bereichs
    window.onclick = function (event) {
        if (event.target == popup) {
            closePopup();
        }
    };
}
function importJsonFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Bitte wählen Sie eine JSON-Datei aus.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Überprüfen, ob das importierte JSON das richtige Format hat
            if (importedData && importedData.timeevents) {
                events = importedData.timeevents; // Importierte Events in das events-Array laden
                renderEventList(); // Liste der Events neu rendern
                updateJsonOutput(); // Aktualisiere die JSON-Ausgabe
                alert('JSON erfolgreich importiert.');
            } else {
                alert('Ungültiges JSON-Format.');
            }
        } catch (error) {
            alert('Fehler beim Lesen der Datei: ' + error.message);
        }
    };

    reader.readAsText(file); // Die Datei wird als Text gelesen
}

// Event-Listener für den Import-Button
document.getElementById('importBtn').addEventListener('click', importJsonFile);

if (importedData && Array.isArray(importedData.timeevents)) {
    events = importedData.timeevents;
}

function saveToFile() {
    const data = JSON.stringify({ timeevents: events }, null, 4);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TimeEvents.json';
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById('saveBtn').addEventListener('click', saveToFile);