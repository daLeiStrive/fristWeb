/**
 * Description: 模块描述.
 * Copyright: © 2016 CSNT. All rights reserved.
 * Company:CSNT
 *
 * @author duwanjiang
 * @version 1.0
 * @timestamp 2017/5/19 9:13
 */
/**
 * 公共数据请求对象
 * @param url action的url
 * @param params 参数
 * @param success 成功返回函数
 * @param failure 失败返回函数
 * @param maskid 等待标签的id
 * @param async 是否异步
 * @param fileid 文件上传标签的id
 */
DaLei.doAction = function (url, params, success, failure, maskid, async, fileid) {
    success = success || function () {
        };
    failure = failure || function () {
        };
    params = params || {};
    "sys-user-login" !== url && (params.userId = DaLei.CacheUtil.get(DaLei.Const.USER_ID));
    params.userLocaleId = DaLei.getSysConfig("locale_id");
    params.timestamp = Date.now();
    params.network = window.NETWORK_DELAY;
    DaLei.ObjUtil.isEmpty(params.menuCode) && (params.menuCode = DaLei.getActiveModule() ? DaLei.getActiveModule() : null );
    params.signature = DaLei.getSign(url, params);
    if (DaLei.ObjUtil.isNotEmpty(fileid)) {
        params = DaLei.JSON.encode(params);
        var h;
        $.ajaxFileUpload({
            url: DaLei.Const.JSON_ACTION,
            type: "post",
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: fileid, //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
            data: {
                actionName: url,
                postData: params
            },
            success: function (a, b) {
                h = a;
                var biz = h.bizexception;
                var sys = h.sysexception;
                var errorCode = h.errorcode;
                if(biz || sys || errorCode) {
                    DaLei.ObjUtil.isNotEmpty(h.message) && DaLei.Msg.info(h.message);
                    var bizexception = h.bizexception
                        , e = h.sysexception;
                    bizexception ? DaLei.Msg.warn(DaLei.StrUtil.htmlEncode(bizexception).replace("\\n", "\x3cbr/\x3e").replace("\n", "\x3cbr/\x3e")): e && DaLei.Msg.error(e + "\x3cbr/\x3e\x3cbr/\x3e[Error Code:" + h.stack + "]");
                    failure(h);
                    h.loginTimeout &&
                    (window.LOGIN_TIMEOUT = h.loginTimeout);
                    return;
                }
                success(h);
                h.loginTimeout && (window.LOGIN_TIMEOUT = h.loginTimeout)
            },
            failure: function (a, b) {
                h = JSON.parse(b.response.responseText);
                DaLei.ObjUtil.isNotEmpty(h.message) && DaLei.Msg.info(h.message);
                var bizexception = h.bizexception
                    , e = h.sysexception;
                bizexception ? DaLei.Msg.warn(DaLei.StrUtil.htmlEncode(bizexception).replace("\\n", "\x3cbr/\x3e").replace("\n", "\x3cbr/\x3e")) : e && DaLei.Msg.error(e + "\x3cbr/\x3e\x3cbr/\x3e[Error Code:" + h.stack + "]");
                failure(h);
                if(h.loginTimeout) {
                    DaLei.Utils.setUserOutTime(h.loginTimeout);
                }
                //(window.LOGIN_TIMEOUT = h.loginTimeout)
            }
        });
    } else
        return DaLei.Utils.ajax({
            url: DaLei.Const.JSON_ACTION,
            action: url,
            postdata: params,
            mask: maskid,
            async: async,
            successFn: success,
            failureFn: failure
        })
}

/**
 * 公共查询方法
 * @param url 请求url
 * @param param 请求参数
 * @param formItemId 查询条件form的itemId
 * @param successFn 成功返回函数
 * @param failureFn 失败返回函数
 * @param async 是否异步
 */
DaLei.commonAction = function (url, param, formItemId, successFn, failureFn, async) {
    var postData = param || {};
    postData.viewdata = DaLei.getFormData(formItemId);
    DaLei.doAction(url, postData, function (retData) {
        if (retData.success)
            if (successFn) {
                successFn(retData);
            }
    }, failureFn, false, async);
}

/**
 * 公共删除函数
 * @param url
 * @param param 选择记录的数组
 * @param successFn
 * @param failureFn
 * @param async
 */
DaLei.commonDeleteAction = function (url, param, successFn, failureFn, async) {
    var postData = param || {};
    var uuids = [];
    for (var i in postData) {
        uuids.push(postData[i].uuid);
    }
    DaLei.doAction(url, {uuids: uuids}, function (retData) {
        if (retData.success)
            if (successFn) {
                successFn(retData);
            }
    }, failureFn, false, async);
}

DaLei.loadFreeMarkerPage = function (action, params, success, failure) {
    success = success || function () {
        };
    failure = failure || function () {
        };
    params = params || {};
    params.userId = DaLei.CacheUtil.get(DaLei.Const.USER_ID);
    params.userLocaleId = DaLei.getSysConfig("locale_id");
    params.network = window.NETWORK_DELAY;
    params.actionName = action;
    var start = new Date().getTime();
    DaLei.ObjUtil.isEmpty(params.menuCode) && (params.menuCode = DaLei.getActiveModule() ? DaLei.getActiveModule() : null );

    var cacheKey = DaLei.StrUtil.getMd5(DaLei.JSON.encode(params));
    var cacheObj = null;
    if(!DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_INFO_LAYOUT, cacheKey) || !DaLei.DebugUtil.isProdMode()) {
        params.timestamp = Date.now();
        params.signature = DaLei.getSign(action, params);
        cacheObj = DaLei.Utils.ajax({
            url: DaLei.Const.FREEMARKER_LOAD_PAGE,
            action: action,
            postdata: params,
            successFn: cacheSuccess,
            failureFn: failure,
            dataType:'html'
        });
    } else {
        var newParam = {};
        newParam.action = DaLei.getActiveModule() ? DaLei.getActiveModule() : null;
        newParam.actionId = DaLei.StrUtil.getUUID(),
            newParam.actionParam = JSON.stringify(params);
        newParam.startTime = new Date();
        newParam.actionType = "MENU";
        var end = new Date().getTime();
        newParam.duration = end - start;
        DaLei.doAction("log-action-history", newParam);
        cacheObj = DaLei.CacheUtil.getPage(DaLei.Const.CACHE_TYPE_INFO_LAYOUT, cacheKey);
        success(cacheObj);
    }

    function cacheSuccess(retdata) {
        if (DaLei.DebugUtil.isProdMode()) {
            DaLei.CacheUtil.setPage(DaLei.Const.CACHE_TYPE_INFO_LAYOUT, cacheKey, retdata);
        }
        success(retdata);
    }
};
//加载模板文件
DaLei.loadFreeMarkerAction = function (action, postData, success, failure) {
    var params = {};
    params.viewdata = postData;
    return DaLei.doAction(action, params, success, failure);
};

DaLei.getRedirectPath = function (configKey) {
    if(DaLei.ObjUtil.isNotEmpty(window[("SYSCONFIG_REDIRECTPATH").toUpperCase()])) {
        return window[("SYSCONFIG_REDIRECT_PATH").toUpperCase()];
    } else {
        return window[("SYSCONFIG_" + configKey).toUpperCase()];
    }
};

DaLei.getSign = function (actionName, postdata) {
    var data = actionName + "\n",
        key = DaLei.CacheUtil.get(DaLei.Const.USER_TOKEN);
    data += DaLei.JSON.encode(postdata || {});
    key = DaLei.ObjUtil.isEmpty(key) ? "DaLei" : key;
    // return DaLei.StrUtil.getHMACSHA256(data, key);
};

//Get sys config properties
DaLei.getSysConfig = function (configKey) {
    return window[("SYSCONFIG_" + configKey).toUpperCase()];
};

DaLei.initComboStores = function(ele, menuCode, pageCacheRefresh) {
    if(pageCacheRefresh == null || pageCacheRefresh == undefined) {
        pageCacheRefresh = false;
    }
    var xtypeSel = ["[xtype='bCheckGroup']","[xtype='bRadioGroup']","[xtype='bComboxSin']","[xtype='e_combobox']","[xtype='e_combotree']","[xtype='e_combogrid']","[xtype='e_tree']", "[coltype='combtree']", "[coltype='combobox']"];
    var comboList = [];
    var treeList =[];
    var cacheKeyLst =[];
    $.each(xtypeSel, function(i, xtype){
        $(xtype, ele).each(function(j, comp) {
            getCacheKeyAndParams($(comp),menuCode, cacheKeyLst, comboList, treeList, pageCacheRefresh);
        });
    });
    var postdata = {};
    postdata.menu_code = menuCode;
    postdata.combo_item_list = comboList;
    postdata.tree_item_list = treeList;

    if(comboList.length > 0 || treeList.length > 0) {
        DaLei.doAction("common-component-init-load", postdata, function(retData) {
            if(retData && retData.comboItemList) {
                var listCombStore = retData.comboItemList.root;
                $.each(listCombStore, function(i, rowMap){
                    DaLei.CacheUtil.setPage(DaLei.Const.CACHE_TYPE_COMBO_STORE, rowMap.cacheKey, rowMap.cacheObj);
                });
            }
            if(retData && retData.workflowDefinitionKey) {
                var postdata = {};
                postdata.menuCode = menuCode;
                var cacheKeyWithMenuCode = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));
                DaLei.CacheUtil.setPage(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode, retData.workflowDefinitionKey);
            }
            if(retData && retData.treeItemList) {
                var treeCombStore = retData.treeItemList;
                $.each(treeCombStore, function(i, rowMap){
                    DaLei.CacheUtil.setPage(DaLei.Const.CACHE_TYPE_COMBO_STORE, rowMap.cacheKey, rowMap.cacheObj);
                });
            }
        });
    }

    function getCacheKeyAndParams (compEle, menuCode, cacheKeyLst, comboList, treeList, pageCacheRefresh) {
        var xtype = compEle.attr("xtype");
        if(DaLei.ObjUtil.isEmpty(xtype)) {
            xtype = compEle.attr("coltype");
        }

        if("bCheckGroup" == xtype || "bRadioGroup" == xtype) {
            var comboType = "DaLei_fmcode";
            var codeType = compEle.attr("codeType");
            var postdata = {};
            postdata.comboType = DaLei.StrUtil.replaceNull(comboType);
            postdata.codeType = DaLei.StrUtil.replaceNull(codeType);
            postdata.filterMap = {};
            var cacheKey = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));
            postdata.menuCode = DaLei.StrUtil.replaceNull(menuCode);
            var cacheKeyWithMenuCode = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));

            if(pageCacheRefresh == true) {
                if($.inArray(cacheKey,cacheKeyLst) ==-1) {
                    cacheKeyLst.push(cacheKey);
                    comboList.push({cacheKey:cacheKey,cacheKeyWithMenuCode:cacheKeyWithMenuCode, cacheObj: postdata});
                }
            } else {
                if(!DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode)
                    && !DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKey) && ($.inArray(cacheKey,cacheKeyLst) ==-1)) {
                    cacheKeyLst.push(cacheKey);
                    comboList.push({cacheKey:cacheKey,cacheKeyWithMenuCode:cacheKeyWithMenuCode, cacheObj: postdata});
                }
            }

        } else if("bComboxSin" == xtype || "e_combobox" == xtype || "combobox" == xtype) {
            var comboType = DaLei.StrUtil.replaceNull(compEle.attr("combType"), "DaLei_fmcode");
            var codeType = compEle.attr("codeType");
            var filterFields = compEle.attr("filterFields");
            var postdata = {};
            postdata.comboType = DaLei.StrUtil.replaceNull(comboType);
            postdata.codeType = DaLei.StrUtil.replaceNull(codeType);
            postdata.filterMap = getFilterMap(filterFields);
            var cacheKey = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));
            postdata.menuCode = DaLei.StrUtil.replaceNull(menuCode);
            var cacheKeyWithMenuCode = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));
            if(pageCacheRefresh == true) {
                if($.inArray(cacheKey,cacheKeyLst) ==-1) {
                    cacheKeyLst.push(cacheKey);
                    comboList.push({cacheKey:cacheKey,cacheKeyWithMenuCode:cacheKeyWithMenuCode, cacheObj: postdata});
                }
            } else {
                if(!DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode)
                    && !DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKey) && ($.inArray(cacheKey,cacheKeyLst) ==-1)) {
                    cacheKeyLst.push(cacheKey);
                    comboList.push({cacheKey:cacheKey,cacheKeyWithMenuCode:cacheKeyWithMenuCode, cacheObj: postdata});
                }
            }

        } else if("e_combotree" == xtype || "e_combogrid" == xtype || "e_tree" == xtype || "combtree" == xtype) {
            var comboType = DaLei.StrUtil.replaceNull(compEle.attr("combType"), "DaLei_fmcode");
            if("e_tree" == xtype) {
                comboType = compEle.attr("storeAction");
            }
            var filterFields = compEle.attr("filterFields");
            var itemId = compEle.attr("itemId");
            var postdata = {};
            postdata.comboType = DaLei.StrUtil.replaceNull(comboType);
            postdata.filterMap = getFilterMap(filterFields);
            //postdata.itemId = itemId;
            var cacheKey = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));
            postdata.itemId = DaLei.StrUtil.replaceNull(itemId);
            // tree 以ItemId 代替menuCode
            var cacheKeyWithMenuCode = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));
            if(pageCacheRefresh == true) {
                if($.inArray(cacheKey,cacheKeyLst) ==-1) {
                    cacheKeyLst.push(cacheKey);
                    treeList.push({cacheKey:cacheKey,cacheKeyWithMenuCode:cacheKeyWithMenuCode, cacheObj: postdata});
                }
                DaLei.CacheUtil.removePage(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode);
            } else {
                if(!DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode)
                    && !DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKey) && ($.inArray(cacheKey,cacheKeyLst) ==-1)) {
                    cacheKeyLst.push(cacheKey);
                    treeList.push({cacheKey:cacheKey,cacheKeyWithMenuCode:cacheKeyWithMenuCode, cacheObj: postdata});
                }
            }
        }
    }

    function getFilterMap(filterFields) {
        var filterMap = {};
        if (DaLei.ObjUtil.isNotEmpty(filterFields)) {
            var filter = DaLei.StrUtil.split(filterFields,",");
            $.each(filter, function (i,item) {
                if(item.indexOf(":") != -1) {
                    var itemMapping = DaLei.StrUtil.split(item,":");
                    filterMap[itemMapping[0]] = itemMapping[1];
                } else {
                    var itemMapping = DaLei.StrUtil.split(item,"|");
                    var value = null;
                    value = DaLei.StrUtil.replaceNull(value);
                    if (DaLei.ObjUtil.isNotEmpty(itemMapping[1])) {
                        filterMap[itemMapping[1]] = value;
                    } else {
                        filterMap[itemMapping[0]] = value;
                    }
                }
            });
        }
        return filterMap;
    }
};

/**
 * 重写框架中的getComboStoreDate，将action名和查询条件作为缓存的存储条件
 * @param comboType
 * @param codeType
 * @param menuCode
 * @param filterMap
 * @param needCache
 * @returns {*}
 */
DaLei.getComboStoreDate = function (comboType, codeType, menuCode, filterMap, needCache) {
    var postdata = {};
    postdata.comboType = DaLei.StrUtil.replaceNull(comboType);
    postdata.codeType = DaLei.StrUtil.replaceNull(codeType);

    postdata.filterMap = filterMap || {};

    var cacheKey = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));
    postdata.menuCode = DaLei.StrUtil.replaceNull(menuCode);

    var cacheKeyWithMenuCode = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));

    var cacheObj = DaLei.CacheUtil.getPage(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKey);
    var cacheObjWithMenuCode = DaLei.CacheUtil.getPage(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode);

    if ((needCache === false) || (!DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode)
        && !DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKey))) {
        postdata.cacheKey = cacheKey;
        postdata.cacheKeyWithMenuCode = cacheKeyWithMenuCode;

        var retData = DaLei.doAction("common-combostore-load", postdata, null, null, false, false);
        DaLei.DebugUtil.logInfo("Combo Type:" + postdata.comboType + " " + "Code Type:" + postdata.comboType + " " + "Filter:" + DaLei.JSON.encode(postdata.filterMap) + " Load Data from Server!");
        if (!retData && !retData.success) {
            return;
        }
        cacheObj = retData.root;
        var trueCacheKey = retData.cacheKey;
        DaLei.CacheUtil.setPage(DaLei.Const.CACHE_TYPE_COMBO_STORE, trueCacheKey, cacheObj);
    } else if (DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode)) {
        return cacheObjWithMenuCode;
    }

    return cacheObj;
};


/**
 * 获取combo的数据
 * @param daoType
 * @param codeType 当daotype 为 DaLei_fmcode时，才使用
 * @param filterMap
 * @param notNeedAll
 * @param needCache
 */
DaLei.getComboxData = function (daoType, codeType, filterMap, notNeedAll, needCache) {
    var comboxdata = DaLei.getComboStoreDate(daoType, codeType, null, filterMap, needCache);
    if (!notNeedAll) {
        comboxdata.unshift({code: "", codedesc: "--全部--"});
    }
    return comboxdata;
}


/**
 * 打开页面方法
 * @param linkhref 页面路径
 * @param title 页面title
 * @param itemid 页面编码
 * @param menutype 页面类型
 * @param actionparams 页面参数
 * @param refresh 是否刷新页面
 */
DaLei.openTab = function (linkhref, title, itemid, menutype, actionparams, refresh,orgCtr) {
    var tabStrip = DaLei.ModuleManager.getObject("DaLeiNavTab");
    var tempParams = {};
    if (DaLei.ObjUtil.isNotEmpty(actionparams) && actionparams != 'null' && actionparams != 'undefined') {
        tempParams = actionparams;
    }
    if (menutype == DaLei.Const.MENU_TYPE_CTL) {
        DaLei.openTabCtrl(linkhref, title, itemid, menutype, tempParams, refresh, orgCtr);
        return
    }
    //判断裁断类型，如果不为目标页面  不能打开
    if (menutype != DaLei.Const.MENU_TYPE_URL) {
        return;
    }
    //更新路由信息
    DaLei.updateRoute(itemid);

    //获取页面url
    function getUrl() {
        if (linkhref.indexOf("ReportServer?") == -1) {
            return linkhref;
            //return '/framework/' + linkhref;
        } else {
            //获取当前用户的部门编码
            function getDeptCode() {
                var deptcode;
                var orgcode = DaLei.CacheUtil.get(DaLei.Const.USER_DEPARTMENT_CODE);
                deptcode = (orgcode == "*" || orgcode == "CENTER" || orgcode == "REPAIR" ? "OWNER" : orgcode);
                return deptcode;
            }

            //获取老系统编码
            function getOldCode() {
                var oldcode = "", deptcode = getDeptCode();
                if (deptcode.indexOf("_") > -1) {
                    oldcode = deptcode.substring(deptcode.lastIndexOf("_") + 1);
                }
                return oldcode;
            }

            //获取用户等级 0:最高级 1:营运公司 2:路段 3:收费站
            function getLevel() {
                var len, deptcode = getDeptCode();
                len = deptcode.split("_").length;
                len--;
                return len;
            }

            DaLei.DebugUtil.logInfo("current user deptcode = '" + getDeptCode() + "';oldcode = '" + getOldCode() + "';level = '" + getLevel() + "'");

            return window.SYSCONFIG_REPORT_SERVER_ADDR + linkhref + "&departmentcode=" + DaLei.CacheUtil.get(DaLei.Const.USER_DEPARTMENT_CODE) + //用户当前部门
                "&usercode=" + DaLei.CacheUtil.get(DaLei.Const.USER_ID) +
                "&deptcode=" + getDeptCode() + //用户路公司部门
                "&oldcode=" + getOldCode() + //用户所属部门的老系统编码 我编码则为空
                "&deptlevel=" + getLevel(); //当前用户所属部门等级 0:路公司以上级别 1:营运公司 2:路段 3:收费站
        }
    }

    //获取iframe
    function getFrame() {
        return '<iframe id="iframe_' + itemid + '" src="' + getUrl() + '" width="100%" height="100%" frameborder="0" scrolling="yes"  />';
    }

    //查找是否已经存在该tab
    var tabcount = tabStrip.isExist(itemid); //获取是否已存在该id的tab
    if (tabcount > 0) {
        tabStrip.select(itemid);//选中这个tabid的tab
    } else {
        var framehtml = getFrame();

        //添加tab页面
        tabStrip.addTab({
            tabId: itemid,
            title: title,
            content: framehtml
        });
        //是否为收藏页
        var isFavorite = false;
        var favorites = DaLei.getFavoriteMenus();
        for (var j in favorites) {
            var item = favorites[j];
            if (item.menuCode == itemid) {
                isFavorite = true;
            }
        }
        if (isFavorite) {
            tabStrip.setFavorite(itemid, true);
        } else {
            tabStrip.setFavorite(itemid, false);
        }
    }

    /**
     *移除不具备操作权限的按钮
     */
    function removeButtons(iframe, itemid) {
        var buttons = MP.getMenuButtonsPrivilege(itemid);
        if (buttons != null && buttons.length > 0) {
            for (var i = 0; i < buttons.length; i++) {
                var item = buttons[i];
                if (!item.authorized) { //判断按钮权限
                    var element = iframe.contentWindow.document.getElementById(item.funcCode);
                    if (element) {
                        //移除元素
                        element.parentNode.removeChild(element);
                        //element.style.display='none';
                    }
                }
                //$("#"+buttons[i].funcCode).css("display","none");
            }
        }
    }

    //页面参数 初始化
    var oldiframe = $("#iframe_" + itemid)[0];
    oldiframe && (oldiframe.contentWindow.actionparams = actionparams);
    //是否自动属性tab页面
    if ((refresh || refresh == 'true') && tabcount > 0 && oldiframe) {
        var parentIfram = $(oldiframe).parent();
        try {//跨域会拒绝访问，这里处理掉该异常
            oldiframe.contentWindow.document.write('');
            oldiframe.contentWindow.close();
        } catch (e) {
            //Do nothing
        }
        oldiframe.remove();
        if ($.browser && $.browser.msie) {
            CollectGarbage();
        }

        //创建新的iframe
        var iframe = document.createElement("iframe");
        iframe.src = linkhref;
        iframe.id = "iframe_" + itemid;
        iframe.frameBorder = 0;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.scrolling = 'yes';

        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function () {
                removeButtons(this, itemid);
                //todo 去除等待加载界面
                //$([$mask[0], $maskMessage[0]]).fadeOut(params.iframe.delay || 'normal', function () {
                //    $(this).remove();
                //    if ($(this).hasClass('mask-message')) {
                //        $containterMask.fadeOut(params.iframe.delay || 'normal', function () {
                //            $(this).remove();
                //        });
                //    }
                //});
            });
        } else {
            iframe.onload = function () {
                removeButtons(this, itemid);
                //todo 去除等待加载界面
                //$([$mask[0], $maskMessage[0]]).fadeOut(params.iframe.delay || 'normal', function () {
                //    $(this).remove();
                //    if ($(this).hasClass('mask-message')) {
                //        $containterMask.fadeOut(params.iframe.delay || 'normal', function () {
                //            $(this).remove();
                //        });
                //    }
                //});
            };
        }

        parentIfram.append(iframe);
        //
        iframe.contentWindow.actionparams = actionparams;
    }
};

DaLei.openTabCtrl = function (linkhref, title, itemid, menutype, actionparams, refresh, orgCtr) {
    var tabStrip = DaLei.ModuleManager.getObject("DaLeiNavTab");
    if (DaLei.MainFrameEvents.fireEvent('beforeModuleOpen', linkhref, actionparams, itemid, menutype) === false)
        return;
    //判断裁断类型，如果不为目标页面  不能打开
    if (menutype == DaLei.Const.MENU_TYPE_CTL) {
        //更新路由信息
        DaLei.updateRoute(itemid);
        //查找是否已经存在该tab
        var tabcount = tabStrip.isExist(itemid); //获取是否已存在该id的tab
        if (tabcount > 0 && !refresh) {
            tabStrip.select(itemid);//选中这个tabid的tab
            return;
        }
        if(refresh) {
            //tabStrip.closeTab($("[href='#content_"+ itemid + "']"));
            if(orgCtr && typeof orgCtr == "object" && orgCtr.UDID && actionparams && typeof actionparams == "object") {
                DaLei.ModuleManager.putObject(orgCtr.UDID, orgCtr);
                actionparams.orgCtrUDID = orgCtr.UDID;
            }
        }
        //获取页面url
        DaLei.loadComponent(linkhref)
            .done(function(controller) {
                if(!!itemid) {
                    DaLei.CacheUtil.setTemp(DaLei.Const.CACHE_ACTIVE_MODULE, DaLei.Const.CACHE_ACTIVE_MODULE_KEY, itemid);
                }

                var param = {};
                var pagePath = controller.pagePath;
                if(pagePath) {
                    param.pagePath = pagePath;
                }
                var loadPageAction = DaLei.ObjUtil.isEmpty(controller.loadPageAction)?DaLei.Const.COMMON_LOADPAGE:controller.loadPageAction;
                DaLei.loadFreeMarkerPage(loadPageAction, param, function(data, status){
                    var framehtml = '<div style="z-index:-1" id="iframe_' + itemid + '" >' + data + '</div>';

                    framehtml = framehtml;
                    //添加tab页面
                    tabcount = tabStrip.isExist(itemid);
                    if(tabcount>0 && refresh) {
                        tabStrip.refresh(itemid, framehtml);
                    } else if(tabcount >0 && !refresh) {
                        return;
                    } else {
                        tabStrip.addTab({tabId: itemid,
                            title: title,
                            content: framehtml,
                            mask:true
                        });
                    }

                    var t = setTimeout(function(){
                        DaLei.initComboStores($("#iframe_" + itemid), itemid, controller.pageCacheRefresh);

                        /*$.parser.parse($("#iframe_" + itemid));
                        $.parser.onComplete = function () {
                            tabStrip.removeMask(itemid);
                        };*/

                        DaLei.bootstrapParse($("#iframe_" + itemid), controller, itemid, true).done(function(){
                            controller.init($("#iframe_" + itemid), actionparams, itemid, title);
                            DaLei.registDoLayout($("#iframe_" + itemid));
                            //console.log("controller先");
                            DaLei.eaysUiQueryPanelCollapse($("#iframe_" + itemid));
                            DaLei.easyUiLayoutResize($("#iframe_" + itemid));
                        });
                        tabStrip.removeMask(itemid);
                        //console.log("Mask先");
                    }, 10);
                    //var t2 = setTimeout(function(){
                    //    tabStrip.removeMask(itemid);
                    //}, 10);
                    //添加收藏菜单
                    //是否为收藏页
                    if(tabcount<=0) {
                        var isFavorite = false;
                        var favorites = DaLei.getFavoriteMenus();
                        for (var j in favorites) {
                            var item = favorites[j];
                            if (item.menuCode == itemid) {
                                isFavorite = true;
                            }
                        }
                        if (isFavorite) {
                            tabStrip.setFavorite(itemid, true);
                        } else {
                            tabStrip.setFavorite(itemid, false);
                        }
                    }
                },function() {
                    throw new Error("Can not load Module " + linkhref)
                })
            })
            .fail(function() {
                throw new Error("Can not load Module " + linkhref)
            });
        return;
    }
};
DaLei.eaysUiQueryPanelCollapse = function (framePanel) {
    if(!DaLei.getSysConfig("pure_bootstrap")) {
        if ($(framePanel).find("[itemid='conditionPanel']").length > 0) {
            var conditionPanel = $(framePanel).find("[itemid='conditionPanel']");
            var panelBody = conditionPanel.children(".box-body");
            var showRows = conditionPanel.attr("showrows");
            var orgHeight = conditionPanel.data("orgHeight");
            if (DaLei.ObjUtil.isNotEmpty(showRows) && $.isNumeric(showRows) && orgHeight == null) {
                var rows = parseInt(showRows);
                var groups = conditionPanel.find(".form-group");
                var rowHeight = 31;
                if (groups.length > 0) {
                    rowHeight = $(groups[0]).height();
                    if (rowHeight < 31) {
                        rowHeight = 31;
                    }
                }

                var orgPanelBodyHeight = panelBody.outerHeight();
                conditionPanel.data("orgHeight", orgPanelBodyHeight);

                var padTop = parseInt(panelBody.css('padding-top'));
                var padBot = parseInt(panelBody.css('padding-bottom'));
                panelBody.css("overflow-y", "hidden");
                var bodyHeight = rowHeight * rows + padTop + padBot;
                panelBody.css("height", bodyHeight + 'px');
                panelBody.css("overflow-y", "hidden");
                panelBody.mCustomScrollbar({autoHideScrollbar: true, autoDraggerLength: true});
                conditionPanel.data("collapseHeight", panelBody.outerHeight());
                conditionPanel.data("isCollapse", 1);
            } else {
                var isCollapse = conditionPanel.data("isCollapse");
                if(isCollapse && isCollapse ==1) {
                    conditionPanel.find("[itemid='moreCondition']>span").text("收起条件");
                    conditionPanel.find("[itemid='moreCondition']>i").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");

                    var orgHeight = conditionPanel.data("orgHeight");
                    panelBody.animate({height: orgHeight + 'px'}, function () {
                        DaLei.easyUiLayoutResize(framePanel);
                    });
                    conditionPanel.data("isCollapse", 0);
                } else {
                    conditionPanel.find("[itemid='moreCondition']>span").text("更多条件");
                    conditionPanel.find("[itemid='moreCondition']>i").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
                    var collapseHeight = conditionPanel.data("collapseHeight");
                    panelBody.animate({height: collapseHeight + 'px'}, function () {
                        DaLei.easyUiLayoutResize(framePanel);
                    });
                    conditionPanel.data("isCollapse", 1);
                }
            }
        }
    }
};

DaLei.easyUiLayoutResize = function (framePanel) {
    var windowHeight = $(window).height();
    var footerOffset = windowHeight;
    if($('footer.main-footer').length>0) {
        footerOffset = $('footer.main-footer').offset().top;
    }


    if(!DaLei.getSysConfig("pure_bootstrap")) {
        if($(framePanel).find("[itemid='resultPanel'] .datagrid>.panel-body").length>0) {
            var offsetTop = $(framePanel).find("[itemid='queryPanel']>[itemid='resultPanel'] .datagrid>.panel-body").offset().top;

            $(framePanel).find("[itemid='queryPanel']>[itemid='resultPanel'] [xtype='e_datagrid']").datagrid("resize",{minHeight:footerOffset-offsetTop-15});
        }
        if($(framePanel).find("[itemid='editPanel']").length>0) {
            var editpanelOffsetTop = $(framePanel).find("[itemid='editPanel']").offset().top;
            var querypanelOffsetTop = null;
            if($(framePanel).find("[itemid='queryPanel']").length>0) {
                querypanelOffsetTop = $(framePanel).find("[itemid='queryPanel']").offset().top;
            }
            var editpanelOffsetTop = $(framePanel).find("[itemid='editPanel']").offset().top;
            var desktopContentOffset = $("#desktop-content").offset().top;
            var stdOffsetTop = null;
            if(querypanelOffsetTop && querypanelOffsetTop >0) {
                stdOffsetTop = querypanelOffsetTop;
            } else {
                stdOffsetTop = desktopContentOffset;
            }
            $(framePanel).find("[itemid='editPanel']").css({minHeight: footerOffset - stdOffsetTop - 15});
            // $(framePanel).find(".DaLei-view-left").css({height: footerOffset - desktopContentOffset - 15,overflowY: 'hidden'});
        }
    }
};
DaLei.updateRoute = function (itemid) {
    var a = null;
    var loadMenuInfo = function (a, b) {
        var c = null;
        if (DaLei.ObjUtil.isEmpty(b)) {
            var d = DaLei.CacheUtil.getTemp(DaLei.Const.CACHE_TYPE_SYS_MENU, "{}", !0, !0);
            DaLei.ObjUtil.isNotEmpty(d) && (d = d.treeData.menu,
            DaLei.ObjUtil.isNotEmpty(d) && DaLei.ObjUtil.isNotEmpty(d.items) && (b = d.items))
        }
        DaLei.ObjUtil.isNotEmpty(b) && $.each(b, function (i,b) {
            if (null != c)
                return !1;
            var d = b.menuType;
            if (b.menu && "MENU_DIR" == d && DaLei.ObjUtil.isNotEmpty(b.menu.items)) {
                c = loadMenuInfo(a, b.menu.items)
            } else if ("MENU_ITEM_CTL" == d && a == b.menuCode) {
                c = b
            }
        });
        return c;
    };
    a = loadMenuInfo(itemid, null);
    var routeHtml = "";
    if (a != null && DaLei.ObjUtil.isNotEmpty(a.route)){
        var route = a.route.split("->");
        $.each(route, function (i, menuName) {
            if (i == 0){
                routeHtml += '<li><i class="fa fa-dashboard"></i> ' + menuName + '</li>'
            } else if (i == (route.length - 1)){
                routeHtml += '<li class="active">' + menuName + '</li>';
            } else {
                routeHtml += '<li>' + menuName + '</li>';
            }
        });
    } else {
        if (itemid == "home" || itemid == "indexmenu")itemid = "桌面";
        routeHtml = '<li><i class="fa fa-dashboard"></i> ' + itemid + '</li>'
    }
    $(".route .breadcrumb-footer").html(routeHtml);
};

DaLei.loadWorkflowDefinitionKey = function (menuCode) {
    var postdata = {};
    postdata.menuCode = menuCode;
    var cacheKeyWithMenuCode = DaLei.StrUtil.getMd5(DaLei.JSON.encode(postdata));
    var workFlowDefinitionKey = null;
    var retData = null;
    if(!DaLei.CacheUtil.pageContainsKey(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode)) {
        retData = DaLei.doAction("workflow-def-key-query-action", postdata, null, null, true, false);
        DaLei.CacheUtil.setPage(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode, retData);
    } else {
        retData =  DaLei.CacheUtil.getPage(DaLei.Const.CACHE_TYPE_COMBO_STORE, cacheKeyWithMenuCode);
    }
    if (retData.lstWorkFlowDefinitionKey) {
        workFlowDefinitionKey = retData.lstWorkFlowDefinitionKey[0];
    }
    return workFlowDefinitionKey;
}

/**
 * 显示mask等待信息
 * @param id 标签的id
 */
DaLei.mask = function (id) {
    var selector = "";
    if(id != null && id!=true && $(id).length>0){
        selector = '#content_'+ DaLei.getActiveModule();
    } else if(DaLei.getActiveModule() != null) {
        selector = '#content_'+ DaLei.getActiveModule();
    } else {
        selector = 'body';
    }
    id = DaLei.ObjUtil.isEmpty(id) || id == true || id == 'true' ? selector : id;
    //$("<div style='z-index: 10000;' class=\"datagrid-mask\"><i class=\"fa fa-refresh\"></i></div>").css({
    //    display: "block",
    //    width: "100%",
    //    height: $(window).height()
    //}).appendTo(id);
    //$("<div style='z-index: 10000;' class=\"datagrid-mask-msg\"></div>").html(DaLei.I18N.MASK_WAITING).appendTo(id).css({
    //    display: "block",
    //    height: 40,
    //    //padding:"5 5 10 30",
    //    left: ($(document.body).outerWidth(true) - 190) / 2,
    //    top: ($(window).height() + 100) / 2
    //});
    //$('<div style="z-index: 10000;"><div class="loader-inner line-scale"><div></div><div></div><div></div><div></div><div></div></div></div>').appendTo(id).css({
    //    display: "block",
    //    height: 40,
    //    //padding:"5 5 10 30",
    //    left: ($(document.body).outerWidth(true) - 190) / 2,
    //    top: ($(window).height() + 100) / 2
    //});

    var mask = '<div id="loading" class="loading-mask-action" > '+
            //'<h4>加载中....</h4>' +
        '<div class="loader" style="position: absolute; left: calc(50% - 20px); top: calc(50% - 20px);"><div class="loader-inner line-scale"><div></div><div></div><div></div><div></div><div></div></div></div>'+
            //'<div class="fl spinner3" style="position: absolute; left: calc(50% - 20px); top: calc(50% - 20px);"><div class="dot1"></div><div class="dot2"></div></div>' +
        '</div>';
    $(mask).appendTo(id);
}

/**
 * 隐藏mask显示
 */
DaLei.unmask = function () {
    var datagridMask = $(".loading-mask-action");
    //var datagridMaskMsg = $(".loader-inner");
    (datagridMask.length > 0) && datagridMask.remove();
    //(datagridMaskMsg.length > 0) && datagridMaskMsg.remove();
};

DaLei.saveData = function (actionurl, viewData, uistatus, dtoclass, modulePath, uniqueValidateFields, successFn, failureFn) {
    var postdata = {};
    postdata.viewdata = viewData;
    postdata.dtoClass = dtoclass;
    postdata.uistatus = uistatus;
    postdata.modulePath = modulePath;
    postdata.uniqueValidateFields = uniqueValidateFields;
    return DaLei.doAction(actionurl, postdata, successFn, failureFn, true, true);
};

DaLei.deleteDataByUnids = function (uuids, actionurl, dtoClass, isVoid, callback) {
    var postdata = {};
    postdata.uuids = uuids;
    postdata.dtoClass = dtoClass;
    postdata.isVoid = !!isVoid;
    return DaLei.doAction(actionurl, postdata, callback);
};

/**
 * 获取查询条件
 * @param formItemId 查询条件的formItemId
 * @returns {{}}
 */
DaLei.getFormData = function (formItemId) {
    var postData = {};
    $("[itemId=" + formItemId + "]").serializeArray().map(function (x) {
        if (DaLei.ObjUtil.isNotEmpty(x.value)) {
            postData[x.name] = x.value;
        }
    });
    //判断form中存在check未选中项,并赋值为0
    $('input[type=checkbox]', "[itemId=" + formItemId + "]").not("input:checked").map(function (value, obj) {
        postData[obj.name] = 0;
    });
    return postData;
}

/**
 * 公共参数处理
 * @param actionName 请求名
 * @param viewdata 业务参数
 * @returns {*|{}}
 */
DaLei.commonParamsFactory = function (actionName, viewdata) {
    var b = b || {};
    "sys-user-login" !== actionName && (b.userId = DaLei.CacheUtil.get(DaLei.Const.USER_ID));
    b.userLocaleId = DaLei.getSysConfig("locale_id");
    b.timestamp = Date.now();
    b.network = window.NETWORK_DELAY;
    //DaLei.ObjUtil.isEmpty(b.menuCode) && (b.menuCode = DaLei.getActiveModule() ? DaLei.getActiveModule().menuCode : null );
    b.viewdata = viewdata;
    b.signature = DaLei.getSign(actionName, b);
    return b;
}

/**
 * 查询条件封装函数
 */
DaLei.searchParams = function (actionName, formItemId) {
    return DaLei.commonParamsFactory(actionName, DaLei.getFormData(formItemId));
}

/**
 * 通过页面获取用户页面按钮权限
 * （此权限为禁止使用权限）
 * @param menucode 菜单编码
 */
DaLei.getMenuButtonsPrivilege = function (menucode) {
    var functions = null;
    var menuArr = DaLei.CacheUtil.get(DaLei.Const.USER_PRIVILEGES);
    var menu = menuArr[menucode];
    if (DaLei.ObjUtil.isNotEmpty(menu)) {
        functions = menu.functionList;
    }
    return functions;
}

/**
 * 获取用户收藏页面
 */
DaLei.getFavoriteMenus = function () {
    var menus = DaLei.CacheUtil.getTemp(DaLei.Const.CACHE_TYPE_SYS_MENU, {}, !0, !0);
    var favorites = menus.userFavorites;
    return "favorites";
}


DaLei.getCurrentUserId = function () {
    return DaLei.CacheUtil.get(DaLei.Const.USER_ID);
};

DaLei.getUserCountry = function () {
    return DaLei.CacheUtil.get(DaLei.Const.USER_COUNTRY_CODE);
};

DaLei.getUserCity = function () {
    return DaLei.CacheUtil.get(DaLei.Const.USER_CITY_CODE);
};

DaLei.getUserCurrency = function () {
    return DaLei.CacheUtil.get(DaLei.Const.USER_CURRENCY_CODE);
};

DaLei.wrapDataForRemoveSystemFields = function (data) {
    if (DaLei.ObjUtil.isEmpty(data)) {
        return;
    }

    if (data instanceof Array) {
        $.each(data, function (dataItem) {
            DaLei.wrapDataForRemoveSystemFields(dataItem);
        })
    } else if (data instanceof Object) {
        for (var item in data) {
            if (!data.hasOwnProperty(item)) continue;//防止获得原型链中的属性

            if ((item == 'createBy') || (item == 'createTime') || (item == 'updateBy') || (item == 'updateTime')
                || (item == 'isVoid') || (item == 'locTimezone') || (item == 'tblVersion') || (item == 'uuid')) {
                data[item] = null;
            } else if (item == 'editflag') {
                data[item] = '+';
            } else if (data[item] instanceof Array || data[item] instanceof Object) {
                DaLei.wrapDataForRemoveSystemFields(data[item]);
            }
        }
    }
};

DaLei.getExportFileName = function (moduleName, template) {
    var filename = DaLei.StrUtil.replaceAll(template, '{module}', moduleName);
    var datePatten = template.match(/\{D(.*)}/);
    if (datePatten !== null && datePatten.length == 2) {
        var mon = moment(new Date(Date.now()));
        filename = DaLei.StrUtil.replaceAll(filename, datePatten[0],
            mon.format(datePatten[1]));
    }
    return filename;
};


/**
 * 日期格式化
 * @param date
 * @returns {string}
 */
DaLei.dateFormatter = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}

/**
 * 时间格式化
 * @param datetime
 * @returns {*}
 */
DaLei.datetimeFormatter = function (datetime) {
    if (datetime == null || datetime == "")
        return "";
    else {
        var date = new Date(datetime);
        var y = date.getFullYear();
        var mon = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        return y + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (d < 10 ? ('0' + d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m) + ':' + (s < 10 ? ('0' + s) : s);
    }
}

/**
 * 将日期格式(yyyy-MM-dd)的字符串值转化为日期类型
 * @param s
 * @returns {Date}
 */
DaLei.dateParser = function dateParser(s) {
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
};

/**
 * 日期比较
 * @param startDate
 * @param endDate
 * @returns {boolean}
 */
DaLei.dateCompare = function (startDate, endDate) {
    debugger;
    if (DaLei.dateParser(startDate) > DaLei.dateParser(endDate))
    {
        return false;
    }
    else
        return true;
}

/**
 * 检查日期是否合法
 * @param date   yyyy-MM-dd
 * @returns {boolean}
 */
DaLei.dateCheck = function (date) {
    return (new Date(date).getDate() == date.substring(date.length - 2));
}

/**
 * 检查时间是否合法
 * @param date yyyy-MM-dd hh:mm:ss
 * @returns {boolean}
 */
DaLei.timeCheck = function (date) {
    return (new Date(date).getSeconds() == date.substring(date.length - 2));
}

DaLei.setFavoriteMenu = function () {
    var count = 0;
    var favorite = DaLei.getFavoriteMenus();
    if (favorite) {
        count = favorite.length;
    }
    var html = "";
    for (var i in favorite) {
        var moduleData = favorite[i];
        html += '<li style="width:100%;float: left "><a href="javascript:void(0)"  class="taglink" itemId="' + moduleData.menuCode +
            '" menutype="' + moduleData.menuType + '" actionparams="' + moduleData.actionParams +
            '" taglinkref="' + moduleData.menuAction + '" title="' + moduleData.text + '" style="float: left;width: 90%;vertical-align: middle">' +
            '<i class="fa fa-circle-o text-aqua"></i> <span>' + moduleData.text + '</span>' +
            '</a><i style="cursor:pointer" itemId="favoriteliremove" menucode="' + moduleData.menuCode + '" class="fa fa-trash favoretRemove"></i></li>';
    }
    $("#favoritemenu").children().remove();
    $("#favoritemenu").append(html);
    //设置收藏页个数
    $("#favoritecount").text(count);
    $("#favoriteheader").text("你有" + count + "个收藏页面");

    //注册收藏菜单点击事件
    $("#favoritemenu a").click(function (e) {
        if (e.type != "keypress" || kendo.keys.ENTER == e.keyCode) {
            var title = $(this).attr("title") == "" ? $(this).text() : $(this).attr("title");
            var linkhref = $(this).attr("taglinkref");
            var itemid = $(this).attr("itemid");
            var timestamp =  new Date().getTime();
            if(DaLei.ObjUtil.isNotEmpty(DaLei.CacheUtil.getTemp(DaLei.Const.CACHE_MODULE_TAB, itemid)) && (timestamp - DaLei.CacheUtil.getTemp(DaLei.Const.CACHE_MODULE_TAB, itemid)) < 3000) {
                return;
            } else {
                DaLei.CacheUtil.setTemp(DaLei.Const.CACHE_MODULE_TAB, itemid, new Date().getTime())
            }
            //判断页面类型
            var menutype = $(this).attr("menutype");
            //参数设置
            var actionparams = $(this).attr("actionparams");
            DaLei.openTab(linkhref, title, itemid, menutype, actionparams);
        }
    });
    //注册删除按钮点击事件
    $("#favoritemenu [itemId=favoriteliremove]").click(function (e) {
        var itemid = $(this).attr("menucode");
        //改变一打开收藏也的图标
        var star= $("#navtabstrip [itemId=star]")
        //删除收藏
        DaLei.removeFavorite(itemid, star);
    });
}

/**
 * 添加收藏页
 * @param menuCode
 * @param star 收藏按钮对象
 */
DaLei.addFavorite = function (menuCode, star) {
    DaLei.Msg.confirm("提示", DaLei.I18N.ADD_TO_MY_FAVORITE, function (ok) {
        if (ok) {
            if (star) {
                star.removeClass();
                star.addClass("fa fa-star");
            }
            DaLei.doAction("sys-menu-add-favorite", {
                menuCode: menuCode
            }, function (a) {
                var sys_menu = DaLei.CacheUtil.getTemp(DaLei.Const.CACHE_TYPE_SYS_MENU, {}, !0, !0);
                sys_menu.userFavorites = a.userFavorites;
                DaLei.CacheUtil.setTemp(DaLei.Const.CACHE_TYPE_SYS_MENU, {}, sys_menu, !0, !0);
                DaLei.setFavoriteMenu();
            })
        }
    })
}

/**
 * 删除收藏页
 * @param menuCode
 * @param star 收藏按钮对象
 */
DaLei.removeFavorite = function (menuCode, star) {
    DaLei.Msg.confirm("提示", DaLei.I18N.REMOVE_FROM_MY_FAVORITE, function (ok) {
        if (ok) {
            if (star) {
                star.removeClass();
                star.addClass("fa fa-star-o");
            }
            DaLei.doAction("sys-menu-remove-favorite", {
                menuCode: menuCode
            }, function (a) {
                var sys_menu = DaLei.CacheUtil.getTemp(DaLei.Const.CACHE_TYPE_SYS_MENU, {}, !0, !0);
                sys_menu.userFavorites = a.userFavorites;
                DaLei.CacheUtil.setTemp(DaLei.Const.CACHE_TYPE_SYS_MENU, {}, sys_menu, !0, !0);
                DaLei.setFavoriteMenu();
            })
        }
    })
}

DaLei.uploadFile = function (uploadaction, windowId, fileId, buttonId, caller, oldfile, callback) {
    DaLei.calPopupWindowPosition(windowId, caller);
    caller.view.getCmp(windowId).modal({backdrop: 'static', keyboard: false});
    caller.view.getCmp(windowId).modal('show');
    caller.view.getCmp(windowId).getCmp(buttonId).sotEnable();
    if(oldfile){
        caller.view.getCmp(windowId).getCmp(fileId).sotValue(oldfile);
    }
    caller.view.getCmp(windowId).getCmp(buttonId).bind('click',function(e){
        var param = {};
        caller.view.getCmp(windowId).getCmp(buttonId).sotDisable();
        var fileName = caller.view.getCmp(windowId).getCmp(fileId).gotValue();
        param.type = fileName.slice(fileName.lastIndexOf(".")+1);
        param.fileName = fileName;
        param.actionName = uploadaction;
        if(DaLei.ObjUtil.isEmpty(param.fileName)) {
            return;
        }
        caller.view.getCmp(fileId).bFile("uploadFiles", param,
            function (data) {
                if(data.success) {
                    caller.view.getCmp(windowId).modal('hide');
                    DaLei.Msg.info("上传成功！");
                    var fileData = data.fileData;
                    if(callback){
                        callback(fileData);
                    }
                }
            }, null, null,null, null, function(e){});
    })
};

DaLei.fileDownLoad = function (fileList) {
    if (DaLei.ObjUtil.isEmpty(fileList)) {
        DaLei.Msg.info("请选择记录！");
    } else {
        var postData = {};
        postData.uuids = fileList;
        var ret = DaLei.doAction("filemanager-filedownload", postData, function(ret){
            var urlList = ret.URL_LIST;
            if (urlList && urlList.length > 0) {
                for (var i = 0; i < urlList.length; i++) {
                    window.open(urlList[i]);
                }
            }
        }, null, false, false);
    }
};

DaLei.popWindow = function (linkhref, title, itemid, actionparams, width, showbtn, callback) {
    var modalId = "popWindowModal" + itemid;
    var closeBtnId = "popWinCloseBtn" + itemid;
    var bottomCloseBtnId = "popWinCloseBtnBottom" + itemid;
    var okBtnId = "popWinOkBtn" + itemid;
    var winHtml = '<div class="modal fade popup-modal" id="'+ modalId  + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';

    if(width) {
        winHtml += '<div class="modal-dialog" style="width: '+ width+'">';
    } else {
        winHtml += '<div class="modal-dialog">';
    }
    winHtml += '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" id="'+ closeBtnId + '"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '<h5 class="modal-title" id="popWindowTitle"><i class="fa fa-file-text" style="color: #337ab7; padding-right: 2px;"></i>'+ title + '</h5>' +
        '</div>' +
        '<div class="modal-body"><style>#'+ modalId + ' .col-xs-12,.col-sm-12,.col-md-12,.col-lg-12{float: none}</style>' +
        ' </div>' + showButton(showbtn) +
        '</div>' +
        '</div>' +
        '</div>';
    $("body").append(winHtml);

    var modal = $('#'+ modalId);
    //控制弹窗高度
    var height = showbtn ? "calc(100vh - 181px)" : "calc(100vh - 108px)";
    modal.find(".modal-dialog .modal-body").css({"maxHeight": height, "overflow": "hidden"});

    modal.find(".modal-dialog .modal-body").slimscroll({
        height: '100%',
        alwaysVisible: false,
        size: "3px"
    });
    //结束

    modal.modal({backdrop: 'static', keyboard: false}).show();
    modal.on("show.bs.modal", function(e){
        $('#' + modalId).off("click.dismiss.bs.modal");
    });
    modal.on("hidden.bs.modal", function(e){
        if(e.target == $('#' + modalId)[0]) {
            $('#' + modalId,$("body")).remove();
        }
    });
    $("#" + closeBtnId).on("click", function(e){
        $('#'+ modalId).modal("hide");
    });
    $("#" + bottomCloseBtnId).on("click", function(e){
        $('#'+ modalId).modal("hide");
    });
    var popController = null;
    $("#" + okBtnId).on("click", function(e){
        if(popController && popController.validate){
            if(popController.validate()){
                $('#' + modalId).modal("hide");
            } else {
                return;
            }
        } else {
            $('#' + modalId).modal("hide");
        }
        if(callback && popController){
            var postdata = null;
            if(popController.prepareCallBackData){
                postdata = popController.prepareCallBackData();
            } else {
                postdata = popController.view.gotValue();
            }
            callback(postdata);
        }
    });
    function showButton(showbtn){
        if(showbtn && showbtn == true){
            return ' <div class="modal-footer">' +
                '<button type="button" id="' + bottomCloseBtnId + '" class="btn btn-default" data-dismiss="modal">取消</button>' +
                '<button type="button" id="' + okBtnId +'" class="btn btn-primary">确定</button>' +
                '</div>';
        } else {
            return '';
        }
    };
    //setTimeout(function(){
    DaLei.loadComponent(linkhref)
        .done(function(controller) {
            //if(!!itemid) {
            //    DaLei.CacheUtil.setTemp(DaLei.Const.CACHE_ACTIVE_MODULE, DaLei.Const.CACHE_ACTIVE_MODULE_KEY, itemid);
            //}

            var params = actionparams || {};
            if(controller.pagePath){
                params.pagePath = controller.pagePath;
            }
            DaLei.loadFreeMarkerPage(DaLei.ObjUtil.isEmpty(controller.loadPageAction)?DaLei.Const.COMMON_LOADPAGE:controller.loadPageAction, params, function(data, status){
                $("#" + modalId +" .modal-body").append(data);
                DaLei.initComboStores($('#' + modalId), itemid, controller.pageCacheRefresh);
                if(typeof($.parser) != 'undefined' && typeof($.parser) != 'null') {
                    $.parser.parse($('#' + modalId));
                }
                DaLei.bootstrapParse($('#' + modalId), controller, itemid);
                controller.init($('#' + modalId), params, itemid, title);
                popController = controller;
                DaLei.calPopupWindowPositionWithController(modalId);
            })
        })
        .fail(function() {
            throw new Error("Load component " + linkhref + " fail !");
        });
    //}, 200);

};

DaLei.popupSearch = function (caller, queryWinId, queryConditionPanelId, queryResultGridId, queryConditionFormId, reffield, queryAction, postdata, callback, dblclickaction, multiple) {
    DaLei.calPopupWindowPosition(queryWinId, caller);
    //控制弹窗高度
    var height = "calc(100vh - 181px)";
    caller.view.getCmp(queryWinId).find(".modal-dialog .modal-body").css({"maxHeight": height, "overflow": "hidden"});
    // $winHtml.find(".modal-dialog,.modal-content").css({"maxHeight": "calc(100vh - 60px)", "overflow": "hidden"});
    caller.view.getCmp(queryWinId).find(".modal-dialog .modal-body").slimscroll({
        height: '100%',
        alwaysVisible: false,
        size: "3px"
    });
    //结束


    caller.view.getCmp(queryWinId).modal({backdrop: 'static', keyboard: false});
    caller.view.getCmp(queryWinId).on('shown.bs.modal', function () {
        $(this).doLayout();
    });
    caller.view.getCmp(queryWinId).modal('show');
    var conditionPanel = caller.view.getCmp(queryWinId).getCmp(queryConditionPanelId);
    if (DaLei.ObjUtil.isNotEmpty(postdata) && DaLei.ObjUtil.isNotEmpty(queryConditionFormId)) {
        conditionPanel.getCmp(queryConditionFormId).sotValue(postdata);
    }
    caller.view.getCmp(queryWinId).getCmp("queryButton").unbind('click').bind('click', function (e) {
        var param = conditionPanel.bPanel("gotCondition");
        //me._resultTableLoadData(param, queryAction);
        param.btnQuery = 1;
        param.actionName = queryAction;
        param.xtype = "e_datagrid";
        var resultGrid = caller.view.getCmp(queryWinId).getCmp(queryResultGridId);
        param.columns = resultGrid.datagrid('getColumnFields');
        resultGrid.data("datagrid").options.loader =
            function (param, success, error) {
                DaLei.loadFreeMarkerAction(param.actionName, param, function (data) {
                    success(data);
                }, function (e) {
                    error(e);
                });
            };
        resultGrid.datagrid('load', param);
        resultGrid.data("datagrid").options.onDblClickRow = function (index, row) {
            if(DaLei.ObjUtil.isNotEmpty(dblclickaction)) {
                dblclickaction(index,row);
            }
        }
    });
    if(caller.view.getCmp(queryWinId).getCmp("resetBtn") && caller.view.getCmp(queryWinId).getCmp("resetBtn") != null){
        caller.view.getCmp(queryWinId).getCmp("resetBtn").unbind('click').bind('click', function (e) {
            conditionPanel.getCmp(queryConditionFormId).sotValue(null);
        });
    }
    if(caller.view.getCmp(queryWinId).getCmp("cancelBtn") && caller.view.getCmp(queryWinId).getCmp("cancelBtn") != null){
        caller.view.getCmp(queryWinId).getCmp("cancelBtn").unbind('click').bind('click', function (e) {
            caller.view.getCmp(queryWinId).modal('hide');
        });
    }
    if(caller.view.getCmp(queryWinId).getCmp("okBtn") && caller.view.getCmp(queryWinId).getCmp("okBtn") != null){
        caller.view.getCmp(queryWinId).getCmp("okBtn").unbind('click').bind('click', function (e) {
            var selections = caller.view.getCmp(queryWinId).getCmp(queryResultGridId).datagrid("getSelections");
            if(DaLei.ObjUtil.isEmpty(selections)){
                DaLei.Msg.warn("请选择一条记录！");
            } else {
                var selectRecord = selections[0];
                if(DaLei.ObjUtil.isNotEmpty(reffield)) {
                    var fields = reffield.split(",");
                    for(var i = 0; i < fields.length; i++){
                        var field = fields [i];
                        if(field.indexOf("|") != -1){
                            field = field.split("|");
                            caller.view.getCmp(field[0]).sotValue(selectRecord[field[1]]);
                        } else {
                            caller.view.getCmp(field).sotValue(selectRecord[field]);
                        }
                    }
                }
                if (callback) {
                    if(multiple) {
                        callback(selections);
                    } else {
                        callback(selectRecord);
                    }
                }
                caller.view.getCmp(queryWinId).modal('hide');
            }
        });
    }

};

DaLei.popupSearchColWin = function (linkhref, title, actionparams, queryResultGridId, style, callback, dblclickaction) {

    queryResultGridId = queryResultGridId || "resultGrid";

    var winId = "popupSearchColWin_" + DaLei.StrUtil.getUUID();

    var winHtml = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';

    if(style) {
        winHtml += '<div class="modal-dialog" style="'+ style + '">';
    } else {
        winHtml += '<div class="modal-dialog modal-lg">';
    }
    winHtml += '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '<h5 class="modal-title" id="popWindowTitle"><i class="fa fa-file-text" style="color: #337ab7; padding-right: 2px;"></i>'+ title + '</h5>' +
        '</div>' +
        '<div class="modal-body">' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
        '<button type="button" itemId="okBtn" class="btn btn-primary">确定</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    var $winHtml = $(winHtml);
    $winHtml.attr("id", winId);
    //控制弹窗高度
    var height = "calc(100vh - 181px)";
    $winHtml.find(".modal-dialog .modal-body").css({"maxHeight": height, "overflow": "hidden"});
    // $winHtml.find(".modal-dialog,.modal-content").css({"maxHeight": "calc(100vh - 60px)", "overflow": "hidden"});
    $("body").append($winHtml);
    $winHtml.find(".modal-dialog .modal-body").slimscroll({
        height: '100%',
        alwaysVisible: false,
        size: "3px"
    });
    //结束
    $winHtml.on("hidden.bs.modal", function(e){
        $(this).remove();
    });

    setTimeout(function(){
        DaLei.loadComponent(linkhref)
            .done(function (controller) {
                var params = actionparams || {};
                if (controller.pagePath) {
                    params.pagePath = controller.pagePath;
                }
                DaLei.loadFreeMarkerPage(DaLei.ObjUtil.isEmpty(controller.loadPageAction) ? DaLei.Const.COMMON_LOADPAGE : controller.loadPageAction, params, function (data, status) {
                    $winHtml.find(".modal-body").append(data);
                    if (typeof($.parser) != 'undefined' && typeof($.parser) != 'null') {
                        $.parser.parse($winHtml);
                    }

                    DaLei.bootstrapParse($winHtml, controller);
                    controller.init($winHtml, params, null, title);

                    var resultGrid = $winHtml.getCmp(queryResultGridId);
                    resultGrid.data("datagrid").options.onDblClickRow = dblclickaction;
                    if($winHtml.getCmp("okBtn") && $winHtml.getCmp("okBtn") != null){
                        $winHtml.getCmp("okBtn").unbind('click').bind('click', function (e) {
                            var selections = $winHtml.getCmp(queryResultGridId).datagrid("getSelections");
                            if(DaLei.ObjUtil.isEmpty(selections)){
                                DaLei.Msg.warn("请选择一条记录！");
                            } else {
                                if (callback) {
                                    callback(selections);
                                }
                                $winHtml.modal('hide');
                            }
                        });
                    }
                })
            })
            .fail(function () {
                throw new Error("Load component " + linkhref + " fail !");});
    }, 100);
    $winHtml.modal({backdrop: 'static', keyboard: false}).show();
};
DaLei.fileExport = function (action, data) {
    var postData = data || {};
    postData.actionName = action;
    postData.userId = DaLei.CacheUtil.get(DaLei.Const.USER_ID);
    postData.userLocaleId = DaLei.getSysConfig("locale_id");
    postData.timestamp = Date.now();
    postData.network = window.NETWORK_DELAY;
    postData.signature = DaLei.getSign(action, postData);

    var timestamp = new Date().getTime();
    var formId = "DaLeiHiddenJspForm" + timestamp;

    var formatFormId = "#" + formId;
    var form=$('<form class="hidden" id="'+ formId + '" action="controller/json.action" method="post" style="display:none"></form>');
    form.append('<input type="hidden" name="postData" id="postData"/>');
    form.append('<input type="hidden" name="actionName" id="actionName"/>');

    $("body").append(form);
    $("#postData", $(formatFormId)).val(DaLei.JSON.encode(postData));
    $("#actionName", $(formatFormId)).val(action);
    form.submit();
    $(formatFormId).remove();
};

//调整弹出框的位置, for 弹出的页面在基本的ftl页面里面
DaLei.calPopupWindowPosition = function (componentId, calller) {
    calller.view.getCmp(componentId).off('show.bs.modal').on('show.bs.modal', function () {
        var $this = $(this);
        calller.view.getCmp(componentId).css("display", "block");
        calller.view.getCmp(componentId + " .modal-dialog").css({
            "margin": "0px",
            "top": function () {
                return (document.documentElement.clientHeight - $this.find(".modal-dialog").height()) / 2 + "px";
            },
            "left": function () {
                return (document.documentElement.clientWidth - $this.find(".modal-dialog").width()) / 2 + "px";
            }
        });
    })
};

//调整弹出框的位置，for弹出的页面用controller的方式实现
DaLei.calPopupWindowPositionWithController = function(id){
    var thisWin = $('#'+ id ).length > 0 ? $('#'+ id ) : $('[itemId="'+id+'"]') ;
    thisWin.off('shown.bs.modal').on('shown.bs.modal', function () {
        $(this).doLayout();
        $(thisWin).find(" .modal-dialog").css({
            "margin": "0px",
            "top": function () {
                return (document.documentElement.clientHeight  - $(thisWin).find(" .modal-dialog").height()) / 2 + "px";
            },
            "left": function () {
                return (document.documentElement.clientWidth  - $(thisWin).find(" .modal-dialog").width()) / 2 + "px";
            }
        });

    })
    thisWin.modal({backdrop: 'static', keyboard: false});
    thisWin.modal('show');
};


//窗体大小改变延时触发事件方法
DaLei.resizeDelayed = function (ele, options) {
    var defaults = {
        delay: 200,
        callback: null
    };

    var o = $.extend(defaults, options);

    var resize = {
        _timeout: false,
        init: function () {
            var me = this;
            ele.on("resize", function () {
                me.initResize();
            });
        },
        getUTCDate: function (h) {
            h = h || new Date();
            return Date.UTC(h.getUTCFullYear(), h.getUTCMonth(), h.getUTCDate(), h.getUTCHours(), h.getUTCMinutes(), h.getUTCSeconds(), h.getUTCMilliseconds());
        },
        initResize: function () {
            var me = this;
            me.controlTime = me.getUTCDate();
            if (me._timeout === false) {
                me._timeout = true;
                return setTimeout(function() {
                    return me.runCallback(me)
                }, me.delay)
            }
        },
        runCallback: function (me) {
            var g = me.getUTCDate();
            if (g - me.controlTime < o.delay) {
                return setTimeout(function () {
                    return me.runCallback(me)
                }, o.delay)
            } else {
                me._timeout = false;
                return o.callback&&o.callback()
            }
        }
    };
    resize.init();
    return ele;
};
/**
 * 计算调整左侧树形面板，并给树加滚动条
 * @param framePanel
 */
DaLei.calculateLeftPanelHeight = function (framePanel) {
    var windowHeight = $(window).height();
    var footerOffset = windowHeight;
    if($('footer.main-footer').length>0) {
        footerOffset = $('footer.main-footer').offset().top;
    }
    var querypanelOffsetTop = null;
    if($(framePanel).find("[itemid='queryPanel']").length>0) {
        querypanelOffsetTop = $(framePanel).find("[itemid='queryPanel']").offset().top;
    }
    var desktopContentOffset = $("#desktop-content").offset().top;
    var stdOffsetTop = null;
    if(querypanelOffsetTop && querypanelOffsetTop >0) {
        stdOffsetTop = querypanelOffsetTop;
    } else {
        stdOffsetTop = desktopContentOffset;
    }
    //设置左侧面板高度
    $(framePanel).find("[itemid='queryPanel']").css({minHeight: footerOffset - stdOffsetTop - 15});

    var headerHeight = $(framePanel).find("[itemid='queryPanel']>.box-header").outerHeight(true);
    //设置内容body高度
    $(framePanel).find("[itemid='queryPanel']>.box-body").css({height: footerOffset - stdOffsetTop - 15 - headerHeight});

    var treeTop = $(framePanel).find("[itemid='treeMenu']").offset().top;

    var childrens = $(framePanel).find("[itemid='queryPanel']>.box-body").children();
    if(childrens.length>0) {
        var boxbodyHeight = $(framePanel).find("[itemid='queryPanel']>.box-body").height();
        var treeDiv = null;
        //减去不属于树形控件的组件高度
        $.each(childrens, function (i, comp) {
            if($(comp).has("[itemid='treeMenu']").length>0  || $(comp).is("[itemid='treeMenu']")) {
                treeDiv = $(comp);
            } else {
                boxbodyHeight = boxbodyHeight - $(comp).outerHeight(true);
            }
        });
        if(treeDiv) {
            treeDiv.css({height: boxbodyHeight});
            if(!treeDiv.is("[itemid='treeMenu']")) {
                //树形组件里还有其他组件的情况
                boxbodyHeight  = treeDiv.height();
                childrens = treeDiv.children();
                $.each(childrens, function (i, comp) {
                    if($(comp).has("[itemid='treeMenu']").length>0  || $(comp).is("[itemid='treeMenu']")) {
                        treeDiv = $(comp);
                    } else {
                        boxbodyHeight = boxbodyHeight - $(comp).outerHeight(true);
                    }
                });
                treeDiv.css({height: boxbodyHeight});
            }
            treeDiv.slimscroll({
                height: boxbodyHeight + 'px',
                alwaysVisible: false,
                size: "3px"
            });
        }
    }
}

//计算动态计算dom高度方法
DaLei.calculateHeight = function (view, options) {

    var defaults = {
        slimscrollDomItemId: null,
        needCalculateDomItemId: null,
        needCutHeightDomItemIds: [],
        cutExtraHeight: 0
    };
    var o = $.extend(defaults, options);
    view.getCmp(o.slimscrollDomItemId).slimscroll({
        height: '100%',
        alwaysVisible: false,
        size: "3px"
    });

    var calculate = function(){
        var innerHeight = window.innerHeight;
        var $navtab = $("#navtabstrip").find(".nav-tabs").eq(0);
        var $header = $("header.main-header");
        var $footer = $("footer.main-footer");
        var resultPanel = view.getCmp(o.needCalculateDomItemId);
        var height = innerHeight - ($navtab.outerHeight() + $header.outerHeight() + $footer.outerHeight() + o.cutExtraHeight);

        $.each(o.needCutHeightDomItemIds, function (i, itemId) {
            height = height - view.getCmp(itemId).outerHeight();
        });

        //resultPanel.outerHeight(height);
        resultPanel.animate({'height': height},200);
    };

    DaLei.resizeDelayed($(window),{
        callback: calculate
    });
    calculate();
}

DaLei.registDoLayout = function(ele) {
    $(ele).on("click", '[data-widget="collapse"]', function(e) {
        $(this).closest("[xtype='bPanel']").bPanel("doLayout");
    });
}
