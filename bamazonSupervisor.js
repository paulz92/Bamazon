// npm requirements
var inquirer = require("inquirer");
var mysql = require("mysql");
var consoleTableNPM = require("console.table");
// my password for mysql db connection - hidden
var pw = require("./pw.js");

// create mysql connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: pw.pw,
	database: "bamazon_db"
});

// connect to db
connection.connect(function(error){
	if (error) throw error;
	// welcome manager
	console.log("\n-----------------------------------------------------------------" 
		+ "\nWelcome Bamazon Supervisor!\n" 
		+ "-----------------------------------------------------------------\n");
	// start the app
	welcome();
});

// welcome function asks what supervisor wants to do and runs corresponding function
function welcome() {
	inquirer.prompt([
		{
			name: "action",
			type: "list",
			choices: ["View Product Sales By Department", "Create New Department", "Exit"],
			message: "Please select what you would like to do."
		},
	]).then(function(response) {
		if (response.action === "View Product Sales By Department") {
			viewSales();
		} else if (response.action === "Create New Department") {
			createDepartment();
		} else if (response.action === "Exit") {
			exit();
		}
	});
}

// function to view departmental sales
function viewSales() {
	console.log("view sales --- will function later");
	welcome();
}

// function to create new department
function createDepartment() {
	console.log("create dept --- will function later");
	welcome();
}

// exit function ends connection to db
function exit() {
	console.log("\nNever stop selling.");
	connection.end();
}