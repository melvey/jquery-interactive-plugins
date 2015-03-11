(function($){

	function loadQList(questions, key) {
		var qList = {};

		for(var i in questions) {
			var id = buildKey(i, key);
			var q = questions[i];

			if(q.subquestions) {
				var subQuestions = loadQList(q.subquestions, id);
				subQuestions["question"] = q.question;
				qList[id] = subQuestions;
			}
			else {
				qList[id] = loadQ(q);
			}
		}
		return qList;
	}

	function loadQ(q) {
		if(q.answer === undefined) {
			console.log("answer undefined");
			var qInfo = {
				question: q.question
			};
		}
		else {
			var qInfo = {
				question: q.question,
				answer: q.answer,
				explanation: q.explanation
			};
		}
		return qInfo;
	}

	// develop key for future reference
	function buildKey(extender, key) {
		if(key === undefined) {
			return extender;
		}
		else {
			return key.concat('.'+extender);
		}
	}

	$.fn.freeanswerMultiQuiz = function(questions) {
		var qList = loadQList(questions);
		console.log(qList);
	}

}(jQuery))