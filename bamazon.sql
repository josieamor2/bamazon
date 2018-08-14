DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100),
department_name VARCHAR(100),
price DECIMAL(10,2) NULL,
stock_quantity INTEGER(11),
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ('soap', 'hygiene', 5.00, 100),
('shampoo', 'hair care', 10.00, 50),
('conditioners', 'hair care', 10.00, 70),
('towels', 'bathroom', 8.00, 80),
('perfume', 'hygiene', 30.00, 20),
('make up', 'hygiene', 20.00 ,25),
('shoes', 'footwear', 60.00 ,60),
('dress','clothing', 20.00 ,45),
('sunglasses','eye wear', 10.50 , 400);

DELETE FROM `products` WHERE `item_id` = 1;


SELECT * FROM products;