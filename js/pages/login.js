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
				hideLoader(/* from utils.js */);
				$.mobile.changePage('#welcomePage');
			});
		} else {
			alert(json.message);
		}
	})
	.fail(function() {
		alert( "Login Failed" );
	})
	.always(function() {
		$('#spinner').hide();
	});
}
/**
* Functions - End - Login Page
*/