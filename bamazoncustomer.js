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
connection.connect(function(err) {  
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
            colAligns: ['center'],
        }
    });

    //loops through each item in the mysqlDB and pushes that information into a new row in the table
    for (var i = 0; i < result.length; i++) {
        table.push(
            [result[i].ITEM_ID, result[i].PRODUCT_NAME, result[i].DEPARTMENT_NAME, result[i].PRICE, result[i].STOCK_QT]
        );
    }
    console.log(table.toString());

    // purchase();
});