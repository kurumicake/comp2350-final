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


async function moveItemUp(purchaseItemId) {
	let sqlMoveUp = `
        UPDATE purchase_item p1, purchase_item p2
        SET p1.sort_order = p1.sort_order - 1, p2.sort_order = p2.sort_order + 1
        WHERE p1.purchase_item_id = :purchaseItemId AND p2.sort_order = p1.sort_order - 1;
    `;
	let params = {
		purchaseItemId: purchaseItemId
	};
	try {
		await database.query(sqlMoveUp, params);
		return true;
	}
	catch (err) {
		console.error("Error moving item up in Purchase Item table", err);
		return false;
	}
}

async function moveItemDown(purchaseItemId) {
	let sqlMoveDown = `
	UPDATE purchase_item p1, purchase_item p2
	SET p1.sort_order = p1.sort_order + 1, p2.sort_order = p2.sort_order - 1
	WHERE p1.purchase_item_id = :purchaseItemId AND p2.sort_order = p1.sort_order + 1;
`;
	let params = {
		purchaseItemId: purchaseItemId
	};
	try {
		await database.query(sqlMoveDown, params);
		return true;
	}
	catch (err) {
		console.error("Error moving item down in Purchase Item table", err);
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

module.exports = { getAllItems, moveItemUp, moveItemDown, deletePurchaseItem, addItem };
