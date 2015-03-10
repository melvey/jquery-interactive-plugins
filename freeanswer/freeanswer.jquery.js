(function($) {

	function checkAnswer(id, qList) {
		var $answerInput = $("#"+id+" .answerinput").val();
		var $answer = $("#"+id+" .answer");

		if($answerInput) {
			// show answer and explantion regardless of whether
			// users answer is right or wrong.
			$answer.show('slow');

			if($answerInput === qList[id].answer) {
				$answerInput.addClass('freeanswer-correct');
			}
			else {
				$answerInput.addClass('freeanswer-incorrect');
			}
		}	

	}

	$.fn.freeanswerQuiz = function(questions) {
		var qList = questions;

			for(var key in qList) {
				q = qList[key];
				var $qBlock = $("<div></div>").attr('id', key).addClass('question');
				var $answerTextbox = $("<div></div>");	
				$answerTextbox.append("<strong>A:</strong><input class='answerinput' type='text'></input>");

				var $answer = $("<div></div>").addClass("answer");
				$answer.append("<p>"+q.answer+"</p>");
				$answer.append("<p>"+q.explanation+"</p>");
				$answer.hide();

				$answerTextbox.bind({
					focusout: function() {
						checkAnswer($(this).parent().attr('id'), qList);
					}
				});

				$qBlock.append("<p>"+q.question+"</p>");
				$qBlock.append($answerTextbox);
				$qBlock.append($answer);
				$("#mod1topic1-2").append($qBlock);
			}

	};

		// when the answer bar loses focus:
		// check answer and apply either green or yellow highlight around answer if right or wrong
		// display answer (by injecting the key:value pair from the pairs array into the dom via css selection)
		// make explanation appear

		// make event that selects answer for typing.
		// make event that checks the answer via off focus of selected div.


}(jQuery));