$(document).on('ready',function(){
	
	// event for softkeyboard
	$('#cccvc, #ccexp').on('focus',function(){
		var $field = $(this);
		pageHeight = $('#salePage').height();
		pageHeight = pageHeight + 150;
		$('#salePage').css({'height':pageHeight+'px'});
		$('html, body').animate({
			scrollTop: $field.offset().top
		}, 2000);
	});
	$('#cccvc, #ccexp').on('blur',function(){
		var $field = $(this);
		pageHeight = $('#salePage').height();
		pageHeight = pageHeight - 150;
		$('#salePage').css({'height':pageHeight+'px'});
		$('html, body').animate({
			scrollTop: $('#ccname').offset().top
		}, 2000);
	});
	$('#payNow').on('click',function(){
		
				
		$('#payNow').prop('disabled', true);
		$('#payNow i').removeClass('fa-cc').addClass('fa-circle-o-notch fa-spin');
		Stripe.card.createToken({
			cvc: $('#cccvc').val(),
			number: $('#ccnumber').val(),
			exp: $('#ccexp').val()
		}, stripeResponseHandler);
		
	});
	$('#processLaterBtn').on('click',function(){
		gotoFinalStep()/* from sale.js*/;
	});
});
function stripeResponseHandler(status, response) {
	var $form = $('#paymentFrom');
	if (response.error) {
		// Show the errors on the form
		alert(response.error.message);
		$('#payNow').prop('disabled', false);
		$('#payNow i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-cc');
		
		//$form.find('button').prop('disabled', false);
	} else {
		// response contains id and card, which contains additional card details
		var token = response.id;
		// Insert the token into the form so it gets submitted to the server
		//$form.append($('<input type="hidden" name="stripeToken" />').val(token));
		// and submit
		//$form.get(0).submit();
		//var data = 
		getAccessToken(function(access_token){
			var payable = getPayableObject() /* from sale-services.js*/;
			var data = {
				'ccToken' : token,
				'amount':payable.payNow
				//amount:45
			};
			postRequest(PAYMENT_URL /* from settings.js */,data,access_token, function(obj){
				$('#payNow').prop('disabled', false);
				$('#payNow i').removeClass('fa-circle-o-notch fa-spin').addClass('fa-cc');
		
				var res = obj.result;
				if(res.status == 'success') {
					alert('Payment received successfully');
					$('#paymentFlag').val('T');
					gotoFinalStep()/* from sale.js*/;
				} else {
					alert(res.message);
					$('#processLaterBtn').remoceClass('hidden');
					$('#paymentFlag').val('I')
				}	
			}) /* from ajax.js*/;
		});
				
  }
}