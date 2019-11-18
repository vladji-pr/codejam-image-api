!function(t){var e={};function o(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=t,o.c=e,o.d=function(t,e,r){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)o.d(r,i,function(e){return t[e]}.bind(null,i));return r},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=2)}([function(t,e,o){var r,i,s;i=[e],void 0===(s="function"==typeof(r=function(t){"use strict";function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function t(t,e){for(var o=0;o<e.length;o++){var r=e[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,o,r){return o&&t(e.prototype,o),r&&t(e,r),e}}(),r="https://api.netlify.com",i=function(){function t(o){e(this,t),this.err=o}return o(t,[{key:"toString",value:function(){return this.err&&this.err.message}}]),t}(),s={github:{width:960,height:600},gitlab:{width:960,height:600},bitbucket:{width:960,height:500},email:{width:500,height:400}},n=function(){function t(o){e(this,t),this.site_id=o.site_id,this.base_url=o.base_url||r}return o(t,[{key:"handshakeCallback",value:function(t,e){var o=this;return function r(i){if(i.data==="authorizing:"+t.provider&&i.origin===o.base_url)return window.removeEventListener("message",r,!1),window.addEventListener("message",o.authorizeCallback(t,e),!1),o.authWindow.postMessage(i.data,i.origin)}}},{key:"authorizeCallback",value:function(t,e){var o=this;return function r(s){var n,a;s.origin===o.base_url&&(0===s.data.indexOf("authorization:"+t.provider+":success:")&&(n=JSON.parse(s.data.match(new RegExp("^authorization:"+t.provider+":success:(.+)$"))[1]),window.removeEventListener("message",r,!1),o.authWindow.close(),e(null,n)),0===s.data.indexOf("authorization:"+t.provider+":error:")&&(a=JSON.parse(s.data.match(new RegExp("^authorization:"+t.provider+":error:(.+)$"))[1]),window.removeEventListener("message",r,!1),o.authWindow.close(),e(new i(a))))}}},{key:"getSiteID",value:function(){if(this.site_id)return this.site_id;var t=document.location.host.split(":")[0];return"localhost"===t?null:t}},{key:"authenticate",value:function(t,e){var o,r,n,a=this.getSiteID(),c=t.provider;if(!c)return e(new i({message:"You must specify a provider when calling netlify.authenticate"}));if(!a)return e(new i({message:'You must set a site_id with netlify.configure({site_id: "your-site-id"}) to make authentication work from localhost'}));var l=s[c]||s.github;o=screen.width/2-l.width/2,r=screen.height/2-l.height/2,window.addEventListener("message",this.handshakeCallback(t,e),!1),n=this.base_url+"/auth?provider="+t.provider+"&site_id="+a,t.scope&&(n+="&scope="+t.scope),!0===t.login&&(n+="&login=true"),t.beta_invite&&(n+="&beta_invite="+t.beta_invite),t.invite_code&&(n+="&invite_code="+t.invite_code),this.authWindow=window.open(n,"Netlify Authorization","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+l.width+", height="+l.height+", top="+r+", left="+o+");"),this.authWindow.focus()}}]),t}();t.default=n})?r.apply(e,i):r)||(t.exports=s)},function(t,e,o){},function(t,e,o){"use strict";o.r(e);class r{constructor(){this.canvasDraw=document.querySelector(".display-canvas"),this.draftCanvas=document.querySelector(".draft-canvas"),this.sizesWrap=document.querySelector(".canvas-sizes"),this.gayscaleBtn=document.querySelector(".btn_grayscale"),this.listeners(),this.tool=null,this.color=null,this.line=1,this.startX=null,this.startY=null,this.imgSave=null,this.resizeImgSave=null}listeners(){this.canvasDraw.addEventListener("mousedown",t=>{"pencil-tool"===this.tool&&this.pencil(t),"bucket-tool"===this.tool&&this.bucketTool(t)}),this.canvasDraw.addEventListener("mouseup",()=>{this.imgSave=this.canvasDraw.toDataURL()}),this.sizesWrap.addEventListener("click",t=>{if(t.target.classList.contains("btn_size")){const e=t.target.dataset.size,o=t.target.dataset.pen;this.line=+o,this.imgSave&&this.reDrawCanvas(e)}}),this.gayscaleBtn.addEventListener("click",()=>{this.imgSave&&this.grayscaleConvert()})}grayscaleConvert(){const t=this.canvasDraw,e=t.getContext("2d"),o=e.getImageData(0,0,t.width,t.height),i=e.createImageData(t.width,t.height),s=o.data,n=i.data;for(let t=0;t<s.length;t+=4){const e=.2126*s[t]+.7152*s[t+1]+.0722*s[t+2];n[t]=e,n[t+1]=e,n[t+2]=e,n[t+3]=s[t+3]}r.clearCanvas(),e.putImageData(i,0,0)}reDrawCanvas(t){const e=this.canvasDraw.getContext("2d"),o=this.draftCanvas,i=o.getContext("2d"),s=new Image;s.src=this.imgSave,o.width=t,o.height=t;const n=()=>{i.drawImage(s,0,0,t,t),this.resizeImgSave=o.toDataURL();const n=new Image;n.src=this.resizeImgSave;n.addEventListener("load",()=>{r.clearCanvas(),e.imageSmoothingEnabled=!1,e.webkitImageSmoothingEnabled=!1,e.mozImageSmoothingEnabled=!1,e.drawImage(n,0,0,512,512)})};s.addEventListener("load",()=>{n()})}drawImage(t,e){r.clearCanvas();const o=e,i=this.canvasDraw,s=i.getContext("2d"),n=t;if(o.width>i.width||o.height>i.height){const t=n/(o.width>o.height?o.width:o.height);o.width*=t,o.height*=t}const a=(n-o.width)/2,c=(n-o.height)/2;s.drawImage(o,a,c,o.width,o.height),this.imgSave=this.canvasDraw.toDataURL()}getCoordinate(t){const e=this.canvasDraw,o=t.pageX-e.offsetLeft,r=t.pageY-e.offsetTop;return{dotX:o-o%this.line,dotY:r-r%this.line}}pencil(t){const e=this.canvasDraw.getContext("2d");e.fillStyle=this.color;(t=>{const o=this.getCoordinate(t);this.startX=o.dotX,this.startY=o.dotY,e.fillRect(o.dotX,o.dotY,this.line,this.line)})(t);const o=this.bresenham.bind(this),r=()=>{this.canvasDraw.removeEventListener("mousemove",o),document.removeEventListener("mouseup",r)};this.canvasDraw.addEventListener("mousemove",o),document.addEventListener("mouseup",r)}bresenham(t){const e=this.canvasDraw.getContext("2d");e.fillStyle=this.color;const o=this.line,r=this.getCoordinate(t);let i=r.dotX-this.startX,s=r.dotY-this.startY;const n=Math.abs(i/o),a=Math.abs(s/o);let c=this.startX,l=this.startY;const h=+o;i=i>0?h:-h,s=s>0?h:-h;let u=Math.abs(r.dotY-this.startY)/Math.abs(r.dotX-this.startX),d=n;n<a&&(d=a,u=Math.abs(r.dotX-this.startX)/Math.abs(r.dotY-this.startY)),u-=Math.trunc(u);let v=0;if(n>=a)for(let t=0;t<d;t+=1)if(c+=i,(v+=u)>=.5&&(l+=s,v-=1),"eraser"===this.tool){const t={pointX:c,pointY:l};this.eraserTool(t)}else e.fillRect(c,l,o,o);else for(let t=0;t<d;t+=1)if(l+=s,(v+=u)>=.5&&(c+=i,v-=1),"eraser"===this.tool){const t={pointX:c,pointY:l};this.eraserTool(t)}else e.fillRect(c,l,o,o);this.startX=c,this.startY=l}bucketTool(t){const e=this.line,o=this.canvasDraw,r=o.getContext("2d");r.fillStyle=this.color;let i=t.pageX-o.offsetLeft,s=t.pageY-o.offsetTop;const n=r.getImageData(i,s,1,1).data.join("");if(r.getImageData(i,s,1,1).data.join(", ")===`${this.color.slice(4,-1)}, 255`)return;const a=[[i-=i%e,s-=s%e]],c=(t,e)=>{const o=t,i=e;return r.getImageData(o,i,1,1).data.join("")===n};for(;a.length;){const t=a.pop(),i=t[0];let s=t[1];do{s-=e}while(s>=0&&c(i,s));s+=e;let n=!1,u=!1;do{l=i,h=s,r.fillRect(l,h,e,e),i<o.width&&(c(i+e,s)?n||(a.push([i+e,s]),n=!0):n&&(n=!1)),i>0&&(c(i-e,s)?u||(a.push([i-e,s]),u=!0):u&&(u=!1)),s+=e}while(c(i,s)&&s!==o.height)}var l,h}colorPicker(t){const e=t.pageX-this.canvasDraw.offsetLeft,o=t.pageY-this.canvasDraw.offsetTop;return this.canvasDraw.getContext("2d").getImageData(e,o,1,1).data}static clearCanvas(){const t=document.querySelector("canvas");t.getContext("2d").clearRect(0,0,t.width,t.height)}static grabImg(){return document.querySelector("canvas").toDataURL()}static putCanvas(t){const e=document.querySelector("canvas").getContext("2d"),o=new Image;o.onload=()=>{e.drawImage(o,0,0)},o.src=t}}class i{constructor(t){this.canvas=t,this.canvasElem=document.querySelector("canvas"),this.controlPanel=document.querySelector(".control-panel-wrapper"),this.tools=document.querySelector(".tools-wrapper ul"),this.palette=document.querySelector(".palette-wrapper"),this.pencil=document.querySelector(".pencil-tool"),this.bucket=document.querySelector(".bucket-tool"),this.colorPicker=document.querySelector(".choose-tool"),this.currentColorElem=document.querySelector(".color-view_cur input"),this.prevColorElem=document.querySelector(".color-view_prev"),this.clear=document.querySelector(".btn_clear"),this.requestField=document.querySelector(".request-field"),this.currentTool=this.pencil,this.currentColor="#008800",this.prevColor="#ffbb00",this.isPickColor=0,this.chooseColor()}logic(){this.tools.addEventListener("click",t=>{t.target.closest("li")&&this.markActiveTool(t.target)}),this.palette.addEventListener("click",t=>{if(t.target.closest("li")){const e=t.target.closest("li").querySelector(".color-view");e.classList.contains("color-view_cur")||this.switchColors(e)}}),this.palette.addEventListener("change",()=>{this.currentColor=this.currentColorElem.value,this.currentColorElem.style.backgroundColor=this.currentColorElem.value,this.canvas.color=this.currentColorElem.style.backgroundColor});const t=t=>{"KeyP"===t.code?this.markActiveTool(this.pencil):"KeyC"===t.code?this.markActiveTool(this.colorPicker):"KeyB"===t.code&&this.markActiveTool(this.bucket)};document.addEventListener("keydown",t),this.requestField.addEventListener("focus",()=>{document.removeEventListener("keydown",t)}),this.requestField.addEventListener("blur",()=>{document.addEventListener("keydown",t)}),this.clear.addEventListener("click",r.clearCanvas),document.addEventListener("selectstart",t=>{t.preventDefault()})}markActiveTool(t){const e=t;this.currentTool.classList.remove("active-tool"),e.classList.add("active-tool"),this.currentTool=e,this.setActiveTool(e)}setActiveTool(t){const e=t.closest("li").classList[0];this.canvas.tool=e,this.isPickColor="choose-tool"===e?1:0}setActiveColor(t){this.currentColorElem.value=t,this.prevColorElem.style.backgroundColor=this.prevColor,this.currentColor=t,this.currentColorElem.style.backgroundColor=t,this.canvas.color=this.currentColorElem.style.backgroundColor}switchColors(t){const e=getComputedStyle(t).backgroundColor,o=i.convertBaseColor(e);this.currentColorElem.value=o,this.prevColorElem.style.backgroundColor=this.currentColor,this.prevColor=this.currentColor,this.currentColor=o,this.canvas.color=e}chooseColor(){this.canvasElem.addEventListener("click",t=>{if(this.isPickColor){const e=this.canvas.colorPicker(t),o=i.convertBaseColor(e);this.prevColor=this.currentColor,this.setActiveColor(o)}})}static convertBaseColor(t){let e=t,o="";return"string"==typeof e&&(e=e.slice(4,-1).split(",")),e.forEach((t,e)=>{if(3===e)return;let r=t;"string"==typeof r&&(r=+r);let i=r.toString(16);i="0"===i?"00":String(i),o+=i}),o="000000"===o?"#ffffff":`#${o}`}}class s{constructor(){this.errorPosition=document.querySelector(".loader-control")}badAnswer(t){const e=document.createElement("div"),o=document.createElement("div"),r=document.createElement("p");e.classList.add("modal-error"),o.classList.add("modal-close-btn"),o.innerHTML="&times;",r.innerHTML=t,e.append(o,r),this.errorPosition.append(e),o.addEventListener("click",()=>{e.hidden=!0})}}var n=o(0),a=o.n(n);o(1);const c=new r;new class{constructor(t){this.control=new i(t),this.canvas=t,this.localStore={}}logic(){const t=this.control,e=this.localStore;if(localStorage.getItem("storePalette")){t.logic();const e=JSON.parse(localStorage.getItem("storePalette"));r.putCanvas(e.canvasImg);const o=document.querySelector(`.${e.activeTool}`);t.markActiveTool(o),t.currentColor=e.currentColor,t.prevColor=e.prevColor,t.setActiveColor(t.currentColor),this.canvas.line=e.lineFat,this.canvas.imgSave=e.imgSave}else t.logic(),t.markActiveTool(t.currentTool),t.setActiveColor(t.currentColor);window.addEventListener("beforeunload",()=>{e.canvasImg=r.grabImg();const o=t.currentTool.classList[0];e.activeTool=o,e.currentColor=t.currentColor,e.prevColor=t.prevColor,e.lineFat=this.canvas.line,e.imgSave=this.canvas.imgSave;const i=JSON.stringify(e);localStorage.setItem("storePalette",i)})}}(c).logic(),new class{constructor(t){this.canvas=t,this.error=new s,this.requestURL="https://api.unsplash.com/photos/random?client_id=76e02e7b52a90f9aeedee595901a91ad8a6e98072539f05ba2420e24b6a4fa75&query=town,",this.loadBtn=document.querySelector(".btn_load"),this.requestField=document.querySelector(".request-field")}logic(){this.loadBtn.addEventListener("click",()=>{this.getData(),this.canvas.line=1})}async getData(){let t=this.requestURL;const e=this.requestField.value;if(e){t=`${t}${e}`;try{const e=await fetch(t);if(!e.ok)throw new Error("Unfortunately we didn't get correct answer from the server");{const t=await e.json();this.imgPrepare(t.urls.small)}}catch(t){this.error.badAnswer(t.message)}}}imgPrepare(t){const e=new Image;e.crossOrigin="Anonymous",e.src=t;e.addEventListener("load",()=>{this.canvas.drawImage(512,e)})}}(c).logic(),function(){const t=document.querySelector(".login"),e=document.querySelector(".login-output");t.addEventListener("click",()=>{const t=new a.a({}).authenticate({provider:"github",scope:"user"},(t,o)=>{e.innerText=t?`Error Authenticating with GitHub: ${t}`:`Authenticated with GitHub. Access Token: ${o.token}`});console.log("req",t)})}()}]);
//# sourceMappingURL=app.bundle.js.map