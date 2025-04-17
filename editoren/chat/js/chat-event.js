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
            if (newEvent.hasOwnProperty('regex')) {
                events.push(newEvent);
                renderEventList();
                updateJsonOutput();
                closePopup();
            } else {
                alert('Ungültiges JSON: ' + 'Angegebenes Event ist wohl kein Chat Event');
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
    updateJsonOutput();
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
             <label for="popup-regexWithColorCodes">Regex mit Farbcodes:</label>
            <select id="popup-regexWithColorCodes" required>
    <option value="false" ${event.regexWithColorCodes === 'false' ? 'selected' : ''}>Nein</option>
    <option value="true" ${event.regexWithColorCodes === 'true' ? 'selected' : ''}>Ja</option>
</select>

                <label for="popup-regex">RegEx:</label>
                <input type="text" id="popup-regex" value="${event.regex}">
                
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
        event.regexWithColorCodes = document.getElementById('popup-regexWithColorCodes').value;
        event.regex = [document.getElementById('popup-regex').value];


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
    const outputData = { chatevents: events };

    // Ausgabe als formatiertes JSON
    jsonOutput.textContent = JSON.stringify(outputData, null, 4);
}

function initEventEditor() {
    document.getElementById('eventForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from refreshing the page
        eventForm.style.display = 'none';
        const displaynametemp = document.getElementById('displayname').value;
        const displayname = displaynametemp.replace(/[^a-zA-Z0-9 _-]/g, '');

        const commenttemp = document.getElementById('comment').value;
        const comment = commenttemp.replace(/[^a-zA-Z0-9 _-]/g, '');


        const regexWithColorCodes = document.getElementById('regexWithColorCodes').value;
        const regex = document.getElementById('regex').value;


        const systemname = displayname.toLowerCase().replace(/[^a-z00-9]/g, '');

        const newEvent = {
            systemname: systemname,
            displayname: displayname,
            minimalReqVersion: 1,
            conditions: [],
            comment: comment || '',
            regexWithColorCodes: regexWithColorCodes,
            regex: [regex],
            variables: [],
            actions: []
        };


        events.push(newEvent);

        renderEventList();

        setupDeleteVariableButtons();
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
        eventDiv.innerHTML = `<strong>${event.displayname}</strong> <br> </br>${event.regex} <br> <i>${event.comment}</i> <br> <br> <br> `;

        eventDiv.appendChild(eventDetails);
        eventDiv.setAttribute('data-index', index);
        const variablesList = document.createElement('ul');
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

        //Variable einfügen Popup
        const varibaleButton = document.createElement('button');
        varibaleButton.textContent = 'Variable einfügen';
        varibaleButton.className = 'insertVariableEvent';
        varibaleButton.onclick = () => {
            insertChatVariable(index);
        };
        eventDiv.appendChild(varibaleButton);

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
                    case `CommandDelayAction`:
                        details = `<b>Command:</b> ${action.data.command}, <br><b>Delay:</b> ${action.data.delay}`;
                        detailActionName = "Command Delay";
                        break;
                    case 'CommandHoloAction':
                        details = `<b>Command:</b> ${action.data.command}}`;
                        detailActionName = "Command Holo Queue";
                        break;
                    case `MessageWithDelayAction`:
                        details = `<b>Message:</b> ${action.data.message}, <br><b>Delay:</b> ${action.data.delay}`;
                        detailActionName = "Message mit Delay";
                        break;
                    case `RandomMessageFromListAction`:
                        details = `<b>Message:</b> ${action.data.message}, <br><b>cmdPrio:</b> ${action.data.cmdPrio}`;
                        detailActionName = "Zufallsnachricht";
                        break;
                    case `JoinerStatusAction`:
                        details = `<b>Status:</b> ${action.data.status}`;
                        detailActionName = "Joiner Status";
                        break;
                    case `VeloStatusAction`:
                        details = `<b>Mode:</b> ${action.data.mode}, <br><b>Status:</b> ${action.data.status}`;
                        detailActionName = "Velo Status";
                        break;

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
                        detailActionName = "String setzen";
                        break;
                    case 'SetInt':
                        details = `<b>Variable Name:</b> ${action.data.varname}, <b>Value:</b> ${action.data.value}`;
                        detailActionName = "Int(Ganzzahl) setzen";
                        break;
                    case 'SetBoolean':
                        details = `<b>Variable Name:</b> ${action.data.varname}, <b>Value:</b> ${action.data.value}`;
                        detailActionName = "Boolean setzen";
                        break;
                    case 'AddToInt':
                        details = `<b>Variable Name:</b> ${action.data.varname}, <b>Value:</b> ${action.data.value}`;
                        detailActionName = "Add X to Int";
                        break;
                    case 'RemoveFromInt':
                        details = `<b>Variable Name:</b> ${action.data.varname}, <b>Value:</b> ${action.data.value}`;
                        detailActionName = "Remove X from Int";
                        break;
                    case 'IntPP':
                        details = `<b>Variable Name:</b> ${action.data.varname}`;
                        detailActionName = "Int+1";
                        break;
                    case 'IntMM':
                        details = `<b>Variable Name:</b> ${action.data.varname}`;
                        detailActionName = "Int-1 ";
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

        event.variables.forEach((variables, variablesIndex) => {
            const variablesItem = document.createElement('li');
            let details = `<b>mit ColorCodes:</b> ${variables.filterWithColorCodes}, <b>Filter: </b> ${variables.filters}<br>`;
            if (variables.data && typeof variables.data === 'object') {
                details += `, Daten: ${JSON.stringify(variables.data)}`;
            }

            // Create variable HTML
            variablesItem.innerHTML = `
                <div class="detailsheader-variables">
                    <b>${variables.variableName}</b>
                    <div class="variables-buttons-header">
                        <button class="deleteVariable" data-event-index="${index}" data-variables-index="${variablesIndex}">🗑</button>
                    </div>
                </div>
                <div class="details">${details}</div>
            `;
            variablesList.appendChild(variablesItem);
        });
        eventDiv.appendChild(variablesList);

        eventDiv.appendChild(conditionList);

        eventList.appendChild(eventDiv);

    });
    setupConditionDragAndDrop();
    setupConditionButtons();
    setupActionButtons(); // Editieren und Löschen für Actions einrichten
    setupDragAndDrop();
    setupDeleteVariableButtons();// Reinitialize drag-and-drop functionality
}

function manualEscape(str) {
    return str
        .replace(/\\/g, '\\\\')   // Backslashes escapen
        .replace(/"/g, '\\"')     // Doppelte Anführungszeichen escapen
        .replace(/\n/g, '\\n')    // Zeilenumbrüche escapen
        .replace(/\r/g, '\\r')    // Wagenrückläufe escapen
        .replace(/\t/g, '\\t');   // Tabs escapen
}

// Funktion zum Entescapen
function manualUnescape(str) {
    return str
        .replace(/\\\\/g, '\\')   // Backslashes entescapen
        .replace(/\\"/g, '"')     // Doppelte Anführungszeichen entescapen
        .replace(/\\n/g, '\n')    // Zeilenumbrüche entescapen
        .replace(/\\r/g, '\r')    // Wagenrückläufe entescapen
        .replace(/\\t/g, '\t');   // Tabs entescapen
}

function escapeJson() {
    const regexInput = document.getElementById('regex').value;
    const escapedJson = manualEscape(regexInput);
    document.getElementById('regex').value = escapedJson;
}

function unescapeJson() {
    const regexInput = document.getElementById('regex').value;
    const unescapedJson = manualUnescape(regexInput);
    document.getElementById('regex').value = unescapedJson;
}