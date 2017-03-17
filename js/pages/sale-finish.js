$(document).on('ready',function(){
	$('#saveLocalCustomer').on('click',function(){
		$('#saveLocalCustomer').prop('disabled', true);
		$('#saveLocalCustomer i').removeClass('fa-save').addClass('fa-circle-o-notch fa-spin');
		
		saveCustomer(false, function(status){
			if(status == true) {
				alert('Customer details saved successfully in db');
				// take the agent back to welcome screen
				loadWelcomePage() /* from utils.js*/;
			} else {
				alert("Error Occured! try again later");
				$('#saveLocalCustomer').prop('disabled', false);
				$('#saveLocalCustomer i').addClass('fa-save').removeClass('fa-circle-o-notch fa-spin');
		
			}
		});
	});
	$('#uploadCustomer').on('click',function(){
		if(checkDeviceOnline() == false){
			alert("There is some issue with network connection of this device");
			$('#saveLocalCustomer').prop('disabled', false);
			$('#saveLocalCustomer i').addClass('fa-save').removeClass('fa-circle-o-notch fa-spin');
			return;
		}
		$('#uploadCustomer').prop('disabled', true);
		$('#uploadCustomer i').removeClass('fa-upload').addClass('fa-circle-o-notch fa-spin');
		$('#finalErrorDiv').addClass('hidden').html('');
					
		var Customer 	    = makeCustomerObject()/* from utils.js*/;
		var Bundle 		    = makeCustomerBundleObject()/* from utils.js*/;
		var Services 	    = makeCustomerBundleServicesObject()/* from utils.js*/;
		var CustomerPhotos 	= makeCustomerPhotosObject()/* from utils.js*/;
		var Property        = makePropertyObject(Customer)/* from utils.js*/;
		
		var data = {
			'Customers' : Customer,
			'Bundle' : Bundle,
			'Services': Services,
			'CustomerPhotos': CustomerPhotos,
			'Property' : Property
		};
		getAccessToken(function(access_token){
			postRequest(ADD_CUSTOMER_URL /* from settings.js */,data,access_token, function(obj){
				$('#uploadCustomer').prop('disabled', false);
				$('#uploadCustomer i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-upload');
				console.log(obj.result.message);
				
				if(obj.status == STATUS_ERROR) {
					alert('Some error occured, you can try again or save the customer details locally, for upload later');
					$('#saveLocalCustomer').removeClass('hidden');
					$('#finalErrorDiv').removeClass('hidden').html(obj.result.message);
					refreshStep();
					return false;
				}
				var res = obj.result;
				if(res.status == 'success') {
					alert('Customer uploaded successfully');
					var custid = $('#customerIDHidden').val();
					if(custid) {
						deleteDraftCustomer(custid, function(){
							loadWelcomePage() /* from utils.js*/;
						}) /* from database.js*/;
					} else {
						loadWelcomePage() /* from utils.js*/;
					}
					// take the agent back to welcome screen
					//loadWelcomePage() /* from utils.js*/;
				} else {
					alert(res.message);
					$('#finalErrorDiv').removeClass('hidden').html(res.message);
					
				}	
			}) /* from ajax.js*/;
		})/* from database.js*/;
	});
});