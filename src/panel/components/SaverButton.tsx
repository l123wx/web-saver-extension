import React, { useState } from "react"
import { Button, ConfigProvider, Progress } from 'antd'
import { throttle } from 'lodash-es'

import saveWeb from '../../utils/saver';

const progressConfig = {
    percentPosition: {
        align: 'center',
        type: 'inner'
    },
    strokeColor: "rgba(22,119,255,0.3)",
    size: {
        height: 32,
        width: 120,
    },
    style: {
        position: 'absolute',
        left: 0,
        top: 0
    }
} as const

type Props = object

const ServerButton: React.FC<Props> = () => {
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const handleButtonClick = async () => {
        chrome.devtools.network.getHAR(async log => {
            try {
                setIsLoading(true)
                await saveWeb(log.entries as chrome.devtools.network.Request[], throttle(setProgress, 100))
            } finally {
                setIsLoading(false)
            }
        })
    }

    return <div style={{
        position: 'relative'
    }}>
        <Button
            type="primary"
            disabled={isLoading}
            style={{
                width: 120
            }}
            onClick={handleButtonClick}
        >
            {isLoading ? 'Saving...' : 'Start Saving'}
        </Button>
        <ConfigProvider
            theme={{
                components: {
                    Progress: {
                        lineBorderRadius: 6
                    }
                }
            }}
        >
            {
                isLoading &&
                <Progress
                    {...progressConfig}
                    percent={progress * 100}
                    format={percent => (percent || 0).toFixed(1) + '%'}
                />
            }
        </ConfigProvider>
    </div>
}

export default ServerButton 