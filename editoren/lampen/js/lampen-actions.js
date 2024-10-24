// Standardmäßig den "Mögliche Aktionen"-Tab anzeigen
document.getElementById("actions").style.display = "block";

// Move Actions up and down
document.querySelectorAll('.moveActionUp').forEach(button => {
    button.addEventListener('click', (e) => {
        const eventIndex = e.target.getAttribute('data-event-index');
        const actionIndex = e.target.getAttribute('data-action-index');
        moveActionUp(eventIndex, actionIndex);
    });
});

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


//uuid fetch
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
                                <select id="blockType" required>
  <option value="block">Block (Knopf/Schalter)</option>
 <!--<option value="itemframe">Itemframe</option> -->
</select>
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
        case 'SetInt':
            actionForm = `
                <label>Variable Name:</label><input type="text" id="varname" required> 
                <label>Value:</label><input type="text" id="value" required>
            `;
            break;
        case 'SetBoolean':
            actionForm = `
                <label>Variable Name:</label><input type="text" id="varname" required>
                <label>Value:</label><input type="text" id="value" required>
            `;
            break;
        case 'AddToInt':
            actionForm = `
                <label>Variable Name:</label><input type="text" id="varname" required>
                <label>Value:</label><input type="text" id="value" required>
            `;
            break;
        case 'RemoveFromInt':
            actionForm = `
                <label>Variable Name:</label><input type="text" id="varname" required> 
                <label>Value:</label><input type="text" id="value" required>
            `;
            break;
        case 'IntMM':
            actionForm = `
                <label>Variable Name:</label><input type="text" id="varname" required>
            `;
            break;
        case 'IntPP':
            actionForm = `
                <label>Variable Name:</label><input type="text" id="varname" required>
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
                document.getElementById('blockType').value = action.data.blockType;
                break;

            case 'SetString':
                document.getElementById('varname').value = action.data.varname;
                document.getElementById('value').value = action.data.value;
                break;
            case 'SetInt':
                document.getElementById('varname').value = action.data.varname;
                document.getElementById('value').value = action.data.value;
                break;
            case 'SetBoolean':
                document.getElementById('varname').value = action.data.varname;
                document.getElementById('value').value = action.data.value;
                break;
            case 'AddToInt':
                document.getElementById('varname').value = action.data.varname;
                document.getElementById('value').value = action.data.value;
                break;
            case 'RemoveFromInt':
                document.getElementById('varname').value = action.data.varname;
                document.getElementById('value').value = action.data.value;
                break;
            case 'IntMM':
                document.getElementById('varname').value = action.data.varname;
                break;
            case 'IntPP':
                document.getElementById('varname').value = action.data.varname;
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
                blockZ: document.getElementById('blockZ').value,
                blockType: document.getElementById('blockType').value
            };
            break;
        case 'SetString':
            actionData = {
                varname: document.getElementById('varname').value,
                value: document.getElementById('value').value
            };
            break;
        case 'SetInt':
            actionData = {
                varname: document.getElementById('varname').value,
                value: document.getElementById('value').value
            };
            break;
        case 'SetBoolean':
            actionData = {
                varname: document.getElementById('varname').value,
                value: document.getElementById('value').value
            };
            break;
        case 'AddToInt':
            actionData = {
                varname: document.getElementById('varname').value,
                value: document.getElementById('value').value
            };
            break
        case 'RemoveFromInt':
            actionData = {
                varname: document.getElementById('varname').value,
                value: document.getElementById('value').value
            };
            break
        case 'IntMM':
            actionData = {
                varname: document.getElementById('varname').value

            };
            break
        case 'IntPP':
            actionData = {
                varname: document.getElementById('varname').value
            };
            break
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
