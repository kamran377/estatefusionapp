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
// these variables will hold the data fro draft customer continue function
var draftCustomer;
var draftProperty;
var draftBundle;
var draftServices;
$(document).on('pagehide', function (e) {
    var page = $(e.target);
    if (!$.mobile.page.prototype.options.domCache
        && (!page.attr('data-dom-cache')
            || page.attr('data-dom-cache') == "false")
        ) {
        //page.remove();
    }
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
function showLoader(text) {
	var loadertext = text ? text : "";
	var textVisible = loadertext ? true : false;
	$.mobile.loading( "show", {
		text: loadertext,
		textVisible: textVisible,
		html: ""
	});
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
	// conserve the fixed fee
	customer.agent_fee = fee;
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
	window.location.reload();
	window.location.href = 'index.html#welcomePage';
}
// this will populate the customer draft
function populateCustomerDraft(customer,property,bundle, services) {
	// fetch customer data from customer form
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
	_homeAddressArray =  _homeAddress.split("|");
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
	_propertyAddressArray =  _propertyAddress.split("|");
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
	// customer property price
	$('#price').val(customer['asking_price']);
	// fixed price checkbox
	if(customer['fixed_price_check'] == "true") {
		// check the fixed price checkbox
		$('#fixed-price-check').prop('checked',true);
		// set the readonly for the fixed price field to false
		$('#fixedPrice').prop('readonly',false);
		// set the value of fixed price field
		$('#fixedPrice').val(customer.agent_fee);
		// uncheck the percentage fee checkbox
		$('#perc-price-check').prop('checked',false);
		// set teh percentage field to readonly
		$('#percValue').prop('readonly',true);
		// set the value of percentage field to empty
		$('#percValue').val('');
		// set the value of percentage amount field to empty
		$('#percAmount').val('');
	} else {
		// uncheck the fixed price checkbox
		$('#fixed-price-check').prop('checked',false);
		// set the readonly for the fixed price field to true
		$('#fixedPrice').prop('readonly',true);
		// set the value of fixed amount field to empty
		$('#fixedPrice').val('');
	}
	// percentage price checkbox
	if(customer['perc_price_check'] == "true") {
		// check the fixed price checkbox
		$('#perc-price-check').prop('checked',true);
		// percentage price
		$('#percValue').val(customer['perc_value']);
		// set the readonly for the percentage field field to false
		$('#percValue').prop('readonly',false);
		// adjust the percentage price field
		// get perecnatge value
		var percentage = $('#percValue').val();
		// get price
		var price = $('#price').val();
		// convert the percentage to float
		percentage = parseFloat(percentage);
		price = parseFloat(price);
		// calculate the perecntage price
		var percPrice = (percentage / 100) * price;
		// display the percentage price
		percPrice = percPrice.toFixed(2);
		$('#percAmount').val(percPrice);
		
	} else {
		// uncheck the fixed price checkbox
		$('#perc-price-check').prop('checked',false);
		// set the readonly for the percentage field field to true
		$('#perc-price-check').change();
	}
	
	if(customer['default_bundle'] == "true") {
		$('#default-bundle-check').prop('checked',true);
	} else {
		$('#default-bundle-check').prop('checked',false);
	}
	// hide the loader
	hideLoader()/* from utils.js */;
	// move to sales Page
	$.mobile.changePage($('#salePage'), {
        allowSamePageTransition: true,
        transition: 'none'
    });	
}

// this will handle logout button
$(document).on('ready',function(){
	$('.logout').on('click',function(){
		
		window.location.reload();
		window.location.href = 'index.html';
	});
	$('#exitApp').on('click',function(){
		navigator.app.exitApp(); // To exit the app!
	});
	$('#wizard_example').on('submit',function(){
		return false;
	});
	$(document).on('click','#newSaleLink',function(){
		$.mobile.changePage($('#salePage'), {
			reloadPage: true
		});
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
		showLoader('Loading Customer Data');
		// get the id of the customer 
		var id = $(this).attr('data-id');
		// retrieve the customer form the local db
		getSingleCustomer(id, function(customer){
			if(customer) {
				draftCustomer = customer;
				// get customer property details
				getCustomerProperty(id, function(property) {
					// if property is present
					if(property) {
						draftProperty = property;
						// get the bundle purchased
						getCustomerBundlesPurchased(id, function(bundle){
							draftBundle = bundle;
							// get the services purchased 
							getCustomerBundlesServicesPurchased(id, function(services){
								// populate the customer draft
								draftServices = services;
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
			// null the draft data 
			draftCustomer = null;
			draftProperty = null;
			draftBundle = null;
			draftServices = null;
			window.location.href = "index.html#welcomePage"
			location.reload();
			
		}
	});
});

