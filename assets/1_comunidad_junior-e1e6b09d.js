import{u as f,a as h,r as a,b,j as v,o as u,c as d,d as e,e as c,w as y,l as w,f as r,g as x}from"./index-e0a4ae66.js";const g={class:"mx-5 my-4 p-6 bg-white rounded-md shadow-md grid justify-items-center"},E=e("h3",{class:"font-bold text-2xl"},[e("i",{class:"fa-solid fa-users"}),c(" COMUNIDAD EMPRESARIAL JUNIOR")],-1),U=e("br",null,null,-1),R=e("iframe",{width:"100%",height:"615",src:"https://dotstorming.com/w/654b831ebbcf8b05c4824bf7",frameborder:"0",allowfullscreen:""},null,-1),M=e("hr",{class:"border my-4"},null,-1),N={class:"flex items-center text-purple-400"},S=e("hr",{class:"border my-4"},null,-1),C={__name:"1_comunidad_junior",setup(k){const o=f(),n=h(),l=a(""),m=a(0),_=new Date().getFullYear(),p=b(),t=a(!1);return v(async()=>{l.value=await n.getUserByEmail(o.currentUserEmail),m.value=_-l.value.anionac}),(A,s)=>(u(),d("div",g,[E,U,R,M,e("h2",N,[c("¿Has terminado la actividad y deseas terminar la misión? "),y(e("input",{id:"respuesta",type:"radio",name:"respuesta",class:"radio radio-primary ml-2",value:"si","onUpdate:modelValue":s[0]||(s[0]=i=>t.value=i)},null,512),[[w,t.value]])]),S,t.value?(u(),d("button",{key:0,class:"btn btn-primary mb-4",onClick:s[1]||(s[1]=i=>r(n).saveUserMission(r(o).currentUserEmail,r(p).params.missionId))},"Enviar respuesta")):x("",!0)]))}};export{C as default};
