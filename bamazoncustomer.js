var mysql = require("mysql");
var Table = require('cli-table');
var colors = require('colors');
var prompt = require('prompt');


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username   
    user: "root",
    // Your password   
    password: "root",
    database: "BAMAZON_DB"
});
// Establishing connection with mySql server DB
connection.connect(function (err) {
    if (err) throw err;
    //  productSearch(); 
});
// Empty array of customers purchases 
var purchases = [];

//Query to the mysql database and pull the information from the Products table. 
connection.query('SELECT ITEM_ID, PRODUCT_NAME, DEPARTMENT_NAME, PRICE, STOCK_QT FROM PRODUCTS', function (err, result) {
    if (err) console.log(err);

    //creates a table for the information from the mysql database to be placed
    var table = new Table({
        head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Quanitity'],
        style: {
            head: ['yellow'],
            compact: false,
            colAligns: ['left'],
        }
    });

    //loops through each item in the mysqlDB and pushes that information into a new row in the table
    for (var i = 0; i < result.length; i++) {
        table.push(
            [result[i].ITEM_ID, result[i].PRODUCT_NAME, result[i].DEPARTMENT_NAME, result[i].PRICE, result[i].STOCK_QT]
        );
    }
    console.log(table.toString());

    buy();
});

// Create a buy function, so the user can purchase one of the items listed in the table
const buy = () => {
    // The user is promted for a request 
    let products = {
        properties: {
            ITEM_ID: {
                description: colors.green('Please enter the ID # of the item you wish to purchase!')
            },
            STOCK_QT: {
                description: colors.blue('How many items would you like to purchase?')
            },
        },
    };

    prompt.start();

    prompt.get(products, function (err, res) {

        let purch = {
            ITEM_ID: res.ITEM_ID,
            STOCK_QT: res.STOCK_QT
        };

        purchases.push(purch);
        // console.log(purch);
        // console.log(purchases);

        //connects to the mysql database and selects the item the user selected above based on the item id number entered
        connection.query('SELECT * FROM PRODUCTS WHERE ITEM_ID=?', purchases[0].ITEM_ID, function (err, res) {
            if (err) console.log(err, 'That item ID doesn\'t exist');

            //if the stock quantity available is less than the amount that the user wanted to purchase then the user will be alerted that the product is out of stock
            if (res[0].STOCK_QT < purchases[0].STOCK_QT) {
                console.log('That product is out of stock!');
                connection.end();

                //otherwise if the stock amount available is more than or equal to the amount being asked for then the purchase is continued and the user is alerted of what items are being purchased, how much one item is and what the total amount is
            } else if (res[0].STOCK_QT >= purchases[0].STOCK_QT) {

                console.log('');

                console.log(purchases[0].STOCK_QT + ' items purchased');

                console.log(res[0].PRODUCT_NAME, + ' ' + res[0].PRICE + " / Each");

                //this creates the variable SaleTotal that contains the total amount the user is paying for this total puchase
                let saleTotal = res[0].PRICE * purchases[0].STOCK_QT;

                console.log('Total: ' + saleTotal);

                //this variable contains the newly updated stock quantity of the item purchased
                let newQty = res[0].STOCK_QT - purchases[0].STOCK_QT;

                // connects to the mysql database products and updates the stock quantity for the item puchased
                connection.query("UPDATE PRODUCTS SET STOCK_QT = " + newQty + " WHERE ITEM_ID = " + purchases[0].ITEM_ID, function (err, res) {
                    // if(err) throw err;
                    // console.log('Problem ', err);
                    console.log('');
                    console.log(colors.cyan('Your order has been processed.  Thank you for shopping with us!'));
                    console.log('');

                    connection.end();
                })

            };

        })

    })



}