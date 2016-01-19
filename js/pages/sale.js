/**
	* Events - Start - Sale Page
	*/
$(document).on("pageshow","#salePage",function() {
	// show loading spinner to load data from server
	showLoader(/* from utils.js */);
	// attach and call methods for seller details page
	attachSellerEvents();
	// attach and call methods for service step
	attachServicesEvents();
	
	//$sigdiv.css({'height':'300px'});
	
});
/**
* Events - End - Sale Page
*/
function applyWizard() {
	// show loading spinner to load data from server
	hideLoader(/* from utils.js*/);
	$('#saleContent').show();
	var i = 0;
	var sfw = $("#wizard_example").stepFormWizard({
		height: 'auto',
		theme:'circle',
		transition:'slide',
		onNext: function(from, data) {
			if(from == 0) {
				;
			}
		},
		onSlideChanged : function(to, data) {
			
			if (to == 3) // for signature div
			{
				if(i == 0) {
					var $sigdiv = $("#signature");
					$sigdiv.jSignature();
					i++;
					sfw.refresh();
				}
			}
			if(to == 2) {
				handleTermsPage(sfw);
			}
		}
	});
	$("#wizard_example").on('sf-step-before', function(e, from, to, data) {
		if(from == 0) {
			
			// this function will handle saving customer data to the localdb
			handleCustomerData(e,sfw)/* from sale-seller.js*/;
			sfw.refresh();
		}
		if(from == 1) {
			// this function will handle saving customer data to the localdb	
			handleServiceData(e)/* from sale-services.js*/;
			
		}
		//e.preventDefault(); // this you have to call if you need to interrupt transition to next step
	});
}