


const editor = CodeMirror.fromTextArea(document.getElementById("jsonEditor"), {
    lineNumbers: true,
    mode: "application/json",
    theme: "material",
});

editor.on("change", () => {
    const errorOutput = document.getElementById("errorOutput");
    try {
        JSON.parse(editor.getValue());
        errorOutput.textContent = "Valid JSON";
        errorOutput.style.color = "#43b581"; // Grün für valid
    } catch (error) {
        errorOutput.textContent = "Invalid JSON: " + error.message;
        errorOutput.style.color = "#f04747"; // Rot für Fehler
    }
});

document.getElementById("formatJson").addEventListener("click", () => {
    try {
        const json = JSON.parse(editor.getValue());
        editor.setValue(JSON.stringify(json, null, 2));
    } catch (error) {
        // Error is already displayed in the live checker
    }
});

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    submenu.classList.toggle('active');
}

const toggleSidebar = document.getElementById("toggleSidebar");

toggleSidebar.addEventListener("click", toggleMenu);

document.addEventListener('click', function(event) {


    // Überprüfen, ob Sidebar aktiv ist, und ob der Klick außerhalb des Sidebar und des Buttons ist
    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && event.target !== toggleSidebar) {
        sidebar.classList.remove('active');
    }
});


// Rückgängig machen
document.getElementById("undoButton").addEventListener("click", () => {
    editor.execCommand("undo");
});

// Wiederherstellen
document.getElementById("redoButton").addEventListener("click", () => {
    editor.execCommand("redo");
});

// Warnung bei Seitenreload
/*window.addEventListener("beforeunload", (e) => {
    const confirmationMessage = "Ungespeicherte Änderungen gehen verloren. Möchtest du wirklich neu laden?";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
});*/


let cookiesAccepted = false;

// Funktion zum Setzen in Local Storage
function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Funktion zum Abrufen aus Local Storage
function getLocalStorage(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

// Funktion zum Löschen aus Local Storage
function deleteLocalStorage(key) {
    localStorage.removeItem(key);
}

// Cookie-Akzeptanz prüfen
const cookieConsent = getLocalStorage("cookiesAccepted");
if (cookieConsent === null) {
    document.getElementById("cookieBanner").style.display = "block";
} else {
    cookiesAccepted = cookieConsent === true;
    if (cookiesAccepted) {
        loadEditorContent();
    }
}

// Akzeptanz-Logik
document.getElementById("acceptCookies").addEventListener("click", () => {
    setLocalStorage("cookiesAccepted", true);
    cookiesAccepted = true;
    document.getElementById("cookieBanner").style.display = "none";
    loadEditorContent();
});

// Ablehnung-Logik
document.getElementById("rejectCookies").addEventListener("click", () => {
    setLocalStorage("cookiesAccepted", false);
    cookiesAccepted = false;
    deleteLocalStorage("editorContent"); // Löscht gespeicherte Inhalte
    document.getElementById("cookieBanner").style.display = "none";
});

// Automatische Speicherung bei Änderungen
if (typeof editor !== "undefined") {
    editor.on("change", () => {
        if (cookiesAccepted) {
            const content = editor.getValue();
            setLocalStorage("editorContent", content); // Speichert Inhalt in Local Storage
        }
    });
}

// Laden des Inhalts aus Local Storage
function loadEditorContent() {
    if (cookiesAccepted) {
        const content = getLocalStorage("editorContent");
        if (content) {
            editor.setValue(content);
        } else {
            editor.setValue(""); // Fallback: Leerer Inhalt, wenn nichts gespeichert ist
        }
        document.getElementById("cookieBanner").style.display = "none";
    }
}

// Cookie-Einstellungen erneut öffnen
document.getElementById("manageCookies").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("cookieBanner").style.display = "block";
});


/*
let cookiesAccepted = false;

// Funktion zum Setzen von Cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=None;Secure`;
}

// Funktion zum Abrufen von Cookies
function getCookie(name) {
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return matches ? decodeURIComponent(matches[1]) : null;
}

// Funktion zum Löschen von Cookies
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=None;Secure`;
   // document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=None;Secure`;


}

// Cookie-Akzeptanz prüfen
const cookieConsent = getCookie("cookiesAccepted");
if (!cookieConsent) {
    document.getElementById("cookieBanner").style.display = "block";
} else {
    cookiesAccepted = cookieConsent === "true";
    if (cookiesAccepted) {
        loadEditorContent();
    }
}

// Akzeptanz-Logik
document.getElementById("acceptCookies").addEventListener("click", () => {
    setCookie("cookiesAccepted", "true", 365);
    cookiesAccepted = true;
    document.getElementById("cookieBanner").style.display = "none";
    loadEditorContent();
});

// Ablehnung-Logik
document.getElementById("rejectCookies").addEventListener("click", () => {
    setCookie("cookiesAccepted", "false", 365);
    cookiesAccepted = false;
    deleteCookie("editorContent"); // Löscht gespeicherte Inhalte
    document.getElementById("cookieBanner").style.display = "none";
});

// Automatische Speicherung bei Änderungen
editor.on("change", () => {
    if (cookiesAccepted) {
        const content = editor.getValue();
        setCookie("editorContent", content, 7); // Speichert Inhalt für 7 Tage
    }
});

// Laden des Inhalts aus dem Cookie
function loadEditorContent() {
    if (cookiesAccepted) {
        const content = getCookie("editorContent");
        if (content) {
            editor.setValue(content);
        }
        // Banner ausblenden, wenn Cookies akzeptiert wurden
        document.getElementById("cookieBanner").style.display = "none";
    }
}

// Cookie-Einstellungen erneut öffnen
document.getElementById("manageCookies").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("cookieBanner").style.display = "block";
});
*/


























// Funktion zum Laden der JSON-Daten von einer URL
async function loadJsonFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    return await response.json();
}


// Funktion zur Erstellung des Dropdown-Menüs
// Funktion zur Erstellung des Dropdown-Menüs
function createDropdownMenu(data, editor) {
    const container = document.getElementById('menu-container'); // ID des gewünschten div

    function closeAllMenus() {
        const allContents = container.querySelectorAll('.category-content');
        allContents.forEach(content => {
            content.style.display = 'none';
            optionsContainer.style.display = 'none';
            optionsContainer2.style.display = 'none';
        });
    }
    function formatSystemName(name) {
        return name.toLowerCase().replace(/[^a-z]/g, '');
    }

    ["actions", "conditions", "events", "varactions"].forEach(category => {
        if (data[category]) {
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category-container');
            categoryContainer.style.position = 'relative';

            const button = document.createElement('button');
            button.classList.add('category-button');
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const content = categoryContainer.querySelector('.category-content');
                const isOpen = content.style.display === 'block';
                closeAllMenus();
                if (!isOpen) {
                    content.style.display = 'block';
                }
            });
            categoryContainer.appendChild(button);

            const contentContainer = document.createElement('div');
            contentContainer.classList.add('category-content');
            contentContainer.style.display = 'none';
            contentContainer.style.position = 'fixed!important';
            contentContainer.style.left = '0';
            contentContainer.style.top = '100%';
            contentContainer.style.zIndex = '1000';
            contentContainer.style.backgroundColor = 'white';
            contentContainer.style.border = '0';
            contentContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';


            data[category].forEach(item => {
                const itemName = Object.keys(item)[0];
                let itemData;


                if (category === "actions" || category === "varactions") {
                    itemData = { ...item[itemName], actionname: formatSystemName(itemName), actiondisplayname: itemName, minimalReqVersion: 1 };
                } else if (category === "conditions") {
                    itemData = { ...item[itemName], systemname: formatSystemName(itemName), displayname: itemName, minimalReqVersion: 1 };
                } else {
                    itemData = { ...item[itemName], systemname: formatSystemName(itemName) };
                }

                const option = document.createElement('div');
                option.classList.add('option');
                option.style.display = 'flex';
                option.style.justifyContent = 'space-between';
                option.style.alignItems = 'center';
                option.style.padding = '5px 10px';

                const span = document.createElement('span');
                span.textContent = itemName;
                span.classList.add('item-name');
                option.appendChild(span);

                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.gap = '10px';

                const copyButton = document.createElement('button');
                copyButton.classList.add('dropdown-button-in');
                copyButton.textContent = 'Kopieren';
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(JSON.stringify(itemData, null, 2));
                    alert(`${itemName} wurde kopiert!`);
                    closeAllMenus();
                });

                const insertButton = document.createElement('button');
                insertButton.classList.add('dropdown-button-in');
                insertButton.textContent = 'Einfügen';
                insertButton.addEventListener('click', () => {
                    if (editor) {
                        const doc = editor.getDoc();
                        const cursor = doc.getCursor();
                        const currentContent = JSON.stringify(itemData, null, 2);
                        doc.replaceRange(currentContent, cursor);
                        closeAllMenus();
                        try {
                            const json = JSON.parse(editor.getValue());
                            editor.setValue(JSON.stringify(json, null, 2));
                        } catch (error) {
                            // Error is already displayed in the live checker
                        }
                    } else {
                        alert('CodeMirror-Editor nicht gefunden!');
                    }
                });

                buttonContainer.appendChild(copyButton);
                buttonContainer.appendChild(insertButton);
                option.appendChild(buttonContainer);
                contentContainer.appendChild(option);
            });

            categoryContainer.appendChild(contentContainer);
            container.appendChild(categoryContainer);
        }
    });

    document.addEventListener('click', closeAllMenus);
}
// Menü auf der Seite erstellen
document.addEventListener('DOMContentLoaded', async () => {
    try {

        const data = await loadJsonFromUrl('https://api.qq4.de/dcv2-data/index.php');
        createDropdownMenu(data, editor);
    } catch (error) {
        console.error('Fehler beim Laden der JSON-Daten:', error);
    }
});














const eventariablen = [
    {
        "name": "event_zeitHHMM",
        "desc": "ZeitEvent: Zeitpunkt des Events in HH:MM"
    },
    {
        "name": "event_lamppos",
        "desc": "LampenEvent: Gibt die XYZ Koordinaten der Lampe mit"
    },
    {
        "name": "event_chatWithColorCodes",
        "desc": "ChatEvent: Chat mit Colorcodes"
    },


    {
        "name": "event_ankaufItemDisplayName",
        "desc": "AnkaufEvent: Item Display Name"
    },
    {
        "name": "event_ankaufMaterial",
        "desc": "AnkaufEvent: Item Material"
    },
    {
        "name": "event_ankaufLoreLine1",
        "desc": "AnkaufEvent: Sign Lore 1 (sign)"
    },
    {
        "name": "event_ankaufLoreLine2",
        "desc": "AnkaufEvent: Sign Lore 2 (addsign)"
    },
    {
        "name": "event_ankaufSignDate",
        "desc": "AnkaufEvent: Sign Datum"
    },
    {
        "name": "event_ankaufSignUser",
        "desc": "AnkaufEvent: Sign Username"
    },
    {
        "name": "event_ankaufPlayerName",
        "desc": "AnkaufEvent: Event Username"
    },
    {
        "name": "event_ankaufPlayerUUID",
        "desc": "AnkaufEvent: Event UUID"
    },
    {
        "name": "event_ankaufItemCount",
        "desc": "AnkaufEvent: Menge des Items"
    },



    {
        "name": "event_verkaufstart_payamount",
        "desc": "VerkaufsEvent: Vom User gezahlter Betrag (Double als String)"
    },
    {
        "name": "event_verkaufstart_player",
        "desc": "VerkaufsEvent: Bot Verkauf, Username"
    },
    {
        "name": "event_verkaufstart_uuid",
        "desc": "VerkaufsEvent: Bot Verkauf, User-UUID"
    },

    {
        "name": "event_interval",
        "desc": "Scheduler: Interval in Mullisekunden des Schedulers"
    },
    {
        "name": "event_id",
        "desc": "Scheduler: Name des Schedulers"
    }
    ];

function createDropdown2() {
    const dropdownContainer2 = document.getElementById('dropdown-container2');

    // Container für die Optionen erstellen und initial verstecken
    const optionsContainer2 = document.createElement('div');
    optionsContainer2.setAttribute('id', 'optionsContainer2');
    optionsContainer2.style.display = 'none'; // Optionen initial verstecken
    optionsContainer2.style.position = 'fixed!important'; // Positionierung relativ zum Container
    optionsContainer2.style.zIndex = '1000'; // Damit es über anderen Elementen angezeigt wird
    optionsContainer2.style.backgroundColor = 'white'; // Hintergrundfarbe
    //  optionsContainer.style.border = '1px solid #ccc'; // Rand
    optionsContainer2.style.minWidth = '200px'; // Minimale Breite
    optionsContainer2.style.padding = '5px'; // Innenabstand

    // Optionen hinzufügen
    eventariablen.forEach(item => {
        const option = document.createElement('div');
        option.setAttribute('id', 'optionsContainerElement2');
        option.textContent = item.name; // Der Name der Variable wird angezeigt
        option.style.padding = '5px';
        option.style.cursor = 'pointer';
        option.setAttribute('title', item.desc); // Beschreibung als Tooltip

        // Klick-Event für jede Option
        option.addEventListener('click', function() {
            insertAtCursor(`%${item.name}%`); // Einfügen mit einem einzigen %
            optionsContainer2.style.display = 'none'; // Optionen nach Auswahl ausblenden
        });

        optionsContainer2.appendChild(option);
    });

    // Eventlistener für das Öffnen/Schließen der Optionen
    dropdownContainer2.addEventListener('click', function(event) {
        // Verhindern, dass der Klick auf die Optionen den Button-Click auslöst
        event.stopPropagation();

        // Position der Optionen unterhalb des Buttons
        const rect = dropdownContainer2.getBoundingClientRect();
        optionsContainer2.style.top = `${rect.bottom + 5}px`; // 5px unter dem Button
        optionsContainer2.style.left = `${rect.left}px`; // Links ausgerichtet mit dem Button

        // Sichtbarkeit der Optionen ändern
        if (optionsContainer2.style.display === 'none') {
            optionsContainer2.style.display = 'block'; // Optionen anzeigen
        } else {
            optionsContainer2.style.display = 'none'; // Optionen ausblenden
        }
    });

    // Die Optionen in den Body einfügen
    document.body.appendChild(optionsContainer2);
}

// Initialisieren der Optionen
createDropdown2();

// Die JSON-Daten
const systemVariablen = [
    {
        "name": "system_zeitHHMM",
        "desc": "Aktueller Zeitpunkt als HH:MM"
    },
    {
        "name": "system_zeitHHMMSS",
        "desc": "Aktueller Zeitpunkt als HH:MM:SS"
    },
    {
        "name": "system_datumDDMM",
        "desc": "Aktueller Zeitpunkt als DD.MM"
    },
    {
        "name": "system_datumDDMMYYYY",
        "desc": "Aktueller Zeitpunkt als DD.MM.YYYY"
    },
    {
        "name": "system_username",
        "desc": "Bot Username"
    },
    {
        "name": "system_uuid",
        "desc": "Bot-UUID"
    },
    {
        "name": "system_server",
        "desc": "Aktueller CB des Bots"
    },
    {
        "name": "system_bank",
        "desc": "Spieler in Verkaufszone"
    },
    {
        "name": "system_playerInZoneUuid",
        "desc": "UUID des Spieleres in Verkaufszone"
    },
    {
        "name": "system_wochentagNummer",
        "desc": "Wochentag (Montag = 1, Sonntag = 7)"
    },

    {
        "name": "system_kw",
        "desc": "Kalenderwoche als Zahl"
    },
    {
        "name": "system_currenttimestamp",
        "desc": "Unix Timestamp in MS"
    }
];


// Funktion zur Erstellung des Dropdown-Menüs
function createDropdown() {
    const dropdownContainer = document.getElementById('dropdown-container');

    // Container für die Optionen erstellen und initial verstecken
    const optionsContainer = document.createElement('div');
    optionsContainer.setAttribute('id', 'optionsContainer');
    optionsContainer.style.display = 'none'; // Optionen initial verstecken
    optionsContainer.style.position = 'absolute'; // Positionierung relativ zum Container
    optionsContainer.style.zIndex = '1000'; // Damit es über anderen Elementen angezeigt wird
    optionsContainer.style.backgroundColor = 'white'; // Hintergrundfarbe
  //  optionsContainer.style.border = '1px solid #ccc'; // Rand
    optionsContainer.style.minWidth = '200px'; // Minimale Breite
    optionsContainer.style.padding = '5px'; // Innenabstand

    // Optionen hinzufügen
    systemVariablen.forEach(item => {
        const option = document.createElement('div');
        option.setAttribute('id', 'optionsContainerElement');
        option.textContent = item.name; // Der Name der Variable wird angezeigt
        option.style.padding = '5px';
        option.style.cursor = 'pointer';
        option.setAttribute('title', item.desc); // Beschreibung als Tooltip

        // Klick-Event für jede Option
        option.addEventListener('click', function() {
            insertAtCursor(`%${item.name}%`); // Einfügen mit einem einzigen %
            optionsContainer.style.display = 'none'; // Optionen nach Auswahl ausblenden
        });

        optionsContainer.appendChild(option);
    });

    // Eventlistener für das Öffnen/Schließen der Optionen
    dropdownContainer.addEventListener('click', function(event) {
        // Verhindern, dass der Klick auf die Optionen den Button-Click auslöst
        event.stopPropagation();

        // Position der Optionen unterhalb des Buttons
        const rect = dropdownContainer.getBoundingClientRect();
        optionsContainer.style.top = `${rect.bottom + 5}px`; // 5px unter dem Button
        optionsContainer.style.left = `${rect.left}px`; // Links ausgerichtet mit dem Button

        // Sichtbarkeit der Optionen ändern
        if (optionsContainer.style.display === 'none') {
            optionsContainer.style.display = 'block'; // Optionen anzeigen
        } else {
            optionsContainer.style.display = 'none'; // Optionen ausblenden
        }
    });

    // Die Optionen in den Body einfügen
    document.body.appendChild(optionsContainer);
}

// Funktion zum Einfügen des Texts an die Cursor-Position im CodeMirror-Editor
function insertAtCursor(text) {
    const doc = editor.getDoc();
    const cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
}

// Initialisieren der Optionen
createDropdown();