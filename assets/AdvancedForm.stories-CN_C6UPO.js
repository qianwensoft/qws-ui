var et=e=>{throw TypeError(e)};var tt=(e,a,t)=>a.has(e)||et("Cannot "+t);var b=(e,a,t)=>(tt(e,a,"read from private field"),t?t.call(e):a.get(e)),L=(e,a,t)=>a.has(e)?et("Cannot add the same private member more than once"):a instanceof WeakSet?a.add(e):a.set(e,t),w=(e,a,t,s)=>(tt(e,a,"write to private field"),s?s.call(e,t):a.set(e,t),t);var nt=(e,a,t,s)=>({set _(n){w(e,a,n,t)},get _(){return b(e,a,s)}});import{j as g}from"./jsx-runtime-DpLjie1_.js";import{r as O,R as at}from"./iframe-BaxaaamU.js";import"./preload-helper-C1FmrZbK.js";const ne=new WeakMap,Ae=new WeakMap,ke={current:[]};let Ne=!1,de=0;const ue=new Set,fe=new Map;function $t(e){const a=Array.from(e).sort((t,s)=>t instanceof N&&t.options.deps.includes(s)?1:s instanceof N&&s.options.deps.includes(t)?-1:0);for(const t of a){if(ke.current.includes(t))continue;ke.current.push(t),t.recompute();const s=Ae.get(t);if(s)for(const n of s){const r=ne.get(n);r&&$t(r)}}}function Xt(e){const a={prevVal:e.prevState,currentVal:e.state};for(const t of e.listeners)t(a)}function Zt(e){const a={prevVal:e.prevState,currentVal:e.state};for(const t of e.listeners)t(a)}function Rt(e){if(de>0&&!fe.has(e)&&fe.set(e,e.prevState),ue.add(e),!(de>0)&&!Ne)try{for(Ne=!0;ue.size>0;){const a=Array.from(ue);ue.clear();for(const t of a){const s=fe.get(t)??t.prevState;t.prevState=s,Xt(t)}for(const t of a){const s=ne.get(t);s&&(ke.current.push(t),$t(s))}for(const t of a){const s=ne.get(t);if(s)for(const n of s)Zt(n)}}}finally{Ne=!1,ke.current=[],fe.clear()}}function R(e){de++;try{e()}finally{if(de--,de===0){const a=ue.values().next().value;a&&Rt(a)}}}function Jt(e){return typeof e=="function"}class Ie{constructor(a,t){this.listeners=new Set,this.subscribe=s=>{var n,r;this.listeners.add(s);const i=(r=(n=this.options)==null?void 0:n.onSubscribe)==null?void 0:r.call(n,s,this);return()=>{this.listeners.delete(s),i==null||i()}},this.prevState=a,this.state=a,this.options=t}setState(a){var t,s,n;this.prevState=this.state,(t=this.options)!=null&&t.updateFn?this.state=this.options.updateFn(this.prevState)(a):Jt(a)?this.state=a(this.prevState):this.state=a,(n=(s=this.options)==null?void 0:s.onUpdate)==null||n.call(s),Rt(this)}}class N{constructor(a){this.listeners=new Set,this._subscriptions=[],this.lastSeenDepValues=[],this.getDepVals=()=>{const t=this.options.deps.length,s=new Array(t),n=new Array(t);for(let r=0;r<t;r++){const i=this.options.deps[r];s[r]=i.prevState,n[r]=i.state}return this.lastSeenDepValues=n,{prevDepVals:s,currDepVals:n,prevVal:this.prevState??void 0}},this.recompute=()=>{var t,s;this.prevState=this.state;const n=this.getDepVals();this.state=this.options.fn(n),(s=(t=this.options).onUpdate)==null||s.call(t)},this.checkIfRecalculationNeededDeeply=()=>{for(const r of this.options.deps)r instanceof N&&r.checkIfRecalculationNeededDeeply();let t=!1;const s=this.lastSeenDepValues,{currDepVals:n}=this.getDepVals();for(let r=0;r<n.length;r++)if(n[r]!==s[r]){t=!0;break}t&&this.recompute()},this.mount=()=>(this.registerOnGraph(),this.checkIfRecalculationNeededDeeply(),()=>{this.unregisterFromGraph();for(const t of this._subscriptions)t()}),this.subscribe=t=>{var s,n;this.listeners.add(t);const r=(n=(s=this.options).onSubscribe)==null?void 0:n.call(s,t,this);return()=>{this.listeners.delete(t),r==null||r()}},this.options=a,this.state=a.fn({prevDepVals:void 0,prevVal:void 0,currDepVals:this.getDepVals().currDepVals})}registerOnGraph(a=this.options.deps){for(const t of a)if(t instanceof N)t.registerOnGraph(),this.registerOnGraph(t.options.deps);else if(t instanceof Ie){let s=ne.get(t);s||(s=new Set,ne.set(t,s)),s.add(this);let n=Ae.get(this);n||(n=new Set,Ae.set(this,n)),n.add(t)}}unregisterFromGraph(a=this.options.deps){for(const t of a)if(t instanceof N)this.unregisterFromGraph(t.options.deps);else if(t instanceof Ie){const s=ne.get(t);s&&s.delete(this);const n=Ae.get(this);n&&n.delete(t)}}}function Qt(e){return typeof e=="function"}function st(e,...a){return Qt(e)?e(...a):e}function Yt(e){return e||(typeof crypto<"u"&&typeof crypto.randomUUID=="function"?crypto.randomUUID():"")}var z,k,q,ce,G,Z,j,se,me,_e,K,he,re,Oe;class Bt{constructor({pluginId:a,debug:t=!1,enabled:s=!0,reconnectEveryMs:n=300}){L(this,z,!0);L(this,k);L(this,q);L(this,ce);L(this,G);L(this,Z);L(this,j);L(this,se);L(this,me,0);L(this,_e,5);L(this,K,!1);L(this,he,()=>{this.debugLog("Connected to event bus"),w(this,Z,!0),w(this,K,!1),this.debugLog("Emitting queued events",b(this,G)),b(this,G).forEach(a=>this.emitEventToBus(a)),w(this,G,[]),this.stopConnectLoop(),b(this,q).call(this).removeEventListener("tanstack-connect-success",b(this,he))});L(this,re,()=>{if(b(this,me)<b(this,_e)){nt(this,me)._++,this.dispatchCustomEvent("tanstack-connect",{});return}b(this,q).call(this).removeEventListener("tanstack-connect",b(this,re)),this.debugLog("Max retries reached, giving up on connection"),this.stopConnectLoop()});L(this,Oe,()=>{b(this,K)||(w(this,K,!0),b(this,q).call(this).addEventListener("tanstack-connect-success",b(this,he)),b(this,re).call(this))});w(this,k,a),w(this,z,s),w(this,q,this.getGlobalTarget),w(this,ce,t),this.debugLog(" Initializing event subscription for plugin",b(this,k)),w(this,G,[]),w(this,Z,!1),w(this,j,null),w(this,se,n)}startConnectLoop(){b(this,j)!==null||b(this,Z)||(this.debugLog(`Starting connect loop (every ${b(this,se)}ms)`),w(this,j,setInterval(b(this,re),b(this,se))))}stopConnectLoop(){w(this,K,!1),b(this,j)!==null&&(clearInterval(b(this,j)),w(this,j,null),this.debugLog("Stopped connect loop"))}debugLog(...a){b(this,ce)&&console.log(`🌴 [tanstack-devtools:${b(this,k)}-plugin]`,...a)}getGlobalTarget(){if(typeof globalThis<"u"&&globalThis.__TANSTACK_EVENT_TARGET__)return this.debugLog("Using global event target"),globalThis.__TANSTACK_EVENT_TARGET__;if(typeof window<"u"&&typeof window.addEventListener<"u")return this.debugLog("Using window as event target"),window;const a=typeof EventTarget<"u"?new EventTarget:void 0;return typeof a>"u"||typeof a.addEventListener>"u"?(this.debugLog("No event mechanism available, running in non-web environment"),{addEventListener:()=>{},removeEventListener:()=>{},dispatchEvent:()=>!1}):(this.debugLog("Using new EventTarget as fallback"),a)}getPluginId(){return b(this,k)}dispatchCustomEventShim(a,t){try{const s=new Event(a,{detail:t});b(this,q).call(this).dispatchEvent(s)}catch{this.debugLog("Failed to dispatch shim event")}}dispatchCustomEvent(a,t){try{b(this,q).call(this).dispatchEvent(new CustomEvent(a,{detail:t}))}catch{this.dispatchCustomEventShim(a,t)}}emitEventToBus(a){this.debugLog("Emitting event to client bus",a),this.dispatchCustomEvent("tanstack-dispatch-event",a)}emit(a,t){if(!b(this,z)){this.debugLog("Event bus client is disabled, not emitting event",a,t);return}if(!b(this,Z)){this.debugLog("Bus not available, will be pushed as soon as connected"),b(this,G).push({type:`${b(this,k)}:${a}`,payload:t,pluginId:b(this,k)}),typeof CustomEvent<"u"&&!b(this,K)&&(b(this,Oe).call(this),this.startConnectLoop());return}return this.emitEventToBus({type:`${b(this,k)}:${a}`,payload:t,pluginId:b(this,k)})}on(a,t){const s=`${b(this,k)}:${a}`;if(!b(this,z))return this.debugLog("Event bus client is disabled, not registering event",s),()=>{};const n=r=>{this.debugLog("Received event from bus",r.detail),t(r.detail)};return b(this,q).call(this).addEventListener(s,n),this.debugLog("Registered event to bus",s),()=>{b(this,q).call(this).removeEventListener(s,n)}}onAll(a){if(!b(this,z))return this.debugLog("Event bus client is disabled, not registering event"),()=>{};const t=s=>{const n=s.detail;a(n)};return b(this,q).call(this).addEventListener("tanstack-devtools-global",t),()=>b(this,q).call(this).removeEventListener("tanstack-devtools-global",t)}onAllPluginEvents(a){if(!b(this,z))return this.debugLog("Event bus client is disabled, not registering event"),()=>{};const t=s=>{const n=s.detail;b(this,k)&&n.pluginId!==b(this,k)||a(n)};return b(this,q).call(this).addEventListener("tanstack-devtools-global",t),()=>b(this,q).call(this).removeEventListener("tanstack-devtools-global",t)}}z=new WeakMap,k=new WeakMap,q=new WeakMap,ce=new WeakMap,G=new WeakMap,Z=new WeakMap,j=new WeakMap,se=new WeakMap,me=new WeakMap,_e=new WeakMap,K=new WeakMap,he=new WeakMap,re=new WeakMap,Oe=new WeakMap;class en extends Bt{constructor(a){super({pluginId:"pacer",debug:a==null?void 0:a.debug})}}const tn=(e,a)=>{jt.emit(e,a)},jt=new en;function rt(){return{executionCount:0,isPending:!1,lastArgs:void 0,lastExecutionTime:0,nextExecutionTime:0,status:"idle",maybeExecuteCount:0}}const nn={enabled:!0,leading:!0,trailing:!0,wait:0};var H,P,J,Q,Y,ie;class an{constructor(a,t){L(this,H);L(this,P);L(this,J);L(this,Q);L(this,Y);L(this,ie);this.fn=a,this.store=new Ie(rt()),this.setOptions=s=>{this.options={...this.options,...s},b(this,J).call(this)||this.cancel()},w(this,P,s=>{this.store.setState(n=>{const r={...n,...s},{isPending:i}=r;return{...r,status:b(this,J).call(this)?i?"pending":"idle":"disabled"}}),tn("Throttler",this)}),w(this,J,()=>!!st(this.options.enabled,this)),w(this,Q,()=>st(this.options.wait,this)),this.maybeExecute=(...s)=>{b(this,P).call(this,{maybeExecuteCount:this.store.state.maybeExecuteCount+1});const n=Date.now(),r=n-this.store.state.lastExecutionTime,i=b(this,Q).call(this);if(this.options.leading&&r>=i)b(this,Y).call(this,...s);else if(b(this,P).call(this,{lastArgs:s}),!b(this,H)&&this.options.trailing){const o=this.store.state.lastExecutionTime?n-this.store.state.lastExecutionTime:0,c=i-o;b(this,P).call(this,{isPending:!0}),w(this,H,setTimeout(()=>{const{lastArgs:u}=this.store.state;u!==void 0&&b(this,Y).call(this,...u)},c))}},w(this,Y,(...s)=>{var i,o;if(!b(this,J).call(this))return;this.fn(...s);const n=Date.now(),r=n+b(this,Q).call(this);b(this,ie).call(this),b(this,P).call(this,{executionCount:this.store.state.executionCount+1,lastExecutionTime:n,nextExecutionTime:r,isPending:!1,lastArgs:void 0}),(o=(i=this.options).onExecute)==null||o.call(i,s,this),setTimeout(()=>{this.store.state.isPending||b(this,P).call(this,{nextExecutionTime:void 0})},b(this,Q).call(this))}),this.flush=()=>{this.store.state.isPending&&this.store.state.lastArgs&&b(this,Y).call(this,...this.store.state.lastArgs)},w(this,ie,()=>{b(this,H)&&(clearTimeout(b(this,H)),w(this,H,void 0))}),this.cancel=()=>{b(this,ie).call(this),b(this,P).call(this,{lastArgs:void 0,isPending:!1})},this.reset=()=>{b(this,P).call(this,rt())},this.key=Yt(t.key),this.options={...nn,...t},b(this,P).call(this,this.options.initialState??{}),jt.on("d-Throttler",s=>{s.payload.key===this.key&&(b(this,P).call(this,s.payload.store.state),this.setOptions(s.payload.options))})}}H=new WeakMap,P=new WeakMap,J=new WeakMap,Q=new WeakMap,Y=new WeakMap,ie=new WeakMap;function sn(e,a){return new an(e,a).maybeExecute}function $e(e,a){return typeof e=="function"?e(a):e}function ve(e,a){return Xe(a).reduce((s,n)=>{if(s===null)return null;if(typeof s<"u")return s[n]},e)}function pe(e,a,t){const s=Xe(a);function n(r){if(!s.length)return $e(t,r);const i=s.shift();if(typeof i=="string"||typeof i=="number"&&!Array.isArray(r))return typeof r=="object"?(r===null&&(r={}),{...r,[i]:n(r[i])}):{[i]:n()};if(Array.isArray(r)&&typeof i=="number"){const o=r.slice(0,i);return[...o.length?o:new Array(i),n(r[i]),...r.slice(i+1)]}return[...new Array(i),n()]}return n(e)}function rn(e,a){const t=Xe(a);function s(n){if(!n)return;if(t.length===1){const i=t[0];if(Array.isArray(n)&&typeof i=="number")return n.filter((u,l)=>l!==i);const{[i]:o,...c}=n;return c}const r=t.shift();if(typeof r=="string"&&typeof n=="object")return{...n,[r]:s(n[r])};if(typeof r=="number"&&Array.isArray(n)){if(r>=n.length)return n;const i=n.slice(0,r);return[...i.length?i:new Array(r),s(n[r]),...n.slice(r+1)]}throw new Error("It seems we have created an infinite loop in deleteBy. ")}return s(e)}const on=/^(\d+)$/gm,ln=/\.(\d+)(?=\.)/gm,un=/^(\d+)\./gm,dn=/\.(\d+$)/gm,cn=/\.{2,}/gm,ze="__int__",be=`${ze}$1`;function Xe(e){if(Array.isArray(e))return[...e];if(typeof e!="string")throw new Error("Path must be a string.");return e.replace(/(^\[)|]/gm,"").replace(/\[/g,".").replace(on,be).replace(ln,`.${be}.`).replace(un,`${be}.`).replace(dn,`.${be}`).replace(cn,".").split(".").map(a=>{if(a.startsWith(ze)){const t=a.substring(ze.length),s=parseInt(t,10);return String(s)===t?s:t}return a})}function mn(e){return!(Array.isArray(e)&&e.length===0)}function Ge(e,a){const t=s=>s.validators.filter(Boolean).map(n=>({cause:n.cause,validate:n.fn}));return a.validationLogic({form:a.form,validators:a.validators,event:{type:e,async:!1},runValidation:t})}function Ke(e,a){const{asyncDebounceMs:t}=a,{onBlurAsyncDebounceMs:s,onChangeAsyncDebounceMs:n,onDynamicAsyncDebounceMs:r}=a.validators||{},i=t??0,o=c=>c.validators.filter(Boolean).map(u=>{const l=(u==null?void 0:u.cause)||e;let d=i;switch(l){case"change":d=n??i;break;case"blur":d=s??i;break;case"dynamic":d=r??i;break;case"submit":d=0;break}return e==="submit"&&(d=0),{cause:l,validate:u.fn,debounceMs:d}});return a.validationLogic({form:a.form,validators:a.validators,event:{type:e,async:!0},runValidation:o})}const He=e=>!!e&&typeof e=="object"&&"fields"in e;function W(e,a){if(Object.is(e,a))return!0;if(typeof e!="object"||e===null||typeof a!="object"||a===null)return!1;if(e instanceof Date&&a instanceof Date)return e.getTime()===a.getTime();if(e instanceof Map&&a instanceof Map){if(e.size!==a.size)return!1;for(const[n,r]of e)if(!a.has(n)||!Object.is(r,a.get(n)))return!1;return!0}if(e instanceof Set&&a instanceof Set){if(e.size!==a.size)return!1;for(const n of e)if(!a.has(n))return!1;return!0}const t=Object.keys(e),s=Object.keys(a);if(t.length!==s.length)return!1;for(const n of t)if(!s.includes(n)||!W(e[n],a[n]))return!1;return!0}const it=({newFormValidatorError:e,isPreviousErrorFromFormValidator:a,previousErrorValue:t})=>e?{newErrorValue:e,newSource:"form"}:a?{newErrorValue:void 0,newSource:void 0}:t?{newErrorValue:t,newSource:"field"}:{newErrorValue:void 0,newSource:void 0},ot=({formLevelError:e,fieldLevelError:a})=>a?{newErrorValue:a,newSource:"field"}:e?{newErrorValue:e,newSource:"form"}:{newErrorValue:void 0,newSource:void 0};function I(e,a){return e==null?a:{...e,...a}}let X=256;const De=[];let ge;for(;X--;)De[X]=(X+256).toString(16).substring(1);function hn(){let e=0,a,t="";if(!ge||X+16>256){for(ge=new Array(256),e=256;e--;)ge[e]=256*Math.random()|0;e=0,X=0}for(;e<16;e++)a=ge[X+e],e===6?t+=De[a&15|64]:e===8?t+=De[a&63|128]:t+=De[a],e&1&&e>1&&e<11&&(t+="-");return X++,t}const te=e=>{if(!e.validators)return e.runValidation({validators:[],form:e.form});const a=e.event.async,t=a?void 0:{fn:e.validators.onMount,cause:"mount"},s={fn:a?e.validators.onChangeAsync:e.validators.onChange,cause:"change"},n={fn:a?e.validators.onBlurAsync:e.validators.onBlur,cause:"blur"},r={fn:a?e.validators.onSubmitAsync:e.validators.onSubmit,cause:"submit"},i=a?void 0:{fn:()=>{},cause:"server"};switch(e.event.type){case"mount":return e.runValidation({validators:[t],form:e.form});case"submit":return e.runValidation({validators:[s,n,r,i],form:e.form});case"server":return e.runValidation({validators:[],form:e.form});case"blur":return e.runValidation({validators:[n,i],form:e.form});case"change":return e.runValidation({validators:[s,i],form:e.form});default:throw new Error(`Unknown validation event type: ${e.event.type}`)}};function fn(e,a){const t=new Map;for(const s of e){const n=s.path??[];let r=a,i="";for(let o=0;o<n.length;o++){const c=n[o];if(c===void 0)continue;const u=typeof c=="object"?c.key:c,l=Number(u);Array.isArray(r)&&!Number.isNaN(l)?i+=`[${l}]`:i+=(o>0?".":"")+String(u),typeof r=="object"&&r!==null?r=r[u]:r=void 0}t.set(i,(t.get(i)??[]).concat(s))}return Object.fromEntries(t)}const lt=(e,a)=>{const t=fn(e,a);return{form:t,fields:t}},ae={validate({value:e,validationSource:a},t){const s=t["~standard"].validate(e);if(s instanceof Promise)throw new Error("async function passed to sync validator");if(s.issues)return a==="field"?s.issues:lt(s.issues,e)},async validateAsync({value:e,validationSource:a},t){const s=await t["~standard"].validate(e);if(s.issues)return a==="field"?s.issues:lt(s.issues,e)}},Nt=e=>!!e&&"~standard"in e,Ce={isValidating:!1,isTouched:!1,isBlurred:!1,isDirty:!1,isPristine:!0,isValid:!0,isDefaultValue:!0,errors:[],errorMap:{},errorSourceMap:{}};function ye(e){function a(l,d,h){const m=i(l,d,"move",h),f=Math.min(d,h),v=Math.max(d,h);for(let y=f;y<=v;y++)m.push(r(l,y));const M=Object.keys(e.fieldInfo).reduce((y,p)=>(p.startsWith(r(l,d))&&y.set(p,e.getFieldMeta(p)),y),new Map);c(m,d<h?"up":"down"),Object.keys(e.fieldInfo).filter(y=>y.startsWith(r(l,h))).forEach(y=>{const p=y.replace(r(l,h),r(l,d)),F=M.get(p);F&&e.setFieldMeta(y,F)})}function t(l,d){const h=i(l,d,"remove");c(h,"up")}function s(l,d,h){i(l,d,"swap",h).forEach(f=>{if(!f.toString().startsWith(r(l,d)))return;const v=f.toString().replace(r(l,d),r(l,h)),[M,y]=[e.getFieldMeta(f),e.getFieldMeta(v)];M&&e.setFieldMeta(v,M),y&&e.setFieldMeta(f,y)})}function n(l,d){const h=i(l,d,"insert");c(h,"down"),h.forEach(m=>{m.toString().startsWith(r(l,d))&&e.setFieldMeta(m,u())})}function r(l,d){return`${l}[${d}]`}function i(l,d,h,m){const f=[r(l,d)];switch(h){case"swap":f.push(r(l,m));break;case"move":{const[v,M]=[Math.min(d,m),Math.max(d,m)];for(let y=v;y<=M;y++)f.push(r(l,y));break}default:{const v=e.getFieldValue(l),M=Array.isArray(v)?v.length:0;for(let y=d+1;y<M;y++)f.push(r(l,y));break}}return Object.keys(e.fieldInfo).filter(v=>f.some(M=>v.startsWith(M)))}function o(l,d){return l.replace(/\[(\d+)\]/,(h,m)=>{const f=parseInt(m,10);return`[${d==="up"?f+1:Math.max(0,f-1)}]`})}function c(l,d){(d==="up"?l:[...l].reverse()).forEach(m=>{const f=o(m.toString(),d),v=e.getFieldMeta(f);v?e.setFieldMeta(m,v):e.setFieldMeta(m,u())})}const u=()=>Ce;return{handleArrayMove:a,handleArrayRemove:t,handleArraySwap:s,handleArrayInsert:n}}class vn extends Bt{constructor(){super({pluginId:"form-devtools",reconnectEveryMs:1e3})}}const _=new vn;function Ue(e){return{values:e.values??{},errorMap:e.errorMap??{},fieldMetaBase:e.fieldMetaBase??{},isSubmitted:e.isSubmitted??!1,isSubmitting:e.isSubmitting??!1,isValidating:e.isValidating??!1,submissionAttempts:e.submissionAttempts??0,isSubmitSuccessful:e.isSubmitSuccessful??!1,validationMetaMap:e.validationMetaMap??{onChange:void 0,onBlur:void 0,onSubmit:void 0,onMount:void 0,onServer:void 0,onDynamic:void 0}}}class pn{constructor(a){var s;this.options={},this.fieldInfo={},this.prevTransformArray=[],this.mount=()=>{var c,u;const n=this.fieldMetaDerived.mount(),r=this.store.mount(),i=()=>{n(),r(),_.emit("form-unmounted",{id:this._formId})};(u=(c=this.options.listeners)==null?void 0:c.onMount)==null||u.call(c,{formApi:this});const{onMount:o}=this.options.validators||{};return _.emit("form-api",{id:this._formId,state:this.store.state,options:this.options}),o&&this.validateSync("mount"),i},this.update=n=>{var u,l;if(!n)return;const r=this.options;this.options=n;const i=!!((l=(u=n.transform)==null?void 0:u.deps)!=null&&l.some((d,h)=>d!==this.prevTransformArray[h])),o=n.defaultValues&&!W(n.defaultValues,r.defaultValues)&&!this.state.isTouched,c=!W(n.defaultState,r.defaultState)&&!this.state.isTouched;!o&&!c&&!i||(R(()=>{this.baseStore.setState(()=>Ue(Object.assign({},this.state,c?n.defaultState:{},o?{values:n.defaultValues}:{},i?{_force_re_eval:!this.state._force_re_eval}:{})))}),_.emit("form-api",{id:this._formId,state:this.store.state,options:this.options}))},this.reset=(n,r)=>{const{fieldMeta:i}=this.state,o=this.resetFieldMeta(i);n&&!(r!=null&&r.keepDefaultValues)&&(this.options={...this.options,defaultValues:n}),this.baseStore.setState(()=>{var c;return Ue({...this.options.defaultState,values:n??this.options.defaultValues??((c=this.options.defaultState)==null?void 0:c.values),fieldMetaBase:o})})},this.validateAllFields=async n=>{const r=[];return R(()=>{Object.values(this.fieldInfo).forEach(o=>{if(!o.instance)return;const c=o.instance;r.push(Promise.resolve().then(()=>c.validate(n,{skipFormValidation:!0}))),o.instance.state.meta.isTouched||o.instance.setMeta(u=>({...u,isTouched:!0}))})}),(await Promise.all(r)).flat()},this.validateArrayFieldsStartingFrom=async(n,r,i)=>{const o=this.getFieldValue(n),c=Array.isArray(o)?Math.max(o.length-1,0):null,u=[`${n}[${r}]`];for(let m=r+1;m<=(c??0);m++)u.push(`${n}[${m}]`);const l=Object.keys(this.fieldInfo).filter(m=>u.some(f=>m.startsWith(f))),d=[];return R(()=>{l.forEach(m=>{d.push(Promise.resolve().then(()=>this.validateField(m,i)))})}),(await Promise.all(d)).flat()},this.validateField=(n,r)=>{var o;const i=(o=this.fieldInfo[n])==null?void 0:o.instance;return i?(i.state.meta.isTouched||i.setMeta(c=>({...c,isTouched:!0})),i.validate(r)):[]},this.validateSync=n=>{const r=Ge(n,{...this.options,form:this,validationLogic:this.options.validationLogic||te});let i=!1;const o={};return R(()=>{var l,d,h;for(const m of r){if(!m.validate)continue;const f=this.runValidator({validate:m.validate,value:{value:this.state.values,formApi:this,validationSource:"form"},type:"validate"}),{formError:v,fieldErrors:M}=qe(f),y=le(m.cause);for(const p of Object.keys(this.state.fieldMeta)){if(this.baseStore.state.fieldMetaBase[p]===void 0)continue;const F=this.getFieldMeta(p);if(!F)continue;const{errorMap:x,errorSourceMap:E}=F,T=M==null?void 0:M[p],{newErrorValue:C,newSource:D}=it({newFormValidatorError:T,isPreviousErrorFromFormValidator:(E==null?void 0:E[y])==="form",previousErrorValue:x==null?void 0:x[y]});D==="form"&&(o[p]={...o[p],[y]:T}),(x==null?void 0:x[y])!==C&&this.setFieldMeta(p,A=>({...A,errorMap:{...A.errorMap,[y]:C},errorSourceMap:{...A.errorSourceMap,[y]:D}}))}((l=this.state.errorMap)==null?void 0:l[y])!==v&&this.baseStore.setState(p=>({...p,errorMap:{...p.errorMap,[y]:v}})),(v||M)&&(i=!0)}const c=le("submit");(d=this.state.errorMap)!=null&&d[c]&&n!=="submit"&&!i&&this.baseStore.setState(m=>({...m,errorMap:{...m.errorMap,[c]:void 0}}));const u=le("server");(h=this.state.errorMap)!=null&&h[u]&&n!=="server"&&!i&&this.baseStore.setState(m=>({...m,errorMap:{...m.errorMap,[u]:void 0}}))}),{hasErrored:i,fieldsErrorMap:o}},this.validateAsync=async n=>{const r=Ke(n,{...this.options,form:this,validationLogic:this.options.validationLogic||te});this.state.isFormValidating||this.baseStore.setState(l=>({...l,isFormValidating:!0}));const i=[];let o;for(const l of r){if(!l.validate)continue;const d=le(l.cause),h=this.state.validationMetaMap[d];h==null||h.lastAbortController.abort();const m=new AbortController;this.state.validationMetaMap[d]={lastAbortController:m},i.push(new Promise(async f=>{let v;try{v=await new Promise((F,x)=>{setTimeout(async()=>{if(m.signal.aborted)return F(void 0);try{F(await this.runValidator({validate:l.validate,value:{value:this.state.values,formApi:this,validationSource:"form",signal:m.signal},type:"validateAsync"}))}catch(E){x(E)}},l.debounceMs)})}catch(F){v=F}const{formError:M,fieldErrors:y}=qe(v);y&&(o=o?{...o,...y}:y);const p=le(l.cause);for(const F of Object.keys(this.state.fieldMeta)){if(this.baseStore.state.fieldMetaBase[F]===void 0)continue;const x=this.getFieldMeta(F);if(!x)continue;const{errorMap:E,errorSourceMap:T}=x,C=o==null?void 0:o[F],{newErrorValue:D,newSource:A}=it({newFormValidatorError:C,isPreviousErrorFromFormValidator:(T==null?void 0:T[p])==="form",previousErrorValue:E==null?void 0:E[p]});(E==null?void 0:E[p])!==D&&this.setFieldMeta(F,U=>({...U,errorMap:{...U.errorMap,[p]:D},errorSourceMap:{...U.errorSourceMap,[p]:A}}))}this.baseStore.setState(F=>({...F,errorMap:{...F.errorMap,[p]:M}})),f(o?{fieldErrors:o,errorMapKey:p}:void 0)}))}let c=[];const u={};if(i.length){c=await Promise.all(i);for(const l of c)if(l!=null&&l.fieldErrors){const{errorMapKey:d}=l;for(const[h,m]of Object.entries(l.fieldErrors)){const v={...u[h]||{},[d]:m};u[h]=v}}}return this.baseStore.setState(l=>({...l,isFormValidating:!1})),u},this.validate=n=>{const{hasErrored:r,fieldsErrorMap:i}=this.validateSync(n);return r&&!this.options.asyncAlways?i:this.validateAsync(n)},this.getFieldValue=n=>ve(this.state.values,n),this.getFieldMeta=n=>this.state.fieldMeta[n],this.getFieldInfo=n=>{var r;return(r=this.fieldInfo)[n]||(r[n]={instance:null,validationMetaMap:{onChange:void 0,onBlur:void 0,onSubmit:void 0,onMount:void 0,onServer:void 0,onDynamic:void 0}})},this.setFieldMeta=(n,r)=>{this.baseStore.setState(i=>({...i,fieldMetaBase:{...i.fieldMetaBase,[n]:$e(r,i.fieldMetaBase[n])}}))},this.resetFieldMeta=n=>Object.keys(n).reduce((r,i)=>{const o=i;return r[o]=Ce,r},{}),this.setFieldValue=(n,r,i)=>{var l;const o=(i==null?void 0:i.dontUpdateMeta)??!1,c=(i==null?void 0:i.dontRunListeners)??!1,u=(i==null?void 0:i.dontValidate)??!1;R(()=>{o||this.setFieldMeta(n,d=>({...d,isTouched:!0,isDirty:!0,errorMap:{...d==null?void 0:d.errorMap,onMount:void 0}})),this.baseStore.setState(d=>({...d,values:pe(d.values,n,r)}))}),c||(l=this.getFieldInfo(n).instance)==null||l.triggerOnChangeListener(),u||this.validateField(n,"change")},this.deleteField=n=>{const i=[...Object.keys(this.fieldInfo).filter(o=>{const c=n.toString();return o!==c&&o.startsWith(c)}),n];this.baseStore.setState(o=>{const c={...o};return i.forEach(u=>{c.values=rn(c.values,u),delete this.fieldInfo[u],delete c.fieldMetaBase[u]}),c})},this.pushFieldValue=(n,r,i)=>{this.setFieldValue(n,o=>[...Array.isArray(o)?o:[],r],i)},this.insertFieldValue=async(n,r,i,o)=>{this.setFieldValue(n,u=>[...u.slice(0,r),i,...u.slice(r)],I(o,{dontValidate:!0}));const c=(o==null?void 0:o.dontValidate)??!1;c||await this.validateField(n,"change"),ye(this).handleArrayInsert(n,r),c||await this.validateArrayFieldsStartingFrom(n,r,"change")},this.replaceFieldValue=async(n,r,i,o)=>{this.setFieldValue(n,u=>u.map((l,d)=>d===r?i:l),I(o,{dontValidate:!0})),((o==null?void 0:o.dontValidate)??!1)||(await this.validateField(n,"change"),await this.validateArrayFieldsStartingFrom(n,r,"change"))},this.removeFieldValue=async(n,r,i)=>{const o=this.getFieldValue(n),c=Array.isArray(o)?Math.max(o.length-1,0):null;if(this.setFieldValue(n,l=>l.filter((d,h)=>h!==r),I(i,{dontValidate:!0})),ye(this).handleArrayRemove(n,r),c!==null){const l=`${n}[${c}]`;this.deleteField(l)}((i==null?void 0:i.dontValidate)??!1)||(await this.validateField(n,"change"),await this.validateArrayFieldsStartingFrom(n,r,"change"))},this.swapFieldValues=(n,r,i,o)=>{this.setFieldValue(n,u=>{const l=u[r],d=u[i];return pe(pe(u,`${r}`,d),`${i}`,l)},I(o,{dontValidate:!0})),ye(this).handleArraySwap(n,r,i),((o==null?void 0:o.dontValidate)??!1)||(this.validateField(n,"change"),this.validateField(`${n}[${r}]`,"change"),this.validateField(`${n}[${i}]`,"change"))},this.moveFieldValues=(n,r,i,o)=>{this.setFieldValue(n,u=>{const l=[...u];return l.splice(i,0,l.splice(r,1)[0]),l},I(o,{dontValidate:!0})),ye(this).handleArrayMove(n,r,i),((o==null?void 0:o.dontValidate)??!1)||(this.validateField(n,"change"),this.validateField(`${n}[${r}]`,"change"),this.validateField(`${n}[${i}]`,"change"))},this.clearFieldValues=(n,r)=>{const i=this.getFieldValue(n),o=Array.isArray(i)?Math.max(i.length-1,0):null;if(this.setFieldValue(n,[],I(r,{dontValidate:!0})),o!==null)for(let u=0;u<=o;u++){const l=`${n}[${u}]`;this.deleteField(l)}((r==null?void 0:r.dontValidate)??!1)||this.validateField(n,"change")},this.resetField=n=>{this.baseStore.setState(r=>({...r,fieldMetaBase:{...r.fieldMetaBase,[n]:Ce},values:this.options.defaultValues?pe(r.values,n,ve(this.options.defaultValues,n)):r.values}))},this.getAllErrors=()=>({form:{errors:this.state.errors,errorMap:this.state.errorMap},fields:Object.entries(this.state.fieldMeta).reduce((n,[r,i])=>(Object.keys(i).length&&i.errors.length&&(n[r]={errors:i.errors,errorMap:i.errorMap}),n),{})}),this.parseValuesWithSchema=n=>ae.validate({value:this.state.values,validationSource:"form"},n),this.parseValuesWithSchemaAsync=n=>ae.validateAsync({value:this.state.values,validationSource:"form"},n),this.timeoutIds={validations:{},listeners:{},formListeners:{}},this._formId=(a==null?void 0:a.formId)??hn(),this._devtoolsSubmissionOverride=!1,this.baseStore=new Ie(Ue({...a==null?void 0:a.defaultState,values:(a==null?void 0:a.defaultValues)??((s=a==null?void 0:a.defaultState)==null?void 0:s.values)})),this.fieldMetaDerived=new N({deps:[this.baseStore],fn:({prevDepVals:n,currDepVals:r,prevVal:i})=>{var h,m,f;const o=i,c=n==null?void 0:n[0],u=r[0];let l=0;const d={};for(const v of Object.keys(u.fieldMetaBase)){const M=u.fieldMetaBase[v],y=c==null?void 0:c.fieldMetaBase[v],p=o==null?void 0:o[v],F=ve(u.values,v);let x=p==null?void 0:p.errors;if(!y||M.errorMap!==y.errorMap){x=Object.values(M.errorMap??{}).filter(A=>A!==void 0);const D=(h=this.getFieldInfo(v))==null?void 0:h.instance;D&&!D.options.disableErrorFlat&&(x=x.flat(1))}const E=!mn(x),T=!M.isDirty,C=W(F,ve(this.options.defaultValues,v))||W(F,(f=(m=this.getFieldInfo(v))==null?void 0:m.instance)==null?void 0:f.options.defaultValue);if(p&&p.isPristine===T&&p.isValid===E&&p.isDefaultValue===C&&p.errors===x&&M===y){d[v]=p,l++;continue}d[v]={...M,errors:x??[],isPristine:T,isValid:E,isDefaultValue:C}}return Object.keys(u.fieldMetaBase).length&&o&&l===Object.keys(u.fieldMetaBase).length?o:d}}),this.store=new N({deps:[this.baseStore,this.fieldMetaDerived],fn:({prevDepVals:n,currDepVals:r,prevVal:i})=>{var Ze,Je,Qe,Ye;const o=i,c=n==null?void 0:n[0],u=r[0],l=r[1],d=Object.values(l).filter(Boolean),h=d.some(V=>V.isValidating),m=d.every(V=>V.isValid),f=d.some(V=>V.isTouched),v=d.some(V=>V.isBlurred),M=d.every(V=>V.isDefaultValue),y=f&&((Ze=u.errorMap)==null?void 0:Ze.onMount),p=d.some(V=>V.isDirty),F=!p,x=!!((Je=u.errorMap)!=null&&Je.onMount||d.some(V=>{var $;return($=V==null?void 0:V.errorMap)==null?void 0:$.onMount})),E=!!h;let T=(o==null?void 0:o.errors)??[];(!c||u.errorMap!==c.errorMap)&&(T=Object.values(u.errorMap).reduce((V,$)=>$===void 0?V:$&&He($)?(V.push($.form),V):(V.push($),V),[]));const C=T.length===0,D=m&&C,A=this.options.canSubmitWhenInvalid??!1,U=u.submissionAttempts===0&&!f&&!x||!E&&!u.isSubmitting&&D||A;let ee=u.errorMap;if(y&&(T=T.filter(V=>V!==u.errorMap.onMount),ee=Object.assign(ee,{onMount:void 0})),o&&c&&o.errorMap===ee&&o.fieldMeta===this.fieldMetaDerived.state&&o.errors===T&&o.isFieldsValidating===h&&o.isFieldsValid===m&&o.isFormValid===C&&o.isValid===D&&o.canSubmit===U&&o.isTouched===f&&o.isBlurred===v&&o.isPristine===F&&o.isDefaultValue===M&&o.isDirty===p&&W(c,u))return o;let Be={...u,errorMap:ee,fieldMeta:this.fieldMetaDerived.state,errors:T,isFieldsValidating:h,isFieldsValid:m,isFormValid:C,isValid:D,canSubmit:U,isTouched:f,isBlurred:v,isPristine:F,isDefaultValue:M,isDirty:p};const je=((Qe=this.options.transform)==null?void 0:Qe.deps)??[];if(je.length!==this.prevTransformArray.length||je.some((V,$)=>V!==this.prevTransformArray[$])){const V=Object.assign({},this,{state:Be});(Ye=this.options.transform)==null||Ye.fn(V),Be=V.state,this.prevTransformArray=je}return Be}}),this.handleSubmit=this.handleSubmit.bind(this),this.update(a||{});const t=sn(n=>_.emit("form-state",{id:this._formId,state:n}),{wait:300});this.store.subscribe(()=>{t(this.store.state)}),_.on("request-form-state",n=>{n.payload.id===this._formId&&_.emit("form-api",{id:this._formId,state:this.store.state,options:this.options})}),_.on("request-form-reset",n=>{n.payload.id===this._formId&&this.reset()}),_.on("request-form-force-submit",n=>{n.payload.id===this._formId&&(this._devtoolsSubmissionOverride=!0,this.handleSubmit(),this._devtoolsSubmissionOverride=!1)})}get state(){return this.store.state}get formId(){return this._formId}runValidator(a){return Nt(a.validate)?ae[a.type](a.value,a.validate):a.validate(a.value)}async handleSubmit(a){var n,r,i,o,c,u,l,d,h,m;this.baseStore.setState(f=>({...f,isSubmitted:!1,submissionAttempts:f.submissionAttempts+1,isSubmitSuccessful:!1})),R(()=>{Object.values(this.fieldInfo).forEach(f=>{f.instance&&(f.instance.state.meta.isTouched||f.instance.setMeta(v=>({...v,isTouched:!0})))})});const t=a??this.options.onSubmitMeta;if(!this.state.canSubmit&&!this._devtoolsSubmissionOverride){(r=(n=this.options).onSubmitInvalid)==null||r.call(n,{value:this.state.values,formApi:this,meta:t});return}this.baseStore.setState(f=>({...f,isSubmitting:!0}));const s=()=>{this.baseStore.setState(f=>({...f,isSubmitting:!1}))};if(await this.validateAllFields("submit"),!this.state.isFieldsValid){s(),(o=(i=this.options).onSubmitInvalid)==null||o.call(i,{value:this.state.values,formApi:this,meta:t}),_.emit("form-submission",{id:this._formId,submissionAttempt:this.state.submissionAttempts,successful:!1,stage:"validateAllFields",errors:Object.values(this.state.fieldMeta).map(f=>f.errors).flat()});return}if(await this.validate("submit"),!this.state.isValid){s(),(u=(c=this.options).onSubmitInvalid)==null||u.call(c,{value:this.state.values,formApi:this,meta:t}),_.emit("form-submission",{id:this._formId,submissionAttempt:this.state.submissionAttempts,successful:!1,stage:"validate",errors:this.state.errors});return}R(()=>{Object.values(this.fieldInfo).forEach(f=>{var v,M,y;(y=(M=(v=f.instance)==null?void 0:v.options.listeners)==null?void 0:M.onSubmit)==null||y.call(M,{value:f.instance.state.value,fieldApi:f.instance})})}),(d=(l=this.options.listeners)==null?void 0:l.onSubmit)==null||d.call(l,{formApi:this,meta:t});try{await((m=(h=this.options).onSubmit)==null?void 0:m.call(h,{value:this.state.values,formApi:this,meta:t})),R(()=>{this.baseStore.setState(f=>({...f,isSubmitted:!0,isSubmitSuccessful:!0})),_.emit("form-submission",{id:this._formId,submissionAttempt:this.state.submissionAttempts,successful:!0}),s()})}catch(f){throw this.baseStore.setState(v=>({...v,isSubmitSuccessful:!1})),_.emit("form-submission",{id:this._formId,submissionAttempt:this.state.submissionAttempts,successful:!1,stage:"inflight",onError:f}),s(),f}}setErrorMap(a){R(()=>{Object.entries(a).forEach(([t,s])=>{const n=t;if(He(s)){const{formError:r,fieldErrors:i}=qe(s);for(const o of Object.keys(this.fieldInfo))this.getFieldMeta(o)&&this.setFieldMeta(o,u=>({...u,errorMap:{...u.errorMap,[n]:i==null?void 0:i[o]},errorSourceMap:{...u.errorSourceMap,[n]:"form"}}));this.baseStore.setState(o=>({...o,errorMap:{...o.errorMap,[n]:r}}))}else this.baseStore.setState(r=>({...r,errorMap:{...r.errorMap,[n]:s}}))})})}}function qe(e){if(e){if(He(e)){const a=qe(e.form).formError,t=e.fields;return{formError:a,fieldErrors:t}}return{formError:e}}return{formError:void 0}}function le(e){switch(e){case"submit":return"onSubmit";case"blur":return"onBlur";case"mount":return"onMount";case"server":return"onServer";case"dynamic":return"onDynamic";case"change":default:return"onChange"}}class bn{constructor(a){this.options={},this.mount=()=>{var r,i;const t=this.store.mount();this.options.defaultValue!==void 0&&!this.getMeta().isTouched&&this.form.setFieldValue(this.name,this.options.defaultValue,{dontUpdateMeta:!0});const s=this.getInfo();s.instance=this,this.update(this.options);const{onMount:n}=this.options.validators||{};if(n){const o=this.runValidator({validate:n,value:{value:this.state.value,fieldApi:this,validationSource:"field"},type:"validate"});o&&this.setMeta(c=>({...c,errorMap:{...c==null?void 0:c.errorMap,onMount:o},errorSourceMap:{...c==null?void 0:c.errorSourceMap,onMount:"field"}}))}return(i=(r=this.options.listeners)==null?void 0:r.onMount)==null||i.call(r,{value:this.state.value,fieldApi:this}),t},this.update=t=>{if(this.options=t,this.name=t.name,!this.state.meta.isTouched&&this.options.defaultValue!==void 0){const s=this.form.getFieldValue(this.name);W(s,t.defaultValue)||this.form.setFieldValue(this.name,t.defaultValue,{dontUpdateMeta:!0,dontValidate:!0,dontRunListeners:!0})}this.form.getFieldMeta(this.name)||this.form.setFieldMeta(this.name,this.state.meta)},this.getValue=()=>this.form.getFieldValue(this.name),this.setValue=(t,s)=>{this.form.setFieldValue(this.name,t,I(s,{dontRunListeners:!0,dontValidate:!0})),s!=null&&s.dontRunListeners||this.triggerOnChangeListener(),s!=null&&s.dontValidate||this.validate("change")},this.getMeta=()=>this.store.state.meta,this.setMeta=t=>this.form.setFieldMeta(this.name,t),this.getInfo=()=>this.form.getFieldInfo(this.name),this.pushValue=(t,s)=>{this.form.pushFieldValue(this.name,t,I(s,{dontRunListeners:!0})),s!=null&&s.dontRunListeners||this.triggerOnChangeListener()},this.insertValue=(t,s,n)=>{this.form.insertFieldValue(this.name,t,s,I(n,{dontRunListeners:!0})),n!=null&&n.dontRunListeners||this.triggerOnChangeListener()},this.replaceValue=(t,s,n)=>{this.form.replaceFieldValue(this.name,t,s,I(n,{dontRunListeners:!0})),n!=null&&n.dontRunListeners||this.triggerOnChangeListener()},this.removeValue=(t,s)=>{this.form.removeFieldValue(this.name,t,I(s,{dontRunListeners:!0})),s!=null&&s.dontRunListeners||this.triggerOnChangeListener()},this.swapValues=(t,s,n)=>{this.form.swapFieldValues(this.name,t,s,I(n,{dontRunListeners:!0})),n!=null&&n.dontRunListeners||this.triggerOnChangeListener()},this.moveValue=(t,s,n)=>{this.form.moveFieldValues(this.name,t,s,I(n,{dontRunListeners:!0})),n!=null&&n.dontRunListeners||this.triggerOnChangeListener()},this.clearValues=t=>{this.form.clearFieldValues(this.name,I(t,{dontRunListeners:!0})),t!=null&&t.dontRunListeners||this.triggerOnChangeListener()},this.getLinkedFields=t=>{const s=Object.values(this.form.fieldInfo),n=[];for(const r of s){if(!r.instance)continue;const{onChangeListenTo:i,onBlurListenTo:o}=r.instance.options.validators||{};t==="change"&&(i!=null&&i.includes(this.name))&&n.push(r.instance),t==="blur"&&(o!=null&&o.includes(this.name))&&n.push(r.instance)}return n},this.validateSync=(t,s)=>{var u;const n=Ge(t,{...this.options,form:this.form,validationLogic:this.form.options.validationLogic||te}),i=this.getLinkedFields(t).reduce((l,d)=>{const h=Ge(t,{...d.options,form:d.form,validationLogic:d.form.options.validationLogic||te});return h.forEach(m=>{m.field=d}),l.concat(h)},[]);let o=!1;R(()=>{const l=(d,h)=>{var p;const m=Se(h.cause),f=h.validate?ut(d.runValidator({validate:h.validate,value:{value:d.store.state.value,validationSource:"field",fieldApi:d},type:"validate"})):void 0,v=s[m],{newErrorValue:M,newSource:y}=ot({formLevelError:v,fieldLevelError:f});((p=d.state.meta.errorMap)==null?void 0:p[m])!==M&&d.setMeta(F=>({...F,errorMap:{...F.errorMap,[m]:M},errorSourceMap:{...F.errorSourceMap,[m]:y}})),M&&(o=!0)};for(const d of n)l(this,d);for(const d of i)d.validate&&l(d.field,d)});const c=Se("submit");return(u=this.state.meta.errorMap)!=null&&u[c]&&t!=="submit"&&!o&&this.setMeta(l=>({...l,errorMap:{...l.errorMap,[c]:void 0},errorSourceMap:{...l.errorSourceMap,[c]:void 0}})),{hasErrored:o}},this.validateAsync=async(t,s)=>{const n=Ke(t,{...this.options,form:this.form,validationLogic:this.form.options.validationLogic||te}),r=await s,i=this.getLinkedFields(t),o=i.reduce((h,m)=>{const f=Ke(t,{...m.options,form:m.form,validationLogic:m.form.options.validationLogic||te});return f.forEach(v=>{v.field=m}),h.concat(f)},[]);this.state.meta.isValidating||this.setMeta(h=>({...h,isValidating:!0}));for(const h of i)h.setMeta(m=>({...m,isValidating:!0}));const c=[],u=[],l=(h,m,f)=>{const v=Se(m.cause),M=h.getInfo().validationMetaMap[v];M==null||M.lastAbortController.abort();const y=new AbortController;this.getInfo().validationMetaMap[v]={lastAbortController:y},f.push(new Promise(async p=>{var D;let F;try{F=await new Promise((A,U)=>{this.timeoutIds.validations[m.cause]&&clearTimeout(this.timeoutIds.validations[m.cause]),this.timeoutIds.validations[m.cause]=setTimeout(async()=>{if(y.signal.aborted)return A(void 0);try{A(await this.runValidator({validate:m.validate,value:{value:h.store.state.value,fieldApi:h,signal:y.signal,validationSource:"field"},type:"validateAsync"}))}catch(ee){U(ee)}},m.debounceMs)})}catch(A){F=A}if(y.signal.aborted)return p(void 0);const x=ut(F),E=(D=r[this.name])==null?void 0:D[v],{newErrorValue:T,newSource:C}=ot({formLevelError:E,fieldLevelError:x});h.setMeta(A=>({...A,errorMap:{...A==null?void 0:A.errorMap,[v]:T},errorSourceMap:{...A.errorSourceMap,[v]:C}})),p(T)}))};for(const h of n)h.validate&&l(this,h,c);for(const h of o)h.validate&&l(h.field,h,u);let d=[];(c.length||u.length)&&(d=await Promise.all(c),await Promise.all(u)),this.setMeta(h=>({...h,isValidating:!1}));for(const h of i)h.setMeta(m=>({...m,isValidating:!1}));return d.filter(Boolean)},this.validate=(t,s)=>{var o;if(!this.state.meta.isTouched)return[];const{fieldsErrorMap:n}=s!=null&&s.skipFormValidation?{fieldsErrorMap:{}}:this.form.validateSync(t),{hasErrored:r}=this.validateSync(t,n[this.name]??{});if(r&&!this.options.asyncAlways)return(o=this.getInfo().validationMetaMap[Se(t)])==null||o.lastAbortController.abort(),this.state.meta.errors;const i=s!=null&&s.skipFormValidation?Promise.resolve({}):this.form.validateAsync(t);return this.validateAsync(t,i)},this.handleChange=t=>{this.setValue(t)},this.handleBlur=()=>{this.state.meta.isTouched||this.setMeta(s=>({...s,isTouched:!0})),this.state.meta.isBlurred||this.setMeta(s=>({...s,isBlurred:!0})),this.validate("blur"),this.triggerOnBlurListener()},this.parseValueWithSchema=t=>ae.validate({value:this.state.value,validationSource:"field"},t),this.parseValueWithSchemaAsync=t=>ae.validateAsync({value:this.state.value,validationSource:"field"},t),this.form=a.form,this.name=a.name,this.options=a,this.timeoutIds={validations:{},listeners:{},formListeners:{}},this.store=new N({deps:[this.form.store],fn:()=>{const t=this.form.getFieldMeta(this.name)??{...Ce,...a.defaultMeta};let s=this.form.getFieldValue(this.name);return!t.isTouched&&s===void 0&&this.options.defaultValue!==void 0&&!W(s,this.options.defaultValue)&&(s=this.options.defaultValue),{value:s,meta:t}}})}get state(){return this.store.state}runValidator(a){return Nt(a.validate)?ae[a.type](a.value,a.validate):a.validate(a.value)}setErrorMap(a){this.setMeta(t=>({...t,errorMap:{...t.errorMap,...a}}))}triggerOnBlurListener(){var s,n,r,i,o,c;const a=(s=this.form.options.listeners)==null?void 0:s.onBlurDebounceMs;a&&a>0?(this.timeoutIds.formListeners.blur&&clearTimeout(this.timeoutIds.formListeners.blur),this.timeoutIds.formListeners.blur=setTimeout(()=>{var u,l;(l=(u=this.form.options.listeners)==null?void 0:u.onBlur)==null||l.call(u,{formApi:this.form,fieldApi:this})},a)):(r=(n=this.form.options.listeners)==null?void 0:n.onBlur)==null||r.call(n,{formApi:this.form,fieldApi:this});const t=(i=this.options.listeners)==null?void 0:i.onBlurDebounceMs;t&&t>0?(this.timeoutIds.listeners.blur&&clearTimeout(this.timeoutIds.listeners.blur),this.timeoutIds.listeners.blur=setTimeout(()=>{var u,l;(l=(u=this.options.listeners)==null?void 0:u.onBlur)==null||l.call(u,{value:this.state.value,fieldApi:this})},t)):(c=(o=this.options.listeners)==null?void 0:o.onBlur)==null||c.call(o,{value:this.state.value,fieldApi:this})}triggerOnChangeListener(){var s,n,r,i,o,c;const a=(s=this.form.options.listeners)==null?void 0:s.onChangeDebounceMs;a&&a>0?(this.timeoutIds.formListeners.change&&clearTimeout(this.timeoutIds.formListeners.change),this.timeoutIds.formListeners.change=setTimeout(()=>{var u,l;(l=(u=this.form.options.listeners)==null?void 0:u.onChange)==null||l.call(u,{formApi:this.form,fieldApi:this})},a)):(r=(n=this.form.options.listeners)==null?void 0:n.onChange)==null||r.call(n,{formApi:this.form,fieldApi:this});const t=(i=this.options.listeners)==null?void 0:i.onChangeDebounceMs;t&&t>0?(this.timeoutIds.listeners.change&&clearTimeout(this.timeoutIds.listeners.change),this.timeoutIds.listeners.change=setTimeout(()=>{var u,l;(l=(u=this.options.listeners)==null?void 0:u.onChange)==null||l.call(u,{value:this.state.value,fieldApi:this})},t)):(c=(o=this.options.listeners)==null?void 0:o.onChange)==null||c.call(o,{value:this.state.value,fieldApi:this})}}function ut(e){if(e)return e}function Se(e){switch(e){case"submit":return"onSubmit";case"blur":return"onBlur";case"mount":return"onMount";case"server":return"onServer";case"dynamic":return"onDynamic";case"change":default:return"onChange"}}var Ut={exports:{}},Wt={},zt={exports:{}},Gt={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var oe=O;function gn(e,a){return e===a&&(e!==0||1/e===1/a)||e!==e&&a!==a}var yn=typeof Object.is=="function"?Object.is:gn,Sn=oe.useState,Fn=oe.useEffect,Mn=oe.useLayoutEffect,xn=oe.useDebugValue;function Vn(e,a){var t=a(),s=Sn({inst:{value:t,getSnapshot:a}}),n=s[0].inst,r=s[1];return Mn(function(){n.value=t,n.getSnapshot=a,We(n)&&r({inst:n})},[e,t,a]),Fn(function(){return We(n)&&r({inst:n}),e(function(){We(n)&&r({inst:n})})},[e]),xn(t),t}function We(e){var a=e.getSnapshot;e=e.value;try{var t=a();return!yn(e,t)}catch{return!0}}function wn(e,a){return a()}var Tn=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?wn:Vn;Gt.useSyncExternalStore=oe.useSyncExternalStore!==void 0?oe.useSyncExternalStore:Tn;zt.exports=Gt;var En=zt.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Re=O,Ln=En;function An(e,a){return e===a&&(e!==0||1/e===1/a)||e!==e&&a!==a}var Dn=typeof Object.is=="function"?Object.is:An,qn=Ln.useSyncExternalStore,kn=Re.useRef,In=Re.useEffect,Cn=Re.useMemo,Pn=Re.useDebugValue;Wt.useSyncExternalStoreWithSelector=function(e,a,t,s,n){var r=kn(null);if(r.current===null){var i={hasValue:!1,value:null};r.current=i}else i=r.current;r=Cn(function(){function c(m){if(!u){if(u=!0,l=m,m=s(m),n!==void 0&&i.hasValue){var f=i.value;if(n(f,m))return d=f}return d=m}if(f=d,Dn(l,m))return f;var v=s(m);return n!==void 0&&n(f,v)?(l=m,f):(l=m,d=v)}var u=!1,l,d,h=t===void 0?null:t;return[function(){return c(a())},h===null?void 0:function(){return c(h())}]},[a,t,s,n]);var o=qn(e,r[0],r[1]);return In(function(){i.hasValue=!0,i.value=o},[o]),Pn(o),o};Ut.exports=Wt;var _n=Ut.exports;function Kt(e,a=t=>t){return _n.useSyncExternalStoreWithSelector(e.subscribe,()=>e.state,()=>e.state,a,On)}function On(e,a){if(Object.is(e,a))return!0;if(typeof e!="object"||e===null||typeof a!="object"||a===null)return!1;if(e instanceof Map&&a instanceof Map){if(e.size!==a.size)return!1;for(const[s,n]of e)if(!a.has(s)||!Object.is(n,a.get(s)))return!1;return!0}if(e instanceof Set&&a instanceof Set){if(e.size!==a.size)return!1;for(const s of e)if(!a.has(s))return!1;return!0}if(e instanceof Date&&a instanceof Date)return e.getTime()===a.getTime();const t=dt(e);if(t.length!==dt(a).length)return!1;for(let s=0;s<t.length;s++)if(!Object.prototype.hasOwnProperty.call(a,t[s])||!Object.is(e[t[s]],a[t[s]]))return!1;return!0}function dt(e){return Object.keys(e).concat(Object.getOwnPropertySymbols(e))}const Pe=typeof window<"u"?O.useLayoutEffect:O.useEffect;function $n(e){const a=O.useRef(e);a.current=e;const t=O.useMemo(()=>{const n=new bn({...a.current,form:e.form,name:e.name});return n.Field=Ht,n},[e.form,e.name]);return Pe(t.mount,[t]),Pe(()=>{t.update(e)}),Kt(t.store,e.mode==="array"?s=>[s.meta,Object.keys(s.value??[]).length]:void 0),t}const Ht=({children:e,...a})=>{const t=$n(a),s=O.useMemo(()=>$e(e,t),[e,t,t.state.value,t.state.meta]);return g.jsx(g.Fragment,{children:s})};function Rn({form:e,selector:a,children:t}){const s=Kt(e.store,a);return $e(t,s)}function Bn(e){const a=O.useId(),[t]=O.useState(()=>{const s=new pn({...e,formId:a}),n=s;return n.Field=function(i){return g.jsx(Ht,{...i,form:s})},n.Subscribe=function(i){return g.jsx(Rn,{form:s,selector:i.selector,children:i.children})},n});return Pe(t.mount,[]),Pe(()=>{t.update(e)}),t}function ct({error:e}){return e?g.jsx("div",{className:"field-error",children:e}):null}function mt({text:e}){return e?g.jsx("div",{className:"field-helper",children:e}):null}function ht(e,a,t){const{name:s,type:n="text",placeholder:r,options:i,rows:o,min:c,max:u,pattern:l,step:d}=e,h=a.state.value,m=v=>{const M=n==="number"?Number(v.target.value):n==="checkbox"?v.target.checked:v.target.value;a.handleChange(M)},f=t||e.disabled;switch(n){case"textarea":return g.jsx("textarea",{id:String(s),name:String(s),value:h||"",onChange:m,onBlur:a.handleBlur,placeholder:r,disabled:f,rows:o||3,className:"form-textarea"});case"select":return g.jsxs("select",{id:String(s),name:String(s),value:h||"",onChange:m,onBlur:a.handleBlur,disabled:f,className:"form-select",children:[g.jsx("option",{value:"",children:"请选择"}),i==null?void 0:i.map(v=>g.jsx("option",{value:v.value,children:v.label},v.value))]});case"checkbox":return g.jsxs("label",{className:"form-checkbox-wrapper",children:[g.jsx("input",{type:"checkbox",id:String(s),name:String(s),checked:!!h,onChange:m,onBlur:a.handleBlur,disabled:f,className:"form-checkbox"}),g.jsx("span",{className:"checkbox-label",children:e.label})]});case"radio":return g.jsx("div",{className:"form-radio-group",children:i==null?void 0:i.map(v=>g.jsxs("label",{className:"form-radio-wrapper",children:[g.jsx("input",{type:"radio",name:String(s),value:v.value,checked:h===v.value,onChange:m,onBlur:a.handleBlur,disabled:f,className:"form-radio"}),g.jsx("span",{className:"radio-label",children:v.label})]},v.value))});default:return g.jsx("input",{type:n,id:String(s),name:String(s),value:h||"",onChange:m,onBlur:a.handleBlur,placeholder:r,disabled:f,min:c,max:u,pattern:l,step:d,className:"form-input"})}}function B({fields:e,onSubmit:a,onCancel:t,initialValues:s={},layout:n="vertical",submitText:r="提交",cancelText:i="取消",showCancelButton:o=!0,className:c="",disabled:u=!1,validateOnChange:l=!0,validateOnBlur:d=!0,resetOnSubmit:h=!1}){const[m,f]=at.useState(!1),[v,M]=at.useState(),y=Bn({defaultValues:s,onSubmit:async({value:p})=>{f(!0),M(void 0);try{const F=await a(p);F.success?h&&y.reset():(M("提交失败，请检查表单"),F.errors&&Object.entries(F.errors).forEach(([x,E])=>{const T=y.getFieldMeta(x);T&&y.setFieldMeta(x,{...T,errors:[E]})}))}catch(F){M(F instanceof Error?F.message:"提交失败")}finally{f(!1)}}});return g.jsx("div",{className:`advanced-form advanced-form-${n} ${c}`,children:g.jsxs("form",{onSubmit:p=>{p.preventDefault(),p.stopPropagation(),y.handleSubmit()},className:"form-container",children:[g.jsx("div",{className:"form-fields",children:e.map(p=>p.type==="checkbox"?g.jsx(y.Field,{name:p.name,validators:{onChange:l&&p.validate?({value:F})=>p.validate(F):void 0,onBlur:d&&p.validate?({value:F})=>p.validate(F):void 0},children:F=>{var x;return g.jsxs("div",{className:`form-field form-field-checkbox ${p.className||""}`,children:[ht(p,F,u),g.jsx(ct,{error:(x=F.state.meta.errors)==null?void 0:x[0]}),g.jsx(mt,{text:p.helperText})]})}},String(p.name)):g.jsx(y.Field,{name:p.name,validators:{onChange:l&&p.validate?({value:F})=>p.validate(F):void 0,onBlur:d&&p.validate?({value:F})=>p.validate(F):void 0},children:F=>{var x;return g.jsxs("div",{className:`form-field ${p.className||""}`,children:[g.jsxs("label",{htmlFor:String(p.name),className:"form-label",children:[p.label,p.required&&g.jsx("span",{className:"required-mark",children:"*"})]}),g.jsxs("div",{className:"form-control",children:[ht(p,F,u),g.jsx(ct,{error:(x=F.state.meta.errors)==null?void 0:x[0]}),g.jsx(mt,{text:p.helperText})]})]})}},String(p.name)))}),v&&g.jsx("div",{className:"form-submit-error",children:v}),g.jsxs("div",{className:"form-actions",children:[g.jsx("button",{type:"submit",disabled:u||m||!y.state.canSubmit,className:"form-button form-button-submit",children:m?"提交中...":r}),o&&t&&g.jsx("button",{type:"button",onClick:t,disabled:m,className:"form-button form-button-cancel",children:i})]})]})})}const S={required:(e="此字段为必填项")=>a=>{if(a==null||a==="")return e},email:(e="请输入有效的邮箱地址")=>a=>a?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a)?void 0:e:void 0,minLength:(e,a)=>t=>{if(t)return t.length>=e?void 0:a||`最少需要 ${e} 个字符`},maxLength:(e,a)=>t=>{if(t)return t.length<=e?void 0:a||`最多允许 ${e} 个字符`},min:(e,a)=>t=>{if(t!=null)return t>=e?void 0:a||`最小值为 ${e}`},max:(e,a)=>t=>{if(t!=null)return t<=e?void 0:a||`最大值为 ${e}`},pattern:(e,a="格式不正确")=>t=>{if(t)return e.test(t)?void 0:a},phone:(e="请输入有效的手机号码")=>a=>a?/^1[3-9]\d{9}$/.test(a)?void 0:e:void 0,url:(e="请输入有效的 URL")=>a=>{if(a)try{new URL(a);return}catch{return e}},compose:(...e)=>a=>{for(const t of e){const s=t(a);if(s)return s}}};B.__docgenInfo={description:"",methods:[],displayName:"AdvancedForm",props:{fields:{required:!0,tsType:{name:"Array",elements:[{name:"FieldConfig",elements:[{name:"TFormData"}],raw:"FieldConfig<TFormData>"}],raw:"FieldConfig<TFormData>[]"},description:""},onSubmit:{required:!0,tsType:{name:"signature",type:"function",raw:"(data: TFormData) => Promise<FormSubmitResult<TFormData>> | FormSubmitResult<TFormData>",signature:{arguments:[{type:{name:"TFormData"},name:"data"}],return:{name:"union",raw:"Promise<FormSubmitResult<TFormData>> | FormSubmitResult<TFormData>",elements:[{name:"Promise",elements:[{name:"FormSubmitResult",elements:[{name:"TFormData"}],raw:"FormSubmitResult<TFormData>"}],raw:"Promise<FormSubmitResult<TFormData>>"},{name:"FormSubmitResult",elements:[{name:"TFormData"}],raw:"FormSubmitResult<TFormData>"}]}}},description:""},onCancel:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},initialValues:{required:!1,tsType:{name:"Partial",elements:[{name:"TFormData"}],raw:"Partial<TFormData>"},description:"",defaultValue:{value:"{}",computed:!1}},layout:{required:!1,tsType:{name:"union",raw:"'vertical' | 'horizontal' | 'inline'",elements:[{name:"literal",value:"'vertical'"},{name:"literal",value:"'horizontal'"},{name:"literal",value:"'inline'"}]},description:"",defaultValue:{value:"'vertical'",computed:!1}},submitText:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'提交'",computed:!1}},cancelText:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'取消'",computed:!1}},showCancelButton:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},validateOnChange:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},validateOnBlur:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},resetOnSubmit:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const Gn={title:"Components/AdvancedForm",component:B,parameters:{layout:"padded",docs:{description:{component:`
# 高级表单组件 (AdvancedForm)

基于 \`@tanstack/react-form\` 构建的功能强大的表单组件，提供丰富的验证、布局和交互功能。

## ✨ 核心特性

### 📝 表单验证
- **内置验证器**：required、email、phone、url、min、max、pattern 等
- **自定义验证**：支持自定义验证函数
- **验证时机**：onChange、onBlur 可配置
- **实时反馈**：即时显示验证错误

### 🎨 多种布局
- **垂直布局**：标签在上，控件在下（默认）
- **水平布局**：标签在左，控件在右
- **行内布局**：字段横向排列

### 🔧 丰富的字段类型
支持 12 种字段类型：
- **文本类**：text、email、password、tel、url
- **数字类**：number、date
- **多行文本**：textarea
- **选择类**：select、radio、checkbox

### 🚀 强大的功能
- **TanStack Form 集成**：利用强大的表单状态管理
- **TypeScript 支持**：完整的类型推断和检查
- **响应式设计**：适配各种屏幕尺寸
- **提交状态管理**：自动处理 loading、error 状态
- **表单重置**：支持提交后自动重置

## 🎯 快速开始

\`\`\`tsx
import { AdvancedForm, validators } from './components/AdvancedForm';

interface MyForm {
  name: string;
  email: string;
}

const fields = [
  {
    name: 'name',
    label: '姓名',
    required: true,
    validate: validators.required('请输入姓名'),
  },
  {
    name: 'email',
    label: '邮箱',
    type: 'email',
    validate: validators.compose(
      validators.required(),
      validators.email()
    ),
  },
];

function App() {
  const handleSubmit = async (data: MyForm) => {
    // 处理表单提交
    return { success: true, data };
  };

  return (
    <AdvancedForm
      fields={fields}
      onSubmit={handleSubmit}
      layout="vertical"
    />
  );
}
\`\`\`

## 📚 示例列表

浏览下方的示例了解各种功能的使用方法。
        `}}},tags:["autodocs"]},Fe={parameters:{docs:{description:{story:`
### 基础表单

最简单的表单示例，包含基本的文本输入和验证。

**特点：**
- 垂直布局
- 基础字段类型
- 简单验证
        `}}},render:()=>{const e=[{name:"name",label:"姓名",type:"text",placeholder:"请输入您的姓名",required:!0,validate:S.required("姓名不能为空")},{name:"email",label:"邮箱",type:"email",placeholder:"example@email.com",required:!0,validate:S.compose(S.required("邮箱不能为空"),S.email())},{name:"message",label:"留言",type:"textarea",placeholder:"请输入您的留言",rows:4,validate:S.minLength(10,"留言至少需要 10 个字符")}],a=async t=>(console.log("表单提交:",t),await new Promise(s=>setTimeout(s,1e3)),alert(`提交成功！
姓名: ${t.name}
邮箱: ${t.email}`),{success:!0,data:t});return g.jsxs("div",{style:{padding:"20px",maxWidth:"600px"},children:[g.jsx("h2",{children:"联系我们"}),g.jsx("p",{children:"请填写以下信息，我们会尽快回复您。"}),g.jsx(B,{fields:e,onSubmit:a,showCancelButton:!1})]})}},Me={parameters:{docs:{description:{story:`
### 用户注册表单

完整的用户注册表单，包含密码确认、年龄验证、协议同意等。

**特点：**
- 多种字段类型
- 复杂验证规则
- 密码确认验证
- 复选框协议
        `}}},render:()=>{const e=[{name:"username",label:"用户名",type:"text",placeholder:"请输入用户名",required:!0,validate:S.compose(S.required("用户名不能为空"),S.minLength(3,"用户名至少 3 个字符"),S.maxLength(20,"用户名最多 20 个字符"),S.pattern(/^[a-zA-Z0-9_]+$/,"用户名只能包含字母、数字和下划线")),helperText:"3-20个字符，只能包含字母、数字和下划线"},{name:"email",label:"邮箱",type:"email",placeholder:"your@email.com",required:!0,validate:S.compose(S.required("邮箱不能为空"),S.email())},{name:"password",label:"密码",type:"password",placeholder:"请输入密码",required:!0,validate:S.compose(S.required("密码不能为空"),S.minLength(6,"密码至少 6 个字符")),helperText:"至少 6 个字符"},{name:"confirmPassword",label:"确认密码",type:"password",placeholder:"请再次输入密码",required:!0,validate:t=>{if(!t)return"请确认密码"}},{name:"age",label:"年龄",type:"number",placeholder:"请输入年龄",required:!0,min:18,max:100,validate:S.compose(S.required("年龄不能为空"),S.min(18,"必须年满 18 岁"),S.max(100,"年龄不能超过 100 岁"))},{name:"gender",label:"性别",type:"select",required:!0,options:[{label:"男",value:"male"},{label:"女",value:"female"},{label:"其他",value:"other"}],validate:S.required("请选择性别")},{name:"bio",label:"个人简介",type:"textarea",placeholder:"介绍一下自己...",rows:4,validate:S.maxLength(200,"个人简介最多 200 个字符"),helperText:"最多 200 个字符"},{name:"agreeTerms",label:"我已阅读并同意服务条款和隐私政策",type:"checkbox",required:!0,validate:t=>t?void 0:"请同意服务条款"}],a=async t=>(console.log("注册数据:",t),t.password!==t.confirmPassword?{success:!1,errors:{confirmPassword:"两次输入的密码不一致"}}:(await new Promise(s=>setTimeout(s,1500)),alert(`注册成功！
用户名: ${t.username}
邮箱: ${t.email}`),{success:!0,data:t}));return g.jsxs("div",{style:{padding:"20px",maxWidth:"600px"},children:[g.jsx("h2",{children:"用户注册"}),g.jsx(B,{fields:e,onSubmit:a,submitText:"注册",showCancelButton:!1,resetOnSubmit:!0})]})}},xe={parameters:{docs:{description:{story:`
### 水平布局

标签在左，控件在右的水平布局方式。

**适用场景：** 表单字段较少，屏幕空间充足时使用。
        `}}},render:()=>{const e=[{name:"name",label:"产品名称",type:"text",placeholder:"请输入产品名称",required:!0,validate:S.required("产品名称不能为空")},{name:"category",label:"产品分类",type:"select",required:!0,options:[{label:"电子产品",value:"electronics"},{label:"服装",value:"clothing"},{label:"食品",value:"food"},{label:"图书",value:"books"}],validate:S.required("请选择分类")},{name:"price",label:"价格",type:"number",placeholder:"0.00",required:!0,min:0,step:.01,validate:S.compose(S.required("价格不能为空"),S.min(0,"价格不能为负数"))},{name:"stock",label:"库存",type:"number",placeholder:"0",required:!0,min:0,validate:S.compose(S.required("库存不能为空"),S.min(0,"库存不能为负数"))},{name:"description",label:"产品描述",type:"textarea",placeholder:"请输入产品描述",rows:3},{name:"featured",label:"是否推荐",type:"checkbox"}],a=async t=>(console.log("产品数据:",t),await new Promise(s=>setTimeout(s,1e3)),alert(`产品添加成功！
名称: ${t.name}
价格: ¥${t.price}`),{success:!0,data:t});return g.jsxs("div",{style:{padding:"20px",maxWidth:"800px"},children:[g.jsx("h2",{children:"添加产品"}),g.jsx(B,{fields:e,onSubmit:a,layout:"horizontal",submitText:"添加产品",cancelText:"重置",showCancelButton:!0,onCancel:()=>alert("取消操作")})]})}},Ve={parameters:{docs:{description:{story:`
### 行内布局

字段横向排列的紧凑布局方式。

**适用场景：** 搜索表单、筛选表单等字段较少的场景。
        `}}},render:()=>{const e=[{name:"keyword",label:"关键词",type:"text",placeholder:"搜索..."},{name:"category",label:"分类",type:"select",options:[{label:"全部",value:""},{label:"文章",value:"article"},{label:"视频",value:"video"},{label:"图片",value:"image"}]},{name:"dateFrom",label:"开始日期",type:"date"},{name:"dateTo",label:"结束日期",type:"date"}],a=async t=>(console.log("搜索条件:",t),alert(`搜索中...
关键词: ${t.keyword||"(无)"}
分类: ${t.category||"全部"}`),{success:!0,data:t});return g.jsxs("div",{style:{padding:"20px"},children:[g.jsx("h2",{children:"搜索筛选"}),g.jsx(B,{fields:e,onSubmit:a,layout:"inline",submitText:"搜索",cancelText:"重置",showCancelButton:!0,onCancel:()=>console.log("重置搜索")})]})}},we={parameters:{docs:{description:{story:`
### 单选按钮

使用单选按钮进行单项选择。

**适用场景：** 选项较少（2-5个），需要明确展示所有选项的场景。
        `}}},render:()=>{const e=[{name:"satisfaction",label:"您对我们的服务满意吗？",type:"radio",required:!0,options:[{label:"非常满意",value:"5"},{label:"满意",value:"4"},{label:"一般",value:"3"},{label:"不满意",value:"2"},{label:"非常不满意",value:"1"}],validate:S.required("请选择满意度")},{name:"recommend",label:"您是否会推荐给朋友？",type:"radio",required:!0,options:[{label:"会",value:"yes"},{label:"不会",value:"no"},{label:"不确定",value:"maybe"}],validate:S.required("请选择")},{name:"feedback",label:"其他意见或建议",type:"textarea",placeholder:"请输入您的意见或建议",rows:4}],a=async t=>(console.log("调查问卷:",t),await new Promise(s=>setTimeout(s,1e3)),alert("感谢您的反馈！"),{success:!0,data:t});return g.jsxs("div",{style:{padding:"20px",maxWidth:"600px"},children:[g.jsx("h2",{children:"满意度调查"}),g.jsx(B,{fields:e,onSubmit:a,submitText:"提交问卷",showCancelButton:!1})]})}},Te={parameters:{docs:{description:{story:"\n### 验证器组合\n\n展示如何使用内置验证器和自定义验证器。\n\n**内置验证器：**\n- `validators.required()` - 必填\n- `validators.email()` - 邮箱格式\n- `validators.phone()` - 手机号格式\n- `validators.url()` - URL 格式\n- `validators.minLength()` - 最小长度\n- `validators.maxLength()` - 最大长度\n- `validators.min()` - 最小值\n- `validators.max()` - 最大值\n- `validators.pattern()` - 正则匹配\n- `validators.compose()` - 组合多个验证器\n        "}}},render:()=>{const e=[{name:"email",label:"邮箱地址",type:"email",placeholder:"example@email.com",required:!0,validate:S.compose(S.required("邮箱不能为空"),S.email("请输入有效的邮箱地址"))},{name:"phone",label:"手机号码",type:"tel",placeholder:"13800138000",required:!0,validate:S.compose(S.required("手机号不能为空"),S.phone("请输入有效的手机号码"))},{name:"website",label:"个人网站",type:"url",placeholder:"https://example.com",validate:S.url("请输入有效的 URL"),helperText:"必须以 http:// 或 https:// 开头"},{name:"username",label:"用户名",type:"text",placeholder:"请输入用户名",required:!0,validate:S.compose(S.required("用户名不能为空"),S.minLength(3,"用户名至少 3 个字符"),S.maxLength(15,"用户名最多 15 个字符"),S.pattern(/^[a-z][a-z0-9_]*$/,"用户名必须以小写字母开头，只能包含小写字母、数字和下划线")),helperText:"3-15个字符，以小写字母开头"},{name:"age",label:"年龄",type:"number",placeholder:"请输入年龄",required:!0,validate:S.compose(S.required("年龄不能为空"),S.min(1,"年龄必须大于 0"),S.max(150,"年龄不能超过 150"))}],a=async t=>(console.log("验证通过，提交数据:",t),await new Promise(s=>setTimeout(s,1e3)),alert("所有字段验证通过！"),{success:!0,data:t});return g.jsxs("div",{style:{padding:"20px",maxWidth:"600px"},children:[g.jsx("h2",{children:"验证器示例"}),g.jsx("p",{style:{color:"#666",marginBottom:"20px"},children:"尝试输入不同的值，查看各种验证规则的效果。"}),g.jsx(B,{fields:e,onSubmit:a,validateOnChange:!0,validateOnBlur:!0,showCancelButton:!1})]})}},Ee={parameters:{docs:{description:{story:`
### 禁用状态

展示表单的禁用状态，可以禁用整个表单或单个字段。
        `}}},render:()=>{const[e,a]=O.useState(!0),t=[{name:"name",label:"姓名",type:"text",defaultValue:"张三"},{name:"email",label:"邮箱",type:"email",defaultValue:"zhangsan@example.com",disabled:!0},{name:"phone",label:"手机",type:"tel",defaultValue:"13800138000"},{name:"address",label:"地址",type:"textarea",defaultValue:"北京市朝阳区",rows:2}],s=async n=>(console.log("更新资料:",n),await new Promise(r=>setTimeout(r,1e3)),alert("资料更新成功！"),a(!0),{success:!0,data:n});return g.jsxs("div",{style:{padding:"20px",maxWidth:"600px"},children:[g.jsx("h2",{children:"个人资料"}),g.jsx("div",{style:{marginBottom:"20px"},children:g.jsx("button",{onClick:()=>a(!e),style:{padding:"8px 16px",background:"#1890ff",color:"#fff",border:"none",borderRadius:"4px",cursor:"pointer"},children:e?"编辑资料":"取消编辑"})}),g.jsx(B,{fields:t,onSubmit:s,disabled:e,initialValues:{name:"张三",email:"zhangsan@example.com",phone:"13800138000",address:"北京市朝阳区"},submitText:"保存",cancelText:"取消",showCancelButton:!0,onCancel:()=>a(!0)})]})}},Le={parameters:{docs:{description:{story:`
### 动态表单

根据用户选择动态显示不同的字段。
        `}}},render:()=>{const[e,a]=O.useState("individual"),t=()=>{const n=[{name:"userType",label:"用户类型",type:"select",required:!0,options:[{label:"个人用户",value:"individual"},{label:"企业用户",value:"company"},{label:"学生用户",value:"student"}],defaultValue:e},{name:"name",label:"姓名",type:"text",placeholder:"请输入姓名",required:!0,validate:S.required("姓名不能为空")},{name:"email",label:"邮箱",type:"email",placeholder:"your@email.com",required:!0,validate:S.compose(S.required("邮箱不能为空"),S.email())}];return e==="company"?n.push({name:"companyName",label:"公司名称",type:"text",placeholder:"请输入公司名称",required:!0,validate:S.required("公司名称不能为空")},{name:"taxId",label:"税号",type:"text",placeholder:"请输入税号",required:!0,validate:S.required("税号不能为空")}):e==="student"&&n.push({name:"school",label:"学校",type:"text",placeholder:"请输入学校名称",required:!0,validate:S.required("学校不能为空")},{name:"studentId",label:"学号",type:"text",placeholder:"请输入学号",required:!0,validate:S.required("学号不能为空")}),n},s=async n=>(a(n.userType),console.log("提交数据:",n),await new Promise(r=>setTimeout(r,1e3)),alert(`注册成功！
用户类型: ${n.userType==="individual"?"个人":n.userType==="company"?"企业":"学生"}
姓名: ${n.name}`),{success:!0,data:n});return g.jsxs("div",{style:{padding:"20px",maxWidth:"600px"},children:[g.jsx("h2",{children:"动态表单示例"}),g.jsx("p",{style:{color:"#666",marginBottom:"20px"},children:"根据用户类型显示不同的字段"}),g.jsx(B,{fields:t(),onSubmit:s,initialValues:{userType:e},showCancelButton:!1},e)]})}};var ft,vt,pt;Fe.parameters={...Fe.parameters,docs:{...(ft=Fe.parameters)==null?void 0:ft.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 基础表单

最简单的表单示例，包含基本的文本输入和验证。

**特点：**
- 垂直布局
- 基础字段类型
- 简单验证
        \`
      }
    }
  },
  render: () => {
    const fields: FieldConfig<ContactForm>[] = [{
      name: 'name',
      label: '姓名',
      type: 'text',
      placeholder: '请输入您的姓名',
      required: true,
      validate: validators.required('姓名不能为空')
    }, {
      name: 'email',
      label: '邮箱',
      type: 'email',
      placeholder: 'example@email.com',
      required: true,
      validate: validators.compose(validators.required('邮箱不能为空'), validators.email())
    }, {
      name: 'message',
      label: '留言',
      type: 'textarea',
      placeholder: '请输入您的留言',
      rows: 4,
      validate: validators.minLength(10, '留言至少需要 10 个字符')
    }];
    const handleSubmit = async (data: ContactForm): Promise<FormSubmitResult<ContactForm>> => {
      console.log('表单提交:', data);
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(\`提交成功！\\n姓名: \${data.name}\\n邮箱: \${data.email}\`);
      return {
        success: true,
        data
      };
    };
    return <div style={{
      padding: '20px',
      maxWidth: '600px'
    }}>
        <h2>联系我们</h2>
        <p>请填写以下信息，我们会尽快回复您。</p>
        <AdvancedForm fields={fields} onSubmit={handleSubmit} showCancelButton={false} />
      </div>;
  }
}`,...(pt=(vt=Fe.parameters)==null?void 0:vt.docs)==null?void 0:pt.source}}};var bt,gt,yt;Me.parameters={...Me.parameters,docs:{...(bt=Me.parameters)==null?void 0:bt.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 用户注册表单

完整的用户注册表单，包含密码确认、年龄验证、协议同意等。

**特点：**
- 多种字段类型
- 复杂验证规则
- 密码确认验证
- 复选框协议
        \`
      }
    }
  },
  render: () => {
    const fields: FieldConfig<UserRegisterForm>[] = [{
      name: 'username',
      label: '用户名',
      type: 'text',
      placeholder: '请输入用户名',
      required: true,
      validate: validators.compose(validators.required('用户名不能为空'), validators.minLength(3, '用户名至少 3 个字符'), validators.maxLength(20, '用户名最多 20 个字符'), validators.pattern(/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线')),
      helperText: '3-20个字符，只能包含字母、数字和下划线'
    }, {
      name: 'email',
      label: '邮箱',
      type: 'email',
      placeholder: 'your@email.com',
      required: true,
      validate: validators.compose(validators.required('邮箱不能为空'), validators.email())
    }, {
      name: 'password',
      label: '密码',
      type: 'password',
      placeholder: '请输入密码',
      required: true,
      validate: validators.compose(validators.required('密码不能为空'), validators.minLength(6, '密码至少 6 个字符')),
      helperText: '至少 6 个字符'
    }, {
      name: 'confirmPassword',
      label: '确认密码',
      type: 'password',
      placeholder: '请再次输入密码',
      required: true,
      validate: (value: string) => {
        // 注意：这里无法直接访问其他字段，需要在表单级别验证
        if (!value) return '请确认密码';
        return undefined;
      }
    }, {
      name: 'age',
      label: '年龄',
      type: 'number',
      placeholder: '请输入年龄',
      required: true,
      min: 18,
      max: 100,
      validate: validators.compose(validators.required('年龄不能为空'), validators.min(18, '必须年满 18 岁'), validators.max(100, '年龄不能超过 100 岁'))
    }, {
      name: 'gender',
      label: '性别',
      type: 'select',
      required: true,
      options: [{
        label: '男',
        value: 'male'
      }, {
        label: '女',
        value: 'female'
      }, {
        label: '其他',
        value: 'other'
      }],
      validate: validators.required('请选择性别')
    }, {
      name: 'bio',
      label: '个人简介',
      type: 'textarea',
      placeholder: '介绍一下自己...',
      rows: 4,
      validate: validators.maxLength(200, '个人简介最多 200 个字符'),
      helperText: '最多 200 个字符'
    }, {
      name: 'agreeTerms',
      label: '我已阅读并同意服务条款和隐私政策',
      type: 'checkbox',
      required: true,
      validate: (value: boolean) => {
        return value ? undefined : '请同意服务条款';
      }
    }];
    const handleSubmit = async (data: UserRegisterForm): Promise<FormSubmitResult<UserRegisterForm>> => {
      console.log('注册数据:', data);

      // 验证密码确认
      if (data.password !== data.confirmPassword) {
        return {
          success: false,
          errors: {
            confirmPassword: '两次输入的密码不一致'
          }
        };
      }

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(\`注册成功！\\n用户名: \${data.username}\\n邮箱: \${data.email}\`);
      return {
        success: true,
        data
      };
    };
    return <div style={{
      padding: '20px',
      maxWidth: '600px'
    }}>
        <h2>用户注册</h2>
        <AdvancedForm fields={fields} onSubmit={handleSubmit} submitText="注册" showCancelButton={false} resetOnSubmit={true} />
      </div>;
  }
}`,...(yt=(gt=Me.parameters)==null?void 0:gt.docs)==null?void 0:yt.source}}};var St,Ft,Mt;xe.parameters={...xe.parameters,docs:{...(St=xe.parameters)==null?void 0:St.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 水平布局

标签在左，控件在右的水平布局方式。

**适用场景：** 表单字段较少，屏幕空间充足时使用。
        \`
      }
    }
  },
  render: () => {
    const fields: FieldConfig<ProductForm>[] = [{
      name: 'name',
      label: '产品名称',
      type: 'text',
      placeholder: '请输入产品名称',
      required: true,
      validate: validators.required('产品名称不能为空')
    }, {
      name: 'category',
      label: '产品分类',
      type: 'select',
      required: true,
      options: [{
        label: '电子产品',
        value: 'electronics'
      }, {
        label: '服装',
        value: 'clothing'
      }, {
        label: '食品',
        value: 'food'
      }, {
        label: '图书',
        value: 'books'
      }],
      validate: validators.required('请选择分类')
    }, {
      name: 'price',
      label: '价格',
      type: 'number',
      placeholder: '0.00',
      required: true,
      min: 0,
      step: 0.01,
      validate: validators.compose(validators.required('价格不能为空'), validators.min(0, '价格不能为负数'))
    }, {
      name: 'stock',
      label: '库存',
      type: 'number',
      placeholder: '0',
      required: true,
      min: 0,
      validate: validators.compose(validators.required('库存不能为空'), validators.min(0, '库存不能为负数'))
    }, {
      name: 'description',
      label: '产品描述',
      type: 'textarea',
      placeholder: '请输入产品描述',
      rows: 3
    }, {
      name: 'featured',
      label: '是否推荐',
      type: 'checkbox'
    }];
    const handleSubmit = async (data: ProductForm): Promise<FormSubmitResult<ProductForm>> => {
      console.log('产品数据:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(\`产品添加成功！\\n名称: \${data.name}\\n价格: ¥\${data.price}\`);
      return {
        success: true,
        data
      };
    };
    return <div style={{
      padding: '20px',
      maxWidth: '800px'
    }}>
        <h2>添加产品</h2>
        <AdvancedForm fields={fields} onSubmit={handleSubmit} layout="horizontal" submitText="添加产品" cancelText="重置" showCancelButton={true} onCancel={() => alert('取消操作')} />
      </div>;
  }
}`,...(Mt=(Ft=xe.parameters)==null?void 0:Ft.docs)==null?void 0:Mt.source}}};var xt,Vt,wt;Ve.parameters={...Ve.parameters,docs:{...(xt=Ve.parameters)==null?void 0:xt.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 行内布局

字段横向排列的紧凑布局方式。

**适用场景：** 搜索表单、筛选表单等字段较少的场景。
        \`
      }
    }
  },
  render: () => {
    interface SearchForm {
      keyword: string;
      category: string;
      dateFrom: string;
      dateTo: string;
    }
    const fields: FieldConfig<SearchForm>[] = [{
      name: 'keyword',
      label: '关键词',
      type: 'text',
      placeholder: '搜索...'
    }, {
      name: 'category',
      label: '分类',
      type: 'select',
      options: [{
        label: '全部',
        value: ''
      }, {
        label: '文章',
        value: 'article'
      }, {
        label: '视频',
        value: 'video'
      }, {
        label: '图片',
        value: 'image'
      }]
    }, {
      name: 'dateFrom',
      label: '开始日期',
      type: 'date'
    }, {
      name: 'dateTo',
      label: '结束日期',
      type: 'date'
    }];
    const handleSubmit = async (data: SearchForm): Promise<FormSubmitResult<SearchForm>> => {
      console.log('搜索条件:', data);
      alert(\`搜索中...\\n关键词: \${data.keyword || '(无)'}\\n分类: \${data.category || '全部'}\`);
      return {
        success: true,
        data
      };
    };
    return <div style={{
      padding: '20px'
    }}>
        <h2>搜索筛选</h2>
        <AdvancedForm fields={fields} onSubmit={handleSubmit} layout="inline" submitText="搜索" cancelText="重置" showCancelButton={true} onCancel={() => console.log('重置搜索')} />
      </div>;
  }
}`,...(wt=(Vt=Ve.parameters)==null?void 0:Vt.docs)==null?void 0:wt.source}}};var Tt,Et,Lt;we.parameters={...we.parameters,docs:{...(Tt=we.parameters)==null?void 0:Tt.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 单选按钮

使用单选按钮进行单项选择。

**适用场景：** 选项较少（2-5个），需要明确展示所有选项的场景。
        \`
      }
    }
  },
  render: () => {
    interface SurveyForm {
      satisfaction: string;
      recommend: string;
      feedback: string;
    }
    const fields: FieldConfig<SurveyForm>[] = [{
      name: 'satisfaction',
      label: '您对我们的服务满意吗？',
      type: 'radio',
      required: true,
      options: [{
        label: '非常满意',
        value: '5'
      }, {
        label: '满意',
        value: '4'
      }, {
        label: '一般',
        value: '3'
      }, {
        label: '不满意',
        value: '2'
      }, {
        label: '非常不满意',
        value: '1'
      }],
      validate: validators.required('请选择满意度')
    }, {
      name: 'recommend',
      label: '您是否会推荐给朋友？',
      type: 'radio',
      required: true,
      options: [{
        label: '会',
        value: 'yes'
      }, {
        label: '不会',
        value: 'no'
      }, {
        label: '不确定',
        value: 'maybe'
      }],
      validate: validators.required('请选择')
    }, {
      name: 'feedback',
      label: '其他意见或建议',
      type: 'textarea',
      placeholder: '请输入您的意见或建议',
      rows: 4
    }];
    const handleSubmit = async (data: SurveyForm): Promise<FormSubmitResult<SurveyForm>> => {
      console.log('调查问卷:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('感谢您的反馈！');
      return {
        success: true,
        data
      };
    };
    return <div style={{
      padding: '20px',
      maxWidth: '600px'
    }}>
        <h2>满意度调查</h2>
        <AdvancedForm fields={fields} onSubmit={handleSubmit} submitText="提交问卷" showCancelButton={false} />
      </div>;
  }
}`,...(Lt=(Et=we.parameters)==null?void 0:Et.docs)==null?void 0:Lt.source}}};var At,Dt,qt;Te.parameters={...Te.parameters,docs:{...(At=Te.parameters)==null?void 0:At.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 验证器组合

展示如何使用内置验证器和自定义验证器。

**内置验证器：**
- \\\`validators.required()\\\` - 必填
- \\\`validators.email()\\\` - 邮箱格式
- \\\`validators.phone()\\\` - 手机号格式
- \\\`validators.url()\\\` - URL 格式
- \\\`validators.minLength()\\\` - 最小长度
- \\\`validators.maxLength()\\\` - 最大长度
- \\\`validators.min()\\\` - 最小值
- \\\`validators.max()\\\` - 最大值
- \\\`validators.pattern()\\\` - 正则匹配
- \\\`validators.compose()\\\` - 组合多个验证器
        \`
      }
    }
  },
  render: () => {
    interface ValidationForm {
      email: string;
      phone: string;
      website: string;
      username: string;
      age: number;
    }
    const fields: FieldConfig<ValidationForm>[] = [{
      name: 'email',
      label: '邮箱地址',
      type: 'email',
      placeholder: 'example@email.com',
      required: true,
      validate: validators.compose(validators.required('邮箱不能为空'), validators.email('请输入有效的邮箱地址'))
    }, {
      name: 'phone',
      label: '手机号码',
      type: 'tel',
      placeholder: '13800138000',
      required: true,
      validate: validators.compose(validators.required('手机号不能为空'), validators.phone('请输入有效的手机号码'))
    }, {
      name: 'website',
      label: '个人网站',
      type: 'url',
      placeholder: 'https://example.com',
      validate: validators.url('请输入有效的 URL'),
      helperText: '必须以 http:// 或 https:// 开头'
    }, {
      name: 'username',
      label: '用户名',
      type: 'text',
      placeholder: '请输入用户名',
      required: true,
      validate: validators.compose(validators.required('用户名不能为空'), validators.minLength(3, '用户名至少 3 个字符'), validators.maxLength(15, '用户名最多 15 个字符'), validators.pattern(/^[a-z][a-z0-9_]*$/, '用户名必须以小写字母开头，只能包含小写字母、数字和下划线')),
      helperText: '3-15个字符，以小写字母开头'
    }, {
      name: 'age',
      label: '年龄',
      type: 'number',
      placeholder: '请输入年龄',
      required: true,
      validate: validators.compose(validators.required('年龄不能为空'), validators.min(1, '年龄必须大于 0'), validators.max(150, '年龄不能超过 150'))
    }];
    const handleSubmit = async (data: ValidationForm): Promise<FormSubmitResult<ValidationForm>> => {
      console.log('验证通过，提交数据:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('所有字段验证通过！');
      return {
        success: true,
        data
      };
    };
    return <div style={{
      padding: '20px',
      maxWidth: '600px'
    }}>
        <h2>验证器示例</h2>
        <p style={{
        color: '#666',
        marginBottom: '20px'
      }}>
          尝试输入不同的值，查看各种验证规则的效果。
        </p>
        <AdvancedForm fields={fields} onSubmit={handleSubmit} validateOnChange={true} validateOnBlur={true} showCancelButton={false} />
      </div>;
  }
}`,...(qt=(Dt=Te.parameters)==null?void 0:Dt.docs)==null?void 0:qt.source}}};var kt,It,Ct;Ee.parameters={...Ee.parameters,docs:{...(kt=Ee.parameters)==null?void 0:kt.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 禁用状态

展示表单的禁用状态，可以禁用整个表单或单个字段。
        \`
      }
    }
  },
  render: () => {
    const [isDisabled, setIsDisabled] = useState(true);
    interface ProfileForm {
      name: string;
      email: string;
      phone: string;
      address: string;
    }
    const fields: FieldConfig<ProfileForm>[] = [{
      name: 'name',
      label: '姓名',
      type: 'text',
      defaultValue: '张三'
    }, {
      name: 'email',
      label: '邮箱',
      type: 'email',
      defaultValue: 'zhangsan@example.com',
      disabled: true // 单个字段禁用
    }, {
      name: 'phone',
      label: '手机',
      type: 'tel',
      defaultValue: '13800138000'
    }, {
      name: 'address',
      label: '地址',
      type: 'textarea',
      defaultValue: '北京市朝阳区',
      rows: 2
    }];
    const handleSubmit = async (data: ProfileForm): Promise<FormSubmitResult<ProfileForm>> => {
      console.log('更新资料:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('资料更新成功！');
      setIsDisabled(true);
      return {
        success: true,
        data
      };
    };
    return <div style={{
      padding: '20px',
      maxWidth: '600px'
    }}>
        <h2>个人资料</h2>
        <div style={{
        marginBottom: '20px'
      }}>
          <button onClick={() => setIsDisabled(!isDisabled)} style={{
          padding: '8px 16px',
          background: '#1890ff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
            {isDisabled ? '编辑资料' : '取消编辑'}
          </button>
        </div>
        <AdvancedForm fields={fields} onSubmit={handleSubmit} disabled={isDisabled} initialValues={{
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        address: '北京市朝阳区'
      }} submitText="保存" cancelText="取消" showCancelButton={true} onCancel={() => setIsDisabled(true)} />
      </div>;
  }
}`,...(Ct=(It=Ee.parameters)==null?void 0:It.docs)==null?void 0:Ct.source}}};var Pt,_t,Ot;Le.parameters={...Le.parameters,docs:{...(Pt=Le.parameters)==null?void 0:Pt.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: \`
### 动态表单

根据用户选择动态显示不同的字段。
        \`
      }
    }
  },
  render: () => {
    const [userType, setUserType] = useState<string>('individual');
    interface DynamicFormData {
      userType: string;
      name: string;
      email: string;
      companyName?: string;
      taxId?: string;
      studentId?: string;
      school?: string;
    }
    const getFields = (): FieldConfig<DynamicFormData>[] => {
      const baseFields: FieldConfig<DynamicFormData>[] = [{
        name: 'userType',
        label: '用户类型',
        type: 'select',
        required: true,
        options: [{
          label: '个人用户',
          value: 'individual'
        }, {
          label: '企业用户',
          value: 'company'
        }, {
          label: '学生用户',
          value: 'student'
        }],
        defaultValue: userType
      }, {
        name: 'name',
        label: '姓名',
        type: 'text',
        placeholder: '请输入姓名',
        required: true,
        validate: validators.required('姓名不能为空')
      }, {
        name: 'email',
        label: '邮箱',
        type: 'email',
        placeholder: 'your@email.com',
        required: true,
        validate: validators.compose(validators.required('邮箱不能为空'), validators.email())
      }];
      if (userType === 'company') {
        baseFields.push({
          name: 'companyName',
          label: '公司名称',
          type: 'text',
          placeholder: '请输入公司名称',
          required: true,
          validate: validators.required('公司名称不能为空')
        }, {
          name: 'taxId',
          label: '税号',
          type: 'text',
          placeholder: '请输入税号',
          required: true,
          validate: validators.required('税号不能为空')
        });
      } else if (userType === 'student') {
        baseFields.push({
          name: 'school',
          label: '学校',
          type: 'text',
          placeholder: '请输入学校名称',
          required: true,
          validate: validators.required('学校不能为空')
        }, {
          name: 'studentId',
          label: '学号',
          type: 'text',
          placeholder: '请输入学号',
          required: true,
          validate: validators.required('学号不能为空')
        });
      }
      return baseFields;
    };
    const handleSubmit = async (data: DynamicFormData): Promise<FormSubmitResult<DynamicFormData>> => {
      setUserType(data.userType);
      console.log('提交数据:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(\`注册成功！\\n用户类型: \${data.userType === 'individual' ? '个人' : data.userType === 'company' ? '企业' : '学生'}\\n姓名: \${data.name}\`);
      return {
        success: true,
        data
      };
    };
    return <div style={{
      padding: '20px',
      maxWidth: '600px'
    }}>
        <h2>动态表单示例</h2>
        <p style={{
        color: '#666',
        marginBottom: '20px'
      }}>
          根据用户类型显示不同的字段
        </p>
        <AdvancedForm key={userType} // 重新渲染表单
      fields={getFields()} onSubmit={handleSubmit} initialValues={{
        userType
      }} showCancelButton={false} />
      </div>;
  }
}`,...(Ot=(_t=Le.parameters)==null?void 0:_t.docs)==null?void 0:Ot.source}}};const Kn=["Basic","UserRegistration","HorizontalLayout","InlineLayout","RadioButtons","ValidatorComposition","DisabledState","DynamicForm"];export{Fe as Basic,Ee as DisabledState,Le as DynamicForm,xe as HorizontalLayout,Ve as InlineLayout,we as RadioButtons,Me as UserRegistration,Te as ValidatorComposition,Kn as __namedExportsOrder,Gn as default};
