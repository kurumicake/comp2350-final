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
    await database.query('START TRANSACTION;');

    let sqlFindOrder = `
        SELECT sort_order FROM purchase_item WHERE purchase_item_id = :purchaseItemId;
    `;
    
    try {
        const currentOrderResults = await database.query(sqlFindOrder, { purchaseItemId });
        if (currentOrderResults.length === 0) {
            throw new Error('Item not found.');
        }
        const currentOrder = currentOrderResults[0].sort_order;
        
        let sqlFindSwap = `
            SELECT purchase_item_id, sort_order FROM purchase_item WHERE sort_order < :currentOrder ORDER BY sort_order DESC LIMIT 1;
        `;
        const swapResults = await database.query(sqlFindSwap, { currentOrder });
        if (swapResults.length === 0) {
            throw new Error('No item to swap with.');
        }
        const swapItem = swapResults[0];
        
        let sqlSwap = `
            UPDATE purchase_item SET sort_order = CASE WHEN purchase_item_id = :currentItemId THEN :swapOrder ELSE :currentOrder END
            WHERE purchase_item_id IN (:currentItemId, :swapItemId);
        `;
        await database.query(sqlSwap, {
            currentItemId: purchaseItemId,
            currentOrder: currentOrder,
            swapItemId: swapItem.purchase_item_id,
            swapOrder: swapItem.sort_order
        });

        await database.query('COMMIT;');
        return true;
    }
    catch (err) {
        await database.query('ROLLBACK;');
        console.error("Error moving item up in Purchase Item table", err);
        return false;
    }
}

async function moveItemDown(purchaseItemId) {
    await database.query('START TRANSACTION;');

    let sqlFindOrder = `
        SELECT sort_order FROM purchase_item WHERE purchase_item_id = :purchaseItemId;
    `;
    
    try {
        const currentOrderResults = await database.query(sqlFindOrder, { purchaseItemId });
        if (currentOrderResults.length === 0) {
            throw new Error('Item not found.');
        }
        const currentOrder = currentOrderResults[0].sort_order;
        
        let sqlFindSwap = `
            SELECT purchase_item_id, sort_order FROM purchase_item WHERE sort_order > :currentOrder ORDER BY sort_order ASC LIMIT 1;
        `;
        const swapResults = await database.query(sqlFindSwap, { currentOrder });
        if (swapResults.length === 0) {
            throw new Error('No item to swap with.');
        }
        const swapItem = swapResults[0];
        
        let sqlSwap = `
            UPDATE purchase_item SET sort_order = CASE WHEN purchase_item_id = :currentItemId THEN :swapOrder ELSE :currentOrder END
            WHERE purchase_item_id IN (:currentItemId, :swapItemId);
        `;
        await database.query(sqlSwap, {
            currentItemId: purchaseItemId,
            currentOrder: currentOrder,
            swapItemId: swapItem.purchase_item_id,
            swapOrder: swapItem.sort_order
        });

        await database.query('COMMIT;');
        return true;
    }
    catch (err) {
        await database.query('ROLLBACK;');
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
