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
            if (newEvent.hasOwnProperty('lampX')) {
                events.push(newEvent);
                renderEventList();
                updateJsonOutput();
                closePopup();
            } else {
                alert('Ungültiges JSON: ' + 'Angegebenes Event ist wohl kein Lampen Event');
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

//copy event

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
            <label for="popup-time">Position der Lampe:</label>
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



/*
// Function to copy event details to clipboard
function copyEventToClipboard(event) {
    const eventText = `Event: ${event.displayname}\\nTime: ${event.time}\\nComment: ${event.comment}`;
    navigator.clipboard.writeText(eventText).then(() => {
        alert('Event details copied to clipboard');
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}
*/
function updateJsonOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    jsonOutput.textContent = JSON.stringify({lampenevents: events}, null, 4);
}

function initEventEditor() {
    document.getElementById('eventForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from refreshing the page
        eventForm.style.display = 'none';
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



/* Event list
    * Event list is a list of all events that have been added by the user.
 */


function renderEventList() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear previous content

    events.forEach((event, index) => {

        const eventDiv = document.createElement('div');
        eventDiv.className = 'event drop-target';


        const eventDetails = document.createElement('div');
        //eventDetails.innerHTML = `<strong>${event.displayname}</strong> (${event.time}) <br> ${event.comment} `;
        eventDiv.innerHTML = `<strong>${event.displayname}</strong> (X: ${event.lampX}, Y: ${event.lampY}, Z: ${event.lampZ}) <br> ${event.comment} <br> <br> <br> `;

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
