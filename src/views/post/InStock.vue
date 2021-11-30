<template>
  <page-view>
    <a-card>
      <a-row>
        <a-col :span="3" style="float:left;padding-left:20px;">
          <a-input v-model="inStock.title" prefix="" suffix="名称" />
        </a-col>
        <a-col :span="3" style="float:left;padding-left:20px;">
          <a-input v-model="inStock.norms" prefix="" suffix="规格" />
        </a-col>
        <a-col :span="3" style="float:left;padding-left:20px;">
          <a-input v-model="inStock.deviceType" prefix="" suffix="型号" />
        </a-col>

        <a-col :span="3" style="float:left;;padding-left:20px;">
          <a-input v-model="inStock.price" prefix="￥" suffix="单价" />
        </a-col>
        <a-col :span="3" style="float:left;padding-left:20px;">
          <a-input v-model="inStock.stock" prefix="" suffix="入库数量" />
        </a-col>
        <a-col :span="3" style="float:left;padding-left:20px;">
          <a-input v-model="inStock.categoryCreate" prefix="" suffix="类别" />
        </a-col>
        <a-col :span="3" style="float:left;padding-left:20px;">
          <a-input v-model="inStock.deviceNum" prefix="" suffix="库存位置" />
        </a-col>
        <a-col :span="3" style="float:left;padding-left:20px;">
          <a-input v-model="inStock.importPeople" prefix="" suffix="入库人员" />
        </a-col>
      </a-row>
      <a-button-group style="margin: 10px 10px;float: right">
        <a-button type="primary" @click="importStock()">
          提交
        </a-button>
        <a-button>重置</a-button>
      </a-button-group>
    </a-card>
    <a-card>
      <a-table ref="print" bordered :pagination="false" :columns="columns" :data-source="inStockList"> </a-table>
      <a-button style="float: right;margin-top: 10px" type="primary" @click="printInStock()">打印</a-button>
      <input
        type="file"
        @change="importFile(this)"
        id="imFile"
        style="display: none"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <a-button style="margin: 10px;float: right" @click="importExcel()">导入</a-button>
    </a-card>
  </page-view>
</template>
<script>
import PageView from '@/layouts/PageView'
import postApi from '@/api/post'
import pinyin from 'tiny-pinyin'
import xlsx from 'xlsx'
import { uploadExcel } from '@/utils/uploadExcel'

const columns = [
  {
    title: '编号',
    key: 'deviceNum',
    dataIndex: 'deviceNum'
  },
  {
    dataIndex: 'title',
    key: 'title',
    title: '名称'
  },
  {
    title: '规格',
    dataIndex: 'norms',
    key: 'norms'
  },
  {
    title: '型号',
    dataIndex: 'deviceType',
    key: 'deviceType'
  },
  {
    title: '单价',
    key: 'price',
    dataIndex: 'price'
  },
  {
    title: '入库数量',
    key: 'stock',
    dataIndex: 'stock'
  },
  {
    title: '类别',
    key: 'categoryCreate',
    dataIndex: 'categoryCreate'
  },
  {
    title: '入库人员',
    key: 'importPeople',
    dataIndex: 'importPeople'
  }
]

export default {
  components: { PageView },

  data() {
    return {
      inStock: {},
      inStockList: [],
      columns,
      headers: {
        authorization: 'authorization-text'
      }
    }
  },
  methods: {
    printInStock() {
      this.$print(this.$refs.print)
    },
    importExcel() {
      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      // if (info.file.status === 'done') {
      //   this.$message.success(`${info.file.name} file uploaded successfully`);
      // } else if (info.file.status === 'error') {
      //   this.$message.error(`${info.file.name} file upload failed.`);
      // }
      document.getElementById('imFile').click()
    },
    async importFile() {
      // 导入excel

      let obj = document.getElementById('imFile')
      if (!obj.files) return

      var f = obj.files[0]
      let reader = await uploadExcel(f)
      const worker = xlsx.read(reader, { type: 'binary' })
      console.log(worker)
      reader = xlsx.utils.sheet_to_json(worker.Sheets[worker.SheetNames[0]])
      console.log(reader)
      reader.forEach(item => {
        let stock = {}
        for (let key in item) {
          let text = item[key]
          let k
          switch (key) {
            case '名称':
              k = 'title'
              break
            case '规格':
              k = 'norms'
              break
            case '型号':
              k = 'deviceType'
              break
            case '单价':
              k = 'price'
              break
            case '入库数量':
              k = 'stock'
              break
            case '类别':
              k = 'categoryCreate'
              break
            case '库存位置':
              k = 'deviceNum'
              break
            case '入库人员':
              k = 'importPeople'
              break
          }
          stock[k] = text
        }
        console.log(stock)
        this.inStock = stock
        this.importStock()
        this.inStock = null
        obj.file = null
      })
      // var reader = new FileReader()
      //
      // let $t = this
      // reader.onload = function (e) {
      //   var data = e.target.result
      //   if ($t.rABS) {
      //     $t.wb = xlsx.read(btoa(this.fixdata(data)), {  // 手动转化
      //       type: 'base64'
      //     })
      //   } else {
      //     $t.wb = xlsx.read(data, {
      //       type: 'binary'
      //     })
      //   }
      //   let json = xlsx.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
      //   console.log(typeof json)
      //   $t.dealFile($t.analyzeData(json)) // analyzeData: 解析导入数据
      // }
      // if (this.rABS) {
      //   reader.readAsArrayBuffer(f)
      // } else {
      //   reader.readAsBinaryString(f)
      // }
    },
    importStock() {
      this.handleSetPinyinSlug()
      this.handleSetPinyinCategories()
      this.$message.loading({ content: 'Loading...' })
      postApi.inStock(this.inStock.categoriesSlug, this.inStock).then(response => {
        if (response.data == 1) {
          this.$message.success('入库成功', 5)
        } else {
          this.$message.error('入库失败', 5)
        }
      })
      let parse = JSON.parse(JSON.stringify(this.inStock))
      this.inStockList.push(parse)
    },
    handleSetPinyinSlug() {
      if (this.inStock.title && this.inStock.title !== '' && !this.inStock.id) {
        if (pinyin.isSupported()) {
          let result = ''
          const tokens = pinyin.parse(this.inStock.title)
          let lastToken
          tokens.forEach(token => {
            if (token.type === 2) {
              const target = token.target ? token.target.toLowerCase() : ''
              result += result && !/\n|\s/.test(lastToken.target) ? '-' + target : target
            } else {
              result += (lastToken && lastToken.type === 2 ? '-' : '') + token.target
            }
            lastToken = token
          })
          this.$set(this.inStock, 'slug', result)
        }
      }
    },
    handleSetPinyinCategories() {
      if (this.inStock.categoryCreate && this.inStock.categoryCreate !== '') {
        if (pinyin.isSupported()) {
          let result = ''
          const tokens = pinyin.parse(this.inStock.categoryCreate)
          let lastToken
          tokens.forEach(token => {
            if (token.type === 2) {
              const target = token.target ? token.target.toLowerCase() : ''
              result += result && !/\n|\s/.test(lastToken.target) ? '-' + target : target
            } else {
              result += (lastToken && lastToken.type === 2 ? '-' : '') + token.target
            }
            lastToken = token
          })
          this.inStock.categoriesSlug = result
        }
      }
    }
  }
}
</script>
