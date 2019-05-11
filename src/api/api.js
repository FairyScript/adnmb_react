import { parse } from "querystring";

/**API
 * 
 */

const path = {
    pathname: 'https://adnmb2.com/',
    apiPath: 'https://adnmb2.com/Api/',
    cdnPath: 'https://nmbimg.fastmirror.org',
    testPath: '/'
};


//获取板块列表
async function getForumList() {
    let url = path.testPath + 'getForumList';
    let config = {
        cache: 'no-cache',
        headers: {"user-agent": "HavefunClient/Dawn"},
        method: 'GET',
        mode: 'no-cors'
    }
    try {
        let res = await fetch(url,config);
        if(res.ok) {
            console.log('getForumList!');
            let json = await res.json();
            return {ok: true,json: json};
        } else {
            throw res;
        }
    } catch (error) {
        console.log(error);
        return {ok: false};
    }
    
}

//获取内容
async function getContent(type='showf',id=-1,page=1) {
    let url = path.testPath + type;
    let config = {
        cache: 'no-cache',
        headers: {
            "user-agent": "HavefunClient-Dawn",
            "id": id,
            "page": page
        },
        method: 'GET',
        mode: 'no-cors'
    }
    try {
        let res = await fetch(url,config);
        if(res.ok) {
            console.log('getContent!');
            let json = await res.json();
            return {ok: true,json: json};
        } else {
            throw res;
        }
    } catch (error) {
        console.log(error);
        return {ok: false};
    }
    
}

//获取串内容
function getThread(id,page=1) {
    console.log('getThread!');
    return getContent('thread',id,page);
}

//获取板块内容
function getForum(id=-1,page=1) {
    console.log('getForum!');
    return getContent('showf',id,page)
}

//URL解析
function getUrl() {
    let url = window.location;
    let parser = /\/(.+)\/(\d+)/.exec(url.pathname);
    let e = {
        viewmode: parser[1],//模式
        threadId: parser[2],//主串号
        replyId: /\?r=(\d+)/.exec(url.search)[1]//回应串号
    }
    return e;
}
export {getForumList,getForum,getThread,getUrl}