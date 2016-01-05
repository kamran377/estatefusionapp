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
var API_BASE_URL 		= 'http://localhost:8080/estatefusion/v1/';
var LOGIN_URL 			= API_BASE_URL + 'users/login';
var SIMPLE_BUNDLES_URL	= API_BASE_URL + 'bundles/all';
var OPTIONS_BUNDLES_URL	= API_BASE_URL + 'bundles/options';
var SIMPLE_BUNDLE_TYPE 	= "SIM";
var OPTIONS_BUNDLE_TYPE = "OPT";
var STATUS_SUCCESS 		= 'succes';
var STATUS_ERROR 		= 'error';
var AJAX_POST 			= 'POST';
var AJAX_GET			= 'GET';
var AJAX_ASYNC 			= false;
