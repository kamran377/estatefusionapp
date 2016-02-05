var formVld;
var VAT = 20;
function attachSellerEvents() {
	// event for change in price
	$('#price').on('change',function(){
		// get the new price
		var price = $('#price').val();
		// check if percentage fee is selected
		// as only percentage fee is dependent on asking price
		if($('#perc-price-check').prop('checked')) {
			// get the percentage fee value
			var value = $('#percValue').val();
			//if price is non zero
			if(price) {
				price = parseFloat(price);
			} else { // set the price to zero
				price = 0;
			}
			// calculate the new percentage of price
			var newprice = (value / 100) * price
			// round of new price to two decimals
			newprice = newprice.toFixed(2);
			// set the value as it is
			$('#percAmount').val(newprice);
			
		}
	});
	
	
	// event for agency type select
	$('#agencyType').on('change',function(){
		if($(this).val() == 3) {
			$('#agencyName').prop('disabled',false);
		} else {
			$('#agencyName').prop('disabled',true);
		}
	});
	// event for ownership select
	$('#ownership').on('change',function(){
		var value = $(this).val();
		if(value == 2) {
			$('#secondOwner').removeClass('hidden');
		} else {
			$('#secondOwner').addClass('hidden');
		}
	});
	// event for same address checkbox
	$('#checkbox-same-address').on('change',function(){
		if($(this).prop('checked')) {
			// copy the home address to property address
			$('#propertyAddress').val($('#homeAddress').val());
			// copy the home line 1 to property line 1
			$('#propertyLine1').val($('#homeLine1').val());
			// copy the home line 2 to property line 2
			$('#propertyLine2').val($('#homeLine2').val());
			// copy the home line 3 to property line 3
			$('#propertyLine3').val($('#homeLine3').val());
			// copy the home town to property town
			$('#propertyTown').val($('#homeTown').val());
			// copy the home country to property country
			$('#propertyCountry').val($('#homeCountry').val());
			// copy the home post code to property town
			$('#propertyCode').val($('#homeCode').val());
			if (!$.isEmptyObject(formVld.submitted)) {
				formVld.form();
			}
		} 
	});
	// the event for checking the percentage checkbox
	$('#perc-price-check').on('change',function(){
		$('#fixed-price-check').prop('checked',false);
		$('#fixedPrice').prop('readonly',true);
		$('#fixedPrice').val('');
		if($(this).prop('checked')) {
			$('#percValue').prop('readonly',false);
		} else {
			$('#percValue').prop('readonly',true);
			$('#percValue').val('');
			$('#percAmount').val('');
		}
		
	});
	// the event for checking the percentage checkbox
	$('#fixed-price-check').on('change',function(){
		$('#perc-price-check').prop('checked',false);
		if($(this).prop('checked')) {
			$('#fixedPrice').prop('readonly',false);
		} else {
			$('#fixedPrice').prop('readonly',true);
			$('#fixedPrice').val('');
		}
		$('#percValue').prop('readonly',true);
		$('#percValue').val('');
		$('#percAmount').val('');
		
	});
	// update the price
	$('#percValue').on('change',function(){
		var value = $(this).val();
		if(value) {
			value = parseFloat(value);
			var price = $('#price').val();
			if(price) {
				price = parseFloat(price);
			} else {
				price = 0;
			}
			var newprice = (value / 100) * price
			newprice = newprice.toFixed(2);
			$('#percAmount').val(newprice);
		}
	});
	// this will validate the form values
	formVld = $("#wizard_example").validate({
		rules : {
			'ownership' : {
				required :true,
			},
			'firstName' : {
				required : true
			},
			'surname' : {
				required : true
			},
			'firstName2' : {
				required : function(){return $('#ownership').val() == 2;}
			},
			'surname2' : {
				required : function(){return $('#ownership').val() == 2;}
			},
			'homeAddress' : {
				required : true
			},
			'homeTown' : {
				required : true
			},
			'homeCountry' : {
				required : true
			},
			'homeCode' : {
				required : true
			},
			'mobile' : {
				required : true
			},
			
			'emailPrimary' : {
				required : true,
				email:true
			},
			'emailSecondary' : {
				email:true
			},
			'propertyAddress' : {
				required : true
			},
			'propertyTown' : {
				required : true
			},
			'propertyCountry' : {
				required : true
			},
			'propertyCode' : {
				required : true
			},
			'propertyTenure' : {
				required : true
			},
			'term' : {
				required : true
			},
			'agencyType' : {
				required : true
			},
			'agencyName' : {
				required :  function(){return $('#agecnyType').val() == 3;}
			},
			'price' : {
				required : true,
				number:true
			},
			'fixedPrice' : {
				required :  function(){return $('#fixed-price-check').prop('checked');}
			},
			'percValue': {
				required :  function(){return $('#perc-price-check').prop('checked');}
			},
		},
		highlight: function(element, errorClass) {
			sfw.refresh();
		},
		unhighlight: function(element, errorClass) {
			sfw.refresh();
		}
	});
}
// this function will handle saving customer data to the localdb
function handleCustomerData(e) {
	if(!$("#wizard_example").valid()) {
		e.preventDefault();	
	} else {
		// we will insert/update customer record
		// we will update prices for the bundles 
		if($('#fixed-price-check').prop('checked')) {
			var value = $('#fixedPrice').val();
			updateBundlePrices(value);
		} else if($('#perc-price-check').prop('checked')) {
			var value = $('#percAmount').val();
			updateBundlePrices(value);
		}  else {
			updateBundlePrices();
		}
		if($('#default-bundle-check').prop('checked')){
			$.each($('#services-table thead tr th'),function(){
				$th = $(this);
				var def = $th.attr('data-default');
				
				if(def == 'false') {
					//console.log(def);
					var index = $('#services-table thead tr th').index($th);
					index = index + 1;
					//console.log(index);
					$th.hide();
					$('#services-table tbody tr td:nth-child('+ index +')').hide();
				}
				else
				{
					//$('input[type=checkbox]',$th).prop('checked',true);
					$('input[type=checkbox]',$th).click();
				}
			});
		} else {
			$.each($('#services-table thead tr th'),function(){
				$th = $(this);
				var index = $('#services-table thead tr th').index($th);
				index = index + 1;
				//console.log(index);
				$th.show();
				if($('input[type=checkbox]',$th).prop('checked')) { 
					$('input[type=checkbox]',$th).click();
				}
				$('#services-table tbody tr td:nth-child('+ index +')').show();
			});
		}
	}
}
function updateBundlePrices(price) {
	// if the user has selected fixed or percentage price checkboxes
	// we will have price that will be set
	if(price) {
		price = parseFloat(price);
		$tr = $('#services-table tr.sub-price-1');
		$tds = $('td',$tr);
		$.each($tds,function(){
			var $td = $(this);
			var def = $td.attr('data-default');
			var newprice = 0;
			
			if(def == true) {
				$('span',$td).text(price);
				$('#services-table thead tr th[data-default=true]').attr('data-bundle-price',price);
			} else {
				var discount = $td.attr('data-discount');
				discount = parseFloat(discount);
				newprice = price - (price * discount / 100);
				newprice = newprice.toFixed(2);
				$('span',$td).text(newprice);
				var index = $tds.index($td);
				index = index + 1;
				$('#services-table thead tr th:nth-child('+index+')').attr('data-bundle-price',newprice);
			}	
		});
	} else {
		// we have to fallback to original prices
		$.each($('#services-table thead tr th.bundle'),function(){
			var $th = $(this);
			$th.attr('data-bundle-price',$th.attr('data-original-price'))
			var index = $('#services-table thead tr th').index($th);
			index = index + 1;
			$('#services-table tr.sub-price-1 td:nth-child('+index+') span').text($th.attr('data-original-price'));
		});
	}
}
// this function will disable changes in price
function disablePriceChanges() {
	$('#percValue').prop('disabled',true);
	$('#perc-price-check').prop('disabled',true);
	$('#fixedPrice').prop('disabled',true);
	$('#fixed-price-check').prop('disabled',true);
}				