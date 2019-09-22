const express = require('express')
const router = express.Router()

// GET to display products
router
.get("/", (req, res) => {
    connection.query("SELECT * FROM products", (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Niet, Smirnoff.")
        }
        res.render("index", { products: data })
    })
})

// POST to place order
.post("/api/order", (req, res) => {
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
                // console.log(data)
                // render doesn't work...
                res.render("index", { message: "Order quantity must be less than In Stock quantity.", products: data })
                console.log("How about here?")
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

module.exports = router