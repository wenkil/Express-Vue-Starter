<template>
  <div class="app-container">
    <el-button @click="addFirst" type="primary" size="mini">新增产品类别</el-button>
    <el-row>
      <el-col :span="8">
        <el-tree
          :props="props"
          :load="loadNode"
          :data="setTree"
          @node-click="clickFn"
          lazy
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="label">{{ node.label }}</span>
            <span>
              <template v-for="(item, index) in method">
                  <i
                    v-if="!(item == 'add' && node.level == 4)"
                    :class="'el-icon-' + item"
                    @click.stop="() => optionFun(node, data, item)"
                    style="margin-right: 10px"
                    :key="index"
                  ></i>
              </template>
            </span>
          </span>
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { goodsType, goodsTypeCheckrelevance } from '@/api/goods'

  export default {

    data() {
      return {
        dataDetail: null,
        setTree: [],
        oneTree: [],
        props: {
          label: 'name',
          isLeaf: 'leaf'
        },
        currentModel: false,
        method: ['add', 'edit', 'delete'],
        titleList: ['产品类别', '产品分类', '产品名称', '产品名称']
      }
    },
    methods: {
      clickFn(data, node, dom) {
        // console.log('click', data)
        // node.data.title = this.titleList[data.type - 1]
      },
      async loadNode(node, resolve) {
        // console.log('node', node)
        if (node.level == 4) return resolve([])
        //判断一级 二级
        let data = { type: node.level + 1 }
        if (node.level != 0) {
          data.pid = node.data.id
        }
        let list = await this.getTreeData(data)
        if (node.level === 0) {
          this.oneTree = list
        }
        return resolve(list)
      },

      getTreeData(data) {
        // console.log('data', data)
        return new Promise((resolve, reject) => {
          goodsType(data, 'list').then(res => {
            if (res.code == 200) {
              let list = res.data.list.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                  leaf: data.type == 4 ? true : false
                }
              })
              resolve(list)
            } else {
              this.$message.error(res.msg)
              resolve([])
            }
          })
        })
      },

      //新增时节点type需要加1提交,因为data里的type是当前节点的level
      add(data) {
        // console.log('add', data)
        let d = {
          type: data.type + 1,
          name: data.name
        }
        if (data.type >= 1) {
          d.pid = data.id
        }
        return new Promise((resolve, reject) => {
          goodsType(d, 'add').then(res => {
            if (res.code == 200) {
              resolve(res.data)
            } else {
              this.$message.error(res.msg)
              reject({})
            }
          })
        })
      },

      //编辑时可以直接提交type值
      edit(data) {
        // console.log('edit', data)
        if (data.name.length > 10) {
          this.$message.error('字段长度不得大于10')
          return
        }
        return new Promise((resolve, reject) => {
          goodsType(data, 'edit').then(res => {
            if (res.code == 200) {
              resolve(res.data)
            } else {
              this.$message.error(res.msg)
              reject([])
            }
          })
        })
      },
      async delete(data) {
        return new Promise((resolve, reject) => {
          goodsType({ type: data.type, id: data.id }, 'delete').then(res => {
            if (res.code == 200) {
              resolve(res.data)
            } else {
              this.$message.error(res.msg)
              reject([])
            }
          })
        })
      },

      addFirst() {
        this.optionFun(null, { title: '产品类别' }, 'add')
      },

      async optionFun(node, data, type) {
        // console.log('点击图标', node)
        this.currentModel = true
        let type_title = '' // 弹窗标题
        let type_text = '' // 弹窗内容
        let defaultData = {}
        switch (type) {
          case 'add':
            type_title = '新增'
            //填充默认值
            defaultData = {
              inputPlaceholder: `请输入产品类别名称`,
              inputValidator: (value) => {
                if (value) {
                  if (value.trim().length < 1) {
                    return '输入不能为空'
                  }
                  if (value.trim().length > 10) {
                    return '输入字符长度不得大于10'
                  }
                } else {
                  return '输入不得为空'
                }
              }
            }
            break
          case 'edit':
            type_title = '编辑'
            //填充默认值
            defaultData = {
              inputPlaceholder: `请输入名称`,
              inputValue: data.name,
              inputValidator: (value) => {
                if (value) {
                  if (value.trim().length < 1) {
                    return '输入不能为空'
                  }
                  if (value.trim().length > 10) {
                    return '输入字符长度不得大于10'
                  }
                } else {
                  return '输入不得为空'
                }
              }
            }
            break
          case 'delete':
            type_title = '删除'
            //填充默认值
            type_text = `确定要删除${data.name}?`
            break
        }
        const MessageBoxType = type == 'delete' ? '$confirm' : '$prompt' // 判断弹窗类型
        this[MessageBoxType](
          type_text,
          `${type_title}`,
          defaultData
        ).then(async({ value }) => {
          // console.log('>>>>>>>', value)
          let d = {
            type: node == null ? 0 : node.level,
            id: data.id,
            name: value
          }
          // 新增
          if (type == 'add') {
            let res = await this.add(d)
            let newChild = { id: res.id, name: value, children: [] }
            newChild.leaf = node && node.level == 3 ? true : false
            // if (res.leaf) { // 是否有子集
            //
            // }
            if (res.title) { // title
              newChild.title = res.title
            }
            if (!data.children) {
              this.$set(data, 'children', [])
            }
            if (node == null) {
              this.setTree = this.oneTree
              this.setTree.push(newChild)
            } else {
              this.$refs['tree'].append(newChild, node)
            }
            return false
          }
          // 编辑
          if (type == 'edit') {
            await this.edit(d)
            data.name = value
            return false
          }
          // 删除
          if (type == 'delete') {
            delete d.name
            // console.log('删除',data,',,,,',d)
            if (d.type == 4) {
              //检查该id是否关联了产品,
              let checkRes = await goodsTypeCheckrelevance({ id: d.id })
              if (checkRes.code == 200) {
                if (checkRes.data.list && checkRes.data.list[0].ids != 0) {
                  this.$message.error('此类型已关联产品列表,不可删除')
                } else {
                  await this.delete(d)
                  const parent = node.parent
                  this.$refs['tree'].remove(node)
                }
              } else {
                this.$message.error(res.msg)
              }
            } else {
              await this.delete(d)
              const parent = node.parent
              this.$refs['tree'].remove(node)
            }
          }
        })
          .catch(err => {
          })
      }
    }
  }
</script>
<style scoped>
  /deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /deep/ .el-tree-node__content {
    display: flex;
    align-items: center;
    height: 26px;
    cursor: pointer;
    margin: 8px 0;
  }

  /deep/ .el-icon-add:before {
    content: "\e783";
  }

  /deep/ .el-icon-edit:before {
    content: "\e764";
  }

  .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    max-width: 145px;
  }
</style>
