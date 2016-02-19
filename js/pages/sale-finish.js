$(document).on('ready',function(){
	$('#saveLocalCustomer').on('click',function(){
		saveCustomer(false, function(res){
			if(status == true) {
				alert('Customer details saved successfully in db');
				// take the agent back to welcome screen
				loadWelcomePage() /* from utils.js*/;
			}
		});
	});
});