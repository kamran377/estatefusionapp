//var sayCheese = new SayCheese('#smallImage', { snapshots: true });
// this function will capture customer photo
function capturePhotoWithData() {
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {sourceType:1, quality: 25,targetWidth: 415,targetHeight: 515,allowEdit : false,  destinationType: Camera.DestinationType.DATA_URL});
	//var width = 415, height = 515;
	//sayCheese.takeSnapshot(width, height);
}
/*sayCheese.on('snapshot', function(snapshot) {
  // do something with a snapshot canvas element, when taken
  console.log(snapshot);
});*/
// this function will capture customer photo
function capturePhotoWithData2() {
	// Take picture using device camera and retrieve image as base64-encoded string
	navigator.camera.getPicture(onPhotoDataSuccess2, onFail, {sourceType:1, quality: 25,targetWidth: 415,targetHeight: 515 });
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
	var smallImage = document.getElementById('smallImage');
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
  var smallImage = document.getElementById('smallImage2');
  // Unhide image elements
  //
  smallImage.style.display = 'block';
  // Show the captured photo
  // The inline CSS rules are used to resize the image
  //
  smallImage.src = "data:image/jpeg;base64," + imageData;
}