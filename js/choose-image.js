let zip = new JSZip();
let layer;
let type;
$(() => {

    layui.use('layer', function () {
        layer = layui.layer;
    });

    const bg = chrome.extension.getBackgroundPage();
    let html = bg.html;
    type = bg.type;
    let imgArray = getImg(html);
    let content = '';
    for (let i = 0; i < imgArray.length; i++) {
        content += '<li>\n' +
            '<div class="layui-anim">\n' +
            '<div>\n' +
            '<img width="150" height="150"\n' +
            'src="' + imgArray[i] + '">\n' +
            '</div>\n' +
            '<div>\n' +
            '<input id="name-' + i + '" type="text" value="' + i + '">\n' +
            '</div>\n' +
            '<div>\n' +
            '<input type="checkbox" name="checkbox">\n' +
            '</div>\n' +
            '</div>\n' +
            '</li>';
    }
    $("#image-list").html(content);

    let images = new Array();
    $("#confirm").click(() => {
        let checkboxes = document.getElementsByName("checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            let name = $("#name-" + i + "").val();
            if (name.length < 1) {
                layer.msg("确保所有图片都已经输入名称");
                return;
            }
            if (checkboxes[i].checked) {
                images.push({"name": name, "src": imgArray[i]});
            }
        }
        if (images.length == 0) {
            layer.msg("您还没有选择图片");
            return;
        }
        saveFile(images, () => {
            images = [];
        });
    });

    $("#check-all").click(() => {
        let checkboxes = document.getElementsByName("checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
    });

    $("#cancel-check-all").click(() => {
        let checkboxes = document.getElementsByName("checkbox");
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }
    });


});

function getImg(htmlStr) {
    let reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
    let imgArr = [];
    while (tem = reg.exec(htmlStr)) {
        if (type.length > 0) {
            if (!tem[2].endsWith(type)) {
                continue;
            }
        }
        if (tem[2].endsWith("png") || tem[2].endsWith("jpg") || tem[2].endsWith("jpeg") || tem[2].endsWith("gif")) {
            imgArr.push(tem[2]);
        }
    }
    return imgArr;
}

function saveFile(imgArray, resolve) {
    let images = new Array();
    for (let i = 0; i < imgArray.length; i++) {
        let url = imgArray[i].src;
        JSZipUtils.getBinaryContent(url, (err, data) => {
            if (data) {
                let index = url.lastIndexOf(".");
                images.push({"name": imgArray[i].name, "type": url.substring(index + 1, url.length), "data": data});
            } else {
                console.log(err);
            }
            if (images.length == imgArray.length) {
                images.forEach(image => {
                    zip.file(image.name + "." + image.type, image.data);
                });
                zip.generateAsync({type: "blob"}).then(function (blob) {
                    saveAs(blob, "image.zip");
                }, function (err) {
                    console.log(err);
                });
                resolve();
            }
        });
    }
}