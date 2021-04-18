const socket = io('/') // socket이 app이 실행중인 root path와 연결되도록
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/', //root
    port: '3001'
}) // connection to peer server
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

// webcam 띄우기
navigator.mediaDevices.getUserMedia({
    video: true,
   // audio: true
}).then(stream => {
    addVideoStream(myVideo, stream) // video 띄우기
    
    // recieving calls
    myPeer.on('call', call => {
        call.answer(stream) //추가된 new user의 call 띄우기
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        }) ///추가된 new user의 입장에서도 기존 user 띄우기
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })
})

// 방 나간 유저 바로 지우기
socket.on('user-disconnected', userId => {
    if (peers[userId])  peers[userId].close()
})

// 비디오 띄우기
function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

// making calls
function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call;
}