<template>
  <page-view>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="姓名：">
                <a-input v-model="queryParam.username" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="申请日期：">
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
        <a slot="username" slot-scope="text">{{ text }}</a>
        <span slot="username"><a-icon type="smile-o" /> 姓名</span>
        <a-col :md="6" :sm="24">
          <a-form-item label="订单状态：">
            <a-select v-model="queryParam.state" placeholder="请选择订单状态" allowClear>
              <a-select-option :value="-1">请选择</a-select-option>
              <a-select-option :value="0">未审核</a-select-option>
              <a-select-option :value="1">已通过</a-select-option>
              <a-select-option :value="2">未通过</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <span slot="states" slot-scope="state">
          <a-tag :color="state == 0 ? 'volcano' : state == 1 ? 'green' : 'geekblue'">
            {{ state == 0 ? '待审核' : state == 1 ? '已通过' : '未通过' }}
          </a-tag>
        </span>
        <a slot="links" :href="text" slot-scope="text" target="_blank">点击跳转</a>
        <span class="no-print" slot="action" slot-scope="text, record">
          <a v-if="record.state == 0" @click="passOrder(record, 1)">通过</a>
          <a-divider v-if="record.state == 0" type="vertical" />
          <a v-if="record.state == 0" @click="showModal(record, 2)">拒绝</a>
        </span>
      </a-table>
      <a-modal
        title="请输入审核意见"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="refuseApply(apply, applyState, advice)"
        @cancel="handleCancel"
      >
        <a-input v-model="advice" />
      </a-modal>
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
import applyApi from '@/api/apply'
import { datetimeFormat } from '@/utils/datetime'

const columns = [
  {
    dataIndex: 'username',
    key: 'username',
    title: '姓名',
    slots: { title: 'username' },
    scopedSlots: { customRender: 'username' }
  },

  {
    title: '设备名称',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '元件型号',
    dataIndex: 'norm',
    key: 'norm'
  },
  {
    title: '购买链接',
    dataIndex: 'link',
    key: 'link',
    scopedSlots: { customRender: 'links' }
  },
  {
    title: '数量',
    key: 'number',
    dataIndex: 'number'
  },

  {
    title: '申请时间',
    key: 'createTime',
    dataIndex: 'createTime'
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    scopedSlots: { customRender: 'states' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    class: 'no-print'
  }
]

export default {
  components: { PageView },
  data() {
    return {
      apply: null,
      applyState: null,
      advice: null,
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
      postsLoading: false,
      visible: false
    }
  },
  mounted() {
    this.getLatestOrder()
    applyApi.countOrder().then(response => {
      this.total = response.data.data
      console.log(response.data)
      this.pageSizeOptions.push(response.data.data)
    })
  },
  methods: {
    showModal(apply, state) {
      this.apply = apply
      this.applyState = state
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    printOrder() {
      this.$print(this.$refs.print)
    },
    getLatestOrder() {
      applyApi.getLatest().then(response => {
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
      applyApi.getLatest((page - 1) * pageSize, pageSize).then(response => {
        this.ordersList = response.data.data

        let i = 0
        for (i; i < this.ordersList.length; i++) {
          this.ordersList[i].createTime = datetimeFormat(this.ordersList[i].createTime)
        }
        this.postsLoading = false
      })
    },
    handleQuery() {
      console.log(this.queryParam)
      this.postsLoading = false
      console.log(this.queryParam.username, this.queryParam.datetime)
      if (this.queryParam.username == null && this.queryParam.datetime == null) {
        this.getLatestOrder()
      } else {
        applyApi.queryOrder(this.queryParam.username, this.queryParam.datetime).then(response => {
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
    },
    passOrder(apply, state) {
      let message = state == 1 ? '订单审核通过' : '订单审核不通过'
      this.$message.loading({ content: 'Loading...' })
      console.log(apply)
      applyApi.passApply(apply.id, state).then(response => {
        if (response.data > 0) {
          this.$message.success(message, 5)
          apply.state = state
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    refuseApply(apply, state, advice) {
      let message = state == 1 ? '订单审核通过' : '订单审核不通过'
      this.$message.loading({ content: 'Loading...' })
      console.log(apply)
      applyApi.refuseApply(apply.id, state, advice).then(response => {
        if (response.data > 0) {
          this.$message.success(message, 5)
          apply.state = state
        } else {
          this.$message.error('操作失败')
        }
      })
      this.visible = false
    },
    deleteOrder(order) {
      this.$message.loading({ content: 'Loading...' })
      applyApi.deleteOrder(order.id).then(response => {
        console.log(response)
        if (response.data > 0) {
          this.$message.success('删除成功', 5)
          const dataSource = [...this.ordersList]
          this.ordersList = dataSource.filter(dataSource => dataSource.id != order.id)
        } else {
          this.$message.error('删除失败')
        }
      })
    }
  }
}
</script>
<style></style>
