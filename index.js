const express = require('express');
const cors = require('cors'); // Import cors
const morgan = require('morgan');
require('dotenv').config() // Load environment variables
const Person = require('./models/person') // Import Mongoose Model


const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(morgan('tiny')); // Morgan logging middleware
app.use(express.json()); // Middleware to parse JSON bodies
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



// ✅ **GET /info - Count people in DB**
app.get('/info', (req, res) => {
  Person.countDocuments()
    .then(count => {
      res.send(`
        <p>PhoneBook has info for ${count} people</p>
        <p>${new Date()}</p>
      `);
    })
    .catch(error => {
      console.error('Error fetching count:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// ✅ **GET a single person by ID**
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person);
      else res.status(404).json({ error: 'Person not found' });
    })
    .catch(error => {
      console.error('Error fetching person:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// ✅ **DELETE a person from DB**
app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => {
      console.error('Error deleting person:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// ✅ **POST a new person to DB**
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required' });
  }

  const person = new Person({ name, number });

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => {
      console.error('Error saving person:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// ✅ **Start the server**
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});