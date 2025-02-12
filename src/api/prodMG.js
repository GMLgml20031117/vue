import axios from 'axios';
import { req } from './axiosFun';

/**
 * 商品库存管理
 **/
// 商品库存管理-获取商品库存管理列表
export const prodList = (params) => { return req("post", "/api/Prod/list", params) };
// 商品库存管理-保存（添加编辑）
export const prodSave = (params) => { return req("post", "/api/Prod/save", params) };
// 商品库存管理-删除
export const prodDelete = (params) => { return axios.delete("/api/Prod/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 上传excel
export const prodUpload = (params) => { return req("post", "/api/Prod/upload", params) };
//下载excel
export const prodDownload = () => { return axios.get("/api/ProdDetail/download/"  + "?token=" + localStorage.getItem('logintoken')) };
//商品出入库
export const prodDetailSave = (params) => { return req("post", "/api/ProdDetail/add", params) };
//根据url图片解析内容
export const ulrParse = (params) => { return axios.get("/api/Prod/parse?imageUrl=" +params + "?token=" + localStorage.getItem('logintoken')) };

//按下回车往后端发送数据
export const sendDataToBackend = (params) => { return req("post", "/api/ProdDetail/barcodeAdd", params) };
