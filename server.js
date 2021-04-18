const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs') // view engine 설정
app.use(express.static('public')) // html, css등 static file들 경로 설정

// creating a new room -> redirect to the room
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`) // dynamic url -> url 뒤에 uuid 붙음
})

// 해당 room으로 들어가게
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId) // new user join시 알림
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        })
    })
})

server.listen(3000)