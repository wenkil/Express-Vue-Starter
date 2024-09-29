<template>
  <div class="dashboard-container">


    <el-card style="min-width: 600px">
      <vue-markdown>{{ systemMd }}</vue-markdown>
    </el-card>
    <!--    <div class="dashboard-text">name: {{ name }}</div>-->
<!--    <div style="min-width: 1000px">-->
<!--      <el-card>-->
<!--        <el-row :gutter="12">-->
<!--          <el-col :span="12">-->
<!--            <el-card>-->
<!--              <div class="body__box">-->
<!--                <div>-->
<!--                  <svg-icon icon-class="time" class="img__class"></svg-icon>-->
<!--                </div>-->
<!--                <div class="body__box__right">-->
<!--                  <span>今日待联系线索</span>-->
<!--                  <a>0</a>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-card>-->
<!--              <div class="body__box">-->
<!--                <div>-->
<!--                  <svg-icon icon-class="clock" class="img__class"></svg-icon>-->
<!--                </div>-->
<!--                <div class="body__box__right">-->
<!--                  <span>逾期未联系线索</span>-->
<!--                  <a>0</a>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-card>-->
<!--              <div class="body__box">-->
<!--                <div>-->
<!--                  <svg-icon icon-class="agreement" class="img__class"></svg-icon>-->
<!--                </div>-->
<!--                <div class="body__box__right">-->
<!--                  <span>昨日新增客户</span>-->
<!--                  <a>0</a>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-card>-->
<!--              <div class="body__box">-->
<!--                <div>-->
<!--                  <svg-icon icon-class="data" class="img__class"></svg-icon>-->
<!--                </div>-->
<!--                <div class="body__box__right">-->
<!--                  <span>昨日下单客户</span>-->
<!--                  <a>0</a>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--        </el-row>-->

<!--        <el-row :gutter="12">-->
<!--          <el-col :span="12">-->
<!--            <el-card>-->
<!--              <div class="body__box">-->
<!--                <div>-->
<!--                  <svg-icon icon-class="clock" class="img__class"></svg-icon>-->
<!--                </div>-->
<!--                <div class="body__box__right">-->
<!--                  <span>昨日订单总金额</span>-->
<!--                  <a>0</a>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-card>-->
<!--              <div class="body__box">-->
<!--                <div>-->
<!--                  <svg-icon icon-class="graph" class="img__class"></svg-icon>-->
<!--                </div>-->
<!--                <div class="body__box__right">-->
<!--                  <span>昨日回款总金额</span>-->
<!--                  <a>0</a>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-card>-->
<!--              <div class="body__box">-->
<!--                <div>-->
<!--                  <svg-icon icon-class="analytic" class="img__class"></svg-icon>-->
<!--                </div>-->
<!--                <div class="body__box__right">-->
<!--                  <span>今日待审批订单</span>-->
<!--                  <a>0</a>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-card>-->
<!--              <div class="body__box">-->
<!--                <div>-->
<!--                  <svg-icon icon-class="analytic" class="img__class"></svg-icon>-->
<!--                </div>-->
<!--                <div class="body__box__right">-->
<!--                  <span>今日待审批回款</span>-->
<!--                  <a>0</a>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-card>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </el-card>-->
<!--    </div>-->

  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import VueMarkdown from 'vue-markdown'
import systemMd from '../system/system.md'

export default {
  name: 'Dashboard',
  // computed: {
  //   ...mapGetters([
  //     'name'
  //   ])
  // },
  components: {VueMarkdown},
  data() {
    return {
      systemMd: systemMd
    }
  },
  created() {
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.img__class {
  width: 90px;
  height: 90px;
}

::v-deep .el-card {
  margin-top: 20px;
}

.body__box {
  display: flex;
  flex-direction: row;
  align-items: center;

  .body__box__right {
    user-select: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 50px;

    span {
      font-size: 16px;
    }

    a {
      color: #1482f0;
      font-size: 28px;
    }
  }
}
</style>
