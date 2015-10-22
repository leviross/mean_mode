app.filter('limit', function () {
	return function (input, value) {
		return input.substr(0, value);
	}
});