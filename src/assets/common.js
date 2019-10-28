/**
 * 公用方法封装
 */
export const common = {
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
