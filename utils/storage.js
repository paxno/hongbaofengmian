const HISTORY_KEY = "red_packet_history";

export const saveHistory = (record) => {
  try {
    let history = wx.getStorageSync(HISTORY_KEY) || [];
    history.unshift(record); // 新记录添加到开头
    // 最多保存20条记录
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    wx.setStorageSync(HISTORY_KEY, history);
    return true;
  } catch (error) {
    console.error("保存历史记录失败:", error);
    return false;
  }
};

export const getHistory = () => {
  try {
    return wx.getStorageSync(HISTORY_KEY) || [];
  } catch (error) {
    console.error("获取历史记录失败:", error);
    return [];
  }
};

export const clearHistory = () => {
  try {
    wx.removeStorageSync(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error("清除历史记录失败:", error);
    return false;
  }
};
