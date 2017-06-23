var mergeFile_split=null;
var abstractMvc = function($) {
    /*  AbstractController
     **  AbstractView
     **  AbstractModel
     **
     */
    DaLei.define("DaLei.bootstrap.mvc.AbstractController", {
        viewClass: 'DaLei.bootstrap.mvc.AbstractView',
        modelClass: 'DaLei.bootstrap.mvc.AbstractModel',
        view: null,
        actionparams: null,
        UDID:null,
        orgCtrUDID:null,
        menuCode: null,
        useBootstrapExportXls:false,
        init: function(ele,actionparams, menuCode, menuText) {
            var contr = this;
            contr.UDID = DaLei.StrUtil.getUUID();
            contr.menuCode = menuCode;
            contr.menuText = menuText;
            var tempEle = ele;
            this.actionparams = actionparams;
            if(actionparams && typeof actionparams == "object" && actionparams.orgCtrUDID) {
                contr.orgCtrUDID = actionparams.orgCtrUDID;
            }
            DaLei.loadComponent(this.viewClass)
                .done(function(viewObj){
                    contr.view = viewObj;
                    contr.view.controller = contr;
                    contr.view.ele = tempEle;
                    contr.view.menuCode = contr.menuCode;
                    contr.view.menuText = contr.menuText;
                    if(contr.view.init) {
                        try {
                            contr.view.init();
                        } catch (error) {
                            DaLei.DebugUtil.logErr("view init error occur! " + error.stack)
                        }

                        if(contr.initCtr) {
                            try {
                                contr.initCtr();
                            } catch (error) {
                                DaLei.DebugUtil.logErr("controller initCtr error occur! " + error.stack)
                            }
                        }
                        contr.view._afterInit();
                    }
                    contr.registerEvents();
                    if(contr.view.viewType==2){
                        contr.loadTreeMenu();
                    }
                    if(contr.tabChange) {
                        contr.tabChange(contr);
                    }
                    contr._workFlowLoad();

                    if(contr.afterInit) {
                        contr.afterInit();
                    }
                })
                .fail(function(){
                    throw new Error("can not load module view!");
                });
            if(this.modelClass) {
                DaLei.loadComponent(this.viewClass)
                    .done(function(){

                    })
                    .fail(function(){
                        throw new Error("can not load module model!");
                    });
            }
        },
        _workFlowLoad: function(){
            var me = this;
            if (me.view && DaLei.ObjUtil.isNotEmpty(me.actionparams) && DaLei.ObjUtil.isNotEmpty(me.actionparams.wf_businessKey)) {
                var businessKey = me.actionparams.wf_businessKey;
                if (DaLei.ObjUtil.isNotEmpty(businessKey)) {
                    me.loadItem(businessKey);
                }
            }
        },
        loadTreeMenu:function(){
            var me = this;
            var treeName = me.view.getCmp("treeMenu");
            //DaLei.doAction(me.queryAction,{}, function(e){
            //    if(e.success){
            //        treeName.tree({
            //            data : e.children,
            //            onClick: function(node){
            //                $(node.target).find('.tree-hit').click();
            //                me.loadItem(node.uuid);
            //            }
            //        });
            //        treeName.tree("collapseAll");
            //    }
            //});
            //$("#desktop-content").height("auto");
            //treeName.css({'height':document.documentElement.clientHeight-200,'overflow':'auto'});
        }
        ,
        registerEvents: function () {
            var me = this;
            var events = $.merge(me.events || [], me.extraEvents || []) || [];

            $.each(events, function (i, event) {
                var itemId = event.itemId;
                try {
                    var name = event.name;
                    var fn = me[event.fn];

                    var comp = me.view.getCmp(itemId);
                    if (DaLei.ObjUtil.isNotEmpty(comp) && DaLei.ObjUtil.isNotEmpty(fn)) {
                        var xtype = comp.attr("xtype");
                        if(xtype) {
                            var compObj = comp.data(xtype);
                            if(compObj.bind && $.isFunction(compObj.bind) && "on" == name.substring(0,2)) {
                                compObj.bind(name, fn.bind(me));
                                return true;
                            }
                        }
                        if(name == 'click') {
                            var fun = function () {
                                if(comp.attr("disclick") == 'disclick') {
                                    // console.log("ttt");
                                    return null;
                                }
                                // console.log("click");
                                comp.attr("disclick","disclick");
                                var args = [];
                                if(arguments.length>=1) {
                                    for(var i=0;i<arguments.length; i ++) {
                                        args.push(arguments[i]);
                                    }
                                }
                                var ret = fn.apply(me,args);
                                setTimeout(function () {
                                    comp.removeAttr("disclick");
                                },500);
                                return ret;
                            }
                            comp.on(name, fun.bind(me));
                        } else {
                            comp.on(name, fn.bind(me));
                        }

                    } else if(DaLei.ObjUtil.isNotEmpty(fn)) {
                        var itemIds = itemId.split("->");
                        var itemIdSelector = "";
                        for (var i = 0; i < itemIds.length; i++) {
                            itemIdSelector += "[itemId='"+ itemIds[i]+ "']" + " ";
                        }
                        if(name == 'click') {
                            var fun = function () {
                                if($(this).attr("disclick") == 'disclick') {
                                    // console.log("ttt");
                                    return null;
                                }
                                // console.log("click");
                                $(this).attr("disclick","disclick");
                                var args = [];
                                if(arguments.length>=1) {
                                    for(var i=0;i<arguments.length; i ++) {
                                        args.push(arguments[i]);
                                    }
                                }
                                var ret = fn.apply(me, args);
                                setTimeout(function () {
                                    $(this).removeAttr("disclick");
                                },500);
                                return ret;
                            }
                            me.view.ele.off(name, itemIdSelector).on(name,itemIdSelector, fun);
                        } else {
                            me.view.ele.off(name, itemIdSelector).on(name,itemIdSelector, fn.bind(me));
                        }
                    }
                } catch (error) {
                    DaLei.DebugUtil.logErr(itemId + " register event error occur!" + error.stack);
                }
            });
        },

        getCaller: function() {
            var caller = null;
            if(this.orgCtrUDID && window.opener) {
                var orgWinCurrentCtr = window.opener.DaLei.ModuleManager.getObject("currentCtr");
                if(orgWinCurrentCtr) {
                    caller = window.opener.DaLei.ModuleManager.getObject(this.orgCtrUDID);
                    if(caller && caller._compName === orgWinCurrentCtr._compName) {
                        return orgWinCurrentCtr;
                    }
                }
            }
            return null;
        },
        gotCaller: function() {
            var caller = null;
            if(this.orgCtrUDID) {
                caller = DaLei.ModuleManager.getObject(this.orgCtrUDID);
                if(caller && caller.view && caller.view.ele) {
                    var id = caller.view.ele.attr("id");
                    if($("#"+id).length>0) {
                        return caller;
                    }
                }
            }
            return null;
        }
    });

    DaLei.define("DaLei.bootstrap.mvc.AbstractView", {
        canEdit: true,
        ele:null,
        editflag:"",
        uistatus:"",
        controller:null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        viewType:1,
        menuText:null,
        uuidMapping:'uuid',

        init: function() {
            if(this.initView) {
                this.initView();
            }
            this.uistatus = DaLei.Const.UI_INFO_STATUS_NULL;
            if(this.afterInitView) {
                this.afterInitView();
            }
        },
        _afterInit: function() {
            if(this.afterInit) {
                this.afterInit();
            }

            //添加mCustomScrollbar滚动条
            // if(!DaLei.getSysConfig("pure_bootstrap")) {
            //     $(".overflow-mCustomScrollbar").mCustomScrollbar({})
            // }

            var tables = $("table[xtype='bTable']", this.ele);
            if(tables && tables.length > 0) {
                $.each(tables, function(i, table) {
                    $(table).bTable("_initTableInView");
                })
            }
        },
        getCmp: function(itemId) {
            if(this.ele) {
                return this.ele.getCmp(itemId);
            }
            return null;
        },
        gotValue: function () {
            var dirtyOnly = false;
            var me = this, cmpData = {}, bindings = me.bindings;
            if(me.editflag == "+") {
                dirtyOnly = false;
            }
            if (bindings) {
                $.each(bindings, function (itemIndex, item) {
                    var lastSplitItem = DaLei.StrUtil.getLastSplit(item, ".");
                    var itemObj = me.getCmp(lastSplitItem);
                    if (DaLei.ObjUtil.isNotEmpty(itemObj)) {
                        var itemArr = item.split(".");
                        if (itemArr.length == 1) {
                            var dataItem = itemObj.gotValue(dirtyOnly, me.editflag);
                            var xtype = itemObj.attr("xtype");
                            for (var i = 0; i < 5; i++) {
                                var itemObjAppend1 = me.getCmp(lastSplitItem + ".append" + ((i == 0) ? "" : i));
                                if (DaLei.ObjUtil.isNotEmpty(itemObjAppend1)) {
                                    DaLei.copy(dataItem, itemObjAppend1.gotValue(dirtyOnly, me.editflag));
                                } else {
                                    break;
                                }
                            }

                            if("bForm" === xtype || "bPanel" === xtype) {
                                dataItem.editflag = me.editflag;
                                var toList = itemObj.attr("toList");
                                if("true" == toList) {
                                    cmpData[itemArr[0]] = [dataItem];
                                } else {
                                    cmpData[itemArr[0]] = dataItem;
                                }
                            } else {
                                cmpData[itemArr[0]] = dataItem;
                            }
                        } else if (itemArr.length == 2) {
                            var xtype = itemObj.attr("xtype");

                            if ("bForm" === xtype || "bPanel" === xtype) {
                                if ((!dirtyOnly) || (dirtyOnly && itemObj.isDirty())) {
                                    var dataItem = itemObj.gotValue(dirtyOnly, me.editflag);
                                    dataItem.editflag = me.editflag;
                                    for (var i = 0; i < 5; i++) {
                                        var itemObjAppend1 = me.getCmp(lastSplitItem + ".append" + ((i == 0) ? "" : i));
                                        if (DaLei.ObjUtil.isNotEmpty(itemObjAppend1)) {
                                            DaLei.copy(dataItem, itemObjAppend1.gotValue(dirtyOnly, me.editflag));
                                        } else {
                                            break;
                                        }
                                    }
                                    var toList = itemObj.attr("toList");
                                    if("true" == toList) {
                                        cmpData[itemArr[0]][itemArr[1]] = [dataItem];
                                    } else {
                                        cmpData[itemArr[0]][itemArr[1]] = dataItem;
                                    }
                                }
                            } else {
                                cmpData[itemArr[0]][itemArr[1]] = itemObj.gotValue(dirtyOnly, me.editflag);
                                if (dirtyOnly) {
                                    //DaLei.wrapDataForChange(cmpData);
                                }
                            }
                        }
                    }
                })
            }

            return cmpData;
        },
        sotValue: function (cmpData, needClearSystemFields) {
            var me = this;

            if (needClearSystemFields) {
                //DaLei.wrapDataForRemoveSystemFields(cmpData);
            }

            var bindings = me.bindings;
            if (bindings) {
                $.each(bindings, function (itemIndex, item) {
                    var lastSplitItem = DaLei.StrUtil.getLastSplit(item, ".");
                    var itemObj = me.getCmp(lastSplitItem);
                    if (DaLei.ObjUtil.isNotEmpty(itemObj)) {
                        var itemArr = item.split(".");
                        if (itemArr.length == 1) {
                            if(DaLei.ObjUtil.isEmpty(cmpData)) {
                                itemObj.sotValue(null);
                            } else{
                                itemObj.sotValue(cmpData[itemArr[0]], true);
                            }
                            for (var i = 0; i < 5; i++) {
                                var itemObjAppend1 = me.getCmp(lastSplitItem + ".append" + ((i == 0) ? "" : i));
                                if (DaLei.ObjUtil.isNotEmpty(itemObjAppend1)) {
                                    if(DaLei.ObjUtil.isEmpty(cmpData)) {
                                        itemObjAppend1.sotValue(null);
                                    } else {
                                        itemObjAppend1.sotValue(cmpData[itemArr[0]], true);
                                    }
                                } else {
                                    break;
                                }
                            }
                        } else if (itemArr.length == 2) {
                            if (cmpData && DaLei.ObjUtil.isNotEmpty(cmpData[itemArr[0]])) {
                                var dataList = cmpData[itemArr[0]][itemArr[1]] ? cmpData[itemArr[0]][itemArr[1]] : [];
                                var xtype = itemObj.attr("xtype");
                                if ("bPanel"  == xtype || "bForm" == xtype) {
                                    var dataObj = null;
                                    if($.isArray(dataList)) {
                                        dataObj = dataList[0];
                                    } else {
                                        dataObj = dataList;
                                    }
                                    itemObj.sotValue(dataObj, true);
                                    for (var i = 0; i < 5; i++) {
                                        var itemObjAppend1 = me.getCmp(lastSplitItem + ".append" + ((i == 0) ? "" : i));
                                        if (DaLei.ObjUtil.isNotEmpty(itemObjAppend1)) {
                                            itemObjAppend1.sotValue(dataObj, true);
                                        } else {
                                            break;
                                        }
                                    }
                                } else {
                                    itemObj.sotValue(dataList);
                                }
                            } else {
                                itemObj.sotValue(null);
                            }
                        }
                    }
                })
            }
        },
        sotDisable: function () {
            var contex = this.ele;
            $.each(DaLei.comps, function(index, type){
                var components = $("[xtype='" + type + "']", contex);
                if(components.length > 0) {
                    components.each(function(i,comp) {
                        $(comp).sotDisable();
                    });
                }
            });
        },
        sotEnable: function() {
            var contex = this.ele;
            $.each(DaLei.comps, function(index, type){
                var components = $("[xtype='" + type + "']", contex);
                if(components.length > 0) {
                    components.each(function(i,comp) {
                        $(comp).sotEnable();
                    });
                }
            });
        },
        validate: function() {
            return true;
        }
    });

    DaLei.define("DaLei.bootstrap.mvc.AbstractModel", {

    });

    DaLei.define("DaLei.bootstrap.mvc.AbstractCrudController", {
        extend:'DaLei.bootstrap.mvc.AbstractController',
        events:[
            {itemId: 'queryPanel->queryBtn', name: 'click', fn: 'doQuery'},
            //{itemId: 'queryPanel->quickQueryBtn', name: 'click', fn: 'doQuickQuery'},
            {itemId: 'queryPanel->resetBtn', name: 'click', fn: 'doReset'},
            {itemId: 'queryPanel->batchDelBtn', name: 'click', fn: 'doBatchDel'},
            {itemId: 'resultPanel->excelExpBtn', name: 'click', fn: 'doExport'},
            {itemId: 'queryPanel->addBtn', name: 'click', fn: 'doAdd'},
            {itemId: 'queryPanel->moreCondition', name: 'click', fn: 'doMoreCondition'},
            //{itemId: 'editPanel->copyAddBtn', name: 'click', fn: 'doCopyAdd'},
            {itemId: 'editPanel->addBtn', name: 'click', fn: 'doAdd'},
            {itemId: 'editPanel->saveBtn', name: 'click', fn: 'doSave'},
            {itemId: 'editPanel->modifyBtn', name: 'click', fn: 'doModify'},
            {itemId: 'editPanel->copyAddBtn', name: 'click', fn: 'doCopyAdd'},
            {itemId: 'editPanel->deleteBtn', name: 'click', fn: 'doDelete'},
            {itemId: 'editPanel->cancelBtn', name: 'click', fn: 'doCancel'},
            {itemId: 'editPanel->workFlowCommitBtn', name: 'click', fn: 'completeTask'},
            {itemId: 'editPanel->workFlowRollBackBtn', name: 'click', fn: 'rejectTask'},
            {itemId: 'editPanel->workFlowAssignBtn', name: 'click', fn: 'assignTask'},
            {itemId: 'editPanel->workFlowCancelBtn', name: 'click', fn: 'cancelTask'},
            {itemId: 'editPanel->workFlowViewLogBtn', name: 'click', fn: 'viewWorkFlowImg'},
            {itemId: 'treeMenu', name: 'onClick', fn: '_registTreeClick'}
        ],
        workFlowFormData:[],
        addOrUpdate : DaLei.Const.ACTION_TYPE.NULL, /* 0 for udpate, 1 for add new, 2 for copyAdd */
        doQuery: function () {
            var me = this;
            var queryBtn = me.view.getCmp("queryPanel->queryBtn");
            if(queryBtn) {
                queryBtn.sotDisable();
            }
            //var quickQueryCmp = me.view.getCmp("queryPanel->quickQueryTxt");
            //if (DaLei.ObjUtil.isNotEmpty(quickQueryCmp.gotValue())) {
            //    if (arguments.length != 1 || arguments[0] != 'simpleQuery') {
            //        //whether need clear quick query text value after trigger from condition enter key
            //        me.doQuickQuery();
            //        return;
            //    }
            //}


            if (me.beforeQuery) {
                var ret = me.beforeQuery();
                if (!ret) {
                    return;
                }
            }
            //var conditionPanel = me.view.getConditionPanel();
            var conditionForm = me.view.getConditionForm();
            if (!conditionForm.bForm("validate")) {
                if(queryBtn) {
                    queryBtn.sotEnable();
                }
                DaLei.Msg.warn(DaLei.I18N.QUERY_VALIDATE_ERROR);
                return false;
            }
            var resultPanel = me.view.getResultPanel();
            //queryConditions = conditionForm.gotValue(false, true),
            //queryExtraParams = conditionPanel.queryExtraParams,
            //ignoreCase = me.view.getIgnoreCaseValue();

            //$.each(queryConditions, function (key, value) {
            //    var optCid = key + DaLei.getSysConfig('QUERY_OPERATOR_SUFFIX');
            //    if (DaLei.ObjUtil.isNotEmpty(value) && conditionPanel.getCmp(optCid)) {
            //        queryConditions[optCid] = conditionPanel.getCmp(optCid).gotValue();
            //    }
            //});

            //if (me.view.allowNullConditions || conditionPanel.hasConditions()) {
            //    DaLei.doCommonQuery(me.queryAction, queryConditions, ignoreCase, resultPanel,
            //        me.view.modulePath, me.view.queryLayoutFile, me.view.menuCode, me.afterQuery, false, me, queryExtraParams);
            //quickQueryCmp.reset();
            //}
            //else {
            //    DaLei.MsgUtil.info(DaLei.I18N.PLEASE_INPUT_QUERY_CONDITIONS, function () {
            //        var firstField = conditionPanel.getFirstEditableField();
            //        if (DaLei.ObjUtil.isNotEmpty(firstField)) {
            //            firstField.focus();
            //        }
            //    })
            //}
            var conditionPanel = me.view.getCmp("conditionPanel");
            var param = conditionPanel.bPanel("gotCondition");

            me._resultTableLoadData(param, me.queryAction);

            if(queryBtn){
                queryBtn.sotEnable();
            }
            if(!DaLei.getSysConfig("pure_bootstrap")) {
                setTimeout(function () {
                    $(".overflow-mCustomScrollbar").doLayout();
                },0);
            }

            //if (me.clearEditPanelAfterQuery) {
            //    me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_NULL);
            //}
        },
        _resultTableLoadData: function(param, action) {
            var me = this;
            var resultPanel = this.view.getResultPanel();
            if($("[xtype='bTable']", resultPanel).length >0) {
                param.xtype = "bTable";
                $("[xtype='bTable']", resultPanel).bTable('loadDataPage', param, action);
            } else if($("[xtype='e_datagrid']", resultPanel).length >0) {
                //$("[xtype='datagrid']", resultPanel).datagrid('loadDataPage', param, action);
                var grid = $("[xtype='e_datagrid']", resultPanel);
                grid.e_datagrid('loadDataPage', param, action);
            }
        },
        //doQuickQuery: function () {
        //    var me = this;
        //    var view = me.view;
        //    if (me.beforeQuickQuery) {
        //        var ret = me.beforeQuickQuery();
        //        if (!ret) {
        //            return;
        //        }
        //    }
        //
        //    var quickQueryTxt = view.getCmp("queryPanel->quickQueryTxt").gotValue();
        //    if (DaLei.ObjUtil.isEmpty(quickQueryTxt)) {
        //        return;
        //    }
        //
        //    var conditionPanel = me.view.getConditionPanel();
        //    var queryPanel = conditionPanel.up("JQueryView");
        //    var resultPanel = me.view.getResultPanel(),
        //        queryConditions = conditionPanel.gotValue(),
        //        queryExtraParams = conditionPanel.queryExtraParams,
        //        ignoreCase = me.view.getIgnoreCaseValue();
        //
        //    Ext.Object.each(queryConditions, function (key, value) {
        //        var optCid = key + DaLei.getSysConfig('QUERY_OPERATOR_SUFFIX');
        //        if (DaLei.ObjUtil.isNotEmpty(value) && conditionPanel.getCmp(optCid)) {
        //            queryConditions[optCid] = conditionPanel.getCmp(optCid).gotValue();
        //        }
        //    });
        //
        //    DaLei.doCommonQuery(me.queryAction, queryConditions, ignoreCase, resultPanel, me.view.modulePath,
        //        me.view.queryLayoutFile, me.view.menuCode, me.afterQuery, false, me, queryExtraParams, quickQueryTxt);
        //    conditionPanel.reset();
        //    if (me.clearEditPanelAfterQuery)
        //        me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_NULL);
        //},
        doReset: function () {
            var me = this;
            var conditionForm = me.view.getConditionForm();
            conditionForm.bForm("reset");
        },
        doModify: function() {
            var me = this;
            if (me.beforeModify) {
                var ret = me.beforeModify();
                if (!ret) {
                    return;
                }
            }
            me.addOrUpdate = DaLei.Const.ACTION_TYPE.MODIFY;
            me.view.editflag = '*';
            //me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_MODIFY);
            var uuid = this.view.getHeader().getCmp("uuid").gotValue();
            this.loadItem(uuid, 'modify', me.afterModify);

            //if (me.afterModify) {
            //    var ret = me.afterModify();
            //    if (!ret) {
            //        return;
            //    }
            //}
        },
        doAdd: function(obj, event, successFn) {
            var me = this;
            if (me.beforeAdd) {
                var ret = me.beforeAdd();
                if (!ret) {
                    return;
                }
            }
            me.addOrUpdate = DaLei.Const.ACTION_TYPE.ADD;
            var editPanel = me.view.getEditPanel();
            if(editPanel){
                editPanel.sotValue(null);
            }
            me.view.editflag = '+';
            me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_NEW);
            if (me.afterAdd) {
                var ret = me.afterAdd();
                if (!ret) {
                    return;
                }
            }
        },
        doCopyAdd: function () {
            var me = this;
            me.disableWorkFlowBar();
            me.view.getCmp('editPanel->modifyBtn').sotDisable();
            if (me.beforeCopyAdd) {
                var ret = me.beforeCopyAdd();
                if (!ret) {
                    return;
                }
            }
            me.addOrUpdate = DaLei.Const.ACTION_TYPE.ADD_MODIFY;
            var uuid = me.view.getHeader().getCmp("uuid").gotValue();
            me.loadItem(uuid, 'add', me.afterCopyAdd);
            me.view.editflag = '+';
        },
        doDelete: function () {
            var me = this;
            if (me.beforeDelete) {
                var ret = me.beforeDelete();
                if (!ret) {
                    return;
                }
            }
            var isVoid = true;
            var actionUrl = me.deleteAction;
            if (DaLei.ObjUtil.isNotEmpty(actionUrl)) {
                isVoid = false;
            } else {
                actionUrl = me.voidAction;
            }
            DaLei.Msg.confirm('确认',DaLei.I18N.DELETE_CONFIRM, function (btn) {
                if (true == btn) {
                    var uuids = me.getSelectionsUuids();
                    if (DaLei.ObjUtil.isNotEmpty(uuids)) {
                        DaLei.deleteDataByUnids(uuids, actionUrl, me.dtoClass, isVoid, function (retData) {
                            if (retData.success) {
                                me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_NULL);
                                DaLei.Msg.info(DaLei.I18N.DELETE_SUCCESS, function () {
                                    if(me.view.viewType ==2) {
                                    } else {
                                        me.doQuery();
                                    }

                                    if (me.afterDelete) {
                                        me.afterDelete();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        },

        //gotoQueryPanel:function(viewtype){
        //    var me = this;
        //    if(viewtype==1){
        //        var editPanel = me.view.getEditPanel();
        //        if(editPanel) {
        //            editPanel.css('display','none');
        //        }
        //        var queryPanel = me.view.getQueryPanel();
        //        if(queryPanel){
        //            queryPanel.css('display','block');
        //        }
        //    }
        //
        //},
        //
        //gotoEditPanel:function(viewType){
        //    var me = this;
        //    if(viewType==1){
        //        var editPanel = me.view.getEditPanel();
        //        if(editPanel) {
        //            editPanel.css('display','block');
        //        }
        //        var queryPanel = me.view.getQueryPanel();
        //        if(queryPanel){
        //            queryPanel.css('display','none');
        //        }
        //    }
        //},

        doBatchDel: function () {
            var me = this;
            if (me.beforeBatchDel) {
                var ret = me.beforeBatchDel();
                if (!ret) {
                    return;
                }
            }
            var uuids = me.getSelectionsUuids(true);
            var grid = this.view.getResultPanel();
            if (uuids.length > 0) {
                var isVoid = true;

                var actionUrl = me.deleteAction;
                if (DaLei.ObjUtil.isNotEmpty(actionUrl)) {
                    isVoid = false;
                } else {
                    actionUrl = me.voidAction;
                }
                DaLei.Msg.confirm('确认',DaLei.I18N.DELETE_CONFIRM, function (btn) {
                    if (true == btn) {
                        if (DaLei.ObjUtil.isNotEmpty(uuids)) {
                            DaLei.deleteDataByUnids(uuids, actionUrl, me.dtoClass, isVoid, function (retData) {
                                if (retData.success) {
                                    me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_NULL);
                                    me.doQuery();
                                    if (me.afterBatchDel) {
                                        me.afterBatchDel();
                                    } else {
                                        DaLei.Msg.info(DaLei.I18N.DELETE_SUCCESS);
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                DaLei.Msg.info(DaLei.I18N.NO_RECORDS_SELECT);
            }
        },
        getSelectionsUuids: function (isBatch) {
            var me = this;
            var uuids = [];
            if (isBatch) {
                var selection = me.getQueryTableSelections();
                if(selection) {
                    $.each(selection,function(index,item){
                        uuids.push(item.uuid);
                    })
                }
            } else {
                var uuid = me.view.getHeader().getCmp("uuid").gotValue();
                uuids.push(uuid);
            }
            return uuids;
        },
        doCancel: function() {
            var me = this;
            me.view.editflag = '';
            if(me.view.viewType==1){
                me.view.sotValue(null);
            }
            me.refreshWorkFlowStatus();
            if(me.afterCancel) {
                me.afterCancel();
            }
            me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_NULL);
        },
        loadItem: function(uuid, opt, callbackFn) {
            var me = this;

            if (opt !== 'modify' && me.beforeLoadItem && !me.beforeLoadItem(uuid)) {
                return;
            }
            if (me.view.canEdit) {
                var postdata = {};
                postdata.uuid = uuid;
                postdata.dtoClass = me.dtoClass;
                DaLei.doAction(me.loadAction, postdata, function(data) {
                    //me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_VIEW);
                    if(data.success){
                        switch (opt) {
                            case 'add':
                                me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_NEW);
                                break;
                            case 'modify':
                                me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_MODIFY);
                                break;
                            default:
                                me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_VIEW);
                                break;
                        }
                        if (opt === 'add') {
                            DaLei.wrapDataForRemoveSystemFields(data);
                        }
                        me.view.sotValue(data);

                        if (DaLei.ObjUtil.isNotEmpty(me.view.bindings)) {
                            var headerData = data[me.view.bindings[0]];
                            if (DaLei.ObjUtil.isNotEmpty(headerData)) {
                                me.view.createBy = DaLei.StrUtil.replaceNull(headerData.createBy);
                                me.view.createTime = '';
                                var strCreateTime = DaLei.StrUtil.replaceFirst(headerData.createTime, "T", " ");
                                if (DaLei.ObjUtil.isNotEmpty(strCreateTime)) {
                                    var datCreateTime = DaLei.DateUtil.parseDate(strCreateTime);
                                    var utcTime = datCreateTime.getTime();
                                    var localOffset = datCreateTime.getTimezoneOffset() * 60000;
                                    var localTime = utcTime - localOffset;
                                    var datCreateTime = new Date(localTime);
                                    me.view.createTime = DaLei.DateUtil.formatDate(datCreateTime, DaLei.Const.LONG_DATE_FORMAT);
                                }
                                me.view.updateBy = DaLei.StrUtil.replaceNull(headerData.updateBy);
                                me.view.updateTime = '';
                                var strUpdateTime = DaLei.StrUtil.replaceFirst(headerData.updateTime, "T", " ");
                                if (DaLei.ObjUtil.isNotEmpty(strUpdateTime)) {
                                    var datUpdateTime = DaLei.DateUtil.parseDate(strUpdateTime);
                                    var utcTime = datUpdateTime.getTime();
                                    var localOffset = datUpdateTime.getTimezoneOffset() * 60000;
                                    var localTime = utcTime - localOffset;
                                    var datUpdateTime = new Date(localTime);
                                    me.view.updateTime = DaLei.DateUtil.formatDate(datUpdateTime, DaLei.Const.LONG_DATE_FORMAT);
                                }
                            }
                            //Ext.getCmp("createBy").setValue(me.view.createTime + " " + me.view.createBy);
                            //Ext.getCmp("updateBy").setValue(me.view.updateTime + " " + me.view.updateBy);
                        }

                        if (typeof callbackFn == 'function') {
                            callbackFn.apply(me, [data]);
                        }

                        if (opt !== 'modify') {
                            me.refreshWorkFlowStatus();
                            if(me.afterLoadItem){
                                me.afterLoadItem(data);
                            }
                        }
                    }
                }, function(e) {
                    DaLei.DebugUtil.logErr(e);
                },true,true);
            }

        },
        doExport: function (event) {
            var me = this;

            if (me.beforeExport) {
                var ret = me.beforeExport();
                if (!ret) {
                    return;
                }
            }

            var conditionPanel = me.view.getConditionPanel();
            var conditionForm = me.view.getConditionForm();
            if (!conditionForm.bForm("validate")) {
                DaLei.Msg.warn(DaLei.I18N.QUERY_VALIDATE_ERROR);
                return false;
            }

            var resultPanel = me.view.getResultPanel();
            //var queryConditions = conditionPanel.gotValue();
            //var queryExtraParams = conditionPanel.queryExtraParams;
            //var ignoreCase = me.view.getIgnoreCaseValue();

            var param = conditionPanel.bPanel("gotCondition");

            if (me.view.allowNullConditions || _hasConditions(param)) {
                var filename = null;
                if(DaLei.getSysConfig("pure_bootstrap")) {
                    filename = $('legend').text();
                } else {
                    filename = me.view.menuText;
                }
                if (me.view.getExportFileName && typeof me.view.getExportFileName == 'function') {
                    filename = DaLei.StrUtil.replaceNull(me.view.getExportFileName.call(me.view, filename), filename);
                } else {
                    filename = DaLei.getExportFileName(filename,
                        DaLei.StrUtil.replaceNull(me.view.exportFileNamePatten, DaLei.Const.EXPORT_EXCEL_FILE_NAME_PATTEN));
                }

                if (DaLei.ObjUtil.isNotEmpty(me.exportXlsAction)) {
                    var columns = [];
                    var columnNames = [];
                    var queryResultColumnWidths = [];
                    param.queryAction = me.queryAction;
                    param.queryResultColumnNames= columns;/*数据*/
                    param.queryResultColumnFriendlyNames= columnNames;/*列名 head*/
                    param.start = 0;
                    param.queryResultColumnWidths = queryResultColumnWidths;//列宽
                    if(DaLei.getSysConfig("pure_bootstrap")) {
                        param.xtype = "bTable";
                        if($("[xtype='bTable']", resultPanel).length >0) {
                            var bTable = null;
                            $("[xtype='bTable']", resultPanel).each(function(i, table){
                                if($(table).data("bTable")) {
                                    bTable = $(table).data("bTable");
                                };
                            });
                            if(bTable && bTable.table) {
                                var tempColumns = bTable.table.context[0].aoColumns;
                                param.draw = bTable.table.context[0].iDraw;
                                $.each(tempColumns, function(i, col) {
                                    if(col.bVisible && col.data) {
                                        columns.push(col.data);
                                        columnNames.push(col.sTitle);
                                        if(col.width) {
                                            queryResultColumnWidths.push(col.width);
                                        } else {
                                            queryResultColumnWidths.push($(col.nTh).width());
                                        }

                                    }
                                });
                            }
                        }

                    } else {
                        if($("[xtype='e_datagrid']", resultPanel).length >0) {
                            param.xtype = "e_datagrid";
                            param.page = 1;
                            var e_datagrid = null;
                            $("[xtype='e_datagrid']", resultPanel).each(function(i, grid){
                                e_datagrid = $(grid).data("e_datagrid");
                                if(e_datagrid) {
                                    return false;
                                }
                            });
                            if(e_datagrid) {
                                var datagrid = $.data(e_datagrid.ele[0], "datagrid");
                                var fields = $(e_datagrid.ele).datagrid('getColumnFields');
                                $.each(fields, function(i, field) {
                                    var colOpt = $(e_datagrid.ele).datagrid('getColumnOption', field);
                                    if(DaLei.ObjUtil.isNotEmpty(field) && !colOpt.hidden) {
                                        columns.push(field);
                                        columnNames.push(colOpt.title);
                                        if(colOpt.width) {
                                            queryResultColumnWidths.push(colOpt.width);
                                        } else {
                                            queryResultColumnWidths.push($("." +colOpt.cellClass).width());
                                        }
                                    }
                                });
                            }
                        }
                    }
                    var postData = {
                        viewdata : param,
                        exportFileName : filename
                    };
                    DaLei.fileExport(me.exportXlsAction, postData);
                    if (me.afterExport) {
                        me.afterExport();
                    }
                }
            } else {
                DaLei.Msg.warn(DaLei.I18N.PLEASE_INPUT_QUERY_CONDITIONS);
                //DaLei.MsgUtil.info(DaLei.I18N.PLEASE_INPUT_QUERY_CONDITIONS, function () {
                //    var firstField = conditionPanel.getFirstEditableField();
                //    if (DaLei.ObjUtil.isNotEmpty(firstField)) {
                //        firstField.focus();
                //    }
                //})
            }
        },
        doExportSpecial: function(queryActionExt, conditionPanelId, tableId, filename) {
            var me = this;
            if(DaLei.ObjUtil.isEmpty(queryActionExt) || DaLei.ObjUtil.isEmpty(conditionPanelId) || DaLei.ObjUtil.isEmpty(tableId) || DaLei.ObjUtil.isEmpty(filename)) {
                return false;
            }
            if (me.beforeExport) {
                var ret = me.beforeExport();
                if (!ret) {
                    return;
                }
            }

            var conditionPanel = me.view.getCmp(conditionPanelId);
            var conditionForm = $("form", conditionPanel);
            if (!conditionForm.bForm("validate")) {
                DaLei.Msg.warn(DaLei.I18N.QUERY_VALIDATE_ERROR);
                return false;
            }

            var param = conditionPanel.bPanel("gotCondition");
            var formId = conditionForm.attr("itemId");
            param.condition = param[formId];
            if (me.view.allowNullConditions || _hasConditions(param)) {
                if (me.view.getExportFileName && typeof me.view.getExportFileName == 'function') {
                    filename = DaLei.StrUtil.replaceNull(me.view.getExportFileName.call(me.view, filename), filename);
                } else {
                    filename = DaLei.getExportFileName(filename,
                        DaLei.StrUtil.replaceNull(me.view.exportFileNamePatten, DaLei.Const.EXPORT_EXCEL_FILE_NAME_PATTEN));
                }
                var columns = [];
                var columnNames = [];
                var queryResultColumnWidths = [];

                param.queryAction = queryActionExt;
                param.queryResultColumnNames= columns;/*数据*/
                param.queryResultColumnFriendlyNames= columnNames;/*列名 head*/
                param.start = 0;
                param.queryResultColumnWidths = queryResultColumnWidths;//列宽
                if(DaLei.getSysConfig("pure_bootstrap")) {
                    param.xtype = "bTable";
                    var tableEle = me.view.getCmp(tableId);
                    var bTable = null;
                    $(tableEle).each(function(i, table){
                        if($(table).data("bTable")) {
                            bTable = $(table).data("bTable");
                        };
                    });
                    if(bTable && bTable.table) {
                        var tempColumns = bTable.table.context[0].aoColumns;
                        param.draw = bTable.table.context[0].iDraw;
                        $.each(tempColumns, function(i, col) {
                            if(col.bVisible && col.data) {
                                columns.push(col.data);
                                columnNames.push(col.sTitle);
                                if(col.width) {
                                    queryResultColumnWidths.push(col.width);
                                } else {
                                    queryResultColumnWidths.push($(col.nTh).width());
                                }
                            }
                        });
                    }
                } else {
                    var tableEle = me.view.getCmp(tableId);
                    if(tableEle.length >0) {
                        param.xtype = "e_datagrid";
                        param.page = 1;
                        var e_datagrid = null;
                        tableEle.each(function(i, grid){
                            e_datagrid = $(grid).data("e_datagrid");
                            if(e_datagrid) {
                                return false;
                            }
                        });
                        if(e_datagrid) {
                            var datagrid = $.data(e_datagrid.ele[0], "datagrid");
                            var fields = $(e_datagrid.ele).datagrid('getColumnFields');
                            $.each(fields, function(i, field) {
                                var colOpt = $(e_datagrid.ele).datagrid('getColumnOption', field);
                                if(DaLei.ObjUtil.isNotEmpty(field) && !colOpt.hidden) {
                                    columns.push(field);
                                    columnNames.push(colOpt.title);
                                    if(colOpt.width) {
                                        queryResultColumnWidths.push(colOpt.width);
                                    } else {
                                        queryResultColumnWidths.push($("." +colOpt.cellClass).width());
                                    }
                                }
                            });
                        }
                    }
                }
                var postData = {
                    viewdata : param,
                    exportFileName : filename
                };
                DaLei.fileExport("common-exportxls-bs", postData);
                if (me.afterExport) {
                    me.afterExport();
                }
            } else {
                DaLei.Msg.warn(DaLei.I18N.PLEASE_INPUT_QUERY_CONDITIONS);
            }
        },
        _registTreeClick: function(node) {
            var me = this;
            me.loadItem(node.id);
        },
        _hasConditions: function(param) {
            var hasConditions = false;
            if(param && param.condition) {
                $.each(param.condition, function(i, field) {
                    if (DaLei.ObjUtil.isNotEmpty(field.value)) {
                        hasConditions = true;
                        return false;
                    }
                })
            }
            return hasConditions;
        },
        doSave : function() {
            var me = this;
            if (me.beforeSave) {
                var ret = me.beforeSave();
                if (!ret) {
                    return;
                }
            }
            //if ((me.view.uistatus == DaLei.Const.UI_INFO_STATUS_MODIFY) && !me.view.isDirty()) {
            //    me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_VIEW);
            //
            //    DaLei.MsgUtil.info(DaLei.I18N.DATA_NOT_CHANGE, function () {
            //        me.refreshWorkFlowStatus();
            //        if (successFn) {
            //            successFn(me, obj);
            //        }
            //    });
            //
            //    return false;
            //}
            //
            if (!me.view.validate()) {
                return false;
            }

            var param = me.view.gotValue();
            var action = "";
            if(me.view.editflag === '+') {
                action = me.addAction;
            } else if(me.view.editflag === '*') {
                action = me.modifyAction;
            }
            var uistatus = this.view.uistatus;

            DaLei.saveData(action, param, uistatus, this.dtoClass, this.view.modulePath, this.uniqueValidateFields, function (retData) {
                if (retData.success) {
                    if (uistatus == DaLei.Const.UI_INFO_STATUS_NEW) {
                        me.view.getHeader().getCmp("uuid").sotValue(retData.uuid);
                        if(me.getAddNewSuccessMsg){
                            DaLei.Msg.info(me.getAddNewSuccessMsg(retData));
                        } else {
                            DaLei.Msg.info(DaLei.I18N.ADD_NEW_SUCCESS);
                        }
                        me.view.createTime = DaLei.DateUtil.formatDate(new Date(), DaLei.Const.LONG_DATE_FORMAT);
                        me.view.createBy = DaLei.getCurrentUserId();
                        //Ext.getCmp("createBy").setValue(me.view.createTime + " " + DaLei.getCurrentUserId());
                        me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_VIEW);
                    } else if (uistatus == DaLei.Const.UI_INFO_STATUS_MODIFY) {
                        if(me.getModifySuccessMsg){
                            DaLei.Msg.info(me.getModifySuccessMsg(retData));
                        } else {
                            DaLei.Msg.info(DaLei.I18N.MODIFY_SUCCESS);
                        }
                        me.view.updateTime = DaLei.DateUtil.formatDate(new Date(), DaLei.Const.LONG_DATE_FORMAT);
                        me.view.updateBy = DaLei.getCurrentUserId();
                        //Ext.getCmp("updateBy").setValue(me.view.updateTime + " " + DaLei.getCurrentUserId());
                        me.view.setUIStatus(DaLei.Const.UI_INFO_STATUS_VIEW);
                    }

                    //if (!me.view.notRefresh && (me.view.viewType == '3')) {
                    //    var tree = me.view.getQueryPanel();
                    //    tree.refresh();
                    //    var curSelection = tree.getSelectionModel().getSelection();
                    //    if (curSelection.length > 0)
                    //        tree.fireEvent('itemClick', tree, curSelection[0]);
                    //}
                    me.refreshWorkFlowStatus();
                    if (me.afterSave) {
                        me.afterSave(retData);
                    }

                    if (me.successFn) {
                        me.successFn(me, obj);
                    }
                }

            }, function(e) {
                DaLei.DebugUtil.logErr("Save data error!");
            } );
        },
        refreshTreeMenu: function(nodeData) {
            var me = this;
            if(me.view.viewType == 2) {
                var treeMenu = me.view.getCmp("treeMenu");
                var selectedNode = treeMenu.tree('getSelected');
                var root = treeMenu.tree("getRoot");
                var parent = null;
                var keyField = treeMenu.e_tree("gotMappingKey");
                var textField = treeMenu.e_tree("gotMappingTextKey");
                if (DaLei.ObjUtil.isNotEmpty(selectedNode) && DaLei.ObjUtil.isNotEmpty(root)) {
                    parent = selectedNode.target;
                }
                //me.loadTreeMenu();
                if(me.addOrUpdate == DaLei.Const.ACTION_TYPE.ADD){
                    treeMenu.e_tree('addNode', {
                        parent: parent,
                        data: nodeData
                    });
                } else if(me.addOrUpdate == DaLei.Const.ACTION_TYPE.MODIFY){
                    var target = parent;
                    if(DaLei.ObjUtil.isEmpty(parent)) {
                        target = treeMenu.e_tree("findNode", nodeData[keyField]).target;
                    }
                    treeMenu.e_tree('updateNode', {
                        target: target,
                        data: nodeData,
                        text:nodeData[textField]
                    });
                } else if(me.addOrUpdate == DaLei.Const.ACTION_TYPE.ADD_MODIFY) {
                    parent = treeMenu.tree("getParent", selectedNode.target);

                    treeMenu.e_tree('addNode', {
                        parent: DaLei.ObjUtil.isEmpty(parent)? null: parent.target,
                        data: nodeData
                    });
                }
                var domId;
                if(DaLei.ObjUtil.isNotEmpty(nodeData.domId)){
                    domId=$('#' + nodeData.domId);
                }else{
                    domId=$('#' + nodeData.domId);
                }
                treeMenu.tree('select',domId);
                treeMenu.tree('expandTo',domId);
                domId.click();
            }
        },
        getTableSelections: function(itemId) {
            var me = this;
            var table = me.view.getCmp(itemId);
            if(table && "bTable" ==table.attr("xtype")) {
                return table.bTable("gotSelectedRowsData");
            } else if(table && "e_datagrid" ==table.attr("xtype")) {
                return table.datagrid("getSelections");
            }
        },
        getQueryTableSelections: function() {
            var me = this;
            var table = me.view.getComQueryResultTable();
            if(table && "bTable" ==table.attr("xtype")) {
                return table.bTable("gotSelectedRowsData");
            } else if(table && "e_datagrid" ==table.attr("xtype")) {
                return table.datagrid("getSelections");
            }
        },
        /*tab切换相关方法*/
        tabChange: function (me) {
            var tablist = $("ul.tab-list", me.view.ele).not("[xtype]");
            if(tablist.length> 0) {
                $.each(tablist, function(i, ulTablist) {
                    var currentIndex = $("li", ulTablist).filter(".on").index();
                    var tabContents = $(ulTablist).siblings(".div-content");
                    tabContents.hide().eq(currentIndex).stop().show();
                });

                $(".tab-list li", me.view.ele).filter(function(i){
                    return $(this).parent().parent().attr('xtype') != 'e_tablist';
                }).click(function () {
                    $(this).addClass("on").siblings("li").removeClass("on");
                    $(this).parent().siblings(".div-content").hide().eq($(this).index()).stop().show(
                        function(){
                            if($("body").panel) {
                                $("body").panel("doLayout");
                            }
                        }
                    );
                });
            }
        },

        gotPrimaryKey: function(){
            var me = this;
            var businessKey = me.view.getCmp("editPanel->uuid");
            if(businessKey){
                return businessKey.gotValue();
            } else {
                return "";
            }
        },
        refreshWorkFlowStatus: function () {
            var me = this;
            if (DaLei.ObjUtil.isNotEmpty(me.view.workFlowDefinitionKey)) {
                me.workFlowFormData = [];
                var param = {};
                param.businessKey = me.gotPrimaryKey();
                param.workFlowDefinitionKey = me.view.workFlowDefinitionKey;
                param.dto = me.dtoClass;
                DaLei.doAction("workflow-init-query-action", param, function (result) {
                    me.refreshWorkFlowBarStatus(result, me);
                }, null, false, false);
            }
        },
        refreshWorkFlowBarStatus: function (result) {
            var me = this;
            if (result.wf_formdata) {
                me.workFlowFormData = result.wf_formdata;
            } else {
                me.workFlowFormData = [];
            }
            if (result.wf_cancancel && me.workFlowFormData.indexOf("wf_disable_cancel=1") == -1) {
                me.view.getCmp('editPanel->workFlowCancelBtn').sotEnable();
            } else {
                me.view.getCmp('editPanel->workFlowCancelBtn').sotDisable();
            }
            if (result.wf_canmodify) {//可以修改
                me.view.getCmp('editPanel->workFlowViewLogBtn').sotEnable();
                me.view.getCmp('editPanel->workFlowCommitBtn').sotEnable();
                me.view.getCmp('editPanel->workFlowAssignBtn').sotEnable();
                me.view.getCmp('editPanel->workFlowRollBackBtn').sotEnable();
                if (me.workFlowFormData != null && me.workFlowFormData.indexOf("wf_enable_all_function=1") == -1) {
                    me.view.getCmp("editPanel->modifyBtn").sotDisable();
                }
                me.view.getCmp("editPanel->deleteBtn").sotDisable();
            } else {//不可以修改
                if (result.wf_fixed && result.wf_restart && (me.getWfFixedExt ? !me.getWfFixedExt() : true)) {//rollback之后可以提交
                    me.view.getCmp('editPanel->workFlowCommitBtn').sotEnable();
                    me.view.getCmp("editPanel->modifyBtn").sotEnable();
                    me.view.getCmp("editPanel->deleteBtn").sotEnable();
                    me.view.getCmp('editPanel->workFlowRollBackBtn').sotDisable();
                    me.view.getCmp('editPanel->workFlowAssignBtn').sotDisable();
                    me.view.getCmp('editPanel->workFlowViewLogBtn').sotEnable();
                } else if (result.wf_fixed || (me.getWfFixedExt ? me.getWfFixedExt() : false)) {//已经完成
                    if (me.workFlowFormData.indexOf("wf_modify_after_fixed=1") == -1) {
                        me.view.getCmp('editPanel->workFlowCommitBtn').sotDisable();
                        me.view.getCmp("editPanel->modifyBtn").sotDisable();
                    } else {
                        me.view.getCmp('editPanel->workFlowCommitBtn').sotEnable();
                        me.view.getCmp("editPanel->modifyBtn").sotEnable();
                    }
                    me.view.getCmp("editPanel->deleteBtn").sotDisable();
                    me.view.getCmp('editPanel->workFlowRollBackBtn').sotDisable();
                    me.view.getCmp('editPanel->workFlowAssignBtn').sotDisable();
                    me.view.getCmp('editPanel->workFlowViewLogBtn').sotEnable();
                } else {
                    if (!result.wf_existing) {
                        if (me.view.uistatus == DaLei.Const.UI_INFO_STATUS_NEW || me.view.uistatus == DaLei.Const.UI_INFO_STATUS_MODIFY || me.view.uistatus == DaLei.Const.UI_INFO_STATUS_NULL) {
                            me.view.getCmp('editPanel->workFlowCommitBtn').sotDisable();
                        } else {
                            me.view.getCmp('editPanel->workFlowCommitBtn').sotEnable();
                        }
                    } else {
                        me.view.getCmp('editPanel->workFlowCommitBtn').sotDisable();
                        me.view.getCmp('editPanel->workFlowAssignBtn').sotDisable();
                        me.view.getCmp('editPanel->workFlowRollBackBtn').sotDisable();
                        me.view.getCmp('editPanel->workFlowViewLogBtn').sotEnable();
                        if (me.view.uistatus == DaLei.Const.UI_INFO_STATUS_VIEW || me.view.uistatus == DaLei.Const.UI_INFO_STATUS_NULL) {
                            //wf_enable_all_function用来控制是不是可以编辑
                            me.view.getCmp("editPanel->modifyBtn").sotDisable();
                            me.view.getCmp("editPanel->deleteBtn").sotDisable();
                        }
                    }
                }
            }
            if (me.workFlowFormData.indexOf("wf_disable_assign=1") != -1) {
                me.view.getCmp('editPanel->workFlowAssignBtn').sotDisable();
            }
            if (me.workFlowFormData.indexOf("wf_disable_reject=1") != -1) {
                me.view.getCmp('editPanel->workFlowRollBackBtn').sotDisable();
            }
            if (me.workFlowFormData.indexOf("wf_disable_commit=1") != -1) {
                me.view.getCmp('editPanel->workFlowCommitBtn').sotDisable();
            }
            me.customizeWorkFlowToolbarText(me);
            if (result.taskId) {
                me.workFlowTaskId = result.taskId;
            } else {
                me.workFlowTaskId = null;
            }
            if( me.refreshUIStatusBasedOnWorkFlow){
                me.refreshUIStatusBasedOnWorkFlow(result);
            }
        },
        completeTask: function () {
            var me = this;
            if (me.beforeWorkFlowCommit && !me.beforeWorkFlowCommit()) {
                return false;
            }
            me.executeTask();
        },
        customizeWorkFlowToolbarText: function (me) {
            if (me.workFlowFormData.indexOf("wf_toolbar_text_customized=1") != -1) {
                me.view.getCmp('editPanel->workFlowCommitBtn').bBtn('sotText',DaLei.I18N.WF_CUSTOMIZED_SUBMIT_TEXT);
                me.view.getCmp('editPanel->workFlowRollBackBtn').bBtn('sotText',DaLei.I18N.WF_CUSTOMIZED_ROLLBACK_TEXT);
                me.view.getCmp('editPanel->workFlowAssignBtn').bBtn('sotText',DaLei.I18N.WF_CUSTOMIZED_ASSIGN_TEXT);
                me.view.getCmp('editPanel->workFlowCancelBtn').bBtn('sotText',DaLei.I18N.WF_CUSTOMIZED_CANCEL_TEXT);
                me.view.getCmp('editPanel->workFlowViewLogBtn').bBtn('sotText',DaLei.I18N.WF_CUSTOMIZED_VIEW_LOG_TEXT);
                $.each(me.workFlowFormData, function (itemIndex, item) {
                //Ext.Array.forEach(me.workFlowFormData, function (item) {
                    if (item.indexOf("wf_toolbar_submit_text=") > -1) {
                        me.view.getCmp('editPanel->workFlowCommitBtn').bBtn('sotText',item.replace('wf_toolbar_submit_text=', ''));
                    } else if (item.indexOf("wf_toolbar_reject_text=") > -1) {
                        me.view.getCmp('editPanel->workFlowRollBackBtn').bBtn('sotText',item.replace('wf_toolbar_reject_text=', ''));
                    } else if (item.indexOf("wf_toolbar_assign_text=") > -1) {
                        me.view.getCmp('editPanel->workFlowAssignBtn').bBtn('sotText',item.replace('wf_toolbar_assign_text=', ''));
                    } else if (item.indexOf("wf_toolbar_view_text=") > -1) {
                        me.view.getCmp('editPanel->workFlowViewLogBtn').bBtn('sotText',item.replace('wf_toolbar_view_text=', ''));
                    } else if (item.indexOf("wf_toolbar_cancel_text=") > -1) {
                        me.view.getCmp('editPanel->workFlowCancelBtn').bBtn('sotText',item.replace('wf_toolbar_cancel_text=', ''));
                    }
                });
            } else if (me.workFlowFormData.indexOf("wf_goto_end=1") != -1 && !me.workFlowFormData.indexOf("wf_toolbar_text_customized=1") > -1) {
                me.view.getCmp('editPanel->workFlowCommitBtn').bBtn('sotText',DaLei.I18N.WF_CUSTOMIZED_SUBMIT_TEXT);
            } else {
                me.view.getCmp('editPanel->workFlowCommitBtn').bBtn('sotText',DaLei.I18N.WROKFLOW_COMMIT_BTN);
                me.view.getCmp('editPanel->workFlowRollBackBtn').bBtn('sotText',DaLei.I18N.WROKFLOW_ROLLBACK_BTN);
                me.view.getCmp('editPanel->workFlowAssignBtn').bBtn('sotText',DaLei.I18N.WROKFLOW_ASSIGN_BTN);
                me.view.getCmp('editPanel->workFlowViewLogBtn').bBtn('sotText',DaLei.I18N.WROKFLOW_VIEW_LOG_BTN);
                me.view.getCmp('editPanel->workFlowCancelBtn').bBtn('sotText',DaLei.I18N.WROKFLOW_CANCEL_BTN);
            }
        },
        executeTask: function () {
            var me = this;
            var param = {};
            param.businessKey = me.gotPrimaryKey();
            param.workFlowDefinitionKey = me.view.workFlowDefinitionKey;
            param.dto = me.dtoClass;
            if(me.loadWorkflowMenuCode){
                param.menuCode = me.loadWorkflowMenuCode();
            } else {
                param.menuCode = me.menuCode;
            }
            param.taskId = me.workFlowTaskId;
            if(me.loadWorkFlowProcessDeptCode){
                param.processDeptCode = me.loadWorkFlowProcessDeptCode();
            }
            if(me.collectMoreWorkFlowParamOnComplete){
                var moreParam = me.collectMoreWorkFlowParamOnComplete();
                if (DaLei.ObjUtil.isNotEmpty(moreParam)) {
                    param.variable = moreParam;
                }
            }
            var callback = function (assignee, comment, userFilter, priority) {
                param.assignee = assignee;
                param.comment = comment;
                param.userFilter = userFilter;
                param.priority = priority;
                DaLei.doAction("workflow-complete-action", param, function (result) {
                    me.refreshWorkFlowBarStatus(result, me);
                    if( me.afterCompelteTask){
                        me.afterCompelteTask(result);
                    }
                    if (result.success) {
                        DaLei.Msg.info(DaLei.I18N.MSG_WORKFLOW_COMPLETE_SUCCESS);
                    }
                }, function () {
                },  'body', true);
            };
            if (me.workFlowFormData.indexOf("wf_skip_popup_dialog=1") != -1) {
                callback(null, DaLei.I18N.MSG_WORKFLOW_COMPLETE_COMMENT, null);
            } else {
                me.chooseAssignee(callback, true, false, false, me, DaLei.I18N.MSG_WORKFLOW_COMPLETE_COMMENT);
            }
        },

        rejectTask: function () {
            var me = this;
            if (me.beforeWorkFlowReject && !me.beforeWorkFlowReject()) {
                return false;
            }
            var param = {};
            param.wf_reject = 1;
            param.businessKey = me.gotPrimaryKey();
            param.dto = me.dtoClass;
            param.workFlowDefinitionKey = me.view.workFlowDefinitionKey;
            param.taskId = me.workFlowTaskId;
            if(me.loadWorkFlowProcessDeptCode){
                param.processDeptCode = me.loadWorkFlowProcessDeptCode();
            }
            var moreParam = null;
            if(me.collectMoreWorkFlowParamOnReject){
                moreParam = me.collectMoreWorkFlowParamOnReject();
                if (DaLei.ObjUtil.isNotEmpty(moreParam)) {
                    param.variable = moreParam;
                }
            }
            var formdata = me.workFlowFormData;
            /*
             * 如果没有设置参数退回上一步/退回到起点， 则走老逻辑，不弹出选择退回到哪一步的框
             * */
            if (formdata.indexOf("wf_rollback_to_start=1") == -1 && formdata.indexOf("wf_rollback_one_step=1") == -1) {
                var callback = function (viewdata) {
                    var selection = viewdata.taskCommentsDto;
                    var deleteReason = selection[0].deleteReason;
                    if (deleteReason && ('REJECTED' == deleteReason || 'CANCELLED' == deleteReason)) {
                        DaLei.Msg.warn("无法退回到已经退回或者撤销的节点！");
                    } else {
                        var rollbackTaskId = selection[0].taskId;
                        //param.assignee = assignee;
                        param.comment = viewdata.comment;
                        param.priority = viewdata.priority;
                        //param.userFilter = userFilter;
                        param.rollbackTaskId = rollbackTaskId;
                        DaLei.doAction("workflow-reject-action", param, function (result) {
                            me.refreshWorkFlowBarStatus(result);
                            if(me.afterRejectTask){
                                me.afterRejectTask(result);
                            }
                            if (result.success) {
                                DaLei.Msg.info(DaLei.I18N.MSG_WORKFLOW_REJECT_SUCCESS);
                            }
                        }, function () {
                        }, 'body', true);
                    }
                };
                var postdata = {};
                postdata.businessKey = me.gotPrimaryKey();
                postdata.workFlowDefinitionKey = me.view.workFlowDefinitionKey;
                if( "true" == DaLei.getSysConfig("wf_enable_default_comment")) {
                    postdata.defaultComment = DaLei.I18N.MSG_WORKFLOW_REJECT_COMMENT;
                }
                DaLei.popWindow("WorkFlow.controller.WorkFlowChooseRejectNodeController", DaLei.I18N.WROKFLOW_COMMENT_ASSIGNEE_TITLE,"rejectnodechoose", postdata,'700px', true, callback);
                //var subController = Ext.create("");
                //subController.postdata = postdata;
                //var win = DaLei.openNewWinByController(subController, callback, 'temp_icon_16', DaLei.I18N.WROKFLOW_ROLLBACK_BTN, DaLei.I18N.OK_BTN);
            } else {
                /*
                 * 如果是设置了参数退回上一步/退回到起点， 则走老逻辑，不弹出选择退回到哪一步的框
                 * */
                var callback = function (assignee, comment, userFilter, priority) {
                    param.assignee = assignee;
                    param.comment = comment;
                    param.userFilter = userFilter;
                    param.priority = priority;
                    param.menuCode = me.menuCode;
                    DaLei.doAction("workflow-reject-action", param, function (result) {
                        me.refreshWorkFlowBarStatus(result);
                        if(me.afterRejectTask){
                            me.afterRejectTask(result);
                        }
                        if (result.success) {
                            DaLei.Msg.info(DaLei.I18N.MSG_WORKFLOW_REJECT_SUCCESS);
                        }
                    }, function () {
                    },  'body', true);
                };
                me.chooseAssignee(callback, false, false, true, me, DaLei.I18N.MSG_WORKFLOW_REJECT_COMMENT);
            }
        },

        cancelTask: function () {
            var me = this;
            if (me.beforeWorkFlowCancel && !me.beforeWorkFlowCancel()) {
                return false;
            }
            me.executeWFCancel();
        },

        executeWFCancel: function () {
            var me = this;
            var param = {};
            param.businessKey = me.gotPrimaryKey();
            param.dto = me.dtoClass;
            param.workFlowDefinitionKey = me.view.workFlowDefinitionKey;
            param.taskId = me.workFlowTaskId;
            param.menuCode = me.menuCode;
            if(me.loadWorkFlowProcessDeptCode){
                param.processDeptCode = me.loadWorkFlowProcessDeptCode();
            }
            if(me.collectMoreWorkFlowParamOnReject){
                var moreParam = me.collectMoreWorkFlowParamOnReject();
                if (DaLei.ObjUtil.isNotEmpty(moreParam)) {
                    param.variable = moreParam;
                }
            }
            DaLei.doAction("workflow-cancel-action", param, function (result) {
                me.refreshWorkFlowBarStatus(result);
                if(me.afterCancelTask){
                    me.afterCancelTask(result);
                }
                if (result.success) {
                    DaLei.Msg.info(DaLei.I18N.MSG_WORKFLOW_CANCEL_SUCCESS);
                }
            }, function () {
            },  'body', true);
        },

        assignTask: function () {
            var me = this;
            if (me.beforeWorkFlowAssign && !me.beforeWorkFlowAssign()) {
                return false;
            }
            var param = {};
            param.businessKey = me.gotPrimaryKey();
            param.dto = me.dtoClass;
            param.workFlowDefinitionKey = me.view.workFlowDefinitionKey;
            param.taskId = me.workFlowTaskId;
            if ( me.loadWorkFlowProcessDeptCode) {
                param. processDeptCode = me.loadWorkFlowProcessDeptCode();
            }
            var moreParam ={};
            if(me.collectMoreWorkFlowParamOnAssign){
                moreParam = me.collectMoreWorkFlowParamOnAssign();
            }
            if (DaLei.ObjUtil.isNotEmpty(moreParam)) {
                param.variable = moreParam;
            }
            var callback = function (assignee, comment, userfilter, priority, assigneeDesc) {
                param.assignee = assignee;
                param.comment = comment;
                param.userfilter = userfilter;
                param.priority = priority;
                param.assigneeDesc = assigneeDesc;
                param.menuCode = me.menuCode;
                DaLei.doAction("workflow-assign-action", param, function (result) {
                    me.refreshWorkFlowBarStatus(result, me);
                    if (result.success) {
                        DaLei.Msg.info(DaLei.I18N.MSG_WORKFLOW_ASSIGN_SUCCESS);
                    }
                }, function () {
                },  'body', true);
            };
            me.chooseAssignee(callback, true, true, false, me, DaLei.I18N.MSG_WORKFLOW_ASSIGN_COMMENT);
        },
        chooseAssignee: function (callback, assigneeVisible, assignProcess, rejectProcess, caller, defaultComment) {
            var me = this;
            var formdata = me.workFlowFormData;
            var businessKey = caller.gotPrimaryKey();
            var workFlowDefinitionKey = caller.view.workFlowDefinitionKey;
            var processDeptCode = '';
            if (caller && caller.loadWorkFlowProcessDeptCode) {
                processDeptCode = caller.loadWorkFlowProcessDeptCode();
            }
            var cutomizedParam = {};
            if(caller.collectMoreWorkFlowParamOnLoadAssignee){
                var tempCutomizedParam = caller.collectMoreWorkFlowParamOnLoadAssignee();
                if (!tempCutomizedParam) {
                    cutomizedParam = tempCutomizedParam;
                }
            }
            if (assignProcess) {
                cutomizedParam.assignProcess = assignProcess;
            }
            var preparedData = me.prepareAssigneeChooseData(processDeptCode, formdata, assignProcess, cutomizedParam, businessKey, workFlowDefinitionKey);
            if( "true" == DaLei.getSysConfig("wf_enable_default_comment")) {
                preparedData.defaultComment = defaultComment;
            }
            preparedData.assigneeVisible = assigneeVisible;
            var afterProcess = function (retData) {
                //alert("aaa")
                if(retData.wfcomment){
                    retData = retData.wfcomment;
                }
                callback(retData.assignToCode, retData.comment, retData.userFilter, retData.priority, retData.assignTo);
            };
            me.preLoadAssignee(assigneeVisible, assignProcess, formdata, rejectProcess, preparedData, cutomizedParam, businessKey, workFlowDefinitionKey, processDeptCode, afterProcess);

            //var fillComment = function(){
            //
            //}
            //var win = DaLei.openNewWinByView(form, callBack, 'temp_icon_16', DaLei.I18N.WROKFLOW_COMMENT_ASSIGNEE_TITLE, DaLei.I18N.OK_BTN);
        },
        preLoadAssignee: function (assigneeVisible, assignProcess, formdata, rejectProcess, preparedData, cutomizedParam, businessKey, workFlowDefinitionKey, processDeptCode, callback) {
            var preQueryAssignee = true;
            var defaultValue={};
            if(preparedData && preparedData.defaultComment){
                defaultValue.defaultComment = preparedData.defaultComment;
            }
            //如果是完结的时候(wf_goto_end=1),或者是多个人的时候(wf_disable_assignee_choose=1)，要把选人的按钮disable掉
            if (false == assigneeVisible || (!assignProcess && (formdata.indexOf("wf_disable_assignee_choose=1") != -1 || formdata.indexOf("wf_goto_end=1") != -1)) || rejectProcess) {
                defaultValue.assignToDisabled = true;
                preQueryAssignee = false;
                //如果不是结尾的时候，而且是disable的时候，但是有userFitler的时候，也要去check一下是不是只有一个人
                if (!rejectProcess && !assignProcess && formdata.indexOf("wf_disable_assignee_choose=1") != -1 && formdata.join(',').indexOf("userFilter") != -1 && formdata.indexOf("wf_goto_end=1") == -1) {
                    preQueryAssignee = true;
                }
            }
            //预先查询一下，如果只有一个用户的话，直接带到选择框内
            if (preQueryAssignee) {
                var queryConditions = {};
                queryConditions.type = 1;
                queryConditions.userFilter = preparedData.userFilter;
                queryConditions.userGroupFilter = preparedData.userGroupFilter;
                queryConditions.roleFilter = preparedData.roleFilter;
                queryConditions.deptFilter = preparedData.deptFilter;
                queryConditions.additionalParam = cutomizedParam;
                if (cutomizedParam.customizedLoadUser) {
                    if (DaLei.ObjUtil.isNotEmpty(businessKey)) {
                        queryConditions.businessKey = businessKey;
                    }
                    if (DaLei.ObjUtil.isNotEmpty(workFlowDefinitionKey)) {
                        queryConditions.workFlowDefinitionKey = workFlowDefinitionKey;
                    }
                }
                if (DaLei.ObjUtil.isNotEmpty(processDeptCode)) {
                    queryConditions.processDeptCode = processDeptCode;
                }
                var postData = {};
                postData.queryConditions = queryConditions;
                DaLei.doAction("msgcenter-load-user", postData, function (result) {
                    if (result) {
                        var queryRet = result.root;
                        if (result.totalProperty == 1) {
                            defaultValue.assignTo = queryRet[0].userName;
                            defaultValue.assignToCode = queryRet[0].userId;
                        }
                        defaultValue.root = queryRet;
                    }
                    preparedData.defaultValue=defaultValue;
                    DaLei.popWindow("WorkFlow.controller.WorkFlowCommentController", DaLei.I18N.WROKFLOW_COMMENT_ASSIGNEE_TITLE,"comment", preparedData,'700px', true, callback);
                }, function () {
                }, true, false);
            } else {
                preparedData.defaultValue=defaultValue;
                DaLei.popWindow("WorkFlow.controller.WorkFlowCommentController", DaLei.I18N.WROKFLOW_COMMENT_ASSIGNEE_TITLE,"comment", preparedData,'700px', true, callback);
            }
        },
        prepareAssigneeChooseData: function (processDeptCode, formdata, assignProcess, cutomizedParam, businessKey, workFlowDefinitionKey) {
            var result = {};
            var assigneeDisplay = DaLei.getSysConfig("wf_assignee_display");
            if (!assigneeDisplay) {
                assigneeDisplay = 'user'
            }
            result.assigneeDisplay = assigneeDisplay;
            result.processDeptCode = processDeptCode;
            if (DaLei.ObjUtil.isNotEmpty(formdata)) {
                var customizedLoadUser = false;
                $.each(formdata, function(i,item){
                    if (!assignProcess) {
                        if (item.indexOf("userFilter=") > -1) {
                            result.userFilter = item.replace('userFilter=', '');
                        }
                        if (item.indexOf("userGroupFilter=") > -1) {
                            result.userGroupFilter = item.replace('userGroupFilter=', '');
                        }
                        if (item.indexOf("deptFilter=") > -1) {
                            result.deptFilter = item.replace('deptFilter=', '');
                        }
                        if (item.indexOf("roleFilter=") > -1) {
                            result.roleFilter = item.replace('roleFilter=', '');
                        }
                    } else {
                        if (item.indexOf("assignUserFilter=") > -1) {
                            result.userFilter = item.replace('assignUserFilter=', '');
                        }
                        if (item.indexOf("assignUserGroupFilter=") > -1) {
                            result.userGroupFilter = item.replace('assignUserGroupFilter=', '');
                        }
                        if (item.indexOf("assignDeptFilter=") > -1) {
                            result.deptFilter = item.replace('assignDeptFilter=', '');
                        }
                        if (item.indexOf("assignRoleFilter=") > -1) {
                            result.roleFilter = item.replace('assignRoleFilter=', '');
                        }
                    }
                    if (item.indexOf("customized-load-user=1") > -1) {
                        customizedLoadUser = true;
                        cutomizedParam.customizedLoadUser = true;
                    }
                    if (item.indexOf("workflow_assignee_single_select=1") > -1) {
                        cutomizedParam.assigneeSingleSelect = true;
                    }
                });
                if (customizedLoadUser) {
                    if (DaLei.ObjUtil.isNotEmpty(businessKey)) {
                        result.businessKey = businessKey;
                    }
                    if (DaLei.ObjUtil.isNotEmpty(workFlowDefinitionKey)) {
                        result.workFlowDefinitionKey = workFlowDefinitionKey;
                    }
                }
            }
            result.additionalParam = cutomizedParam;
            result.formdata = formdata;
            return result;
        },
        viewWorkFlowImg: function () {
            var me = this;
            var view = this.view;
            var businessKey = me.gotPrimaryKey();
            //if (DaLei.ObjUtil.isEmpty(businessKey)) {
            //    DaLei.MsgUtil.info(DaLei.MsgUtil.info(DaLei.I18N.NO_RECORDS_SELECT));
            //    return false;
            //}
            var workFlowDefinitionKey = me.view.workFlowDefinitionKey;
            var postdata = {};
            postdata.businessKey = businessKey;
            postdata.workFlowDefinitionKey = workFlowDefinitionKey;
            DaLei.popWindow("WorkFlow.controller.WorkFlowViewLogController", "工作流日志","", postdata,'800px', true, me.callback);
            //me.popupWorkFlowImgDialog(businessKey, workFlowDefinitionKey);
        },
        disableWorkFlowBar: function() {
            var me = this;
            me.view.getCmp('editPanel->workFlowCommitBtn').sotDisable();
            me.view.getCmp('editPanel->workFlowAssignBtn').sotDisable();
            me.view.getCmp('editPanel->workFlowCancelBtn').sotDisable();
            me.view.getCmp('editPanel->workFlowRollBackBtn').sotDisable();
            me.view.getCmp('editPanel->workFlowViewLogBtn').sotDisable();
        },
        doMoreCondition: function () {
            var me = this;
            var condPanel = me.view.getConditionPanel();
            if(condPanel && !DaLei.getSysConfig("pure_bootstrap")) {
                DaLei.eaysUiQueryPanelCollapse(me.view.ele);
            }
        }
    });

    DaLei.define("DaLei.bootstrap.mvc.AbstractCrudView", {
        extend:'DaLei.bootstrap.mvc.AbstractView',
        workFlowDefinitionKey: null,
        allowNullConditions: true,
        init: function(){
            var me = this;
            if(this.initView) {
                this.initView();
            }
            var menuCode = this.controller.menuCode;
            var tempDefinitionKey = DaLei.loadWorkflowDefinitionKey(menuCode);
            if(DaLei.ObjUtil.isNotEmpty(tempDefinitionKey)) {
                this.workFlowDefinitionKey = tempDefinitionKey;
            }
            this.setUIStatus(DaLei.Const.UI_INFO_STATUS_NULL);
            //this.uistatus = DaLei.Const.UI_INFO_STATUS_NULL;
            //var editPanel = this.getEditPanel();
            //if(editPanel){
            //    editPanel.css('display','none');
            //}

            var conditionPanel = this.getConditionPanel();
            if(conditionPanel) {
                conditionPanel.keydown(function(e){
                    if (e && e.keyCode === 13) {
                        me.controller.doQuery();
                    }
                })
            }
            if(this.viewType == 2 && this.getCmp("treeMenu") != null) {
                // DaLei.calculateHeight(me, {
                //     slimscrollDomItemId: "treeMenu",
                //     needCalculateDomItemId: "queryPanel->box-body",
                //     needCutHeightDomItemIds: ["queryPanel->box-header"],
                //     cutExtraHeight: 24,
                //     allowPageScroll:true
                // });
                DaLei.calculateLeftPanelHeight(me.ele);
            }

            if(this.afterInitView) {
                this.afterInitView();
            }
        },

        getHeader: function () {
            var me = this;
            var bindings = me.bindings;
            if (bindings) {
                return me.getCmp(bindings[0]);
            }
        },
        getQueryPanel: function () {
            var me = this;
            return me.getCmp("queryPanel");
        },
        getConditionPanel: function () {
            var me = this;
            if(me.getQueryPanel()) {
                return me.getQueryPanel().getCmp("conditionPanel");
            } else {
                return null;
            }
        },
        getConditionForm: function () {
            var me = this;
            return $("form", me.getConditionPanel());
        },
        getResultPanel: function () {
            var me = this;
            if(me.getQueryPanel()) {
                return me.getQueryPanel().getCmp("resultPanel");
            } else {
                return null;
            }
        },
        getQueryToolbar: function () {
            var me = this;
            if(me.getQueryPanel()) {
                return me.getQueryPanel().getCmp("queryToolbar");
            } else {
                return null;
            }
        },
        getIgnoreCaseValue: function () {
            var me = this;
            if(me.getCmp('ignoreCase')) {
                me.getCmp('ignoreCase').gotValue()
            } else {
                return null;
            }
        },
        getMultiSortValue: function () {
            var me = this;
            if(me.getCmp('multiSort')) {
                return me.getCmp('multiSort').gotValue()
            } else {
                return null;
            }
        },
        getEditPanel: function () {
            var me = this;
            return me.getCmp("editPanel");
        },
        getExtraPanel: function () {
            var me = this;
            return me.getCmp("extraPanel");
        },
        getEditToolbar: function () {
            var me = this;
            if(me.getEditPanel()) {
                return me.getEditPanel().getCmp("editToolbar");
            } else {
                return null;
            }
        },
        /*
        *  setEditToolbarVisStatus(false, ['cancel']) 表示只显示取消按钮；
         */
        setEditToolbarVisStatus: function(showOrHide, retainBtns) {
            $("[xtype='bBtn']", $("[itemid='editToolbar']", this.ele)).each(function(i) {
                var itemId = $(this).attr("itemid");
                if($.inArray(itemId, retainBtns) == -1) {
                    if(showOrHide) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                } else {
                    if(showOrHide) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                }
            });
        },
        /*
         *  setEditToolbarDisStatus(fasle, ['cancel']) 表示只启用取消按钮；
         */
        setEditToolbarDisStatus: function(disOrEna, retainBtns) {
            $("[xtype='bBtn']", $("[itemid='editToolbar']")).each(function(i) {
                var itemId = $(this).attr("itemid");
                if($.inArray(itemId, retainBtns) == -1) {
                    if(disOrEna) {
                        $(this).sotEnable();
                    } else {
                        $(this).sotDisable();
                    }
                } else {
                    if(disOrEna) {
                        $(this).sotDisable();
                    } else {
                        $(this).sotEnable();
                    }
                }
            });
        },
        getComQueryResultTable: function() {
            var me = this;
            var resultPanel = me.getResultPanel();
            if(resultPanel) {
                return $("[xtype='bTable'],[xtype='e_datagrid']", resultPanel);
            } else {
                return null;
            }
        },
        getUIStatus: function () {
            return this.uistatus;
        },
        setUIStatus: function (uistatus, needCopy) {
            this.uistatus = uistatus;
            var editPanel = this.getEditPanel();
            var queryPanel = this.getQueryPanel();

            if (DaLei.Const.UI_INFO_STATUS_NEW == uistatus) {
                if(editPanel) {
                    editPanel.sotEnable();
                }
                if(this.getCmp("editPanel->addBtn")) {
                    this.getCmp("editPanel->addBtn").sotDisable();
                }
                if(this.getCmp("editPanel->copyAddBtn")) {
                    this.getCmp("editPanel->copyAddBtn").sotDisable();
                }
                if(this.getCmp("editPanel->modifyBtn")) {
                    this.getCmp("editPanel->modifyBtn").sotDisable();
                }
                if(this.getCmp("editPanel->deleteBtn")) {
                    this.getCmp("editPanel->deleteBtn").sotDisable();
                }
                if(this.getCmp("editPanel->cancelBtn")) {
                    this.getCmp("editPanel->cancelBtn").sotEnable();
                }
                if(this.getCmp("editPanel->saveBtn")) {
                    this.getCmp("editPanel->saveBtn").sotEnable();
                }
                this.setWorkflowBtnDisableStatus();
            } else if (DaLei.Const.UI_INFO_STATUS_MODIFY == uistatus) {
                if(editPanel) {
                    editPanel.sotEnable();
                }
                if(this.getCmp("editPanel->addBtn")) {
                    this.getCmp("editPanel->addBtn").sotDisable();
                }
                if(this.getCmp("editPanel->copyAddBtn")) {
                    this.getCmp("editPanel->copyAddBtn").sotDisable();
                }
                if(this.getCmp("editPanel->modifyBtn")) {
                    this.getCmp("editPanel->modifyBtn").sotDisable();
                }
                if(this.getCmp("editPanel->deleteBtn")) {
                    this.getCmp("editPanel->deleteBtn").sotDisable();
                }
                if(this.getCmp("editPanel->cancelBtn")) {
                    this.getCmp("editPanel->cancelBtn").sotEnable();
                }
                if(this.getCmp("editPanel->saveBtn")) {
                    this.getCmp("editPanel->saveBtn").sotEnable();
                }
                this.setWorkflowBtnDisableStatus();
            } else if (DaLei.Const.UI_INFO_STATUS_VIEW == uistatus) {
                if(editPanel) {
                    editPanel.sotDisable();
                }
                if(this.getCmp("editPanel->addBtn")) {
                    this.getCmp("editPanel->addBtn").sotEnable();
                }
                if(this.getCmp("editPanel->copyAddBtn")) {
                    this.getCmp("editPanel->copyAddBtn").sotEnable();
                }
                if(this.getCmp("editPanel->modifyBtn")) {
                    this.getCmp("editPanel->modifyBtn").sotEnable();
                }
                if(this.getCmp("editPanel->deleteBtn")) {
                    this.getCmp("editPanel->deleteBtn").sotEnable();
                }
                if(this.getCmp("editPanel->cancelBtn")) {
                    this.getCmp("editPanel->cancelBtn").sotEnable();
                }
                if(this.getCmp("editPanel->saveBtn")) {
                    this.getCmp("editPanel->saveBtn").sotDisable();
                }
            } else if (DaLei.Const.UI_INFO_STATUS_NULL == uistatus) {
                if(editPanel) {
                    editPanel.sotDisable();
                }
                if(this.getCmp("editPanel->addBtn")) {
                    this.getCmp("editPanel->addBtn").sotEnable();
                }
                if(this.getCmp("editPanel->copyAddBtn")) {
                    this.getCmp("editPanel->copyAddBtn").sotDisable();
                }
                if(this.getCmp("editPanel->modifyBtn")) {
                    this.getCmp("editPanel->modifyBtn").sotDisable();
                }
                if(this.getCmp("editPanel->deleteBtn")) {
                    this.getCmp("editPanel->deleteBtn").sotDisable();
                }
                if(this.getCmp("editPanel->cancelBtn")) {
                    this.getCmp("editPanel->cancelBtn").sotDisable();
                }
                if(this.getCmp("editPanel->saveBtn")) {
                    this.getCmp("editPanel->saveBtn").sotDisable();
                }
            }

            this.setWorkflowBtnVisibleStatus(this.workFlowDefinitionKey);
            this.setPanelsVisableStatus();
            if (this.UIStatusChanged) this.UIStatusChanged(this, uistatus);
        },
        setWorkflowBtnVisibleStatus: function(workFlowDefinitionKey){
            var btns = ["workFlowAssignBtn","workFlowCommitBtn","workFlowRollBackBtn","workFlowCancelBtn","workFlowViewLogBtn"];
            if (DaLei.ObjUtil.isEmpty(workFlowDefinitionKey)) {
                for(var i = 0; i < btns.length; i++) {
                    if(this.getCmp("editPanel->" + btns[i])){
                        this.getCmp("editPanel->" + btns[i]).hide();
                    }
                }
            }
        },
        setWorkflowBtnDisableStatus: function() {
            var me = this;
            if (DaLei.ObjUtil.isNotEmpty(me.workFlowDefinitionKey)) {
                var btns = ["workFlowAssignBtn","workFlowCommitBtn","workFlowRollBackBtn","workFlowCancelBtn"];
                for(var i = 0; i < btns.length; i++) {
                    if(this.getCmp("editPanel->" + btns[i])) {
                        this.getCmp("editPanel->" + btns[i]).sotDisable();
                        //if(me.uistatus == DaLei.Const.UI_INFO_STATUS_VIEW || me.uistatus == DaLei.Const.UI_INFO_STATUS_NULL
                        //    || me.uistatus == DaLei.Const.UI_INFO_STATUS_NULL|| me.uistatus == DaLei.Const.UI_INFO_STATUS_NULL){
                        //
                        //}
                        //if(btns[i] != "workFlowViewLogBtn" ){
                        //    this.getCmp("editPanel->" + btns[i]).sotDisable();
                        //} else {
                        //    this.getCmp("editPanel->" + btns[i]).sotEnable();
                        //}
                    }
                }
            }
        },
        setPanelsVisableStatus: function() {
            var me = this;
            var uistatus = me.getUIStatus();
            var editPanel = me.getEditPanel();
            var queryPanel = me.getQueryPanel();
            if (DaLei.Const.UI_INFO_STATUS_NEW == uistatus) {
                if(editPanel) {
                    editPanel.css('display','block');
                }
                if(queryPanel && me.viewType == 1) {
                    queryPanel.css('display','none');
                }
            } else if (DaLei.Const.UI_INFO_STATUS_MODIFY == uistatus) {
                if(editPanel) {
                    editPanel.css('display','block');
                }
                if(queryPanel && me.viewType == 1) {
                    queryPanel.css('display','none');
                }
            } else if (DaLei.Const.UI_INFO_STATUS_VIEW == uistatus) {
                if(editPanel) {
                    editPanel.css('display','block');
                }
                if(queryPanel && me.viewType == 1) {
                    queryPanel.css('display','none');
                }
            } else if (DaLei.Const.UI_INFO_STATUS_NULL == uistatus) {
                if(editPanel && me.viewType == 1) {
                    editPanel.css('display','none');
                }
                if(queryPanel) {
                    queryPanel.css('display','block');
                }
            }
            if($("body").panel) {
                if(!DaLei.getSysConfig("pure_bootstrap")) {
                    $(".overflow-mCustomScrollbar").mCustomScrollbar({autoHideScrollbar:true,callbacks:{
                        onOverflowY:function(){
                            $(".overflow-mCustomScrollbar").doLayout();
                        }
                    }})
                }
                // $("body").panel("doLayout");
                $(".overflow-mCustomScrollbar").doLayout();
            }
        },
        validate: function() {
            var isValid = true;
            var me = this;
            var bindings = me.bindings;
            if (bindings) {
                $.each(bindings, function (index, item) {
                    var lastSplitItem = DaLei.StrUtil.getLastSplit(item, ".");
                    var itemObj = me.getCmp(lastSplitItem);

                    if (DaLei.ObjUtil.isNotEmpty(itemObj)) {
                        var xtype = itemObj.attr("xtype");
                        if ("bForm" == xtype && !itemObj.bForm("validate")) {
                            isValid = false;
                        }
                    }
                    for (var i = 0; i < 5; i++) {
                        var itemObjAppend1 = me.getCmp(lastSplitItem + ".append" + ((i == 0) ? '' : i));
                        if (DaLei.ObjUtil.isNotEmpty(itemObjAppend1)) {
                            var xtype = itemObjAppend1.attr("xtype");
                            if ("bForm" == xtype && !itemObjAppend1.bForm("validate")) {
                                isValid = false;
                            } else {
                                break;
                            }
                        }
                    }
                })
            }
            if (!isValid) {
                DaLei.Msg.warn(DaLei.I18N.COMMIT_VALIDATE_ERROR);
                return false;
            }
            return isValid;
        }

    });

};
abstractMvc(window.jQuery);

