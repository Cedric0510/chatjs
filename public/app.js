const api = new API('/api')
const user = prompt('Qui êtes vous ?')

const title = document.getElementById('title')
const tabs = document.getElementById('tabs')
const main = document.getElementById('main')
const input = document.getElementById('input')

function htmlToElem(html) {
  let temp = document.createElement('template');
  html = html.trim()
  temp.innerHTML = html;
  return temp.content.firstChild;
}

function createRoomTab(room, active = false) {
  return htmlToElem(`
    <label id="${room.name}_tab" class="tab" data-news="0">
      <input onchange="changeRoom('${room.name}')" type="radio" name="tab" value="${room.name}" checked="${active}" /> 
      ${room.name}
    </label>`)
}

function createRoomWindow(room, active = true) {
  return htmlToElem(`
    <div id="${room.name}" class="window">
      <input id="${room.name}_input" type="radio" name="window" value="${room.name}" checked="${active}" />
    </div>`)
}

function createMessageDiv(message) {
  return htmlToElem(`
    <div class="message ${message.author == user ? 'mine' : ''}">
      <div class="header">
        <span class="author">${message.author}</span>
        <span class="date">${new Date(message.date).toLocaleString()}</span>
      </div>
      <div class="main">
        ${message.text}
      </div>
    </div>`)
}

function changeRoom(roomName) {
  document.getElementById(`${roomName}_input`).checked = true
  title.innerText = roomName
}

async function joinRoom() {
  const name = prompt("Indiquez le nom de la salle")
  if (name && !document.getElementById[name]) {
    let room = await api.getRoom(name)
    if (!room.name) {
      room = await api.createRoom(name)
    }
    tabs.prepend(createRoomTab(room))
    main.append(createRoomWindow(room))
    title.innerText = room.name
    for (const msg of room.messages) {
      addMessage(room.name, msg)
    }
  }
}

async function send() {
  const currentRoom = document.querySelector('input[name="tab"]:checked').value;
  input.setAttribute('disabled', true)
  await api.sendMessage(currentRoom, { author: user, text: input.value })
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
    for (let i = window.childElementCount - 1; i < room.messages.length; i++) {
      addMessage(roomName, room.messages[i])
    }
  }
}, 1000)