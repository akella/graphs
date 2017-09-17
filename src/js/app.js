import Snap from 'snapsvg';
import {TimelineMax} from 'gsap';
import FastSimplexNoise from 'fast-simplex-noise';

var _gsScope = (typeof(module) !== 'undefined' && module.exports && typeof(global) !== 'undefined') ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
	
  'use strict';

  _gsScope._gsDefine.plugin({
    propName: 'endArray',
    API: 2,
    version: '0.1.3',

    //called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
    init: function(target, value, tween) {
      var i = value.length,
        a = this.a = [],
        start, end;
      this.target = target;
      this._mod = 0;
      if (!i) {
        return false;
      }
      while (--i > -1) {
        start = target[i];
        end = value[i];
        if (start !== end) {
          a.push({i:i, s:start, c:end - start});
        }
      }
      return true;
    },

    mod: function(lookup) {
      if (typeof(lookup.endArray) === 'function') {
        this._mod = lookup.endArray;
      }
    },

    //called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
    set: function(ratio) {
      var target = this.target,
        a = this.a,
        i = a.length,
        mod = this._mod,
        e, val;
      if (mod) {
        while (--i > -1) {
          e = a[i];
          target[e.i] = mod(e.s + e.c * ratio, target);
        }
      } else {
        while (--i > -1) {
          e = a[i];
          val = e.s + e.c * ratio;
          target[e.i] = (val < 0.000001 && val > -0.000001) ? 0 : val;
        }
      }
    }

  });

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }


var path = Snap.select('#graph');



var newPath = 'M1,257.6l147.1,49.5L276.6,75.6l170,46.5l163.5,177L725,54.5L938.4,1l250.8,199.9L1338.1,1h180.9';
var oldPath = 'M1,257.6l149.5-71.6L280,257.6l166.6-135.5l173.5,69L725,54.5L938.4,1l250.8,199.9L1338.1,1h180.9';


function step1() {
  path.animate({ d: newPath }, 2000, function() {console.log('finished step1!');step2();});
}

function step2() {
  path.animate({ d: oldPath }, 2000, function() {console.log('finished step2!');step1();});
}

step1();


let width = 1300;
let height = 400;
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
canvas.classList.add('supercanvas');
canvas.width = width;
canvas.height = height;

document.body.appendChild(canvas);


let state1 = [0,110,150,310,350,300,0];
let state2 = [310,350,300,50,10,110,150];
let state3 = [10,110,50,210,350,100,50];

let uberstate = state1.slice(0);

function drawLine(mystate,ctx) {
  ctx.clearRect(0,0,width,height);
  ctx.beginPath();
  ctx.moveTo(0,mystate[0]);
  for (var i = 1; i < 7; i++) {
    ctx.lineTo(i*width/6,mystate[i]);
  }
  ctx.strokeStyle = '#97DE5B';
  ctx.lineWidth = 20;
  ctx.stroke();
  ctx.closePath();
}


let tl = new TimelineMax({onUpdate:function() {
  drawLine(uberstate,ctx);
},repeat: -1});

tl.to(uberstate,2,{endArray: state2})
  .to(uberstate,2,{endArray: state3})
  .to(uberstate,2,{endArray: state1});


// ====================================



let canvas1 = document.createElement('canvas');
let ctx1 = canvas1.getContext('2d');
canvas1.width = width;
canvas1.height = height;
document.body.appendChild(canvas1);
var newstate = [0,110,150,310,350,300,0];

var t = 0;
const noiseGen = new FastSimplexNoise(
  { frequency: 0.5, max: 400, min: 0, octaves: 1 });
function render() {
  t++;
  ctx1.lineJoin = 'round';
  newstate = [];
  for (var i = 0; i < 7; i++) {
  	newstate.push(
  		noiseGen.scaled([i*5, t/100])
  	);
  }
  drawLine(newstate,ctx1);
  window.requestAnimationFrame(render);

}
render();


