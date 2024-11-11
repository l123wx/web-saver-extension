import React, { useState } from 'react';
import RequestRow from './RequestRow';
import { RequestData } from '../types';

interface Props {
  requests: RequestData[];
}

const RequestTable: React.FC<Props> = ({ requests }) => {
    const [searchString, setSearchString] = useState('')

    const handleInput: React.FormEventHandler<HTMLInputElement> = (event) =>{
        setSearchString((event.target as HTMLInputElement).value)
    }

  return (
    <div className="request-table">
    <input value={searchString} onInput={handleInput} />
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>方法</th>
            <th>状态</th>
            <th>类型</th>
            <th>大小</th>
            <th>时间</th>
          </tr>
        </thead>
        <tbody>
          {requests.filter(request => request.url.includes(searchString)).map(request => (
            <RequestRow key={request.id} request={request} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
