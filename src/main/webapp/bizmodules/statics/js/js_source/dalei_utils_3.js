

//String Utils
/** @namespace DaLei.Const */
/** @namespace DaLei.ObjUtil */
/** @namespace DaLei.MathUtil */
/** @namespace DaLei.DateUtil */
/** @namespace DaLei.CookieUtil */
/** @namespace DaLei.CacheUtil */
/** @namespace DaLei.CommUtil */
/** @namespace DaLei.DebugUtil */
/** @namespace DaLei.CryptUtil */
/** @namespace asmCrypto */
/** @namespace window.SYSCONFIG_RSA_DISABLED */
/** @namespace window.SYSCONFIG_OTP_DISABLED */
/** @namespace window.SYSCONFIG_PRODUCT_CODE */
DaLei.StrUtil.getRecur = function (obj, count) {
    var retStr = "";
    for (var i = 0; i < count; i++) {
        retStr = retStr + obj;
    }
    return retStr;
};

DaLei.StrUtil.replaceNull = function (obj, defaultStr) {
    return DaLei.ObjUtil.isEmpty(obj) ? (defaultStr || '') : obj;
};

DaLei.StrUtil.concat = function () {
    var retStr = "";
    for (var i = 0; i < arguments.length; i++) {
        retStr = retStr.concat(arguments[i])
    }
    return retStr;
};

DaLei.StrUtil.replaceAll = function (strSource, strFrom, strTo) {
    strSource = DaLei.StrUtil.replaceNull(strSource);
    strFrom = DaLei.StrUtil.replaceNull(strFrom);
    strTo = DaLei.StrUtil.replaceNull(strTo);
    if (strFrom == strTo) {
        return strSource;
    } else {
        while (strSource.indexOf(strFrom) != -1) {
            strSource = strSource.replace(strFrom, strTo);
        }
        return strSource;
    }
};

DaLei.StrUtil.replaceFirst = function (strSource, strFrom, strTo) {
    strSource = DaLei.StrUtil.replaceNull(strSource);
    strFrom = DaLei.StrUtil.replaceNull(strFrom);
    strTo = DaLei.StrUtil.replaceNull(strTo);
    return strSource.replace(strFrom, strTo);
};

DaLei.StrUtil.replaceLast = function (strSource, strFrom, strTo) {
    strSource = DaLei.StrUtil.replaceNull(strSource);
    strFrom = DaLei.StrUtil.replaceNull(strFrom);
    strTo = DaLei.StrUtil.replaceNull(strTo);
    return DaLei.StrUtil.reverseStr(
        DaLei.StrUtil.replaceFirst(
            DaLei.StrUtil.reverseStr(strSource), DaLei.StrUtil.reverseStr(strFrom), DaLei.StrUtil.reverseStr(strTo)));
};

DaLei.StrUtil.reverseStr = function (strSource) {
    if (DaLei.ObjUtil.isEmpty(strSource)) {
        return strSource;
    } else {
        var arrStr = strSource.split("");
        arrStr = arrStr.reverse();
        return arrStr.join("");
    }
};

DaLei.StrUtil.getMatches = function (strSrc, regex) {
    return strSrc.match(regex);
};

DaLei.StrUtil.ltrim = function (str) {
    return str.replace(/(^\s*)/g, "");
};

DaLei.StrUtil.rtrim = function (str) {
    return str.replace(/(\s*$)/g, "");
};

DaLei.StrUtil.trim = function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

DaLei.StrUtil.lpad = function (str, padstr, count) {
    for (var i = 0; i < count; i++) {
        str = padstr + str;
    }
    return str;
};

DaLei.StrUtil.rpad = function (str, padstr, count) {
    for (var i = 0; i < count; i++) {
        str = str + padstr;
    }
    return str;
};

DaLei.StrUtil.pad = function (str, padstr, count) {
    for (var i = 0; i < count; i++) {
        if ((i % 2) == 0) {
            str = str + padstr;
        } else {
            str = padstr + str;
        }
    }
    return str;
};

DaLei.StrUtil.indexOf = function (str, queryStr, ignoreCase) {
    if (ignoreCase) {
        return str.toLowerCase().indexOf(queryStr.toLowerCase())
    } else {
        return str.indexOf(queryStr);
    }
};

DaLei.StrUtil.isIP = function (str) {
    var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
    if (reSpaceCheck.test(str)) {
        str.match(reSpaceCheck);
        return !!(RegExp.$1 <= 255 && RegExp.$1 >= 0
        && RegExp.$2 <= 255 && RegExp.$2 >= 0
        && RegExp.$3 <= 255 && RegExp.$3 >= 0
        && RegExp.$4 <= 255 && RegExp.$4 >= 0);
    } else {
        return false;
    }
};

DaLei.StrUtil.isLongDate = function (str) {
    var r = str.replace(/(^\s*)|(\s*$)/g, "").match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    if (r == null) {
        return false;
    }
    var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3]
    && d.getDate() == r[4] && d.getHours() == r[5]
    && d.getMinutes() == r[6] && d.getSeconds() == r[7]);
};

DaLei.StrUtil.isShortDate = function (str) {
    var r = str.replace(/(^\s*)|(\s*$)/g, "").match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) {
        return false;
    }
    var d = new Date(r[1], r[3] - 1, r[4]);
    return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
};

DaLei.StrUtil.isDate = function (str) {
    return DaLei.StrUtil.isLongDate(str) || DaLei.StrUtil.isShortDate(str);
};

DaLei.StrUtil.isMobile = function (str) {
    return /^(\+)?[0-9]{7,}$/.test(str);
};

DaLei.StrUtil.isEmail = function (str) {
    return /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(str);
};

DaLei.StrUtil.isZipCode = function (str) {
    return /^[\d]{6}$/.test(str);
};

DaLei.StrUtil.isFileName = function (str) {
    return !/[\\/:\?\*"<>|]/.test(str);
};

DaLei.StrUtil.existChinese = function (str) {
    return str.search(/[\u4e00-\u9fa5]+/) != -1;
};

DaLei.StrUtil.existFullChar = function (str) {
    return str.search(/[\ufe30-\uffa0]+/) != -1;
};

DaLei.StrUtil.trueLength = function (str) {
    var i, sum;
    sum = 0;
    for (i = 0; i < str.length; i++) {
        if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 255))
            sum = sum + 1;
        else
            sum = sum + 2;
    }
    return sum;
};

DaLei.StrUtil.toFullChar = function (str) {
    var retStr = "";
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 255) {
            retStr += String.fromCharCode(str.charCodeAt(i) + 65248);
        }
        else {
            retStr += String.fromCharCode(str.charCodeAt(i));
        }
    }
    return retStr
};

DaLei.StrUtil.toHtmlCode = function (str) {
    var retStr = str;
    retStr = retStr.replace(/&/g, "&amp;");
    retStr = retStr.replace(/</g, "&lt;");
    retStr = retStr.replace(/>/g, "&gt;");
    retStr = retStr.replace(/'/g, "&apos;");
    retStr = retStr.replace(/"/g, "&quot;");
    retStr = retStr.replace(/\\n/g, "<br>");
    retStr = retStr.replace(/ /g, "&nbsp;");
    retStr = retStr.replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    return retStr;
};

DaLei.StrUtil.getSplitSize = function (str, split) {
    if (DaLei.ObjUtil.isNotEmpty(str)) {
        var lst = str.split(split);
        return lst.length;
    } else {
        return 0;
    }
};

DaLei.StrUtil.getLastSplit = function (str, split) {
    if (DaLei.ObjUtil.isNotEmpty(str)) {
        var lst = str.split(split);
        return lst[lst.length - 1];
    } else {
        return "";
    }
};
DaLei.StrUtil.split = function (str, split) {
    if (DaLei.ObjUtil.isNotEmpty(str)) {
        var lst = str.split(split);
        var ret = [];
        $.each(lst, function(i,item) {
            ret.push(DaLei.StrUtil.trim(item));
        })
        return ret;
    } else {
        return str;
    }
};
var UUID = function () {
    if (typeof (UUID.initilize == 'undefined')) {
        UUID.initilize = true;
        UUID.prototype.valueOf = function () {
            return this.id;
        };
        UUID.prototype.toString = function () {
            return this.id;
        };
        UUID.prototype.createUUID = function () {
            var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
            var dc = new Date();
            var t = dc.getTime() - dg.getTime();
            var tl = UUID.getIntegerBits(t, 0, 31);
            var tm = UUID.getIntegerBits(t, 32, 47);
            var thv = UUID.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
            var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
            var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);

            var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
                UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
                UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
                UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
                UUID.getIntegerBits(UUID.rand(8191), 0, 15); // this last number is two octets long
            return tl + tm + thv + csar + csl + n;
        };
        UUID.getIntegerBits = function (val, start, end) {
            var base16 = UUID.returnBase(val, 16);
            var quadArray = [];
            var quadString = '';
            var i = 0;
            for (i = 0; i < base16.length; i++) {
                quadArray.push(base16.substring(i, i + 1));
            }
            for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
                if (!quadArray[i] || quadArray[i] == '') quadString += '0';
                else quadString += quadArray[i];
            }
            return quadString;
        };
        UUID.returnBase = function (number, base) {
            return (number).toString(base).toUpperCase();
        };
        UUID.rand = function (max) {
            return Math.floor(Math.random() * (max + 1));
        };
    }
};

DaLei.StrUtil.getUUID = function () {
    return new UUID().createUUID().toLowerCase();
};

DaLei.StrUtil.getMd5 = function (str) {
    return CryptoJS.MD5(str).toString(CryptoJS.enc.Hex);
};

DaLei.StrUtil.getSha1 = function (str) {
    try {
        return asmCrypto.SHA1.hex(str);
    } catch (e) {
    }
    return CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex);
};

DaLei.StrUtil.getHMACSHA1ByHex = function (data, key) {
    try {
        return asmCrypto.HMAC_SHA1.hex(asmCrypto.hex_to_bytes(data),
            asmCrypto.hex_to_bytes(key));
    } catch (e) {
    }
    return CryptoJS.HmacSHA1(CryptoJS.enc.Hex.parse(data),
        CryptoJS.enc.Hex.parse(key)).toString(CryptoJS.enc.Hex);
};

DaLei.StrUtil.getHMACSHA1 = function (data, key) {
    try {
        return asmCrypto.HMAC_SHA1.hex(data, key);
    } catch (e) {
    }
    return CryptoJS.HmacSHA1(data, key).toString(CryptoJS.enc.Hex);
};

DaLei.StrUtil.getHMACSHA256 = function (data, key) {
    try {
        return asmCrypto.HMAC_SHA256.hex(data, key);
    } catch (e) {
    }
    return CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Hex);
};

DaLei.StrUtil.ab2str = function (buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
};

DaLei.StrUtil.str2ab = function (str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};

DaLei.StrUtil.encodeab = function (buf) {
    return DaLei.StrUtil.Base64.encode(String.fromCharCode.apply(null, buf));
};

DaLei.StrUtil.decodeab = function (str) {
    return new Uint8Array(DaLei.StrUtil.Base64.decode(str).split("").map(function (c) {
        return c.charCodeAt(0);
    }));
};

DaLei.StrUtil.cjkEncode = function (text) {
    if (text == null) {
        return "";
    }
    var newText = "";
    for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        if (code >= 128 || code == 91 || code == 93) {  //91 is "[", 93 is "]".
            newText += "[" + code.toString(16) + "]";
        } else {
            newText += text.charAt(i);
        }
    }
    return newText;
};

DaLei.StrUtil.Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = this._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = this._utf8_decode(t);
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128)
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
};

DaLei.StrUtil.validateCron = function (val, blankText) {
    if (DaLei.ObjUtil.isEmpty(val))
        return DaLei.ObjUtil.isEmpty(blankText) ? true : blankText;

    var validateResult = false;
    DaLei.doAction("sys-schedule-validatecron", {"cronExp": val}, function (retData) {
        var result = retData.result;
        validateResult = result || DaLei.I18N.ILLEGAL_CRON_EXP;
    }, function () {
        validateResult = true;
    }, false, false);
    return validateResult;
};

DaLei.StrUtil.validateJson = function (val, blankText) {
    if (DaLei.ObjUtil.isEmpty(val))
        return DaLei.ObjUtil.isEmpty(blankText) ? true : blankText;

    try {
        JSON.parse(val);
        return true;
    } catch (e) {
    }
    return DaLei.I18N.ILLEGAL_JSON;
};

DaLei.StrUtil.htmlEncode = function (str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&gt;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
};
DaLei.StrUtil.htmlDecode = function (str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&gt;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
};

//Date Utils
DaLei.DateUtil.newDate = function (year, month, day, hour, minute, second) {
    if (arguments.length == 6) {
        return new Date(year, month - 1, day, hour, minute, second);
    } else if (arguments.length == 3) {
        return new Date(year, month - 1, day);
    } else {
        DaLei.DebugUtil.logErr("Invalid date parameters!");
    }
};

DaLei.DateUtil.isLeapYear = function (date) {
    return (0 == date.getFullYear() % 4 && ((date.getFullYear() % 100 != 0) || (date.getFullYear() % 400 == 0)));
};

DaLei.DateUtil.parseDate = function (strDate) {
    if (DaLei.ObjUtil.isNotEmpty(strDate)) {
        return new Date(Date.parse(strDate.replace(/-/g, "/")));
    } else {
        return strDate;
    }
};

DaLei.DateUtil.parseDateToLocal = function (strDate) {
    if (DaLei.ObjUtil.isNotEmpty(strDate)) {
        var date = null;
        if (strDate instanceof Date) {
            date = strDate;
        } else {
            var dateStr = DaLei.StrUtil.replaceFirst(strDate, "T", " ");
            date = DaLei.DateUtil.parseDate(dateStr);
        }
        var utcTime = date.getTime();
        var localOffset = date.getTimezoneOffset() * 60000;
        var localTime = utcTime - localOffset;
        return new Date(localTime);
    } else {
        return null;
    }
};

DaLei.DateUtil.formatDate = function (date, format) {
    if (DaLei.ObjUtil.isEmpty(format)) {
        format = DaLei.Const.SHORT_DATE_FORMAT;
    }
    if (format == DaLei.Const.SHORT_DATE_FORMAT) {
        return date.getFullYear() + "-" + DaLei.MathUtil.lpad0((date.getMonth() + 1), 2) + "-" + DaLei.MathUtil.lpad0(date.getDate(), 2);
    } else if (format == DaLei.Const.LONG_DATE_FORMAT) {
        return date.getFullYear() + "-" + DaLei.MathUtil.lpad0((date.getMonth() + 1), 2) + "-" + DaLei.MathUtil.lpad0(date.getDate(), 2)
            + " " + date.getHours() + ":" + DaLei.MathUtil.lpad0(date.getMinutes(), 2) + ":" + DaLei.MathUtil.lpad0(date.getSeconds(), 2);
    } else if (format == DaLei.Const.BUSINESS_DATE_FORMAT) {
        return date.getFullYear() + "-" + DaLei.MathUtil.lpad0((date.getMonth() + 1), 2) + "-" + DaLei.MathUtil.lpad0(date.getDate(), 2)
            + " " + date.getHours() + ":" + DaLei.MathUtil.lpad0(date.getMinutes(), 2);
    }
};

DaLei.DateUtil.getHours = function (timeMills) {
    return Math.floor(timeMills / (1000 * 3600));
};
DaLei.DateUtil.getMinutes = function (timeMills) {
    return Math.floor(timeMills / (1000 * 60));
};
DaLei.DateUtil.getSeconds = function (timeMills) {
    return Math.floor(timeMills / 1000);
};

DaLei.DateUtil.updateTz = function (col, needTz) {
    col.needTz = needTz;
    col.setText(DaLei.DateUtil.updateTzTitle(col.text, needTz));
};
DaLei.DateUtil.updateTzTitle = function (txt, needTz) {
    txt = DaLei.StrUtil.replaceAll(DaLei.StrUtil.replaceAll(txt, DaLei.I18N.TZ_LOCAL, ''), DaLei.I18N.TZ_UTC, '');
    return txt + (needTz ? DaLei.I18N.TZ_LOCAL : DaLei.I18N.TZ_UTC);
};
//date1,date2  0: date1 = data2  -1: date1<date2  1: date1>date2
DaLei.DateUtil.dateDiff = function (date1, date2) {
    if (DaLei.ObjUtil.isEmpty(date1) && DaLei.ObjUtil.isEmpty(date2)) {
        return 0;
    } else if (DaLei.ObjUtil.isEmpty(date1)) {
        return -1;
    } else if (DaLei.ObjUtil.isEmpty(date2)) {
        return 1;
    } else {
        var timeMills1 = new Date(date1).getTime();
        var timeMills2 = new Date(date2).getTime();
        if (timeMills1 < timeMills2) {
            return -1;
        } else if (timeMills1 > timeMills2) {
            return 1;
        } else {
            return 0;
        }
    }
};

//Math Utils
DaLei.MathUtil.lpad0 = function (num, count) {
    var strRet = num.toString();
    var numLen = strRet.length;
    for (var i = 0; i < count - numLen; i++) {
        strRet = "0" + strRet;
    }
    return strRet;
};

DaLei.MathUtil.randomInt = function (from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
};

DaLei.MathUtil.getScale = function (num, scale) {
    var oNum = Number(num);
    return oNum.toFixed(scale);
};

DaLei.MathUtil.getExponential = function (num, scale) {
    var oNum = Number(num);
    return oNum.toExponential(scale);
};

//Array Utils
DaLei.ArrayUtil.findRecord = function (arr, key, value) {
    if (DaLei.ObjUtil.isEmpty(arr)) {
        return [];
    } else {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item[key] == value) {
                return item;
            }
        }
        return [];
    }
};
DaLei.ArrayUtil.removeEmpty = function (arr) {
    if (DaLei.ObjUtil.isEmpty(arr)) {
        return [];
    } else {
        for (var i = arr.length-1; i >= 0; i--) {
            if(DaLei.ObjUtil.isEmpty(arr[i])) {
                arr.splice(i, 1);
            }
        }
        if(DaLei.ObjUtil.isEmpty(arr)) {
            return [];
        } else {
            return arr;
        }
    }
};
//Map Utils


//Object Utils
DaLei.ObjUtil.isEmpty = function (obj) {
    return (obj === null) || (obj === undefined)
        || obj === ''
        || ($.isArray(obj) && obj.length === 0)
        || obj==={};
};

DaLei.ObjUtil.isNotEmpty = function (obj) {
    return !DaLei.ObjUtil.isEmpty(obj);
};

DaLei.ObjUtil.isObject = function (obj) {
    return toString.call(obj) === '[object Object]';
};

DaLei.ObjUtil.set = function (obj, key, value) {
    obj[key] = value;
};

DaLei.ObjUtil.get = function (obj, key) {
    return obj[key];
};

DaLei.ObjUtil.remove = function (obj, key) {
    delete obj[key];
};

DaLei.ObjUtil.getKeys = function (obj) {
    return Object.keys(obj);
};

//DaLei.ObjUtil.compactObject = function (obj, doChildren, skipClone) {
//    var ret = skipClone === true ? obj : Ext.clone(obj);
//    Ext.Object.each(ret, function (key, value) {
//        if (DaLei.ObjUtil.isEmpty(value)) {
//            delete ret[key];
//        } else if (value instanceof Array && doChildren === true) {
//            Ext.Array.each(value, function (item) {
//                DaLei.ObjUtil.compactObject(item, true, true);
//            });
//        } else if (value instanceof Object && doChildren === true) {
//            DaLei.ObjUtil.compactObject(value, true, true);
//        }
//    });
//    return ret;
//};

//Cookie Utils
DaLei.CookieUtil.setCookie = function (name, value, expireHours, path) {
    if (DaLei.ObjUtil.isEmpty(expireHours)) {
        expireHours = 0;
    }
    if (DaLei.ObjUtil.isNotEmpty(path)) {
        path = ';path=' + path;
    } else {
        path = '';
    }
    var cookieString = name + "=" + encodeURIComponent(value);
    if (DaLei.ObjUtil.isNotEmpty(expireHours)) {
        //判断是否设置过期时间
        var date = new Date();
        if (expireHours === 0) {

        } else if (expireHours > 0) {
            date.setTime(date.getTime() + expireHours * 3600000);
            cookieString = cookieString + ';expires=' + date.toGMTString() + path;
        } else {
            date.setTime(date.getTime() + 365 * 24 * 3600000);
            cookieString = cookieString + ';expires=' + date.toGMTString() + path;
        }
    }

    document.cookie = cookieString;
};

DaLei.CookieUtil.getCookie = function (name) {
    var strcookie = document.cookie;
    var arrcookie = strcookie.split("; ");
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) {
            return decodeURIComponent(DaLei.StrUtil.replaceNull(arr[1]));
        }
    }
    return "";
};

DaLei.CookieUtil.removeCookie = function (name) {
    var date = new Date();
    date.setTime(date.getTime() - 24 * 3600);
    document.cookie = name + "=;expires=" + date.toGMTString();
};

/**
 * Cache Utils
 */
DaLei.CacheUtil.getTempCachePrefix = function (cacheType) {

    return window.SYSCONFIG_PRODUCT_CODE + '-TEMP-' + cacheType.toUpperCase() + '-';
};

DaLei.CacheUtil.refactCacheKey = function (key, diffUser, diffLocale) {
    if (diffUser) {
        key = DaLei.getCurrentUserId() + "-" + key;
    } else {
        key = "-" + key;
    }

    if (diffLocale) {
        key = DaLei.getSysConfig("locale_id") + "-" + key;
    } else {
        key = "-" + key;
    }

    return key;
};

DaLei.CacheUtil.set = function (key, value) {
    if (DaLei.CacheUtil.isSessionScope(key)) {
        window.sessionStorage.setItem(window.SYSCONFIG_PRODUCT_CODE + '-' + key, value);
    } else {
        window.localStorage.setItem( window.SYSCONFIG_PRODUCT_CODE + '-PERSISTENCE-' + key, value);
    }
};

DaLei.CacheUtil.get = function (key) {
    if (DaLei.CacheUtil.isSessionScope(key)) {
        return window.sessionStorage.getItem(window.SYSCONFIG_PRODUCT_CODE + '-' + key);
    } else {
        return window.localStorage.getItem(window.SYSCONFIG_PRODUCT_CODE + '-PERSISTENCE-' + key);
    }
};

DaLei.CacheUtil.remove = function (key) {
    if (DaLei.CacheUtil.isSessionScope(key)) {
        window.sessionStorage.removeItem(window.SYSCONFIG_PRODUCT_CODE + '-' + key);
    } else {
        window.localStorage.removeItem(window.SYSCONFIG_PRODUCT_CODE + '-PERSISTENCE-' + key);
    }
};

DaLei.CacheUtil.getKeys = function () {
    return DaLei.ObjUtil.getKeys(window.PERSISTENCE_CACHE.store._store);
};


DaLei.CacheUtil.isSessionScope = function (key) {//When the key is session scoped(user related), store it in window.sessionStorage
    return key === DaLei.Const.USER_TOKEN || DaLei.Const.USER_INFO_KEYS.indexOf(key) != -1
};

DaLei.CacheUtil.removeAll = function () {
    window.PERSISTENCE_CACHE.clear();
};

DaLei.CacheUtil.setTemp = function (cacheType, key, value, diffUser, diffLocale) {
    if (cacheType == DaLei.Const.CACHE_TYPE_SYS_MENU) {//Store menu in session storage
        DaLei.CacheUtil.set(DaLei.Const.CACHE_TYPE_SYS_MENU, JSON.stringify(value));
        return;
    }
    var tmpCache = DaLei.CacheUtil.getTempCache(cacheType);
    tmpCache[DaLei.CacheUtil.refactCacheKey(key, diffUser, diffLocale)] = value;
};

DaLei.CacheUtil.getTemp = function (cacheType, key, diffUser, diffLocale) {
    if (cacheType == DaLei.Const.CACHE_TYPE_SYS_MENU) {//Store menu in session storage
        var  value = DaLei.CacheUtil.get(DaLei.Const.CACHE_TYPE_SYS_MENU);
        return JSON.parse(value);
    }
    var tmpCache = DaLei.CacheUtil.getTempCache(cacheType);
    return tmpCache[DaLei.CacheUtil.refactCacheKey(key, diffUser, diffLocale)];
};

DaLei.CacheUtil.clearTempCache = function (cacheType){
    window.TEMP_CACHE[cacheType.toUpperCase()] = {};
};

DaLei.CacheUtil.removeTemp = function (cacheType, key, diffUser, diffLocale) {
    if (cacheType == DaLei.Const.CACHE_TYPE_SYS_MENU) {//Store menu in session storage
        DaLei.CacheUtil.remove(DaLei.Const.CACHE_TYPE_SYS_MENU);
        return;
    }
    DaLei.CacheUtil.clearTempCache(cacheType);
};

//DaLei.CacheUtil.getKeysTemp = function (cacheType) {
//    return DaLei.ObjUtil.getKeys(DaLei.CacheUtil.getTempCache(cacheType).store._store);
//};

DaLei.CacheUtil.removeAllTempByType = function (cacheType) {
    if (cacheType == DaLei.Const.CACHE_TYPE_SYS_MENU) {//Store menu in session storage
        DaLei.CacheUtil.remove(DaLei.Const.CACHE_TYPE_SYS_MENU);
        return;
    }
    DaLei.CacheUtil.clearTempCache(cacheType);
};

DaLei.CacheUtil.removeAllTemp = function () {
    //DaLei.CacheUtil.removeAllTempByType(DaLei.Const.CACHE_TYPE_COMBO_STORE);
    DaLei.CacheUtil.removeAllTempByType(DaLei.Const.CACHE_TYPE_INFO_LAYOUT);
    DaLei.CacheUtil.remove(DaLei.Const.CACHE_TYPE_SYS_MENU);
    DaLei.CacheUtil.removeAllTempByType(DaLei.Const.CACHE_CRUD_TREE_ACTION);
};

DaLei.CacheUtil.getTempCache = function (cacheType) {
    if (DaLei.ObjUtil.isEmpty(window.TEMP_CACHE[cacheType.toUpperCase()])) {
        window.TEMP_CACHE[cacheType.toUpperCase()] = {};
    }
    return window.TEMP_CACHE[cacheType.toUpperCase()];
};

DaLei.CacheUtil.setPage = function (cacheType, key, value) {
    window.PAGE_CACHE[DaLei.CacheUtil.getTempCachePrefix(cacheType) + "_" + key] = value;
};

DaLei.CacheUtil.getPage = function (cacheType, key) {
    return window.PAGE_CACHE[DaLei.CacheUtil.getTempCachePrefix(cacheType) + "_" + key];
};

DaLei.CacheUtil.removePage = function (cacheType, key) {
    if(DaLei.CacheUtil.pageContainsKey(cacheType, key)) {
        window.PAGE_CACHE[DaLei.CacheUtil.getTempCachePrefix(cacheType) + "_" + key] = null;
        delete window.PAGE_CACHE[DaLei.CacheUtil.getTempCachePrefix(cacheType) + "_" + key];
    }
};

DaLei.CacheUtil.pageContainsKey = function (cacheType, key) {
    return window.PAGE_CACHE.hasOwnProperty(DaLei.CacheUtil.getTempCachePrefix(cacheType) + "_" + key);
};

//Message Utils
/**
 * 消息提示
 * @param message
 * @param fn
 */
DaLei.Msg.info = function (message, fn) {
    DaLei.Msg.alertMessage("success", "提示", message, fn);
}

/**
 * 消息警告
 * @param message
 * @param fn
 */
DaLei.Msg.warn = function (message, fn) {
    DaLei.Msg.alertMessage("warning", "警告", message, fn);
}

/**
 * 消息错误
 * @param message
 * @param fn
 */
DaLei.Msg.error = function (message, fn) {
    DaLei.Msg.alertMessage("error", "错误", message, fn);
}

/**
 * 确认框
 * @param title
 * @param message
 * @param callback 参数为：true,false
 */
DaLei.Msg.confirm = function (title, message, callback) {
    DaLeiMessage.confirm({type: "warning", title: title, message: message}).on(callback);
}

/**
 * 弹出提示消息
 * @param type 消息类型
 * @param title 消息标题
 * @param message 消息内容
 */
DaLei.Msg.alertMessage = function (type, title, message, fn) {
    DaLeiMessage.alert({type: type, title: title, message: message}).on(function (e) {
        fn && fn();
    });
};

//Debug  Utils
DaLei.DebugUtil.isProdMode = function () {
    return DaLei.getSysConfig('product_mode');
};

DaLei.DebugUtil.logInfo = function (info) {
    if (!DaLei.DebugUtil.isProdMode()) {
        if (document.all) {
        } else {
            if (DaLei.ObjUtil.isObject(info)) {
                if(window.console) {
                    console.dir(info);
                }
            } else {
                if(window.console) {
                    console.info(info);
                }
            }
        }
    }
};

DaLei.DebugUtil.logErr = function (errmsg) {
    if (!DaLei.DebugUtil.isProdMode()) {
        if (document.all) {
        } else {
            if(window.console) {
                console.error(errmsg);
            }
        }
        throw errmsg;
    }
};

DaLei.DebugUtil.ping = function (source, callback) {
    this.img = new Image();

    var start = new Date();

    var time = 0;

    this.img.onload = function () {
        pingCheck();
    };

    this.img.onerror = function () {
        pingCheck();
    };

    var pingCheck = function () {
        var pong = new Date() - start;
        time = pong;

        if (typeof callback === "function") {
            callback(pong);
        }
    };

    this.img.src = source + "favicon.ico?" + new Date().getTime();
};

DaLei.CryptUtil.getPassHash = function (pass, salt) {
    return DaLei.StrUtil.getSha1(DaLei.StrUtil.getSha1(pass) + DaLei.StrUtil.replaceNull(salt, DaLei.Const.ENCRYPT_SALT));
};

DaLei.CryptUtil.encryptPass = function (pass, callback) {
    if (DaLei.ObjUtil.isEmpty(pass)) {
        if (typeof callback == 'function') {
            callback(pass);
        }
        return;
    }
    var passHash = DaLei.CryptUtil.getPassHash(pass),
        serverKey = DaLei.RSA.ServerKey;
    if (!window.SYSCONFIG_RSA_DISABLED && DaLei.ObjUtil.isNotEmpty(serverKey) && serverKey.isEncrypt) {
        if ((Date.now() - serverKey.data.expire) > DaLei.Const.RSA_EXPIRE_THRESHOLD * 1000) {
            passHash = false;
            if (typeof callback == 'function') {
                callback(passHash);
            }
        } else {
            var pubkey = [
                asmCrypto.hex_to_bytes(serverKey.data.key),
                asmCrypto.hex_to_bytes(serverKey.data.e)
            ];
            DaLei.CryptUtil.encryptRSA(passHash, pubkey, function (encData) {
                passHash = serverKey.id + ':' + encData;
                if (typeof callback == 'function') {
                    callback(passHash);
                }
            });
        }
    } else {
        if (typeof callback == 'function') {
            callback(passHash);
        }
    }
};

DaLei.CryptUtil.getServerPublicKey = function (force) {
    if (window.SYSCONFIG_RSA_DISABLED) return;
    var serverKey = DaLei.RSA.ServerKey;
    if (force !== true && DaLei.ObjUtil.isNotEmpty(serverKey) &&
        Date.now() < (serverKey.data.expire - DaLei.Const.RSA_EXPIRE_THRESHOLD * 1000))//Need reload before expire
        return;
    DaLei.doAction("sys-encrypt-getkey", {}, function (retData) {
        serverKey = retData;
        if (serverKey.isEncrypt) {
            serverKey.data = DaLei.JSON.decode(window.atob(serverKey.data));
        }
        DaLei.RSA.ServerKey = serverKey;
    }, function () {
    }, false);
};

DaLei.CryptUtil.getClientPublicKey = function () {
    var publicKey = {
        kty: '',
        n: '',
        e: ''
    };
    if (DaLei.ObjUtil.isNotEmpty(DaLei.RSA.ClientKey)) {
        publicKey.kty = 'RSA';
        publicKey.n = DaLei.StrUtil.encodeab(DaLei.RSA.ClientKey[0]);
        publicKey.e = DaLei.StrUtil.encodeab(DaLei.RSA.ClientKey[1]);
    }
    return JSON.stringify(publicKey);
};

DaLei.CryptUtil.generateClientKeyPair = function (callback, force) {
    if (!window.SYSCONFIG_RSA_DISABLED) {
        var keyStr = DaLei.CacheUtil.get(DaLei.Const.LOGIN_RSA_STORE_KEY_CACHE);
        if (DaLei.ObjUtil.isEmpty(keyStr) || force === true) {//Need to generate new rsa key pair
            var saveRsa = function (data) {
                DaLei.RSA.ClientKey = data;
                DaLei.CacheUtil.set(DaLei.Const.LOGIN_RSA_STORE_KEY_CACHE, DaLei.CryptUtil.EncodeKey(DaLei.RSA.ClientKey));
            };

            if (window.msCrypto) {//Using Web Cryptography API when available
                var errorHandle = function (evt) {
                    DaLei.DebugUtil.logInfo("Some problems encountered during RSA key pair generation.")
                };
                var safebase64replace = function (src) {
                    return src.replace(/-/g, '+').replace(/_/g, '/');
                };

                var op = window.msCrypto.subtle.generateKey({
                    name: "RSA-OAEP",
                    modulusLength: window.SYSCONFIG_RSA_KEY_LEN,
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01])
                }, true, ["encrypt", "decrypt"]);
                op.onerror = errorHandle;
                op.oncomplete = function (evt) {
                    DaLei.DebugUtil.logInfo("RSA Key generate done.");
                    var expOp = window.msCrypto.subtle.exportKey('jwk', evt.target.result.privateKey);
                    expOp.onerror = errorHandle;
                    expOp.oncomplete = function (expEvt) {
                        var keyData = JSON.parse(DaLei.StrUtil.ab2str(expEvt.target.result));
                        saveRsa([
                            DaLei.StrUtil.decodeab(safebase64replace(keyData.n)),
                            DaLei.StrUtil.decodeab(safebase64replace(keyData.e)),
                            DaLei.StrUtil.decodeab(safebase64replace(keyData.d)),
                            DaLei.StrUtil.decodeab(safebase64replace(keyData.p)),
                            DaLei.StrUtil.decodeab(safebase64replace(keyData.q)),
                            DaLei.StrUtil.decodeab(safebase64replace(keyData.dp)),
                            DaLei.StrUtil.decodeab(safebase64replace(keyData.dq)),
                            DaLei.StrUtil.decodeab(safebase64replace(keyData.qi))
                        ]);
                        if (typeof callback == 'function') {
                            callback();
                        }
                    };
                };
                return;
            } else if (typeof(Worker) !== "undefined") {
                var worker = new Worker('framework/js/rsa_worker.js'),
                    seedArray = new Uint32Array(2048);
                worker.onmessage = function (event) {
                    saveRsa(event.data);
                    if (typeof callback == 'function') {
                        callback();
                    }
                };

                asmCrypto.getRandomValues(seedArray);
                worker.postMessage({seed: seedArray, keylen: window.SYSCONFIG_RSA_KEY_LEN});
                return;
            } else {
                DaLei.DebugUtil.logInfo("Current browser did not support Worker nor Web Cryptography API!");
                var timeStart = new Date();
                saveRsa(asmCrypto.RSA.generateKey(window.SYSCONFIG_RSA_KEY_LEN, 65537));
                DaLei.DebugUtil.logInfo("RSA KeyPair Generated. Time: " + (new Date() - timeStart));
            }
        } else {
            DaLei.RSA.ClientKey = DaLei.CryptUtil.DecodeKey(keyStr);
        }
    }
    if (typeof callback == 'function') {
        callback();
    }
};

DaLei.CryptUtil.encryptRSA = function (data, key, callback) {
    data = asmCrypto.string_to_bytes(data);
    var encData = DaLei.StrUtil.encodeab(asmCrypto.RSA_OAEP_SHA256.encrypt(data, key));
    if (typeof callback == 'function') {
        callback(encData);
    }
};

DaLei.CryptUtil.decryptRSA = function (data, key, callback) {
    var dataPlain = DaLei.StrUtil.ab2str(asmCrypto.RSA_OAEP_SHA256.decrypt(data, key));
    if (typeof callback == 'function') {
        callback(dataPlain);
    }
};

DaLei.CryptUtil.EncodeKey = function (data) {
    var dataEnc = '';
    data.forEach(function (item) {
        dataEnc += ',' + DaLei.StrUtil.encodeab(item);
    });
    return dataEnc.substr(1);
};

DaLei.CryptUtil.DecodeKey = function (data) {
    var dataOri = [];
    data.split(',').forEach(function (item) {
        dataOri.push(DaLei.StrUtil.decodeab(item));
    });
    return dataOri;
};

DaLei.CryptUtil.getTOTP = function (secret) {
    if (window.SYSCONFIG_OTP_DISABLED) return "-1";
    var dec2hex = function (s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };

    var hex2dec = function (s) {
        return parseInt(s, 16);
    };

    var leftpad = function (s, l, p) {
        if (l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    };

    var base32tohex = function (base32) {
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = "";
        var hex = "";
        for (var i = 0; i < base32.length; i++) {
            var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for (var i = 0; i + 4 <= bits.length; i += 4) {
            var chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16);
        }
        return hex;
    };

    var getOTP = function (secret) {
        try {
            var epoch = Math.round(new Date().getTime() / 1000.0);
            var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
            var hmac = DaLei.StrUtil.getHMACSHA1ByHex(time, base32tohex(secret));
            var offset = hex2dec(hmac.substring(hmac.length - 1));
            var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
        } catch (error) {
            throw error;
        }
        return otp;
    };
    return getOTP(secret);
};

DaLei.JSON = (new(function() {
    var me = this,
        encodingFunction,
        decodingFunction,
        useNative = null,
        useHasOwn = !! {}.hasOwnProperty,
        isNative = function() {
            if (useNative === null) {
                useNative = false && window.JSON && JSON.toString() == '[object JSON]';
            }
            return useNative;
        },
        pad = function(n) {
            return n < 10 ? "0" + n : n;
        },
        doDecode = function(json) {
            return eval("(" + json + ')');
        },
        doEncode = function(o, newline) {

            if (o === null || o === undefined) {
                return "null";
            } else if (o instanceof Date) {
                return DaLei.JSON.encodeDate(o);
            } else if (typeof o === 'string' ) {
                return DaLei.JSON.encodeString(o);
            } else if (typeof o === "number") {
                return isFinite(o) ? String(o) : "null";
            } else if (typeof o === "boolean") {
                return String(o);
            } else if (o.toJSON) {
                return o.toJSON();
            } else if ($.isArray(o)) {
                return encodeArray(o, newline);
            } else if ($.isPlainObject(o)) {
                return encodeObject(o, newline);
            } else if (typeof o === "function") {
                return "null";
            }
            return 'null';
        },
        m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"': '\\"',
            "\\": '\\\\',
            '\x0b': '\\u000b'
        },
        charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g,
        encodeString = function(s) {
            return '"' + s.replace(charToReplace, function(a) {
                    var c = m[a];
                    return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"';
        },


        encodeArray = function(o, newline) {

            var a = ["[", ""],
                len = o.length,
                i;
            for (i = 0; i < len; i += 1) {
                a.push(DaLei.JSON.encodeValue(o[i]), ',');
            }

            a[a.length - 1] = ']';
            return a.join("");
        },

        encodeObject = function(o, newline) {

            var a = ["{", ""],
                i, val;
            for (i in o) {
                val = o[i];
                if (!useHasOwn || o.hasOwnProperty(i)) {

                    if (typeof val === 'function' || val === undefined) {
                        continue;
                    }
                    a.push(DaLei.JSON.encodeValue(i), ":", DaLei.JSON.encodeValue(val), ',');

                }
            }

            a[a.length - 1] = '}';
            return a.join("");
        };


    me.encodeString = encodeString;


    me.encodeValue = doEncode;


    me.encodeDate = function(o) {
        return '"' + o.getFullYear() + "-"
            + pad(o.getMonth() + 1) + "-"
            + pad(o.getDate()) + "T"
            + pad(o.getHours()) + ":"
            + pad(o.getMinutes()) + ":"
            + pad(o.getSeconds()) + '"';
    };


    me.encode = function(o) {
        if (!encodingFunction) {

            encodingFunction = isNative() ? JSON.stringify : me.encodeValue;
        }
        return encodingFunction(o);
    };


    me.decode = function(json, safe) {
        if (!decodingFunction) {

            decodingFunction = isNative() ? JSON.parse : doDecode;
        }
        try {
            return decodingFunction(json);
        } catch (e) {
            if (safe === true) {
                return null;
            }
            DaLei.DebugUtil.logErr("You're trying to decode an invalid JSON String: " + json);
            //Ext.Error.raise({
            //    sourceClass: "Ext.JSON",
            //    sourceMethod: "decode",
            //    msg: "You're trying to decode an invalid JSON String: " + json
            //});
        }
    };
})());

/**
 * 公共ajax请求
 * @param data 请求参数
 * @returns {*}
 */
DaLei.Utils.ajax = function (data) {
    var retdata = {},
        success = data.successFn || function () {
            },
        failure = data.failureFn || function () {
            },
        param = {
            actionName: data.action,
            limit: data.postdata.limit,
            start: data.postdata.start,
            postData: DaLei.JSON.encode(data.postdata || {})
        },
        mask = data.mask;
    var async = data.async;
    DaLei.ObjUtil.isEmpty(async) && (async = true);
    mask = (mask == 'false' || mask == false) ? null : mask;
    DaLei.ObjUtil.isNotEmpty(mask) && DaLei.mask(mask);
    if(!data.dataType) {
        data.dataType = "json";
    }

    $.ajax({
        //提交数据的类型 POST GET
        type:"POST",
        //提交的网址
        url:data.url,
        //提交的数据
        data:param,
        //返回数据的格式
        dataType: data.dataType,//"xml", "html", "script", "json", "jsonp", "text".
        async:async,
        //在请求之前调用的函数
        beforeSend:function(){},
        //成功返回之后调用的函数
        success:function(ret){
            retdata = ret;
            if(data.dataType == 'html' && typeof retdata == 'string' && (retdata.indexOf('bizexception') != -1 ||retdata.indexOf('sysexception') != -1)) {
                retdata = DaLei.JSON.decode(ret);
            }
            DaLei.ObjUtil.isNotEmpty(retdata.message) && DaLei.Msg.info(retdata.message);
            var biz = retdata.bizexception;
            var sys = retdata.sysexception;
            var errorCode = retdata.errorcode;
            if(biz) {
                DaLei.Msg.warn(DaLei.StrUtil.htmlEncode(biz).replace("\\n", "\x3cbr/\x3e").replace("\n", "\x3cbr/\x3e"),
                    function () {
                        if("3" === errorCode.substr(0, 1)) {
                            window.location.replace(DaLei.getRedirectPath("base_path"));
                            DaLei.CacheUtil.removeAllTemp();
                            window.sessionStorage.clear();
                        }
                    });
                this.complete();
                failure(retdata);
            } else if(sys) {
                errorCode = retdata.stack;
                DaLei.Msg.error(sys + "\x3cbr/\x3e\x3cbr/\x3e[Error Code:" + errorCode + "]");
                this.complete();
                failure(retdata);
            } else {
                success(retdata);
            }
            if(retdata.loginTimeout) {
                DaLei.Utils.setUserOutTime(retdata.loginTimeout);
            }
        },
        //调用执行后调用的函数
        complete: function(XMLHttpRequest, textStatus){
            DaLei.ObjUtil.isNotEmpty(mask) && DaLei.unmask();
        },
        //调用出错执行的函数
        error: function(){
            //请求出错处理
            DaLei.Msg.error(DaLei.I18N.CONNECT_ERROR);
            DaLei.ObjUtil.isNotEmpty(mask) && DaLei.unmask();
            failure();
        }
    });
    if (false == async){
        return retdata
    }
};

DaLei.Utils.getRequestParam = function() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
};
DaLei.Utils.formatNumber = function(num, precision, separator) {
    var parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
        // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
        // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
        // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
        // 的值变成了 12312312.123456713
        num = Number(num);
        // 处理小数点位数
        num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
        // 分离数字的小数部分和整数部分
        parts = num.split('.');
        // 整数部分加[separator]分隔, 借用一个著名的正则表达式
        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

        return parts.join('.');
    }
    return NaN;
};

/**
 *  @author luoxiaojian(qinchengshiyu@foxmail.com)
 * 设置超时对象的递归函数
 * @param frame
 * @param time
 */
DaLei.Utils.setUserOutTime = function (time, win) {
    if(!win) {
        win = window.top;
    }
    win.LOGIN_TIMEOUT = time;
    if(win.frames && win.frames.length >0) {
        for(var i = 0; i<win.frames.length; i++) {
            var subwin = win.frames[i];
            subwin.LOGIN_TIMEOUT = time;
            if(subwin.frames && subwin.frames.length > 0) {
                DaLei.Utils.setUserOutTime(time, subwin);
            }
        }
    }
};

DaLei.TreeUtil.mappingData = function (data, options) {
    var me = this;
    var filed = DaLei.StrUtil.replaceNull(options.valueField, "id");
    var text = DaLei.StrUtil.replaceNull(options.textField, "text");

    var collapseAll = options.collapseAll;
    if($.isArray(data)) {
        $.each(data, function(i, row) {
            if(filed) {
                row.id = row[filed];
            }
            if(text) {
                row.text = row[text];
            }

            if(row.children) {
                if(row.expanded ===true && row.children.length>0) {
                    row.state = "open"
                } else if(row.expanded ===false && row.children.length>0) {
                    row.state = "closed"
                }
                if(collapseAll && row.children.length>0) {
                    row.state = "closed"
                }
                DaLei.TreeUtil.mappingData(row.children, options);
            }
        });
    } else {
        if(filed) {
            data.id = data[filed];
        }
        if(text) {
            data.text = data[text];
        }
        if(data.children) {
            if(data.expanded ===true && data.children.length>0) {
                data.state = "open"
            } else if(data.expanded ===false && data.children.length>0) {
                data.state = "closed"
            }
            if(collapseAll && data.children.length>0) {
                data.state = "closed"
            }
            DaLei.TreeUtil.mappingData(data.children, options);
        }
    }
};
DaLei.TreeUtil.findRecord = function (treeData, key, value) {
    var me = this;
    var data = treeData;
    if($.isArray(data)) {
        var ret = null;
        $.each(data, function(i, row) {
            if(row[key] && row[key] == value) {
                ret = row;
                return;
            } else if (row.children) {
                var childret = DaLei.TreeUtil.findRecord(row.children, key, value);
                if(childret) {
                    ret = childret;
                    return;
                }
            }
        });
        return ret;
    } else {
        if(data[key] && data[key] == value) {
            return data;
        } else if (data.children) {
            return DaLei.TreeUtil.findRecord(data.children, key, value);
        } else {
            return null;
        }
    }
};

DaLei.TreeUtil.eachChild = function(rootNode, callBackfn, childKey) {
    var key = "children";
    if(childKey) {
        key = childKey;
    }
    if(DaLei.ObjUtil.isEmpty(rootNode) || callBackfn == null) {
        return;
    }
    callBackfn.apply(this,[rootNode]);
    if(rootNode[key] != null) {
        $.each(rootNode[key], function(i, childNode) {
            DaLei.TreeUtil.eachChild(childNode, callBackfn, childKey);
        });
    }
};
DaLei.getActiveModule = function() {
    return DaLei.CacheUtil.getTemp(DaLei.Const.CACHE_ACTIVE_MODULE, DaLei.Const.CACHE_ACTIVE_MODULE_KEY);
}
