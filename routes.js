const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({
    defaultLayout: "main"
}))
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

// PUT to place order
// Q: What should the route path be? Can't they all be "/"?
app.put("/", (req, res) => {
    // if order-quantity > stock_quantity show "Insufficient Stock" message, otherwise do this:
    // Q: Use req.body or req.params?
    // Q: Can I do math in the query like this?
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [req.body.order-quantity, req.body.id], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Niet, Smirnoff.")
        }

        if (!result.changedRows) {
            console.log(err)
            return res.status(404).send("Suzie, do you copy?... Suzie?")
        }

        console.log("order quantity: " + req.params.order-quantity)
        console.log("order id: " + req.params.id)
        return res.json({ OK: true })
    })
})

// DELETE to remove product once stock_quantity === 0


app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT)
});