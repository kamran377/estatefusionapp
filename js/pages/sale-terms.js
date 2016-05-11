
// this function will handle showing terms and conditions to the user
function handleTermsPage(sfw) {
	getTerms(function(terms){
		
		var text = terms.terms;
		var propertyAddress = $('#propertyAddress').val();
		var sellerDetails = $('#firstName').val() + ' ' + $('#surname').val(); 
		if($('#firstName2').val()){
			sellerDetails += " / " + $('#firstName2').val() + ' ' + $('#surname2').val(); 
		}
		text = text.replace('{property_address}',propertyAddress);
		text = text.replace('{seller_details}',sellerDetails);
		text = text.replace('{price}',$('#price').val());
		text = text.replace('{tenure}',$('#propertyTenure option:selected').text());
		// get the bundle text 
		$th = $('#services-table thead tr th.highlighted');
		var bundleText = $('label', $th).text();
		// iterate over the free services
		bundleText += "<h3>Services Included:-</h3>";
		$('td.highlighted .service-checkbox-free').each(function(){
			var $check = $(this);	
			bundleText += '<p class="terms-service">' + $check.attr('data-name') + '</p>';
		});
		// iterate over the services purchased
		bundleText += "<h3>Services Purchased:-</h3>";
		$('td.highlighted .service-checkbox-paid:checked').each(function(){
			var $check = $(this);	
			bundleText += '<p class="terms-service">' + $check.attr('data-name') + '<span class="terms-price">&pound;'+  $check.attr('data-price')+'</span></p>';
		});
		// iterate over the options purchased
		var options = '';
		$('.option-checkbox:checked').each(function(){
			var $check = $(this);	
			options += '<p class="terms-service">' + $check.attr('data-name') + '<span class="terms-price">&pound;'+ $check.attr('data-price')  +'</span></p>';
		});
		
		//options = options.replace(/,\s*$/, "");
		var discount = '';
		$.each($('.discount-checkbox:checked'),function(){
			$tr = $(this).closest('tr');
			var stext = $('td.discountTitle',$tr).text();
			discount += stext;
			discount += '<p class="terms-service">'+ $(this).attr('data-info')+'</p>';
		});
		index = $('#services-table thead tr th').index($th);
		index = index + 1;
		text = text.replace('{bundle_name}', bundleText);
		text = text.replace('{options_name}',options);
		text = text.replace('{discount}',discount);
		
		var now = $('#services-table tbody tr.total-price-now td:nth-child('+index+') span').text();
		var later = $('#services-table tbody tr.total-price-later td:nth-child('+index+') span').text();
		var total = parseFloat(now) + parseFloat(later);
		total = total.toFixed(2);
		text = text.replace('{due-now}',now);
		text = text.replace('{due-later}',later);
		text = text.replace('{total}',total);
		var date = moment().format("DD/MM/YYYY");
		text = text.replace('{date}',date);
		$('#termsDiv').html(text);
		sfw.refresh();
	} /* from database.js*/);
	//setTimeout(function(){sfw.refresh();},1000);
}
function checkTermsAcceptance(e) {
	if(!$('#checkbox-term-condition').prop('checked')) {
		e.preventDefault();
	}
}

	