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
            if (newEvent.hasOwnProperty('loreLine1')) {
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
            <div class="form-group">
                <input type="checkbox" id="popup-enableItemDisplayName" name="enableItemDisplayName" ${event.enableItemDisplayName ? "checked" : undefined}>
                <label for="itemDisplayName">Item-Anzeige aktivieren:</label>
                <input type="text" id="popup-itemDisplayName" name="itemDisplayName"  value="${event.itemDisplayName}">
            </div>
            
            <div class="form-group">
                <input type="checkbox" id="popup-enableLoreLine1" name="enableLoreLine1" ${event.enableLoreLine1 ? "checked" : undefined}>
                <label for="loreLine1">Lore-Zeile 1 aktivieren:</label>
                <input type="text" id="popup-loreLine1" name="loreLine1"  value="${event.loreLine1}">
            </div>

            <div class="form-group">
                <input type="checkbox" id="popup-enableLoreLine2" name="enableLoreLine2" ${event.enableLoreLine2 ? "checked" : undefined}>
                <label for="loreLine2">Lore-Zeile 2 aktivieren:</label>
                <input type="text" id="popup-loreLine2" name="loreLine2"  value="${event.loreLine2}">
            </div>

            <div class="form-group">
                <input type="checkbox" id="popup-enableMaterial" name="enableMaterial" ${event.enableMaterial ? "checked" : undefined}>
                <label for="material">Material aktivieren:</label>
                 <select id="popup-material"  name="material">
        <option value="">${event.material}</option>
            <option value=""></option>
                <option value="minecraft:acacia_door">minecraft:acacia_door</option>
  <option value="minecraft:acacia_fence">minecraft:acacia_fence</option>
  <option value="minecraft:acacia_fence_gate">minecraft:acacia_fence_gate</option>
  <option value="minecraft:acacia_stairs">minecraft:acacia_stairs</option>
  <option value="minecraft:activator_rail">minecraft:activator_rail</option>
  <option value="minecraft:air">minecraft:air</option>
  <option value="minecraft:anvil">minecraft:anvil</option>
  <option value="minecraft:barrier">minecraft:barrier</option>
  <option value="minecraft:beacon">minecraft:beacon</option>
  <option value="minecraft:bed">minecraft:bed</option>
  <option value="minecraft:bedrock">minecraft:bedrock</option>
  <option value="minecraft:birch_door">minecraft:birch_door</option>
  <option value="minecraft:birch_fence">minecraft:birch_fence</option>
  <option value="minecraft:birch_fence_gate">minecraft:birch_fence_gate</option>
  <option value="minecraft:birch_stairs">minecraft:birch_stairs</option>
  <option value="minecraft:bookshelf">minecraft:bookshelf</option>
   <option value="minecraft:blaze_rod">minecraft:blaze_rod</option>
  <option value="minecraft:brewing_stand">minecraft:brewing_stand</option>
  <option value="minecraft:brick_block">minecraft:brick_block</option>
  <option value="minecraft:brick_stairs">minecraft:brick_stairs</option>
  <option value="minecraft:brown_mushroom">minecraft:brown_mushroom</option>
  <option value="minecraft:brown_mushroom_block">minecraft:brown_mushroom_block</option>
  <option value="minecraft:cactus">minecraft:cactus</option>
  <option value="minecraft:cake">minecraft:cake</option>
  <option value="minecraft:carpet">minecraft:carpet</option>
  <option value="minecraft:carrots">minecraft:carrots</option>
  <option value="minecraft:cauldron">minecraft:cauldron</option>
  <option value="minecraft:chest">minecraft:chest</option>
  <option value="minecraft:clay">minecraft:clay</option>
  <option value="minecraft:coal_block">minecraft:coal_block</option>
  <option value="minecraft:coal_ore">minecraft:coal_ore</option>
  <option value="minecraft:cobblestone">minecraft:cobblestone</option>
  <option value="minecraft:cobblestone_wall">minecraft:cobblestone_wall</option>
  <option value="minecraft:cocoa">minecraft:cocoa</option>
  <option value="minecraft:command_block">minecraft:command_block</option>
  <option value="minecraft:crafting_table">minecraft:crafting_table</option>
  <option value="minecraft:dark_oak_door">minecraft:dark_oak_door</option>
  <option value="minecraft:dark_oak_fence">minecraft:dark_oak_fence</option>
  <option value="minecraft:dark_oak_fence_gate">minecraft:dark_oak_fence_gate</option>
  <option value="minecraft:dark_oak_stairs">minecraft:dark_oak_stairs</option>
  <option value="minecraft:daylight_detector">minecraft:daylight_detector</option>
  <option value="minecraft:daylight_detector_inverted">minecraft:daylight_detector_inverted</option>
  <option value="minecraft:deadbush">minecraft:deadbush</option>
  <option value="minecraft:detector_rail">minecraft:detector_rail</option>
  <option value="minecraft:diamond_block">minecraft:diamond_block</option>
  <option value="minecraft:diamond_ore">minecraft:diamond_ore</option>
  <option value="minecraft:dirt">minecraft:dirt</option>
  <option value="minecraft:dispenser">minecraft:dispenser</option>
  <option value="minecraft:double_plant">minecraft:double_plant</option>
  <option value="minecraft:double_stone_slab">minecraft:double_stone_slab</option>
  <option value="minecraft:double_stone_slab2">minecraft:double_stone_slab2</option>
  <option value="minecraft:double_wooden_slab">minecraft:double_wooden_slab</option>
  <option value="minecraft:dragon_egg">minecraft:dragon_egg</option>
  <option value="minecraft:dropper">minecraft:dropper</option>
  <option value="minecraft:emerald_block">minecraft:emerald_block</option>
  <option value="minecraft:emerald_ore">minecraft:emerald_ore</option>
  <option value="minecraft:enchanting_table">minecraft:enchanting_table</option>
  <option value="minecraft:end_portal">minecraft:end_portal</option>
  <option value="minecraft:end_portal_frame">minecraft:end_portal_frame</option>
  <option value="minecraft:end_stone">minecraft:end_stone</option>
  <option value="minecraft:ender_chest">minecraft:ender_chest</option>
  <option value="minecraft:farmland">minecraft:farmland</option>
  <option value="minecraft:fence">minecraft:fence</option>
  <option value="minecraft:fence_gate">minecraft:fence_gate</option>
  <option value="minecraft:fire">minecraft:fire</option>
  <option value="minecraft:flower_pot">minecraft:flower_pot</option>
  <option value="minecraft:flowing_lava">minecraft:flowing_lava</option>
  <option value="minecraft:flowing_water">minecraft:flowing_water</option>
  <option value="minecraft:furnace">minecraft:furnace</option>
  <option value="minecraft:glass">minecraft:glass</option>
  <option value="minecraft:glass_pane">minecraft:glass_pane</option>
  <option value="minecraft:glowstone">minecraft:glowstone</option>
  <option value="minecraft:gold_block">minecraft:gold_block</option>
  <option value="minecraft:gold_ore">minecraft:gold_ore</option>
  <option value="minecraft:golden_rail">minecraft:golden_rail</option>
  <option value="minecraft:grass">minecraft:grass</option>
  <option value="minecraft:gravel">minecraft:gravel</option>
  <option value="minecraft:hardened_clay">minecraft:hardened_clay</option>
  <option value="minecraft:hay_block">minecraft:hay_block</option>
  <option value="minecraft:heavy_weighted_pressure_plate">minecraft:heavy_weighted_pressure_plate</option>
  <option value="minecraft:hopper">minecraft:hopper</option>
  <option value="minecraft:ice">minecraft:ice</option>
  <option value="minecraft:iron_bars">minecraft:iron_bars</option>
  <option value="minecraft:iron_block">minecraft:iron_block</option>
  <option value="minecraft:iron_door">minecraft:iron_door</option>
  <option value="minecraft:iron_ore">minecraft:iron_ore</option>
  <option value="minecraft:iron_trapdoor">minecraft:iron_trapdoor</option>
  <option value="minecraft:jukebox">minecraft:jukebox</option>
  <option value="minecraft:jungle_door">minecraft:jungle_door</option>
  <option value="minecraft:jungle_fence">minecraft:jungle_fence</option>
  <option value="minecraft:jungle_fence_gate">minecraft:jungle_fence_gate</option>
  <option value="minecraft:jungle_stairs">minecraft:jungle_stairs</option>
  <option value="minecraft:ladder">minecraft:ladder</option>
  <option value="minecraft:lapis_block">minecraft:lapis_block</option>
  <option value="minecraft:lapis_ore">minecraft:lapis_ore</option>
  <option value="minecraft:lava">minecraft:lava</option>
  <option value="minecraft:leaves">minecraft:leaves</option>
  <option value="minecraft:leaves2">minecraft:leaves2</option>
  <option value="minecraft:lever">minecraft:lever</option>
  <option value="minecraft:light_weighted_pressure_plate">minecraft:light_weighted_pressure_plate</option>
  <option value="minecraft:lit_furnace">minecraft:lit_furnace</option>
  <option value="minecraft:lit_pumpkin">minecraft:lit_pumpkin</option>
  <option value="minecraft:lit_redstone_lamp">minecraft:lit_redstone_lamp</option>
  <option value="minecraft:lit_redstone_ore">minecraft:lit_redstone_ore</option>
  <option value="minecraft:log">minecraft:log</option>
  <option value="minecraft:log2">minecraft:log2</option>
  <option value="minecraft:melon_block">minecraft:melon_block</option>
  <option value="minecraft:melon_stem">minecraft:melon_stem</option>
  <option value="minecraft:mob_spawner">minecraft:mob_spawner</option>
  <option value="minecraft:monster_egg">minecraft:monster_egg</option>
  <option value="minecraft:mossy_cobblestone">minecraft:mossy_cobblestone</option>
  <option value="minecraft:mycelium">minecraft:mycelium</option>
  <option value="minecraft:nether_brick">minecraft:nether_brick</option>
  <option value="minecraft:nether_brick_fence">minecraft:nether_brick_fence</option>
  <option value="minecraft:nether_brick_stairs">minecraft:nether_brick_stairs</option>
  <option value="minecraft:nether_wart">minecraft:nether_wart</option>
  <option value="minecraft:netherrack">minecraft:netherrack</option>
  <option value="minecraft:noteblock">minecraft:noteblock</option>
  <option value="minecraft:oak_stairs">minecraft:oak_stairs</option>
  <option value="minecraft:obsidian">minecraft:obsidian</option>
  <option value="minecraft:packed_ice">minecraft:packed_ice</option>
  <option value="minecraft:piston">minecraft:piston</option>
  <option value="minecraft:piston_extension">minecraft:piston_extension</option>
  <option value="minecraft:piston_head">minecraft:piston_head</option>
  <option value="minecraft:planks">minecraft:planks</option>
  <option value="minecraft:portal">minecraft:portal</option>
  <option value="minecraft:potatoes">minecraft:potatoes</option>
  <option value="minecraft:powered_comparator">minecraft:powered_comparator</option>
  <option value="minecraft:powered_repeater">minecraft:powered_repeater</option>
  <option value="minecraft:prismarine">minecraft:prismarine</option>
  <option value="minecraft:pumpkin">minecraft:pumpkin</option>
  <option value="minecraft:pumpkin_stem">minecraft:pumpkin_stem</option>
  <option value="minecraft:quartz_block">minecraft:quartz_block</option>
  <option value="minecraft:quartz_ore">minecraft:quartz_ore</option>
  <option value="minecraft:quartz_stairs">minecraft:quartz_stairs</option>
  <option value="minecraft:rail">minecraft:rail</option>
  <option value="minecraft:red_flower">minecraft:red_flower</option>
  <option value="minecraft:red_mushroom">minecraft:red_mushroom</option>
  <option value="minecraft:red_mushroom_block">minecraft:red_mushroom_block</option>
  <option value="minecraft:red_sandstone">minecraft:red_sandstone</option>
  <option value="minecraft:red_sandstone_stairs">minecraft:red_sandstone_stairs</option>
  <option value="minecraft:redstone_block">minecraft:redstone_block</option>
  <option value="minecraft:redstone_lamp">minecraft:redstone_lamp</option>
  <option value="minecraft:redstone_ore">minecraft:redstone_ore</option>
  <option value="minecraft:redstone_torch">minecraft:redstone_torch</option>
  <option value="minecraft:redstone_wire">minecraft:redstone_wire</option>
  <option value="minecraft:reeds">minecraft:reeds</option>
  <option value="minecraft:sand">minecraft:sand</option>
  <option value="minecraft:sandstone">minecraft:sandstone</option>
  <option value="minecraft:sandstone_stairs">minecraft:sandstone_stairs</option>
  <option value="minecraft:sapling">minecraft:sapling</option>
  <option value="minecraft:sea_lantern">minecraft:sea_lantern</option>
  <option value="minecraft:skull">minecraft:skull</option>
  <option value="minecraft:slime">minecraft:slime</option>
  <option value="minecraft:snow">minecraft:snow</option>
  <option value="minecraft:snow_layer">minecraft:snow_layer</option>
  <option value="minecraft:soul_sand">minecraft:soul_sand</option>
  <option value="minecraft:sponge">minecraft:sponge</option>
  <option value="minecraft:spruce_door">minecraft:spruce_door</option>
  <option value="minecraft:spruce_fence">minecraft:spruce_fence</option>
  <option value="minecraft:spruce_fence_gate">minecraft:spruce_fence_gate</option>
  <option value="minecraft:spruce_stairs">minecraft:spruce_stairs</option>
  <option value="minecraft:stained_glass">minecraft:stained_glass</option>
  <option value="minecraft:stained_glass_pane">minecraft:stained_glass_pane</option>
  <option value="minecraft:stained_hardened_clay">minecraft:stained_hardened_clay</option>
  <option value="minecraft:standing_banner">minecraft:standing_banner</option>
  <option value="minecraft:standing_sign">minecraft:standing_sign</option>
  <option value="minecraft:sticky_piston">minecraft:sticky_piston</option>
  <option value="minecraft:stone">minecraft:stone</option>
  <option value="minecraft:stone_brick_stairs">minecraft:stone_brick_stairs</option>
  <option value="minecraft:stone_button">minecraft:stone_button</option>
  <option value="minecraft:stone_pressure_plate">minecraft:stone_pressure_plate</option>
  <option value="minecraft:stone_slab">minecraft:stone_slab</option>
  <option value="minecraft:stone_slab2">minecraft:stone_slab2</option>
  <option value="minecraft:stone_stairs">minecraft:stone_stairs</option>
  <option value="minecraft:stonebrick">minecraft:stonebrick</option>
  <option value="minecraft:tallgrass">minecraft:tallgrass</option>
  <option value="minecraft:tnt">minecraft:tnt</option>
  <option value="minecraft:torch">minecraft:torch</option>
  <option value="minecraft:trapdoor">minecraft:trapdoor</option>
  <option value="minecraft:trapped_chest">minecraft:trapped_chest</option>
  <option value="minecraft:tripwire">minecraft:tripwire</option>
  <option value="minecraft:tripwire_hook">minecraft:tripwire_hook</option>
  <option value="minecraft:unlit_redstone_torch">minecraft:unlit_redstone_torch</option>
  <option value="minecraft:unpowered_comparator">minecraft:unpowered_comparator</option>
  <option value="minecraft:unpowered_repeater">minecraft:unpowered_repeater</option>
  <option value="minecraft:vine">minecraft:vine</option>
  <option value="minecraft:wall_banner">minecraft:wall_banner</option>
  <option value="minecraft:wall_sign">minecraft:wall_sign</option>
  <option value="minecraft:water">minecraft:water</option>
  <option value="minecraft:waterlily">minecraft:waterlily</option>
  <option value="minecraft:web">minecraft:web</option>
  <option value="minecraft:wheat">minecraft:wheat</option>
  <option value="minecraft:wooden_button">minecraft:wooden_button</option>
  <option value="minecraft:wooden_door">minecraft:wooden_door</option>
  <option value="minecraft:wooden_pressure_plate">minecraft:wooden_pressure_plate</option>
  <option value="minecraft:wooden_slab">minecraft:wooden_slab</option>
  <option value="minecraft:wool">minecraft:wool</option>
  <option value="minecraft:yellow_flower">minecraft:yellow_flower</option>
    </select>
            </div>

            <div class="form-group">
                <input type="checkbox" id="popup-enableSignUser" name="enableSignUser" ${event.enableSignUser ? "checked" : undefined}>
                <label for="signUser">Sign User aktivieren:</label>
                <input type="text" id="popup-signUser" name="signUser" value="${event.signUser}">
            </div>

            <div class="form-group">
                <input type="checkbox" id="popup-enableSignDate" name="enableSignDate" ${event.enableSignDate ? "checked" : undefined}>
                <label for="signDate">Sign Datum aktivieren:</label>
                <input type="date" id="popup-signDate" name="signDate"  value="${event.signDate}">
            </div>
                
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
        event.enableItemDisplayName = document.getElementById('popup-enableItemDisplayName').checked;
        event.itemDisplayName = document.getElementById('popup-itemDisplayName').value;
        event.enableLoreLine1 = document.getElementById('popup-enableLoreLine1').checked;
        event.loreLine1 = document.getElementById('popup-loreLine1').value;
        event.enableLoreLine2 = document.getElementById('popup-enableLoreLine2').checked;
        event.loreLine2 = document.getElementById('popup-loreLine2').value;
        event.enableMaterial = document.getElementById('popup-enableMaterial').checked;
        event.material = document.getElementById('popup-material').value;
        event.enableSignUser = document.getElementById('popup-enableSignUser').checked;
        event.signUser = document.getElementById('popup-signUser').value;
        event.enableSignDate = document.getElementById('popup-enableSignDate').checked;
        event.signDate = document.getElementById('popup-signDate').value;



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
/*function updateJsonOutput() {
    const jsonOutput = document.getElementById('jsonOutput');
    const outputData = { ankaufevents: events };

    // Ausgabe als formatiertes JSON
    jsonOutput.textContent = JSON.stringify(outputData, null, 4);
}*/

function initEventEditor() {
    document.getElementById('eventForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the form from refreshing the page
        eventForm.style.display = 'none';
        const displaynametemp = document.getElementById('displayname').value;
        const displayname = displaynametemp.replace(/[^a-zA-Z0-9 _-]/g, '');

        const commenttemp = document.getElementById('comment').value;
        const comment = commenttemp.replace(/[^a-zA-Z0-9 _-]/g, '');

        const enableItemDisplayName = document.getElementById('enableItemDisplayName').checked;
        const itemDisplayName = document.getElementById('itemDisplayName').value;

        const enableLoreLine1 = document.getElementById('enableLoreLine1').checked;
        const loreLine1 = document.getElementById('loreLine1').value;

        const enableLoreLine2 = document.getElementById('enableLoreLine2').checked;
        const loreLine2 = document.getElementById('loreLine2').value;

        const enableMaterial = document.getElementById('enableMaterial').checked;
        const material = document.getElementById('material').value;

        const enableSignUser = document.getElementById('enableSignUser').checked;
        const signUser = document.getElementById('signUser').value;

        const enableSignDate = document.getElementById('enableSignDate').checked;
        const signDate = document.getElementById('signDate').value;




        const systemname = displayname.toLowerCase().replace(/[^a-z00-9]/g, '');

        const newEvent = {
            systemname: systemname,
            displayname: displayname,
            minimalReqVersion: 1,
            conditions: [],
            comment: comment || '',
            enableItemDisplayName: enableItemDisplayName,
            itemDisplayName: itemDisplayName,
            enableLoreLine1: enableLoreLine1,
            loreLine1: loreLine1,
            enableLoreLine2: enableLoreLine2,
            loreLine2: loreLine2,
            enableMaterial: enableMaterial,
            material: material,
            enableSignUser: enableSignUser,
            signUser: signUser,
            enableSignDate: enableSignDate,
            signDate: signDate,



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
        eventDiv.innerHTML = `<strong>${event.displayname}</strong> <br> </br>
   <div class="event-details" style="display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; width: 100%;">
         <div><b>Lore-Line1:</b>  ${event.enableLoreLine1 ? event.loreLine1 : 'aus'}</div>
         <div><b>Lore-Line2:</b>  ${event.enableLoreLine2 ? event.loreLine2 : 'aus'}</div>
      </div>
      <div style="display: flex; justify-content: space-between; width: 100%;">
            <div><b>ItemDisplayName:</b>  ${event.enableItemDisplayName ? event.itemDisplayName : 'aus'}</div>
         <div><b>Material:</b>  ${event.enableMaterial ? event.material : 'aus'}</div>
      </div>
      <div style="display: flex; justify-content: space-between; width: 100%;">
         <div><b>SignUser:</b> ${event.enableSignUser ? event.signUser : 'aus'}</div>
         <div><b>SignDate:</b> ${event.enableSignDate ? event.signDate : 'aus'}</div>
      </div>
   </div>
   ${event.comment} <br> <br> <br>`;

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
       // eventDiv.appendChild(varibaleButton);

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
                        details = `<b>Status:</b> ${action.data.joinerStatus}`;
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