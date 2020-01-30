var html;
var type;

//定义一个统一的发送消息的方法，返回响应数据
function sendMessage(msg, responseFunc) {
    chrome.tabs.query({active: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: msg}, response => {
            responseFunc(response);
        });
    })
}

//定义一个统一的接收消息的方法
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.greeting) {
        case "download-image":
            sendResponse({farewell: "test"});
            break;
        default:
            break;
    }
});