var $sigdiv;
var $sigdiv2;
function addSignaturePlugin(sfw) {
	$sigdiv = $("#signature");
	if($sigdiv.find(".jSignature").length == 0){
		$sigdiv.jSignature();
	}
}
function addSignaturePlugin2(sfw){
	$sigdiv2 = $("#signature2");
	if($sigdiv2.find(".jSignature").length == 0){
		$sigdiv2.jSignature();
	}
	$sigdiv2.resize()
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
