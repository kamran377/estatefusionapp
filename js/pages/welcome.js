$(document).on('ready',function() {
	/**
	* Events - Start - Welcome Page
	*/
	$(document).on("pageshow","#welcomePage",function() { // When entering welcomePage
		$('#pageContent').show();
		// show loader
		showLoader('Loading Draft / Completed Sales')/* from utils.js */;
		// show stored customers
		loadStoredCustomers();
	});
	/**
	* Events - End - Welcome Page
	*/
});
/**
* Functions - Start - Welcome Page
*/

// this function will populate the customer table in the page
function loadStoredCustomers() {
	getCustomers(true,function(customers){
		$('#customersTable tbody').html('');
		if(customers.length > 0) {
			$.each(customers, function(){
				var customer = this;
				
				$tr = $('<tr/>').attr('data-id',customer['id'])
					.append($('<td/>').css('width','30%').text(customer.first_name_1 + ' ' + customer.surname_1))
					.append($('<td/>').addClass('second').text(customer.home_address_1.replace('|',' ')))
					.append($('<td/>').css('width','20%')
						.append(
							$('<a/>').addClass('btn btn-primary continue-draft btn-block').attr({'href':'javascript://','data-id':customer['id']}).text('Continue ').append($('<i class="fa fa-arrow-right"></i>'))
						)
						.append(
							$("<div/>").addClass('clearfix visible-xs').css({'height': '10px'})
						)
						.append(
							$('<a/>').addClass('btn btn-danger delete-draft btn-block').attr({'href':'javascript://','data-id':customer['id']}).text(' Delete').prepend($('<i class="fa fa-times"></i>'))
						)
					);
				$('#customersTable').append($tr);
			});
			$('#customersTableDiv').removeClass('hidden');
			hideLoader() /* from util.js*/;
		} else {
			hideLoader() /* from util.js*/;
		}
	})/* from database.js*/;
	getCustomers(false,function(customers){
		$('#customersFinishedTable tbody').html('');
		if(customers.length > 0) {
			$.each(customers, function(){
				var customer = this;
				$tr = $('<tr/>').attr('data-id',customer['id'])
					.append($('<td/>').css('width','30%').text(customer.first_name_1 + ' ' + customer.surname_1))
					.append($('<td/>').text(customer.home_address_1.replace('|',' ')))
					.append($('<td/>').css('width','20%')
						.append(
							$('<a/>').addClass('btn btn-primary continue-payment btn-block').attr({'href':'javascript://','data-id':customer['id']}).text(' Process Payment ').prepend($('<i class="fa fa-cc"></i>'))
						)
						.append(
							$("<div/>").addClass('clearfix visible-xs').css({'height': '10px'})
						)
						.append(
							$('<a/>').addClass('btn btn-primary upload-sale btn-block').attr({'href':'javascript://','data-id':customer['id']}).text(' Upload Sale').prepend($('<i class="fa fa-upload"></i>'))
						)
						
					);
				$('#customersFinishedTable').append($tr);
			});
			$('#customersFinishedTableDiv').removeClass('hidden');
			hideLoader() /* from util.js*/;
		} else {
			hideLoader() /* from util.js*/;
		}
	})/* from database.js*/;
	hideLoader() /* from util.js*/;
}

/**
* Functions - End - Welcome Page
*/