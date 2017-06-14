<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2017/6/12
  Time: 23:46
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="cn">
<head>
    <title>首页</title>
    <style>
        .tx,.tx * {
            width: 100%;
            height:100%;
            position: absolute;
        }
    </style>
</head>
<body <%--style="padding-left: 10%;padding-right: 10%; padding-top: 20px;background-color: whitesmoke"--%> style="    color: white;">
<canvas id="canvas" class="tx"></canvas>
<div id='holder' class="tx"></div>
<div class="container" style="    padding: 40px;background-color: white;">
    <form>
        <div class="form-group col-md-6">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
        </div>
        <div class="form-group col-md-6">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <div class="form-group col-md-12" style="    height: 300px;margin-bottom: 15%;">
            <label >File input</label>
            <input type="file" id="exampleInputFile" name="exampleInputFile" class="file"
                   multiple data-show-upload ="true" data-show-caption ="true">
        </div>
        <div class="form-group col-md-12 text-center ">
        <%--<div class="checkbox">
            <label>
                <input type="checkbox"> Check me out
            </label>
        </div>--%>
        <button type="button" class="btn btn-primary col-md-2 clearfix" id="submit">Submit</button>
        </div>

    </form>
</div>
<%@include file="biz_meta.jsp" %>
<script src="/bizmodules/modules/index/IndexContoller.js"></script>
<script src="/bizmodules/statics/js/fileinput4.4/fileinput.min.js"></script>
<script src="/bizmodules/statics/js/fileinput4.4/fileinput_locale_zh.min.js"></script>
</body>

</html>
