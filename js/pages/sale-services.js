/**
* Functions - Start - Sale Page
*/
function attachServicesEvents() {
	// display the bundles data
	//setTimeout(function(){displayBundlesData();},1000);
	/**
	* This section holds the event handlers for different elements on the page
	*/
	var numberArray = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];
			
	// change event for the bundle selection
	$(document).on('click','.header-checkbox',function(){
		// uncheck all other bundles
		$('.header-checkbox').not(this).prop('checked',false);
		$th = $(this).closest('th');
		// get index of column
		var index = $('#services-table thead tr th').index($th);
		// we have the array as 0 based index, so we need to minus 1
		index = index - 1;
		// add 1 to overcome index start from 0 property
		//index = index + 1;
		// get column class
		var cls = numberArray[index];;
		// uncheck all checkboxes
		$('#services-table td.highlighted input[type=checkbox]:not(:disabled)').prop('checked',false);
		// uncheck all option checkboxed
		$('#services-table td.options-col input[type=checkbox]').prop('checked',false);
		// uncheck all discount checkboxes
		$('#services-table input[type=checkbox].discount-checkbox').prop('checked',false);
		
		//remove highlighted from all columns
		$('#services-table th,td').removeClass('highlighted');
		// reset price columns
		// check for total number of bundles
		var bundlesLength = $('#services-table thead tr th').length - 1;
		for (var t=0;t<bundlesLength; t++) {
			var clz = numberArray[t];
			$('#services-table tr.sub-price-1 td.'+ clz +' span').text($('#services-table th.'+ clz).attr('data-bundle-price'));
		}
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
		
		var cls = $td.attr('data-class');
		if($td.hasClass('highlighted')) {
			// get the price
			var _price = $td.attr('data-price'); 
			// convert to int
			var price = getFloat(_price) /* from utils.js*/;
			if($td.attr('data-upfront') == 'true') {
				// get the sub total
				var _subtotal = $('#services-table tr.upfront-price-subtotal td.highlighted  span').text();
				// check if there is no sub total
				if(_subtotal == 'Sub Total') {
					_subtotal = 0;
				}
				var subtotal = getFloat(_subtotal) /* from utils.js*/;
				if($(this).prop('checked')) {
					// get the new total
					var newtotal = price + subtotal;
				} else {
					// get the new total
					var newtotal = subtotal - price;
				}
				
				// update the sub total
				$('#services-table tr.upfront-price-subtotal td.highlighted  span').text(newtotal);
				// calculate VAT
				var vatTotal = newtotal * VAT / 100;
				vatTotal = getFloat(vatTotal) /* from utils.js*/;
				// update the VAT column
				$('#services-table tr.upfront-price-vat td.highlighted  span').text(vatTotal.toFixed(2));
				// calculate total
				var gTotal = newtotal + vatTotal;
				// update total column
				$('#services-table tr.upfront-price-total td.highlighted  span').text(gTotal.toFixed(2));
				
				// update the grand total
				updateTotals(cls);
			} else {
			
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
			}
		} else {
			// do nothing if the bundle is not selected
			return false;
		}
	});
	// change event for the options selection
	$(document).on('click','.option-checkbox',function(){
		
		// get closest column of checkbox
		$td = $(this).closest('td');
		// get the class of column
		var cls = $td.attr('data-class');
		
		// check if the bundle is selected
		if(cls && $('th.' + cls).hasClass('highlighted')) {
			// sub-total class
			var totalcls = "option-" + cls;
			// get the price
			var _price = $td.attr('data-price'); 
			// convert to int
			var price = getFloat(_price) /* from utils.js*/;
			
			//check if it is normal service or upfront service
			
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
		// get the class of column
		var cls = $td.attr('data-class');
		
		// check if the discount offer is selected
		if(cls && $('th.' + cls).hasClass('highlighted')) {
			// uncheck all discount checkboxes
			$('.discount-checkbox').not(this).prop('checked',false);
			
			updateTotals(cls);
		} else {
			return false;
		}
	});
	// change event for the confirm selection
	$(document).on('click','.confirm-checkbox',function(){
		
		// get closest column of checkbox
		$td = $(this).closest('td');
		// get the class of column
		var cls = $td.attr('data-class');
		
		// check if the discount offer is selected
		if(cls && $('th.' + cls).hasClass('highlighted')) {
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
		// get the class of column
		var cls = $td.attr('data-class');
		
		// check if the discount offer is selected
		if(cls && $('th.' + cls).hasClass('highlighted')) {
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
					//loadWelcomePage() /* from utils.js*/;
				}
			})/* from utils.js */;
			
			
		} else {
			return false;
		}
	});
	displayBundlesData();
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
	//  clear the VAT column
	$('#services-table .vat-price  span').text('Total VAT');
	//  clear the VAT column
	$('#services-table .vat-total-price  span').text('Grand Total');
	// clear the upfront services subtotal column
	$('#services-table .upfront-price-subtotal  span').text('Sub Total');
	// clear the upfront services vat column
	$('#services-table .upfront-price-vat  span').text('VAT');
	// clear the upfront services total column
	$('#services-table .upfront-price-total  span').text('Total');
	// clear the discount
	//$('#services-table .total-discount span').text('');
}
// this function updates the total based on subtotals 
function updateTotals(cls) {	
	// get the bundle sub total
	var _firstprice = $('#services-table .sub-price-1 .' + cls + ' span').text();
	// convert to double
	var firstprice = getFloat(_firstprice) /* from utils.js*/;
	
	// get the options sub total
	_secondprice = 0;
	if($('#services-table .sub-price-2 .option-' + cls + ' span').length) {
		var _secondprice = $('#services-table .sub-price-2 .option-' + cls + ' span').text();
		if(_secondprice == 'Sub Total') {
			_secondprice = 0;
		}
	}
	// convert it to float
	var secondprice = getFloat(_secondprice) /* from utils.js*/;
	// calculate final price
	var total = firstprice + secondprice;
	// update the total without VAT
	$('#services-table .total-price .total-' + cls + ' span').text(total);
	
	updatePayNow(cls);
}

function updatePayNow(cls) {
	// check if the discount offer is selected
	if(cls && $('th.' + cls).hasClass('highlighted')) {
		// uncheck all discount checkboxes
		
		var $check = $('.discount-checkbox:checked');
		if(!$check.length) {
			return false;
		}
		var $td = $check.closest('td');
		
		var _percentage = $td.attr('data-percentage');
		
		// get double
		var percentage = getFloat(_percentage) /* from utils.js*/
		
		// get the grand total
		var _total = $('#services-table .total-price .total-' + cls + ' span').text();
		if(_total == 'Total') {
			_total = 0;
		}
		
		
		// convert to double
		var total = getFloat(_total) /* from utils.js*/;
		// get the discount percentage
		var discount = total * ( percentage / 100);
		// update the discounts column
		$('#services-table .total-discount .total-discount-' + cls + ' span').text(discount.toFixed(2));
		// calculate the VAT
		
		if( total > 0 ) {
			// get the discounted total
			var discountedTotal = total - discount;
			
			var vatTotal = discountedTotal * VAT / 100;
			vatTotal = getFloat(vatTotal) /* from utils.js*/;
			
			// update the VAT column
			$('#services-table .vat-price span').text(vatTotal.toFixed(2));
			// calculate the grand total
			var grandTotal = discountedTotal + vatTotal;
			grandTotal = getFloat(grandTotal) /* from utils.js*/;
			grandTotal = grandTotal.toFixed(2);
			// update the grand total column
			$('#services-table .vat-total-price span').text(grandTotal);	
			
			// get the pay now and later
			// get pay now
			var _now = $td.closest('tr').attr('data-now');
			var now = getFloat(_now) /* from utils.js*/;
			var payNow = grandTotal * ( now / 100);
			// get pay later
			var payLater = grandTotal - payNow;
			
			
			// add upfront payment to payNow
			var upfrontTotal = $('#services-table tr.upfront-price-total td.highlighted  span').text();
			if(upfrontTotal == 'Total') {
				upfrontTotal = 0;
			}
			upfrontTotal = getFloat(upfrontTotal) /* from util.js */;
			var payNowTotal = payNow + upfrontTotal;
			
			payNow = payNowTotal.toFixed(2);
			payLater = payLater.toFixed(2);
			// update the pay now and later columns
			$('#services-table .total-price-now .total-now-' + cls + ' span').text(payNow);
			// update the pay now and later columns
			$('#services-table .total-price-later .total-later-' + cls + ' span').text(payLater);
		}
		
	} else {
		return false;
	}
}

// this function will fetch services data from local db
// and display the data in the table
function displayBundlesData() {
	// the column index of the current bundle
	var colIndex = 2;
	// empty the services table
	$('#services-table').html('');
	$('#services-table').append('<thead/>');
	$('#services-table thead').append(
		$('<tr/>')
			.append($("<th style='width:40%'>Description of Services</th>"))
			
	);
	$('#services-table').append('<tbody/>');
	/**
	* Display - Services Start
	*/
	// get all simple bundles
	getSimpleBundles(function(bundles){
		if(bundles.length > 0) {
			//add bundle headers
			var numberArray = ['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];
			var emptyColSpan = bundles.length + 1;
			for(var t = 0; t<bundles.length;t++) {
				$('#services-table thead tr').append($("<th data-class='" + numberArray[t] + "' class='bundle "+ numberArray[t] +"'></th>"));
			}			
			//console.log('Bundles Length ' + bundles.length);
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
					var allservices = [];
					// class to applied to different columns
					var cls = numberArray[i];
					// get the services for the current bundle
					for(var j=0;j<slen;j++) {
						//console.log(services[j]);
						if(services[j]['bundle_id'] == bundleid) {
							bundleservices.push(services[j]['id']);
						} else if(!services[j]['bundle_id']){
							if(!checkArrayItem(allservices,services[j]['id'])){
								console.log(services[j]['name'] + ' added in array');
								allservices.push(services[j]);
							} else {
								console.log(services[j]['name'] + 'already there');
							}
							
						}
					}
					// show table header
					var $headerCheck = $('<div class=" checkbox checkbox-success checkbox-circle"><input class="header-checkbox" id="checkbox-header'+i+'" type="checkbox"><label for="checkbox-header'+i+'">'+bundle['name']+'</label></div>');
					$('#services-table thead tr th:nth-child('+ colIndex +')').attr('data-default',bundle['default_bundle']).attr('data-original-price',bundle['price']).attr('data-bundle-price',bundle['price']).attr('data-bundle-id',bundle['id']).append($headerCheck);
					// display services in the first column
					var klen = 	allservices.length;
					//console.log(klen);
					for(var k=0;k<klen;k++) {
						var service = allservices[k];
						if(colIndex == 2) {
							// append all columns for all bundles in first loop
							// later bundles will only add their values
							var sname = service['name'];
							if(service['upfront'] === 'true') {
								sname += ' &mdash; <b class="text-danger">Upfront Cost</b>';
							}
							$tr = $('<tr/>')
								.append($('<td/>')
									.addClass('tooltip1')
									.attr({'title':service['info']})
									.html(sname));
							// add empty columns as per the number of bundles
							for(var t = 0; t<bundles.length;t++) {
								$tr.append($('<td/>').addClass(numberArray[t]).attr('data-class',numberArray[t]).attr('data-upfront',service['upfront']));
							}
							// add row to the table							
							$('#services-table tbody').append($tr);
							
						}
						$tr = $('#services-table tbody tr:nth-child('+ (k+1) +')');
						
						if(bundleservices.indexOf(service['id']) !== -1) {
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
						.text('Price'));
				
				$('#services-table tbody').append($tr);

				// add the price row
				
				
				for(var t = 0; t<bundles.length;t++) {
					$tr.append($('<td/>').addClass(numberArray[t]).html('&pound; <span>Sub Total</span>'));
				}
				// update prices 
				for(var i=0;i<len;i++) {
					$('td:nth-child(' + (i+2) + ')').attr('data-default',bundles[i]['default_bundle']);
					$('td:nth-child(' + (i+2) + ')').attr('data-discount',bundles[i]['discount']);
					
					$('td:nth-child(' + (i+2) + ') span',$tr).text(bundles[i]['price']);
				}
				
				$tr = $('<tr/>').addClass('')
						.append($('<td/>').attr('colspan',emptyColSpan).html(''));
				$('#services-table tbody').append($tr);
				
				$tr = $('<tr/>').addClass('upfront-price-subtotal')
					.append($('<td/>').addClass('price upfront-price')
						.text('Upfront Services Sub Price'));
						
				for(var t = 0; t<bundles.length;t++) {
					$tr.append($('<td/>').addClass(numberArray[t]).html('&pound;  <span>Sub Total</span>'));
				}
				
				$('#services-table tbody').append($tr);
				
				$tr = $('<tr/>').addClass('')
						.append($('<td/>').attr('colspan',emptyColSpan).html(''));
				$('#services-table tbody').append($tr);
				
				$tr = $('<tr/>').addClass('upfront-price-vat')
					.append($('<td/>').addClass('price')
						.text('Upfront Services VAT'));
						
				for(var t = 0; t<bundles.length;t++) {
					$tr.append($('<td/>').addClass(numberArray[t]).html('&pound;  <span>VAT</span>'));
				}
				
				$('#services-table tbody').append($tr);
				
				$tr = $('<tr/>').addClass('')
						.append($('<td/>').attr('colspan',emptyColSpan).html(''));
				$('#services-table tbody').append($tr);
				
				$tr = $('<tr/>').addClass('upfront-price-total')
					.append($('<td/>').addClass('price')
						.text('Upfront Services Total'));
						
				for(var t = 0; t<bundles.length;t++) {
					$tr.append($('<td/>').addClass(numberArray[t]).html('&pound;  <span>Total</span>'));
				}
				
				$('#services-table tbody').append($tr);
				
				/**
				* Display - Services End
				*/
				/**
				* Display - Options Start
				*/
				// get all options 
				getOptionsBundles(function(options){
					if(options && options.length) {
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
							.append($('<td/>').attr('colspan',emptyColSpan).html(''));
						$('#services-table tbody').append($tr);
						//apply options header
						$tr = $('<tr/>').addClass('')
						.append($('<td/>').addClass('header')
							.text('Options'))
						.append($('<td/>').attr('colspan', (emptyColSpan -1 )).addClass('').html(''));
						$('#services-table tbody').append($tr);			
						
						// display the actual options now
						// display services in the first column
						var klen = 	bundleservices.length;
						// loop through the services
						for(var k=0;k<klen;k++) {
							var service = bundleservices[k];
								
							$tr = $('<tr/>').addClass('')
								.append($('<td/>').addClass('tooltip1 serviceTitle').attr('title',service['info'])
									.text(service['name']));
							// add option columns as per the number of bundles
							for(var t = 0; t < bundles.length;t++) {
								$tr.append(
									$('<td/>').addClass('options-col').attr('data-class',numberArray[t]).attr('data-price',service['price']).append(
										$('<div class="checkbox checkbox-success checkbox-circle"><input data-bundle-id="'+service['bundle_id']+'" data-service-id="'+service['id']+'" data-price="'+service['price']+'" data-name="'+service['name']+'" class="option-checkbox" id="checkbox-option-'+(t+1)+k+'" type="checkbox"><label for="checkbox-option-'+(t+1)+k+'">&pound;'+service['price']+'</label></div>')
									)
								);
							}
							$('#services-table tbody').append($tr);
						}
						// add the options sub total
						// add the price row
						$tr = $('<tr/>').addClass('sub-price-2')
							.append($('<td/>').addClass('price')
								.text('Options Price'));
							
						for(var t = 0; t<bundles.length;t++) {
							$tr.append($('<td/>').addClass('option-' + numberArray[t]).html('&pound; <span>Sub Total</span>'));
						}
						$('#services-table tbody').append($tr);	
						
							
					}
					//adding empty row
					$tr = $('<tr/>').addClass('')
						.append($('<td/>').addClass('empty').attr('colspan',emptyColSpan).html(''));
					$('#services-table tbody').append($tr);
					// add the total price
					$tr = $('<tr/>').addClass('total-price')
						.append($('<td/>').addClass('price')
							.text('Total Price'));
						
						for(var t = 0; t<bundles.length;t++) {
							$tr.append($('<td/>').addClass('total-' + numberArray[t]).html('&pound; <span>Total</span>'));
						}
					$('#services-table tbody').append($tr);
					
					/**
					* Display - Options End
					*/
					/**
					* Display - Discounts Start
					*/
					//adding empty row
					$tr = $('<tr/>').addClass('')
						.append($('<td/>').attr('colspan',emptyColSpan).html(''));
					$('#services-table tbody').append($tr);
					// add discount options header
					//apply discounts header
					$tr = $('<tr/>').addClass('')
					.append($('<td/>').addClass('header')
						.text('Discount Options'))
					.append($('<td/>').addClass('').attr('colspan',(emptyColSpan - 1)).html(''));
					$('#services-table tbody').append($tr);		
					getAllDiscounts(function(discounts){
						// get length of discount 
						var dlen = discounts.length;
						for(var p = 0; p < dlen; p++) {
							var discount = discounts[p];
								
							$tr = $('<tr/>').addClass('').attr({'data-now':discount['now'],'data-later':discount['later']})
								.append($('<td/>').addClass('tooltip1 discountTitle').attr('title',discount['info'])
									.text(discount['name']));
									
							for(var t = 0; t<bundles.length;t++) {
								$tr.append(
									$('<td/>').attr('data-class',numberArray[t]).addClass('discount-col discount-'+numberArray[t]).attr('data-percentage',discount['percentage']).append(
										$('<div class="checkbox checkbox-success checkbox-circle"><input data-percentage="'+discount['percentage']+'" data-info="'+discount['info']+'" class="discount-checkbox" id="checkbox-discount-'+(t+1)+p+'" type="checkbox"><label for="checkbox-discount-'+(t+1)+p+'">'+discount['percentage']+' %</label></div>')
									)
								);
							}
							$('#services-table tbody').append($tr);
						}
						//adding empty row
						$tr = $('<tr/>').addClass('')
							.append($('<td/>').attr('colspan',emptyColSpan).html(''));
						$('#services-table tbody').append($tr);
						// add the discount
						$tr = $('<tr/>').addClass('total-discount')
							.append($('<td/>').addClass('price')
								.text('Discount'));
							
						for(var t = 0; t<bundles.length;t++) {
							$tr.append($('<td/>').addClass('total-discount-' + numberArray[t]).html('&pound; <span></span>'));
						}
						$('#services-table tbody').append($tr);
						//adding empty row
						$tr = $('<tr/>').addClass('')
							.append($('<td/>').attr('colspan',emptyColSpan).html(''));
						$('#services-table tbody').append($tr);
						// add the VAT price row
						$tr = $('<tr/>').addClass('vat-price')
							.append($('<td/>').addClass('price')
								.text('Total VAT @ 20%'))
							.append($('<td/>').attr('colspan',(emptyColSpan -1 )).addClass('vat-price').html('&pound; <span>Total VAT</span>'));
						$('#services-table tbody').append($tr);
						//adding empty row
						$tr = $('<tr/>').addClass('')
							.append($('<td/>').attr('colspan',emptyColSpan).html(''));
						$('#services-table tbody').append($tr);
						// add the total including VAT row
						$tr = $('<tr/>').addClass('vat-total-price')
							.append($('<td/>').addClass('price')
								.text('Total Including VAT'))
							.append($('<td/>').attr('colspan',(emptyColSpan - 1)).addClass('vat-total-price').html('&pound; <span>Grand Total</span>'));
						$('#services-table tbody').append($tr);
						//adding empty row
						$tr = $('<tr/>').addClass('')
							.append($('<td/>').attr('colspan',emptyColSpan).html(''));
						$('#services-table tbody').append($tr);
						
						// add the total due now
						$tr = $('<tr/>').addClass('total-price-now')
							.append($('<td/>').addClass('price')
								.text('Total Due Now'));
							
						for(var t = 0; t<bundles.length;t++) {
							$tr.append($('<td/>').addClass('total-now-' + numberArray[t]).html('&pound; <span>Total</span>'));
						}
						$('#services-table tbody').append($tr);
						// add the total due later
						$tr = $('<tr/>').addClass('total-price-later')
							.append($('<td/>').addClass('price')
								.text('Total Due On Sale'));
						for(var t = 0; t<bundles.length;t++) {
							$tr.append($('<td/>').addClass('total-later-' + numberArray[t]).html('&pound; <span>Total</span>'));
						}
						$('#services-table tbody').append($tr);
						// add the confirm checkbox now
						$tr = $('<tr/>').addClass('confirm-row')
							.append($('<td/>').addClass('')
								.text('Confirm Selection'));
							
						for(var t = 0; t<bundles.length;t++) {
							$tr.append($('<td/>').attr('data-class',numberArray[t]).addClass('confirm-td confirm-first').append(
								$('<div class="checkbox checkbox-success checkbox-circle"><input class="confirm-checkbox" id="checkbox-confirm-'+(t+1)+'" type="checkbox"><label for="checkbox-confirm-'+(t+1)+'">Confirm</label></div>')
							));
						}
						$('#services-table tbody').append($tr);	
						// add the draft checkbox now
						$tr = $('<tr/>').addClass('draft-row')
							.append($('<td/>').addClass('')
								.text('Save as Draft'));
						for(var t = 0; t<bundles.length;t++) {
							$tr.append($('<td/>').attr('data-class',numberArray[t]).addClass('draft-td draft-' + numberArray[t]).append(
								$('<div class="checkbox checkbox-success checkbox-circle"><input class="draft-checkbox" id="checkbox-draft-'+(t+1)+'" type="checkbox"><label for="checkbox-draft-'+(t+1)+'">Save Draft</label></div>')
							));
						}
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

function checkArrayItem(array, id){
	var len = array.length;
	for(var i=0; i< len;i++) {
		var obj = array[i];
		if(obj.id == id) {
			return true;
		}
	}
	return false;
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
	var discount = $('#services-table tbody tr.total-discount td:nth-child('+index+') span').text();
	var total = $('#services-table tbody tr.vat-total-price td.vat-total-price span').text();
	var vat = $('#services-table tbody tr.vat-price td.vat-price span').text();
	var Dis = getSelectedDiscount() /* from sale-services.js */ ;
	return {
		'payNow':now,
		'payLater':later,
		'total':total,
		'vat' : vat,
		'discount' : discount,
		'discountID' : Dis.attr('data-percentage')
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