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
    return await GET(`${this.url}/rooms`)
  }

  async getRoom(id) {
    return await GET(`${this.url}/rooms/${id}`)
  }

  async createRoom(name) {
    return await POST(`${this.url}/rooms`, { name })
  }


  async createUser(name) {
    return await POST(`${this.url}/users`, { name })
  }

  async sendMessage(messageData) {
    return await POST(`${this.url}/messages`, messageData)
  }

  async getUser(id) {
    return await GET(`${this.url}/users/${id}`)
  }

  async getUsers() {
    return await GET(`${this.url}/users`)
  }
}