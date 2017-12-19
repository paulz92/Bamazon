DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(10,2) NULL,
	PRIMARY KEY (item_id)
);

-- populating base product sales data assuming past sales have occurred so that profitability won't be all deeply negative -- 
INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Workingman's Dead by Grateful Dead - Vinyl", "Music", 19.99, 40, 900), ("The Departed", "Movies", 19.99, 35, 1750), 
			 ("Lenovo Yoga 720 Laptop", "Electronics", 949.99, 8, 3500), ("Super Slinky XL", "Toys", 9.99, 100, 480), 
			 ("Pillows", "Household", 14.99, 75, 648.28), ("North Face Jacket", "Clothes", 89.99, 50, 980), 
       ("Set of Allen Wrenches", "Hardware", 29.99, 300, 200), ("Hockey Net", "Sports Equipment", 49.99, 10, 300), 
       ("Xbox One", "Electronics", 299.99, 25, 8000), ("Stop Making Sense by Talking Heads - Vinyl", "Music", 19.99, 17, 1100);

CREATE TABLE departments (
	department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(100) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Music", 2000), ("Movies", 2000), ("Electronics", 10000), ("Toys", 2000), ("Household", 1000), ("Clothes", 1000), ("Hardware", 500),
			 ("Sports Equipment", 1300);

SELECT * FROM products;
SELECT * FROM departments;