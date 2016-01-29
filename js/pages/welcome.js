$(document).on('ready',function() {
	/**
	* Events - Start - Welcome Page
	*/
	$(document).on("pageshow","#welcomePage",function() { // When entering welcomePage
		if(isDeviceOnline() /* from utils.js*/ ) {
			// show loading spinner to load data from server
			showLoader(/* from utils.js */);
			// fetch the access token from local db
			var access_token = getAccessToken(function(access_token) {
				// if user has valid access_token
				// fetch the bundles data
				if(access_token) {
					loadBundlesData(access_token);
					loadTermsData(access_token);
					loadStoredCustomers();
				} else {
					alert('Please login to continue');
					hideLoader(/* from utils.js */);
					// send user to login page
					$.mobile.changePage('#loginPage');
				}
			}); /* from database.js */
		}
	});
	/**
	* Events - End - Welcome Page
	*/
});
/**
* Functions - Start - Welcome Page
*/
// this function laods and store the terms data in lcoal storage
function loadTermsData(access_token) {
	postRequest(TERMS_URL /* from settings.js */,'',access_token, function(obj){
		if(obj.status == STATUS_SUCCESS /* from settings.js */) {
			emptyTermsTable(function(){
				var terms = obj.result;
				$.each(terms, function(){
					var term = this;
					insertTerms(term); /* from database.js */
				});
			}) /* from database.js*/;
			
		}
	});/* from ajax.js*/
}
// this function load and store bundles data from server to local db
function loadBundlesData(access_token) {
	postRequest(SIMPLE_BUNDLES_URL /* from settings.js */,'',access_token, function(obj){
		if(obj.status == STATUS_SUCCESS /* from settings.js */) {
			emptyBundlesTable()   /* from database.js*/;
			emptyServicesTable()  /* from database.js*/;
			emptyDiscountsTable() /* from database.js*/;
			var bundles = obj.result; // return bundles from server
			$.each(bundles, function(){
				var bundle = this;
				insertSimpleBundle(bundle); /* from database.js */
				var services = bundle.services;
				$.each(services, function(){
					var service = this;
					insertService(service); /* from database.js*/
				});
			});
			loadOptionsData(access_token);
		}	
	});/* from ajax.js*/
}
// this function will populate the customer table in the page
function loadStoredCustomers() {
	getCustomers(function(customers){
		
		if(customers.length > 0) {
			$.each(customers, function(){
				var customer = this;
				$tr = $('<tr/>').attr('data-id',customer['id'])
					.append($('<td/>').text(customer.first_name_1 + ' ' + customer.surname_1))
					.append($('<td/>').text(customer.home_address_1))
					.append($('<td/>').css('width','20%').append(
							$('<a/>').addClass('ui-btn primary-btn').attr({'href':'javascript://','data-id':customer['id']}).text('Continue')
						));
				$('#customersTable').append($tr);
			});
			$('#customersTableDiv').removeClass('hidden');
		}
	})/* from database.js*/;
}
// this function load and store bundles data from server to local db
function loadOptionsData(access_token) {
	postRequest(OPTIONS_BUNDLES_URL /* from settings.js */,'',access_token, function(obj){
		if(obj.status == STATUS_SUCCESS /* from settings.js */) {
			var bundles = obj.result; // return bundles from server
			$.each(bundles, function(){
				var bundle = this;
				insertOptionsBundle(bundle); /* from database.js */
				var services = bundle.services;
				$.each(services, function(){
					var service = this;
					insertService(service); /* from database.js*/
				});
			});
			// load the discounts data from the server
			loadDiscountsData(access_token);
		}	
	});/* from ajax.js*/
}
function loadDiscountsData(access_token) {
	postRequest(DISCOUNTS_URL /* from settings.js */,'',access_token, function(obj){
		if(obj.status == STATUS_SUCCESS /* from settings.js */) {
			var discounts = obj.result; // return bundles from server
			$.each(discounts, function(){
				var discount = this;
				insertDiscount(discount); /* from database.js */
			});
			// load the discounts data from the server
			hideLoader(/* from utils.js */);
			//alert('Bundles data loaded successfully');
			//show the page
			$('#pageContent').show();
		}	
	});
	
}
/**
* Functions - End - Welcome Page
*/