// author: yamamaki

init_url = 'http://electsys.sjtu.edu.cn/edu';
login_url = 'http://electsys.sjtu.edu.cn/edu/index.aspx';
check_url = 'http://electsys.sjtu.edu.cn/edu/StudentScore/B_StudentScoreQuery.aspx';

if (localStorage.studentId == undefined
	|| localStorage.pwd == undefined
	|| localStorage.ac_year == undefined
	|| localStorage.sem == undefined) {
	localStorage.config = false;
	chrome.tabs.create({"url":"../html/options.html"});
	window.close();
}
if (localStorage.config) {
	main();
}
else {
	login();
}
function main() {
	$.ajax({
		url: init_url,
		type: "GET",
		success: function(data) {
			localStorage.login_VIEWSTATE = $(data).find("#__VIEWSTATE").val();
			localStorage.login_EVENTVALIDATION = $(data).find("#__EVENTVALIDATION").val();
			document.getElementById('progress').style.width="25%";
		},
		error: function(data) {
			$("#xhrRequest").html("网络连接出现问题！");
			document.getElementById('progress').style.width="25%";
			$("#bar").addClass("progress-warning");
			setTimeout(function() {
				window.close();
			}, 1000);
		}
	}).done(function () {
		login();
	});
}

function login(){
	loginData = "txtUserName="+localStorage.studentId
				+"&txtPwd="+localStorage.pwd
				+"&rbtnLst=1&Button1=%E7%99%BB%E5%BD%95"
				+"&__VIEWSTATE="+encodeURIComponent(localStorage.login_VIEWSTATE)
				+"&__EVENTVALIDATION="+encodeURIComponent(localStorage.login_EVENTVALIDATION);
  	$.ajax({
  		url: login_url,
  		data: loginData,
  		type: "POST",
  		success: function(data) {
  			document.getElementById('progress').style.width="50%";
  		},
  		error: function(data) {
  			$("#xhrRequest").html("设置信息错误或网络连接出现问题！");
  			document.getElementById('progress').style.width="50%";
  			$("#bar").addClass("progress-warning");
  		}
  	}).done(function() {
  		if (localStorage.config) {
  			getScoreInit();
  		}
  		else {
  			getScore();
  		}
  	});
}

function getScoreInit() {
	$.ajax({
		url: check_url,
		type:"GET",
		success: function(data) {
			localStorage.getScore_VIEWSTATE = $(data).find("#__VIEWSTATE").val();
			localStorage.getScore_EVENTVALIDATION = $(data).find("#__EVENTVALIDATION").val();
			document.getElementById('progress').style.width="75%";
		},
		error: function(data) {
			$("#xhrRequest").html("网络连接出现问题！");
			document.getElementById('progress').style.width="75%";
  			$("#bar").addClass("progress-warning");
		}
	}).done(function() {
		getScore();
	});
}

function getScore() {
	getData = "ddlXN="+localStorage.ac_year
				+"&ddlXQ="+localStorage.sem
				+"&txtKCDM=&btnSearch=++%E6%9F%A5++%E8%AF%A2++"
				+"&__VIEWSTATE="+encodeURIComponent(localStorage.getScore_VIEWSTATE)
				+"&__EVENTVALIDATION="+encodeURIComponent(localStorage.getScore_EVENTVALIDATION);
	$.ajax({
		url: check_url,
		data: getData,
		type: "POST",
		success: function(data) {
			$("#cache").html(data);
			document.getElementById('progress').style.width="100%";
		},
		error: function(data) {
			$("#xhrRequest").html("信息有误，或网络连接失败!");
			document.getElementById('progress').style.width="99%";
  			$("#bar").addClass("progress-warning");
		}
	}).done(function() {
		getResult();
	});
}

function getResult() {
	$("#cache").html($("#dgScore").html());
	$("tr").removeClass("tdtit");
	$("tr").removeClass("tdcolour1");
	$("tr").removeClass("tdcolour2");
	$("td").removeClass("tdcolour1");
	$("td").removeClass("tdcolour2");				
	$("tr").removeAttr("style");
	$("td").removeAttr("style");
	$("td").removeAttr("align");
	tr = document.getElementsByTagName("tr");
	trTags = $("#cache").find("tr");
	chrome.browserAction.setBadgeText({text:String(tr.length-1)});
	for (i = 0; i < tr.length; ++i) {
		tr[i].deleteCell(6);
		tr[i].deleteCell(5);
		tr[i].deleteCell(4);
	}	
	$("#result").append("<table class='align table table-hover table-striped table-bordered' id='scoreTable'></table>");
	for (i = 0; i < trTags.length; ++i) {
		$("#scoreTable").append(trTags[i]);
	}
	$("#title").html(localStorage.ac_year+"学年第"+localStorage.sem+"学期成绩单");
	document.getElementsByClassName('progress')[0].style.display="none";
	localStorage.config = false;
}

$(document).ready(function() {
	$("#fun").click(function() {
		tr = document.getElementsByTagName("tr");
		for (i = 1; i < tr.length; ++i) {
			document.getElementsByTagName("tr")[i].getElementsByTagName("td")[3].innerHTML = "100";
		}		
	});
});