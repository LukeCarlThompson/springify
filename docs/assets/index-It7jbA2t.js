var be=Object.defineProperty;var de=p=>{throw TypeError(p)};var we=(p,u,n)=>u in p?be(p,u,{enumerable:!0,configurable:!0,writable:!0,value:n}):p[u]=n;var U=(p,u,n)=>we(p,typeof u!="symbol"?u+"":u,n),fe=(p,u,n)=>u.has(p)||de("Cannot "+n);var f=(p,u,n)=>(fe(p,u,"read from private field"),n?n.call(p):u.get(p)),S=(p,u,n)=>u.has(p)?de("Cannot add the same private member more than once"):u instanceof WeakSet?u.add(p):u.set(p,n),b=(p,u,n,o)=>(fe(p,u,"write to private field"),o?o.call(p,n):u.set(p,n),n);(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const g of document.querySelectorAll('link[rel="modulepreload"]'))o(g);new MutationObserver(g=>{for(const d of g)if(d.type==="childList")for(const v of d.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&o(v)}).observe(document,{childList:!0,subtree:!0});function n(g){const d={};return g.integrity&&(d.integrity=g.integrity),g.referrerPolicy&&(d.referrerPolicy=g.referrerPolicy),g.crossOrigin==="use-credentials"?d.credentials="include":g.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function o(g){if(g.ep)return;g.ep=!0;const d=n(g);fetch(g.href,d)}})();var pe=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Fe={exports:{}};(function(p){var u=typeof window<"u"?window:typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?self:{};/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */var n=function(o){var g=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,d=0,v={},s={manual:o.Prism&&o.Prism.manual,disableWorkerMessageHandler:o.Prism&&o.Prism.disableWorkerMessageHandler,util:{encode:function t(e){return e instanceof x?new x(e.type,t(e.content),e.alias):Array.isArray(e)?e.map(t):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(t){return Object.prototype.toString.call(t).slice(8,-1)},objId:function(t){return t.__id||Object.defineProperty(t,"__id",{value:++d}),t.__id},clone:function t(e,a){a=a||{};var r,i;switch(s.util.type(e)){case"Object":if(i=s.util.objId(e),a[i])return a[i];r={},a[i]=r;for(var c in e)e.hasOwnProperty(c)&&(r[c]=t(e[c],a));return r;case"Array":return i=s.util.objId(e),a[i]?a[i]:(r=[],a[i]=r,e.forEach(function(h,l){r[l]=t(h,a)}),r);default:return e}},getLanguage:function(t){for(;t;){var e=g.exec(t.className);if(e)return e[1].toLowerCase();t=t.parentElement}return"none"},setLanguage:function(t,e){t.className=t.className.replace(RegExp(g,"gi"),""),t.classList.add("language-"+e)},currentScript:function(){if(typeof document>"u")return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(r){var t=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r.stack)||[])[1];if(t){var e=document.getElementsByTagName("script");for(var a in e)if(e[a].src==t)return e[a]}return null}},isActive:function(t,e,a){for(var r="no-"+e;t;){var i=t.classList;if(i.contains(e))return!0;if(i.contains(r))return!1;t=t.parentElement}return!!a}},languages:{plain:v,plaintext:v,text:v,txt:v,extend:function(t,e){var a=s.util.clone(s.languages[t]);for(var r in e)a[r]=e[r];return a},insertBefore:function(t,e,a,r){r=r||s.languages;var i=r[t],c={};for(var h in i)if(i.hasOwnProperty(h)){if(h==e)for(var l in a)a.hasOwnProperty(l)&&(c[l]=a[l]);a.hasOwnProperty(h)||(c[h]=i[h])}var y=r[t];return r[t]=c,s.languages.DFS(s.languages,function(A,C){C===y&&A!=t&&(this[A]=c)}),c},DFS:function t(e,a,r,i){i=i||{};var c=s.util.objId;for(var h in e)if(e.hasOwnProperty(h)){a.call(e,h,e[h],r||h);var l=e[h],y=s.util.type(l);y==="Object"&&!i[c(l)]?(i[c(l)]=!0,t(l,a,null,i)):y==="Array"&&!i[c(l)]&&(i[c(l)]=!0,t(l,a,h,i))}}},plugins:{},highlightAll:function(t,e){s.highlightAllUnder(document,t,e)},highlightAllUnder:function(t,e,a){var r={callback:a,container:t,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};s.hooks.run("before-highlightall",r),r.elements=Array.prototype.slice.apply(r.container.querySelectorAll(r.selector)),s.hooks.run("before-all-elements-highlight",r);for(var i=0,c;c=r.elements[i++];)s.highlightElement(c,e===!0,r.callback)},highlightElement:function(t,e,a){var r=s.util.getLanguage(t),i=s.languages[r];s.util.setLanguage(t,r);var c=t.parentElement;c&&c.nodeName.toLowerCase()==="pre"&&s.util.setLanguage(c,r);var h=t.textContent,l={element:t,language:r,grammar:i,code:h};function y(C){l.highlightedCode=C,s.hooks.run("before-insert",l),l.element.innerHTML=l.highlightedCode,s.hooks.run("after-highlight",l),s.hooks.run("complete",l),a&&a.call(l.element)}if(s.hooks.run("before-sanity-check",l),c=l.element.parentElement,c&&c.nodeName.toLowerCase()==="pre"&&!c.hasAttribute("tabindex")&&c.setAttribute("tabindex","0"),!l.code){s.hooks.run("complete",l),a&&a.call(l.element);return}if(s.hooks.run("before-highlight",l),!l.grammar){y(s.util.encode(l.code));return}if(e&&o.Worker){var A=new Worker(s.filename);A.onmessage=function(C){y(C.data)},A.postMessage(JSON.stringify({language:l.language,code:l.code,immediateClose:!0}))}else y(s.highlight(l.code,l.grammar,l.language))},highlight:function(t,e,a){var r={code:t,grammar:e,language:a};if(s.hooks.run("before-tokenize",r),!r.grammar)throw new Error('The language "'+r.language+'" has no grammar.');return r.tokens=s.tokenize(r.code,r.grammar),s.hooks.run("after-tokenize",r),x.stringify(s.util.encode(r.tokens),r.language)},tokenize:function(t,e){var a=e.rest;if(a){for(var r in a)e[r]=a[r];delete e.rest}var i=new X;return z(i,i.head,t),J(t,i,e,i.head,0),K(i)},hooks:{all:{},add:function(t,e){var a=s.hooks.all;a[t]=a[t]||[],a[t].push(e)},run:function(t,e){var a=s.hooks.all[t];if(!(!a||!a.length))for(var r=0,i;i=a[r++];)i(e)}},Token:x};o.Prism=s;function x(t,e,a,r){this.type=t,this.content=e,this.alias=a,this.length=(r||"").length|0}x.stringify=function t(e,a){if(typeof e=="string")return e;if(Array.isArray(e)){var r="";return e.forEach(function(y){r+=t(y,a)}),r}var i={type:e.type,content:t(e.content,a),tag:"span",classes:["token",e.type],attributes:{},language:a},c=e.alias;c&&(Array.isArray(c)?Array.prototype.push.apply(i.classes,c):i.classes.push(c)),s.hooks.run("wrap",i);var h="";for(var l in i.attributes)h+=" "+l+'="'+(i.attributes[l]||"").replace(/"/g,"&quot;")+'"';return"<"+i.tag+' class="'+i.classes.join(" ")+'"'+h+">"+i.content+"</"+i.tag+">"};function O(t,e,a,r){t.lastIndex=e;var i=t.exec(a);if(i&&r&&i[1]){var c=i[1].length;i.index+=c,i[0]=i[0].slice(c)}return i}function J(t,e,a,r,i,c){for(var h in a)if(!(!a.hasOwnProperty(h)||!a[h])){var l=a[h];l=Array.isArray(l)?l:[l];for(var y=0;y<l.length;++y){if(c&&c.cause==h+","+y)return;var A=l[y],C=A.inside,oe=!!A.lookbehind,le=!!A.greedy,he=A.alias;if(le&&!A.pattern.global){var me=A.pattern.toString().match(/[imsuy]*$/)[0];A.pattern=RegExp(A.pattern.source,me+"g")}for(var ce=A.pattern||A,E=r.next,$=i;E!==e.tail&&!(c&&$>=c.reach);$+=E.value.length,E=E.next){var R=E.value;if(e.length>t.length)return;if(!(R instanceof x)){var V=1,k;if(le){if(k=O(ce,$,t,oe),!k||k.index>=t.length)break;var Q=k.index,ve=k.index+k[0].length,D=$;for(D+=E.value.length;Q>=D;)E=E.next,D+=E.value.length;if(D-=E.value.length,$=D,E.value instanceof x)continue;for(var Y=E;Y!==e.tail&&(D<ve||typeof Y.value=="string");Y=Y.next)V++,D+=Y.value.length;V--,R=t.slice($,D),k.index-=$}else if(k=O(ce,0,R,oe),!k)continue;var Q=k.index,ee=k[0],ie=R.slice(0,Q),ge=R.slice(Q+ee.length),se=$+R.length;c&&se>c.reach&&(c.reach=se);var te=E.prev;ie&&(te=z(e,te,ie),$+=ie.length),re(e,te,V);var ye=new x(h,C?s.tokenize(ee,C):ee,he,ee);if(E=z(e,te,ye),ge&&z(e,E,ge),V>1){var ue={cause:h+","+y,reach:se};J(t,e,a,E.prev,$,ue),c&&ue.reach>c.reach&&(c.reach=ue.reach)}}}}}}function X(){var t={value:null,prev:null,next:null},e={value:null,prev:t,next:null};t.next=e,this.head=t,this.tail=e,this.length=0}function z(t,e,a){var r=e.next,i={value:a,prev:e,next:r};return e.next=i,r.prev=i,t.length++,i}function re(t,e,a){for(var r=e.next,i=0;i<a&&r!==t.tail;i++)r=r.next;e.next=r,r.prev=e,t.length-=i}function K(t){for(var e=[],a=t.head.next;a!==t.tail;)e.push(a.value),a=a.next;return e}if(!o.document)return o.addEventListener&&(s.disableWorkerMessageHandler||o.addEventListener("message",function(t){var e=JSON.parse(t.data),a=e.language,r=e.code,i=e.immediateClose;o.postMessage(s.highlight(r,s.languages[a],a)),i&&o.close()},!1)),s;var w=s.util.currentScript();w&&(s.filename=w.src,w.hasAttribute("data-manual")&&(s.manual=!0));function m(){s.manual||s.highlightAll()}if(!s.manual){var F=document.readyState;F==="loading"||F==="interactive"&&w&&w.defer?document.addEventListener("DOMContentLoaded",m):window.requestAnimationFrame?window.requestAnimationFrame(m):window.setTimeout(m,16)}return s}(u);p.exports&&(p.exports=n),typeof pe<"u"&&(pe.Prism=n),n.languages.markup={comment:{pattern:/<!--(?:(?!<!--)[\s\S])*?-->/,greedy:!0},prolog:{pattern:/<\?[\s\S]+?\?>/,greedy:!0},doctype:{pattern:/<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,greedy:!0,inside:{"internal-subset":{pattern:/(^[^\[]*\[)[\s\S]+(?=\]>$)/,lookbehind:!0,greedy:!0,inside:null},string:{pattern:/"[^"]*"|'[^']*'/,greedy:!0},punctuation:/^<!|>$|[[\]]/,"doctype-tag":/^DOCTYPE/i,name:/[^\s<>'"]+/}},cdata:{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,greedy:!0},tag:{pattern:/<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,greedy:!0,inside:{tag:{pattern:/^<\/?[^\s>\/]+/,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"special-attr":[],"attr-value":{pattern:/=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,inside:{punctuation:[{pattern:/^=/,alias:"attr-equals"},{pattern:/^(\s*)["']|["']$/,lookbehind:!0}]}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:[{pattern:/&[\da-z]{1,8};/i,alias:"named-entity"},/&#x?[\da-f]{1,8};/i]},n.languages.markup.tag.inside["attr-value"].inside.entity=n.languages.markup.entity,n.languages.markup.doctype.inside["internal-subset"].inside=n.languages.markup,n.hooks.add("wrap",function(o){o.type==="entity"&&(o.attributes.title=o.content.replace(/&amp;/,"&"))}),Object.defineProperty(n.languages.markup.tag,"addInlined",{value:function(g,d){var v={};v["language-"+d]={pattern:/(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,lookbehind:!0,inside:n.languages[d]},v.cdata=/^<!\[CDATA\[|\]\]>$/i;var s={"included-cdata":{pattern:/<!\[CDATA\[[\s\S]*?\]\]>/i,inside:v}};s["language-"+d]={pattern:/[\s\S]+/,inside:n.languages[d]};var x={};x[g]={pattern:RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g,function(){return g}),"i"),lookbehind:!0,greedy:!0,inside:s},n.languages.insertBefore("markup","cdata",x)}}),Object.defineProperty(n.languages.markup.tag,"addAttribute",{value:function(o,g){n.languages.markup.tag.inside["special-attr"].push({pattern:RegExp(/(^|["'\s])/.source+"(?:"+o+")"+/\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,"i"),lookbehind:!0,inside:{"attr-name":/^[^\s=]+/,"attr-value":{pattern:/=[\s\S]+/,inside:{value:{pattern:/(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,lookbehind:!0,alias:[g,"language-"+g],inside:n.languages[g]},punctuation:[{pattern:/^=/,alias:"attr-equals"},/"|'/]}}}})}}),n.languages.html=n.languages.markup,n.languages.mathml=n.languages.markup,n.languages.svg=n.languages.markup,n.languages.xml=n.languages.extend("markup",{}),n.languages.ssml=n.languages.xml,n.languages.atom=n.languages.xml,n.languages.rss=n.languages.xml,function(o){var g=/(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;o.languages.css={comment:/\/\*[\s\S]*?\*\//,atrule:{pattern:RegExp("@[\\w-](?:"+/[^;{\s"']|\s+(?!\s)/.source+"|"+g.source+")*?"+/(?:;|(?=\s*\{))/.source),inside:{rule:/^@[\w-]+/,"selector-function-argument":{pattern:/(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,lookbehind:!0,alias:"selector"},keyword:{pattern:/(^|[^\w-])(?:and|not|only|or)(?![\w-])/,lookbehind:!0}}},url:{pattern:RegExp("\\burl\\((?:"+g.source+"|"+/(?:[^\\\r\n()"']|\\[\s\S])*/.source+")\\)","i"),greedy:!0,inside:{function:/^url/i,punctuation:/^\(|\)$/,string:{pattern:RegExp("^"+g.source+"$"),alias:"url"}}},selector:{pattern:RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|`+g.source+")*(?=\\s*\\{)"),lookbehind:!0},string:{pattern:g,greedy:!0},property:{pattern:/(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,lookbehind:!0},important:/!important\b/i,function:{pattern:/(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,lookbehind:!0},punctuation:/[(){};:,]/},o.languages.css.atrule.inside.rest=o.languages.css;var d=o.languages.markup;d&&(d.tag.addInlined("style","css"),d.tag.addAttribute("style","css"))}(n),n.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},n.languages.javascript=n.languages.extend("clike",{"class-name":[n.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+(/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source)+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),n.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,n.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:n.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:n.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:n.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:n.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:n.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),n.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:n.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),n.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),n.languages.markup&&(n.languages.markup.tag.addInlined("script","javascript"),n.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),n.languages.js=n.languages.javascript,function(){if(typeof n>"u"||typeof document>"u")return;Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);var o="Loading…",g=function(w,m){return"✖ Error "+w+" while fetching file: "+m},d="✖ Error: File does not exist or is empty",v={js:"javascript",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell",sh:"bash",bat:"batch",h:"c",tex:"latex"},s="data-src-status",x="loading",O="loaded",J="failed",X="pre[data-src]:not(["+s+'="'+O+'"]):not(['+s+'="'+x+'"])';function z(w,m,F){var t=new XMLHttpRequest;t.open("GET",w,!0),t.onreadystatechange=function(){t.readyState==4&&(t.status<400&&t.responseText?m(t.responseText):t.status>=400?F(g(t.status,t.statusText)):F(d))},t.send(null)}function re(w){var m=/^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(w||"");if(m){var F=Number(m[1]),t=m[2],e=m[3];return t?e?[F,Number(e)]:[F,void 0]:[F,F]}}n.hooks.add("before-highlightall",function(w){w.selector+=", "+X}),n.hooks.add("before-sanity-check",function(w){var m=w.element;if(m.matches(X)){w.code="",m.setAttribute(s,x);var F=m.appendChild(document.createElement("CODE"));F.textContent=o;var t=m.getAttribute("data-src"),e=w.language;if(e==="none"){var a=(/\.(\w+)$/.exec(t)||[,"none"])[1];e=v[a]||a}n.util.setLanguage(F,e),n.util.setLanguage(m,e);var r=n.plugins.autoloader;r&&r.loadLanguages(e),z(t,function(i){m.setAttribute(s,O);var c=re(m.getAttribute("data-range"));if(c){var h=i.split(/\r\n?|\n/g),l=c[0],y=c[1]==null?h.length:c[1];l<0&&(l+=h.length),l=Math.max(0,Math.min(l-1,h.length)),y<0&&(y+=h.length),y=Math.max(0,Math.min(y,h.length)),i=h.slice(l,y).join(`
`),m.hasAttribute("data-start")||m.setAttribute("data-start",String(l+1))}F.textContent=i,n.highlightElement(F)},function(i){m.setAttribute(s,J),F.textContent=i})}}),n.plugins.fileHighlight={highlight:function(m){for(var F=(m||document).querySelectorAll(X),t=0,e;e=F[t++];)n.highlightElement(e)}};var K=!1;n.fileHighlight=function(){K||(console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."),K=!0),n.plugins.fileHighlight.highlight.apply(this,arguments)}}()})(Fe);var M,L,_,W,T,q,P,I,j,B,H,ne,N,G,ae;class Z{constructor({input:u=0,stiffness:n=10,damping:o=30,mass:g=20}={}){U(this,"stiffness");U(this,"damping");U(this,"mass");S(this,M);S(this,L);S(this,_,0);S(this,W,0);S(this,T);S(this,q);S(this,P);S(this,I);S(this,j);S(this,B,new Set);S(this,H,new Set);S(this,ne,()=>{f(this,T)||f(this,N).call(this)});S(this,N,()=>{b(this,P,Date.now()),f(this,T)||b(this,q,f(this,P)-1),b(this,I,f(this,P)-f(this,q)),b(this,q,f(this,P)),b(this,T,!0),f(this,ae).call(this),f(this,B).forEach(u=>{u({output:f(this,L),velocity:f(this,_)})}),b(this,T,!(Math.abs(f(this,_))<.1&&Math.abs(f(this,L)-f(this,M))<.01)),f(this,T)?(cancelAnimationFrame(f(this,j)),b(this,j,requestAnimationFrame(f(this,N)))):(b(this,T,!1),f(this,H).forEach(u=>{u({output:f(this,L),velocity:f(this,_)})}))});S(this,G,(u,n,o)=>u*(o-n)/100+n);S(this,ae,()=>{const u=f(this,G).call(this,this.stiffness,-1,-300),n=f(this,G).call(this,this.damping,-.4,-20),o=f(this,G).call(this,this.mass,.1,10),g=u*(f(this,L)-f(this,M)),d=n*f(this,_);b(this,W,(g+d)/o),b(this,_,f(this,_)+f(this,W)*(f(this,I)/1e3)),b(this,L,f(this,L)+f(this,_)*(f(this,I)/1e3))});U(this,"subscribe",(u,n="frame")=>{let o;return n=="frame"?(f(this,B).add(u),o=()=>{f(this,B).delete(u)}):(f(this,H).add(u),o=()=>{f(this,H).delete(u)}),o});b(this,T,!1),b(this,q,0),b(this,P,0),b(this,I,0),b(this,j,0),this.stiffness=n,this.damping=o,this.mass=g,b(this,M,u),b(this,L,u)}set input(u){b(this,M,u),f(this,ne).call(this)}get input(){return f(this,M)}get output(){return f(this,L)}}M=new WeakMap,L=new WeakMap,_=new WeakMap,W=new WeakMap,T=new WeakMap,q=new WeakMap,P=new WeakMap,I=new WeakMap,j=new WeakMap,B=new WeakMap,H=new WeakMap,ne=new WeakMap,N=new WeakMap,G=new WeakMap,ae=new WeakMap;function xe(){document.querySelectorAll(".demo-button").forEach(u=>{const n=new Z({stiffness:20,damping:30,mass:10,input:1});n.subscribe(({output:o,velocity:g})=>{u.style.transform=`scaleX(${o+g*.1}) scaleY(${o})`}),u.addEventListener("mousedown",()=>{n.input=.75}),u.addEventListener("touchstart",o=>{o.preventDefault(),n.input=.75}),u.addEventListener("mouseup",()=>{n.input=1.1}),u.addEventListener("mouseenter",()=>{n.input=1.1}),u.addEventListener("mouseout",()=>{n.input=1}),u.addEventListener("touchend",()=>{n.input=1})})}function Ae(){const p=document.querySelector(".helicopter"),u=document.querySelector(".section--example-helicopter");if(!p)throw new Error("unable to find helicopter element");if(!u)throw new Error("unable to find helicopter demo section element");const n=(d,v,s)=>`translate(${d}px, ${v}px) rotate(${s}deg)`,o={x:new Z,y:new Z};o.x.subscribe(({output:d,velocity:v})=>{p.style.transform=n(d,o.y.output,v*.05)});const g=(d,v)=>{const s=u.getBoundingClientRect(),x=d-(s.left+s.width*.5),O=v-(s.top+s.height*.5);o.x.input=x,o.y.input=O};u.addEventListener("mousemove",d=>{!d.clientX||!d.clientY||g(d.clientX,d.clientY)}),u.addEventListener("mouseout",()=>{o.x.input=0,o.y.input=0}),u.addEventListener("touchmove",d=>{d.touches!==void 0&&g(d.touches[0].clientX,d.touches[0].clientY)})}function Ee(){const p=document.querySelector(".sailboat"),u=document.querySelector(".sailboat--away"),n=document.querySelector(".sailboat--back");if(!p)throw new Error("unable to find sailboat element");if(!u)throw new Error("unable to find sailAway element");if(!n)throw new Error("unable to find sailBack element");let o="right";const g=new Z({stiffness:10,damping:80,mass:50});g.subscribe(({output:d,velocity:v})=>{p.style.transform=`rotate(${v*-.3}deg) scaleX(${o==="right"?-1:1})`,p.style.left=`${d}%`}),u.addEventListener("click",()=>{g.input=100,o="right"}),n.addEventListener("click",()=>{g.input=0,o="left"})}function Se(){const p=document.querySelector(".spider"),u=document.querySelector(".spider__body"),n=document.querySelector(".section--example-spider"),o=new Z({stiffness:30,damping:50,mass:10});o.subscribe(({output:g,velocity:d})=>{p.style.transform=`translateY(${g}px)`,u.style.transform=`rotate(${1+Math.abs(d*1)})`}),window.addEventListener("scroll",()=>{o.input=window.scrollY-n.offsetTop+window.innerHeight*.5})}Ee();xe();Se();Ae();