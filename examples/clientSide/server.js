
const express = require('express')
const port = 3000

const app = express(),
      staticServe = express.static(`${ __dirname }/client`);

app.use("/", staticServe);
app.use("*", staticServe);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))