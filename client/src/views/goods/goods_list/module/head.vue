<template>
  <div>
    <el-form inline>
      <el-form-item label="产品名称">
        <el-input v-model="listQuery.goods_name" clearable
                  @clear="onSearch"
                  @keydown.enter.native="onSearch"></el-input>
      </el-form-item>
      <el-form-item label="产品状态">
        <el-select
          v-model="listQuery.goods_status"
          clearable
          @change="onSearch"
        >
          <el-option
            v-for="item in [
              {id:1,name:'启用'},
              {id:2,name:'禁用'}
            ]"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品分类">
        <el-select
          style="width: 300px"
          v-model="listQuery.goods_type_id"
          multiple
          :multiple-limit="1"
          :trigger-on-focus="false"
          filterable
          remote
          :remote-method="getGoodsTypeList"
          placeholder="请输入第四级关键字模糊搜索"
          @change="goodsTypeChange"
          :popper-append-to-body="false"
        >
          <el-option
            v-for="item in goodsTypeList"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button type="primary" @click="onAdd">新增产品</el-button>
      </el-form-item>
    </el-form>

    <goods-list-form ref="goodsListForm" :openType="1" @refresh="onSearch"></goods-list-form>
  </div>
</template>

<script>
  import { getGoodsAllLevelList } from '@/api/goods'
  import GoodsListForm from './form'

  export default {
    components: { GoodsListForm },
    data() {
      return {
        listQuery: {
          page: 1,
          limit: 15,
          goods_name: '',//产品名称
          goods_status: '',
          goods_type_id: []//产品分类id,只查第四级
        },
        goodsTypeList: []
      }
    },
    created() {
      this.onSearch()
    },
    methods: {

      onAdd() {
        this.$refs.goodsListForm.openModel()
      },

      goodsTypeChange(val) {
        this.listQuery.goods_type_id = val && val.length > 0 ? val : ''
        this.onSearch()
      },

      //模索产品名称：type：1是id精确搜索,2是名称模糊搜索
      getGoodsTypeList(name) {
        if (name) {
          return new Promise((resolve, reject) => {
            getGoodsAllLevelList({ type: 2, name }).then(res => {
              if (res.code == 200) {
                this.goodsTypeList = res.data.list.map(v => {
                  return {
                    id: v.type_name_id,
                    value: v.class_name + '-' + v.branch_name + '-' + v.type_name + '-' + v.type_name_name
                  }
                })
                resolve()
              } else {
                this.$message.error(res.msg)
                resolve()
              }
            })
          })
        }
      },

      onSearch() {
        this.$emit('getList', this.listQuery)
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-select-dropdown__item {
    max-width: 280px;
    height: auto;
    white-space: normal;
    line-height: 30px !important;
  }

  /deep/ .el-tag.el-tag--info {
    max-width: 280px;
    height: auto;
  }

  /deep/ .el-select__tags-text {
    max-width: 280px;
    white-space: normal;
  }

  /deep/ .el-input__inner {
    height: auto;
  }
</style>
