 /**
	* Events - Start - Sale Page
	*/
var sfw;
var $sigdiv;
$(document).on("pageshow","#paymentPage",function() {
	// show loading spinner to load data from server
	showLoader(/* from utils.js */);
	// attach card event to card
	applyCardEventOther();
	//attachServicesEvents();
	applyWizardOther();
	$('#cccvcOther, #ccexpOther').on('focus',function(){
		var $field = $(this);
		pageHeight = $('#paymentPage').height();
		pageHeight = pageHeight + 150;
		$('#paymentPage').css({'height':pageHeight+'px'});
		$('html, body').animate({
			scrollTop: $field.offset().top
		}, 2000);
	});
	$('#cccvcOther, #ccexpOther').on('blur',function(){
		var $field = $(this);
		pageHeight = $('#paymentPage').height();
		pageHeight = pageHeight - 150;
		$('paymentPage').css({'height':pageHeight+'px'});
		$('html, body').animate({
			scrollTop: $('#ccnameOther').offset().top
		}, 2000);
	});
	$('#payNowOther').on('click',function(){
		if(checkDeviceOnline() == false){
			alert("There is some issue with network connection of this device");
			return;
		}
		var ccnumber = $('#ccnumberOther').val();
		var ccname = $('#ccnameOther').val();
		var ccexp = $('#ccexpOther').val();
		var cccvc = $('#cccvcOther').val();

		if(ccnumber && ccname && ccexp && cccvc) {
			$('#payNowOther').prop('disabled', true);
			$('#payNowOther i').removeClass('fa-cc').addClass('fa-circle-o-notch fa-spin');
			Stripe.card.createToken({
				cvc: $('#cccvcOther').val(),
				number: $('#ccnumberOther').val(),
				exp: $('#ccexpOther').val()
			}, stripeResponseHandlerOther);
		}
		
	});
	$('#uploadCustomerOther').on('click',function(){
		if(checkDeviceOnline() == false){
			alert("There is some issue with network connection of this device");
			return;
		}
		$('#uploadCustomerOther').prop('disabled', true);
		$('#uploadCustomerOther i').removeClass('fa-upload').addClass('fa-circle-o-notch fa-spin');
		makeCustomerObjectFromDB(function(Customer, Bundle, Services, CustomerPhotos ){
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
					$('#uploadCustomerOther').prop('disabled', false);
					$('#uploadCustomerOther i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-upload');
					
					var res = obj.result;
					if(res.status == 'success') {
						alert('Customer uploaded successfully');
						// take the agent back to welcome screen
						var custid = $('#otherCustomerID').val();
						deleteDraftCustomer(custid, function(){
							loadWelcomePage() /* from utils.js*/;
						});
						
					} else {
						alert(res.message);
					}	
				}) /* from ajax.js*/;
			})/* from database.js*/;	
		});	
	});
});
/**
* Events - End - Payment Page
*/
function applyCardEventOther() {
	$('.form-containerOther').card({
		// a selector or DOM element for the container
		// where you want the card to appear
		container: '.card-wrapperOther', // *required*

		// all of the other options from above
	});
	$("#ccexpOther").mask("99/99",{placeholder:"MM/YY"});
}
var sfwOther;
function applyWizardOther() {
	// show loading spinner to load data from server
	hideLoader(/* from utils.js*/);
	var i = 0;
	var payNow = $('#otherPaymentDue').val();
	payNow = getFloat(payNow);
	var startStep = 1;
	if (payNow > 0) {
		startStep = 0;
	}
	sfwOther = $("#wizard_exampleOther").stepFormWizard({
		height: 'auto',
		theme:'circle',
		transition:'none',
		startStep: startStep,
		nextBtn:$('<a class="next-btn sf-right sf-btn btn btn-primary hidden" href="#">NEXT <i class="fa fa-arrow-right"></i> </a>'),
		prevBtn:$('<a class="prev-btn sf-left sf-btn  btn btn-primary hidden" href="#"><i class="fa fa-arrow-left"></i> PREV</a>'),
		finishBtn:$('<a class="finish-btn sf-right sf-btn  btn btn-primary hidden" href="#"><i class="fa fa-stop"></i> FINISH</a>'),
		onNext: function(from, data) {
			if(from == 0) {
				
			}
		},
		onSlideChanged : function(to, data) {
			
		}
			
	});
	
	$("#wizard_exampleOther").on('sf-step-before', function(e, from, to, data) {
		sfwOther.refresh();
		// from payment to finish page
		if(from == 0 && to == 1) {
			if($('#paymentOtherFlag').val() == 'F') {
				e.preventDefault();
			}
		}
		//e.preventDefault(); // this you have to call if you need to interrupt transition to next step
	});
}
function stripeResponseHandlerOther(status, response) {
	var $form = $('#paymentFormOther');
	console.log(response);
	if (response.error) {
		// Show the errors on the form
		alert(response.error.message);
		$('#payNowOther').prop('disabled', false);
		$('#payNowOther i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-cc');
		
		//$form.find('button').prop('disabled', false);
	} else {
		// response contains id and card, which contains additional card details
		var token = response.id;
		getAccessToken(function(access_token){
			var payNow = $('#otherPaymentDue').val();
			var data = {
				'ccToken' : token,
				'amount':payNow
			};
			postRequest(PAYMENT_URL /* from settings.js */,data,access_token, function(obj){
				$('#payNowOther').prop('disabled', false);
				$('#payNowOther i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-cc');
				var res = obj.result;
				if(res.status == 'success') {
					alert('Payment received successfully');
					
					$('#paymentOtherFlag').val('T');
					gotoFinalStepOther()/* from sale.js*/;
				} else {
					alert(res.message);
				}	
			}) /* from ajax.js*/;
		});
		// Insert the token into the form so it gets submitted to the server
		//$form.append($('<input type="hidden" name="stripeToken" />').val(token));
		// and submit
		//$form.get(0).submit();
		//var data = 		
  }
}
function nopefunction(){
	getAccessToken(function(access_token){
			//var payable = getPayableObject() /* from sale-services.js*/;
			var payNow = $('#otherPaymentDue').val();
			var data = {
				'ccToken' : token,
				'amount':payNow
			};
			//alert(PAYMENT_URL);
			postRequest(PAYMENT_URL /* from settings.js */,data,access_token, function(obj){
				$('#payNowOther').prop('disabled', false);
				$('#payNowOther i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-cc');
				alert(obj.result);
				var res = obj.result;
				if(res.status == 'success') {
					alert('Payment received successfully');
					gotoFinalStepOther()/* from sale.js*/;
				} else {
					alert(res.message);
				}	
			}) /* from ajax.js*/;
		});
}
function gotoFinalStepOther() {
	// this will show the final step
	sfwOther.goTo(1);
}