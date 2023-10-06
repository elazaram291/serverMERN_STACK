const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const UserModel = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'wretrytuyi678iib@u&xerftgy'
require('dotenv').config();

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


mongoose.connect(process.env.MONGO_URL)


app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (res, req) => {
    const { name, email, password } = req.body;
    try {
        const user = await UserModel.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        console.log(user, "api")
        res.json(user);
    }catch (e) {
        res.statusCode(422).json(e);
    }
})


app.post('login',async (req,res) => {
    const {email , password} = req.body;
    const user = await UserModel.findOne({email})
    if (user) {
        const passOk = bcrypt.compareSync(password,user.password)
        if(passOk){
            jwt.sign({email:user.email, id:user._id},jwtSecret,{},(err,token) => {
                if(err) throw err;
                res.cookie('token',token).json('pass Ok')
            })
        }else{
            res.json('pass not Ok')
        }
        res.json('found');
    }else{
        res.json('not found')
    }
})

console.log('hi')
app.listen(3001);