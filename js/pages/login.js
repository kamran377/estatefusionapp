$(document).on('ready',function() {
	/**
	* Events - Start - Login Page
	*/
	$('#loginSubmit').on('touchstart',function(){
		//window.location.href= 'wizard.html';
		//return false;
		if(isDeviceOnline() /* from utils.js*/ ) {
			// online login
			checkOnlineLogin();
		} else {
			// offline login
			checkOfflineLogin();
		}
	});
	/**
	* Events - Start - Login Page
	*/
	$('#loginSubmit').on('click',function(){
		//window.location.href= 'wizard.html';
		//return false;
		if(isDeviceOnline() /* from utils.js*/ ) {
			// online login
			checkOnlineLogin();
		} else {
			// offline login
			checkOfflineLogin();
		}
	});
	$('#password').on('focus',function(){
		$('#loginPage').css({'height':'100%'});
		$('html, body').animate({
			scrollTop: $("#password").offset().top
		}, 2000);
	});
	/**
	* Events - End - Login Page
	*/
});






/**
* Functions - Start - Login Page
*/
function checkOfflineLogin() {
	var email = $('#email').val();
	
	checkLogin(email,function(token){
		if(token) {
			$.mobile.changePage('#welcomePage');
		} else {
			alert('Your credentials do not exist on device, login in online mode first');
		}
	}/* from database.js */);
}
function checkOnlineLogin() {
	var email = $('#email').val();
	var password = $('#password').val();
	var data = {'email':email,'password':password}
	showLoader(/* from utils.js */);
	$.post(LOGIN_URL, data)
	.done(function(res) {
		var json = $.parseJSON(res);
		
		if(json.status == 'success') {
			var data = json.user;
			insertUserWhosme(email,data.access_token, data.name, function(){
				if(data.access_token) {
					loadBundlesData(data.access_token);
					loadTermsData(data.access_token);
					
				}
				hideLoader(/* from utils.js */);
				$.mobile.changePage('#welcomePage');
			}); /* from database.js */
			
		} else {
			alert(json.message);
		}
	})
	.fail(function() {
		hideLoader(/* from utils.js */);
	})
	.always(function() {
		hideLoader(/* from utils.js */);
	});
}
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
			//hideLoader(/* from utils.js */);
			//alert('Bundles data loaded successfully');
			//show the page
			
		}	
	});
	
}
/**
* Functions - End - Login Page
*/