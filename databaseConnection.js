const mysql = require('mysql2/promise');

const is_render = process.env.IS_RENDER || false;

const dbConfigRender = {
	host: "sql.freedb.tech",
	user: "freedb_cwan_main",
	password: "n!?hTMRsJ2GNPM*",
	database: "freedb_comp2350-week2-A00970304",
	multipleStatements: false,
	namedPlaceholders: true
};

const dbConfigLocal = {
	host: "sql.freedb.tech",
	user: "freedb_cwan_main",
	password: "n!?hTMRsJ2GNPM*",
	database: "Free DB",
	multipleStatements: false,
	namedPlaceholders: true
};

if (is_render) {
	var database = mysql.createPool(dbConfigRender);
}
else {
	var database = mysql.createPool(dbConfigLocal);
}

module.exports = database;
		