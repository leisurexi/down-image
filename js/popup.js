// let long = $("#long").val();
// let width = $("#width").val();
let type = "";
let size = "";

chrome.windows.create({'url': '../choose-image.html', 'type': 'popup', 'width': 800, 'height': 550}, function (window) {
});
chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: "js/jquery.min.js", runAt: "document_end"});
    chrome.tabs.executeScript(tabs[0].id, {file: "js/jszip.min.js", runAt: "document_end"});
    chrome.tabs.executeScript(tabs[0].id, {file: "js/jszip-utils.min.js", runAt: "document_end"});
    chrome.tabs.executeScript(tabs[0].id, {file: "js/FileSaver.min.js", runAt: "document_end"});
    chrome.tabs.executeScript(tabs[0].id, {file: "js/content-script.js", runAt: "document_end"});
});

$(function () {
    $("#confirm").click(function () {
        // long = $("#long").val();
        // width = $("#width").val();
        type = $("#type").val();
        // size = $("#size").val();

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "download-image"}, function (response) {
                // console.log(response);
                // alert(response);
            });
        });
    });
});

// let zip = new JSZip();
// chrome.runtime.onMessage.addListener(function (msg, sender, response) {
//     if (msg.action == "data") {
//         let imgArray = getImg(msg.data);
//         if (imgArray.length == 0) {
//             alert("没有搜索到符合条件的图片");
//         }
//         // alert(JSON.stringify(imgArray));
//         // for (let i = 0; i < imgArray.length; i++) {
//         //     urlToData(imgArray[i], data => {
//         //         zip.file(i + ".png", data);
//         //     });
//         // }
//         //
//         // zip.generateAsync({type: "blob"}).then(function (blob) {
//         //     saveAs(blob, "image.zip");
//         // }, function (err) {
//         //     alert(err);
//         // });
//
//         saveFile(imgArray, (index, size) => {
//             if (index == size - 1) {
//                 zip.generateAsync({type: "blob"}).then(function (blob) {
//                     saveAs(blob, "image.zip");
//                 }, function (err) {
//                     alert(err);
//                 });
//             }
//         });
//     }
// });
//
// function getImg(htmlStr) {
//     let reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
//     let imgArr = [];
//     while (tem = reg.exec(htmlStr)) {
//         if (type.length > 0) {
//             if (!tem[2].endsWith(type)) {
//                 continue;
//             }
//         }
//         if (tem[2].endsWith("png") || tem[2].endsWith("jpg") || tem[2].endsWith("jpeg") || tem[2].endsWith("gif")) {
//             imgArr.push(tem[2]);
//         }
//     }
//     return imgArr;
// }
//
// function urlToData(url, resolve) {
//     JSZipUtils.getBinaryContent(url, function (err, data) {
//         if (data) {
//             // if (size.length > 0) {
//             //     if (data.byteLength <= parseInt(size)) {
//             //         let index = url.lastIndexOf(".");
//             //         resolve(url.substring(index + 1, url.length), data);
//             //     }
//             // } else {
//                 let index = url.lastIndexOf(".");
//                 resolve(url.substring(index + 1, url.length), data);
//             // }
//         } else {
//             alert(err);
//         }
//     });
// }
//
// function saveFile(imgArray, resolve) {
//     for (let i = 0; i < imgArray.length; i++) {
//         urlToData(imgArray[i], (type, data) => {
//             zip.file(i + "." + type, data);
//             resolve(i, imgArray.length);
//         });
//     }
// }