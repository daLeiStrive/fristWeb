/** * Created by ddl on 2017/6/13. */$(function () {    initFileInput('exampleInputFile', '/home/fileUpload.do');    $('#submit').click(function () {        var email = $('#exampleInputEmail1').val(),            password = $('#exampleInputPassword1').val(),            exampleInputFile = $('#exampleInputFile').val();        $.ajax({            url: "/home/two.do",            type: "post",            dataType: "json",            //contentType: "application/json",            data: {email: email, password: password},            success: function (result) {                console.log(result);            }        });    });    //初始化fileinput控件（第一次初始化）    function initFileInput(ctrlName, uploadUrl) {        var control = $('#' + ctrlName);        control.fileinput({            language: 'zh', //设置语言            uploadUrl: uploadUrl, //上传的地址            allowedFileExtensions: ['jpg', 'png', 'gif'],//接收的文件后缀            showUpload: true, //是否显示上传按钮            showCaption: true,//是否显示标题            browseClass: "btn btn-primary" //按钮样式            //previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"        });    }    $('#testClick').click(function () {        $.ajax({            url: "/home/one.do",            type: "post",//                dataType: "json",            dataType: "html",            //contentType: "application/json",            data: {email: 'test@test.com', password: '12346'},            success: function (result) {                debugger                $('#contenDic').html(result);            }        });    });});