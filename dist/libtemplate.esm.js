function Springify(){for(var a=this,i=[],t=arguments.length;t--;)i[t]=arguments[t];this.animating=!1;var n,e,p,o=5,s=10,m=20,u={input:0,output:0,velocity:0,amplitude:0},r=[],c=function(a,i,t){return a*(t-i)/100+i};i.map(function(i){void 0!==i.propName?(a[i.propName]=Object.assign({},u),a[i.propName].stiffness=i.stiffness||o,a[i.propName].damping=i.damping||s,a[i.propName].mass=i.mass||m,r.push(a[i.propName])):a.callback=i});this.animate=function(){var i;e=Date.now(),a.animating||(n=e-1),p=e-n,n=e,a.animating=!0,r.forEach(function(a){var i,t,n,e,o,s;t=c((i=a).stiffness,-1,-300),n=c(i.damping,-.4,-20),e=c(i.mass,.1,10),o=t*(i.output-i.input),s=n*i.velocity,i.amplitude=(o+s)/e,i.velocity+=i.amplitude*(p/1e3),i.output+=i.velocity*(p/1e3)}),(i=a).callback.apply(i,r),r.every(function(a){return Math.abs(a.velocity)<.5&&Math.abs(a.output-a.input)<.5})?(a.animating=!1,console.log("finished spring animation")):requestAnimationFrame(a.animate)}}export default Springify;