(function(){function rnd(seed){var s=seed;return function(){s=s*16807%2147483647;return(s-1)/2147483646}}
/* ---------- feature atlas: seeded, code-native miniature illustrations ---------- */
(function drawFeatureAtlas(){
  [].forEach.call(document.querySelectorAll('.feature-art'),function(el){
    var id=+el.dataset.feature,random=rnd(830+id*71),parts=[];
    function point(x,y,r,o){parts.push('<circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+r+'" fill="currentColor" opacity="'+o+'"/>')}
    function line(x1,y1,x2,y2,o,dash){parts.push('<path d="M'+x1+','+y1+'L'+x2+','+y2+'" fill="none" stroke="currentColor" stroke-width=".65" opacity="'+(o||.4)+'"'+(dash?' stroke-dasharray="2 4"':'')+'/>')}
    function path(d,o,dash){parts.push('<path d="'+d+'" fill="none" stroke="currentColor" stroke-width=".7" opacity="'+(o||.5)+'"'+(dash?' stroke-dasharray="2 4"':'')+'/>')}
    function circle(x,y,r,o){parts.push('<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="currentColor" stroke-width=".65" opacity="'+(o||.5)+'"/>')}
    function cloud(fn,n,opacity){for(var i=0;i<n;i++){var p=fn(i/n,random());point(p[0],p[1],random()>.95?.9:.45,(opacity||.7)*(.25+random()*.75))}}
    function person(x,y,size){circle(x,y-size*.82,size*.065,.95);path('M'+x+','+(y-size*.74)+'L'+x+','+(y-size*.34)+'M'+(x-size*.14)+','+(y-size*.46)+'L'+(x-size*.11)+','+(y-size*.65)+'Q'+x+','+(y-size*.82)+' '+(x+size*.11)+','+(y-size*.65)+'L'+(x+size*.14)+','+(y-size*.45)+'M'+x+','+(y-size*.34)+'L'+(x-size*.09)+','+y+'M'+x+','+(y-size*.34)+'L'+(x+size*.1)+','+y,.9)}
    function page(x,y,w,h,o){path('M'+x+','+y+'h'+(w-7)+'l7,7v'+(h-7)+'h-'+w+'zM'+(x+w-7)+','+y+'v7h7',o);for(var i=0;i<3;i++)line(x+6,y+14+i*6,x+w-7-(i===2?8:0),y+14+i*6,o*.7)}
    // A quiet, repeatable star field binds the eight plates together.
    for(var j=0;j<30;j++)point(12+random()*236,15+random()*150,.4,.12+random()*.2);
    if(id===0){
      // A human goal gives the surrounding possibility cloud a center.
      for(var ring=0;ring<5;ring++){(function(ring){cloud(function(t,q){var a=t*Math.PI*2,r=38+ring*10+q*3;return[130+Math.cos(a)*r,100+Math.sin(a)*r*.43]},100,.55-ring*.075)})(ring)}
      cloud(function(t,q){var a=t*15.7,r=6+t*65;return[130+Math.cos(a)*r+(q-.5)*8,103+Math.sin(a)*r*.44]},260,.8);
      person(130,108,50);line(130,64,130,35,.5,true);circle(130,29,5,.8);point(130,29,1.5,.9);
      line(27,133,230,133,.25);line(34,130,34,136,.6);line(226,130,226,136,.6);
    }else if(id===1){
      // Expected flow versus felt experience; the low point is the important one.
      line(20,134,242,134,.3);[35,97,165,224].forEach(function(x){line(x,132,x,137,.45)});
      path('M25 66C64 66 70 70 103 74S170 76 232 72',.27,true);
      var emotion=function(t){return 61+65*Math.exp(-Math.pow((t-.58)*4,2))-22*t};
      cloud(function(t,q){return[25+t*207,emotion(t)+(q-.5)*4]},460,.95);
      [.06,.35,.58,.93].forEach(function(t){var x=25+t*207,y=emotion(t);line(x,y,x,134,.25,true);circle(x,y,3,.8);point(x,y,1.1,1)});
      line(145,80,145,104,.5,true);path('M141 100L145 105L149 100',.7);
    }else if(id===2){
      // Lift one node without replacing the surrounding journey.
      var pts=[[28,105],[87,94],[164,101],[233,85]];
      for(var j=0;j<3;j++)line(pts[j][0],pts[j][1],pts[j+1][0],pts[j+1][1],.3,j===1);
      pts.forEach(function(p,j){circle(p[0],p[1],j===2?7:4,j===2?.28:.8);point(p[0],p[1],1,.6)});
      line(87,94,164,45,.8);line(164,45,233,85,.8);line(164,92,164,56,.45,true);path('M159 61L164 55L169 61',.6);
      cloud(function(t,q){var a=t*6.283,r=12+q*6;return[164+Math.cos(a)*r,45+Math.sin(a)*r]},155,.6);circle(164,45,5,.9);point(164,45,2,1);
      path('M146 25h36M146 21v8M182 21v8',.35);
      line(21,141,240,141,.2);for(var n=0;n<20;n++)point(25+n*11,141,.7,.45);
    }else if(id===3){
      // A validation boundary stops the broken branch and admits the valid one.
      path('M107 27L169 53V144L107 118Z',.65);path('M113 35L161 56V133L113 113Z',.22);
      line(22,111,102,78,.6);line(172,84,234,57,.75);
      [0,1,2,3,4].forEach(function(n){point(35+n*13,105-n*5.4,1.5,.8)});
      circle(140,81,16,.75);path('M131 82L138 89L151 72',.95);
      path('M56 65L99 83',.25,true);path('M48 55l9 9m0-9l-9 9',.65);
      cloud(function(t,q){return[174+t*58,83-t*25+(q-.5)*6]},130,.8);
      path('M46 142L138 169L228 128',.2);
    }else if(id===4){
      // Findings remain connected to their source documents.
      var nodes=[[50,50],[202,38],[215,130],[62,137]];
      nodes.forEach(function(p,j){line(132,89,p[0],p[1],.35,j===3);page(p[0]-14,p[1]-19,29,36,j===3?.3:.65);point((132+p[0])/2,(89+p[1])/2,1.6,.75)});
      cloud(function(t,q){var a=t*6.283,r=17+q*13;return[132+Math.cos(a)*r,89+Math.sin(a)*r]},260,.7);
      circle(132,89,9,.9);point(132,89,2,1);
      path('M119 89h26M132 76v26',.25);
    }else if(id===5){
      // Ordered changes, each preserved as its own record.
      for(var j=0;j<3;j++){var x=40+j*63,y=26+j*13;path('M'+x+','+y+'l48,16v83l-48,-16z',.35+j*.2);
        for(var n=0;n<5;n++)line(x+8,y+19+n*11,x+39-(n===4?10:0),y+29+n*11,.15+j*.13);
        line(x+24,y+97,x+24,153,.28,true);circle(x+24,153,3,.65)}
      line(25,153,242,153,.45);path('M237 150L242 153L237 156',.65);
      cloud(function(t,q){return[178+t*24,112+t*8+(q-.5)*3]},80,.9);
      path('M180 112h6m-3-3v6',.9);
    }else if(id===6){
      // Three coordinate-aligned projections of one map.
      var iso=function(x,z,y){return[130+(x-z)*.83,98+(x+z)*.36-y]};
      for(var layer=0;layer<3;layer++){var y=layer*30,a=iso(-60,-38,y),b=iso(60,-38,y),c=iso(60,38,y),d=iso(-60,38,y);path('M'+a+'L'+b+'L'+c+'L'+d+'Z',.25+layer*.16);
        var prev;for(var j=0;j<4;j++){var p=iso(-42+j*28,Math.sin(j*1.4)*16,y);if(prev)line(prev[0],prev[1],p[0],p[1],.6);circle(p[0],p[1],2.5,.8);if(layer<2)line(p[0],p[1],p[0],p[1]-30,.23,true);prev=p}}
      cloud(function(t,q){var p=iso((t-.5)*118,(q-.5)*74,0);return p},200,.27);
    }else{
      // The handoff is a doorway to the next person's work.
      for(var ring=0;ring<4;ring++){(function(ring){cloud(function(t,q){var a=t*6.283,r=54+ring*2+q*2;return[135+Math.cos(a)*r,84+Math.sin(a)*r]},170,.38+ring*.09)})(ring)}
      person(133,143,47);line(45,144,221,144,.3);
      path('M108 111V53h53v58',.3);page(122,60,27,35,.85);
      line(136,103,136,121,.5,true);path('M133 117L136 121L139 117',.7);
      cloud(function(t,q){return[135+(q-.5)*(12+t*100),144+t*22]},130,.25);
    }
    el.innerHTML='<svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg" focusable="false">'+parts.join('')+'</svg>';
  });
})();

})();