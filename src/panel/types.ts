export interface RequestData {
  id: number;
  url: string;
  method: string;
  status: number;
  mimeType: string;
  time: number;
  size: number;
  rawRequest: chrome.devtools.network.Request,
}
