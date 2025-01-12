import{d as be,q as He,r as S,v as ce,l as he,g as H,w as t,E as I,f as p,x as we,o as V,a as R,e,y as w,i as c,z as Te,c as F,b as K,t as h,F as X,A as ae,G as Fe,M as Ve,H as Ie,J as me,V as ge,_ as Me,n as _e,h as ye,U as Pe,T as Ee,S as Oe,j as Ye,B as qe,W as je,X as Ne,Y as We,I as Je,s as Ge,Z as Ke}from"./index-5682fa07.js";const Xe=(o,i)=>new Date(o.getTime()+Math.random()*(i.getTime()-o.getTime())),Qe=o=>{const i=new Date,T=new Date(i.getTime()-90*24*60*60*1e3),v=["生产车间A","生产车间B","生产车间C","仓储区域D","控制室E","管道间F","原料仓库G","包装车间H","质检区域I","装配线J","维修间K","动力站L"],f=["温度传感器","压力传感器","流量计","电压表","摄像头","噪音检测器","湿度传感器","气体检测器","震动传感器","重量传感器","光电传感器","红外传感器"],b=["张工程","李维修","王管理","赵技术","陈操作","刘检修","孙维护","周工艺"];return Array.from({length:o},(D,x)=>{const U=["device_error","timeout","abnormal","risk","environment"][Math.floor(Math.random()*5)],g=["low","medium","high","critical"][Math.floor(Math.random()*4)],k=["pending","processing","resolved","ignored"][Math.floor(Math.random()*4)],s=Xe(T,i),A=new Date(s.getTime()+Math.random()*36e5),_=`${v[Math.floor(Math.random()*v.length)]}-${String(Math.floor(Math.random()*10)).padStart(2,"0")}`,C=`${f[Math.floor(Math.random()*f.length)]}-${String.fromCharCode(65+Math.floor(Math.random()*5))}${Math.floor(Math.random()*5)+1}`;let P="",$="";switch(U){case"device_error":P=`设备${["温度异常","压力超标","电压波动","运行故障"][Math.floor(Math.random()*4)]}`,$=`${C}检测到${["温度达到","压力超过","电压波动","运行状态"][Math.floor(Math.random()*4)]}异常值，可能影响生产安全`;break;case"timeout":P=`${["设备离线","响应超时","维护逾期","库存预警"][Math.floor(Math.random()*4)]}`,$=`${["设备连续离线超过30分钟","系统响应时间超过阈值","设备维护时间已逾期","库存低于安全水平"][Math.floor(Math.random()*4)]}`;break;case"abnormal":P=`${["异常行为","操作违规","参数异常","数据波动"][Math.floor(Math.random()*4)]}`,$=`检测到${["未授权操作","违规作业","参数超出范围","数据异常波动"][Math.floor(Math.random()*4)]}，需要及时处理`;break;case"risk":P=`${["安全隐患","防护缺失","隔离失效","防护设施损坏"][Math.floor(Math.random()*4)]}`,$=`发现${["安全防护措施缺失","安全隔离设施损坏","防护设备失效","安全设施异常"][Math.floor(Math.random()*4)]}，存在安全风险`;break;case"environment":P=`${["环境异常","空气污染","噪音超标","温湿度异常"][Math.floor(Math.random()*4)]}`,$=`环境监测${["空气质量超标","噪音水平过高","温度异常","湿度超标"][Math.floor(Math.random()*4)]}，需要及时处理`;break}const j=k==="resolved"||k==="ignored"||k==="processing",Q=j?b[Math.floor(Math.random()*b.length)]:void 0,N=j?new Date(A.getTime()+Math.random()*18e5):void 0,ee=k==="resolved"?`已${["修复","处理","解决","完成"][Math.floor(Math.random()*4)]}`:void 0;return{id:x+1,title:P,type:U,level:g,status:k,source:C,description:$,location:_,createTime:s.toISOString(),updateTime:A.toISOString(),handledBy:Q,handleTime:N==null?void 0:N.toISOString(),handleResult:ee}})};let ke=Qe(110);const et=async o=>{try{return await new Promise(T=>{setTimeout(()=>{let v=ke.filter(x=>{var U;if(o.type&&x.type!==o.type||o.level&&x.level!==o.level||o.status&&x.status!==o.status)return!1;if(((U=o.dateRange)==null?void 0:U.length)===2){const g=new Date(x.createTime),[k,s]=o.dateRange;if(g<k||g>s)return!1}return!0});v.sort((x,U)=>new Date(U.createTime).getTime()-new Date(x.createTime).getTime());const f=(o.page-1)*o.pageSize,b=f+o.pageSize,D=v.slice(f,b);T({data:D,total:v.length})},500)})}catch(i){throw console.error("获取预警列表失败:",i),i}},tt=(o,i,T)=>{const v=[],f=[{name:"张工程",role:"设备工程师"},{name:"李维修",role:"维修技师"},{name:"王管理",role:"安全主管"},{name:"赵技术",role:"技术专家"},{name:"陈操作",role:"操作员"},{name:"刘检修",role:"检修员"},{name:"孙维护",role:"维护工程师"},{name:"周工艺",role:"工艺工程师"}],b=new Date(T);switch(i){case"resolved":const D=Math.floor(Math.random()*3)+2;for(let g=0;g<D;g++){const k=f[Math.floor(Math.random()*f.length)],s=new Date(b.getTime()+(g+1)*Math.random()*36e5);let A,_;g===0?(A="接收处理",_=`收到预警信息，开始进行排查。${["安排人员现场检查","远程诊断分析","调取监控记录","收集相关数据"][Math.floor(Math.random()*4)]}`):g===D-1?(A="完成处理",_=`问题已解决。${["设备已恢复正常运行","安全隐患已排除","参数已调整到正常范围","环境指标已达标"][Math.floor(Math.random()*4)]}`):(A=["现场检查","故障诊断","维修处理","调试验证"][Math.floor(Math.random()*4)],_=["检查发现设备轴承磨损，需要更换零件","诊断为传感器数据偏差，进行校准调整","更换损坏部件，进行功能测试","调整控制参数，观察运行状态","清理设备积尘，改善散热条件","紧固松动部件，消除异常振动","更新系统配置，优化运行性能","添加防护措施，提升安全等级"][Math.floor(Math.random()*8)]),v.push({id:o*100+g,alertId:o,operator:k.name,role:k.role,action:A,description:_,time:s.toISOString(),attachments:g===D-1?[{name:["处理报告.pdf","现场照片.jpg","检测数据.xlsx"][Math.floor(Math.random()*3)],url:"#",type:["application/pdf","image/jpeg","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"][Math.floor(Math.random()*3)]}]:[]})}break;case"processing":const x=Math.floor(Math.random()*2)+1;for(let g=0;g<x;g++){const k=f[Math.floor(Math.random()*f.length)],s=new Date(b.getTime()+(g+1)*Math.random()*18e5);v.push({id:o*100+g,alertId:o,operator:k.name,role:k.role,action:g===0?"接收处理":"处理中",description:["正在进行现场检查和故障排查","等待备件到达后进行更换","正在进行系统参数调整","正在收集更多数据进行分析","已联系专业人员，等待支援"][Math.floor(Math.random()*5)],time:s.toISOString(),attachments:[]})}break;case"ignored":const U=f[Math.floor(Math.random()*f.length)];v.push({id:o*100,alertId:o,operator:U.name,role:U.role,action:"忽略预警",description:["经评估为误报，不需要处理","重复预警，已在其他任务中处理","临时性波动，在可接受范围内","已知问题，暂时不影响生产"][Math.floor(Math.random()*4)],time:new Date(b.getTime()+Math.random()*18e5).toISOString(),attachments:[]});break}return v},lt=async o=>{try{const i=ke.find(v=>v.id===o);if(!i)throw new Error("预警不存在");return await new Promise(v=>{setTimeout(()=>{const f=tt(o,i.status,i.createTime);v(f)},500)})}catch(i){throw console.error("获取处置历史失败:",i),i}},at=async o=>{try{return await new Promise(T=>{setTimeout(()=>{T(!0)},1e3)})}catch(i){throw console.error("提交处置失败:",i),i}};let Y=[{id:1,name:"设备温度过高预警",type:"device_error",level:"high",conditions:[{field:"温度",operator:">",value:85,unit:"°C"},{field:"持续时间",operator:">",value:5,unit:"分钟"}],actions:[{type:"notification",config:{channels:["sms","email","wechat"],template:"设备温度异常：{location}的{device}温度达到{value}°C，请及时处理"}},{type:"automation",config:{action:"startCooling",params:{mode:"emergency"}}}],enabled:!0,createTime:"2024-01-15T08:00:00Z",updateTime:"2024-03-01T10:30:00Z"},{id:2,name:"安全帽佩戴检测",type:"risk",level:"critical",conditions:[{field:"安全帽识别",operator:"=",value:!1,unit:""},{field:"区域等级",operator:"=",value:"危险区域",unit:""}],actions:[{type:"notification",config:{channels:["broadcast","wechat"],template:"安全预警：{location}发现未佩戴安全帽人员，请立即规范佩戴"}}],enabled:!0,createTime:"2024-01-20T09:15:00Z",updateTime:"2024-03-10T14:20:00Z"},{id:3,name:"设备离线监控",type:"timeout",level:"medium",conditions:[{field:"心跳信号",operator:"=",value:!1,unit:""},{field:"离线时间",operator:">",value:15,unit:"分钟"}],actions:[{type:"notification",config:{channels:["email","system"],template:"设备离线提醒：{device}已离线{duration}分钟，请检查网络连接"}}],enabled:!0,createTime:"2024-02-01T10:00:00Z",updateTime:"2024-03-15T16:45:00Z"},{id:4,name:"环境湿度异常",type:"environment",level:"low",conditions:[{field:"相对湿度",operator:">",value:75,unit:"%"},{field:"检测次数",operator:">",value:3,unit:"次"}],actions:[{type:"notification",config:{channels:["system"],template:"环境提醒：{location}湿度达到{value}%，建议开启除湿设备"}},{type:"automation",config:{action:"startDehumidifier",params:{mode:"auto"}}}],enabled:!0,createTime:"2024-02-10T11:30:00Z",updateTime:"2024-03-05T09:20:00Z"},{id:5,name:"压力超标预警",type:"device_error",level:"critical",conditions:[{field:"管道压力",operator:">",value:2.8,unit:"MPa"}],actions:[{type:"notification",config:{channels:["sms","wechat","broadcast"],template:"紧急预警：{location}管道压力达到{value}MPa，存在安全隐患"}},{type:"automation",config:{action:"emergencyValve",params:{command:"close"}}}],enabled:!0,createTime:"2024-02-15T14:20:00Z",updateTime:"2024-03-12T11:10:00Z"},{id:6,name:"异常行为检测",type:"abnormal",level:"high",conditions:[{field:"行为类型",operator:"=",value:"未授权进入",unit:""},{field:"持续时间",operator:">",value:3,unit:"分钟"}],actions:[{type:"notification",config:{channels:["sms","system"],template:"安全预警：{location}检测到未授权人员，请及时核实"}}],enabled:!0,createTime:"2024-02-20T16:00:00Z",updateTime:"2024-03-08T15:30:00Z"},{id:7,name:"库存预警",type:"timeout",level:"medium",conditions:[{field:"库存量",operator:"<",value:100,unit:"件"},{field:"采购周期",operator:">",value:7,unit:"天"}],actions:[{type:"notification",config:{channels:["email","system"],template:"库存预警：{material}库存不足，当前库存{value}件"}},{type:"webhook",config:{url:"http://erp.example.com/api/purchase",method:"POST"}}],enabled:!0,createTime:"2024-02-25T09:40:00Z",updateTime:"2024-03-18T10:25:00Z"},{id:8,name:"噪音超标预警",type:"environment",level:"medium",conditions:[{field:"噪音级别",operator:">",value:85,unit:"dB"},{field:"持续时间",operator:">",value:30,unit:"分钟"}],actions:[{type:"notification",config:{channels:["system","broadcast"],template:"环境预警：{location}噪音超标，请佩戴防护设备"}}],enabled:!1,createTime:"2024-03-01T13:50:00Z",updateTime:"2024-03-20T14:15:00Z"}];const ot=async()=>{try{return await new Promise(i=>{setTimeout(()=>{i([...Y])},500)})}catch(o){throw console.error("获取预警规则失败:",o),o}},nt=async o=>{try{return await new Promise(T=>{setTimeout(()=>{const v=new Date().toISOString();if(o.id){const f=Y.findIndex(b=>b.id===o.id);if(f>-1){const b={...Y[f],...o,updateTime:v};Y[f]=b,T(b)}else throw new Error("规则不存在")}else{const f={id:Math.floor(Math.random()*1e4),name:o.name||"",type:o.type||"device_error",level:o.level||"medium",conditions:o.conditions||[],actions:o.actions||[],enabled:o.enabled??!0,createTime:v,updateTime:v};Y.push(f),T(f)}},1e3)})}catch(i){throw console.error("保存预警规则失败:",i),i}},rt=async o=>{try{return await new Promise((T,v)=>{setTimeout(()=>{const f=Y.findIndex(b=>b.id===o);f>-1?(Y.splice(f,1),T(!0)):v(new Error("规则不存在"))},500)})}catch(i){throw console.error("删除预警规则失败:",i),i}},st=async(o,i)=>{try{return await new Promise((v,f)=>{setTimeout(()=>{const b=Y.findIndex(D=>D.id===o);if(b>-1){const D={...Y[b],enabled:i,updateTime:new Date().toISOString()};Y[b]=D,v(D)}else f(new Error("规则不存在"))},500)})}catch(T){throw console.error("更新规则状态失败:",T),T}},Ce=o=>({device_error:"设备故障",timeout:"超时预警",abnormal:"异常行为",risk:"安全风险",environment:"环境预警"})[o]||o,Re=o=>({low:"低",medium:"中",high:"高",critical:"紧急"})[o]||o,it=o=>({pending:"待处理",processing:"处理中",resolved:"已解决",ignored:"已忽略"})[o]||o,De=o=>({device_error:"danger",timeout:"warning",abnormal:"warning",risk:"danger",environment:"info"})[o],xe=o=>({low:"info",medium:"warning",high:"danger",critical:"danger"})[o],dt=o=>({pending:"danger",processing:"warning",resolved:"success",ignored:"info"})[o],ut={class:"rule-management"},ct={class:"toolbar"},mt=be({__name:"RuleManagement",props:{modelValue:{type:Boolean}},emits:["update:modelValue"],setup(o,{expose:i,emit:T}){const v=o,f=T,b=He({get:()=>v.modelValue,set:d=>f("update:modelValue",d)}),D=S(!1),x=S(!1),U=S([]),g=S(!1),k=S(),s=ce({name:"",type:"device_error",level:"medium",conditions:[],actions:[],enabled:!0}),A={name:[{required:!0,message:"请输入规则名称",trigger:"blur"}],type:[{required:!0,message:"请选择预警类型",trigger:"change"}],level:[{required:!0,message:"请选择预警级别",trigger:"change"}]},_=async()=>{D.value=!0;try{U.value=await ot()}catch(d){console.error("获取规则列表失败:",d),I.error("获取规则列表失败")}finally{D.value=!1}},C=()=>{s.id=void 0,s.name="",s.type="device_error",s.level="medium",s.conditions=[{field:"",operator:">",value:null,unit:""}],s.actions=[{type:"notification",config:{channels:[]}}],s.enabled=!0,g.value=!0},P=d=>{s.id=d.id,s.name=d.name,s.type=d.type,s.level=d.level,s.conditions=d.conditions.map(n=>({...n})),s.actions=d.actions.map(n=>({...n})),s.enabled=d.enabled,g.value=!0},$=async d=>{try{await Fe.confirm(`确定要删除规则"${d.name}"吗？此操作不可恢复！`,"删除确认",{type:"warning",confirmButtonText:"确定删除",cancelButtonText:"取消",confirmButtonClass:"el-button--danger"}),await rt(d.id),I.success("删除成功"),_()}catch(n){n!=="cancel"&&(console.error("删除规则失败:",n),I.error("删除规则失败"))}},j=()=>{_()},Q=async d=>{try{d.updating=!0,await st(d.id,!d.enabled),I.success("更新成功")}catch(n){console.error("更新状态失败:",n),I.error("更新状态失败"),d.enabled=!d.enabled}finally{d.updating=!1}},N=()=>{s.conditions.push({field:"",operator:">",value:null,unit:""})},ee=d=>{s.conditions.splice(d,1)},oe=()=>{s.actions.push({type:"notification",config:{channels:[]}})},ne=d=>{s.actions.splice(d,1)},re=async()=>{if(k.value)try{await k.value.validate(),x.value=!0;const d={id:s.id,name:s.name,type:s.type,level:s.level,conditions:s.conditions.map(n=>({field:n.field,operator:n.operator,value:n.value,unit:n.unit})),actions:s.actions.map(n=>({type:n.type,config:{...n.config}})),enabled:s.enabled};await nt(d),I.success("保存成功"),g.value=!1,_()}catch(d){d!=="cancel"&&(console.error("保存规则失败:",d),I.error("保存规则失败"))}finally{x.value=!1}},se=d=>({notification:"通知",webhook:"Webhook",automation:"自动化"})[d]||d,ie=d=>{if(!d)return"";if(d.channels){const n={sms:"短信",email:"邮件",wechat:"微信"};return d.channels.map(q=>n[q]||q).join("、")}return d.url?`URL: ${d.url}`:JSON.stringify(d)},de=d=>Ve(d).format("YYYY-MM-DD HH:mm:ss");return he(()=>{_()}),i({getRuleList:_}),(d,n)=>{const q=p("el-icon"),Z=p("el-button"),E=p("el-form-item"),le=p("el-form"),u=p("el-table-column"),l=p("el-tag"),z=p("el-switch"),te=p("el-button-group"),ue=p("el-table"),W=p("el-input"),m=p("el-option"),O=p("el-select"),B=p("el-dialog"),L=we("loading");return V(),H(B,{modelValue:b.value,"onUpdate:modelValue":n[6]||(n[6]=r=>b.value=r),title:"预警规则管理",width:"900px","close-on-click-modal":!1},{default:t(()=>[R("div",ut,[R("div",ct,[e(Z,{type:"primary",onClick:C},{default:t(()=>[e(q,null,{default:t(()=>[e(w(Ie))]),_:1}),n[7]||(n[7]=c(" 新增规则 "))]),_:1}),e(Z,{onClick:j},{default:t(()=>[e(q,null,{default:t(()=>[e(w(me))]),_:1}),n[8]||(n[8]=c(" 刷新 "))]),_:1})]),Te((V(),H(ue,{data:U.value,border:"",stripe:""},{default:t(()=>[e(u,{type:"expand"},{default:t(({row:r})=>[e(le,{"label-position":"left",inline:"",class:"rule-detail"},{default:t(()=>[e(E,{label:"触发条件"},{default:t(()=>[(V(!0),F(X,null,K(r.conditions,(y,M)=>(V(),F("div",{key:M},h(y.field)+" "+h(y.operator)+" "+h(y.value)+" "+h(y.unit),1))),128))]),_:2},1024),e(E,{label:"触发动作"},{default:t(()=>[(V(!0),F(X,null,K(r.actions,(y,M)=>(V(),F("div",{key:M},h(se(y.type))+": "+h(ie(y.config)),1))),128))]),_:2},1024)]),_:2},1024)]),_:1}),e(u,{prop:"name",label:"规则名称","min-width":"150"}),e(u,{prop:"type",label:"预警类型",width:"120"},{default:t(({row:r})=>[e(l,{type:w(De)(r.type)},{default:t(()=>[c(h(w(Ce)(r.type)),1)]),_:2},1032,["type"])]),_:1}),e(u,{prop:"level",label:"预警级别",width:"100"},{default:t(({row:r})=>[e(l,{type:w(xe)(r.level)},{default:t(()=>[c(h(w(Re)(r.level)),1)]),_:2},1032,["type"])]),_:1}),e(u,{prop:"enabled",label:"状态",width:"100"},{default:t(({row:r})=>[e(z,{modelValue:r.enabled,"onUpdate:modelValue":y=>r.enabled=y,loading:r.updating,onChange:()=>Q(r)},null,8,["modelValue","onUpdate:modelValue","loading","onChange"])]),_:1}),e(u,{prop:"createTime",label:"创建时间",width:"180"},{default:t(({row:r})=>[c(h(de(r.createTime)),1)]),_:1}),e(u,{label:"操作",width:"150",fixed:"right"},{default:t(({row:r})=>[e(te,null,{default:t(()=>[e(Z,{type:"primary",size:"small",onClick:y=>P(r)},{default:t(()=>n[9]||(n[9]=[c(" 编辑 ")])),_:2},1032,["onClick"]),e(Z,{type:"danger",size:"small",onClick:y=>$(r)},{default:t(()=>n[10]||(n[10]=[c(" 删除 ")])),_:2},1032,["onClick"])]),_:2},1024)]),_:1})]),_:1},8,["data"])),[[L,D.value]])]),e(B,{modelValue:g.value,"onUpdate:modelValue":n[5]||(n[5]=r=>g.value=r),title:s.id?"编辑规则":"新增规则",width:"600px","append-to-body":""},{footer:t(()=>[e(Z,{onClick:n[4]||(n[4]=r=>g.value=!1)},{default:t(()=>n[13]||(n[13]=[c("取消")])),_:1}),e(Z,{type:"primary",loading:x.value,onClick:re},{default:t(()=>n[14]||(n[14]=[c(" 确定 ")])),_:1},8,["loading"])]),default:t(()=>[e(le,{ref_key:"ruleFormRef",ref:k,model:s,rules:A,"label-width":"100px"},{default:t(()=>[e(E,{label:"规则名称",prop:"name"},{default:t(()=>[e(W,{modelValue:s.name,"onUpdate:modelValue":n[0]||(n[0]=r=>s.name=r)},null,8,["modelValue"])]),_:1}),e(E,{label:"预警类型",prop:"type"},{default:t(()=>[e(O,{modelValue:s.type,"onUpdate:modelValue":n[1]||(n[1]=r=>s.type=r),class:"w-full"},{default:t(()=>[e(m,{label:"设备故障",value:"device_error"}),e(m,{label:"超时预警",value:"timeout"}),e(m,{label:"异常行为",value:"abnormal"}),e(m,{label:"安全风险",value:"risk"}),e(m,{label:"环境预警",value:"environment"})]),_:1},8,["modelValue"])]),_:1}),e(E,{label:"预警级别",prop:"level"},{default:t(()=>[e(O,{modelValue:s.level,"onUpdate:modelValue":n[2]||(n[2]=r=>s.level=r),class:"w-full"},{default:t(()=>[e(m,{label:"低",value:"low"}),e(m,{label:"中",value:"medium"}),e(m,{label:"高",value:"high"}),e(m,{label:"紧急",value:"critical"})]),_:1},8,["modelValue"])]),_:1}),e(E,{label:"触发条件"},{default:t(()=>[(V(!0),F(X,null,K(s.conditions,(r,y)=>(V(),F("div",{key:y,class:"condition-item"},[e(W,{modelValue:r.field,"onUpdate:modelValue":M=>r.field=M,placeholder:"字段",class:"mr-2"},null,8,["modelValue","onUpdate:modelValue"]),e(O,{modelValue:r.operator,"onUpdate:modelValue":M=>r.operator=M,class:"mr-2"},{default:t(()=>[e(m,{label:"大于",value:">"}),e(m,{label:"小于",value:"<"}),e(m,{label:"等于",value:"="}),e(m,{label:"大于等于",value:">="}),e(m,{label:"小于等于",value:"<="}),e(m,{label:"不等于",value:"!="})]),_:2},1032,["modelValue","onUpdate:modelValue"]),e(W,{modelValue:r.value,"onUpdate:modelValue":M=>r.value=M,placeholder:"值",class:"mr-2"},null,8,["modelValue","onUpdate:modelValue"]),e(W,{modelValue:r.unit,"onUpdate:modelValue":M=>r.unit=M,placeholder:"单位",class:"mr-2"},null,8,["modelValue","onUpdate:modelValue"]),e(Z,{type:"danger",circle:"",onClick:M=>ee(y)},{default:t(()=>[e(q,null,{default:t(()=>[e(w(ge))]),_:1})]),_:2},1032,["onClick"])]))),128)),e(Z,{type:"primary",plain:"",onClick:N},{default:t(()=>n[11]||(n[11]=[c(" 添加条件 ")])),_:1})]),_:1}),e(E,{label:"触发动作"},{default:t(()=>[(V(!0),F(X,null,K(s.actions,(r,y)=>(V(),F("div",{key:y,class:"action-item"},[e(O,{modelValue:r.type,"onUpdate:modelValue":M=>r.type=M,class:"mr-2"},{default:t(()=>[e(m,{label:"通知",value:"notification"}),e(m,{label:"Webhook",value:"webhook"}),e(m,{label:"自动化",value:"automation"})]),_:2},1032,["modelValue","onUpdate:modelValue"]),r.type==="notification"?(V(),H(O,{key:0,modelValue:r.config.channels,"onUpdate:modelValue":M=>r.config.channels=M,multiple:"",class:"mr-2",placeholder:"选择通知方式"},{default:t(()=>[e(m,{label:"短信",value:"sms"}),e(m,{label:"邮件",value:"email"}),e(m,{label:"微信",value:"wechat"})]),_:2},1032,["modelValue","onUpdate:modelValue"])):r.type==="webhook"?(V(),H(W,{key:1,modelValue:r.config.url,"onUpdate:modelValue":M=>r.config.url=M,placeholder:"Webhook URL",class:"mr-2"},null,8,["modelValue","onUpdate:modelValue"])):ae("",!0),e(Z,{type:"danger",circle:"",onClick:M=>ne(y)},{default:t(()=>[e(q,null,{default:t(()=>[e(w(ge))]),_:1})]),_:2},1032,["onClick"])]))),128)),e(Z,{type:"primary",plain:"",onClick:oe},{default:t(()=>n[12]||(n[12]=[c(" 添加动作 ")])),_:1})]),_:1}),e(E,{label:"启用状态"},{default:t(()=>[e(z,{modelValue:s.enabled,"onUpdate:modelValue":n[3]||(n[3]=r=>s.enabled=r)},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue","title"])]),_:1},8,["modelValue"])}}});const pt=Me(mt,[["__scopeId","data-v-19bddbcb"]]),ft={class:"alert-container"},vt={class:"stat-content"},gt={class:"icon-wrapper"},_t={class:"stat-info"},yt={class:"label"},bt={class:"value"},ht={class:"header-wrapper"},wt={class:"pagination-wrapper"},Tt=be({__name:"index",setup(o){const i=S(!1),T=S(!1),v=S(1),f=S(10),b=S(0),D=S([]),x=S(null),U=S([]),g=S(!1),k=S(!1),s=S(!1),A=S(),_=ce({type:void 0,level:void 0,status:void 0,dateRange:[]}),C=ce({action:"",operator:"",description:"",attachments:[]}),P={action:[{required:!0,message:"请选择处置动作",trigger:"change"}],operator:[{required:!0,message:"请输入处理人",trigger:"blur"}],description:[{required:!0,message:"请输入处置说明",trigger:"blur"}]},$=async()=>{i.value=!0;try{const{data:u,total:l}=await et({page:v.value,pageSize:f.value,type:_.type,level:_.level,status:_.status,dateRange:_.dateRange.length?_.dateRange:void 0});D.value=u,b.value=l}catch(u){console.error("获取预警列表失败:",u),I.error("获取预警列表失败")}finally{i.value=!1}},j=()=>{v.value=1,$()},Q=()=>{_.type=void 0,_.level=void 0,_.status=void 0,_.dateRange=[],j()},N=()=>{$()},ee=u=>{f.value=u,$()},oe=u=>{v.value=u,$()},ne=u=>{x.value=u,g.value=!0,C.action="",C.operator="",C.description="",C.attachments=[]},re=async u=>{try{U.value=await lt(u.id),k.value=!0}catch(l){console.error("获取处置历史失败:",l),I.error("获取处置历史失败")}},se=u=>{C.attachments.push(u.raw)},ie=async()=>{if(!(!A.value||!x.value))try{await A.value.validate(),T.value=!0,await at({alertId:x.value.id,...C}),I.success("处置成功"),g.value=!1,$()}catch(u){console.error("处置失败:",u),I.error("处置失败")}finally{T.value=!1}},de=u=>["pending","processing"].includes(u.status),d=u=>{switch(u){case"up":return Oe;case"down":return Ee;default:return Pe}},n=u=>Ve(u).format("YYYY-MM-DD HH:mm:ss"),q=u=>({confirm:"primary",transfer:"warning",ignore:"info"})[u.action]||"info",Z=u=>({confirm:"确认处理",transfer:"转交处理",ignore:"忽略预警"})[u]||u;he(()=>{$()});const E=S([{label:"今日预警",value:2,changeRate:-3.5,trend:"down",type:"warning",icon:"Warning"},{label:"待处理",value:15,changeRate:-5.2,trend:"down",type:"danger",icon:"Bell"},{label:"已处理",value:83,changeRate:8.3,trend:"up",type:"success",icon:"CircleCheck"},{label:"平均响应",value:"15分钟",changeRate:-10.5,trend:"down",type:"info",icon:"Timer"}]),le=[{text:"最近一周",value:()=>{const u=new Date,l=new Date;return l.setTime(l.getTime()-3600*1e3*24*7),[l,u]}},{text:"最近一月",value:()=>{const u=new Date,l=new Date;return l.setTime(l.getTime()-3600*1e3*24*30),[l,u]}},{text:"最近三月",value:()=>{const u=new Date,l=new Date;return l.setTime(l.getTime()-3600*1e3*24*90),[l,u]}}];return(u,l)=>{const z=p("el-icon"),te=p("el-card"),ue=p("el-col"),W=p("el-row"),m=p("el-option"),O=p("el-select"),B=p("el-form-item"),L=p("el-tag"),r=p("el-date-picker"),y=p("el-button"),M=p("el-form"),pe=p("el-button-group"),G=p("el-descriptions-item"),Se=p("el-descriptions"),J=p("el-table-column"),Ue=p("el-table"),$e=p("el-pagination"),fe=p("el-input"),Ae=p("el-upload"),ve=p("el-dialog"),ze=p("el-timeline-item"),Le=p("el-timeline"),Ze=we("loading");return V(),F("div",ft,[e(W,{gutter:20,class:"stat-row"},{default:t(()=>[(V(!0),F(X,null,K(E.value,a=>(V(),H(ue,{span:6,key:a.label},{default:t(()=>[e(te,{shadow:"hover",class:_e(["stat-card",a.type])},{default:t(()=>[R("div",vt,[R("div",gt,[e(z,null,{default:t(()=>[(V(),H(ye(a.icon)))]),_:2},1024)]),R("div",_t,[R("div",yt,h(a.label),1),R("div",bt,h(a.value),1),R("div",{class:_e(["trend",a.trend])},[c(h(a.changeRate)+"% ",1),e(z,null,{default:t(()=>[(V(),H(ye(d(a.trend))))]),_:2},1024)],2)])])]),_:2},1032,["class"])]),_:2},1024))),128))]),_:1}),e(te,{class:"search-card"},{default:t(()=>[e(M,{model:_,inline:"",class:"search-form"},{default:t(()=>[e(B,{label:"预警类型",class:"form-item"},{default:t(()=>[e(O,{modelValue:_.type,"onUpdate:modelValue":l[0]||(l[0]=a=>_.type=a),clearable:"",placeholder:"全部类型",class:"w-180"},{default:t(()=>[e(m,{label:"设备故障",value:"device_error"},{default:t(()=>[e(z,null,{default:t(()=>[e(w(Ye))]),_:1}),l[14]||(l[14]=R("span",{class:"ml-2"},"设备故障",-1))]),_:1}),e(m,{label:"超时预警",value:"timeout"},{default:t(()=>[e(z,null,{default:t(()=>[e(w(qe))]),_:1}),l[15]||(l[15]=R("span",{class:"ml-2"},"超时预警",-1))]),_:1}),e(m,{label:"异常行为",value:"abnormal"},{default:t(()=>[e(z,null,{default:t(()=>[e(w(je))]),_:1}),l[16]||(l[16]=R("span",{class:"ml-2"},"异常行为",-1))]),_:1}),e(m,{label:"安全风险",value:"risk"},{default:t(()=>[e(z,null,{default:t(()=>[e(w(Ne))]),_:1}),l[17]||(l[17]=R("span",{class:"ml-2"},"安全风险",-1))]),_:1}),e(m,{label:"环境预警",value:"environment"},{default:t(()=>[e(z,null,{default:t(()=>[e(w(We))]),_:1}),l[18]||(l[18]=R("span",{class:"ml-2"},"环境预警",-1))]),_:1})]),_:1},8,["modelValue"])]),_:1}),e(B,{label:"预警级别",class:"form-item"},{default:t(()=>[e(O,{modelValue:_.level,"onUpdate:modelValue":l[1]||(l[1]=a=>_.level=a),clearable:"",placeholder:"全部级别",class:"w-180"},{default:t(()=>[e(m,{label:"低",value:"low"},{default:t(()=>[e(L,{type:"info",size:"small"},{default:t(()=>l[19]||(l[19]=[c("低")])),_:1})]),_:1}),e(m,{label:"中",value:"medium"},{default:t(()=>[e(L,{type:"warning",size:"small"},{default:t(()=>l[20]||(l[20]=[c("中")])),_:1})]),_:1}),e(m,{label:"高",value:"high"},{default:t(()=>[e(L,{type:"danger",size:"small"},{default:t(()=>l[21]||(l[21]=[c("高")])),_:1})]),_:1}),e(m,{label:"紧急",value:"critical"},{default:t(()=>[e(L,{type:"danger",effect:"dark",size:"small"},{default:t(()=>l[22]||(l[22]=[c("紧急")])),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}),e(B,{label:"处理状态",class:"form-item"},{default:t(()=>[e(O,{modelValue:_.status,"onUpdate:modelValue":l[2]||(l[2]=a=>_.status=a),clearable:"",placeholder:"全部状态",class:"w-180"},{default:t(()=>[e(m,{label:"待处理",value:"pending"},{default:t(()=>[e(L,{type:"info"},{default:t(()=>l[23]||(l[23]=[c("待处理")])),_:1})]),_:1}),e(m,{label:"处理中",value:"processing"},{default:t(()=>[e(L,{type:"warning"},{default:t(()=>l[24]||(l[24]=[c("处理中")])),_:1})]),_:1}),e(m,{label:"已解决",value:"resolved"},{default:t(()=>[e(L,{type:"success"},{default:t(()=>l[25]||(l[25]=[c("已解决")])),_:1})]),_:1}),e(m,{label:"已忽略",value:"ignored"},{default:t(()=>[e(L,{type:"info",effect:"dark"},{default:t(()=>l[26]||(l[26]=[c("已忽略")])),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}),e(B,{label:"时间范围",class:"form-item"},{default:t(()=>[e(r,{modelValue:_.dateRange,"onUpdate:modelValue":l[3]||(l[3]=a=>_.dateRange=a),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",shortcuts:le,class:"w-360"},null,8,["modelValue"])]),_:1}),e(B,{class:"form-item"},{default:t(()=>[e(y,{type:"primary",icon:w(Je),onClick:j},{default:t(()=>l[27]||(l[27]=[c(" 搜索 ")])),_:1},8,["icon"]),e(y,{icon:w(me),onClick:Q},{default:t(()=>l[28]||(l[28]=[c(" 重置 ")])),_:1},8,["icon"])]),_:1})]),_:1},8,["model"])]),_:1}),e(te,{class:"list-card"},{header:t(()=>[R("div",ht,[l[31]||(l[31]=R("span",{class:"title"},"预警列表",-1)),e(pe,null,{default:t(()=>[e(y,{type:"primary",onClick:l[4]||(l[4]=a=>s.value=!0)},{default:t(()=>[e(z,null,{default:t(()=>[e(w(Ge))]),_:1}),l[29]||(l[29]=c(" 预警规则 "))]),_:1}),e(y,{onClick:N},{default:t(()=>[e(z,null,{default:t(()=>[e(w(me))]),_:1}),l[30]||(l[30]=c(" 刷新 "))]),_:1})]),_:1})])]),default:t(()=>[Te((V(),H(Ue,{data:D.value,border:"",stripe:""},{default:t(()=>[e(J,{type:"expand"},{default:t(({row:a})=>[e(Se,{column:3,border:""},{default:t(()=>[e(G,{label:"预警描述"},{default:t(()=>[c(h(a.description),1)]),_:2},1024),e(G,{label:"位置信息"},{default:t(()=>[c(h(a.location),1)]),_:2},1024),e(G,{label:"预警来源"},{default:t(()=>[c(h(a.source),1)]),_:2},1024),a.handledBy?(V(),H(G,{key:0,label:"处理人"},{default:t(()=>[c(h(a.handledBy),1)]),_:2},1024)):ae("",!0),a.handleTime?(V(),H(G,{key:1,label:"处理时间"},{default:t(()=>[c(h(n(a.handleTime)),1)]),_:2},1024)):ae("",!0),a.handleResult?(V(),H(G,{key:2,label:"处理结果"},{default:t(()=>[c(h(a.handleResult),1)]),_:2},1024)):ae("",!0)]),_:2},1024)]),_:1}),e(J,{prop:"title",label:"预警标题","min-width":"200"}),e(J,{prop:"type",label:"预警类型",width:"120"},{default:t(({row:a})=>[e(L,{type:w(De)(a.type)},{default:t(()=>[c(h(w(Ce)(a.type)),1)]),_:2},1032,["type"])]),_:1}),e(J,{prop:"level",label:"预警级别",width:"100"},{default:t(({row:a})=>[e(L,{type:w(xe)(a.level)},{default:t(()=>[c(h(w(Re)(a.level)),1)]),_:2},1032,["type"])]),_:1}),e(J,{prop:"status",label:"处理状态",width:"100"},{default:t(({row:a})=>[e(L,{type:w(dt)(a.status)},{default:t(()=>[c(h(w(it)(a.status)),1)]),_:2},1032,["type"])]),_:1}),e(J,{prop:"createTime",label:"创建时间",width:"180"},{default:t(({row:a})=>[c(h(n(a.createTime)),1)]),_:1}),e(J,{label:"操作",width:"200",fixed:"right"},{default:t(({row:a})=>[e(pe,null,{default:t(()=>[e(y,{type:"primary",size:"small",onClick:Be=>ne(a),disabled:!de(a)},{default:t(()=>l[32]||(l[32]=[c(" 处置 ")])),_:2},1032,["onClick","disabled"]),e(y,{type:"info",size:"small",onClick:Be=>re(a)},{default:t(()=>l[33]||(l[33]=[c(" 历史 ")])),_:2},1032,["onClick"])]),_:2},1024)]),_:1})]),_:1},8,["data"])),[[Ze,i.value]]),R("div",wt,[e($e,{"current-page":v.value,"onUpdate:currentPage":l[5]||(l[5]=a=>v.value=a),"page-size":f.value,"onUpdate:pageSize":l[6]||(l[6]=a=>f.value=a),total:b.value,"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next, jumper",onSizeChange:ee,onCurrentChange:oe},null,8,["current-page","page-size","total"])])]),_:1}),e(ve,{modelValue:g.value,"onUpdate:modelValue":l[11]||(l[11]=a=>g.value=a),title:"预警处置",width:"500px","close-on-click-modal":!1},{footer:t(()=>[e(y,{onClick:l[10]||(l[10]=a=>g.value=!1)},{default:t(()=>l[35]||(l[35]=[c("取消")])),_:1}),e(y,{type:"primary",loading:T.value,onClick:ie},{default:t(()=>l[36]||(l[36]=[c(" 确认 ")])),_:1},8,["loading"])]),default:t(()=>[e(M,{ref_key:"handleFormRef",ref:A,model:C,rules:P,"label-width":"80px"},{default:t(()=>[e(B,{label:"处置动作",prop:"action"},{default:t(()=>[e(O,{modelValue:C.action,"onUpdate:modelValue":l[7]||(l[7]=a=>C.action=a),class:"w-full"},{default:t(()=>[e(m,{label:"确认处理",value:"confirm"}),e(m,{label:"转交处理",value:"transfer"}),e(m,{label:"忽略预警",value:"ignore"})]),_:1},8,["modelValue"])]),_:1}),e(B,{label:"处理人",prop:"operator"},{default:t(()=>[e(fe,{modelValue:C.operator,"onUpdate:modelValue":l[8]||(l[8]=a=>C.operator=a)},null,8,["modelValue"])]),_:1}),e(B,{label:"处置说明",prop:"description"},{default:t(()=>[e(fe,{modelValue:C.description,"onUpdate:modelValue":l[9]||(l[9]=a=>C.description=a),type:"textarea",rows:3},null,8,["modelValue"])]),_:1}),e(B,{label:"附件"},{default:t(()=>[e(Ae,{action:"#","auto-upload":!1,"on-change":se,"file-list":C.attachments},{default:t(()=>[e(y,{type:"primary"},{default:t(()=>[e(z,null,{default:t(()=>[e(w(Ke))]),_:1}),l[34]||(l[34]=c(" 选择文件 "))]),_:1})]),_:1},8,["file-list"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"]),e(ve,{modelValue:k.value,"onUpdate:modelValue":l[12]||(l[12]=a=>k.value=a),title:"处置历史",width:"700px"},{default:t(()=>[e(Le,null,{default:t(()=>[(V(!0),F(X,null,K(U.value,a=>(V(),H(ze,{key:a.id,type:q(a),timestamp:n(a.time)},{default:t(()=>[R("h4",null,h(Z(a.action)),1),R("p",null,"处理人："+h(a.operator),1),R("p",null,"说明："+h(a.description),1)]),_:2},1032,["type","timestamp"]))),128))]),_:1})]),_:1},8,["modelValue"]),e(pt,{modelValue:s.value,"onUpdate:modelValue":l[13]||(l[13]=a=>s.value=a)},null,8,["modelValue"])])}}});const Mt=Me(Tt,[["__scopeId","data-v-796cfc94"]]);export{Mt as default};
