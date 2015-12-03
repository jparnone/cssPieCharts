// JavaScript Document

(function( $ ) {
  $.fn.pieChart = function() {
	//We find every td so we can parse the percent and style the wedges
	var pieItem = this.find('td');
		 
	var values = pieItem.length;
	var lastValue = 0;
	var className = '';
	
	//Colors for each wedge. Can support only 8 wedges, find a random hex generator to support infinte wedges
	var colors = ['red', 'lime', '#90c', '#09f', '#f90', 'grey', 'pink', 'green'];
	
	//Get vendors for CSS3 styles
	var vendorPrefix = '';
	
	if(jQuery.browser.mozilla){
		vendorPrefix = '-moz-';
	}
	else if(jQuery.browser.webkit){
		vendorPrefix = '-webkit-';
	}
	else if(jQuery.browser.msie){
		vendorPrefix = '-ms-';
	}
	else if(jQuery.browser.opera){
		vendorPrefix = '-o-';
	}
	
	//Loop through each TD
	for(var i=0; i<values; i++){
		//We want the first wedge to be at the hightest z-index
		var zIndex = values - i;
		
		//Get the percent value
		var percent = parseFloat($(pieItem[i]).html(), 10);
		
		//get th value and use it as the ID of the TD
		$(pieItem[i]).attr('id', $(pieItem[i]).siblings().text());
		
		var id = $(pieItem[i]).attr('id');
					
		//set colors and z-index
		$('style').append(
			'#'+id+':before{ background:'+colors[i]+'; z-index: '+ zIndex +';}'	
		).append(
			'#'+id+':after{ background: '+colors[i]+'; z-index: '+ zIndex +';}'	
		);
		
		//Depending on what the percentage is we set CSS values to skew the content into a pie wedge
		if(percent <= 25){
			className='under25';
			
			//Determine the skew to get the correct wedge shape
			var skew = 90-(percent*(3.6));
			
			$('style').append(
				'#'+id+':before{ '+vendorPrefix+'transform: skew('+skew+'deg, 180deg) rotate(0deg)}'	
			);
		}//We cannot have a single wedge shape greater than 25%, so for anything over 25% we create two wedge shapes		
		else if(percent > 25){
			//Get the percentage for the second wedge
			var extra = percent - 25;
			
			//Get the rotation the second wedge
			var rotation = extra*3.6;
			
			if(percent < 50){
				className='over25';
			}
			else if(percent > 50 && percent < 75){
				className='over50';
			}
			else{
				extra = percent - 75;
				rotation = extra*3.6 + 90;	
				className='over75';
			}	
			
			$('style').append(
				'#'+id+':after{ '+vendorPrefix+'transform: skew(180deg, 180deg) rotate('+rotation+'deg);}'		
			);				
		}
		
		$(pieItem[i]).addClass(className);
		$(pieItem[i]).css(vendorPrefix+'transform' , 'rotate('+getRotationAmount(percent)+'deg)');
	}		
	
	function getRotationAmount(newValue){
		//Figure out how much we need to rotate our new wedge
		var rotationAmount = lastValue * 3.6;
		
		//Update lastValue by adding the percentage of this wedge
		lastValue = lastValue + newValue;
		
		//Chrome doesn't like it when rotation deg is 0, go figure...
		if(rotationAmount == 0){
			rotationAmount = -0.1;
		}
		
		return rotationAmount;
	}
	
  };
})( jQuery );