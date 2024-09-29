<template>
  <div>
    <el-form inline>
      <el-form-item label="线索名称">
        <el-input
          style="width: 240px"
          v-model.trim="listQuery.clue_name"
          clearable
          @clear="onSearch"
          @keydown.enter.native="onSearch"
        ></el-input>
      </el-form-item>
      <el-form-item label="是否分配">
        <el-select
          style="width: 240px"
          clearable
          @change="onSearch"
          v-model="listQuery.isCharge">
          <el-option
            v-for="item in isCharge_list"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          style="width: 240px"
          v-model.trim="listQuery.clue_phone"
          clearable
          onKeyUp="value=value.replace(/[\W]/g,'')"
          @clear="onSearch"
          @keydown.enter.native="onSearch"
        ></el-input>
      </el-form-item>
      <el-form-item label="线索来源">
        <el-select
          style="width: 240px"
          clearable
          @change="onSearch"
          v-model="listQuery.source_id">
          <el-option
            v-for="item in clue_source_list"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户等级">
        <el-select
          style="width: 240px"
          clearable
          @change="onSearch"
          v-model="listQuery.cus_level">
          <el-option
            v-for="item in clue_level_list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下次联系时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          clearable
          @change="timeChange"
          placeholder="请选择下次联系时间"
          value-format="timestamp"
          :default-time="['00:00:00','23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    clueSourceList
  } from '@/api/clue'
  import { cus_level } from '@/config'

  export default {
    name: 'Cluehead',
    data() {
      return {
        listQuery: {
          clue_name: '',
          isCharge: '',
          clue_phone: '',
          source_id: '',
          cus_level: '',
          next_contact_time_start: '',
          next_contact_time_end: '',
          page: 1,
          limit: 15
        },
        time: [],
        clue_source_list: [],//线索来源
        isCharge_list: [
          { id: 1, value: '未分配' },
          { id: 2, value: '已分配' }
        ],
        clue_level_list: cus_level
      }
    },

    created() {
      this.onSearch()
      this.getSourceList()
    },

    methods: {
      onSearch() {
        this.$emit('getList', this.listQuery)
      },

      getSourceList() {
        this.clue_source_list = []
        clueSourceList({ page: 1, limit: 500 }).then(res => {
          if (res.code == 200) {
            this.clue_source_list = res.data.list.map(item => {
              return {
                value: item.source_name,
                id: item.id
              }
            })
          } else {
            this.$message.error(res.msg)
          }
        })
      },

      timeChange(val) {
        if (!val || val.length == 0) {
          this.time = []
          this.listQuery.next_contact_time_start = ''
          this.listQuery.next_contact_time_end = ''
        } else {
          this.listQuery.next_contact_time_start = val[0]
          this.listQuery.next_contact_time_end = val[1]
        }
        this.onSearch()
      }

    }
  }
</script>

<style scoped>

</style>
