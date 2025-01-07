const COZE_API_URL = "https://api.coze.cn/v1/workflow/run";
const COZE_API_TOKEN =
  "pat_zzp9w3HdnZDEDuOeK0cCMA2KA4IpRhQsLW9ZjuV66xhAkryzts9INzcaVGHX1M8B";
const WORKFLOW_ID = "7457181544315813922";

export const generateImage = async (prompt) => {
  try {
    // 构建完整的提示词，包含尺寸要求
    const fullPrompt = `${prompt} 图片尺寸要求：宽高比1.5:1，分辨率900x600像素。请确保生成的图片严格符合这个尺寸要求。`;

    console.log("开始调用工作流，提示语:", fullPrompt);

    // 使用 Promise 包装 wx.request
    const response = await new Promise((resolve, reject) => {
      const requestData = {
        workflow_id: WORKFLOW_ID,
        parameters: {
          image_prompt: fullPrompt,
        },
      };

      console.log("发送请求数据:", requestData);

      wx.request({
        url: COZE_API_URL,
        method: "POST",
        header: {
          Authorization: `Bearer ${COZE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: requestData,
        success: (res) => {
          console.log("API 原始响应:", res);
          resolve(res);
        },
        fail: (error) => {
          console.error("请求失败:", error);
          if (error.errMsg.includes("domain")) {
            reject(
              new Error(
                "请在开发工具中关闭域名校验，或在小程序管理后台配置合法域名"
              )
            );
          } else {
            reject(new Error("网络请求失败，请检查网络连接"));
          }
        },
      });
    });

    console.log("收到响应:", response);

    if (!response || !response.data) {
      throw new Error("响应数据为空");
    }

    // 打印完整的响应数据，帮助调试
    console.log("完整响应数据:", JSON.stringify(response.data, null, 2));

    if (response.statusCode === 200) {
      if (response.data.code === 0) {
        try {
          console.log("解析前的数据:", response.data.data);
          const result = JSON.parse(response.data.data);
          console.log("工作流返回数据:", result);

          // 检查返回数据的格式
          if (
            result &&
            typeof result === "string" &&
            result.startsWith("http")
          ) {
            // 如果返回的是直接的URL字符串
            return {
              imageUrl: result,
              debugUrl: response.data.debug_url,
            };
          } else if (
            result &&
            result.output &&
            typeof result.output === "string"
          ) {
            // 如果返回的是包含 output 字段的对象
            return {
              imageUrl: result.output,
              debugUrl: response.data.debug_url,
            };
          } else if (result && typeof result === "object") {
            // 如果返回的是其他格式的对象，尝试找到包含 URL 的字段
            const urlField = Object.values(result).find(
              (value) => typeof value === "string" && value.startsWith("http")
            );
            if (urlField) {
              return {
                imageUrl: urlField,
                debugUrl: response.data.debug_url,
              };
            }
          }

          console.error("无效的返回数据格式:", result);
          throw new Error("返回数据格式错误");
        } catch (parseError) {
          console.error("解析返回数据失败:", parseError);
          throw new Error("解析返回数据失败");
        }
      } else {
        console.error("工作流返回业务错误:", response.data);
        throw new Error(response.data.msg || "工作流执行失败");
      }
    } else {
      console.error("HTTP状态码错误:", response.statusCode);
      throw new Error(`HTTP错误: ${response.statusCode}`);
    }
  } catch (error) {
    console.error("工作流调用失败:", error);
    throw error;
  }
};

// 添加调试链接获取函数
export const getDebugUrl = (response) => {
  if (!response || !response.data) return null;
  return response.data.debug_url || null;
};

// 添加生成头部图片的函数
export const generateHeaderImage = async () => {
  const headerImagePrompt =
    "设计一张2025新年主题横幅，包含喜庆的中国红色调，金色装饰元素，龙年元素，整体风格要现代简约大气，适合作为小程序的顶部横幅。要求横版设计，比例约2:1，分辨率750x375像素";
  return await generateImage(headerImagePrompt);
};
