DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(75) NOT NULL,
    department_name VARCHAR(75) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Eggo Waffles", "Grocery", 1.80, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fisher MC-4550 Audio System", "Audio", 250.00, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("22-Inch Color TV", "Electronics", 700.00, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Polaroitem_id Camera", "Photography", 93.75, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Western Electric 554 Yellow Wall Phone", "Electronics", 19.95, 22);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pentax MX SLR Camera", "Photography", 968.00, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Reese's Pieces", "Grocery", .42, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("1976 Ford Pinto", "Automotive", 1919.00, 1);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("TRC-214 Walkie-Talkies", "Electronics", 29.95, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("JVC Portable Camcorder", "Photography", 699.95, 5);