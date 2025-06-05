const api = new API('/api')

let currentUser = null;
let currentRoom = null;

const title = document.getElementById('title')
const tabs = document.getElementById('tabs')
const main = document.getElementById('main')
const input = document.getElementById('input')
const users = document.getElementById('users')
const authModal = document.getElementById('auth-modal')
const authForm = document.getElementById('auth-form')
const authTitle = document.getElementById('auth-title')
const authSubmit = document.getElementById('auth-submit')
const authError = document.getElementById('auth-error')
const authName = document.getElementById('auth-name')
const authPassword = document.getElementById('auth-password')


function toggleAuthMode() {
  const mode = document.querySelector('input[name="auth-mode"]:checked').value;
  
  if (mode === 'login') {
    authTitle.textContent = 'Connexion';
    authSubmit.textContent = 'Se connecter';
  } else {
    authTitle.textContent = 'Inscription';
    authSubmit.textContent = "S'inscrire";
  }
  
  authError.textContent = '';
}

// FORM
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const mode = document.querySelector('input[name="auth-mode"]:checked').value;
  const name = authName.value.trim();
  const password = authPassword.value;
  
  if (!name || !password) {
    authError.textContent = 'Veuillez remplir tous les champs';
    return;
  }
  
  try {
    if (mode === 'register') {
      currentUser = await api.registerUser(name, password);
    } else {
      currentUser = await api.loginUser(name, password);
    }
    
    if (currentUser && currentUser.id) {
      console.log('Utilisateur authentifié:', currentUser);
      authModal.style.display = 'none';
      await loadMyRooms();
    } else {
      authError.textContent = currentUser.error || 'Erreur inconnue';
    }
    
  } catch (error) {
    console.error('Erreur auth:', error);
    authError.textContent = 'Erreur de connexion';
  }
});


async function init() {
  authModal.style.display = 'flex';
}

async function loadMyRooms() {
  try {
    if (!currentUser || !currentUser.id) {
      return;
    }
    
    const roomNames = await api.getMyRooms(currentUser.id);
    
    for (const roomName of roomNames) {
      const room = await api.getRoom(roomName);
      if (room && !document.getElementById(roomName)) {
        tabs.append(createRoomTab(room));
        main.append(createRoomWindow(room));
        
        for (const msg of room.messages || []) {
          addMessage(roomName, msg);
        }
      }
    }
    
    if (roomNames.length > 0) {
      await changeRoom(roomNames[0]);
    }
  } catch (error) {
    console.error('Erreur load my rooms:', error);
  }
}

function htmlToElem(html) {
  let temp = document.createElement('template');
  html = html.trim()
  temp.innerHTML = html;
  return temp.content.firstChild;
}

function createRoomTab(room, active = false) {
  return htmlToElem(`
    <label id="${DOMPurify.sanitize(room.name)}_tab" class="tab" data-news="0">
      <input onchange="changeRoom('${DOMPurify.sanitize(room.name)}')" type="radio" name="tab" value="${DOMPurify.sanitize(room.name)}" checked="${active}" /> 
      ${DOMPurify.sanitize(room.name)}
    </label>`)
}

function createRoomWindow(room, active = true) {
  return htmlToElem(`
    <div id="${DOMPurify.sanitize(room.name)}" class="window">
      <input id="${DOMPurify.sanitize(room.name)}_input" type="radio" name="window" value="${DOMPurify.sanitize(room.name)}" checked="${active}" />
    </div>`)
}

function createMessageDiv(message) {
  const authorName = message.author?.name || message.author;
  return htmlToElem(`
    <div class="message ${authorName == currentUser?.name ? 'mine' : ''}">
      <div class="header">
        <span class="author">${DOMPurify.sanitize(authorName)}</span>
        <span class="date">${new Date(message.date).toLocaleString()}</span>
      </div>
      <div class="main">
       ${DOMPurify.sanitize(message.text)}
      </div>
    </div>`)
}

async function changeRoom(roomName) {
  try {
    document.getElementById(`${roomName}_input`).checked = true
    title.innerText = roomName
    
    await api.enterRoom(roomName, currentUser.name);
    currentRoom = roomName;
    
    await loadRoomUsers(roomName);
    
  } catch (error) {
    console.error('Erreur changeRoom:', error);
  }
}

async function joinRoom() {
  const name = prompt("Indiquez le nom de la salle")
  if (name && !document.getElementById(name)) {
    try {
      let room = await api.getRoom(name)
      if (!room || !room.name) {
        room = await api.createRoom(name)
      }
      
      await api.joinRoom(name, currentUser.id)
      
      tabs.prepend(createRoomTab(room))
      main.append(createRoomWindow(room))
      await changeRoom(room.name)
      
      for (const msg of room.messages || []) {
        addMessage(room.name, msg)
      }
    } catch (error) {
      console.error('Erreur joinRoom:', error)
    }
  }
}

async function loadRoomUsers(roomName) {
  try {
    const roomUsers = await api.getRoomUsers(roomName);
    displayUsers(roomUsers);
  } catch (error) {
    console.error('Erreur loadRoomUsers:', error);
  }
}

function displayUsers(userList) {
  users.innerHTML = '';
  userList.forEach(userName => {
    const userDiv = htmlToElem(`<div class="user">${DOMPurify.sanitize(userName)}</div>`);
    users.appendChild(userDiv);
  });
}

async function send() {
  if (!currentUser) return;
  
  const roomName = document.querySelector('input[name="tab"]:checked').value;
  const room = await api.getRoom(roomName);
  
  input.setAttribute('disabled', true)
  
  await api.sendMessage({
    text: input.value,
    userId: currentUser.id,
    roomId: room.id
  })
  
  input.removeAttribute('disabled')
  input.value = ''
  input.focus()
}

function addMessage(roomName, message) {
  const window = document.getElementById(roomName)
  const messageDiv = createMessageDiv(message)
  window.append(messageDiv)
  messageDiv.scrollIntoView()
}

setInterval(async () => {
  if (!currentRoom) return;
  
  const windows = [...document.getElementsByClassName('window')]
  for (const window of windows) {
    const roomName = window.id
    const room = await api.getRoom(roomName)
    for (let i = window.childElementCount - 1; i < (room.messages?.length || 0); i++) {
      addMessage(roomName, room.messages[i])
    }
  }
  
  await loadRoomUsers(currentRoom);
}, 1000)

init();