/**
 * 公用方法封装
 */
import i18n from './lang/i18n'

export const common = {
    uploadUrl: '',
    langList: [{
        tag: 'zh_CN',
        name: i18n.t('i18n.中文'),
        iconName: 'zhongguo'
    },{
        tag: 'en_US',
        name: i18n.t('i18n.英文'),
        iconName: 'meiguo'
    }],
    osTypeList: [{
        id: 1,
        name: 'Windows',
        icon: 'windows'
    },{
        id: 2,
        name: 'Linux/Unix',
        icon: 'linux'
    }],
    statusList: [{
        id: 1,
        name: i18n.t('i18n.正常'),
        css: 'success'
    },{
        id: 2,
        name: i18n.t('i18n.禁用'),
        css: 'info'
    },{
        id: 3,
        name: i18n.t('i18n.临时锁定'),
        css: 'warning'
    }],
    connectedModalList: [{
        id: 1,
        name: i18n.t('i18n.直接连接')
    },{
        id: 2,
        name: i18n.t('i18n.端口映射')
    }],
    initPageNation () {
        return {
            pageNation: {
                pageNo: 1,
                pageSize: 10,
                totalItem: 0,
                pageList: [10, 20, 50, 100]
            }
        }
    }
};
