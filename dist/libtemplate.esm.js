function springify(t){var i=this;void 0===t&&(t={});var a=t.x;void 0===a&&(a={stiffness:-5,damping:-.97});var n=t.y;void 0===n&&(n={stiffness:-5,damping:-.97});var s,u=t.callback;void 0===u&&(u=function(){}),this.x={stiffness:a.stiffness,damping:a.damping,input:0,output:0,velocity:0,amplitude:0,mass:.2},this.y={stiffness:n.stiffness,damping:n.damping,input:0,output:0,velocity:0,amplitude:0,mass:.2},this.animating=!1,this.animate=function(){var t=Date.now();i.animating||(s=t-1);var a=t-s;s=t,i.animating=!0;var n=i.x.stiffness*(i.x.output-i.x.input),e=i.x.damping*i.x.velocity;i.x.amplitude=(n+e)/i.x.mass,i.x.velocity+=i.x.amplitude*(a/1e3),i.x.output+=i.x.velocity*(a/1e3);var p=i.y.stiffness*(i.y.output-i.y.input),o=i.y.damping*i.y.velocity;i.y.amplitude=(p+o)/i.y.mass,i.y.velocity+=i.y.amplitude*(a/1e3),i.y.output+=i.y.velocity*(a/1e3),u(i.x,i.y),Math.abs(i.x.velocity)<.5&&Math.abs(i.x.output-i.x.input)<.5&&Math.abs(i.y.velocity)<.5&&Math.abs(i.y.output-i.y.input)<.5?(i.animating=!1,i.x.output=i.x.input,i.y.output=i.y.input,console.log("finished spring animation")):requestAnimationFrame(i.animate)}}export default springify;