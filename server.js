const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs') // view engine 설정
app.use(express.static('public')) // html, css등 static file들 경로 설정

// creating a new room -> redirect to the room
app.get('/', (req, res) =>{
    res.redirect(`/${uuidV4()}`) // dynamic url
})

// 해당 room으로 들어가게
app.get('/:room', (req, res) =>{
    res.render('room', { roomId: req.params,room })
})

server.listen(3000)