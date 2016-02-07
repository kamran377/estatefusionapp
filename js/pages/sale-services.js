/**
* Functions - Start - Sale Page
*/
function attachServicesEvents() {
	// display the bundles data
	setTimeout(function(){displayBundlesData();},1000);
	/**
	* This section holds the event handlers for different elements on the page
	*/
	// change event for the bundle selection
	$(document).on('click','.header-checkbox',function(){
		// uncheck all other bundles
		$('.header-checkbox').not(this).prop('checked',false);
		$th = $(this).closest('th');
		// get index of column
		var index = $('#services-table thead tr th').index($th);
		// add 1 to overcome index start from 0 property
		index = index + 1;
		// get column class
		var cls ='first';
		if(index == 3) {
			cls = 'second';
		} else if(index == 4) {
			cls = 'third';
		}
		// uncheck all checkboxes
		$('#services-table td.highlighted input[type=checkbox]:not(:disabled)').prop('checked',false);
		// uncheck all option checkboxed
		$('#services-table td.options-col input[type=checkbox]').prop('checked',false);
		// uncheck all discount checkboxes
		$('#services-table input[type=checkbox].discount-checkbox').prop('checked',false);
		
		//remove highlighted from all columns
		$('#services-table th,td').removeClass('highlighted');
		// reset price columns
		$('#services-table tr.sub-price-1 td.first span').text($('#services-table th.first').attr('data-bundle-price'));
		$('#services-table tr.sub-price-1 td.second span').text($('#services-table th.second').attr('data-bundle-price'));
		$('#services-table tr.sub-price-1 td.third span').text($('#services-table th.third').attr('data-bundle-price'));
		// clear the total field if the bundle is unchecked
		clearTotal();
		// if current chekbox is checked
		if($(this).prop('checked')) {
			// add highlighted to currently selected column
			$('.' + cls).addClass('highlighted');
			// update price columns
			// update the grand total
			updateTotals(cls);
		} else {
			// clear the total field if the bundle is unchecked
			clearTotal();
		}
	});
	// change event for the service selection
	$(document).on('click','.service-checkbox',function(){
		$td = $(this).closest('td');
		// get the index of column
		var index = $('#services-table tbody tr td').index($td);
		// get the index of td in its row
		index = (index % 4) + 1;
		// get the row class
		var cls ='first';
		if(index == 3) {
			cls = 'second';
		} else if(index == 4) {
			cls = 'third';
		}
		if($td.hasClass('highlighted')) {
			// get the price
			var _price = $td.attr('data-price'); 
			// convert to int
			var price = getFloat(_price) /* from utils.js*/;
			// get the sub total
			var _subtotal = $('#services-table tr.sub-price-1 td.highlighted span').text();
			// convert it to int
			var subtotal = getFloat(_subtotal) /* from utils.js*/;
			if($(this).prop('checked')) {
				// get the new total
				var newtotal = price + subtotal;
			} else {
				// get the new total
				var newtotal = subtotal - price;
			}
			// update the sub total
			$('#services-table tr.sub-price-1 td.highlighted span').text(newtotal);
			// update the grand total
			updateTotals(cls);
		} else {
			// do nothing if the bundle is not selected
			return false;
		}
	});
	// change event for the options selection
	$(document).on('click','.option-checkbox',function(){
		// get closest column of checkbox
		$td = $(this).closest('td');
		// get the index of column
		var index = $('#services-table tbody tr td').index($td);
		// get the index of td in its row
		index = (index % 4) + 1;
		// get the row class
		var cls ='first';
		if(index == 3) {
			cls = 'second';
		} else if(index == 4) {
			cls = 'third';
		}
		// check if the bundle is selected
		if($('th.' + cls).hasClass('highlighted')) {
			// sub-total class
			var totalcls = "option-" + cls;
			// get the price
			var _price = $td.attr('data-price'); 
			// convert to int
			var price = getFloat(_price) /* from utils.js*/;
			// get the sub total
			var _subtotal = $('#services-table tr.sub-price-2 td.' + totalcls + ' span').text();
			// check if there is no sub total
			if(_subtotal == 'Sub Total') {
				_subtotal = 0;
			}
			// convert it to float
			var subtotal = getFloat(_subtotal) /* from utils.js*/;
			if($(this).prop('checked')) {
				// get the new total
				var newtotal = price + subtotal;
			} else {
				// get the new total
				var newtotal =  subtotal - price;
			}
			if(newtotal == 0) {
				newtotal = 'Sub Total';
			}
			// update the sub total
			$('#services-table tr.sub-price-2 td.'+ totalcls +' span').text(newtotal);
			// update the grand total
			updateTotals(cls);
		} else {
			return false;
		}
	});
	// change event for the options selection
	$(document).on('click','.discount-checkbox',function(){
		// get closest column of checkbox
		$td = $(this).closest('td');
		// get the index of column
		var index = $('#services-table tbody tr td').index($td);
		// get the index of td in its row
		index = (index % 4) + 1;
		// get the row class
		var cls ='first';
		if(index == 3) {
			cls = 'second';
		} else if(index == 4) {
			cls = 'third';
		}
		// check if the discount offer is selected
		if($('th.' + cls).hasClass('highlighted')) {
			// uncheck all discount checkboxes
			$('.discount-checkbox').not(this).prop('checked',false);
			var _percentage = $td.attr('data-percentage');
			// get double
			var percentage = getFloat(_percentage) /* from utils.js*/
			// get the grand total
			var _total = $('#services-table .vat-total-price span').text();
			if(_total == 'Total') {
				_total = 0;
			}
			// convert to double
			var total = getFloat(_total) /* from utils.js*/;
			// get the discount percentage
			var discount = total * ( percentage / 100);
			if( total > 0 ) {
				// get the discounted total
				var discountedTotal = total - discount;
				// get the pay now and later
				// get pay now
				var _now = $td.closest('tr').attr('data-now');
				var now = getFloat(_now) /* from utils.js*/;
				var payNow = discountedTotal * ( now / 100);
				// get pay later
				var payLater = discountedTotal - payNow;
				
				payNow = payNow.toFixed(2);
				payLater = payLater.toFixed(2);
				// update the pay now and later columns
				$('#services-table .total-price-now .total-now-' + cls + ' span').text(payNow);
				// update the pay now and later columns
				$('#services-table .total-price-later .total-later-' + cls + ' span').text(payLater);
				
			}
		} else {
			return false;
		}
	});
	// change event for the confirm selection
	$(document).on('click','.confirm-checkbox',function(){
		
		// get closest column of checkbox
		$td = $(this).closest('td');
		// get the index of column
		var index = $('#services-table tbody tr td').index($td);
		// get the index of td in its row
		index = (index % 4) + 1;
		// get the row class
		var cls ='first';
		if(index == 3) {
			cls = 'second';
		} else if(index == 4) {
			cls = 'third';
		}
		// check if the discount offer is selected
		if($('th.' + cls).hasClass('highlighted')) {
			// check if discount is selected 
			if($('.discount-checkbox:checked').length < 1) {
				return false;
			}
			var r = confirm('Are you sure you want to confirm this selection, it cannot be reversed');
			if(r == true) {
				$('#services-table input[type=checkbox]').prop('disabled',true);
				// disbale changes in price 
				disablePriceChanges() /* from sale-seller.js*/;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
	
	// change event for the save draft selection
	$(document).on('click','.draft-checkbox',function(){
		
		// get closest column of checkbox
		$td = $(this).closest('td');
		// get the index of column
		var index = $('#services-table tbody tr td').index($td);
		// get the index of td in its row
		index = (index % 4) + 1;
		// get the row class
		var cls ='first';
		if(index == 3) {
			cls = 'second';
		} else if(index == 4) {
			cls = 'third';
		}
		// check if the discount offer is selected
		if($('th.' + cls).hasClass('highlighted')) {
			// check if discount is selected 
			if($('.discount-checkbox:checked').length < 1) {
				return false;
			}
			//in this part we will delete the previous draft customer if present
			if(draftCustomer) {
				var id = draftCustomer['id'];
				deleteDraftCustomer(id, function(results){
				
				});
			}
			draftCustomer = null;
			draftProperty = null;
			draftBundle = null;
			draftServices = null;
			
			// save the customer draft data in local db
			saveCustomer(true,function(status){
				if(status == true) {
					alert('Customer details saved successfully in db');
					// take the agent back to welcome screen
					loadWelcomePage() /* from utils.js*/;
				}
			})/* from utils.js */;
			
			
		} else {
			return false;
		}
	});
}

// this function clears the total column 
function clearTotal() {
	// clear the grand total column
	$('#services-table .total-price  span').text('Total');
	// clear the options total
	$('#services-table .sub-price-2  span').text('Sub Total');
	// clear the pay now total
	$('#services-table .total-price-now  span').text('Total');
	// clear the pay later total
	$('#services-table .total-price-later  span').text('Total');
}
// this function updates the total based on subtotals 
function updateTotals(cls) {	
	// get the bundle sub total
	var _firstprice = $('#services-table .sub-price-1 .' + cls + ' span').text();
	// convert to double
	var firstprice = getFloat(_firstprice) /* from utils.js*/;
	
	// get the options sub total
	var _secondprice = $('#services-table .sub-price-2 .option-' + cls + ' span').text();
	if(_secondprice == 'Sub Total') {
		_secondprice = 0;
	}
	// convert it to float
	var secondprice = getFloat(_secondprice) /* from utils.js*/;
	// calculate final price
	var total = firstprice + secondprice;
	// update the total without VAT
	$('#services-table .total-price .total-' + cls + ' span').text(total);
	// calculate the VAT
	total  = getFloat(total) /* from utils.js*/;
	var vatTotal = total * VAT / 100;
	vatTotal = getFloat(vatTotal) /* from utils.js*/;
	
	// update the VAT column
	$('#services-table .vat-price span').text(vatTotal.toFixed(2));
	// calculate the grand total
	var grandTotal = total + vatTotal;
	grandTotal = getFloat(grandTotal) /* from utils.js*/;
	grandTotal = grandTotal.toFixed(2);
	// update the grand total column
	$('#services-table .vat-total-price span').text(grandTotal);
}
// this function will fetch services data from local db
// and display the data in the table
function displayBundlesData() {
	// the column index of the current bundle
	var colIndex = 2;
	/**
	* Display - Services Start
	*/
	// get all simple bundles
	getSimpleBundles(function(bundles){
		if(bundles.length > 0) {
			// load all services from local table
			// services for each bundle will be separated later
			getAllServices(function(services){
				var len = bundles.length ;
				// in this loop the services related to current bundle are extracted from the list of all services
				for(var i=0;i<len;i++) {
					var slen = 	services.length;
					var bundle = bundles[i];
					var bundleid = bundle['id'];
					var bundleservices = [];
					// class to applied to different columns
					var cls ='first';
					if(colIndex == 3) {
						cls = 'second';
					} else if(colIndex == 4) {
						cls = 'third';
					}
					
					//console.log(services);
					// get the services for the current bundle
					for(var j=0;j<slen;j++) {
						if(services[j]['bundle_id'] == bundleid) {
							bundleservices.push(services[j]);
						}
					}
					//console.log(bundleservices);
					// show table header
					var $headerCheck = $('<div class=" checkbox checkbox-success checkbox-circle"><input class="header-checkbox" id="checkbox-header'+i+'" type="checkbox"><label for="checkbox-header'+i+'">'+bundle['name']+'</label></div>');
					$('#services-table thead tr th:nth-child('+ colIndex +')').attr('data-default',bundle['default_bundle']).attr('data-original-price',bundle['price']).attr('data-bundle-price',bundle['price']).attr('data-bundle-id',bundle['id']).append($headerCheck);
					// display services in the first column
					var klen = 	bundleservices.length;
					//console.log(klen);
					for(var k=0;k<klen;k++) {
						var service = bundleservices[k];
						if(colIndex == 2) {
							// append all columns for all bundles in first loop
							// later bundles will only add their values
							$tr = $('<tr/>')
								.append($('<td/>')
									.addClass('tooltip1')
									.attr({'title':service['info']})
									.text(service['name']))
								.append($('<td/>'))
								.append($('<td/>'))
								.append($('<td/>'));
							// add row to the table
							$('#services-table tbody').append($tr);
							
						}
						$tr = $('#services-table tbody tr:nth-child('+ (k+1) +')');
						
						if(service.free == 'true') {
							var $serviceCheck = $('<div class="checkbox checkbox-success checkbox-circle"><input checked="checked" disabled="disabled" data-name="'+service['name']+'" class="service-checkbox service-checkbox-free" id="checkbox-service-'+colIndex+'-'+k+'" type="checkbox"><label for="checkbox-service-'+colIndex+'-'+k+'">&nbsp;</label></div>');
							$('td:nth-child(' + colIndex + ')', $tr).addClass(cls).append($serviceCheck);
						} else {
							var $serviceCheck = $('<div class="checkbox checkbox-success checkbox-circle"><input class="service-checkbox service-checkbox-paid" data-bundle-id="'+service['bundle_id']+'" data-service-id="'+service['id']+'" data-price="'+service['price']+'"  data-name="'+service['name']+'" id="checkbox-service-'+colIndex+'-'+k+'" type="checkbox"><label for="checkbox-service-'+colIndex+'-'+k+'">&pound;'+service['price']+'</label></div>');
							$('td:nth-child(' + colIndex + ')', $tr).attr('data-price',service['price']).addClass(cls).append($serviceCheck);	
						}	
					}
					// increment the colIndex for next bundle
					colIndex += 1;
				}
				// add the price row
				$tr = $('<tr/>').addClass('sub-price-1')
					.append($('<td/>').addClass('price')
						.text('Price'))
					.append($('<td/>').addClass('first').html('&pound; <span>Sub Total</span>'))
					.append($('<td/>').addClass('second').html('&pound; <span>Sub Total</span>'))
					.append($('<td/>').addClass('third').html('&pound; <span>Sub Total</span>'));
				$('#services-table tbody').append($tr);			
				// update prices 
				for(var i=0;i<len;i++) {
					$('td:nth-child(' + (i+2) + ')').attr('data-default',bundles[i]['default_bundle']);
					$('td:nth-child(' + (i+2) + ')').attr('data-discount',bundles[i]['discount']);
					
					$('td:nth-child(' + (i+2) + ') span',$tr).text(bundles[i]['price']);
				}
				/**
				* Display - Services End
				*/
				/**
				* Display - Options Start
				*/
				// get all options 
				getOptionsBundles(function(options){
					// we have only one option bundle for the tablet
					var option = options[0];
					var bundleid = option['id'];
					var bundleservices = [];
					//console.log(services);
					// get the services for the current bundle					
					for(var j=0;j<slen;j++) {
						if(services[j]['bundle_id'] == bundleid) {
							bundleservices.push(services[j]);
						}
					}
					//adding empty row
					$tr = $('<tr/>').addClass('')
						.append($('<td/>').addClass('')
							.text(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''));
					$('#services-table tbody').append($tr);
					//apply options header
					$tr = $('<tr/>').addClass('')
					.append($('<td/>').addClass('header')
						.text('Options'))
					.append($('<td/>').addClass('').html(''))
					.append($('<td/>').addClass('').html(''))
					.append($('<td/>').addClass('').html(''));
					$('#services-table tbody').append($tr);			
					
					// display the actual options now
					// display services in the first column
					var klen = 	bundleservices.length;
					// loop through the services
					for(var k=0;k<klen;k++) {
						var service = bundleservices[k];
						var $optionCheck1 = $('<div class="checkbox checkbox-success checkbox-circle"><input data-bundle-id="'+service['bundle_id']+'" data-service-id="'+service['id']+'" data-price="'+service['price']+'" data-name="'+service['name']+'" class="option-checkbox" id="checkbox-option-1'+k+'" type="checkbox"><label for="checkbox-option-1'+k+'">&pound;'+service['price']+'</label></div>');
						var $optionCheck2 = $('<div class="checkbox checkbox-success checkbox-circle"><input data-bundle-id="'+service['bundle_id']+'" data-service-id="'+service['id']+'" data-price="'+service['price']+'" data-name="'+service['name']+'" class="option-checkbox" id="checkbox-option-2'+k+'" type="checkbox"><label for="checkbox-option-2'+k+'">&pound;'+service['price']+'</label></div>');
						var $optionCheck3 = $('<div class="checkbox checkbox-success checkbox-circle"><input data-bundle-id="'+service['bundle_id']+'" data-service-id="'+service['id']+'" data-price="'+service['price']+'" data-name="'+service['name']+'" class="option-checkbox" id="checkbox-option-3'+k+'" type="checkbox"><label for="checkbox-option-3'+k+'">&pound;'+service['price']+'</label></div>');
							
						$tr = $('<tr/>').addClass('')
							.append($('<td/>').addClass('tooltip1 serviceTitle').attr('title',service['info'])
								.text(service['name']))
							.append($('<td/>').addClass('options-col').attr('data-price',service['price']).append($optionCheck1))
							.append($('<td/>').addClass('options-col').attr('data-price',service['price']).append($optionCheck2))
							.append($('<td/>').addClass('options-col').attr('data-price',service['price']).append($optionCheck3));
						$('#services-table tbody').append($tr);
					}
					// add the options sub total
					// add the price row
					$tr = $('<tr/>').addClass('sub-price-2')
						.append($('<td/>').addClass('price')
							.text('Options Price'))
						.append($('<td/>').addClass('option-first').html('&pound; <span>Sub Total</span>'))
						.append($('<td/>').addClass('option-second').html('&pound; <span>Sub Total</span>'))
						.append($('<td/>').addClass('option-third').html('&pound; <span>Sub Total</span>'));
					$('#services-table tbody').append($tr);	
					//adding empty row
					$tr = $('<tr/>').addClass('')
						.append($('<td/>').addClass('')
							.text(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''));
					$('#services-table tbody').append($tr);
					// add the total price
					$tr = $('<tr/>').addClass('total-price')
						.append($('<td/>').addClass('price')
							.text('Total Price'))
						.append($('<td/>').addClass('total-first').html('&pound; <span>Total</span>'))
						.append($('<td/>').addClass('total-second').html('&pound; <span>Total</span>'))
						.append($('<td/>').addClass('total-third').html('&pound; <span>Total</span>'));
					$('#services-table tbody').append($tr);
					//adding empty row
					$tr = $('<tr/>').addClass('')
						.append($('<td/>').addClass('')
							.text(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''));
					$('#services-table tbody').append($tr);
					// add the VAT price row
					$tr = $('<tr/>').addClass('vat-price')
						.append($('<td/>').addClass('price')
							.text('Total VAT @ 20%'))
						.append($('<td/>').attr('colspan',3).addClass('vat-price').html('&pound; <span>Total VAT</span>'));
					$('#services-table tbody').append($tr);
					//adding empty row
					$tr = $('<tr/>').addClass('')
						.append($('<td/>').addClass('')
							.text(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''));
					$('#services-table tbody').append($tr);
					// add the total including VAT row
					$tr = $('<tr/>').addClass('vat-total-price')
						.append($('<td/>').addClass('price')
							.text('Total Including VAT'))
						.append($('<td/>').attr('colspan',3).addClass('vat-total-price').html('&pound; <span>Grand Total</span>'));
					$('#services-table tbody').append($tr);
					/**
					* Display - Options End
					*/
					/**
					* Display - Discounts Start
					*/
					//adding empty row
					$tr = $('<tr/>').addClass('')
						.append($('<td/>').addClass('')
							.text(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''))
						.append($('<td/>').html(''));
					$('#services-table tbody').append($tr);
					// add discount options header
					//apply discounts header
					$tr = $('<tr/>').addClass('')
					.append($('<td/>').addClass('header')
						.text('Discount Options'))
					.append($('<td/>').addClass('').html(''))
					.append($('<td/>').addClass('').html(''))
					.append($('<td/>').addClass('').html(''));
					$('#services-table tbody').append($tr);			
					
					getAllDiscounts(function(discounts){
						// get length of discount 
						var dlen = discounts.length;
						for(var p = 0; p < dlen; p++) {
							var discount = discounts[p];
							var $discountCheck1 = $('<div class="checkbox checkbox-success checkbox-circle"><input data-percentage="'+discount['percentage']+'" data-info="'+discount['info']+'" class="discount-checkbox" id="checkbox-discount-1'+p+'" type="checkbox"><label for="checkbox-discount-1'+p+'">'+discount['percentage']+' %</label></div>');
							var $discountCheck2 = $('<div class="checkbox checkbox-success checkbox-circle"><input data-percentage="'+discount['percentage']+'" data-info="'+discount['info']+'" class="discount-checkbox" id="checkbox-discount-2'+p+'" type="checkbox"><label for="checkbox-discount-2'+p+'">'+discount['percentage']+' %</label></div>');
							var $discountCheck3 = $('<div class="checkbox checkbox-success checkbox-circle"><input data-percentage="'+discount['percentage']+'" data-info="'+discount['info']+'" class="discount-checkbox" id="checkbox-discount-3'+p+'" type="checkbox"><label for="checkbox-discount-3'+p+'">'+discount['percentage']+' %</label></div>');
								
							$tr = $('<tr/>').addClass('').attr({'data-now':discount['now'],'data-later':discount['later']})
								.append($('<td/>').addClass('tooltip1 discountTitle').attr('title',discount['info'])
									.text(discount['name']))
								.append($('<td/>').addClass('discounts-col').attr('data-percentage',discount['percentage']).append($discountCheck1))
								.append($('<td/>').addClass('discounts-col').attr('data-percentage',discount['percentage']).append($discountCheck2))
								.append($('<td/>').addClass('discounts-col').attr('data-percentage',discount['percentage']).append($discountCheck3));
							$('#services-table tbody').append($tr);
						}
						//adding empty row
						$tr = $('<tr/>').addClass('')
							.append($('<td/>').addClass('')
								.text(''))
							.append($('<td/>').html(''))
							.append($('<td/>').html(''))
							.append($('<td/>').html(''));
						$('#services-table tbody').append($tr);
						// add the total due now
						$tr = $('<tr/>').addClass('total-price-now')
							.append($('<td/>').addClass('price')
								.text('Total Due Now'))
							.append($('<td/>').addClass('total-now-first').html('&pound; <span>Total</span>'))
							.append($('<td/>').addClass('total-now-second').html('&pound; <span>Total</span>'))
							.append($('<td/>').addClass('total-now-third').html('&pound; <span>Total</span>'));
						$('#services-table tbody').append($tr);
						// add the total due later
						$tr = $('<tr/>').addClass('total-price-later')
							.append($('<td/>').addClass('price')
								.text('Total Due On Sale'))
							.append($('<td/>').addClass('total-later-first').html('&pound; <span>Total</span>'))
							.append($('<td/>').addClass('total-later-second').html('&pound; <span>Total</span>'))
							.append($('<td/>').addClass('total-later-third').html('&pound; <span>Total</span>'));
						$('#services-table tbody').append($tr);
						// add the confirm checkbox now
						var $confirmCheck1 = $('<div class="checkbox checkbox-success checkbox-circle"><input class="confirm-checkbox" id="checkbox-confirm-1" type="checkbox"><label for="checkbox-confirm-1">Confirm</label></div>');
						var $confirmCheck2 = $('<div class="checkbox checkbox-success checkbox-circle"><input class="confirm-checkbox" id="checkbox-confirm-2" type="checkbox"><label for="checkbox-confirm-2">Confirm</label></div>');
						var $confirmCheck3 = $('<div class="checkbox checkbox-success checkbox-circle"><input class="confirm-checkbox" id="checkbox-confirm-3" type="checkbox"><label for="checkbox-confirm-3">Confirm</label></div>');
						$tr = $('<tr/>').addClass('confirm-row')
							.append($('<td/>').addClass('')
								.text('Confirm Selection'))
							.append($('<td/>').addClass('confirm-first').append($confirmCheck1))
							.append($('<td/>').addClass('confirm-second').append($confirmCheck2))
							.append($('<td/>').addClass('confirm-third').append($confirmCheck3));
						$('#services-table tbody').append($tr);	
						// add the draft checkbox now
						var $draftCheck1 = $('<div class="checkbox checkbox-success checkbox-circle"><input class="draft-checkbox" id="checkbox-draft-1" type="checkbox"><label for="checkbox-draft-1">Save Draft</label></div>');
						var $draftCheck2 = $('<div class="checkbox checkbox-success checkbox-circle"><input class="draft-checkbox" id="checkbox-draft-2" type="checkbox"><label for="checkbox-draft-2">Save Draft</label></div>');
						var $draftCheck3 = $('<div class="checkbox checkbox-success checkbox-circle"><input class="draft-checkbox" id="checkbox-draft-3" type="checkbox"><label for="checkbox-draft-3">Save Draft</label></div>');
						$tr = $('<tr/>').addClass('draft-row')
							.append($('<td/>').addClass('')
								.text('Save as Draft'))
							.append($('<td/>').addClass('draft-first').append($draftCheck1))
							.append($('<td/>').addClass('draft-second').append($draftCheck2))
							.append($('<td/>').addClass('draft-third').append($draftCheck3));
						$('#services-table tbody').append($tr);	
						
						// attach tooltip
						$('.tooltip1').tooltipster({'position':'right'});
						// show the content and apply form wizard
						applyWizard();
					})/* from database.js */;
					/**
					* Display - Discounts End
					*/
					
				})/* from database.js */;
				
			})/* from database.js */;
		}
	}) /* from database.js */;
}

function handleServiceData(e) {
	if(!$('.confirm-checkbox:checked').length){
		e.preventDefault();
	}
}

// this function will return the purchased bundle
function getPurchasedBundle() {
	$th = $('#services-table thead tr th.highlighted');
	return $th;
}
// this function will return payables object
function getPayableObject() {
	var $th = getPurchasedBundle();
	index = $('#services-table thead tr th').index($th);
	index = index + 1;
	var now = $('#services-table tbody tr.total-price-now td:nth-child('+index+') span').text();
	var later = $('#services-table tbody tr.total-price-later td:nth-child('+index+') span').text();
	var total = parseFloat(now) + parseFloat(later);
	total = total.toFixed(2);	
	return {
		'payNow':now,
		'payLater':later,
		'total':total
	};
}
// this function will return the services purchased in bundle
function getPurchasedServices() {
	return $('#services-table td.highlighted .service-checkbox-paid:checked');
}
// this function will return the options purchased
function getPurchasedOptions() {
	return $('#services-table .option-checkbox:checked');
}
// this function will return the discount selected
function getSelectedDiscount() {
	return $('#services-table .discount-checkbox:checked');
}
/**
* Functions - End - Sale Page
*/