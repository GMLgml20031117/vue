import axios from "axios";

/**
 * 图表信息管理
 **/
// 获取前5的商品库存值
export const prodInventory = () => { return axios.get("/api/statistics/inventory/"  + "?token=" + localStorage.getItem('logintoken')) };

//获取出库量前5的
export const prodInventorySale = () => { return axios.get("/api/statistics/sales/"  + "?token=" + localStorage.getItem('logintoken')) };

//入库数量展示
export const prodInventoryIn = () => { return axios.get("/api/statistics/add/"  + "?token=" + localStorage.getItem('logintoken')) };

//出库数量展示

export const prodInventoryRemove = () => { return axios.get("/api/statistics/remove/"  + "?token=" + localStorage.getItem('logintoken')) };
