const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazondb"
});

connection.connect(err => {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Function to load the products table from the database and print results to the console
loadProducts = () => {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", (err, res) => {
    if (err) {
      throw err
    }

    // Draw the table in the terminal using the response
    console.table(res);

    // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
    promptCustomerForItem(res);
  });
}

// Check to see if the user wants to quit the program
checkIfShouldExit = choice => {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("Goodbye!");
    process.exit(0);
  }
}

// Check to see if the product the user chose exists in the inventory
checkInventory = (choiceId, inventory) => {
  console.log("Inventory: " + JSON.stringify(inventory))
  for (let i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
}

// USING FIND() INSTEAD:
// checkInventory = (choiceId, inventory) => {
//   console.log("Inventory: " + JSON.stringify(inventory))
//   inventory.find(element => element.item_id === choiceId)
//   console.log(element)
// }

// Purchase the desired quantity of the desired item
makePurchase = (product, quantity) => {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id], (err, res) => {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nSuccessfully purchased " + quantity + ": " + product.product_name + "!\n");
      loadProducts();
    }
  );
}

// Prompt the customer for a product ID
promptCustomerForItem = inventory => {
  // Prompts user for what they would like to purchase
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
        validate: val => !isNaN(val) || val.toLowerCase() === "q"
      }
    ])
    .then(val => {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.choice);
      const choiceId = parseInt(val.choice);
      const product = checkInventory(choiceId, inventory);

      // If there is a product with the id the user chose, prompt the customer for a desired quantity
      if (product) {
        // Pass the chosen product to promptCustomerForQuantity
        promptCustomerForQuantity(product);
      }
      else {
        // Otherwise let them know the item is not in the inventory, re-run loadProducts
        console.log("\nThat item is not in the inventory.\n");
        loadProducts();
      }
    });
}

// Prompt the customer for a product quantity
promptCustomerForQuantity = product => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: val => val > 0 || val.toLowerCase() === "q"
      }
    ])
    .then(val => {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.quantity);
      const quantity = parseInt(val.quantity);

      // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!\n");
        loadProducts();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        makePurchase(product, quantity);
      }
    });
}