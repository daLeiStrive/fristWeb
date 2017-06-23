/**
 * Created by lxj on 2016-08-23.
 */
Namespace.register("DaLei.MainFrameEvents");
Namespace.register("DaLei.Loader");
Namespace.register("DaLei.ModuleManager");

DaLei.MainFrameEvents = {
    eventObj: {},
    addListener: function(eventName, fn) {
        var fns;
        if(DaLei.ObjUtil.isEmpty(this.eventObj)) {
            this.eventObj[eventName] = [fn];
        } else {
            if(this.eventObj.hasOwnProperty(eventName)) {
                this.eventObj[eventName].push(fn);
            } else {
                this.eventObj[eventName] = [fn];
            }
        }
    },
    removeListener: function(eventName) {
        delete this.eventObj[eventName];
    },
    fireEvent: function(eventName) {
        var me = this;
        var args = [];
        if(arguments.length>1) {
            for(var i=1;i<arguments.length; i ++) {
                args.push(arguments[i]);
            }
        }

        var ret = undefined;
        if(DaLei.ObjUtil.isNotEmpty(this.eventObj)) {
            if(this.eventObj.hasOwnProperty(eventName)) {
                var fns = this.eventObj[eventName];
                if(DaLei.ObjUtil.isNotEmpty(fns)) {
                    $.each(fns, function(i, fn) {
                        var fnRet = fn.apply(me, args);
                        if(fnRet == false) {
                            ret = false;
                        }
                    })
                }
            }
        }
        return ret;
    }
}
/*加载 JS 或者 CSS
 /* @name file name
 * @param path 加载路径
 * @returns
 */
DaLei.Loader = {
    base:'.',
    notifyFuns:[],
    addNotifyFun: function(name, fn) {
        var obj = {};
        obj[name] = fn;
        if(!this.getNotifyFun(name)) {
            this.notifyFuns.push(obj);
        }
    },
    removeNotifyFun: function(name) {
        var me = this;
        if(this.notifyFuns.length > 0) {
            $.each(this.notifyFuns, function(i,obj) {
                if(obj[name]) {
                    me.notifyFuns.splice(i,1);
                    return false;
                }
            })
        }
    },
    getNotifyFun: function(name) {
        var me = this;
        var ret = null;
        if(this.notifyFuns.length > 0) {
            $.each(this.notifyFuns, function(i,obj) {
                if(obj[name]) {
                    ret = obj[name];
                    return false;
                }
            })
        }
        return ret;
    },
    notifyFun: function(name, params, obj) {
        var callfun = this.getNotifyFun(name);
        if(callfun) {
            if(obj) {
                callfun.apply(obj, params);
            } else {
                callfun.apply(this, params);
            }
            this.removeNotifyFun(name);
        }
    },
    load: function(name, callback, moduleName){
        if (/\.css$/i.test(name)){
            if (/^http/i.test(name)){
                this.loadCss(name, callback);
            } else {
                this.loadCss(easyloader.base + name, callback);
            }
        } else if (/\.js$/i.test(name)){
            this.addNotifyFun(moduleName, callback);
            if (/^http/i.test(name)){
                this.loadJs(name, callback);
            } else {
                this.loadJs(easyloader.base + name, callback);
            }
        }
    },
    loadJs: function (url, callback){
        var done = false;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.language = 'javascript';
        script.src = url;
        //script.onload = script.onreadystatechange = function(){
        //    if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')){
        //        done = true;
        //        script.onload = script.onreadystatechange = null;
        //        if (callback){
        //            callback.call(script);
        //        }
        //    }
        //}
        document.getElementsByTagName("head")[0].appendChild(script);
    },
    loadCss: function (url, callback){
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.media = 'screen';
        link.href = url;
        document.getElementsByTagName('head')[0].appendChild(link);
        if (callback){
            callback.call(link);
        }
    },
    onProgress: function(name){},
    onLoad: function(name){}
};

/*模块加载路径设置
 /* @name 模块名称
 * @param path 加载路径
 * @returns
 */
DaLei.Loader.setPath = function(name, path) {
    var modules = DaLei.Loader.modules ||{};
    if(name) {
        modules[name] = path;
        DaLei.Loader.modules = modules;
    }
};

/*模块加载路径获取
 /* @name 模块名称
 * @returns path 加载路径
 */
DaLei.Loader.getPath = function(name) {
    var modules = DaLei.Loader.modules;
    if(name && modules) {
        return modules[name];
    }
    return null;
};
DaLei.ModuleManager.getObject = function(key) {
    var objects = DaLei.ModuleManager.objects;
    if(objects && key) {
        return objects[key];
    } else {
        return null;
    }
};
DaLei.ModuleManager.putObject = function(key, value) {
    var objects = DaLei.ModuleManager.objects ||{};
    if(key) {
        objects[key] = value;
        DaLei.ModuleManager.objects = objects;
    }
};
DaLei.copy = function(dest, org, deep) {
    if(deep) {
        return $.extend(deep,dest, org);
    }else {
        return $.extend(dest, org);
    }
};
DaLei.extend = function (parent, child) {
    var tempObj = Object.create(parent);
    child = DaLei.copy(tempObj, child);
    child._super = parent;
    return child;
};

DaLei.define = function(objName, obj){
    if(DaLei.ModuleManager.getObject(objName)) {
        return;
    }
    if(obj instanceof Object && obj.extend) {
        var parentStr = obj.extend;
        DaLei.loadComponent(parentStr)
            .done(function(parentObj){
                obj._compName = objName;
                obj = DaLei.extend(parentObj, obj);
                if(obj.mixins && $.isArray(obj.mixins)) {
                    var count = 0;
                    $.each(obj.mixins, function(i, v) {
                        DaLei.loadComponent(v).done(function(mixObj){
                            var tempObj = Object.create(mixObj);
                            obj = DaLei.copy(tempObj, obj);
                            count = i;
                        });
                    });
                    if(obj.mixins.length == (count + 1)) {
                        DaLei.ModuleManager.putObject(objName, obj);
                        DaLei.Loader.notifyFun(objName,[obj]);
                        return;
                    }
                }
                DaLei.ModuleManager.putObject(objName, obj);
                DaLei.Loader.notifyFun(objName,[obj]);
            })
            .fail(function() { throw new Error("Extend fail. can not init "+ parentStr)});
    } else if(obj instanceof Object) {
        obj._compName = objName;
        obj.callParent = function() {
            var methodName = this.callParent.caller.name;
            var caller = this.callParent.caller;
            if (DaLei.ObjUtil.isEmpty(methodName)) {
                methodName = getMethodName(this, caller);
            }
            if(methodName && this._super) {
                var _super = getSuper(this, caller, methodName);
                if(_super) {
                    var superMethod = getSuperMethod(methodName, _super);
                    if(superMethod) {
                        superMethod.apply(this, arguments[0]);
                    }
                }
            }
            function getMethodName(obj, fn) {
                var mthName = "";
                for (var key in obj) {
                    if (obj.hasOwnProperty(key) && obj[key] == fn) {
                        mthName = key;
                        break;
                    }
                }
                if(mthName) {
                    return mthName;
                } else if(obj._super) {
                    return getMethodName(obj._super, fn);
                }
            }

            function getSuper(childObj, caller, methodName) {
                if(childObj[methodName] == caller) {
                    return childObj;
                } else if(childObj._super) {
                    return getSuper(childObj._super, caller, methodName);
                } else {
                    return null;
                }
            }
            function getSuperMethod (methodName, obj) {
                if(obj._super && obj[methodName] !== obj._super[methodName]) {
                    return obj._super[methodName];
                } else if(obj._super){
                    return getSuperMethod(methodName, obj._super);
                } else {
                    return null;
                }
            }
        };
        if(obj.mixins && $.isArray(obj.mixins)) {
            $.each(obj.mixins, function(i, v) {
                DaLei.loadComponent(v).done(function(mixObj){
                    var tempObj = Object.create(mixObj);
                    obj = DaLei.copy(tempObj, obj);
                });
            });
            if(obj.mixins.length == (count + 1)) {
                DaLei.ModuleManager.putObject(objName, obj);
                DaLei.Loader.notifyFun(objName,[obj]);
                return;
            }
        }
        DaLei.ModuleManager.putObject(objName, obj);
        DaLei.Loader.notifyFun(objName,[obj]);
    }
};

DaLei.loadComponent = function(module) {
    var dtd = $.Deferred();
    if(module) {
        var existModule = DaLei.ModuleManager.objects[module];
        if(existModule) {
            dtd.resolve(DaLei.copy({}, existModule, true));
            return dtd.promise();
        } else {
            var prefix = module.slice(0, module.indexOf("."));
            var prefixName = DaLei.Loader.modules[prefix];
            var modulePath = prefixName + module.slice(module.indexOf("."), module.length);
            var splitChar = window.SYSCONFIG_BASE_PATH.endsWith("/")?"":"/";
            //var getTimestamp= new Date().getTime();
            var dateNow = new Date();
            var getTimestamp= DaLei.DateUtil.formatDate(dateNow, DaLei.Const.BUSINESS_DATE_FORMAT);
            modulePath = window.SYSCONFIG_BASE_PATH  + splitChar + modulePath.replace(/\./g, "/") + ".js" + "?v="+getTimestamp + ".js";
            try {
                DaLei.Loader.load(modulePath, function(){
                    var moduleObj = DaLei.ModuleManager.getObject(module);
                    if(moduleObj) {
                        dtd.resolve(DaLei.copy({}, moduleObj, true));
                    } else {
                        if(!moduleObj) {
                            var times = 0;
                            var t = setInterval(function() {
                                times = times +1;
                                if(times >=10) {
                                    clearInterval(t);
                                    dtd.reject();
                                }
                                moduleObj = DaLei.ModuleManager.getObject(module);
                                if(moduleObj) {
                                    clearInterval(t);
                                    dtd.resolve(DaLei.copy({}, moduleObj, true));
                                }
                            },200)
                        }
                    }
                }, module);
            } catch(error) {
                dtd.reject();
            }
        }
    }
    return dtd.promise();
};

$(document).ready(function() {
    DaLei.bootstrapParse = function(context, controller, menuCode, postParse){
        var dtd = $.Deferred();
        var postParseList = [];
        if(DaLei.comps_bs) {
            $.each(DaLei.comps_bs, function(i, type){
                var comps = $("[xtype="+ type + "]", context);
                if(comps.length > 0) {
                    comps.each(function () {
                        try {
                            var compObj = DaLei.ModuleManager.getObject(type);
                            if(compObj) {
                                compObj = DaLei.copy({},compObj);
                            } else {
                                if($.inArray(type, DaLei.value_comps_bs) != -1) {
                                    compObj = DaLei.copy({}, DaLei.ModuleManager.getObject("scdp_value_comp"));
                                } else {
                                    compObj = DaLei.copy({}, DaLei.ModuleManager.getObject("scdp_comp"));
                                }
                            }
                            compObj.menuCode = menuCode;
                            compObj.controller = controller;
                            compObj.xtype=type;
                            compObj.ele = $(this);
                            compObj.context = context;
                            var itemId = DaLei.Utils.getCompKey($(this));
                            var initBefore = new Date().getTime();
                            $(this).data(type, compObj);
                            if($(this)[type]) {
                                if($(this).closest($("div:hidden")).length>0 && postParse) {
                                    postParseList.push({itemId: itemId, xtype:type, obj: $(this)});
                                } else {
                                    $(this)[type]("_init");
                                }
                            }

                            var initAfter = new Date().getTime();
                            //console.log("component itemId " + type + " " + itemId + " : " + (initAfter - initBefore));
                        } catch(error) {
                            var name = DaLei.Utils.getCompKey($(this));
                            DaLei.DebugUtil.logErr(" parse component " + name +" : " + error.stack);
                        }
                    });
                }
            });
        }
        if(postParseList.length>0) {
            setTimeout(function(){
                $.each(postParseList, function(i, comp){
                    var name = comp.itemId;
                    var xtype = comp.xtype;
                    try {
                        comp.obj[xtype]("_init");
                    } catch(error) {
                        DaLei.DebugUtil.logErr(" parse component " + name +" : " + error.stack);
                    }
                });
                dtd.resolve();
            },10);
        } else {
            dtd.resolve();
        }
        return dtd.promise();
    };
    if(DaLei.comps_bs) {
        $.each(DaLei.comps_bs,function(i, type){
            var obj = {};
            obj[type] = function(method) {
                if(typeof method == "string") {
                    try {
                        var defineObj = null;
                        if(this.length > 0) {
                            $.each(this, function(index, tempObj) {
                                defineObj = $(tempObj).data(type);
                                if(defineObj != null) {
                                    return false;
                                }
                            });
                            if(!defineObj) {
                                defineObj = this.data(type);
                            }
                        }
                        if(defineObj && defineObj[method]) {
                            var mth = defineObj[method];
                            var inParam = [];
                            $.each(arguments, function(i, arg) {
                                if(i !== 0) {
                                    inParam.push(arg);
                                }
                            });
                            return mth.apply(defineObj, inParam);
                        }
                    } catch (error) {
                        var name = DaLei.Utils.getCompKey($(this));
                        DaLei.DebugUtil.logErr("component " + name +" call method " + method + ": " + error.stack);
                    }
                }
            };

            $.fn.extend(obj);
        });
    }
    $.fn.extend({
        getCmp: function(itemId, contex) {
            if(!contex) {
                contex = this;
            }
            if (DaLei.ObjUtil.isNotEmpty(itemId)) {
                var itemIds = DaLei.StrUtil.split(itemId,"->");
                var itemIdSelector = "";
                var idSelector = "";
                var nameSelector = "";
                for (var i = 0; i < itemIds.length; i++) {
                    itemIdSelector += "[itemId='"+ itemIds[i]+ "']" + " ";
                    idSelector += "#" + itemIds[i] + " ";
                    nameSelector += "[name='"+ itemIds[i]+ "']" + " ";
                }
                var cmps = $(itemIdSelector, contex);
                if(cmps.length > 0) {
                    return cmps;
                } else if($(idSelector, contex).length > 0){
                    cmps = $(idSelector, contex);
                    return cmps;
                } else if($(nameSelector, contex).length > 0) {
                    cmps = $(nameSelector, contex);
                    return cmps;
                } else {
                    cmps = $(itemId, contex);
                    if(cmps.length>0) {
                        return cmps;
                    }
                }
            }
            return null;
        },

        gotValue: function (dirtyOnly, editflag) {
            var type = $(this).attr("xtype");
            if(type) {
                var compObj = $(this).data(type);
                if(!compObj && $.isFunction(this.data)) {
                    compObj = this.data(type);
                }
                if(compObj && compObj.gotValue) {
                    return compObj.gotValue(dirtyOnly, editflag);
                } else if(compObj && compObj.getValue) {
                    return compObj.getValue(dirtyOnly, editflag);
                } else if(compObj) {
                    var value = null;
                    try{
                        value  = $(this)[type]('gotValue', dirtyOnly, editflag);
                    } catch(err) {
                        value  = $(this)[type]('getValue', dirtyOnly, editflag);
                        try {
                            var values  = $(this)[type]('getValues', dirtyOnly, editflag);
                            if(values && values.length>1) {
                                return values
                            }
                        }catch(error) {
                        }
                    }
                    return value;
                } else {
                    return $(this).val();
                }
            }
        },
        sotValue: function(value) {
            var type = $(this).attr("xtype");
            if(type) {
                var compObj = $(this).data(type);
                if(!compObj && $.isFunction(this.data)) {
                    compObj = this.data(type);
                }
                if(compObj && compObj.sotValue) {
                    compObj.sotValue(value);
                } else if(compObj && compObj.setValue) {
                    compObj.setValue(value);
                } else if(compObj) {
                    try{
                        $(this)[type]('sotValue', value);
                    } catch(err) {
                        if($.isArray(compObj)) {
                            try {
                                $(this)[type]('setValues', value);
                            }catch(error) {
                                $(this)[type]('setValue', value);
                            }
                            return
                        }
                        $(this)[type]('setValue', value);
                    }
                } else {
                    $(this).val(value);
                }
            }
        },
        sotDisable: function() {
            var type = $(this).attr("xtype");
            if(type) {
                var compObj = $(this).data(type);
                if(!compObj && $.isFunction(this.data)) {
                    compObj = this.data(type);
                }
                if(compObj && compObj.sotDisable) {
                    compObj.sotDisable();
                } else if(compObj && compObj.disable) {
                    compObj.disable();
                } else if(compObj) {
                    return $(this)[type]('disable');
                } else {
                    $(this).attr("disabled", true);
                    $(this).addClass("disabled");
                }
            }
        },
        sotEnable: function() {
            var type = $(this).attr("xtype");
            if(type) {
                var compObj = $(this).data(type);
                if(!compObj && $.isFunction(this.data)) {
                    compObj = this.data(type);
                }
                if(compObj && compObj.sotEnable) {
                    compObj.sotEnable();
                } else if(compObj && compObj.enable) {
                    compObj.enable();
                }  else if(compObj) {
                    return $(this)[type]('enable');
                } else {
                    $(this).removeAttr("disabled");
                    $(this).removeClass("disabled");
                }
            }
        },
        sotVisable: function() {
            var type = $(this).attr("xtype");
            if(type) {
                var compObj = $(this).data(type);
                if(!compObj && $.isFunction(this.data)) {
                    compObj = this.data(type);
                }
                if(compObj && compObj.sotVisable) {
                    compObj.sotVisable();
                }
            }
        },
        sotHidden: function(needPosition) {
            var type = $(this).attr("xtype");
            if(type) {
                var compObj = $(this).data(type);
                if(!compObj && $.isFunction(this.data)) {
                    compObj = this.data(type);
                }
                if(compObj && compObj.sotHidden) {
                    compObj.sotHidden(needPosition);
                }
            }
        },
        destroy: function() {
            var me = this;
            var compEles = $("[xtype]", me);
            if(compEles.length >0) {
                $.each(compEles, function(j, compEle){
                    var xtype = $(compEle).attr("xtype");
                    var defineObj = $(compEle).data(xtype);
                    if(defineObj) {
                        try {
                            if(defineObj && defineObj.destroy) {
                                defineObj.destroy();
                            }  else if(defineObj) {
                                $(compEle)[type]('destroy');
                            }
                        } catch(error){
                            DaLei.DebugUtil.logErr("component " + defineObj.itemId +" destroy fail : " + error.stack);
                        }
                    }
                });
            }
            me.empty();
        },
        doLayout: function(ele) {
            var panel;
            if(ele) {
                panel = ele;
            } else {
                panel = this;
            }
            var subPanels = panel.find("[xtype='bPanel']");
            if(subPanels.length > 0) {
                panel.find("[xtype='bPanel']").each(function(i,subpanel) {
                    $(subpanel).bPanel("doLayout",true);
                });
            } else {
                var parent = panel.closest("[xtype='bPanel']");
                parent.bPanel("doLayout",true);
            }
        }
     });

    if($.fn.dataTable && $.fn.dataTable.defaults) {
        $.extend( true, $.fn.dataTable.defaults, {
            language: {
                url: 'framework/js/3rdparty/plugins/dataTables/lang/'+ DaLei.getSysConfig("locale_id")+ '.json'
            },
            paging:false,
            searching:false,
            autoWidth:false,
            searchDelay: 1000,
            destroy: true,
            scrollX: false,
            //serverSide: false,
            //deferRender: true,
            //dom: 'Bfrtip'
            "dom": "<'row'<'col-sm-3'l><'col-sm-3'><'col-sm-6 tool-btns'f>>" +
            "<'row'<'col-sm-12'rt>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>"

        });
        $.fn.dataTableExt.errMode = function(settings, tn, msg) {
            DaLei.DebugUtil.logInfo(msg);
        }
    };

    if(typeof(Inputmask) != 'undefined' && typeof(Inputmask) != 'null') {
        Inputmask.extendDefaults({
            'autoUnmask': true,
            'removeMaskOnSubmit': true
        });
    }
    if($.parser && $.easyui) {
        $.parser.parseValue = function(property, value, parent, delta){
            if (property.toLowerCase().indexOf('width') >= 0){
                delta = delta || 1;
            } else {
                delta = delta || 0;
            }
            var v = $.trim(String(value||''));
            var endchar = v.substr(v.length-1, 1);
            if (endchar == '%'){
                v = parseInt(v.substr(0, v.length-1));
                if (property.toLowerCase().indexOf('width') >= 0){
                    v = Math.floor((parent.width()-delta) * v / 100.0);
                } else {
                    v = Math.floor((parent.height()-delta) * v / 100.0);
                }
            } else {
                v = parseInt(v) || undefined;
            }
            return v;
        };

        var t_resize=null;
        $(window).unbind(".panel").bind("resize.panel",function(){
            if(t_resize){
                clearTimeout(t_resize);
            }
            t_resize=setTimeout(function(){
                var easy_layout=$("body.layout");
                if(easy_layout.length){
                    easy_layout.layout("resize");
                    $("body").children(".easyui-fluid:visible").each(function(){
                        $(this).triggerHandler("_resize");
                    });
                }else{
                    $("body").panel("doLayout");
                }
                t_resize=null;
            },400);
        });
    }
    //if($.fn.datebox) {
    //    $.fn.datebox.methods.gotValue = function(ele) {
    //        var value = $(ele).datebox("getValue");
    //        if(value) {
    //            return moment(value).toDate();
    //        } else {
    //            return null;
    //        }
    //    };
    //    $.fn.datebox.methods.sotValue = function(ele, value) {
    //        var date = null;
    //        if(typeof value =="string") {
    //            date = moment(value).format("YYYY-MM-DD");
    //        } else if(value instanceof Date){
    //            date = DaLei.DateUtil.formatDate(value)
    //        }
    //        $(ele).datebox("setValue",date);
    //    }
    //}
    //if($.fn.datetimebox) {
    //    $.fn.datetimebox.methods.gotValue = function(ele) {
    //        var value = $(ele).datetimebox("getValue");
    //        if(value) {
    //            return moment(value).toDate();
    //        } else {
    //            return null;
    //        }
    //    };
    //    $.fn.datetimebox.methods.sotValue = function(ele, value) {
    //        var date = null;
    //        if(typeof value =="string") {
    //            date = moment(value).format("YYYY-MM-DD HH:mm:ss");
    //        } else if(value instanceof Date){
    //            date = DaLei.DateUtil.formatDate(value, DaLei.Const.LONG_DATE_FORMAT)
    //        }
    //        $(ele).datetimebox("setValue",date);
    //    }
    //}
    if($.fn.datagrid) {
        function pagerFilter(data){
            if ($.isArray(data)){    // is array
                data = {
                    total: data.length,
                    rows: data
                }
            }
            var target = this;
            var dg = $(target);
            var state = dg.data('datagrid');
            var opts = dg.datagrid('options');
            if (!state.allRows){
                state.allRows = (data.rows);
            }
            if (opts.clientPage && opts.sortName){
                var names = DaLei.StrUtil.split(opts.sortName,',');
                var orders = DaLei.StrUtil.split(opts.sortOrder,',');
                state.allRows.sort(function(r1,r2){
                    var r = 0;
                    for(var i=0; i<names.length; i++){
                        var sn = names[i];
                        var so = orders[i];
                        var col = $(target).datagrid('getColumnOption', sn);
                        var sortFunc = col.sorter || function(a,b){
                                if(a && a instanceof Date) {
                                    a = a.getTime();
                                }
                                if(b && b instanceof Date) {
                                    b = b.getTime();
                                }
                                if(a == null && b != null) {
                                    return 1;
                                } else if(a != null && b== null) {
                                    return -1;
                                } else {
                                    return a==b ? 0 : (a>b?1:-1);
                                }
                            };
                        r = sortFunc(r1[sn], r2[sn]) * (so=='asc'?1:-1);
                        if (r != 0){
                            return r;
                        }
                    }
                    return r;
                });
            }
            var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
            var end = start + parseInt(opts.pageSize);
            data.rows = state.allRows.slice(start, end);
            return data;
        }

        var loadDataMethod = $.fn.datagrid.methods.loadData;
        var deleteRowMethod = $.fn.datagrid.methods.deleteRow;
        var appendRowMethod = $.fn.datagrid.methods.appendRow;
        var rejectChangesMethod = $.fn.datagrid.methods.rejectChanges;

        $.fn.datagrid.methods = $.extend($.fn.datagrid.methods, {
            clear: function(jq){
                var datagrid = $.data(jq[0], "datagrid");
                datagrid.data = {rows:[],total:0};
                var data = datagrid.data;
                datagrid.originalRows = [];
                datagrid.updatedRows = [];
                datagrid.insertedRows = [];
                datagrid.deletedRows = [];
                var opts = datagrid.options;
                var dc = datagrid.dc;
                //
                datagrid.allRows = [];
                opts.view.render.call(opts.view, jq[0], dc.body2, false);
                opts.view.render.call(opts.view, jq[0], dc.body1, true);
                if (opts.showFooter) {
                    opts.view.renderFooter.call(opts.view, jq[0], dc.footer2, false);
                    opts.view.renderFooter.call(opts.view, jq[0], dc.footer1, true);
                }
                datagrid.ss.clean();
                $(jq[0]).datagrid("getPager").pagination("refresh", {pageNumber: 0,total: data.total});
                dc.body2.triggerHandler("scroll");
                $(jq[0]).datagrid("setSelectionState");
            },
            clientPaging: function(jq){
                return jq.each(function(){
                    var dg = $(this);
                    var state = dg.data('datagrid');
                    var opts = state.options;
                    opts.clientPage = true;
                    opts.loadFilter = pagerFilter;
                    state.allRows = null;
                    //var onBeforeLoad = opts.onBeforeLoad;
                    //opts.onBeforeLoad = function(param){
                    //    state.allRows = null;
                    //    return onBeforeLoad.call(this, param);
                    //};
                    var pager = dg.datagrid('getPager');
                    pager.pagination({
                        onSelectPage:function(pageNum, pageSize){
                            opts.pageNumber = pageNum;
                            opts.pageSize = pageSize;
                            pager.pagination('refresh',{
                                pageNumber:pageNum,
                                pageSize:pageSize
                            });
                            dg.datagrid('loadData',state.allRows);
                        }
                    });
                    //$(this).datagrid('loadData', state.data);
                    //if (opts.url){
                    //    $(this).datagrid('reload');
                    //}
                });
            },
            loadData: function(jq, data){
                if(DaLei.ObjUtil.isNotEmpty(data) && !$.isArray(data) && data.rows == null) {
                    return;
                }
                var state = $.data(jq[0], "datagrid");
                var rows = data;
                var opts = state.options;
                var tempOriginalRows = null;
                var tempUpdatedRows = null;
                var tempInsertedRows = null;
                var tempDeletedRows = null;
                if(opts.clientPage  && opts.pagination) {
                    if(!state.allRows) {
                        var temp = [];
                        for (var i = 0; i < rows.length; i++) {
                            temp.push($.extend({}, rows[i]));
                        }
                        tempOriginalRows = temp;
                    } else {
                        tempOriginalRows = state.originalRows;
                    }
                    tempUpdatedRows = state.updatedRows;
                    tempInsertedRows = state.insertedRows;
                    tempDeletedRows = state.deletedRows;
                }

                jq.each(function(){
                    $(this).data('datagrid').allRows = null;
                });
                loadDataMethod.call($.fn.datagrid.methods, jq, data);
                if(opts.clientPage  && opts.pagination) {
                    state.originalRows = tempOriginalRows;
                    state.updatedRows = tempUpdatedRows;
                    state.insertedRows = tempInsertedRows;
                    state.deletedRows = tempDeletedRows;
                }
                return
            },
            deleteRow: function(jq, index){
                return jq.each(function(){
                    var row = $(this).datagrid('getRows')[index];
                    deleteRowMethod.call($.fn.datagrid.methods, $(this), index);
                    var state = $(this).data('datagrid');
                    if (state.options.loadFilter == pagerFilter){
                        for(var i=0; i<state.allRows.length; i++){
                            if (state.allRows[i] == row){
                                state.allRows.splice(i,1);
                                break;
                            }
                        }
                        $(this).datagrid('loadData', state.allRows);
                    }
                });
            },
            appendRow: function(jq, row) {
                return jq.each(function () {
                    var dg = $(this);
                    var state = dg.data('datagrid');
                    var opts = state.options;
                    if(opts.clientPage  && opts.pagination) {
                        var total = state.data.total;
                        var page = Math.ceil((total +1)/opts.pageSize);
                        var pager = $(this).datagrid("getPager");
                        var pagerOpt=$.data(pager[0],"pagination").options;
                        pagerOpt.onSelectPage.call(pager,page,opts.pageSize);
                        state.allRows.push(row);
                    }
                    appendRowMethod.call($.fn.datagrid.methods, $(this), row);
                });
            },
            rejectChanges: function(jq) {
                return jq.each(function () {
                    var dg = $(this);
                    var state = dg.data('datagrid');
                    var opts = state.options;
                    var originalRows = state.originalRows;
                    rejectChangesMethod.call($.fn.datagrid.methods, $(this));
                    if(opts.clientPage && opts.pagination) {
                        $(this).datagrid('clientPaging');
                        if(originalRows && originalRows.length >0) {
                            opts.pageNumber = 1;
                        } else {
                            opts.pageNumber = 0;
                        }
                        $(this).datagrid('loadData', originalRows);
                        $(this).datagrid("getPager").pagination("refresh", {pageNumber: opts.pageNumber,total: originalRows.length});
                    }
                });
            },
            getAllRows: function(jq){
                return jq.data('datagrid').allRows;
            }
        });
        function existObj(ele, name) {
            return $.data($(ele)[0], name) != undefined;
        };
        $.fn.datagrid.defaults.editors.datebox.getValue = function (ele) {
            var value = null;
            if (existObj(ele, "datebox")) {
                var value = $(ele).datebox("getValue");
            } else {
                value = $(ele).val();
            }
            if(value) {
                value = moment(value).toDate();
            }
            return value;
        };
        $.fn.datagrid.defaults.editors.datebox.init = function (container, options) {
            var ele=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(container);
            var datebox = ele.datebox(options);
            if(options.inputAble && options.inputAble == true)  {
            } else {
                datebox.datebox("textbox").attr("readonly","readonly");
            }

            return datebox;
        };
        $.fn.datagrid.defaults.editors.datebox.setValue = function (ele, value) {
            if(value && value instanceof Date) {
                value = moment(value).format("YYYY-MM-DD");
            }
            if (existObj(ele, "datebox")) {
                $(ele).datebox("setValue", value);
            } else {
                $(ele).val(value);
            }
        };
        $.fn.datagrid.defaults.editors.datetimebox.init = function (container, options) {
            var ele=$("<input type=\"text\" class=\"datagrid-editable-input\">").appendTo(container);
            var datetimebox = ele.datetimebox(options);
            if(options.inputAble && options.inputAble == true)  {
            } else {
                datetimebox.datebox("textbox").attr("readonly","readonly");
            }
            return datetimebox;
        };
        $.fn.datagrid.defaults.editors.datetimebox.getValue = function (ele) {
            var value = null;
            if (existObj(ele, "datetimebox")) {
                var value = $(ele).datetimebox("getValue");
            } else {
                value = $(ele).val();
            }
            if(value) {
                value = moment(value).toDate();
            }
            return value;
        };
        $.fn.datagrid.defaults.editors.datetimebox.setValue = function (ele, value) {
            if(value && value instanceof Date) {
                value = moment(value).format("YYYY-MM-DD HH:mm:ss");
            }
            if (existObj(ele, "datebox")) {
                $(ele).datetimebox("setValue", value);
            } else {
                $(ele).val(value);
            }
        };
        var comboxEditor = DaLei.ModuleManager.getObject("edit_comb");
        $.fn.datagrid.defaults.editors.combcol = $.extend($.extend({},$.fn.datagrid.defaults.editors.combobox),comboxEditor);

        var combtreeEditor = DaLei.ModuleManager.getObject("edit_combtree");
        $.fn.datagrid.defaults.editors.combtree = $.extend($.extend({},$.fn.datagrid.defaults.editors.combotree),combtreeEditor);

        var searchboxEditor = DaLei.ModuleManager.getObject("edit_searchbox");
        $.fn.datagrid.defaults.editors.searchbox = $.extend($.extend({},$.fn.datagrid.defaults.editors.searchbox), searchboxEditor);
    }

    //if($.fn.tooltip && $.fn.tooltip.methods) {
    //    $.fn.tooltip.methods.show = function() {};
    //}
    if($.fn.textbox) {
        $.fn.textbox.parseOptions=function(_65){
            var t=$(_65);
            var options = $.extend({}, $.fn.validatebox.parseOptions(_65), $.parser.parseOptions(_65, ["prompt", "iconCls", "iconAlign", "buttonText", "buttonIcon", "buttonAlign", "label", "labelPosition", "labelAlign", {
                multiline: "boolean",
                iconWidth: "number",
                labelWidth: "number"
            }]), {value: (t.val() || undefined), type: (t.attr("type") ? t.attr("type") : undefined)});
            if(options.required && DaLei.ObjUtil.isNotEmpty(options.label) && typeof options.label =='string') {
                options.label = "<span class='star-after' title='"+options.label +"'>"+options.label+" </span>";
            } else if(DaLei.ObjUtil.isNotEmpty(options.label) && typeof options.label =='string') {
                options.label = "<span title='"+options.label +"'>"+options.label+" </span>";
            }
            return options;
        };
    }

    if($.fn.tree && $.fn.tree.defaults) {
        $.fn.tree.defaults.view.render = function (domEle, ul, data) {
                var tree = $.data(domEle, "tree");
                var opts = tree.options;
                var treeNode = $(ul).prev(".tree-node");
                var treeNodeData = treeNode.length ? $(domEle).tree("getNode", treeNode[0]) : null;
                var treeNodeSpans = treeNode.find("span.tree-indent, span.tree-hit").length;
                var cc = renderNode.call(this, treeNodeSpans, data);
                $(ul).append(cc.join(""));
                function renderNode(spans,dataItems) {
                    var cc = [];
                    for (var i = 0; i < dataItems.length; i++) {
                        var item = dataItems[i];
                        if (item.state != "open" && item.state != "closed") {
                            item.state = "open";
                        }
                        item.domId = "_easyui_tree_" + DaLei.StrUtil.getUUID();
                        cc.push("<li>");
                        if(item.disabled) {
                            cc.push("<div id=\"" + item.domId + "\" class=\"tree-node tree-node-disabled\">");
                        } else {
                            cc.push("<div id=\"" + item.domId + "\" class=\"tree-node\">");
                        }

                        for (var j = 0; j < spans; j++) {
                            cc.push("<span class=\"tree-indent\"></span>");
                        }
                        if (item.state == "closed") {
                            cc.push("<span class=\"tree-hit tree-collapsed\"></span>");
                            cc.push("<span class=\"tree-icon tree-folder " + (item.iconCls ? item.iconCls : "") + "\"></span>");
                        } else {
                            if (item.children && item.children.length) {
                                cc.push("<span class=\"tree-hit tree-expanded\"></span>");
                                cc.push("<span class=\"tree-icon tree-folder tree-folder-open " + (item.iconCls ? item.iconCls : "") + "\"></span>");
                            } else {
                                cc.push("<span class=\"tree-indent\"></span>");
                                cc.push("<span class=\"tree-icon tree-file " + (item.iconCls ? item.iconCls : "") + "\"></span>");
                            }
                        }
                        if (this.hasCheckbox(domEle, item)) {
                            var flag = 0;
                            if (treeNodeData && treeNodeData.checkState == "checked" && opts.cascadeCheck) {
                                flag = 1;
                                item.checked = true;
                            } else {
                                if (item.checked) {
                                    $.easyui.addArrayItem(tree.tmpIds, item.domId);
                                }
                            }
                            item.checkState = flag ? "checked" : "unchecked";
                            cc.push("<span class=\"tree-checkbox tree-checkbox" + flag + "\"></span>");
                        } else {
                            item.checkState = undefined;
                            item.checked = undefined;
                        }
                        cc.push("<span class=\"tree-title\">" + opts.formatter.call(domEle, item) + "</span>");
                        cc.push("</div>");
                        if (item.children && item.children.length) {
                            var tmp = renderNode.call(this, spans + 1, item.children);
                            cc.push("<ul style=\"display:" + (item.state == "closed" ? "none" : "block") + "\">");
                            cc = cc.concat(tmp);
                            cc.push("</ul>");
                        }
                        cc.push("</li>");
                    }
                    return cc;
                };
            }

        $.fn.tree.defaults.onBeforeSelect = function(node) {
            if(node && $(node.target).hasClass("tree-node-disabled")) {
                return false;
            }
        }
        $.fn.tree.defaults.onBeforeCheck = function(node,bol) {
            if(node && $(node.target).hasClass("tree-node-disabled")) {
                return false;
            }
        }
        $.fn.combotree.defaults.onBeforeSelect = function(node) {
            if(node && $(node.target).hasClass("tree-node-disabled")) {
                return false;
            }
        }
        $.fn.combotree.defaults.onBeforeCheck = function(node,bol) {
            if(node && $(node.target).hasClass("tree-node-disabled")) {
                return false;
            }
        }
    }
    if($.fn.textbox) {
        $.fn.textbox.defaults.cls = "DaLei-textbox";
    }
    if($.fn.combo) {
        $.fn.combo.defaults.cls = "DaLei-textbox";
    }
    if($.fn.combobox) {
        $.fn.combobox.defaults.cls = "DaLei-textbox";
    }
    if($.fn.passwordbox) {
        $.fn.passwordbox.defaults.cls = "DaLei-textbox";
    }
    if($.fn.combotree) {
        $.fn.combotree.defaults.cls = "DaLei-textbox";
    }
    if($.fn.combogrid) {
        $.fn.combogrid.defaults.cls = "DaLei-textbox";
    }
    if($.fn.combotreegrid) {
        $.fn.combotreegrid.defaults.cls = "DaLei-textbox";
    }
    if($.fn.tagbox) {
        $.fn.tagbox.defaults.cls = "DaLei-textbox";
    }
    if($.fn.numberbox) {
        $.fn.numberbox.defaults.cls = "DaLei-textbox";
    }
    if($.fn.datebox) {
        $.fn.datebox.defaults.cls = "DaLei-textbox";
    }
    if($.fn.datetimebox) {
        $.fn.datetimebox.defaults.cls = "DaLei-textbox";
    }
    if($.fn.datetimespinner) {
        $.fn.datetimespinner.defaults.cls = "DaLei-textbox";
    }
    if($.fn.spinner) {
        $.fn.spinner.defaults.cls = "DaLei-textbox";
    }
    if($.fn.numberspinner) {
        $.fn.numberspinner.defaults.cls = "DaLei-textbox";
    }
    if($.fn.timespinner) {
        $.fn.timespinner.defaults.cls = "DaLei-textbox";
    }
    if($.fn.filebox) {
        $.fn.filebox.defaults.cls = "DaLei-textbox";
    }
    if($.fn.searchbox) {
        $.fn.searchbox.defaults.cls = "DaLei-textbox";
    }

    if($.fn.validatebox) {
        $.extend($.fn.validatebox.defaults.rules, {
            comboValueIsExist: {
                validator: function(value,param){
                    var jq = $(this).parent().prev();
                    var textbox = $(jq).combobox("textbox");
                    value = textbox.val();
                    var options = $(jq).combobox("options");
                    var text = DaLei.StrUtil.replaceNull(options.textField, "text");
                    var v = $(jq).combobox("getValue");
                    var rows = $(jq).combobox("getData");
                    if(DaLei.ObjUtil.isEmpty(rows)) {
                        return false;
                    } else {
                        var ret = false;
                        $.each(rows, function(i,row) {
                            if(row[text] == value) {
                                ret = true;
                                return;
                            }
                        });
                        return ret;
                    }
                },
                message: ''
            },
            comboTreeIsExist: {
                validator: function(value,param){
                    var jq = $(this).closest(".textbox").prev();
                    var textbox = $(jq).combotree("textbox");
                    var textValue = textbox.val();
                    var options = $(jq).combotree("options");
                    var text = DaLei.StrUtil.replaceNull(options.textField, "text");
                    var combotree=$.data(jq[0],"combotree");
                    var tree=combotree.tree;
                    var records = null;
                    if(options.multiple) {
                        records = tree.tree('getChecked', ['checked','indeterminate']);
                    } else {
                        records = tree.tree("getSelected");
                    }
                    if(DaLei.ObjUtil.isEmpty(records)) {
                        return false;
                    } else if($.isArray(records)) {
                        var ret = false;
                        $.each(records, function(i, row) {
                            if(row[text] == textValue) {
                                ret = true;
                                return;
                            }
                        });
                        return ret;
                    } else {
                        if(records[text] == textValue) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                message: ''
            }
        });
    }

    $("body").on("mouseover", 'div.datagrid-cell', function(e) {
        var tValue = $(this).text();
        if(DaLei.ObjUtil.isNotEmpty(tValue)) {
            $(this).attr("title", tValue);
        }
    });

});



