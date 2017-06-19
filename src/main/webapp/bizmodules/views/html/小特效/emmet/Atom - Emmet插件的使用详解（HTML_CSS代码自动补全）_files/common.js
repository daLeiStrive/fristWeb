$(document).ready(function(){
		$.ajax({ 
			type: "get", 
            url: "/blog/php/guestinfo.php"+"?screenWidth="+screen.width+"&screenHeight="+screen.height, 
            success: function (data) {
				$("#guestInfo").html(data);
            }

        });
		
		//页面关闭后再次记录访客(不大好用)
		$(window).on('unload', function(){
			$.ajax({ 
					type: "get", 
					url: "/blog/php/guestinfo.php"
				});
		});
});



//显示打赏窗口
function showPayPage(clickPosition){
	 $.ajax({ 
		type: "get", 
		url: "/blog/include/payPage.html", 
		success: function (data) {
			 $("body").append(data);
		}
	});
	
	//统计
	var filename=location.href;
	filename=filename.substr(filename.lastIndexOf('/')+1);   

	$.ajax({ 
		type: "get", 
		url: "/blog/php/pay.php?clickPosition="+clickPosition+"&page="+filename, 
		success: function (data) {
			 payId = data;
		}
	});
}

var payId;

//移除打赏窗口
function closePayPage(){
	$(".hangge_boxy_alert").remove();
	$("#boxyCover").remove();

	//统计
	$.ajax({ 
		type: "get", 
		url: "/blog/php/pay.php?id="+payId, 
		success: function (data) {
			 payId = "";
		}
	});
}