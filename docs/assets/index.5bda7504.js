var ee=Object.defineProperty;var te=(b,g,n)=>g in b?ee(b,g,{enumerable:!0,configurable:!0,writable:!0,value:n}):b[g]=n;var w=(b,g,n)=>(te(b,typeof g!="symbol"?g+"":g,n),n);const ne=function(){const g=document.createElement("link").relList;if(g&&g.supports&&g.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))c(u);new MutationObserver(u=>{for(const d of u)if(d.type==="childList")for(const p of d.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&c(p)}).observe(document,{childList:!0,subtree:!0});function n(u){const d={};return u.integrity&&(d.integrity=u.integrity),u.referrerpolicy&&(d.referrerPolicy=u.referrerpolicy),u.crossorigin==="use-credentials"?d.credentials="include":u.crossorigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function c(u){if(u.ep)return;u.ep=!0;const d=n(u);fetch(u.href,d)}};ne();var N=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},ae={exports:{}};(function(b){var g=typeof window!="undefined"?window:typeof WorkerGlobalScope!="undefined"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var n=function(c){var u=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,d=0,p={},o={manual:c.Prism&&c.Prism.manual,disableWorkerMessageHandler:c.Prism&&c.Prism.disableWorkerMessageHandler,util:{encode:function t(e){return e instanceof v?new v(e.type,t(e.content),e.alias):Array.isArray(e)?e.map(t):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(t){return Object.prototype.toString.call(t).slice(8,-1)},objId:function(t){return t.__id||Object.defineProperty(t,"__id",{value:++d}),t.__id},clone:function t(e,a){a=a||{};var i,r;switch(o.util.type(e)){case"Object":if(r=o.util.objId(e),a[r])return a[r];i={},a[r]=i;for(var l in e)e.hasOwnProperty(l)&&(i[l]=t(e[l],a));return i;case"Array":return r=o.util.objId(e),a[r]?a[r]:(i=[],a[r]=i,e.forEach(function(f,s){i[s]=t(f,a)}),i);default:return e}},getLanguage:function(t){for(;t;){var e=u.exec(t.className);if(e)return e[1].toLowerCase();t=t.parentElement}return"none"},setLanguage:function(t,e){t.className=t.className.replace(RegExp(u,"gi"),""),t.classList.add("language-"+e)},currentScript:function(){if(typeof document=="undefined")return null;if("currentScript"in document&&1<2)return document.currentScript;try{throw new Error}catch(i){var t=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(i.stack)||[])[1];if(t){var e=document.getElementsByTagName("script");for(var a in e)if(e[a].src==t)return e[a]}return null}},isActive:function(t,e,a){for(var i="no-"+e;t;){var r=t.classList;if(r.contains(e))return!0;if(r.contains(i))return!1;t=t.parentElement}return!!a}},languages:{plain:p,plaintext:p,text:p,txt:p,extend:function(t,e){var a=o.util.clone(o.languages[t]);for(var i in e)a[i]=e[i];return a},insertBefore:function(t,e,a,i){i=i||o.languages;var r=i[t],l={};for(var f in r)if(r.hasOwnProperty(f)){if(f==e)for(var s in a)a.hasOwnProperty(s)&&(l[s]=a[s]);a.hasOwnProperty(f)||(l[f]=r[f])}var m=i[t];return i[t]=l,o.languages.DFS(o.languages,function(k,E){E===m&&k!=t&&(this[k]=l)}),l},DFS:function t(e,a,i,r){r=r||{};var l=o.util.objId;for(var f in e)if(e.hasOwnProperty(f)){a.call(e,f,e[f],i||f);var s=e[f],m=o.util.type(s);m==="Object"&&!r[l(s)]?(r[l(s)]=!0,t(s,a,null,r)):m==="Array"&&!r[l(s)]&&(r[l(s)]=!0,t(s,a,f,r))}}},plugins:{},highlightAll:function(t,e){o.highlightAllUnder(document,t,e)},highlightAllUnder:function(t,e,a){var i={callback:a,container:t,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};o.hooks.run("before-highlightall",i),i.elements=Array.prototype.slice.apply(i.container.querySelectorAll(i.selector)),o.hooks.run("before-all-elements-highlight",i);for(var r=0,l;l=i.elements[r++];)o.highlightElement(l,e===!0,i.callback)},highlightElement:function(t,e,a){var i=o.util.getLanguage(t),r=o.languages[i];o.util.setLanguage(t,i);var l=t.parentElement;l&&l.nodeName.toLowerCase()==="pre"&&o.util.setLanguage(l,i);var f=t.textContent,s={element:t,language:i,grammar:r,code:f};function m(E){s.highlightedCode=E,o.hooks.run("before-insert",s),s.element.innerHTML=s.highlightedCode,o.hooks.run("after-highlight",s),o.hooks.run("complete",s),a&&a.call(s.element)}if(o.hooks.run("before-sanity-check",s),l=s.element.parentElement,l&&l.nodeName.toLowerCase()==="pre"&&!l.hasAttribute("tabindex")&&l.setAttribute("tabindex","0"),!s.code){o.hooks.run("complete",s),a&&a.call(s.element);return}if(o.hooks.run("before-highlight",s),!s.grammar){m(o.util.encode(s.code));return}if(e&&c.Worker){var k=new Worker(o.filename);k.onmessage=function(E){m(E.data)},k.postMessage(JSON.stringify({language:s.language,code:s.code,immediateClose:!0}))}else m(o.highlight(s.code,s.grammar,s.language))},highlight:function(t,e,a){var i={code:t,grammar:e,language:a};if(o.hooks.run("before-tokenize",i),!i.grammar)throw new Error('The language "'+i.language+'" has no grammar.');return i.tokens=o.tokenize(i.code,i.grammar),o.hooks.run("after-tokenize",i),v.stringify(o.util.encode(i.tokens),i.language)},tokenize:function(t,e){var a=e.rest;if(a){for(var i in a)e[i]=a[i];delete e.rest}var r=new C;return _(r,r.head,t),z(t,r,e,r.head,0),D(r)},hooks:{all:{},add:function(t,e){var a=o.hooks.all;a[t]=a[t]||[],a[t].push(e)},run:function(t,e){var a=o.hooks.all[t];if(!(!a||!a.length))for(var i=0,r;r=a[i++];)r(e)}},Token:v};c.Prism=o;function v(t,e,a,i){this.type=t,this.content=e,this.alias=a,this.length=(i||"").length|0}v.stringify=function t(e,a){if(typeof e=="string")return e;if(Array.isArray(e)){var i="";return e.forEach(function(m){i+=t(m,a)}),i}var r={type:e.type,content:t(e.content,a),tag:"span",classes:["token",e.type],attributes:{},language:a},l=e.alias;l&&(Array.isArray(l)?Array.prototype.push.apply(r.classes,l):r.classes.push(l)),o.hooks.run("wrap",r);var f="";for(var s in r.attributes)f+=" "+s+'="'+(r.attributes[s]||"").replace(/"/g,"&quot;")+'"';return"<"+r.tag+' class="'+r.classes.join(" ")+'"'+f+">"+r.content+"</"+r.tag+">"};function T(t,e,a,i){t.lastIndex=e;var r=t.exec(a);if(r&&i&&r[1]){var l=r[1].length;r.index+=l,r[0]=r[0].slice(l)}return r}function z(t,e,a,i,r,l){for(var f in a)if(!(!a.hasOwnProperty(f)||!a[f])){var s=a[f];s=Array.isArray(s)?s:[s];for(var m=0;m<s.length;++m){if(l&&l.cause==f+","+m)return;var k=s[m],E=k.inside,X=!!k.lookbehind,Y=!!k.greedy,J=k.alias;if(Y&&!k.pattern.global){var K=k.pattern.toString().match(/[imsuy]*$/)[0];k.pattern=RegExp(k.pattern.source,K+"g")}for(var Z=k.pattern||k,F=i.next,S=r;F!==e.tail&&!(l&&S>=l.reach);S+=F.value.length,F=F.next){var L=F.value;if(e.length>t.length)return;if(!(L instanceof v)){var I=1,A;if(Y){if(A=T(Z,S,t,X),!A||A.index>=t.length)break;var P=A.index,V=A.index+A[0].length,$=S;for($+=F.value.length;P>=$;)F=F.next,$+=F.value.length;if($-=F.value.length,S=$,F.value instanceof v)continue;for(var M=F;M!==e.tail&&($<V||typeof M.value=="string");M=M.next)I++,$+=M.value.length;I--,L=t.slice(S,$),A.index-=S}else if(A=T(Z,0,L,X),!A)continue;var P=A.index,R=A[0],H=L.slice(0,P),W=L.slice(P+R.length),B=S+L.length;l&&B>l.reach&&(l.reach=B);var j=F.prev;H&&(j=_(e,j,H),S+=H.length),q(e,j,I);var Q=new v(f,E?o.tokenize(R,E):R,J,R);if(F=_(e,j,Q),W&&_(e,F,W),I>1){var U={cause:f+","+m,reach:B};z(t,e,a,F.prev,S,U),l&&U.reach>l.reach&&(l.reach=U.reach)}}}}}}function C(){var t={value:null,prev:null,next:null},e={value:null,prev:t,next:null};t.next=e,this.head=t,this.tail=e,this.length=0}function _(t,e,a){var i=e.next,r={value:a,prev:e,next:i};return e.next=r,i.prev=r,t.length++,r}function q(t,e,a){for(var i=e.next,r=0;r<a&&i!==t.tail;r++)i=i.next;e.next=i,i.prev=e,t.length-=r}function D(t){for(var e=[],a=t.head.next;a!==t.tail;)e.push(a.value),a=a.next;return e}if(!c.document)return c.addEventListener&&(o.disableWorkerMessageHandler||c.addEventListener("message",function(t){var e=JSON.parse(t.data),a=e.language,i=e.code,r=e.immediateClose;c.postMessage(o.highlight(i,o.languages[a],a)),r&&c.close()},!1)),o;var y=o.util.currentScript();y&&(o.filename=y.src,y.hasAttribute("data-manual")&&(o.manual=!0));function h(){o.manual||o.highlightAll()}if(!o.manual){var x=document.readyState;x==="loading"||x==="interactive"&&y&&y.defer?document.addEventListener("DOMContentLoaded",h):window.requestAnimationFrame?window.requestAnimationFrame(h):window.setTimeout(h,16)}return o}(g);b.exports&&(b.exports=n),typeof N!="undefined"&&(N.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside["attr-value"].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside["internal-subset"].inside=n.languages.markup,n.hooks.add("wrap",function(c){c.type==="entity"&&(c.attributes.title=c.content.replace(/&amp;/,"&"))}),Object.defineProperty(n.languages.markup.tag,"addInlined",{value:function(u,d){var p={};p["language-"+d]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[d]},p.cdata=/^<!\[CDATA\[|\]\]>$/i;var o={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:p}};o["language-"+d]={pattern:/[\s\S]+/,inside:n.languages[d]};var v={};v[u]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return u}),"i"),lookbehind:!0,greedy:!0,inside:o},n.languages.insertBefore("markup","cdata",v)}}),Object.defineProperty(n.languages.markup.tag,"addAttribute",{value:function(c,u){n.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+c+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[u,"language-"+u],inside:n.languages[u]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend("markup",{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,function(c){var u=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;c.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:/@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+u.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+u.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+u.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:u,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},c.languages.css.atrule.inside.rest=c.languages.css;var d=c.languages.markup;d&&(d.tag.addInlined("style","css"),d.tag.addAttribute("style","css"))}(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend("clike",{"class-name":[n.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),n.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),n.languages.markup&&(n.languages.markup.tag.addInlined("script","javascript"),n.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),n.languages.js=n.languages.javascript,function(){if(typeof n=="undefined"||typeof document=="undefined")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var c="Loading\u2026",u=function(y,h){return"\u2716 Error "+y+" while fetching file: "+h},d="\u2716 Error: File does not exist or is empty",p={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},o="data-src-status",v="loading",T="loaded",z="failed",C="pre[data-src]:not(["+o+'="'+T+'"]):not(['+o+'="'+v+'"])';function _(y,h,x){var t=new XMLHttpRequest;t.open("GET",y,!0),t.onreadystatechange=function(){t.readyState==4&&(t.status<400&&t.responseText?h(t.responseText):t.status>=400?x(u(t.status,t.statusText)):x(d))},t.send(null)}function q(y){var h=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(y||"");if(h){var x=Number(h[1]),t=h[2],e=h[3];return t?e?[x,Number(e)]:[x,void 0]:[x,x]}}n.hooks.add("before-highlightall",function(y){y.selector+=", "+C}),n.hooks.add("before-sanity-check",function(y){var h=y.element;if(h.matches(C)){y.code="",h.setAttribute(o,v);var x=h.appendChild(document.createElement("CODE"));x.textContent=c;var t=h.getAttribute("data-src"),e=y.language;if(e==="none"){var a=(/\.(\w+)$/.exec(t)||[,"none"])[1];e=p[a]||a}n.util.setLanguage(x,e),n.util.setLanguage(h,e);var i=n.plugins.autoloader;i&&i.loadLanguages(e),_(t,function(r){h.setAttribute(o,T);var l=q(h.getAttribute("data-range"));if(l){var f=r.split(/\r\n?|\n/g),s=l[0],m=l[1]==null?f.length:l[1];s<0&&(s+=f.length),s=Math.max(0,Math.min(s-1,f.length)),m<0&&(m+=f.length),m=Math.max(0,Math.min(m,f.length)),r=f.slice(s,m).join(`
`),h.hasAttribute("data-start")||h.setAttribute("data-start",String(s+1))}x.textContent=r,n.highlightElement(x)},function(r){h.setAttribute(o,z),x.textContent=r})}}),n.plugins.fileHighlight={highlight:function(h){for(var x=(h||document).querySelectorAll(C),t=0,e;e=x[t++];)n.highlightElement(e)}};var D=!1;n.fileHighlight=function(){D||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),D=!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}}()})(ae);const G=(b,g,n)=>b*(n-g)/100+g;class O{constructor({stiffness:g=10,damping:n=30,mass:c=20,input:u=0,onFrame:d=()=>null,onFinished:p=()=>{}}){w(this,"_input");w(this,"output");w(this,"stiffness");w(this,"damping");w(this,"mass");w(this,"velocity",0);w(this,"amplitude",0);w(this,"animating");w(this,"callback");w(this,"lastTime");w(this,"currentTime");w(this,"delta");w(this,"animationFrame");w(this,"onFinished");w(this,"interpolate",()=>{const g=G(this.stiffness,-1,-300),n=G(this.damping,-.4,-20),c=G(this.mass,.1,10),u=g*(this.output-this.input),d=n*this.velocity;this.amplitude=(u+d)/c,this.velocity+=this.amplitude*(this.delta/1e3),this.output+=this.velocity*(this.delta/1e3)});w(this,"animLoop",()=>{this.currentTime=Date.now(),this.animating||(this.lastTime=this.currentTime-1),this.delta=this.currentTime-this.lastTime,this.lastTime=this.currentTime,this.animating=!0,this.interpolate(),this.callback(this.output,this.velocity),this.animating=!(Math.abs(this.velocity)<.2&&Math.abs(this.output-this.input)<.2),this.animating?(cancelAnimationFrame(this.animationFrame),this.animationFrame=requestAnimationFrame(this.animLoop)):(this.animating=!1,this.onFinished(),console.log("finished spring animation"))});w(this,"animate",()=>{this.animating||this.animLoop()});this.animating=!1,this.callback=d,this.lastTime=0,this.currentTime=0,this.delta=0,this.animationFrame=0,this.stiffness=g,this.damping=n,this.mass=c,this.onFinished=p,this._input=u,this.output=this.input}set input(g){this._input=g,this.animate()}get input(){return this._input}}function ie(){const b=document.querySelector(".sailboat"),g=document.querySelector(".sailboat--away"),n=document.querySelector(".sailboat--back"),c=new O({stiffness:10,damping:80,mass:50,onFrame:(u,d)=>{b!==null&&(b.style.transform=`translateX(${u}%) rotate(${d*-.3}deg)`)}});g&&g.addEventListener("click",()=>{c.input=100}),n&&n.addEventListener("click",()=>{c.input=0})}function re(){const b=document.querySelector(".spider"),g=document.querySelector(".section--example-spider"),n=new O({stiffness:30,damping:50,mass:10,onFrame:c=>{b.style.transform=`translateY(${c}px)`}});window.addEventListener("scroll",()=>{n.input=window.scrollY-g.offsetTop+window.innerHeight*.5})}function oe(){const b=document.querySelector(".helicopter"),g=document.querySelector(".section--example-helicopter"),n={x:0,y:0,velocity:0},c=(p,o,v)=>`translate(${p}px, ${o}px) rotate(${v*.05}deg)`,u={x:new O({onFrame:(p,o)=>{n.x=p,n.velocity=o,b&&(b.style.transform=c(n.x,n.y,n.velocity))}}),y:new O({onFrame:p=>{n.y=p}})},d=(p,o)=>{if(!b||!g)return;const v=g.getBoundingClientRect(),T=p-(v.left+v.width*.5),z=o-(v.top+v.height*.5);u.x.input=T,u.y.input=z};g!==null&&(g.addEventListener("mousemove",p=>{!p.clientX||!p.clientY||d(p.clientX,p.clientY)}),g.addEventListener("touchmove",p=>{p.touches!==void 0&&d(p.touches[0].clientX,p.touches[0].clientY)}))}oe();ie();re();
