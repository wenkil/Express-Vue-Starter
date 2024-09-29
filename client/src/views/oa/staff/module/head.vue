<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-form-item label="员工名称">
          <el-input
            style="width: 220px"
            v-model="listQuery.name"
            clearable
            @change="onSearch"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button type="primary" @click="onOpenModel">新增员工</el-button>
      </el-form-item>
    </el-form>

    <staff-form :openType="1" ref="StaffForm" @getList="onSearch"></staff-form>
  </div>
</template>

<script>
  import StaffForm from './form'

  export default {
    components: { StaffForm },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 15,
          name: '',
          entry_date_start: '',
          entry_date_end: ''
        }
      }
    },
    created() {
      this.onSearch()
    },
    methods: {
      onSearch() {
        this.$emit('getList', this.listQuery)
      },

      onOpenModel() {
        this.$refs.StaffForm.openModel()
      }
    }
  }
</script>

<style scoped>

</style>
