document.addEventListener('DOMContentLoaded', function() {

    const filterPopup = document.getElementById('filterPopup');
    const filterText = document.getElementById('filterText');
    const saveFilterButton = document.getElementById('saveFilter');
    const closePopup = document.getElementById('closePopup');
    const filterList = document.getElementById('filterList');
    const filterResults = document.getElementById('filterResults');
    const jsonOutput = document.getElementById('jsonOutput');
    const copyJsonButton = document.getElementById('copyJsonButton');
    const saveJsonButton = document.getElementById('saveJsonButton');
    const regexInput = document.getElementById('regexInput');
    const stringInput = document.getElementById('stringInput');
    const errorOutput = document.getElementById('errorOutput');
    let currentEditingFilterIndex = null;
    let filters = [];
    let errorMessage = "";

    // Popup ist beim Laden der Seite nicht mehr sofort sichtbar
    filterPopup.style.display = 'none';

    // Event-Listener für die Filter auf der linken Seite
    document.querySelectorAll('.event').forEach(item => {
        item.addEventListener('click', function() {
            const filter = item.getAttribute('data-filter');
            addFilter(filter); // Filter direkt zur Liste hinzufügen
        });
    });

    function addFilter(filterTextValue) {
        filters.push(filterTextValue);
        updateFilterList();  // Liste der Filter aktualisieren
        updateJsonOutput();  // JSON-Ausgabe aktualisieren
        updateFilterResults();  // Filterergebnisse aktualisieren
    }

    // Popup schließen, wenn man auf das X klickt
    closePopup.addEventListener('click', hidePopup);

    function hidePopup() {
        filterPopup.style.display = 'none';
        filterText.value = '';
        currentEditingFilterIndex = null;
    }

    // Popup für das Bearbeiten eines Filters anzeigen
    function showPopupForEditFilter(index) {
        filterPopup.style.display = 'block';
        filterText.value = filters[index];
        currentEditingFilterIndex = index;  // Bearbeiten des vorhandenen Filters
    }

    // Speichern eines bearbeiteten Filters
    saveFilterButton.addEventListener('click', function() {
        if (currentEditingFilterIndex !== null && filterText.value) {
            filters[currentEditingFilterIndex] = filterText.value; // Filter aktualisieren
            updateFilterList();  // Liste der Filter aktualisieren
            updateJsonOutput();  // JSON-Ausgabe aktualisieren
            updateFilterResults();  // Filterergebnisse aktualisieren
            hidePopup(); // Popup schließen
        }
    });

    // Liste der Filter im Editor aktualisieren
    function updateFilterList() {
        filterList.innerHTML = '';
        filters.forEach((filter, index) => {
            const div = document.createElement('div');
            div.classList.add('filter-item');
            div.textContent = filter;

            div.appendChild(createMoveUpButton(index)); // Button zum Hochverschieben
            div.appendChild(createDuplicateButton(index)); // Button zum Duplizieren
            div.appendChild(createEditButton(index));   // Button zum Bearbeiten
            div.appendChild(createDeleteButton(index)); // Button zum Löschen
            filterList.appendChild(div);
        });
    }

    // Button zum Bearbeiten eines Filters erstellen
    function createEditButton(index) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Bearbeiten';
        editButton.classList.add('editAction');
        editButton.addEventListener('click', function() {
            showPopupForEditFilter(index);  // Filter bearbeiten
        });
        return editButton;
    }

    // Button zum Löschen eines Filters erstellen
    function createDeleteButton(index) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.classList.add('deleteAction');
        deleteButton.addEventListener('click', function() {
            filters.splice(index, 1);  // Filter aus dem Array löschen
            updateFilterList();        // Filterliste aktualisieren
            updateJsonOutput();        // JSON-Ausgabe aktualisieren
            updateFilterResults();     // Filterergebnisse aktualisieren
        });
        return deleteButton;
    }

    // Button zum Duplizieren eines Filters erstellen
    function createDuplicateButton(index) {
        const duplicateButton = document.createElement('button');
        duplicateButton.textContent = 'Duplizieren';
        duplicateButton.classList.add('duplicateAction');
        duplicateButton.addEventListener('click', function() {
            filters.push(filters[index]);  // Filter duplizieren
            updateFilterList();            // Filterliste aktualisieren
            updateJsonOutput();            // JSON-Ausgabe aktualisieren
            updateFilterResults();         // Filterergebnisse aktualisieren
        });
        return duplicateButton;
    }

    // Button zum Hochverschieben eines Filters erstellen
    function createMoveUpButton(index) {
        const moveUpButton = document.createElement('button');
        moveUpButton.textContent = 'Nach oben';
        moveUpButton.classList.add('moveUpAction');
        moveUpButton.addEventListener('click', function() {
            if (index > 0) {
                [filters[index - 1], filters[index]] = [filters[index], filters[index - 1]]; // Positionen tauschen
                updateFilterList();
                updateJsonOutput();
                updateFilterResults();
            }
        });
        return moveUpButton;
    }

    // Anwenden der Filter auf den String
    function applyFilters() {
        const baseString = stringInput.value;
        let modifiedString = baseString;
        let filterResultList = [];
        errorMessage = ""; // Fehlerausgabe zurücksetzen

        try {
            filters.forEach((filter, index) => {
                let resultBefore = modifiedString;
                if (filter.includes("replaceAll")) {
                    const searchFor = filter.substring(filter.indexOf("(") + 1, filter.indexOf(","));
                    const replaceWith = filter.substring(filter.indexOf(",") + 1, filter.indexOf(")"));
                    modifiedString = modifiedString.replace(new RegExp(searchFor, "g"), replaceWith);
                }

                if (filter.includes("replaceFirst")) {
                    const searchFor = filter.substring(filter.indexOf("(") + 1, filter.indexOf(","));
                    const replaceWith = filter.substring(filter.indexOf(",") + 1, filter.indexOf(")"));
                    modifiedString = modifiedString.replace(searchFor, replaceWith);
                }

                if (filter.includes("toLowerCase")) {
                    modifiedString = modifiedString.toLowerCase();
                }

                if (filter.includes("toUpperCase")) {
                    modifiedString = modifiedString.toUpperCase();
                }

                if (filter.includes("substring")) {
                    const start = parseInt(filter.substring(filter.indexOf("(") + 1, filter.indexOf(",")));
                    const end = parseInt(filter.substring(filter.indexOf(",") + 1, filter.indexOf(")")));
                    modifiedString = modifiedString.substring(start, end);
                }

                if (filter.includes("split")) {
                    const parameters = filter.substring(filter.indexOf("(") + 1, filter.indexOf(")")).split(",");
                    // Prüfen, ob das Trennzeichen als Leerzeichen gemeint ist
                    const splitBy = parameters[0].trim() === "" ? " " : parameters[0].trim(); // Wenn kein Trennzeichen vorhanden ist, Leerzeichen verwenden
                    const splitIndex = parseInt(parameters[1].trim());

                    // Aufteilen des Strings
                    const splitParts = modifiedString.split(splitBy);

                    // Sicherstellen, dass der Index im Bereich der Split-Teile liegt
                    if (splitIndex >= 0 && splitIndex < splitParts.length) {
                        modifiedString = splitParts[splitIndex];
                    } else {
                        modifiedString = ""; // Rückgabe leerer String, wenn Index ungültig ist
                    }
                }
                if (filter.includes("regExGroup")) {
                    // RegEx Muster aus dem Eingabefeld lesen (ohne Slashes)
                    let regexPatternInput = document.getElementById('regexInput').value;
                    console.log("RegEx Input:", regexPatternInput); // Debugging

                    // JSON Escaping für \ und / entfernen
                    let regexPatternString = removeJsonEscaping(regexPatternInput);
                    console.log("RegEx after JSON escaping:", regexPatternString); // Debugging

                    // Zu filternder String aus dem Eingabefeld lesen
                    let stringInput = document.getElementById('stringInput').value;
                    console.log("String Input:", stringInput); // Debugging

                    try {
                        // RegEx Muster dynamisch erstellen (ohne umschließende Slashes)
                        let regexPattern = new RegExp(regexPatternString);
                        console.log("RegEx Object:", regexPattern); // Debugging

                        const groupIndex = parseInt(filter.substring(filter.indexOf("(") + 1, filter.indexOf(")")).trim());
                        console.log("Group Index:", groupIndex); // Debugging

                        // Wende den RegEx auf den zu filternden String an
                        const regexMatch = stringInput.match(regexPattern);
                        console.log("Regex Match:", regexMatch); // Debugging

                        // Sicherstellen, dass ein Match existiert und die Gruppe vorhanden ist
                        if (regexMatch && regexMatch[groupIndex]) {
                            modifiedString = regexMatch[groupIndex];
                            console.log("Modified String (Matched Group):", modifiedString); // Debugging
                        } else {
                            console.log("No match or group index found.");
                            modifiedString = ""; // Rückgabe leerer String, wenn keine Übereinstimmung vorhanden ist
                        }
                    } catch (e) {
                        console.error("Error creating or applying RegEx:", e); // Fehlerbehandlung
                    }
                }


// Ausgabe des modifizierten Strings
                console.log(modifiedString);

                if (filter.includes("trim")) {
                    modifiedString = modifiedString.trim();
                }

                // Speichere das Ergebnis für den Filter
                filterResultList.push({
                    filter: filter,
                    before: resultBefore,
                    after: modifiedString
                });
            });
        } catch (error) {
            errorMessage = error.message; // Fehler speichern
        }

        return filterResultList;
    }

    // Ergebnis der Filter anzeigen
    function updateFilterResults() {
        const results = applyFilters();
        filterResults.innerHTML = ''; // Lösche alte Ergebnisse
        results.forEach(result => {
            const div = document.createElement('div');
            div.classList.add('filter-result');
            div.innerHTML = `
                <strong>Filter:</strong> ${result.filter}<br/>
                <strong>Vor Filter:</strong> ${result.before}<br/>
                <strong>Nach Filter:</strong> ${result.after}<br/>
            `;
            filterResults.appendChild(div);
        });
        errorOutput.textContent = errorMessage; // Fehler anzeigen
    }

    // String- und RegEx-Eingabe überwachen
    stringInput.addEventListener('input', updateFilterResults);
    regexInput.addEventListener('input', updateFilterResults);

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
        if (!allowCopy) {
            alert('Kopieren nicht erlaubt. Überprüfe die Eingabe.');
            return;
        }

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

});

function removeJsonEscaping(pattern) {
    return pattern.replace(/\\\\/g, "\\").replace(/\\\//g, "/");
}
let allowCopy = false; // Anfangs nicht erlaubt

document.getElementById('variableName').addEventListener('input', function() {
    const inputField = this;
    const pattern = /^[a-zA-Z0-9_]+$/;
    const isValid = pattern.test(inputField.value);

    if (isValid) {
        inputField.style.borderColor = 'green';
        allowCopy = true; // Kopieren erlauben
    } else {
        inputField.style.borderColor = 'red';
        allowCopy = false; // Kopieren verbieten
    }
});
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
    const regexInput = document.getElementById('regexInput').value;
    const escapedJson = manualEscape(regexInput);
    document.getElementById('regexInput').value = escapedJson;
}

function unescapeJson() {
    const regexInput = document.getElementById('regexInput').value;
    const unescapedJson = manualUnescape(regexInput);
    document.getElementById('regexInput').value = unescapedJson;
}