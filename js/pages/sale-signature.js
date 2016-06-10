var $sigdiv;
var $sigdiv2;
function addSignaturePlugin(sfw) {
	$sigdiv = $("#signature");
	$sigdiv.jSignature();
	$sigdiv2 = $("#signature2");
	$sigdiv2.jSignature();
}
function resetSignature() {
	$sigdiv.jSignature("reset");
	$sigdiv2.jSignature("reset");
}
function checkSignature(e) {
	var sig = $sigdiv.jSignature("getData","base30");
	if(!sig[1]) {
		e.preventDefault();
	}
}
