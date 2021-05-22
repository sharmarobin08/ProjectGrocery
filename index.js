// setting express & mysql
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var mysql = require('mysql');

// variables 

var sql = "";
var items = [];
var quantity = [];
var id = 0;
var name = "";

// setting up packages

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// connecting with database info

var connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass",
    database: "info"
});

connect.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

//handling get requests
//serving home page

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

//serving to registration page

app.get("/reg", function (req, res) {
    res.sendFile(__dirname + "/registration.html");
});

//serving to log in page
app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

//getting the data about items from the database

app.get("/list", function (req, res) {
    if (id == 0) {
        res.redirect("/login");
    } else {
        sql = "select item,quantity from list where ID=" + id;
        connect.query(sql, function (err, result) {
            if (err) throw err;

            items = [];
            quantity = [];
            for (let i = 0; i < result.length; i++) {
                items.push(result[i].item);
                quantity.push(result[i].quantity);
            }
        });

        setTimeout(function () {
            res.render("list.ejs", {
                items: items,
                quantity: quantity,
                name: name
            });
        }, 500);
    }

});

app.get("/logout", function (req, res) {
    id = 0;
    res.sendFile(__dirname + "/login.html");
});

//post requests handling

//adding new users/registration 
app.post("/reg", function (req, res) {
    if (req.body == "" || req.body.first == "" || req.body.last == "" || req.body.username == "" || req.body.pass == "") {
        res.redirect("/reg");
    } else {
        var fullname = req.body.first + " " + req.body.last;
        sql = "insert into users(fullname,username,pass,email) values('" + fullname + "','" + req.body.username + "','" + req.body.pass + "','" + req.body.email + "')";
        connect.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        res.sendFile(__dirname + "/login.html");
    }

});

//loging users in the website

app.post("/login", function (req, res) {
    sql = "select pass,ID,fullname from users where username='" + req.body.username + "'";
    connect.query(sql, function (err, result) {
        if (err) res.redirect("/reg");
        name = result[0].fullname;
        id = result[0].ID;
        if (req.body.password == result[0].pass) {
            res.redirect("/list");
        } else {
            res.redirect("/login");
        }

    });


});

//To add or removing the item from the database

app.post("/add_remove_item", function (req, res) {
    if (req.body.function == "add") {
        sql = "insert into list values(" + id + ",'" + req.body.newItem + "'," + req.body.quantity + ")";
        connect.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    } else {

        sql = "delete from list where ID=" + id + " and item='" + items[req.body.itemNo] + "'";
        connect.query(sql, function (error, result2) {
            if (error) throw error;
            console.log("1 record deleted");
        });
    }

    setTimeout(function () {
        res.redirect("/list");
    }, 500);
});

//updation in the database
app.post("/update", function (req, res) {

    if (req.body.inc) {
        sql = "update list set quantity=quantity+1 where id=" + id + " and item='" + items[req.body.inc] + "'";
    } else {
        if (quantity[req.body.dec] > 0) {
            sql = "update list set quantity=quantity-1 where id=" + id + " and item='" + items[req.body.dec] + "'";
        }

    }
    connect.query(sql, function (error, result) {
        if (error) throw error;
    });
    res.redirect("/list");
});

//starting server on port 3010
app.listen(3010, function () {
    console.log("server is running on port 3010");
});