$(document).on("ready", function(){

	// make every image fill their direct parent
	$("img").imagefill();
	
	// subscibe to the "fillsContainer" event
	$("img").on("fillsContainer", function(event, imageProperties){
		console.log(event, imageProperties);
	});
	
});