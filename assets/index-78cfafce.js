import{i as x}from"./index-18acf776.js";import{d as R,r as f,l as G,p as P,c as b,e as o,w as e,f as s,o as r,F as k,b as A,g as y,a,n as B,h as z,t as d,i,_ as $}from"./index-9f0841cb.js";const j={class:"dashboard-container"},q={class:"stat-card"},H={class:"stat-info"},J={class:"stat-title"},K={class:"stat-value"},Q={class:"card-header"},X={class:"card-header"},Y={class:"alert-title"},Z={class:"alert-desc"},tt={class:"alert-location"},et={class:"card-header"},ot=R({__name:"index",setup(lt){const D=f([{title:"设备在线率",value:"98.5%",change:"+2.1%",trend:"up",type:"success",icon:"Monitor"},{title:"今日报警",value:"3",change:"-25%",trend:"down",type:"warning",icon:"Warning"},{title:"巡检完成率",value:"95.8%",change:"+1.2%",trend:"up",type:"primary",icon:"Check"},{title:"安全评分",value:"92",change:"+3.1%",trend:"up",type:"info",icon:"DataLine"}]),w=f("day"),L=f([{id:1,title:"温度超标警告",description:"储存区A温度超过阈值（30℃）",time:"2025-01-13 10:30:00",level:"warning",location:"化学品储存区A"},{id:2,title:"压力异常报警",description:"生产线2号压力异常",time:"2025-01-12 09:15:00",level:"danger",location:"生产车间B"}]),M=f([{time:"2025-01-13 11:00",task:"巡检任务-储存区日常检查",priority:"高"},{time:"2025-01-12 14:00",task:"设备维护-定期检修",priority:"中"},{time:"2025-01-12 16:00",task:"安全培训-新员工培训",priority:"低"}]);let p=null,c=null;const V=()=>{const n=document.getElementById("trendChart");if(!n)return;p=x(n);const t={tooltip:{trigger:"axis"},legend:{data:["温度","压力","湿度"]},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:{type:"category",boundaryGap:!1,data:["00:00","04:00","08:00","12:00","16:00","20:00","24:00"]},yAxis:{type:"value"},series:[{name:"温度",type:"line",smooth:!0,data:[23,24,25,26,25,24,23]},{name:"压力",type:"line",smooth:!0,data:[1,1.1,1,1.2,1.1,1,1]},{name:"湿度",type:"line",smooth:!0,data:[45,46,47,45,44,45,46]}]};p.setOption(t)},E=()=>{const n=document.getElementById("areaChart");if(!n)return;c=x(n);const t={tooltip:{trigger:"item"},legend:{orient:"vertical",left:"left"},series:[{name:"区域状态",type:"pie",radius:["40%","70%"],avoidLabelOverlap:!1,itemStyle:{borderRadius:10,borderColor:"#fff",borderWidth:2},label:{show:!1,position:"center"},emphasis:{label:{show:!0,fontSize:"16",fontWeight:"bold"}},labelLine:{show:!1},data:[{value:40,name:"储存区A"},{value:30,name:"生产区B"},{value:30,name:"仓储区C"}]}]};c.setOption(t)},F=n=>({warning:"#E6A23C",danger:"#F56C6C",info:"#909399"})[n]||"#409EFF",I=n=>({高:"danger",中:"warning",低:"info"})[n]||"info",T=n=>{console.log("处理任务",n)};return G(()=>{V(),E(),setInterval(()=>{},5e3)}),P(()=>{p==null||p.dispose(),c==null||c.dispose()}),(n,t)=>{const C=s("el-icon"),u=s("el-card"),_=s("el-col"),g=s("el-row"),v=s("el-radio-button"),N=s("el-radio-group"),h=s("el-button"),O=s("el-timeline-item"),S=s("el-timeline"),m=s("el-table-column"),U=s("el-tag"),W=s("el-table");return r(),b("div",j,[o(g,{gutter:24,class:"stat-cards"},{default:e(()=>[(r(!0),b(k,null,A(D.value,l=>(r(),y(_,{span:6,key:l.title},{default:e(()=>[o(u,{shadow:"hover","body-style":{padding:"20px"}},{default:e(()=>[a("div",q,[a("div",{class:B(["icon-wrapper",l.type])},[o(C,{size:24},{default:e(()=>[(r(),y(z(l.icon)))]),_:2},1024)],2),a("div",H,[a("div",J,d(l.title),1),a("div",K,d(l.value),1),a("div",{class:B(["stat-change",l.trend])},[i(d(l.change)+" ",1),o(C,null,{default:e(()=>[(r(),y(z(l.trend==="up"?"ArrowUp":"ArrowDown")))]),_:2},1024)],2)])])]),_:2},1024)]),_:2},1024))),128))]),_:1}),o(g,{gutter:24,class:"chart-section"},{default:e(()=>[o(_,{span:16},{default:e(()=>[o(u,{class:"chart-card"},{header:e(()=>[a("div",Q,[t[4]||(t[4]=a("span",{class:"title"},"安全指标趋势",-1)),o(N,{modelValue:w.value,"onUpdate:modelValue":t[0]||(t[0]=l=>w.value=l),size:"small"},{default:e(()=>[o(v,{label:"day"},{default:e(()=>t[1]||(t[1]=[i("今日")])),_:1}),o(v,{label:"week"},{default:e(()=>t[2]||(t[2]=[i("本周")])),_:1}),o(v,{label:"month"},{default:e(()=>t[3]||(t[3]=[i("本月")])),_:1})]),_:1},8,["modelValue"])])]),default:e(()=>[t[5]||(t[5]=a("div",{id:"trendChart",style:{height:"380px"}},null,-1))]),_:1})]),_:1}),o(_,{span:8},{default:e(()=>[o(u,{class:"chart-card"},{header:e(()=>t[6]||(t[6]=[a("div",{class:"card-header"},[a("span",{class:"title"},"区域安全状态")],-1)])),default:e(()=>[t[7]||(t[7]=a("div",{id:"areaChart",style:{height:"380px"}},null,-1))]),_:1})]),_:1})]),_:1}),o(g,{gutter:24,class:"activity-section"},{default:e(()=>[o(_,{span:12},{default:e(()=>[o(u,{class:"list-card"},{header:e(()=>[a("div",X,[t[9]||(t[9]=a("span",{class:"title"},"最近报警",-1)),o(h,{type:"primary",link:""},{default:e(()=>t[8]||(t[8]=[i("查看全部")])),_:1})])]),default:e(()=>[o(S,null,{default:e(()=>[(r(!0),b(k,null,A(L.value,l=>(r(),y(O,{key:l.id,type:l.level,timestamp:l.time,color:F(l.level)},{default:e(()=>[a("h4",Y,d(l.title),1),a("p",Z,d(l.description),1),a("p",tt,"位置："+d(l.location),1)]),_:2},1032,["type","timestamp","color"]))),128))]),_:1})]),_:1})]),_:1}),o(_,{span:12},{default:e(()=>[o(u,{class:"list-card"},{header:e(()=>[a("div",et,[t[11]||(t[11]=a("span",{class:"title"},"待处理事项",-1)),o(h,{type:"primary",link:""},{default:e(()=>t[10]||(t[10]=[i("处理全部")])),_:1})])]),default:e(()=>[o(W,{data:M.value,style:{width:"100%"},"max-height":400},{default:e(()=>[o(m,{prop:"time",label:"时间",width:"150"}),o(m,{prop:"task",label:"任务","show-overflow-tooltip":""}),o(m,{prop:"priority",label:"优先级",width:"100"},{default:e(l=>[o(U,{type:I(l.row.priority),size:"small"},{default:e(()=>[i(d(l.row.priority),1)]),_:2},1032,["type"])]),_:1}),o(m,{label:"操作",width:"80",fixed:"right"},{default:e(l=>[o(h,{type:"primary",link:"",size:"small",onClick:at=>T(l.row)},{default:e(()=>t[12]||(t[12]=[i(" 处理 ")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])]),_:1})]),_:1})]),_:1})])}}});const it=$(ot,[["__scopeId","data-v-67b61de8"]]);export{it as default};