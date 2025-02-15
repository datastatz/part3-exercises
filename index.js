const express = require('express');
const app = express();

// For parsing JSON bodies in requests:
app.use(express.json());


// All the data of the PhoneBook
let data = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


// GET request route
app.get('/api/persons', (req, res) => {
  res.json(data);
});

// Get request route
app.get('/info' , (req, res) => {

  // const that create a new Date object
  const dateNow = new Date().toString();

  res.send(`
    <p>PhoneBook has info for 2 people</p>
    <p>${dateNow}</p>
    `)
});

// Get request route for finding individuals
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id
  const person = data.find(data => data.id === id)
  res.json(person)
})

// DELETE request route for deleting a person by id
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  // Filter out the person with the given id
  data = data.filter(person => person.id !== id);

  // Respond with status 204 (No Content) indicating successful deletion
  res.status(204).end();
});

// Adding names and numbers to the backend
app.post("/api/persons", (req, res) => {
  
  //Body of the request
  const body = req.body 

  // Check if the name already exists in the data array
  const nameExists = data.some(person => person.name.toLowerCase() === body.name.toLowerCase());

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  if (!body.name){
    return res.status(400).json({
      error: 'content missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({ 
      error: 'Number is missing' 
    });
  }

  // Generating a random ID
  const randID = Math.floor(Math.random() * 1000000).toString()

  // Creating an object for a new entry
  const newPerson = {
    id: randID,
    name: body.name,
    number: body.number
  }

  // Pushin the new entry into our data array
  data.push(newPerson)

  //Respond with 201 (Created) and the new object named newPerson
  return res.status(201).json(newPerson)
})


// Start the server:
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
