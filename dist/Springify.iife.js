var Springify=function(i){"use strict";var f=Object.defineProperty;var T=(i,s,n)=>s in i?f(i,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[s]=n;var t=(i,s,n)=>(T(i,typeof s!="symbol"?s+"":s,n),n);class s{constructor({input:a=0,stiffness:u=10,damping:r=30,mass:p=20,onFrame:l=()=>{},onFinished:c=()=>{}}){t(this,"_input");t(this,"output");t(this,"stiffness");t(this,"damping");t(this,"mass");t(this,"velocity",0);t(this,"amplitude",0);t(this,"animating");t(this,"onFrame");t(this,"onFinished");t(this,"lastTime");t(this,"currentTime");t(this,"delta");t(this,"animationFrame");t(this,"interpolate");t(this,"animate");t(this,"animLoop");this.animating=!1,this.onFrame=l,this.onFinished=c,this.lastTime=0,this.currentTime=0,this.delta=0,this.animationFrame=0,this.stiffness=u,this.damping=r,this.mass=p,this._input=a,this.output=this.input;const h=(m,e,o)=>m*(o-e)/100+e;this.interpolate=()=>{const m=h(this.stiffness,-1,-300),e=h(this.damping,-.4,-20),o=h(this.mass,.1,10),g=m*(this.output-this.input),d=e*this.velocity;this.amplitude=(g+d)/o,this.velocity+=this.amplitude*(this.delta/1e3),this.output+=this.velocity*(this.delta/1e3)},this.animLoop=()=>{this.currentTime=Date.now(),this.animating||(this.lastTime=this.currentTime-1),this.delta=this.currentTime-this.lastTime,this.lastTime=this.currentTime,this.animating=!0,this.interpolate(),this.onFrame(this.output,this.velocity),this.animating=!(Math.abs(this.velocity)<.2&&Math.abs(this.output-this.input)<.2),this.animating?(cancelAnimationFrame(this.animationFrame),this.animationFrame=requestAnimationFrame(this.animLoop)):(this.animating=!1,this.onFinished())},this.animate=()=>{this.animating||this.animLoop()}}set input(a){this._input=a,this.animate()}get input(){return this._input}}return i.Springify=s,Object.defineProperties(i,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),i}({});