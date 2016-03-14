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
		$('#uploadCustomer').prop('disabled', true);
		$('#uploadCustomer i').removeClass('fa-cc').addClass('fa-circle-o-notch fa-spin');
		
		var Customer 	= makeCustomerObject()/* from utils.js*/;
		var Bundle 		= makeCustomerBundleObject()/* from utils.js*/;
		var Services 	= makeCustomerBundleServicesObject()/* from utils.js*/;
		var CustomerPhotos 	= makeCustomerPhotosObject()/* from utils.js*/;
		console.log(CustomerPhotos);
		var data = {
			'Customer' : Customer,
			'Bundle' : Bundle,
			'Services': Services,
			'CustomerPhotos': CustomerPhotos,
		};
		getAccessToken(function(access_token){
			postRequest(ADD_CUSTOMER_URL /* from settings.js */,data,access_token, function(obj){
				$('#uploadCustomer').prop('disabled', false);
				$('#uploadCustomer i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-cc');
				
				var res = obj.result;
				if(res.status == 'success') {
					alert('Customer uploaded successfully');
					// take the agent back to welcome screen
					loadWelcomePage() /* from utils.js*/;
				} else {
					alert(res.message);
				}	
			}) /* from ajax.js*/;
		})/* from database.js*/;
	});
});