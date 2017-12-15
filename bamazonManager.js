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
		+ "\nWelcome Bamazon Manager!\n" 
		+ "-----------------------------------------------------------------\n");
	// start the app
	welcome();
});

// welcome function, asks managers what they want to do, runs appropriate function 
// based on answer
function welcome() {
	inquirer.prompt([
		 {
		 	name: "action",
		 	type: "list",
		 	choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", 
		 		"Add New Product", "Exit"],
		 	message: "Please select what you would like to do."
		 }
	]).then(function(answer) {
		if (answer.action === "View Products for Sale") {
			viewProducts();
		} else if (answer.action === "View Low Inventory") {
			viewLowInventory();
		} else if (answer.action === "Add to Inventory") {
			addToInventory();
		} else if (answer.action === "Add New Product") {
			addNewProduct();
		} else if (answer.action === "Exit") {
			exit();
		}
	})
}

// function to view products
function viewProducts() {
	// save query term
	var query = "SELECT * FROM products";
	// run query
	connection.query(query, function(error, results) {
		// let us know if error
		if (error) throw error;
		// build console table
		consoleTable("\nAll Products For Sale", results);
		// run welcome function
		welcome();
	});
}

// function to view low inventory
function viewLowInventory() {
	// save query term
	var query = "SELECT * FROM products WHERE stock_quantity<5";
	// run query
	connection.query(query, function(error, results) {
		// let us know if error
		if (error) throw error;
		// build console table
		consoleTable("\nLow Product Inventory Data", results);
		// run welcome function
		welcome();
	});
}

// function to add to inventory
function addToInventory() {
	// query db for all products
	connection.query("SELECT * FROM products", function (error, results) {
		if (error) throw error;
		// ask manager which item id they'd like to add inventory to and by how much
		inquirer.prompt([
			{
				name: "id",
				message: "Input the item ID to increase inventory on.",
				// validate the item id is a number larger than 0 and contained in db
				validate: function(value) {
					if (isNaN(value) === false && value > 0 && value <= results.length) {
						return true;
					}
					return false;
				}
			},
			{
				name: "amount",
				message: "Input the amount to increase inventory by.",
				// make sure the amount is a number over 0
				validate: function(value) {
					if (isNaN(value) === false && value > 0) {
						return true;
					}
					return false;
				}
			}
		]).then(function(answer) {
			// init item qty var
			var itemQty;
			// loop through results, if db item id equals manager's input, set itemQty
			// to stock qty of that item 
			for (var i = 0; i < results.length; i++) {
				if (parseInt(answer.id) === results[i].item_id) {
					itemQty = results[i].stock_quantity;
				}
			}
			// call increaseQty function, pass in values for item, origQty, addQty
			increaseQty(answer.id, itemQty, answer.amount);
		});
	});
}

// increase qty function
function increaseQty(item, stockQty, addQty) {
	// query with an update, set stock equal to stockqty + addition qty
	// where the item_id equals the id the user entered
	connection.query(
		"UPDATE products SET ? WHERE ?", 
		[
			{
				stock_quantity: stockQty + parseInt(addQty)
			}, 
			{
				item_id: parseInt(item)
			}
		], 
		function(error, results) {
			if (error) throw error;
			console.log("\nInventory successfully added.");
			// run viewProducts so manager can see the updated inventory and return
			// to welcome screen
			viewProducts();
	});
}

// function to add new product
function addNewProduct() {
	console.log("\nadd new product\n");
	// run welcome function
	welcome();
}

// function for building console table
function consoleTable(title, results) {
	// init empty values array for console table
	var values = [];
	// loop through all results
	for (var i = 0; i < results.length; i++) {
		// save info to an object on each iteration, object properties will be 
		// column headers in console table
		var resultObject = {
			ID: results[i].item_id,
			Item: results[i].product_name,
			Price: "$" + results[i].price,
			Inventory: results[i].stock_quantity + " units"
		};
		// push the resultObject to values array
		values.push(resultObject);
	}
	// create table titled prod inv data with data in values array
	console.table(title, values);
}

// exit function, says goodbye, ends db connection
function exit() {
	console.log("\nNever stop selling.");
	connection.end();
}