// index.js
import { generateImage, setApiToken } from "../../utils/api";
import { saveHistory } from "../../utils/storage";

Page({
  data: {
    inputText: "",
    isGenerating: false,
    selectedPreset: "",
    presets: ["蛇年", "烟花", "祝福", "感恩", "幸福", "欢乐"],
    activeTab: "generate",
  },

  onLoad() {
    // 这里可以设置 API Token
    // setApiToken('your-token-here');
  },

  onInputChange(e) {
    this.setData({
      inputText: e.detail.value,
    });
  },

  onPresetSelect(e) {
    const preset = e.currentTarget.dataset.preset;
    this.setData({
      selectedPreset: preset,
      inputText: `生成一个「${preset}」的封面`,
    });
  },

  async onGenerate() {
    if (!this.data.inputText.trim()) {
      wx.showToast({
        title: "请输入描述或选择主题",
        icon: "none",
      });
      return;
    }

    this.setData({ isGenerating: true });

    try {
      const matches = this.data.inputText.match(/「([^」]+)」/);
      const image_prompt = matches ? matches[1] : this.data.inputText;
      console.log("准备调用工作流...");
      const { imageUrl, debugUrl } = await generateImage(image_prompt);
      console.log("工作流调用成功，图片URL:", imageUrl);

      if (debugUrl) {
        console.log("调试链接:", debugUrl);
      }

      // 保存到历史记录
      const record = {
        id: Date.now(),
        imageUrl: imageUrl,
        description: this.data.inputText,
        generateTime: new Date().toLocaleString(),
        debugUrl,
      };
      saveHistory(record);

      // 跳转到预览页面
      wx.navigateTo({
        url: `/pages/preview/preview?id=${
          record.id
        }&imageUrl=${encodeURIComponent(
          imageUrl
        )}&description=${encodeURIComponent(this.data.inputText)}`,
      });
    } catch (error) {
      console.error("生成失败:", error);

      let errorMessage = "生成失败，请重试";
      if (error.message.includes("网络请求失败")) {
        errorMessage = "网络连接失败，请检查网络";
      } else if (error.message.includes("解析返回数据失败")) {
        errorMessage = "数据格式错误，请重试";
      } else if (error.message.includes("HTTP错误")) {
        errorMessage = "服务器响应错误，请重试";
      } else if (error.message.includes("工作流执行失败")) {
        errorMessage = "生成失败，请换个描述重试";
      }

      wx.showToast({
        title: errorMessage,
        icon: "none",
        duration: 3000,
      });
    } finally {
      this.setData({ isGenerating: false });
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  navigateToHistory() {
    wx.navigateTo({
      url: "/pages/history/history",
    });
  },
});
