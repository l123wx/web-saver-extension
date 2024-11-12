import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Panel from './panel';

chrome.devtools.panels.create(
    "Web Saver",
    "",
    "index.html",
    (panel) => {
      console.log(panel, "面板创建成功");
    }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Panel />
  </StrictMode>,
)