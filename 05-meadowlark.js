const express = require('express')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers')
const app = express()
const port = process.env.PORT || 3000
const fortune = require('./lib/fortune')

//configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}))
app.set('view engine','handlebars')

app.use(express.static(__dirname + '/public'))

//app.get('/', (req, res) => res.render('home'))
app.get('/', handlers.home)

/*
app.get('/about', (req, res) => {
    res.render('about', { fortune: fortune.getFortune() })
})
*/
app.get('/about', handlers.about)
// custom 404 page
/*
app.use((req, res) => {    
    res.status(404)
    res.render('404')
})
*/
app.use(handlers.notFound)

// custom 500 page
/*
app.use((err, req, res, next) =>{
    console.error(err.message)
    res.status(500)
    res.render('500')
})
*/
app.get('/headers', (req, res) => {
    res.type('text/plain')
    const headers = Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`)
    res.send(headers.join('\n'))
})

app.use(handlers.serverError)


app.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate.`))
