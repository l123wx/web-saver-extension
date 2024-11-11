import React from 'react';
import { RequestData } from '../types';

interface Props {
  request: RequestData;
}

const RequestRow: React.FC<Props> = ({ request }) => {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleClick = () => {
        const rawRequest = request.rawRequest
        console.log(rawRequest)
        rawRequest.getContent((content, encoding) => {
            if (content) {
                console.log(content, encoding)
                const blob = new Blob([content], { type: rawRequest.response.content.mimeType });
                const url = URL.createObjectURL(blob);
                const filename = new URL(rawRequest.request.url).pathname.split('/').pop() || 'download';
                
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        });
  }

  return (
    <tr>
        <td>
            <button onClick={handleClick}>log</button>
        </td>
        <td title={request.url}>{request.url}</td>
        <td>{request.method}</td>
        <td>{request.status}</td>
        <td>{request.mimeType}</td>
        <td>{formatSize(request.size)}</td>
        <td>{request.time.toFixed(2)}ms</td>
    </tr>
  );
};

export default RequestRow;
