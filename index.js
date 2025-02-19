const express = require('express')
const cors = require('cors') // Import cors
const morgan = require('morgan')
require('dotenv').config() // Load environment variables
const Person = require('./models/person') // Import Mongoose Model


const app = express()

app.use(cors()) // Enable CORS for all routes
app.use(morgan('tiny')) // Morgan logging middleware
app.use(express.json()) // Middleware to parse JSON bodies
app.use(express.static('dist'))



// GET request route
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((people) => {
      res.json(people)
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: 'Internal server error' })
    })
})



// GET /info - Count people in DB
app.get('/info', (req, res) => {
  Person.countDocuments()
    .then(count => {
      res.send(`
        <p>PhoneBook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch(error => {
      console.error('Error fetching count:', error)
      res.status(500).json({ error: 'Internal server error' })
    })
})

// GET a single person by ID
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id // Get ID from the URL

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person) // Return the found person
      } else {
        res.status(404).json({ error: 'Person not found' }) // If no person found
      }
    })
    .catch((error) => next(error)) // Pass any errors to the error handler
})




// DELETE a person from DB
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch((error) => next(error)) // Pass error to the middleware
})



// POST a new person to DB
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  if (name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters long' })
  }

  // Check if the person already exists in the database
  Person.findOne({ name })
    .then(existingPerson => {
      if (existingPerson) {
        // If person exists, update their number
        return Person.findByIdAndUpdate(
          existingPerson._id,
          { number },
          { new: true, runValidators: true }
        )
      } else {
        // Otherwise, create a new entry
        const newPerson = new Person({ name, number })
        return newPerson.save()
      }
    })
    .then(savedPerson => {
      res.json(savedPerson) // Respond with updated/created person
    })
    .catch(error => next(error)) // Pass errors to middleware
})

app.put('/api/persons/:id', (req, res, next) => {
  const { number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (!updatedPerson) {
        return res.status(404).json({ error: 'Person not found' })
      }
      res.json(updatedPerson)
    })
    .catch(error => next(error)) // Handle errors
})


// Middleware for error handling
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted ID' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message }) // Send validation error messages to frontend
  }

  next(error)
}

// Middleware
app.use(errorHandler)


// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})