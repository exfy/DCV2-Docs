// Funktion zum Rendern des Action-Formulars basierend auf dem Action-Typ
/*function renderActionForm(actionType, eventIndex) {
    let actionForm = '';
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

    const formContainer = document.getElementById('actionFormContainer');
    formContainer.innerHTML = `
        <h3>Fill Action: ${actionType}</h3>
        <form id="actionForm">
            ${actionForm}
            <button type="submit">Save Action</button>
        </form>
    `;

    // Event-Listener zum Speichern der Action-Daten
    document.getElementById('actionForm').addEventListener('submit', function (e) {
        e.preventDefault();
        saveActionToEvent(actionType, eventIndex);
    });
}

function saveActionToEvent(actionType, eventIndex, actionIndex = null) {
    let actionData = {};

    // Hier wird das Formular für jede mögliche Aktion basierend auf dem actionType verarbeitet
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
        case 'QuitClientAction':
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
            console.error(`Unbekannter Action-Typ: ${actionType}`);
            return;
    }

    // Speichern der Action in das Event
    const event = events[eventIndex];
    const newAction = {
        actionname: actionType,
        displayname: actionType, // Displayname kann angepasst werden
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
*/

