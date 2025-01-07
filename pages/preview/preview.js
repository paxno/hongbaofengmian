// pages/preview/preview.js
import { getHistory } from "../../utils/storage";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: "", // 这里将来会从生成接口获取
    description: "", // 从首页传递过来的描述文本
    generateTime: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      // 从历史记录中获取
      const history = getHistory();
      const record = history.find((item) => item.id === parseInt(options.id));
      if (record) {
        this.setData({
          imageUrl: record.imageUrl,
          description: record.description,
          generateTime: record.generateTime,
        });
      }
    } else if (options.imageUrl) {
      // 直接从参数获取
      this.setData({
        imageUrl: decodeURIComponent(options.imageUrl),
        description: decodeURIComponent(options.description),
        generateTime: new Date().toLocaleString(),
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  async onSave() {
    try {
      // 先下载图片到本地
      const res = await wx.downloadFile({
        url: this.data.imageUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.showToast({
                  title: "保存成功",
                  icon: "success",
                });
              },
              fail: (error) => {
                console.error("保存失败:", error);
                wx.showToast({
                  title: "保存失败",
                  icon: "error",
                });
              },
            });
          }
        },
      });
    } catch (error) {
      console.error("下载失败:", error);
      wx.showToast({
        title: "保存失败",
        icon: "error",
      });
    }
  },

  onRegenerate() {
    wx.navigateBack();
  },
});
