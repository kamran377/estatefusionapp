var formVld;
var VAT = 20;
function attachSellerEvents() {
	// event for softkeyboard
	$('#percValue, #percAmount, #fixedPrice').on('focus',function(){
		var $field = $(this);
		pageHeight = $('#salePage').height();
		pageHeight = pageHeight + 150;
		$('#salePage').css({'height':pageHeight+'px'});
		$('html, body').animate({
			scrollTop: $field.offset().top
		}, 2000);
	});
	$('#percValue, #percAmount, #fixedPrice').on('blur',function(){
		var $field = $(this);
		pageHeight = $('#salePage').height();
		pageHeight = pageHeight - 150;
		$('#salePage').css({'height':pageHeight+'px'});
		$('html, body').animate({
			scrollTop: $('#price').offset().top
		}, 2000);
	});
	$('#firstName, #surname,#firstName2, #surname2').upperFirstAll()
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
		;
		if($(this).prop('checked')) {
			$('#percValue').prop('readonly',false);
			$('#fixed-price-check').prop('checked',false);
			$('#fixedPrice').prop('readonly',true);
			$('#fixedPrice').val('')
		} else {
			$('#percValue').prop('readonly',true);
			$('#percValue').val('');
			$('#percAmount').val('');
		}
		
	});
	// the event for checking the percentage checkbox
	$('#fixed-price-check').on('change',function(){
		
		if($(this).prop('checked')) {
			$('#fixedPrice').prop('readonly',false);
			$('#perc-price-check').prop('checked',false);
			$('#percValue').prop('readonly',true);
			$('#percValue').val('');
			$('#percAmount').val('');
		} else {
			$('#fixedPrice').prop('readonly',true);
			$('#fixedPrice').val('');
		}
	});
	// the event to show relevant twon as per selected county
	$('#homeCountry').on('change',function(){
		var value = $(this).val();
		$("#homeTown option:not([data-region='"+ value +"'])").hide();
		
		$("#homeTown option[data-region='"+ value +"']").show();
	});
	$('#propertyCountry').on('change',function(){
		var value = $(this).val();
		$("#propertyCountry option:not([data-region='"+ value +"'])").hide();
		
		$("#propertyCountry option[data-region='"+ value +"']").show();
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
			var newprice = (value / 100) * price;
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
			
			'primaryEmail' : {
				email:true,
				required:true
			},
			'secondaryEmail' : {
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
				required :  function(){return $('#fixed-price-check').prop('checked');},
				number:true
			},
			'percValue': {
				required :  function(){return $('#perc-price-check').prop('checked');},
				number:true
			},
		},
		highlight: function(element, errorClass) {
			sfw.refresh();
		},
		unhighlight: function(element, errorClass) {
			sfw.refresh();
		}
	});
	addDropdownOptions();
}
function addDropdownOptions() {
	getRegions(function(regions){ /* from database.js */
		// if we have regions in the local database
		if(regions && regions.length) {
			var str = "<option value=''>Select County</option>";
			$.each(regions, function(){
				var region = this;
				str += "<option value='" + region['id'] + "'>" + region['name'] + "</option>";
			});
			$('#homeCountry').html($(str));
			$('#propertyCountry').html($(str));
		}
		getTowns(function(towns){ /* from database.js */
			// if we have regions in the local database
			if(towns && towns.length) {
				var str = "<option value=''>Select Town</option>";
				$.each(towns, function(){
					var town = this;
					str += "<option data-region='" + town['region_id'] + "' value='" + town['id'] + "'>" + town['name'] + "</option>";
				});
				$('#homeTown').html($(str));
				$('#propertyTown').html($(str));
			}
		});
	});
}
// this function will handle saving customer data to the localdb
function handleCustomerData(e) {
	//alert(1);
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
		//alert($('#default-bundle-check').prop('checked'));
		if($('#default-bundle-check').prop('checked')){
			$.each($('#services-table thead tr th'),function(){
				$th = $(this);
				var def = $th.attr('data-default');
				
				if(def == 'false') {
					var index = $('#services-table thead tr th').index($th);
					index = index + 1;
					$th.hide();
					$('#services-table tbody tr td:nth-child('+ index +')').hide();
				}
				else if(def == true)
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
		//in this part we will update the services page based on the data for customer if present
		if(draftCustomer) {
			// get bundle id
			var bundle_id = draftBundle['bundle_id'];
			// get bundle header selected by teh draft customer
			var $th;
			$.each($('#services-table thead tr th'),function(){
				if($(this).attr('data-bundle-id') == bundle_id) {
					$th = $(this);
				}
			});
			// select the bundle for the draft customer
			$('input[type=checkbox]',$th).click();
			// get the highlighted th class
			var thClass = $th.attr('data-class');
			// get the index of the selected header for next lines
			var index = $('#services-table thead tr th.bundle').index($th);
			// now we will iterate over the purchased services to check their respective checkboxes
			$.each(draftServices,function(){
				var service = this;
				$tds = $('#services-table tr td input[data-service-id='+service['service_id']+'][data-bundle-id='+service['bundle_id']+']');
				// for bundle services
				if($tds.length == 1) {
					$tds.click();
				} else { // for option services
					var td = $tds.eq(index-1);//.prop('checked',true);
					$(td).click();
				}
			});
			// now we will select the discount opted by the drat customer
			console.log(thClass);
			
			var $discountTD = $('#services-table tr td.discount-'+ thClass +'[data-percentage="'+draftBundle['discount']+'"]');
			console.log($discountTD.length);
			$('input',$discountTD).click();
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
function getFirstCustomerName() {
	return $('#firstName').val() + ' ' + $('#surname').val();
}
function getSecondCustomerName() {
	return $('#firstName2').val() + ' ' + $('#surname2').val();
}
function getOwners() {
	return $('#ownership').val();
}			