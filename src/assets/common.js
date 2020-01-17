/**
 * 公用方法封装
 */
import i18n from './lang/i18n'
import { Notification } from 'element-ui';

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
    protocolTypeList: [{
        id: 1,
        name: 'RDP',
        icon: 'rdp',
        port: 3389
    },{
        id: 2,
        name: 'SSH',
        icon: 'ssh',
        port: 22
    },{
        id: 3,
        name: 'TELNET',
        icon: 'telnet',
        port: 23
    }],
    authTypeList: [{
        id: 0,
        name: i18n.t('i18n.无需认证')
    },{
        id: 1,
        name: i18n.t('i18n.用户名/密码')
    },{
        id: 2,
        name: i18n.t('i18n.SSH私钥')
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
    statusFilterList: [{
        text: i18n.t('i18n.正常'),
        value: 1
    },{
        text: i18n.t('i18n.禁用'),
        value: 2
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
            pageNo: 1,
            pageSize: 10,
            totalItem: 0,
            pageList: [10, 20, 50, 100]
        }
    },
    notification(status, msg, time) {
        Notification({
            type: status,
            message: msg,
            duration: time ? time : 5000
        });
    },
};
