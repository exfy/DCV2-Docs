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
/*function updateJsonOutput() {
    document.getElementById('jsonOutput').textContent = JSON.stringify(events, null, 2);
}*/

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
        case 'isWeekDay':
            form.innerHTML += `
                <label for="day">Wochentag:</label>
               <select id="day">
  <option value="Montag" ${condition.data.day === 'Montag' ? 'selected' : ''}>Montag</option>
  <option value="Dienstag" ${condition.data.day === 'Dienstag' ? 'selected' : ''}>Dienstag</option>
  <option value="Mittwoch" ${condition.data.day === 'Mittwoch' ? 'selected' : ''}>Mittwoch</option>
  <option value="Donnerstag" ${condition.data.day === 'Donnerstag' ? 'selected' : ''}>Donnerstag</option>
  <option value="Freitag" ${condition.data.day === 'Freitag' ? 'selected' : ''}>Freitag</option>
  <option value="Samstag" ${condition.data.day === 'Samstag' ? 'selected' : ''}>Samstag</option>
  <option value="Sonntag" ${condition.data.day === 'Sonntag' ? 'selected' : ''}>Sonntag</option>
</select><br>
            `;
            break;
        case "isTPS":
            form.innerHTML += `
            <label for="tps">TPS (Ganzzahl):</label>
            <input type="number" id="tps" value="${condition.data.tps || 0}" min="1" max="20" /><br>
                   
                   <label for="check">Prüfung auf:</label>
             <select id="check">
              <option value=">" ${condition.data.check === '>' ? 'selected' : ''}>größer als</option>
                <option value="<" ${condition.data.check === '<' ? 'selected' : ''}>kleiner als</option>
              </select><br>
             `;
            break;
        case "isOnServer":
            form.innerHTML += `
                <label for="server">auf CB?:</label>
               <select id="server">
  <option value="CB1" ${condition.data.server === 'CB1' ? 'selected' : ''}>CB1</option>
  <option value="CB2" ${condition.data.server === 'CB2' ? 'selected' : ''}>CB2</option>
  <option value="CB3" ${condition.data.server === 'CB3' ? 'selected' : ''}>CB3</option>
  <option value="CB4" ${condition.data.server === 'CB4' ? 'selected' : ''}>CB4</option>
  <option value="CB5" ${condition.data.server === 'CB5' ? 'selected' : ''}>CB5</option>
  <option value="CB6" ${condition.data.server === 'CB6' ? 'selected' : ''}>CB6</option>
  <option value="CB7" ${condition.data.server === 'CB7' ? 'selected' : ''}>CB7</option>
    <option value="CB8" ${condition.data.server === 'CB8' ? 'selected' : ''}>CB8</option>
    <option value="CB9" ${condition.data.server === 'CB9' ? 'selected' : ''}>CB9</option>
    <option value="CB10" ${condition.data.server === 'CB10' ? 'selected' : ''}>CB10</option>
    <option value="CB11" ${condition.data.server === 'CB11' ? 'selected' : ''}>CB11</option>
    <option value="CB12" ${condition.data.server === 'CB12' ? 'selected' : ''}>CB12</option>
    <option value="CB13" ${condition.data.server === 'CB13' ? 'selected' : ''}>CB13</option>
    <option value="CB14" ${condition.data.server === 'CB14' ? 'selected' : ''}>CB14</option>
    <option value="CB15" ${condition.data.server === 'CB15' ? 'selected' : ''}>CB15</option>
    <option value="CB16" ${condition.data.server === 'CB16' ? 'selected' : ''}>CB16</option>
    <option value="CB17" ${condition.data.server === 'CB17' ? 'selected' : ''}>CB17</option>
    <option value="CB18" ${condition.data.server === 'CB18' ? 'selected' : ''}>CB18</option>
    <option value="CB19" ${condition.data.server === 'CB19' ? 'selected' : ''}>CB19</option>
    <option value="CB20" ${condition.data.server === 'CB20' ? 'selected' : ''}>CB20</option>
    <option value="CB21" ${condition.data.server === 'CB21' ? 'selected' : ''}>CB21</option>
    <option value="CB22" ${condition.data.server === 'CB22' ? 'selected' : ''}>CB22</option>
    <option value="Nature" ${condition.data.server === 'Nature' ? 'selected' : ''}>Nature</option>
    <option value="Extreme" ${condition.data.server === 'Extreme' ? 'selected' : ''}>Extreme</option>
    <option value="Event" ${condition.data.server === 'Event' ? 'selected' : ''}>Event</option>
    <option value="CBE" ${condition.data.server === 'CBE' ? 'selected' : ''}>CBE</option>
</select><br>
            `;

            break;
        case "isMoney":
            form.innerHTML += `
            <label for="value">Geld (Ganzzahl):</label>
            <input type="number" id="value" value="${condition.data.value || 0}" min="1" /><br>
            
               <label for="check">Geld (Ganzzahl):</label>
             <select id="check">
              <option value=">" ${condition.data.check === '>' ? 'selected' : ''}>größer als</option>
                <option value="<" ${condition.data.check === '<' ? 'selected' : ''}>kleiner als</option>
              </select><br>
              
                  <label for="mode">Modus:</label>
             <select id="mode">
              <option value="bank" ${condition.data.mode === '>' ? 'selected' : ''}>Bank Money</option>
                <option value="money" ${condition.data.mode === '<' ? 'selected' : ''}>Hand Money</option>
              </select><br>
              
               
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
        case "isWeekDay":
            condition.data.day = document.getElementById('day').value;
            break;
        case "isTPS":
            condition.data.check = document.getElementById('check').value;
            condition.data.tps = document.getElementById('tps').value;
            break;
        case "isOnServer":
            condition.data.server = document.getElementById('server').value;
            break;
        case "isMoney":
            condition.data.mode = document.getElementById('mode').value;
            condition.data.check = document.getElementById('check').value;
            condition.data.value = document.getElementById('value').value;
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