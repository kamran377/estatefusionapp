
// this function will handle showing terms and conditions to the user
function handleTermsPage(sfw) {
	var defaultBundle = $('#default-bundle-check').prop('checked') ? 'true' : 'false';
	
	getTerms(defaultBundle, function(termsData){
		var i = 1;
		console.log(termsData);
		$.each(termsData,function(){
			
			var terms = this;
			console.log(terms);
			var text = terms.terms;
			var propertyAddress = $('#propertyAddress').val();
			var sellerDetails = $('#firstName').val() + ' ' + $('#surname').val(); 
			if($('#firstName2').val()){
				sellerDetails += " / " + $('#firstName2').val() + ' ' + $('#surname2').val(); 
			}
			text = text.replace('{property_address}',propertyAddress);
			text = text.replace('{OwnerName}',sellerDetails);
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
			var serviceText = "";
			serviceText += "<h3>Services Purchased:-</h3>";
			$('td.highlighted .service-checkbox-paid:checked').each(function(){
				var $check = $(this);
				var $td	= $check.closest('td');
				if($td.attr('data-upfront') == 'false') {
					serviceText += '<p class="terms-service">' + $check.attr('data-name') + '<span class="terms-price">&pound;'+  $check.attr('data-price')+'</span></p>';
				}
			});
			// iterate over the services purchased
			serviceText += "<h3>Upfront Services Purchased:-</h3>";
			$('td.highlighted .service-checkbox-paid:checked').each(function(){
				var $check = $(this);
				var $td	= $check.closest('td');
				if($td.attr('data-upfront') == 'true') {
					serviceText += '<p class="terms-service">' + $check.attr('data-name') + '<span class="terms-price">&pound;'+  $check.attr('data-price')+'</span></p>';
				}
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
			
			text = text.replace('{BundleName}', bundleText);
			text = text.replace('{Services}', serviceText);
			text = text.replace('{Options}',options);
			text = text.replace('{DiscountName}',discount);
			
			var now = $('#services-table tbody tr.total-price-now td:nth-child('+index+') span').text();
			var later = $('#services-table tbody tr.total-price-later td:nth-child('+index+') span').text();
			var total = parseFloat(now) + parseFloat(later);
			total = total.toFixed(2);
			text = text.replace('{TotalPaidNow}',now);
			text = text.replace('{TotalPayOnSale}',later);
			text = text.replace('{TotalCost}',total);
			var date = moment().format("DD/MM/YYYY");
			text = text.replace('{Date}',date);
			
			$('#terms-' + i + " h3").html(terms.title);
			$('#terms-' + i + " p").html(text);
			i = i + 1;
		});
		
		
		sfw.refresh();
	} /* from database.js*/);
	//setTimeout(function(){sfw.refresh();},1000);
}
function checkTermsAcceptance(e) {
	if(!$('#checkbox-term-condition').prop('checked')) {
		e.preventDefault();
	}
}

	