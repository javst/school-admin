<template>
  <page-view>
    <a-row>
      <a-col :span="24">
        <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
          <a-card :bordered="false" class="environment-info" :bodyStyle="{ padding: '16px' }">
            <a href="https://wsw.cool" target="_blank" class="mr-3"
              >官网
              <a-icon type="link" />
            </a>
          </a-card>

          <a-card title="开发者" :bordered="false" :bodyStyle="{ padding: '16px' }" :loading="contributorsLoading">
            wcool
          </a-card>
        </a-card>
      </a-col>

      <a-col :span="24"> </a-col>
    </a-row>

    <a-modal
      :title="versionContentModalTitle"
      :visible="versionContentVisible"
      ok-text="查看更多"
      @cancel="versionContentVisible = false"
      @ok="handleOpenVersionUrl"
      :width="620"
    >
      <div v-html="versionContent"></div>
    </a-modal>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
export default {
  components: {
    PageView
  },
  data() {
    return {}
  }
}
</script>
