


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



























// Funktion zum Laden der JSON-Daten von einer URL
async function loadJsonFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP-Fehler! Status: ${response.status}`);
    }
    return await response.json();
}

// Funktion zur Erstellung des Dropdown-Menüs
/*function createDropdownMenu(data, editor) {
    const container = document.getElementById('menu-container'); // ID des gewünschten div

    function closeAllMenus() {
        const allContents = container.querySelectorAll('.category-content');
        allContents.forEach(content => {
            content.style.display = 'none';
        });
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
            contentContainer.style.position = 'absolute';
            contentContainer.style.left = '0';
            contentContainer.style.top = '100%';
            contentContainer.style.zIndex = '1000';
            contentContainer.style.backgroundColor = 'white';
            contentContainer.style.border = '1px solid rgb(30, 121, 100);';
            contentContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';

            data[category].forEach(item => {
                const itemName = Object.keys(item)[0];
                const itemData = { ...item[itemName], systemname: itemName };
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

               // buttonContainer.appendChild(copyButton);
                buttonContainer.appendChild(insertButton);
                option.appendChild(buttonContainer);
                contentContainer.appendChild(option);
            });

            categoryContainer.appendChild(contentContainer);
            container.appendChild(categoryContainer);
        }
    });

    document.addEventListener('click', closeAllMenus);
}*/
// Funktion zur Erstellung des Dropdown-Menüs
// Funktion zur Erstellung des Dropdown-Menüs
function createDropdownMenu(data, editor) {
    const container = document.getElementById('menu-container'); // ID des gewünschten div

    function closeAllMenus() {
        const allContents = container.querySelectorAll('.category-content');
        allContents.forEach(content => {
            content.style.display = 'none';
        });
    }

    function formatSystemName(name) {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '');
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
            contentContainer.style.position = 'absolute';
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
                    itemData = { ...item[itemName], actionname: itemName, actiondisplayname: itemName, minimalReqVersion: 1 };
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
