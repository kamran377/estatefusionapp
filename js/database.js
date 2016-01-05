/*************************************************
 *
 * database.js
 * Author Kamran Ali <kamran.ali@xerobug.com>
 * Copyright (c): 2015, all rights reserved for <Estate Fusion>
 * Version: 1.0.0
 *
 * This file contains the methods / utilities related to the offline storage of app
 *
 *************************************************/
$(document).on('ready',function(){
	window.isphone = false;
    if(document.URL.indexOf("http://") === -1 
        && document.URL.indexOf("https://") === -1) {
        window.isphone = true;
    }

    if( window.isphone ) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        onDeviceReady();
    }
	
	
});
function onDeviceReady() {
    // do everything here.
	prepDB();
	//emptyLocalDB();
	createWhosemeTable();
	createBundlesTable();
	createServicesTable();
}
// this is the instance used to deal with lcoal storage
var estateAppDB = null;
// this function opens up an instance of local storage for the app
function prepDB() {
	if (window.openDatabase) {
		try {
			// open database
			estateAppDB = openDatabase('estatefusion','1.0','A place to store agnet data offline',5 * 1024 * 1024);
		}
		catch (e) {
			console.log(e);
		}
	}	
}
/****************************************************************
 * 
 * DB Reset scripts
 * This section consists of methods that will reset the db for testing purposes
 *
 ****************************************************************/
function emptyLocalDB() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('DROP TABLE whosme');
				tx.executeSql('DROP TABLE bundles');
				tx.executeSql('DROP TABLE services');
			});
		}
	} catch(e) {
		console.log(e);
	}
}
/****************************************************************
 * 
 * Table Creation scripts
 * This section consists of methods creating different local table 
 *
 ****************************************************************/
// this function create the whosme table for offline storage of user credentials
function createWhosemeTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS whosme \
								(access_token TEXT NOT NULL,\
								email TEXT NOT NULL,\
								name TEXT NOT NULL)');
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// this function creates the bundles table
// type - the type of bundle
// type : 0 for bundles
// type : 1 for options
function createBundlesTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS bundles \
								(id TEXT NOT NULL,\
								name TEXT NOT NULL,\
								price TEXT NOT NULL,\
								type TEXT NOT NULL)');
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// this function creates the services table
function createServicesTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS services \
								(id TEXT NOT NULL,\
								name TEXT NOT NULL,\
								price TEXT NOT NULL,\
								bundle_id TEXT NOT NULL,\
								info TEXT NOT NULL,\
								free TEXT NOT NULL)');
			});
		}
	} catch(e) {
		console.log(e);
	}
}
/****************************************************************
 * 
 * Table Insert scripts
 * This section consists of methods inserting data in different local table 
 *
 ****************************************************************/
// this function inserts user credentials in the db
function insertUserWhosme(email,token,name,callback) {
	try {
		if (estateAppDB) {
			emptyWhosme();
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO whosme (email,name,access_token) values (?,?,?)'
				,[email,name,token],
				function(tx,results){
					callback();
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function add simple bundle into the local bundles table
// append type : 0 for identification of simple bundles
function insertSimpleBundle(bundle) {
	return insertBundle(bundle, SIMPLE_BUNDLE_TYPE /* from settings.js */);
}

// this function add options bundle into the local bundles table
// append type : 1 for identification of options bundles
function insertOptionsBundle(bundle) {
	return insertBundle(bundle, OPTIONS_BUNDLE_TYPE /* from settings.js */);
}

// this function inserts bundles in the local bundles table
function insertBundle(bundle, type) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO bundles (id,name,type,price) values (?,?,?,?)'
				,[bundle.id,bundle.name,type,bundle.price],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// this function inserts services in the local services table
function insertService(service) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO services (id,name,price,bundle_id,free,info) values (?,?,?,?,?,?)'
				,[service.id, service.name, service.cost, service.bundle, service.free,service.info],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
/****************************************************************
 * 
 * Table Cleaning scripts
 * This section consists of methods deleting data from different local table 
 *
 ****************************************************************/
//empty the whosme table for insertion of new access token
function emptyWhosme(){
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('delete from whosme'
				,[],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
//empty the bundles table for insertion of new bundles data
function emptyBundlesTable(){
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('delete from bundles'
				,[],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

//empty the bundles table for insertion of new bundles data
function emptyServicesTable(){
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('delete from services'
				,[],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
/****************************************************************
 * 
 * Table Selection scripts
 * This section consists of methods selecting data from different local table 
 *
 ****************************************************************/
// This function returns the access token form he whosme table
function getAccessToken(callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from whosme'
				,[],
				function(tx,results){
					if(results.rows.length > 0) {
						var row = results.rows.item(0);
						var access_token = row['access_token'];
						callback( access_token);
					} else {
						return callback("");
					}
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// This function will return simple bundles form local data
function getSimpleBundles(callback) {
	getBundles(SIMPLE_BUNDLE_TYPE /* from settings.js*/,callback);
}
// This function returns the bundles data for the local db
function getBundles(type, callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from bundles where type = ?'
				,[type],
				function(tx,results){
					var len = results.rows.length;
					var array = [];
					for(var i=0; i< len; i++) {
						var row = results.rows.item(i);
						array.push(row);
					}
					callback(array);
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// This function returns all the services data for the local db
function getAllServices(callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from services order by bundle_id'
				,[],
				function(tx,results){
					var len = results.rows.length;
					var array = [];
					for(var i=0; i<len; i++) {
						var row = results.rows.item(i);
						array.push(row);
					}
					callback(array);
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
function checkLogin(email, callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from whosme where email = ?'
				,[email],
				function(tx,results){
					if(results.rows.length > 0) {
						var row = results.rows.item(0);
						var access_token = row['access_token'];
						callback( access_token);
					} else {
						return callback("");
					}
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}