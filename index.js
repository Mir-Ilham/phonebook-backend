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

app.get('/info', (request, response, next) => {
  const now = new Date()
  Person.find({})
    .then(persons => {
      return response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${now.toString()}</p>
        `
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const number = request.body.number

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.number = number

      return person.save().then((updatedPerson => {
        response.json(updatedPerson)
      }))
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})