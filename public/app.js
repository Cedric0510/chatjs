const api = new API('/api')

let currentUser = null;

const title = document.getElementById('title')
const tabs = document.getElementById('tabs')
const main = document.getElementById('main')
const input = document.getElementById('input')


async function init() {
  try {
    const userName = prompt('Qui êtes vous ?')
    if (!userName) return;
    
    // Créer utilisateur en BDD
    currentUser = await api.createUser(userName);
    console.log('👤 Utilisateur:', currentUser);
  } catch (error) {
    console.error('❌ Erreur init:', error);
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
  const authorName = message.author?.name || message.author; // Compatibilité
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

function changeRoom(roomName) {
  document.getElementById(`${roomName}_input`).checked = true
  title.innerText = roomName
}

async function joinRoom() {
  const name = prompt("Indiquez le nom de la salle")
  if (name && !document.getElementById(name)) {
    let room = await api.getRoom(name)
    if (!room || !room.name) {
      room = await api.createRoom(name)
    }
    tabs.prepend(createRoomTab(room))
    main.append(createRoomWindow(room))
    changeRoom(room.name)
    for (const msg of room.messages || []) {
      addMessage(room.name, msg)
    }
  }
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
  const windows = [...document.getElementsByClassName('window')]
  for (const window of windows) {
    const roomName = window.id
    const room = await api.getRoom(roomName)
    for (let i = window.childElementCount - 1; i < (room.messages?.length || 0); i++) {
      addMessage(roomName, room.messages[i])
    }
  }
}, 1000)


init();