/**
	* Events - Start - Sale Page
	*/
var sfw;
var $sigdiv;
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
	sfw = $("#wizard_example").stepFormWizard({
		height: 'auto',
		theme:'circle',
		transition:'none',
		nextBtn:$('<a class="next-btn sf-right sf-btn btn btn-primary" href="#">NEXT <i class="fa fa-arrow-right"></i> </a>'),
		prevBtn:$('<a class="prev-btn sf-left sf-btn  btn btn-primary" href="#"><i class="fa fa-arrow-left"></i> PREV</a>'),
		onNext: function(from, data) {
			if(from == 0) {
				;
			}
		},
		onSlideChanged : function(to, data) {
			
			if (to == 3) // for signature div
			{
				if(i == 0) {
					addSignaturePlugin(sfw);
					i++;
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
		// form services page to terms page
		if(from == 1 && to == 2) {
			// this function will handle saving customer data to the localdb	
			handleServiceData(e)/* from sale-services.js*/;
			
		}
		// from terms page to signature page
		if(from == 2 && to == 3) {
			checkTermsAcceptance(e)/* from sale-terms.js*/;	
		}
		// from signature page to photo page
		if(from == 3 && to == 4) {
			checkSignature(e)/* from sale-signature.js*/;	
			if($('#ownership').val() == 2) {
				$('#secondPhoto').removeClass('hidden');
			}
		}
		//e.preventDefault(); // this you have to call if you need to interrupt transition to next step
	});
}