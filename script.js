// 加载 JSON 数据
let jsonData = {};
fetch('assets/auto.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data; // 存储 JSON 数据
    });

document.getElementById('inputForm').addEventListener('submit', function (event) {
    event.preventDefault(); // 防止表单提交
    const input = document.getElementById('user_input').value;
    const lines = input.split("\n");
    let result = '';
    const matches = {}; // 新增：存储匹配结果

    // 遍历每一行输入
    lines.forEach(line => {
        line = line.trim(); // 移除前后空白字符

        // 遍历 JSON 数据，检查每个软件的进程列表
        for (const softwareName in jsonData) {
            const processes = jsonData[softwareName].processes;
            const url = jsonData[softwareName].url;

            // 检查是否包含指定的进程名，且匹配行的开头
            processes.forEach(process => {
                if (line.toLowerCase().startsWith(process.toLowerCase())) { // 忽略大小写
                    if (!matches[softwareName]) {
                        matches[softwareName] = { "processes": [], "url": "" }; // 如果不存在，初始化为空数组
                        matches[softwareName]["url"] = url;
                    }
                    if (!matches[softwareName]["processes"].includes(process)) {
                        matches[softwareName]["processes"].push(process);
                    }
                }
            });
        }
    });
    // 对 matches 对象进行排序
    const sortedKeys = Object.keys(matches).sort(); // 获取排序后的键
    const sortedMatches = {}; // 创建一个新的对象来存储排序后的结果
    sortedKeys.forEach(key => {
        sortedMatches[key] = matches[key]; // 将排序后的键值对添加到新对象
    });
    Object.assign(matches, sortedMatches); // 更新原始 matches 对象
    console.log(matches);

    // 判断 matches 是否为空
    if (Object.keys(matches).length === 0) {
        console.log("matches is empty.");
        result = "未找到匹配的进程";
    } else {
        console.log("matches is not empty."); // matches 不为空
        // 遍历 matches
        for (const softwareName in matches) {
            if (matches.hasOwnProperty(softwareName)) {
                result += `<div class="process-item"><span class="software-name"><a class="red-link" href='${matches[softwareName]["url"]}' target='_blank'><strong>${softwareName}</strong></a></span><span class="process-name">${matches[softwareName]["processes"][0]}</span></div><br>`;
                // 遍历 processes 列表并逐行输出
                console.log(`Software: ${softwareName}`);
                console.log(`\\---  Process: ${matches[softwareName]["processes"][0]}`);
                const processes = matches[softwareName]["processes"];
                if (processes.length > 1) {    // 确保有至少两个元素
                    processes.slice(1).forEach(process => { // 从第二个元素开始
                        result += `<div class="process-item"><span class="software-name"></span><span class="sub-process-name">${process}</span></div><br>`;
                        console.log(`\\---  Process: ${process}`); // 缩进以示层级
                    });
                }
            }
        }
    }

    document.getElementById('result').innerHTML = result; // 显示结果
});

function clearTextarea() {
    document.getElementById('user_input').value = '';
}
