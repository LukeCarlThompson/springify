var springify=function(){"use strict";return function(){for(var t=this,a=[],i=arguments.length;i--;)a[i]=arguments[i];this.animating=!1;var n,p,e,o,s=0,u=10,m=30,r=20,c={output:0,velocity:0,amplitude:0},f=[],l=function(t,a,i){return t*(i-a)/100+a};a.map(function(a){void 0!==a.propName?(t[a.propName]=Object.assign({},c),t[a.propName].stiffness=a.input||s,t[a.propName].stiffness=a.stiffness||u,t[a.propName].damping=a.damping||m,t[a.propName].mass=a.mass||r,t[a.propName].input=a.input||s,t[a.propName].output=t[a.propName].input,f.push(t[a.propName])):t.callback=a}),this.animate=function(){var a;p=Date.now(),t.animating||(n=p-1),e=p-n,n=p,t.animating=!0,f.forEach(function(t){var a,i,n,p,o,s;i=l((a=t).stiffness,-1,-300),n=l(a.damping,-.4,-20),p=l(a.mass,.1,10),o=i*(a.output-a.input),s=n*a.velocity,a.amplitude=(o+s)/p,a.velocity+=a.amplitude*(e/1e3),a.output+=a.velocity*(e/1e3)}),(a=t).callback.apply(a,f),f.every(function(t){return Math.abs(t.velocity)<.5&&Math.abs(t.output-t.input)<.5})?(t.animating=!1,console.log("finished spring animation")):(cancelAnimationFrame(o),o=requestAnimationFrame(t.animate))}}}();