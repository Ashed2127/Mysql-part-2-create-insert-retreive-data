// Import the required modules
const mysql = require("mysql"); // Import the MySQL module for database connection
const express = require("express"); // Import the Express module for creating a web server
const bodyParser = require("body-parser");
// const jquery = require("jquery");

// Create an Express app instance
const app = express();

// Define the port to listen on
const port = 1220;

// Start the Express app and listen for requests on the specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended : true}));

// app.use(bodyParser.json());

// Create a connection to the MySQL database
const myConnection = mysql.createConnection({
  host: "127.0.0.1", // Specify the host of the MySQL server
  user: "biruk", // Specify the username for database access
  password: "1234", // Specify the password for database access
  database: "biruk", // Specify the name of the database to connect to
});

// Connect to the MySQL database
myConnection.connect((err) => {
  if (err) {
    throw err; // Handle any connection errors
  } else {
    console.log("Connected to MySQL database!"); // Log a message indicating successful connection
  }
});

//To Create New Tables
// Define a route to handle '/createtable' requests
app.get("/createtable", (req, res) => {
  // Define the SQL queries to create the tables
  let products = `CREATE TABLE IF NOT EXISTS Products(
    product_id INT(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_id)
  )`;

  let company = `CREATE TABLE IF NOT EXISTS Company(
    product_id INT(11) AUTO_INCREMENT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products (product_id)
  )`;

  // Execute the SQL queries to create the tables
  myConnection.query(products, (err, results, fields) => {
    if (err) {
      console.log(err); // Log any errors during table creation
    }
  });

  myConnection.query(company, (err, results, fields) => {
    if (err) {
      console.log(err); // Log any errors during table creation
    }
  });
  // Send the response message to the client

  res.end("table created");
});

//To Add an items on the previos created tables from web form
app.post("/additems", (req, res) => {
  console.log(req.body);

  //store the parsed items into variable from body object that store as json format
  const { product_id, product_name, company_name } = req.body;
  // console.table(req.body);



  let addProducts = `INSERT INTO products (product_id, product_name) VALUES (?, ?)`;

  let addCompany = `INSERT INTO company (product_id, company_name) VALUES (?, ?)`;

  myConnection.query(
    addProducts,
    [product_id, product_name],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log("record inserted on product table");
      }
    }
  );

  myConnection.query(addCompany, [product_id, company_name], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log("record inserted on company table");
    }
  });

  res.end("data inserted...");
});

//to select all data from all tables
app.get("/getData", (req, res) => {
  let getData = `SELECT p.*, c.*
  FROM products AS p
  LEFT JOIN company AS c ON p.product_id = c.product_id`;

  myConnection.query(getData, (err, rows, fields) => {
    if (err) {
      console.log("Error ", err);
    }
    res.send(rows);
    //to append the rows value to the the table
    columns = document.getElementsByTagName("td");
  });
});

//to select product name from products table
//to select company name from company table
app.get("/getEachData", (req, res) => {
  let getEachData = `SELECT product_name, company_name
FROM products
LEFT JOIN company ON products.product_id = company.product_id`;

  myConnection.query(getEachData, (err, rows, fields) => {
    if (err) {
      console.log("Error ", err);
    }
    res.send(rows);
  });
});

// //to update tables

app.post("/updateName", (req, res) => {
  const { product_id, product_name } = req.body;

  let updateName = `UPDATE products SET product_name = '${product_name}' WHERE product_id = ${product_id}`;
  myConnection.query(updateName, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating product name");
      return;
    }
    if (product_id) {
      console.log("enter valid id");
    }
    res.send("Product name updated successfully");
  });
});

// to delete the product
app.post("/deleteName", (req, res) => {
  const { product_id } = req.body;

  let deleteCompany = `DELETE FROM company WHERE product_id = ${product_id}`;
  let deleteProduct = `DELETE FROM products WHERE product_id = ${product_id}`;
  //the company data must deleted first b/c prodct_id is foreign key(foreign key data 1st deleted)
  myConnection.query(deleteCompany, (err, rows) => {
    if (err) {
      console.log(err);
    }
  });
  //2nd the product query executed to db
  myConnection.query(deleteProduct, (err, rows) => {
    if (err) {
      console.log(err);
    }
    res.send("Product Deleted successfully");
  });
});
