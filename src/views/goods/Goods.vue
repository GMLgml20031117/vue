/**
 * 基础菜单 商品管理
 */
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索筛选 -->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-input size="small" v-model="formInline.name" placeholder="输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.code" placeholder="输入商品代码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
      </el-form-item>
    </el-form>

    <div class="button-container">
      <el-upload
        action="/api/ProdDetail/upload"
        :show-file-list="false"
        accept=".xlsx,.xls"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
      >
        <el-button type="primary">上传 Excel</el-button>
      </el-upload>
      <el-button @click="downloadExcel">下载 Excel</el-button>

      <el-button type="danger" @click="imageFormVisible=true">条形码操作</el-button>
    </div>


    <!--列表-->
    <el-table
      size="small"
      :data="listData"
      highlight-current-row
      v-loading="loading"
      border
      element-loading-text="拼命加载中"
      style="width: 100%;"
      :row-class-name="getRowClassName"
    >

      <el-table-column align="center" type="selection" width="60">
      </el-table-column>
      <el-table-column sortable prop="alarmValue" label="告警值" width="60">
      </el-table-column>
      <el-table-column sortable prop="name" label="货品名称" width="150">
      </el-table-column>
      <el-table-column sortable prop="inventorySum" label="历史入库总量" width="100">
      </el-table-column>

      <el-table-column sortable prop="inventoryRemove" label="出库总值" width="100">
      </el-table-column>

      <el-table-column sortable prop="inventory" label="库存值" width="100">
      </el-table-column>

      <el-table-column sortable prop="localtion" label="位置" width="150">
      </el-table-column>


      <el-table-column sortable prop="type" label="型号" width="60">
      </el-table-column>

        <el-table-column
          prop="img"
          label="条形码"
          width="90"
          sortable>
          <template slot-scope="scope">
            <!-- 显示条形码图片 -->
            <img :src="scope.row.img" alt="条形码" style="width: 80px; height: auto;">
          </template>
        </el-table-column>

      <el-table-column
        prop="prodImg"
        label="产品图片"
        width="120"
        sortable>
        <template slot-scope="scope">
          <!-- 点击图片时，显示大图 -->
          <img
            :src="scope.row.prodImg"
            alt="产品图片"
            style="width: 100px; height: auto; cursor: pointer;"
            @click="showLargeImage(scope.row.prodImg)"
          />
        </template>

      </el-table-column>

      <el-table-column sortable prop="editTime" label="修改时间" width="150">
        <template slot-scope="scope">
          <div>{{scope.row.editTime|timestampToTime}}</div>
        </template>
      </el-table-column>
      <el-table-column sortable prop="editUser" label="修改人" width="150">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="250">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleProdEdit(scope.$index, scope.row)">出入库</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <Pagination v-bind:child-msg="pageparm" @callFather="callFather"></Pagination>






    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click="closeDialog">
      <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">

        <el-form-item label="商品名称" prop="name">
          <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="商品代码" prop="code">
          <el-input size="small" v-model="editForm.code" auto-complete="off" placeholder="请输入商品代码"></el-input>
        </el-form-item>
        <el-form-item label="商品位置" prop="code">
          <el-input size="small" v-model="editForm.localtion" auto-complete="off" placeholder="请输入商品位置"></el-input>
        </el-form-item>
<!--        上传图片-->
        <el-form-item label="产品图片" prop="prodImg">
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="uploadImage"
          />
          <div v-if="!editForm.prodImg" class="upload-button" @click="triggerUpload">
            +
          </div>
          <div v-else class="upload-button" style="position: relative;">
            <img
              :src="editForm.prodImg"
              alt="上传图片"
              style="width: 100%; height: 100%;"
              @click="isModalVisible=true"
            />
            <button class="my-button"
                    v-if="editForm.prodImg"
                    @click="deleteImage">
              X
            </button>
          </div>
          <!-- 大图弹窗 -->
          <div v-if="isModalVisible" class="modal" @click="isModalVisible=false">
            <img :src="editForm.prodImg" alt="大图" class="large-image" />
          </div>
        </el-form-item>

        <el-form-item label="预警值" prop="code">
          <el-input size="small" v-model="editForm.alarmValue" auto-complete="off" placeholder="请输入商品预警值"></el-input>
        </el-form-item>
        <el-form-item label="型号" prop="code">
          <el-input size="small" v-model="editForm.type" auto-complete="off" placeholder="请输入商品型号"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeDialog">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 出库入库 -->
    <el-dialog :title="title" :visible.sync="prodEditFormVisible" width="30%" @click="closeDialog">


      <el-form label-width="120px" :model="prodEditForm" :rules="rules" ref="editForm">

        <el-form-item label="商品名称" prop="name">
          <el-input size="small" v-model="prodEditForm.name" auto-complete="off" placeholder="部门名称" readonly></el-input>
        </el-form-item>
        <el-form-item label="商品代码" prop="code">
          <el-input size="small" v-model="prodEditForm.code" auto-complete="off" placeholder="商品代码" readonly></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="inOrOut">
          <el-radio v-model="prodEditForm.inOrOut" label="入库" value="1">入库</el-radio>
          <el-radio v-model="prodEditForm.inOrOut" label="出库" value="2">出库</el-radio>
        </el-form-item>

        <el-form-item label="数目" prop="num">
          <el-input size="small" v-model="prodEditForm.num" auto-complete="off" placeholder="请输入商品数目"></el-input>
        </el-form-item>
        <el-form-item label="出库用途" prop="purpose">
          <el-input size="small" v-model="prodEditForm.purpose" auto-complete="off" placeholder="请输入出库目的"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input size="small" v-model="prodEditForm.remark" auto-complete="off" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="prodEditFormVisible=false">取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitProdForm('editForm')">保存</el-button>
      </div>
    </el-dialog>

    <!-- 条形码操作 -->
    <el-dialog :title="title" :visible.sync="imageFormVisible" width="40%" @click="closeDialog">


      <el-form label-width="120px" :model="imageEditForm" :rules="rules" ref="editForm">

        <el-form-item label="图片解析为内容" prop="barcodeResult">
          <!--    最下面的用来解析url为code数据的-->
          <el-input
            v-model="imageUrl"
            placeholder="输入阿里云图片的URL"
            style="width: 400px;"
          ></el-input>
          <el-button type="primary" @click="parseBarcode" style="margin-left: 20px;">
            解析条形码
          </el-button>

          <!-- 显示图片 -->
          <div v-if="imageUrl">
            <img :src="imageUrl" alt="条形码图片" style="width: 300px; margin-top: 20px;" />
          </div>

          <!-- 显示解析结果 -->
          <el-alert
            v-if="imageEditForm.barcodeResult"
            title="解析结果"
            :description="imageEditForm.barcodeResult"
            type="success"
            show-icon
            style="margin-top: 20px;"
          ></el-alert>
        </el-form-item>


        <el-form-item label="入库内容" prop="barcodeResult">
          <el-input size="small" v-model="imageEditForm.barcodeResult" auto-complete="off" placeholder="入库内容"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="inOrOut">
          <el-radio v-model="imageEditForm.inOrOut" label="入库" value="1">入库</el-radio>
          <el-radio v-model="imageEditForm.inOrOut" label="出库" value="2">出库</el-radio>
        </el-form-item>

      </el-form>

      <el-table
        size="small"
        :data="imageListData"
        highlight-current-row
        v-loading="loading"
      >
        <el-table-column align="center" type="selection" width="60">
        </el-table-column>
        <el-table-column sortable prop="name" label="货品名称" >
        </el-table-column>
        <el-table-column sortable prop="num" label="数量" >
        </el-table-column>

        <el-table-column sortable prop="inOrOut" label="操作类型" >
        </el-table-column>

      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeImage">取消</el-button>
      </div>
    </el-dialog>


<!--    图片上传-->

    <!-- 大图模态框 -->
<!--    <div v-if="isModalVisible" class="modal" @click="closeModal">-->
<!--      <div class="modal-content" @click.stop>-->
<!--        <img :src="currentImage" alt="大图" class="large-image" />-->
<!--      </div>-->
<!--    </div>-->

    <div v-if="isModalVisible" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <img :src="currentImage" alt="大图" class="large-image" />
        <div class="image-controls">
          <button @click="prevImage" class="control-btn">上一张</button>
          <button @click="nextImage" class="control-btn">下一张</button>
        </div>
      </div>
    </div>

</div>
</template>
<script>

import {
  prodList,
  prodSave,
  prodDelete,
  prodDownload,
  prodDetailSave,
  ulrParse,
  sendDataToBackend, uploadImage
} from '../../api/prodMG'
import Pagination from '../../components/Pagination'
import {timestampToTime} from "../../utils/util";
export default {
  data() {
    return {
      //2025/2/26新增扫码枪数据
      lastTime:'',
      nextCode:'',
      code:'',
      lastCode:'',


      currentImageIndex: 0, // 当前大图索引
      currentImage:'',
      //控制模态框
      isModalVisible: false,

      showDelete: false,

      uploadImageUrl:'',  //上传图片的url

      imageListData:[],   //用于条形码扫描时显示的

      imageFormVisible:false,
      imageEditForm:{
        barcodeResult: '',
        inOrOut: '',
        remark:'条形码出入扫描',
        localtion:'1号库房2号货架（默认位置）',

      },



      imageUrl: '',       // 输入的图片URL


      prodEditFormVisible:false,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      title: '添加',
      prodEditForm:{
        id: '',
        name: '',
        code:'',
        type:'',
        num:'',
        purpose:'',
        remark:'',
        localtion:'',
        remain:'',
        unit:'',
        inOrOut:'1'
      },
      editForm: {
        id: '',
        name: '',
        code: '',
        unit: '',
        localtion: '',
        alarmValue: '',
        prodImg:'',
        type: '',
        img: '',
        token: localStorage.getItem('logintoken')
      },
      // rules表单验证
      rules: {

        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入商品代码', trigger: 'blur' }]
      },
      formInline: {
        page: 1,
        limit: 10,
        code: '',
        name: '',
        token: localStorage.getItem('logintoken')
      },
      // 删除部门
      seletedata: {
        ids: '',
        token: localStorage.getItem('logintoken')
      },
      userparm: [], //搜索权限
      listData: [], //商品数据
      // 分页参数
      pageparm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  },
  // 注册组件
  components: {
    Pagination
  },
  /**
   * 数据发生改变
   */

  /**
   * 创建完毕
   */
  created() {
    this.getdata(this.formInline)
    document.addEventListener('keydown',this.handleKeydown)


    //添加扫码枪操作
    window.document.onkeypress = (e) => {
      if (window.event) { // IE
        this.nextCode = e.keyCode
      } else if (e.which) { // Netscape/Firefox/Opera
        this.nextCode = e.which
      }
      // console.log(e.which)
      // console.log(this.row)
      console.log("-------------")
      if (e.which === 13) { // 键盘回车事件
        console.log(this.code.length)
        if(this.code.length == 0){
          console.log(this.code)
          this.parseQRCode(this.code) // 获取到扫码枪输入的内容，做别的操作
          this.lastCode = ''
          this.lastTime = ''
          return
        }//新加的需要删除掉的
        if (this.code.length < 3) return // 扫码枪的速度很快，手动输入的时间不会让code的长度大于2，所以这里不会对扫码枪有效
        console.log('扫码结束。')
        console.log('条形码：', this.code)
        this.parseQRCode(this.code) // 获取到扫码枪输入的内容，做别的操作
        this.lastCode = ''
        this.lastTime = ''
        return
      }

      this.nextTime = new Date().getTime()
      if (!this.lastTime && !this.lastCode) {
        this.code = '' // 清空上次的条形码
        this.code += e.key
        console.log('扫码开始---', this.code)
      }
      if (this.lastCode && this.lastTime && this.nextTime - this.lastTime > 500) { // 当扫码前有keypress事件时,防止首字缺失
        this.code = e.key
        console.log('防止首字缺失。。。', this.code)
      } else if (this.lastCode && this.lastTime) {
        this.code += e.key
        console.log('扫码中。。。', this.code)
      }
      this.lastCode = this.nextCode
      this.lastTime = this.nextTime
    }


  },
  beforeDestroy() {
    // 在组件销毁时移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeydown);
  },



  /**
   * 里面的方法只有被调用才会执行
   */
  methods: {

    //2025/2/26新加扫码枪工作
    parseQRCode(code) {

      //这里可以去加一些判断验证码长度的代码
      if (code.length === 0) {
        // 处理自己的逻辑
        console.log('请输入条码！')
      } else {
        let codeParams = {
          codeParam:code
        }
        //这里写请求后端的接口，去获取信息展示在table 中
      }
      this.codeValue = code
    },

    prodDownload,
    timestampToTime,
    prevImage() {
      // 切换到上一张图片
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
        this.currentImage = this.listData[this.currentImageIndex].prodImg;
      }
    },
    nextImage() {
      // 切换到下一张图片
      if (this.currentImageIndex < this.listData.length - 1) {
        this.currentImageIndex++;
        this.currentImage = this.listData[this.currentImageIndex].prodImg;
      }
    },

    //控制大图显示
    showLargeImage(image) {
      // 打开模态框并设置当前大图
      this.currentImage = image;
      this.isModalVisible = true;
    },
    closeModal() {
      // 关闭模态框
      this.isModalVisible = false;
    },

    deleteImage() {
      // 删除图片
      this.uploadImageUrl = '';
      this.editForm.prodImg=''
      // 清空文件输入框的值，确保可以重新上传
      this.$refs.fileInput.value = null;
    },

    triggerUpload() {
      console.log("文件选择器")
      // 触发文件选择器
      this.$refs.fileInput.click();
    },
    async uploadImage(event) {
      const file = event.target.files[0];
      if (!file) {
        alert('请选择一张图片！');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      uploadImage(formData).then(res=>{
        if(res.success){
          this.$message("图片上传成功")
          this.uploadImageUrl=res.data
          this.editForm.prodImg=res.data
        }
      })

    },

    //播放
    playSound(soundFile) {
      const audio = new Audio(require(`@/assets/mp3/${soundFile}`));
      audio.play().catch(error => {
        console.error('播放音频失败:', error);
      });
    },

    //关闭条形码那个接口
    closeImage(){
      this.imageFormVisible=false
      this.imageListData=[]
      this.imageUrl=''
    },

    // 按下回车事件
    handleKeydown(event) {
      if (event.key === 'Enter' && this.imageFormVisible === true) {

        sendDataToBackend(this.imageEditForm).then(res => {

          if(res.success===true) {

            console.log(res.data)
            this.getdata(this.formInline)
            // 将返回的对象添加进数组，先检查存在不
            const exist = this.imageListData.find(item => (item.id === res.data.id && item.inOrOut === res.data.inOrOut))
            if (exist) {
              console.log("该数据已存在,操作+1")
              this.$message("该数据已存在,操作+1")
              exist.num += 1
            } else {
              this.imageListData.push(res.data)
            }
            this.imageEditForm.barcodeResult = ''
            if(this.imageEditForm.inOrOut==='出库')
              this.playSound('入库成功.mp3')
            else
              this.playSound('出库成功.mp3')
          }else {
            this.$message(res.msg)
          }
        })
      }
    },

    //解析图片内容
    parseBarcode() {
      ulrParse(this.imageUrl).then(res=>{
        this.imageEditForm.barcodeResult=res.data
        this.$message("图片解析成功")
      })
    },

    //下载excel文件
    async downloadExcel() {
        try {
          const response = await this.$axios({
            method: 'get',
            url: '/api/ProdDetail/download?token' + localStorage.getItem('logintoken'),
            responseType: 'blob', // 关键：指定响应类型为二进制流
          });

          // 从响应头中解析文件名（需后端设置 Content-Disposition）
          const fileName = this.getFileNameFromHeaders(response.headers);

          // 创建 Blob 对象并触发下载
          const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName || 'inventory.xlsx'); // 默认文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          this.$message.error('下载失败');
          console.error(error);
        }
      },

      // 从响应头解析文件名（示例）
      getFileNameFromHeaders(headers) {
        const contentDisposition = headers['content-disposition'];
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
          if (fileNameMatch && fileNameMatch[1]) {
            return decodeURIComponent(fileNameMatch[1]);
          }
        }
        return null;
      },

    handleUploadSuccess(response, file) {
      console.log('上传成功', response);
      this.$message.success('文件上传成功');
      // 可以在这里处理上传成功的逻辑，例如更新文件列表或显示提示信息
      // 例如，如果后端返回了文件的 URL，可以将其添加到文件列表中
      this.fileList.push({ name: file.name, url: response.data.url });
      this.getdata(this.formInline)
    },
    handleUploadError(err, file) {
      console.error('上传失败', err);
      this.$message.error(err);
      this.getdata(this.formInline)
      // 可以在这里处理上传失败的逻辑，例如显示错误提示
    },
    getRowClassName({ row, rowIndex }) {
      if (row.alarm === 1) {
        return 'alarm-row'; // 当 alarm 字段等于 1 时，返回自定义类名
      }
      return ''; // 默认情况下不添加任何类名
    },
    // 获取公司列表
    getdata(parameter) {
      this.loading = true
      /***
       * 调用接口，注释上面模拟数据 取消下面注释
       */
      prodList(parameter)
        .then(res => {
          this.loading = false
          if (res.success == false) {
            this.$message({
              type: 'info',
              message: res.msg
            })
          } else {
            this.listData = res.data.records
            // 分页赋值
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total = res.data.total
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error('菜单加载失败，请稍后再试！')
        })
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getdata(this.formInline)
    },
    // 搜索事件
    search() {
      this.getdata(this.formInline)
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row != undefined && row != 'undefined') {
        this.title = '修改'
        this.editForm.id = row.id
        this.editForm.name = row.name
        this.editForm.code = row.code
        this.editForm.unit=row.unit
        this.editForm.prodImg=row.prodImg
        this.editForm.type = row.type
        this.editForm.localtion=row.localtion
        this.editForm.alarmValue=row.alarmValue
        this.editForm.img=row.img

      } else {
        this.title = '添加'
        this.editForm.id = ''
        this.editForm.name = ''
        this.editForm.code = ''
        this.editForm.img =''
        this.editForm.alarmValue=''
        this.editForm.type=''
        this.editForm.unit=''
        this.editForm.prodImg=''
        this.editForm.localtion=''
      }
    },
    //显示出入库界面
    handleProdEdit: function(index, row) {
      this.prodEditFormVisible = true
      this.prodEditForm.id = row.id
      this.prodEditForm.name = row.name
      this.prodEditForm.code = row.code
      this.prodEditForm.unit = row.unit
      this.prodEditForm.localtion = row.localtion
      this.prodEditForm.type=row.type
      this.prodEditForm.remain=row.inventory
      this.prodEditForm.num=''
      this.prodEditForm.purpose=''
      this.prodEditForm.remark=''
      this.prodEditForm.inOrOut=''
    },
    // 出入库操作
    submitProdForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          prodDetailSave(this.prodEditForm)
            .then(res => {
              this.prodEditFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '库存信息保存成功！'
                })
                if(this.prodEditForm.inOrOut==='入库')
                  this.playSound('入库成功.mp3')
                else
                  this.playSound('出库成功.mp3')
              } else {
                this.getdata(this.formInline)
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.getdata(this.formInline)
              this.editFormVisible = false
              this.loading = false
              this.$message.error('保存失败，请稍后重试！')
            })
        } else {
          return false
        }
      })
    },

    // 编辑、增加页面保存方法
    submitForm(editData) {
      this.$refs[editData].validate(valid => {
        if (valid) {
          prodSave(this.editForm)
            .then(res => {
              this.editFormVisible = false
              this.loading = false
              if (res.success) {
                this.getdata(this.formInline)
                this.$message({
                  type: 'success',
                  message: '公司保存成功！'
                })
              } else {
                this.getdata(this.formInline)
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.editFormVisible = false
              this.loading = false
              this.$message.error('公司保存失败，请稍后再试！')
            })
        } else {
          return false
        }
      })
    },
    // 删除公司
    deleteUser(index, row) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          prodDelete(row.id)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '公司已删除!'
                })
                this.getdata(this.formInline)
              } else {
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }
            })
            .catch(err => {
              this.loading = false
              this.$message.error('公司删除失败，请稍后再试！')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    closeDialog(){
      this.prodEditFormVisible=false;
      this.editFormVisible=false
      this.mageFormVisible=false
    }
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
.userRole {
  width: 100%;
}
/* 强制覆盖表格行样式 */
.el-table >>> .alarm-row td {
  background-color: #ffe58f !important;
}
.button-container {
  position: absolute; /* 或者使用 fixed */
  top: 100px; /* 距离顶部的距离 */
  right: 20px; /* 距离右侧的距离 */
  display: flex;
  gap: 10px; /* 按钮之间的间距 */
}
.upload-button {
  width: 100px;
  height: 100px;
  font-size: 24px;
  background-color: transparent; /* 背景透明 */
  color: #007bff; /* 字体颜色 */
  border: 2px solid #007bff; /* 边框颜色 */
  border-radius: 5px; /* 边框圆角 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none; /* 去掉默认的焦点边框 */
}
.upload-button:hover {
  border-color: #0056b3; /* 鼠标悬停时的边框颜色 */
  color: #0056b3; /* 鼠标悬停时的字体颜色 */
}

.delete-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  color: red;
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
  border-radius: 5px 0 0 5px;
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  z-index: 999;
  padding: 20px;
}

.large-image {
  max-width: 90%; /* 确保图片在窗口内 */
  max-height: 90%; /* 限制图片最大高度 */
  object-fit: contain; /* 确保图片比例不失真 */
}

.my-button{
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;

}
.control-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.control-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>


