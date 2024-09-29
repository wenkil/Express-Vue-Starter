<template>
  <div>
    <el-table
      height="600px"
      :data="dataList"
      border
      highlight-current-row
      style="width: 100%;min-height: 400px"
    >
      <el-table-column prop="goods_name" show-overflow-tooltip label="产品名称" min-width="120" align="center"/>
      <el-table-column prop="goods_status" label="状态" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag :type="row.goods_status == 1 ? 'success': 'danger'">
            {{row.goods_status == 1 ? '启用' : '禁用'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="goods_type_id" label="产品类型" align="center" min-width="300" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{getGoodsType(row.goods_type_id)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goods_price" label="产品价格" align="center" min-width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.goods_price | toMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goods_intro" label="产品简介" align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.goods_intro}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center" min-width="200" show-overflow-tooltip/>
      <el-table-column prop="admin_name" label="最后操作人" align="center" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="creat_time" label="创建时间" align="center" min-width="160" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.creat_time | toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间" align="center" min-width="160" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.update_time | toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" min-width="180">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button size="mini" :type="row.goods_status == 1 ? 'danger' : 'success'" @click="onStatus(row)">
            {{row.goods_status == 1 ? '禁用' : '启用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <goods-list-form ref="goodsListForm" :openType="2" @refresh="onRefresh"></goods-list-form>
  </div>
</template>

<script>
  import { getGoodsAllLevelList, goodsList } from '@/api/goods'
  import GoodsListForm from './form'

  export default {
    components: { GoodsListForm },
    props: {
      dataList: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        goodsList: []
      }
    },
    async created() {
      await this.getGoodsList()
    },
    methods: {

      onStatus(row) {
        this.$confirm(`确定${row.goods_status == 1 ? '禁用' : '启用'}该产品?`, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            goodsList({
              type: 2,
              goods_id: row.goods_id,
              goods_status: row.goods_status == 1 ? 2 : 1
            }, this.openType == 1 ? 'add' : 'edit').then(res => {
              if (res.code == 200) {
                this.onRefresh()
              } else {
                this.$message.error(res.msg)
              }
            })
          })
          .catch((action) => {
          })

      },

      onRefresh() {
        this.$emit('getTableList')
      },
      onEdit(row) {
        this.$refs.goodsListForm.openModel(row)
      },

      getGoodsList() {
        this.goodsList = []
        return new Promise((resolve, reject) => {
          getGoodsAllLevelList({}).then(res => {
            if (res.code == 200) {
              this.goodsList = res.data.list
              resolve()
            } else {
              this.$message.error(res.msg)
              resolve()
            }
          })
        })
      },

      getGoodsType(type) {
        let arr = this.goodsList.filter(v => v.type_name_id == type)
        let str = arr.length ?
          arr[0].class_name + '-' +
          arr[0].branch_name + '-' +
          arr[0].type_name + '-' +
          arr[0].type_name_name
          : ''
        return str
      }
    }
  }
</script>

<style scoped>

</style>
