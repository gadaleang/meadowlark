const express = require('express')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const fortune = require('./lib/fortune')
const tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
    ]

//configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}))
app.set('view engine','handlebars')

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', handlers.home)

app.get('/about', handlers.about)

app.get('/greeting', (req,res) => {
    res.render('greeting', {
        message: 'Hello esteemed programmer!',
        style: req.query.style,
        userid: req.cookies.userid,
        username: req.session.username
    })
})

app.get('/no-layout', (req,res) => 
    res.render('no-layout', { layout: null })
)

app.get('/text', (req, res) => {
    res.type('text/plain')
    res.send('Acesta este un test')
})

app.put('/api/tour/:id', (req, res) => {
    const p = tours.find(p => p.id === parseInt(req.params.id))
    if(!p) return res.status(404).json({ error: 'No such tour exists' })
    if(req.body.name) p.name = req.body.name
    if(req.body.price) p.price = req.body.price
    res.json({ success: true })
    })

    app.delete('/api/tour/:id', (req, res) => {
        const idx = tours.findindex(tour => tour.id === parseInt(req.params.id))
        if(idx<0) return res.json({error: 'Nu exusta turul asta'})
        tours.splice(idx, 1)
        res.json({ success: true })
        })

    app.put('/api/tour/:id', (req, res) => {
        const p = tours.find(p => p.id === parseInt(req.params.id))
        if(!p) return res.status(404).json({ error: 'No such tour exists' })
        if(req.body.name) p.name = req.body.name
        if(req.body.price) p.price = req.body.price
        res.json({ success: true })
        })

app.get('/api/tours', (req, res) => {
    const toursXml = '<?xml version="1.0"?><tours>' + 
    tours.map(p =>
        `<tour price="${p.price}" id="${p.id}">${p.name}</tour>`
    ).join('') + '</tours>'
    const toursText = tours.map(p =>
        `${p.id}: ${p.name} (${p.price})`
    ).join('\n')
    res.format({'application/json': () => res.json(tours),
        'application/xml': () => res.type('application/xml').send(toursXml),
        'text/xml': () => res.type('text/xml').send(toursXml),
        'txt/plain': () => res.type('text/plain').send(toursXml),
    })
})



app.get('/headers', (req, res) => {
    res.type('text/plain')
    const headers = Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`)
    res.send(headers.join('\n'))
})

app.post('/process-contact', (req, res) => {
    try {
    // here's where we would try to save contact to database or other
    // persistence mechanism...for now, we'll just simulate an error
    if(req.body.simulateError) throw new Error("error saving contact!")
    console.log(`contact from ${req.body.name} <${req.body.email}>`)
    res.format({
        'text/html': () => res.redirect(303, '/thank-you'),
        'application/json': () => res.json({ success: true }),
        })
        } catch(err) {
          // here's where we should handle any persistence failures
          console.error(`error processing contact from ${req.body.name}` +
          `<${req.body.email}>`)
          res.format({
            'text/html': ()=> res.redirect(303, '/contact-error'),
            'application/json': () => res.status(500).json({error: 'error saving contat information '}),
        })   
    }
})

// custom 404 page
app.use(handlers.notFound)

// custom 500 page
app.use(handlers.serverError)


app.listen(port, () => console.log(
    `Express a pornit la http://localhost:${port}; ` +
    `apasa Ctrl-C pentru terminare.`))
