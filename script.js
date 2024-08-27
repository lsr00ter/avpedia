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

    // 遍历每一行输入
    lines.forEach(line => {
        line = line.trim(); // 移除前后空白字符

        // 遍历 JSON 数据，检查每个软件的进程列表
        for (const softwareName in jsonData) {
            const processes = jsonData[softwareName].processes;
            const url = jsonData[softwareName].url;

            // 检查是否包含指定的进程名，且匹配行的开头
            const matches = []; // 新增：存储匹配结果
            processes.forEach(process => {
                if (line.toLowerCase().startsWith(process.toLowerCase())) { // 忽略大小写
                    matches.push({ process, softwareName, url }); // 新增：保存匹配信息
                }
            });

            // 新增：排序匹配结果
            matches.sort((a, b) => a.softwareName.localeCompare(b.softwareName));
            let lastSoftwareName = ''; // 新增：存储上一个软件名称
            matches.forEach(match => {
                // 检查当前软件名称是否与上一个相同
                const displaySoftwareName = (match.softwareName === lastSoftwareName) ? ' \_ ' : match.softwareName;
                // result += `<strong>${displaySoftwareName}:</strong> ${match.process} ==> <a href='${match.url}' target='_blank'>${match.url}</a><br>`;
                result += `<strong>${displaySoftwareName}:</strong> <span style="font-family: monospace;">${match.process}</span> ==> <a href='${match.url}' target='_blank'>${match.url}</a><br>`;
                lastSoftwareName = match.softwareName; // 更新上一个软件名称
            });

        }
    });

    // 如果没有匹配项
    if (result === '') {
        result = "未找到匹配的进程";
    }

    document.getElementById('result').innerHTML = result; // 显示结果
});

function clearTextarea() {
    document.getElementById('user_input').value = '';
}
