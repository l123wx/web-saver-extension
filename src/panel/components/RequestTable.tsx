import React, { useMemo, useRef, useState } from 'react';
import { Input, Table, Flex, ConfigProvider, Empty, Alert } from 'antd'
import type { TableColumnType, InputRef, TableProps } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words';

import SaverButton from './SaverButton'
import { RequestData } from '../types';

interface Props {
    requests: RequestData[];
}

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const RequestTable: React.FC<Props> = ({ requests }) => {
    const [searchText, setSearchString] = useState('')
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const searchInput = useRef<InputRef>(null)

    const columns: TableColumnType<RequestData>[] = [
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            render: (text: string) => {
                return (
                    searchInput ?
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[searchText]}
                            autoEscape
                            textToHighlight={text ? text.toString() : ''}
                        /> : text
                )
            }
        },
        {
            title: '方法',
            dataIndex: 'method',
            key: 'method',
            width: 70
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 70
        },
        {
            title: '类型',
            dataIndex: 'mimeType',
            key: 'mimeType',
            width: 200,
        },
        {
            title: '大小',
            dataIndex: 'size',
            key: 'size',
            width: 100,
            render: (text: number) => formatSize(text)
        },
        {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            width: 100,
            render: (text: number) => `${text.toFixed(2)}ms`
        }
    ]

    const activeRequests = useMemo(() => requests.filter(request => request.url.includes(searchText)), [requests, searchText])

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<RequestData> = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleInput: React.FormEventHandler<HTMLInputElement> = (event) => {
        setSearchString((event.target as HTMLInputElement).value)
    }

    return (
        <Flex
            vertical
            gap={10}
            style={{
                height: '100vh',
                padding: 10,
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            <Flex justify='space-between' gap={10}>
                <SaverButton requests={requests.map(request => request.rawRequest)} />
                <Input value={searchText} onInput={handleInput} addonBefore={<SearchOutlined />} />
            </Flex>
            <Alert message={`发现 ${requests.length} 个请求`} type="info" showIcon />
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto'
                }}
            >
                <ConfigProvider renderEmpty={() =>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="刷新页面加载请求数据" />
                }>
                    <Table<RequestData>
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={activeRequests}
                        sticky
                        rowKey="id"
                        pagination={false}
                    />
                </ConfigProvider>
            </div>
        </Flex>
    );
};

export default RequestTable;
