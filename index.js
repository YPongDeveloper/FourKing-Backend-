var express = require('express')
var cors = require('cors')
require('dotenv').config()
const mysql = require('mysql2')
var app = express()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE

})
app.use(express.json());
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
app.get('/read', (req, res) => {
    const sqlQuery = 'SELECT * FROM student';
  
    pool.query(sqlQuery, (err, results, fields) => {
      if (err) throw err;
  
      res.json(results);
    });
  })
app.get('/read/:id', async(req, res) => {
    const id=req.params.id;
  
    try{
        pool.query(
            'SELECT * FROM student WHERE id = ?',
            [id],
            (err,results,fields)=>{
                if(err){
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
  })
  app.get('/read/school/:school', async(req, res) => {
    const school=req.params.school;
  
    try{
        pool.query(
            'SELECT * FROM student WHERE school = ?',
            [school],
            (err,results,fields)=>{
                if(err){
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
  })
  app.post("/create",async(req,res)=>{
    const{id,fristName, lastName, school}=req.body;
    try{
        pool.query(
            'INSERT INTO  student (id, fristName, lastName, school)  VALUES(?,?,?,?)',
            [id,fristName, lastName, school],
            (err,results,fields)=>{
                if(err){
                    console.log("Error while inserting a user into the database",err);
                    return res.status(400).send();
                }
                return res.status(201).json({message:"New user successfully created!"});
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
})
app.put('/update/:id', async(req, res) => {
    const id=req.params.id;
    const{fristName, lastName, school}=req.body;
    
  
    try{
        pool.query(
            'UPDATE student SET fristName=?, lastName=?, school=? WHERE id = ?',
            [fristName, lastName, school,id],
            (err,results,fields)=>{
                if(err){
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json({message:"User password updated suc!"});
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
  });

  app.delete('/delete/:id', async(req, res) => {
    const id=req.params.id;
  
    try{
        pool.query(
            'DELETE FROM student WHERE id = ?',
            [id],
            (err,results,fields)=>{
                if(err){
                    console.log(err);
                    return res.status(400).send();
                }
                if(results.affectedRows == 0){
                    return res.status(404).json({message:"NO Delete employee!"});
                }
                
                return res.status(200).json({message:"Delete employee!"});
            }
        )
    }catch(err){
        console.log(err);
        return res.status(500).send();
    }
  })

app.listen(5000,function(){
    console.log('web server listening on port 5000')
})