/**
 * Created by lxj on 2016-08-30.
 */
DaLei.value_comps_ext = [];
DaLei.no_value_comps_bs_ext = [];

DaLei.value_comps_bs = ['bPanel', 'bForm', 'bText', 'bHidden', 'bLabel', 'bInteger','bDecimal','bDate','bDateTime', 'bCheckBox', 'bRadioBox','bTel','bFax','bPhone',
    'bEmail', 'bTextArea', 'bPassWord', 'bComboxSin','bComboxTree', 'bRadioGroup', 'bCheckGroup', 'bTable','bAhead','bFile','bTree','bWysiHtml',
    'e_validatebox','e_textbox','e_textareabox','e_passwordbox','e_combo','e_combotree','e_combogrid','e_numberbox', 'e_datebox','e_datetimebox','e_spinner','e_numberspinner','e_slider',
    'e_datetimespinner','e_timespinner','e_filebox','e_searchbox','e_combobox','e_calendar','e_datalist','e_tree','e_tab','e_datagrid','e_editgrid'];
DaLei.no_value_comps_bs = ['bBtn', 'e_linkbutton','checkbox_label','e_tablist'];
DaLei.value_comps =  DaLei.value_comps_bs.concat(DaLei.value_comps_ext);
DaLei.no_value_comps = DaLei.no_value_comps_bs.concat(DaLei.no_value_comps_bs_ext);
DaLei.comps_bs = DaLei.value_comps_bs.concat(DaLei.no_value_comps_bs);
DaLei.comps = DaLei.value_comps_bs.concat(DaLei.no_value_comps_bs, DaLei.value_comps_ext, DaLei.no_value_comps_bs_ext);
DaLei.Utils.getCompKey = function (ele) {
    var key = null;
    if(ele instanceof jQuery) {
        var itemId = ele.attr("itemId");
        var id = ele.attr("id");
        var name = ele.attr("name");
        key = itemId?itemId:(id?id:name);
    }
    return key;
};
DaLei.Utils.parseOptions = function (s) {
    var options = {};
    if (s){
        if (s.substring(0, 1) != '{'){
            s = '{' + s + '}';
        }
        options = (new Function('return ' + s))();
    }
    return options;
};
DaLei.define("DaLeiNavTab", {
    select: function(tabId) {
        var tabStrip = $("#navtabstrip");
        var selTab = $(".nav-tabs li[id='" + tabId + "']", tabStrip);
        if(selTab.length > 0) {
            var activeTab = $("li.active", tabStrip);
            if(activeTab.length > 0) {
                activeTab.removeClass("active");
            }
            var activeContent = $(".tab-content >.tab-pane", tabStrip).filter(".active");
            if(activeContent.length > 0) {
                activeContent.removeClass("active");
            }

            var panelId = selTab.children("a").attr("href");
            var selContent = $(".tab-content > "+panelId+".tab-pane", tabStrip);
            var temp = $.merge(selTab, selContent);
            temp.fadeIn("fast", function() {
                selTab.addClass("active");
                selContent.addClass("active");
                tabStrip.children(".nav-tabs").trigger("shown.bs.tab");
            });
            DaLei.CacheUtil.setTemp(DaLei.Const.CACHE_ACTIVE_MODULE, DaLei.Const.CACHE_ACTIVE_MODULE_KEY, tabId);
            DaLei.updateRoute(tabId);
            this.expandMenu(tabId);
        }
    },
    addTab: function(newTab) {
        if(newTab instanceof Object) {
            var tabStrip = $("#navtabstrip");
            var title = newTab.title;
            var isindex = 'indexmenu' == newTab.tabId;
            if(newTab.hasOwnProperty("tabId") && newTab.hasOwnProperty("title") && newTab.hasOwnProperty("content")) {
                //var tabTemplate = '<li id="'+ newTab.tabId + '"><a href="#content_'+ newTab.tabId + '" data-toggle="tab">' +
                //    '<span class="bs-tab-title">'+ newTab.title;
                //        if(!isindex){
                //            tabTemplate = tabTemplate + '</span>&nbsp;&nbsp;<span class="fa fa-times-circle"></span></a></li>';
                //        }

                var tabTemplate = '<li id="'+ newTab.tabId + '" style="position: relative;"><a href="#content_'+ newTab.tabId + '" data-toggle="tab"><em></em>' +
                    '<span class="bs-tab-title">'+ newTab.title;
                if(!isindex){
                    tabTemplate = tabTemplate + '</span>&nbsp;&nbsp;<span class="fa fa-times-circle"></span></a><em></em><i class="arrow-right"></i></li>';
                }

                var top = tabStrip.children(".tab-content").position().top + 20;
                var mask = '<div id="loading" class="loading-mask" > '+
                        //'<h4>加载中....</h4>' +
                    '<div class="loader" style="position: absolute; left: calc(50% - 20px); top: calc(50% - 20px);"><div class="loader-inner line-scale"><div></div><div></div><div></div><div></div><div></div></div></div>'+
                    //'<div class="fl spinner3" style="position: absolute; left: calc(50% - 20px); top: calc(50% - 20px);"><div class="dot1"></div><div class="dot2"></div></div>' +
                    '</div>';
                if(!newTab.mask) {
                    mask = "";
                }
                var tabContent = '<div class="tab-pane" style="height: 100%;position: relative;" id="content_'+newTab.tabId+'"><div class="overflow-mCustomScrollbar" style="height: 100%;overflow-x: hidden; overflow-y: auto;"> '+ newTab.content +'</div>' + mask + ' </div>';
                var $closeAllTabs = tabStrip.children(".nav-tabs").find(".closeAllTabs");
                if ($closeAllTabs.length > 0){
                    $closeAllTabs.before(tabTemplate);
                } else {
                    tabStrip.children(".nav-tabs").append(tabTemplate);
                }
                tabStrip.children(".tab-content").append(tabContent);

                if(newTab.mask) {
                    $("#content_"+newTab.tabId +".tab-pane").children("div:first").addClass("invisible");
                }
                this.select(newTab.tabId);
            }
        }
    },
    refresh: function(tabId, content) {
        var tabStrip = $("#navtabstrip");
        var top = tabStrip.children(".tab-content").position().top + 20;
        var mask = '<div id="loading" class="loading-mask" > '+
                //'<h4>加载中....</h4>' +
            '<div class="loader" style="position: absolute; left: calc(50% - 20px); top: calc(50% - 20px);"><div class="loader-inner line-scale"><div></div><div></div><div></div><div></div><div></div></div></div>'+
            '</div>';
        $("#content_"+tabId +".tab-pane").empty().append('<div style="height: 100%;overflow-x: hidden; overflow-y: auto;" class="overflow-mCustomScrollbar invisible">'+ content +'</div>' + mask);
        this.select(tabId);
    },
    removeMask: function(tabId) {
        var panel = $("#content_"+tabId +".tab-pane");
        if(panel.length > 0) {
            panel.children("div:first").removeClass("invisible");
        }
        if($('#loading').length > 0) {
            $('#loading').fadeOut('fast', function () {
                $(this).empty().remove();
            });
        }
    },
    isExist: function(tabId) {
        var tabStrip = $("#navtabstrip");
        var selTab = $(".nav-tabs li[id='" + tabId + "']", tabStrip);
        if(selTab.length > 0) {
            return selTab.length;
        } else {
            return 0;
        }
    },
    setFavorite: function(tabId, bf) {
        var tabStrip = $("#navtabstrip");
        var selTab = $(".nav-tabs li[id='" + tabId + "']", tabStrip);
        if(selTab.length > 0 && 'indexmenu' != tabId) {
            if(bf) {
                selTab.children("a").prepend('<span itemId="star" style="color: #dd4b39" class="fa fa-star"></span>&nbsp;&nbsp;');
            }  else {
                selTab.children("a").prepend('<span itemId="star" style="color: #dd4b39" class="fa fa-star-o"></span>&nbsp;&nbsp;');
            }
        }
    },

    getMenuCode: function(ele) {
        var tab = $(ele).parentsUntil("ul").filter("li");
        if (tab.length > 0) {
            var menuCode = tab.attr("id");
            return menuCode;
        }
    },
    closeTab: function(ele) {
        var me = this;
        var tabStrip = $("#navtabstrip");
        var tab = $(ele).parentsUntil("ul").filter("li");
        var tabId = tab.attr("id");
        DaLei.CacheUtil.setTemp(DaLei.Const.CACHE_MODULE_TAB, tabId, null);
        var content = $(".tab-content > .tab-pane", tabStrip).filter("#content_" + tabId);
        if(tab.length > 0) {
            var preTab = tab.prev();
            var temp = $.merge(tab, content);
            if(preTab.length == 0) {
                preTab = $(".nav-tabs>li:last", tabStrip);
            }
            $(temp).fadeOut ("fast", function(){
                $(this).empty().remove();
                if(preTab.length > 0) {
                    var preTabId = preTab.attr("id");
                    me.select(preTabId);
                }
            });
        }
    },
    expandMenu: function (itemId) {
        if(!$.AdminLTE.layout) {
            return;
        }
        var selector = "a[itemid='"+itemId+"']";

        var sidebarMenu = $("[id='menubar'].sidebar-menu");
        var currentUl = $(selector,sidebarMenu).parents("ul").first();
        if(currentUl.is('.menu-open') && currentUl.is(':visible')) {
            currentUl.children("li.active").removeClass("active");
            $(selector,sidebarMenu).parents("li").first().addClass("active");
        } else {
            sidebarMenu.find("li.active").removeClass("active");
            sidebarMenu.find("ul.menu-open").slideUp($.AdminLTE.options.animationSpeed);
            sidebarMenu.find("ul.menu-open").removeClass('menu-open');
            slideMenu(sidebarMenu);
            $.AdminLTE.layout.fix();
        }
        function slideMenu(ul) {
            var childli = ul.children().has(selector);
            childli.addClass("active");
            if(childli.children("ul").length>0) {
                var childul = childli.children("ul");
                childul.slideDown($.AdminLTE.options.animationSpeed, function () {
                    childul.addClass('menu-open');
                });
                slideMenu(childul);
            }
        }
    }
});
DaLei.define("scdp_comp", {
    xtype:"",
    menuCode: null,
    controller: null,
    context:null,
    ele:null,
    options: null,
    itemId: null,
    UNIQUE_KEY: null,
    _init: function() {
        var name = DaLei.Utils.getCompKey(this.ele);
        this.itemId = name;
        this.UNIQUE_KEY = DaLei.StrUtil.getUUID();
        if(name && DaLei.ObjUtil.isEmpty(this.ele.attr("name"))) {
            this.ele.attr("name", name);
        }

        var optionstr = $(this.ele).data("options");
        if(optionstr !== "" && optionstr !== null && optionstr !== undefined) {
            try {
                this.options = DaLei.Utils.parseOptions(optionstr);
            } catch(e) {
                if(!name) {
                    name = $(this.ele).attr("field");
                }
                DaLei.DebugUtil.logInfo("component " + this.xtype + " " + name + " parse options error!");
            }
            if(this.options === null || this.options === undefined) {
                this.options = {};
            }
        } else {
            this.options = {};
        }
        this.options = $.extend(true,{}, DaLei.DefaultOptions[this.xtype] || {}, this.options);
        if(this.commonInit) {
            this.commonInit();
        }
        this.init();
    },
    init: function() {

    },
    destroy: function() {

    },
    sotDisable: function () {
        this.ele.attr("disabled", true);
        this.ele.addClass("disabled");
    },
    sotEnable: function() {
        this.ele.removeAttr("disabled");
        this.ele.removeClass("disabled");
    },
    sotVisable: function (){
        if(this.ele.hasClass("hidden") || this.ele.hasClass("invisible")) {
            this.ele.removeClass("hidden");
            this.ele.removeClass("invisible");
        } else if(this.ele.parent().hasClass("hidden") || this.ele.parent().hasClass("invisible")){
            this.ele.parent().removeClass("hidden");
            this.ele.parent().removeClass("invisible");
        }
    },
    sotHidden: function(needPostion) {
        if((!this.ele.hasClass("hidden") && !this.ele.hasClass("invisible")) && (this.ele.css("display") == 'none' || this.ele.css("display") == 'hidden')) {
            var parent = this.ele.parent();
            if(needPostion) {
                parent.addClass("invisible");
            } else {
                parent.addClass("hidden");
            }
        } else if((!this.ele.hasClass("hidden") && !this.ele.hasClass("invisible")) && (this.ele.css("display") != 'none' && this.ele.css("display") != 'hidden')) {
            this.ele.addClass("hidden");
        }
    }
});
DaLei.define("scdp_value_comp", {
    extend:'scdp_comp',
    commonInit: function() {
        this.filterFields = this.ele.attr("filterFields");
        this.cascadeField = this.ele.attr("cascadeField");
        this.target = this.ele.attr("target");
        this.options.filterFields = this.filterFields;
        this.options.cascadeField = this.cascadeField;
        this.options.target = this.target;
    },
    gotValue: function() {
        return this.ele.val();
    },
    sotValue: function(v) {
        this.ele.val(v);
    },
    cascadeLoad: function (forceFul, isFilterEmpty) {
        var me = this;
        if (DaLei.ObjUtil.isNotEmpty(me.cascadeField)) {
            var upForm = me.ele.parents("[xtype='bForm'],[xtype='bPanel']");
            var cascadeFieldArr = DaLei.StrUtil.split(me.cascadeField,",");
            for (var i = 0; i < cascadeFieldArr.length; i++) {
                var cascadeObj = null;
                cascadeObj = upForm.getCmp(cascadeFieldArr[i]);
                if (DaLei.ObjUtil.isNotEmpty(cascadeObj) && cascadeObj.length > 0) {
                    if (forceFul || (cascadeObj.displayDesc == true)) {
                        cascadeObj.sotValue('');
                    }
                }
            }
        }
    },
    refreshTarget: function (obj) {
        if (DaLei.ObjUtil.isNotEmpty(obj.target)) {
            var targetFields = DaLei.StrUtil.split(obj.target,",");
            $.each(targetFields, function (i, item) {
                var itemMapping = DaLei.StrUtil.split(item,"|");
                var formContainer = obj.ele.parents("[xtype='bForm'],[xtype='bPanel']");
                var targetObj = null;
                if(formContainer.length>0) {
                    targetObj = formContainer.getCmp(itemMapping[0]);
                }
                var record = obj.gotRecord();
                if(record && $.isArray(record) && record.length == 1) {
                    record = record[0];
                }
                if (DaLei.ObjUtil.isNotEmpty(targetObj) && targetObj.length >0) {
                    if (DaLei.ObjUtil.isNotEmpty(record)) {
                        var rData = record;
                        if (DaLei.ObjUtil.isNotEmpty(itemMapping[1])) {
                            if($.isArray(rData)) {
                                var separator = DaLei.StrUtil.replaceNull(obj.options.separator, "|");
                                var values = [];
                                $.each(rData, function(i, row) {
                                    values.push(row[itemMapping[1]]);
                                });
                                var targetValue = values.join(separator);
                                targetObj.sotValue(targetValue);
                            } else {
                                targetObj.sotValue(rData[itemMapping[1]]);
                            }
                        } else {
                            if($.isArray(rData)) {
                                var separator = DaLei.StrUtil.replaceNull(obj.options.separator, "|");
                                var values = [];
                                $.each(rData, function(i, row) {
                                    values.push(row.codedesc);
                                });
                                var targetValue = values.join(separator);
                                targetObj.sotValue(targetValue);
                            } else {
                                targetObj.sotValue(rData.codedesc);
                            }
                        }
                    } else {
                        targetObj.sotValue(null);
                    }
                }
            })
        }
    }
});
DaLei.define("bPanel", {
    extend: 'scdp_value_comp',
    toList: false,
    init: function() {
        var toList = this.ele.attr("toList");
        if("true" == toList) {
            this.toList = true;
        }
    },
    gotValue: function() {
        var contex = this.ele;
        var retValue = {};
        var subPanels = $("[xtype='bForm'],[xtype='bPanel']", contex);

        $.each(DaLei.value_comps, function(index, type){
            var subComps = $("[xtype='" + type + "']", contex).not(function(index,comp) {
                var ret = subPanels.find(this);
                if(ret.length>0) {
                    return true;
                } else {
                    return false;
                }
            });

            if(subComps.length > 0) {
                $.each(subComps, function(index, subComp){
                    var bindId = $(subComp).attr("bindId");
                    var xtype = $(subComp).attr("xtype");
                    if(bindId) {
                        return true;
                    }
                    var v = null;
                    if(!$(subComp).data(xtype)) {
                        if(subComps.data(xtype)) {
                            v = subComps.data(xtype).gotValue();
                        }
                    } else {
                        v = $(subComp).gotValue();
                    }
                    var key = DaLei.Utils.getCompKey($(subComp));
                    if(('bPanel' == xtype || 'bForm' == xtype) && (DaLei.ObjUtil.isEmpty(key) || ($(subComp).data(xtype).options && $(subComp).data(xtype).options.skipValue))) {
                        retValue = $.extend(retValue, v);
                    } else {
                        retValue[key] = v;
                    }
                });
            }
        });
        return retValue;
    },
    sotValue: function(obj) {
        var contex = this.ele;
        var isEmpty = false;
        if(obj == null || Object.keys(obj).length === 0) {
            isEmpty = true;
        }
        $.each(DaLei.value_comps, function(index, type){
            var subComps = $("[xtype='" + type + "']", contex);
            if(subComps.length > 0) {
                $.each(subComps, function(index, subComp){
                    //var itemId = $(subComp).attr("itemId");
                    var key = DaLei.Utils.getCompKey($(subComp));

                    if(!$(subComp).data(type)) {
                        if(subComps.data(type)) {
                            if(isEmpty) {
                                subComps.sotValue(null);
                            } else if(obj.hasOwnProperty(key)){
                                subComps.sotValue(obj[key]);
                            }
                        }
                    } else {
                        if(isEmpty) {
                            $(subComp).sotValue(null);
                        } else if(obj.hasOwnProperty(key)){
                            $(subComp).sotValue(obj[key]);
                        }
                    }
                });
            }
        });
        if(this.xtype ==="bForm" && DaLei.ObjUtil.isEmpty(obj)) {
            var scdpValidator = this.ele.data('scdpValidator');
            if(scdpValidator) {
                scdpValidator.resetForm();
            }
        }
    },
    gotCondition: function() {
        var contex = this.ele;
        var retValue = {};
        var subPanels = $("[xtype='bForm'],[xtype='bPanel']", contex);
        $.each(DaLei.value_comps, function(index, type){
            var subComps = $("[xtype='" + type + "']", contex).not(function(index,comp) {
                var ret = subPanels.find(this);
                if(ret.length>0) {
                    return true;
                } else {
                    return false;
                }
            });
            if(subComps.length > 0) {
                $.each(subComps, function(index, subComp){
                    var key = DaLei.Utils.getCompKey($(subComp));
                    if('bForm' == type || 'bPanel' == type) {
                        if(!$(subComp).data(type)) {
                            var v = subComps[type]("gotCondition");
                            retValue[key] = v;
                        } else {
                            var v = $(subComp)[type]("gotCondition");
                            retValue[key] = v;
                        }
                    } else {
                        var ret = {};
                        ret.value = $(subComp).gotValue();
                        ret.operator = $(subComp).attr("operator");
                        ret.field = $(subComp).attr("field");
                        ret.xtype = $(subComp).attr("xtype");
                        var compObj = $(subComp).data(ret.xtype);
                        if($.inArray(ret.xtype,["e_combo","e_combobox","e_combotree","e_combogrid"]) != -1) {
                            var options = compObj.options;
                            if(options.multiple) {
                                ret.separator = DaLei.StrUtil.replaceNull(options.separator, "|");
                            }
                        }
                        if('DAO_TYPE' === key || 'DAO_KEY' === key) {
                            ret = ret.value;
                        }
                        retValue[key] = ret;
                    }
                });
            }
        });
        return retValue;
    },
    sotDisable: function () {
        var contex = this.ele;
        var subPanels = $("[xtype='bForm'],[xtype='bPanel']", contex);
        $.each(DaLei.comps, function(index, type){
            var subComps = $("[xtype='" + type + "']", contex).not(function(index,comp) {
                var ret = subPanels.find(this);
                if(ret.length>0) {
                    return true;
                } else {
                    return false;
                }
            });

            if(subComps.length > 0) {
                $.each(subComps, function(index, subComp){
                    $(subComp).sotDisable();
                });
            }
        });
    },
    sotEnable: function() {
        var contex = this.ele;
        var subPanels = $("[xtype='bForm'],[xtype='bPanel']", contex);
        $.each(DaLei.comps, function(index, type){
            var subComps = $("[xtype='" + type + "']", contex).not(function(index,comp) {
                var ret = subPanels.find(this);
                if(ret.length>0) {
                    return true;
                } else {
                    return false;
                }
            });

            if(subComps.length > 0) {
                $.each(subComps, function(index, subComp){
                    $(subComp).sotEnable();
                });
            }
        });
    },
    doLayout: function(all) {
        var me = this;
        if(!$.easyui) {
            return;
        }
        function reSize(panelDom,type){
            if(!panelDom){
                return;
            }
            var isBody=panelDom==$("body")[0];
            var s=$(panelDom).find("div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible,.easyui-fluid:visible");
            s.each(function(){
                $(this).triggerHandler("_resize",[all||false]);
            });
        };
        setTimeout(function(){
            reSize(me.ele[0], "body");
            reSize(me.ele.siblings(".panel-footer")[0],"footer");
        }, $.AdminLTE.options.animationSpeed - 100);
    }
});
DaLei.define("bForm", {
    extend:'bPanel',
    bindId: null,
    init: function() {
        this.callParent();

        var me = this;
        this.bindId = this.ele.attr("bindId");

        if($.fn.form) {
            me.ele.form(this.options);
        }
    },
    validate: function() {
        var me = this;
        var scdpValidator = this.ele.data('scdpValidator');
        if(scdpValidator) {
            scdpValidator.validate();
            return scdpValidator.isValid();
        } else if($.fn.form) {
            return me.ele.form("validate");
        } else {
            return true;
        }
    },
    reset: function() {
        var me = this;
        this.sotValue(null);
        var scdpValidator = this.ele.data('scdpValidator');
        if(scdpValidator) {
            scdpValidator.resetForm();
        } else if($.fn.form) {
            return me.ele.form("reset");
        }
    },
    clear: function() {
        var me = this;
        if($.fn.form) {
            return me.ele.form("clear");
        }
    }
});

DaLei.define("bText", {
    extend:'scdp_value_comp'
});

DaLei.define("bTextArea", {
    extend:'scdp_value_comp',
    sotDisable: function () {
        this.ele.prop("readonly", true);
    },
    sotEnable: function() {
        this.ele.prop("readonly", false);
    }
});

DaLei.define("bCheckBox", {
    extend:'scdp_value_comp',
    value: 0,
    init: function(){
        var me = this;

        this.ele.iCheck(this.options);
        this.ele.on("ifChecked", function(){
            if(me.ele.val() == null) {
                me.value = 1;
            } else {
                me.value = parseInt(me.ele.val());
            }
            me.ele.trigger("change", parseInt(me.value));
        });
        this.ele.on("ifUnchecked", function() {
            me.value = 0;
            me.ele.trigger("change", parseInt(me.value));
        })
    },
    destroy: function() {
        this.ele.iCheck("destroy");
    },
    gotValue: function() {
        if(this.options.stringValue) {
            return this.value.toString();
        } else {
            return parseInt(this.value);
        }
    },
    sotValue: function(value) {
        var v = parseInt(this.ele.val()?this.ele.val():1);
        if(v == value && value != 0) {
            this.ele.iCheck('check');
        } else {
            this.ele.iCheck('uncheck');
            this.ele.iCheck('update');
        }
    },
    sotDisable: function () {
        this.ele.iCheck('disable');
    },
    sotEnable: function() {
        this.ele.iCheck('enable');
    }
});

DaLei.define("bRadioGroup", {
    extend:'scdp_value_comp',
    groupName:null,
    value:null,
    init: function(){
        var me = this;
        var codeType = this.ele.attr("codeType");
        var values = this.ele.attr("values");
        var key = DaLei.Utils.getCompKey(this.ele);
        var radioClass = this.ele.attr("radioClass");
        var radioStyle = this.ele.attr("radioStyle");
        this.groupName = key + '_' + codeType;
        if(DaLei.ObjUtil.isEmpty(codeType)) {
            this.groupName = key + '_' + "radio";
        }
        var data = null;
        if(DaLei.ObjUtil.isNotEmpty(codeType)) {
            data = DaLei.getComboStoreDate("scdp_fmcode", codeType, me.menuCode, null, me.options.needCache);
        } else if(DaLei.ObjUtil.isNotEmpty(values)) {
            data = eval('('+values +')');
        }
        if(data && data.length>0) {
            var html = "";
            $.each(data, function(i, row) {
                var value = row.code;
                var label = row.codedesc;
                html += '<label class="'+radioClass+'" style="'+ radioStyle +'">' +
                    '<input type="radio" name="'+me.groupName+'" value="'+value+'"><span style="padding-left: 5px;">'+ label +
                    '</span></label> '
            });
            if(html != "") {
                this.ele.append(html);
                $("[name='"+ this.groupName +"']", this.ele).iCheck(me.options);
                $("[name='"+ this.groupName +"']", this.ele).on("ifChecked", function(){
                    me.value = me.gotValue();
                    me.ele.trigger("change", me.value);
                });
                $("[name='"+ this.groupName +"']", this.ele).on("ifUnchecked", function() {
                    me.value = me.gotValue();
                    me.ele.trigger("change", me.value);
                })
            }
        }
    },
    destroy: function() {
        $("[name='"+ this.groupName +"']", this.ele).iCheck("destroy");
    },
    gotValue: function() {
        var v;
        $("[name='"+this.groupName+"']").each(function() {
            if($(this).is(":checked")) {
                v = $(this).val();
                return;
            }
        });
        return v;
    },
    sotValue: function(value) {
        $("[name='"+this.groupName+"']").each(function() {
            var v = $(this).val();
            if(v === value) {
                //v = $(this).attr("checked","checked");
                $(this).iCheck('check');
                return;
            } else {
                $(this).iCheck('uncheck');
            }
        });
    },
    sotDisableItem: function(values) {
        if(DaLei.ObjUtil.isNotEmpty(values) && $.isArray(values)) {
            $("[name='"+this.groupName+"']",this.ele).each(function() {
                var value = $(this).val();
                var item = this;
                $.each(values, function(i,v) {
                    if(value == v) {
                        $(item).iCheck('disable');
                    }
                });
            });
        }
    },
    sotEnableItem: function(values) {
        if(DaLei.ObjUtil.isNotEmpty(values) && $.isArray(values)) {
            $("[name='"+this.groupName+"']",this.ele).each(function() {
                var value = $(this).val();
                var item = this;
                $.each(values, function(i,v) {
                    if(value == v) {
                        $(item).iCheck('enable');
                    }
                });
            });
        }
    },
    sotDisable: function () {
        $("[name='"+this.groupName+"']",this.ele).each(function() {
            $(this).iCheck('disable');
        });
    },
    sotEnable: function() {
        $("[name='"+this.groupName+"']", this.ele).each(function() {
            $(this).iCheck('enable');
        });
    }
});

DaLei.define("bCheckGroup", {
    extend:'scdp_value_comp',
    groupName:null,
    value:null,
    init: function(){
        var me = this;
        var codeType = this.ele.attr("codeType");
        var values = this.ele.attr("values");
        var key = DaLei.Utils.getCompKey(this.ele);
        var radioClass = this.ele.attr("radioClass");
        var radioStyle = this.ele.attr("radioStyle");
        this.groupName = key + '_' + codeType;
        if(DaLei.ObjUtil.isEmpty(codeType)) {
            this.groupName = key + '_' + "checkbox";
        }
        var data = null;
        if(DaLei.ObjUtil.isNotEmpty(codeType)) {
            data = DaLei.getComboStoreDate("scdp_fmcode", codeType, me.menuCode, null, me.options.needCache);
        } else if(DaLei.ObjUtil.isNotEmpty(values)) {
            data = eval('('+values +')');
        }
        if(data && data.length>0) {
            var html = "";
            $.each(data, function(i, row) {
                var value = row.code;
                var label = row.codedesc;
                html += '<label class="'+radioClass+'" style="'+ radioStyle +'">' +
                    '<input type="checkbox" name="'+me.groupName+'" value="'+value+'"><span style="padding-left: 5px;">'+ label +
                    '</span></label> '
            });
            if(html != "") {
                this.ele.append(html);
                $("[name='"+ this.groupName +"']", this.ele).iCheck(me.options);
                $("[name='"+ this.groupName +"']", this.ele).on("ifChecked", function(){
                    me.value = me.gotValue();
                    me.ele.trigger("change", me.value);
                });
                $("[name='"+ this.groupName +"']", this.ele).on("ifUnchecked", function() {
                    me.value = me.gotValue();
                    me.ele.trigger("change", me.value);
                })
            }
        }
    },
    destroy: function() {
        $("[name='"+ this.groupName +"']", this.ele).iCheck("destroy");
    },
    gotValue: function() {
        var v = "";
        $("[name='"+this.groupName+"']").each(function() {
            if($(this).is(":checked")) {
                if(v === "") {
                    v += $(this).val();
                } else {
                    v += "," +$(this).val();
                }
                return;
            }
        });
        if(v === "") {
            v = null;
        }
        return v;
    },
    sotValue: function(value) {
        var valueLst = [];
        if(DaLei.ObjUtil.isNotEmpty(value) && typeof value === 'string') {
            valueLst = DaLei.StrUtil.split(value,",");
        }
        $("[name='"+this.groupName+"']").each(function() {
            var v = $(this).val();
            if($.inArray(v, valueLst) !== -1) {
                //v = $(this).attr("checked","checked");
                $(this).iCheck('check');
                return;
            } else {
                $(this).iCheck('uncheck');
                $(this).iCheck('update');
            }
        });
    },
    sotDisableItem: function(values) {
        if(DaLei.ObjUtil.isNotEmpty(values) && $.isArray(values)) {
            $("[name='"+this.groupName+"']",this.ele).each(function() {
                var value = $(this).val();
                var item = this;
                $.each(values, function(i,v) {
                    if(value == v) {
                        $(item).iCheck('disable');
                    }
                });
            });
        }
    },
    sotEnableItem: function(values) {
        if(DaLei.ObjUtil.isNotEmpty(values) && $.isArray(values)) {
            $("[name='"+this.groupName+"']",this.ele).each(function() {
                var value = $(this).val();
                var item = this;
                $.each(values, function(i,v) {
                    if(value == v) {
                        $(item).iCheck('enable');
                    }
                });
            });
        }
    },
    sotDisable: function () {
        $("[name='"+this.groupName+"']",this.ele).each(function() {
            $(this).iCheck('disable');
        });
    },
    sotEnable: function() {
        $("[name='"+this.groupName+"']", this.ele).each(function() {
            $(this).iCheck('enable');
        });
    }
});

DaLei.define("bComboxSin", {
    extend: 'scdp_value_comp',
    combType:null,
    codeType:null,

    idPrefix:null,
    loaded:false,
    combData:null,
    init: function () {
        this.combType = this.ele.attr("combType");
        this.codeType = this.ele.attr("codeType");

        var placeholder = this.ele.attr("placeholder");

        var me = this;
        if(!this.combType) {
            this.combType="scdp_fmcode"
        }
        this.idPrefix = this.combType + "_" + this.codeType;
        //this.options.size = 7;
        var liveSearch = this.ele.attr("liveSearch");
        if("false" ===liveSearch) {
            this.options.minimumResultsForSearch = Infinity;
        }
        if(DaLei.ObjUtil.isNotEmpty(placeholder)) {
            this.options.placeholder = placeholder;
        } else {
            this.options.placeholder = "";
        }

        var tags = this.ele.attr("tags");
        if("true" ===tags) {
            this.options.tags = true;
        }

        this.options.data = [];
        var lang = DaLei.getSysConfig("locale_id");
        if("zh_CN" == lang) {
            this.options.language = "zh-CN";
        }

        me.ele.select2(this.options);

        me.ele.on("select2:opening", function (e) {
            //e.preventDefault();
            //e.stopPropagation();
            var upForm = me.ele.parents("[xtype='bForm'],[xtype='bPanel']");
            me.reload(upForm).done(function(ret) {
                if(ret) {
                    var results = me.ele.data("select2").results;
                    results.clear();
                    me.ele.empty();

                    var dataAdapter = me.ele.data("select2").dataAdapter;
                    dataAdapter.addOptions(dataAdapter.convertToOptions(ret));
                    me.ele.val(null);
                    me.ele.trigger('change.select2');
                    //var data = {};
                    //data.results = ret;
                    //me.ele.data("select2").trigger("results:all",{data:data,query:{term:null}});
                    //var results = me.ele.data("select2").results;
                    //results.clear();
                    //results.append(data);
                    //var dataAdapter = me.ele.data("select2").dataAdapter;
                    //dataAdapter.addOptions(dataAdapter.convertToOptions(ret));
                }
            });
        });
        me.ele.on("change", function (e) {
            me.cascadeLoad(true);
            me.refreshTarget(me);
        })
    },
    destroy: function() {
        this.ele.select2("destroy");
    },
    gotRecord:function() {
        return this.ele.data("select2").data();
    },
    gotValue: function() {
        return this.ele.data("select2").val();
    },
    sotValue: function(value) {
        var me = this;
        var upForm = me.ele.parents("[xtype='bForm'],[xtype='bPanel']");
        if(value !==null) {
            me.reload(upForm).done(function(ret) {
                if(ret) {
                    var results = me.ele.data("select2").results;
                    me.ele.empty();
                    results.clear();

                    var dataAdapter = me.ele.data("select2").dataAdapter;
                    dataAdapter.addOptions(dataAdapter.convertToOptions(ret));
                    //me.ele.data("select2").trigger('selection:update', {
                    //    data: {id:'',text:''}
                    //});

                    me.ele.val(value);
                    me.ele.trigger('change.select2');
                }
            });
        }

        me.ele.val(value);
        me.ele.trigger('change.select2');
        me.cascadeLoad(true);
        me.refreshTarget(me);
    },
    sotDisable: function () {
        this.ele.prop("disabled", true);
        this.ele.addClass("disabled");
    },
    sotEnable: function() {
        this.ele.prop("disabled", false);
        this.ele.removeClass("disabled");
    },
    reload: function (upContainer, record) {
        var me = this;
        me.loaded = true;
        var dtd = $.Deferred();
        var filterMap = this.filterMap || {};
        if (DaLei.ObjUtil.isNotEmpty(me.filterFields) && upContainer.length > 0) {
            var filter = DaLei.StrUtil.split(this.filterFields, ",");
            $.each(filter, function (i,item) {
                if(item.indexOf(":") != -1) {
                    var itemMapping = DaLei.StrUtil.split(item, ":");
                    filterMap[itemMapping[0]] = itemMapping[1];
                } else {
                    var itemMapping = DaLei.StrUtil.split(item, "|");
                    var value = null;
                    if (upContainer.getCmp(itemMapping[0])) {
                        value = upContainer.getCmp(itemMapping[0]).gotValue();
                    }

                    value = DaLei.StrUtil.replaceNull(value);
                    if (DaLei.ObjUtil.isNotEmpty(itemMapping[1])) {
                        filterMap[itemMapping[1]] = value;
                    } else {
                        filterMap[itemMapping[0]] = value;
                    }
                }
            });
        }
        var listData = DaLei.getComboStoreDate(this.combType, this.codeType, this.menuCode, filterMap, me.options.needCache);
        if(this.combData === listData) {
            dtd.reject();
            return dtd.promise();
        } else {
            this.combData = listData;
        }
        if(listData && listData.length>0) {

            var tempList = $.map(listData, function (obj) {
                obj.id = obj.code; // replace pk with your identifier
                obj.text = obj.codedesc;
                var key = me.idPrefix + obj.code;
                if(DaLei.ObjUtil.isEmpty(obj.id) || DaLei.ObjUtil.isEmpty(obj.text)) {
                } else {
                    return obj;
                }
            });
            dtd.resolve(tempList);
        } else {
            dtd.resolve([]);
        }
        return dtd.promise();
    }
});

DaLei.define("bLabel", {
    extend: 'scdp_value_comp',
    init: function () {

    },
    gotValue: function() {
        return this.ele.text();
    },
    sotValue: function(value) {
        this.ele.text(value);
    }
});

DaLei.define("bTable", {
    extend: 'scdp_value_comp',
    table: null,
    isLoadPage:false,
    checkAllBoxId: null,
    aggfuns:null,
    init: function () {

        var me = this;
        var cols = $('thead th', this.ele);
        var columns =[];
        me.aggfuns = {};
        cols.each(function(i, col) {
            var field = {};
            field.data = $(this).attr("field");
            var colOptionStr = $(this).data("options");
            if(colOptionStr) {
                var colOptions = DaLei.Utils.parseOptions(colOptionStr);
                $.extend(field, colOptions);
            }
            if(field.aggfun && field.data) {
                me.aggfuns[field.data] = field.aggfun;
            }
            var visible = $(this).attr("visible");
            if(visible === 'false') {
                field.visible = false;
            }
            var orderable = $(this).attr("orderable");
            if(orderable === 'false') {
                field.orderable = false;
            }
            var searchable = $(this).attr("searchable");
            if(searchable === 'false') {
                field.searchable = false;
            }
            var format = $(this).attr("format");

            var xtype = $(this).attr("xtype");
            if("bTcolExt" === xtype) {
                field.data = null;
                field.orderable = false;
                field.searchable = false;
            };
            if("bTdateCol" === xtype) {
                if(DaLei.ObjUtil.isEmpty(format)) {
                    format = "YYYY-MM-DD";
                }
                field.render = function(data, type, row, meta) {
                    if(data) {
                        if("createTime" === field.data || "updateTime" === field.data) {
                            data = DaLei.DateUtil.parseDateToLocal(data);
                        }
                        var tempDateMom = moment(data);
                        return tempDateMom.format(format);
                    } else {
                        return "";
                    }
                };
            }

            if("bTcol" === xtype || "bTcolExt" === xtype) {
                if(DaLei.ObjUtil.isNotEmpty(format)) {
                    if(!!me[format]) {
                        field.render = me[format];
                    } else if(me.controller && me.controller[format]) {
                        field.render = me.controller[format];
                    }
                }
            }
            if("bTnumCol" === xtype) {
                var precision = $(this).attr("precision");
                field.className = "btable-right";
                field.render = function(data, type, row, meta) {
                    if (data) {
                        return DaLei.Utils.formatNumber(data, precision);
                    } else {
                        return data;
                    }
                }
            }

            columns.push(field);
        });
        this.options.columns = columns;
        var pagingStr = this.ele.attr("paging");
        if("true" === pagingStr) {
            this.options.paging = true;
        } else {
            this.options.paging = false;
        }
        var searchingStr = this.ele.attr("searching");
        if("true" === searchingStr) {
            this.options.searching = true;
        } else {
            this.options.searching = false;
        }
        var scrollY = this.ele.attr("scrollY");
        if(scrollY) {
            this.options.scrollY = scrollY;
        }
        var selectStr = this.ele.attr("select");
        var needSelect = false;
        var selectStyle = "";
        if("single" === selectStr) {
            needSelect = true;
            selectStyle = "single";
        } else if("multi" === selectStr) {
            needSelect = true;
            selectStyle = "multi";
        }
        var needCheck = this.ele.attr("needCheck");
        if("true" === needCheck) {
            needSelect = true;
            if(DaLei.ObjUtil.isEmpty(selectStyle)) {
                selectStyle = "multi";
            }
            this.options.needCheck = true;
        } else {
            this.options.needCheck = false;
        }

        var needRowNum = this.ele.attr("needRowNum");
        if("true" === needRowNum) {
            this.options.needRowNum = true;
        } else {
            this.options.needRowNum = false;
        }
        var excelExp = this.controller.exportXlsAction;
        if(excelExp) {
            this.options.excelExp = true;
        } else {
            this.options.excelExp = false;
        }
        if(this.options.needCheck) {
            var thead = $('thead>tr', this.ele);
            if("single" === selectStyle ) {
                thead.prepend("<th style='padding-top:6px;padding-bottom:6px; padding-left: 8px;padding-right:0'></th>");
            } else {
                me.checkAllBoxId = me.itemId + "CheckAll";
                thead.prepend("<th style='padding-top:6px;padding-bottom:6px; padding-left: 8px;padding-right:0'><input type='checkbox' name='checklist' id='" + me.checkAllBoxId +"' /></th>");
            }

            var checkCol = {};
            checkCol.data = null;
            checkCol.orderable = false;
            checkCol.searchable = false;
            checkCol.width="20px";
            checkCol.visible = true;
            //checkCol.title = "<input type='checkbox' name='checklist' id='checkAll' />";
            checkCol.render = function(data, type, row, meta) {
                return '';
            };
            this.options.columns.unshift(checkCol);
            this.options.order = [];
            this.options.select={style: selectStyle};
            checkCol.className = 'select-checkbox';
            if("single" === selectStyle ) {

            } else {
                $("#" + me.checkAllBoxId,this.ele).on("change", function(e) {
                    if($(this).is(":checked")) {
                        me.table.rows().select();
                    } else {
                        me.table.rows().deselect();
                    }
                });
                var modal = $(this.ele).parents("[role='dialog']");
                if(modal.length >0) {
                    modal.on("show.bs.modal", function(){
                        $("#" + me.checkAllBoxId,me.ele).attr("checked", false);
                    });
                }
            }

        } else if(needSelect) {
            this.options.select={style: selectStyle};
        }

        if(this.options.needRowNum) {
            var thead = $('thead>tr', this.ele);
            thead.prepend("<th style='padding-top:6px;padding-bottom:6px; padding-right:0'></th>");
            var rowNumCol = {};
            rowNumCol.data = null;
            rowNumCol.orderable = false;
            rowNumCol.searchable = false;
            rowNumCol.width="30px";
            rowNumCol.visible = true;
            this.options.columns.unshift(rowNumCol);
            this.options.order = [];
        }
        this._addDefaultOrder();
        var needFooter = this.ele.attr("needFooter");
        if("true" === needFooter) {
            this.options.needFooter = true;
        } else {
            this.options.needFooter = false;
        }
        this.options.footerCallback = function( tfoot, data, start, end, display) {
            var api = this.api();
            var tempColumns = api.context[0].aoColumns;
            if(me.options.needFooter && $(tfoot).has("td").length ==0) {
                $.each(tempColumns, function(i, col) {
                    var itemId = "footer_" + DaLei.StrUtil.replaceNull(col.data,"");
                    if(col.bVisible) {
                        var td = $("<td itemid='" +itemId+"' class='"+col.className+"'></td>");
                        td.css("width", col.sWidthOrig);
                        td.attr("xtype",$(col.nTh).attr("xtype"));
                        if($(col.nTh).attr("precision")) {
                            td.attr("precision", $(col.nTh).attr("precision"));
                        }
                        $(tfoot).append(td);
                    }
                });
            }
        };

        me.ele.on("finish.bTable", function() {
            var tempColumns = me.table.context[0].aoColumns;
            if(me.options.needFooter) {
                $.each(tempColumns, function(i, col) {
                    var itemId = "footer_" + DaLei.StrUtil.replaceNull(col.data,"");
                    $("td[itemId='"+itemId+"']", $(me.table.footer())).css("width", $(col.nTh).outerWidth()-11);
                });
            }
        });
        //var initOptions = $.extend({},this.options);
        //this.table = this.ele.DataTable(initOptions);
        //this._addRowNum();
        //this._addEventListener();
        //this._addClickListener();

        // has a bug [jquery-1.11.3.min.js:2 Uncaught RangeError: Maximum call stack size exceeded]
        // when DataTable Init, must set controller as null.
        me.controller =null;
    },
    destroy: function() {
        this.ele.DataTable({destroy:true});
    },
    _addDefaultOrder: function() {
        var me = this;
        var orders = me.ele.attr("order");
        var order = [];
        if(DaLei.ObjUtil.isNotEmpty(orders)) {
            try {
                var ordersObj = DaLei.Utils.parseOptions(orders);
                if(DaLei.ObjUtil.isNotEmpty(ordersObj) && typeof ordersObj === 'object') {
                    $.each(ordersObj, function(key, value) {
                        if(value === "asc" || value === "desc") {
                            $.each(me.options.columns, function(i, col) {
                                if(col.data && key === col.data) {
                                    var colOrder = [i, value];
                                    order.push(colOrder);
                                }
                            });
                        }
                    });
                }
            } catch (e) {
                DaLei.DebugUtil.logErr(orders + " table order format is wrong! please order to {userId:'asc',userName:'desc'}");
            }
        }
        if(order.length > 0) {
            me.options.order = order;
        }
    },
    _addRowNum: function() {
        var me = this;
        if(this.options.needRowNum !== true) {
            return;
        }
        if(this.options.ajax && this.options.serverSide) {
            me.table.off('draw.dt');
            me.table.on('draw.dt',function() {
                me.table.column(0, {
                    search: 'applied',
                    order: 'applied'
                }).nodes().each(function(cell, i) {
                    //i 从0开始，所以这里先加1
                    i = i+1;
                    //服务器模式下获取分页信息，使用 DT 提供的 API 直接获取分页信息
                    var page = me.table.page.info();
                    //当前第几页，从0开始
                    var pageno = page.page;
                    //每页数据
                    var length = page.length;
                    //行号等于 页数*每页数据长度+行号
                    var columnIndex = (i+pageno*length);
                    cell.innerHTML = columnIndex;
                });
            });
        } else {
            me.table.off('order.dt search.dt');
            me.table.on('order.dt search.dt',function() {
                me.table.column(0, {
                    search: 'applied',
                    order: 'applied'
                }).nodes().each(function(cell, i) {
                    cell.innerHTML = i + 1;
                });
            });
        }
    },
    _initTableInView: function() {

        var me = this;
        if(this.table) {
        } else {
            var t = setTimeout(function(){
                if(me.table) {
                    return;
                }
                var initOptions = $.extend({},me.options);
                me.table = me.ele.DataTable(initOptions);
                me._addRowNum();
                me._addEventListener();
                me._addClickListener();
                me.ele.parents(".btable").removeClass("invisible");

            }, 100);
        }
    },
    _appendBtns: function(obj){
        var me = obj;
        if(me.options.excelExp) {
            if(me.ele.parents(".btable").find(".dataTables_filter").length >0) {
                me.ele.parents(".btable").find(".dataTables_filter").prepend('<a itemId="excelExpBtn" class="btn" title="Excel 导出" style=""> <i class="fa fa-file-excel-o"></i></a>');
            } else {
                me.ele.parents(".btable").find(".tool-btns").prepend('<a itemId="excelExpBtn" class="btn" title="Excel 导出" style=""> <i class="fa fa-file-excel-o"></i></a>');
            }
        }
    },
    _addEventListener: function() {
        var me = this;
        me.ele.one("init.dt", function() {
            me._appendBtns(me);
            me.ele.trigger("finish.bTable", me.ele);
        });
        this.ele.parents(".modal").on("shown.bs.modal", function(){
            me.table.draw();
        });
    },
    _addClickListener: function() {
        var me = this;
        $('tbody', me.ele).on('dblclick', 'tr', function () {
            var row = me.table.row($(this));
            var rowData = row.data();
            me.ele.trigger("dblclick", [row, rowData]);
        } );
        $('tbody', me.ele).on('click', 'tr', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var row = me.table.row($(this));
            var rowData = row.data();
            me.ele.trigger("click", [row, rowData]);
        } );
        $('tbody', me.ele).on("mouseover","td", function() {
            var clientWidth =  $(this)[0].clientWidth;
            var scrollWidth = $(this)[0].scrollWidth;
            if(clientWidth<scrollWidth){
                var content = $(this).text();
                $(this).attr("title", content);
            }
        })
    },

    initTable: function (newOptions) {
        var options = $.extend({},this.options, newOptions);
        options.destroy = true;
        this.options = options;
    },

    loadDataPage: function(param, queryAction) {
        var me = this;
        param.xtype = "bTable";
        this.ele.data("queryParam", param);
        if(this.table && this.isLoadPage) {
            this.table.ajax.reload();
            return;
        }

        var newOptions = {serverSide: true, ajax:function (data, callback, settings) {
            var tempParam = this.data("queryParam");
            if(DaLei.ObjUtil.isEmpty(tempParam)) {
                return;
            }
            data = $.extend(data, tempParam);
            data.aggfuns = me.aggfuns;
            DaLei.loadFreeMarkerAction(queryAction, data, function(retData) {
                callback(retData);
                if(retData.footRow) {
                    me.sotFooterValue(retData.footRow);
                }
            }, function(e) {
                DaLei.DebugUtil.logErr("get table data error!");
            } );
        }};

        this.options = $.extend(this.options, newOptions);
        var options = $.extend({}, this.options);

        if(!this.table) {
            var t = setTimeout(function(){
                me.table = me.ele.DataTable(options);
                me.isLoadPage = true;
                me._addRowNum();
                me._addEventListener();
                me._addClickListener();
                me.ele.parents(".btable").removeClass("invisible");
            }, 50);

            return;
        } else {
            me._addRowNum();
            me.table.context[0].oFeatures.bServerSide = true;
            me.table.context[0].ajax = options.ajax;
            me.table.ajax.reload();
            me.isLoadPage = true;
        }
    },
    refresh: function() {
        if(this.table) {
            this.table.draw();
        }
    },
    sotData: function(data) {
        var me = this;
        if(this.table) {
        } else {
            var initOptions = $.extend({},me.options);
            me.table = me.ele.DataTable(initOptions);
            me._addRowNum();
            me._addEventListener();
            me._addClickListener();
            //this.initTable(this.options);
            me.ele.parents(".btable").removeClass("invisible");
        }
        if(data && data.length > 0) {
            this.table.clear();
            this.table.rows.add(data).draw();
        } else {
            this.table.clear();
        }
    },
    gotValue: function() {
        if(this.table) {
            return this.ele.dataTable().fnGetData();
        } else {
            return null;
        }
    },
    sotValue: function(value) {
        this.sotData(value);
    },
    sotFooterValue: function(footerRow) {
        var me = this;
        var t = null;
        if(me.options.needFooter && footerRow) {
            if(me.table) {
                tempSetValue();
            } else {
                me.ele.one("finish.bTable", function() {
                    tempSetValue();
                });
            }
        }
        function tempSetValue () {
            var footer = me.table.footer();
            $.each(footerRow, function(key, value) {
                var selector = "[itemId='footer_" +key +"']";
                var td = $(selector, footer);
                if(td.length > 0 ) {
                    var xtype = td.attr("xtype");
                    var precision = td.attr("precision");
                    if("bTnumCol" ==xtype) {
                        value = DaLei.Utils.formatNumber(value, precision);
                    }
                }
                td.empty().html(value);
            });
        }
    },
    updateRow: function (row,rowData) {
        if(this.table) {
            return this.table.row(row).data(rowData).draw();
        } else {
            return null;
        }
    },
    delRow: function(row) {
        if(this.table) {
            return this.table.row(row).remove().draw();
        } else {
            return null;
        }
    },
    addRow: function(rowData) {
        if(this.table) {
            return this.table.row.add(rowData).draw();
        } else {
            return null;
        }
    },
    hideColumn: function(field) {
        var me = this;
        if(this.table) {
            if (typeof field === 'number') {
                this.table.column(field).visible(false);
            } else if (typeof field === 'string') {
                var columns = this.table.context[0].aoColumns;
                var index;
                $.each(columns, function (i, column) {
                    if (field === column.data) {
                        index = i;
                    }
                });
                if(index !== null) {
                    this.table.column(index).visible(false);
                }
            }
        } else {
            me.ele.one("init.dt", function(){
                if (typeof field === 'number') {
                    me.table.column(field).visible(false);
                } else if (typeof field === 'string') {
                    var columns = me.table.context[0].aoColumns;
                    var index;
                    $.each(columns, function (i, column) {
                        if (field === column.data) {
                            index = i;
                        }
                    });
                    if(index !== null) {
                        me.table.column(index).visible(false);
                    }
                }
            });
        }
    },
    selectAll: function() {
        var me = this;
        if(me.table && me.table.data().length >0) {
            $("#" + me.checkAllBoxId).prop("checked","true");
            $("#" + me.checkAllBoxId).trigger("change");
        } else {
            me.ele.one("init.dt", function(){
                if(me.table && me.table.data().length >0) {
                    $("#" + me.checkAllBoxId).prop("checked","true");
                    $("#" + me.checkAllBoxId).trigger("change");
                }
            });
        }

    },
    deselectAll: function() {
        var me = this;
        if(me.table && me.table.data().length >0) {
            $("#" + me.checkAllBoxId).prop("checked",false);
            $("#" + me.checkAllBoxId).trigger("change");
        } else {
            me.ele.one("init.dt", function(){
                if(me.table && me.table.data().length >0) {
                    $("#" + me.checkAllBoxId).prop("checked",false);
                    $("#" + me.checkAllBoxId).trigger("change");
                }
            });
        }
    },
    gotSelectedRows: function() {
        return this.table.rows({ selected: true });
    },
    gotSelectedRowsData: function() {
        var rowData = this.table.rows({ selected: true }).data();
        if(rowData.constructor && rowData.constructor.name == '_Api') {
            return rowData.toArray();
        } else {
            return rowData;
        }
    },
    gotEventRowData: function(eventTarget) {
        var rowData = this.table.row($(eventTarget).parents("tr")).data();
        if(rowData.constructor && rowData.constructor.name == '_Api') {
            return rowData.toArray();
        } else {
            return rowData;
        }
    },
    gotEventRow: function(eventTarget) {
        return this.table.row($(eventTarget).parents("tr"));
    },
    sotDisable: function () {
        var me = this;

        if(me.table && me.table.data().length >0) {
            $("a.btn", me.ele).each(function(j, comp) {
                $(comp).attr("disabled", true);
                $(comp).addClass("disabled");
            });
            me.ele.trigger("finish.bTable", me.ele);
        } else {
            me.ele.one("init.dt", function(){
                $("a.btn", me.ele).each(function(j, comp) {
                    $(comp).attr("disabled", true);
                    $(comp).addClass("disabled");
                });
            });
        }
    },
    sotEnable: function() {
        var me = this;

        if(me.table && me.table.data().length >0) {
            $("a.btn", me.ele).each(function(j, comp) {
                $(comp).removeAttr("disabled", true);
                $(comp).removeClass("disabled");
            });
        } else {
            me.ele.one("init.dt", function(){
                $("a.btn", me.ele).each(function(j, comp) {
                    $(comp).removeAttr("disabled", true);
                    $(comp).removeClass("disabled");
                });
            });
        }
    }
});

DaLei.define("bDate", {
    extend: 'scdp_value_comp',
    divEle: null,
    init: function () {
        var me = this;
        me.divEle = this.ele.parents("div.date");
        var options = {};
        var lang = DaLei.getSysConfig("locale_id");
        if(lang) {
            lang = lang.replace("_", "-");
            options.language = lang;
        }
        var max = this.ele.attr("max_d");
        if(max) {
            var tempDateMom = moment(max);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                options.endDate = tempDateMom.toDate();
            }
        }
        var min = this.ele.attr("min_d");
        if(min) {
            var tempDateMom = moment(min);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                options.startDate = tempDateMom.toDate();
            }
        }
        this.options = $.extend(true,this.options, options);

        this.divEle.on("click", function(e) {
            if(me.ele.attr("disabled") || me.ele.has(".disabled").length>0) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });
        $(".input-group-addon", this.divEle).on("click", function(e) {
            if(me.ele.attr("disabled") || me.ele.has(".disabled").length>0) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });
        this.divEle.datetimepicker(this.options);
        var lang = DaLei.getSysConfig("locale_id");
        if("zh_CN" == lang) {
            this.ele.prop("placeholder", "年-月-日");
        }

        this.ele.inputmask({alias:'yyyy-mm-dd',oncomplete:function(){
            var startDate = me.divEle.data("datetimepicker").startDate;
            var endDate = me.divEle.data("datetimepicker").endDate;
            var dateNow = me.gotValue();
            if((startDate != --Infinity) && moment(dateNow).isBefore(startDate,'day')|| (endDate != Infinity && moment(dateNow).isAfter(endDate,'day'))) {
                me.sotValue(null);
            }
        }});
    },
    destroy: function() {
        this.divEle.datetimepicker("remove");
        this.ele.inputmask("remove")
    },
    sotDaysOfWeekDisabled: function(value) {
        this.divEle.datetimepicker('setDaysOfWeekDisabled', value);
    },
    gotValue: function() {
        var value = this.ele.val();
        if(value) {
            return DaLei.DateUtil.parseDate(value);
        }
        return null;
    },
    sotValue: function(value) {
        if(value !=null && value instanceof Date) {
            this.ele.val(DaLei.DateUtil.formatDate(value));
        } else if(DaLei.ObjUtil.isNotEmpty(value) && typeof value === 'string') {
            var tempDateMom = moment(value);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                this.ele.val(tempDateMom.format("YYYY-MM-DD"));
            }
        } else if(DaLei.ObjUtil.isEmpty(value)) {
            this.ele.val(null);
        }
    },
    sotMin: function(value) {
        if(value !=null && value instanceof Date) {
            this.divEle.datetimepicker("setStartDate", value);
        } else if(DaLei.ObjUtil.isNotEmpty(value) && typeof value === 'string') {
            var tempDateMom = moment(value);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                this.divEle.datetimepicker("setStartDate", tempDateMom.toDate());
            }
        }
    },
    sotMax: function(value) {
        if(value !=null && value instanceof Date) {
            this.divEle.datetimepicker("setEndDate", value);
        } else if(DaLei.ObjUtil.isNotEmpty(value) && typeof value === 'string') {
            var tempDateMom = moment(value);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                this.divEle.datetimepicker("setEndDate", tempDateMom.toDate());
            }
        }
    },
    sotDisable: function () {
        this.ele.attr("disabled", true);
        this.ele.css("background-color", "#eee");
        this.ele.addClass("disabled");
    },
    sotEnable: function() {
        this.ele.removeAttr("disabled");
        this.ele.css("background-color", "white");
        this.ele.removeClass("disabled");
    }
});

DaLei.define("bDateTime", {
    extend: 'scdp_value_comp',
    divEle: null,
    init: function () {
        var me = this;
        me.divEle = this.ele.parents("div.date");
        var options = {};
        var lang = DaLei.getSysConfig("locale_id");
        if(lang) {
            lang = lang.replace("_", "-");
            options.language = lang;
        }
        var max = this.ele.attr("max_d");
        if(max) {
            var tempDateMom = moment(max);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                options.endDate = tempDateMom.toDate();
            }
        }
        var min = this.ele.attr("min_d");
        if(min) {
            var tempDateMom = moment(min);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                options.startDate = tempDateMom.toDate();
            }
        }
        this.options = $.extend(true,this.options, options);
        this.divEle.on("click", function(e) {
            if(me.ele.attr("disabled") || me.ele.has(".disabled").length>0) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });
        $(".input-group-addon", this.divEle).on("click", function(e) {
            if(me.ele.attr("disabled") || me.ele.has(".disabled").length>0) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });
        this.divEle.datetimepicker(this.options);
        this.divEle.on("changeDate", function(){
            me.ele.trigger("change");
        });
        var lang = DaLei.getSysConfig("locale_id");
        if("zh_CN" == lang) {
            this.ele.prop("placeholder", "年-月-日 时:分");
        }
        this.ele.inputmask({mask: 'y-m-d h:s',
            placeholder: 'yyyy-mm-dd hh:mm',
            alias:'datetime', oncomplete:function(){
                var startDate = me.divEle.data("datetimepicker").startDate;
                var endDate = me.divEle.data("datetimepicker").endDate;
                var dateNow = me.gotValue();
                if((startDate != --Infinity) && moment(dateNow).isBefore(startDate,'minute')|| (endDate != Infinity && moment(dateNow).isAfter(endDate,'minute'))) {
                    me.sotValue(null);
                }
            }});
    },
    destroy: function() {
        this.divEle.datetimepicker("remove");
        this.ele.inputmask("remove")
    },
    sotDaysOfWeekDisabled: function(value) {
        this.divEle.datetimepicker('setDaysOfWeekDisabled', value);
    },
    gotValue: function() {
        var value = this.ele.val();
        if(value) {
            return moment(value).toDate();
        }
        return null;
    },
    sotValue: function(value) {
        if(value !=null && value instanceof Date) {
            var tempDateMom = moment(value);
            this.ele.val(tempDateMom.format("YYYY-MM-DD HH:mm"));
        } else if(DaLei.ObjUtil.isNotEmpty(value) && typeof value === 'string') {
            var tempDateMom = moment(value);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                this.ele.val(tempDateMom.format("YYYY-MM-DD HH:mm"));
            }
        } else if(DaLei.ObjUtil.isEmpty(value)) {
            this.ele.val(null);
        }
    },
    sotMin: function(value) {
        if(value !=null && value instanceof Date) {
            this.divEle.datetimepicker("setStartDate", value);
        } else if(DaLei.ObjUtil.isNotEmpty(value) && typeof value === 'string') {
            var tempDateMom = moment(value);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                this.divEle.datetimepicker("setStartDate", tempDateMom.toDate());
            }
        }
    },
    sotMax: function(value) {
        if(value !=null && value instanceof Date) {
            this.divEle.datetimepicker("setEndDate", value);
        } else if(DaLei.ObjUtil.isNotEmpty(value) && typeof value === 'string') {
            var tempDateMom = moment(value);
            if(DaLei.ObjUtil.isNotEmpty(tempDateMom)) {
                this.divEle.datetimepicker("setEndDate", tempDateMom.toDate());
            }
        }
    },
    sotDisable: function () {
        this.ele.attr("disabled", true);
        this.ele.css("background-color", "#eee");
        this.ele.addClass("disabled");
    },
    sotEnable: function() {
        this.ele.removeAttr("disabled");
        this.ele.css("background-color", "white");
        this.ele.removeClass("disabled");
    }
});

DaLei.define("bTel", {
    extend: 'scdp_value_comp',
    init: function () {
        var me = this;
        me.ele.inputmask({mask:"(999[9])-9999999[9][-9999]",greedy: false,
            onBeforeWrite:function(e, buffer, caretPos, opts) {
                var test = {};
                var v = buffer.join("");
                var xx = new RegExp('^\\((010|02[0-9])\\)-_');
                if(xx.test(v) && e.keyCode !== Inputmask.keyCode.BACKSPACE && e.keyCode !== Inputmask.keyCode.DELETE) {
                    //buffer.splice(4,0,')');
                    test.buffer = buffer;
                    test.refreshFromBuffer = true;
                    test.pos =caretPos +2;
                    test.caret = caretPos +2;
                }
                return test;
            }
        });
    }
});
DaLei.define("bFax", {
    extend: 'bTel',
    init: function () {
        var me = this;
        me.ele.inputmask({mask:"(999[9])-9999999[9]"});
    }
});
DaLei.define("bPhone", {
    extend: 'scdp_value_comp',
    init: function () {
        var me = this;
        me.ele.inputmask({mask:"(+86)-999-9999-9999"});
    }
});
DaLei.define("bEmail", {
    extend: 'scdp_value_comp',
    init: function () {
        var me = this;
        me.ele.inputmask("email");
    }
});
DaLei.define("bInteger", {
    extend: 'scdp_value_comp',
    init: function () {
        var me = this;
        var showzero = me.ele.attr("showzero");
        var options = {};
        if("false" != showzero) {
            options.alias = "integer";
            options.groupSeparator = ",";
            options.autoGroup = true;
            options.placeholder = "0";
            options.digitsOptional = false;
            options.clearMaskOnLostFocus = false;
        } else {
            options.alias = "integer";
            options.groupSeparator = ",";
            options.autoGroup = true;
        }
        this.options = $.extend(true,this.options, options);
        me.ele.inputmask(this.options);
    },
    gotValue: function() {
        var me = this;
        var value = me.ele.val();
        if(value) {
            value = DaLei.StrUtil.replaceAll(value, ",", "");
        }
        return value;
    }
});
DaLei.define("bDecimal", {
    extend: 'scdp_value_comp',
    init: function () {
        var me = this;
        var showzero = me.ele.attr("showzero");
        var options = {};
        if("false" != showzero) {
            options.alias = "decimal";
            options.groupSeparator = ",";
            options.autoGroup = true;
            options.placeholder = "0";
            options.digitsOptional = false;
            options.clearMaskOnLostFocus = false;
        } else {
            options.alias = "decimal";
            options.groupSeparator = ",";
            options.autoGroup = true;
        }
        var precision = me.ele.attr("precision");
        if(precision) {
            var integerDigit = "+";
            var decimalDigit = "*";
            if(precision.indexOf(",") != -1) {
                var precis = DaLei.StrUtil.split(precision, ",");
                integerDigit = $.trim(precis[0]);
                decimalDigit = $.trim(precis[1]);
            } else {
                integerDigit = $.trim(precision);
            }
            options.integerDigits = integerDigit;
            options.digits = decimalDigit;
            this.options = $.extend(true,this.options, options);
            me.ele.inputmask(this.options);
        } else {
            this.options = $.extend(true,this.options, options);
            me.ele.inputmask(this.options);
        }
    },
    gotValue: function() {
        var me = this;
        var value = me.ele.val();
        if(value) {
            value = DaLei.StrUtil.replaceAll(value, ",", "");
        }
        return value;
    }
});

DaLei.define("bBtn", {
    extend: 'scdp_comp',
    init: function () {

    },
    sotText: function(text) {
        if($("[name='text']", this.ele).length>0) {
            $("[name='text']", this.ele).text(text);
        }
    }
});

DaLei.define("checkbox_label", {//新加checkbox左label禁用启用方法
    extend: 'scdp_comp',
    init: function () {

    },
    sotDisable: function () {
        this.ele.attr("disabled", true);
        this.ele.css("opacity","0.6");
    },
    sotEnable: function() {
        this.ele.removeAttr("disabled");
        this.ele.css("opacity","1");
    }
});

DaLei.define("bAhead", {
    extend:'bComboxSin',
    valuefrom:'codedesc',
    init: function () {
        this.combType = this.ele.attr("combType");
        this.codeType = this.ele.attr("codeType");

        this.filterFields = this.ele.attr("filterFields");
        this.cascadeField = this.ele.attr("cascadeField");
        this.target = this.ele.attr("target");

        var me = this;
        if(!this.combType) {
            this.combType="scdp_fmcode"
        }
        var upForm = me.ele.parents("[xtype='bForm'],[xtype='bPanel']");
        var options = {};
        var t;
        options.minLength = 0;
        options.source = function(query, process){
            clearTimeout(t);
            if(DaLei.ObjUtil.isEmpty(query)) {
                process({});
                return;
            }
            t = setTimeout(function(){
                me.reload(upForm, query).done(function(){
                    process(me.combData);
                })
            }, 500);
        };
        var valuefrom = this.ele.attr("valuefrom");
        if(DaLei.ObjUtil.isNotEmpty(valuefrom)) {
            me.valuefrom = valuefrom;
        }
        options.displayText = function (item) {
            return typeof item !== 'undefined' && typeof item[me.valuefrom] != 'undefined' ? item[me.valuefrom] : item;
        };
        options.afterSelect = function() {
            me.ele.trigger("afterSelect");
        };
        this.options = $.extend(true,this.options, options);
        me.ele.typeahead(this.options ) ;
        me.ele.on("change", function (e) {
            me.cascadeLoad(true);
            me.refreshTarget(me);
        })
    },
    destroy: function() {
        this.ele.typeahead("destroy")
    },
    gotRecord:function() {
        var me = this;
        var record = me.ele.data('active');
        if(DaLei.ObjUtil.isEmpty(record)) {
            return null;
        } else {
            var val = this.ele.val();
            var flag = false;
            $.each(record, function(key, value) {
                if(val === value) {
                    flag = true;
                }
            });
            if(flag) {
                return record;
            } else {
                return null;
            }
        }
    },
    gotValue: function() {
        //if(DaLei.ObjUtil.isNotEmpty(this.valuefrom) && this.valuefrom !== 'codedesc') {
        //    var record = this.gotRecord();
        //    if(!$.isEmptyObject(record)) {
        //        return record[this.valuefrom];
        //    }
        //}
        return this.ele.val();
    },
    sotValue: function(value) {
        var me = this;
        me.ele.val(value);
        me.ele.text(value);
        //me.ele.trigger("input");
        me.cascadeLoad(true);
        me.refreshTarget(me);
    },
    sotDisable: function () {
        this.ele.attr("disabled", true);
        this.ele.addClass("disabled");
    },
    sotEnable: function() {
        this.ele.removeAttr("disabled");
        this.ele.removeClass("disabled");
    },
    reload: function (upContainer, query) {
        var me = this;
        me.loaded = true;
        var dtd = $.Deferred();
        var filterMap = this.filterMap || {};
        if (DaLei.ObjUtil.isNotEmpty(me.filterFields) && upContainer.length > 0) {
            var filter = DaLei.StrUtil.split(this.filterFields, ",");
            $.each(filter, function (i,item) {
                if(item.indexOf(":") != -1) {
                    var itemMapping = DaLei.StrUtil.split(item, ":");
                    filterMap[itemMapping[0]] = itemMapping[1];
                } else {
                    var itemMapping = DaLei.StrUtil.split(item, "|");
                    var value = null;
                    if (upContainer.getCmp(itemMapping[0])) {
                        value = upContainer.getCmp(itemMapping[0]).gotValue();
                    }

                    value = DaLei.StrUtil.replaceNull(value);
                    if (DaLei.ObjUtil.isNotEmpty(itemMapping[1])) {
                        filterMap[itemMapping[1]] = value;
                    } else {
                        filterMap[itemMapping[0]] = value;
                    }
                }
            });
        }
        filterMap.query = query;
        var listData = DaLei.getComboStoreDate(this.combType, this.codeType, this.menuCode, filterMap, me.options.needCache);
        if(this.combData === listData) {
            dtd.resolve();
            return dtd.promise();
        } else {
            this.combData = listData;
            dtd.resolve();
            return dtd.promise();
        }
    }

});

DaLei.define("bFile", {
    extend:'scdp_value_comp',
    fnSuccess:null,
    fnError:null,
    fnBatchSuccess:null,
    fnBatchError:null,
    fnExtUpdate:null,
    extraParams: {},
    init: function () {
        var me = this;
        me.ele.prop("id", me.itemid);
        var options = {
            language: DaLei.getSysConfig("LOCALE_ID"),
            uploadUrl:DaLei.Const.JSON_ACTION
        };
        var fileExt = me.ele.attr("fileExt");
        if(fileExt) {
            var commaIndex = fileExt.indexOf(",");
            var splitIndex = fileExt.indexOf("|");
            if(commaIndex) {
                options.allowedFileExtensions = DaLei.StrUtil.split(fileExt,",");
            } else {
                options.allowedFileExtensions = DaLei.StrUtil.split(fileExt,"|");
            }
        }
        var maxFileCount = me.ele.attr("maxFileCount");
        if(maxFileCount) {
            options.maxFileCount = maxFileCount;
            options.autoReplace = true;
        }
        var maxFileSize = me.ele.attr("maxFileSize");
        if(maxFileSize) {
            options.maxFileSize = maxFileSize;
        }
        me.options = $.extend(me.options, options);
        me.ele.fileinput(me.options);
        me._registEvents();
        $("#kvFileinputModal").appendTo("body");
    },
    destroy: function() {
        this.ele.fileinput("destroy")
    },
    _upload: function(e) {
        var me = this;
        if(e) {
            e.stopPropagation();
            e.preventDefault();
        }
        var fileName, fileType;
        fileName = me.gotValue();
        var ldot = fileName.lastIndexOf(".");
        if(ldot>0) {
            fileType = fileName.substring(ldot + 1);
        }
        var fileinput = me.ele.data('fileinput');
        var ret = me.ele.triggerHandler("upload.bFile", fileName);

        if(DaLei.ObjUtil.isEmpty(fileName)) {
            if(me.fnExtUpdate) {
                me.fnExtUpdate(me.extraParams);
            }
            return;
        }

        if(!!ret && ret.message) {
            fileinput.$errorContainer.html(ret.message).fadeIn(800);
            return;
        }
        if(DaLei.ObjUtil.isEmpty(me.extraParams.fileName)) {
            me.extraParams.fileName = fileName;
        }
        if(DaLei.ObjUtil.isEmpty(me.extraParams.fileType)) {
            me.extraParams.fileType = fileType;
        }
        me.extraParams.fileItemId = me.itemId;

        if(!me.extraParams.actionName) {
            me.extraParams.actionName = "file-upload";
        }
        DaLei.doAction(me.extraParams.actionName, me.extraParams, function(data) {
            if(me.fnSuccess) {
                me.fnSuccess(data);
            }
            if(me.fnBatchSuccess) {
                me.fnBatchSuccess(data);
            }
        }, function(e) {
            if(e && (e.message|| e.error) && fileinput.$errorContainer) {
                fileinput.$errorContainer.html(e.message|| e.error).fadeIn(800);
            }
            if(me.fnError) {
                me.fnError(e);
            }
            if(me.fnBatchError) {
                me.fnBatchError(e);
            }
        } ,  true, false, me.ele.prop("id"));
    },
    _registEvents: function() {
        var me = this;
        var fileinput = me.ele.data('fileinput');
        if(!fileinput.isUploadable) {
            if(fileinput.$container.find('.fileinput-upload').length > 0) {
                fileinput.$container.find('.fileinput-upload').off('click.fileinput')
                    .on('click.fileinput', $.proxy(me._upload, me));
            }
        }
        me.ele.off('filepreajax').on('filepreajax', function(event, previewId, index) {
            var fileName, fileType;
            var fileinputObj = me.ele.data("fileinput");
            if(index != undefined && index != null) {
                fileName = fileinputObj.filenames[index];

                var ldot = fileName.lastIndexOf(".");
                if(ldot>0) {
                    fileType = fileName.substring(ldot + 1);
                }
            }
            var ret = me.ele.triggerHandler("upload.bFile", fileName);
            var extparams = me.gotParams();
            if(DaLei.ObjUtil.isEmpty(fileName)) {
                fileinputObj.ajaxAborted = {message:''};
                if(me.fnExtUpdate) {
                    me.fnExtUpdate(extparams);
                }
            }
            fileinputObj.ajaxAborted = ret;

            var param = $.extend({}, extparams);

            if(DaLei.ObjUtil.isEmpty(param.fileName)) {
                param.fileName = fileName;
            }
            if(DaLei.ObjUtil.isEmpty(param.fileType)) {
                param.fileType = fileType;
            }
            param.fileItemId = me.itemId;
            param.userId = DaLei.CacheUtil.get(DaLei.Const.USER_ID);
            param.userLocaleId = DaLei.getSysConfig("locale_id");
            param.timestamp = Date.now();
            param.network = window.NETWORK_DELAY;
            if(!param.actionName) {
                param.actionName = "file-upload";
            }
            param.signature = DaLei.getSign(param.actionName, param);
            var postData = DaLei.JSON.encode(param);

            fileinputObj.uploadExtraData = {actionName:param.actionName, postData:postData};
        });
        me.ele.off('fileuploaded').on("fileuploaded", function(e, retData) {
            if(me.fnSuccess && typeof me.fnSuccess === "function") {
                me.fnSuccess(retData.response);
            }
        });
        me.ele.off('fileuploaderror').on("fileuploaderror", function(e, retData) {
            if(me.fnError && typeof me.fnError === "function") {
                me.fnError(retData.response);
            }
        });
        me.ele.off('filebatchuploadsuccess').on("filebatchuploadsuccess", function(e, retData){
            if(me.fnBatchSuccess && typeof me.fnBatchSuccess === "function") {
                me.fnBatchSuccess(retData.response);
            }
        });
        me.ele.off('filebatchuploaderror').on("filebatchuploaderror", function(e, retData){
            if(me.fnBatchError && typeof me.fnBatchError === "function") {
                me.fnBatchError(retData.response);
            }
        });
        me.ele.off('filebatchuploadcomplete').on("filebatchuploadcomplete", function(e, retData){
            if(me.fnUploadComplete && typeof me.fnUploadComplete === "function") {
                me.fnUploadComplete(retData);
            }
        });
        me.ele.off('fileselectnone').on("fileselectnone", function(e, retData){
            me.clear();
        });
    },
    initFileUpload: function(options) {
        var me = this;
        me.options = $.extend(true, me.options, options, true);
        this.ele.fileinput('refresh', me.options);
        me._registEvents();
    },
    gotValue: function() {
        return this.ele.val();
    },
    gotFileType: function() {
        var fileType;
        var fileName = this.ele.val();
        if(fileName) {
            var ldot = fileName.lastIndexOf(".");
            fileType =  fileName.substring(ldot + 1);
        };
        return fileType;
    },
    sotValue: function(value) {
        var me = this;
        if(value == null || value == "") {
            this.clear();
        } else {
            this.clear();
            var fileinput = me.ele.data('fileinput');
            fileinput._setCaption(value);
        }
    },
    sotParams: function(parm) {
        this.extraParams = parm;
    },
    gotParams: function(parm) {
        return this.extraParams;
    },
    sotUploadCallBackFn: function(extParams, fnSuccess, fnError, fnUploadComplete, fnBatchSuccess, fnBatchError, fnExtUpdate) {
        this.sotParams(extParams);
        this.fnSuccess = fnSuccess;
        this.fnError = fnError;
        this.fnUploadComplete = fnUploadComplete;
        this.fnBatchSuccess = fnBatchSuccess;
        this.fnBatchError = fnBatchError;
        this.fnExtUpdate = fnExtUpdate;
        var fileinput = this.ele.data('fileinput');
        if(fileinput && fnExtUpdate) {
            fileinput.uploadExtraData = {"empty":'empty'};
        }
    },
    uploadFiles: function (extParams, fnSuccess, fnError, fnUploadComplete, fnBatchSuccess, fnBatchError, fnExtUpdate) {
        var me = this;
        if(fnSuccess || fnError || fnBatchSuccess || fnBatchError || fnExtUpdate) {
            this.sotUploadCallBackFn(extParams, fnSuccess, fnError, fnUploadComplete, fnBatchSuccess, fnBatchError, fnExtUpdate);
        }
        var fileinput = me.ele.data('fileinput');
        if(!fileinput.isUploadable) {
            me._upload();
        } else {
            this.ele.fileinput("upload");
        }
    },
    refresh: function(options) {
        var tempOpt = options || {};
        this.ele.fileinput('refresh', tempOpt);
    },
    clear: function() {
        this.ele.fileinput('clear');
    },
    reset: function() {
        this.ele.fileinput('reset');
    }

});

DaLei.define("bTree", {
    extend: 'scdp_value_comp',
    loadAction:null,
    loaded:false,
    treeObj:null,
    treeData:null,
    wrapEle:null,
    inputEle:null,
    treeEle:null,
    showRoot:false,
    multiple:false,
    actionParams:{},
    bindid:'uuid',
    binddesc:'text',
    cascadeField:null,
    target:null,
    onlyLeaf:false,
    chkboxType:{ "Y" : "", "N" : "" },
    parentIcon: "diy01",
    leafIcon:"diy02",
    init: function () {
        this.wrapEle = $(this.ele).parents("span.btree");
        this.loadAction = this.ele.attr("loadAction");
        this.cascadeField = this.ele.attr("cascadeField");
        this.target = this.ele.attr("target");

        var showRoot = this.ele.attr("showRoot");
        if(showRoot && "true" == showRoot) {
            this.showRoot = true;
        }
        var onlyLeaf = this.ele.attr("onlyLeaf");
        if(onlyLeaf && "true" == onlyLeaf) {
            this.onlyLeaf = true;
        }
        var parentIcon = this.ele.attr("parentIcon");
        if(parentIcon) {
            this.parentIcon = parentIcon;
        }
        var leafIcon = this.ele.attr("leafIcon");
        if(leafIcon) {
            this.leafIcon = leafIcon;
        }
        var multiple = this.ele.attr("multiple");
        if(multiple && "multiple" == multiple) {
            this.multiple = true;
            this.chkboxType = { "Y" : "s", "N" : "s" };
        }
        var actionParams = this.ele.attr("actionParams");
        if(actionParams) {
            this.actionParams = DaLei.Utils.parseOptions(actionParams);
        }
        var chkboxType = this.ele.attr("chkboxType");
        if(chkboxType) {
            this.chkboxType = DaLei.Utils.parseOptions(chkboxType);
        }
        var bindid = this.ele.attr("bindid");
        if(bindid) {
            this.bindid = bindid;
        }
        var binddesc = this.ele.attr("binddesc");
        if(binddesc) {
            this.binddesc = binddesc;
        }
        var me = this;
        var setting = {
            data: {key: {name: 'text'}},
            view: {selectedMulti: me.multiple},
            check: {enable: true,chkboxType: me.chkboxType},
            callback: {
                onClick: function(event, treeId,treeNode,clickFlag) {
                    if(!multiple) {
                        var nodes = me.treeObj.getCheckedNodes(true);
                        for (var i=0, l=nodes.length; i < l; i++) {
                            me.treeObj.checkNode(nodes[i], false);
                        }
                    }
                    if(!treeNode.nocheck) {
                        me.treeObj.checkNode(treeNode, true, false, true);
                    }
                },
                beforeCheck: function(event, treeId,treeNode) {
                    if(!multiple) {
                        var nodes = me.treeObj.getCheckedNodes(true);
                        for (var i=0, l=nodes.length; i < l; i++) {
                            me.treeObj.checkNode(nodes[i], false);
                        }
                    }
                },
                onCheck: function(event, treeId, treeNode) {
                    var nodes = me.treeObj.getCheckedNodes(true);
                    me.setTextValue("");
                    $.each(nodes, function(i, node) {
                        me.appendTextValue(node[me.binddesc]);
                    });
                }
            }
        };
        me.treeData =  me._getTreeData();

        me._preProcessData(me.treeData, me._processNode);

        me.treeObj = $.fn.zTree.init($(".ztree", me.wrapEle), setting, me.treeData);

        me.treeEle = $(".ztree",me.wrapEle);
        me.inputEle = $("input",me.wrapEle);
        $(".input-group-addon, input", me.wrapEle).on("click", function(){
            if(me.treeEle.css("display") == 'block') {
                me.treeEle.slideUp("fast");
            } else {
                me.treeEle.slideDown("fast");
                me.treeEle.focus();
            }
        });
        var t;
        me.treeEle.focusout(function(e) {
            t = setTimeout(function(){
                me.treeEle.slideUp("fast");
            },100);
        });
        me.treeEle.focusin(function(e){
            clearTimeout(t);
        });
    },
    destroy: function() {
        this.treeObj.destroy();
    },
    _processNode: function(node) {
        if(node.children && node.children.length >0) {
            if(this.onlyLeaf) {
                node.nocheck = true;
            }
            if(this.parentIcon) {
                node.iconSkin = this.parentIcon;
            }
        } else {
            if(this.leafIcon) {
                node.iconSkin = this.leafIcon;
            }
        }
    },
    _preProcessData: function(data, callback) {
        var me = this;
        if(data && data.length>0) {
            $.each(data, function(i, dt) {
                callback.apply(me,[dt]);
                if(dt.children && dt.children.length>0) {
                    me._preProcessData(dt.children, callback);
                }
            });
        } else if(data) {
            callback.apply(me,[data]);
            if(data.children && data.children.length>0) {
                me._preProcessData(data.children, callback);
            }
        }
    },
    _getTreeData: function() {
        var me = this;
        var params = $.extend({}, me.actionParams);
        var retData = DaLei.doAction(me.loadAction, params, function(retData){
            var test = retData;
        },null,null,false);
        if(me.showRoot) {
            return retData;
        } else {
            return retData.children;
        }
    },
    gotRecord:function() {
        var nodes = this.treeObj.getCheckedNodes(true);
        return nodes;
    },
    gotValue: function() {
        var me = this;
        var nodes = this.gotRecord();
        if(nodes && nodes.length ==1) {
            return nodes[0][this.bindid];
        } else if(nodes && nodes.length >1) {
            var ret = [];
            $.each(nodes, function(i, node) {
                ret.push(node[me.bindid]);
            });
            return ret.join(",");
        } else {
            return null;
        }
    },
    setTextValue: function(value) {
        this.ele.val(value);
    },
    appendTextValue: function(value) {
        if(DaLei.ObjUtil.isNotEmpty(value)) {
            var existText = this.ele.val();
            if(DaLei.ObjUtil.isNotEmpty(existText)) {
                existText = existText + ',' + value;
                this.ele.val(existText);
            } else {
                this.ele.val(value);
            }
        }
    },
    sotValue: function(value) {
        var me = this;
        if(DaLei.ObjUtil.isEmpty(value)) {
            me.treeObj.checkAllNodes(false);
            me.setTextValue("");
        } else {
            var values = DaLei.StrUtil.split(value,",");
            me.treeObj.checkAllNodes(false);
            var nodes = me.treeObj.getNodes();
            $.each(nodes, function(i, node) {
                var idValue = node[me.bindid];
                if(idValue && $.inArray(idValue, values) != -1) {
                    me.treeObj.checkNode(node, true);
                    me.appendTextValue(node[me.binddesc]);
                }
            });
        }
        me.cascadeLoad(true);
        me.refreshTarget(me);
    },
    sotDisable: function () {
        this.ele.prop("disabled", true);
        this.ele.addClass("disabled");
        $(".input-group-addon", this.wrapEle).off("click");
    },
    sotEnable: function() {
        this.ele.prop("disabled", false);
        this.ele.removeClass("disabled");
        var me = this;
        $(".input-group-addon", me.wrapEle).off("click").on("click", function(){
            if(me.treeEle.css("display") == 'block') {
                me.treeEle.slideUp("fast");
            } else {
                me.treeEle.slideDown("fast");
                me.treeEle.focus();
            }
        });
    }
});

DaLei.define("bWysiHtml", {
    extend: 'scdp_value_comp',
    init: function () {
        var me = this;
        me.ele.wysihtml5(me.options);
    },
    destroy: function() {
    },
    gotValue: function() {
        return this.ele.html();
    },
    sotValue: function(value) {
        this.ele.html(value);
    },
    sotDisable: function () {
        this.ele.attr("contentEditable",false);
        var wysihtml = this.ele.data("wysihtml5");
        wysihtml.toolbar.addClass("wysihtml5-commands-disabled");
    },
    sotEnable: function() {
        this.ele.attr("contentEditable",true);
        var wysihtml = this.ele.data("wysihtml5");
        wysihtml.toolbar.removeClass("wysihtml5-commands-disabled");
    }
});