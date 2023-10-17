// Imports - required libraries
const express = require('express');
const cors = require('cors');
// Initializations
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());

// root routes 
app.get('/', (req, res) => {
  res.send('Halo Server is running');
})

app.listen(port, () => {
  console.log(`Halo app is listening to port ${port}`);
})