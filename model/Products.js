import { connection as db} from '../config/index.js'

class Products { 
    fetchProducts(req, res) {
        try {
            const strQry = `
            SELECT productID, prodName, category, prodDescription, prodURL, amount
            FROM Products;
            `
            db.query(strQry, (err, results) => {
                if(err) throw new Error('Unable to fetch all products')
                    res.json({
                        status: res.statusCode,
                        results
                    })
            })
        } catch(e) {
            res.json({
                status:404,
                msg: e.message
            })
        }
    }
    recentProducts(req, res) {
        try {
            const strQry = `
            SELECT productID, prodName, category, prodDescription, prodURL, amount
            FROM Products
            ORDER BY productID DESC
            LIMIT 5;
            `
            db.query(strQry, (err, results) => {
                if(err) throw new Error('Unable to retrieve recent products')
                    res.json({
                        status: res.statusCode,
                        results
                    })
            })
        } catch(e) {
            res.json({
                status:404,
                msg: e.message
            })
        }
    }
    fetchProduct(req, res) {
        try {
            const strQry = `
            SELECT productID, prodName, category, prodDescription, prodURL, amount
            FROM Products
            WHERE productID = ${req.params.id};
            `
            db.query(strQry, (err, results) => {
                if(err) throw new Error('Unable to fetch product')
                    res.json({
                        status: res.statusCode,
                        results: results[0]
                    })
            })
        } catch(e) {
            res.json({
                status:404,
                msg: e.message
            })
        }
    }
    addProduct(req, res) {
        try {
            const strQry = `
            INSERT INTO Products
            SET ?;
            `
            db.query(strQry, [req.body], (err) => {
                if (err) throw new Error('Unable to add a new product')
                res.json({
                    status: res.statusCode,
                    msg: 'Product has been added successfully.'
                })
                
            })
        }catch(e) {
            res.json({
                status:404,
                msg: e.message
            })
        }
    }
    updateProduct(req, res) {
        try {
            let prodData = req.body
            const strQry = `
            UPDATE Products
            SET ?
            WHERE productID = ${req.params.id}
            `
            db.query(strQry, [prodData], (err) => {
                if (err) throw new Error('Unable to update a product')
                    res.json({
                        status: res.statusCode,
                        msg: 'The product record was updated'
                    })
            })
        } catch (e) {
            res.json({
                status: 400,
                msg: e.message
            })
        }
    }
    deleteProduct(req, res) {
        try {
            const strQry = `
            DELETE FROM Products
            WHERE productID = ${req.params.id};
            `
            db.query(strQry, (err) => {
                if(err) throw new Error('To delete a product, please review your delete query')
                    res.json({
                        status: res.statusCode,
                        msg: 'A product was removed'
                    })
            })
        } catch (e) {
            res.json({
                status: 404,
                msg: e.message
            })
        }
    }
}
export {
    Products
}