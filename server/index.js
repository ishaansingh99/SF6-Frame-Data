const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

console.log(app);

app.get('/', (req, res) => {
      res.send('Hello World!')
});

app.listen(8080, () => {
      console.log('server listening on port 8080')
})