function timeOut(time){
    var min = parseInt(time / 60);
    if(min<10){
        var min="0"+min;
    }
    var sec=time-min*60;
    if (sec < 10) {
        var sec = "0" + sec;
    }
    return min + ":" + sec;
}

function randomsort1(idArr, id,count){
    var rightArr=idArr[count];
    var finalArr = idArr.sort(randomsort);
    var optionList = [];
    if(count%5==0 && count>0){
        var flag = true;//没有正确答案
    }else{
        var flag = false;//有正确答案
    }
    if(flag){
        for (var i = 0; i < 3; i++) {
            optionList[i] = { optionContent: finalArr[i]['zhdes'][0], optionFlag: 2, optionState:"answerDefault"};
        }
        
    }else{
        for (var i = 0; i < 2; i++) {
            optionList[i] = { optionContent: finalArr[i]['zhdes'][0], optionFlag: 2, optionState: "answerDefault" };
        }
        optionList[optionList.length] = { optionContent: rightArr['zhdes'][0], optionFlag: 1, optionState: "answerDefault" };
    }
    optionList.sort(randomsort);

    if(flag){
        optionList[optionList.length] = { optionContent: "以上都不对", optionFlag: 1, optionState: "answerDontKnow" };
    }else{
        optionList[optionList.length] = { optionContent: "以上都不对", optionFlag: 2, optionState: "answerDontKnow" };
    }
    return optionList;
}

//获取随机选项值
function randomsort(a, b) {
    return Math.random() > .5 ? -1 : 1;//用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
}

//计算回答正确或者错误的值
function getStepNum(flag,id,config,random){
    var fianlRandom = parseInt(Math.random() * random);
    if(flag==1){
        //正确
        var step = parseInt(config.jieduan_rightCount);
    }else{
        //错误
        var step = 0 - parseInt(config.jieduan_wrongCount);
    }
    
    var finalNum = parseInt(id) + step+fianlRandom
    if (finalNum<1){
        finalNum = parseInt(Math.random() * 100);
    }
    return finalNum;

}

//获取某个阶段的参数设置
function getConfigParam(num,configParam,state){
    var finalParam = { jieduan_rightCount: 0, jieduan_wrongCount: 0 };
    if(state==2){
        if (num <= configParam['jieduan_totalCount1']) {
            finalParam.jieduan_rightCount = configParam['jieduan_rightCount1'];
            finalParam.jieduan_wrongCount = configParam['jieduan_wrongCount1'];
        } else if (num <= (parseInt(configParam['jieduan_totalCount2']) + parseInt(configParam['jieduan_totalCount1'])) && num > configParam['jieduan_totalCount1']) {
            finalParam.jieduan_rightCount = configParam['jieduan_rightCount2'];
            finalParam.jieduan_wrongCount = configParam['jieduan_wrongCount2'];
        } else if (num > (parseInt(configParam['jieduan_totalCount2']) + parseInt(configParam['jieduan_totalCount1']))) {
            finalParam.jieduan_rightCount = configParam['jieduan_rightCount3'];
            finalParam.jieduan_wrongCount = configParam['jieduan_wrongCount3'];
        }
    }else{
        finalParam.jieduan_rightCount = configParam['jieduan_rightCount3'];
        finalParam.jieduan_wrongCount = configParam['jieduan_wrongCount3'];
    }
    return finalParam;
}

//获取某个阶段的答案列表
function getOptionList(num, state, optionList, configParam){
    var rightOptionList=[];
    var wrongOptionList=[];
    for(var i=0;i<optionList.length;i++){
        if (optionList[i]['optionFlag']==1){
            rightOptionList.push(optionList[i]);
        }else{
            wrongOptionList.push(optionList[i]);
        }
    }
    var fianlOptionList=[];
    if(state==2){
        //第一次检测
        if (num <= configParam['jieduan_totalCount1']) {
            //只要2个答案（会与不会）
            fianlOptionList.push(rightOptionList[0]);
            fianlOptionList.push(wrongOptionList[0]);
            //处理选项内容
            for(var i=0;i<fianlOptionList.length;i++){
                if(i<1){
                    fianlOptionList[i]['optionContent']="会";
                    fianlOptionList[i]['optionState'] ="answerDefault";
                }else{
                    fianlOptionList[i]['optionContent'] = "不会";
                    fianlOptionList[i]['optionState'] = "answerDontKnow";
                }
                fianlOptionList[i]['style'] ="text-align:center;padding-left:0rpx";
            }
        } else if (num <= (parseInt(configParam['jieduan_totalCount2']) + parseInt(configParam['jieduan_totalCount1'])) && num > configParam['jieduan_totalCount1']) {
            //在错误选项中删除一个非（以上都不对的选项）
            for (var i = 0; i < optionList.length;i++){
                if (optionList[i]['optionFlag']==2 && optionList[i]['id']>0){
                    optionList.splice(i,1);
                    break;
                }
            }
            optionList[optionList.length - 1]['style'] = "text-align:center;padding-left:0rpx";
            var fianlOptionList = optionList;
        } else if (num > (parseInt(configParam['jieduan_totalCount2']) + parseInt(configParam['jieduan_totalCount1']))) {
            optionList[optionList.length - 1]['style'] = "text-align:center;padding-left:0rpx";
            var fianlOptionList = optionList;
            
        }
    }else{
        //非第一次检测
        optionList[optionList.length - 1]['style'] = "text-align:center;padding-left:0rpx";
        var fianlOptionList = optionList;
    }
    return fianlOptionList;
}

//获取快速挑战随机的选项列表
function getOptionListByTiaoZhan(id,wordlist){
    var newList = wordlist.sort(randomsort);
    //获取错误的选项
    var wrongList=[];
    var rightList=[];
    for(var i=0;i<newList.length;i++){
        if(wrongList.length<4){
            var tempDes = newList[i]['zhdes'].split("|");
            var temp={};
            temp['optionContent'] = tempDes[0];
            temp['optionState'] = "answerDefault";
            if (newList[i]['id'] != id) {
                temp['optionFlag']=2;
                wrongList.push(temp);
            }
        }else{
            break;
        }
    }
    for(var i=0;i<newList.length;i++){
        if(newList[i]['id']==id){
            var tempDes = newList[i]['zhdes'].split("|");
            var temp={};
            temp['optionContent'] = tempDes[0];
            temp['optionState'] = "answerDefault";
            temp['optionFlag'] = 1;
            rightList.push(temp);
        }
    }

    //获取最终排序结果
    var finalOptionList=[];
    if(id%5!=0){
        console.log(1);
        //1个正确，2个错误，1个以上都不对（错误）
        finalOptionList.push(rightList[0]);
        finalOptionList.push(wrongList[0]);
        finalOptionList.push(wrongList[1]);
        finalOptionList.sort(randomsort);
        finalOptionList.push({ id: 0, optionContent: "以上都不对", optionFlag: 2, optionState:"answerDontKnow"});
    }else{
        console.log(2);
        //3个错误，1个以上都不对（正确）
        finalOptionList.push(wrongList[0]);
        finalOptionList.push(wrongList[1]);
        finalOptionList.push(wrongList[2]);
        finalOptionList.push({ id: 0, optionContent: "以上都不对", optionFlag: 1, optionState: "answerDontKnow" });
    }
    return finalOptionList;
}


module.exports={
    timeOut: timeOut,
    randomsort1: randomsort1,
    getConfigParam: getConfigParam,
    getStepNum: getStepNum,
    getOptionList: getOptionList,
    getOptionListByTiaoZhan: getOptionListByTiaoZhan
    
}