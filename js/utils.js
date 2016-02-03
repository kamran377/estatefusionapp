/*************************************************
 *
 * utils.js
 * Author Kamran Ali <kamran.ali@xerobug.com>
 * Copyright (c): 2015, all rights reserved for <Estate Fusion>
 * Version: 1.0.0
 *
 * This file contains the general utility methods used in the app
 *
 *************************************************/
$( document ).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
	$.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
	
});
 // this function returns whether the device is online or offline
function isDeviceOnline() {
	return navigator.onLine;
}
// this function will set the connection icon
function checkConnection() {
	//alert(window.isphone);
	if(window.isphone) {
		var networkState = navigator.connection.type;
		var cls = "";
		if(networkState == Connection.NONE) {
			cls = "connectionIcon fa fa-ban text-danger";
		} else if (networkState == Connection.WIFI) {
			cls = "connectionIcon fa fa-wifi";
		} else {
			cls = "connectionIcon fa fa-signal";
		}
	} else {
		if(isDeviceOnline()) {
			cls = "connectionIcon fa fa-wifi";
		} else {
			cls = "connectionIcon fa fa-ban text-danger";
		}
	}
	$('div[data-role=page] h1').append($('<i/>').addClass(cls));
}
// this function shows the ajax loader
function showLoader() {
	$.mobile.loading( "show");
}
// this function hides the ajax loader
function hideLoader() {
	$.mobile.loading( "hide");
}
// this will return the parsed value for the number
function getFloat(number) {
	return parseFloat(number);
}
// this function will save the customer draft data into the local db
function saveCustomer(isDraft,callback) {
	// fetch customer data from customer form
	// customer object to hold customer data 
	var customer = {};
	// first customer name
	customer.firstName = $('#firstName').val();
	// first customer surname
	customer.surname = $('#surname').val();
	// second customer name
	customer.firstName2 = $('#firstName2').val();
	// second customer surname
	customer.surname2 = $('#surname2').val();
	// customer home address
	customer.homeAddress = $('#homeAddress').val();
	// customer home Line1
	customer.homeLine1 = $('#homeLine1').val();
	// customer home Line2
	customer.homeLine2 = $('#homeLine2').val();
	// customer home Line3
	customer.homeLine3 = $('#homeLine3').val();
	// customer home town
	customer.homeTown = $('#homeTown').val();
	// customer home country
	customer.homeCountry = $('#homeCountry').val();
	// customer home postal code
	customer.homeCode = $('#homeCode').val();
	// customer same property address
	customer.sameAddress = $('#checkbox-same-address').prop('checked');
	// customer mobile phone
	customer.mobile = $('#mobile').val();
	// customer home phone
	customer.phone = $('#phone').val();
	// customer primary email
	customer.primaryEmail = $('#primaryEmail').val();
	// customer secondary email
	customer.secondaryEmail = $('#secondaryEmail').val();
	// customer property address
	customer.propertyAddress = $('#propertyAddress').val();
	// customer property Line1
	customer.propertyLine1 = $('#propertyLine1').val();
	// customer property Line2
	customer.propertyLine2 = $('#propertyLine2').val();
	// customer property Line3
	customer.propertyLine3 = $('#propertyLine3').val();
	// customer property town
	customer.propertyTown = $('#propertyTown').val();
	// customer property country
	customer.propertyCountry = $('#propertyCountry').val();
	// customer property postal code
	customer.propertyCode = $('#propertyCode').val();
	// customer property tenure
	customer.propertyTenure = $('#propertyTenure').val();
	// customer property notes
	customer.notes = $('#notes').val();
	// customer property term
	customer.term = $('#term').val();
	// customer property agency type
	customer.agencyType = $('#agencyType').val();
	// customer property joint agency name
	customer.agencyName = $('#agencyName').val();
	// customer property price
	customer.price = $('#price').val();
	// we don't have signature, photo for the draft customer
	if(isDraft) {
		// set empty signature
		customer.signature = "";
		// set empty photo 1
		customer.photo_1 = "";
		// set empty photo 2
		customer.photo_2 = "";
	}
	// set empty 
	// fee to be collected from user
	var fee = 0;
	// if fixed price is selected
	if($('#fixed-price-check').prop('checked')) {
		fee = $('#fixedPrice').val();
	} else if($('#perc-price-check').prop('checked')) { // if percentage fee is selected
		fee = $('#percAmount').val();
	}
	// conserve if VAT is checked
	var vat = $('#add-vat-check').prop('checked');
	// conserve if default bundle is selected
	var defaultBundle = $('#default-bundle-check').prop('checked');

	// insert customer in local db
	insertCustomer(customer, function(status, results){
		if(status == true) {
			// id of newly inserted customer row
			var customer_id = results.insertId;
			// now we insert property
			// property object to hold proerty data
			var property = {};
			// customer id
			property.customer_id = customer_id;
			// property price
			property.price = customer.price; /* get from customer object made above */
			// property address
			property.propertyAddress = customer.propertyAddress;/* get from customer object made above */
			// property Line1
			property.propertyLine1 = customer.propertyLine1;/* get from customer object made above */
			// property Line2
			property.propertyLine2 = customer.propertyLine2;/* get from customer object made above */
			// property Line3
			property.propertyLine3 = customer.propertyLine3;/* get from customer object made above */
			// property town
			property.propertyTown = customer.propertyTown;/* get from customer object made above */
			// property country
			property.propertyCountry = customer.propertyCountry;/* get from customer object made above */
			// property postal code
			property.propertyCode = customer.propertyCode;/* get from customer object made above */
			// insert property in local db
			insertProperty(property, function(status, results){
				if(status == true) {
					// id of newly inserted property row
					var property_id = results.insertId;
					// prepare the bundle object to hold bundle purchased information
					var bundle = {};
					// customer_id
					bundle.customer_id = property.customer_id;
					// property_id
					bundle.property_id = property_id;
					// get bundle data
					var $th = getPurchasedBundle() /* from sale-services.js */;
					// bundle_id
					bundle.bundle_id = $th.attr('data-bundle-id');
					// bundle status
					bundle.status = 'not_paid';
					
					// get payables object
					var payable = getPayableObject() /* from sale-services.js */ ;
					// pay now
					bundle.payNow = payable.payNow;
					// pay later
					bundle.payLater = payable.payLater;
					// bundle fee
					bundle.cost = payable.total;
					// payment method
					bundle.paymentMethod = "";
					// vat checkbox checked
					bundle.vat = 'false';
					// default_bundle checkbox
					bundle.default_bundle = defaultBundle;
					// get the selected discount
					var $discount = getSelectedDiscount() /* from sale-services.js */ ;
					bundle.discount = $discount.attr('data-percentage');
					// insert purchased bundle in local db
					insertPurchasedBundle(bundle, function(status, results){
						if(status == true) {
							// create services objects to enter
							// get purchased services
							var $purchasedServices = getPurchasedServices() /* from sale-services.js */ ;
							// iterate over the services and add them to db
							$.each($purchasedServices,function(){
								var $check = $(this);
								// make the service object 
								var service = {};
								// set customer_id
								service.customer_id = property.customer_id;
								// set property id
								service.property_id = property_id;
								// set bundle id
								service.bundle_id = $check.attr('data-bundle-id');
								// set service id
								service.service_id = $check.attr('data-service-id');
								// add service to local db
								insertPurchasedBundleService(service, function(status, results){}) /* from database.js */;
							});
							
							var  $purchasedOptions = getPurchasedOptions() /* from sale-services.js */ ;
							// iterate over the services and add them to db
							$.each($purchasedOptions,function(){
								var $check = $(this);
								// make the service object 
								var service = {};
								// set customer_id
								service.customer_id = property.customer_id;
								// set property id
								service.property_id = property_id;
								// set bundle id
								service.bundle_id = $check.attr('data-bundle-id');
								// set service id
								service.service_id = $check.attr('data-service-id');
								// add service to local db
								insertPurchasedBundleService(service, function(status, results){}) /* from database.js */;
							});
							callback(true);
						}
					}) /* from database.js */ ;
				}
			}) /* from database.js  */;
		} else {
			console.log(results.message);
			
		}
	}) /* from database.js */;
	
}
// this will refresh the page
function refreshPage(page){
    // Page refresh
    $.mobile.changePage(page, {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
    });
}
// this will take back the agent to welcome page
function loadWelcomePage() {
	window.location.href = 'index.html#welcomePage';
}
// this will handle logout button
$(document).on('ready',function(){
	$('.logout').on('click',function(){
		window.location.href = 'index.html#';
	});
	$('#exitApp').on('click',function(){
		navigator.app.exitApp(); // To exit the app!
	});
	$('#wizard_example').on('submit',function(){
		return false;
	});
	$(document).on('click','.delete-draft',function(){
		var id = $(this).attr('data-id');
		var r= confirm('Are you sure you want to delete the draft');
		if(r == true) {
			deleteDraftCustomer(id, function(results){
				alert('Customer Draft deleted successfully');
				$('#customersTable tr[data-id='+ id +']').remove();
			});
		}
	});
	$('#startAgain').on('click',function(){
		var r= confirm('Are you sure you want to start over again');
		if(r == true) {
			refreshPage($('#welcomePage'));
		}
	});
});

