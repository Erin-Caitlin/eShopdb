import express from 'express'
import path from 'path'
import { connection as db} from './config/index.js'
import { createToken } from './middleware/AuthenticateUser.js'
import { hash } from 'bcrypt'
import bodyParser from 'body-parser'
// Create an express app
const app = express()
const port = +process.env.PORT || 4000
const router = express.Router()
// Middleware
app.use(router, 
    express.static('./static'),
    express.json(),
    express.urlencoded({
    extended: true
}))

router.use(bodyParser.json())
//endpoint
router.get('^/$|/eShop', (req, res) => {
    res.status(200).sendFile(path.resolve('./static/html/index.html'))
})
router.get('/users', (req, res) => {
    try {
        const strQry = `
        SELECT *
        FROM Users;
        `
        db.query(strQry, (err, results) => {
            // 'Unable to fetch all users'
            if(err) throw new Error(err)
            res.json({
                status: res.statusCode,
                results
            })
        })
    }catch (e) {
        res.json({
            status:404,
            msg: e.message
        })
    }
})
router.get('/users/:id', (req, res) => {
    try {
        const strQry = `
        SELECT userID, firstName, lastName, age, emailAdd
        FROM Users
        WHERE userID = ${req.params.id}
        `
        db.query(strQry, (err, results) => {
            if(err) throw new Error('Unable to fetch user')
                res.json({
                    status: res.statusCode,
                    results: results[0]
                })
        })
    } catch(e) {
        res.json({
            status:404,
            msg: e.message
        })
    }
})

router.get('*', (req, res) => {
    res.json({
        status: 404,
        msg: 'Resource not found'
    })
})

router.post('/register', bodyParser.json(), async (req, res) =>{
    try {
        let data = req.body
            data.pwd = await hash(data.pwd, 12)
        // Payload
        let user = {
            emailAdd: data.emailAdd,
            pwd: data.pwd
        }
        let strQry = `
        INSERT INTO Users
        SET ?;
        `
        // SET ?; is going to update the data of each array
        db.query(strQry, [data], (err) => {
            if (err) {
                res.json({
                    status: res.statusCode,
                    msg: 'This email has already been taken'
                })
            } else {
                const token = createToken(user)
                res.json({
                    token,
                    msg: 'You are now registered.'
                })
            }
        })
    }catch(e) {

    }
})

router.patch('/user/:id', async (req, res) => {
    try {
        let data = req.body
        if (data.pwd) {
            data.pwd = await hash(data.pwd, 12)
        }
        const strQry = `
        UPDATE Users
        SET ?
        WHERE userID = ${req.params.id}
        `
        db.query(strQry, [data], (err) => {
            if (err) throw new Error('Unable to update a user')
                res.json({
                    status: res.statusCode,
                    msg: 'The user record was updated'
                })
        })
    } catch (e) {
        res.json({
            status: 400,
            msg: e.message
        })
    }
})

app.listen(port, () =>{
    console.log(`Server is running on ${port}`);
})