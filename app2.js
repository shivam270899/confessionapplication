var express=require('express');
var mysql=require('mysql');
var bodyParser=require('body-parser');
const session=require('express-session');
const Crypto=require('crypto');
var urlencodedParser=bodyParser.urlencoded({extend:false});
var app=express();
var port=process.env.PORT||"3000";

app.set('view engine','ejs');
app.use('/img',express.static(__dirname +'/img'));
app.use('/css',express.static(__dirname +'/css'));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,

}));


const db = mysql.createConnection({
    host: 'remotemysql.com',
    user: '1UPOn5d0CG',
    password: '6HeLtAJkHa',
    database: '1UPOn5d0CG',
    Port: '3306'
});




db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('mysql connected!!');

});

function randomString(size = 6){
    return Crypto
    .randomBytes(size)
    .toString('base64')
    .slice(0,size)
}





app.post('/front',urlencodedParser,(req,res)=>{
    
    var sql="insert into string values(null,'"+randomString()+"','"+req.body.text+"','"+req.body.email+"','"+req.body.username+"')";
    console.log(sql);
    db.query(sql,function(err,result){
        if(err) throw err;
        else{
       
        console.log(result);
        res.redirect('/'+req.body.username);}
    })
    
});

app.get('/register',(req,res)=>{

    res.render('register');
});
app.post('/register',urlencodedParser,(req,res)=>{

    
   var sql="insert into anonymous values(null,'"+randomString()+"','"+req.body.username+"' ,'"+req.body.name+"','"+req.body.pass+"','"+req.body.email+"','"+req.body.gender+"') ";
   
   db.query(sql,function(err,results,field){
       if(err)throw err;
        
        res.redirect('/login');

   });
});

app.get('/home',(req,res)=>{
    if(req.session.person==null){
        res.redirect('/login');
        return;
    }

    res.render('home',{person:req.session.person});
});

   app.get('/login',(req,res)=>{
    res.render('login');

   });
   app.post('/login',urlencodedParser,(req,res)=>{
    var sql="select * from anonymous where username='"+req.body.username+"' and password='"+req.body.pass+"' ";
    db.query(sql,(err,result,field)=>
    {
        if(err) throw err;
        else
        {
            if(result.length!=0)
            {


                req.session.person=req.body.username;
                
                res.redirect('/home');
                return;
            
            }
            else
            {
                res.send("incorrect username or password");

            }
        
        }
    })
   });
   
    



app.get('/profile',(req,res)=>{
if(req.session.person==null){
    res.redirect('/login');
    return;}


    var sql="select * from anonymous where username='"+req.session.person+"'";
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render('profile',{person:result});

    })


})

app.post('/profile',urlencodedParser,(req,res)=>{
    var sql="update anonymous set username='"+req.body.username+"', name='"+req.body.name+"',password='"+req.body.pass+"',email='"+req.body.email+"' where username='"+req.session.person+"'";
    console.log(sql);
    db.query(sql,(err,result)=>{
        if(err) throw err;
        
        res.redirect('/profile');

    })
})



app.get('/inbox',(req,res)=>{

    if(req.session.person==null){
        res.redirect('/login');
        return;}

    var sql="select * from string where username='"+req.session.person+"' order by id desc ";
    console.log(sql);
    db.query(sql,(err,result)=>{
        if(err) {throw err;}
        console.log(result);
        res.render('inbox',{myresult:result});

    });

});




app.get('/:username',(req,res)=>{

    var sql="select * from anonymous where username='"+req.params.username+"' ";
    db.query(sql,(err,result,field)=>
    {
        if(err) throw err;
        else
        {
            if(result.length!=0)
            {
                res.render('front',{person:req.params.username});
                return;
            
            }
            else
            {
                res.send("incorrect ");

            }
        
        }
    
    
})
});


app.listen(port, () => {
    console.log('App listening on port ' + port + '!');
  });

