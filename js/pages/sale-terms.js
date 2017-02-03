
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
			var propertyCounty = $('#propertyCountry option:selected').text();
			var propertyTown = $('#propertyTown option:selected').text();
			var propertyAddress = $('#propertyAddress').val() + ' ,' + propertyTown + ' ,' + propertyCounty;;
			
			var homeCounty = $('#homeCountry option:selected').text();
			var homeTown = $('#homeTown option:selected').text();
			var homeAddress = $('#homeAddress').val() + ' ,' + homeTown + ' ,' + homeCounty;;
			
			var ownerEmail = $('#primaryEmail').val();
			
			var feeType = $('#fixed-price-check').prop('checked') ? 'Fixed' : 'Percentage';
			
			var contractLength = $('#term option:selected').text();
			
			var agencyContract = $('#agencyType option:selected').text();
			
			var mobile = $('#mobile').val();
			//var date = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear();
			
			var sellerDetails = $('#firstName').val() + ' ' + $('#surname').val(); 
			if($('#firstName2').val()){
				sellerDetails += " / " + $('#firstName2').val() + ' ' + $('#surname2').val(); 
			}
			text = text.replaceAll('{property_address}',propertyAddress);
			text = text.replaceAll('{OwnerName}',sellerDetails);
			text = text.replaceAll('{price}',$('#price').val());
			text = text.replaceAll('{tenure}',$('#propertyTenure option:selected').text());
			text = text.replaceAll('{Signature}','');
			text = text.replaceAll('{OwnerAddress}', homeAddress);
			text = text.replaceAll('{OwnerEmail}', ownerEmail);
			text = text.replaceAll('{FeeType}', feeType);
			text = text.replaceAll('{ContractLength}', contractLength);
			text = text.replaceAll('{AgencyContract}', agencyContract);
			text = text.replaceAll('{OwnerPhone}', mobile);
			//text = text.replaceAll('{Date}', date);
			
			
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
			var discountDescription = '';
			$.each($('.discount-checkbox:checked'),function(){
				$tr = $(this).closest('tr');
				var stext = $('td.discountTitle',$tr).text();
				discount += stext;
				discountDescription = $(this).attr('data-info');
			});
			index = $('#services-table thead tr th').index($th);
			index = index + 1;
			
			text = text.replaceAll('{BundleName}', bundleText);
			text = text.replaceAll('{Services}', serviceText);
			text = text.replaceAll('{Options}',options);
			text = text.replaceAll('{DiscountName}',discount);
			text = text.replaceAll('{DiscountDescription}',discount);
			
			var now = $('#services-table tbody tr.total-price-now td:nth-child('+index+') span').text();
			var later = $('#services-table tbody tr.total-price-later td:nth-child('+index+') span').text();
			var discount = $('#services-table tbody tr.total-discount td:nth-child('+index+') span').text();
			var total = $('#services-table tbody tr.vat-total-price td.vat-total-price span').text();
			text = text.replaceAll('{TotalPaidNow}','&pound;' + now);
			text = text.replaceAll('{TotalPayOnSale}','&pound;' + later);
			text = text.replaceAll('{TotalCost}','&pound;' + total);
			text = text.replaceAll('{TotalDiscount}','&pound;' + discount);
			var date = moment().format("DD/MM/YYYY");
			//alert(date);
			text = text.replaceAll('{Date}',date);
			
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

	