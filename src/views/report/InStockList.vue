<template>
  <page-view>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="元件名称：">
                <a-input v-model="queryParam.keyword" @keyup.enter="handleQuery()" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="分类目录：">
                <a-select
                  v-model="queryParam.categoryId"
                  placeholder="请选择分类"
                  @change="handleQuery()"
                  :loading="categoriesLoading"
                  allowClear
                >
                  <a-select-option v-for="category in categories" :key="category.id"
                    >{{ category.name }}({{ category.postCount }})</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-space>
                  <a-button type="primary" @click="handleQuery()">查询</a-button>
                  <a-button @click="handleResetParam()">重置</a-button>
                  <a-button @click="printPost()">打印</a-button>
                </a-space>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="mt-4">
        <!-- Mobile -->
        <a-list
          v-if="isMobile()"
          itemLayout="vertical"
          size="large"
          :pagination="false"
          :dataSource="formattedPosts"
          :loading="postsLoading"
        >
          <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
            <template slot="extra">
              <span>
                <a-badge :status="item.statusProperty.status" :text="item.statusProperty.text" />
              </span>
            </template>
            <a-list-item-meta>
              <template slot="description">
                {{ item.createTime | moment }}
              </template>
              <span
                slot="title"
                style="max-width: 300px;display: block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
              >
                <a-icon
                  type="pushpin"
                  v-if="item.topPriority !== 0"
                  theme="twoTone"
                  twoToneColor="red"
                  style="margin-right: 3px;"
                />
              </span>
            </a-list-item-meta>
            <span> {{ item.summary }}... </span>
            <br />
            <br />
            <a-tag
              v-for="(category, categoryIndex) in item.categories"
              :key="'category_' + categoryIndex"
              color="blue"
              @click="handleSelectCategory(category)"
              style="margin-bottom: 8px"
              >{{ category.name }}</a-tag
            >
            <br />
            <a-tag
              v-for="(tag, tagIndex) in item.tags"
              :key="'tag_' + tagIndex"
              color="green"
              style="margin-bottom: 8px"
              >{{ tag.name }}</a-tag
            >
          </a-list-item>
        </a-list>

        <!-- Desktop :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectionChange,
            getCheckboxProps: getCheckboxProps
          }"-->
        <a-table
          ref="print"
          v-else
          :rowKey="post => post.id"
          bordered
          :columns="columns"
          :dataSource="formattedPosts"
          :loading="postsLoading"
          :pagination="false"
          :scrollToFirstRowOnChange="true"
        >
          <span slot="categories" slot-scope="categoriesOfPost">
            <a-tag
              v-for="(category, index) in categoriesOfPost"
              :key="index"
              color="blue"
              @click="handleSelectCategory(category)"
              style="margin-bottom: 8px;cursor:pointer"
              >{{ category.name }}</a-tag
            >
          </span>

          <span slot="tags" slot-scope="tags">
            <a-tag v-for="(tag, index) in tags" :key="index" color="green" style="margin-bottom: 8px">{{
              tag.name
            }}</a-tag>
          </span>
          <span slot="createTime" slot-scope="createTime">
            <a-tooltip placement="top">
              <template slot="title">
                {{ createTime | moment }}
              </template>
              {{ createTime | moment }}
            </a-tooltip>
          </span>
        </a-table>
        <div class="page-wrapper">
          <a-pagination
            v-if="posts && posts.length > 0"
            class="pagination"
            :current="pagination.page"
            :total="pagination.total"
            :defaultPageSize="pagination.size"
            :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']"
            showSizeChanger
            @showSizeChange="handlePaginationChange"
            @change="handlePaginationChange"
            showLessItems
          />
        </div>
      </div>
    </a-card>
  </page-view>
</template>

<script>
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import { PageView } from '@/layouts'
import categoryApi from '@/api/category'
import postApi from '@/api/post'

const columns = [
  {
    title: '编号',
    key: 'deviceNum',
    dataIndex: 'deviceNum'
  },
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
    scopedSlots: { customRender: 'postTitle' }
  },
  {
    title: '类别',
    dataIndex: 'categories',
    scopedSlots: { customRender: 'categories' }
  },
  {
    title: '规格',
    dataIndex: 'norms',
    key: 'norms'
  },
  {
    title: '单位',
    dataIndex: 'deviceType',
    key: 'deviceType'
  },
  {
    title: '单价',
    key: 'price',
    dataIndex: 'price'
  },
  {
    title: '库存数量',
    key: 'stock',
    dataIndex: 'stock'
  },

  {
    title: '入库人员',
    key: 'importPeople',
    dataIndex: 'importPeople'
  },
  {
    title: '入库时间',
    dataIndex: 'createTime',
    width: '170px',
    scopedSlots: { customRender: 'createTime' }
  }
]
export default {
  components: { PageView },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      postStatus: postApi.postStatus,
      pagination: {
        page: 1,
        size: 10,
        sort: null,
        total: 1
      },
      queryParam: {
        page: 0,
        size: 10,
        sort: null,
        keyword: null,
        categoryId: null,
        status: null
      },
      // 表头
      columns,
      selectedRowKeys: [],
      categories: [],
      selectedMetas: [
        {
          key: '',
          value: ''
        }
      ],
      posts: [],
      postsLoading: false,
      categoriesLoading: false,
      postSettingVisible: false,
      postCommentVisible: false,
      selectedPost: {},
      selectedTagIds: [],
      selectedCategoryIds: []
    }
  },
  computed: {
    formattedPosts() {
      return this.posts.map(post => {
        post.statusProperty = this.postStatus[post.status]
        return post
      })
    }
  },
  beforeMount() {
    this.handleListCategories()
  },
  destroyed: function() {
    if (this.postSettingVisible) {
      this.postSettingVisible = false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.query.page) {
        vm.pagination.page = Number(to.query.page) + 1
      }
      if (to.query.size) {
        vm.pagination.size = Number(to.query.size)
      }

      vm.queryParam.sort = to.query.sort
      vm.queryParam.keyword = to.query.keyword
      vm.queryParam.categoryId = to.query.categoryId
      vm.queryParam.status = to.query.status

      vm.handleListPosts()
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.postSettingVisible) {
      this.postSettingVisible = false
    }
    next()
  },
  watch: {
    queryParam: {
      deep: true,
      handler: function(newVal) {
        if (newVal) {
          const params = JSON.parse(JSON.stringify(this.queryParam))
          const path = this.$router.history.current.path
          this.$router.push({ path, query: params }).catch(err => err)
        }
      }
    }
  },
  methods: {
    printPost() {
      this.$print(this.$refs.print)
    },
    handleListPosts(enableLoading = true) {
      if (enableLoading) {
        this.postsLoading = true
      }
      // Set from pagination
      this.queryParam.page = this.pagination.page - 1
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      postApi
        .query(this.queryParam)
        .then(response => {
          this.posts = response.data.data.content
          console.log(this.posts)
          this.pagination.total = response.data.data.total
        })
        .finally(() => {
          setTimeout(() => {
            this.postsLoading = false
          }, 200)
        })
    },
    handleListCategories() {
      this.categoriesLoading = true
      categoryApi
        .listAll(true)
        .then(response => {
          this.categories = response.data.data
        })
        .finally(() => {
          setTimeout(() => {
            this.categoriesLoading = false
          }, 200)
        })
    },
    handleEditClick(post) {
      this.$router.push({ name: 'PostEdit', query: { postId: post.id } })
    },
    onSelectionChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.$log.debug(`SelectedRowKeys: ${selectedRowKeys}`)
    },
    getCheckboxProps(post) {
      return {
        props: {
          disabled: this.queryParam.status == null || this.queryParam.status === '',
          name: post.title
        }
      }
    },
    handlePaginationChange(page, pageSize) {
      this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page
      this.pagination.size = pageSize
      this.handleListPosts()
    },
    handleResetParam() {
      this.queryParam.keyword = null
      this.queryParam.categoryId = null
      this.queryParam.status = null
      this.handleClearRowKeys()
      this.handlePaginationChange(1, this.pagination.size)
      this.handleListCategories()
    },
    handleQuery() {
      this.handleClearRowKeys()
      this.handlePaginationChange(1, this.pagination.size)
    },
    handleSelectCategory(category) {
      this.queryParam.categoryId = category.id
      this.handleQuery()
    },

    handleEditStatusMore(status) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请至少选择一项！')
        return
      }
      postApi
        .updateStatusInBatch(this.selectedRowKeys, status)
        .then(() => {
          this.$log.debug(`postId: ${this.selectedRowKeys}, status: ${status}`)
          this.selectedRowKeys = []
        })
        .finally(() => {
          this.handleListPosts()
        })
    },
    handleClearRowKeys() {
      this.selectedRowKeys = []
    },

    onRefreshPostFromSetting(post) {
      this.selectedPost = post
    },
    onRefreshTagIdsFromSetting(tagIds) {
      this.selectedTagIds = tagIds
    },
    onRefreshCategoryIdsFromSetting(categoryIds) {
      this.selectedCategoryIds = categoryIds
    },
    onRefreshPostMetasFromSetting(metas) {
      this.selectedMetas = metas
    }
  }
}
</script>
