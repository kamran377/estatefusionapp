/*************************************************
 *
 * settings.js
 * Author Kamran Ali <kamran.ali@xerobug.com>
 * Copyright (c): 2015, all rights reserved for <Estate Fusion>
 * Version: 1.0.0
 *
 * This file contains the general / global settings of app
 *
 *************************************************/
//var API_BASE_URL 		= '/api/v1/';
var API_BASE_URL 		= 'http://estate-fusion.biz/en/api/v1/';
//var API_BASE_URL 		= 'http://localhost:9191/en/api/v1/';
var LOGIN_URL 			= API_BASE_URL + 'users/login';
var SIMPLE_BUNDLES_URL	= API_BASE_URL + 'bundles/all';
var OPTIONS_BUNDLES_URL	= API_BASE_URL + 'bundles/options-bundle';
var DISCOUNTS_URL		= API_BASE_URL + 'bundles/discounts';
var TERMS_URL			= API_BASE_URL + 'bundles/terms';
var PAYMENT_URL			= API_BASE_URL + 'payment/charge';
var ADD_CUSTOMER_URL	= API_BASE_URL + 'customers/add';
var REGIONS_URL	        = API_BASE_URL + 'bundles/regions';
var TOWNS_URL	        = API_BASE_URL + 'bundles/towns';
var ALL_SERVICES_URL	= API_BASE_URL + 'bundles/all-services';
var SIMPLE_BUNDLE_TYPE 	= "SIM";
var OPTIONS_BUNDLE_TYPE = "OPT";
var CUSTOMER_PHOTO_ID   = "1";
var CUSTOMER_PHOTO_LICENSE   = "2";
var CUSTOMER_PHOTO_BILL   = "3";
var CUSTOMER_OWNER_FIRST  = "First";
var CUSTOMER_OWNER_SECOND  = "Second";
var STATUS_SUCCESS 		= 'success';
var STATUS_ERROR 		= 'error';
var AJAX_POST 			= 'POST';
var AJAX_GET			= 'GET';
var AJAX_ASYNC 			= false;


