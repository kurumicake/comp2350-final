const database = include('/databaseConnection');


async function getAllItems() {
	let sqlQuery = `
	SELECT purchase_item_id, item_name, item_description, cost, quantity FROM purchase_item
`;

	try {
		const results = await database.query(sqlQuery);
		console.log(results[0]);
		return results[0];
	}
	catch (err) {
		console.log("Error selecting from Purchase Items table");
		console.log(err);
		return null;
	}
}

async function addItem(postData) {
	let sqlInsertItem = `
        INSERT INTO purchase_item (item_name, item_description, cost, quantity)
        VALUES (:item_name, :item_description, :cost, :quantity);
    `;
	let params = {
		item_name: postData.item_name,
		item_description: postData.item_description,
		cost: postData.cost,
		quantity: postData.quantity
	};
	try {
		const results = await database.query(sqlInsertItem, params);
		return true;
	}
	catch (err) {
		console.error("Error inserting into Purchase Item table", err);
		return false;
	}
}

async function increaseQuantity(purchaseItemId) {
	let sqlIncreaseQuantity = `
        UPDATE purchase_item
        SET quantity = quantity + 1
        WHERE purchase_item_id = :purchaseItemId;
    `;
	let params = {
		purchaseItemId: purchaseItemId
	};
	try {
		await database.query(sqlIncreaseQuantity, params);
		return true;
	}
	catch (err) {
		console.error("Error increasing quantity in Purchase Item table", err);
		return false;
	}
}

async function decreaseQuantity(purchaseItemId) {
	let sqlDecreaseQuantity = `
        UPDATE purchase_item
        SET quantity = CASE 
                         WHEN quantity > 0 THEN quantity - 1 
                         ELSE 0 
                       END
        WHERE purchase_item_id = :purchaseItemId;
    `;
	let params = {
		purchaseItemId: purchaseItemId
	};
	try {
		await database.query(sqlDecreaseQuantity, params);
		return true;
	}
	catch (err) {
		console.error("Error decreasing quantity in Purchase Item table", err);
		return false;
	}
}


async function deletePurchaseItem(purchaseItemId) {
	let sqlDeleteItem = `
			DELETE FROM purchase_item
			WHERE purchase_item_id = :purchaseItemId
		`;
	let params = {
		purchaseItemId: purchaseItemId
	};
	console.log(sqlDeleteItem);
	try {
		await database.query(sqlDeleteItem, params);
		return true;
	}
	catch (err) {
		console.error("Error deleting from Purchase Item table", err);
		return false;
	}
}

module.exports = { getAllItems, increaseQuantity, decreaseQuantity, deletePurchaseItem, addItem };
