function countSpecialSubstrings(s) {
    const n = s.length;
    let count = 0;
    let start = 0;
    const charSet = new Set();

    for (let end = 0; end < n; end++) {
        // 如果字符已经存在，移动 start 指针  
        while (charSet.has(s[end])) {
            charSet.delete(s[start]);
            start++;
        }
        // 添加当前字符到集合  
        charSet.add(s[end]);
        // 计算特殊子字符串的数量  
        count += end - start + 1;
    }

    return count;
}

// 示例  
const s = "abab";
console.log(countSpecialSubstrings(s)); // 输出特殊子字符串的数量