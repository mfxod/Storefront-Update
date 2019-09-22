const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const exphbs = require("express-handlebars")

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

const mysql = require("mysql");

if(process.env.JAWSDB_URL) {
    connection = createConnection(process.env.JAWSDB_URL)
} else {
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "bamazondb"
    })
}
// connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "password",
//     database: "bamazondb"
// })

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
        module.exports = data
    })
})

// POST to place order
app.post("/api/order", (req, res) => {
    connection.query("SELECT stockQuantity FROM products WHERE itemID = ?", [req.body.id], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Niet, Smirnoff.")
        }

        const difference = result[0].stockQuantity - req.body.order_quantity

        if (difference < 0) {
            console.log(difference)
            connection.query("SELECT * FROM products", (err, data) => {
                if (err) {
                    console.log(err)
                    return res.status(500).send("Niet, Smirnoff.")
                }
                
                console.log("Making it this far.")
                // render doesn't work
                // res.render("index", { message: "Order quantity must be less than In Stock quantity.", products: data })
                // module.exports = data
            })

        } else {
            connection.query("UPDATE products SET stockQuantity = ? WHERE itemID = ?", [difference, req.body.id], (err, result) => {
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