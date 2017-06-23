DaLei.define("MaterialClass.controller.MaterialClassController", {
    extend: 'DaLei.bootstrap.mvc.AbstractCrudController',
    viewClass: 'MaterialClass.view.MaterialClassView',
    extraEvents: [
        {itemId: 'ciimpMaterialClassDto->classLevel', name: 'change', fn: 'doChangeClassLevel'}
    ],
    dtoClass: 'com.csnt.DaLei.bizmodules.modules.management.materialclass.dto.CiimpMaterialClassDto',
    queryAction: 'materialclass-list-query',
    loadPageAction: 'common-loadpage',
    loadAction: 'materialclass-load',
    addAction: 'materialclass-add',
    modifyAction: 'materialclass-modify',
    deleteAction: 'materialclass-delete',
    exportXlsAction: "materialclass-exportxls",
    pagePath:'/materialclass/materialclass',
    initCtr: function () {
        var me = this;
        debugger

    },
    doChangeClassLevel: function () {
        var me = this;

    },
    beforeAdd: function () {
        var me = this;
        return true;
    },
    afterAdd: function () {
        var me = this;
    },
    beforeCopyAdd: function () {
        var me = this;
        return true;
    },
    afterCopyAdd: function () {
        var me = this;
    },
    beforeModify: function () {
        var me = this;
        return true;
    },
    afterModify: function () {
        var me = this;
        var filterClassLevel = 0;
        var classLevel = me.view.getCmp("ciimpMaterialClassDto->classLevel").gotValue();
        if (DaLei.ObjUtil.isNotEmpty(classLevel)) {
            if ("1" == classLevel) {
                me.view.getCmp("ciimpMaterialClassDto->parentUuid").sotDisable();
            } else {
                me.view.getCmp("ciimpMaterialClassDto->parentUuid").sotEnable();
                if ("2" == classLevel) {
                    filterClassLevel = "1";
                } else if ("3" == classLevel) {
                    filterClassLevel = "2";
                }
            }
        }

        me.view.getCmp("ciimpMaterialClassDto->filterClassLevel").sotValue(filterClassLevel);
    },
    beforeSave: function () {
        var me = this;
        return true;
    },
    afterSave: function (retData) {
        var me = this;
    },
    beforeLoadItem: function () {
        var me = this;
        return true;
    },
    afterLoadItem: function (data) {
        var me = this;
        me.view.getCmp("ciimpMaterialClassDto->parentUuid").sotDisable();
    },
    beforeCancel: function () {
        var me = this;
        return true;
    },
    afterCancel: function () {
        var me = this;
    },
    beforeDelete: function () {
        var me = this;
        return true;
    },
    afterDelete: function () {
        var me = this;
    },
    beforeBatchDel: function () {
        var me = this;
        return true;
    },
    afterBatchDel: function () {
        var me = this;
    },
    beforeExport: function () {
        var me = this;
        return true;
    },
    afterExport: function () {
        var me = this;
    }
});
