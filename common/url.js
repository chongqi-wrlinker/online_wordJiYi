

//获取用户信息的地址
function getUserInfoUrl(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getUserInfo';
}

//获取某个单词的具体数据(词汇检测)
function getWordInfo(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getWordInfo';
}

//获取某个单词的具体数据(开始学习的页面)
function getWordInfo1(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getWordInfo1';
}

//处理用户的词汇量的所有方法
function dealUserCiHui(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/dealCiHuiData';
}

//获取用户的开始背诵的时候所有的问题列表
function getAllQuestionList(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getAllQuestionList';
}

//修改用户的专注时间和答题数量和生词本更新
function updateUserInfo(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/updateUserInfo';
}

//获取复习的单词列表
function getFuXiWordList(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getFuXiWordList';
}

//处理用户快速挑战的的方法
function dealUserTiaoZhan(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/dealUserTiaoZhan';
}

//生词训练获取生词列表数据
function dealShengCiData(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/dealShengCiData';
}

//处理复习的单词数据方法
function dealFuXiData(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/dealFuXiData';
}

//处理报错的数据方法
function dealBaoCuo(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/dealBaoCuo';
}

//获取某个单词的随机选项答案列表
function getRandomAnswerList(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getRandomAnswerList';
}

//获取用户的挑战数据列表
function getTiaoZhanList(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getTiaoZhanList';
}

//获取用户的词汇检测记录列表
function getUserCiHuiList(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getUserCiHuiList';
}

//获取排行榜的相关数据
function getPaiHangBangList(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getPaiHangBangList';
}

//获取排行榜第一页的所有数据
function getFirstPageData(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getFirstPageData';
}

//开始记单词获取用户的生词库
function newToShengCi(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/newToShengCi';
}

//专注完成后更新用户信息
function updateUserInfo1(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/updateUserInfo1';
}

//获取用户快速挑战的数据及复习表中的数据
function getFuXiList(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getFuXiList';
}

//获取用户快速挑战的新方法
function getTiaoZhanList1(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getTiaoZhanList1';
}

//获取用户快速挑战的生词库剩余容量
function getRestTiaoZhanCount(){
    return 'https://wrlinkeradmin.applinzi.com/thinkphp/index.php/English/index/getRestTiaoZhanCount';
}

module.exports = {
    getUserInfoUrl: getUserInfoUrl,
    getWordInfo: getWordInfo,
    dealUserCiHui: dealUserCiHui,
    getAllQuestionList: getAllQuestionList,
    updateUserInfo: updateUserInfo,
    getFuXiWordList: getFuXiWordList,
    dealUserTiaoZhan: dealUserTiaoZhan,
    dealShengCiData: dealShengCiData,
    dealFuXiData: dealFuXiData,
    dealBaoCuo: dealBaoCuo,
    getRandomAnswerList: getRandomAnswerList,
    getTiaoZhanList: getTiaoZhanList,
    getUserCiHuiList: getUserCiHuiList,
    getPaiHangBangList: getPaiHangBangList,
    getFirstPageData: getFirstPageData,
    newToShengCi: newToShengCi,
    updateUserInfo1: updateUserInfo1,
    getFuXiList: getFuXiList,
    getTiaoZhanList1: getTiaoZhanList1,
    getRestTiaoZhanCount: getRestTiaoZhanCount
}