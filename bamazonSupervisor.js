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
	// query db to display console table of current departments
	connection.query("SELECT * FROM departments", function (error, results) {
		if (error) throw error;
		// display current departments
		consoleTable("\nCurrent Department Data", results);
		// ask for new dept name and overhead for it
		inquirer.prompt([
			{
				name: "name",
				message: "Please input new department name."
			},
			{
				name: "overhead",
				message: "Input new department overhead costs.",
				// validate the overhead is a number larger than 0
				validate: function(value) {
					if (isNaN(value) === false && value > 0) {
						return true;
					}
					return false;
				}
			}
		]).then(function(newDept) {
			// query db for an insertion into the departments table, set name/costs equal
			// to supervisor input
			connection.query(
				"INSERT INTO departments SET ?",
				{
					department_name: newDept.name,
					over_head_costs: parseFloat(newDept.overhead).toFixed(2)
				}, 
				function(error, results) {
					// if error, tell us, else log success and return to welcome screen
					if (error) throw error;
					console.log("\nNew department added successfully.\n");
					welcome();
			});
		});
	});
}

// function for building console tables
function consoleTable(title, results) {
	// init empty values array for console table
	var values = [];
	// loop through all results
	for (var i = 0; i < results.length; i++) {
		// save info to an object on each iteration, object properties will be 
		// column headers in console table
		var resultObject = {
			ID: results[i].department_id,
			Department: results[i].department_name,
			Overhead: "$" + results[i].over_head_costs,
		};
		// push the resultObject to values array
		values.push(resultObject);
	}
	// create table titled prod inv data with data in values array
	console.table(title, values);
}

// exit function ends connection to db
function exit() {
	console.log("\nNever stop selling.");
	connection.end();
}