import fs from 'node:fs/promises'

/*

TASK TYPE

task = {
  id: string (uuid),
  title: string,
  description: string,
  completed_at: Date // toISOString => yyyy-MM-ddThh:mm:ss
  created_at: Date // toISOString => yyyy-MM-ddThh:mm:ss
  updated_at: Date // toISOString => yyyy-MM-ddThh:mm:ss
}

*/

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, true, 2))
  }

  select(table, search) {
    let data = this.#database[table]

    // if (search.name && search.email) {
    //   data = data.filter(row => {
    //     return Object.entries(search).some(([key, value]) => {
    //       return row[key].includes(value)
    //     })
    //   })
    // }

    return data
  }

  find(table, id) {
    let data = this.#database[table]
    return data.find(row => row.id === id)
  }

  insert(table, data) {
    const date = new Date().toISOString()
    data.created_at = date
    data.updated_at = date
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  delete(table, id) {
    const date = new Date().toISOString()
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex].updated_at = date
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update(table, id, data) {
    const date = new Date().toISOString()
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { ...this.#database[table][rowIndex], ...data, updated_at: date }
      this.#persist()
      return this.#database[table][rowIndex]
    }
  }

}