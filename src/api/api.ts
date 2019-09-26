/**API
 * 
 */

import { Parser } from 'htmlparser2';

const path = {
    pathname: 'https://adnmb2.com/',
    apiPath: '/Api/',
    managePath: '/Home/Forum/',
    cdnPath: 'https://nmbimg.fastmirror.org/',
    postPath: '/Home/Forum/doReplyThread.html',
    testPath: '/'
};
const config: RequestInit = {
    cache: 'no-cache',
    headers: { "user-agent": "HavefunClient-Dawn" },
    method: 'GET',
    mode: 'cors'
}

interface ContentReturn {
    ok: boolean,
    json?: object,
    status?: any
}
/**
 * 构造fetch获取内容
 * @param {String} type API类型 
 * @param {Object} props Header参数
 * 
 * @returns {Boolean} ok 请求是否成功
 * @returns {Object} json 返回体，json格式
 */
async function getContent(type: string = 'ref', props?: any): Promise<ContentReturn> {
    let url = path.apiPath + type;
    if (!(props === undefined)) {
        let params = new URLSearchParams(props);
        url += '?' + params.toString();
    }
    console.log('url:' + url);
    let res = await fetch(url, config);
    if (res.ok) {
        console.log('getContent! ' + url);
        let json = await res.json();
        return { ok: true, json: json };
    } else {
        return { ok: false, status: res.status };
    }


}

//解析返回的Http数据
function parseResponseHttp(http: string) {
    let result = /<p class="(.+)">(.+)<\/p>/.exec(http);
    console.log(result);
    if(!result) return { ok: false, message: '解析失败！' };
    switch (result[1]) {
        case 'success': {
            return { ok: true, message: result[2] };
        }
        case 'error': {
            return { ok: false, message: result[2] };
        }
        default: return { ok: true, message: `未确定的result:${result}` };
    }
}

//发串
//发串是否成功的逻辑应在这里实现
async function postThread(formData: FormData) {
    let url = path.postPath;
    let config: RequestInit = {
        cache: 'no-cache',
        headers: { "user-agent": "HavefunClient-Dawn" },
        method: 'POST',
        body: formData,
        mode: 'no-cors',
        credentials: "include"
    }
    let res = await fetch(url, config);
    if (res.ok) {
        /* let text = await res.text();
        console.log(text); */
        //检测返回是否成功
        return parseResponseHttp(await res.text());
    } else {
        console.log(res);
        throw new Error('post失败!');
    }

}

//获取板块列表
function getForumList() {
    return getContent('getForumList')
}

/**
 * 获取时间线
 * @param {String} page 页数
 */
function getTimeLine(page: string = '1') {
    return getContent('timeline', { page })
}

/**
 * 获取串内容
 * @param {String} id 串ID
 * @param {String} page 页数
 */
function getThread(id: string = '14500641', page: string = '1') {
    console.log('getThread!');
    return getContent('thread', { id, page });
}

/**
 * 获取板块内容
 * @param {String} id 串ID
 * @param {String} page 页数
 */
function getForum(id: string = '4', page: string = '1') {
    console.log('getForum!');
    if (id === '-1') {
        return getTimeLine(page);
    } else {
        return getContent('showf', { id, page });
    }
}

//获取*单个*串内容
function getRef(id: string = '14500641') {
    console.log('getRef!');
    return getContent('ref', { id });
}

//获取父串
async function getParent(id = '14500641') {
    const url = `${path.managePath}ref?id=${id}`;
    console.log(url);
    const res = await fetch(url, config);
        if (res.ok) {
            const text = await res.text();
            let parent;
            const parser = new Parser({
                onopentag: function (name, attribs) {
                    if (name === "a" && attribs.class === "h-threads-info-id") {
                        let result = attribs.href.match(/\/t\/(\d+)\?/);
                        if(!result) return { ok: false, id: -1 }
                        parent = result[1]
                    }
                }
            }, { decodeEntities: true });
            parser.write(text);
            parser.end();
            return { ok: true, id: parent };
    }
}

export { path, getForumList, getTimeLine, getForum, getThread, getRef, getParent, postThread }