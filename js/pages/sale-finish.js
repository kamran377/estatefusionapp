$(document).on('ready',function(){
	$('#saveLocalCustomer').on('click',function(){
		saveCustomer(false, function(status){
			if(status == true) {
				alert('Customer details saved successfully in db');
				// take the agent back to welcome screen
				loadWelcomePage() /* from utils.js*/;
			}
		});
	});
	$('#uploadCustomer').on('click',function(){
		var customer = makeCustomerObject()/* from utils.js*/;
	});
});