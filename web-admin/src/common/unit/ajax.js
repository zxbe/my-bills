import $ from "jquery";

class Ajax {

    static apiPost(url, data, isasync, dataType) {
        let completeUrl = window.getBasePath() + "/api" + url;
        return this._post(completeUrl, data, isasync, dataType);
    }

    static apiGet(url, data, isasync, dataType) {
        let completeUrl = window.getBasePath() + "/api" + url;
        return this._get(completeUrl, data, isasync, dataType);
    }

    static _post(url, data, isasync, dataType) {

        return this._ajax(url, data, "POST", isasync, dataType);
    }

    static _get(url, data, isasync, dataType) {

        return this._ajax(url, data, "GET", isasync, dataType);
    }

    static _ajax(url, data, method = "GET", isasync, dataType) {

        var _isasync = isasync || "true";
        var myDataType = dataType || "json";

        /**
         * 提供取消渠道
         */
        let doCancel;

        var cancelPromise = new Promise((resolve, reject) => {
            doCancel = (reason) => {
                reject("用户取消,原因：" + reason);
            };
        });

        var promise = new Promise(function (resolve, reject) {

            $.ajax({
                url: url,
                type: method,
                data: data,
                timeout: 35000,
                dataType: myDataType,
                async: _isasync,
                beforeSend: function (request) {
                    request.setRequestHeader("TOKEN", "crsfToken");
                },
                success: function (d) {

                    if (!d.platform) {
                        resolve(d);
                        return;
                    }

                    if (d.result_flag === "SUCCESS") {
                        resolve(d);
                    } else {
                        console.log("接口返回错误信息");
                        reject(d.result_flag_dsc);
                    }

                }
            });
        });

        var allPromise = Promise.race([promise, cancelPromise]);
        var then = allPromise.then;

        allPromise.then = (fun) => {
            var promise = then.call(allPromise, fun);
            promise.cancel = doCancel;
            return promise;
        };

        allPromise.cancel = doCancel;

        return allPromise;
    }
}

class MockAjax {

    static apiPost(url, data, isasync, dataType) {
        return Ajax._get("http://localhost:8080/mock" + url + ".js", data, isasync, dataType);
    }

}

export {Ajax, MockAjax};
