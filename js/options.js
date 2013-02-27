$(document).ready(function() {
	$("#save").click(function() {
		if ($("#studentId").val() != "") {
			localStorage.studentId = $("#studentId").val();
			localStorage.config = true;
		}
		if ($("#pwd").val() != "") {
			localStorage.pwd = $("#pwd").val();
			localStorage.config = true;
		}
		if ($("#ac_year").val() != "") {
			localStorage.ac_year = $("#ac_year").val();
			localStorage.config = true;
		}
		if ($("#sem").val() != "") {
			localStorage.sem = $("#sem").val();
			localStorage.config = true;
		}
		$("#save").html("设置成功！");
		setTimeout(function() {
			window.close(this);
		}, 1000); 
	});
	$("#cancel").click(function() {
		window.close(this);
	});
});