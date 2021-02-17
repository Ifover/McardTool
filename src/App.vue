<template>
  <div id="container">
    <fieldset>
      <legend>
        我的卡箱
        [<a title="点我刷新" @click="handleReload">刷</a>]
        [<a @click="handleRandomGet">抽({{ randChance }})</a>]
      </legend>
      <p style="display: flex;width:320px;margin-left: 60px;">
        <span style="display: inline-block;flex: 1">卡名</span>
        <span style="display: inline-block;width: 50px;">价格</span>
        <span style="display: inline-block;width: 130px;">套卡</span>
      </p>
      <div class="card-box">
        <Tree :data="treeData"
              show-checkbox check-directly
              multiple
              @on-check-change="handleCheckChange"
              @on-contextmenu="handleContextMenu"
        >
          <template slot="contextMenu">
            <DropdownItem>编辑</DropdownItem>
            <DropdownItem style="color: #ed4014">删除</DropdownItem>
          </template>
        </Tree>
      </div>
    </fieldset>
    <div class="control-box">
          <Button size="small" type="primary"
                  title="勾起来然后卖掉"
                  :loading="isSelling"
                  :disabled="selectTree.length === 0"
                  @click="handleSell">{{
              isSelling ? `卖卡中[${sellNum}/${selectTree.filter(v => {
                return v.id
              }).length}]` : '一键卖卡'
            }}</Button>
    </div>


  </div>
</template>

<script>
const {getCardName, getCard, getTheme} = CARD.data
const renderCard = function (h, {root, node, data}, item) {
  return h('div', {
    style: {
      display: 'flex'
    }
  }, [
    h('p', {
      style: {
        width: '140px'
      }
    }, (item.unlock ? (item.unlock !== '0' ? '[锁]' : '') : '') + getCardName(item.id)),
    h('p', {
      style: {
        width: '40px'
      }
    }, getCard(item.id)[3]),
    h('p', {
      style: {
        width: '80px'
      }
    }, getTheme(getCard(item.id)[1])[1]),
  ])
}
export default {
  data() {
    return {
      msg: "华莱士",
      isSelling: false,
      sellNum: 0,
      treeData: [],
      selectTree: [],
      randChance: 0,
    };
  },
  mounted() {
    this.loadCardBox()
  },
  methods: {
    handleContextMenu() {

    },
    async handleSell() {
      this.isSelling = true
      for (let item of this.selectTree) {
        if (!item.children) {
          let {slot, id, type} = item
          let data = {
            slot_no: slot,
            cardid: id,
            uin: CARD._iUin,
            type
          }
          await this.$axios.post("/card_market_npc_sell", data)
          this.sellNum++
        }
      }
      this.isSelling = false
      this.sellNum = 0
      this.$Message.success("卖好了")
      this.loadCardBox()
      CARD.getFlashObj().refresh()
    },
    handleCheckChange(nodes, current) {
      this.selectTree = nodes
      console.log(nodes);
    },
    // 一键抽取
    handleRandomGet() {
      let data = {
        type: 2
      }
      this.$axios.post("/card_user_random_get", data).then(res => {
        this.$Message.success("抽好了")
        this.loadCardBox()

      })

    },
    // 刷新
    async handleReload() {
      await this.loadCardBox()
      this.$Message.success("刷新成功")
    },
    async loadCardBox() {
      let data = {
        'is_weiduan': 0,
        'uin': 1224842990,
        'opuin': 1224842990,
      };
      let treeData = []
      await this.$axios.post("/card_user_mainpage", data).then((res) => {
        //#region 塞卡
        let changebox = []
        let storeboxbox = []
        for (let item of res.changebox.card) {
          if (item.id !== '0') {
            changebox.push({
              ...item,
              uid: `0_${item.slot}_${item.id}`,
              cardName: getCardName(item.id),
              cardPrice: getCard(item.id)[3],
              themeName: getTheme(getCard(item.id)[1])[1],
              contextmenu: true,
              render: (h, {root, node, data}) => {
                return renderCard(h, {root, node, data}, item)
              }
            })
          }
        }
        for (let item of res.storebox.card) {
          if (item.id !== '0') {
            storeboxbox.push({
              ...item,
              uid: `1_${item.slot}_${item.id}`,
              cardName: getCardName(item.id),
              cardPrice: getCard(item.id)[3],
              themeName: getTheme(getCard(item.id)[1])[1],
              render: (h, {root, node, data}) => {
                return renderCard(h, {root, node, data}, item)
              }
            })
          }
        }
        treeData.push({
          uid: 'x1',
          title: `换卡箱[${res.changebox.card.filter(v => {
            return v.id !== '0'
          }).length}/${res.changebox.cur}]`,
          children: changebox,
          expand: true
        })
        treeData.push({
          uid: 'x2',
          title: `保险箱[${res.storebox.card.length}/${res.storebox.cur}]`,
          children: storeboxbox,
          expand: true
        })

        this.treeData = treeData
        //#endregion
        this.randChance = res.user.randchance  //随机次数
      })
    }
  }
}
</script>

<style lang="less" scoped>
#container {
  position: fixed;
  right: 10px;
  top: 40px;
  width: 430px;
  min-height: 300px;
  padding: 5px;
  background-color: #fcfcfc;
  border-radius: 3px;
  border: 1px solid #a0a0a0;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.3);
}

.card-box {
  height: 300px;
  overflow-y: scroll;
}

.control-box {
  margin: 5px 0;
}

/deep/ .ivu-tree ul li {
  margin: 0;
}

fieldset {
  //width: 270px;
  height: auto;
  border: 2px groove #ccc;
  border-radius: 3px;
  padding: 4px 9px 6px 9px;
  //margin: 2px !important;
  display: block;

}

#container {
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent);
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
  }
}


</style>
