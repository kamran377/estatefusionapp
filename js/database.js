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
var versionNumber = 'MAIN-V040217.A';

$(document).on('ready',function(){
	FastClick.attach(document.body);
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
	
	// stripe key token
	if(typeof Stripe != 'undefined') {
		Stripe.setPublishableKey('pk_test_UTPtoJhL9PHHassAMqzLVs7p');  //for frost and co
		//Stripe.setPublishableKey('pk_test_v2DTosStxmJG8SnaKs4tDnfe'); // for dev account
	}
});
function onDeviceReady() {
    
	// do everything here.
	prepDB();
	if(!window.location.hash) {
		//emptyLocalDB();
	}
	createWhosemeTable();
	createBundlesTable();
	createServicesTable();
	createDiscountsTable();
	createCustomersTable();
	createTermsTable();
	createPropertiesTable();
	createBundlesPurchasedTable();
	createBundlesServicesPurchasedTable();
	createCustomerPhotosTable();
	createRegionsTable();
	createTownsTable();
	updateDbSchema();
	$('#footer').text(versionNumber);
	$('.versionNumber').text(versionNumber);
	document.addEventListener("backbutton", onBackKeyDown, false);
	//var networkState = navigator.network.connection.type;
	//alert(networkState);
	checkConnection();
	
}
function onBackKeyDown(e) {
	e.preventDefault();
}

// this is the instance used to deal with lcoal storage
var estateAppDB = null;
// this function opens up an instance of local storage for the app
function prepDB() {
	if (window.openDatabase) {
		try {
			// open database
			estateAppDB = openDatabase('estatefusion','1.0','A place to store property data offline',50 * 1024 * 1024);
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
				tx.executeSql('DROP TABLE discounts');
				tx.executeSql('DROP TABLE customers');
				tx.executeSql('DROP TABLE properties');
				tx.executeSql('DROP TABLE bundles_purchased');
				tx.executeSql('DROP TABLE bundles_services_purchased');	
				tx.executeSql('DROP TABLE regions');
				tx.executeSql('DROP TABLE towns');
				tx.executeSql('DROP TABLE newterms');					
			});
		}
	} catch(e) {
		console.log(e);
	}
}

function deleteSalesData(callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('delete from customers');
				tx.executeSql('delete from properties');
				tx.executeSql('delete from  bundles_purchased');
				tx.executeSql('delete from  bundles_services_purchased');	
				tx.executeSql('delete from  customer_photos');	
				callback(true);				
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
								(id INTEGER NOT NULL,\
								name TEXT NOT NULL,\
								price TEXT NOT NULL,\
								default_bundle TEXT NOT NULL,\
								discount TEXT NOT NULL,\
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
								(id INTEGER NOT NULL,\
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

// this function creates the discounts table
function createDiscountsTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS discounts \
								(id INTEGER NOT NULL,\
								name TEXT NOT NULL,\
								percentage TEXT NOT NULL,\
								now TEXT NOT NULL,\
								later TEXT NOT NULL,\
								info TEXT NOT NULL)');
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function creates the customers table
function createCustomersTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS customers (\
					id INTEGER PRIMARY KEY AUTOINCREMENT,\
					first_name_1 TEXT,\
					surname_1 TEXT,\
					first_name_2 TEXT,\
					surname_2 TEXT,\
					home_address_1 TEXT,\
					home_address_2 TEXT,\
					home_address_3 TEXT,\
					home_town TEXT,\
					home_county TEXT,\
					home_post TEXT,\
					home_is_property TEXT,\
					mobile_number TEXT,\
					phone_number TEXT,\
					email_1 TEXT,\
					email_2 TEXT,\
					property_address_1 TEXT,\
					property_address_2 TEXT,\
					property_address_3 TEXT,\
					property_town TEXT,\
					proprty_county TEXT,\
					property_postcode TEXT,\
					property_tenure TEXT,\
					property_notes TEXT,\
					agency_type TEXT,\
					joint_agency_name TEXT,\
					asking_price TEXT,\
					signature TEXT,\
					photo_1 TEXT,\
					photo_2 TEXT,\
					property_term TEXT)',
					[],
					onSuccessExecuteSql,
					onError
				);
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function creates the properties table
function createPropertiesTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS properties \
								(id INTEGER PRIMARY KEY AUTOINCREMENT,\
								customer_id TEXT NOT NULL,\
								price TEXT NOT NULL,\
								property_address_1 TEXT,\
								property_address_2 TEXT,\
								property_address_3 TEXT,\
								property_town TEXT,\
								proprty_county TEXT,\
								property_postcode TEXT)');
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function creates the bundles_purchased table
function createBundlesPurchasedTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS bundles_purchased \
							(id INTEGER PRIMARY KEY AUTOINCREMENT,\
							customer_id TEXT NOT NULL,\
							property_id TEXT NOT NULL,\
							bundle_id TEXT NOT NULL,\
							status TEXT NOT NULL,\
							cost TEXT,\
							total_paid_now TEXT,\
							total_to_pay_on_sale TEXT,\
							vat TEXT,\
							default_bundle TEXT,\
							discount TEXT,\
							balance_paid_method TEXT)');
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function creates the bundles_services_purchased table
function createBundlesServicesPurchasedTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS bundles_services_purchased \
							(id INTEGER PRIMARY KEY AUTOINCREMENT,\
							customer_id TEXT NOT NULL,\
							property_id TEXT NOT NULL,\
							bundle_id TEXT NOT NULL,\
							service_id TEXT NOT NULL)');
			});
		}
	} catch(e) {
		console.log(e);
	}
}
function createCustomerPhotosTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS customer_photos \
							(id INTEGER PRIMARY KEY AUTOINCREMENT,\
							customer_id TEXT NOT NULL,\
							photo_type_id TEXT NOT NULL,\
							photo TEXT NOT NULL,\
							owner TEXT NOT NULL)');
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function creates the terms table
function createTermsTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS newterms \
					(id INTEGER NOT NULL,\
					now_flag TEXT NOT NULL,\
					default_flag TEXT NOT NULL,\
					title TEXT NOT NULL,\
					terms TEXT NOT NULL)',[],onSuccessExecuteSql,onError);
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// this function creates the regions table
function createRegionsTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS regions \
					(id INTEGER NOT NULL,\
					name TEXT NOT NULL)',[],onSuccessExecuteSql,onError);
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// this function creates the towns table
function createTownsTable() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS towns \
					(id INTEGER NOT NULL,\
					name TEXT NOT NULL,\
					region_id INTEGER NOT NULL)',[],onSuccessExecuteSql,onError);
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// this function will add extra columns to the tables in local db
function updateDbSchema() {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('ALTER TABLE customers ADD fixed_price_check TEXT',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE customers ADD perc_price_check TEXT',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE customers ADD perc_value TEXT',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE customers ADD agent_fee TEXT',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE customers ADD default_bundle TEXT',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE bundles ADD position INTEGER',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE services ADD row INTEGER',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE services ADD upfront TEXT',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE customers ADD signature_2 TEXT',[],onSuccessExecuteSql,onError);
				tx.executeSql('ALTER TABLE bundles_purchased ADD discount_id TEXT',[],onSuccessExecuteSql,onError);
				

			});
		}
	} catch(e) {
		console.log(e);
	}
}
function onSuccessExecuteSql( tx, results ){
	console.log(results);
}
function onError( tx, err ){
	console.log( err.message )
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
			var discount = bundle.discount ? bundle.discount : 0;
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO bundles (id,name,type,price,default_bundle,discount,position) values (?,?,?,?,?,?,?)'
				,[bundle.id,bundle.name,type,bundle.price,bundle.def,bundle.discount,bundle.position],
				function(tx,results){
					return true;
				},
				function(tx,error){
					console.log(error.message);
					
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
				tx.executeSql('INSERT INTO services (id,name,price,bundle_id,free,info,row,upfront) values (?,?,?,?,?,?,?,?)'
				,[service.id, service.name, service.cost, service.bundle, service.free,service.info,service.row,service.upfront],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// this function inserts bundles in the local bundles table
function insertDiscount(discount) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO discounts (id,name,percentage,info,now,later) values (?,?,?,?,?,?)'
				,[discount.id,discount.name,discount.percentage,discount.info, discount.now, discount.later],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function inserts customer data in the local customers table
function insertCustomer(customer,callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO customers (first_name_1 ,surname_1 ,first_name_2 ,surname_2 ,home_address_1 ,home_address_2 ,home_address_3 ,home_town ,home_county ,home_post ,home_is_property ,mobile_number ,phone_number ,email_1 ,email_2 ,property_address_1 ,property_address_2 ,property_address_3 ,property_town ,proprty_county ,property_postcode ,property_tenure ,property_notes ,agency_type ,joint_agency_name ,asking_price,signature, photo_1,photo_2,property_term, fixed_price_check, perc_price_check, perc_value,agent_fee,default_bundle,signature_2) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
				,[
					customer.firstName,customer.surname,
					customer.firstName2,customer.surname2, 
					customer.homeAddress + '|' + customer.homeLine1, customer.homeLine2, customer.homeLine3,
					customer.homeTown, customer.homeCountry, customer.homeCode,
					customer.sameAddress,
					customer.mobile, customer.phone,
					customer.primaryEmail, customer.secondaryEmail,
					customer.propertyAddress + '|' + customer.propertyLine1, customer.propertyLine2, customer.propertyLine3,
					customer.propertyTown, customer.propertyCountry, customer.propertyCode,
					customer.propertyTenure, customer.notes,
					customer.agencyType, customer.agencyName,customer.price,
					customer.signature, customer.photo_1, customer.photo_2,customer.term,
					customer.fixed_price_check, customer.perc_price_check, customer.perc_value, customer.agent_fee,customer.default_bundle,customer.signature2
				],
				function(tx,results){
					callback(true,results);
				},
				function(tx,error){
					console.log(error.message);
					callback(false,error);
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function inserts terms in the local terms table
function insertTerms(terms) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO newterms (id,now_flag,default_flag, title, terms) values (?,?,?,?,?)'
				,[terms.id,terms.now_flag,terms.default_flag, terms.title, terms.terms,],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function inserts region in the local regions table
function insertRegion(region) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO regions (id,name) values (?,?)'
				,[region.id,region.name],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// this function inserts town in the local towns table
function insertTown(town) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO towns (id,name,region_id) values (?,?,?)'
				,[town.id,town.name,town.regionId],
				function(tx,results){
					return true;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function inserts properties in the local properties table
function insertProperty(property,callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO properties (customer_id,price,property_address_1,property_address_2,property_address_3,property_town,proprty_county,property_postcode ) values (?,?,?,?,?,?,?,?)'
				,[
					property.customer_id,property.price,
					property.propertyAddress + '|' + property.propertyLine1,
					property.propertyLine2, property.propertyLine3,
					property.propertyTown, property.propertyCountry, property.propertyCode
					
				],
				function(tx,results){
					callback(true,results) ;
				},
				function(tx,error){
					console.log(error.message);
					callback(false,error) ;
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function inserts purchased bundle in the local bundles_purchased table
function insertPurchasedBundle(bundle, callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO bundles_purchased (customer_id,property_id,bundle_id,status,cost,total_paid_now,total_to_pay_on_sale,balance_paid_method,vat,default_bundle,discount, discount_id) values (?,?,?,?,?,?,?,?,?,?,?,?)'
				,[
					bundle.customer_id,bundle.property_id,
					bundle.bundle_id , bundle.status,
					bundle.cost, bundle.payNow,
					bundle.payLater, bundle.paymentMethod,
					bundle.vat, bundle.default_bundle,bundle.discount,
					bundle.discount_id
				],
				function(tx,results){
					callback(true,results);
				},
				function(tx,error){
					console.log(error.message);
					callback(false,error);
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function inserts purchased bundle service in the local bundles_services_purchased table
function insertPurchasedBundleService(service, callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO bundles_services_purchased (customer_id,property_id,bundle_id,service_id) values (?,?,?,?)'
				,[
					service.customer_id,service.property_id,
					service.bundle_id , service.service_id
					
				],
				function(tx,results){
					console.log(results);
					callback(true,results);
				},
				function(tx,error){
					console.log(error.message);
					callback(false,error);
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function inserts purchased bundle service in the local bundles_services_purchased table
function insertCustomerPhoto(customerPhoto, callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO customer_photos (customer_id,photo_type_id,photo,owner) values (?,?,?,?)'
				,[
					customerPhoto.customer_id,customerPhoto.photo_type_id,
					customerPhoto.photo , customerPhoto.owner
					
				],
				function(tx,results){
					callback(true,results);
				},
				function(tx,error){
					console.log(error.message);
					callback(false,error);
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

//empty the services table for insertion of new services data
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
//empty the discounts table for insertion of new discounts data
function emptyDiscountsTable(){
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('delete from discounts'
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
//empty the terms table for insertion of new terms data
function emptyTermsTable(callback){
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('delete from newterms'
				,[],
				function(tx,results){
					callback();
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

//empty the regions table for insertion of new regions data
function emptyRegionsTable(callback){
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('delete from regions'
				,[],
				function(tx,results){
					callback();
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

//empty the towns table for insertion of new towns data
function emptyTownsTable(callback){
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('delete from towns'
				,[],
				function(tx,results){
					callback();
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// this function will delete the draft customer form the local db
function deleteDraftCustomer(id, callback) {
	//var sql1 = "delete c,p, b, s from customers c, properties p, bundles_purchased b, bundles_services_purchased s where p.customer_id = c.id and b.property_id = p.id and s.bundle_id = b.id and c.id = ?"
	var cid = id + '.0';
	var sql1 = "delete from customers where id = ?";
	var sql2 = "delete from properties where customer_id = ?";
	var sql3 = "delete from bundles_purchased where customer_id = ?";
	var sql4 = "delete from bundles_services_purchased where customer_id = ?";
	var sql5 = "delete from customer_photos where customer_id = ?";
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql(sql1,[id]);
				tx.executeSql(sql2,[cid]);
				tx.executeSql(sql3,[cid]);
				tx.executeSql(sql4,[cid],function(){
					tx.executeSql(sql5,[cid]);
					callback();
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
						callback("");
					}
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}


// This function will return options bundles form local data
function getOptionsBundles(callback) {
	getBundles(OPTIONS_BUNDLE_TYPE /* from settings.js*/,callback);
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
				tx.executeSql('select * from bundles where type = ? order by position'
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
				tx.executeSql('select * from services order by bundle_id, row '
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
// This function provided offline login functionality to the user
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
// This function returns all the discounts data for the local db
function getAllDiscounts(callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from discounts'
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
// This function returns all the terms data for the local db
function getTerms(defaultBundle, callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from newterms where default_flag = ?'
				,[defaultBundle],
				function(tx,results){
					var len = results.rows.length;
					var array = [];
					for(var i=0; i<len; i++) {
						var row = results.rows.item(i);
						array[i] = row;
					}
					callback(array);
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// This function returns all the regions data for the local db
function getRegions(callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from regions'
				,[],
				function(tx,results){
					var len = results.rows.length;
					var array = [];
					for(var i=0; i<len; i++) {
						var row = results.rows.item(i);
						array[i] = row;
					}
					callback(array);
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// This function returns all the regions data for the local db
function getTowns(callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from towns'
				,[],
				function(tx,results){
					var len = results.rows.length;
					var array = [];
					for(var i=0; i<len; i++) {
						var row = results.rows.item(i);
						array[i] = row;
					}
					callback(array);
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}

// This function returns all the customers stored in the local db
function getCustomers(isDraft, callback) {
	if(isDraft) {
		var sql = "select * from customers where signature = '' ";
	} else {
		var sql = "select * from customers where signature <> '' ";
	}
	//alert(sql);
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql(sql
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
// This function returns the customer for the given id
function getSingleCustomer(id, callback) {
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from customers where id = ?'
				,[id],
				function(tx,results){
					if(results.rows.length > 0) {
						var row = results.rows.item(0);
						callback(row);
					} else {
						callback("");
					}
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// This function returns the property for the given id
function getCustomerProperty(id, callback) {
	id = id + '.0';
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from properties where customer_id = ?'
				,[id],
				function(tx,results){
					if(results.rows.length > 0) {
						var row = results.rows.item(0);
						callback(row);
					} else {
						callback("");
					}
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// This function returns the bundles purchased for the given id
function getCustomerBundlesPurchased(id, callback) {
	id = id + '.0';
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from bundles_purchased where customer_id = ?'
				,[id],
				function(tx,results){
					if(results.rows.length > 0) {
						var row = results.rows.item(0);
						callback(row);
					} else {
						callback("");
					}
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// This function returns the bundles services purchased for the given id
function getCustomerBundlesServicesPurchased(id, callback) {
	id = id + '.0';
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from bundles_services_purchased where customer_id = ?'
				,[id],
				function(tx,results){
					if(results.rows.length > 0) {
						var len = results.rows.length;
						var array = [];
						for(var i=0; i<len; i++) {
							var row = results.rows.item(i);
							array.push(row);
						}
						callback(array);
					} else {
						callback("");
					}
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}
// This function returns the photos for the given customer id
function getCustomerPhotos(id, callback) {
	id = id + '.0';
	try {
		if (estateAppDB) {
			estateAppDB.transaction(function(tx) {
				tx.executeSql('select * from customer_photos where customer_id = ?'
				,[id],
				function(tx,results){
					if(results.rows.length > 0) {
						var len = results.rows.length;
						var array = [];
						for(var i=0; i<len; i++) {
							var row = results.rows.item(i);
							array.push(row);
						}
						callback(array);
					} else {
						callback("");
					}
				});
			});
		}
	} catch(e) {
		console.log(e);
	}
}