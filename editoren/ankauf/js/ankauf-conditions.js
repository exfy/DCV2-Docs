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