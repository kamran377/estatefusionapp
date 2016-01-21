var $sigdiv;
function addSignaturePlugin(sfw) {
	$sigdiv = $("#signature");
	$sigdiv.jSignature();
	sfw.refresh();
}
function resetSignature() {
	$sigdiv.jSignature("reset");
}
function checkSignature(e) {
	var sig = $sigdiv.jSignature("getData","base30");
	
	if(!sig[1]) {
		e.preventDefault();
	}
}
