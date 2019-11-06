/**
 * 公用方法封装
 */
export const common = {
    statusList: [{
        id: 1,
        name: '正常',
        css: 'success'
    },{
        id: 2,
        name: '禁用',
        css: 'info'
    },{
        id: 3,
        name: '临时锁定',
        css: 'warning'
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
