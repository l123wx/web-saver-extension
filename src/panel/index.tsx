import React, { useState, useEffect } from 'react';

import RequestTable from './components/RequestTable';
import { RequestData } from './types';

const Panel: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);

  useEffect(() => {
    // 监听网络请求
    chrome.devtools.network.onRequestFinished.addListener((request) => {
      if (request.request.httpVersion === 'chrome-extension') return

      const newRequest: RequestData = {
        id: Math.random(),
        url: request.request.url,
        method: request.request.method,
        status: request.response.status,
        mimeType: request.response.content.mimeType,
        time: request.time,
        size: request.response.content.size || 0,
        rawRequest: request
      };

      setRequests(prev => [...prev, newRequest]);
    });

    // 页面导航时清除请求列表
    chrome.devtools.network.onNavigated.addListener(() => {
      setRequests([]);
    });

    return () => {
      setRequests([]);
    }
  }, []);

  return (
    <div className="panel-container">
      <RequestTable requests={requests} />
    </div>
  );
};

export default Panel;
