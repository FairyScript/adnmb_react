const utils = {
    parse: str => {
        let s = str.matchAll(/(?:\?|&)?(\w+)=(\w+)/g);
        let e = {};
        while (true) {
            let t = s.next();
            if(t.done) break;
            e[t.value[1]] = t.value[2];
        }
        return e;
    },
    bulid: json => {

    }
}

class UrlParse {
    constructor(prop) {
        if(typeof prop === 'string') {
            this.c = utils.parse(prop);
        }
        if(typeof prop === 'object') {
            this.c = Object.assign(this.c,prop);
        }
    }

    c = {};//容器

    static parse(str) {
        let s = str.matchAll(/(?:\?|&)?(\w+)=(\w+)/g);
        let e = {};
        while (true) {
            let t = s.next();
            if(t.done) break;
            e[t.value[1]] = t.value[2];
        }
        return e;
    }

    toString() {
        let s = '';
        this.e.forEach(key => {
            s += key + '='
        });
    }
}