/**API
 * 
 */

const path = {
    pathname: 'https://adnmb2.com/',
    apiPath: 'https://adnmb2.com/Api/',
    cdnPath: 'https://nmbimg.fastmirror.org'
}

/**
 * 构建get请求
 * @param {string} type API Key
 * @param {object} params 
 */
async function getFetch(type,params) {
    let url = path.apiPath + type;
    if(params) url.search = URLSearchParams(params);
    console.log('GET Url:' + url);
    try {
        let res = await fetch(url,{
            method: 'GET',
            headers: {
                'user-agent': 'HavefunClient-Dawn'
            },
            cache: 'no-cache'
        });
        if(!res.ok) {
            throw Error(res.statusText);
        }
        return res.json();
    } catch(err) {
        console.log(err);
    }
}

/**
 * 获取板块列表
 */
async function getForumList() {
    return await getFetch('getForumList')
}

/**
 * 请求板块/串内容
 * 默认综1
 * @param {string} type 请求类型
 * @param {Number} _id 板块ID/串号
 * @param {Number} _page 页数
 */
async function getContent(type='showf',_id=4,_page=1) {
    let params = {
        id: _id,
        page: _page
    };
    return await getFetch(type,params);
}

export {getForumList,getContent}