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
    <script>
        window.SYSCONFIG_BASE_PATH = window.location.href;
    </script>
    <%@include file="biz_meta.jsp" %>
</head>
<body style="padding-left: 10%;padding-right: 10%; padding-top: 20px;background-color: whitesmoke">
<div class="container" style="    padding: 40px;background-color: white;">
    <ul class="sidebar-menu" id="menubar"></ul>

    <div class="nav-tabs-custom frame_tab" id="navtabstrip" style="box-shadow: none;margin-bottom:0px;padding-bottom: 0px;">

        <div id="contenDic"></div>
        <button id="testClick">点我试试啊</button>
        <div class="tab-content"></div>
    </div>
</div>

<script src="/bizmodules/modules/index/IndexContoller.js"></script>
<%--<script src="/bizmodules/modules/index/Test.js"></script>--%>
<%-- <script src="/bizmodules/statics/js/fileinput4.4/fileinput.min.js"></script>
<script src="/bizmodules/statics/js/fileinput4.4/fileinput_locale_zh.min.js"></script>--%>
</body>

</html>
