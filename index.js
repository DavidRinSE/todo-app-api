require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const openapiSpec = YAML.load("./specification.yaml");

const app = express()
const port = (process.env.PORT) ?  process.env.PORT : 3000
const {controller} = require("./controllers")

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(express.json({
    type: ['application/json', 'text/plain']
}))
app.use(cors())

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec))
app.get('/api', (req, res) => {
    res.redirect("/docs")
})

app.use('/api/user', controller.user)
app.use('/api/auth', controller.auth)
app.use('/api/board', controller.board)
app.use('/api/task', controller.task)

app.get('/', (req, res) => {
    res.redirect("/docs")
})

app.listen(process.env.PORT || port, () => {
    console.log(`App running on port ${port}.`)
})