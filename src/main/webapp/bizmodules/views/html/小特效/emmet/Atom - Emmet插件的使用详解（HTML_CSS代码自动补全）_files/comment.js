$(document).ready(function(){

		setTip("#username");
		setTip("#email");
		setTip("#textareaComment");

		$("#commentform").submit(function() {
			var errorMessage = "";
			if($.trim($("#textareaComment").val()) == "" || $.trim($("#textareaComment").val()) == $("#textareaComment").attr("default_data")) {				
				errorMessage = "您是不是忘了说点什么？";
			}else if($.trim($("#username").val()) == "" || $.trim($("#username").val()) == $("#username").attr("default_data")){
				errorMessage = "昵称不能为空!";
			}else if($.trim($("#email").val()) == "" || $.trim($("#email").val()) == $("#email").attr("default_data") ){
				errorMessage = "邮箱地址不能为空!";
			}else if(!testEmail($.trim($("#email").val()))){
				errorMessage = "邮箱格式有误!";
			}else {
				submit_comment();
			}

			if ($("#error").is(":hidden")) {
				$("#error").html(errorMessage).slideDown().delay(3000).slideUp();
			}else{
				$("#error").html(errorMessage);
			}

			return false;
		});

		appendLink();
});

function setTip(obj){
	$(obj).val($(obj).attr("default_data")).css("color", "#ccc");

	$(obj).focus(function(){
			if($.trim($(this).val()) == $(this).attr("default_data")){
				$(this).val('').css("color", "#666");
			}
		});

	$(obj).blur(function(){
		if($.trim($(this).val()) == ""){
			$(this).val($(obj).attr("default_data")).css("color", "#ccc");
		}
	});
}

function submit_comment(){
	var formObj = $("#commentform");
    $("#commentform #textCommentSubmit").attr("disabled", true).css("background-color","#ccc").fadeTo("slow", 1);
	$.ajax({
            type: "POST",
            url: "../php/sql.php",
            data: formObj.serialize(),
            success: function(data) {
				//alert(data);
				if ($("#error").is(":hidden")) {
					$("#error").css("color", "green").html(data).slideDown().delay(5000).slideUp();
				}else{
					$("#error").css("color", "green").html(data);
				}
			}
	});
}

function testEmail(str){
	
  var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  return reg.test(str);
}

function appendLink(){
	var pagelink = "<br/>原文出自：<a href='http://www.hangge.com'>www.hangge.com</a>&nbsp;&nbsp;转载请保留原文链接：<a href='"+document.location.href+"'>"+document.location.href+"</a>";
	var pagelink2 = "\n原文出自：www.hangge.com  转载请保留原文链接："+document.location.href;
	var keyStrs = $(".news_content").text().split("。");
	//留言页面就不要添加了
	if (keyStrs.length <=1){
		return;
	}
	var keyStr1 = keyStrs[0].substr(-6);
	var keyStr2 = keyStrs.length>0?keyStrs[1].substr(-6):keyStr1;
	var keyStr7 = keyStrs.length>7?(keyStrs[7].substr(-6)+"。"):keyStr1;
	if (!!window.ActiveXObject || "ActiveXObject" in window) 
	{ 
		document.body.oncopy=function() 
		{ 
			setTimeout( function () { 
				var text = clipboardData.getData("text");
				if(text.indexOf(keyStr1)<0 && text.indexOf(keyStr2)<0 && text.indexOf(keyStr7)<0){
					return;
				}

				if (text) { 
					text = text + pagelink2; 
					clipboardData.setData("text", text);
				} 
			}, 100 )
		}
	} 
	else 
	{
		function addLink() 
		{ 
			var body_element = document.getElementsByTagName('body')[0]; 
			var selection; 
			selection = window.getSelection(); 

			var html = "";
			if (selection.rangeCount) {
				var newdiv = document.createElement("div");
				//newdiv.style.position='absolute'; 
				//newdiv.style.left='-99999px'; 
				body_element.appendChild(newdiv); 
				for (var i = 0, len = selection.rangeCount; i < len; ++i) {
					newdiv.appendChild(selection.getRangeAt(i).cloneContents());
				}
				$(newdiv).find(".operate_box").remove();
				$(newdiv).find(".pre_next_article").remove();
				html = newdiv.innerHTML;
			}
	
			if(html.indexOf(keyStr1)>0 || html.indexOf(keyStr2)>0 || html.indexOf(keyStr7)>0){
				var copytext = html + pagelink; 											
				newdiv.innerHTML = copytext; 
				selection.selectAllChildren(newdiv); 
			}	
								
			window.setTimeout 
			( 
				function() 
				{ 
					body_element.removeChild(newdiv); 
				},0 
			); 
		} 
		document.oncopy = addLink; 
	} 
}