var express = require('express')
var cors = require('cors')
require('dotenv').config()
const mysql = require('mysql2')
var app = express()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE

})

app.use(cors())

app.get('/hello',function(req,res,next){
    res.json({msg:'helloworld'})

})
app.get('/students',function(req,res,next){
    pool.query("SELECT * FROM student",function(err,rows,fields){
        console.log(err)
        res.json(rows)
    })
})
app.listen(5000,function(){
    console.log('web server listening on port 5000')
})