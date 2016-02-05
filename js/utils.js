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
	// conserve if the fixed price checkbox is checked
	customer.fixed_price_check = $('#fixed-price-check').prop('checked');
	// conserve if the percentage price checkbox is checked
	customer.perc_price_check = $('#perc-price-check').prop('checked');
	// conserve percentage value
	customer.perc_value = $('#percValue').val();
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
// this will populate the customer draft
function populateCustomerDraft(customer,property,bundle, services) {
	// fetch customer data from customer form
	// customer object to hold customer data 
	var customer = {};
	// first customer name
	$('#firstName').val(customer['first_name_1']);
	// first customer surname
	$('#surname').val(customer['surname_1']);
	// second customer name
	$('#firstName2').val(customer['first_name_2']);
	// second customer surname
	$('#surname2').val(customer['surname_2']);
	// set authorship select value 
	if($('#firstName2').val()) {
		// the property has dual ownership
		$('#ownership').val(2);
	} else {
		// the property has single ownership
		$('#ownership').val(1);
	}
	// we have to separate the home address and home line 1
	var _homeAddress = customer['home_address_1'];
	_homeAddressArray =  str.split("|");
	// set index 0 to home address
	$('#homeAddress').val(_homeAddressArray[0]);
	// if we have two parts of address
	if(_homeAddressArray.length == 2) {
		// set index 0 to home line 1
		$('#homeLine1').val(_homeAddressArray[1]);
	}
	// customer home Line2
	$('#homeLine2').val(customer['home_address_2']);
	// customer home Line3
	$('#homeLine3').val(customer['home_address_3']);
	// customer home town
	$('#homeTown').val(customer['home_town']);
	// customer home country
	$('#homeCountry').val(customer['home_county']);
	// customer home postal code
	$('#homeCode').val(customer['home_post']);
	// customer same property address
	$('#checkbox-same-address').prop('checked',customer['home_is_property']);
	// customer mobile phone
	$('#mobile').val(customer['mobile_number']);
	// customer home phone
	$('#phone').val(customer['phone_number']);
	// customer primary email
	$('#primaryEmail').val(customer['email_1']);
	// customer secondary email
	$('#secondaryEmail').val(customer['email_2']);
	// we have to separate the home address and home line 1
	var _propertyAddress = customer['property_address_1'];
	_propertyAddressArray =  str.split("|");
	// set index 0 to property address
	$('#propertyAddress').val(_homeAddressArray[0]);
	// if we have two parts of address
	if(_homeAddressArray.length == 2) {
		// set index 0 to property line 1
		$('#propertyLine1').val(_homeAddressArray[1]);
	}
	// customer property Line2
	$('#propertyLine2').val(customer['property_address_2']);
	// customer property Line3
	$('#propertyLine3').val(customer['property_address_3']);
	// customer property town
	$('#propertyTown').val(customer['property_town']);
	// customer property country
	$('#propertyCountry').val(customer['proprty_county']);
	// customer property postal code
	$('#propertyCode').val(customer['property_postcode']);
	// customer property tenure
	$('#propertyTenure').val(customer['property_tenure']);
	// customer property notes
	$('#notes').val(customer['property_notes']);
	// customer property term
	$('#term').val(customer['property_term']);
	// customer property agency type
	$('#agencyType').val(customer['agency_type']);
	// customer property joint agency name
	$('#agencyName').val(customer['joint_agency_name']);
	// remove read only from agency name if it is non-empty
	if($('#agencyName').val()) {
		$('#agencyName').prop('readonly',false);
	} else {
		$('#agencyName').prop('readonly',true)
	}
	// customer property price
	$('#price').val(customer['asking_price']);
	// fixed price checkbox
	$('#fixed-price-check').prop('checked',customer['fixed_price_check']);
	// percentage price checkbox
	$('#perc-price-check').prop('checked',customer['perc_price_check']);
	// percentage price
	$('#percValue').prop('checked',customer['perc_value']);
	// conserve if default bundle is selected
	$('#default-bundle-check').prop('checked',bundle['default_bundle']);
	$('#default-bundle-check').change();
	// get bundle id
	var bundle_id = bundle['bundle_id'];
	// check the bundle and trigger the change event
	$th = $('#services-table thead tr th.bundle[data-bundle-id='+ bundle_id +']');
	$th.prop('checked',true);
	$th.change();
	var index = $('#services-table thead tr th').index($th);
	index = index + 1;
	// set the sub total
	//$('#services-table tr.sub-price-1 td:nth-child('+index+') span').text($('#price').val());
	
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
	$(document).on('click','.continue-draft',function(){
		// get the id of the customer 
		var id = $(this).attr('data-id');
		// retrieve the customer form the local db
		getSingleCustomer(id, function(customer){
			if(customer) {
				// get customer property details
				getCustomerProperty(id, function(property) {
					// if property is present
					if(property) {
						// get the bundle purchased
						getCustomerBundlesPurchased(id, function(bundle){
							// get the services purchased 
							getCustomerBundlesServicesPurchased(id, function(services){
								// populate the customer draft
								populateCustomerDraft(customer, property, bundle,services);
							})/* from database.js */;
						}) /* from database.js */;
					}
				})/* from database.js */;
			}
		}) /* from database.js */;
	});
	$('#startAgain').on('click',function(){
		var r= confirm('Are you sure you want to start over again');
		if(r == true) {
			refreshPage($('#welcomePage'));
		}
	});
});

