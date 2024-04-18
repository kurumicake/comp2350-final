const router = require('express').Router();
const database = include('databaseConnection');
const dbModel = include('databaseAccessLayer');

router.get('/', async (req, res) => {
    console.log("page hit");
    
    try {
        const items = await dbModel.getAllItems();
        // ! Calculate the total cost here
        const totalCost = items.reduce((acc, item) => {
            return acc + (parseFloat(item.cost) * parseInt(item.quantity));
        }, 0);

        res.render('index', {
            allItems: items,
            totalCost: totalCost
        });
        console.log("here is result: ", items);
    }
    catch (err) {
        res.render('error', {message: 'Error reading from MySQL'});
        console.log("Error reading from mysql", err);
    }
});


router.get('/increaseQuantity', async (req, res) => {
	console.log(req.query);
	let itemId = req.query.id;
	if (itemId) {
		const success = await dbModel.increaseQuantity(itemId);
		if (success) {
			res.redirect("/");
		}
		else {
			res.render('error', { message: 'Error writing to MySQL' });
			console.log("Error writing to mysql");
			console.log(err);
		}
	}
});

router.get('/addItem', async (req, res) => {
	console.log("Add Item");
	console.log(req.query);
	let itemId = req.query.id;
	if (itemId) {
		const success = await dbModel.addItem(itemId);
		if (success) {
			res.redirect("/");
		}
		else {
			res.render('error', { message: 'Error writing to MySQL' });
			console.log("Error writing to mysql");
			console.log(err);
		}
	}
});

router.get('/decreaseQuantity', async (req, res) => {
	console.log(req.query);
	let itemId = req.query.id;
	if (itemId) {
		const success = await dbModel.decreaseQuantity(itemId);
		if (success) {
			res.redirect("/");
		}
		else {
			res.render('error', { message: 'Error writing to MySQL' });
			console.log("Error writing to mysql");
			console.log(err);
		}
	}
});

router.get('/deletePurchaseItem', async (req, res) => {
	console.log("delete Item");
	console.log(req.query);
	let itemId = req.query.id;
	if (itemId) {
		const success = await dbModel.deletePurchaseItem(itemId);
		if (success) {
			res.redirect("/");
		}
		else {
			res.render('error', { message: 'Error writing to MySQL' });
			console.log("Error writing to mysql");
			console.log(err);
		}
	}
});

module.exports = router;
