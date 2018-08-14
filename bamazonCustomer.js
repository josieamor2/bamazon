var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Louie2424!",
    database: "bamazon"
});

function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.';
    }
}

// promptUserPurchase will prompt the user for the item/quantity they would like to purchase
function promptUserPurchase() {
    // console.log('___ENTER promptUserPurchase___');

    // Prompt the user to select an item
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'What item ID would you like to purchase?',
            validate: validateInput,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How much do you want to purchase?',
            validate: validateInput,
            filter: Number
        }
    ]).then(function (input) {
        // console.log('Customer has selected: \n    item_id = '  + input.item_id + '\n    quantity = ' + input.quantity);

        var item = input.item_id;
        var quantity = input.quantity;

        // Query db to confirm that the given item ID exists in the desired quantity
        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw err;

            // If the user has selected an invalid item ID, data attay will be empty
            // console.log('data = ' + JSON.stringify(data));

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                displayInventory();

            } else {
                var productData = data[0];

                // console.log('productData = ' + JSON.stringify(productData));
                // console.log('productData.stock_quantity = ' + productData.stock_quantity);

                // If the quantity requested by the user is in stock
                if (quantity <= productData.stock_quantity) {
                    console.log('Congratulations, the product you requested is in stock! Placing order!');

                    // Construct the updating query string
                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                    // console.log('updateQueryStr = ' + updateQueryStr);

                    // Update the inventory
                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productData.price * quantity);
                        
                        console.log("\n---------------------------------------------------------------------\n");

                        shopMore();
                        // End the database connection


                        
                    })
                } else {
                    console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
                    console.log('Please modify your order.');
                    console.log("\n---------------------------------------------------------------------\n");

                    displayInventory();
                }
            }
        })
    })
}
function shopMore() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'shopping',
            message: 'Would you like to shop some more?',
            
        }
    ]).then(function (input) {
        if(input = true ){
            console.log("Great! Shop more!");
            displayInventory();
        }else{
            console.log("Thanks for shopping! Bye!")
            connection.end();
        }
    })
};
// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {
    // console.log('___ENTER displayInventory___');

    // Construct the db query string
    queryStr = 'SELECT * FROM products';

    // Make the db query
    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('Existing Inventory: ');
        console.log('...................\n');

        var strOut = '';
        for (var i = 0; i < data.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + data[i].item_id + '  //  ';
            strOut += 'Product Name: ' + data[i].product_name + '  //  ';
            strOut += 'Department: ' + data[i].department_name + '  //  ';
            strOut += 'Department: ' + data[i].price + '  //  ';
            strOut += 'Stock Quantity: ' + data[i].stock_quantity + '\n';

            console.log(strOut);
        }

        console.log("---------------------------------------------------------------------\n");

        //Prompt the user for item/quantity they would like to purchase
        promptUserPurchase();
    })
}

// runBamazon will execute the main application logic
function runBamazon() {
    // console.log('___ENTER runBamazon___');

    // Display the available inventory
    displayInventory();
}

// Run the application logic
runBamazon();