<template>
    <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" >
        <el-form-item v-if="productId" label="产品" >        
           <el-input v-model="productName"  disabled></el-input>
        </el-form-item>
        <el-form-item  v-else  label="产品" prop="pid">
            <el-select v-model="ruleForm.pid" placeholder="请选择产品">
                <el-option
                    v-for="item in productArrTemp"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>   
          </el-form-item>

  
        <el-form-item label="添加方式" prop="type">
              <el-radio v-model="type" label="1"  border size="medium">自动生成</el-radio>
              <el-radio v-model="type" label="2"  border size="medium">批量上传</el-radio>
        </el-form-item>
    
        <el-form-item  v-if="type === '1'" label="设备数量" prop="num">
            <el-input-number v-model="ruleForm.num" controls-position="right"  :min="1" :max="1000" label="请输入设备数量"></el-input-number>
        </el-form-item>  
         
          <el-form-item v-if="type === '2'" label="批量上传文件" prop="fileList">      
            <!-- :on-success="success"
                :before-uoload="beforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove" -->
            <el-upload
                action=""
                :on-change="(file) => fileChange(file)"
                :auto-upload="false"
                :multiple="false"
               >
               <el-button size="small" type="primary">上传文件</el-button>
               
                <download-excel :fields = "json_fields"  name="Template.xls"> 
                  <el-button size="small" type="text">下载.csv模板</el-button>
                </download-excel> 
                 <div slot="tip" class="el-upload__tip">只能上传excel文件，单次最多添加 1000 台</div>
            </el-upload>
         </el-form-item>  
    </el-form>
 
</template>
<script>
  export default {
    props:{
      productArr:{
          type:Array,
          default: () => []
      },
      productId:{
        type:Number,
        default:0
      }
    },
     watch:{
        //监听productId,若发生变化，重新查询设备列表
        productId:{  
            handler:function(val,oldval){ 
                if(val!=oldval){
                    this.$nextTick(()=>{
                        this.init()
                    })
                }
            },  
            immediate:true,//关键
            deep:true
          },
      },
    data() {
       var checkNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入产品名称'));
        }
        setTimeout(() => {
       
          if (value < 1 || value > 100) {
            callback(new Error('设备添加数量范围在1-1000之间'));
          } else {     
            callback();       
          }
        }, 1000);
      };
      return {
        productName:"",
        ruleForm: {},
        type:"1",
        productArrTemp:[],
        rules: {
          pid: [
            { required: true, message: '请选择产品', trigger: 'blur' },
           ],
            num: [
               { validator: checkNum, trigger: 'blur' }
            ],
          //  count: [
          //   { required: true,type:'number',message: '请输入设备数量', trigger: 'blur' }
          // ]
              
        },
        file:File,
        json_fields:{'DeviceName':'' }
      };
    },
    created(){
       this.init()
    },
    methods: {
        init(){
          this.productArrTemp = JSON.parse(JSON.stringify(this.productArr))
          this.productArrTemp.shift();
          //选择了产品id，固定写死产品名称，不能选择
          if(this.productId && this.productId !== 0){
               this.productName =  this.productArr.filter(item => item.id === this.productId)[0].name
                this.ruleForm =  {
                  pid: this.productId,
                  num: 1 ,     
                }
          }else{
            this.ruleForm= {    
              pid: null,
              num: 1 ,
            }
          }

            
        },    
    
      submit(){

        if(this.type === "1"){
          this.submitForm()
        }else{
            this.uploadFie()
        }
      },
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
             //回调父组件方法显示结果
            this.$emit('showAddResult')
            this.$API_IOT.addDeviceArr(this.ruleForm).then((res) => {
                if(res.data.status  === 'Y'){
                   //回调父组件方法
                  this.$emit('close')
                  //回调，添加结果
                  this.$emit('addSuccess',this.ruleForm.num)

                }else{
                    this.$message.error(res.message);
                }
               
            })        
             
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },  

      fileChange(file){
        this.file = file
      },
      uploadFie() {
            let param = new FormData()
            param.append('file', this.file.raw)
           this.$API_IOT.uploadFile(param).then((res) => {
               //文件上传成功
                if(res.data.status  === 'Y'){   
                    this.$emit('showAddResult')
                    param.append('pid', this.ruleForm.pid)
                    this.submitFile(param,res.data.data.number_count)

                    
                }else{
                    this.$message.error(res.message);
                }
               
            })
        
      }, 


      submitFile(param,number){
            this.$API_IOT.addDeviceFile(param).then((res) => {
                if(res.data.status  === 'Y'){
                   //回调父组件方法
                  this.$emit('close')
                  this.$emit('addSuccess',number)
                }else{
                    this.$message.error(res.message);
                }
               
            })
      },

      downCsvTemplate(){

      }
    }
  }
</script>
<style scoped >
 
  .el-upload{
    display: flex !important;
  }
</style>