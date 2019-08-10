const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

const mysql = require("mysql");
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
        return
    }
    console.log("connected as id " + connection.threadId)
});



// ===== ROUTES =====

// GET to display products
app.get("/", (req, res) => {
    connection.query("SELECT * FROM products", (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Niet, Smirnoff.")
        }

        res.render("index", { products: data })
    })
})

// POST to place order
app.post("/api/order", (req, res) => {
    connection.query("SELECT stock_quantity FROM products WHERE item_id = ?", [req.body.id], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Niet, Smirnoff.")
        }

        const difference = result[0].stock_quantity - req.body.order_quantity

        // need to show order total with handlebars
        // const orderTotal = result[0].price * req.body.order_quantity

        if (difference < 0) {
            // this message needs to be displayed on page through handlebars somehow
            console.log("Order quantity must be less than In Stock quantity.")
        } else {
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [difference, req.body.id], (err, result) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send("Niet, Smirnoff.")
                }

                return res.json(result)
            })
        }
    })
})

// DELETE to remove product once stock_quantity === 0

app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT)
});