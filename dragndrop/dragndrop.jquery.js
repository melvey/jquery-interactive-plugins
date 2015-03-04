/*jslint  white: true, browser: true, plusplus: true, nomen: true */
/*global document, jQuery */
(function($) {
	
	var 
		draggingElem,
		dragX = 0,
		dragY = 0;
	
	/**
	* Internal function to start dragging an answer
	* @param elem DomElement or JQuery object for dom elmenet bring dragged
	* @param answerBlock DOMElement DOM that holds answers
	**/
	function dragInit(evt, elem, answerBlock) {
		draggingElem = elem;
		draggingElem.addClass('dragndrop-dragging');
		
		if($(draggingElem).parent().hasClass('dragndrop-dropzonefull')) {
			$(draggingElem).parent().removeClass('dragndrop-dropzonefull');
			$(draggingElem).parent().removeClass('dragndrop-correct');
			$(draggingElem).parent().removeClass('dragndrop-incorrect');
		}

		dragX = evt.pageX;
		dragY = evt.pageY;
		$(draggingElem).css('position', 'absolute');
		$(draggingElem).css('left', (dragX - ($(draggingElem).outerWidth()/2))+'px');
		$(draggingElem).css('top', (dragY - ($(draggingElem).outerHeight()/2))+'px');
		$(answerBlock).append(elem);
	}
	/**
	* Event handler to drag an answer. Checks if an answer is currently being dragged and moves it to the event location.
	* Event the event is also above a dropzone add the hoverdrop class so the dropzone may be highlighted
	* @param evt Event object containing event location
	* TODO: Include additional location checks (currently only uses pageX and pageY) for cross browser compatability
	**/
	function dragMove(evt) {
		dragX = evt.pageX;
		dragY = evt.pageY;
		if(draggingElem) {
			$(draggingElem).css('position', 'absolute');
			$(draggingElem).css('left', (dragX - ($(draggingElem).outerWidth()/2))+'px');
			$(draggingElem).css('top', (dragY - ($(draggingElem).outerHeight()/2))+'px');
			
			// Now check if we are over an answer box
			// This will not play nicely if there are other interactives on the page
			$('.dragndrop-hoverdrop').removeClass('dragndrop-hoverdrop');
			$('.dragndrop-dropzone').each(function() {
				var position = $(this).offset();
				if((dragX > position.left && dragX < position.left + $(this).outerWidth()) && (dragY > position.top && dragY < position.top + $(this).outerHeight()) && !$(this).hasClass('dragndrop-dropzonefull')) {
					$(this).addClass('dragndrop-hoverdrop');
				}
			});
		}
	}
	/**
	* Event handler for when an answer is dropped. Check if the current location is above a dropzone and if so set position to that of the dropzone
	* TODO If not above dropzone tween back to the original position
	**/
	function dragDrop() {
		if(draggingElem) {

			$('.dragndrop-dropzone').each(function() {
				var position = $(this).offset();
				if((dragX > position.left && dragX < position.left + $(this).outerWidth()) && (dragY > position.top && dragY < position.top + $(this).outerHeight()) && !$(this).hasClass('dragndrop-dropzonefull')) {
					$(draggingElem).css('position', 'relative');
					$(draggingElem).css('left', 0);
					$(draggingElem).css('top', 0);
					$(this).append(draggingElem);
					$(this).addClass('dragndrop-dropzonefull');
					$(this).removeClass('dragndrop-hoverdrop');
				}
			});

			draggingElem.removeClass('dragndrop-dragging');
			draggingElem = undefined;
		}
	}
	
	/**
	* Assign dragInit function to a draggable element
	* @param DOMElement The draggable element for event to be assigned to
	* @param answerBlock DOMElement DOM that holds answers
	**/
	function addDragInitEvent(element, answerBlock) {
		element.on('mousedown', function(evt) {
			dragInit(evt, element, answerBlock);
		});
	}
	
	/**
	* Randomly sort array
	* @param array The array to be randomised
	* @return The original array after being randomly sorted
	**/
	function randomiseArray(array) {
		var 
			j,
			tmp;
		for(var i = 0; i < array.length; i++) {
			j = Math.floor(Math.random() * array.length);
			tmp = array[j];
			array[j] = array[i];
			array[i] = tmp;
		}
		return array;
	}
	
	
	$.fn.dragndropQuiz = function(options) {
		
		var settings = $.extend({
			answerBlockId: 'answerBlock'
		}, options);

		if(!$('#'+settings.answerBlockId).length) {
			$(this).append('<div id="'+settings.answerBlockId+'"></div>');
		}
		var $answerBlock = $('#'+settings.answerBlockId);
		$answerBlock.addClass("dragndrop-answerblock");
		
		var pairs = {};
		
		var keys = Object.getOwnPropertyNames(options.answers);
		keys = randomiseArray(keys);

		var key;
		for(var i in keys) {
			key = keys[i];
			if(options.answers.hasOwnProperty(key)) {
				var answerId = 'answer'+i;
				var draggableAnswer = $('<div/>', {
					id: answerId,
					text: options.answers[key],
					'class': 'dragndrop-answer'
				});
				$('#'+key).addClass('dragndrop-dropzone');
				pairs[key] = draggableAnswer;
				$answerBlock.append(draggableAnswer);
				
				// Make answer draggable
				addDragInitEvent(draggableAnswer, $answerBlock);

				document.addEventListener('mousemove', dragMove);
				$(document).on('mouseup', dragDrop);
			}
		}
		

		var checkBtn = $('<button/>', {
			type: 'button',
//			class: 'btn',
			'class': 'dragndrop-checkbtn',
			text: 'Check'
		});
		checkBtn.on('click', function() {
			for(var key in pairs) {
				var parentId = $(pairs[key]).parent().attr('id');
				if(key === parentId) {
					$('#'+parentId).addClass('dragndrop-correct');
				} else {
					$('#'+parentId).addClass('dragndrop-incorrect');
				}
			}
		});
		
		$(this).append(checkBtn);
		$(this).append('<div class="clear"></div>');
		
		return this;
	};
	
}(jQuery));