var express=require('express');
const mysql=require('mysql');
var bodyParser=require('body-parser');
const session=require('express-session');
var app=express();
var person=0;
var urlencodedParser=bodyParser.urlencoded({extend:false});

app.set('view engine','ejs');


app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,

}));

const db=mysql.createConnection({
    host     :  'localhost',
    user     :   'shivam',
    password :  'shivam',
    database :  'student'
});

db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('mysql connected!!');

});

app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',urlencodedParser,function(req,res){
    var user={
         "USERNAME":req.body.who,
         "PASSWORD":req.body.pass,
         "EMAIL":req.body.email,
         "PHONENO":req.body.phoneno
    };


    let sql='INSERT INTO find SET ?';
     db.query(sql,user,(err,results,fields)=>{
        if(err) throw err;
        console.log(results);
        res.redirect('/login');
    
});
});


app.get('/login',function(req,res){
    res.render('login');
});
app.post('/login',urlencodedParser,function(req,res){
    var sql="select * from find where USERNAME='"+ req.body.who +"' and  PASSWORD ='"+ req.body.pass +"'";
    
    db.query(sql,function(err,result,fields){
        if(err) throw err;
        
        else{
            
            if(result.length!=0)
            {
                req.session.person=req.body.who;
    
                
                
            res.render('data',{person:req.session.person});

            
        }
            else{
            res.send("incorrect username or password"); 

            }
        
        }
    });
   
});
app.get('/data',(req,res)=>{
    res.render('data');
    
});
app.post('/data',urlencodedParser,(req,res)=>{
    res.render('data');
    
});
app.get('/logout',function(req,res){
    req.session.person = null; 
    res.render('login');
});

app.get('/search',(req,res)=>{

    res.render('search');
});

app.post('/search',urlencodedParser,(req,res)=>{
    var searchname=req.body.who;
    let sql="SELECT * FROM find ";
    if(searchname!=''){
        sql="SELECT * FROM find WHERE USERNAME LIKE '%" +searchname+"%'";
    }
    db.query(sql,function(err,result){
        if(err){throw err;}
        console.log(result);
        res.render('extra',{myresult:result});
    });
    
});

app.get('/delete',function(req,res){
    var sql="DELETE  FROM find WHERE USERNAME='"+ req.query.USERNAME+"'";
    db.query(sql,function(err,result,fields){
        if(err) throw err;
        console.log(sql);
        res.redirect('search');
    })

})
app.get('/profile',(req,res)=>{

    if(req.session.person==null){  
        res.redirect('/login');
        return;
    }
   var sql="SELECT * FROM find WHERE USERNAME='"+req.session.person+"'";
     db.query(sql,function(err,result){
    console.log(result);
    res.render('profile',{person:result});
   })
    

})

app.post('/profile',urlencodedParser,(req,res)=>{

    
    var sql="UPDATE find SET USERNAME='"+req.body.who+"' , PASSWORD='"+req.body.pass+"' , EMAIL='"+req.body.email+"', PHONENO='"+req.body.phoneno+"' WHERE USERNAME='"+req.session.person+"'";
    console.log(sql);
    db.query(sql,(err,result,fields)=>{
        if(err) throw err;
        
        console.log(result);
        res.redirect('/login');
    })
    
})

app.listen('2000',()=>{
    console.log('server staarte...');
});