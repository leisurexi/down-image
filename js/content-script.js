let zip = new JSZip();
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let html = document.body.innerHTML;

        let imgArray = getImg(html);
        if (imgArray.length == 0) {
            alert("没有搜索到符合条件的图片");
        }
        saveFile(imgArray, (index, size) => {
            if (index == size - 1) {
                zip.generateAsync({type: "blob"}).then(function (blob) {
                    saveAs(blob, "image.zip");
                }, function (err) {
                    alert(err);
                });
            }
        });
    }
);



// chrome.runtime.sendMessage({action: "data", data: html});


function getImg(htmlStr) {
    let reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
    let imgArr = [];
    while (tem = reg.exec(htmlStr)) {
        // if (type.length > 0) {
        //     if (!tem[2].endsWith(type)) {
        //         continue;
        //     }
        // }
        if (tem[2].endsWith("png") || tem[2].endsWith("jpg") || tem[2].endsWith("jpeg") || tem[2].endsWith("gif")) {
            imgArr.push(tem[2]);
        }
    }
    return imgArr;
}

function urlToData(url, resolve) {
    JSZipUtils.getBinaryContent(url, function (err, data) {
        if (data) {
            let index = url.lastIndexOf(".");
            resolve(url.substring(index + 1, url.length), data);
        } else {
            alert(err);
        }
    });
}

function saveFile(imgArray, resolve) {
    for (let i = 0; i < imgArray.length; i++) {
        urlToData(imgArray[i], (type, data) => {
            zip.file(i + "." + type, data);
            resolve(i, imgArray.length);
        });
    }
}
