var pageHeight;
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
		pageHeight = $('#loginPage').height();
		pageHeight = pageHeight + 150;
		$('#loginPage').css({'height':pageHeight+'px'});
		$('html, body').animate({
			scrollTop: $("#password").offset().top
		}, 2000);
	});
	$('#password').on('blur',function(){
		pageHeight = $('#loginPage').height();
		pageHeight = pageHeight-150;
		$('#loginPage').css({'height':pageHeight+'px'});
		$('html, body').animate({
			scrollTop: $("#loginPage").offset().top
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
	showLoader("Authenticating ..."/* from utils.js */);
	$.post(LOGIN_URL, data)
	.done(function(res) {
		var json = res;
		console.log(json.status);
		if(json.status == 'success') {
			var data = json.user;
			insertUserWhosme(email,data.access_token, data.name, function(){
				if(data.access_token) {
					hideLoader(/* from utils.js */);
					showLoader("Loading Bundles Data ..."/* from utils.js */);
					loadBundlesData(data.access_token);
					loadTermsData(data.access_token);
					loadRegionsData(data.access_token);
					loadTownsData(data.access_token);
				}
				//hideLoader(/* from utils.js */);
				//$.mobile.changePage('#welcomePage');
			}); /* from database.js */
			
		} else {
			alert(json.message);
			hideLoader(/* from utils.js */);
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
				var terms = obj.result.terms;
				$.each(terms, function(){
					var term = this;
					insertTerms(term); /* from database.js */
				});
			}) /* from database.js*/;
			
		}
	});/* from ajax.js*/
}
// this function laods and store the regions data in local storage
function loadRegionsData(access_token) {
	postRequest(REGIONS_URL /* from settings.js */,'',access_token, function(obj){
		if(obj.status == STATUS_SUCCESS /* from settings.js */) {
			emptyRegionsTable(function(){
				var regions = obj.result.regions;
				$.each(regions, function(){
					var region = this;
					insertRegion(region); /* from database.js */
				});
			}) /* from database.js*/;
			
		}
	});/* from ajax.js*/
}
// this function laods and store the towns data in local storage
function loadTownsData(access_token) {
	postRequest(TOWNS_URL /* from settings.js */,'',access_token, function(obj){
		if(obj.status == STATUS_SUCCESS /* from settings.js */) {
			emptyTownsTable(function(){
				var towns = obj.result.towns;
				$.each(towns, function(){
					var town = this;
					insertTown(town); /* from database.js */
				});
			}) /* from database.js*/;
			
		}
	});/* from ajax.js*/
}
// this function load and store bundles data from server to local db
function loadBundlesData(access_token) {
	getRequest(SIMPLE_BUNDLES_URL /* from settings.js */,'',access_token, function(obj){
		console.log(obj);
		if(obj.status == STATUS_SUCCESS /* from settings.js */) {
			emptyBundlesTable()   /* from database.js*/;
			emptyServicesTable()  /* from database.js*/;
			emptyDiscountsTable() /* from database.js*/;
			var bundles = obj.result.bundles; // return bundles from server
			console.log(bundles);
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
			var bundles = obj.result.bundles; // return bundles from server
			if(bundles && bundles.length) {
				$.each(bundles, function(){
				var bundle = this;
				insertOptionsBundle(bundle); /* from database.js */
					var services = bundle.services;
					if(services && services.length) {
						$.each(services, function(){
							var service = this;
							insertService(service); /* from database.js*/
						});
					}
				});
			}		
			// load the discounts data from the server
			loadDiscountsData(access_token);
		}	
	});/* from ajax.js*/
}
function loadDiscountsData(access_token) {
	postRequest(DISCOUNTS_URL /* from settings.js */,'',access_token, function(obj){
		if(obj.status == STATUS_SUCCESS /* from settings.js */) {
			var discounts = obj.result.discounts; // return bundles from server
			$.each(discounts, function(){
				var discount = this;
				insertDiscount(discount); /* from database.js */
			});
			// load the discounts data from the server
			//hideLoader(/* from utils.js */);
			//alert('Bundles data loaded successfully');
			//show the page
			hideLoader(/* from utils.js */);
			$.mobile.changePage('#welcomePage');
			
		}	
	});
	
}
/**
* Functions - End - Login Page
*/