!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("dns")):"function"==typeof define&&define.amd?define("springify",["dns"],t):(n=n||self).springify=t(n.dns)}(this,function(n){"use strict";return function(){for(var n=this,t=[],i=arguments.length;i--;)t[i]=arguments[i];this.animating=!1;var e,a,p,o,s=0,u=10,r=30,m=20,f={output:0,velocity:0,amplitude:0},c=[],l=function(n,t,i){return n*(i-t)/100+t};t.map(function(t){void 0!==t.propName?(n[t.propName]=Object.assign({},f),n[t.propName].stiffness=t.input||s,n[t.propName].stiffness=t.stiffness||u,n[t.propName].damping=t.damping||r,n[t.propName].mass=t.mass||m,n[t.propName].input=t.input||s,n[t.propName].output=n[t.propName].input,c.push(n[t.propName])):n.callback=t});var d=function(){var t;a=Date.now(),n.animating||(e=a-1),p=a-e,e=a,n.animating=!0,c.forEach(function(n){var t,i,e,a,o,s;i=l((t=n).stiffness,-1,-300),e=l(t.damping,-.4,-20),a=l(t.mass,.1,10),o=i*(t.output-t.input),s=e*t.velocity,t.amplitude=(o+s)/a,t.velocity+=t.amplitude*(p/1e3),t.output+=t.velocity*(p/1e3)}),(t=n).callback.apply(t,c),c.every(function(n){return Math.abs(n.velocity)<.5&&Math.abs(n.output-n.input)<.5})?(n.animating=!1,console.log("finished spring animation")):(cancelAnimationFrame(o),o=requestAnimationFrame(d))};this.animate=function(){n.animating||d()}}});