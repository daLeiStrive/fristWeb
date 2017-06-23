/**
 * Description: 注册命名空间.
 * Copyright: © 2017 CSNT. All rights reserved.
 *
 * @author dudalei
 * @version 1.0
 * @timestamp 2017/6/23 9:13
 */
var Namespace = new Object();

Namespace.register = function(path){
    var arr = path.split(".");
    var ns = "";
    for(var i=0;i<arr.length;i++){
        if(i>0) ns += ".";
        ns += arr[i];
        eval("if(typeof(" + ns + ") == 'undefined') " + ns + " = new Object();");
    }
}
Namespace.register("DaLei");
Namespace.register("DaLei.Const");
Namespace.register("DaLei.ObjUtil");
Namespace.register("DaLei.MathUtil");
Namespace.register("DaLei.DateUtil");
Namespace.register("DaLei.CookieUtil");
Namespace.register("DaLei.CacheUtil");
Namespace.register("DaLei.CommUtil");
Namespace.register("DaLei.DebugUtil");
Namespace.register("DaLei.CryptUtil");
Namespace.register("DaLei.StrUtil");
Namespace.register("DaLei.ArrayUtil");
Namespace.register("DaLei.I18N");
Namespace.register("DaLei.Utils");
Namespace.register("DaLei.Msg");
Namespace.register("DaLei.WorkFlow");
Namespace.register("DaLei.RSA");
Namespace.register("DaLei.RSA.ServerKey");
Namespace.register("DaLei.RSA.ClientKey");
Namespace.register("DaLei.MsgUtil");
Namespace.register("DaLei.TreeUtil");

DaLei.Const.PACKAGE_VERSION = 1;
DaLei.Const.SHORT_DATE_FORMAT = 1;
DaLei.Const.LONG_DATE_FORMAT = 2;
DaLei.Const.BUSINESS_DATE_FORMAT = 3;
//
DaLei.Const.AJAX_TIMEOUT = 300000;
//
DaLei.Const.MSGBOX_DEFAULT_WIDTH = 350;
DaLei.Const.MSGBOX_DEFAULT_HEIGHT = 150;
//
DaLei.Const.FORM_FIELD_LABEL_DEFAULT_WIDTH = 100;
DaLei.Const.FORM_FIELD_LABEL_ALIGN = 'left';
//
DaLei.Const.JDEC_DEFAULT_DECIMAL_LENGTH = 2;
//
DaLei.Const.IFIELD_READONLY_STYLE = false;
//
DaLei.Const.CONTENT_PANEL_MIN_WIDTH = 880;
DaLei.Const.CONTENT_PANEL_MIN_HEIGHT = 530;
//
DaLei.Const.IFIELD_READONLY_STYLE = false;
//
DaLei.Const.CACHE_TYPE_COMBO_STORE = 'CACHE_TYPE_COMBO_STORE';
DaLei.Const.CACHE_TYPE_INFO_LAYOUT = 'CACHE_TYPE_INFO_LAYOUT';
DaLei.Const.CACHE_TYPE_SYS_MENU = 'CACHE_TYPE_SYS_MENU';
DaLei.Const.CACHE_CODEGENE_TABLES = 'CACHE_CODEGENE_TABLES';
DaLei.Const.CACHE_CRUD_TREE_ACTION = 'CACHE_CRUD_TREE_ACTION';
DaLei.Const.CACHE_JQGRID_COLUMN_DEF = 'CACHE_JQGRID_COLUMN_DEF';
DaLei.Const.CACHE_MODULE_VIEW_HISTORY = 'CACHE_MODULE_VIEW_HISTORY';
DaLei.Const.CACHE_MODULE_TAB = 'CACHE_MODULE_TAB';
DaLei.Const.CACHE_ACTIVE_MODULE = 'CACHE_ACTIVE_MODULE';
DaLei.Const.CACHE_ACTIVE_MODULE_KEY = 'ACTIVE_MODULE';

DaLei.Const.JSON_ACTION = 'controller/json.action';
DaLei.Const.POST_ACTION = 'controller/post.action';
DaLei.Const.FREEMARKER_LOAD_PAGE = 'controller/loadpage.action';
DaLei.Const.COMMON_LOADPAGE = 'common-loadpage';

DaLei.Const.LANGUAGE_ID_STORE_DATA = [
    {code: 'en_US', codedesc: 'English'},
    {code: 'zh_CN', codedesc: '中文'}
];

DaLei.Const.SYSTEM_LANGUAGE_ID = 'SYSTEM_LANGUAGE_ID';
DaLei.Const.MAXIMUM_MAINFRAME = 'MAXIMUM_MAINFRAME';
DaLei.Const.LOGIN_TIME_MILLIS = 'LOGIN_TIME_MILLIS';

DaLei.Const.USER_ID = 'userId';
DaLei.Const.USER_UUID = 'userUuid';
DaLei.Const.USER_NAME = 'userName';
DaLei.Const.USER_NEED_MODIFY_PASS = 'userNeedModifyPass';
DaLei.Const.USER_LOCALE_ID = 'localeId';
DaLei.Const.USER_COMPANY_UUID = 'companyUuid';
DaLei.Const.USER_COMPANY_CODE = 'companyCode';
DaLei.Const.USER_COMPANY_NAME = 'companyName';
DaLei.Const.USER_DEPARTMENT_UUID = 'departmentUuid';
DaLei.Const.USER_DEPARTMENT_CODE = 'departmentCode';
DaLei.Const.USER_DEPARTMENT_NAME = 'departmentName';
DaLei.Const.USER_COUNTRY_CODE = 'countryCode';
DaLei.Const.USER_CITY_CODE = 'cityCode';
DaLei.Const.USER_CURRENCY_CODE = 'currencyCode';
DaLei.Const.USER_WEEK_START = 'weekStart';
DaLei.Const.USER_DECIMAL_SEPARATOR = 'decimalSeparator';
DaLei.Const.USER_THOUSAND_SEPARATOR = 'thousandSeparator';

DaLei.Const.USER_PRIVILEGES = 'userPrivileges';
DaLei.Const.USER_TOKEN = 'userToken';

DaLei.Const.USER_SYSTEM_TITLE = 'systemTitle';
DaLei.Const.USER_SYSTEM_LOGO = 'systemLogo';
DaLei.Const.USER_ISADMIN = 'isAdmin';
DaLei.Const.USER_EXPAND = 'userExpand';
DaLei.Const.USER_DATA_ARRAY = [
    DaLei.Const.USER_ID,
    DaLei.Const.USER_UUID,
    DaLei.Const.USER_NAME,
    DaLei.Const.USER_NEED_MODIFY_PASS,
    DaLei.Const.USER_TOKEN,
    DaLei.Const.USER_COMPANY_UUID,
    DaLei.Const.USER_COMPANY_CODE,
    DaLei.Const.USER_COMPANY_NAME,
    DaLei.Const.USER_DEPARTMENT_UUID,
    DaLei.Const.USER_DEPARTMENT_CODE,
    DaLei.Const.USER_DEPARTMENT_NAME,
    DaLei.Const.USER_PRIVILEGES,
    DaLei.Const.USER_COUNTRY_CODE,
    DaLei.Const.USER_CITY_CODE,
    DaLei.Const.USER_CURRENCY_CODE,
    DaLei.Const.USER_WEEK_START,
    DaLei.Const.USER_DECIMAL_SEPARATOR,
    DaLei.Const.USER_THOUSAND_SEPARATOR,
    DaLei.Const.USER_ISADMIN,
    DaLei.Const.USER_EXPAND
];
DaLei.Const.USER_INFO_KEYS =DaLei.Const.USER_DATA_ARRAY.concat([
    DaLei.Const.CACHE_TYPE_SYS_MENU,
    DaLei.Const.USER_SYSTEM_TITLE,
    DaLei.Const.USER_SYSTEM_LOGO
]);

DaLei.Const.VERIFY_TYPE_MOBILE = 'mobile';
DaLei.Const.VERIFY_TYPE_MAIL = 'mail';


/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/
/*-------------------------------------------------------------------*/

//
DaLei.Const.QUERY_CONDITION_HISTORY_CACHE_SIZE = 10;
//
DaLei.Const.MAX_ALLOWED_OPEN_MODULES = 10;

//
DaLei.Const.UI_INFO_STATUS_NEW = 'NEW';
DaLei.Const.UI_INFO_STATUS_MODIFY = 'MODIFY';
DaLei.Const.UI_INFO_STATUS_VIEW = 'VIEW';
DaLei.Const.UI_INFO_STATUS_NULL = 'NULL';
//
DaLei.Const.EVERY_PAGE_RECORDS = 'EVERY_PAGE_RECORDS';


DaLei.Const.GRID_EVERY_PAGE_SHOW_RECORDS_DEFAULT = 20;
DaLei.Const.COMMON_QUERY_IGNORECASE_DEFAULT = false;
DaLei.Const.COMMON_QUERY_MULTISORT_DEFAULT = false;
DaLei.Const.COMMON_QUERY_LOCAL_SORT_DEFAULT = true;

DaLei.Const.LOGIN_COMPANY_CACHE = 'LOGIN_COMPANY_CACHE';
DaLei.Const.LOGIN_USER_CACHE = 'LOGIN_USER_CACHE';
DaLei.Const.LOGIN_PASSWORD_CACHE = 'LOGIN_PASSWORD_CACHE';
DaLei.Const.LOGIN_COMPANY_CACHE_CHECK = 'LOGIN_COMPANY_CACHE_CHECK';
DaLei.Const.LOGIN_USER_CACHE_CHECK = 'LOGIN_USER_CACHE_CHECK';
DaLei.Const.LOGIN_PASSWORD_CACHE_CHECK = 'LOGIN_PASSWORD_CACHE_CHECK';
DaLei.Const.LOGIN_RSA_STORE_KEY_CACHE = 'LOGIN_RSA_KEY_PAIR_CACHE';
DaLei.Const.FUZZY_QUERY_TERM_CACHE = 'FUZZY_QUERY_TERM_CACHE';
DaLei.Const.COMMON_QUERY_IGNORE_CASE_CACHE = 'COMMON_QUERY_IGNORE_CASE_CACHE';
DaLei.Const.COMMON_QUERY_MULTI_SORT_CACHE = 'COMMON_QUERY_MULTI_SORT_CACHE';
DaLei.Const.COMMON_QUERY_PAGE_SIZE_CACHE = 'COMMON_QUERY_PAGE_SIZE_CACHE';
DaLei.Const.COMMON_QUERY_RESULT_COLUMN_CACHE = 'COMMON_QUERY_RESULT_COLUMN_CACHE';
DaLei.Const.COMMON_QUERY_RESULT_COLUMN_DEFAULT_SORT_CACHE = 'COMMON_QUERY_RESULT_COLUMN_DEFAULT_SORT_CACHE';
DaLei.Const.COMMON_QUERY_EXCEL_EXPORT_CACHE = 'COMMON_QUERY_EXCEL_EXPORT_CACHE';
DaLei.Const.COMMON_QUERY_PAGE_DESIGN_CLASS_NAME_CACHE = 'COMMON_QUERY_PAGE_DESIGN_CLASS_NAME_CACHE';
DaLei.Const.COMMON_MAINFRAME_ACCORDING_DEFAULT_CACHE = 'COMMON_MAINFRAME_ACCORDING_DEFAULT_CACHE';
DaLei.Const.NAVIGATION_BAR_DEFAULT_WIDTH_CACHE = 'NAVIGATION_BAR_DEFAULT_WIDTH_CACHE';
DaLei.Const.BUILD_ID_CACHE = 'BUILD_ID_CACHE';
DaLei.Const.NAVIGATION_BAR_DEFAULT_COLLAPSE = false;
DaLei.Const.EDIT_PANEL_DEFAUL_HEIGHT = 'EDIT_PANEL_DEFAUL_HEIGHT';

DaLei.Const.THEME_SKIN_COLOR_COOKIE = 'THEME_SKIN_COLOR_COOKIE';
//Javascript data type
DaLei.Const.DATA_TYPE_UNDEFINED = 'undefined';
DaLei.Const.DATA_TYPE_NUMBER = 'number';
DaLei.Const.DATA_TYPE_STRING = 'string';
DaLei.Const.DATA_TYPE_BOOLEAN = 'boolean';
DaLei.Const.DATA_TYPE_OBJECT = 'object';
DaLei.Const.DATA_TYPE_FUNCTION = 'function';

//Form Component Name
DaLei.Const.COMPONENT_JTEXT = 'JText';
DaLei.Const.COMPONENT_JAUTOTEXT = 'JAutoText';
DaLei.Const.COMPONENT_JTEXTAREA = 'JTextArea';
DaLei.Const.COMPONENT_JINT = 'JInt';
DaLei.Const.COMPONENT_JDEC = 'JDec';
DaLei.Const.COMPONENT_JCUR = 'JCur';
DaLei.Const.COMPONENT_JCHECK = 'JCheck';
DaLei.Const.COMPONENT_JDATE = 'JDate';
DaLei.Const.COMPONENT_JDATETIME = 'JDatetime';
DaLei.Const.COMPONENT_JTIME = 'JTime';
DaLei.Const.COMPONENT_JHIDDEN = 'JHidden';
DaLei.Const.COMPONENT_JDISPLAY = 'JDisplay';
DaLei.Const.COMPONENT_JHTML = 'JHtml';
DaLei.Const.COMPONENT_JIMG = 'JImg';
DaLei.Const.COMPONENT_JFILE = 'JFile';
DaLei.Const.COMPONENT_JTRIGGER = 'JTrigger';
DaLei.Const.COMPONENT_JCombo = 'JCombo';
DaLei.Const.COMPONENT_JCHECKGROUP = 'JCheckGroup';
DaLei.Const.COMPONENT_JRADIOGROUP = 'JRadioGroup';
DaLei.Const.QUERY_CONDITION_OPTBTN_WIDTH = 32;
DaLei.Const.QUERY_CONDITION_DEFAULT_OPT = '^';
DaLei.Const.QUERY_CONDITION_FORCE_ENABLE = false;
DaLei.Const.QUERY_CONDITION_OPERATORS = [
    {code: '~', text: DaLei.I18N.QC_OPERATOR_INCLUDE},
    {code: '!~', text: DaLei.I18N.QC_OPERATOR_NOT_INCLUDE},
    {code: '=', text: DaLei.I18N.QC_OPERATOR_EQUAL},
    {code: '!=', text: DaLei.I18N.QC_OPERATOR_NOT_EQUAL},
    {code: '^', text: DaLei.I18N.QC_OPERATOR_STARTSWITH},
    {code: '!^', text: DaLei.I18N.QC_OPERATOR_NOT_STARTSWITH},
    {code: '$', text: DaLei.I18N.QC_OPERATOR_ENDSWITH},
    {code: '!$', text: DaLei.I18N.QC_OPERATOR_NOT_ENDSWITH}
];
DaLei.Const.QC_OPT_IGNORE_XTYPES = ['JFromTo', 'JBolCombo', 'JCheck'];

DaLei.Const.COMPONENT_JBUTTON = 'JButton';
//container
DaLei.Const.CONTAINER_JPANEL = 'JPanel';
DaLei.Const.CONTAINER_JFIELDSET = 'JFieldSet';
DaLei.Const.CONTAINER_JFORM = 'JForm';
DaLei.Const.CONTAINER_JTAB = 'JTab';
DaLei.Const.CONTAINER_JMENU = 'JMenu';
DaLei.Const.CONTAINER_JTREE = 'JTree';

DaLei.Const.REPORT_PRINT_ACTION = 'REPORT_PRINT';

DaLei.Const.DEFAULT_CRUD_FUNCTION = [
    {funcCid: 'queryPanel->queryBtn', funcCode: '', funcDesc: 'Search'},
    {funcCid: 'queryPanel->addNew1Btn', funcCode: '', funcDesc: 'Add New'},
    {funcCid: 'editPanel->addNew2Btn', funcCode: '', funcDesc: 'Add New'},
    {funcCid: 'editPanel->copyAddBtn', funcCode: '', funcDesc: 'Copy Add'},
    {funcCid: 'editPanel->modifyBtn', funcCode: '', funcDesc: 'Modify'},
    {funcCid: 'editPanel->deleteBtn', funcCode: '', funcDesc: 'Delete'},
    {funcCid: 'queryPanel->batchDelBtn', funcCode: '', funcDesc: 'Batch Delete'},
    {funcCid: 'queryPanel->exportBtn', funcCode: '', funcDesc: 'Export XLS'}
];

DaLei.Const.ENCRYPT_SALT = 'sMarT cLOud dEveLoPmEnT plAtForM';
DaLei.Const.RSA_EXPIRE_THRESHOLD = 5;

DaLei.Const.LOGIN_HIS_MARK_AB = 'LOGIN_HIS_MARK_AB';
DaLei.Const.USING_UTC = 'USING_UTC';

DaLei.Const.LOGIN_TIMEOUT_NOTIFY_TIME = 5;

DaLei.Const.QUERY_TOOLBAR_EXTBTN_LEFT_ALIGN = false;

DaLei.Const.TOTP = 'GSNT44D7Q2O72EC6';

DaLei.Const.RESTRICT_SYSADMIN = true;

DaLei.Const.LOGO_URL = 'framework/images/product/cs_logo.png';
DaLei.Const.LOGO_URL_2 = 'framework/images/mainframe/sy_logo.png';

//DaLei.MainFrameEvents = new Ext.util.Observable();
//DaLei.MainFrameEvents.addEvents('ready', 'beforeModuleOpen', 'afterLogin');

DaLei.Const.REPORT_FORM_ID_CTL_CID = 'formId';
DaLei.Const.REPORT_FORM_ATTACH_CTL_CID = 'formAttach';
DaLei.Const.REPORT_DEFAULT_PRINT_METHOD = 'pdf';
DaLei.Const.REPORT_DEFAULT_PRINT_INTERVAL = 2000;
DaLei.Const.REPORT_MAX_PREVIEW_CONCURRENT = 5;
DaLei.Const.REPORT_DEFAULT_EMAIL_FORMAT = 'PDF';
DaLei.Const.CACHE_TYPE_SCHEME = 'CACHE_TYPE_SCHEME';
DaLei.Const.SCHEME_DEFAULT_VALUE = '*';
DaLei.Const.SCHEME_DEFAULT_SUBTYPE = '*';
DaLei.Const.AUTO_RESIZE_QUERY_GRID_COLUMN = false;
DaLei.Const.AUTO_RESIZE_GRID_COLUMN = false;
DaLei.Const.AUTO_RESIZE_JGRIDFIELD_COLUMN = true;
DaLei.Const.FORM_GRID_FIELD_QUERY_DELAY = 500;


DaLei.Const.ROLE_USER_DATA_FILTER_PREFIX = 'DaLei_ROLE_DATA_FILTER_USER_';
DaLei.Const.HIDE_BATCH_DEL_BTN_IN_QUERY_PANEL = false;

DaLei.Const.NETWORK_DELAY_THRESHOLD_GOOD = 150;
DaLei.Const.NETWORK_DELAY_THRESHOLD_NORMAL = 300;

DaLei.Const.DECIMAL_SEPARATOR_PLACEHOLDER = '&|';
DaLei.Const.THOUSAND_SEPARATOR_PLACEHOLDER = '&+';
DaLei.Const.MAINPAGE_MENU_CODE = "M_DaLei_MAINPAGE";
DaLei.Const.ABSTRACT_CRUD_VIEW_1_EDITTOOLBAR_DOCKWAY = "bottom";
DaLei.Const.ABSTRACT_CRUD_VIEW_2_EDITTOOLBAR_DOCKWAY = "top";
DaLei.Const.ABSTRACT_CRUD_VIEW_3_EDITTOOLBAR_DOCKWAY = "top";

DaLei.Const.MENU_TYPE_CTL = "MENU_ITEM_CTL";
DaLei.Const.MENU_TYPE_URL = "MENU_ITEM_URL";
DaLei.Const.MENU_TYPE_DIR = "MENU_DIR";

DaLei.Const.COMMON_QUERY_ACTION = "biz-common-query"; //公共查询actionName
DaLei.Const.COMMON_ORG_TREE_ACTION = "biz-common-org-tree"; //公共所有组织机构树actionName
DaLei.Const.COMMON_OWNER_TREE_ACTION = "biz-common-owner-tree"; //公共路公司组织机构树actionName
DaLei.Const.COMMON_OWNER_LEVEL_TREE_ACTION = "biz-common-owner-level-tree"; //指定等级的公共路公司组织机构树actionName
DaLei.Const.COMMON_REPAIR_TREE_ACTION = "biz-common-repair-tree"; //公共维护单位组织机构树actionName
DaLei.Const.COMMON_MANAGE_ROAD_ACTION = "biz-common-manage-road-tree"; //指定等级的公共清分前路段组织机构树actionName
DaLei.Const.COMMON_MANAGE_ROAD_COMBOBOX_ACTION = "biz-common-manage-road-list"; //指定等级的公共清分前路段组织机构列表actionName

DaLei.Const.COMMON_MENU_QUERY_ACTION = "biz-common-menu-query"; //菜单查询actionName
DaLei.Const.WORKFLOW_QUERY_COMMENT_ACTION = "workflow-query-comment-action"; //工作流操作记录查询actionName
DaLei.Const.WORKFLOW_CANCEL_ACTION = "workflow-baseaction-cancel";          //工作流撤销actionName
DaLei.Const.WORKFLOW_LOADUSER_ACTION = "workflow-baseaction-loaduser";    //工作流加载用户actionName
DaLei.Const.WORKFLOW_REFRESH_ACTION = "workflow-baseaction-refresh";    //工作流刷新actionName
DaLei.Const.WORKFLOW_REJECT_ACTION = "workflow-baseaction-reject";    //工作流驳回actionName
DaLei.Const.WORKFLOW_SUBMIT_ACTION = "workflow-baseaction-submit";    //工作流提交actionName

DaLei.Const.dataGridHeight = 550;
DaLei.Const.dataGridPageSize = 15;
DaLei.Const.dataGridPageList = [10, 15, 20, 30, 40, 50];
DaLei.Const.EXPORT_EXCEL_FILE_NAME_PATTEN = '{module}';

DaLei.Const.ORG_TYPE_MATRIX = {
    'R': ['R', 'C'],
    'C': ['R', 'C'],
    'D': ['C', 'D', 'O'],
    'O': ['C', 'O'],
    'V': ['R', 'C', 'D', 'O']
};
DaLei.Const.ACTION_TYPE ={
    'MODIFY':0,
    'ADD':1,
    'ADD_MODIFY':2,
    'NULL':-1
}

