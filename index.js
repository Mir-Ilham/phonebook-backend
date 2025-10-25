require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('post-data', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
  return ' ';
});

const format = ':method :url :status :res[content-length] - :response-time ms :post-data';

app.use(morgan(format));

app.get('/info', (request, response) => {
  const now = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${now.toString()}</p>
    `
  )
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const name = request.body.name
  const number = request.body.number

  if (!name || !number) {
    let error = 'Name and number missing'

    if (name)
      error = 'Number missing'
    else if (number)
      error = 'Name missing'

    return response.status(400).json({
      error: error
    })
  }

  // const match = persons.find(person => person.name === name)

  // if (match) {
  //   return response.status(400).json({
  //     error: 'Name must be unique'
  //   })
  // }

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const match = persons.find(person => person.id === id)
  persons = persons.filter(person => person.id !== id)

  // response.status(204).end()
  response.json(match)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})