<template>
  <div>
    <el-table
      height="600px"
      :data="dataList"
      border
      highlight-current-row
      style="width: 100%;min-height: 400px"
    >
      <el-table-column prop="id" show-overflow-tooltip label="记录ID" min-width="120" align="center"/>
      <el-table-column prop="crm_user_name" show-overflow-tooltip label="客户名称" min-width="130" align="center"/>
      <el-table-column
        prop="contact_name"
        label="联系人名称"
        align="center"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="follow_time"
        label="跟进时间"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{row.follow_time | toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="follow_type"
        label="跟进类型"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{row.follow_type | getTypeById}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="follow_record"
        label="跟进内容"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="remark"
        label="备注"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="next_contact_time"
        label="下次联系时间"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{row.next_contact_time | toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creat_time"
        label="创建时间"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
        <template slot-scope="{row}">
          <span>{{row.creat_time | toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="creat_admin_name"
        label="创建人"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>

<script>
  import config from '@/config'
  export default {
    filters:{
      getTypeById(type){
        let temp = config.follow_types.filter(item=> item.id == type)
        return temp.length > 0 ? temp[0].name : ''
      },
    },
    props: {
      dataList: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    data(){
      return{

      }
    },
    created() {

    },
    methods:{

    },
  }
</script>

<style scoped>

</style>
