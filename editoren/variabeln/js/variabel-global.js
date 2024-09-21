const filterPopup = document.getElementById('filterPopup');
const filterText = document.getElementById('filterText');
const saveFilterButton = document.getElementById('saveFilter');
const closePopup = document.getElementById('closePopup');
const filterList = document.getElementById('filterList');
const jsonOutput = document.getElementById('jsonOutput');
const copyJsonButton = document.getElementById('copyJsonButton');
const saveJsonButton = document.getElementById('saveJsonButton');
let currentEditingFilterIndex = null;
let filters = [];

// Popup ist beim Laden der Seite nicht mehr sofort sichtbar
filterPopup.style.display = 'none';

// Event-Listener für die Filter auf der linken Seite
document.querySelectorAll('.event').forEach(item => {
    item.addEventListener('click', function() {
        const filter = item.getAttribute('data-filter');
        showPopup(filter); // Popup mit dem Filtertext öffnen
    });
});

// Speichern des Filters und Hinzufügen zur Liste, falls es nicht schon editiert wird
saveFilterButton.addEventListener('click', function() {
    if (filterText.value) {
        if (currentEditingFilterIndex !== -1 && currentEditingFilterIndex !== null) {
            // Wenn ein Filter bearbeitet wird, aktualisieren
            filters[currentEditingFilterIndex] = filterText.value;
        } else {
            // Neuer Filter hinzufügen
            filters.push(filterText.value);
        }
        updateFilterList();  // Liste der Filter aktualisieren
        updateJsonOutput();  // JSON-Ausgabe aktualisieren
        hidePopup();         // Popup schließen
    }
});

// Popup schließen, wenn man auf das X klickt
closePopup.addEventListener('click', hidePopup);

// Popup anzeigen und vorbereiten
function showPopup(filterTextValue) {
    filterPopup.style.display = 'block';
    filterText.value = filterTextValue || '';
    currentEditingFilterIndex = filters.indexOf(filterTextValue);
    if (currentEditingFilterIndex === -1) {
        currentEditingFilterIndex = null; // Wenn es ein neuer Filter ist
    }
}

// Popup schließen und Text leeren
function hidePopup() {
    filterPopup.style.display = 'none';
    filterText.value = '';
    currentEditingFilterIndex = null;
}

// Liste der Filter im Editor aktualisieren
function updateFilterList() {
    filterList.innerHTML = '';
    filters.forEach((filter, index) => {
        const li = document.createElement('li');
        li.textContent = filter;

        li.appendChild(createMoveUpButton(index)); // Button zum Hochverschieben
        li.appendChild(createDuplicateButton(index)); // Button zum Duplizieren
        li.appendChild(createEditButton(index));   // Button zum Bearbeiten
        li.appendChild(createDeleteButton(index)); // Button zum Löschen
        filterList.appendChild(li);
    });
}

// Bearbeiten eines Filters
function createEditButton(index) {
    const editButton = document.createElement('button');
    editButton.textContent = 'Bearbeiten';
    editButton.classList.add('editAction');
    editButton.addEventListener('click', function() {
        showPopup(filters[index]);
    });
    return editButton;
}

// Löschen eines Filters
function createDeleteButton(index) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Löschen';
    deleteButton.classList.add('deleteAction');
    deleteButton.addEventListener('click', function() {
        filters.splice(index, 1);  // Filter aus dem Array löschen
        updateFilterList();        // Filterliste aktualisieren
        updateJsonOutput();        // JSON-Ausgabe aktualisieren
    });
    return deleteButton;
}

// Duplizieren eines Filters
function createDuplicateButton(index) {
    const duplicateButton = document.createElement('button');
    duplicateButton.textContent = 'Duplizieren';
    duplicateButton.classList.add('duplicateAction');
    duplicateButton.addEventListener('click', function() {
        filters.push(filters[index]);  // Filter duplizieren
        updateFilterList();            // Filterliste aktualisieren
        updateJsonOutput();            // JSON-Ausgabe aktualisieren
    });
    return duplicateButton;
}

// Hochverschieben eines Filters in der Liste
function createMoveUpButton(index) {
    const moveUpButton = document.createElement('button');
    moveUpButton.textContent = 'Nach oben';
    moveUpButton.classList.add('moveUpAction');
    moveUpButton.addEventListener('click', function() {
        if (index > 0) {
            [filters[index - 1], filters[index]] = [filters[index], filters[index - 1]]; // Positionen tauschen
            updateFilterList();
            updateJsonOutput();
        }
    });
    return moveUpButton;
}

// Variablenname und Filter mit Farbcode zum JSON hinzufügen
document.getElementById('variableName').addEventListener('input', updateJsonOutput);
document.getElementById('filterWithColorCodes').addEventListener('change', updateJsonOutput);

// JSON-Ausgabe aktualisieren
function updateJsonOutput() {
    const variableName = document.getElementById('variableName').value;
    const filterWithColorCodes = document.getElementById('filterWithColorCodes').checked;

    const output = {
        variableName: variableName,
        filterWithColorCodes: filterWithColorCodes,
        filters: filters
    };

    jsonOutput.textContent = JSON.stringify(output, null, 4);
}

// JSON in die Zwischenablage kopieren
copyJsonButton.addEventListener('click', function() {
    const jsonText = jsonOutput.textContent;
    navigator.clipboard.writeText(jsonText).then(() => {
        alert('JSON kopiert!');
    }).catch(err => {
        alert('Fehler beim Kopieren des JSON');
    });
});

// JSON als Datei speichern
saveJsonButton.addEventListener('click', function() {
    const variableName = document.getElementById('variableName').value || 'Variabel';
    const jsonText = jsonOutput.textContent;
    const blob = new Blob([jsonText], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `DCV2-Variabel_${variableName}.json`;
    link.click();
});
