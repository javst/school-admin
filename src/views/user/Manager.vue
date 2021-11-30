<template>
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
            <a-form-item label="学号：">
              <a-input v-model="queryParam.student_num" />
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

    <div class="editUser">
      <a-modal
        title="用户编辑"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        用户名:
        <a-input v-model="user.nickname" placeholder="用户名" />
        余额：
        <a-input prefix="￥" suffix="RMB" v-model="user.money" />
        系部:
        <a-input v-model="user.department" placeholder="系部" />
        班级:
        <a-input v-model="user.class_name" placeholder="班级" />
        学号:
        <a-input v-model="user.student_num" placeholder="学号" />
      </a-modal>
    </div>

    <a-table
      ref="print"
      bordered
      :columns="columns"
      :data-source="userList"
      :pagination="false"
      :loading="postsLoading"
    >
      <a slot="username" slot-scope="text">{{ text }}</a>
      <span slot="username"><a-icon type="smile-o" /> 姓名</span>

      <span class="no-print" slot="action" slot-scope="text, record">
        <a @click="showModal(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deleteUser(record)">删除</a>
      </span>
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
</template>

<script>
import userApi from '@/api/user'

const columns = [
  {
    dataIndex: 'nickname',
    key: 'nickname',
    title: '姓名',
    slots: { title: 'nickname' },
    scopedSlots: { customRender: 'nickname' }
  },
  {
    title: '学号',
    dataIndex: 'student_num',
    key: 'student_num'
  },
  {
    title: '系部',
    dataIndex: 'department',
    key: 'department'
  },
  {
    title: '班级',
    dataIndex: 'class_name',
    key: 'class_name'
  },
  {
    title: '余额',
    dataIndex: 'money',
    key: 'money'
  },

  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    class: 'no-print'
  }
]

export default {
  data() {
    return {
      columns,
      userList: [],
      queryParam: {
        username: null,
        student_num: null
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
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      user: {}
    }
  },
  mounted() {
    this.getLatestUser()
    userApi.countUser().then(response => {
      this.total = response.data.data
      console.log(response.data)
      this.pageSizeOptions.push(response.data.data)
    })
  },
  methods: {
    printOrder() {
      this.$print(this.$refs.print)
    },
    getLatestUser() {
      userApi.getLatest().then(response => {
        this.userList = response.data.data
      })
    },
    handlePaginationChange(page, pageSize) {
      this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page
      this.pagination.size = pageSize
      this.postsLoading = true
      userApi.getLatest((page - 1) * pageSize, pageSize).then(response => {
        this.userList = response.data.data
        this.postsLoading = false
      })
    },
    handleQuery() {
      console.log(this.queryParam)
      this.postsLoading = false
      console.log(this.queryParam.username, this.queryParam.student_num)
      if (this.queryParam.username == null && this.queryParam.student_num == null) {
        this.getLatestOrder()
      } else {
        userApi.queryUser(this.queryParam.username, this.queryParam.student_num).then(response => {
          this.userList = response.data.data

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
      this.queryParam.student_num = null
      this.queryParam.username = null
    },
    deleteUser(user) {
      this.$message.loading({ content: 'Loading...' })
      userApi.deleteUser(user.id).then(response => {
        console.log(response)
        if (response.data > 0) {
          this.$message.success('删除成功', 5)
          const dataSource = [...this.userList]
          this.userList = dataSource.filter(dataSource => dataSource.id != user.id)
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    showModal(e) {
      this.user = e
      this.visible = true
    },
    handleOk() {
      this.confirmLoading = true
      console.log(this.user)
      userApi.updateUser(this.user).then(response => {
        console.log(response)
        if (response.data.data == 1) {
          this.$message.success('更新成功')
        } else {
          this.$message.error('更新失败')
        }
        this.confirmLoading = false
        this.visible = false
      })
    }
  }
}
</script>
<style>
.ant-modal-body input {
  margin: 10px auto;
}
</style>
