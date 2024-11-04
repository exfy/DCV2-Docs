let events = [];


document.addEventListener('DOMContentLoaded', () => {
    initEventEditor();
    setupDragAndDrop();
    setupPopupHandling();
    setupConditionButtons();
    setupConditionDragAndDrop();
  //  setupVariablesButtons();//
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

document.getElementById('copyBtn').onclick = function() {
    copyToClipboard();
};

// actions / conditions tab
document.getElementById('toggleEventForm').addEventListener('click', function() {
    const eventForm = document.getElementById('eventForm');
    if (eventForm.style.display === 'none' || eventForm.style.display === '') {
        eventForm.style.display = 'block';
    } else {
        eventForm.style.display = 'none';
    }
});


//copy
function copyEventToClipboard(eventIndex) {
    const event = events[eventIndex];
    const eventText = JSON.stringify(event, null, 4);
    navigator.clipboard.writeText(eventText).then(() => {
        alert('Event erfolgreich in die Zwischenablage kopiert.');
    }).catch(err => {
        alert('Fehler beim Kopieren: ' + err);
    });
}

//editor links
function openURL() {
    var selectElement = document.getElementById("dropdown");
    var selectedValue = selectElement.value;
    if (selectedValue) {
        window.open(selectedValue, '_blank');
    }
}

// strg +c
function copyToClipboard() {
    const jsonOutput = document.getElementById('jsonOutput');
    navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
        alert('JSON erfolgreich in die Zwischenablage kopiert!');
    }).catch(err => {
        console.error('Fehler beim Kopieren in die Zwischenablage:  ', err);
    });
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
            if (importedData && importedData.ankaufevents) {
                events = importedData.ankaufevents; // Importierte Events in das events-Array laden
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
    const data = JSON.stringify({ankaufevents: events}, null, 4);

    // Erstelle ein Blob-Objekt mit den JSON-Daten
    const blob = new Blob([data], {type: 'application/json'});

    // Erstelle eine temporäre URL für die Datei
    const url = URL.createObjectURL(blob);

    // Erstelle ein verstecktes Download-Element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AfterPurchaseEvent.json';  // Name der exportierten Datei

    // Füge das Download-Element zum DOM hinzu, klicke es, und entferne es dann
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Gib die URL frei
    URL.revokeObjectURL(url);
}

// Event-Listener für den Speichern-Button
document.getElementById('saveBtn').addEventListener('click', saveToFile);


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
   /* document.getElementById('someTriggerButton').onclick = function () {
        showPopup();
    }*/
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
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const inputField = this.nextElementSibling.nextElementSibling;
        if (this.checked) {
            inputField.disabled = false;
        } else {
            inputField.disabled = true;
            inputField.value = ''; // Inhalt löschen
            if (inputField.tagName === 'TEXTAREA') {
                inputField.value = ''; // Inhalt bei Textarea löschen
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Entferne die erneute Initialisierung von events
    // events ist bereits global definiert

    let editor = null;
    let isValidJson = true;

    // Finde das jsonOutput-Element und ersetze es durch eine Textarea für den Editor
    const jsonOutputDiv = document.getElementById('jsonOutput');
    const textarea = document.createElement('textarea');
    textarea.style.display = "none"; // Verstecke das Textarea-Element
    jsonOutputDiv.appendChild(textarea);

    // Hinweistext für ungültiges JSON hinzufügen
    const warningText = document.createElement('div');
    warningText.style.color = 'red';
    warningText.style.display = 'none';
    warningText.textContent = 'Ungültiges JSON! Bitte korrigieren.';
    jsonOutputDiv.insertBefore(warningText, textarea);

    // Knopf zum Formatieren des JSON hinzufügen
    const formatButton = document.createElement('button');
    formatButton.textContent = 'JSON Formatieren';
    formatButton.onclick = () => {
        try {
            const formattedJson = JSON.stringify(JSON.parse(editor.getValue()), null, 2);
            editor.setValue(formattedJson);
            warningText.style.display = 'none'; // Verstecke den Warnhinweis
        } catch (e) {
            warningText.style.display = 'block'; // Zeige den Warnhinweis an
        }
    };
    jsonOutputDiv.insertBefore(formatButton, textarea);

    // Knopf zum Kopieren des JSON hinzufügen
    const copyButton = document.createElement('button');
    copyButton.textContent = 'JSON Kopieren';
    copyButton.onclick = () => {
        navigator.clipboard.writeText(editor.getValue())
            .then(() => {
                alert('JSON wurde in die Zwischenablage kopiert!');
            })
            .catch(err => {
                console.error('Fehler beim Kopieren:', err);
                alert('Fehler beim Kopieren des JSON.');
            });
    };
    jsonOutputDiv.insertBefore(copyButton, textarea);

    // Initialisiere CodeMirror mit dem Textarea-Element und dem Dark Theme
    editor = CodeMirror.fromTextArea(textarea, {
        mode: { name: 'javascript', json: true },
        lineNumbers: true,
        theme: 'material', // Dark Theme verwenden
        tabSize: 2,
        autoCloseBrackets: true
    });

    // Setze den initialen Inhalt von CodeMirror
    editor.setValue(JSON.stringify({ ankaufevents: events }, null, 2));

    // Funktion zum Ermitteln der Fehlerdetails
    function getJsonErrorDetails(jsonString, error) {
        const errorMessage = error.message;
        const lineMatch = errorMessage.match(/line (\d+)/);
        const lineNumber = lineMatch ? parseInt(lineMatch[1], 10) : null;
        return lineNumber ? `Fehler in Zeile ${lineNumber}: ${errorMessage}` : `JSON-Fehler: ${errorMessage}`;
    }

    // Ereignislistener, um events zu aktualisieren, wenn der Editor geändert wird
    editor.on('change', () => {
        try {
            // Parse den Inhalt des Editors und extrahiere dynamicbuttonevents
            const updatedContent = JSON.parse(editor.getValue());

            // Aktualisiere events mit dem geänderten Inhalt
            if (updatedContent && Array.isArray(updatedContent.ankaufevents)) {
                events = updatedContent.ankaufevents; // Aktualisiere die bestehende events-Variable
                renderEventList(); // Aktualisiert die Anzeige der Event-Liste
                warningText.style.display = 'none'; // Verstecke den Warnhinweis
                isValidJson = true;
            } else {
                throw new Error('Ungültiges JSON-Format: dynamicbuttonevents ist kein Array oder fehlt.');
            }
        } catch (e) {
            console.error('Fehler beim Parsen des JSON:', e); // Fehler beim Parsen
            warningText.style.display = 'block'; // Zeige den Warnhinweis an
            warningText.textContent = getJsonErrorDetails(editor.getValue(), e);
            isValidJson = false;
        }
    });

    // Funktion zum Aktualisieren des Editors mit der aktuellen events-Variable
    function updateJsonOutput() {
        editor.setValue(JSON.stringify({ ankaufevents: events }, null, 2));
    }

    // Initialisiere die Event-Liste bei Laden der Seite
    renderEventList();

    // Mach updateJsonOutput global verfügbar, falls erforderlich
    window.updateJsonOutput = updateJsonOutput;
});




function updateJsonOutput() {
    // Aktualisiere den JSON-Text im HTML-Element
    const jsonOutput = document.getElementById('jsonOutput');
    //jsonOutput.textContent = JSON.stringify({ dynamicbuttonevents: events }, null, 4);

    // Stelle sicher, dass der editor global verfügbar ist und aktualisiere ihn
    if (window.editor) {
        window.editor.setValue(JSON.stringify({ankaufevents: events}, null, 2));
        renderEventList();
    } else {
        console.error("Editor ist nicht definiert.");
    }
}
