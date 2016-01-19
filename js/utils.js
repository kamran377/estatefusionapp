/*************************************************
 *
 * utils.js
 * Author Kamran Ali <kamran.ali@xerobug.com>
 * Copyright (c): 2015, all rights reserved for <Estate Fusion>
 * Version: 1.0.0
 *
 * This file contains the general utility methods used in the app
 *
 *************************************************/
// this function returns whether the device is online or offline
function isDeviceOnline() {
	return navigator.onLine;
}
// this function shows the ajax loader
function showLoader() {
	$.mobile.loading( "show");
}
// this function hides the ajax loader
function hideLoader() {
	$.mobile.loading( "hide");
}
// this will return the parsed value for the number
function getFloat(number) {
	return parseFloat(number);
}