import{Q as $,r as p,q as w,d as B,l as z,p as Q,c as x,e as n,w as s,f as i,o as _,F as U,b as W,g as b,a as S,n as q,h as j,t as u,i as c,B as G,v as H,E as O,_ as J}from"./index-67a60ed5.js";const K=$("integration",()=>{const l=p([{id:"MES",name:"制造执行系统",type:"production",status:"connected",lastSync:new Date().toISOString(),dataPoints:1250,description:"管理生产过程和工单执行"},{id:"ERP",name:"企业资源计划",type:"management",status:"connected",lastSync:new Date().toISOString(),dataPoints:850,description:"管理企业资源和订单处理"},{id:"SCADA",name:"数据采集与监控系统",type:"production",status:"connected",lastSync:new Date().toISOString(),dataPoints:3600,description:"实时数据采集和设备监控"},{id:"WMS",name:"仓储管理系统",type:"logistics",status:"connected",lastSync:new Date().toISOString(),dataPoints:620,description:"仓库库存和物流管理"},{id:"QMS",name:"质量管理系统",type:"quality",status:"connected",lastSync:new Date().toISOString(),dataPoints:960,description:"产品质量控制和检验管理"},{id:"PLM",name:"产品生命周期管理",type:"product",status:"connected",lastSync:new Date().toISOString(),dataPoints:450,description:"产品设计和生命周期管理"},{id:"CRM",name:"客户关系管理",type:"customer",status:"error",lastSync:new Date().toISOString(),dataPoints:780,description:"客户信息和订单管理"},{id:"APS",name:"高级计划排程系统",type:"planning",status:"connected",lastSync:new Date().toISOString(),dataPoints:520,description:"生产计划和排程优化"}]),r=p([{id:"SYNC-001",sourceSystem:"MES",targetSystem:"ERP",direction:"bidirectional",lastSync:new Date().toISOString(),syncCount:1500,errorCount:0,status:"connected"},{id:"SYNC-002",sourceSystem:"SCADA",targetSystem:"MES",direction:"outbound",lastSync:new Date().toISOString(),syncCount:3200,errorCount:12,status:"connected"},{id:"SYNC-003",sourceSystem:"WMS",targetSystem:"ERP",direction:"bidirectional",lastSync:new Date().toISOString(),syncCount:850,errorCount:3,status:"connected"},{id:"SYNC-004",sourceSystem:"QMS",targetSystem:"MES",direction:"outbound",lastSync:new Date().toISOString(),syncCount:960,errorCount:0,status:"connected"},{id:"SYNC-005",sourceSystem:"PLM",targetSystem:"MES",direction:"outbound",lastSync:new Date().toISOString(),syncCount:420,errorCount:5,status:"error"},{id:"SYNC-006",sourceSystem:"CRM",targetSystem:"ERP",direction:"bidirectional",lastSync:new Date().toISOString(),syncCount:780,errorCount:15,status:"error"}]),m=p([{id:"ALT-001",system:"CRM",type:"connection_lost",level:"error",time:new Date().toISOString(),description:"CRM系统连接中断，请检查网络连接",status:"active"},{id:"ALT-002",system:"PLM",type:"sync_error",level:"warning",time:new Date().toISOString(),description:"PLM到MES的数据同步失败，重试次数过多",status:"active"},{id:"ALT-003",system:"SCADA",type:"performance_issue",level:"warning",time:new Date().toISOString(),description:"SCADA系统响应时间超过阈值(>2s)",status:"active"},{id:"ALT-004",system:"MES",type:"security_alert",level:"critical",time:new Date().toISOString(),description:"检测到未经授权的系统访问尝试",status:"resolved"}]),d=p([{systemId:"MES",cpu:65.2,memory:78.5,network:45.8,responseTime:180,timestamp:new Date().toISOString()},{systemId:"ERP",cpu:55.8,memory:82.3,network:38.6,responseTime:220,timestamp:new Date().toISOString()},{systemId:"SCADA",cpu:88.5,memory:92.1,network:76.4,responseTime:2200,timestamp:new Date().toISOString()}]),f=w(()=>l.value.filter(o=>o.status==="connected").length),C=w(()=>l.value.reduce((o,e)=>o+e.dataPoints,0)),M=w(()=>m.value.filter(o=>o.status==="active"));return{systems:l,syncStatus:r,alerts:m,metrics:d,connectedSystems:f,totalDataPoints:C,activeAlerts:M,updateSystemStatus:(o,e)=>{const t=l.value.find(D=>D.id===o);t&&(t.status=e,t.lastSync=new Date().toISOString())},addAlert:o=>{const e=`ALERT-${Date.now()}`;m.value.unshift({...o,id:e,time:new Date().toISOString(),status:"active"})},resolveAlert:o=>{const e=m.value.find(t=>t.id===o);e&&(e.status="resolved")},updateMetrics:(o,e)=>{d.value.push({systemId:o,...e,timestamp:new Date().toISOString()})}}}),P={async getSystemStatus(l){return await new Promise(r=>setTimeout(r,500)),Math.random()>.1?"connected":"error"},async getSystemMetrics(l){return await new Promise(r=>setTimeout(r,500)),{systemId:l,cpu:Math.random()*100,memory:Math.random()*100,network:Math.random()*100,responseTime:Math.random()*1e3,timestamp:new Date().toISOString()}},async testConnection(l){return await new Promise(r=>setTimeout(r,1e3)),Math.random()>.1}},X={class:"system-monitor"},Z={class:"stat-card"},tt={class:"stat-info"},et={class:"stat-value"},st={class:"stat-label"},nt={class:"card-header"},ot=B({__name:"SystemMonitor",setup(l){const r=K(),m=p(!1),d=p(null),f=w(()=>[{label:"已连接系统",value:`${r.connectedSystems}/${r.systems.length}`,icon:"Connection",status:"success"},{label:"数据点数",value:r.totalDataPoints.toLocaleString(),icon:"DataLine",status:"primary"},{label:"活跃告警",value:r.activeAlerts.length,icon:"Warning",status:r.activeAlerts.length>0?"warning":"info"}]),C=e=>({connected:"success",disconnected:"info",error:"danger"})[e]||"info",M=e=>({connected:"已连接",disconnected:"未连接",error:"异常"})[e]||e,A=e=>new Date(e).toLocaleString(),g=async()=>{for(const e of r.systems)try{const t=await P.getSystemStatus(e.id);r.updateSystemStatus(e.id,t)}catch(t){console.error(`Failed to update status for ${e.id}:`,t)}},h=async e=>{try{const t=await P.testConnection(e);O({type:t?"success":"error",message:t?"连接测试成功":"连接测试失败"})}catch{O.error("连接测试失败")}},T=async e=>{try{d.value=await P.getSystemMetrics(e),m.value=!0}catch{O.error("获取性能指标失败")}};let o=null;return z(()=>{g(),o=window.setInterval(g,3e4)}),Q(()=>{o&&clearInterval(o)}),(e,t)=>{const D=i("el-icon"),k=i("el-card"),L=i("el-col"),N=i("el-row"),I=i("el-button"),y=i("el-table-column"),E=i("el-tag"),R=i("el-table"),v=i("el-descriptions-item"),V=i("el-descriptions"),F=i("el-dialog");return _(),x("div",X,[n(N,{gutter:20,class:"status-cards"},{default:s(()=>[(_(!0),x(U,null,W(f.value,a=>(_(),b(L,{span:6,key:a.label},{default:s(()=>[n(k,{shadow:"hover"},{default:s(()=>[S("div",Z,[n(D,{size:32,class:q(a.status)},{default:s(()=>[(_(),b(j(a.icon)))]),_:2},1032,["class"]),S("div",tt,[S("div",et,u(a.value),1),S("div",st,u(a.label),1)])])]),_:2},1024)]),_:2},1024))),128))]),_:1}),n(k,{class:"connection-card"},{header:s(()=>[S("div",nt,[t[2]||(t[2]=S("span",null,"系统连接状态",-1)),n(I,{type:"primary",size:"small",onClick:g},{default:s(()=>t[1]||(t[1]=[c(" 刷新状态 ")])),_:1})])]),default:s(()=>[n(R,{data:G(r).systems,style:{width:"100%"}},{default:s(()=>[n(y,{prop:"name",label:"系统名称"}),n(y,{prop:"type",label:"类型"},{default:s(({row:a})=>[n(E,null,{default:s(()=>[c(u(a.type),1)]),_:2},1024)]),_:1}),n(y,{prop:"status",label:"状态"},{default:s(({row:a})=>[n(E,{type:C(a.status)},{default:s(()=>[c(u(M(a.status)),1)]),_:2},1032,["type"])]),_:1}),n(y,{prop:"lastSync",label:"最后同步"},{default:s(({row:a})=>[c(u(A(a.lastSync)),1)]),_:1}),n(y,{label:"操作",width:"200"},{default:s(({row:a})=>[n(I,{type:"primary",link:"",onClick:Y=>h(a.id)},{default:s(()=>t[3]||(t[3]=[c(" 测试连接 ")])),_:2},1032,["onClick"]),n(I,{type:"primary",link:"",onClick:Y=>T(a.id)},{default:s(()=>t[4]||(t[4]=[c(" 性能指标 ")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])]),_:1}),n(F,{modelValue:m.value,"onUpdate:modelValue":t[0]||(t[0]=a=>m.value=a),title:"系统性能指标",width:"600px"},{default:s(()=>[d.value?(_(),b(V,{key:0,column:2,border:""},{default:s(()=>[n(v,{label:"CPU使用率"},{default:s(()=>[c(u(d.value.cpu.toFixed(1))+"% ",1)]),_:1}),n(v,{label:"内存使用率"},{default:s(()=>[c(u(d.value.memory.toFixed(1))+"% ",1)]),_:1}),n(v,{label:"网络使用率"},{default:s(()=>[c(u(d.value.network.toFixed(1))+"% ",1)]),_:1}),n(v,{label:"响应时间"},{default:s(()=>[c(u(d.value.responseTime.toFixed(0))+"ms ",1)]),_:1})]),_:1})):H("",!0)]),_:1},8,["modelValue"])])}}});const rt=J(ot,[["__scopeId","data-v-8244cbf3"]]);export{rt as default};
