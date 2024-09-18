let events = [];

document.addEventListener('DOMContentLoaded', () => {
    initEventEditor();
    setupDragAndDrop();
    setupPopupHandling();
    setupConditionButtons();
    setupConditionDragAndDrop(); //
});




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

    document.querySelectorAll('.moveActionUp').forEach(button => {
        //  console.log("Binding move up button", button); // Debugging Ausgabe
        button.addEventListener('click', (e) => {
            const eventIndex = e.target.getAttribute('data-event-index');
            const actionIndex = e.target.getAttribute('data-action-index');
            //  console.log('Move Up Clicked:', eventIndex, actionIndex);  // Weitere Debugging-Ausgabe
            moveActionUp(eventIndex, actionIndex);
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
        case 'BlockInteractAction':
            actionForm = `
                <label>BlockX:</label><input type="number" id="blockX" required>
                <label>BlockY:</label><input type="number" id="blockY" required>
                <label>BlockZ:</label><input type="number" id="blockZ" required>
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
            case 'BlockInteractAction':
                document.getElementById('blockX').value = action.data.blockX;
                document.getElementById('blockY').value = action.data.blockY;
                document.getElementById('blockZ').value = action.data.blockZ;
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
        case 'BlockInteractAction':
            actionData = {
                blockX: document.getElementById('blockX').value,
                blockY: document.getElementById('blockY').value,
                blockZ: document.getElementById('blockZ').value
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
            if (importedData && importedData.timeevents) {
                events = importedData.timeevents; // Importierte Events in das events-Array laden
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
    const data = JSON.stringify({timeevents: events}, null, 4);

    // Erstelle ein Blob-Objekt mit den JSON-Daten
    const blob = new Blob([data], {type: 'application/json'});

    // Erstelle eine temporäre URL für die Datei
    const url = URL.createObjectURL(blob);

    // Erstelle ein verstecktes Download-Element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TimeEvents.json';  // Name der exportierten Datei

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
        eventDiv.innerHTML = `<strong>${event.displayname}</strong> (${event.time}) <br> ${event.comment} <br> <br> <br> `;

        eventDiv.appendChild(eventDetails);
        eventDiv.setAttribute('data-index', index);

        // Rendering der Actions und Conditions, wie bereits beschrieben
      const conditionList = document.createElement('ul');
       /* event.conditions.forEach((condition, conditionIndex) => {
            const conditionItem = document.createElement('li');
            conditionItem.innerHTML = `
                <b>${condition.displayname}</b>
                <button class="editCondition" data-event-index="${index}" data-condition-index="${conditionIndex}">✎</button>
                <button class="deleteCondition" data-event-index="${index}" data-condition-index="${conditionIndex}">🗑</button>
            `;
            conditionList.appendChild(conditionItem);
        });*/

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

        // Copy Event button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Event kopieren';
        copyButton.className = 'copyEvent';
        copyButton.onclick = () => {
            copyEventToClipboard(index);
        };
        eventDiv.appendChild(copyButton);



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
                    case "BlockInteractAction":
                        details = `<b>BlockX:</b> ${action.data.blockX}, <b>BlockY:</b> ${action.data.blockY}, <b>BlockZ:</b> ${action.data.blockZ}`;
                        detailActionName = "Block Interaktion";
                        break;

                }
            }

            actionItem.innerHTML = `
<div class="detailsheader"><b>${detailActionName}</b>
<div class="action-buttons-header">

${actionIndex > 0 ? `<button class="moveActionUp" data-event-index="${index}" data-action-index="${actionIndex}" title="Aktion Reihenfolge nach oben schieben">▲</button>` : ''}

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

        // Liste der Conditions für dieses Event rendern

        event.conditions.forEach((condition, conditionIndex) => {
            const conditionItem = document.createElement('li');
            let details = `<b>Bedingung:</b> ${condition.displayname}, <b>Systemname: </b> ${condition.systemname}<br>`;
            if (condition.data && typeof condition.data === 'object') {
                details += `, Daten: ${JSON.stringify(condition.data)}`;
            }

            conditionItem.innerHTML = `
<div class="detailsheader-condition"><b>${condition.displayname}</b>
<div class="condition-buttons-header">
<button class="editCondition" data-event-index="${index}" data-condition-index="${conditionIndex}">✎</button>
<button class="deleteCondition" data-event-index="${index}" data-condition-index="${conditionIndex}">🗑</button> </div></div>
<div class="details">
    ${details}
</div>
            `;
            conditionList.appendChild(conditionItem);
        });

        eventDiv.appendChild(conditionList);

        eventList.appendChild(eventDiv);

    });
    setupConditionDragAndDrop();
    setupConditionButtons();
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
            <input type="time" id="popup-time" value="${event.time}">
            <div class="popup-buttons">
               
                <button id="popup-cancel">Abbrechen</button>
                 <button id="popup-save">Speichern</button>
            </div>
        </div>
    `;

    popup.innerHTML = popupContent;
    document.body.appendChild(popup);

    // Handle Save button
    document.getElementById('popup-save').onclick = function () {
        event.displayname = document.getElementById('popup-displayname').value;
        event.comment = document.getElementById('popup-comment').value;
        event.time = document.getElementById('popup-time').value;

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




// Function to copy event details to clipboard
function copyEventToClipboard(event) {
    const eventText = `Event: ${event.displayname}\\nTime: ${event.time}\\nComment: ${event.comment}`;
    navigator.clipboard.writeText(eventText).then(() => {
        alert('Event details copied to clipboard');
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

function updateJsonOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.textContent = JSON.stringify({timeevents: events}, null, 4);
}

function initEventEditor() {
    document.getElementById('eventForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from refreshing the page
        eventForm.style.display = 'none';
        const displaynametemp = document.getElementById('displayname').value;
        const displayname = displaynametemp.replace(/[^a-zA-Z0-9 _-]/g, '');

        const commenttemp = document.getElementById('comment').value;
        const comment = commenttemp.replace(/[^a-zA-Z0-9 _-]/g, '');


        const time = document.getElementById('time').value;

        const systemname = displayname.toLowerCase().replace(/[^a-z00-9]/g, '');

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
function showPasteEventPopup() {
    const popupHtml = `
        <div class="popup-content">
            <h3>Event einfügen</h3>
            <label for="pastedEvent">Füge das kopierte JSON hier ein:</label>
            <textarea id="pastedEvent" rows="10" cols="50"></textarea>
            <div class="popup-buttons">
                
                <button id="popup-cancel">Abbrechen</button>
                <button id="popup-ok">OK</button>
            </div>
        </div>
    `;

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = popupHtml;
    document.body.appendChild(popup);

    document.getElementById('popup-ok').onclick = function () {
        const pastedEventJson = document.getElementById('pastedEvent').value;
        try {
            const newEvent = JSON.parse(pastedEventJson);
            events.push(newEvent);
            renderEventList();
            updateJsonOutput();
            closePopup();
        } catch (error) {
            alert('Ungültiges JSON: ' + error.message);
        }
    };

    document.getElementById('popup-cancel').onclick = function () {
        closePopup();
    };

    function closePopup() {
        document.body.removeChild(popup);
    }
}

function copyEventToClipboard(eventIndex) {
    const event = events[eventIndex];
    const eventText = JSON.stringify(event, null, 4);
    navigator.clipboard.writeText(eventText).then(() => {
        alert('Event erfolgreich in die Zwischenablage kopiert.');
    }).catch(err => {
        alert('Fehler beim Kopieren: ' + err);
    });
}
function copyEventToClipboard(eventIndex) {
    const event = events[eventIndex];
    const eventText = JSON.stringify(event, null, 4);
    navigator.clipboard.writeText(eventText).then(() => {
        alert('Event erfolgreich in die Zwischenablage kopiert.');
    }).catch(err => {
        alert('Fehler beim Kopieren: ' + err);
    });
}

function showPasteEventPopup() {
    const popupHtml = `
        <div class="popup-content">
            <h3>Event einfügen</h3>
            <label for="pastedEvent">Füge das kopierte JSON hier ein:</label>
            <textarea id="pastedEvent" rows="10" cols="50"></textarea>
            <div class="popup-buttons">
               <button id="popup-cancel">Abbrechen</button>
                <button id="popup-ok">OK</button>
             
            </div>
        </div>
    `;

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = popupHtml;
    document.body.appendChild(popup);

    document.getElementById('popup-ok').onclick = function () {
        const pastedEventJson = document.getElementById('pastedEvent').value;
        try {
            const newEvent = JSON.parse(pastedEventJson);
            if (newEvent.hasOwnProperty('time')) {
                events.push(newEvent);
                renderEventList();
                updateJsonOutput();
                closePopup();
            } else {
                alert('Ungültiges JSON: ' + 'Angegebenes Event ist wohl kein Zeit Event');
            }
        } catch (error) {
            alert('Ungültiges JSON: ' + error.message);
        }
    };

    document.getElementById('popup-cancel').onclick = function () {
        closePopup();
    };

    function closePopup() {
        document.body.removeChild(popup);
    }
}

function moveActionUp(eventIndex, actionIndex) {
    const actions = events[eventIndex].actions;

    // Ensure the action isn't the first one
    if (actionIndex > 0 && actions[actionIndex] && actions[actionIndex - 1]) {
        const temp = actions[actionIndex];
        actions[actionIndex] = actions[actionIndex - 1];
        actions[actionIndex - 1] = temp;
        renderEventList();
        updateJsonOutput();
    } else {
        console.error('Action cannot be moved up. Either at the start of the list or action is undefined:', actionIndex);
    }
}






document.querySelectorAll('.moveActionUp').forEach(button => {
    button.addEventListener('click', (e) => {
        const eventIndex = e.target.getAttribute('data-event-index');
        const actionIndex = e.target.getAttribute('data-action-index');
        moveActionUp(eventIndex, actionIndex);
    });
});

document.getElementById('copyBtn').onclick = function() {
    copyToClipboard();
};


document.getElementById('toggleEventForm').addEventListener('click', function() {
    const eventForm = document.getElementById('eventForm');
    if (eventForm.style.display === 'none' || eventForm.style.display === '') {
        eventForm.style.display = 'block';
    } else {
        eventForm.style.display = 'none';
    }
});

function openTab(tabName) {
    // Alle tab-content-Elemente ausblenden
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Spalten ausblenden oder anzeigen
    if (tabName === 'actions') {
        document.getElementById("actionList").style.display = "block";  // Zeige mögliche Aktionen
    } else {
        document.getElementById("actionList").style.display = "none";   // Verstecke mögliche Aktionen
    }

    // Das ausgewählte Tab anzeigen
    document.getElementById(tabName).style.display = "block";
}

// Standardmäßig den "Mögliche Aktionen"-Tab anzeigen
document.getElementById("actions").style.display = "block";



/* Conditions */

// Initialisiere Drag-Start für Conditions
document.querySelectorAll('.condition').forEach(condition => {
    condition.addEventListener('dragstart', function(e) {
        console.log('Drag started for condition:', condition.innerText); // Debugging-Log
        e.dataTransfer.setData('text/plain', JSON.stringify({
            systemname: condition.getAttribute('data-action'),
            displayname: condition.innerText,
            minimalReqVersion: 1,
            data: "none"
        }));
    });
});



// Aktualisiere die Anzeige der Conditions im jeweiligen Event
function updateConditionsDisplay(eventElement, eventObj) {
    let conditionsContainer = eventElement.querySelector('.conditions-container');
    conditionsContainer.innerHTML = '';  // Leeren, um neu zu rendern

    eventObj.conditions.forEach((condition, index) => {
        let conditionElement = document.createElement('div');
        conditionElement.classList.add('condition-item');
        conditionElement.innerHTML = `
            <span>${condition.displayname}</span>
            <button class="edit-condition">Edit</button>
            <button class="delete-condition">Delete</button>
        `;

        // Löschen der Condition
        conditionElement.querySelector('.delete-condition').addEventListener('click', function() {
            eventObj.conditions.splice(index, 1);
            updateConditionsDisplay(eventElement, eventObj);  // Aktualisiere die Anzeige
            updateJsonOutput();  // Aktualisiere die JSON-Ausgabe
        });

        // Bearbeiten der Condition (hier kann eine Modalfunktion eingebaut werden)
        conditionElement.querySelector('.edit-condition').addEventListener('click', function() {
            console.log('Editing condition:', condition);
            // Hier kann eine Modal-Funktion für die Bearbeitung implementiert werden
        });

        conditionsContainer.appendChild(conditionElement);
    });
}

// Funktion zum Aktualisieren der JSON-Ausgabe
function updateJsonOutput() {
    document.getElementById('jsonOutput').textContent = JSON.stringify(events, null, 2);
}

// Füge Event-Listener zu bestehenden und neuen Events hinzu
addEventListenersToEvents();

function setupConditionButtons() {
    document.querySelectorAll('.editCondition').forEach(button => {
        button.addEventListener('click', function() {
            const eventIndex = button.getAttribute('data-event-index');
            const conditionIndex = button.getAttribute('data-condition-index');
            editCondition(eventIndex, conditionIndex);
        });
    });

    document.querySelectorAll('.deleteCondition').forEach(button => {
        button.addEventListener('click', function() {
            const eventIndex = button.getAttribute('data-event-index');
            const conditionIndex = button.getAttribute('data-condition-index');
            deleteCondition(eventIndex, conditionIndex);
        });
    });
}

// Initialisiere Drag-Start für alle Conditions
document.querySelectorAll('.condition').forEach(condition => {
    condition.addEventListener('dragstart', function(e) {
        console.log('Drag started for condition:', condition.innerText);
        e.dataTransfer.setData('text/plain', JSON.stringify({
            systemname: condition.getAttribute('data-action'),
            displayname: condition.innerText,
            minimalReqVersion: 1,
            data: "none" // Default-Daten für Conditions
        }));
    });
});

function addEventListenersToEvents() {
    document.querySelectorAll('.event').forEach(eventElement => {
        eventElement.addEventListener('dragover', function(e) {
            e.preventDefault();  // Ermöglicht das Drop
            console.log('Dragover on Event:', eventElement.innerText);
        });

        eventElement.addEventListener('drop', function(e) {
            e.preventDefault();
            console.log('Drop event triggered on:', eventElement.innerText);

            let conditionData = JSON.parse(e.dataTransfer.getData('text/plain'));

            let eventId = eventElement.getAttribute('data-index');
            let eventObj = events[eventId];  // Hole das richtige Event

            if (!eventObj) {
                console.error('Event nicht gefunden');
                return;
            }

            // Bedingung zur Event-Datenstruktur hinzufügen
            if (!eventObj.conditions) {
                eventObj.conditions = [];
            }

            eventObj.conditions.push(conditionData);
            console.log('Updated Event with new Condition:', eventObj);

            // Aktualisiere die Anzeige und die JSON-Ausgabe
            updateJsonOutput();
            renderEventList();  // Liste neu rendern, um die neue Condition anzuzeigen
        });
    });
}


function deleteCondition(eventIndex, conditionIndex) {
    // Condition löschen
    events[eventIndex].conditions.splice(conditionIndex, 1);
    renderEventList(); // Liste neu rendern
}

function renderConditionForm(condition, eventIndex, conditionIndex) {
    const formContainer = document.getElementById('conditionFormContainer');
    formContainer.innerHTML = ''; // Clear previous form content

    const form = document.createElement('form');
    form.id = 'conditionForm';

    // Header anzeigen
    const header = document.createElement('h3');
    header.textContent = `Editiere Bedingung: ${condition.displayname}`;
    form.appendChild(header);

    // Dynamisches Rendering basierend auf systemname
    switch (condition.systemname) {
        case 'isOnBotPos':
            form.innerHTML += `
                <label for="botPosition">Bot Position:</label>
                <input type="text" id="botPosition" value="${condition.data.botPosition || ''}" /><br>
            `;
            break;
       /* case 'isOnline':
            form.innerHTML += `
                <label for="userName">Benutzername:</label>
                <input type="text" id="userName" value="${condition.data.name || ''}" /><br>
            `;
            break;
        case 'isOffline':
            form.innerHTML += `
                <label for="userName">Benutzername:</label>
                <input type="text" id="userName" value="${condition.data.name || ''}" /><br>
            `;
            break;*/
        // Hier können weitere Cases für verschiedene Conditions hinzugefügt werden
        default:
            form.innerHTML += `<p>Keine spezifischen Daten erforderlich für ${condition.displayname}</p>`;
            break;
    }

    // Save button
    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Speichern';
    saveButton.onclick = () => saveConditionData(eventIndex, conditionIndex);
    form.appendChild(saveButton);

    formContainer.appendChild(form);
    showConditionPopup();
}
function saveConditionData(eventIndex, conditionIndex) {
    const condition = events[eventIndex].conditions[conditionIndex];

    // Basierend auf dem systemname die Eingabewerte übernehmen
    switch (condition.systemname) {
        case 'isNotOnBotPos':
           //condition.data.botPosition = document.getElementById('botPosition').value
            break;
        case 'isOnBotPos':
            condition.data.botPosition = document.getElementById('botPosition').value;
            break;
        case 'isOnline':
         //   condition.data.name = document.getElementById('userName').value;
            break;
        case 'isOffline':
         //   condition.data.name = document.getElementById('userName').value;
            break;
        // Weitere Cases für andere Conditions
    }

    // Event- und JSON-Ausgabe aktualisieren
    renderEventList();
    updateJsonOutput();
    closeConditionPopup();
}

function editCondition(eventIndex, conditionIndex) {
    const condition = events[eventIndex].conditions[conditionIndex];
    renderConditionForm(condition, eventIndex, conditionIndex);
}


function setupConditionDragAndDrop() {
    const conditionItems = document.querySelectorAll('#conditions .condition');
    const eventTargets = document.querySelectorAll('#eventList .event');

    conditionItems.forEach(conditionItem => {
        conditionItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('condition', e.target.getAttribute('data-action'));
            console.log('Condition Drag started:', e.target.getAttribute('data-action'));
        });
    });

    eventTargets.forEach(eventTarget => {
        eventTarget.addEventListener('dragover', (e) => {
            e.preventDefault();  // Ermöglicht das Drop
            console.log('Dragover on Event:', eventTarget.innerText);
        });

        eventTarget.addEventListener('drop', (e) => {
            e.preventDefault();

            const conditionType = e.dataTransfer.getData('condition');
            const eventIndex = e.target.getAttribute('data-index');

            if (conditionType && eventIndex !== null) {
                console.log('Condition dropped:', conditionType, 'on event', eventIndex);

                // Hinzufügen der Condition zum Event
                let conditionData = {
                    systemname: conditionType,
                    displayname: conditionType,
                    minimalReqVersion: 1,
                    data: {}
                };

                events[eventIndex].conditions.push(conditionData);

                renderEventList(); // Neu rendern, um die geänderten Events anzuzeigen
                updateJsonOutput();
            }
        });
    });
}
function showConditionPopup() {
    const conditionPopup = document.getElementById('conditionFormContainer');
    conditionPopup.style.display = 'block'; // Zeige das Popup an
}

// Funktion zum Schließen des Condition-Popups
function closeConditionPopup() {
    const conditionPopup = document.getElementById('conditionFormContainer');
    conditionPopup.style.display = 'none'; // Verstecke das Popup
}