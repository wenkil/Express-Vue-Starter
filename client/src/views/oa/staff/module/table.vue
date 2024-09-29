<template>
  <div>
    <el-table
      height="600px"
      :data="dataList"
      border
      highlight-current-row
      style="width: 100%;min-height: 400px"
    >
      <el-table-column prop="name" show-overflow-tooltip label="名称" min-width="120" align="center"/>
      <el-table-column prop="depart_id" show-overflow-tooltip label="部门" min-width="150" align="center">
        <template slot-scope="{row}">
          <span>{{getDepById(row.depart_id)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.gender == 1 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag :type="row.status == 1 ? 'success': 'danger'">
            {{row.status == 1 ? '在职' : '离职'}}
          </el-tag>
          <!--          <span :style='{color:row.status == 1 ? "#31a547":"#ff8b8f"}'></span>-->
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="mail" label="邮箱" align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="contact_way" label="其他联系方式" align="center" min-width="120" show-overflow-tooltip/>
      <el-table-column prop="paper_type" label="证件类型" align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="paper_data" label="证件号" align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="birthday" label="生日" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.birthday | toDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_married" label="是否已婚" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.is_married | marriedType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_birth" label="是否已育" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.is_birth | birthType}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="education" label="最高学历" align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="politics_status" label="政治面貌" align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="native_place" label="籍贯" align="center" min-width="180" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{getArea(row.native_place)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="native_location" label="详细地址" align="center" min-width="180" show-overflow-tooltip/>
      <el-table-column prop="current_address" label="现居住地" align="center" min-width="180" show-overflow-tooltip/>
      <el-table-column label="紧急联系人" align="center">
        <el-table-column prop="emergency_contact" label="姓名" align="center" min-width="130" show-overflow-tooltip/>
        <el-table-column prop="emergency_contact_phone" label="电话" align="center" min-width="130"
                         show-overflow-tooltip/>
      </el-table-column>
      <el-table-column prop="entry_date" label="入职日期" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.entry_date | toDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="probation_start_date" label="试用期" align="center" min-width="240" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>【{{row.probation_start_date | toDate}}】</span>~
          <span>【{{row.probation_end_date | toDate}}】</span>
        </template>
      </el-table-column>
      <el-table-column prop="dimission_date" label="离职日期" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.dimission_date | toDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dimission_cause" label="离职原因" align="center" min-width="150" show-overflow-tooltip/>
      <el-table-column prop="create_time" label="创建时间" align="center" min-width="180" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.create_time | toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center" min-width="180" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.update_time | toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="admin_name" label="最后操作人" align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column fixed="right" label="操作" align="center" min-width="180">
        <template slot-scope="{row}" v-if="row.status == 1">
          <el-button size="mini" type="primary" @click="editForm(row)">编辑</el-button>
          <el-button size="mini" type="warning" @click="dimissForm(row)">员工离职</el-button>
        </template>
      </el-table-column>
    </el-table>

    <staff-form :openType="2" ref="StaffForm" @getList="getTableList"></staff-form>
    <dimission-form ref="dimissionform" @getList="getTableList"></dimission-form>
  </div>
</template>

<script>
  import { regionData } from 'element-china-area-data'
  import { depList } from '@/api/department'
  import StaffForm from './form'
  import DimissionForm from './DimissionForm'

  export default {
    components: { StaffForm, DimissionForm },
    props: {
      dataList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    filters: {
      marriedType(type) {
        return type ? (type == 1 ? '是' : '否') : ''
      },
      birthType(type) {
        return type ? (type == 1 ? '是' : '否') : ''
      }
    },
    data() {
      return {
        departMentList: []
      }
    },
    async created() {
      await this.getDepartList()
    },
    methods: {

      dimissForm(row){
        this.$refs.dimissionform.openModel(row)
      },

      editForm(row) {
        this.$refs.StaffForm.openModel(row)
      },

      getTableList() {
        this.$emit('getTableList')
      },

      getDepartList() {
        this.departMentList = []
        return new Promise((resolve, reject) => {
          depList({}).then(res => {
            if (res.code == 200) {
              this.departMentList = res.data.list.length ? res.data.list[0].children : []
              resolve()
            } else {
              this.$message.error(res.msg)
              resolve()
            }
          })
        })
      },

      getDepById(idStr) {
        this.dep_list = idStr.split(',')
        return this.forFun(this.departMentList)
      },

      forFun(obj, index = 0) {
        let name = ''
        let temp = obj.length ? obj.filter(v => v.id == this.dep_list[index]) : []
        if (temp.length) {
          name += temp[0].name
          if (temp[0].children) {
            index += 1
            name += '/' + this.forFun(temp[0].children, index)
          }
        }
        return name
      },

      getArea(address) {
        let list = address.split(',')
        let aeras = regionData.filter(item => {
          return item.value == list[0]
        })
        let areaName = ''
        for (let index in list) {
          if (index == 0) {
            areaName += aeras[0].label + '/'
          } else if (index == 1) {
            let temp = aeras[0].children.filter(item => item.value == list[1])
            areaName += temp[0].label
          } else if (index == 2) {
            let child = aeras[0].children.filter(item => item.value == list[1])[0].children.filter(child => child.value == list[2])
            areaName += ('/' + child[0].label)
          }
        }
        return areaName
      }
    }
  }
</script>

<style scoped>
  .row_span {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
