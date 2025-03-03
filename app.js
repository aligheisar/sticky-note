let color = document.getElementById("color");
let add_button = document.getElementById("add_button");
let notes = document.getElementById("notes");
let setting = document.getElementById('setting');
let setting_icon = document.getElementById('setting_icon');
let setting_menu = document.getElementById('setting_menu');
let grid_think = document.getElementById('grid_think_slider');
let grid_size = document.getElementById('grid_size_slider');
let grid_check = document.getElementById('grid_check');
let grid_color = document.getElementById('grid_color');
let back_color = document.getElementById('back_color');
let grid_adjust = document.querySelectorAll('.grid_adjust');
let note_menu_color = document.querySelectorAll('#note_menu_color');

color.value = '#b19bff';
grid_color.value = '#292929';
back_color.value = '#1b1b1b';

let zIndexCounter = 1;
const zIndexMax = 990;

add_button.addEventListener('mousedown', (event) => {
    let newNote = document.createElement('div');
    newNote.classList.add('note');
    let bar = document.createElement('div');
    bar.classList.add('bar');
    bar.innerHTML = `
        <span class="menu note_buttons">
            <svg viewBox="0 0 26.03 17.09">
              <rect class="rect" x="0" y="0" width="26.03" height="3.09" rx="1.54" ry="1.54"/>
              <rect class="rect" x="0" y="7" width="26.03" height="3.09" rx="1.54" ry="1.54"/>
              <rect class="rect" x="0" y="14" width="26.03" height="3.09" rx="1.54" ry="1.54"/>
            </svg>
        </span>
        <div class="note_menu">
            <ul>
                <li>
                    Color<input class="note_menu_color" id="note_menu_color" type="color">
                </li>
                <li class="export_note">
                    Export Note
                    <svg class="menu_icon" viewBox="0 0 48 48">
                        <path d="M12.5 5C9.467 5 7 7.467 7 10.5L7 37.5C7 40.533 9.467 43 12.5 43L24.5 43C27.533 43 30 40.533 30 37.5L30 25.5L15.5 25.5C14.671 25.5 14 24.829 14 24C14 23.171 14.671 22.5 15.5 22.5L30 22.5L30 10.5C30 7.467 27.533 5 24.5 5L12.5 5 z M 30 22.5L30 25.5L37.878906 25.5L33.439453 29.939453 A 1.50015 1.50015 0 1 0 35.560547 32.060547L42.560547 25.060547 A 1.50015 1.50015 0 0 0 42.560547 22.939453L35.560547 15.939453 A 1.50015 1.50015 0 0 0 34.484375 15.484375 A 1.50015 1.50015 0 0 0 33.439453 18.060547L37.878906 22.5L30 22.5 z" fill="#5B5B5B" />
                      </svg>
                </li>
                <li>
                    Pin Note
                    <svg class="menu_icon" viewBox="0 0 48 48">
                        <path d="M18.980469 5C17.769004 4.9770039 16.603719 5.4403281 15.730469 6.3144531L6.3144531 15.730469C5.3164531 16.728469 4.8510625 18.102953 5.0390625 19.501953C5.2270625 20.899953 6.0386719 22.102734 7.2636719 22.802734L17.363281 28.576172L21.15625 38.056641C21.34425 38.524641 21.752094 38.86775 22.246094 38.96875C22.347094 38.98975 22.447828 39 22.548828 39C22.941828 39 23.325375 38.844547 23.609375 38.560547L30.023438 32.144531L40.439453 42.560547 A 1.50015 1.50015 0 1 0 42.560547 40.439453L32.144531 30.023438L38.560547 23.609375C38.916547 23.253375 39.06975 22.740094 38.96875 22.246094C38.86775 21.752094 38.525641 21.34325 38.056641 21.15625L28.574219 17.363281L22.804688 7.2636719C22.104687 6.0386719 20.900953 5.2270625 19.501953 5.0390625C19.327703 5.0156875 19.153535 5.0032852 18.980469 5 z" fill="#5B5B5B" />
                      </svg>
                </li>
            </ul>
        </div>
        <span class="close note_buttons">X</span>
    `;
    bar.style.backgroundColor = color.value;
    let content = document.createElement('div');
    content.classList.add('content');
    content.innerHTML = `
        <input type="text" placeholder="Enter Title" class="title">
        <textarea placeholder="Write your text..."></textarea>`;
    newNote.appendChild(bar);
    newNote.appendChild(content);
    notes.appendChild(newNote);

    newNote.querySelector('#note_menu_color').value = color.value;

    zIndexCounter += 1;
    newNote.style.zIndex = zIndexCounter;
    if (zIndexCounter > zIndexMax) {
            zIndexCounter = 1;
            const allNotes = document.querySelectorAll('.note');
            allNotes.forEach((note, index) => {
                note.style.zIndex = index + 1;
                zIndexCounter = index + 1;
            });
    }

    let curser = {
        x: null,
        y: null
    }
    let note = {
        dom: null,
        x: null,
        y: null
    }

    curser = {
        x: event.clientX,
        y: event.clientY
    }
    note = {
        dom: newNote,
        x: event.target.getBoundingClientRect().left,
        y: event.target.getBoundingClientRect().top
    }

    currentCurser = {
        x: event.clientX,
        y: event.clientY
    }
    distance = {
        x: currentCurser.x - curser.x,
        y: currentCurser.y - curser.y
    }
    
    newNote.style.left = (note.x + distance.x + 40) + 'px';
    newNote.style.top = (note.y + distance.y + 40) + 'px';
    newNote.classList.add('reveal')

    document.addEventListener('mousemove', (event) => {
        if (note.dom == null) return;
        currentCurser = {
            x: event.clientX,
            y: event.clientY
        }
        distance = {
            x: currentCurser.x - curser.x,
            y: currentCurser.y - curser.y
        }
        note.dom.style.left = (note.x + distance.x + 40) + 'px';
        note.dom.style.top = (note.y + distance.y + 40) + 'px';
    })
    
    document.addEventListener('mouseup', () => {
        note.dom = null
    })
})

document.addEventListener('click', (event) => {
    if(event.target.classList.contains('close')) {
        event.target.closest('.note').remove();
    }
    else if(event.target.classList.contains('check_button_container')) {
        if(event.target.classList.contains('checked')) {
            event.target.classList.remove('checked');
            if (event.target.classList.contains('grid_check')) {
                document.documentElement.style.setProperty('--grid-think', '0px');
                grid_adjust.forEach(element => {
                    element.classList.add('disable')
                })
            }
            
        } else {
            event.target.classList.add('checked');
            if (event.target.classList.contains('grid_check')) {
                document.documentElement.style.setProperty('--grid-think', grid_think.value + "px");
                grid_adjust.forEach(element => {
                    element.classList.remove('disable')
                })
            }
        }
    }
    else if(event.target.classList.contains('setting')) {
        if(setting_menu.classList.contains('show')) {
            setting_menu.classList.remove('show');
            setting.style.backgroundColor = '#535353';
            setting.style.color = 'white';
            setting_icon.querySelector('path').style.fill = 'white';
            setting_icon.style.rotate = '0deg';
        } else {
            setting_menu.classList.add('show');
            setting.style.backgroundColor = '#a7a7a7';
            setting.style.color = '#272727';
            setting_icon.querySelector('path').style.fill = '#272727';
            setting_icon.style.rotate = '180deg';
        }
    } else if (event.target.closest('.note')) {
        if (event.target.classList.contains('note_menu_color')) {
            event.target.oninput = () => {
                event.target.closest('.bar').style.backgroundColor = event.target.value;
            }
        }
        else if (event.target.classList.contains('export_note')) {
            exported_text = `Title = ${event.target.closest('.note').querySelector('.title').value}\nNote = ${event.target.closest('.note').querySelector('textarea').value}`
            console.log(exported_text)
        } else if (event.target.classList.contains('menu')) {
            if (event.target.closest('.note').querySelector('.note_menu').classList.contains('reveal')) {
                event.target.closest('.note').querySelector('.note_menu').classList.remove('reveal')
            } else {
                event.target.closest('.note').querySelector('.note_menu').classList.add('reveal')
            }
        } else {
            const note = event.target.closest('.note');
            zIndexCounter += 1;
            note.style.zIndex = zIndexCounter;
            if (zIndexCounter > zIndexMax) {
                zIndexCounter = 1;
                const allNotes = document.querySelectorAll('.note');
                allNotes.forEach((note, index) => {
                    note.style.zIndex = index + 1;
                    zIndexCounter = index + 1;
                });
            }
        }
    }
})

document.addEventListener('mousedown', (event) => {
    if (event.target.closest('.note')) {
        const note = event.target.closest('.note');
        zIndexCounter += 1;
        note.style.zIndex = zIndexCounter;
        if (zIndexCounter > zIndexMax) {
                zIndexCounter = 1;
                const allNotes = document.querySelectorAll('.note');
                allNotes.forEach((note, index) => {
                    note.style.zIndex = index + 1;
                    zIndexCounter = index + 1;
                });
        }
    }
})

grid_think.oninput = () => {
    document.documentElement.style.setProperty('--grid-think', grid_think.value + "px")
}

grid_size.oninput = () => {
    document.documentElement.style.setProperty('--grid-size', grid_size.value + "px")
}

grid_color.oninput = () => {
    document.documentElement.style.setProperty('--grid-color', grid_color.value)
}

back_color.oninput = () => {
    document.documentElement.style.setProperty('--back-color', back_color.value)
}

let curser = {
    x: null,
    y: null
}
let note = {
    dom: null,
    x: null,
    y: null
}

document.addEventListener("mousedown", (event) => {
    if(event.target.classList.contains("bar")) {
        curser = {
            x: event.clientX,
            y: event.clientY
        }
        note = {
            dom: event.target.closest('.note'),
            x: event.target.getBoundingClientRect().left,
            y: event.target.getBoundingClientRect().top
        }
    }
})

document.addEventListener('mousemove', (event) => {
    if (note.dom == null) return;
    currentCurser = {
        x: event.clientX,
        y: event.clientY
    }
    distance = {
        x: currentCurser.x - curser.x,
        y: currentCurser.y - curser.y
    }
    note.dom.style.left = (note.x + distance.x) + 'px';
    note.dom.style.top = (note.y + distance.y) + 'px';
})

document.addEventListener('mouseup', () => {
    note.dom = null
})