import{d as ye,l as R,m as M,r as U,o as Te,c as C,b as a,w as n,u as he,e as u,p as Ce,f as p,F as B,g as S,h as c,i,t as _,q as $,s as De,j as h,v as L,x as Ve,y as xe,z as Be,A as Se,E as H,B as q,n as G,k as J,C as ze,D as Re,G as Ue,_ as Ae}from"./index-bbfbf08c.js";import{u as Ne}from"./inspection-c471f68d.js";const Fe={class:"inspection-container"},Me={class:"stat-card"},$e={class:"stat-info"},Le={class:"stat-title"},qe={class:"stat-value"},Ie={class:"card-header"},Ye={class:"header-left"},Ee={class:"header-right"},Oe={class:"form-row"},Pe={class:"form-row"},je={class:"form-buttons"},He={class:"pagination-container"},Ge={class:"dialog-footer"},Je=ye({__name:"index",setup(Ke){const m=Ne(),K=he(),Q=R(()=>m.loading),W=R(()=>[{title:"待执行任务",value:m.pendingTasks,icon:Ve,type:"primary",trend:"up",change:"+2 较昨日"},{title:"进行中任务",value:m.processingTasks,icon:xe,type:"success",trend:"up",change:"+1 较昨日"},{title:"已完成任务",value:m.completedTasks,icon:Be,type:"warning",trend:"down",change:"-1 较昨日"},{title:"超时任务",value:m.timeoutTasks,icon:Se,type:"danger",trend:"up",change:"+1 较昨日"}]),s=M({status:"",area:"",inspector:"",dateRange:[]}),k=U(1),D=U(10),I=R(()=>{let l=[...m.tasks];if(s.status&&(l=l.filter(t=>t.status===s.status)),s.area&&(l=l.filter(t=>t.area===s.area)),s.inspector&&(l=l.filter(t=>t.inspector===s.inspector)),s.dateRange&&s.dateRange.length===2){const t=new Date(s.dateRange[0]),r=new Date(s.dateRange[1]);r.setHours(23,59,59,999),l=l.filter(g=>{const b=new Date(g.startTime);return b>=t&&b<=r})}return l.length}),X=R(()=>{let l=[...m.tasks];if(s.status&&(l=l.filter(r=>r.status===s.status)),s.area&&(l=l.filter(r=>r.area===s.area)),s.inspector&&(l=l.filter(r=>r.inspector===s.inspector)),s.dateRange&&s.dateRange.length===2){const r=new Date(s.dateRange[0]),g=new Date(s.dateRange[1]);g.setHours(23,59,59,999),l=l.filter(b=>{const z=new Date(b.startTime);return z>=r&&z<=g})}const t=(k.value-1)*D.value;return l.slice(t,t+D.value)}),A=[{value:"张明",label:"张明 - 安全主管"},{value:"李伟",label:"李伟 - 设备工程师"},{value:"王强",label:"王强 - 安全员"},{value:"刘洋",label:"刘洋 - 设备维护"},{value:"陈勇",label:"陈勇 - 安全员"},{value:"赵静",label:"赵静 - 质检员"},{value:"孙磊",label:"孙磊 - 安全工程师"},{value:"周涛",label:"周涛 - 设备维护"},{value:"吴婷",label:"吴婷 - 质检员"},{value:"郑阳",label:"郑阳 - 安全主管"},{value:"杨帆",label:"杨帆 - 设备工程师"},{value:"黄晓明",label:"黄晓明 - 安全员"},{value:"马超",label:"马超 - 设备维护"},{value:"徐亮",label:"徐亮 - 质检主管"},{value:"朱峰",label:"朱峰 - 安全员"},{value:"韩雪",label:"韩雪 - 质检员"},{value:"方明",label:"方明 - 设备工程师"},{value:"董莉",label:"董莉 - 安全员"},{value:"谢峰",label:"谢峰 - 设备维护"},{value:"罗静",label:"罗静 - 质检员"}],y=U(),V=U(!1),o=M({area:"",inspector:"",startTime:"",endTime:"",content:"",remark:""}),Z=M({area:[{required:!0,message:"请选择巡检区域",trigger:"change"}],inspector:[{required:!0,message:"请选择巡检人员",trigger:"change"}],startTime:[{required:!0,message:"请选择开始时间",trigger:"change"}],endTime:[{required:!0,message:"请选择结束时间",trigger:"change"}],content:[{required:!0,message:"请输入巡检内容",trigger:"blur"},{min:10,message:"巡检内容不能少于10个字符",trigger:"blur"}]}),ee=()=>{const l=new Date,t=l.getFullYear(),r=String(l.getMonth()+1).padStart(2,"0"),g=String(l.getDate()).padStart(2,"0"),b=Math.floor(Math.random()*1e3).toString().padStart(3,"0");return`T${t}${r}${g}${b}`},te=()=>{V.value=!0,y.value&&y.value.resetFields()},ae=async()=>{y.value&&await y.value.validate((l,t)=>{if(l){if(new Date(o.startTime)>=new Date(o.endTime)){H.error("结束时间必须大于开始时间");return}const r={taskNo:ee(),area:o.area,inspector:o.inspector,startTime:new Date(o.startTime).toLocaleString(),endTime:new Date(o.endTime).toLocaleString(),status:"待执行",progress:0,content:o.content,remark:o.remark};m.addTask(r),V.value=!1}else console.log("验证失败:",t),H.error("请完善表单信息")})},le=l=>{K.push({name:"InspectionDetail",params:{id:l.taskNo}})},ne=l=>{q.confirm("确认开始此巡检任务吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{m.updateTask(l.taskNo,{status:"进行中",progress:0})}).catch(()=>{})},se=l=>{q.confirm("确认完成此巡检任务吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{m.updateTask(l.taskNo,{status:"已完成",progress:100})}).catch(()=>{})},oe=l=>{q.confirm("确认取消此巡检任务吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"error"}).then(()=>{m.deleteTask(l.taskNo)}).catch(()=>{})},re=()=>{k.value=1,console.log("筛选条件:",s)},ue=()=>{s.status="",s.area="",s.inspector="",s.dateRange=[],k.value=1},ie=l=>{D.value=l,k.value=1},de=l=>{k.value=l},Y=l=>({待执行:"info",进行中:"primary",已完成:"success",已超时:"danger"})[l]||"info",ce=l=>l.status==="已完成"?"success":l.status==="已超时"?"exception":"",pe=()=>{y.value&&y.value.resetFields(),o.area="",o.inspector="",o.startTime="",o.endTime="",o.content="",o.remark=""},me=[{value:"待执行",label:"待执行"},{value:"进行中",label:"进行中"},{value:"已完成",label:"已完成"},{value:"已超时",label:"已超时"}],E=l=>new Date(l).toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}),ve=[{value:"化学品储存区A",label:"化学品储存区A"},{value:"化学品储存区B",label:"化学品储存区B"},{value:"化学品储存区C",label:"化学品储存区C"},{value:"生产车间A",label:"生产车间A"},{value:"生产车间B",label:"生产车间B"},{value:"生产车间C",label:"生产车间C"},{value:"生产车间D",label:"生产车间D"},{value:"仓储区A",label:"仓储区A"},{value:"仓储区B",label:"仓储区B"},{value:"仓储区C",label:"仓储区C"},{value:"原料仓库",label:"原料仓库"},{value:"成品仓库",label:"成品仓库"},{value:"包装车间",label:"包装车间"},{value:"实验室A",label:"实验室A"},{value:"实验室B",label:"实验室B"},{value:"质检区",label:"质检区"},{value:"设备维修间",label:"设备维修间"},{value:"动力中心",label:"动力中心"},{value:"污水处理站",label:"污水处理站"},{value:"办公区",label:"办公区"}],O=(l,t)=>t.label.toLowerCase().includes(l.toLowerCase()),ge=l=>{const t=A.find(r=>r.value===l);return t?t.label:l};return Te(()=>{m.loadTasks()}),(l,t)=>{const r=u("el-icon"),g=u("el-card"),b=u("el-col"),z=u("el-row"),N=u("el-tag"),f=u("el-button"),T=u("el-option"),x=u("el-select"),v=u("el-form-item"),F=u("el-date-picker"),P=u("el-form"),w=u("el-table-column"),fe=u("el-progress"),_e=u("el-table"),be=u("el-pagination"),j=u("el-input"),we=u("el-dialog"),ke=Ce("loading");return p(),C("div",Fe,[a(z,{gutter:24,class:"stat-cards"},{default:n(()=>[(p(!0),C(B,null,S(W.value,e=>(p(),h(b,{span:6,key:e.title},{default:n(()=>[a(g,{shadow:"hover"},{default:n(()=>[c("div",Me,[c("div",{class:G(["stat-icon",e.type])},[a(r,{size:24},{default:n(()=>[(p(),h(J(e.icon)))]),_:2},1024)],2),c("div",$e,[c("div",Le,_(e.title),1),c("div",qe,_(e.value),1),c("div",{class:G(["stat-change",e.trend])},[i(_(e.change)+" ",1),a(r,null,{default:n(()=>[(p(),h(J(e.trend==="up"?"ArrowUp":"ArrowDown")))]),_:2},1024)],2)])])]),_:2},1024)]),_:2},1024))),128))]),_:1}),a(g,{class:"task-card"},{header:n(()=>[c("div",Ie,[c("div",Ye,[t[14]||(t[14]=c("span",{class:"title"},"巡检任务",-1)),a(N,{type:"info",effect:"plain"},{default:n(()=>[i("共 "+_(I.value)+" 条",1)]),_:1})]),c("div",Ee,[a(f,{type:"primary",onClick:te},{default:n(()=>[a(r,null,{default:n(()=>[a($(ze))]),_:1}),t[15]||(t[15]=i("新建任务 "))]),_:1})])])]),default:n(()=>[a(P,{model:s,class:"filter-form"},{default:n(()=>[c("div",Oe,[a(v,{label:"任务状态"},{default:n(()=>[a(x,{modelValue:s.status,"onUpdate:modelValue":t[0]||(t[0]=e=>s.status=e),placeholder:"请选择状态",clearable:"",style:{width:"220px"}},{default:n(()=>[(p(),C(B,null,S(me,e=>a(T,{key:e.value,label:e.label,value:e.value},{default:n(()=>[a(N,{type:Y(e.value),size:"small"},{default:n(()=>[i(_(e.label),1)]),_:2},1032,["type"])]),_:2},1032,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),a(v,{label:"巡检区域"},{default:n(()=>[a(x,{modelValue:s.area,"onUpdate:modelValue":t[1]||(t[1]=e=>s.area=e),placeholder:"请选择区域",clearable:"",style:{width:"220px"}},{default:n(()=>[a(T,{label:"化学品储存区A",value:"area-a"}),a(T,{label:"生产车间B",value:"area-b"}),a(T,{label:"仓储区C",value:"area-c"})]),_:1},8,["modelValue"])]),_:1}),a(v,{label:"巡检人员"},{default:n(()=>[a(x,{modelValue:s.inspector,"onUpdate:modelValue":t[2]||(t[2]=e=>s.inspector=e),placeholder:"请选择巡检人员",clearable:"",filterable:"","filter-method":O,style:{width:"220px"}},{default:n(()=>[(p(),C(B,null,S(A,e=>a(T,{key:e.value,label:e.label,value:e.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),c("div",Pe,[a(v,{label:"时间范围"},{default:n(()=>[a(F,{modelValue:s.dateRange,"onUpdate:modelValue":t[3]||(t[3]=e=>s.dateRange=e),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",style:{width:"420px"},shortcuts:[{text:"最近一周",value:()=>{const e=new Date,d=new Date;return d.setTime(d.getTime()-3600*1e3*24*7),[d,e]}},{text:"最近一个月",value:()=>{const e=new Date,d=new Date;return d.setTime(d.getTime()-3600*1e3*24*30),[d,e]}},{text:"最近三个月",value:()=>{const e=new Date,d=new Date;return d.setTime(d.getTime()-3600*1e3*24*90),[d,e]}}],"value-format":"YYYY-MM-DD"},null,8,["modelValue","shortcuts"])]),_:1}),c("div",je,[a(f,{type:"primary",onClick:re,icon:$(Re)},{default:n(()=>t[16]||(t[16]=[i("查询")])),_:1},8,["icon"]),a(f,{onClick:ue,icon:$(Ue)},{default:n(()=>t[17]||(t[17]=[i("重置")])),_:1},8,["icon"])])])]),_:1},8,["model"]),De((p(),h(_e,{data:X.value,style:{width:"100%"},"element-loading-text":"加载中...","element-loading-background":"rgba(255, 255, 255, 0.7)"},{default:n(()=>[a(w,{prop:"taskNo",label:"任务编号",width:"120"}),a(w,{prop:"area",label:"巡检区域",width:"150"}),a(w,{prop:"inspector",label:"巡检人员","min-width":"150"},{default:n(({row:e})=>[i(_(ge(e.inspector)),1)]),_:1}),a(w,{prop:"startTime",label:"开始时间",width:"180"},{default:n(e=>[i(_(E(e.row.startTime)),1)]),_:1}),a(w,{prop:"endTime",label:"结束时间",width:"180"},{default:n(e=>[i(_(E(e.row.endTime)),1)]),_:1}),a(w,{prop:"status",label:"状态",width:"100"},{default:n(e=>[a(N,{type:Y(e.row.status),size:"small"},{default:n(()=>[i(_(e.row.status),1)]),_:2},1032,["type"])]),_:1}),a(w,{prop:"progress",label:"进度",width:"200"},{default:n(e=>[a(fe,{percentage:e.row.progress,status:ce(e.row)},null,8,["percentage","status"])]),_:1}),a(w,{label:"操作",fixed:"right",width:"200"},{default:n(e=>[a(f,{type:"primary",link:"",size:"small",onClick:d=>le(e.row)},{default:n(()=>t[18]||(t[18]=[i(" 查看 ")])),_:2},1032,["onClick"]),e.row.status==="待执行"?(p(),h(f,{key:0,type:"success",link:"",size:"small",onClick:d=>ne(e.row)},{default:n(()=>t[19]||(t[19]=[i(" 开始 ")])),_:2},1032,["onClick"])):L("",!0),e.row.status==="进行中"?(p(),h(f,{key:1,type:"warning",link:"",size:"small",onClick:d=>se(e.row)},{default:n(()=>t[20]||(t[20]=[i(" 完成 ")])),_:2},1032,["onClick"])):L("",!0),["待执行","已超时"].includes(e.row.status)?(p(),h(f,{key:2,type:"danger",link:"",size:"small",onClick:d=>oe(e.row)},{default:n(()=>t[21]||(t[21]=[i(" 取消 ")])),_:2},1032,["onClick"])):L("",!0)]),_:1})]),_:1},8,["data"])),[[ke,Q.value]]),c("div",He,[a(be,{"current-page":k.value,"onUpdate:currentPage":t[4]||(t[4]=e=>k.value=e),"page-size":D.value,"onUpdate:pageSize":t[5]||(t[5]=e=>D.value=e),"page-sizes":[10,20,30,50],total:I.value,onSizeChange:ie,onCurrentChange:de,layout:"total, sizes, prev, pager, next, jumper"},null,8,["current-page","page-size","total"])])]),_:1}),a(we,{modelValue:V.value,"onUpdate:modelValue":t[13]||(t[13]=e=>V.value=e),title:"新建巡检任务",width:"600px",onClose:pe},{footer:n(()=>[c("span",Ge,[a(f,{onClick:t[12]||(t[12]=e=>V.value=!1)},{default:n(()=>t[22]||(t[22]=[i("取消")])),_:1}),a(f,{type:"primary",onClick:ae},{default:n(()=>t[23]||(t[23]=[i(" 确认 ")])),_:1})])]),default:n(()=>[a(P,{ref_key:"taskFormRef",ref:y,model:o,rules:Z,"label-width":"100px","status-icon":""},{default:n(()=>[a(v,{label:"巡检区域",prop:"area"},{default:n(()=>[a(x,{modelValue:o.area,"onUpdate:modelValue":t[6]||(t[6]=e=>o.area=e),placeholder:"请选择区域",style:{width:"100%"}},{default:n(()=>[(p(),C(B,null,S(ve,e=>a(T,{key:e.value,label:e.label,value:e.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),a(v,{label:"巡检人员",prop:"inspector"},{default:n(()=>[a(x,{modelValue:o.inspector,"onUpdate:modelValue":t[7]||(t[7]=e=>o.inspector=e),placeholder:"请选择巡检人员",filterable:"","filter-method":O,style:{width:"100%"}},{default:n(()=>[(p(),C(B,null,S(A,e=>a(T,{key:e.value,label:e.label,value:e.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),a(v,{label:"开始时间",prop:"startTime"},{default:n(()=>[a(F,{modelValue:o.startTime,"onUpdate:modelValue":t[8]||(t[8]=e=>o.startTime=e),type:"datetime",placeholder:"选择开始时间",style:{width:"100%"}},null,8,["modelValue"])]),_:1}),a(v,{label:"结束时间",prop:"endTime"},{default:n(()=>[a(F,{modelValue:o.endTime,"onUpdate:modelValue":t[9]||(t[9]=e=>o.endTime=e),type:"datetime",placeholder:"选择结束时间",style:{width:"100%"}},null,8,["modelValue"])]),_:1}),a(v,{label:"巡检内容",prop:"content"},{default:n(()=>[a(j,{type:"textarea",modelValue:o.content,"onUpdate:modelValue":t[10]||(t[10]=e=>o.content=e),rows:"4",placeholder:"请输入巡检内容和要求","show-word-limit":"",maxlength:"500"},null,8,["modelValue"])]),_:1}),a(v,{label:"备注",prop:"remark"},{default:n(()=>[a(j,{modelValue:o.remark,"onUpdate:modelValue":t[11]||(t[11]=e=>o.remark=e),placeholder:"请输入备注信息","show-word-limit":"",maxlength:"200"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"])])}}});const Xe=Ae(Je,[["__scopeId","data-v-b3606d70"]]);export{Xe as default};
