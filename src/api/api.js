/**API
 * 
 */

const path = {
    pathname: 'https://adnmb2.com/',
    apiPath: 'https://adnmb2.com/Api/',
    cdnPath: 'https://nmbimg.fastmirror.org',
    testPath: '/'
};

/**
 * 构造fetch获取内容
 * @param {String} type API类型 
 * @param {Object} header Header参数
 */
async function getContent(type='ref',props) {
    let url = path.testPath + type;
    if(!(props === undefined)) {
        let params = new URLSearchParams(props);
        url += '?' + params.toString();
    }
    console.log('url:'+url);
    let config = {
        cache: 'no-cache',
        headers: {"user-agent": "HavefunClient-Dawn"},
        method: 'GET',
        mode: 'no-cors'
    }
    try {
        let res = await fetch(url,config);
        if(res.ok) {
            console.log('getContent! '+url);
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

//获取板块列表
function getForumList() {
    return getContent('getForumList')
}

//获取时间线
function getTimeLine() {
    return getContent('timeline')
}

//获取串内容
function getThread(props = {id: 14500641,page: 1}) {
    console.log('getThread!');
    return getContent('thread',props);
}

//获取*单个*串内容
function getRef(props = {id: 14500641}) {
    console.log('getRef!');
    return getContent('ref',props)
}

//获取板块内容
function getForum(props = {id: 4,page: 1}) {
    console.log('getForum!');
    console.log(props);
    let func = props.id === '-1' ? getTimeLine() : getContent('showf',props);//判断是否是时间线
    return func
}

/**URL解析
 * 形如：https://adnmb2.com/t/18097095?r=18107967&page=2
 * URL可能含有的参数
 * @returns {String} viewmode 访问模式 f,t,admin(这个暂时不好用)
 * @returns {String} id: 串号
 * @returns {String} r: 回应串号
 * @returns {Number} page: 页数
 */
function getUrl() {
    let url = window.location;
    let e = {};

    //判断是否有pathname
    if(url.pathname === '/') {
        e = {
            viewmode: 'f',
            id: '时间线',
            page: 1
        }
        return e;
    }
    //解析串号
    try {
        let parser = /\/(.+)\/(.*)/.exec(url.pathname);
        e.viewmode = parser[1];
        e.id = decodeURI(parser[2]);
    } catch (error) {
        alert('串号解析失败！');
        console.log(error);
    }
    
    //解析search
    let s = new URLSearchParams(url.search).entries();
    while (true) {
        let t = s.next();
        console.log(t);
        if(t.done) break;
        e[t.value[0]] = t.value[1];
    }
    return e;
}
export {getForumList,getTimeLine,getForum,getThread,getRef,getUrl}