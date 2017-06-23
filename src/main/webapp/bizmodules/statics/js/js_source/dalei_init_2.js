window.PERSISTENCE_CACHE = window.localStorage;
//持久化缓存对象
window.SESSION_CACHE = window.sessionStorage;

window.TEMP_CACHE = {};

window.PAGE_CACHE = {};

//处理不支持trim的浏览器
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
    String.prototype.ltrim = function () {
        return this.replace(/^\s+/, '');
    };
    String.prototype.rtrim = function () {
        return this.replace(/\s+$/, '');
    };
    String.prototype.fulltrim = function () {
        return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (prefix) {
        return this.indexOf(prefix) === 0;
    };
}

DaLei.RSA = {};
DaLei.RSA.ServerKey = {};
DaLei.RSA.ClientKey = {};

window.SYSCONFIG_RSA_DISABLED = !window.SYSCONFIG_PRODUCT_MODE || window.SYSCONFIG_RSA_DISABLED;

//登录超时时间
window.LOGIN_TIMEOUT = 0;
//登录是否过期
window.IS_LOGIN_EXPIRED = false;

//当前网络延迟
window.NETWORK_DELAY = 0;

//Ext.Ajax.timeout = DaLei.Const.AJAX_TIMEOUT;
//Ext.data.proxy.Ajax.prototype.timeout = DaLei.Const.AJAX_TIMEOUT;


(function ($) {
    window.DaLeiMessage = function () {
        var success_html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
            '<div class="modal-dialog modal-sm" style="margin:200px auto">' +
            '<div class="modal-content">' +
            '<div class="bg-green color-palette" style="height: 40px;"> <h4 style="color: white;padding:10px;"><i class="icon fa fa-check"></i> [Title]</h4> </div>' +
            '<div class="modal-body">' +
            '<p>[Message]</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>' +
            '<button type="button" class="btn btn-success ok" data-dismiss="modal">[BtnOk]</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        var warning_html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
            '<div class="modal-dialog modal-sm" style="margin:200px auto">' +
            '<div class="modal-content">' +
            '<div class="bg-yellow color-palette" style="height: 40px;"> <h4 style="color: white;padding:10px;"><i class="icon fa fa-warning"></i> [Title]</h4> </div>' +
            '<div class="modal-body">' +
            '<p>[Message]</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>' +
            '<button type="button" class="btn btn-warning ok" data-dismiss="modal">[BtnOk]</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        var error_html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">' +
            '<div class="modal-dialog modal-sm" style="margin:200px auto">' +
            '<div class="modal-content">' +
            '<div class="bg-red color-palette" style="height: 40px;"> <h4 style="color: white;padding:10px;"><i class="icon fa fa-ban"></i> [Title]</h4> </div>' +
            '<div class="modal-body">' +
            '<p>[Message]</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>' +
            '<button type="button" class="btn btn-danger ok" data-dismiss="modal">[BtnOk]</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
        var generateId = function () {
            var date = new Date();
            return 'mdl' + date.valueOf();
        }
        var init = function (options) {
            options = $.extend({}, {
                type: "success",
                title: "操作提示",
                message: "提示内容",
                btnok: "确定",
                btncl: "取消",
                width: 200,
                auto: false
            }, options || {});
            var modalId = generateId();
            html = success_html;
            if (options.type == "error") {
                html = error_html;
            }
            if (options.type == "warning") {
                html = warning_html;
            }
            if (options.type == "success") {
                html = success_html;
            }
            var content = html.replace(reg, function (node, key) {
                return {
                    Id: modalId,
                    Title: options.title,
                    Message: options.message,
                    BtnOk: options.btnok,
                    BtnCancel: options.btncl
                }[key];
            });
            $('body').append(content);
            $('#' + modalId).modal({
                width: options.width,
                backdrop: 'static'
            });
            $('#' + modalId).on('hide.bs.modal', function (e) {
                $('body').find('#' + modalId).remove();
            });
            return modalId;
        }

        return {
            msgLst:[],
            alert: function (options) {
                var me = this;
                if (typeof options == 'string') {
                    options = {
                        message: options
                    };
                }
                if($.inArray(options.message, this.msgLst) != -1) {
                    return {on: function () {},hide: function () {}};
                } else {
                    this.msgLst.push(options.message);
                }
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.cancel').hide();

                return {
                    id: id,
                    on: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.find('.ok').click(function () {
                                callback(true);
                                if($.inArray(options.message, me.msgLst) != -1) {
                                    me.msgLst.splice($.inArray(options.message, me.msgLst),1);
                                }
                            });
                        }
                    },
                    hide: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.on('hide.bs.modal', function (e) {
                                callback(e);
                                if($.inArray(options.message, me.msgLst) != -1) {
                                    me.msgLst.splice($.inArray(options.message, me.msgLst),1);
                                }
                            });
                        }
                    }
                };
            },
            confirm: function (options) {
                var me = this;
                if (typeof options == 'string') {
                    options = {
                        message: options
                    };
                }
                if($.inArray(options.message, this.msgLst) != -1) {
                    return {on: function () {},hide: function () {}};
                } else {
                    this.msgLst.push(options.message);
                }
                var id = init(options);
                var modal = $('#' + id);
                modal.find('.cancel').show();
                return {
                    id: id,
                    on: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.find('.ok').click(function () {
                                callback(true);
                                if($.inArray(options.message, me.msgLst) != -1) {
                                    me.msgLst.splice($.inArray(options.message, me.msgLst),1);
                                }
                            });
                            modal.find('.cancel').click(function () {
                                callback(false);
                                if($.inArray(options.message, me.msgLst) != -1) {
                                    me.msgLst.splice($.inArray(options.message, me.msgLst),1);
                                }
                            });
                        }
                    },
                    hide: function (callback) {
                        if (callback && callback instanceof Function) {
                            modal.on('hide.bs.modal', function (e) {
                                callback(e);
                                if($.inArray(options.message, me.msgLst) != -1) {
                                    me.msgLst.splice($.inArray(options.message, me.msgLst),1);
                                }
                            });
                        }
                    }
                };
            }
        }
    }();
})(jQuery);

$(document).ready(function () {
    $("form.DaLeiActionForm").submit(function (e) {
        var postData = {};
        $(this).serializeArray().map(function (x) {
            if (DaLei.ObjUtil.isNotEmpty(x.value)) {
                postData[x.name] = x.value;
            }
        });
        var action =  this.action;
        var method =  this.method;
        var timestamp = new Date().getTime();
        var formId = "DaLeiHiddenJspForm" + timestamp;
        e.preventDefault();
        $("body").append('<form class="hidden" id="'+ formId + '" action="DaLei/controller/jsp/load-tasks" method="post">' +
            "</form>");
        var formatFormId = "#" + formId;
        $(formatFormId).append('<input type="hidden" name="postData" id="postData"/>');
        $(formatFormId).append('<input type="hidden" name="userId" id="userId"/>');
        $(formatFormId).append('<input type="hidden" name="userLocaleId" id="userLocaleId"/>');
        $(formatFormId).append('<input type="hidden" name="timestamp" id="timestamp"/>');
        $(formatFormId).append('<input type="hidden" name="network" id="network"/>');
        $(formatFormId).append('<input type="hidden" name="actionName" id="actionName"/>');
        $(formatFormId).append('<input type="hidden" name="signature" id="signature"/>');
        $(formatFormId).action = action;
        $(formatFormId).method = method;
        $("#postData", $(formatFormId)).val(DaLei.JSON.encode(postData));
        $("#userId", $(formatFormId)).val(DaLei.CacheUtil.get(DaLei.Const.USER_ID));
        $("#userLocaleId", $(formatFormId)).val(DaLei.getSysConfig("locale_id"));
        $("#timestamp", $(formatFormId)).val(Date.now());
        $("#network", $(formatFormId)).val(window.NETWORK_DELAY);
        $("#actionName", $(formatFormId)).val(action);
        $("#signature", $(formatFormId)).val(DaLei.getSign(action, postData));

        document.getElementById(formId).submit();
        $(formatFormId).remove();
    });
});


/**
 * 初始化toastr提示框
 */
toastrInit=function(time){
    toastr.options = {
        "closeButton": true, //是否显示关闭按钮
        "debug": false, //是否使用debug模式
        "positionClass": "toast-top-right",//弹出窗的位置
        "showDuration": "300",//显示的动画时间
        "hideDuration": "1000",//消失的动画时间
        "timeOut": time, //展示时间
        "extendedTimeOut": "1000",//加长展示时间
        "showEasing": "swing",//显示时的动画缓冲方式
        "hideEasing": "linear",//消失时的动画缓冲方式
        "showMethod": "fadeIn",//显示时的动画方式
        "hideMethod": "fadeOut" //消失时的动画方式
    };
}

/**
 * 消息提示
 * @param message
 * @param fn
 */
DaLei.Msg.toastr_info = function (message, fn) {
    toastrInit(3000);;
    toastr.success(message);
    // MP.Msg.alertMessage("success", "提示", message, fn);
}
/**
 * 消息警告
 * @param message
 * @param fn
 */
DaLei.Msg.toastr_warn = function (message, fn) {
    toastrInit(3600);

    var currentMesSizes=$('div.toast-message').size();
    if(currentMesSizes!=0){
        for(var i=1;i<=currentMesSizes;i++){
            var IsCreate;
            var target="#toast-container div.toast-message:eq("+(i-1)+")";
            var currentMes=$(target).text();
            if(currentMes==message){
                IsCreate=false;
                break;
            }else{
                IsCreate=true;
            }
        }
        if(IsCreate){
            toastr.warning(message);
        }
    }else{
        toastr.warning(message);
    }

    //MP.Msg.alertMessage("warning", "警告", message, fn);
}

/**
 * 消息错误
 * @param message
 * @param fn
 */
DaLei.Msg.toastr_error = function (message, fn) {
    toastrInit(3500);

    var currentMesSizes=$('div.toast-message').size();
    if(currentMesSizes!=0){
        for(var i=1;i<=currentMesSizes;i++){
            var IsCreate;
            var target="#toast-container div.toast-message:eq("+(i-1)+")";
            var currentMes=$(target).text();
            if(currentMes==message){
                IsCreate=false;
                break;
            }else{
                IsCreate=true;
            }
        }
        if(IsCreate){
            toastr.error(message);
        }
    }else{
        toastr.error(message);
    }

    //MP.Msg.alertMessage("error", "错误", message, fn);
}