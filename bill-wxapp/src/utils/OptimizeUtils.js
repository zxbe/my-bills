
export default class OptimizeUtils {

    static prefetchHtmlAndSource(path){
        fetch(path, {cache: "no-store"})
            .then((d) => d.text())
            .then((d) => {
                let htmlElement = document.createElement('html');
                htmlElement.innerHTML = d;
                let sourceList = [...OptimizeUtils._getCSSSourceList(htmlElement), ...OptimizeUtils._getJSSourceList(htmlElement)];

                sourceList.forEach((item)=>{
                    let prefetchLink = document.createElement("link");
                    prefetchLink.setAttribute("rel", "prefetch");
                    prefetchLink.setAttribute("href", item);
                    document.getElementsByTagName("head")[0].appendChild(prefetchLink);
                    // fetch(item,{cache:"force-cache"}).then();
                })
            });
    }

    static requestFullScreen(){
        let de = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }
    }

    static _getJSSourceList(htmlElement){
        let elementList = htmlElement.getElementsByTagName("script");
        let sourceList = [];
        for (let i = 0; i < elementList.length; i++) {
            let item = elementList.item(i);
            sourceList.push(item.src);
        }
        return sourceList;
    }

    static _getCSSSourceList(htmlElement){
        let elementList = htmlElement.getElementsByTagName("link");
        let sourceList = [];
        for (let i = 0; i < elementList.length; i++) {
            let item = elementList.item(i);
            if (item.rel === "stylesheet") {
                sourceList.push(item.href);
            }
        }
        return sourceList;
    }
}
