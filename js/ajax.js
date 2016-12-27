/*************************************************
 *
 * ajax.js
 * Author Kamran Ali <kamran.ali@xerobug.com>
 * Copyright (c): 2015, all rights reserved for <Estate Fusion>
 * Version: 1.0.0
 *
 * This file contains the global ajax post and get methods for the app
 *
 *************************************************/
 // this is the default post function
function postRequest(url, data, access_token, callback) {
	return ajaxRequest(url, data, access_token, AJAX_POST /* from settings.js*/,callback);
}
// this is the default get function
function getRequest(url, data,access_token, callback) {
	return ajaxRequest(url, data, access_token, AJAX_GET  /* from settings.js*/, callback);
}
// this is the default ajax function for app to avoid code duplication in each page
// the results are passed to a callback function passed as an argument by the calling method
function ajaxRequest(url, data,access_token, type, callback) {
	$.ajaxSetup({
	  headers: {
		'Authorization': "Bearer " + access_token
	  }
	});
	$.ajax({
		url  	: url,
		data 	: data,
		type 	: type,
		crossDomain: true,
		beforeSend: function (xhr) {
			xhr.setRequestHeader ("Authorization", "Bearer " + access_token);
		},
	})
	.done(function(res){
		var obj = {
			'status':res.status /* from settings.js*/,
			'result':res
		};
		callback(obj);
	}).error(function(res){
		var obj = {
			'status':STATUS_ERROR /* from settings.js*/,
			'result':res
		};
		callback(obj);
	});
}