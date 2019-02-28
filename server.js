const express = require('express'),
    app = express(),
    cors = require('cors'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    Users = require('./models/User'),
    Message = require('./models/Message'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');
    require('dotenv').config()

// To store server connection
let server = null 

const PORT = process.env.PORT || 8080;


// --- Connect DB and run server ---
mongoose.connect('mongodb://localhost:27017/Journey', { useNewUrlParser: true });
const connection = mongoose.connection
connection.on('open', (err, db) => {
    server = app.listen(PORT, () => {
        console.log(`server running on ${PORT}`)
    })
    console.log('mongoose connected')
    handleSocket()
});

// --- MiddleWare ---

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json() )
app.use(express.static('public') )

authorize = (req, res, next) => {
    // retrieve token from header with name 'authorization'
    const token = req.headers.authorization
    // if no token, reject with 401 status
    if (!token) {
        return res.status(401).json({ "msg": "no token provided" })
    }
    // if there is a token, try to verify it
                    // Will require a secret key to work
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        // if it is NOT authentic, reject with 401
        if (!decoded) {
            return res.json({ "msg": "invalid token" })
        }
        // else if it IS authentick, store identity at req.user and call next
        req.user = decoded;
        next();
    })
}


// --- Socket.io ---
handleSocket = () => {
    const socketio = require('socket.io');
    const io = socketio(server)
    
    io.on('connection', (socket) => {
        console.log(`new connection: ${socket.id}`)

        socket.on('join', (id, err) => {
            socket.join(id)
            Message.find({ chatroomId: id })
                .then(messages => {
                    io.to(id).emit('messages', messages)
                })
                .catch(err => console.log(err))
        })

        socket.on("newMessage", (data) => {
            let middle = data.chatroomId.length / 2
            var id1 = data.chatroomId.slice(0, middle);
            var id2 = data.chatroomId.slice(middle);
            id1 === data.sender.id ? data.receiver = id2 : data.receiver = id1
            // save to msg to db
            newMessage = new Message(data)
            newMessage.save()
                .then( (data) => {
                    // send msg to others
                    io.to(data.chatroomId).emit("received", data)
                })
                .catch(err => console.log(err))
            
        })


        socket.on('disconnect', (id) => {
            console.log("leaving")
            socket.leave(id)
        })

    })

}


// --- PATHS ---

app.post('/signup', (req, res) => {
    const newUser = new Users(req.body);
    bcrypt.hash(newUser.password, 12, function (err, hash) {
        if (err) {
            return res.status(500).json({ "msg": "Scrambled Error" })
        }
        newUser.password = hash;
        newUser.save()
            .then( () => {
                res.json({"msg" : "Signup successful"})
            })
            .catch(err => res.status(400).json(err))
    });
})

app.post('/login', (req, res) => {
    let { email, password } = req.body;
    Users.findOne({email: email})
        .then( user => {
            bcrypt.compare(password, user.password, (err, result) => {
            if (result) {                                                       // Will require a secret key to work
                    const token = jwt.sign({ subject: user.email, db: user._id }, process.env.SECRET_KEY, {expiresIn: '10h'});
                    res.json({ token: token })
                } else {
                    res.status(401).json({ 'msg': "Invalid email or password" })
                }
            })
        })
        .catch( err => res.status(401).json({ 'msg': "Invalid email or password" }))
})

app.post('/me', authorize, (req, res) => {
    const id = req.user.db
    Users.findOne({ _id: id })
        .then( userLoggedin => {
            res.json(userLoggedin)
        })
        .catch(err => console.log(err))
})

app.put('/users/', (req, res) => {
    let {lng, lat} = req.body.loc
    Users.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [lng, lat] },
                distanceField: "dist.calculated",
                maxDistance: 50000,
                includeLocs: "dist.location",
                num: 10, 
                spherical: true
            }
        }
    ])
    .then(
        Users.updateOne(
            {_id: req.body.id},
            { location: { type: "Point", coordinates: [lng, lat]} }
        )
    )
    .then( found => { res.json(found)})
    .catch(err => res.status(500).json(err))
})

app.get('/profile/:userId', (req, res) => {
    Users.findById(req.params.userId)
        .then( user => {
            res.json(user)
        })
        .catch( err => res.status(400).json(err))
})

app.put('/profile/', (req, res) => {
    Users.findOneAndUpdate(
        { _id: req.body._id},
        req.body
    )
    .then(found => 
        res.json(found)
    )
    .catch(err => {
        res.status(400).json(err)
    })
})

app.delete('/profile/:id/interest/:word', (req, res) => {
    let {id, word} = req.params
    Users.findOneAndUpdate(
        { _id: id},
        { $pull: {interests : word }}
    )
    .then( removed => res.json(removed))
    .catch(err => res.status(400).json(err))
})

app.get('/chats/:id', (req, res) => {
    Message.find({
        "sender.id": req.params.id
    })
    .then( sentMsg => {
        let uniqueId = []
        sentMsg.forEach((item) => {
            let unique = true;
            uniqueId.forEach( (each) => {
                if (item.receiver === each.receiver) { unique = false }
            });
            if (unique) uniqueId.push(item.receiver);
        });
        Users.find({
            _id: uniqueId
        })
        .then(users => res.json(users))
        .catch(err => res.status(400).json(err))
    })
    .catch(err => res.status(400).json(err))
})