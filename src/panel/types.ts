export interface RequestData {
  id: React.Key;
  url: string;
  method: string;
  status: number;
  mimeType: string;
  time: number;
  size: number;
  rawRequest: chrome.devtools.network.Request,
}
