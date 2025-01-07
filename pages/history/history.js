// pages/history/history.js
import { getHistory, clearHistory } from "../../utils/storage";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.loadHistory();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时刷新历史记录
    this.loadHistory();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadHistory();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  loadHistory() {
    const history = getHistory();
    this.setData({ historyList: history });
  },

  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/preview/preview?id=${item.id}`,
    });
  },

  onClearHistory() {
    wx.showModal({
      title: "提示",
      content: "确定要清空所有历史记录吗？",
      success: (res) => {
        if (res.confirm) {
          clearHistory();
          this.setData({ historyList: [] });
          wx.showToast({
            title: "清空成功",
            icon: "success",
          });
        }
      },
    });
  },
});
