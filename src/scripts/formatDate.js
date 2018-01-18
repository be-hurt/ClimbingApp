const formatDate = function(rawDate) {
	var myDate = rawDate;
	var date = new Date(myDate);
	var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'Novermber', 'December'];
	var d = date.getDate();
	var m = months[date.getMonth()];
	var y = date.getFullYear();
	var hour = date.getHours();
	var mins = date.getMinutes();
	if(mins < 10) {
		mins = '0' + mins;
	}
	var newDate = `${m} ${d}, ${y} at ${hour}:${mins}`;
	return newDate;
}

export default formatDate;