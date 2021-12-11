<template>
  <page-view>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="入库人员：">
                <a-input v-model="queryParam.importPeople" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="入库日期：">
                <div>
                  <a-date-picker v-model="queryParam.datetime" @change="onChange" />
                  <br />
                </div>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space>
                  <a-button type="primary" @click="handleQuery()">查询</a-button>
                  <a-button @click="handleResetParam()">重置</a-button>
                  <a-button @click="printOrder()">打印</a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        ref="print"
        bordered
        :columns="columns"
        :data-source="ordersList"
        :pagination="false"
        :loading="postsLoading"
      >
      </a-table>
      <div class="page-wrapper">
        <a-pagination
          v-model="current"
          :page-size-options="pageSizeOptions"
          :total="total"
          show-size-changer
          :page-size="pageSize"
          @showSizeChange="onShowSizeChange"
          v-if="pagination.open"
          class="pagination"
          :current="current"
          :defaultPageSize="20"
          showSizeChanger
          @change="handlePaginationChange"
          showLessItems
        >
          <template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== total">{{ props.value }}条/页</span>
            <span v-if="props.value === total">全部</span>
          </template>
        </a-pagination>
      </div>
    </a-card>
  </page-view>
</template>

<script>
import PageView from '@/layouts/PageView'
import inStockApi from '@/api/instock'
import { datetimeFormat } from '@/utils/datetime'

const columns = [
  {
    title: '编号',
    dataIndex: 'deviceNum',
    key: 'deviceNum'
  },
  {
    dataIndex: 'title',
    key: 'title',
    title: '名称',
    slots: { title: 'title' },
    scopedSlots: { customRender: 'title' }
  },
  {
    title: '规格',
    dataIndex: 'norms',
    key: 'norms'
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '数量',
    dataIndex: 'stock',
    key: 'stock'
  },
  {
    title: '时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '类型',
    key: 'deviceType',
    dataIndex: 'deviceType'
  },
  {
    title: '分类',
    key: 'categories',
    dataIndex: 'categories'
  },
  {
    title: '入库人',
    key: 'importPeople',
    dataIndex: 'importPeople',
    scopedSlots: { customRender: 'importPeople' }
  }
]

export default {
  components: { PageView },
  data() {
    return {
      columns,
      ordersList: [],
      queryParam: {
        username: null,
        state: null,
        datetime: null
      },
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      current: 1,
      pageSize: 10,
      total: null,
      props: {
        value: 10
      },
      pagination: {
        page: null,
        size: null,
        open: true
      },
      postsLoading: false
    }
  },
  mounted() {
    this.getLatestOrder()
    inStockApi.countOrder().then(response => {
      this.total = response.data.data
      console.log(response.data)
      this.pageSizeOptions.push(response.data.data)
    })
  },
  methods: {
    printOrder() {
      this.$print(this.$refs.print)
    },
    getLatestOrder() {
      inStockApi.getLatest().then(response => {
        this.ordersList = response.data.data

        let i = 0
        for (i; i < this.ordersList.length; i++) {
          this.ordersList[i].createTime = datetimeFormat(this.ordersList[i].createTime)
        }
      })
    },
    handlePaginationChange(page, pageSize) {
      this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page
      this.pagination.size = pageSize
      this.postsLoading = true
      inStockApi.getLatest((page - 1) * pageSize, pageSize).then(response => {
        this.ordersList = response.data.data

        let i = 0
        for (i; i < this.ordersList.length; i++) {
          this.ordersList[i].createTime = datetimeFormat(this.ordersList[i].createTime)
        }
        this.postsLoading = false
      })
    },
    handleQuery() {
      this.postsLoading = false
      if (this.queryParam.importPeople == null && this.queryParam.datetime == null) {
        this.getLatestOrder()
      } else {
        inStockApi.queryOrder(this.queryParam.importPeople, this.queryParam.datetime).then(response => {
          this.ordersList = response.data.data
          let i = 0
          for (i; i < this.ordersList.length; i++) {
            this.ordersList[i].createTime = datetimeFormat(this.ordersList[i].createTime)
          }
          this.postsLoading = false
        })
      }
    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize
      this.handlePaginationChange(this.current, this.pageSize)
    },
    onChange(date, dateString) {
      this.queryParam.datetime = dateString
      console.log(this.queryParam.datetime, dateString)
    },
    handleResetParam() {
      this.queryParam.datetime = null
      this.queryParam.username = null
      this.queryParam.state = -1
    }
  }
}
</script>
<style></style>
