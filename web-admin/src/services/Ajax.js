const headers = new Headers();
headers.append("Content-Type", "application/json;charset=utf-8");
// headers.append("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
// headers.append("Content-Length", content.length.toString());
// headers.append("X-Custom-Header", "ProcessThisImmediately");

export default class Ajax {
    static async httpGet(url, params) {
        try {
            let completeUrl = "/api" + url;
            let response = await fetch(completeUrl, {
                method: 'GET',
                headers: headers,
                // mode: 'cors',
                // cache: 'default',
                body: JSON.stringify(params)
            });
            let data = await response.json();
            if (data.code === "1") {
                return data;
            } else {
                let message = data.message;
                return new Error(message);
            }
        } catch (e) {
            return e;
        }
    }

    static apiPost(url, params) {
       let promise =  new Promise(async (resolve, reject) => {
            try {
                let completeUrl = "/api" + url;
                let response = await fetch(completeUrl, {
                    method: 'POST',
                    headers: headers,
                    // mode: 'cors',
                    // cache: 'default',
                    body: JSON.stringify(params)
                });
                let data = await response.json();
                if (data.code === "1") {
                    resolve(data);
                } else {
                    throw new Error(data.message || "");
                }
            } catch (e) {
                reject(e);
            }
        });
        return this.wrapPromise(promise);
    }

    static wrapPromise(promise, timeout = 10000) {
        let timeoutFn = null;
        let cancelFn = null;
        let timeoutPromise = new Promise((resolve, reject)=>{
            timeoutFn = () => {
                reject("请求超时");
            };
        });
        let cancelPromise = new Promise((resolve, reject)=>{
            cancelFn = (message)=>{
                reject("请求中止 "+message);
            }
        });
        let allPromise = Promise.race([promise, timeoutPromise, cancelPromise]);
        setTimeout(timeoutFn,timeout);
        allPromise.cancel = cancelFn;
        return allPromise;
    }
}
