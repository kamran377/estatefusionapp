// this function will capture customer photo
function capturePhotoWithData(type) {
	$('#hiddenPhotoID').val(type);
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {sourceType:1, quality: 25,targetWidth: 415,targetHeight: 515,allowEdit : false,  destinationType: Camera.DestinationType.DATA_URL});
}

// this function will capture customer photo
function capturePhotoWithData2(type) {
	$('#hiddenPhotoID2').val(type);
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess2, onFail, {sourceType:1, quality: 25,targetWidth: 415,targetHeight: 515,allowEdit : false,  destinationType: Camera.DestinationType.DATA_URL});
}
// Called if something bad happens.
// 
function onFail(message) {
  alert('Failed because: ' + message);
}
// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
	// Get image handle
	//
	var type = $('#hiddenPhotoID2').val();
	$('#hiddenPhotoID2').val('');
	var smallImage = document.getElementById('smallImage-' + type);
	// Unhide image elements
	//
	smallImage.style.display = 'block';
	// Show the captured photo
	// The inline CSS rules are used to resize the image
	//
	smallImage.src = "data:image/jpeg;base64," + imageData;
	return false;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess2(imageData) {
  // Get image handle
  //
	var type = $('#hiddenPhotoID').val();
	$('#hiddenPhotoID').val('');
	var smallImage = document.getElementById('smallImage2-'+ type);
  // Unhide image elements
  //
  smallImage.style.display = 'block';
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}

function handlePhotoPage(e) {
	if($('#smallImage-1').attr('src') == 'images/placeholder.png') {
		e.preventDefault();
	}
	if($('#smallImage-2').attr('src') == 'images/placeholder.png') {
		e.preventDefault();
	}
	if($('#smallImage-3').attr('src') == 'images/placeholder.png') {
		e.preventDefault();
	}
	if($('#ownership').val() == 2) {
		
		if($('#smallImage2-1').attr('src') == 'images/placeholder.png') {
			e.preventDefault();
		}
		if($('#smallImage2-2').attr('src') == 'images/placeholder.png') {
			e.preventDefault();
		}
		if($('#smallImage2-3').attr('src') == 'images/placeholder.png') {
			e.preventDefault();
		}
	}
}