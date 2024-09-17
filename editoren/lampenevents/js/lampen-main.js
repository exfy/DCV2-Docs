let events = [];

document.addEventListener('DOMContentLoaded', () => {
    initEventEditor();
    setupDragAndDrop();
    setupPopupHandling();
});

/*function initEventEditor() {
    document.getElementById('eventForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const displayname = document.getElementById('displayname').value;
        const time = document.getElementById('time').value;

        const systemname = "sys_" + displayname.toLowerCase().replace(/[^a-z0-9]/g, '');

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
}*/


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
   /* document.querySelectorAll('.deleteAction').forEach(button => {
        button.addEventListener('click', (e) => {
            const eventIndex = e.target.getAttribute('data-event-index');
            const actionIndex = e.target.getAttribute('data-action-index');
            events[eventIndex].actions.splice(actionIndex, 1);
            renderEventList(); // Neu rendern, nachdem die Action gelöscht wurde
            updateJsonOutput(); // JSON-Ausgabe aktualisieren
        });
    });*/
    document.querySelectorAll('.deleteAction').forEach(button => {
        button.addEventListener('click', (e) => {
            if (confirm('Bist du sicher, dass du diese Aktion löschen möchtest?')) {
                const eventIndex = e.target.getAttribute('data-event-index');
                const actionIndex = e.target.getAttribute('data-action-index');
                events[eventIndex].actions.splice(actionIndex, 1);
                renderEventList(); // Neu rendern, nachdem die Action gelöscht wurde
                updateJsonOutput(); // JSON-Ausgabe aktualisieren
            }
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
                <label for="cmdPrio">Command Priority:</label>
<select id="cmdPrio" required>
  <option value="NORMAL">NORMAL</option>
  <option value="HIGH">HIGH</option>
  <option value="LOW">LOW</option>
</select>
            `;
            break;
        case 'CommandAction':
            actionForm = `
                <label>Command:</label><input type="text" id="command" required>
                <label for="cmdPrio">Command Priority:</label>
<select id="cmdPrio" required>
  <option value="NORMAL">NORMAL</option>
  <option value="HIGH">HIGH</option>
  <option value="LOW">LOW</option>
</select>
            `;
            break;
        case 'ChatMessageAction':
            actionForm = `
                <label>Message:</label><input type="text" id="message" required>
              <label for="cmdPrio">Command Priority:</label>
<select id="cmdPrio" required>
<option value="NORMAL">NORMAL</option>
  <option value="HIGH">HIGH</option>
  <option value="LOW">LOW</option>
</select>
            `;
            break;
        case 'QuitClientAction':
            actionForm = 'Keine weiteren Eingabefelder nötig!';
            break;
        case 'QuitServerAction':
            actionForm = 'Keine weiteren Eingabefelder nötig!';
            break;
        case 'SendSimpleMessageWebhookAction':
            actionForm = `
                <label>Content:</label><input type="text" id="content" required>
                <label>Webhook URL:</label><input type="url" id="webhookUrl" required>
            `;
            break;
        case 'EmbedDiscordAction':
            actionForm = `
                <p>Alles ausfüllen oder nur content oder Mindestens ein title oder eine description ist möglich. </p>
                <label>Titel:</label><input type="text" id="title">
                <label>Beschreibung:</label><input type="text" id="description">
                <label>Content:</label><input type="text" id="content">
                <label>Webhook URL:</label><input type="url" id="webhookUrl" required>
                <label>Color:</label><input type="color" id="color" value="#ff0000">
            `;
            break;
        case 'OfflinePayAction':
            actionForm = `
                <label>Player:</label><input type="text" id="player" required>
                <label>UUID:<button type="button" onclick="fetchUUID()">UUID von Minecraftname</button></label><input type="text" id="uuid" required><br>
                <label>Betrag:</label><input type="number" id="betrag" required>
            `;
            break;
        case 'OfflineMsgAction':
            actionForm = `
                <label>Minecraftname:</label><input type="text" id="player" required>
                <label>UUID: <button type="button" onclick="fetchUUID()">UUID von Minecraftname</button></label><input type="text" id="uuid" required> <br>
                <label>Message:</label><input type="text" id="message" required>
            `;
            break;
        case 'DisplayMessageInChatAction':
            actionForm = `
                   <div class="color-grid">
        <div><span class="color-code" style="color: #000000;">§0</span> Schwarz</div>
        <div><span class="color-code" style="color: #0000AA;">§1</span> Dunkelblau</div>
        <div><span class="color-code" style="color: #00AA00;">§2</span> Dunkelgrün</div>
        <div><span class="color-code" style="color: #00AAAA;">§3</span> Dunkelaqua</div>
        <div><span class="color-code" style="color: #AA0000;">§4</span> Dunkelrot</div>
        <div><span class="color-code" style="color: #AA00AA;">§5</span> Dunkellila</div>
        <div><span class="color-code" style="color: #FFAA00;">§6</span> Gold</div>
        <div><span class="color-code" style="color: #AAAAAA;">§7</span> Grau</div>
        <div><span class="color-code" style="color: #555555;">§8</span> Dunkelgrau</div>
        <div><span class="color-code" style="color: #5555FF;">§9</span> Blau</div>
        <div><span class="color-code" style="color: #55FF55;">§a</span> Grün</div>
        <div><span class="color-code" style="color: #55FFFF;">§b</span> Aqua</div>
        <div><span class="color-code" style="color: #FF5555;">§c</span> Rot</div>
        <div><span class="color-code" style="color: #FF55FF;">§d</span> Lila</div>
        <div><span class="color-code" style="color: #FFFF55;">§e</span> Gelb</div>
        <div><span class="color-code" style="color: #FFFFFF;">§f</span> Weiß</div>
          <div><span class="obfuscated"</span>§k Obfuscated Text</div>
         <div><span  class="bold"</span>§l Fett</div>
         <div><span  class="strikethrough"</span>§m Durchgestrichen</div>
         <div><span  class="underline"</span>§n Unterstrichen</div>
         <div><span  class="italic"</span>§o Kursiv</div>
    </div><br>
                <label>IngameChat angezeigte Nachricht:</label><input type="text" id="message" required>
            `;
            break;
        case 'SystemPrintOutAction':
            actionForm = `
              
                <label>Log-Eintrag:</label><input type="text" id="message" required>
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
        <h3>Erstellen/Ändern: ${actionType}</h3>
        <form id="actionForm">
            ${actionForm}
            <button type="submit">speichern</button>
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
            case 'SystemPrintOutAction':
                document.getElementById('message').value = action.data.message;
                break;
            case 'DisplayMessageInChatAction':
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
                message: document.getElementById('message').value,
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
        case 'DisplayMessageInChatAction':
            actionData = {
                message: document.getElementById('message').value
            };
            break;
        case 'SystemPrintOutAction':
            actionData = {
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

/*function setupPopupHandling() {
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
}*/
function setupPopupHandling() {
    const popup = document.getElementById('actionPopup');
    const closeButton = document.getElementById('closePopup');

    // Ensure popup is hidden on page load
    popup.style.display = 'none';

    // Function to show popup (you can trigger this with a specific event like a button click)
    function showPopup() {
        popup.style.display = 'block';
    }

    // Function to close the popup
    function closePopup() {
        popup.style.display = 'none';
    }

    // Close the popup when clicking the close button
    closeButton.onclick = function () {
        closePopup();
    }

    // Example of how to trigger the popup (you can replace this with your actual trigger logic)
    document.getElementById('someTriggerButton').onclick = function () {
        showPopup();
    }
}

function importJsonFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Bitte wählen Sie eine JSON-Datei aus.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);

            // Überprüfen, ob das importierte JSON das richtige Format hat
            if (importedData && importedData.lampenevents) {
                events = importedData.lampenevents; // Importierte Events in das events-Array laden
                renderEventList(); // Liste der Events neu rendern
                updateJsonOutput(); // Aktualisiere die JSON-Ausgabe
                // alert('JSON erfolgreich importiert.');
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

function saveToFile() {
    // Überprüfen, ob Events vorhanden sind
    if (events.length === 0) {
        alert('Es gibt keine Events zum Speichern.');
        return;
    }

    // Konvertiere die Events in das richtige JSON-Format
    const data = JSON.stringify({lampenevents: events}, null, 4);

    // Erstelle ein Blob-Objekt mit den JSON-Daten
    const blob = new Blob([data], {type: 'application/json'});

    // Erstelle eine temporäre URL für die Datei
    const url = URL.createObjectURL(blob);

    // Erstelle ein verstecktes Download-Element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LampenEvents.json';  // Name der exportierten Datei

    // Füge das Download-Element zum DOM hinzu, klicke es, und entferne es dann
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Gib die URL frei
    URL.revokeObjectURL(url);
}

// Event-Listener für den Speichern-Button
document.getElementById('saveBtn').addEventListener('click', saveToFile);


/*function showEventDetails(eventIndex) {
    const event = events[eventIndex];
    alert(`Details für Event: ${event.displayname} (Zeit: ${event.time})`);
    // Hier könntest du weitere Logik einfügen, um ein Bearbeitungsformular anzuzeigen
}*/

// Function to render the event list with delete, edit, and copy options


function renderEventList() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear previous content

    events.forEach((event, index) => {

        const eventDiv = document.createElement('div');
        eventDiv.className = 'event drop-target';

        const eventDetails = document.createElement('div');
        //eventDetails.innerHTML = `<strong>${event.displayname}</strong> (${event.time}) <br> ${event.comment} `;
        eventDiv.innerHTML = `<strong>${event.displayname}</strong> ( ${event.lampeX},{event.lampeY},{event.lampeZ}) <br> ${event.comment} <br> <br> <br> `;

        eventDiv.appendChild(eventDetails);
        eventDiv.setAttribute('data-index', index);

        // Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Event editieren';
        editButton.className = 'editEvent';
        editButton.onclick = () => {
            editEvent(index);
        };
        eventDiv.appendChild(editButton);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Event löschen';
        deleteButton.className = 'deleteEvent';
        deleteButton.onclick = () => {
            deleteEvent(index);
        };
        eventDiv.appendChild(deleteButton);

        // Copy to clipboard button
       /* const copyButton = document.createElement('button');
        copyButton.textContent = 'kopieren';
        copyButton.onclick = () => {
            copyEventToClipboard(event);
        };
        eventDiv.appendChild(copyButton);*/

        // Liste der Actions für dieses Event rendern
        const actionList = document.createElement('ul');
        event.actions.forEach((action, actionIndex) => {
            const actionItem = document.createElement('li');
            var details = "keine Details verfügbar";
            var detailActionName = "?";
            if (action !== null) {
                switch (action.actionname) {
                    case 'PrivateMessageAction':
                        details = `<b>Player:</b> ${action.data.player}, <br><b>Message:</b></b> ${action.data.message}`;
                        detailActionName = "Private Nachricht";
                        break;
                    case 'ChatMessageAction':
                        details = `<b>Message:</b> ${action.data.message}`;
                        detailActionName = "Chat Nachricht";
                        break;
                    case 'CommandAction':
                        details = `<b>Command:</b> ${action.data.command}`;
                        detailActionName = "Command";
                        break;
                    case 'SendSimpleMessageWebhookAction':
                        details = `<b>Content:</b> ${action.data.content},<br> <b>Webhook URL:</b></b> ${action.data.webhookUrl}`;
                        detailActionName = "Webhook Nachricht";

                        break;
                    case 'EmbedDiscordAction':
                        details = `<b>Title:</b> ${action.data.title}, <br><b>Description:</b> ${action.data.description}, <br><b>Content:</b> ${action.data.content}, <br><b>Webhook URL:</b> ${action.data.webhookUrl}, <br><b>Color:</b> ${action.data.color}`;
                        detailActionName = "Discord Embed";

                        break;
                    case 'OfflinePayAction':
                        details = `<b>Player:</b> ${action.data.player},<br> <b>UUID:</b> ${action.data.uuid},<br> <b>Betrag:</b> ${action.data.betrag}`;
                        detailActionName = "Offline Pay";

                        break;
                    case 'OfflineMsgAction':
                        details = `<b>Player:</b> ${action.data.player}, <br><b>UUID:</b> ${action.data.uuid}, <br><b>Message:</b> ${action.data.message}`;
                        detailActionName = "Offline Nachricht";
                        break;
                    case 'SystemPrintOutAction':
                        details = `<b>Log-Eintrag:</b> ${action.data.message}`;
                        detailActionName = "Log-Eintrag";

                        break;
                    case 'DisplayMessageInChatAction':
                        details = `<b>IngameAnzeige:</b> ${action.data.message}`;
                        detailActionName = "Ingame Nachricht";

                        break;
                    case 'SetString':
                        details = `<b>Variable Name:</b> ${action.data.varname}, <b>Value:</b> ${action.data.value}`;
                        detailActionName = "Variable setzen";
                        break;
                    case "QuitClientAction":
                        detailActionName = "Client beenden";
                        break;
                    case "QuitServerAction":
                        detailActionName = "Server beenden";
                        break;
                }
            }

            actionItem.innerHTML = `
<div class="detailsheader"><b>${detailActionName}</b>
<div class="action-buttons-header">
 <button class="editAction" data-event-index="${index}" data-action-index="${actionIndex}">✎</button>
                <button class="deleteAction" data-event-index="${index}" data-action-index="${actionIndex}">🗑</button> </div></div>
               <div class="details">
                ${details}
                <p>Type: ${action.actiondisplayname}</p>
                </div>
            `;
            actionList.appendChild(actionItem);
        });

        eventDiv.appendChild(actionList);

        eventList.appendChild(eventDiv);

    });


    setupActionButtons(); // Editieren und Löschen für Actions einrichten
    setupDragAndDrop(); // Reinitialize drag-and-drop functionality
}

// Function to delete an event
function deleteEvent(eventIndex) {
    if (confirm('Willst du das Event wirklich löschen?')) {
        events.splice(eventIndex, 1); // Remove event from array
        renderEventList(); // Re-render event list
        updateJsonOutput(); // Update JSON output
    }
}

function editEvent(eventIndex) {
    const event = events[eventIndex];

    // Create the popup structure
    const popup = document.createElement('div');
    popup.className = 'popup';

    const popupContent = `
        <div class="popup-content">
            <h3>Event editieren</h3>
            <label for="popup-displayname">Anzeige Name:</label>
            <input type="text" id="popup-displayname" value="${event.displayname}">
            <label for="popup-comment">Kommentar:</label>
            <input type="text" id="popup-comment" value="${event.comment}">
            <label for="popup-time">Zeit:</label>
            <div  style="display: flex; gap: 10px;">
                <label for="lampX">Position Lampe X:</label>
                <input value="${event.lampX}" type="number" id="popup-lampX" required>

                <label for="lampY">Position Lampe Y:</label>
                <input value="${event.lampY}" type="number" id="popup-lampY" required>

                <label for="lampZ">Position Lampe Z:</label>
                <input value="${event.lampZ}" type="number" id="popup-lampZ" required>
            </div><br>
              <div style="display: flex; gap: 10px;>
                <label for="secCooldown">Cooldown in Sekunden:</label>
                <input type="number"  value="${event.secCooldown}" id="popup-secCooldown" required>

                <label for="allowLoop">Loop Erkennung:</label>
                <select id="popup-allowLoop" value="${event.allowLoop}" required>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </div>
            <div class="popup-buttons">
                <button id="popup-save">Speichern</button>
                <button id="popup-cancel">Abbrechen</button>
            </div>
        </div>
    `;

    popup.innerHTML = popupContent;
    document.body.appendChild(popup);

    // Handle Save button
    document.getElementById('popup-save').onclick = function () {
        event.displayname = document.getElementById('popup-displayname').value;
        event.comment = document.getElementById('popup-comment').value;
        event.lampX = document.getElementById('popup-lampX').value;
        event.lampY = document.getElementById('popup-lampY').value;
        event.lampZ = document.getElementById('popup-lampZ').value;
        event.secCooldown = document.getElementById('popup-secCooldown').value;
        event.allowLoop = document.getElementById('popup-allowLoop').value;

        renderEventList(); // Re-render the updated list
        updateJsonOutput();

        closePopup();
    };

    // Handle Cancel button
    document.getElementById('popup-cancel').onclick = function () {
        closePopup();
    };

    // Function to close the popup
    function closePopup() {
        document.body.removeChild(popup);
    }
}


// Function to edit an event
/*function editEvent(eventIndex) {
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
}*/

// Function to copy event details to clipboard
/*function copyEventToClipboard(event) {
    const eventText = `Event: ${event.displayname}\\nTime: ${event.time}\\nComment: ${event.comment}`;
    navigator.clipboard.writeText(eventText).then(() => {
        alert('Event details copied to clipboard');
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}*/

function updateJsonOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.textContent = JSON.stringify({lampenevents: events}, null, 4);
}

function initEventEditor() {
    document.getElementById('eventForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from refreshing the page

        const displaynametemp = document.getElementById('displayname').value;
        const displayname = displaynametemp.replace(/[^a-zA-Z0-9 _-]/g, '');

        const commenttemp = document.getElementById('comment').value;
        const comment = commenttemp.replace(/[^a-zA-Z0-9 _-]/g, '');


        const lampX = document.getElementById('lampX').value;
        const lampY = document.getElementById('lampY').value;
        const lampZ = document.getElementById('lampZ').value;

        const secCooldown = document.getElementById('secCooldown').value;
        const allowLoop = document.getElementById('allowLoop').value;

        const systemname = displayname.toLowerCase().replace(/[^a-z00-9]/g, '');

        const newEvent = {
            systemname: systemname,
            displayname: displayname,
            minimalReqVersion: 1,
            conditions: [],
            comment: comment || '',
            lampX: lampX,
            lampY: lampY,
            lampZ: lampZ,
            secCooldown: secCooldown,
            allowLoop: allowLoop,
            actions: []
        };

        events.push(newEvent);
        renderEventList();
        updateJsonOutput();

        document.getElementById('eventForm').reset();
    });
}

function copyToClipboard() {
    const jsonOutput = document.getElementById('jsonOutput');
    navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
        alert('JSON erfolgreich in die Zwischenablage kopiert!');
    }).catch(err => {
        console.error('Fehler beim Kopieren in die Zwischenablage:  ', err);
    });
}

function fetchUUID() {
    const playerName = document.getElementById('player').value;
    if (!playerName) {
        alert('Bitte gebe einen gültigen Spielernamen ein.');
        return;
    }

    const apiUrl = `https://api.qq4.de/uuid/api.php?name=${playerName}&bot=webeditor`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('uuid').value = data.uuid;
        })
        .catch(error => {
            console.error('Zu diesem Namen haben wir keine UUID, bitte finde diese selber raus!:', error);
            alert('Zu diesem Namen haben wir keine UUID, bitte finde diese selber raus!');
        });
}

function openURL() {
    var selectElement = document.getElementById("dropdown");
    var selectedValue = selectElement.value;
    if (selectedValue) {
        window.open(selectedValue, '_blank');
    }
}