var inquirer = require("inquirer");
var mysql = require("mysql");
var consoleTable = require("console.table");
var pw = require("./pw.js");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: pw.pw,
	database: "bamazon_db"
});

connection.connect(function(error){
	if (error) throw error;
	console.log("conncted as id " + connection.threadId);
	connection.end();
});