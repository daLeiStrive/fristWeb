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

</head>
<body style="padding-left: 10%;padding-right: 10%; padding-top: 20px;background-color: whitesmoke">
<form>
    <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
    </div>
    <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>
    <div class="form-group">
        <label for="exampleInputFile">File input</label>
        <input type="file" id="exampleInputFile" class="file">
        <p class="help-block">Example block-level help text here.</p>
    </div>
    <div class="checkbox">
        <label>
            <input type="checkbox"> Check me out
        </label>
    </div>
    <button type="button" class="btn btn-default" id="submit">Submit</button>
</form>
<%@include file="biz_meta.jsp" %>
<script src="/bizmodules/statics/modules/index/IndexContoller.js"></script>

<script src="/bizmodules/statics/js/fileinput4.4/fileinput.min.js"></script>
<script src="<%=jspParamsJs%>js/fileinput4.4/fileinput_locale_zh.min.js"></script>
</body>

</html>
