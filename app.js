// project started on 18 july 2018 //

// dependencies //

var StudentModel = require("./models/student.js");
var TeacherModel = require("./models/teacher.js");
var express = require("express");
var path = require("path");
var sessions = require("express-session");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//--dependencies //

// Config //
var app = express();
var student_isSigned = false;
var teacher_isSigned = false;
var admin_isSigned = false;
var Student = {};

// if u dont have mongodb then comment below lines //
mongoose.connect("mongodb://localhost:27017/schoolPortal2", (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection with mongodb is successfull");

    }
});
// mongodb config ends here //
//-- Config //

// Express Middlewares //

app.set("views", path.join(__dirname, "/public"))
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(sessions({
    secret: 'ddfd344f4dud8d8d8d8j',
    resave: false,
    saveUninitialized: true
}));


//-- Express Middleware //

// express Get requests //
app.get("/index.html", (req, res) => {
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.render("index");
})
app.get("/studentlogin", (req, res) => {
    res.render("studentlogin");
});
app.get("/teacherlogin", (req, res) => {
    res.render("teacherlogin");
});
app.get("/studentportal", (req, res) => {
    if (!student_isSigned) {
        res.redirect("/studentlogin");
    }
    else {
        res.render("studentportal", { student: Student });
    }
})
app.get("/adminportal",(req,res)=>{
    if(!admin_isSigned){
        res.redirect("/");
}
})
app.get("/student/marksheets", (req, res) => {
    var email = req.query.email.toString();
    var password = req.query.password.toString();
    StudentModel.findOne({ email: email, password: password }, (err, student) => {
        if (err) {
            throw err;
        }
        res.write(JSON.stringify(student.marksheets));
        res.end();
    })
})
app.get("/student/bio", (req, res) => {
    var email = req.query.email.toString();
    var password = req.query.password.toString();
    StudentModel.findOne({ email: email, password: password }, (err, student) => {
        if (err) {
            throw err;
        };
        var stud = {
            "name": student.name,
            "father_name": student.father_name,
            "gender": student.gender,
            "age": student.age,
            "cnic": student.cnic,
            "father_cnic": student.father_cnic,
            "class": student.class,
            "section": student.section,
            "roll_number": student.roll_number
        }
        res.write(JSON.stringify(stud));
        res.end();
    })
})
app.get("/sp",(req,res)=>{
    res.render("studentportal");
});
app.get("/tp",(req,res)=>{
    res.render("teacherportal");
});
app.get("/admin",(req,res)=>{
    res.render("admin-portal");
})
app.get("/students/fetch_specific",(req,res)=>{
    var name = req.query.name;
    StudentModel.find({name:name},(err,students)=>{
        var text = JSON.stringify(students);
        res.end(text); 
    })
})
app.get("/students/fetch_all",(req,res)=>{
StudentModel.find({},(err,students)=>{
var text = JSON.stringify(students);
res.end(text);
})

})

//-- express Get requests //

// express Post requests //
app.post("/teacherLoginRequest",(req,res)=>{
    let user = req.body.user;
    let password = req.body.password;
    TeacherModel.findOne({"user":user,"password":password},(err,teacher)=>{
        if(err){
            throw err;
        }
        else if (teacher == null) {
            res.redirect("/");
        }
        else {
           
            res.render("teacherportal");
        }
    })
})
app.post("/studentLoginRequest", (req, res) => {
    let user = req.body.user;
    let password = req.body.user_pass;
    StudentModel.findOne({ "user": user, "password": password }, (err, student) => {
        if (err) {
            throw err;
        }
        else if (student == null) {
            res.redirect("/");
        }
        else {
            student_isSigned = true;
            Student = student;
            console.log(student);
            res.redirect("/studentportal");
        }

    })
})
app.post("/adminLoginRequest",(req,res)=>{
    var username = req.body.user_name.toString();
    var password = req.body.user_pass.toString();
    if(username === "admin" && password ==="1234"){

        res.redirect("/adminportal");
    }
    else{
        res.redirect("/");
    }
})
app.post("/studentSignupRequest", (req, res) => {
    var fname = req.body.user_name;
    var email = req.body.user_email;
    var password = req.body.user_pass;
    var student = new StudentModel();
    student.name = fname;
    student.email = email;
    student.password = password;

    student.save((err, student) => {
        if (err) {
            throw err;
        }
        res.redirect("/");
    })


});
app.post("/addTeacher",(req,res)=>{
    var name = req.body.name;
    var age = req.body.age;
    var gender = req.body.gender;
    var phone = req.body.phone;
    var subject = req.body.subject;
    var cnic = req.body.cnic;
    var username = req.body.username;
    var password = req.body.password;
    console.log(name);
    var NewTeacher = new TeacherModel({
        "name": name,
        "age": age,
        "gender": gender,
        "cnic": cnic,
        "user": username,
        "password": password,
        "subject":subject,
        "phone":phone
    });
    
    NewTeacher.save((err,result)=>{
        if(err){
            throw err;
        }
        res.redirect("/admin");
    })
    

})
app.post("/addStudent", (req, res) => {
    var name = req.body.name;
    var father_name = req.body.father_name;
    var age = req.body.age;
    var gender = req.body.gender;
    var phone = req.body.phone;
    var cnic = req.body.cnic;
    var father_cnic = req.body.father_cnic;
    var _class = req.body.class;
    var roll_number = req.body.roll_number;
    var section = req.body.section;
    var username = req.body.username;
    var password = req.body.password;
  console.log(name);
    var NewStudent = new StudentModel({
        "name": name,
        "father_name": father_name,
        "age": age,
        "gender": gender,
        "cnic": cnic,
        "father_cnic": father_cnic,
        "class": _class,
        "roll_number": roll_number,
        "section": section,
        "user": username,
        "password": password
    });
    
    NewStudent.save(()=>{
        console.log("new student added");
        res.redirect("/admin");
    })






})
//-- express Post requests //

app.listen("9000", () => {
    console.log("server is running on port 9000");
});