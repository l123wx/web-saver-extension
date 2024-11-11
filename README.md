# Web Saver extension

用于爬取网站资源的 Chrome Extension，会将根据网页请求，将所有请求内容根据原目录保存到本地，如：html，css，js，image，xhr 等

## 使用方法

安装方法请看：https://developer.chrome.google.cn/docs/extensions/get-started/tutorial/hello-world?hl=zh-cn#load-unpacked

1. 在需要爬取的网站打开开发者工具（F12）

2. 选择 Web Saver Tab

3. 刷新网页，等待所有请求完成

4. 点击 Start Saving 按钮，稍等片刻会自动下载一个包含代码和请求的压缩包

5. 调整代码，根据实际情况将请求地址改为请求本地文件

## 关于接口

对于接口，会直接把相应内容保存为文本文件，并将 params 的 `?` 和 `&` 连接符分别替换为 `__` 和 `_`

所以如果可行，可以通过修改代码将 get 请求的 params 也按上方的规则替换，这样可以直接访问本地文件实现 mock 请求的效果。

例如：

将 `example.com/getList?page=1&pageSize=10` 改为 `example.com/getList__page=1_pageSize=10`，访问本地 `example.com` 路径下的 `getList__page=1_pageSize=10` 文件