const __color_map__ = [
    { name: 'blackbody', clr: '#000000,#E60000,#E6D200,#FFFFFF,#A0C8FF' },
    { name: 'summer', clr: '#008066,#FFFF66' },

    { name: 'lightblue', clr: '#005aa7,#fffde4' },
    {
        name: 'picnic',
        clr: '#0000FF,#3399FF,#66CCFF,#99CCFF,#CCCCFF,#FFFFFF,#FFCCFF,#FF99FF,#FF66CC,#FF6666,#FF0000',
    },
    { name: 'copper', clr: '#000000,#FFA066,#FFC77F' },
    { name: 'spring', clr: '#FF00FF,#FFFF00' },
    { name: 'greys', clr: '#000000,#FFFFFF' },
    { name: 'autumn', clr: '#FF0000,#FFFF00' },
    {
        name: 'yiorrd',
        clr: '#800026,#BD0026,#E31A1C,#FC4E2A,#FD8D3C,#FEB24C,#FED976,#FFEDA0,#FFFFCC',
    },
    { name: 'earth', clr: '#000082,#00B4B4,#28D228,#E6E632,#784614,#FFFFFF' },
    { name: 'portland', clr: '#0C3383,#0A88BA,#F2D338,#F28F38,#D91E1E' },
    { name: 'bluered', clr: '#0000FF,#FF0000' },
    {
        name: 'rainbow',
        clr: '#96005A,#0000C8,#0019FF,#0098FF,#2CFF96,#97FF00,#FFEA00,#FF6F00,#FF0000',
    },
    { name: 'winter', clr: '#0000FF,#00FF80' },
    { name: 'Custom', clr: '#51853F,#E5DE50,#DEB774,#B04E39,#BA0500,#BA133A' },
    { name: 'jet2', clr: '#003CAA,#05FFFF,#FFFF00,#FA0000,#800000' },
    { name: 'jet', clr: '#000083,#003CAA,#05FFFF,#FFFF00,#FA0000,#800000' },
    { name: 'rdbu', clr: '#050AAC,#6A89F7,#BEBEBE,#DCAA84,#E6915A,#B20A1C' },
    { name: 'hot', clr: '#000000,#E60000,#FFD200,#FFFFFF' },
    {
        name: 'electric',
        clr: '#000000,#1E0064,#780064,#A05A00,#E6C800,#FFFADC',
    },
    { name: 'aqua', clr: '#00007f,#7fffff' },
    { name: 'yrb', clr: '#007fff,#ff0000,#ffff7f' },
    { name: 'torrential', clr: '#3eba3e,#61b8ff,#0001fd,#f800f8' },
    { name: 'rgb', clr: '#0000ff,#ffff00,#ff0000' },
    {
        name: 'wind',
        clr: '#003CAA,#05FFFF,#FFFF00,#FA7F00,#FA0000,#BC0000,#800000',
    },
    {
        name: 'bright',
        clr: '#0877CF,#EFF3FF,#A05146,#FFFFCC,#005A32,#F2F0F7,#4A1486,#FFFFB2,#91003F,#CDC2CE,#6E016B',
    },
    {
        name: 'temperature',
        clr: '#37385C,#394674,#3E58B1,#5CA7CF,#5A7E7A,#8AC689,#BBE32B,#E8B13A,#E04F26,#CC2A2D,#7B1F23',
    },
    {
        name: 'eledensity',
        clr: '#0E0945,#020186,#0035B9,#0085FC,#01C1FF,#88F189,#FFFF01,#FDBB00,#FF4100,#FA0001,#89280C',
    },
    {
        name: 'panoply',
        clr: '#040ED8,#2050FF,#4196FF,#6DC1FF,#86D9FF,#9CEEFF,#AFF5FF,#CEFFFF,#FFFE47,#FFEB00,#FFC400,#FF9000,#FF4800,#FF0000,#D50000,#9E0000',
    },
    {
        name: 'windgl',
        clr: '#3288bd,#66c2a5,#abdda4,#e6f598,#fee08b,#fdae61,#f46d43,#d53e4f',
    },
    {
        name: 'radar',
        clr: '#0000ef,#419df1,#64e7eb,#6dfa3d,#00d800,#019001,#ffff00,#e7c000,#ff9000,#ff0000,#d60000,#c00000,#ff00f0,#9600b4,#ad90f0',
    },
    {
        name: "white_to_green",
        clr: "#FFFFFF,#E0F8E0,#C0F0C0,#A0E8A0,#80E080,#60D060,#40B040,#20A020,#008000"
    },
    { name: 'ndvi', clr: '#FF0000,#FF6F00,#FFD700,#C0FF00,#00FF00' }
]

// 将颜色字符串（十六进制色码）转换为一个数组，
// 数组中每个元素对应于颜色的 RGB 分量，以值在 0 - 1 范围内表示
function clr2arr(clr: string[]) {
    if (!(clr instanceof Array)) {
        clr = [clr]
    }
    const arr = clr
        .join()
        .replace(/[,#]/g, '')
        .match(/.{1,2}/g) || []
    const ret = arr.map(function (i) {
        let r = 0
        try {
            r = parseInt(i, 16) / 255.0
        } catch (err) {
            console.log('🚀 ~ file: Utils.js:189 ~ ret ~ err:', err)
        }
        return r
    })
    return ret
}

//根据颜色名称查找并返回对应的颜色值
export function name2clr(colorname: string) {
    const colorItem = __color_map__.find((item) => {
        return item.name === colorname;
    });

    if (colorItem) {
        return colorItem.clr.split(',');
    } else {
        throw new Error(`Color scheme "${colorname}" not found`);
    }
}

//将颜色名称转换为颜色值的数组
//然后将该字符串传递给 clr2arr 函数进行处理
//这个函数总的作用就是将一堆十六进制的颜色值转为RGB数组
export function name2clr_arr(colorname: string) {
    return clr2arr(name2clr(colorname))
}


