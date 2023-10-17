// Imports
const express = require('express')
// Initializations
const app = express()
const port = process.env.PORT || 3000;

// root routes
app.get('/', (req, res) => {
  res.send('Halo Server is running')
})

app.listen(port, () => {
  console.log(`Halo app is listening to port ${port}`);
})