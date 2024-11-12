
import JSZip from "jszip"

async function saveWeb(requests: chrome.devtools.network.Request[]) {
    const files: FileItem[] = []
    for (const index in requests) {
        const request = requests[index]

        // 过滤浏览器扩展请求
        if (request.request.httpVersion === 'chrome-extension') continue;
        // 过滤百度统计请求
        if (request.request.url.includes('hm.baidu.com')) continue;

        // console.log(`开始保存第 ${index}/${requests.length - 1} 个请求`)
        const { content, encoding } = await new Promise<{ content: string, encoding: string }>(resolve => {
            request.getContent((content, encoding) => resolve({ content, encoding }))
        })

        // 过滤相应内容为空的请求
        if (!content) continue

        const url = new URL(request.request.url);

        let path = `${url.hostname}${url.pathname}`
        if (request._resourceType === 'document' && !(url.pathname.endsWith('.html') || url.pathname.endsWith('.htm'))) {
            path += '/index.html'
        }

        if (request._resourceType === 'xhr') {
            path += url.search.replace(/\?/g, '__').replace(/&/g, '_')
        }

        files.push({
            path,
            mimeType: request.response.content.mimeType,
            encoding,
            content,
        })
        // console.log(`成功保存第 ${index}/${requests.length - 1} 个请求`)
        console.log(`${index}/${requests.length - 1}`, path, content?.length)
    }

    return createZipFile(files)
}

type FileItem = {
    path: string;
    mimeType: string;
    content: string;
    encoding: string;
}
async function createZipFile(files: FileItem[]) {
    console.log('开始整理文件')
    const zip = new JSZip();

    // 按目录组织文件
    for (const index in files) {
        const file = files[index]
        zip.file(
            file.path,
            file.content,
            {
                base64: file.encoding === 'base64'
            }
        );
    }

    // 生成压缩包
    console.log('开始构建压缩包...')
    const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    });

    try {
        // 下载压缩包
        console.log('开始下载...')
        await chrome.downloads.download({
            url: URL.createObjectURL(zipBlob),
            filename: `download_${new Date().getTime()}.zip`,
            saveAs: true
        });

        // 下载完成提示
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: '下载完成',
            message: `已将 ${files.length} 个文件打包下载`
        });
    } catch (error) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);

            console.error('下载出错:', error);
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icon.png',
                title: '下载失败',
                message: '文件打包失败，请查看控制台了解详情'
            });
        }
    }
};

export default saveWeb