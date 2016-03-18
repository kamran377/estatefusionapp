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
	// attach card event to card
	applyCardEvent();
});
/**
* Events - End - Sale Page
*/
function applyCardEvent() {
	$('.form-container').card({
		// a selector or DOM element for the container
		// where you want the card to appear
		container: '.card-wrapper', // *required*

		// all of the other options from above
	});
	  $("#ccexp").mask("99/99",{placeholder:"MM/YY"});
}

function applyWizard() {
	// show loading spinner to load data from server
	hideLoader(/* from utils.js*/);
	$('#saleContent').show();
	var i = 0;
	sfw = $("#wizard_example").stepFormWizard({
		height: 'auto',
		theme:'circle',
		transition:'none',
		//startStep: 4,
		nextBtn:$('<a class="next-btn sf-right sf-btn btn btn-primary" href="#">NEXT <i class="fa fa-arrow-right"></i> </a>'),
		prevBtn:$('<a class="prev-btn sf-left sf-btn  btn btn-primary" href="#"><i class="fa fa-arrow-left"></i> PREV</a>'),
		finishBtn:$('<a class="finish-btn sf-right sf-btn  btn btn-primary" href="#"><i class="fa fa-stop"></i> FINISH</a>'),
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
			sfw.refresh();
		}
		if(from == 4 && to == 3) {
			sfw.refresh();
		}
		// from photo page to payment page
		if(from == 4 && to == 5) {
			handlePhotoPage(e) /* from sale-photo.js */;
			if(isDeviceOnline() == true) {
				var payable = getPayableObject() /* from sale-service.js*/;
				$('#totalPaymentCheckout').html('Total Payment Due: &pound;' + payable.payNow);
			} else {
				//sfw.activeStep(6);
				sfw.disableStep(5);
				sfw.removeAnimating();
				var res = sfw.goTo(6);
				e.preventDefault();
				
			}
		}
		// from payment to finish page
		if(from == 5 && to == 6) {
			$('#saveLocalCustomer').addClass('hidden');
			$('#uploadCustomer').removeClass('hidden');
		}
		//e.preventDefault(); // this you have to call if you need to interrupt transition to next step
	});
}
function gotoFinalStep() {
	// this will show the final step
	sfw.goTo(6);
}