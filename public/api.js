async function FETCH(url, options = {}) {
  return (await fetch(url, {
    headers: new Headers({
      "Content-Type": "application/json",
      accept: "application/json",
    }),
    ...options
  })).json()
}

const GET = (url) => FETCH(url)
const POST = (url, body) => FETCH(url, { method: "POST", body: JSON.stringify(body) })
const PUT = (url, body) => FETCH(url, { method: "PUT", body: JSON.stringify(body) })
const DELETE = (url) => FETCH(url, { method: "DELETE" })

class API {
  constructor(url) {
    this.url = url
  }

  async getRooms() {
    return GET(`${this.url}/rooms`)
  }

  async getRoom(id) {
    return GET(`${this.url}/rooms/${id}`)
  }

  async createRoom(name) {
    return POST(`${this.url}/rooms`, { name })
  }

  async sendMessage(roomId, message) {
    return POST(`${this.url}/rooms/${roomId}`, message)
  }

  async getLastMessages(roomId, lastId) {
    return GET(`${this.url}/rooms/${roomId}?from=${lastId}`)
  }
}