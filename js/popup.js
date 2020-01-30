chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: "js/content-script.js", runAt: "document_end"});
});
const imageTypes = ["png", "jpg", "jpeg", "gif"];
layui.use('form', function () {
    let form = layui.form;
    //监听提交
    form.on('submit(formDemo)', function (data) {
        let type = data.field.type;
        if (type.length > 0 && imageTypes.indexOf(type) == -1) {
            layui.use('layer', function () {
                let layer = layui.layer;
                layer.msg("图片类型输入错误");
            });
            return false;
        }
        const bg = chrome.extension.getBackgroundPage();
        bg.sendMessage("download-image", response => {
            bg.html = response;
            bg.type = type;
            chrome.windows.create({
                'url': '../choose-image.html',
                'type': 'popup',
                'width': 825,
                'height': 550
            }, function (window) {
            });
        });
        return false;
    });
});