var e=()=>void 0,t=function(e){let t=[],n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)==55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)==56320?(i=65536+((i&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t},n=function(e){let t=[],n=0,r=0;for(;n<e.length;){let i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){let a=e[n++];t[r++]=String.fromCharCode((i&31)<<6|a&63)}else if(i>239&&i<365){let a=e[n++],o=e[n++],s=e[n++],c=((i&7)<<18|(a&63)<<12|(o&63)<<6|s&63)-65536;t[r++]=String.fromCharCode(55296+(c>>10)),t[r++]=String.fromCharCode(56320+(c&1023))}else{let a=e[n++],o=e[n++];t[r++]=String.fromCharCode((i&15)<<12|(a&63)<<6|o&63)}}return t.join(``)},r={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`,get ENCODED_VALS(){return this.ENCODED_VALS_BASE+`+/=`},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+`-_.`},HAS_NATIVE_SUPPORT:typeof atob==`function`,encodeByteArray(e,t){if(!Array.isArray(e))throw Error(`encodeByteArray takes an array as a parameter`);this.init_();let n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let t=0;t<e.length;t+=3){let i=e[t],a=t+1<e.length,o=a?e[t+1]:0,s=t+2<e.length,c=s?e[t+2]:0,l=i>>2,u=(i&3)<<4|o>>4,d=(o&15)<<2|c>>6,f=c&63;s||(f=64,a||(d=64)),r.push(n[l],n[u],n[d],n[f])}return r.join(``)},encodeString(e,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(e):this.encodeByteArray(t(e),n)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):n(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let t=0;t<e.length;){let a=n[e.charAt(t++)],o=t<e.length?n[e.charAt(t)]:0;++t;let s=t<e.length?n[e.charAt(t)]:64;++t;let c=t<e.length?n[e.charAt(t)]:64;if(++t,a==null||o==null||s==null||c==null)throw new i;let l=a<<2|o>>4;if(r.push(l),s!==64){let e=o<<4&240|s>>2;if(r.push(e),c!==64){let e=s<<6&192|c;r.push(e)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},i=class extends Error{constructor(){super(...arguments),this.name=`DecodeBase64StringError`}},a=function(e){let n=t(e);return r.encodeByteArray(n,!0)},o=function(e){return a(e).replace(/\./g,``)},s=function(e){try{return r.decodeString(e,!0)}catch(e){console.error(`base64Decode failed: `,e)}return null};
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function c(){if(typeof self<`u`)return self;if(typeof window<`u`)return window;if(typeof global<`u`)return global;throw Error(`Unable to locate global object.`)}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var l=()=>c().__FIREBASE_DEFAULTS__,u=()=>{if(typeof process>`u`)return;let e={}.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},d=()=>{if(typeof document>`u`)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let t=e&&s(e[1]);return t&&JSON.parse(t)},f=()=>{try{return e()||l()||u()||d()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},p=e=>f()?.emulatorHosts?.[e],m=()=>f()?.config,ee=e=>f()?.[`_${e}`],h=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e==`function`&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}};
/**
* @license
* Copyright 2025 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function te(e){try{return(e.startsWith(`http://`)||e.startsWith(`https://`)?new URL(e).hostname:e).endsWith(`.cloudworkstations.dev`)}catch{return!1}}async function ne(e){return(await fetch(e,{credentials:`include`})).ok}var re={};function ie(){let e={prod:[],emulator:[]};for(let t of Object.keys(re))re[t]?e.emulator.push(t):e.prod.push(t);return e}function ae(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement(`div`),t.setAttribute(`id`,e),n=!0),{created:n,element:t}}var oe=!1;function se(e,t){if(typeof window>`u`||typeof document>`u`||!te(window.location.host)||re[e]===t||re[e]||oe)return;re[e]=t;function n(e){return`__firebase__banner__${e}`}let r=`__firebase__banner`,i=ie().prod.length>0;function a(){let e=document.getElementById(r);e&&e.remove()}function o(e){e.style.display=`flex`,e.style.background=`#7faaf0`,e.style.position=`fixed`,e.style.bottom=`5px`,e.style.left=`5px`,e.style.padding=`.5em`,e.style.borderRadius=`5px`,e.style.alignItems=`center`}function s(e,t){e.setAttribute(`width`,`24`),e.setAttribute(`id`,t),e.setAttribute(`height`,`24`),e.setAttribute(`viewBox`,`0 0 24 24`),e.setAttribute(`fill`,`none`),e.style.marginLeft=`-6px`}function c(){let e=document.createElement(`span`);return e.style.cursor=`pointer`,e.style.marginLeft=`16px`,e.style.fontSize=`24px`,e.innerHTML=` &times;`,e.onclick=()=>{oe=!0,a()},e}function l(e,t){e.setAttribute(`id`,t),e.innerText=`Learn more`,e.href=`https://firebase.google.com/docs/studio/preview-apps#preview-backend`,e.setAttribute(`target`,`__blank`),e.style.paddingLeft=`5px`,e.style.textDecoration=`underline`}function u(){let e=ae(r),t=n(`text`),a=document.getElementById(t)||document.createElement(`span`),u=n(`learnmore`),d=document.getElementById(u)||document.createElement(`a`),f=n(`preprendIcon`),p=document.getElementById(f)||document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);if(e.created){let t=e.element;o(t),l(d,u);let n=c();s(p,f),t.append(p,a,d,n),document.body.appendChild(t)}i?(a.innerText=`Preview backend disconnected.`,p.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(p.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,a.innerText=`Preview backend running in this workspace.`),a.setAttribute(`id`,t)}document.readyState===`loading`?window.addEventListener(`DOMContentLoaded`,u):u()}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function g(){return typeof navigator<`u`&&typeof navigator.userAgent==`string`?navigator.userAgent:``}function ce(){return typeof window<`u`&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(g())}function le(){let e=f()?.forceEnvironment;if(e===`node`)return!0;if(e===`browser`)return!1;try{return Object.prototype.toString.call(global.process)===`[object process]`}catch{return!1}}function _(){return typeof navigator<`u`&&navigator.userAgent===`Cloudflare-Workers`}function ue(){let e=typeof chrome==`object`?chrome.runtime:typeof browser==`object`?browser.runtime:void 0;return typeof e==`object`&&e.id!==void 0}function de(){return typeof navigator==`object`&&navigator.product===`ReactNative`}function fe(){let e=g();return e.indexOf(`MSIE `)>=0||e.indexOf(`Trident/`)>=0}function pe(){return!le()&&!!navigator.userAgent&&navigator.userAgent.includes(`Safari`)&&!navigator.userAgent.includes(`Chrome`)}function me(){return!le()&&!!navigator.userAgent&&(navigator.userAgent.includes(`Safari`)||navigator.userAgent.includes(`WebKit`))&&!navigator.userAgent.includes(`Chrome`)}function he(){try{return typeof indexedDB==`object`}catch{return!1}}function ge(){return new Promise((e,t)=>{try{let n=!0,r=`validate-browser-context-for-indexeddb-analytics-module`,i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{t(i.error?.message||``)}}catch(e){t(e)}})}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var _e=`FirebaseError`,ve=class e extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=_e,Object.setPrototypeOf(this,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ye.prototype.create)}},ye=class{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){let n=t[0]||{},r=`${this.service}/${e}`,i=this.errors[e],a=i?be(i,n):`Error`,o=`${this.serviceName}: ${a} (${r}).`;return new ve(r,o,n)}};function be(e,t){return e.replace(xe,(e,n)=>{let r=t[n];return r==null?`<${n}?>`:String(r)})}var xe=/\{\$([^}]+)}/g;function Se(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function Ce(e,t){if(e===t)return!0;let n=Object.keys(e),r=Object.keys(t);for(let i of n){if(!r.includes(i))return!1;let n=e[i],a=t[i];if(we(n)&&we(a)){if(!Ce(n,a))return!1}else if(n!==a)return!1}for(let e of r)if(!n.includes(e))return!1;return!0}function we(e){return typeof e==`object`&&!!e}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Te(e){let t=[];for(let[n,r]of Object.entries(e))Array.isArray(r)?r.forEach(e=>{t.push(encodeURIComponent(n)+`=`+encodeURIComponent(e))}):t.push(encodeURIComponent(n)+`=`+encodeURIComponent(r));return t.length?`&`+t.join(`&`):``}function Ee(e){let t={};return e.replace(/^\?/,``).split(`&`).forEach(e=>{if(e){let[n,r]=e.split(`=`);t[decodeURIComponent(n)]=decodeURIComponent(r)}}),t}function De(e){let t=e.indexOf(`?`);if(!t)return``;let n=e.indexOf(`#`,t);return e.substring(t,n>0?n:void 0)}function Oe(e,t){let n=new ke(e,t);return n.subscribe.bind(n)}var ke=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let r;if(e===void 0&&t===void 0&&n===void 0)throw Error(`Missing Observer.`);r=Ae(e,[`next`,`error`,`complete`])?e:{next:e,error:t,complete:n},r.next===void 0&&(r.next=je),r.error===void 0&&(r.error=je),r.complete===void 0&&(r.complete=je);let i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],--this.observerCount,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(e){typeof console<`u`&&console.error&&console.error(e)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function Ae(e,t){if(typeof e!=`object`||!e)return!1;for(let n of t)if(n in e&&typeof e[n]==`function`)return!0;return!1}function je(){}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function v(e){return e&&e._delegate?e._delegate:e}var Me=class{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode=`LAZY`,this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}},Ne=`[DEFAULT]`,Pe=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new h;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){let t=this.normalizeInstanceIdentifier(e?.identifier),n=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(e){if(n)return null;throw e}else if(n)return null;else throw Error(`Service ${this.name} is not available`)}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(Ie(e))try{this.getOrInitializeService({instanceIdentifier:Ne})}catch{}for(let[e,t]of this.instancesDeferred.entries()){let n=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:n});t.resolve(e)}catch{}}}}clearInstance(e=Ne){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>`INTERNAL`in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>`_delete`in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ne){return this.instances.has(e)}getOptions(e=Ne){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(let[e,t]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(e);n===i&&t.resolve(r)}return r}onInit(e,t){let n=this.normalizeInstanceIdentifier(t),r=this.onInitCallbacks.get(n)??new Set;r.add(e),this.onInitCallbacks.set(n,r);let i=this.instances.get(n);return i&&e(i,n),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){let n=this.onInitCallbacks.get(t);if(n)for(let r of n)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:Fe(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=Ne){return this.component?this.component.multipleInstances?e:Ne:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!==`EXPLICIT`}};function Fe(e){return e===Ne?void 0:e}function Ie(e){return e.instantiationMode===`EAGER`}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var y=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Pe(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}},Le=[],b;(function(e){e[e.DEBUG=0]=`DEBUG`,e[e.VERBOSE=1]=`VERBOSE`,e[e.INFO=2]=`INFO`,e[e.WARN=3]=`WARN`,e[e.ERROR=4]=`ERROR`,e[e.SILENT=5]=`SILENT`})(b||={});var Re={debug:b.DEBUG,verbose:b.VERBOSE,info:b.INFO,warn:b.WARN,error:b.ERROR,silent:b.SILENT},ze=b.INFO,Be={[b.DEBUG]:`log`,[b.VERBOSE]:`log`,[b.INFO]:`info`,[b.WARN]:`warn`,[b.ERROR]:`error`},Ve=(e,t,...n)=>{if(t<e.logLevel)return;let r=new Date().toISOString(),i=Be[t];if(i)console[i](`[${r}]  ${e.name}:`,...n);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)},He=class{constructor(e){this.name=e,this._logLevel=ze,this._logHandler=Ve,this._userLogHandler=null,Le.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in b))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e==`string`?Re[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!=`function`)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,b.DEBUG,...e),this._logHandler(this,b.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,b.VERBOSE,...e),this._logHandler(this,b.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,b.INFO,...e),this._logHandler(this,b.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,b.WARN,...e),this._logHandler(this,b.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,b.ERROR,...e),this._logHandler(this,b.ERROR,...e)}},Ue=(e,t)=>t.some(t=>e instanceof t),We,Ge;function Ke(){return We||=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]}function qe(){return Ge||=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey]}var Je=new WeakMap,Ye=new WeakMap,Xe=new WeakMap,Ze=new WeakMap,Qe=new WeakMap;function $e(e){let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`success`,i),e.removeEventListener(`error`,a)},i=()=>{t(at(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener(`success`,i),e.addEventListener(`error`,a)});return t.then(t=>{t instanceof IDBCursor&&Je.set(t,e)}).catch(()=>{}),Qe.set(t,e),t}function et(e){if(Ye.has(e))return;let t=new Promise((t,n)=>{let r=()=>{e.removeEventListener(`complete`,i),e.removeEventListener(`error`,a),e.removeEventListener(`abort`,a)},i=()=>{t(),r()},a=()=>{n(e.error||new DOMException(`AbortError`,`AbortError`)),r()};e.addEventListener(`complete`,i),e.addEventListener(`error`,a),e.addEventListener(`abort`,a)});Ye.set(e,t)}var tt={get(e,t,n){if(e instanceof IDBTransaction){if(t===`done`)return Ye.get(e);if(t===`objectStoreNames`)return e.objectStoreNames||Xe.get(e);if(t===`store`)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return at(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t===`done`||t===`store`)?!0:t in e}};function nt(e){tt=e(tt)}function rt(e){return e===IDBDatabase.prototype.transaction&&!(`objectStoreNames`in IDBTransaction.prototype)?function(t,...n){let r=e.call(ot(this),t,...n);return Xe.set(r,t.sort?t.sort():[t]),at(r)}:qe().includes(e)?function(...t){return e.apply(ot(this),t),at(Je.get(this))}:function(...t){return at(e.apply(ot(this),t))}}function it(e){return typeof e==`function`?rt(e):(e instanceof IDBTransaction&&et(e),Ue(e,Ke())?new Proxy(e,tt):e)}function at(e){if(e instanceof IDBRequest)return $e(e);if(Ze.has(e))return Ze.get(e);let t=it(e);return t!==e&&(Ze.set(e,t),Qe.set(t,e)),t}var ot=e=>Qe.get(e);function st(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){let o=indexedDB.open(e,t),s=at(o);return r&&o.addEventListener(`upgradeneeded`,e=>{r(at(o.result),e.oldVersion,e.newVersion,at(o.transaction),e)}),n&&o.addEventListener(`blocked`,e=>n(e.oldVersion,e.newVersion,e)),s.then(e=>{a&&e.addEventListener(`close`,()=>a()),i&&e.addEventListener(`versionchange`,e=>i(e.oldVersion,e.newVersion,e))}).catch(()=>{}),s}var ct=[`get`,`getKey`,`getAll`,`getAllKeys`,`count`],lt=[`put`,`add`,`delete`,`clear`],ut=new Map;function dt(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t==`string`))return;if(ut.get(t))return ut.get(t);let n=t.replace(/FromIndex$/,``),r=t!==n,i=lt.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||ct.includes(n)))return;let a=async function(e,...t){let a=this.transaction(e,i?`readwrite`:`readonly`),o=a.store;return r&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&a.done]))[0]};return ut.set(t,a),a}nt(e=>({...e,get:(t,n,r)=>dt(t,n)||e.get(t,n,r),has:(t,n)=>!!dt(t,n)||e.has(t,n)}));
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ft=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(pt(e)){let t=e.getImmediate();return`${t.library}/${t.version}`}else return null}).filter(e=>e).join(` `)}};function pt(e){return e.getComponent()?.type===`VERSION`}var mt=`@firebase/app`,ht=`0.14.5`,gt=new He(`@firebase/app`),_t=`@firebase/app-compat`,vt=`@firebase/analytics-compat`,yt=`@firebase/analytics`,bt=`@firebase/app-check-compat`,xt=`@firebase/app-check`,St=`@firebase/auth`,Ct=`@firebase/auth-compat`,wt=`@firebase/database`,Tt=`@firebase/data-connect`,Et=`@firebase/database-compat`,Dt=`@firebase/functions`,Ot=`@firebase/functions-compat`,kt=`@firebase/installations`,At=`@firebase/installations-compat`,jt=`@firebase/messaging`,Mt=`@firebase/messaging-compat`,Nt=`@firebase/performance`,Pt=`@firebase/performance-compat`,Ft=`@firebase/remote-config`,It=`@firebase/remote-config-compat`,Lt=`@firebase/storage`,Rt=`@firebase/storage-compat`,zt=`@firebase/firestore`,Bt=`@firebase/ai`,Vt=`@firebase/firestore-compat`,Ht=`firebase`,Ut=`12.5.0`,Wt=`[DEFAULT]`,Gt={[mt]:`fire-core`,[_t]:`fire-core-compat`,[yt]:`fire-analytics`,[vt]:`fire-analytics-compat`,[xt]:`fire-app-check`,[bt]:`fire-app-check-compat`,[St]:`fire-auth`,[Ct]:`fire-auth-compat`,[wt]:`fire-rtdb`,[Tt]:`fire-data-connect`,[Et]:`fire-rtdb-compat`,[Dt]:`fire-fn`,[Ot]:`fire-fn-compat`,[kt]:`fire-iid`,[At]:`fire-iid-compat`,[jt]:`fire-fcm`,[Mt]:`fire-fcm-compat`,[Nt]:`fire-perf`,[Pt]:`fire-perf-compat`,[Ft]:`fire-rc`,[It]:`fire-rc-compat`,[Lt]:`fire-gcs`,[Rt]:`fire-gcs-compat`,[zt]:`fire-fst`,[Vt]:`fire-fst-compat`,[Bt]:`fire-vertex`,"fire-js":`fire-js`,[Ht]:`fire-js-all`},Kt=new Map,qt=new Map,Jt=new Map;function x(e,t){try{e.container.addComponent(t)}catch(n){gt.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Yt(e){let t=e.name;if(Jt.has(t))return gt.debug(`There were multiple attempts to register component ${t}.`),!1;Jt.set(t,e);for(let t of Kt.values())x(t,e);for(let t of qt.values())x(t,e);return!0}function Xt(e,t){let n=e.container.getProvider(`heartbeat`).getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function Zt(e){return e==null?!1:e.settings!==void 0}var Qt=new ye(`app`,`Firebase`,{"no-app":`No Firebase App '{$appName}' has been created - call initializeApp() first`,"bad-app-name":`Illegal App name: '{$appName}'`,"duplicate-app":`Firebase App named '{$appName}' already exists with different options or config`,"app-deleted":`Firebase App named '{$appName}' already deleted`,"server-app-deleted":`Firebase Server App has been deleted`,"no-options":`Need to provide options, when not being deployed to hosting via source.`,"invalid-app-argument":`firebase.{$appName}() takes either no argument or a Firebase App instance.`,"invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":`Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.`,"idb-get":`Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.`,"idb-set":`Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.`,"idb-delete":`Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.`,"finalization-registry-not-supported":`FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.`,"invalid-server-app-environment":`FirebaseServerApp is not for use in browser environments.`}),$t=class{constructor(e,t,n){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Me(`app`,()=>this,`PUBLIC`))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Qt.create(`app-deleted`,{appName:this._name})}},en=Ut;function tn(e,t={}){let n=e;typeof t!=`object`&&(t={name:t});let r={name:Wt,automaticDataCollectionEnabled:!0,...t},i=r.name;if(typeof i!=`string`||!i)throw Qt.create(`bad-app-name`,{appName:String(i)});if(n||=m(),!n)throw Qt.create(`no-options`);let a=Kt.get(i);if(a){if(Ce(n,a.options)&&Ce(r,a.config))return a;throw Qt.create(`duplicate-app`,{appName:i})}let o=new y(i);for(let e of Jt.values())o.addComponent(e);let s=new $t(n,r,o);return Kt.set(i,s),s}function nn(e=Wt){let t=Kt.get(e);if(!t&&e===`[DEFAULT]`&&m())return tn();if(!t)throw Qt.create(`no-app`,{appName:e});return t}function rn(e,t,n){let r=Gt[e]??e;n&&(r+=`-${n}`);let i=r.match(/\s|\//),a=t.match(/\s|\//);if(i||a){let e=[`Unable to register library "${r}" with version "${t}":`];i&&e.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&a&&e.push(`and`),a&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),gt.warn(e.join(` `));return}Yt(new Me(`${r}-version`,()=>({library:r,version:t}),`VERSION`))}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var an=`firebase-heartbeat-database`,on=1,sn=`firebase-heartbeat-store`,cn=null;function ln(){return cn||=st(an,on,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(sn)}catch(e){console.warn(e)}}}}).catch(e=>{throw Qt.create(`idb-open`,{originalErrorMessage:e.message})}),cn}async function un(e){try{let t=(await ln()).transaction(sn),n=await t.objectStore(sn).get(fn(e));return await t.done,n}catch(e){if(e instanceof ve)gt.warn(e.message);else{let t=Qt.create(`idb-get`,{originalErrorMessage:e?.message});gt.warn(t.message)}}}async function dn(e,t){try{let n=(await ln()).transaction(sn,`readwrite`);await n.objectStore(sn).put(t,fn(e)),await n.done}catch(e){if(e instanceof ve)gt.warn(e.message);else{let t=Qt.create(`idb-set`,{originalErrorMessage:e?.message});gt.warn(t.message)}}}function fn(e){return`${e.name}!${e.options.appId}`}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var pn=1024,mn=30,hn=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider(`app`).getImmediate();this._storage=new vn(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){try{let e=this.container.getProvider(`platform-logger`).getImmediate().getPlatformInfoString(),t=gn();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===t||this._heartbeatsCache.heartbeats.some(e=>e.date===t))return;if(this._heartbeatsCache.heartbeats.push({date:t,agent:e}),this._heartbeatsCache.heartbeats.length>mn){let e=bn(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){gt.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return``;let e=gn(),{heartbeatsToSend:t,unsentEntries:n}=_n(this._heartbeatsCache.heartbeats),r=o(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(e){return gt.warn(e),``}}};function gn(){return new Date().toISOString().substring(0,10)}function _n(e,t=pn){let n=[],r=e.slice();for(let i of e){let e=n.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),yn(n)>t){e.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),yn(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}var vn=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return he()?ge().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let e=await un(this.app);return e?.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let t=await this.read();return dn(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let t=await this.read();return dn(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}else return}};function yn(e){return o(JSON.stringify({version:2,heartbeats:e})).length}function bn(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function xn(e){Yt(new Me(`platform-logger`,e=>new ft(e),`PRIVATE`)),Yt(new Me(`heartbeat`,e=>new hn(e),`PRIVATE`)),rn(mt,ht,e),rn(mt,ht,`esm2020`),rn(`fire-js`,``)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
xn(``),rn(`firebase`,`12.5.0`,`app`);function Sn(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var Cn=Sn,wn=new ye(`auth`,`Firebase`,Sn()),S=new He(`@firebase/auth`);function Tn(e,...t){S.logLevel<=b.WARN&&S.warn(`Auth (${en}): ${e}`,...t)}function En(e,...t){S.logLevel<=b.ERROR&&S.error(`Auth (${en}): ${e}`,...t)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Dn(e,...t){throw jn(e,...t)}function On(e,...t){return jn(e,...t)}function kn(e,t,n){let r={...Cn(),[t]:n};return new ye(`auth`,`Firebase`,r).create(t,{appName:e.name})}function An(e){return kn(e,`operation-not-supported-in-this-environment`,`Operations that alter the current user are not supported in conjunction with FirebaseServerApp`)}function jn(e,...t){if(typeof e!=`string`){let n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return wn.create(e,...t)}function C(e,t,...n){if(!e)throw jn(t,...n)}function Mn(e){let t=`INTERNAL ASSERTION FAILED: `+e;throw En(t),Error(t)}function Nn(e,t){e||Mn(t)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Pn(){return typeof self<`u`&&self.location?.href||``}function Fn(){return In()===`http:`||In()===`https:`}function In(){return typeof self<`u`&&self.location?.protocol||null}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Ln(){return typeof navigator<`u`&&navigator&&`onLine`in navigator&&typeof navigator.onLine==`boolean`&&(Fn()||ue()||`connection`in navigator)?navigator.onLine:!0}function Rn(){if(typeof navigator>`u`)return null;let e=navigator;return e.languages&&e.languages[0]||e.language||null}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var zn=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,Nn(t>e,`Short delay should be less than long delay!`),this.isMobile=ce()||de()}get(){return Ln()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Bn(e,t){Nn(e.emulator,`Emulator should always be set here`);let{url:n}=e.emulator;return t?`${n}${t.startsWith(`/`)?t.slice(1):t}`:n}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Vn=class{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<`u`&&`fetch`in self)return self.fetch;if(typeof globalThis<`u`&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<`u`)return fetch;Mn(`Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill`)}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<`u`&&`Headers`in self)return self.Headers;if(typeof globalThis<`u`&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<`u`)return Headers;Mn(`Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill`)}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<`u`&&`Response`in self)return self.Response;if(typeof globalThis<`u`&&globalThis.Response)return globalThis.Response;if(typeof Response<`u`)return Response;Mn(`Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill`)}},Hn={CREDENTIAL_MISMATCH:`custom-token-mismatch`,MISSING_CUSTOM_TOKEN:`internal-error`,INVALID_IDENTIFIER:`invalid-email`,MISSING_CONTINUE_URI:`internal-error`,INVALID_PASSWORD:`wrong-password`,MISSING_PASSWORD:`missing-password`,INVALID_LOGIN_CREDENTIALS:`invalid-credential`,EMAIL_EXISTS:`email-already-in-use`,PASSWORD_LOGIN_DISABLED:`operation-not-allowed`,INVALID_IDP_RESPONSE:`invalid-credential`,INVALID_PENDING_TOKEN:`invalid-credential`,FEDERATED_USER_ID_ALREADY_LINKED:`credential-already-in-use`,MISSING_REQ_TYPE:`internal-error`,EMAIL_NOT_FOUND:`user-not-found`,RESET_PASSWORD_EXCEED_LIMIT:`too-many-requests`,EXPIRED_OOB_CODE:`expired-action-code`,INVALID_OOB_CODE:`invalid-action-code`,MISSING_OOB_CODE:`internal-error`,CREDENTIAL_TOO_OLD_LOGIN_AGAIN:`requires-recent-login`,INVALID_ID_TOKEN:`invalid-user-token`,TOKEN_EXPIRED:`user-token-expired`,USER_NOT_FOUND:`user-token-expired`,TOO_MANY_ATTEMPTS_TRY_LATER:`too-many-requests`,PASSWORD_DOES_NOT_MEET_REQUIREMENTS:`password-does-not-meet-requirements`,INVALID_CODE:`invalid-verification-code`,INVALID_SESSION_INFO:`invalid-verification-id`,INVALID_TEMPORARY_PROOF:`invalid-credential`,MISSING_SESSION_INFO:`missing-verification-id`,SESSION_EXPIRED:`code-expired`,MISSING_ANDROID_PACKAGE_NAME:`missing-android-pkg-name`,UNAUTHORIZED_DOMAIN:`unauthorized-continue-uri`,INVALID_OAUTH_CLIENT_ID:`invalid-oauth-client-id`,ADMIN_ONLY_OPERATION:`admin-restricted-operation`,INVALID_MFA_PENDING_CREDENTIAL:`invalid-multi-factor-session`,MFA_ENROLLMENT_NOT_FOUND:`multi-factor-info-not-found`,MISSING_MFA_ENROLLMENT_ID:`missing-multi-factor-info`,MISSING_MFA_PENDING_CREDENTIAL:`missing-multi-factor-session`,SECOND_FACTOR_EXISTS:`second-factor-already-in-use`,SECOND_FACTOR_LIMIT_EXCEEDED:`maximum-second-factor-count-exceeded`,BLOCKING_FUNCTION_ERROR_RESPONSE:`internal-error`,RECAPTCHA_NOT_ENABLED:`recaptcha-not-enabled`,MISSING_RECAPTCHA_TOKEN:`missing-recaptcha-token`,INVALID_RECAPTCHA_TOKEN:`invalid-recaptcha-token`,INVALID_RECAPTCHA_ACTION:`invalid-recaptcha-action`,MISSING_CLIENT_TYPE:`missing-client-type`,MISSING_RECAPTCHA_VERSION:`missing-recaptcha-version`,INVALID_RECAPTCHA_VERSION:`invalid-recaptcha-version`,INVALID_REQ_TYPE:`invalid-req-type`},Un=[`/v1/accounts:signInWithCustomToken`,`/v1/accounts:signInWithEmailLink`,`/v1/accounts:signInWithIdp`,`/v1/accounts:signInWithPassword`,`/v1/accounts:signInWithPhoneNumber`,`/v1/token`],Wn=new zn(3e4,6e4);function w(e,t){return e.tenantId&&!t.tenantId?{...t,tenantId:e.tenantId}:t}async function T(e,t,n,r,i={}){return Gn(e,i,async()=>{let i={},a={};r&&(t===`GET`?a=r:i={body:JSON.stringify(r)});let o=Te({key:e.config.apiKey,...a}).slice(1),s=await e._getAdditionalHeaders();s[`Content-Type`]=`application/json`,e.languageCode&&(s[`X-Firebase-Locale`]=e.languageCode);let c={method:t,headers:s,...i};return _()||(c.referrerPolicy=`no-referrer`),e.emulatorConfig&&te(e.emulatorConfig.host)&&(c.credentials=`include`),Vn.fetch()(await qn(e,e.config.apiHost,n,o),c)})}async function Gn(e,t,n){e._canInitEmulator=!1;let r={...Hn,...t};try{let t=new Yn(e),i=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();let a=await i.json();if(`needConfirmation`in a)throw Xn(e,`account-exists-with-different-credential`,a);if(i.ok&&!(`errorMessage`in a))return a;{let[t,n]=(i.ok?a.errorMessage:a.error.message).split(` : `);if(t===`FEDERATED_USER_ID_ALREADY_LINKED`)throw Xn(e,`credential-already-in-use`,a);if(t===`EMAIL_EXISTS`)throw Xn(e,`email-already-in-use`,a);if(t===`USER_DISABLED`)throw Xn(e,`user-disabled`,a);let o=r[t]||t.toLowerCase().replace(/[_\s]+/g,`-`);if(n)throw kn(e,o,n);Dn(e,o)}}catch(t){if(t instanceof ve)throw t;Dn(e,`network-request-failed`,{message:String(t)})}}async function Kn(e,t,n,r,i={}){let a=await T(e,t,n,r,i);return`mfaPendingCredential`in a&&Dn(e,`multi-factor-auth-required`,{_serverResponse:a}),a}async function qn(e,t,n,r){let i=`${t}${n}?${r}`,a=e,o=a.config.emulator?Bn(e.config,i):`${e.config.apiScheme}://${i}`;return Un.includes(n)&&(await a._persistenceManagerAvailable,a._getPersistenceType()===`COOKIE`)?a._getPersistence()._getFinalTarget(o).toString():o}function Jn(e){switch(e){case`ENFORCE`:return`ENFORCE`;case`AUDIT`:return`AUDIT`;case`OFF`:return`OFF`;default:return`ENFORCEMENT_STATE_UNSPECIFIED`}}var Yn=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(On(this.auth,`network-request-failed`)),Wn.get())})}};function Xn(e,t,n){let r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);let i=On(e,t,r);return i.customData._tokenResponse=n,i}function Zn(e){return e!==void 0&&e.enterprise!==void 0}var Qn=class{constructor(e){if(this.siteKey=``,this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw Error(`recaptchaKey undefined`);this.siteKey=e.recaptchaKey.split(`/`)[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Jn(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)===`ENFORCE`||this.getProviderEnforcementState(e)===`AUDIT`}isAnyProviderEnabled(){return this.isProviderEnabled(`EMAIL_PASSWORD_PROVIDER`)||this.isProviderEnabled(`PHONE_PROVIDER`)}};async function $n(e,t){return T(e,`GET`,`/v2/recaptchaConfig`,w(e,t))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function er(e,t){return T(e,`POST`,`/v1/accounts:delete`,t)}async function tr(e,t){return T(e,`POST`,`/v1/accounts:lookup`,t)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function nr(e){if(e)try{let t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function rr(e,t=!1){let n=v(e),r=await n.getIdToken(t),i=ar(r);C(i&&i.exp&&i.auth_time&&i.iat,n.auth,`internal-error`);let a=typeof i.firebase==`object`?i.firebase:void 0,o=a?.sign_in_provider;return{claims:i,token:r,authTime:nr(ir(i.auth_time)),issuedAtTime:nr(ir(i.iat)),expirationTime:nr(ir(i.exp)),signInProvider:o||null,signInSecondFactor:a?.sign_in_second_factor||null}}function ir(e){return Number(e)*1e3}function ar(e){let[t,n,r]=e.split(`.`);if(t===void 0||n===void 0||r===void 0)return En(`JWT malformed, contained fewer than 3 sections`),null;try{let e=s(n);return e?JSON.parse(e):(En(`Failed to decode base64 JWT payload`),null)}catch(e){return En(`Caught error parsing JWT payload as JSON`,e?.toString()),null}}function or(e){let t=ar(e);return C(t,`internal-error`),C(t.exp!==void 0,`internal-error`),C(t.iat!==void 0,`internal-error`),Number(t.exp)-Number(t.iat)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function sr(e,t,n=!1){if(n)return t;try{return await t}catch(t){throw t instanceof ve&&cr(t)&&e.auth.currentUser===e&&await e.auth.signOut(),t}}function cr({code:e}){return e===`auth/user-disabled`||e===`auth/user-token-expired`}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var lr=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){let e=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),e}else{this.errorBackoff=3e4;let e=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code===`auth/network-request-failed`&&this.schedule(!0);return}this.schedule()}},ur=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=nr(this.lastLoginAt),this.creationTime=nr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function dr(e){let t=e.auth,n=await e.getIdToken(),r=await sr(e,tr(t,{idToken:n}));C(r?.users.length,t,`internal-error`);let i=r.users[0];e._notifyReloadListener(i);let a=i.providerUserInfo?.length?mr(i.providerUserInfo):[],o=pr(e.providerData,a),s=e.isAnonymous,c=!(e.email&&i.passwordHash)&&!o?.length,l=s?c:!1,u={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new ur(i.createdAt,i.lastLoginAt),isAnonymous:l};Object.assign(e,u)}async function fr(e){let t=v(e);await dr(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function pr(e,t){return[...e.filter(e=>!t.some(t=>t.providerId===e.providerId)),...t]}function mr(e){return e.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||``,displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function hr(e,t){let n=await Gn(e,{},async()=>{let n=Te({grant_type:`refresh_token`,refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:i}=e.config,a=await qn(e,r,`/v1/token`,`key=${i}`),o=await e._getAdditionalHeaders();o[`Content-Type`]=`application/x-www-form-urlencoded`;let s={method:`POST`,headers:o,body:n};return e.emulatorConfig&&te(e.emulatorConfig.host)&&(s.credentials=`include`),Vn.fetch()(a,s)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function gr(e,t){return T(e,`POST`,`/v2/accounts:revokeToken`,w(e,t))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var _r=class e{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){C(e.idToken,`internal-error`),C(e.idToken!==void 0,`internal-error`),C(e.refreshToken!==void 0,`internal-error`);let t=`expiresIn`in e&&e.expiresIn!==void 0?Number(e.expiresIn):or(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){C(e.length!==0,`internal-error`);let t=or(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(C(this.refreshToken,e,`user-token-expired`),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:n,refreshToken:r,expiresIn:i}=await hr(e,t);this.updateTokensAndExpiration(n,r,Number(i))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(t,n){let{refreshToken:r,accessToken:i,expirationTime:a}=n,o=new e;return r&&(C(typeof r==`string`,`internal-error`,{appName:t}),o.refreshToken=r),i&&(C(typeof i==`string`,`internal-error`,{appName:t}),o.accessToken=i),a&&(C(typeof a==`number`,`internal-error`,{appName:t}),o.expirationTime=a),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new e,this.toJSON())}_performRefresh(){return Mn(`not implemented`)}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function vr(e,t){C(typeof e==`string`||e===void 0,`internal-error`,{appName:t})}var yr=class e{constructor({uid:e,auth:t,stsTokenManager:n,...r}){this.providerId=`firebase`,this.proactiveRefresh=new lr(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=r.displayName||null,this.email=r.email||null,this.emailVerified=r.emailVerified||!1,this.phoneNumber=r.phoneNumber||null,this.photoURL=r.photoURL||null,this.isAnonymous=r.isAnonymous||!1,this.tenantId=r.tenantId||null,this.providerData=r.providerData?[...r.providerData]:[],this.metadata=new ur(r.createdAt||void 0,r.lastLoginAt||void 0)}async getIdToken(e){let t=await sr(this,this.stsTokenManager.getToken(this.auth,e));return C(t,this.auth,`internal-error`),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return rr(this,e)}reload(){return fr(this)}_assign(e){this!==e&&(C(this.uid===e.uid,this.auth,`internal-error`),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>({...e})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(t){let n=new e({...this,auth:t,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(e){C(!this.reloadListener,this.auth,`internal-error`),this.reloadListener=e,this.reloadUserInfo&&=(this._notifyReloadListener(this.reloadUserInfo),null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await dr(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Zt(this.auth.app))return Promise.reject(An(this.auth));let e=await this.getIdToken();return await sr(this,er(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||``}static _fromJSON(t,n){let r=n.displayName??void 0,i=n.email??void 0,a=n.phoneNumber??void 0,o=n.photoURL??void 0,s=n.tenantId??void 0,c=n._redirectEventId??void 0,l=n.createdAt??void 0,u=n.lastLoginAt??void 0,{uid:d,emailVerified:f,isAnonymous:p,providerData:m,stsTokenManager:ee}=n;C(d&&ee,t,`internal-error`);let h=_r.fromJSON(this.name,ee);C(typeof d==`string`,t,`internal-error`),vr(r,t.name),vr(i,t.name),C(typeof f==`boolean`,t,`internal-error`),C(typeof p==`boolean`,t,`internal-error`),vr(a,t.name),vr(o,t.name),vr(s,t.name),vr(c,t.name),vr(l,t.name),vr(u,t.name);let te=new e({uid:d,auth:t,email:i,emailVerified:f,displayName:r,isAnonymous:p,photoURL:o,phoneNumber:a,tenantId:s,stsTokenManager:h,createdAt:l,lastLoginAt:u});return m&&Array.isArray(m)&&(te.providerData=m.map(e=>({...e}))),c&&(te._redirectEventId=c),te}static async _fromIdTokenResponse(t,n,r=!1){let i=new _r;i.updateFromServerResponse(n);let a=new e({uid:n.localId,auth:t,stsTokenManager:i,isAnonymous:r});return await dr(a),a}static async _fromGetAccountInfoResponse(t,n,r){let i=n.users[0];C(i.localId!==void 0,`internal-error`);let a=i.providerUserInfo===void 0?[]:mr(i.providerUserInfo),o=!(i.email&&i.passwordHash)&&!a?.length,s=new _r;s.updateFromIdToken(r);let c=new e({uid:i.localId,auth:t,stsTokenManager:s,isAnonymous:o}),l={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new ur(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!a?.length};return Object.assign(c,l),c}},br=new Map;function xr(e){Nn(e instanceof Function,`Expected a class definition`);let t=br.get(e);return t?(Nn(t instanceof e,`Instance stored in cache mismatched with class`),t):(t=new e,br.set(e,t),t)}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Sr=class{constructor(){this.type=`NONE`,this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};Sr.type=`NONE`;var Cr=Sr;
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function wr(e,t,n){return`firebase:${e}:${t}:${n}`}var Tr=class e{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;let{config:r,name:i}=this.auth;this.fullUserKey=wr(this.userKey,r.apiKey,i),this.fullPersistenceKey=wr(`persistence`,r.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e==`string`){let t=await tr(this.auth,{idToken:e}).catch(()=>void 0);return t?yr._fromGetAccountInfoResponse(this.auth,t,e):null}return yr._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,n,r=`authUser`){if(!n.length)return new e(xr(Cr),t,r);let i=(await Promise.all(n.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e),a=i[0]||xr(Cr),o=wr(r,t.config.apiKey,t.name),s=null;for(let e of n)try{let n=await e._get(o);if(n){let r;if(typeof n==`string`){let e=await tr(t,{idToken:n}).catch(()=>void 0);if(!e)break;r=await yr._fromGetAccountInfoResponse(t,e,n)}else r=yr._fromJSON(t,n);e!==a&&(s=r),a=e;break}}catch{}let c=i.filter(e=>e._shouldAllowMigration);return!a._shouldAllowMigration||!c.length?new e(a,t,r):(a=c[0],s&&await a._set(o,s.toJSON()),await Promise.all(n.map(async e=>{if(e!==a)try{await e._remove(o)}catch{}})),new e(a,t,r))}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Er(e){let t=e.toLowerCase();if(t.includes(`opera/`)||t.includes(`opr/`)||t.includes(`opios/`))return`Opera`;if(Ar(t))return`IEMobile`;if(t.includes(`msie`)||t.includes(`trident/`))return`IE`;if(t.includes(`edge/`))return`Edge`;if(Dr(t))return`Firefox`;if(t.includes(`silk/`))return`Silk`;if(Mr(t))return`Blackberry`;if(Nr(t))return`Webos`;if(Or(t))return`Safari`;if((t.includes(`chrome/`)||kr(t))&&!t.includes(`edge/`))return`Chrome`;if(jr(t))return`Android`;{let t=e.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);if(t?.length===2)return t[1]}return`Other`}function Dr(e=g()){return/firefox\//i.test(e)}function Or(e=g()){let t=e.toLowerCase();return t.includes(`safari/`)&&!t.includes(`chrome/`)&&!t.includes(`crios/`)&&!t.includes(`android`)}function kr(e=g()){return/crios\//i.test(e)}function Ar(e=g()){return/iemobile/i.test(e)}function jr(e=g()){return/android/i.test(e)}function Mr(e=g()){return/blackberry/i.test(e)}function Nr(e=g()){return/webos/i.test(e)}function Pr(e=g()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function Fr(e=g()){return Pr(e)&&!!window.navigator?.standalone}function Ir(){return fe()&&document.documentMode===10}function Lr(e=g()){return Pr(e)||jr(e)||Nr(e)||Mr(e)||/windows phone/i.test(e)||Ar(e)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Rr(e,t=[]){let n;switch(e){case`Browser`:n=Er(g());break;case`Worker`:n=`${Er(g())}-${e}`;break;default:n=e}let r=t.length?t.join(`,`):`FirebaseCore-web`;return`${n}/JsCore/${en}/${r}`}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var zr=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let n=t=>new Promise((n,r)=>{try{let r=e(t);n(r)}catch(e){r(e)}});n.onAbort=t,this.queue.push(n);let r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(e){t.reverse();for(let e of t)try{e()}catch{}throw this.auth._errorFactory.create(`login-blocked`,{originalMessage:e?.message})}}};
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function Br(e,t={}){return T(e,`GET`,`/v2/passwordPolicy`,w(e,t))}
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Vr=6,Hr=class{constructor(e){let t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??Vr,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState===`ENFORCEMENT_STATE_UNSPECIFIED`&&(this.enforcementState=`OFF`),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join(``)??``,this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){let t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&=t.meetsMinPasswordLength??!0,t.isValid&&=t.meetsMaxPasswordLength??!0,t.isValid&&=t.containsLowercaseLetter??!0,t.isValid&&=t.containsUppercaseLetter??!0,t.isValid&&=t.containsNumericCharacter??!0,t.isValid&&=t.containsNonAlphanumericCharacter??!0,t}validatePasswordLengthOptions(e,t){let n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>=`a`&&n<=`z`,n>=`A`&&n<=`Z`,n>=`0`&&n<=`9`,this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||=t),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||=n),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||=r),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||=i)}},Ur=class{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Gr(this),this.idTokenSubscription=new Gr(this),this.beforeStateQueue=new zr(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=wn,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(e=>this._resolvePersistenceManagerAvailable=e)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=xr(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await Tr.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await tr(this,{idToken:e}),n=await yr._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(e){console.warn(`FirebaseServerApp could not login user with provided authIdToken: `,e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(Zt(this.app)){let e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}let t=await this.assertedPersistence.getCurrentUser(),n=t,r=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let t=this.redirectUser?._redirectEventId,i=n?._redirectEventId,a=await this.tryRedirectSignIn(e);(!t||t===i)&&a?.user&&(n=a.user,r=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(r)try{await this.beforeStateQueue.runMiddleware(n)}catch(e){n=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(e))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return C(this._popupRedirectResolver,this,`argument-error`),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await dr(e)}catch(e){if(e?.code!==`auth/network-request-failed`)return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Rn()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Zt(this.app))return Promise.reject(An(this));let t=e?v(e):null;return t&&C(t.auth.config.apiKey===this.config.apiKey,this,`invalid-user-token`),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&C(this.tenantId===e.tenantId,this,`tenant-id-mismatch`),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Zt(this.app)?Promise.reject(An(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Zt(this.app)?Promise.reject(An(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(xr(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion===this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?t.validatePassword(e):Promise.reject(this._errorFactory.create(`unsupported-password-policy-schema-version`,{}))}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await Br(this),t=new Hr(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ye(`auth`,`Firebase`,e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),n={providerId:`apple.com`,tokenType:`ACCESS_TOKEN`,token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await gr(this,n)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){let n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&xr(e)||this._popupRedirectResolver;C(t,this,`argument-error`),this.redirectPersistenceManager=await Tr.create(this,[xr(t._redirectPersistence)],`redirectUser`),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};let i=typeof t==`function`?t:t.next.bind(t),a=!1,o=this._isInitialized?Promise.resolve():this._initializationPromise;if(C(o,this,`internal-error`),o.then(()=>{a||i(this.currentUser)}),typeof t==`function`){let i=e.addObserver(t,n,r);return()=>{a=!0,i()}}else{let n=e.addObserver(t);return()=>{a=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return C(this.persistenceManager,this,`internal-error`),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Rr(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){let e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e[`X-Firebase-gmpid`]=this.app.options.appId);let t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e[`X-Firebase-Client`]=t);let n=await this._getAppCheckToken();return n&&(e[`X-Firebase-AppCheck`]=n),e}async _getAppCheckToken(){if(Zt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&Tn(`Error while retrieving App Check token: ${e.error}`),e?.token}};function Wr(e){return v(e)}var Gr=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=Oe(e=>this.observer=e)}get next(){return C(this.observer,this.auth,`internal-error`),this.observer.next.bind(this.observer)}},Kr={async loadJS(){throw Error(`Unable to load external scripts`)},recaptchaV2Script:``,recaptchaEnterpriseScript:``,gapiScript:``};function qr(e){Kr=e}function Jr(e){return Kr.loadJS(e)}function Yr(){return Kr.recaptchaEnterpriseScript}function Xr(){return Kr.gapiScript}function Zr(e){return`__${e}${Math.floor(Math.random()*1e6)}`}var Qr=class{constructor(){this.enterprise=new $r}ready(e){e()}execute(e,t){return Promise.resolve(`token`)}render(e,t){return``}},$r=class{ready(e){e()}execute(e,t){return Promise.resolve(`token`)}render(e,t){return``}},ei=`recaptcha-enterprise`,ti=`NO_RECAPTCHA`,ni=class{constructor(e){this.type=ei,this.auth=Wr(e)}async verify(e=`verify`,t=!1){async function n(e){if(!t){if(e.tenantId==null&&e._agentRecaptchaConfig!=null)return e._agentRecaptchaConfig.siteKey;if(e.tenantId!=null&&e._tenantRecaptchaConfigs[e.tenantId]!==void 0)return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,n)=>{$n(e,{clientType:`CLIENT_TYPE_WEB`,version:`RECAPTCHA_ENTERPRISE`}).then(r=>{if(r.recaptchaKey===void 0)n(Error(`recaptcha Enterprise site key undefined`));else{let n=new Qn(r);return e.tenantId==null?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}}).catch(e=>{n(e)})})}function r(t,n,r){let i=window.grecaptcha;Zn(i)?i.enterprise.ready(()=>{i.enterprise.execute(t,{action:e}).then(e=>{n(e)}).catch(()=>{n(ti)})}):r(Error(`No reCAPTCHA enterprise script loaded.`))}return this.auth.settings.appVerificationDisabledForTesting?new Qr().execute(`siteKey`,{action:`verify`}):new Promise((e,i)=>{n(this.auth).then(n=>{if(!t&&Zn(window.grecaptcha))r(n,e,i);else{if(typeof window>`u`){i(Error(`RecaptchaVerifier is only supported in browser`));return}let t=Yr();t.length!==0&&(t+=n),Jr(t).then(()=>{r(n,e,i)}).catch(e=>{i(e)})}}).catch(e=>{i(e)})})}};async function ri(e,t,n,r=!1,i=!1){let a=new ni(e),o;if(i)o=ti;else try{o=await a.verify(n)}catch{o=await a.verify(n,!0)}let s={...t};if(n===`mfaSmsEnrollment`||n===`mfaSmsSignIn`){if(`phoneEnrollmentInfo`in s){let e=s.phoneEnrollmentInfo.phoneNumber,t=s.phoneEnrollmentInfo.recaptchaToken;Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:t,captchaResponse:o,clientType:`CLIENT_TYPE_WEB`,recaptchaVersion:`RECAPTCHA_ENTERPRISE`}})}else if(`phoneSignInInfo`in s){let e=s.phoneSignInInfo.recaptchaToken;Object.assign(s,{phoneSignInInfo:{recaptchaToken:e,captchaResponse:o,clientType:`CLIENT_TYPE_WEB`,recaptchaVersion:`RECAPTCHA_ENTERPRISE`}})}return s}return r?Object.assign(s,{captchaResp:o}):Object.assign(s,{captchaResponse:o}),Object.assign(s,{clientType:`CLIENT_TYPE_WEB`}),Object.assign(s,{recaptchaVersion:`RECAPTCHA_ENTERPRISE`}),s}async function ii(e,t,n,r,i){if(i===`EMAIL_PASSWORD_PROVIDER`)if(e._getRecaptchaConfig()?.isProviderEnabled(`EMAIL_PASSWORD_PROVIDER`)){let i=await ri(e,t,n,n===`getOobCode`);return r(e,i)}else return r(e,t).catch(async i=>{if(i.code===`auth/missing-recaptcha-token`){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let i=await ri(e,t,n,n===`getOobCode`);return r(e,i)}else return Promise.reject(i)});else if(i===`PHONE_PROVIDER`)if(e._getRecaptchaConfig()?.isProviderEnabled(`PHONE_PROVIDER`)){let i=await ri(e,t,n);return r(e,i).catch(async i=>{if(e._getRecaptchaConfig()?.getProviderEnforcementState(`PHONE_PROVIDER`)===`AUDIT`&&(i.code===`auth/missing-recaptcha-token`||i.code===`auth/invalid-app-credential`)){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${n} flow.`);let i=await ri(e,t,n,!1,!0);return r(e,i)}return Promise.reject(i)})}else{let i=await ri(e,t,n,!1,!0);return r(e,i)}else return Promise.reject(i+` provider is not supported.`)}async function ai(e){let t=Wr(e),n=await $n(t,{clientType:`CLIENT_TYPE_WEB`,version:`RECAPTCHA_ENTERPRISE`}),r=new Qn(n);t.tenantId==null?t._agentRecaptchaConfig=r:t._tenantRecaptchaConfigs[t.tenantId]=r,r.isAnyProviderEnabled()&&new ni(t).verify()}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function oi(e,t){let n=Xt(e,`auth`);if(n.isInitialized()){let e=n.getImmediate(),r=n.getOptions();if(Ce(r,t??{}))return e;Dn(e,`already-initialized`)}return n.initialize({options:t})}function si(e,t){let n=t?.persistence||[],r=(Array.isArray(n)?n:[n]).map(xr);t?.errorMap&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,t?.popupRedirectResolver)}function ci(e,t,n){let r=Wr(e);C(/^https?:\/\//.test(t),r,`invalid-emulator-scheme`);let i=!!n?.disableWarnings,a=li(t),{host:o,port:s}=ui(t),c=s===null?``:`:${s}`,l={url:`${a}//${o}${c}/`},u=Object.freeze({host:o,port:s,protocol:a.replace(`:`,``),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){C(r.config.emulator&&r.emulatorConfig,r,`emulator-config-failed`),C(Ce(l,r.config.emulator)&&Ce(u,r.emulatorConfig),r,`emulator-config-failed`);return}r.config.emulator=l,r.emulatorConfig=u,r.settings.appVerificationDisabledForTesting=!0,te(o)?(ne(`${a}//${o}${c}`),se(`Auth`,!0)):i||fi()}function li(e){let t=e.indexOf(`:`);return t<0?``:e.substr(0,t+1)}function ui(e){let t=li(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:``,port:null};let r=n[2].split(`@`).pop()||``,i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){let e=i[1];return{host:e,port:di(r.substr(e.length+1))}}else{let[e,t]=r.split(`:`);return{host:e,port:di(t)}}}function di(e){if(!e)return null;let t=Number(e);return isNaN(t)?null:t}function fi(){function e(){let e=document.createElement(`p`),t=e.style;e.innerText=`Running in emulator mode. Do not use with production credentials.`,t.position=`fixed`,t.width=`100%`,t.backgroundColor=`#ffffff`,t.border=`.1em solid #000000`,t.color=`#b50000`,t.bottom=`0px`,t.left=`0px`,t.margin=`0px`,t.zIndex=`10000`,t.textAlign=`center`,e.classList.add(`firebase-emulator-warning`),document.body.appendChild(e)}typeof console<`u`&&typeof console.info==`function`&&console.info(`WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.`),typeof window<`u`&&typeof document<`u`&&(document.readyState===`loading`?window.addEventListener(`DOMContentLoaded`,e):e())}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var pi=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Mn(`not implemented`)}_getIdTokenResponse(e){return Mn(`not implemented`)}_linkToIdToken(e,t){return Mn(`not implemented`)}_getReauthenticationResolver(e){return Mn(`not implemented`)}};async function mi(e,t){return T(e,`POST`,`/v1/accounts:signUp`,t)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function hi(e,t){return Kn(e,`POST`,`/v1/accounts:signInWithPassword`,w(e,t))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function gi(e,t){return Kn(e,`POST`,`/v1/accounts:signInWithEmailLink`,w(e,t))}async function _i(e,t){return Kn(e,`POST`,`/v1/accounts:signInWithEmailLink`,w(e,t))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var vi=class e extends pi{constructor(e,t,n,r=null){super(`password`,n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(t,n){return new e(t,n,`password`)}static _fromEmailAndCode(t,n,r=null){return new e(t,n,`emailLink`,r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e==`string`?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod===`password`)return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod===`emailLink`)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case`password`:let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:`CLIENT_TYPE_WEB`};return ii(e,t,`signInWithPassword`,hi,`EMAIL_PASSWORD_PROVIDER`);case`emailLink`:return gi(e,{email:this._email,oobCode:this._password});default:Dn(e,`internal-error`)}}async _linkToIdToken(e,t){switch(this.signInMethod){case`password`:let n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:`CLIENT_TYPE_WEB`};return ii(e,n,`signUpPassword`,mi,`EMAIL_PASSWORD_PROVIDER`);case`emailLink`:return _i(e,{idToken:t,email:this._email,oobCode:this._password});default:Dn(e,`internal-error`)}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function yi(e,t){return Kn(e,`POST`,`/v1/accounts:signInWithIdp`,w(e,t))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var bi=`http://localhost`,xi=class e extends pi{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){let n=new e(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(n.idToken=t.idToken),t.accessToken&&(n.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(n.nonce=t.nonce),t.pendingToken&&(n.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(n.accessToken=t.oauthToken,n.secret=t.oauthTokenSecret):Dn(`argument-error`),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){let{providerId:n,signInMethod:r,...i}=typeof t==`string`?JSON.parse(t):t;if(!n||!r)return null;let a=new e(n,r);return a.idToken=i.idToken||void 0,a.accessToken=i.accessToken||void 0,a.secret=i.secret,a.nonce=i.nonce,a.pendingToken=i.pendingToken||null,a}_getIdTokenResponse(e){let t=this.buildRequest();return yi(e,t)}_linkToIdToken(e,t){let n=this.buildRequest();return n.idToken=t,yi(e,n)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,yi(e,t)}buildRequest(){let e={requestUri:bi,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Te(t)}return e}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function Si(e,t){return T(e,`POST`,`/v1/accounts:sendVerificationCode`,w(e,t))}async function Ci(e,t){return Kn(e,`POST`,`/v1/accounts:signInWithPhoneNumber`,w(e,t))}async function wi(e,t){let n=await Kn(e,`POST`,`/v1/accounts:signInWithPhoneNumber`,w(e,t));if(n.temporaryProof)throw Xn(e,`account-exists-with-different-credential`,n);return n}var Ti={USER_NOT_FOUND:`user-not-found`};async function Ei(e,t){let n={...t,operation:`REAUTH`};return Kn(e,`POST`,`/v1/accounts:signInWithPhoneNumber`,w(e,n),Ti)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Di=class e extends pi{constructor(e){super(`phone`,`phone`),this.params=e}static _fromVerification(t,n){return new e({verificationId:t,verificationCode:n})}static _fromTokenResponse(t,n){return new e({phoneNumber:t,temporaryProof:n})}_getIdTokenResponse(e){return Ci(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return wi(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return Ei(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:r}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:r}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(t){typeof t==`string`&&(t=JSON.parse(t));let{verificationId:n,verificationCode:r,phoneNumber:i,temporaryProof:a}=t;return!r&&!n&&!i&&!a?null:new e({verificationId:n,verificationCode:r,phoneNumber:i,temporaryProof:a})}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Oi(e){switch(e){case`recoverEmail`:return`RECOVER_EMAIL`;case`resetPassword`:return`PASSWORD_RESET`;case`signIn`:return`EMAIL_SIGNIN`;case`verifyEmail`:return`VERIFY_EMAIL`;case`verifyAndChangeEmail`:return`VERIFY_AND_CHANGE_EMAIL`;case`revertSecondFactorAddition`:return`REVERT_SECOND_FACTOR_ADDITION`;default:return null}}function ki(e){let t=Ee(De(e)).link,n=t?Ee(De(t)).deep_link_id:null,r=Ee(De(e)).deep_link_id;return(r?Ee(De(r)).link:null)||r||n||t||e}var Ai=class e{constructor(e){let t=Ee(De(e)),n=t.apiKey??null,r=t.oobCode??null,i=Oi(t.mode??null);C(n&&r&&i,`argument-error`),this.apiKey=n,this.operation=i,this.code=r,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(t){let n=ki(t);try{return new e(n)}catch{return null}}},ji=class e{constructor(){this.providerId=e.PROVIDER_ID}static credential(e,t){return vi._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let n=Ai.parseLink(t);return C(n,`argument-error`),vi._fromEmailAndCode(e,n.code,n.tenantId)}};ji.PROVIDER_ID=`password`,ji.EMAIL_PASSWORD_SIGN_IN_METHOD=`password`,ji.EMAIL_LINK_SIGN_IN_METHOD=`emailLink`;
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Mi=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}},Ni=class extends Mi{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}},Pi=class e extends Ni{constructor(){super(`facebook.com`)}static credential(t){return xi._fromParams({providerId:e.PROVIDER_ID,signInMethod:e.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return e.credentialFromTaggedObject(t)}static credentialFromError(t){return e.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!(`oauthAccessToken`in t)||!t.oauthAccessToken)return null;try{return e.credential(t.oauthAccessToken)}catch{return null}}};Pi.FACEBOOK_SIGN_IN_METHOD=`facebook.com`,Pi.PROVIDER_ID=`facebook.com`;
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Fi=class e extends Ni{constructor(){super(`google.com`),this.addScope(`profile`)}static credential(t,n){return xi._fromParams({providerId:e.PROVIDER_ID,signInMethod:e.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:n})}static credentialFromResult(t){return e.credentialFromTaggedObject(t)}static credentialFromError(t){return e.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;let{oauthIdToken:n,oauthAccessToken:r}=t;if(!n&&!r)return null;try{return e.credential(n,r)}catch{return null}}};Fi.GOOGLE_SIGN_IN_METHOD=`google.com`,Fi.PROVIDER_ID=`google.com`;
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Ii=class e extends Ni{constructor(){super(`github.com`)}static credential(t){return xi._fromParams({providerId:e.PROVIDER_ID,signInMethod:e.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return e.credentialFromTaggedObject(t)}static credentialFromError(t){return e.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!(`oauthAccessToken`in t)||!t.oauthAccessToken)return null;try{return e.credential(t.oauthAccessToken)}catch{return null}}};Ii.GITHUB_SIGN_IN_METHOD=`github.com`,Ii.PROVIDER_ID=`github.com`;
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Li=class e extends Ni{constructor(){super(`twitter.com`)}static credential(t,n){return xi._fromParams({providerId:e.PROVIDER_ID,signInMethod:e.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:n})}static credentialFromResult(t){return e.credentialFromTaggedObject(t)}static credentialFromError(t){return e.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;let{oauthAccessToken:n,oauthTokenSecret:r}=t;if(!n||!r)return null;try{return e.credential(n,r)}catch{return null}}};Li.TWITTER_SIGN_IN_METHOD=`twitter.com`,Li.PROVIDER_ID=`twitter.com`;
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function Ri(e,t){return Kn(e,`POST`,`/v1/accounts:signUp`,w(e,t))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var zi=class e{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(t,n,r,i=!1){let a=await yr._fromIdTokenResponse(t,r,i),o=Bi(r);return new e({user:a,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(t,n,r){await t._updateTokensIfNecessary(r,!0);let i=Bi(r);return new e({user:t,providerId:i,_tokenResponse:r,operationType:n})}};function Bi(e){return e.providerId?e.providerId:`phoneNumber`in e?`phone`:null}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Vi=class e extends ve{constructor(t,n,r,i){super(n.code,n.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,e.prototype),this.customData={appName:t.name,tenantId:t.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(t,n,r,i){return new e(t,n,r,i)}};function Hi(e,t,n,r){return(t===`reauthenticate`?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(n=>{throw n.code===`auth/multi-factor-auth-required`?Vi._fromErrorAndOperation(e,n,t,r):n})}async function Ui(e,t,n=!1){let r=await sr(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return zi._forOperation(e,`link`,r)}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function Wi(e,t,n=!1){let{auth:r}=e;if(Zt(r.app))return Promise.reject(An(r));let i=`reauthenticate`;try{let a=await sr(e,Hi(r,i,t,e),n);C(a.idToken,r,`internal-error`);let o=ar(a.idToken);C(o,r,`internal-error`);let{sub:s}=o;return C(e.uid===s,r,`user-mismatch`),zi._forOperation(e,i,a)}catch(e){throw e?.code===`auth/user-not-found`&&Dn(r,`user-mismatch`),e}}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function Gi(e,t,n=!1){if(Zt(e.app))return Promise.reject(An(e));let r=`signIn`,i=await Hi(e,r,t),a=await zi._fromIdTokenResponse(e,r,i);return n||await e._updateCurrentUser(a.user),a}async function Ki(e,t){return Gi(Wr(e),t)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function qi(e){let t=Wr(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function Ji(e,t,n){if(Zt(e.app))return Promise.reject(An(e));let r=Wr(e),i=await ii(r,{returnSecureToken:!0,email:t,password:n,clientType:`CLIENT_TYPE_WEB`},`signUpPassword`,Ri,`EMAIL_PASSWORD_PROVIDER`).catch(t=>{throw t.code===`auth/password-does-not-meet-requirements`&&qi(e),t}),a=await zi._fromIdTokenResponse(r,`signIn`,i);return await r._updateCurrentUser(a.user),a}function Yi(e,t,n){return Zt(e.app)?Promise.reject(An(e)):Ki(v(e),ji.credential(t,n)).catch(async t=>{throw t.code===`auth/password-does-not-meet-requirements`&&qi(e),t})}function Xi(e,t,n,r){return v(e).onIdTokenChanged(t,n,r)}function Zi(e,t,n){return v(e).beforeAuthStateChanged(t,n)}function Qi(e,t,n,r){return v(e).onAuthStateChanged(t,n,r)}function $i(e){return v(e).signOut()}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function ea(e,t){return T(e,`POST`,`/v2/accounts/mfaEnrollment:start`,w(e,t))}function ta(e,t){return T(e,`POST`,`/v2/accounts/mfaEnrollment:finalize`,w(e,t))}function na(e,t){return T(e,`POST`,`/v2/accounts/mfaEnrollment:start`,w(e,t))}function ra(e,t){return T(e,`POST`,`/v2/accounts/mfaEnrollment:finalize`,w(e,t))}var ia=`__sak`,aa=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ia,`1`),this.storage.removeItem(ia),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}},oa=1e3,sa=10,ca=class extends aa{constructor(){super(()=>window.localStorage,`LOCAL`),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Lr(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((e,t,n)=>{this.notifyListeners(e,n)});return}let n=e.key;t?this.detachListener():this.stopPolling();let r=()=>{let e=this.storage.getItem(n);!t&&this.localCache[n]===e||this.notifyListeners(n,e)},i=this.storage.getItem(n);Ir()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,sa):r()}notifyListeners(e,t){this.localCache[e]=t;let n=this.listeners[e];if(n)for(let e of Array.from(n))e(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent(`storage`,{key:e,oldValue:t,newValue:n}),!0)})},oa)}stopPolling(){this.pollTimer&&=(clearInterval(this.pollTimer),null)}attachListener(){window.addEventListener(`storage`,this.boundEventHandler)}detachListener(){window.removeEventListener(`storage`,this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};ca.type=`LOCAL`;var la=ca,ua=1e3;function da(e){let t=e.replace(/[\\^$.*+?()[\]{}|]/g,`\\$&`),n=RegExp(`${t}=([^;]+)`);return document.cookie.match(n)?.[1]??null}function fa(e){return`${window.location.protocol===`http:`?`__dev_`:`__HOST-`}FIREBASE_${e.split(`:`)[3]}`}var pa=class{constructor(){this.type=`COOKIE`,this.listenerUnsubscribes=new Map}_getFinalTarget(e){let t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set(`finalTarget`,e),t}async _isAvailable(){return typeof isSecureContext==`boolean`&&!isSecureContext||typeof navigator>`u`||typeof document>`u`?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;let t=fa(e);return window.cookieStore?(await window.cookieStore.get(t))?.value:da(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;let t=fa(e);document.cookie=`${t}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch(`/__cookies__`,{method:`DELETE`}).catch(()=>void 0)}_addListener(e,t){if(!this._isAvailable())return;let n=fa(e);if(window.cookieStore){let e=(e=>{let r=e.changed.find(e=>e.name===n);r&&t(r.value),e.deleted.find(e=>e.name===n)&&t(null)});return this.listenerUnsubscribes.set(t,()=>window.cookieStore.removeEventListener(`change`,e)),window.cookieStore.addEventListener(`change`,e)}let r=da(n),i=setInterval(()=>{let e=da(n);e!==r&&(t(e),r=e)},ua);this.listenerUnsubscribes.set(t,()=>clearInterval(i))}_removeListener(e,t){let n=this.listenerUnsubscribes.get(t);n&&(n(),this.listenerUnsubscribes.delete(t))}};pa.type=`COOKIE`;
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ma=class extends aa{constructor(){super(()=>window.sessionStorage,`SESSION`)}_addListener(e,t){}_removeListener(e,t){}};ma.type=`SESSION`;var ha=ma;
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function ga(e){return Promise.all(e.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(e){return{fulfilled:!1,reason:e}}}))}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var _a=class e{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){let n=this.receivers.find(e=>e.isListeningto(t));if(n)return n;let r=new e(t);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:n,eventType:r,data:i}=t.data,a=this.handlersMap[r];if(!a?.size)return;t.ports[0].postMessage({status:`ack`,eventId:n,eventType:r});let o=Array.from(a).map(async e=>e(t.origin,i)),s=await ga(o);t.ports[0].postMessage({status:`done`,eventId:n,eventType:r,response:s})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener(`message`,this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener(`message`,this.boundEventHandler)}};_a.receivers=[];
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function va(e=``,t=10){let n=``;for(let e=0;e<t;e++)n+=Math.floor(Math.random()*10);return e+n}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ya=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener(`message`,e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){let r=typeof MessageChannel<`u`?new MessageChannel:null;if(!r)throw Error(`connection_unavailable`);let i,a;return new Promise((o,s)=>{let c=va(``,20);r.port1.start();let l=setTimeout(()=>{s(Error(`unsupported_event`))},n);a={messageChannel:r,onMessage(e){let t=e;if(t.data.eventId===c)switch(t.data.status){case`ack`:clearTimeout(l),i=setTimeout(()=>{s(Error(`timeout`))},3e3);break;case`done`:clearTimeout(i),o(t.data.response);break;default:clearTimeout(l),clearTimeout(i),s(Error(`invalid_response`));break}}},this.handlers.add(a),r.port1.addEventListener(`message`,a.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function ba(){return window}function xa(e){ba().location.href=e}
/**
* @license
* Copyright 2020 Google LLC.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Sa(){return ba().WorkerGlobalScope!==void 0&&typeof ba().importScripts==`function`}async function Ca(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function wa(){return navigator?.serviceWorker?.controller||null}function Ta(){return Sa()?self:null}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Ea=`firebaseLocalStorageDb`,Da=1,Oa=`firebaseLocalStorage`,ka=`fbase_key`,Aa=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener(`success`,()=>{e(this.request.result)}),this.request.addEventListener(`error`,()=>{t(this.request.error)})})}};function ja(e,t){return e.transaction([Oa],t?`readwrite`:`readonly`).objectStore(Oa)}function Ma(){let e=indexedDB.deleteDatabase(Ea);return new Aa(e).toPromise()}function Na(){let e=indexedDB.open(Ea,Da);return new Promise((t,n)=>{e.addEventListener(`error`,()=>{n(e.error)}),e.addEventListener(`upgradeneeded`,()=>{let t=e.result;try{t.createObjectStore(Oa,{keyPath:ka})}catch(e){n(e)}}),e.addEventListener(`success`,async()=>{let n=e.result;n.objectStoreNames.contains(Oa)?t(n):(n.close(),await Ma(),t(await Na()))})})}async function Pa(e,t,n){let r=ja(e,!0).put({[ka]:t,value:n});return new Aa(r).toPromise()}async function Fa(e,t){let n=ja(e,!1).get(t),r=await new Aa(n).toPromise();return r===void 0?null:r.value}function Ia(e,t){let n=ja(e,!0).delete(t);return new Aa(n).toPromise()}var La=800,Ra=3,za=class{constructor(){this.type=`LOCAL`,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||=await Na(),this.db}async _withRetries(e){let t=0;for(;;)try{let t=await this._openDb();return await e(t)}catch(e){if(t++>Ra)throw e;this.db&&=(this.db.close(),void 0)}}async initializeServiceWorkerMessaging(){return Sa()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=_a._getInstance(Ta()),this.receiver._subscribe(`keyChanged`,async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe(`ping`,async(e,t)=>[`keyChanged`])}async initializeSender(){if(this.activeServiceWorker=await Ca(),!this.activeServiceWorker)return;this.sender=new ya(this.activeServiceWorker);let e=await this.sender._send(`ping`,{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes(`keyChanged`)&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||wa()!==this.activeServiceWorker))try{await this.sender._send(`keyChanged`,{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;let e=await Na();return await Pa(e,ia,`1`),await Ia(e,ia),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Pa(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(t=>Fa(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Ia(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){let e=await this._withRetries(e=>{let t=ja(e,!1).getAll();return new Aa(t).toPromise()});if(!e||this.pendingWrites!==0)return[];let t=[],n=new Set;if(e.length!==0)for(let{fbase_key:r,value:i}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(i)&&(this.notifyListeners(r,i),t.push(r));for(let e of Object.keys(this.localCache))this.localCache[e]&&!n.has(e)&&(this.notifyListeners(e,null),t.push(e));return t}notifyListeners(e,t){this.localCache[e]=t;let n=this.listeners[e];if(n)for(let e of Array.from(n))e(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),La)}stopPolling(){this.pollTimer&&=(clearInterval(this.pollTimer),null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}};za.type=`LOCAL`;var Ba=za;
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Va(e,t){return T(e,`POST`,`/v2/accounts/mfaSignIn:start`,w(e,t))}function Ha(e,t){return T(e,`POST`,`/v2/accounts/mfaSignIn:finalize`,w(e,t))}function Ua(e,t){return T(e,`POST`,`/v2/accounts/mfaSignIn:finalize`,w(e,t))}Zr(`rcb`),new zn(3e4,6e4);
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Wa=`recaptcha`;async function Ga(e,t,n){if(!e._getRecaptchaConfig())try{await ai(e)}catch{console.log(`Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.`)}try{let r;if(r=typeof t==`string`?{phoneNumber:t}:t,`session`in r){let t=r.session;if(`phoneNumber`in r){C(t.type===`enroll`,e,`internal-error`);let i={idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:r.phoneNumber,clientType:`CLIENT_TYPE_WEB`}};return(await ii(e,i,`mfaSmsEnrollment`,async(e,t)=>{if(t.phoneEnrollmentInfo.captchaResponse===ti){C(n?.type===Wa,e,`argument-error`);let r=await Ka(e,t,n);return ea(e,r)}return ea(e,t)},`PHONE_PROVIDER`).catch(e=>Promise.reject(e))).phoneSessionInfo.sessionInfo}else{C(t.type===`signin`,e,`internal-error`);let i=r.multiFactorHint?.uid||r.multiFactorUid;C(i,e,`missing-multi-factor-info`);let a={mfaPendingCredential:t.credential,mfaEnrollmentId:i,phoneSignInInfo:{clientType:`CLIENT_TYPE_WEB`}};return(await ii(e,a,`mfaSmsSignIn`,async(e,t)=>{if(t.phoneSignInInfo.captchaResponse===ti){C(n?.type===Wa,e,`argument-error`);let r=await Ka(e,t,n);return Va(e,r)}return Va(e,t)},`PHONE_PROVIDER`).catch(e=>Promise.reject(e))).phoneResponseInfo.sessionInfo}}else{let t={phoneNumber:r.phoneNumber,clientType:`CLIENT_TYPE_WEB`};return(await ii(e,t,`sendVerificationCode`,async(e,t)=>{if(t.captchaResponse===ti){C(n?.type===Wa,e,`argument-error`);let r=await Ka(e,t,n);return Si(e,r)}return Si(e,t)},`PHONE_PROVIDER`).catch(e=>Promise.reject(e))).sessionInfo}}finally{n?._reset()}}async function Ka(e,t,n){C(n.type===Wa,e,`argument-error`);let r=await n.verify();C(typeof r==`string`,e,`argument-error`);let i={...t};if(`phoneEnrollmentInfo`in i){let e=i.phoneEnrollmentInfo.phoneNumber,t=i.phoneEnrollmentInfo.captchaResponse,n=i.phoneEnrollmentInfo.clientType,a=i.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(i,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:r,captchaResponse:t,clientType:n,recaptchaVersion:a}}),i}else if(`phoneSignInInfo`in i){let e=i.phoneSignInInfo.captchaResponse,t=i.phoneSignInInfo.clientType,n=i.phoneSignInInfo.recaptchaVersion;return Object.assign(i,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:e,clientType:t,recaptchaVersion:n}}),i}else return Object.assign(i,{recaptchaToken:r}),i}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var qa=class e{constructor(t){this.providerId=e.PROVIDER_ID,this.auth=Wr(t)}verifyPhoneNumber(e,t){return Ga(this.auth,e,v(t))}static credential(e,t){return Di._fromVerification(e,t)}static credentialFromResult(t){let n=t;return e.credentialFromTaggedObject(n)}static credentialFromError(t){return e.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:n}=e;return t&&n?Di._fromTokenResponse(t,n):null}};qa.PROVIDER_ID=`phone`,qa.PHONE_SIGN_IN_METHOD=`phone`;
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Ja(e,t){return t?xr(t):(C(e._popupRedirectResolver,e,`argument-error`),e._popupRedirectResolver)}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Ya=class extends pi{constructor(e){super(`custom`,`custom`),this.params=e}_getIdTokenResponse(e){return yi(e,this._buildIdpRequest())}_linkToIdToken(e,t){return yi(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return yi(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function Xa(e){return Gi(e.auth,new Ya(e),e.bypassAuthState)}function Za(e){let{auth:t,user:n}=e;return C(n,t,`internal-error`),Wi(n,new Ya(e),e.bypassAuthState)}async function Qa(e){let{auth:t,user:n}=e;return C(n,t,`internal-error`),Ui(n,new Ya(e),e.bypassAuthState)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var $a=class{constructor(e,t,n,r,i=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(e){this.reject(e)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:n,postBody:r,tenantId:i,error:a,type:o}=e;if(a){this.reject(a);return}let s={auth:this.auth,requestUri:t,sessionId:n,tenantId:i||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(s))}catch(e){this.reject(e)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case`signInViaPopup`:case`signInViaRedirect`:return Xa;case`linkViaPopup`:case`linkViaRedirect`:return Qa;case`reauthViaPopup`:case`reauthViaRedirect`:return Za;default:Dn(this.auth,`internal-error`)}}resolve(e){Nn(this.pendingPromise,`Pending promise was never set`),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Nn(this.pendingPromise,`Pending promise was never set`),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}},eo=new zn(2e3,1e4),to=class e extends $a{constructor(t,n,r,i,a){super(t,n,i,a),this.provider=r,this.authWindow=null,this.pollId=null,e.currentPopupAction&&e.currentPopupAction.cancel(),e.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return C(e,this.auth,`internal-error`),e}async onExecution(){Nn(this.filter.length===1,`Popup operations only handle one event`);let e=va();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(On(this.auth,`web-storage-unsupported`))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(On(this.auth,`cancelled-popup-request`))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,e.currentPopupAction=null}pollUserCancellation(){let e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(On(this.auth,`popup-closed-by-user`))},8e3);return}this.pollId=window.setTimeout(e,eo.get())};e()}};to.currentPopupAction=null;
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var no=`pendingRedirect`,ro=new Map,io=class extends $a{constructor(e,t,n=!1){super(e,[`signInViaRedirect`,`linkViaRedirect`,`reauthViaRedirect`,`unknown`],t,void 0,n),this.eventId=null}async execute(){let e=ro.get(this.auth._key());if(!e){try{let t=await ao(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}ro.set(this.auth._key(),e)}return this.bypassAuthState||ro.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type===`signInViaRedirect`)return super.onAuthEvent(e);if(e.type===`unknown`){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function ao(e,t){let n=co(t),r=so(e);if(!await r._isAvailable())return!1;let i=await r._get(n)===`true`;return await r._remove(n),i}function oo(e,t){ro.set(e._key(),t)}function so(e){return xr(e._redirectPersistence)}function co(e){return wr(no,e.config.apiKey,e.name)}async function lo(e,t,n=!1){if(Zt(e.app))return Promise.reject(An(e));let r=Wr(e),i=Ja(r,t),a=await new io(r,i,n).execute();return a&&!n&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,t)),a}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var uo=600*1e3,fo=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!ho(e)?t:(this.hasHandledPotentialRedirect=!0,t||=(this.queuedRedirectEvent=e,!0),t)}sendToConsumer(e,t){if(e.error&&!mo(e)){let n=e.error.code?.split(`auth/`)[1]||`internal-error`;t.onError(On(this.auth,n))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=uo&&this.cachedEventUids.clear(),this.cachedEventUids.has(po(e))}saveEventToCache(e){this.cachedEventUids.add(po(e)),this.lastProcessedEventTime=Date.now()}};function po(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join(`-`)}function mo({type:e,error:t}){return e===`unknown`&&t?.code===`auth/no-auth-event`}function ho(e){switch(e.type){case`signInViaRedirect`:case`linkViaRedirect`:case`reauthViaRedirect`:return!0;case`unknown`:return mo(e);default:return!1}}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function go(e,t={}){return T(e,`GET`,`/v1/projects`,t)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var _o=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,vo=/^https?/;async function yo(e){if(e.config.emulator)return;let{authorizedDomains:t}=await go(e);for(let e of t)try{if(bo(e))return}catch{}Dn(e,`unauthorized-domain`)}function bo(e){let t=Pn(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith(`chrome-extension://`)){let i=new URL(e);return i.hostname===``&&r===``?n===`chrome-extension:`&&e.replace(`chrome-extension://`,``)===t.replace(`chrome-extension://`,``):n===`chrome-extension:`&&i.hostname===r}if(!vo.test(n))return!1;if(_o.test(e))return r===e;let i=e.replace(/\./g,`\\.`);return RegExp(`^(.+\\.`+i+`|`+i+`)$`,`i`).test(r)}
/**
* @license
* Copyright 2020 Google LLC.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var xo=new zn(3e4,6e4);function So(){let e=ba().___jsl;if(e?.H){for(let t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let t=0;t<e.CP.length;t++)e.CP[t]=null}}function Co(e){return new Promise((t,n)=>{function r(){So(),gapi.load(`gapi.iframes`,{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{So(),n(On(e,`network-request-failed`))},timeout:xo.get()})}if(ba().gapi?.iframes?.Iframe)t(gapi.iframes.getContext());else if(ba().gapi?.load)r();else{let t=Zr(`iframefcb`);return ba()[t]=()=>{gapi.load?r():n(On(e,`network-request-failed`))},Jr(`${Xr()}?onload=${t}`).catch(e=>n(e))}}).catch(e=>{throw wo=null,e})}var wo=null;function To(e){return wo||=Co(e),wo}
/**
* @license
* Copyright 2020 Google LLC.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Eo=new zn(5e3,15e3),Do=`__/auth/iframe`,Oo=`emulator/auth/iframe`,ko={style:{position:`absolute`,top:`-100px`,width:`1px`,height:`1px`},"aria-hidden":`true`,tabindex:`-1`},Ao=new Map([[`identitytoolkit.googleapis.com`,`p`],[`staging-identitytoolkit.sandbox.googleapis.com`,`s`],[`test-identitytoolkit.sandbox.googleapis.com`,`t`]]);function jo(e){let t=e.config;C(t.authDomain,e,`auth-domain-config-required`);let n=t.emulator?Bn(t,Oo):`https://${e.config.authDomain}/${Do}`,r={apiKey:t.apiKey,appName:e.name,v:en},i=Ao.get(e.config.apiHost);i&&(r.eid=i);let a=e._getFrameworks();return a.length&&(r.fw=a.join(`,`)),`${n}?${Te(r).slice(1)}`}async function Mo(e){let t=await To(e),n=ba().gapi;return C(n,e,`internal-error`),t.open({where:document.body,url:jo(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:ko,dontclear:!0},t=>new Promise(async(n,r)=>{await t.restyle({setHideOnLeave:!1});let i=On(e,`network-request-failed`),a=ba().setTimeout(()=>{r(i)},Eo.get());function o(){ba().clearTimeout(a),n(t)}t.ping(o).then(o,()=>{r(i)})}))}
/**
* @license
* Copyright 2020 Google LLC.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var No={location:`yes`,resizable:`yes`,statusbar:`yes`,toolbar:`no`},Po=500,Fo=600,Io=`_blank`,Lo=`http://localhost`,Ro=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function zo(e,t,n,r=Po,i=Fo){let a=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString(),s=``,c={...No,width:r.toString(),height:i.toString(),top:a,left:o},l=g().toLowerCase();n&&(s=kr(l)?Io:n),Dr(l)&&(t||=Lo,c.scrollbars=`yes`);let u=Object.entries(c).reduce((e,[t,n])=>`${e}${t}=${n},`,``);if(Fr(l)&&s!==`_self`)return Bo(t||``,s),new Ro(null);let d=window.open(t||``,s,u);C(d,e,`popup-blocked`);try{d.focus()}catch{}return new Ro(d)}function Bo(e,t){let n=document.createElement(`a`);n.href=e,n.target=t;let r=document.createEvent(`MouseEvent`);r.initMouseEvent(`click`,!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Vo=`__/auth/handler`,Ho=`emulator/auth/handler`,Uo=`fac`;async function Wo(e,t,n,r,i,a){C(e.config.authDomain,e,`auth-domain-config-required`),C(e.config.apiKey,e,`invalid-api-key`);let o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:en,eventId:i};if(t instanceof Mi){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||``,Se(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(let[e,t]of Object.entries(a||{}))o[e]=t}if(t instanceof Ni){let e=t.getScopes().filter(e=>e!==``);e.length>0&&(o.scopes=e.join(`,`))}e.tenantId&&(o.tid=e.tenantId);let s=o;for(let e of Object.keys(s))s[e]===void 0&&delete s[e];let c=await e._getAppCheckToken(),l=c?`#${Uo}=${encodeURIComponent(c)}`:``;return`${Go(e)}?${Te(s).slice(1)}${l}`}function Go({config:e}){return e.emulator?Bn(e,Ho):`https://${e.authDomain}/${Vo}`}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Ko=`webStorageSupport`,qo=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ha,this._completeRedirectFn=lo,this._overrideRedirectResult=oo}async _openPopup(e,t,n,r){Nn(this.eventManagers[e._key()]?.manager,`_initialize() not called before _openPopup()`);let i=await Wo(e,t,n,Pn(),r);return zo(e,i,va())}async _openRedirect(e,t,n,r){await this._originValidation(e);let i=await Wo(e,t,n,Pn(),r);return xa(i),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(Nn(n,`If manager is not set, promise should be`),n)}let n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){let t=await Mo(e),n=new fo(e);return t.register(`authEvent`,t=>(C(t?.authEvent,e,`invalid-auth-event`),{status:n.onEvent(t.authEvent)?`ACK`:`ERROR`}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ko,{type:Ko},n=>{let r=n?.[0]?.[Ko];r!==void 0&&t(!!r),Dn(e,`internal-error`)},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=yo(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Lr()||Or()||Pr()}},Jo=class{constructor(e){this.factorId=e}_process(e,t,n){switch(t.type){case`enroll`:return this._finalizeEnroll(e,t.credential,n);case`signin`:return this._finalizeSignIn(e,t.credential);default:return Mn(`unexpected MultiFactorSessionType`)}}},Yo=class e extends Jo{constructor(e){super(`phone`),this.credential=e}static _fromCredential(t){return new e(t)}_finalizeEnroll(e,t,n){return ta(e,{idToken:t,displayName:n,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return Ha(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},Xo=class{constructor(){}static assertion(e){return Yo._fromCredential(e)}};Xo.FACTOR_ID=`phone`;var Zo=class{static assertionForEnrollment(e,t){return Qo._fromSecret(e,t)}static assertionForSignIn(e,t){return Qo._fromEnrollmentId(e,t)}static async generateSecret(e){let t=e;C(t.user?.auth!==void 0,`internal-error`);let n=await na(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return $o._fromStartTotpMfaEnrollmentResponse(n,t.user.auth)}};Zo.FACTOR_ID=`totp`;var Qo=class e extends Jo{constructor(e,t,n){super(`totp`),this.otp=e,this.enrollmentId=t,this.secret=n}static _fromSecret(t,n){return new e(n,void 0,t)}static _fromEnrollmentId(t,n){return new e(n,t)}async _finalizeEnroll(e,t,n){return C(this.secret!==void 0,e,`argument-error`),ra(e,{idToken:t,displayName:n,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){C(this.enrollmentId!==void 0&&this.otp!==void 0,e,`argument-error`);let n={verificationCode:this.otp};return Ua(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:n})}},$o=class e{constructor(e,t,n,r,i,a,o){this.sessionInfo=a,this.auth=o,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=n,this.codeIntervalSeconds=r,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(t,n){return new e(t.totpSessionInfo.sharedSecretKey,t.totpSessionInfo.hashingAlgorithm,t.totpSessionInfo.verificationCodeLength,t.totpSessionInfo.periodSec,new Date(t.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),t.totpSessionInfo.sessionInfo,n)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){let n=!1;return(es(e)||es(t))&&(n=!0),n&&(es(e)&&(e=this.auth.currentUser?.email||`unknownuser`),es(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function es(e){return e===void 0||e?.length===0}var ts=`@firebase/auth`,ns=`1.11.1`,rs=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(t=>{e(t?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){C(this.auth._initializationPromise,`dependent-sdk-initialized-before-auth`)}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function os(e){switch(e){case`Node`:return`node`;case`ReactNative`:return`rn`;case`Worker`:return`webworker`;case`Cordova`:return`cordova`;case`WebExtension`:return`web-extension`;default:return}}function ss(e){Yt(new Me(`auth`,(t,{options:n})=>{let r=t.getProvider(`app`).getImmediate(),i=t.getProvider(`heartbeat`),a=t.getProvider(`app-check-internal`),{apiKey:o,authDomain:s}=r.options;C(o&&!o.includes(`:`),`invalid-api-key`,{appName:r.name});let c={apiKey:o,authDomain:s,clientPlatform:e,apiHost:`identitytoolkit.googleapis.com`,tokenApiHost:`securetoken.googleapis.com`,apiScheme:`https`,sdkClientVersion:Rr(e)},l=new Ur(r,i,a,c);return si(l,n),l},`PUBLIC`).setInstantiationMode(`EXPLICIT`).setInstanceCreatedCallback((e,t,n)=>{e.getProvider(`auth-internal`).initialize()})),Yt(new Me(`auth-internal`,e=>(e=>new rs(e))(Wr(e.getProvider(`auth`).getImmediate())),`PRIVATE`).setInstantiationMode(`EXPLICIT`)),rn(ts,ns,os(e)),rn(ts,ns,`esm2020`)}var cs=ee(`authIdTokenMaxAge`)||300,ls=null,us=e=>async t=>{let n=t&&await t.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>cs)return;let i=n?.token;ls!==i&&(ls=i,await fetch(e,{method:i?`POST`:`DELETE`,headers:i?{Authorization:`Bearer ${i}`}:{}}))};function ds(e=nn()){let t=Xt(e,`auth`);if(t.isInitialized())return t.getImmediate();let n=oi(e,{popupRedirectResolver:qo,persistence:[Ba,la,ha]}),r=ee(`authTokenSyncURL`);if(r&&typeof isSecureContext==`boolean`&&isSecureContext){let e=new URL(r,location.origin);if(location.origin===e.origin){let t=us(e.toString());Zi(n,t,()=>t(n.currentUser)),Xi(n,e=>t(e))}}let i=p(`auth`);return i&&ci(n,`http://${i}`),n}function fs(){return document.getElementsByTagName(`head`)?.[0]??document}qr({loadJS(e){return new Promise((t,n)=>{let r=document.createElement(`script`);r.setAttribute(`src`,e),r.onload=t,r.onerror=e=>{let t=On(`internal-error`);t.customData=e,n(t)},r.type=`text/javascript`,r.charset=`UTF-8`,fs().appendChild(r)})},gapiScript:`https://apis.google.com/js/api.js`,recaptchaV2Script:`https://www.google.com/recaptcha/api.js`,recaptchaEnterpriseScript:`https://www.google.com/recaptcha/enterprise.js?render=`}),ss(`Browser`);var ps=typeof globalThis<`u`?globalThis:typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:{},ms={},hs,gs;(function(){var e;function t(e,t){function n(){}n.prototype=t.prototype,e.F=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.D=function(e,n,r){for(var i=Array(arguments.length-2),a=2;a<arguments.length;a++)i[a-2]=arguments[a];return t.prototype[n].apply(e,i)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=[,,,,],this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(r,n),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(e,t,n){n||=0;let r=Array(16);if(typeof t==`string`)for(var i=0;i<16;++i)r[i]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(i=0;i<16;++i)r[i]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],i=e.g[2];let a=e.g[3],o;o=t+(a^n&(i^a))+r[0]+3614090360&4294967295,t=n+(o<<7&4294967295|o>>>25),o=a+(i^t&(n^i))+r[1]+3905402710&4294967295,a=t+(o<<12&4294967295|o>>>20),o=i+(n^a&(t^n))+r[2]+606105819&4294967295,i=a+(o<<17&4294967295|o>>>15),o=n+(t^i&(a^t))+r[3]+3250441966&4294967295,n=i+(o<<22&4294967295|o>>>10),o=t+(a^n&(i^a))+r[4]+4118548399&4294967295,t=n+(o<<7&4294967295|o>>>25),o=a+(i^t&(n^i))+r[5]+1200080426&4294967295,a=t+(o<<12&4294967295|o>>>20),o=i+(n^a&(t^n))+r[6]+2821735955&4294967295,i=a+(o<<17&4294967295|o>>>15),o=n+(t^i&(a^t))+r[7]+4249261313&4294967295,n=i+(o<<22&4294967295|o>>>10),o=t+(a^n&(i^a))+r[8]+1770035416&4294967295,t=n+(o<<7&4294967295|o>>>25),o=a+(i^t&(n^i))+r[9]+2336552879&4294967295,a=t+(o<<12&4294967295|o>>>20),o=i+(n^a&(t^n))+r[10]+4294925233&4294967295,i=a+(o<<17&4294967295|o>>>15),o=n+(t^i&(a^t))+r[11]+2304563134&4294967295,n=i+(o<<22&4294967295|o>>>10),o=t+(a^n&(i^a))+r[12]+1804603682&4294967295,t=n+(o<<7&4294967295|o>>>25),o=a+(i^t&(n^i))+r[13]+4254626195&4294967295,a=t+(o<<12&4294967295|o>>>20),o=i+(n^a&(t^n))+r[14]+2792965006&4294967295,i=a+(o<<17&4294967295|o>>>15),o=n+(t^i&(a^t))+r[15]+1236535329&4294967295,n=i+(o<<22&4294967295|o>>>10),o=t+(i^a&(n^i))+r[1]+4129170786&4294967295,t=n+(o<<5&4294967295|o>>>27),o=a+(n^i&(t^n))+r[6]+3225465664&4294967295,a=t+(o<<9&4294967295|o>>>23),o=i+(t^n&(a^t))+r[11]+643717713&4294967295,i=a+(o<<14&4294967295|o>>>18),o=n+(a^t&(i^a))+r[0]+3921069994&4294967295,n=i+(o<<20&4294967295|o>>>12),o=t+(i^a&(n^i))+r[5]+3593408605&4294967295,t=n+(o<<5&4294967295|o>>>27),o=a+(n^i&(t^n))+r[10]+38016083&4294967295,a=t+(o<<9&4294967295|o>>>23),o=i+(t^n&(a^t))+r[15]+3634488961&4294967295,i=a+(o<<14&4294967295|o>>>18),o=n+(a^t&(i^a))+r[4]+3889429448&4294967295,n=i+(o<<20&4294967295|o>>>12),o=t+(i^a&(n^i))+r[9]+568446438&4294967295,t=n+(o<<5&4294967295|o>>>27),o=a+(n^i&(t^n))+r[14]+3275163606&4294967295,a=t+(o<<9&4294967295|o>>>23),o=i+(t^n&(a^t))+r[3]+4107603335&4294967295,i=a+(o<<14&4294967295|o>>>18),o=n+(a^t&(i^a))+r[8]+1163531501&4294967295,n=i+(o<<20&4294967295|o>>>12),o=t+(i^a&(n^i))+r[13]+2850285829&4294967295,t=n+(o<<5&4294967295|o>>>27),o=a+(n^i&(t^n))+r[2]+4243563512&4294967295,a=t+(o<<9&4294967295|o>>>23),o=i+(t^n&(a^t))+r[7]+1735328473&4294967295,i=a+(o<<14&4294967295|o>>>18),o=n+(a^t&(i^a))+r[12]+2368359562&4294967295,n=i+(o<<20&4294967295|o>>>12),o=t+(n^i^a)+r[5]+4294588738&4294967295,t=n+(o<<4&4294967295|o>>>28),o=a+(t^n^i)+r[8]+2272392833&4294967295,a=t+(o<<11&4294967295|o>>>21),o=i+(a^t^n)+r[11]+1839030562&4294967295,i=a+(o<<16&4294967295|o>>>16),o=n+(i^a^t)+r[14]+4259657740&4294967295,n=i+(o<<23&4294967295|o>>>9),o=t+(n^i^a)+r[1]+2763975236&4294967295,t=n+(o<<4&4294967295|o>>>28),o=a+(t^n^i)+r[4]+1272893353&4294967295,a=t+(o<<11&4294967295|o>>>21),o=i+(a^t^n)+r[7]+4139469664&4294967295,i=a+(o<<16&4294967295|o>>>16),o=n+(i^a^t)+r[10]+3200236656&4294967295,n=i+(o<<23&4294967295|o>>>9),o=t+(n^i^a)+r[13]+681279174&4294967295,t=n+(o<<4&4294967295|o>>>28),o=a+(t^n^i)+r[0]+3936430074&4294967295,a=t+(o<<11&4294967295|o>>>21),o=i+(a^t^n)+r[3]+3572445317&4294967295,i=a+(o<<16&4294967295|o>>>16),o=n+(i^a^t)+r[6]+76029189&4294967295,n=i+(o<<23&4294967295|o>>>9),o=t+(n^i^a)+r[9]+3654602809&4294967295,t=n+(o<<4&4294967295|o>>>28),o=a+(t^n^i)+r[12]+3873151461&4294967295,a=t+(o<<11&4294967295|o>>>21),o=i+(a^t^n)+r[15]+530742520&4294967295,i=a+(o<<16&4294967295|o>>>16),o=n+(i^a^t)+r[2]+3299628645&4294967295,n=i+(o<<23&4294967295|o>>>9),o=t+(i^(n|~a))+r[0]+4096336452&4294967295,t=n+(o<<6&4294967295|o>>>26),o=a+(n^(t|~i))+r[7]+1126891415&4294967295,a=t+(o<<10&4294967295|o>>>22),o=i+(t^(a|~n))+r[14]+2878612391&4294967295,i=a+(o<<15&4294967295|o>>>17),o=n+(a^(i|~t))+r[5]+4237533241&4294967295,n=i+(o<<21&4294967295|o>>>11),o=t+(i^(n|~a))+r[12]+1700485571&4294967295,t=n+(o<<6&4294967295|o>>>26),o=a+(n^(t|~i))+r[3]+2399980690&4294967295,a=t+(o<<10&4294967295|o>>>22),o=i+(t^(a|~n))+r[10]+4293915773&4294967295,i=a+(o<<15&4294967295|o>>>17),o=n+(a^(i|~t))+r[1]+2240044497&4294967295,n=i+(o<<21&4294967295|o>>>11),o=t+(i^(n|~a))+r[8]+1873313359&4294967295,t=n+(o<<6&4294967295|o>>>26),o=a+(n^(t|~i))+r[15]+4264355552&4294967295,a=t+(o<<10&4294967295|o>>>22),o=i+(t^(a|~n))+r[6]+2734768916&4294967295,i=a+(o<<15&4294967295|o>>>17),o=n+(a^(i|~t))+r[13]+1309151649&4294967295,n=i+(o<<21&4294967295|o>>>11),o=t+(i^(n|~a))+r[4]+4149444226&4294967295,t=n+(o<<6&4294967295|o>>>26),o=a+(n^(t|~i))+r[11]+3174756917&4294967295,a=t+(o<<10&4294967295|o>>>22),o=i+(t^(a|~n))+r[2]+718787259&4294967295,i=a+(o<<15&4294967295|o>>>17),o=n+(a^(i|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(i+(o<<21&4294967295|o>>>11))&4294967295,e.g[2]=e.g[2]+i&4294967295,e.g[3]=e.g[3]+a&4294967295}r.prototype.v=function(e,t){t===void 0&&(t=e.length);let n=t-this.blockSize,r=this.C,a=this.h,o=0;for(;o<t;){if(a==0)for(;o<=n;)i(this,e,o),o+=this.blockSize;if(typeof e==`string`){for(;o<t;)if(r[a++]=e.charCodeAt(o++),a==this.blockSize){i(this,r),a=0;break}}else for(;o<t;)if(r[a++]=e[o++],a==this.blockSize){i(this,r),a=0;break}}this.h=a,this.o+=t},r.prototype.A=function(){var e=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;t=this.o*8;for(var n=e.length-8;n<e.length;++n)e[n]=t&255,t/=256;for(this.v(e),e=Array(16),t=0,n=0;n<4;++n)for(let r=0;r<32;r+=8)e[t++]=this.g[n]>>>r&255;return e};function a(e,t){var n=s;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}function o(e,t){this.h=t;let n=[],r=!0;for(let i=e.length-1;i>=0;i--){let a=e[i]|0;r&&a==t||(n[i]=a,r=!1)}this.g=n}var s={};function c(e){return-128<=e&&e<128?a(e,function(e){return new o([e|0],e<0?-1:0)}):new o([e|0],e<0?-1:0)}function l(e){if(isNaN(e)||!isFinite(e))return d;if(e<0)return h(l(-e));let t=[],n=1;for(let r=0;e>=n;r++)t[r]=e/n|0,n*=4294967296;return new o(t,0)}function u(e,t){if(e.length==0)throw Error(`number format error: empty string`);if(t||=10,t<2||36<t)throw Error(`radix out of range: `+t);if(e.charAt(0)==`-`)return h(u(e.substring(1),t));if(e.indexOf(`-`)>=0)throw Error(`number format error: interior "-" character`);let n=l(t**8),r=d;for(let a=0;a<e.length;a+=8){var i=Math.min(8,e.length-a);let o=parseInt(e.substring(a,a+i),t);i<8?(i=l(t**+i),r=r.j(i).add(l(o))):(r=r.j(n),r=r.add(l(o)))}return r}var d=c(0),f=c(1),p=c(16777216);e=o.prototype,e.m=function(){if(ee(this))return-h(this).m();let e=0,t=1;for(let n=0;n<this.g.length;n++){let r=this.i(n);e+=(r>=0?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if(e||=10,e<2||36<e)throw Error(`radix out of range: `+e);if(m(this))return`0`;if(ee(this))return`-`+h(this).toString(e);let t=l(e**6);var n=this;let r=``;for(;;){let i=ie(n,t).g;n=te(n,i.j(t));let a=((n.g.length>0?n.g[0]:n.h)>>>0).toString(e);if(n=i,m(n))return a+r;for(;a.length<6;)a=`0`+a;r=a+r}},e.i=function(e){return e<0?0:e<this.g.length?this.g[e]:this.h};function m(e){if(e.h!=0)return!1;for(let t=0;t<e.g.length;t++)if(e.g[t]!=0)return!1;return!0}function ee(e){return e.h==-1}e.l=function(e){return e=te(this,e),ee(e)?-1:m(e)?0:1};function h(e){let t=e.g.length,n=[];for(let r=0;r<t;r++)n[r]=~e.g[r];return new o(n,~e.h).add(f)}e.abs=function(){return ee(this)?h(this):this},e.add=function(e){let t=Math.max(this.g.length,e.g.length),n=[],r=0;for(let i=0;i<=t;i++){let t=r+(this.i(i)&65535)+(e.i(i)&65535),a=(t>>>16)+(this.i(i)>>>16)+(e.i(i)>>>16);r=a>>>16,t&=65535,a&=65535,n[i]=a<<16|t}return new o(n,n[n.length-1]&-2147483648?-1:0)};function te(e,t){return e.add(h(t))}e.j=function(e){if(m(this)||m(e))return d;if(ee(this))return ee(e)?h(this).j(h(e)):h(h(this).j(e));if(ee(e))return h(this.j(h(e)));if(this.l(p)<0&&e.l(p)<0)return l(this.m()*e.m());let t=this.g.length+e.g.length,n=[];for(var r=0;r<2*t;r++)n[r]=0;for(r=0;r<this.g.length;r++)for(let t=0;t<e.g.length;t++){let i=this.i(r)>>>16,a=this.i(r)&65535,o=e.i(t)>>>16,s=e.i(t)&65535;n[2*r+2*t]+=a*s,ne(n,2*r+2*t),n[2*r+2*t+1]+=i*s,ne(n,2*r+2*t+1),n[2*r+2*t+1]+=a*o,ne(n,2*r+2*t+1),n[2*r+2*t+2]+=i*o,ne(n,2*r+2*t+2)}for(e=0;e<t;e++)n[e]=n[2*e+1]<<16|n[2*e];for(e=t;e<2*t;e++)n[e]=0;return new o(n,0)};function ne(e,t){for(;(e[t]&65535)!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function re(e,t){this.g=e,this.h=t}function ie(e,t){if(m(t))throw Error(`division by zero`);if(m(e))return new re(d,d);if(ee(e))return t=ie(h(e),t),new re(h(t.g),h(t.h));if(ee(t))return t=ie(e,h(t)),new re(h(t.g),t.h);if(e.g.length>30){if(ee(e)||ee(t))throw Error(`slowDivide_ only works with positive integers.`);for(var n=f,r=t;r.l(e)<=0;)n=ae(n),r=ae(r);var i=oe(n,1),a=oe(r,1);for(r=oe(r,2),n=oe(n,2);!m(r);){var o=a.add(r);o.l(e)<=0&&(i=i.add(n),a=o),r=oe(r,1),n=oe(n,1)}return t=te(e,i.j(t)),new re(i,t)}for(i=d;e.l(t)>=0;){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=Math.ceil(Math.log(n)/Math.LN2),r=r<=48?1:2**(r-48),a=l(n),o=a.j(t);ee(o)||o.l(e)>0;)n-=r,a=l(n),o=a.j(t);m(a)&&(a=f),i=i.add(a),e=te(e,o)}return new re(i,e)}e.B=function(e){return ie(this,e).h},e.and=function(e){let t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)&e.i(r);return new o(n,this.h&e.h)},e.or=function(e){let t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)|e.i(r);return new o(n,this.h|e.h)},e.xor=function(e){let t=Math.max(this.g.length,e.g.length),n=[];for(let r=0;r<t;r++)n[r]=this.i(r)^e.i(r);return new o(n,this.h^e.h)};function ae(e){let t=e.g.length+1,n=[];for(let r=0;r<t;r++)n[r]=e.i(r)<<1|e.i(r-1)>>>31;return new o(n,e.h)}function oe(e,t){let n=t>>5;t%=32;let r=e.g.length-n,i=[];for(let a=0;a<r;a++)i[a]=t>0?e.i(a+n)>>>t|e.i(a+n+1)<<32-t:e.i(a+n);return new o(i,e.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,gs=ms.Md5=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=u,hs=ms.Integer=o}).apply(ps===void 0?typeof self<`u`?self:typeof window<`u`?window:{}:ps);var _s=typeof globalThis<`u`?globalThis:typeof window<`u`?window:typeof global<`u`?global:typeof self<`u`?self:{},vs={},ys,bs,xs,Ss,Cs,ws,Ts,Es;(function(){var e,t=Object.defineProperty;function n(e){e=[typeof globalThis==`object`&&globalThis,e,typeof window==`object`&&window,typeof self==`object`&&self,typeof _s==`object`&&_s];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error(`Cannot find global object`)}var r=n(this);function i(e,n){if(n)a:{var i=r;e=e.split(`.`);for(var a=0;a<e.length-1;a++){var o=e[a];if(!(o in i))break a;i=i[o]}e=e[e.length-1],a=i[e],n=n(a),n!=a&&n!=null&&t(i,e,{configurable:!0,writable:!0,value:n})}}i(`Symbol.dispose`,function(e){return e||Symbol(`Symbol.dispose`)}),i(`Array.prototype.values`,function(e){return e||function(){return this[Symbol.iterator]()}}),i(`Object.entries`,function(e){return e||function(e){var t=[],n;for(n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.push([n,e[n]]);return t}});var a=a||{},o=this||self;function s(e){var t=typeof e;return t==`object`&&e!=null||t==`function`}function c(e,t,n){return e.call.apply(e.bind,arguments)}function l(e,t,n){return l=c,l.apply(null,arguments)}function u(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function d(e,t){function n(){}n.prototype=t.prototype,e.Z=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Ob=function(e,n,r){for(var i=Array(arguments.length-2),a=2;a<arguments.length;a++)i[a-2]=arguments[a];return t.prototype[n].apply(e,i)}}var f=typeof AsyncContext<`u`&&typeof AsyncContext.Snapshot==`function`?e=>e&&AsyncContext.Snapshot.wrap(e):e=>e;function p(e){let t=e.length;if(t>0){let n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function m(e,t){for(let t=1;t<arguments.length;t++){let r=arguments[t];var n=typeof r;if(n=n==`object`?r?Array.isArray(r)?`array`:n:`null`:n,n==`array`||n==`object`&&typeof r.length==`number`){n=e.length||0;let t=r.length||0;e.length=n+t;for(let i=0;i<t;i++)e[n+i]=r[i]}else e.push(r)}}class ee{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return this.h>0?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}function h(e){o.setTimeout(()=>{throw e},0)}function te(){var e=se;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}class ne{constructor(){this.h=this.g=null}add(e,t){let n=re.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}}var re=new ee(()=>new ie,e=>e.reset());class ie{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let ae,oe=!1,se=new ne,g=()=>{let e=Promise.resolve(void 0);ae=()=>{e.then(ce)}};function ce(){for(var e;e=te();){try{e.h.call(e.g)}catch(e){h(e)}var t=re;t.j(e),t.h<100&&(t.h++,e.next=t.g,t.g=e)}oe=!1}function le(){this.u=this.u,this.C=this.C}le.prototype.u=!1,le.prototype.dispose=function(){this.u||(this.u=!0,this.N())},le.prototype[Symbol.dispose]=function(){this.dispose()},le.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function _(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}_.prototype.h=function(){this.defaultPrevented=!0};var ue=function(){if(!o.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},`passive`,{get:function(){e=!0}});try{let e=()=>{};o.addEventListener(`test`,e,t),o.removeEventListener(`test`,e,t)}catch{}return e}();function de(e){return/^[\s\xa0]*$/.test(e)}function fe(e,t){_.call(this,e?e.type:``),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key=``,this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType=``,this.i=null,e&&this.init(e,t)}d(fe,_),fe.prototype.init=function(e,t){let n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget,t||(n==`mouseover`?t=e.fromElement:n==`mouseout`&&(t=e.toElement)),this.relatedTarget=t,r?(this.clientX=r.clientX===void 0?r.pageX:r.clientX,this.clientY=r.clientY===void 0?r.pageY:r.clientY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=e.clientX===void 0?e.pageX:e.clientX,this.clientY=e.clientY===void 0?e.pageY:e.clientY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||``,this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType=e.pointerType,this.state=e.state,this.i=e,e.defaultPrevented&&fe.Z.h.call(this)},fe.prototype.h=function(){fe.Z.h.call(this);let e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var pe=`closure_listenable_`+(Math.random()*1e6|0),me=0;function he(e,t,n,r,i){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=i,this.key=++me,this.da=this.fa=!1}function ge(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function _e(e,t,n){for(let r in e)t.call(n,e[r],r,e)}function ve(e,t){for(let n in e)t.call(void 0,e[n],n,e)}function ye(e){let t={};for(let n in e)t[n]=e[n];return t}let be=`constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf`.split(` `);function xe(e,t){let n,r;for(let t=1;t<arguments.length;t++){for(n in r=arguments[t],r)e[n]=r[n];for(let t=0;t<be.length;t++)n=be[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function Se(e){this.src=e,this.g={},this.h=0}Se.prototype.add=function(e,t,n,r,i){let a=e.toString();e=this.g[a],e||(e=this.g[a]=[],this.h++);let o=we(e,t,r,i);return o>-1?(t=e[o],n||(t.fa=!1)):(t=new he(t,this.src,a,!!r,i),t.fa=n,e.push(t)),t};function Ce(e,t){let n=t.type;if(n in e.g){var r=e.g[n],i=Array.prototype.indexOf.call(r,t,void 0),a;(a=i>=0)&&Array.prototype.splice.call(r,i,1),a&&(ge(t),e.g[n].length==0&&(delete e.g[n],e.h--))}}function we(e,t,n,r){for(let i=0;i<e.length;++i){let a=e[i];if(!a.da&&a.listener==t&&a.capture==!!n&&a.ha==r)return i}return-1}var Te=`closure_lm_`+(Math.random()*1e6|0),Ee={};function De(e,t,n,r,i){if(r&&r.once)return Ae(e,t,n,r,i);if(Array.isArray(t)){for(let a=0;a<t.length;a++)De(e,t[a],n,r,i);return null}return n=Ie(n),e&&e[pe]?e.J(t,n,s(r)?!!r.capture:!!r,i):Oe(e,t,n,!1,r,i)}function Oe(e,t,n,r,i,a){if(!t)throw Error(`Invalid event type`);let o=s(i)?!!i.capture:!!i,c=Pe(e);if(c||(e[Te]=c=new Se(e)),n=c.add(t,n,r,o,a),n.proxy)return n;if(r=ke(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)ue||(i=o),i===void 0&&(i=!1),e.addEventListener(t.toString(),r,i);else if(e.attachEvent)e.attachEvent(Me(t.toString()),r);else if(e.addListener&&e.removeListener)e.addListener(r);else throw Error(`addEventListener and attachEvent are unavailable.`);return n}function ke(){function e(n){return t.call(e.src,e.listener,n)}let t=Ne;return e}function Ae(e,t,n,r,i){if(Array.isArray(t)){for(let a=0;a<t.length;a++)Ae(e,t[a],n,r,i);return null}return n=Ie(n),e&&e[pe]?e.K(t,n,s(r)?!!r.capture:!!r,i):Oe(e,t,n,!0,r,i)}function je(e,t,n,r,i){if(Array.isArray(t))for(var a=0;a<t.length;a++)je(e,t[a],n,r,i);else r=s(r)?!!r.capture:!!r,n=Ie(n),e&&e[pe]?(e=e.i,a=String(t).toString(),a in e.g&&(t=e.g[a],n=we(t,n,r,i),n>-1&&(ge(t[n]),Array.prototype.splice.call(t,n,1),t.length==0&&(delete e.g[a],e.h--)))):(e&&=Pe(e))&&(t=e.g[t.toString()],e=-1,t&&(e=we(t,n,r,i)),(n=e>-1?t[e]:null)&&v(n))}function v(e){if(typeof e!=`number`&&e&&!e.da){var t=e.src;if(t&&t[pe])Ce(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent(Me(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=Pe(t))?(Ce(n,e),n.h==0&&(n.src=null,t[Te]=null)):ge(e)}}}function Me(e){return e in Ee?Ee[e]:Ee[e]=`on`+e}function Ne(e,t){if(e.da)e=!0;else{t=new fe(t,this);let n=e.listener,r=e.ha||e.src;e.fa&&v(e),e=n.call(r,t)}return e}function Pe(e){return e=e[Te],e instanceof Se?e:null}var Fe=`__closure_events_fn_`+(Math.random()*1e9>>>0);function Ie(e){return typeof e==`function`?e:(e[Fe]||(e[Fe]=function(t){return e.handleEvent(t)}),e[Fe])}function y(){le.call(this),this.i=new Se(this),this.M=this,this.G=null}d(y,le),y.prototype[pe]=!0,y.prototype.removeEventListener=function(e,t,n,r){je(this,e,t,n,r)};function Le(e,t){var n,r=e.G;if(r)for(n=[];r;r=r.G)n.push(r);if(e=e.M,r=t.type||t,typeof t==`string`)t=new _(t,e);else if(t instanceof _)t.target=t.target||e;else{var i=t;t=new _(r,e),xe(t,i)}i=!0;let a,o;if(n)for(o=n.length-1;o>=0;o--)a=t.g=n[o],i=b(a,r,!0,t)&&i;if(a=t.g=e,i=b(a,r,!0,t)&&i,i=b(a,r,!1,t)&&i,n)for(o=0;o<n.length;o++)a=t.g=n[o],i=b(a,r,!1,t)&&i}y.prototype.N=function(){if(y.Z.N.call(this),this.i){var e=this.i;for(let t in e.g){let n=e.g[t];for(let e=0;e<n.length;e++)ge(n[e]);delete e.g[t],e.h--}}this.G=null},y.prototype.J=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},y.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};function b(e,t,n,r){if(t=e.i.g[String(t)],!t)return!0;t=t.concat();let i=!0;for(let a=0;a<t.length;++a){let o=t[a];if(o&&!o.da&&o.capture==n){let t=o.listener,n=o.ha||o.src;o.fa&&Ce(e.i,o),i=t.call(n,r)!==!1&&i}}return i&&!r.defaultPrevented}function Re(e,t){if(typeof e!=`function`)if(e&&typeof e.handleEvent==`function`)e=l(e.handleEvent,e);else throw Error(`Invalid listener argument`);return Number(t)>2147483647?-1:o.setTimeout(e,t||0)}function ze(e){e.g=Re(()=>{e.g=null,e.i&&(e.i=!1,ze(e))},e.l);let t=e.h;e.h=null,e.m.apply(null,t)}class Be extends le{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:ze(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ve(e){le.call(this),this.h=e,this.g={}}d(Ve,le);var He=[];function Ue(e){_e(e.g,function(e,t){this.g.hasOwnProperty(t)&&v(e)},e),e.g={}}Ve.prototype.N=function(){Ve.Z.N.call(this),Ue(this)},Ve.prototype.handleEvent=function(){throw Error(`EventHandler.handleEvent not implemented`)};var We=o.JSON.stringify,Ge=o.JSON.parse,Ke=class{stringify(e){return o.JSON.stringify(e,void 0)}parse(e){return o.JSON.parse(e,void 0)}};function qe(){}function Je(){}var Ye={OPEN:`a`,hb:`b`,ERROR:`c`,tb:`d`};function Xe(){_.call(this,`d`)}d(Xe,_);function Ze(){_.call(this,`c`)}d(Ze,_);var Qe={},$e=null;function et(){return $e||=new y}Qe.Ia=`serverreachability`;function tt(e){_.call(this,Qe.Ia,e)}d(tt,_);function nt(e){let t=et();Le(t,new tt(t))}Qe.STAT_EVENT=`statevent`;function rt(e,t){_.call(this,Qe.STAT_EVENT,e),this.stat=t}d(rt,_);function it(e){let t=et();Le(t,new rt(t,e))}Qe.Ja=`timingevent`;function at(e,t){_.call(this,Qe.Ja,e),this.size=t}d(at,_);function ot(e,t){if(typeof e!=`function`)throw Error(`Fn must not be null and must be a function`);return o.setTimeout(function(){e()},t)}function st(){this.g=!0}st.prototype.ua=function(){this.g=!1};function ct(e,t,n,r,i,a){e.info(function(){if(e.g)if(a){var o=``,s=a.split(`&`);for(let e=0;e<s.length;e++){var c=s[e].split(`=`);if(c.length>1){let e=c[0];c=c[1];let t=e.split(`_`);o=t.length>=2&&t[1]==`type`?o+(e+`=`+c+`&`):o+(e+`=redacted&`)}}}else o=null;else o=a;return`XMLHTTP REQ (`+r+`) [attempt `+i+`]: `+t+`
`+n+`
`+o})}function lt(e,t,n,r,i,a,o){e.info(function(){return`XMLHTTP RESP (`+r+`) [ attempt `+i+`]: `+t+`
`+n+`
`+a+` `+o})}function ut(e,t,n,r){e.info(function(){return`XMLHTTP TEXT (`+t+`): `+ft(e,n)+(r?` `+r:``)})}function dt(e,t){e.info(function(){return`TIMEOUT: `+t})}st.prototype.info=function(){};function ft(e,t){if(!e.g)return t;if(!t)return null;try{let a=JSON.parse(t);if(a){for(e=0;e<a.length;e++)if(Array.isArray(a[e])){var n=a[e];if(!(n.length<2)){var r=n[1];if(Array.isArray(r)&&!(r.length<1)){var i=r[0];if(i!=`noop`&&i!=`stop`&&i!=`close`)for(let e=1;e<r.length;e++)r[e]=``}}}}return We(a)}catch{return t}}var pt={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},mt={ib:`complete`,Fb:`success`,ERROR:`error`,Ga:`abort`,xb:`ready`,yb:`readystatechange`,TIMEOUT:`timeout`,sb:`incrementaldata`,wb:`progress`,lb:`downloadprogress`,Nb:`uploadprogress`},ht;function gt(){}d(gt,qe),gt.prototype.g=function(){return new XMLHttpRequest},ht=new gt;function _t(e){return encodeURIComponent(String(e))}function vt(e){var t=1;e=e.split(`:`);let n=[];for(;t>0&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(`:`)),n}function yt(e,t,n,r){this.j=e,this.i=t,this.l=n,this.S=r||1,this.V=new Ve(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new bt}function bt(){this.i=null,this.g=``,this.h=!1}var xt={},St={};function Ct(e,t,n){e.M=1,e.A=Yt(Gt(t)),e.u=n,e.R=!0,wt(e,null)}function wt(e,t){e.F=Date.now(),Ot(e),e.B=Gt(e.A);var n=e.B,r=e.S;Array.isArray(r)||(r=[String(r)]),un(n.i,`t`,r),e.C=0,n=e.j.L,e.h=new bt,e.g=Zn(e.j,n?t:null,!e.u),e.P>0&&(e.O=new Be(l(e.Y,e,e.g),e.P)),t=e.V,n=e.g,r=e.ba;var i=`readystatechange`;Array.isArray(i)||(i&&(He[0]=i.toString()),i=He);for(let e=0;e<i.length;e++){let a=De(n,i[e],r||t.handleEvent,!1,t.h||t);if(!a)break;t.g[a.key]=a}t=e.J?ye(e.J):{},e.u?(e.v||=`POST`,t[`Content-Type`]=`application/x-www-form-urlencoded`,e.g.ea(e.B,e.v,e.u,t)):(e.v=`GET`,e.g.ea(e.B,e.v,null,t)),nt(),ct(e.i,e.v,e.B,e.l,e.S,e.u)}yt.prototype.ba=function(e){e=e.target;let t=this.O;t&&jn(e)==3?t.j():this.Y(e)},yt.prototype.Y=function(e){try{if(e==this.g)a:{let s=jn(this.g),c=this.g.ya(),l=this.g.ca();if(!(s<3)&&(s!=3||this.g&&(this.h.h||this.g.la()||C(this.g)))){this.K||s!=4||c==7||nt(c==8||l<=0?3:2),At(this);var t=this.g.ca();this.X=t;var n=Tt(this);if(this.o=t==200,lt(this.i,this.v,this.B,this.l,this.S,s,t),this.o){if(this.U&&!this.L){b:{if(this.g){var r,i=this.g;if((r=i.g?i.g.getResponseHeader(`X-HTTP-Initial-Response`):null)&&!de(r)){var a=r;break b}}a=null}if(e=a)ut(this.i,this.l,e,`Initial handshake response via X-HTTP-Initial-Response`),this.L=!0,Nt(this,e);else{this.o=!1,this.m=3,it(12),Mt(this),jt(this);break a}}if(this.R){e=!0;let t;for(;!this.K&&this.C<n.length;)if(t=Dt(this,n),t==St){s==4&&(this.m=4,it(14),e=!1),ut(this.i,this.l,null,`[Incomplete Response]`);break}else if(t==xt){this.m=4,it(15),ut(this.i,this.l,n,`[Invalid Chunk]`),e=!1;break}else ut(this.i,this.l,t,null),Nt(this,t);if(Et(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),s!=4||n.length!=0||this.h.h||(this.m=1,it(16),e=!1),this.o=this.o&&e,!e)ut(this.i,this.l,n,`[Invalid Chunked Response]`),Mt(this),jt(this);else if(n.length>0&&!this.W){this.W=!0;var o=this.j;o.g==this&&o.aa&&!o.P&&(o.j.info(`Great, no buffering proxy detected. Bytes received: `+n.length),w(o),o.P=!0,it(11))}}else ut(this.i,this.l,n,null),Nt(this,n);s==4&&Mt(this),this.o&&!this.K&&(s==4?Kn(this.j,this):(this.o=!1,Ot(this)))}else Mn(this.g),t==400&&n.indexOf(`Unknown SID`)>0?(this.m=3,it(12)):(this.m=0,it(13)),Mt(this),jt(this)}}}catch{}};function Tt(e){if(!Et(e))return e.g.la();let t=C(e.g);if(t===``)return``;let n=``,r=t.length,i=jn(e.g)==4;if(!e.h.i){if(typeof TextDecoder>`u`)return Mt(e),jt(e),``;e.h.i=new o.TextDecoder}for(let a=0;a<r;a++)e.h.h=!0,n+=e.h.i.decode(t[a],{stream:!(i&&a==r-1)});return t.length=0,e.h.g+=n,e.C=0,e.h.g}function Et(e){return e.g?e.v==`GET`&&e.M!=2&&e.j.Aa:!1}function Dt(e,t){var n=e.C,r=t.indexOf(`
`,n);return r==-1?St:(n=Number(t.substring(n,r)),isNaN(n)?xt:(r+=1,r+n>t.length?St:(t=t.slice(r,r+n),e.C=r+n,t)))}yt.prototype.cancel=function(){this.K=!0,Mt(this)};function Ot(e){e.T=Date.now()+e.H,kt(e,e.H)}function kt(e,t){if(e.D!=null)throw Error(`WatchDog timer not null`);e.D=ot(l(e.aa,e),t)}function At(e){e.D&&=(o.clearTimeout(e.D),null)}yt.prototype.aa=function(){this.D=null;let e=Date.now();e-this.T>=0?(dt(this.i,this.B),this.M!=2&&(nt(),it(17)),Mt(this),this.m=2,jt(this)):kt(this,this.T-e)};function jt(e){e.j.I==0||e.K||Kn(e.j,e)}function Mt(e){At(e);var t=e.O;t&&typeof t.dispose==`function`&&t.dispose(),e.O=null,Ue(e.V),e.g&&(t=e.g,e.g=null,t.abort(),t.dispose())}function Nt(e,t){try{var n=e.j;if(n.I!=0&&(n.g==e||Rt(n.h,e))){if(!e.L&&Rt(n.h,e)&&n.I==3){try{var r=n.Ba.g.parse(t)}catch{r=null}if(Array.isArray(r)&&r.length==3){var i=r;if(i[0]==0){a:if(!n.v){if(n.g)if(n.g.F+3e3<e.F)Gn(n),In(n);else break a;Wn(n),it(18)}}else n.xa=i[1],0<n.xa-n.K&&i[2]<37500&&n.F&&n.A==0&&!n.C&&(n.C=ot(l(n.Va,n),6e3));Lt(n.h)<=1&&n.ta&&(n.ta=void 0)}else Jn(n,11)}else if((e.L||n.g==e)&&Gn(n),!de(t))for(i=n.Ba.g.parse(t),t=0;t<i.length;t++){let l=i[t],u=l[0];if(!(u<=n.K))if(n.K=u,l=l[1],n.I==2)if(l[0]==`c`){n.M=l[1],n.ba=l[2];let t=l[3];t!=null&&(n.ka=t,n.j.info(`VER=`+n.ka));let i=l[4];i!=null&&(n.za=i,n.j.info(`SVER=`+n.za));let u=l[5];u!=null&&typeof u==`number`&&u>0&&(r=1.5*u,n.O=r,n.j.info(`backChannelRequestTimeoutMs_=`+r)),r=n;let d=e.g;if(d){let e=d.g?d.g.getResponseHeader(`X-Client-Wire-Protocol`):null;if(e){var a=r.h;a.g||e.indexOf(`spdy`)==-1&&e.indexOf(`quic`)==-1&&e.indexOf(`h2`)==-1||(a.j=a.l,a.g=new Set,a.h&&=(zt(a,a.h),null))}if(r.G){let e=d.g?d.g.getResponseHeader(`X-HTTP-Session-Id`):null;e&&(r.wa=e,x(r.J,r.G,e))}}n.I=3,n.l&&n.l.ra(),n.aa&&(n.T=Date.now()-e.F,n.j.info(`Handshake RTT: `+n.T+`ms`)),r=n;var o=e;if(r.na=Xn(r,r.L?r.ba:null,r.W),o.L){Bt(r.h,o);var s=o,c=r.O;c&&(s.H=c),s.D&&(At(s),Ot(s)),r.g=o}else Un(r);n.i.length>0&&Rn(n)}else l[0]!=`stop`&&l[0]!=`close`||Jn(n,7);else n.I==3&&(l[0]==`stop`||l[0]==`close`?l[0]==`stop`?Jn(n,7):Fn(n):l[0]!=`noop`&&n.l&&n.l.qa(l),n.A=0)}}nt(4)}catch{}}var Pt=class{constructor(e,t){this.g=e,this.map=t}};function Ft(e){this.l=e||10,o.PerformanceNavigationTiming?(e=o.performance.getEntriesByType(`navigation`),e=e.length>0&&(e[0].nextHopProtocol==`hq`||e[0].nextHopProtocol==`h2`)):e=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function It(e){return e.h?!0:e.g?e.g.size>=e.j:!1}function Lt(e){return e.h?1:e.g?e.g.size:0}function Rt(e,t){return e.h?e.h==t:e.g?e.g.has(t):!1}function zt(e,t){e.g?e.g.add(t):e.h=t}function Bt(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}Ft.prototype.cancel=function(){if(this.i=Vt(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(let e of this.g.values())e.cancel();this.g.clear()}};function Vt(e){if(e.h!=null)return e.i.concat(e.h.G);if(e.g!=null&&e.g.size!==0){let t=e.i;for(let n of e.g.values())t=t.concat(n.G);return t}return p(e.i)}var Ht=RegExp(`^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$`);function Ut(e,t){if(e){e=e.split(`&`);for(let n=0;n<e.length;n++){let r=e[n].indexOf(`=`),i,a=null;r>=0?(i=e[n].substring(0,r),a=e[n].substring(r+1)):i=e[n],t(i,a?decodeURIComponent(a.replace(/\+/g,` `)):``)}}}function Wt(e){this.g=this.o=this.j=``,this.u=null,this.m=this.h=``,this.l=!1;let t;e instanceof Wt?(this.l=e.l,Kt(this,e.j),this.o=e.o,this.g=e.g,qt(this,e.u),this.h=e.h,Jt(this,dn(e.i)),this.m=e.m):e&&(t=String(e).match(Ht))?(this.l=!1,Kt(this,t[1]||``,!0),this.o=Xt(t[2]||``),this.g=Xt(t[3]||``,!0),qt(this,t[4]),this.h=Xt(t[5]||``,!0),Jt(this,t[6]||``,!0),this.m=Xt(t[7]||``)):(this.l=!1,this.i=new an(null,this.l))}Wt.prototype.toString=function(){let e=[];var t=this.j;t&&e.push(Zt(t,$t,!0),`:`);var n=this.g;return(n||t==`file`)&&(e.push(`//`),(t=this.o)&&e.push(Zt(t,$t,!0),`@`),e.push(_t(n).replace(/%25([0-9a-fA-F]{2})/g,`%$1`)),n=this.u,n!=null&&e.push(`:`,String(n))),(n=this.h)&&(this.g&&n.charAt(0)!=`/`&&e.push(`/`),e.push(Zt(n,n.charAt(0)==`/`?tn:en,!0))),(n=this.i.toString())&&e.push(`?`,n),(n=this.m)&&e.push(`#`,Zt(n,rn)),e.join(``)},Wt.prototype.resolve=function(e){let t=Gt(this),n=!!e.j;n?Kt(t,e.j):n=!!e.o,n?t.o=e.o:n=!!e.g,n?t.g=e.g:n=e.u!=null;var r=e.h;if(n)qt(t,e.u);else if(n=!!e.h){if(r.charAt(0)!=`/`)if(this.g&&!this.h)r=`/`+r;else{var i=t.h.lastIndexOf(`/`);i!=-1&&(r=t.h.slice(0,i+1)+r)}if(i=r,i==`..`||i==`.`)r=``;else if(i.indexOf(`./`)!=-1||i.indexOf(`/.`)!=-1){r=i.lastIndexOf(`/`,0)==0,i=i.split(`/`);let e=[];for(let t=0;t<i.length;){let n=i[t++];n==`.`?r&&t==i.length&&e.push(``):n==`..`?((e.length>1||e.length==1&&e[0]!=``)&&e.pop(),r&&t==i.length&&e.push(``)):(e.push(n),r=!0)}r=e.join(`/`)}else r=i}return n?t.h=r:n=e.i.toString()!==``,n?Jt(t,dn(e.i)):n=!!e.m,n&&(t.m=e.m),t};function Gt(e){return new Wt(e)}function Kt(e,t,n){e.j=n?Xt(t,!0):t,e.j&&=e.j.replace(/:$/,``)}function qt(e,t){if(t){if(t=Number(t),isNaN(t)||t<0)throw Error(`Bad port number `+t);e.u=t}else e.u=null}function Jt(e,t,n){t instanceof an?(e.i=t,pn(e.i,e.l)):(n||(t=Zt(t,nn)),e.i=new an(t,e.l))}function x(e,t,n){e.i.set(t,n)}function Yt(e){return x(e,`zx`,Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),e}function Xt(e,t){return e?t?decodeURI(e.replace(/%25/g,`%2525`)):decodeURIComponent(e):``}function Zt(e,t,n){return typeof e==`string`?(e=encodeURI(e).replace(t,Qt),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,`%$1`)),e):null}function Qt(e){return e=e.charCodeAt(0),`%`+(e>>4&15).toString(16)+(e&15).toString(16)}var $t=/[#\/\?@]/g,en=/[#\?:]/g,tn=/[#\?]/g,nn=/[#\?@]/g,rn=/#/g;function an(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function on(e){e.g||(e.g=new Map,e.h=0,e.i&&Ut(e.i,function(t,n){e.add(decodeURIComponent(t.replace(/\+/g,` `)),n)}))}e=an.prototype,e.add=function(e,t){on(this),this.i=null,e=fn(this,e);let n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this};function sn(e,t){on(e),t=fn(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function cn(e,t){return on(e),t=fn(e,t),e.g.has(t)}e.forEach=function(e,t){on(this),this.g.forEach(function(n,r){n.forEach(function(n){e.call(t,n,r,this)},this)},this)};function ln(e,t){on(e);let n=[];if(typeof t==`string`)cn(e,t)&&(n=n.concat(e.g.get(fn(e,t))));else for(e=Array.from(e.g.values()),t=0;t<e.length;t++)n=n.concat(e[t]);return n}e.set=function(e,t){return on(this),this.i=null,e=fn(this,e),cn(this,e)&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e?(e=ln(this,e),e.length>0?String(e[0]):t):t};function un(e,t,n){sn(e,t),n.length>0&&(e.i=null,e.g.set(fn(e,t),p(n)),e.h+=n.length)}e.toString=function(){if(this.i)return this.i;if(!this.g)return``;let e=[],t=Array.from(this.g.keys());for(let r=0;r<t.length;r++){var n=t[r];let i=_t(n);n=ln(this,n);for(let t=0;t<n.length;t++){let r=i;n[t]!==``&&(r+=`=`+_t(n[t])),e.push(r)}}return this.i=e.join(`&`)};function dn(e){let t=new an;return t.i=e.i,e.g&&(t.g=new Map(e.g),t.h=e.h),t}function fn(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function pn(e,t){t&&!e.j&&(on(e),e.i=null,e.g.forEach(function(e,t){let n=t.toLowerCase();t!=n&&(sn(this,t),un(this,n,e))},e)),e.j=t}function mn(e,t){let n=new st;if(o.Image){let r=new Image;r.onload=u(gn,n,`TestLoadImage: loaded`,!0,t,r),r.onerror=u(gn,n,`TestLoadImage: error`,!1,t,r),r.onabort=u(gn,n,`TestLoadImage: abort`,!1,t,r),r.ontimeout=u(gn,n,`TestLoadImage: timeout`,!1,t,r),o.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=e}else t(!1)}function hn(e,t){let n=new st,r=new AbortController,i=setTimeout(()=>{r.abort(),gn(n,`TestPingServer: timeout`,!1,t)},1e4);fetch(e,{signal:r.signal}).then(e=>{clearTimeout(i),e.ok?gn(n,`TestPingServer: ok`,!0,t):gn(n,`TestPingServer: server error`,!1,t)}).catch(()=>{clearTimeout(i),gn(n,`TestPingServer: error`,!1,t)})}function gn(e,t,n,r,i){try{i&&(i.onload=null,i.onerror=null,i.onabort=null,i.ontimeout=null),r(n)}catch{}}function _n(){this.g=new Ke}function vn(e){this.i=e.Sb||null,this.h=e.ab||!1}d(vn,qe),vn.prototype.g=function(){return new yn(this.i,this.h)};function yn(e,t){y.call(this),this.H=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText=``,this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F=`GET`,this.D=``,this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}d(yn,y),e=yn.prototype,e.open=function(e,t){if(this.readyState!=0)throw this.abort(),Error(`Error reopening a connection`);this.F=e,this.D=t,this.readyState=1,Sn(this)},e.send=function(e){if(this.readyState!=1)throw this.abort(),Error(`need to call open() first. `);if(this.v.signal.aborted)throw this.abort(),Error(`Request was aborted.`);this.g=!0;let t={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};e&&(t.body=e),(this.H||o).fetch(new Request(this.D,t)).then(this.Pa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText=``,this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel(`Request was aborted.`).catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,xn(this)),this.readyState=0},e.Pa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,Sn(this)),this.g&&(this.readyState=3,Sn(this),this.g)))if(this.responseType===`arraybuffer`)e.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(o.ReadableStream!==void 0&&`body`in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error(`responseType must be empty for "streamBinaryChunks" mode responses.`);this.response=[]}else this.response=this.responseText=``,this.B=new TextDecoder;bn(this)}else e.text().then(this.Oa.bind(this),this.ga.bind(this))};function bn(e){e.j.read().then(e.Ma.bind(e)).catch(e.ga.bind(e))}e.Ma=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array;(t=this.B.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?xn(this):Sn(this),this.readyState==3&&bn(this)}},e.Oa=function(e){this.g&&(this.response=this.responseText=e,xn(this))},e.Na=function(e){this.g&&(this.response=e,xn(this))},e.ga=function(){this.g&&xn(this)};function xn(e){e.readyState=4,e.l=null,e.j=null,e.B=null,Sn(e)}e.setRequestHeader=function(e,t){this.A.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||``},e.getAllResponseHeaders=function(){if(!this.h)return``;let e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+`: `+n[1]),n=t.next();return e.join(`\r
`)};function Sn(e){e.onreadystatechange&&e.onreadystatechange.call(e)}Object.defineProperty(yn.prototype,`withCredentials`,{get:function(){return this.m===`include`},set:function(e){this.m=e?`include`:`same-origin`}});function Cn(e){let t=``;return _e(e,function(e,n){t+=n,t+=`:`,t+=e,t+=`\r
`}),t}function wn(e,t,n){a:{for(r in n){var r=!1;break a}r=!0}r||(n=Cn(n),typeof e==`string`||x(e,t,n))}function S(e){y.call(this),this.headers=new Map,this.L=e||null,this.h=!1,this.g=null,this.D=``,this.o=0,this.l=``,this.j=this.B=this.v=this.A=!1,this.m=null,this.F=``,this.H=!1}d(S,y);var Tn=/^https?$/i,En=[`POST`,`PUT`];e=S.prototype,e.Fa=function(e){this.H=e},e.ea=function(e,t,n,r){if(this.g)throw Error(`[goog.net.XhrIo] Object is active with another request=`+this.D+`; newUri=`+e);t=t?t.toUpperCase():`GET`,this.D=e,this.l=``,this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():ht.g(),this.g.onreadystatechange=f(l(this.Ca,this));try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(e){Dn(this,e);return}if(e=n||``,n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var i in r)n.set(i,r[i]);else if(typeof r.keys==`function`&&typeof r.get==`function`)for(let e of r.keys())n.set(e,r.get(e));else throw Error(`Unknown input type for opt_headers: `+String(r));r=Array.from(n.keys()).find(e=>e.toLowerCase()==`content-type`),i=o.FormData&&e instanceof o.FormData,!(Array.prototype.indexOf.call(En,t,void 0)>=0)||r||i||n.set(`Content-Type`,`application/x-www-form-urlencoded;charset=utf-8`);for(let[e,t]of n)this.g.setRequestHeader(e,t);this.F&&(this.g.responseType=this.F),`withCredentials`in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&=(clearTimeout(this.m),null),this.v=!0,this.g.send(e),this.v=!1}catch(e){Dn(this,e)}};function Dn(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.o=5,On(e),An(e)}function On(e){e.A||(e.A=!0,Le(e,`complete`),Le(e,`error`))}e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=e||7,Le(this,`complete`),Le(this,`abort`),An(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),An(this,!0)),S.Z.N.call(this)},e.Ca=function(){this.u||(this.B||this.v||this.j?kn(this):this.Xa())},e.Xa=function(){kn(this)};function kn(e){if(e.h&&a!==void 0){if(e.v&&jn(e)==4)setTimeout(e.Ca.bind(e),0);else if(Le(e,`readystatechange`),jn(e)==4){e.h=!1;try{let a=e.ca();a:switch(a){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break a;default:t=!1}var n;if(!(n=t)){var r;if(r=a===0){let t=String(e.D).match(Ht)[1]||null;!t&&o.self&&o.self.location&&(t=o.self.location.protocol.slice(0,-1)),r=!Tn.test(t?t.toLowerCase():``)}n=r}if(n)Le(e,`complete`),Le(e,`success`);else{e.o=6;try{var i=jn(e)>2?e.g.statusText:``}catch{i=``}e.l=i+` [`+e.ca()+`]`,On(e)}}finally{An(e)}}}}function An(e,t){if(e.g){e.m&&=(clearTimeout(e.m),null);let n=e.g;e.g=null,t||Le(e,`ready`);try{n.onreadystatechange=null}catch{}}}e.isActive=function(){return!!this.g};function jn(e){return e.g?e.g.readyState:0}e.ca=function(){try{return jn(this)>2?this.g.status:-1}catch{return-1}},e.la=function(){try{return this.g?this.g.responseText:``}catch{return``}},e.La=function(e){if(this.g){var t=this.g.responseText;return e&&t.indexOf(e)==0&&(t=t.substring(e.length)),Ge(t)}};function C(e){try{if(!e.g)return null;if(`response`in e.g)return e.g.response;switch(e.F){case``:case`text`:return e.g.responseText;case`arraybuffer`:if(`mozResponseArrayBuffer`in e.g)return e.g.mozResponseArrayBuffer}return null}catch{return null}}function Mn(e){let t={};e=(e.g&&jn(e)>=2&&e.g.getAllResponseHeaders()||``).split(`\r
`);for(let r=0;r<e.length;r++){if(de(e[r]))continue;var n=vt(e[r]);let i=n[0];if(n=n[1],typeof n!=`string`)continue;n=n.trim();let a=t[i]||[];t[i]=a,a.push(n)}ve(t,function(e){return e.join(`, `)})}e.ya=function(){return this.o},e.Ha=function(){return typeof this.l==`string`?this.l:String(this.l)};function Nn(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function Pn(e){this.za=0,this.i=[],this.j=new st,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Nn(`failFast`,!1,e),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Nn(`baseRetryDelayMs`,5e3,e),this.Za=Nn(`retryDelaySeedMs`,1e4,e),this.Ta=Nn(`forwardChannelMaxRetries`,2,e),this.va=Nn(`forwardChannelRequestTimeoutMs`,2e4,e),this.ma=e&&e.xmlHttpFactory||void 0,this.Ua=e&&e.Rb||void 0,this.Aa=e&&e.useFetchStreams||!1,this.O=void 0,this.L=e&&e.supportsCrossDomainXhr||!1,this.M=``,this.h=new Ft(e&&e.concurrentRequestLimit),this.Ba=new _n,this.S=e&&e.fastHandshake||!1,this.R=e&&e.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=e&&e.Pb||!1,e&&e.ua&&this.j.ua(),e&&e.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&e&&e.detectBufferingProxy||!1,this.ia=void 0,e&&e.longPollingTimeout&&e.longPollingTimeout>0&&(this.ia=e.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}e=Pn.prototype,e.ka=8,e.I=1,e.connect=function(e,t,n,r){it(0),this.W=e,this.H=t||{},n&&r!==void 0&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.J=Xn(this,null,this.W),Rn(this)};function Fn(e){if(Ln(e),e.I==3){var t=e.V++,n=Gt(e.J);if(x(n,`SID`,e.M),x(n,`RID`,t),x(n,`TYPE`,`terminate`),Vn(e,n),t=new yt(e,e.j,t),t.M=2,t.A=Yt(Gt(n)),n=!1,o.navigator&&o.navigator.sendBeacon)try{n=o.navigator.sendBeacon(t.A.toString(),``)}catch{}!n&&o.Image&&(new Image().src=t.A,n=!0),n||(t.g=Zn(t.j,null),t.g.ea(t.A)),t.F=Date.now(),Ot(t)}Yn(e)}function In(e){e.g&&=(w(e),e.g.cancel(),null)}function Ln(e){In(e),e.v&&=(o.clearTimeout(e.v),null),Gn(e),e.h.cancel(),e.m&&=(typeof e.m==`number`&&o.clearTimeout(e.m),null)}function Rn(e){if(!It(e.h)&&!e.m){e.m=!0;var t=e.Ea;ae||g(),oe||=(ae(),!0),se.add(t,e),e.D=0}}function zn(e,t){return Lt(e.h)>=e.h.j-(e.m?1:0)?!1:e.m?(e.i=t.G.concat(e.i),!0):e.I==1||e.I==2||e.D>=(e.Sa?0:e.Ta)?!1:(e.m=ot(l(e.Ea,e,t),qn(e,e.D)),e.D++,!0)}e.Ea=function(e){if(this.m)if(this.m=null,this.I==1){if(!e){this.V=Math.floor(Math.random()*1e5),e=this.V++;let i=new yt(this,this.j,e),a=this.o;if(this.U&&(a?(a=ye(a),xe(a,this.U)):a=this.U),this.u!==null||this.R||(i.J=a,a=null),this.S)a:{for(var t=0,n=0;n<this.i.length;n++){b:{var r=this.i[n];if(`__data__`in r.map&&(r=r.map.__data__,typeof r==`string`)){r=r.length;break b}r=void 0}if(r===void 0)break;if(t+=r,t>4096){t=n;break a}if(t===4096||n===this.i.length-1){t=n+1;break a}}t=1e3}else t=1e3;t=Hn(this,i,t),n=Gt(this.J),x(n,`RID`,e),x(n,`CVER`,22),this.G&&x(n,`X-HTTP-Session-Id`,this.G),Vn(this,n),a&&(this.R?t=`headers=`+_t(Cn(a))+`&`+t:this.u&&wn(n,this.u,a)),zt(this.h,i),this.Ra&&x(n,`TYPE`,`init`),this.S?(x(n,`$req`,t),x(n,`SID`,`null`),i.U=!0,Ct(i,n,null)):Ct(i,n,t),this.I=2}}else this.I==3&&(e?Bn(this,e):this.i.length==0||It(this.h)||Bn(this))};function Bn(e,t){var n=t?t.l:e.V++;let r=Gt(e.J);x(r,`SID`,e.M),x(r,`RID`,n),x(r,`AID`,e.K),Vn(e,r),e.u&&e.o&&wn(r,e.u,e.o),n=new yt(e,e.j,n,e.D+1),e.u===null&&(n.J=e.o),t&&(e.i=t.G.concat(e.i)),t=Hn(e,n,1e3),n.H=Math.round(e.va*.5)+Math.round(e.va*.5*Math.random()),zt(e.h,n),Ct(n,r,t)}function Vn(e,t){e.H&&_e(e.H,function(e,n){x(t,n,e)}),e.l&&_e({},function(e,n){x(t,n,e)})}function Hn(e,t,n){n=Math.min(e.i.length,n);let r=e.l?l(e.l.Ka,e.l,e):null;a:{var i=e.i;let t=-1;for(;;){let e=[`count=`+n];t==-1?n>0?(t=i[0].g,e.push(`ofs=`+t)):t=0:e.push(`ofs=`+t);let c=!0;for(let l=0;l<n;l++){var a=i[l].g;let n=i[l].map;if(a-=t,a<0)t=Math.max(0,i[l].g-100),c=!1;else try{a=`req`+a+`_`||``;try{var o=n instanceof Map?n:Object.entries(n);for(let[t,n]of o){let r=n;s(n)&&(r=We(n)),e.push(a+t+`=`+encodeURIComponent(r))}}catch(t){throw e.push(a+`type=_badmap`),t}}catch{r&&r(n)}}if(c){o=e.join(`&`);break a}}o=void 0}return e=e.i.splice(0,n),t.G=e,o}function Un(e){if(!e.g&&!e.v){e.Y=1;var t=e.Da;ae||g(),oe||=(ae(),!0),se.add(t,e),e.A=0}}function Wn(e){return e.g||e.v||e.A>=3?!1:(e.Y++,e.v=ot(l(e.Da,e),qn(e,e.A)),e.A++,!0)}e.Da=function(){if(this.v=null,T(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var e=4*this.T;this.j.info(`BP detection timer enabled: `+e),this.B=ot(l(this.Wa,this),e)}},e.Wa=function(){this.B&&(this.B=null,this.j.info(`BP detection timeout reached.`),this.j.info(`Buffering proxy detected and switch to long-polling!`),this.F=!1,this.P=!0,it(10),In(this),T(this))};function w(e){e.B!=null&&(o.clearTimeout(e.B),e.B=null)}function T(e){e.g=new yt(e,e.j,`rpc`,e.Y),e.u===null&&(e.g.J=e.o),e.g.P=0;var t=Gt(e.na);x(t,`RID`,`rpc`),x(t,`SID`,e.M),x(t,`AID`,e.K),x(t,`CI`,e.F?`0`:`1`),!e.F&&e.ia&&x(t,`TO`,e.ia),x(t,`TYPE`,`xmlhttp`),Vn(e,t),e.u&&e.o&&wn(t,e.u,e.o),e.O&&(e.g.H=e.O);var n=e.g;e=e.ba,n.M=1,n.A=Yt(Gt(t)),n.u=null,n.R=!0,wt(n,e)}e.Va=function(){this.C!=null&&(this.C=null,In(this),Wn(this),it(19))};function Gn(e){e.C!=null&&(o.clearTimeout(e.C),e.C=null)}function Kn(e,t){var n=null;if(e.g==t){Gn(e),w(e),e.g=null;var r=2}else if(Rt(e.h,t))n=t.G,Bt(e.h,t),r=1;else return;if(e.I!=0){if(t.o)if(r==1){n=t.u?t.u.length:0,t=Date.now()-t.F;var i=e.D;r=et(),Le(r,new at(r,n)),Rn(e)}else Un(e);else if(i=t.m,i==3||i==0&&t.X>0||!(r==1&&zn(e,t)||r==2&&Wn(e)))switch(n&&n.length>0&&(t=e.h,t.i=t.i.concat(n)),i){case 1:Jn(e,5);break;case 4:Jn(e,10);break;case 3:Jn(e,6);break;default:Jn(e,2)}}}function qn(e,t){let n=e.Qa+Math.floor(Math.random()*e.Za);return e.isActive()||(n*=2),n*t}function Jn(e,t){if(e.j.info(`Error code `+t),t==2){var n=l(e.bb,e),r=e.Ua;let t=!r;r=new Wt(r||`//www.google.com/images/cleardot.gif`),o.location&&o.location.protocol==`http`||Kt(r,`https`),Yt(r),t?mn(r.toString(),n):hn(r.toString(),n)}else it(2);e.I=0,e.l&&e.l.pa(t),Yn(e),Ln(e)}e.bb=function(e){e?(this.j.info(`Successfully pinged google.com`),it(2)):(this.j.info(`Failed to ping google.com`),it(1))};function Yn(e){if(e.I=0,e.ja=[],e.l){let t=Vt(e.h);(t.length!=0||e.i.length!=0)&&(m(e.ja,t),m(e.ja,e.i),e.h.i.length=0,p(e.i),e.i.length=0),e.l.oa()}}function Xn(e,t,n){var r=n instanceof Wt?Gt(n):new Wt(n);if(r.g!=``)t&&(r.g=t+`.`+r.g),qt(r,r.u);else{var i=o.location;r=i.protocol,t=t?t+`.`+i.hostname:i.hostname,i=+i.port;let e=new Wt(null);r&&Kt(e,r),t&&(e.g=t),i&&qt(e,i),n&&(e.h=n),r=e}return n=e.G,t=e.wa,n&&t&&x(r,n,t),x(r,`VER`,e.ka),Vn(e,r),r}function Zn(e,t,n){if(t&&!e.L)throw Error(`Can't create secondary domain capable XhrIo object.`);return t=e.Aa&&!e.ma?new S(new vn({ab:n})):new S(e.ma),t.Fa(e.L),t}e.isActive=function(){return!!this.l&&this.l.isActive(this)};function Qn(){}e=Qn.prototype,e.ra=function(){},e.qa=function(){},e.pa=function(){},e.oa=function(){},e.isActive=function(){return!0},e.Ka=function(){};function $n(){}$n.prototype.g=function(e,t){return new er(e,t)};function er(e,t){y.call(this),this.g=new Pn(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e[`X-Client-Protocol`]=`webchannel`:e={"X-Client-Protocol":`webchannel`}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e[`X-WebChannel-Content-Type`]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.sa&&(e?e[`X-WebChannel-Client-Profile`]=t.sa:e={"X-WebChannel-Client-Profile":t.sa}),this.g.U=e,(e=t&&t.Qb)&&!de(e)&&(this.g.u=e),this.A=t&&t.supportsCrossDomainXhr||!1,this.v=t&&t.sendRawJson||!1,(t&&=t.httpSessionIdParam)&&!de(t)&&(this.g.G=t,e=this.h,e!==null&&t in e&&(e=this.h,t in e&&delete e[t])),this.j=new rr(this)}d(er,y),er.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},er.prototype.close=function(){Fn(this.g)},er.prototype.o=function(e){var t=this.g;if(typeof e==`string`){var n={};n.__data__=e,e=n}else this.v&&(n={},n.__data__=We(e),e=n);t.i.push(new Pt(t.Ya++,e)),t.I==3&&Rn(t)},er.prototype.N=function(){this.g.l=null,delete this.j,Fn(this.g),delete this.g,er.Z.N.call(this)};function tr(e){Xe.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){a:{for(let n in t){e=n;break a}e=void 0}(this.i=e)&&(e=this.i,t=t!==null&&e in t?t[e]:void 0),this.data=t}else this.data=e}d(tr,Xe);function nr(){Ze.call(this),this.status=1}d(nr,Ze);function rr(e){this.g=e}d(rr,Qn),rr.prototype.ra=function(){Le(this.g,`a`)},rr.prototype.qa=function(e){Le(this.g,new tr(e))},rr.prototype.pa=function(e){Le(this.g,new nr)},rr.prototype.oa=function(){Le(this.g,`b`)},$n.prototype.createWebChannel=$n.prototype.g,er.prototype.send=er.prototype.o,er.prototype.open=er.prototype.m,er.prototype.close=er.prototype.close,Es=vs.createWebChannelTransport=function(){return new $n},Ts=vs.getStatEventTarget=function(){return et()},ws=vs.Event=Qe,Cs=vs.Stat={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},pt.NO_ERROR=0,pt.TIMEOUT=8,pt.HTTP_ERROR=6,Ss=vs.ErrorCode=pt,mt.COMPLETE=`complete`,xs=vs.EventType=mt,Je.EventType=Ye,Ye.OPEN=`a`,Ye.CLOSE=`b`,Ye.ERROR=`c`,Ye.MESSAGE=`d`,y.prototype.listen=y.prototype.J,bs=vs.WebChannel=Je,vs.FetchXmlHttpFactory=vn,S.prototype.listenOnce=S.prototype.K,S.prototype.getLastError=S.prototype.Ha,S.prototype.getLastErrorCode=S.prototype.ya,S.prototype.getStatus=S.prototype.ca,S.prototype.getResponseJson=S.prototype.La,S.prototype.getResponseText=S.prototype.la,S.prototype.send=S.prototype.ea,S.prototype.setWithCredentials=S.prototype.Fa,ys=vs.XhrIo=S}).apply(_s===void 0?typeof self<`u`?self:typeof window<`u`?window:{}:_s);var Ds=`@firebase/firestore`,Os=`4.9.2`,ks=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?`uid:`+this.uid:`anonymous-user`}isEqual(e){return e.uid===this.uid}};ks.UNAUTHENTICATED=new ks(null),ks.GOOGLE_CREDENTIALS=new ks(`google-credentials-uid`),ks.FIRST_PARTY=new ks(`first-party-uid`),ks.MOCK_USER=new ks(`mock-user`);
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var As=`12.3.0`,js=new He(`@firebase/firestore`);function Ms(){return js.logLevel}function E(e,...t){if(js.logLevel<=b.DEBUG){let n=t.map(Ps);js.debug(`Firestore (${As}): ${e}`,...n)}}function D(e,...t){if(js.logLevel<=b.ERROR){let n=t.map(Ps);js.error(`Firestore (${As}): ${e}`,...n)}}function Ns(e,...t){if(js.logLevel<=b.WARN){let n=t.map(Ps);js.warn(`Firestore (${As}): ${e}`,...n)}}function Ps(e){if(typeof e==`string`)return e;try{
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
return function(e){return JSON.stringify(e)}(e)}catch{return e}}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/function O(e,t,n){let r=`Unexpected state`;typeof t==`string`?r=t:n=t,Fs(e,r,n)}function Fs(e,t,n){let r=`FIRESTORE (${As}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(n!==void 0)try{r+=` CONTEXT: `+JSON.stringify(n)}catch{r+=` CONTEXT: `+n}throw D(r),Error(r)}function k(e,t,n,r){let i=`Unexpected state`;typeof n==`string`?i=n:r=n,e||Fs(t,i,r)}function A(e,t){return e}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var j={OK:`ok`,CANCELLED:`cancelled`,UNKNOWN:`unknown`,INVALID_ARGUMENT:`invalid-argument`,DEADLINE_EXCEEDED:`deadline-exceeded`,NOT_FOUND:`not-found`,ALREADY_EXISTS:`already-exists`,PERMISSION_DENIED:`permission-denied`,UNAUTHENTICATED:`unauthenticated`,RESOURCE_EXHAUSTED:`resource-exhausted`,FAILED_PRECONDITION:`failed-precondition`,ABORTED:`aborted`,OUT_OF_RANGE:`out-of-range`,UNIMPLEMENTED:`unimplemented`,INTERNAL:`internal`,UNAVAILABLE:`unavailable`,DATA_LOSS:`data-loss`},M=class extends ve{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}},Is=class{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}},Ls=class{constructor(e,t){this.user=t,this.type=`OAuth`,this.headers=new Map,this.headers.set(`Authorization`,`Bearer ${e}`)}},Rs=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(ks.UNAUTHENTICATED)))}shutdown(){}},zs=class{constructor(e){this.t=e,this.currentUser=ks.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){k(this.o===void 0,42304);let n=this.i,r=e=>this.i===n?Promise.resolve():(n=this.i,t(e)),i=new Is;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Is,e.enqueueRetryable((()=>r(this.currentUser)))};let a=()=>{let t=i;e.enqueueRetryable((async()=>{await t.promise,await r(this.currentUser)}))},o=e=>{E(`FirebaseAuthCredentialsProvider`,`Auth detected`),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((e=>o(e))),setTimeout((()=>{if(!this.auth){let e=this.t.getImmediate({optional:!0});e?o(e):(E(`FirebaseAuthCredentialsProvider`,`Auth not yet detected`),i.resolve(),i=new Is)}}),0),a()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((t=>this.i===e?t?(k(typeof t.accessToken==`string`,31837,{l:t}),new Ls(t.accessToken,this.currentUser)):null:(E(`FirebaseAuthCredentialsProvider`,`getToken aborted due to token change.`),this.getToken()))):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){let e=this.auth&&this.auth.getUid();return k(e===null||typeof e==`string`,2055,{h:e}),new ks(e)}},Bs=class{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type=`FirstParty`,this.user=ks.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set(`X-Goog-AuthUser`,this.P);let e=this.R();return e&&this.A.set(`Authorization`,e),this.T&&this.A.set(`X-Goog-Iam-Authorization-Token`,this.T),this.A}},Vs=class{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Bs(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(ks.FIRST_PARTY)))}shutdown(){}invalidateToken(){}},Hs=class{constructor(e){this.value=e,this.type=`AppCheck`,this.headers=new Map,e&&e.length>0&&this.headers.set(`x-firebase-appcheck`,this.value)}},Us=class{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Zt(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){k(this.o===void 0,3512);let n=e=>{e.error!=null&&E(`FirebaseAppCheckTokenProvider`,`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);let n=e.token!==this.m;return this.m=e.token,E(`FirebaseAppCheckTokenProvider`,`Received ${n?`new`:`existing`} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable((()=>n(t)))};let r=e=>{E(`FirebaseAppCheckTokenProvider`,`AppCheck detected`),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((e=>r(e))),setTimeout((()=>{if(!this.appCheck){let e=this.V.getImmediate({optional:!0});e?r(e):E(`FirebaseAppCheckTokenProvider`,`AppCheck not yet detected`)}}),0)}getToken(){if(this.p)return Promise.resolve(new Hs(this.p));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((e=>e?(k(typeof e.token==`string`,44558,{tokenResult:e}),this.m=e.token,new Hs(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Ws(e){let t=typeof self<`u`&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&typeof t.getRandomValues==`function`)t.getRandomValues(n);else for(let t=0;t<e;t++)n[t]=Math.floor(256*Math.random());return n}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Gs=class{static newId(){let e=``;for(;e.length<20;){let t=Ws(40);for(let n=0;n<t.length;++n)e.length<20&&t[n]<248&&(e+=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`.charAt(t[n]%62))}return e}};function N(e,t){return e<t?-1:e>t?1:0}function Ks(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=e.charAt(r),i=t.charAt(r);if(n!==i)return Ys(n)===Ys(i)?N(n,i):Ys(n)?1:-1}return N(e.length,t.length)}var qs=55296,Js=57343;function Ys(e){let t=e.charCodeAt(0);return t>=qs&&t<=Js}function Xs(e,t,n){return e.length===t.length&&e.every(((e,r)=>n(e,t[r])))}function Zs(e){return e+`\0`}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var Qs=`__name__`,$s=class e{constructor(e,t,n){t===void 0?t=0:t>e.length&&O(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&O(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(t){return e.comparator(this,t)===0}child(t){let n=this.segments.slice(this.offset,this.limit());return t instanceof e?t.forEach((e=>{n.push(e)})):n.push(t),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,n){let r=Math.min(t.length,n.length);for(let i=0;i<r;i++){let r=e.compareSegments(t.get(i),n.get(i));if(r!==0)return r}return N(t.length,n.length)}static compareSegments(t,n){let r=e.isNumericId(t),i=e.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?e.extractNumericId(t).compare(e.extractNumericId(n)):Ks(t,n)}static isNumericId(e){return e.startsWith(`__id`)&&e.endsWith(`__`)}static extractNumericId(e){return hs.fromString(e.substring(4,e.length-2))}},P=class e extends $s{construct(t,n,r){return new e(t,n,r)}canonicalString(){return this.toArray().join(`/`)}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join(`/`)}static fromString(...t){let n=[];for(let e of t){if(e.indexOf(`//`)>=0)throw new M(j.INVALID_ARGUMENT,`Invalid segment (${e}). Paths must not contain // in them.`);n.push(...e.split(`/`).filter((e=>e.length>0)))}return new e(n)}static emptyPath(){return new e([])}},ec=/^[_a-zA-Z][_a-zA-Z0-9]*$/,tc=class e extends $s{construct(t,n,r){return new e(t,n,r)}static isValidIdentifier(e){return ec.test(e)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,`\\\\`).replace(/`/g,"\\`"),e.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(`.`)}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Qs}static keyField(){return new e([Qs])}static fromServerFormat(t){let n=[],r=``,i=0,a=()=>{if(r.length===0)throw new M(j.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=``},o=!1;for(;i<t.length;){let e=t[i];if(e===`\\`){if(i+1===t.length)throw new M(j.INVALID_ARGUMENT,`Path has trailing escape character: `+t);let e=t[i+1];if(e!==`\\`&&e!==`.`&&e!=="`")throw new M(j.INVALID_ARGUMENT,`Path has invalid escape sequence: `+t);r+=e,i+=2}else e==="`"?(o=!o,i++):e!==`.`||o?(r+=e,i++):(a(),i++)}if(a(),o)throw new M(j.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new e(n)}static emptyPath(){return new e([])}},F=class e{constructor(e){this.path=e}static fromPath(t){return new e(P.fromString(t))}static fromName(t){return new e(P.fromString(t).popFirst(5))}static empty(){return new e(P.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&P.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return P.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(t){return new e(new P(t.slice()))}};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/function nc(e,t,n){if(!n)throw new M(j.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function rc(e,t,n,r){if(!0===t&&!0===r)throw new M(j.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function ic(e){if(!F.isDocumentKey(e))throw new M(j.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function ac(e){if(F.isDocumentKey(e))throw new M(j.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function oc(e){return typeof e==`object`&&!!e&&(Object.getPrototypeOf(e)===Object.prototype||Object.getPrototypeOf(e)===null)}function sc(e){if(e===void 0)return`undefined`;if(e===null)return`null`;if(typeof e==`string`)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if(typeof e==`number`||typeof e==`boolean`)return``+e;if(typeof e==`object`){if(e instanceof Array)return`an array`;{let t=function(e){return e.constructor?e.constructor.name:null}(e);return t?`a custom ${t} object`:`an object`}}return typeof e==`function`?`a function`:O(12329,{type:typeof e})}function cc(e,t){if(`_delegate`in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new M(j.INVALID_ARGUMENT,`Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?`);{let n=sc(e);throw new M(j.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}
/**
* @license
* Copyright 2025 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function I(e,t){let n={typeString:e};return t&&(n.value=t),n}function lc(e,t){if(!oc(e))throw new M(j.INVALID_ARGUMENT,`JSON must be an object`);let n;for(let r in t)if(t[r]){let i=t[r].typeString,a=`value`in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}let o=e[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(a!==void 0&&o!==a.value){n=`Expected '${r}' field to equal '${a.value}'`;break}}if(n)throw new M(j.INVALID_ARGUMENT,n);return!0}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var uc=-62135596800,dc=1e6,L=class e{static now(){return e.fromMillis(Date.now())}static fromDate(t){return e.fromMillis(t.getTime())}static fromMillis(t){let n=Math.floor(t/1e3),r=Math.floor((t-1e3*n)*dc);return new e(n,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new M(j.INVALID_ARGUMENT,`Timestamp nanoseconds out of range: `+t);if(e<uc||e>=253402300800)throw new M(j.INVALID_ARGUMENT,`Timestamp seconds out of range: `+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/dc}_compareTo(e){return this.seconds===e.seconds?N(this.nanoseconds,e.nanoseconds):N(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return`Timestamp(seconds=`+this.seconds+`, nanoseconds=`+this.nanoseconds+`)`}toJSON(){return{type:e._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(lc(t,e._jsonSchema))return new e(t.seconds,t.nanoseconds)}valueOf(){let e=this.seconds-uc;return String(e).padStart(12,`0`)+`.`+String(this.nanoseconds).padStart(9,`0`)}};L._jsonSchemaVersion=`firestore/timestamp/1.0`,L._jsonSchema={type:I(`string`,L._jsonSchemaVersion),seconds:I(`number`),nanoseconds:I(`number`)};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var R=class e{static fromTimestamp(t){return new e(t)}static min(){return new e(new L(0,0))}static max(){return new e(new L(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return`SnapshotVersion(`+this.timestamp.toString()+`)`}toTimestamp(){return this.timestamp}},fc=-1,pc=class{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}};function mc(e){return e.fields.find((e=>e.kind===2))}function hc(e){return e.fields.filter((e=>e.kind!==2))}pc.UNKNOWN_ID=-1;var gc=class{constructor(e,t){this.fieldPath=e,this.kind=t}},_c=class e{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new e(0,bc.min())}};function vc(e,t){let n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,i=R.fromTimestamp(r===1e9?new L(n+1,0):new L(n,r));return new bc(i,F.empty(),t)}function yc(e){return new bc(e.readTime,e.key,fc)}var bc=class e{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new e(R.min(),F.empty(),fc)}static max(){return new e(R.max(),F.empty(),fc)}};function xc(e,t){let n=e.readTime.compareTo(t.readTime);return n===0?(n=F.comparator(e.documentKey,t.documentKey),n===0?N(e.largestBatchId,t.largestBatchId):n):n}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var Sc=`The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.`,Cc=class{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
async function wc(e){if(e.code!==j.FAILED_PRECONDITION||e.message!==Sc)throw e;E(`LocalStore`,`Unexpectedly lost primary lease`)}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var z=class e{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)}),(e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)}))}catch(e){return this.next(void 0,e)}next(t,n){return this.callbackAttached&&O(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(t,this.result):new e(((e,r)=>{this.nextCallback=n=>{this.wrapSuccess(t,n).next(e,r)},this.catchCallback=t=>{this.wrapFailure(n,t).next(e,r)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(t){try{let n=t();return n instanceof e?n:e.resolve(n)}catch(t){return e.reject(t)}}wrapSuccess(t,n){return t?this.wrapUserFunction((()=>t(n))):e.resolve(n)}wrapFailure(t,n){return t?this.wrapUserFunction((()=>t(n))):e.reject(n)}static resolve(t){return new e(((e,n)=>{e(t)}))}static reject(t){return new e(((e,n)=>{n(t)}))}static waitFor(t){return new e(((e,n)=>{let r=0,i=0,a=!1;t.forEach((t=>{++r,t.next((()=>{++i,a&&i===r&&e()}),(e=>n(e)))})),a=!0,i===r&&e()}))}static or(t){let n=e.resolve(!1);for(let r of t)n=n.next((t=>t?e.resolve(t):r()));return n}static forEach(e,t){let n=[];return e.forEach(((e,r)=>{n.push(t.call(this,e,r))})),this.waitFor(n)}static mapArray(t,n){return new e(((e,r)=>{let i=t.length,a=Array(i),o=0;for(let s=0;s<i;s++){let c=s;n(t[c]).next((t=>{a[c]=t,++o,o===i&&e(a)}),(e=>r(e)))}}))}static doWhile(t,n){return new e(((e,r)=>{let i=()=>{!0===t()?n().next((()=>{i()}),r):e()};i()}))}},Tc=`SimpleDb`,Ec=class e{static open(t,n,r,i){try{return new e(n,t.transaction(i,r))}catch(e){throw new Ac(n,e)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new Is,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Ac(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{let n=Fc(t.target.error);this.S.reject(new Ac(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(E(Tc,`Aborting transaction:`,e?e.message:`Client-initiated abort`),this.aborted=!0,this.transaction.abort())}C(){let e=this.transaction;this.aborted||typeof e.commit!=`function`||e.commit()}store(e){let t=this.transaction.objectStore(e);return new Mc(t)}},Dc=class e{static delete(e){return E(Tc,`Removing database:`,e),Nc(c().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!he())return!1;if(e.F())return!0;let t=g(),n=e.M(t),r=0<n&&n<10,i=Oc(t),a=0<i&&i<4.5;return!(t.indexOf(`MSIE `)>0||t.indexOf(`Trident/`)>0||t.indexOf(`Edge/`)>0||r||a)}static F(){return typeof process<`u`&&process.__PRIVATE_env?.__PRIVATE_USE_MOCK_PERSISTENCE===`YES`}static O(e,t){return e.store(t)}static M(e){let t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split(`_`).slice(0,2).join(`.`):`-1`;return Number(n)}constructor(t,n,r){this.name=t,this.version=n,this.N=r,this.B=null,e.M(g())===12.2&&D(`Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`)}async L(e){return this.db||=(E(Tc,`Opening database:`,this.name),await new Promise(((t,n)=>{let r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{let n=e.target.result;t(n)},r.onblocked=()=>{n(new Ac(e,`Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed.`))},r.onerror=t=>{let r=t.target.error;r.name===`VersionError`?n(new M(j.FAILED_PRECONDITION,`A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.`)):r.name===`InvalidStateError`?n(new M(j.FAILED_PRECONDITION,`Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: `+r)):n(new Ac(e,r))},r.onupgradeneeded=e=>{E(Tc,`Database "`+this.name+`" requires upgrade from version:`,e.oldVersion);let t=e.target.result;this.N.k(t,r.transaction,e.oldVersion,this.version).next((()=>{E(Tc,`Database upgrade to version `+this.version+` complete`)}))}}))),this.q&&(this.db.onversionchange=e=>this.q(e)),this.db}$(e){this.q=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,r){let i=t===`readonly`,a=0;for(;;){++a;try{this.db=await this.L(e);let t=Ec.open(this.db,e,i?`readonly`:`readwrite`,n),a=r(t).next((e=>(t.C(),e))).catch((e=>(t.abort(e),z.reject(e)))).toPromise();return a.catch((()=>{})),await t.D,a}catch(e){let t=e,n=t.name!==`FirebaseError`&&a<3;if(E(Tc,`Transaction failed with error:`,t.message,`Retrying:`,n),this.close(),!n)return Promise.reject(t)}}}close(){this.db&&this.db.close(),this.db=void 0}};function Oc(e){let t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(`.`).slice(0,2).join(`.`):`-1`;return Number(n)}var kc=class{constructor(e){this.U=e,this.K=!1,this.W=null}get isDone(){return this.K}get G(){return this.W}set cursor(e){this.U=e}done(){this.K=!0}j(e){this.W=e}delete(){return Nc(this.U.delete())}},Ac=class extends M{constructor(e,t){super(j.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name=`IndexedDbTransactionError`}};function jc(e){return e.name===`IndexedDbTransactionError`}var Mc=class{constructor(e){this.store=e}put(e,t){let n;return t===void 0?(E(Tc,`PUT`,this.store.name,`<auto-key>`,e),n=this.store.put(e)):(E(Tc,`PUT`,this.store.name,e,t),n=this.store.put(t,e)),Nc(n)}add(e){return E(Tc,`ADD`,this.store.name,e,e),Nc(this.store.add(e))}get(e){return Nc(this.store.get(e)).next((t=>(t===void 0&&(t=null),E(Tc,`GET`,this.store.name,e,t),t)))}delete(e){return E(Tc,`DELETE`,this.store.name,e),Nc(this.store.delete(e))}count(){return E(Tc,`COUNT`,this.store.name),Nc(this.store.count())}J(e,t){let n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if(typeof r.getAll==`function`){let e=r.getAll(n.range);return new z(((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}}))}{let e=this.cursor(n),t=[];return this.H(e,((e,n)=>{t.push(n)})).next((()=>t))}}Y(e,t){let n=this.store.getAll(e,t===null?void 0:t);return new z(((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}}))}Z(e,t){E(Tc,`DELETE ALL`,this.store.name);let n=this.options(e,t);n.X=!1;let r=this.cursor(n);return this.H(r,((e,t,n)=>n.delete()))}ee(e,t){let n;t?n=e:(n={},t=e);let r=this.cursor(n);return this.H(r,t)}te(e){let t=this.cursor({});return new z(((n,r)=>{t.onerror=e=>{let t=Fc(e.target.error);r(t)},t.onsuccess=t=>{let r=t.target.result;r?e(r.primaryKey,r.value).next((e=>{e?r.continue():n()})):n()}}))}H(e,t){let n=[];return new z(((r,i)=>{e.onerror=e=>{i(e.target.error)},e.onsuccess=e=>{let i=e.target.result;if(!i)return void r();let a=new kc(i),o=t(i.primaryKey,i.value,a);if(o instanceof z){let e=o.catch((e=>(a.done(),z.reject(e))));n.push(e)}a.isDone?r():a.G===null?i.continue():i.continue(a.G)}})).next((()=>z.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e==`string`?n=e:t=e),{index:n,range:t}}cursor(e){let t=`next`;if(e.reverse&&(t=`prev`),e.index){let n=this.store.index(e.index);return e.X?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}};function Nc(e){return new z(((t,n)=>{e.onsuccess=e=>{let n=e.target.result;t(n)},e.onerror=e=>{let t=Fc(e.target.error);n(t)}}))}var Pc=!1;function Fc(e){let t=Dc.M(g());if(t>=12.2&&t<13){let t=`An internal error was encountered in the Indexed Database server`;if(e.message.indexOf(t)>=0){let e=new M(`internal`,`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return Pc||(Pc=!0,setTimeout((()=>{throw e}),0)),e}}return e}var Ic=`IndexBackfiller`,Lc=class{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&=(this.task.cancel(),null)}get started(){return this.task!==null}re(e){E(Ic,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay(`index_backfill`,e,(async()=>{this.task=null;try{let e=await this.ne.ie();E(Ic,`Documents written: ${e}`)}catch(e){jc(e)?E(Ic,`Ignoring IndexedDB error during index backfill: `,e):await wc(e)}await this.re(6e4)}))}},Rc=class{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction(`Backfill Indexes`,`readwrite-primary`,(t=>this.se(t,e)))}se(e,t){let n=new Set,r=t,i=!0;return z.doWhile((()=>!0===i&&r>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((t=>{if(t!==null&&!n.has(t))return E(Ic,`Processing collection: ${t}`),this.oe(e,t,r).next((e=>{r-=e,n.add(t)}));i=!1})))).next((()=>t-r))}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next((n=>{let i=n.changes;return this.localStore.indexManager.updateIndexEntries(e,i).next((()=>this._e(r,n))).next((n=>(E(Ic,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n)))).next((()=>i.size))}))))}_e(e,t){let n=e;return t.changes.forEach(((e,t)=>{let r=yc(t);xc(r,n)>0&&(n=r)})),new bc(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}},zc=class{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ae(e),this.ue=e=>t.writeSequenceNumber(e))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.ue&&this.ue(e),e}};zc.ce=-1;
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Bc=-1;function Vc(e){return e==null}function Hc(e){return e===0&&1/e==-1/0}function Uc(e){return typeof e==`number`&&Number.isInteger(e)&&!Hc(e)&&e<=2**53-1&&e>=-(2**53-1)}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var Wc=``;function Gc(e){let t=``;for(let n=0;n<e.length;n++)t.length>0&&(t=qc(t)),t=Kc(e.get(n),t);return qc(t)}function Kc(e,t){let n=t,r=e.length;for(let t=0;t<r;t++){let r=e.charAt(t);switch(r){case`\0`:n+=``;break;case Wc:n+=``;break;default:n+=r}}return n}function qc(e){return e+Wc+``}function Jc(e){let t=e.length;if(k(t>=2,64408,{path:e}),t===2)return k(e.charAt(0)===Wc&&e.charAt(1)===``,56145,{path:e}),P.emptyPath();let n=t-2,r=[],i=``;for(let a=0;a<t;){let t=e.indexOf(Wc,a);switch((t<0||t>n)&&O(50515,{path:e}),e.charAt(t+1)){case``:let n=e.substring(a,t),o;i.length===0?o=n:(i+=n,o=i,i=``),r.push(o);break;case``:i+=e.substring(a,t),i+=`\0`;break;case``:i+=e.substring(a,t+1);break;default:O(61167,{path:e})}a=t+2}return new P(r)}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var Yc=`remoteDocuments`,Xc=`owner`,Zc=`owner`,Qc=`mutationQueues`,$c=`userId`,el=`mutations`,tl=`batchId`,nl=`userMutationsIndex`,rl=[`userId`,`batchId`];
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function il(e,t){return[e,Gc(t)]}function al(e,t,n){return[e,Gc(t),n]}var ol={},sl=`documentMutations`,cl=`remoteDocumentsV14`,ll=[`prefixPath`,`collectionGroup`,`readTime`,`documentId`],ul=`documentKeyIndex`,dl=[`prefixPath`,`collectionGroup`,`documentId`],fl=`collectionGroupIndex`,pl=[`collectionGroup`,`readTime`,`prefixPath`,`documentId`],ml=`remoteDocumentGlobal`,hl=`remoteDocumentGlobalKey`,gl=`targets`,_l=`queryTargetsIndex`,vl=[`canonicalId`,`targetId`],yl=`targetDocuments`,bl=[`targetId`,`path`],xl=`documentTargetsIndex`,Sl=[`path`,`targetId`],Cl=`targetGlobalKey`,wl=`targetGlobal`,Tl=`collectionParents`,El=[`collectionId`,`parent`],Dl=`clientMetadata`,Ol=`clientId`,kl=`bundles`,Al=`bundleId`,jl=`namedQueries`,Ml=`name`,Nl=`indexConfiguration`,Pl=`indexId`,Fl=`collectionGroupIndex`,Il=`collectionGroup`,Ll=`indexState`,Rl=[`indexId`,`uid`],zl=`sequenceNumberIndex`,Bl=[`uid`,`sequenceNumber`],Vl=`indexEntries`,Hl=[`indexId`,`uid`,`arrayValue`,`directionalValue`,`orderedDocumentKey`,`documentKey`],Ul=`documentKeyIndex`,Wl=[`indexId`,`uid`,`orderedDocumentKey`],Gl=`documentOverlays`,Kl=[`userId`,`collectionPath`,`documentId`],ql=`collectionPathOverlayIndex`,Jl=[`userId`,`collectionPath`,`largestBatchId`],Yl=`collectionGroupOverlayIndex`,Xl=[`userId`,`collectionGroup`,`largestBatchId`],Zl=`globals`,Ql=`name`,$l=[...[...[...[...[Qc,el,sl,Yc,gl,Xc,wl,yl],Dl],ml],Tl],kl,jl],eu=[...$l,Gl],tu=[Qc,el,sl,cl,gl,Xc,wl,yl,Dl,ml,Tl,kl,jl,Gl],nu=tu,ru=[...nu,Nl,Ll,Vl],iu=ru,au=[...ru,Zl],ou=au,su=class extends Cc{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}};function B(e,t){let n=A(e);return Dc.O(n.le,t)}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/function cu(e){let t=0;for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function lu(e,t){for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function uu(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var V=class e{constructor(e,t){this.comparator=e,this.root=t||fu.EMPTY}insert(t,n){return new e(this.comparator,this.root.insert(t,n,this.comparator).copy(null,null,fu.BLACK,null,null))}remove(t){return new e(this.comparator,this.root.remove(t,this.comparator).copy(null,null,fu.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){let r=this.comparator(e,n.key);if(r===0)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){let e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(`, `)}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new du(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new du(this.root,e,this.comparator,!1)}getReverseIterator(){return new du(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new du(this.root,e,this.comparator,!0)}},du=class{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},fu=class e{constructor(t,n,r,i,a){this.key=t,this.value=n,this.color=r??e.RED,this.left=i??e.EMPTY,this.right=a??e.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,n,r,i,a){return new e(t??this.key,n??this.value,r??this.color,i??this.left,a??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this,i=n(e,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):i===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return e.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,n){let r,i=this;if(n(t,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(t,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(t,i.key)===0){if(i.right.isEmpty())return e.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(t,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let t=this.copy(null,null,e.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){let t=this.copy(null,null,e.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){return 2**this.check()<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw O(43730,{key:this.key,value:this.value});if(this.right.isRed())throw O(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw O(27949);return e+(this.isRed()?0:1)}};fu.EMPTY=null,fu.RED=!0,fu.BLACK=!1,fu.EMPTY=new class{constructor(){this.size=0}get key(){throw O(57766)}get value(){throw O(16141)}get color(){throw O(16727)}get left(){throw O(29726)}get right(){throw O(36894)}copy(e,t,n,r,i){return this}insert(e,t,n){return new fu(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var H=class e{constructor(e){this.comparator=e,this.data=new V(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){let n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){let r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=t===void 0?this.data.getIterator():this.data.getIteratorFrom(t);n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new pu(this.data.getIterator())}getIteratorFrom(e){return new pu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((e=>{t=t.add(e)})),t}isEqual(t){if(!(t instanceof e)||this.size!==t.size)return!1;let n=this.data.getIterator(),r=t.data.getIterator();for(;n.hasNext();){let e=n.getNext().key,t=r.getNext().key;if(this.comparator(e,t)!==0)return!1}return!0}toArray(){let e=[];return this.forEach((t=>{e.push(t)})),e}toString(){let e=[];return this.forEach((t=>e.push(t))),`SortedSet(`+e.toString()+`)`}copy(t){let n=new e(this.comparator);return n.data=t,n}},pu=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};function mu(e){return e.hasNext()?e.getNext():void 0}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var hu=class e{constructor(e){this.fields=e,e.sort(tc.comparator)}static empty(){return new e([])}unionWith(t){let n=new H(tc.comparator);for(let e of this.fields)n=n.add(e);for(let e of t)n=n.add(e);return new e(n.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Xs(this.fields,e.fields,((e,t)=>e.isEqual(t)))}},gu=class extends Error{constructor(){super(...arguments),this.name=`Base64DecodeError`}},U=class e{constructor(e){this.binaryString=e}static fromBase64String(t){let n=function(e){try{return atob(e)}catch(e){throw typeof DOMException<`u`&&e instanceof DOMException?new gu(`Invalid base64 string: `+e):e}}(t);return new e(n)}static fromUint8Array(t){let n=function(e){let t=``;for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(t);return new e(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(e){return btoa(e)}(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return N(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};U.EMPTY_BYTE_STRING=new U(``);var _u=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function vu(e){if(k(!!e,39018),typeof e==`string`){let t=0,n=_u.exec(e);if(k(!!n,46558,{timestamp:e}),n[1]){let e=n[1];e=(e+`000000000`).substr(0,9),t=Number(e)}let r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:W(e.seconds),nanos:W(e.nanos)}}function W(e){return typeof e==`number`?e:typeof e==`string`?Number(e):0}function yu(e){return typeof e==`string`?U.fromBase64String(e):U.fromUint8Array(e)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var bu=`server_timestamp`,xu=`__type__`,Su=`__previous_value__`,Cu=`__local_write_time__`;function wu(e){return(e?.mapValue?.fields||{})[xu]?.stringValue===bu}function Tu(e){let t=e.mapValue.fields[Su];return wu(t)?Tu(t):t}function Eu(e){let t=vu(e.mapValue.fields[Cu].timestampValue);return new L(t.seconds,t.nanos)}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var Du=class{constructor(e,t,n,r,i,a,o,s,c,l){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=a,this.autoDetectLongPolling=o,this.longPollingOptions=s,this.useFetchStreams=c,this.isUsingEmulator=l}},Ou=`(default)`,ku=class e{constructor(e,t){this.projectId=e,this.database=t||Ou}static empty(){return new e(``,``)}get isDefaultDatabase(){return this.database===Ou}isEqual(t){return t instanceof e&&t.projectId===this.projectId&&t.database===this.database}},Au=`__type__`,ju=`__max__`,Mu={mapValue:{fields:{__type__:{stringValue:ju}}}},Nu=`__vector__`,Pu=`value`,Fu={nullValue:`NULL_VALUE`};function Iu(e){return`nullValue`in e?0:`booleanValue`in e?1:`integerValue`in e||`doubleValue`in e?2:`timestampValue`in e?3:`stringValue`in e?5:`bytesValue`in e?6:`referenceValue`in e?7:`geoPointValue`in e?8:`arrayValue`in e?9:`mapValue`in e?wu(e)?4:$u(e)?9007199254740991:Zu(e)?10:11:O(28295,{value:e})}function Lu(e,t){if(e===t)return!0;let n=Iu(e);if(n!==Iu(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return Eu(e).isEqual(Eu(t));case 3:return function(e,t){if(typeof e.timestampValue==`string`&&typeof t.timestampValue==`string`&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let n=vu(e.timestampValue),r=vu(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return function(e,t){return yu(e.bytesValue).isEqual(yu(t.bytesValue))}(e,t);case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return W(e.geoPointValue.latitude)===W(t.geoPointValue.latitude)&&W(e.geoPointValue.longitude)===W(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if(`integerValue`in e&&`integerValue`in t)return W(e.integerValue)===W(t.integerValue);if(`doubleValue`in e&&`doubleValue`in t){let n=W(e.doubleValue),r=W(t.doubleValue);return n===r?Hc(n)===Hc(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return Xs(e.arrayValue.values||[],t.arrayValue.values||[],Lu);case 10:case 11:return function(e,t){let n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(cu(n)!==cu(r))return!1;for(let e in n)if(n.hasOwnProperty(e)&&(r[e]===void 0||!Lu(n[e],r[e])))return!1;return!0}(e,t);default:return O(52216,{left:e})}}function Ru(e,t){return(e.values||[]).find((e=>Lu(e,t)))!==void 0}function zu(e,t){if(e===t)return 0;let n=Iu(e),r=Iu(t);if(n!==r)return N(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return N(e.booleanValue,t.booleanValue);case 2:return function(e,t){let n=W(e.integerValue||e.doubleValue),r=W(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return Bu(e.timestampValue,t.timestampValue);case 4:return Bu(Eu(e),Eu(t));case 5:return Ks(e.stringValue,t.stringValue);case 6:return function(e,t){let n=yu(e),r=yu(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let n=e.split(`/`),r=t.split(`/`);for(let e=0;e<n.length&&e<r.length;e++){let t=N(n[e],r[e]);if(t!==0)return t}return N(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let n=N(W(e.latitude),W(t.latitude));return n===0?N(W(e.longitude),W(t.longitude)):n}(e.geoPointValue,t.geoPointValue);case 9:return Vu(e.arrayValue,t.arrayValue);case 10:return function(e,t){let n=e.fields||{},r=t.fields||{},i=n[Pu]?.arrayValue,a=r[Pu]?.arrayValue,o=N(i?.values?.length||0,a?.values?.length||0);return o===0?Vu(i,a):o}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===Mu.mapValue&&t===Mu.mapValue)return 0;if(e===Mu.mapValue)return 1;if(t===Mu.mapValue)return-1;let n=e.fields||{},r=Object.keys(n),i=t.fields||{},a=Object.keys(i);r.sort(),a.sort();for(let e=0;e<r.length&&e<a.length;++e){let t=Ks(r[e],a[e]);if(t!==0)return t;let o=zu(n[r[e]],i[a[e]]);if(o!==0)return o}return N(r.length,a.length)}(e.mapValue,t.mapValue);default:throw O(23264,{he:n})}}function Bu(e,t){if(typeof e==`string`&&typeof t==`string`&&e.length===t.length)return N(e,t);let n=vu(e),r=vu(t),i=N(n.seconds,r.seconds);return i===0?N(n.nanos,r.nanos):i}function Vu(e,t){let n=e.values||[],r=t.values||[];for(let e=0;e<n.length&&e<r.length;++e){let t=zu(n[e],r[e]);if(t)return t}return N(n.length,r.length)}function Hu(e){return Uu(e)}function Uu(e){return`nullValue`in e?`null`:`booleanValue`in e?``+e.booleanValue:`integerValue`in e?``+e.integerValue:`doubleValue`in e?``+e.doubleValue:`timestampValue`in e?function(e){let t=vu(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):`stringValue`in e?e.stringValue:`bytesValue`in e?function(e){return yu(e).toBase64()}(e.bytesValue):`referenceValue`in e?function(e){return F.fromName(e).toString()}(e.referenceValue):`geoPointValue`in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):`arrayValue`in e?function(e){let t=`[`,n=!0;for(let r of e.values||[])n?n=!1:t+=`,`,t+=Uu(r);return t+`]`}(e.arrayValue):`mapValue`in e?function(e){let t=Object.keys(e.fields||{}).sort(),n=`{`,r=!0;for(let i of t)r?r=!1:n+=`,`,n+=`${i}:${Uu(e.fields[i])}`;return n+`}`}(e.mapValue):O(61005,{value:e})}function Wu(e){switch(Iu(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:let t=Tu(e);return t?16+Wu(t):16;case 5:return 2*e.stringValue.length;case 6:return yu(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return function(e){return(e.values||[]).reduce(((e,t)=>e+Wu(t)),0)}(e.arrayValue);case 10:case 11:return function(e){let t=0;return lu(e.fields,((e,n)=>{t+=e.length+Wu(n)})),t}(e.mapValue);default:throw O(13486,{value:e})}}function Gu(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function Ku(e){return!!e&&`integerValue`in e}function qu(e){return!!e&&`arrayValue`in e}function Ju(e){return!!e&&`nullValue`in e}function Yu(e){return!!e&&`doubleValue`in e&&isNaN(Number(e.doubleValue))}function Xu(e){return!!e&&`mapValue`in e}function Zu(e){return(e?.mapValue?.fields||{})[Au]?.stringValue===Nu}function Qu(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&typeof e.timestampValue==`object`)return{timestampValue:{...e.timestampValue}};if(e.mapValue){let t={mapValue:{fields:{}}};return lu(e.mapValue.fields,((e,n)=>t.mapValue.fields[e]=Qu(n))),t}if(e.arrayValue){let t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=Qu(e.arrayValue.values[n]);return t}return{...e}}function $u(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===ju}var ed={mapValue:{fields:{[Au]:{stringValue:Nu},[Pu]:{arrayValue:{}}}}};function td(e){return`nullValue`in e?Fu:`booleanValue`in e?{booleanValue:!1}:`integerValue`in e||`doubleValue`in e?{doubleValue:NaN}:`timestampValue`in e?{timestampValue:{seconds:-(2**53-1)}}:`stringValue`in e?{stringValue:``}:`bytesValue`in e?{bytesValue:``}:`referenceValue`in e?Gu(ku.empty(),F.empty()):`geoPointValue`in e?{geoPointValue:{latitude:-90,longitude:-180}}:`arrayValue`in e?{arrayValue:{}}:`mapValue`in e?Zu(e)?ed:{mapValue:{}}:O(35942,{value:e})}function nd(e){return`nullValue`in e?{booleanValue:!1}:`booleanValue`in e?{doubleValue:NaN}:`integerValue`in e||`doubleValue`in e?{timestampValue:{seconds:-(2**53-1)}}:`timestampValue`in e?{stringValue:``}:`stringValue`in e?{bytesValue:``}:`bytesValue`in e?Gu(ku.empty(),F.empty()):`referenceValue`in e?{geoPointValue:{latitude:-90,longitude:-180}}:`geoPointValue`in e?{arrayValue:{}}:`arrayValue`in e?ed:`mapValue`in e?Zu(e)?{mapValue:{}}:Mu:O(61959,{value:e})}function rd(e,t){let n=zu(e.value,t.value);return n===0?e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0:n}function id(e,t){let n=zu(e.value,t.value);return n===0?e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0:n}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ad=class e{constructor(e){this.value=e}static empty(){return new e({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Xu(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Qu(t)}setAll(e){let t=tc.emptyPath(),n={},r=[];e.forEach(((e,i)=>{if(!t.isImmediateParentOf(i)){let e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=Qu(e):r.push(i.lastSegment())}));let i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){let t=this.field(e.popLast());Xu(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Lu(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];Xu(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){lu(t,((t,n)=>e[t]=n));for(let t of n)delete e[t]}clone(){return new e(Qu(this.value))}};function od(e){let t=[];return lu(e.fields,((e,n)=>{let r=new tc([e]);if(Xu(n)){let e=od(n.mapValue).fields;if(e.length===0)t.push(r);else for(let n of e)t.push(r.child(n))}else t.push(r)})),new hu(t)}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var sd=class e{constructor(e,t,n,r,i,a,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=a,this.documentState=o}static newInvalidDocument(t){return new e(t,0,R.min(),R.min(),R.min(),ad.empty(),0)}static newFoundDocument(t,n,r,i){return new e(t,1,n,R.min(),r,i,0)}static newNoDocument(t,n){return new e(t,2,n,R.min(),R.min(),ad.empty(),0)}static newUnknownDocument(t,n){return new e(t,3,n,R.min(),R.min(),ad.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(R.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ad.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ad.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=R.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof e&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new e(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}},cd=class{constructor(e,t){this.position=e,this.inclusive=t}};function ld(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){let a=t[i],o=e.position[i];if(r=a.field.isKeyField()?F.comparator(F.fromName(o.referenceValue),n.key):zu(o,n.data.field(a.field)),a.dir===`desc`&&(r*=-1),r!==0)break}return r}function ud(e,t){if(e===null)return t===null;if(t===null||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!Lu(e.position[n],t.position[n]))return!1;return!0}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var dd=class{constructor(e,t=`asc`){this.field=e,this.dir=t}};function fd(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var pd=class{},G=class e extends pd{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(t,n,r){return t.isKeyField()?n===`in`||n===`not-in`?this.createKeyFieldInFilter(t,n,r):new Sd(t,n,r):n===`array-contains`?new Ed(t,r):n===`in`?new Dd(t,r):n===`not-in`?new Od(t,r):n===`array-contains-any`?new kd(t,r):new e(t,n,r)}static createKeyFieldInFilter(e,t,n){return t===`in`?new Cd(e,n):new wd(e,n)}matches(e){let t=e.data.field(this.field);return this.op===`!=`?t!==null&&t.nullValue===void 0&&this.matchesComparison(zu(t,this.value)):t!==null&&Iu(this.value)===Iu(t)&&this.matchesComparison(zu(t,this.value))}matchesComparison(e){switch(this.op){case`<`:return e<0;case`<=`:return e<=0;case`==`:return e===0;case`!=`:return e!==0;case`>`:return e>0;case`>=`:return e>=0;default:return O(47266,{operator:this.op})}}isInequality(){return[`<`,`<=`,`>`,`>=`,`!=`,`not-in`].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},K=class e extends pd{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(t,n){return new e(t,n)}matches(e){return md(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}};function md(e){return e.op===`and`}function hd(e){return e.op===`or`}function gd(e){return _d(e)&&md(e)}function _d(e){for(let t of e.filters)if(t instanceof K)return!1;return!0}function vd(e){if(e instanceof G)return e.field.canonicalString()+e.op.toString()+Hu(e.value);if(gd(e))return e.filters.map((e=>vd(e))).join(`,`);{let t=e.filters.map((e=>vd(e))).join(`,`);return`${e.op}(${t})`}}function yd(e,t){return e instanceof G?function(e,t){return t instanceof G&&e.op===t.op&&e.field.isEqual(t.field)&&Lu(e.value,t.value)}(e,t):e instanceof K?function(e,t){return t instanceof K&&e.op===t.op&&e.filters.length===t.filters.length?e.filters.reduce(((e,n,r)=>e&&yd(n,t.filters[r])),!0):!1}(e,t):void O(19439)}function bd(e,t){let n=e.filters.concat(t);return K.create(n,e.op)}function xd(e){return e instanceof G?function(e){return`${e.field.canonicalString()} ${e.op} ${Hu(e.value)}`}(e):e instanceof K?function(e){return e.op.toString()+` {`+e.getFilters().map(xd).join(` ,`)+`}`}(e):`Filter`}var Sd=class extends G{constructor(e,t,n){super(e,t,n),this.key=F.fromName(n.referenceValue)}matches(e){let t=F.comparator(e.key,this.key);return this.matchesComparison(t)}},Cd=class extends G{constructor(e,t){super(e,`in`,t),this.keys=Td(`in`,t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}},wd=class extends G{constructor(e,t){super(e,`not-in`,t),this.keys=Td(`not-in`,t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}};function Td(e,t){return(t.arrayValue?.values||[]).map((e=>F.fromName(e.referenceValue)))}var Ed=class extends G{constructor(e,t){super(e,`array-contains`,t)}matches(e){let t=e.data.field(this.field);return qu(t)&&Ru(t.arrayValue,this.value)}},Dd=class extends G{constructor(e,t){super(e,`in`,t)}matches(e){let t=e.data.field(this.field);return t!==null&&Ru(this.value.arrayValue,t)}},Od=class extends G{constructor(e,t){super(e,`not-in`,t)}matches(e){if(Ru(this.value.arrayValue,{nullValue:`NULL_VALUE`}))return!1;let t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Ru(this.value.arrayValue,t)}},kd=class extends G{constructor(e,t){super(e,`array-contains-any`,t)}matches(e){let t=e.data.field(this.field);return!(!qu(t)||!t.arrayValue.values)&&t.arrayValue.values.some((e=>Ru(this.value.arrayValue,e)))}},Ad=class{constructor(e,t=null,n=[],r=[],i=null,a=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=a,this.endAt=o,this.Te=null}};function jd(e,t=null,n=[],r=[],i=null,a=null,o=null){return new Ad(e,t,n,r,i,a,o)}function Md(e){let t=A(e);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+=`|cg:`+t.collectionGroup),e+=`|f:`,e+=t.filters.map((e=>vd(e))).join(`,`),e+=`|ob:`,e+=t.orderBy.map((e=>function(e){return e.field.canonicalString()+e.dir}(e))).join(`,`),Vc(t.limit)||(e+=`|l:`,e+=t.limit),t.startAt&&(e+=`|lb:`,e+=t.startAt.inclusive?`b:`:`a:`,e+=t.startAt.position.map((e=>Hu(e))).join(`,`)),t.endAt&&(e+=`|ub:`,e+=t.endAt.inclusive?`a:`:`b:`,e+=t.endAt.position.map((e=>Hu(e))).join(`,`)),t.Te=e}return t.Te}function Nd(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!fd(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!yd(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!ud(e.startAt,t.startAt)&&ud(e.endAt,t.endAt)}function Pd(e){return F.isDocumentKey(e.path)&&e.collectionGroup===null&&e.filters.length===0}function Fd(e,t){return e.filters.filter((e=>e instanceof G&&e.field.isEqual(t)))}function Id(e,t,n){let r=Fu,i=!0;for(let n of Fd(e,t)){let e=Fu,t=!0;switch(n.op){case`<`:case`<=`:e=td(n.value);break;case`==`:case`in`:case`>=`:e=n.value;break;case`>`:e=n.value,t=!1;break;case`!=`:case`not-in`:e=Fu}rd({value:r,inclusive:i},{value:e,inclusive:t})<0&&(r=e,i=t)}if(n!==null){for(let a=0;a<e.orderBy.length;++a)if(e.orderBy[a].field.isEqual(t)){let e=n.position[a];rd({value:r,inclusive:i},{value:e,inclusive:n.inclusive})<0&&(r=e,i=n.inclusive);break}}return{value:r,inclusive:i}}function Ld(e,t,n){let r=Mu,i=!0;for(let n of Fd(e,t)){let e=Mu,t=!0;switch(n.op){case`>=`:case`>`:e=nd(n.value),t=!1;break;case`==`:case`in`:case`<=`:e=n.value;break;case`<`:e=n.value,t=!1;break;case`!=`:case`not-in`:e=Mu}id({value:r,inclusive:i},{value:e,inclusive:t})>0&&(r=e,i=t)}if(n!==null){for(let a=0;a<e.orderBy.length;++a)if(e.orderBy[a].field.isEqual(t)){let e=n.position[a];id({value:r,inclusive:i},{value:e,inclusive:n.inclusive})>0&&(r=e,i=n.inclusive);break}}return{value:r,inclusive:i}}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Rd=class{constructor(e,t=null,n=[],r=[],i=null,a=`F`,o=null,s=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=a,this.startAt=o,this.endAt=s,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}};function zd(e,t,n,r,i,a,o,s){return new Rd(e,t,n,r,i,a,o,s)}function Bd(e){return new Rd(e)}function Vd(e){return e.filters.length===0&&e.limit===null&&e.startAt==null&&e.endAt==null&&(e.explicitOrderBy.length===0||e.explicitOrderBy.length===1&&e.explicitOrderBy[0].field.isKeyField())}function Hd(e){return e.collectionGroup!==null}function Ud(e){let t=A(e);if(t.Ie===null){t.Ie=[];let e=new Set;for(let n of t.explicitOrderBy)t.Ie.push(n),e.add(n.field.canonicalString());let n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:`asc`;(function(e){let t=new H(tc.comparator);return e.filters.forEach((e=>{e.getFlattenedFilters().forEach((e=>{e.isInequality()&&(t=t.add(e.field))}))})),t})(t).forEach((r=>{e.has(r.canonicalString())||r.isKeyField()||t.Ie.push(new dd(r,n))})),e.has(tc.keyField().canonicalString())||t.Ie.push(new dd(tc.keyField(),n))}return t.Ie}function Wd(e){let t=A(e);return t.Ee||=Gd(t,Ud(e)),t.Ee}function Gd(e,t){if(e.limitType===`F`)return jd(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map((e=>{let t=e.dir===`desc`?`asc`:`desc`;return new dd(e.field,t)}));let n=e.endAt?new cd(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new cd(e.startAt.position,e.startAt.inclusive):null;return jd(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function Kd(e,t){let n=e.filters.concat([t]);return new Rd(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function qd(e,t,n){return new Rd(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function Jd(e,t){return Nd(Wd(e),Wd(t))&&e.limitType===t.limitType}function Yd(e){return`${Md(Wd(e))}|lt:${e.limitType}`}function Xd(e){return`Query(target=${function(e){let t=e.path.canonicalString();return e.collectionGroup!==null&&(t+=` collectionGroup=`+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map((e=>xd(e))).join(`, `)}]`),Vc(e.limit)||(t+=`, limit: `+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map((e=>function(e){return`${e.field.canonicalString()} (${e.dir})`}(e))).join(`, `)}]`),e.startAt&&(t+=`, startAt: `,t+=e.startAt.inclusive?`b:`:`a:`,t+=e.startAt.position.map((e=>Hu(e))).join(`,`)),e.endAt&&(t+=`, endAt: `,t+=e.endAt.inclusive?`a:`:`b:`,t+=e.endAt.position.map((e=>Hu(e))).join(`,`)),`Target(${t})`}(Wd(e))}; limitType=${e.limitType})`}function Zd(e,t){return t.isFoundDocument()&&function(e,t){let n=t.key.path;return e.collectionGroup===null?F.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n):t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n)}(e,t)&&function(e,t){for(let n of Ud(e))if(!n.field.isKeyField()&&t.data.field(n.field)===null)return!1;return!0}(e,t)&&function(e,t){for(let n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&function(e,t){return!(e.startAt&&!function(e,t,n){let r=ld(e,t,n);return e.inclusive?r<=0:r<0}(e.startAt,Ud(e),t)||e.endAt&&!function(e,t,n){let r=ld(e,t,n);return e.inclusive?r>=0:r>0}(e.endAt,Ud(e),t))}(e,t)}function Qd(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function $d(e){return(t,n)=>{let r=!1;for(let i of Ud(e)){let e=ef(i,t,n);if(e!==0)return e;r||=i.field.isKeyField()}return 0}}function ef(e,t,n){let r=e.field.isKeyField()?F.comparator(t.key,n.key):function(e,t,n){let r=t.data.field(e),i=n.data.field(e);return r!==null&&i!==null?zu(r,i):O(42886)}(e.field,t,n);switch(e.dir){case`asc`:return r;case`desc`:return-1*r;default:return O(19790,{direction:e.dir})}}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var tf=class{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(let[t,r]of n)if(this.equalsFn(t,e))return r}}has(e){return this.get(e)!==void 0}set(e,t){let n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let n=0;n<r.length;n++)if(this.equalsFn(r[n][0],e))return void(r[n]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return n.length===1?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){lu(this.inner,((t,n)=>{for(let[t,r]of n)e(t,r)}))}isEmpty(){return uu(this.inner)}size(){return this.innerSize}},nf=new V(F.comparator);function rf(){return nf}var af=new V(F.comparator);function sf(...e){let t=af;for(let n of e)t=t.insert(n.key,n);return t}function cf(e){let t=af;return e.forEach(((e,n)=>t=t.insert(e,n.overlayedDocument))),t}function lf(){return df()}function uf(){return df()}function df(){return new tf((e=>e.toString()),((e,t)=>e.isEqual(t)))}var ff=new V(F.comparator),pf=new H(F.comparator);function q(...e){let t=pf;for(let n of e)t=t.add(n);return t}var mf=new H(N);function hf(){return mf}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function gf(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:`NaN`};if(t===1/0)return{doubleValue:`Infinity`};if(t===-1/0)return{doubleValue:`-Infinity`}}return{doubleValue:Hc(t)?`-0`:t}}function _f(e){return{integerValue:``+e}}function vf(e,t){return Uc(t)?_f(t):gf(e,t)}
/**
* @license
* Copyright 2018 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var yf=class{constructor(){this._=void 0}};function bf(e,t,n){return e instanceof Cf?function(e,t){let n={fields:{[xu]:{stringValue:bu},[Cu]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&wu(t)&&(t=Tu(t)),t&&(n.fields[Su]=t),{mapValue:n}}(n,t):e instanceof wf?Tf(e,t):e instanceof Ef?Df(e,t):function(e,t){let n=Sf(e,t),r=kf(n)+kf(e.Ae);return Ku(n)&&Ku(e.Ae)?_f(r):gf(e.serializer,r)}(e,t)}function xf(e,t,n){return e instanceof wf?Tf(e,t):e instanceof Ef?Df(e,t):n}function Sf(e,t){return e instanceof Of?function(e){return Ku(e)||function(e){return!!e&&`doubleValue`in e}(e)}(t)?t:{integerValue:0}:null}var Cf=class extends yf{},wf=class extends yf{constructor(e){super(),this.elements=e}};function Tf(e,t){let n=Af(t);for(let t of e.elements)n.some((e=>Lu(e,t)))||n.push(t);return{arrayValue:{values:n}}}var Ef=class extends yf{constructor(e){super(),this.elements=e}};function Df(e,t){let n=Af(t);for(let t of e.elements)n=n.filter((e=>!Lu(e,t)));return{arrayValue:{values:n}}}var Of=class extends yf{constructor(e,t){super(),this.serializer=e,this.Ae=t}};function kf(e){return W(e.integerValue||e.doubleValue)}function Af(e){return qu(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var jf=class{constructor(e,t){this.field=e,this.transform=t}};function Mf(e,t){return e.field.isEqual(t.field)&&function(e,t){return e instanceof wf&&t instanceof wf||e instanceof Ef&&t instanceof Ef?Xs(e.elements,t.elements,Lu):e instanceof Of&&t instanceof Of?Lu(e.Ae,t.Ae):e instanceof Cf&&t instanceof Cf}(e.transform,t.transform)}var Nf=class{constructor(e,t){this.version=e,this.transformResults=t}},J=class e{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new e}static exists(t){return new e(void 0,t)}static updateTime(t){return new e(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}};function Pf(e,t){return e.updateTime===void 0?e.exists===void 0||e.exists===t.isFoundDocument():t.isFoundDocument()&&t.version.isEqual(e.updateTime)}var Ff=class{};function If(e,t){if(!e.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return e.isNoDocument()?new Kf(e.key,J.none()):new Vf(e.key,e.data,J.none());{let n=e.data,r=ad.empty(),i=new H(tc.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);t===null&&e.length>1&&(e=e.popLast(),t=n.field(e)),t===null?r.delete(e):r.set(e,t),i=i.add(e)}return new Hf(e.key,r,new hu(i.toArray()),J.none())}}function Lf(e,t,n){e instanceof Vf?function(e,t,n){let r=e.value.clone(),i=Wf(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof Hf?function(e,t,n){if(!Pf(e.precondition,t))return void t.convertToUnknownDocument(n.version);let r=Wf(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(Uf(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(e,t,n):function(e,t,n){t.convertToNoDocument(n.version).setHasCommittedMutations()}(0,t,n)}function Rf(e,t,n,r){return e instanceof Vf?function(e,t,n,r){if(!Pf(e.precondition,t))return n;let i=e.value.clone(),a=Gf(e.fieldTransforms,r,t);return i.setAll(a),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof Hf?function(e,t,n,r){if(!Pf(e.precondition,t))return n;let i=Gf(e.fieldTransforms,r,t),a=t.data;return a.setAll(Uf(e)),a.setAll(i),t.convertToFoundDocument(t.version,a).setHasLocalMutations(),n===null?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map((e=>e.field)))}(e,t,n,r):function(e,t,n){return Pf(e.precondition,t)?(t.convertToNoDocument(t.version).setHasLocalMutations(),null):n}(e,t,n)}function zf(e,t){let n=null;for(let r of e.fieldTransforms){let e=t.data.field(r.field),i=Sf(r.transform,e||null);i!=null&&(n===null&&(n=ad.empty()),n.set(r.field,i))}return n||null}function Bf(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&!!function(e,t){return e===void 0&&t===void 0||!(!e||!t)&&Xs(e,t,((e,t)=>Mf(e,t)))}(e.fieldTransforms,t.fieldTransforms)&&(e.type===0?e.value.isEqual(t.value):e.type!==1||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask))}var Vf=class extends Ff{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}},Hf=class extends Ff{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}};function Uf(e){let t=new Map;return e.fieldMask.fields.forEach((n=>{if(!n.isEmpty()){let r=e.data.field(n);t.set(n,r)}})),t}function Wf(e,t,n){let r=new Map;k(e.length===n.length,32656,{Re:n.length,Ve:e.length});for(let i=0;i<n.length;i++){let a=e[i],o=a.transform,s=t.data.field(a.field);r.set(a.field,xf(o,s,n[i]))}return r}function Gf(e,t,n){let r=new Map;for(let i of e){let e=i.transform,a=n.data.field(i.field);r.set(i.field,bf(e,a,t))}return r}var Kf=class extends Ff{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},qf=class extends Ff{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}},Jf=class{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){let n=t.mutationResults;for(let t=0;t<this.mutations.length;t++){let r=this.mutations[t];r.key.isEqual(e.key)&&Lf(r,e,n[t])}}applyToLocalView(e,t){for(let n of this.baseMutations)n.key.isEqual(e.key)&&(t=Rf(n,e,t,this.localWriteTime));for(let n of this.mutations)n.key.isEqual(e.key)&&(t=Rf(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let n=uf();return this.mutations.forEach((r=>{let i=e.get(r.key),a=i.overlayedDocument,o=this.applyToLocalView(a,i.mutatedFields);o=t.has(r.key)?null:o;let s=If(a,o);s!==null&&n.set(r.key,s),a.isValidDocument()||a.convertToNoDocument(R.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),q())}isEqual(e){return this.batchId===e.batchId&&Xs(this.mutations,e.mutations,((e,t)=>Bf(e,t)))&&Xs(this.baseMutations,e.baseMutations,((e,t)=>Bf(e,t)))}},Yf=class e{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(t,n,r){k(t.mutations.length===r.length,58842,{me:t.mutations.length,fe:r.length});let i=function(){return ff}(),a=t.mutations;for(let e=0;e<a.length;e++)i=i.insert(a[e].key,r[e].version);return new e(t,n,r,i)}},Xf=class{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}},Zf=class{constructor(e,t){this.count=e,this.unchangedNames=t}},Y,X;function Qf(e){switch(e){case j.OK:return O(64938);case j.CANCELLED:case j.UNKNOWN:case j.DEADLINE_EXCEEDED:case j.RESOURCE_EXHAUSTED:case j.INTERNAL:case j.UNAVAILABLE:case j.UNAUTHENTICATED:return!1;case j.INVALID_ARGUMENT:case j.NOT_FOUND:case j.ALREADY_EXISTS:case j.PERMISSION_DENIED:case j.FAILED_PRECONDITION:case j.ABORTED:case j.OUT_OF_RANGE:case j.UNIMPLEMENTED:case j.DATA_LOSS:return!0;default:return O(15467,{code:e})}}function $f(e){if(e===void 0)return D(`GRPC error has no .code`),j.UNKNOWN;switch(e){case Y.OK:return j.OK;case Y.CANCELLED:return j.CANCELLED;case Y.UNKNOWN:return j.UNKNOWN;case Y.DEADLINE_EXCEEDED:return j.DEADLINE_EXCEEDED;case Y.RESOURCE_EXHAUSTED:return j.RESOURCE_EXHAUSTED;case Y.INTERNAL:return j.INTERNAL;case Y.UNAVAILABLE:return j.UNAVAILABLE;case Y.UNAUTHENTICATED:return j.UNAUTHENTICATED;case Y.INVALID_ARGUMENT:return j.INVALID_ARGUMENT;case Y.NOT_FOUND:return j.NOT_FOUND;case Y.ALREADY_EXISTS:return j.ALREADY_EXISTS;case Y.PERMISSION_DENIED:return j.PERMISSION_DENIED;case Y.FAILED_PRECONDITION:return j.FAILED_PRECONDITION;case Y.ABORTED:return j.ABORTED;case Y.OUT_OF_RANGE:return j.OUT_OF_RANGE;case Y.UNIMPLEMENTED:return j.UNIMPLEMENTED;case Y.DATA_LOSS:return j.DATA_LOSS;default:return O(39323,{code:e})}}(X=Y||={})[X.OK=0]=`OK`,X[X.CANCELLED=1]=`CANCELLED`,X[X.UNKNOWN=2]=`UNKNOWN`,X[X.INVALID_ARGUMENT=3]=`INVALID_ARGUMENT`,X[X.DEADLINE_EXCEEDED=4]=`DEADLINE_EXCEEDED`,X[X.NOT_FOUND=5]=`NOT_FOUND`,X[X.ALREADY_EXISTS=6]=`ALREADY_EXISTS`,X[X.PERMISSION_DENIED=7]=`PERMISSION_DENIED`,X[X.UNAUTHENTICATED=16]=`UNAUTHENTICATED`,X[X.RESOURCE_EXHAUSTED=8]=`RESOURCE_EXHAUSTED`,X[X.FAILED_PRECONDITION=9]=`FAILED_PRECONDITION`,X[X.ABORTED=10]=`ABORTED`,X[X.OUT_OF_RANGE=11]=`OUT_OF_RANGE`,X[X.UNIMPLEMENTED=12]=`UNIMPLEMENTED`,X[X.INTERNAL=13]=`INTERNAL`,X[X.UNAVAILABLE=14]=`UNAVAILABLE`,X[X.DATA_LOSS=15]=`DATA_LOSS`;
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ep=null;
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function tp(){return new TextEncoder}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var np=new hs([4294967295,4294967295],0);function rp(e){let t=tp().encode(e),n=new gs;return n.update(t),new Uint8Array(n.digest())}function ip(e){let t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),i=t.getUint32(8,!0),a=t.getUint32(12,!0);return[new hs([n,r],0),new hs([i,a],0)]}var ap=class e{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new op(`Invalid padding: ${t}`);if(n<0||e.length>0&&this.hashCount===0)throw new op(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new op(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=hs.fromNumber(this.ge)}ye(e,t,n){let r=e.add(t.multiply(hs.fromNumber(n)));return r.compare(np)===1&&(r=new hs([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;let t=rp(e),[n,r]=ip(t);for(let e=0;e<this.hashCount;e++){let t=this.ye(n,r,e);if(!this.we(t))return!1}return!0}static create(t,n,r){let i=t%8==0?0:8-t%8,a=new Uint8Array(Math.ceil(t/8)),o=new e(a,i,n);return r.forEach((e=>o.insert(e))),o}insert(e){if(this.ge===0)return;let t=rp(e),[n,r]=ip(t);for(let e=0;e<this.hashCount;e++){let t=this.ye(n,r,e);this.Se(t)}}Se(e){let t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}},op=class extends Error{constructor(){super(...arguments),this.name=`BloomFilterError`}},sp=class e{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,n,r){let i=new Map;return i.set(t,cp.createSynthesizedTargetChangeForCurrentChange(t,n,r)),new e(R.min(),i,new V(N),rf(),q())}},cp=class e{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,n,r){return new e(r,n,q(),q(),q())}},lp=class{constructor(e,t,n,r){this.be=e,this.removedTargetIds=t,this.key=n,this.De=r}},up=class{constructor(e,t){this.targetId=e,this.Ce=t}},dp=class{constructor(e,t,n=U.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}},fp=class{constructor(){this.ve=0,this.Fe=hp(),this.Me=U.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=q(),t=q(),n=q();return this.Fe.forEach(((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:O(38017,{changeType:i})}})),new cp(this.Me,this.xe,e,t,n)}qe(){this.Oe=!1,this.Fe=hp()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){--this.ve,k(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}},pp=class{constructor(e){this.Ge=e,this.ze=new Map,this.je=rf(),this.Je=mp(),this.He=mp(),this.Ye=new V(N)}Ze(e){for(let t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(let t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{let n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(e.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.We(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:O(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((e,n)=>{this.rt(n)&&t(n)}))}st(e){let t=e.targetId,n=e.Ce.count,r=this.ot(t);if(r){let i=r.target;if(Pd(i))if(n===0){let e=new F(i.path);this.et(t,e,sd.newNoDocument(e,R.min()))}else k(n===1,20013,{expectedCount:n});else{let r=this._t(t);if(r!==n){let n=this.ut(e),i=n?this.ct(n,e,r):1;if(i!==0){this.it(t);let e=i===2?`TargetPurposeExistenceFilterMismatchBloom`:`TargetPurposeExistenceFilterMismatch`;this.Ye=this.Ye.insert(t,e)}ep?.lt(function(e,t,n,r,i){let a={localCacheCount:e,existenceFilterCount:t.count,databaseId:n.database,projectId:n.projectId},o=t.unchangedNames;return o&&(a.bloomFilter={applied:i===0,hashCount:o?.hashCount??0,bitmapLength:o?.bits?.bitmap?.length??0,padding:o?.bits?.padding??0,mightContain:e=>r?.mightContain(e)??!1}),a}(r,e.Ce,this.Ge.ht(),n,i))}}}}ut(e){let t=e.Ce.unchangedNames;if(!t||!t.bits)return null;let{bits:{bitmap:n=``,padding:r=0},hashCount:i=0}=t,a,o;try{a=yu(n).toUint8Array()}catch(e){if(e instanceof gu)return Ns(`Decoding the base64 bloom filter in existence filter failed (`+e.message+`); ignoring the bloom filter and falling back to full re-query.`),null;throw e}try{o=new ap(a,r,i)}catch(e){return Ns(e instanceof op?`BloomFilter error: `:`Applying bloom filter failed: `,e),null}return o.ge===0?null:o}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){let n=this.Ge.getRemoteKeysForTarget(t),r=0;return n.forEach((n=>{let i=this.Ge.ht(),a=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(a)||(this.et(t,n,null),r++)})),r}Tt(e){let t=new Map;this.ze.forEach(((n,r)=>{let i=this.ot(r);if(i){if(n.current&&Pd(i.target)){let t=new F(i.target.path);this.It(t).has(r)||this.Et(r,t)||this.et(r,t,sd.newNoDocument(t,e))}n.Be&&(t.set(r,n.ke()),n.qe())}}));let n=q();this.He.forEach(((e,t)=>{let r=!0;t.forEachWhile((e=>{let t=this.ot(e);return!t||t.purpose===`TargetPurposeLimboResolution`||(r=!1,!1)})),r&&(n=n.add(e))})),this.je.forEach(((t,n)=>n.setReadTime(e)));let r=new sp(e,t,this.Ye,this.je,n);return this.je=rf(),this.Je=mp(),this.He=mp(),this.Ye=new V(N),r}Xe(e,t){if(!this.rt(e))return;let n=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;let r=this.nt(e);this.Et(e,t)?r.Qe(t,1):r.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){let t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new fp,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new H(N),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new H(N),this.Je=this.Je.insert(e,t)),t}rt(e){let t=this.ot(e)!==null;return t||E(`WatchChangeAggregator`,`Detected inactive target`,e),t}ot(e){let t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new fp),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}};function mp(){return new V(F.comparator)}function hp(){return new V(F.comparator)}var gp=(()=>({asc:`ASCENDING`,desc:`DESCENDING`}))(),_p=(()=>({"<":`LESS_THAN`,"<=":`LESS_THAN_OR_EQUAL`,">":`GREATER_THAN`,">=":`GREATER_THAN_OR_EQUAL`,"==":`EQUAL`,"!=":`NOT_EQUAL`,"array-contains":`ARRAY_CONTAINS`,in:`IN`,"not-in":`NOT_IN`,"array-contains-any":`ARRAY_CONTAINS_ANY`}))(),vp=(()=>({and:`AND`,or:`OR`}))(),yp=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function bp(e,t){return e.useProto3Json||Vc(t)?t:{value:t}}function xp(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,``).replace(`Z`,``)}.${(`000000000`+t.nanoseconds).slice(-9)}Z`:{seconds:``+t.seconds,nanos:t.nanoseconds}}function Sp(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Cp(e,t){return xp(e,t.toTimestamp())}function Z(e){return k(!!e,49232),R.fromTimestamp(function(e){let t=vu(e);return new L(t.seconds,t.nanos)}(e))}function wp(e,t){return Tp(e,t).canonicalString()}function Tp(e,t){let n=function(e){return new P([`projects`,e.projectId,`databases`,e.database])}(e).child(`documents`);return t===void 0?n:n.child(t)}function Ep(e){let t=P.fromString(e);return k(Qp(t),10190,{key:t.toString()}),t}function Dp(e,t){return wp(e.databaseId,t.path)}function Op(e,t){let n=Ep(t);if(n.get(1)!==e.databaseId.projectId)throw new M(j.INVALID_ARGUMENT,`Tried to deserialize key from different project: `+n.get(1)+` vs `+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new M(j.INVALID_ARGUMENT,`Tried to deserialize key from different database: `+n.get(3)+` vs `+e.databaseId.database);return new F(Mp(n))}function kp(e,t){return wp(e.databaseId,t)}function Ap(e){let t=Ep(e);return t.length===4?P.emptyPath():Mp(t)}function jp(e){return new P([`projects`,e.databaseId.projectId,`databases`,e.databaseId.database]).canonicalString()}function Mp(e){return k(e.length>4&&e.get(4)===`documents`,29091,{key:e.toString()}),e.popFirst(5)}function Np(e,t,n){return{name:Dp(e,t),fields:n.value.mapValue.fields}}function Pp(e,t,n){let r=Op(e,t.name),i=Z(t.updateTime),a=t.createTime?Z(t.createTime):R.min(),o=new ad({mapValue:{fields:t.fields}}),s=sd.newFoundDocument(r,i,a,o);return n&&s.setHasCommittedMutations(),n?s.setHasCommittedMutations():s}function Fp(e,t){return`found`in t?function(e,t){k(!!t.found,43571),t.found.name,t.found.updateTime;let n=Op(e,t.found.name),r=Z(t.found.updateTime),i=t.found.createTime?Z(t.found.createTime):R.min(),a=new ad({mapValue:{fields:t.found.fields}});return sd.newFoundDocument(n,r,i,a)}(e,t):`missing`in t?function(e,t){k(!!t.missing,3894),k(!!t.readTime,22933);let n=Op(e,t.missing),r=Z(t.readTime);return sd.newNoDocument(n,r)}(e,t):O(7234,{result:t})}function Ip(e,t){let n;if(`targetChange`in t){t.targetChange;let r=function(e){return e===`NO_CHANGE`?0:e===`ADD`?1:e===`REMOVE`?2:e===`CURRENT`?3:e===`RESET`?4:O(39313,{state:e})}(t.targetChange.targetChangeType||`NO_CHANGE`),i=t.targetChange.targetIds||[],a=function(e,t){return e.useProto3Json?(k(t===void 0||typeof t==`string`,58123),U.fromBase64String(t||``)):(k(t===void 0||t instanceof Buffer||t instanceof Uint8Array,16193),U.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),o=t.targetChange.cause,s=o&&function(e){let t=e.code===void 0?j.UNKNOWN:$f(e.code);return new M(t,e.message||``)}(o);n=new dp(r,i,a,s||null)}else if(`documentChange`in t){t.documentChange;let r=t.documentChange;r.document,r.document.name,r.document.updateTime;let i=Op(e,r.document.name),a=Z(r.document.updateTime),o=r.document.createTime?Z(r.document.createTime):R.min(),s=new ad({mapValue:{fields:r.document.fields}}),c=sd.newFoundDocument(i,a,o,s),l=r.targetIds||[],u=r.removedTargetIds||[];n=new lp(l,u,c.key,c)}else if(`documentDelete`in t){t.documentDelete;let r=t.documentDelete;r.document;let i=Op(e,r.document),a=r.readTime?Z(r.readTime):R.min(),o=sd.newNoDocument(i,a),s=r.removedTargetIds||[];n=new lp([],s,o.key,o)}else if(`documentRemove`in t){t.documentRemove;let r=t.documentRemove;r.document;let i=Op(e,r.document),a=r.removedTargetIds||[];n=new lp([],a,i,null)}else{if(!(`filter`in t))return O(11601,{Rt:t});{t.filter;let e=t.filter;e.targetId;let{count:r=0,unchangedNames:i}=e,a=new Zf(r,i),o=e.targetId;n=new up(o,a)}}return n}function Lp(e,t){let n;if(t instanceof Vf)n={update:Np(e,t.key,t.value)};else if(t instanceof Kf)n={delete:Dp(e,t.key)};else if(t instanceof Hf)n={update:Np(e,t.key,t.data),updateMask:Zp(t.fieldMask)};else{if(!(t instanceof qf))return O(16599,{Vt:t.type});n={verify:Dp(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map((e=>function(e,t){let n=t.transform;if(n instanceof Cf)return{fieldPath:t.field.canonicalString(),setToServerValue:`REQUEST_TIME`};if(n instanceof wf)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof Ef)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof Of)return{fieldPath:t.field.canonicalString(),increment:n.Ae};throw O(20930,{transform:t.transform})}(0,e)))),t.precondition.isNone||(n.currentDocument=function(e,t){return t.updateTime===void 0?t.exists===void 0?O(27497):{exists:t.exists}:{updateTime:Cp(e,t.updateTime)}}(e,t.precondition)),n}function Rp(e,t){let n=t.currentDocument?function(e){return e.updateTime===void 0?e.exists===void 0?J.none():J.exists(e.exists):J.updateTime(Z(e.updateTime))}(t.currentDocument):J.none(),r=t.updateTransforms?t.updateTransforms.map((t=>function(e,t){let n=null;if(`setToServerValue`in t)k(t.setToServerValue===`REQUEST_TIME`,16630,{proto:t}),n=new Cf;else if(`appendMissingElements`in t){let e=t.appendMissingElements.values||[];n=new wf(e)}else if(`removeAllFromArray`in t){let e=t.removeAllFromArray.values||[];n=new Ef(e)}else `increment`in t?n=new Of(e,t.increment):O(16584,{proto:t});let r=tc.fromServerFormat(t.fieldPath);return new jf(r,n)}(e,t))):[];if(t.update){t.update.name;let i=Op(e,t.update.name),a=new ad({mapValue:{fields:t.update.fields}});if(t.updateMask){let e=function(e){let t=e.fieldPaths||[];return new hu(t.map((e=>tc.fromServerFormat(e))))}(t.updateMask);return new Hf(i,a,e,n,r)}return new Vf(i,a,n,r)}if(t.delete){let r=Op(e,t.delete);return new Kf(r,n)}if(t.verify){let r=Op(e,t.verify);return new qf(r,n)}return O(1463,{proto:t})}function zp(e,t){return e&&e.length>0?(k(t!==void 0,14353),e.map((e=>function(e,t){let n=e.updateTime?Z(e.updateTime):Z(t);return n.isEqual(R.min())&&(n=Z(t)),new Nf(n,e.transformResults||[])}(e,t)))):[]}function Bp(e,t){return{documents:[kp(e,t.path)]}}function Vp(e,t){let n={structuredQuery:{}},r=t.path,i;t.collectionGroup===null?(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]):(i=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]),n.parent=kp(e,i);let a=function(e){if(e.length!==0)return Xp(K.create(e,`and`))}(t.filters);a&&(n.structuredQuery.where=a);let o=function(e){if(e.length!==0)return e.map((e=>function(e){return{field:Jp(e.field),direction:Gp(e.dir)}}(e)))}(t.orderBy);o&&(n.structuredQuery.orderBy=o);let s=bp(e,t.limit);return s!==null&&(n.structuredQuery.limit=s),t.startAt&&(n.structuredQuery.startAt=function(e){return{before:e.inclusive,values:e.position}}(t.startAt)),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{ft:n,parent:i}}function Hp(e){let t=Ap(e.parent),n=e.structuredQuery,r=n.from?n.from.length:0,i=null;if(r>0){k(r===1,65062);let e=n.from[0];e.allDescendants?i=e.collectionId:t=t.child(e.collectionId)}let a=[];n.where&&(a=function(e){let t=Wp(e);return t instanceof K&&gd(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=function(e){return e.map((e=>function(e){return new dd(Yp(e.field),function(e){switch(e){case`ASCENDING`:return`asc`;case`DESCENDING`:return`desc`;default:return}}(e.direction))}(e)))}(n.orderBy));let s=null;n.limit&&(s=function(e){let t;return t=typeof e==`object`?e.value:e,Vc(t)?null:t}(n.limit));let c=null;n.startAt&&(c=function(e){let t=!!e.before,n=e.values||[];return new cd(n,t)}(n.startAt));let l=null;return n.endAt&&(l=function(e){let t=!e.before,n=e.values||[];return new cd(n,t)}(n.endAt)),zd(t,i,o,a,s,`F`,c,l)}function Up(e,t){let n=function(e){switch(e){case`TargetPurposeListen`:return null;case`TargetPurposeExistenceFilterMismatch`:return`existence-filter-mismatch`;case`TargetPurposeExistenceFilterMismatchBloom`:return`existence-filter-mismatch-bloom`;case`TargetPurposeLimboResolution`:return`limbo-document`;default:return O(28987,{purpose:e})}}(t.purpose);return n==null?null:{"goog-listen-tags":n}}function Wp(e){return e.unaryFilter===void 0?e.fieldFilter===void 0?e.compositeFilter===void 0?O(30097,{filter:e}):function(e){return K.create(e.compositeFilter.filters.map((e=>Wp(e))),function(e){switch(e){case`AND`:return`and`;case`OR`:return`or`;default:return O(1026)}}(e.compositeFilter.op))}(e):function(e){return G.create(Yp(e.fieldFilter.field),function(e){switch(e){case`EQUAL`:return`==`;case`NOT_EQUAL`:return`!=`;case`GREATER_THAN`:return`>`;case`GREATER_THAN_OR_EQUAL`:return`>=`;case`LESS_THAN`:return`<`;case`LESS_THAN_OR_EQUAL`:return`<=`;case`ARRAY_CONTAINS`:return`array-contains`;case`IN`:return`in`;case`NOT_IN`:return`not-in`;case`ARRAY_CONTAINS_ANY`:return`array-contains-any`;case`OPERATOR_UNSPECIFIED`:return O(58110);default:return O(50506)}}(e.fieldFilter.op),e.fieldFilter.value)}(e):function(e){switch(e.unaryFilter.op){case`IS_NAN`:let t=Yp(e.unaryFilter.field);return G.create(t,`==`,{doubleValue:NaN});case`IS_NULL`:let n=Yp(e.unaryFilter.field);return G.create(n,`==`,{nullValue:`NULL_VALUE`});case`IS_NOT_NAN`:let r=Yp(e.unaryFilter.field);return G.create(r,`!=`,{doubleValue:NaN});case`IS_NOT_NULL`:let i=Yp(e.unaryFilter.field);return G.create(i,`!=`,{nullValue:`NULL_VALUE`});case`OPERATOR_UNSPECIFIED`:return O(61313);default:return O(60726)}}(e)}function Gp(e){return gp[e]}function Kp(e){return _p[e]}function qp(e){return vp[e]}function Jp(e){return{fieldPath:e.canonicalString()}}function Yp(e){return tc.fromServerFormat(e.fieldPath)}function Xp(e){return e instanceof G?function(e){if(e.op===`==`){if(Yu(e.value))return{unaryFilter:{field:Jp(e.field),op:`IS_NAN`}};if(Ju(e.value))return{unaryFilter:{field:Jp(e.field),op:`IS_NULL`}}}else if(e.op===`!=`){if(Yu(e.value))return{unaryFilter:{field:Jp(e.field),op:`IS_NOT_NAN`}};if(Ju(e.value))return{unaryFilter:{field:Jp(e.field),op:`IS_NOT_NULL`}}}return{fieldFilter:{field:Jp(e.field),op:Kp(e.op),value:e.value}}}(e):e instanceof K?function(e){let t=e.getFilters().map((e=>Xp(e)));return t.length===1?t[0]:{compositeFilter:{op:qp(e.op),filters:t}}}(e):O(54877,{filter:e})}function Zp(e){let t=[];return e.fields.forEach((e=>t.push(e.canonicalString()))),{fieldPaths:t}}function Qp(e){return e.length>=4&&e.get(0)===`projects`&&e.get(2)===`databases`}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var $p=class e{constructor(e,t,n,r,i=R.min(),a=R.min(),o=U.EMPTY_BYTE_STRING,s=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=o,this.expectedCount=s}withSequenceNumber(t){return new e(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,n){return new e(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new e(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new e(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}},em=class{constructor(e){this.yt=e}};function tm(e,t){let n;if(t.document)n=Pp(e.yt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){let e=F.fromSegments(t.noDocument.path),r=am(t.noDocument.readTime);n=sd.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return O(56709);{let e=F.fromSegments(t.unknownDocument.path),r=am(t.unknownDocument.version);n=sd.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){let t=new L(e[0],e[1]);return R.fromTimestamp(t)}(t.readTime)),n}function nm(e,t){let n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:rm(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())r.document=function(e,t){return{name:Dp(e,t.key),fields:t.data.value.mapValue.fields,updateTime:xp(e,t.version.toTimestamp()),createTime:xp(e,t.createTime.toTimestamp())}}(e.yt,t);else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:im(t.version)};else{if(!t.isUnknownDocument())return O(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:im(t.version)}}return r}function rm(e){let t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function im(e){let t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function am(e){let t=new L(e.seconds,e.nanoseconds);return R.fromTimestamp(t)}function om(e,t){let n=(t.baseMutations||[]).map((t=>Rp(e.yt,t)));for(let e=0;e<t.mutations.length-1;++e){let n=t.mutations[e];e+1<t.mutations.length&&t.mutations[e+1].transform!==void 0&&(n.updateTransforms=t.mutations[e+1].transform.fieldTransforms,t.mutations.splice(e+1,1),++e)}let r=t.mutations.map((t=>Rp(e.yt,t))),i=L.fromMillis(t.localWriteTimeMs);return new Jf(t.batchId,i,n,r)}function sm(e){let t=am(e.readTime),n=e.lastLimboFreeSnapshotVersion===void 0?R.min():am(e.lastLimboFreeSnapshotVersion),r;return r=function(e){return e.documents!==void 0}(e.query)?function(e){let t=e.documents.length;return k(t===1,1966,{count:t}),Wd(Bd(Ap(e.documents[0])))}(e.query):function(e){return Wd(Hp(e))}(e.query),new $p(r,e.targetId,`TargetPurposeListen`,e.lastListenSequenceNumber,t,n,U.fromBase64String(e.resumeToken))}function cm(e,t){let n=im(t.snapshotVersion),r=im(t.lastLimboFreeSnapshotVersion),i;i=Pd(t.target)?Bp(e.yt,t.target):Vp(e.yt,t.target).ft;let a=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:Md(t.target),readTime:n,resumeToken:a,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function lm(e){let t=Hp({parent:e.parent,structuredQuery:e.structuredQuery});return e.limitType===`LAST`?qd(t,t.limit,`L`):t}function um(e,t){return new Xf(t.largestBatchId,Rp(e.yt,t.overlayMutation))}function dm(e,t){let n=t.path.lastSegment();return[e,Gc(t.path.popLast()),n]}function fm(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:im(r.readTime),documentKey:Gc(r.documentKey.path),largestBatchId:r.largestBatchId}}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var pm=class{getBundleMetadata(e,t){return mm(e).get(t).next((e=>{if(e)return function(e){return{id:e.bundleId,createTime:am(e.createTime),version:e.version}}(e)}))}saveBundleMetadata(e,t){return mm(e).put(function(e){return{bundleId:e.id,createTime:im(Z(e.createTime)),version:e.version}}(t))}getNamedQuery(e,t){return hm(e).get(t).next((e=>{if(e)return function(e){return{name:e.name,query:lm(e.bundledQuery),readTime:am(e.readTime)}}(e)}))}saveNamedQuery(e,t){return hm(e).put(function(e){return{name:e.name,readTime:im(Z(e.readTime)),bundledQuery:e.bundledQuery}}(t))}};function mm(e){return B(e,kl)}function hm(e){return B(e,jl)}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var gm=class e{constructor(e,t){this.serializer=e,this.userId=t}static wt(t,n){let r=n.uid||``;return new e(t,r)}getOverlay(e,t){return _m(e).get(dm(this.userId,t)).next((e=>e?um(this.serializer,e):null))}getOverlays(e,t){let n=lf();return z.forEach(t,(t=>this.getOverlay(e,t).next((e=>{e!==null&&n.set(t,e)})))).next((()=>n))}saveOverlays(e,t,n){let r=[];return n.forEach(((n,i)=>{let a=new Xf(t,i);r.push(this.St(e,a))})),z.waitFor(r)}removeOverlaysForBatchId(e,t,n){let r=new Set;t.forEach((e=>r.add(Gc(e.getCollectionPath()))));let i=[];return r.forEach((t=>{let r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);i.push(_m(e).Z(ql,r))})),z.waitFor(i)}getOverlaysForCollection(e,t,n){let r=lf(),i=Gc(t),a=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,1/0],!0);return _m(e).J(ql,a).next((e=>{for(let t of e){let e=um(this.serializer,t);r.set(e.getKey(),e)}return r}))}getOverlaysForCollectionGroup(e,t,n,r){let i=lf(),a,o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,1/0],!0);return _m(e).ee({index:Yl,range:o},((e,t,n)=>{let o=um(this.serializer,t);i.size()<r||o.largestBatchId===a?(i.set(o.getKey(),o),a=o.largestBatchId):n.done()})).next((()=>i))}St(e,t){return _m(e).put(function(e,t,n){let[r,i,a]=dm(t,n.mutation.key);return{userId:t,collectionPath:i,documentId:a,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:Lp(e.yt,n.mutation)}}(this.serializer,this.userId,t))}};function _m(e){return B(e,Gl)}
/**
* @license
* Copyright 2024 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var vm=class{bt(e){return B(e,Zl)}getSessionToken(e){return this.bt(e).get(`sessionToken`).next((e=>{let t=e?.value;return t?U.fromUint8Array(t):U.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.bt(e).put({name:`sessionToken`,value:t.toUint8Array()})}},ym=class{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if(`nullValue`in e)this.Ft(t,5);else if(`booleanValue`in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if(`integerValue`in e)this.Ft(t,15),t.Mt(W(e.integerValue));else if(`doubleValue`in e){let n=W(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),Hc(n)?t.Mt(0):t.Mt(n))}else if(`timestampValue`in e){let n=e.timestampValue;this.Ft(t,20),typeof n==`string`&&(n=vu(n)),t.xt(`${n.seconds||``}`),t.Mt(n.nanos||0)}else if(`stringValue`in e)this.Ot(e.stringValue,t),this.Nt(t);else if(`bytesValue`in e)this.Ft(t,30),t.Bt(yu(e.bytesValue)),this.Nt(t);else if(`referenceValue`in e)this.Lt(e.referenceValue,t);else if(`geoPointValue`in e){let n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else `mapValue`in e?$u(e)?this.Ft(t,2**53-1):Zu(e)?this.kt(e.mapValue,t):(this.qt(e.mapValue,t),this.Nt(t)):`arrayValue`in e?(this.Qt(e.arrayValue,t),this.Nt(t)):O(19022,{$t:e})}Ot(e,t){this.Ft(t,25),this.Ut(e,t)}Ut(e,t){t.xt(e)}qt(e,t){let n=e.fields||{};this.Ft(t,55);for(let e of Object.keys(n))this.Ot(e,t),this.Ct(n[e],t)}kt(e,t){let n=e.fields||{};this.Ft(t,53);let r=Pu,i=n[r].arrayValue?.values?.length||0;this.Ft(t,15),t.Mt(W(i)),this.Ot(r,t),this.Ct(n[r],t)}Qt(e,t){let n=e.values||[];this.Ft(t,50);for(let e of n)this.Ct(e,t)}Lt(e,t){this.Ft(t,37),F.fromName(e).path.forEach((e=>{this.Ft(t,60),this.Ut(e,t)}))}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}};ym.Kt=new ym;
/**
* @license
* Copyright 2021 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law | agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var bm=255;function xm(e){if(e===0)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}function Sm(e){let t=64-function(e){let t=0;for(let n=0;n<8;++n){let r=xm(255&e[n]);if(t+=r,r!==8)break}return t}(e);return Math.ceil(t/8)}var Cm=class{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Wt(e){let t=e[Symbol.iterator](),n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){let t=e[Symbol.iterator](),n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Ht()}Yt(e){for(let t of e){let e=t.charCodeAt(0);if(e<128)this.Gt(e);else if(e<2048)this.Gt(960|e>>>6),this.Gt(128|63&e);else if(t<`\ud800`||`\udbff`<t)this.Gt(480|e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e);else{let e=t.codePointAt(0);this.Gt(240|e>>>18),this.Gt(128|63&e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e)}}this.zt()}Zt(e){for(let t of e){let e=t.charCodeAt(0);if(e<128)this.Jt(e);else if(e<2048)this.Jt(960|e>>>6),this.Jt(128|63&e);else if(t<`\ud800`||`\udbff`<t)this.Jt(480|e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e);else{let e=t.codePointAt(0);this.Jt(240|e>>>18),this.Jt(128|63&e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e)}}this.Ht()}Xt(e){let t=this.en(e),n=Sm(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let e=t.length-n;e<t.length;++e)this.buffer[this.position++]=255&t[e]}nn(e){let t=this.en(e),n=Sm(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let e=t.length-n;e<t.length;++e)this.buffer[this.position++]=~(255&t[e])}rn(){this.sn(bm),this.sn(255)}_n(){this.an(bm),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){let t=function(e){let t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let e=1;e<t.length;++e)t[e]^=n?255:0;return t}Gt(e){let t=255&e;t===0?(this.sn(0),this.sn(255)):t===bm?(this.sn(bm),this.sn(0)):this.sn(t)}Jt(e){let t=255&e;t===0?(this.an(0),this.an(255)):t===bm?(this.an(bm),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){let t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);let r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}},wm=class{constructor(e){this.cn=e}Bt(e){this.cn.Wt(e)}xt(e){this.cn.Yt(e)}Mt(e){this.cn.Xt(e)}vt(){this.cn.rn()}},Tm=class{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}},Em=class{constructor(){this.cn=new Cm,this.ln=new wm(this.cn),this.hn=new Tm(this.cn)}seed(e){this.cn.seed(e)}Pn(e){return e===0?this.ln:this.hn}un(){return this.cn.un()}reset(){this.cn.reset()}},Dm=class e{constructor(e,t,n,r){this.Tn=e,this.In=t,this.En=n,this.dn=r}An(){let t=this.dn.length,n=t===0||this.dn[t-1]===255?t+1:t,r=new Uint8Array(n);return r.set(this.dn,0),n===t?++r[r.length-1]:r.set([0],this.dn.length),new e(this.Tn,this.In,this.En,r)}Rn(e,t,n){return{indexId:this.Tn,uid:e,arrayValue:Am(this.En),directionalValue:Am(this.dn),orderedDocumentKey:Am(t),documentKey:n.path.toArray()}}Vn(e,t,n){let r=this.Rn(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}};function Om(e,t){let n=e.Tn-t.Tn;return n===0?(n=km(e.En,t.En),n===0?(n=km(e.dn,t.dn),n===0?F.comparator(e.In,t.In):n):n):n}function km(e,t){for(let n=0;n<e.length&&n<t.length;++n){let r=e[n]-t[n];if(r!==0)return r}return e.length-t.length}function Am(e){return me()?function(e){let t=``;for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function jm(e){return typeof e==`string`?function(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e):e}var Mm=class{constructor(e){this.mn=new H(((e,t)=>tc.comparator(e.field,t.field))),this.collectionId=e.collectionGroup==null?e.path.lastSegment():e.collectionGroup,this.fn=e.orderBy,this.gn=[];for(let t of e.filters){let e=t;e.isInequality()?this.mn=this.mn.add(e):this.gn.push(e)}}get pn(){return this.mn.size>1}yn(e){if(k(e.collectionGroup===this.collectionId,49279),this.pn)return!1;let t=mc(e);if(t!==void 0&&!this.wn(t))return!1;let n=hc(e),r=new Set,i=0,a=0;for(;i<n.length&&this.wn(n[i]);++i)r=r.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.mn.size>0){let e=this.mn.getIterator().getNext();if(!r.has(e.field.canonicalString())){let t=n[i];if(!this.Sn(e,t)||!this.bn(this.fn[a++],t))return!1}++i}for(;i<n.length;++i){let e=n[i];if(a>=this.fn.length||!this.bn(this.fn[a++],e))return!1}return!0}Dn(){if(this.pn)return null;let e=new H(tc.comparator),t=[];for(let n of this.gn)if(!n.field.isKeyField())if(n.op===`array-contains`||n.op===`array-contains-any`)t.push(new gc(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new gc(n.field,0))}for(let n of this.fn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new gc(n.field,n.dir===`asc`?0:1)));return new pc(pc.UNKNOWN_ID,this.collectionId,t,_c.empty())}wn(e){for(let t of this.gn)if(this.Sn(t,e))return!0;return!1}Sn(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;let n=e.op===`array-contains`||e.op===`array-contains-any`;return t.kind===2===n}bn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir===`asc`||t.kind===1&&e.dir===`desc`)}};
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Nm(e){if(k(e instanceof G||e instanceof K,20012),e instanceof G){if(e instanceof Dd){let t=e.value.arrayValue?.values?.map((t=>G.create(e.field,`==`,t)))||[];return K.create(t,`or`)}return e}let t=e.filters.map((e=>Nm(e)));return K.create(t,e.op)}function Pm(e){if(e.getFilters().length===0)return[];let t=Rm(Nm(e));return k(Lm(t),7391),Fm(t)||Im(t)?[t]:t.getFilters()}function Fm(e){return e instanceof G}function Im(e){return e instanceof K&&gd(e)}function Lm(e){return Fm(e)||Im(e)||function(e){if(e instanceof K&&hd(e)){for(let t of e.getFilters())if(!Fm(t)&&!Im(t))return!1;return!0}return!1}(e)}function Rm(e){if(k(e instanceof G||e instanceof K,34018),e instanceof G)return e;if(e.filters.length===1)return Rm(e.filters[0]);let t=e.filters.map((e=>Rm(e))),n=K.create(t,e.op);return n=Vm(n),Lm(n)?n:(k(n instanceof K,64498),k(md(n),40251),k(n.filters.length>1,57927),n.filters.reduce(((e,t)=>zm(e,t))))}function zm(e,t){let n;return k(e instanceof G||e instanceof K,38388),k(t instanceof G||t instanceof K,25473),n=e instanceof G?t instanceof G?function(e,t){return K.create([e,t],`and`)}(e,t):Bm(e,t):t instanceof G?Bm(t,e):function(e,t){if(k(e.filters.length>0&&t.filters.length>0,48005),md(e)&&md(t))return bd(e,t.getFilters());let n=hd(e)?e:t,r=hd(e)?t:e,i=n.filters.map((e=>zm(e,r)));return K.create(i,`or`)}(e,t),Vm(n)}function Bm(e,t){if(md(t))return bd(t,e.getFilters());{let n=t.filters.map((t=>zm(e,t)));return K.create(n,`or`)}}function Vm(e){if(k(e instanceof G||e instanceof K,11850),e instanceof G)return e;let t=e.getFilters();if(t.length===1)return Vm(t[0]);if(_d(e))return e;let n=t.map((e=>Vm(e))),r=[];return n.forEach((t=>{t instanceof G?r.push(t):t instanceof K&&(t.op===e.op?r.push(...t.filters):r.push(t))})),r.length===1?r[0]:K.create(r,e.op)}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Hm=class{constructor(){this.Cn=new Um}addToCollectionParentIndex(e,t){return this.Cn.add(t),z.resolve()}getCollectionParents(e,t){return z.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return z.resolve()}deleteFieldIndex(e,t){return z.resolve()}deleteAllFieldIndexes(e){return z.resolve()}createTargetIndexes(e,t){return z.resolve()}getDocumentsMatchingTarget(e,t){return z.resolve(null)}getIndexType(e,t){return z.resolve(0)}getFieldIndexes(e,t){return z.resolve([])}getNextCollectionGroupToUpdate(e){return z.resolve(null)}getMinOffset(e,t){return z.resolve(bc.min())}getMinOffsetFromCollectionGroup(e,t){return z.resolve(bc.min())}updateCollectionGroup(e,t,n){return z.resolve()}updateIndexEntries(e,t){return z.resolve()}},Um=class{constructor(){this.index={}}add(e){let t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new H(P.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){let t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new H(P.comparator)).toArray()}},Wm=`IndexedDbIndexManager`,Gm=new Uint8Array,Km=class{constructor(e,t){this.databaseId=t,this.vn=new Um,this.Fn=new tf((e=>Md(e)),((e,t)=>Nd(e,t))),this.uid=e.uid||``}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){let n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener((()=>{this.vn.add(t)}));let i={collectionId:n,parent:Gc(r)};return qm(e).put(i)}return z.resolve()}getCollectionParents(e,t){let n=[],r=IDBKeyRange.bound([t,``],[Zs(t),``],!1,!0);return qm(e).J(r).next((e=>{for(let r of e){if(r.collectionId!==t)break;n.push(Jc(r.parent))}return n}))}addFieldIndex(e,t){let n=Ym(e),r=function(e){return{indexId:e.indexId,collectionGroup:e.collectionGroup,fields:e.fields.map((e=>[e.fieldPath.canonicalString(),e.kind]))}}(t);delete r.indexId;let i=n.add(r);if(t.indexState){let n=Xm(e);return i.next((e=>{n.put(fm(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){let n=Ym(e),r=Xm(e),i=Jm(e);return n.delete(t.indexId).next((()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){let t=Ym(e),n=Jm(e),r=Xm(e);return t.Z().next((()=>n.Z())).next((()=>r.Z()))}createTargetIndexes(e,t){return z.forEach(this.Mn(t),(t=>this.getIndexType(e,t).next((n=>{if(n===0||n===1){let n=new Mm(t).Dn();if(n!=null)return this.addFieldIndex(e,n)}}))))}getDocumentsMatchingTarget(e,t){let n=Jm(e),r=!0,i=new Map;return z.forEach(this.Mn(t),(t=>this.xn(e,t).next((e=>{r&&=!!e,i.set(t,e)})))).next((()=>{if(r){let e=q(),r=[];return z.forEach(i,((i,a)=>{E(Wm,`Using index ${function(e){return`id=${e.indexId}|cg=${e.collectionGroup}|f=${e.fields.map((e=>`${e.fieldPath}:${e.kind}`)).join(`,`)}`}(i)} to execute ${Md(t)}`);let o=function(e,t){let n=mc(t);if(n===void 0)return null;for(let t of Fd(e,n.fieldPath))switch(t.op){case`array-contains-any`:return t.value.arrayValue.values||[];case`array-contains`:return[t.value]}return null}(a,i),s=function(e,t){let n=new Map;for(let r of hc(t))for(let t of Fd(e,r.fieldPath))switch(t.op){case`==`:case`in`:n.set(r.fieldPath.canonicalString(),t.value);break;case`not-in`:case`!=`:return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(a,i),c=function(e,t){let n=[],r=!0;for(let i of hc(t)){let t=i.kind===0?Id(e,i.fieldPath,e.startAt):Ld(e,i.fieldPath,e.startAt);n.push(t.value),r&&=t.inclusive}return new cd(n,r)}(a,i),l=function(e,t){let n=[],r=!0;for(let i of hc(t)){let t=i.kind===0?Ld(e,i.fieldPath,e.endAt):Id(e,i.fieldPath,e.endAt);n.push(t.value),r&&=t.inclusive}return new cd(n,r)}(a,i),u=this.On(i,a,c),d=this.On(i,a,l),f=this.Nn(i,a,s),p=this.Bn(i.indexId,o,u,c.inclusive,d,l.inclusive,f);return z.forEach(p,(i=>n.Y(i,t.limit).next((t=>{t.forEach((t=>{let n=F.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))}))}))))})).next((()=>r))}return z.resolve(null)}))}Mn(e){let t=this.Fn.get(e);return t||(t=e.filters.length===0?[e]:Pm(K.create(e.filters,`and`)).map((t=>jd(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt))),this.Fn.set(e,t),t)}Bn(e,t,n,r,i,a,o){let s=(t==null?1:t.length)*Math.max(n.length,i.length),c=s/(t==null?1:t.length),l=[];for(let u=0;u<s;++u){let s=t?this.Ln(t[u/c]):Gm,d=this.kn(e,s,n[u%c],r),f=this.qn(e,s,i[u%c],a),p=o.map((t=>this.kn(e,s,t,!0)));l.push(...this.createRange(d,f,p))}return l}kn(e,t,n,r){let i=new Dm(e,F.empty(),t,n);return r?i:i.An()}qn(e,t,n,r){let i=new Dm(e,F.empty(),t,n);return r?i.An():i}xn(e,t){let n=new Mm(t),r=t.collectionGroup==null?t.path.lastSegment():t.collectionGroup;return this.getFieldIndexes(e,r).next((e=>{let t=null;for(let r of e)n.yn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t}))}getIndexType(e,t){let n=2,r=this.Mn(t);return z.forEach(r,(t=>this.xn(e,t).next((e=>{e?n!==0&&e.fields.length<function(e){let t=new H(tc.comparator),n=!1;for(let r of e.filters)for(let e of r.getFlattenedFilters())e.field.isKeyField()||(e.op===`array-contains`||e.op===`array-contains-any`?n=!0:t=t.add(e.field));for(let n of e.orderBy)n.field.isKeyField()||(t=t.add(n.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})))).next((()=>function(e){return e.limit!==null}(t)&&r.length>1&&n===2?1:n))}Qn(e,t){let n=new Em;for(let r of hc(e)){let e=t.data.field(r.fieldPath);if(e==null)return null;let i=n.Pn(r.kind);ym.Kt.Dt(e,i)}return n.un()}Ln(e){let t=new Em;return ym.Kt.Dt(e,t.Pn(0)),t.un()}$n(e,t){let n=new Em;return ym.Kt.Dt(Gu(this.databaseId,t),n.Pn(function(e){let t=hc(e);return t.length===0?0:t[t.length-1].kind}(e))),n.un()}Nn(e,t,n){if(n===null)return[];let r=[];r.push(new Em);let i=0;for(let a of hc(e)){let e=n[i++];for(let n of r)if(this.Un(t,a.fieldPath)&&qu(e))r=this.Kn(r,a,e);else{let t=n.Pn(a.kind);ym.Kt.Dt(e,t)}}return this.Wn(r)}On(e,t,n){return this.Nn(e,t,n.position)}Wn(e){let t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Kn(e,t,n){let r=[...e],i=[];for(let e of n.arrayValue.values||[])for(let n of r){let r=new Em;r.seed(n.un()),ym.Kt.Dt(e,r.Pn(t.kind)),i.push(r)}return i}Un(e,t){return!!e.filters.find((e=>e instanceof G&&e.field.isEqual(t)&&(e.op===`in`||e.op===`not-in`)))}getFieldIndexes(e,t){let n=Ym(e),r=Xm(e);return(t?n.J(Fl,IDBKeyRange.bound(t,t)):n.J()).next((e=>{let t=[];return z.forEach(e,(e=>r.get([e.indexId,this.uid]).next((n=>{t.push(function(e,t){let n=t?new _c(t.sequenceNumber,new bc(am(t.readTime),new F(Jc(t.documentKey)),t.largestBatchId)):_c.empty(),r=e.fields.map((([e,t])=>new gc(tc.fromServerFormat(e),t)));return new pc(e.indexId,e.collectionGroup,r,n)}(e,n))})))).next((()=>t))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((e=>e.length===0?null:(e.sort(((e,t)=>{let n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return n===0?N(e.collectionGroup,t.collectionGroup):n})),e[0].collectionGroup)))}updateCollectionGroup(e,t,n){let r=Ym(e),i=Xm(e);return this.Gn(e).next((e=>r.J(Fl,IDBKeyRange.bound(t,t)).next((t=>z.forEach(t,(t=>i.put(fm(t.indexId,this.uid,e,n))))))))}updateIndexEntries(e,t){let n=new Map;return z.forEach(t,((t,r)=>{let i=n.get(t.collectionGroup);return(i?z.resolve(i):this.getFieldIndexes(e,t.collectionGroup)).next((i=>(n.set(t.collectionGroup,i),z.forEach(i,(n=>this.zn(e,t,n).next((t=>{let i=this.jn(r,n);return t.isEqual(i)?z.resolve():this.Jn(e,r,n,t,i)})))))))}))}Hn(e,t,n,r){return Jm(e).put(r.Rn(this.uid,this.$n(n,t.key),t.key))}Yn(e,t,n,r){return Jm(e).delete(r.Vn(this.uid,this.$n(n,t.key),t.key))}zn(e,t,n){let r=Jm(e),i=new H(Om);return r.ee({index:Ul,range:IDBKeyRange.only([n.indexId,this.uid,Am(this.$n(n,t))])},((e,r)=>{i=i.add(new Dm(n.indexId,t,jm(r.arrayValue),jm(r.directionalValue)))})).next((()=>i))}jn(e,t){let n=new H(Om),r=this.Qn(t,e);if(r==null)return n;let i=mc(t);if(i!=null){let a=e.data.field(i.fieldPath);if(qu(a))for(let i of a.arrayValue.values||[])n=n.add(new Dm(t.indexId,e.key,this.Ln(i),r))}else n=n.add(new Dm(t.indexId,e.key,Gm,r));return n}Jn(e,t,n,r,i){E(Wm,`Updating index entries for document '%s'`,t.key);let a=[];return function(e,t,n,r,i){let a=e.getIterator(),o=t.getIterator(),s=mu(a),c=mu(o);for(;s||c;){let e=!1,t=!1;if(s&&c){let r=n(s,c);r<0?t=!0:r>0&&(e=!0)}else s==null?e=!0:t=!0;e?(r(c),c=mu(o)):t?(i(s),s=mu(a)):(s=mu(a),c=mu(o))}}(r,i,Om,(r=>{a.push(this.Hn(e,t,n,r))}),(r=>{a.push(this.Yn(e,t,n,r))})),z.waitFor(a)}Gn(e){let t=1;return Xm(e).ee({index:zl,reverse:!0,range:IDBKeyRange.upperBound([this.uid,2**53-1])},((e,n,r)=>{r.done(),t=n.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((e,t)=>Om(e,t))).filter(((e,t,n)=>!t||Om(e,n[t-1])!==0));let r=[];r.push(e);for(let i of n){let n=Om(i,e),a=Om(i,t);if(n===0)r[0]=e.An();else if(n>0&&a<0)r.push(i),r.push(i.An());else if(a>0)break}r.push(t);let i=[];for(let e=0;e<r.length;e+=2){if(this.Zn(r[e],r[e+1]))return[];let t=r[e].Vn(this.uid,Gm,F.empty()),n=r[e+1].Vn(this.uid,Gm,F.empty());i.push(IDBKeyRange.bound(t,n))}return i}Zn(e,t){return Om(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Zm)}getMinOffset(e,t){return z.mapArray(this.Mn(t),(t=>this.xn(e,t).next((e=>e||O(44426))))).next(Zm)}};function qm(e){return B(e,Tl)}function Jm(e){return B(e,Vl)}function Ym(e){return B(e,Nl)}function Xm(e){return B(e,Ll)}function Zm(e){k(e.length!==0,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){let i=e[r].indexState.offset;xc(i,t)<0&&(t=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new bc(t.readTime,t.documentKey,n)}
/**
* @license
* Copyright 2018 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var Qm={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},$m=41943040,eh=class e{static withCacheSize(t){return new e(t,e.DEFAULT_COLLECTION_PERCENTILE,e.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function th(e,t,n){let r=e.store(el),i=e.store(sl),a=[],o=IDBKeyRange.only(n.batchId),s=0,c=r.ee({range:o},((e,t,n)=>(s++,n.delete())));a.push(c.next((()=>{k(s===1,47070,{batchId:n.batchId})})));let l=[];for(let e of n.mutations){let r=al(t,e.key.path,n.batchId);a.push(i.delete(r)),l.push(e.key)}return z.waitFor(a).next((()=>l))}function nh(e){if(!e)return 0;let t;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw O(14731);t=e.noDocument}return JSON.stringify(t).length}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
eh.DEFAULT_COLLECTION_PERCENTILE=10,eh.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,eh.DEFAULT=new eh($m,eh.DEFAULT_COLLECTION_PERCENTILE,eh.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),eh.DISABLED=new eh(-1,0,0);var rh=class e{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Xn={}}static wt(t,n,r,i){k(t.uid!==``,64387);let a=t.isAuthenticated()?t.uid:``;return new e(a,n,r,i)}checkEmpty(e){let t=!0,n=IDBKeyRange.bound([this.userId,-1/0],[this.userId,1/0]);return ah(e).ee({index:nl,range:n},((e,n,r)=>{t=!1,r.done()})).next((()=>t))}addMutationBatch(e,t,n,r){let i=oh(e),a=ah(e);return a.add({}).next((o=>{k(typeof o==`number`,49019);let s=new Jf(o,t,n,r),c=function(e,t,n){let r=n.baseMutations.map((t=>Lp(e.yt,t))),i=n.mutations.map((t=>Lp(e.yt,t)));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:i}}(this.serializer,this.userId,s),l=[],u=new H(((e,t)=>N(e.canonicalString(),t.canonicalString())));for(let e of r){let t=al(this.userId,e.key.path,o);u=u.add(e.key.path.popLast()),l.push(a.put(c)),l.push(i.put(t,ol))}return u.forEach((t=>{l.push(this.indexManager.addToCollectionParentIndex(e,t))})),e.addOnCommittedListener((()=>{this.Xn[o]=s.keys()})),z.waitFor(l).next((()=>s))}))}lookupMutationBatch(e,t){return ah(e).get(t).next((e=>e?(k(e.userId===this.userId,48,`Unexpected user for mutation batch`,{userId:e.userId,batchId:t}),om(this.serializer,e)):null))}er(e,t){return this.Xn[t]?z.resolve(this.Xn[t]):this.lookupMutationBatch(e,t).next((e=>{if(e){let n=e.keys();return this.Xn[t]=n,n}return null}))}getNextMutationBatchAfterBatchId(e,t){let n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]),i=null;return ah(e).ee({index:nl,range:r},((e,t,r)=>{t.userId===this.userId&&(k(t.batchId>=n,47524,{tr:n}),i=om(this.serializer,t)),r.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){let t=IDBKeyRange.upperBound([this.userId,1/0]),n=Bc;return ah(e).ee({index:nl,range:t,reverse:!0},((e,t,r)=>{n=t.batchId,r.done()})).next((()=>n))}getAllMutationBatches(e){let t=IDBKeyRange.bound([this.userId,Bc],[this.userId,1/0]);return ah(e).J(nl,t).next((e=>e.map((e=>om(this.serializer,e)))))}getAllMutationBatchesAffectingDocumentKey(e,t){let n=il(this.userId,t.path),r=IDBKeyRange.lowerBound(n),i=[];return oh(e).ee({range:r},((n,r,a)=>{let[o,s,c]=n,l=Jc(s);if(o===this.userId&&t.path.isEqual(l))return ah(e).get(c).next((e=>{if(!e)throw O(61480,{nr:n,batchId:c});k(e.userId===this.userId,10503,`Unexpected user for mutation batch`,{userId:e.userId,batchId:c}),i.push(om(this.serializer,e))}));a.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new H(N),r=[];return t.forEach((t=>{let i=il(this.userId,t.path),a=IDBKeyRange.lowerBound(i),o=oh(e).ee({range:a},((e,r,i)=>{let[a,o,s]=e,c=Jc(o);a===this.userId&&t.path.isEqual(c)?n=n.add(s):i.done()}));r.push(o)})),z.waitFor(r).next((()=>this.rr(e,n)))}getAllMutationBatchesAffectingQuery(e,t){let n=t.path,r=n.length+1,i=il(this.userId,n),a=IDBKeyRange.lowerBound(i),o=new H(N);return oh(e).ee({range:a},((e,t,i)=>{let[a,s,c]=e,l=Jc(s);a===this.userId&&n.isPrefixOf(l)?l.length===r&&(o=o.add(c)):i.done()})).next((()=>this.rr(e,o)))}rr(e,t){let n=[],r=[];return t.forEach((t=>{r.push(ah(e).get(t).next((e=>{if(e===null)throw O(35274,{batchId:t});k(e.userId===this.userId,9748,`Unexpected user for mutation batch`,{userId:e.userId,batchId:t}),n.push(om(this.serializer,e))})))})),z.waitFor(r).next((()=>n))}removeMutationBatch(e,t){return th(e.le,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.ir(t.batchId)})),z.forEach(n,(t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))))}ir(e){delete this.Xn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return z.resolve();let n=IDBKeyRange.lowerBound(function(e){return[e]}(this.userId)),r=[];return oh(e).ee({range:n},((e,t,n)=>{if(e[0]===this.userId){let t=Jc(e[1]);r.push(t)}else n.done()})).next((()=>{k(r.length===0,56720,{sr:r.map((e=>e.canonicalString()))})}))}))}containsKey(e,t){return ih(e,this.userId,t)}_r(e){return sh(e).get(this.userId).next((e=>e||{userId:this.userId,lastAcknowledgedBatchId:Bc,lastStreamToken:``}))}};function ih(e,t,n){let r=il(t,n.path),i=r[1],a=IDBKeyRange.lowerBound(r),o=!1;return oh(e).ee({range:a,X:!0},((e,n,r)=>{let[a,s,c]=e;a===t&&s===i&&(o=!0),r.done()})).next((()=>o))}function ah(e){return B(e,el)}function oh(e){return B(e,sl)}function sh(e){return B(e,Qc)}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ch=class e{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new e(0)}static cr(){return new e(-1)}},lh=class{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.lr(e).next((t=>(t.highestTargetId=new ch(t.highestTargetId).next(),this.hr(e,t).next((()=>t.highestTargetId)))))}getLastRemoteSnapshotVersion(e){return this.lr(e).next((e=>R.fromTimestamp(new L(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.lr(e).next((e=>e.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.lr(e).next((r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.hr(e,r))))}addTargetData(e,t){return this.Pr(e,t).next((()=>this.lr(e).next((n=>(n.targetCount+=1,this.Tr(t,n),this.hr(e,n))))))}updateTargetData(e,t){return this.Pr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>uh(e).delete(t.targetId))).next((()=>this.lr(e))).next((t=>(k(t.targetCount>0,8065),--t.targetCount,this.hr(e,t))))}removeTargets(e,t,n){let r=0,i=[];return uh(e).ee(((a,o)=>{let s=sm(o);s.sequenceNumber<=t&&n.get(s.targetId)===null&&(r++,i.push(this.removeTargetData(e,s)))})).next((()=>z.waitFor(i))).next((()=>r))}forEachTarget(e,t){return uh(e).ee(((e,n)=>{let r=sm(n);t(r)}))}lr(e){return dh(e).get(Cl).next((e=>(k(e!==null,2888),e)))}hr(e,t){return dh(e).put(Cl,t)}Pr(e,t){return uh(e).put(cm(this.serializer,t))}Tr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.lr(e).next((e=>e.targetCount))}getTargetData(e,t){let n=Md(t),r=IDBKeyRange.bound([n,-1/0],[n,1/0]),i=null;return uh(e).ee({range:r,index:_l},((e,n,r)=>{let a=sm(n);Nd(t,a.target)&&(i=a,r.done())})).next((()=>i))}addMatchingKeys(e,t,n){let r=[],i=fh(e);return t.forEach((t=>{let a=Gc(t.path);r.push(i.put({targetId:n,path:a})),r.push(this.referenceDelegate.addReference(e,n,t))})),z.waitFor(r)}removeMatchingKeys(e,t,n){let r=fh(e);return z.forEach(t,(t=>{let i=Gc(t.path);return z.waitFor([r.delete([n,i]),this.referenceDelegate.removeReference(e,n,t)])}))}removeMatchingKeysForTargetId(e,t){let n=fh(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){let n=IDBKeyRange.bound([t],[t+1],!1,!0),r=fh(e),i=q();return r.ee({range:n,X:!0},((e,t,n)=>{let r=Jc(e[1]),a=new F(r);i=i.add(a)})).next((()=>i))}containsKey(e,t){let n=Gc(t.path),r=IDBKeyRange.bound([n],[Zs(n)],!1,!0),i=0;return fh(e).ee({index:xl,X:!0,range:r},(([e,t],n,r)=>{e!==0&&(i++,r.done())})).next((()=>i>0))}At(e,t){return uh(e).get(t).next((e=>e?sm(e):null))}};function uh(e){return B(e,gl)}function dh(e){return B(e,wl)}function fh(e){return B(e,yl)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var ph=`LruGarbageCollector`,mh=1048576;function hh([e,t],[n,r]){let i=N(e,n);return i===0?N(t,r):i}var gh=class{constructor(e){this.Ir=e,this.buffer=new H(hh),this.Er=0}dr(){return++this.Er}Ar(e){let t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{let e=this.buffer.last();hh(t,e)<0&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}},_h=class{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&=(this.Rr.cancel(),null)}get started(){return this.Rr!==null}Vr(e){E(ph,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay(`lru_garbage_collection`,e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){jc(e)?E(ph,`Ignoring IndexedDB error during garbage collection: `,e):await wc(e)}await this.Vr(3e5)}))}},vh=class{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next((e=>Math.floor(t/100*e)))}nthSequenceNumber(e,t){if(t===0)return z.resolve(zc.ce);let n=new gh(t);return this.mr.forEachTarget(e,(e=>n.Ar(e.sequenceNumber))).next((()=>this.mr.pr(e,(e=>n.Ar(e))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.mr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(E(`LruGarbageCollector`,`Garbage collection skipped; disabled`),z.resolve(Qm)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(E(`LruGarbageCollector`,`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Qm):this.yr(e,t)))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let n,r,i,a,o,s,c,l=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((t=>(t>this.params.maximumSequenceNumbersToCollect?(E(`LruGarbageCollector`,`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,a=Date.now(),this.nthSequenceNumber(e,r)))).next((r=>(n=r,o=Date.now(),this.removeTargets(e,n,t)))).next((t=>(i=t,s=Date.now(),this.removeOrphanedDocuments(e,n)))).next((e=>(c=Date.now(),Ms()<=b.DEBUG&&E(`LruGarbageCollector`,`LRU Garbage Collection\n\tCounted targets in ${a-l}ms\n\tDetermined least recently used ${r} in `+(o-a)+`ms
\tRemoved ${i} targets in `+(s-o)+`ms
\tRemoved ${e} documents in `+(c-s)+`ms
Total Duration: ${c-l}ms`),z.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:e}))))}};function yh(e,t){return new vh(e,t)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var bh=class{constructor(e,t){this.db=e,this.garbageCollector=yh(this,t)}gr(e){let t=this.wr(e);return this.db.getTargetCache().getTargetCount(e).next((e=>t.next((t=>e+t))))}wr(e){let t=0;return this.pr(e,(e=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}pr(e,t){return this.Sr(e,((e,n)=>t(n)))}addReference(e,t,n){return xh(e,n)}removeReference(e,t,n){return xh(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return xh(e,t)}br(e,t){return function(e,t){let n=!1;return sh(e).te((r=>ih(e,r,t).next((e=>(e&&(n=!0),z.resolve(!e)))))).next((()=>n))}(e,t)}removeOrphanedDocuments(e,t){let n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[],i=0;return this.Sr(e,((a,o)=>{if(o<=t){let t=this.br(e,a).next((t=>{if(!t)return i++,n.getEntry(e,a).next((()=>(n.removeEntry(a,R.min()),fh(e).delete(function(e){return[0,Gc(e.path)]}(a)))))}));r.push(t)}})).next((()=>z.waitFor(r))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){let n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return xh(e,t)}Sr(e,t){let n=fh(e),r,i=zc.ce;return n.ee({index:xl},(([e,n],{path:a,sequenceNumber:o})=>{e===0?(i!==zc.ce&&t(new F(Jc(r)),i),i=o,r=a):i=zc.ce})).next((()=>{i!==zc.ce&&t(new F(Jc(r)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}};function xh(e,t){return fh(e).put(function(e,t){return{targetId:0,path:Gc(e.path),sequenceNumber:t}}(t,e.currentSequenceNumber))}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Sh=class{constructor(){this.changes=new tf((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,sd.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let n=this.changes.get(t);return n===void 0?this.getFromCache(e,t):z.resolve(n)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}},Ch=class{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Dh(e).put(n)}removeEntry(e,t,n){return Dh(e).delete(function(e,t){let n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],rm(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.Dr(e,n))))}getEntry(e,t){let n=sd.newInvalidDocument(t);return Dh(e).ee({index:ul,range:IDBKeyRange.only(Oh(t))},((e,r)=>{n=this.Cr(t,r)})).next((()=>n))}vr(e,t){let n={size:0,document:sd.newInvalidDocument(t)};return Dh(e).ee({index:ul,range:IDBKeyRange.only(Oh(t))},((e,r)=>{n={document:this.Cr(t,r),size:nh(r)}})).next((()=>n))}getEntries(e,t){let n=rf();return this.Fr(e,t,((e,t)=>{let r=this.Cr(e,t);n=n.insert(e,r)})).next((()=>n))}Mr(e,t){let n=rf(),r=new V(F.comparator);return this.Fr(e,t,((e,t)=>{let i=this.Cr(e,t);n=n.insert(e,i),r=r.insert(e,nh(t))})).next((()=>({documents:n,Or:r})))}Fr(e,t,n){if(t.isEmpty())return z.resolve();let r=new H(Ah);t.forEach((e=>r=r.add(e)));let i=IDBKeyRange.bound(Oh(r.first()),Oh(r.last())),a=r.getIterator(),o=a.getNext();return Dh(e).ee({index:ul,range:i},((e,t,r)=>{let i=F.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;o&&Ah(o,i)<0;)n(o,null),o=a.getNext();o&&o.isEqual(i)&&(n(o,t),o=a.hasNext()?a.getNext():null),o?r.j(Oh(o)):r.done()})).next((()=>{for(;o;)n(o,null),o=a.hasNext()?a.getNext():null}))}getDocumentsMatchingQuery(e,t,n,r,i){let a=t.path,o=[a.popLast().toArray(),a.lastSegment(),rm(n.readTime),n.documentKey.path.isEmpty()?``:n.documentKey.path.lastSegment()],s=[a.popLast().toArray(),a.lastSegment(),[2**53-1,2**53-1],``];return Dh(e).J(IDBKeyRange.bound(o,s,!0)).next((e=>{i?.incrementDocumentReadCount(e.length);let n=rf();for(let i of e){let e=this.Cr(F.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);e.isFoundDocument()&&(Zd(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n}))}getAllFromCollectionGroup(e,t,n,r){let i=rf(),a=kh(t,n),o=kh(t,bc.max());return Dh(e).ee({index:fl,range:IDBKeyRange.bound(a,o,!0)},((e,t,n)=>{let a=this.Cr(F.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);i=i.insert(a.key,a),i.size===r&&n.done()})).next((()=>i))}newChangeBuffer(e){return new Th(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((e=>e.byteSize))}getMetadata(e){return Eh(e).get(hl).next((e=>(k(!!e,20021),e)))}Dr(e,t){return Eh(e).put(hl,t)}Cr(e,t){if(t){let e=tm(this.serializer,t);if(!(e.isNoDocument()&&e.version.isEqual(R.min())))return e}return sd.newInvalidDocument(e)}};function wh(e){return new Ch(e)}var Th=class extends Sh{constructor(e,t){super(),this.Nr=e,this.trackRemovals=t,this.Br=new tf((e=>e.toString()),((e,t)=>e.isEqual(t)))}applyChanges(e){let t=[],n=0,r=new H(((e,t)=>N(e.canonicalString(),t.canonicalString())));return this.changes.forEach(((i,a)=>{let o=this.Br.get(i);if(t.push(this.Nr.removeEntry(e,i,o.readTime)),a.isValidDocument()){let s=nm(this.Nr.serializer,a);r=r.add(i.path.popLast());let c=nh(s);n+=c-o.size,t.push(this.Nr.addEntry(e,i,s))}else if(n-=o.size,this.trackRemovals){let n=nm(this.Nr.serializer,a.convertToNoDocument(R.min()));t.push(this.Nr.addEntry(e,i,n))}})),r.forEach((n=>{t.push(this.Nr.indexManager.addToCollectionParentIndex(e,n))})),t.push(this.Nr.updateMetadata(e,n)),z.waitFor(t)}getFromCache(e,t){return this.Nr.vr(e,t).next((e=>(this.Br.set(t,{size:e.size,readTime:e.document.readTime}),e.document)))}getAllFromCache(e,t){return this.Nr.Mr(e,t).next((({documents:e,Or:t})=>(t.forEach(((t,n)=>{this.Br.set(t,{size:n,readTime:e.get(t).readTime})})),e)))}};function Eh(e){return B(e,ml)}function Dh(e){return B(e,cl)}function Oh(e){let t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function kh(e,t){let n=t.documentKey.path.toArray();return[e,rm(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:``]}function Ah(e,t){let n=e.path.toArray(),r=t.path.toArray(),i=0;for(let e=0;e<n.length-2&&e<r.length-2;++e)if(i=N(n[e],r[e]),i)return i;return i=N(n.length,r.length),i||(i=N(n[n.length-2],r[r.length-2]),i||N(n[n.length-1],r[r.length-1]))}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var jh=class{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}},Mh=class{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((r=>(n=r,this.remoteDocumentCache.getEntry(e,t)))).next((e=>(n!==null&&Rf(n.mutation,e,hu.empty(),L.now()),e)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((t=>this.getLocalViewOfDocuments(e,t,q()).next((()=>t))))}getLocalViewOfDocuments(e,t,n=q()){let r=lf();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,n).next((e=>{let t=sf();return e.forEach(((e,n)=>{t=t.insert(e,n.overlayedDocument)})),t}))))}getOverlayedDocuments(e,t){let n=lf();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,q())))}populateOverlays(e,t,n){let r=[];return n.forEach((e=>{t.has(e)||r.push(e)})),this.documentOverlayCache.getOverlays(e,r).next((e=>{e.forEach(((e,n)=>{t.set(e,n)}))}))}computeViews(e,t,n,r){let i=rf(),a=df(),o=function(){return df()}();return t.forEach(((e,t)=>{let o=n.get(t.key);r.has(t.key)&&(o===void 0||o.mutation instanceof Hf)?i=i.insert(t.key,t):o===void 0?a.set(t.key,hu.empty()):(a.set(t.key,o.mutation.getFieldMask()),Rf(o.mutation,t,o.mutation.getFieldMask(),L.now()))})),this.recalculateAndSaveOverlays(e,i).next((e=>(e.forEach(((e,t)=>a.set(e,t))),t.forEach(((e,t)=>o.set(e,new jh(t,a.get(e)??null)))),o)))}recalculateAndSaveOverlays(e,t){let n=df(),r=new V(((e,t)=>e-t)),i=q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((e=>{for(let i of e)i.keys().forEach((e=>{let a=t.get(e);if(a===null)return;let o=n.get(e)||hu.empty();o=i.applyToLocalView(a,o),n.set(e,o);let s=(r.get(i.batchId)||q()).add(e);r=r.insert(i.batchId,s)}))})).next((()=>{let a=[],o=r.getReverseIterator();for(;o.hasNext();){let r=o.getNext(),s=r.key,c=r.value,l=uf();c.forEach((e=>{if(!i.has(e)){let r=If(t.get(e),n.get(e));r!==null&&l.set(e,r),i=i.add(e)}})),a.push(this.documentOverlayCache.saveOverlays(e,s,l))}return z.waitFor(a)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((t=>this.recalculateAndSaveOverlays(e,t)))}getDocumentsMatchingQuery(e,t,n,r){return function(e){return F.isDocumentKey(e.path)&&e.collectionGroup===null&&e.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Hd(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r)}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next((i=>{let a=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):z.resolve(lf()),o=fc,s=i;return a.next((t=>z.forEach(t,((t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),i.get(t)?z.resolve():this.remoteDocumentCache.getEntry(e,t).next((e=>{s=s.insert(t,e)}))))).next((()=>this.populateOverlays(e,t,i))).next((()=>this.computeViews(e,s,t,q()))).next((e=>({batchId:o,changes:cf(e)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new F(t)).next((e=>{let t=sf();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){let i=t.collectionGroup,a=sf();return this.indexManager.getCollectionParents(e,i).next((o=>z.forEach(o,(o=>{let s=function(e,t){return new Rd(t,null,e.explicitOrderBy.slice(),e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(t,o.child(i));return this.getDocumentsMatchingCollectionQuery(e,s,n,r).next((e=>{e.forEach(((e,t)=>{a=a.insert(e,t)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((a=>(i=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r)))).next((e=>{i.forEach(((t,n)=>{let r=n.getKey();e.get(r)===null&&(e=e.insert(r,sd.newInvalidDocument(r)))}));let n=sf();return e.forEach(((e,r)=>{let a=i.get(e);a!==void 0&&Rf(a.mutation,r,hu.empty(),L.now()),Zd(t,r)&&(n=n.insert(e,r))})),n}))}},Nh=class{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return z.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,function(e){return{id:e.id,version:e.version,createTime:Z(e.createTime)}}(t)),z.resolve()}getNamedQuery(e,t){return z.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,function(e){return{name:e.name,query:lm(e.bundledQuery),readTime:Z(e.readTime)}}(t)),z.resolve()}},Ph=class{constructor(){this.overlays=new V(F.comparator),this.qr=new Map}getOverlay(e,t){return z.resolve(this.overlays.get(t))}getOverlays(e,t){let n=lf();return z.forEach(t,(t=>this.getOverlay(e,t).next((e=>{e!==null&&n.set(t,e)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((n,r)=>{this.St(e,t,r)})),z.resolve()}removeOverlaysForBatchId(e,t,n){let r=this.qr.get(n);return r!==void 0&&(r.forEach((e=>this.overlays=this.overlays.remove(e))),this.qr.delete(n)),z.resolve()}getOverlaysForCollection(e,t,n){let r=lf(),i=t.length+1,a=new F(t.child(``)),o=this.overlays.getIteratorFrom(a);for(;o.hasNext();){let e=o.getNext().value,a=e.getKey();if(!t.isPrefixOf(a.path))break;a.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return z.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new V(((e,t)=>e-t)),a=this.overlays.getIterator();for(;a.hasNext();){let e=a.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);t===null&&(t=lf(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}let o=lf(),s=i.getIterator();for(;s.hasNext()&&(s.getNext().value.forEach(((e,t)=>o.set(e,t))),!(o.size()>=r)););return z.resolve(o)}St(e,t,n){let r=this.overlays.get(n.key);if(r!==null){let e=this.qr.get(r.largestBatchId).delete(n.key);this.qr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new Xf(t,n));let i=this.qr.get(t);i===void 0&&(i=q(),this.qr.set(t,i)),this.qr.set(t,i.add(n.key))}},Fh=class{constructor(){this.sessionToken=U.EMPTY_BYTE_STRING}getSessionToken(e){return z.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,z.resolve()}},Ih=class{constructor(){this.Qr=new H(Q.$r),this.Ur=new H(Q.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){let n=new Q(e,t);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(e,t){e.forEach((e=>this.addReference(e,t)))}removeReference(e,t){this.Gr(new Q(e,t))}zr(e,t){e.forEach((e=>this.removeReference(e,t)))}jr(e){let t=new F(new P([])),n=new Q(t,e),r=new Q(t,e+1),i=[];return this.Ur.forEachInRange([n,r],(e=>{this.Gr(e),i.push(e.key)})),i}Jr(){this.Qr.forEach((e=>this.Gr(e)))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){let t=new F(new P([])),n=new Q(t,e),r=new Q(t,e+1),i=q();return this.Ur.forEachInRange([n,r],(e=>{i=i.add(e.key)})),i}containsKey(e){let t=new Q(e,0),n=this.Qr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}},Q=class{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return F.comparator(e.key,t.key)||N(e.Yr,t.Yr)}static Kr(e,t){return N(e.Yr,t.Yr)||F.comparator(e.key,t.key)}},Lh=class{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new H(Q.$r)}checkEmpty(e){return z.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,r){let i=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let a=new Jf(i,t,n,r);this.mutationQueue.push(a);for(let t of r)this.Zr=this.Zr.add(new Q(t.key,i)),this.indexManager.addToCollectionParentIndex(e,t.key.path.popLast());return z.resolve(a)}lookupMutationBatch(e,t){return z.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){let n=t+1,r=this.ei(n),i=r<0?0:r;return z.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return z.resolve(this.mutationQueue.length===0?Bc:this.tr-1)}getAllMutationBatches(e){return z.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let n=new Q(t,0),r=new Q(t,1/0),i=[];return this.Zr.forEachInRange([n,r],(e=>{let t=this.Xr(e.Yr);i.push(t)})),z.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new H(N);return t.forEach((e=>{let t=new Q(e,0),r=new Q(e,1/0);this.Zr.forEachInRange([t,r],(e=>{n=n.add(e.Yr)}))})),z.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(e,t){let n=t.path,r=n.length+1,i=n;F.isDocumentKey(i)||(i=i.child(``));let a=new Q(new F(i),0),o=new H(N);return this.Zr.forEachWhile((e=>{let t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.Yr)),!0)}),a),z.resolve(this.ti(o))}ti(e){let t=[];return e.forEach((e=>{let n=this.Xr(e);n!==null&&t.push(n)})),t}removeMutationBatch(e,t){k(this.ni(t.batchId,`removed`)===0,55003),this.mutationQueue.shift();let n=this.Zr;return z.forEach(t.mutations,(r=>{let i=new Q(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.Zr=n}))}ir(e){}containsKey(e,t){let n=new Q(t,0),r=this.Zr.firstAfterOrEqual(n);return z.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,z.resolve()}ni(e,t){return this.ei(e)}ei(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Xr(e){let t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}},Rh=class{constructor(e){this.ri=e,this.docs=function(){return new V(F.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let n=t.key,r=this.docs.get(n),i=r?r.size:0,a=this.ri(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:a}),this.size+=a-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let n=this.docs.get(t);return z.resolve(n?n.document.mutableCopy():sd.newInvalidDocument(t))}getEntries(e,t){let n=rf();return t.forEach((e=>{let t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():sd.newInvalidDocument(e))})),z.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=rf(),a=t.path,o=new F(a.child(`__id-9223372036854775808__`)),s=this.docs.getIteratorFrom(o);for(;s.hasNext();){let{key:e,value:{document:o}}=s.getNext();if(!a.isPrefixOf(e.path))break;e.path.length>a.length+1||xc(yc(o),n)<=0||(r.has(o.key)||Zd(t,o))&&(i=i.insert(o.key,o.mutableCopy()))}return z.resolve(i)}getAllFromCollectionGroup(e,t,n,r){O(9500)}ii(e,t){return z.forEach(this.docs,(e=>t(e)))}newChangeBuffer(e){return new zh(this)}getSize(e){return z.resolve(this.size)}},zh=class extends Sh{constructor(e){super(),this.Nr=e}applyChanges(e){let t=[];return this.changes.forEach(((n,r)=>{r.isValidDocument()?t.push(this.Nr.addEntry(e,r)):this.Nr.removeEntry(n)})),z.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}},Bh=class{constructor(e){this.persistence=e,this.si=new tf((e=>Md(e)),Nd),this.lastRemoteSnapshotVersion=R.min(),this.highestTargetId=0,this.oi=0,this._i=new Ih,this.targetCount=0,this.ai=ch.ur()}forEachTarget(e,t){return this.si.forEach(((e,n)=>t(n))),z.resolve()}getLastRemoteSnapshotVersion(e){return z.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return z.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),z.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.oi&&(this.oi=t),z.resolve()}Pr(e){this.si.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.ai=new ch(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,z.resolve()}updateTargetData(e,t){return this.Pr(t),z.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),--this.targetCount,z.resolve()}removeTargets(e,t,n){let r=0,i=[];return this.si.forEach(((a,o)=>{o.sequenceNumber<=t&&n.get(o.targetId)===null&&(this.si.delete(a),i.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)})),z.waitFor(i).next((()=>r))}getTargetCount(e){return z.resolve(this.targetCount)}getTargetData(e,t){let n=this.si.get(t)||null;return z.resolve(n)}addMatchingKeys(e,t,n){return this._i.Wr(t,n),z.resolve()}removeMatchingKeys(e,t,n){this._i.zr(t,n);let r=this.persistence.referenceDelegate,i=[];return r&&t.forEach((t=>{i.push(r.markPotentiallyOrphaned(e,t))})),z.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),z.resolve()}getMatchingKeysForTargetId(e,t){let n=this._i.Hr(t);return z.resolve(n)}containsKey(e,t){return z.resolve(this._i.containsKey(t))}},Vh=class{constructor(e,t){this.ui={},this.overlays={},this.ci=new zc(0),this.li=!1,this.li=!0,this.hi=new Fh,this.referenceDelegate=e(this),this.Pi=new Bh(this),this.indexManager=new Hm,this.remoteDocumentCache=function(e){return new Rh(e)}((e=>this.referenceDelegate.Ti(e))),this.serializer=new em(t),this.Ii=new Nh(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Ph,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ui[e.toKey()];return n||(n=new Lh(t,this.referenceDelegate),this.ui[e.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,n){E(`MemoryPersistence`,`Starting transaction:`,e);let r=new Hh(this.ci.next());return this.referenceDelegate.Ei(),n(r).next((e=>this.referenceDelegate.di(r).next((()=>e)))).toPromise().then((e=>(r.raiseOnCommittedEvent(),e)))}Ai(e,t){return z.or(Object.values(this.ui).map((n=>()=>n.containsKey(e,t))))}},Hh=class extends Cc{constructor(e){super(),this.currentSequenceNumber=e}},Uh=class e{constructor(e){this.persistence=e,this.Ri=new Ih,this.Vi=null}static mi(t){return new e(t)}get fi(){if(this.Vi)return this.Vi;throw O(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.fi.delete(n.toString()),z.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.fi.add(n.toString()),z.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),z.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach((e=>this.fi.add(e.toString())));let n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((e=>{e.forEach((e=>this.fi.add(e.toString())))})).next((()=>n.removeTargetData(e,t)))}Ei(){this.Vi=new Set}di(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return z.forEach(this.fi,(n=>{let r=F.fromPath(n);return this.gi(e,r).next((e=>{e||t.removeEntry(r,R.min())}))})).next((()=>(this.Vi=null,t.apply(e))))}updateLimboDocument(e,t){return this.gi(e,t).next((e=>{e?this.fi.delete(t.toString()):this.fi.add(t.toString())}))}Ti(e){return 0}gi(e,t){return z.or([()=>z.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}},Wh=class e{constructor(e,t){this.persistence=e,this.pi=new tf((e=>Gc(e.path)),((e,t)=>e.isEqual(t))),this.garbageCollector=yh(this,t)}static mi(t,n){return new e(t,n)}Ei(){}di(e){return z.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){let t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next((e=>t.next((t=>e+t))))}wr(e){let t=0;return this.pr(e,(e=>{t++})).next((()=>t))}pr(e,t){return z.forEach(this.pi,((n,r)=>this.br(e,n,r).next((e=>e?z.resolve():t(r)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0,r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ii(e,(r=>this.br(e,r,t).next((e=>{e||(n++,i.removeEntry(r,R.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),z.resolve()}removeTarget(e,t){let n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),z.resolve()}removeReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),z.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),z.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Wu(e.data.value)),t}br(e,t,n){return z.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let e=this.pi.get(t);return z.resolve(e!==void 0&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}},Gh=class{constructor(e){this.serializer=e}k(e,t,n,r){let i=new Ec(`createOrUpgrade`,t);n<1&&r>=1&&(function(e){e.createObjectStore(Xc)}(e),function(e){e.createObjectStore(Qc,{keyPath:$c}),e.createObjectStore(el,{keyPath:tl,autoIncrement:!0}).createIndex(nl,rl,{unique:!0}),e.createObjectStore(sl)}(e),Kh(e),function(e){e.createObjectStore(Yc)}(e));let a=z.resolve();return n<3&&r>=3&&(n!==0&&(function(e){e.deleteObjectStore(yl),e.deleteObjectStore(gl),e.deleteObjectStore(wl)}(e),Kh(e)),a=a.next((()=>function(e){let t=e.store(wl),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:R.min().toTimestamp(),targetCount:0};return t.put(Cl,n)}(i)))),n<4&&r>=4&&(n!==0&&(a=a.next((()=>function(e,t){return t.store(el).J().next((n=>{e.deleteObjectStore(el),e.createObjectStore(el,{keyPath:tl,autoIncrement:!0}).createIndex(nl,rl,{unique:!0});let r=t.store(el),i=n.map((e=>r.put(e)));return z.waitFor(i)}))}(e,i)))),a=a.next((()=>{(function(e){e.createObjectStore(Dl,{keyPath:Ol})})(e)}))),n<5&&r>=5&&(a=a.next((()=>this.yi(i)))),n<6&&r>=6&&(a=a.next((()=>(function(e){e.createObjectStore(ml)}(e),this.wi(i))))),n<7&&r>=7&&(a=a.next((()=>this.Si(i)))),n<8&&r>=8&&(a=a.next((()=>this.bi(e,i)))),n<9&&r>=9&&(a=a.next((()=>{(function(e){e.objectStoreNames.contains(`remoteDocumentChanges`)&&e.deleteObjectStore(`remoteDocumentChanges`)})(e)}))),n<10&&r>=10&&(a=a.next((()=>this.Di(i)))),n<11&&r>=11&&(a=a.next((()=>{(function(e){e.createObjectStore(kl,{keyPath:Al})})(e),function(e){e.createObjectStore(jl,{keyPath:Ml})}(e)}))),n<12&&r>=12&&(a=a.next((()=>{(function(e){let t=e.createObjectStore(Gl,{keyPath:Kl});t.createIndex(ql,Jl,{unique:!1}),t.createIndex(Yl,Xl,{unique:!1})})(e)}))),n<13&&r>=13&&(a=a.next((()=>function(e){let t=e.createObjectStore(cl,{keyPath:ll});t.createIndex(ul,dl),t.createIndex(fl,pl)}(e))).next((()=>this.Ci(e,i))).next((()=>e.deleteObjectStore(Yc)))),n<14&&r>=14&&(a=a.next((()=>this.Fi(e,i)))),n<15&&r>=15&&(a=a.next((()=>function(e){e.createObjectStore(Nl,{keyPath:Pl,autoIncrement:!0}).createIndex(Fl,Il,{unique:!1}),e.createObjectStore(Ll,{keyPath:Rl}).createIndex(zl,Bl,{unique:!1}),e.createObjectStore(Vl,{keyPath:Hl}).createIndex(Ul,Wl,{unique:!1})}(e)))),n<16&&r>=16&&(a=a.next((()=>{t.objectStore(Ll).clear()})).next((()=>{t.objectStore(Vl).clear()}))),n<17&&r>=17&&(a=a.next((()=>{(function(e){e.createObjectStore(Zl,{keyPath:Ql})})(e)}))),n<18&&r>=18&&me()&&(a=a.next((()=>{t.objectStore(Ll).clear()})).next((()=>{t.objectStore(Vl).clear()}))),a}wi(e){let t=0;return e.store(Yc).ee(((e,n)=>{t+=nh(n)})).next((()=>{let n={byteSize:t};return e.store(ml).put(hl,n)}))}yi(e){let t=e.store(Qc),n=e.store(el);return t.J().next((t=>z.forEach(t,(t=>{let r=IDBKeyRange.bound([t.userId,Bc],[t.userId,t.lastAcknowledgedBatchId]);return n.J(nl,r).next((n=>z.forEach(n,(n=>{k(n.userId===t.userId,18650,`Cannot process batch from unexpected user`,{batchId:n.batchId});let r=om(this.serializer,n);return th(e,t.userId,r).next((()=>{}))}))))}))))}Si(e){let t=e.store(yl),n=e.store(Yc);return e.store(wl).get(Cl).next((e=>{let r=[];return n.ee(((n,i)=>{let a=new P(n),o=function(e){return[0,Gc(e)]}(a);r.push(t.get(o).next((n=>n?z.resolve():(n=>t.put({targetId:0,path:Gc(n),sequenceNumber:e.highestListenSequenceNumber}))(a))))})).next((()=>z.waitFor(r)))}))}bi(e,t){e.createObjectStore(Tl,{keyPath:El});let n=t.store(Tl),r=new Um,i=e=>{if(r.add(e)){let t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:Gc(r)})}};return t.store(Yc).ee({X:!0},((e,t)=>{let n=new P(e);return i(n.popLast())})).next((()=>t.store(sl).ee({X:!0},(([e,t,n],r)=>{let a=Jc(t);return i(a.popLast())}))))}Di(e){let t=e.store(gl);return t.ee(((e,n)=>{let r=sm(n),i=cm(this.serializer,r);return t.put(i)}))}Ci(e,t){let n=t.store(Yc),r=[];return n.ee(((e,n)=>{let i=t.store(cl),a=function(e){return e.document?new F(P.fromString(e.document.name).popFirst(5)):e.noDocument?F.fromSegments(e.noDocument.path):e.unknownDocument?F.fromSegments(e.unknownDocument.path):O(36783)}(n).path.toArray(),o={prefixPath:a.slice(0,a.length-2),collectionGroup:a[a.length-2],documentId:a[a.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};r.push(i.put(o))})).next((()=>z.waitFor(r)))}Fi(e,t){let n=t.store(el),r=wh(this.serializer),i=new Vh(Uh.mi,this.serializer.yt);return n.J().next((e=>{let n=new Map;return e.forEach((e=>{let t=n.get(e.userId)??q();om(this.serializer,e).keys().forEach((e=>t=t.add(e))),n.set(e.userId,t)})),z.forEach(n,((e,n)=>{let a=new ks(n),o=gm.wt(this.serializer,a),s=i.getIndexManager(a),c=rh.wt(a,this.serializer,s,i.referenceDelegate);return new Mh(r,c,o,s).recalculateAndSaveOverlaysForDocumentKeys(new su(t,zc.ce),e).next()}))}))}};function Kh(e){e.createObjectStore(yl,{keyPath:bl}).createIndex(xl,Sl,{unique:!0}),e.createObjectStore(gl,{keyPath:`targetId`}).createIndex(_l,vl,{unique:!0}),e.createObjectStore(wl)}var qh=`IndexedDbPersistence`,Jh=18e5,Yh=5e3,Xh="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",Zh=`main`,Qh=class e{constructor(t,n,r,i,a,o,s,c,l,u,d=18){if(this.allowTabSynchronization=t,this.persistenceKey=n,this.clientId=r,this.Mi=a,this.window=o,this.document=s,this.xi=l,this.Oi=u,this.Ni=d,this.ci=null,this.li=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Bi=null,this.inForeground=!1,this.Li=null,this.ki=null,this.qi=-1/0,this.Qi=e=>Promise.resolve(),!e.v())throw new M(j.UNIMPLEMENTED,`This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.`);this.referenceDelegate=new bh(this,i),this.$i=n+Zh,this.serializer=new em(c),this.Ui=new Dc(this.$i,this.Ni,new Gh(this.serializer)),this.hi=new vm,this.Pi=new lh(this.referenceDelegate,this.serializer),this.remoteDocumentCache=wh(this.serializer),this.Ii=new pm,this.window&&this.window.localStorage?this.Ki=this.window.localStorage:(this.Ki=null,!1===u&&D(qh,`LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page.`))}start(){return this.Wi().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new M(j.FAILED_PRECONDITION,Xh);return this.Gi(),this.zi(),this.ji(),this.runTransaction(`getHighestListenSequenceNumber`,`readonly`,(e=>this.Pi.getHighestSequenceNumber(e)))})).then((e=>{this.ci=new zc(e,this.xi)})).then((()=>{this.li=!0})).catch((e=>(this.Ui&&this.Ui.close(),Promise.reject(e))))}Ji(e){return this.Qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ui.$((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Mi.enqueueAndForget((async()=>{this.started&&await this.Wi()})))}Wi(){return this.runTransaction(`updateClientMetadataAndTryBecomePrimary`,`readwrite`,(e=>eg(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.Hi(e).next((e=>{e||(this.isPrimary=!1,this.Mi.enqueueRetryable((()=>this.Qi(!1))))}))})).next((()=>this.Yi(e))).next((t=>this.isPrimary&&!t?this.Zi(e).next((()=>!1)):!!t&&this.Xi(e).next((()=>!0)))))).catch((e=>{if(jc(e))return E(qh,`Failed to extend owner lease: `,e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return E(qh,`Releasing owner lease after error during lease refresh`,e),!1})).then((e=>{this.isPrimary!==e&&this.Mi.enqueueRetryable((()=>this.Qi(e))),this.isPrimary=e}))}Hi(e){return $h(e).get(Zc).next((e=>z.resolve(this.es(e))))}ts(e){return eg(e).delete(this.clientId)}async ns(){if(this.isPrimary&&!this.rs(this.qi,Jh)){this.qi=Date.now();let e=await this.runTransaction(`maybeGarbageCollectMultiClientState`,`readwrite-primary`,(e=>{let t=B(e,Dl);return t.J().next((e=>{let n=this.ss(e,Jh),r=e.filter((e=>n.indexOf(e)===-1));return z.forEach(r,(e=>t.delete(e.clientId))).next((()=>r))}))})).catch((()=>[]));if(this.Ki)for(let t of e)this.Ki.removeItem(this._s(t.clientId))}}ji(){this.ki=this.Mi.enqueueAfterDelay(`client_metadata_refresh`,4e3,(()=>this.Wi().then((()=>this.ns())).then((()=>this.ji()))))}es(e){return!!e&&e.ownerId===this.clientId}Yi(e){return this.Oi?z.resolve(!0):$h(e).get(Zc).next((t=>{if(t!==null&&this.rs(t.leaseTimestampMs,Yh)&&!this.us(t.ownerId)){if(this.es(t)&&this.networkEnabled)return!0;if(!this.es(t)){if(!t.allowTabSynchronization)throw new M(j.FAILED_PRECONDITION,Xh);return!1}}return!(!this.networkEnabled||!this.inForeground)||eg(e).J().next((e=>this.ss(e,Yh).find((e=>{if(this.clientId!==e.clientId){let t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))===void 0))})).next((e=>(this.isPrimary!==e&&E(qh,`Client ${e?`is`:`is not`} eligible for a primary lease.`),e)))}async shutdown(){this.li=!1,this.cs(),this.ki&&=(this.ki.cancel(),null),this.ls(),this.hs(),await this.Ui.runTransaction(`shutdown`,`readwrite`,[Xc,Dl],(e=>{let t=new su(e,zc.ce);return this.Zi(t).next((()=>this.ts(t)))})),this.Ui.close(),this.Ps()}ss(e,t){return e.filter((e=>this.rs(e.updateTimeMs,t)&&!this.us(e.clientId)))}Ts(){return this.runTransaction(`getActiveClients`,`readonly`,(e=>eg(e).J().next((e=>this.ss(e,Jh).map((e=>e.clientId))))))}get started(){return this.li}getGlobalsCache(){return this.hi}getMutationQueue(e,t){return rh.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new Km(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return gm.wt(this.serializer,e)}getBundleCache(){return this.Ii}runTransaction(e,t,n){E(qh,`Starting transaction:`,e);let r=t===`readonly`?`readonly`:`readwrite`,i=function(e){return e===18?ou:e===17?au:e===16?iu:e===15?ru:e===14?nu:e===13?tu:e===12?eu:e===11?$l:void O(60245)}(this.Ni),a;return this.Ui.runTransaction(e,r,i,(r=>(a=new su(r,this.ci?this.ci.next():zc.ce),t===`readwrite-primary`?this.Hi(a).next((e=>!!e||this.Yi(a))).next((t=>{if(!t)throw D(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Mi.enqueueRetryable((()=>this.Qi(!1))),new M(j.FAILED_PRECONDITION,Sc);return n(a)})).next((e=>this.Xi(a).next((()=>e)))):this.Is(a).next((()=>n(a)))))).then((e=>(a.raiseOnCommittedEvent(),e)))}Is(e){return $h(e).get(Zc).next((e=>{if(e!==null&&this.rs(e.leaseTimestampMs,Yh)&&!this.us(e.ownerId)&&!this.es(e)&&!(this.Oi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new M(j.FAILED_PRECONDITION,Xh)}))}Xi(e){let t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return $h(e).put(Zc,t)}static v(){return Dc.v()}Zi(e){let t=$h(e);return t.get(Zc).next((e=>this.es(e)?(E(qh,`Releasing primary lease.`),t.delete(Zc)):z.resolve()))}rs(e,t){let n=Date.now();return!(e<n-t)&&(!(e>n)||(D(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Gi(){this.document!==null&&typeof this.document.addEventListener==`function`&&(this.Li=()=>{this.Mi.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState===`visible`,this.Wi())))},this.document.addEventListener(`visibilitychange`,this.Li),this.inForeground=this.document.visibilityState===`visible`)}ls(){this.Li&&=(this.document.removeEventListener(`visibilitychange`,this.Li),null)}zi(){typeof this.window?.addEventListener==`function`&&(this.Bi=()=>{this.cs();let e=/(?:Version|Mobile)\/1[456]/;pe()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Mi.enterRestrictedMode(!0),this.Mi.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener(`pagehide`,this.Bi))}hs(){this.Bi&&=(this.window.removeEventListener(`pagehide`,this.Bi),null)}us(e){try{let t=this.Ki?.getItem(this._s(e))!==null;return E(qh,`Client '${e}' ${t?`is`:`is not`} zombied in LocalStorage`),t}catch(e){return D(qh,`Failed to get zombied client id.`,e),!1}}cs(){if(this.Ki)try{this.Ki.setItem(this._s(this.clientId),String(Date.now()))}catch(e){D(`Failed to set zombie client id.`,e)}}Ps(){if(this.Ki)try{this.Ki.removeItem(this._s(this.clientId))}catch{}}_s(e){return`firestore_zombie_${this.persistenceKey}_${e}`}};function $h(e){return B(e,Xc)}function eg(e){return B(e,Dl)}function tg(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+=`.`+e.database),`firestore/`+t+`/`+n+`/`}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var ng=class e{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Es=n,this.ds=r}static As(t,n){let r=q(),i=q();for(let e of n.docChanges)switch(e.type){case 0:r=r.add(e.doc.key);break;case 1:i=i.add(e.doc.key)}return new e(t,n.fromCache,r,i)}},rg=class{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}},ig=class{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=function(){return pe()?8:Oc(g())>0?6:4}()}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,r){let i={result:null};return this.ys(e,t).next((e=>{i.result=e})).next((()=>{if(!i.result)return this.ws(e,t,r,n).next((e=>{i.result=e}))})).next((()=>{if(i.result)return;let n=new rg;return this.Ss(e,t,n).next((r=>{if(i.result=r,this.Vs)return this.bs(e,t,n,r.size)}))})).next((()=>i.result))}bs(e,t,n,r){return n.documentReadCount<this.fs?(Ms()<=b.DEBUG&&E(`QueryEngine`,`SDK will not create cache indexes for query:`,Xd(t),`since it only creates cache indexes for collection contains`,`more than or equal to`,this.fs,`documents`),z.resolve()):(Ms()<=b.DEBUG&&E(`QueryEngine`,`Query:`,Xd(t),`scans`,n.documentReadCount,`local documents and returns`,r,`documents as results.`),n.documentReadCount>this.gs*r?(Ms()<=b.DEBUG&&E(`QueryEngine`,`The SDK decides to create cache indexes for query:`,Xd(t),`as using cache indexes may help improve performance.`),this.indexManager.createTargetIndexes(e,Wd(t))):z.resolve())}ys(e,t){if(Vd(t))return z.resolve(null);let n=Wd(t);return this.indexManager.getIndexType(e,n).next((r=>r===0?null:(t.limit!==null&&r===1&&(t=qd(t,null,`F`),n=Wd(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((r=>{let i=q(...r);return this.ps.getDocuments(e,i).next((r=>this.indexManager.getMinOffset(e,n).next((n=>{let a=this.Ds(t,r);return this.Cs(t,a,i,n.readTime)?this.ys(e,qd(t,null,`F`)):this.vs(e,a,t,n)}))))})))))}ws(e,t,n,r){return Vd(t)||r.isEqual(R.min())?z.resolve(null):this.ps.getDocuments(e,n).next((i=>{let a=this.Ds(t,i);return this.Cs(t,a,n,r)?z.resolve(null):(Ms()<=b.DEBUG&&E(`QueryEngine`,`Re-using previous result from %s to execute query: %s`,r.toString(),Xd(t)),this.vs(e,a,t,vc(r,fc)).next((e=>e)))}))}Ds(e,t){let n=new H($d(e));return t.forEach(((t,r)=>{Zd(e,r)&&(n=n.add(r))})),n}Cs(e,t,n,r){if(e.limit===null)return!1;if(n.size!==t.size)return!0;let i=e.limitType===`F`?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Ss(e,t,n){return Ms()<=b.DEBUG&&E(`QueryEngine`,`Using full collection scan to execute query:`,Xd(t)),this.ps.getDocumentsMatchingQuery(e,t,bc.min(),n)}vs(e,t,n,r){return this.ps.getDocumentsMatchingQuery(e,n,r).next((e=>(t.forEach((t=>{e=e.insert(t.key,t)})),e)))}},ag=`LocalStore`,og=3e8,sg=class{constructor(e,t,n,r){this.persistence=e,this.Fs=t,this.serializer=r,this.Ms=new V(N),this.xs=new tf((e=>Md(e)),Nd),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(n)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Mh(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction(`Collect garbage`,`readwrite-primary`,(t=>e.collect(t,this.Ms)))}};function cg(e,t,n,r){return new sg(e,t,n,r)}async function lg(e,t){let n=A(e);return await n.persistence.runTransaction(`Handle user change`,`readonly`,(e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next((i=>(r=i,n.Bs(t),n.mutationQueue.getAllMutationBatches(e)))).next((t=>{let i=[],a=[],o=q();for(let e of r){i.push(e.batchId);for(let t of e.mutations)o=o.add(t.key)}for(let e of t){a.push(e.batchId);for(let t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next((e=>({Ls:e,removedBatchIds:i,addedBatchIds:a})))}))}))}function ug(e,t){let n=A(e);return n.persistence.runTransaction(`Acknowledge batch`,`readwrite-primary`,(e=>{let r=t.batch.keys(),i=n.Ns.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){let i=n.batch,a=i.keys(),o=z.resolve();return a.forEach((e=>{o=o.next((()=>r.getEntry(t,e))).next((t=>{let a=n.docVersions.get(e);k(a!==null,48541),t.version.compareTo(a)<0&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))}))})),o.next((()=>e.mutationQueue.removeMutationBatch(t,i)))}(n,e,t,i).next((()=>i.apply(e))).next((()=>n.mutationQueue.performConsistencyCheck(e))).next((()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId))).next((()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=q();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t)))).next((()=>n.localDocuments.getDocuments(e,r)))}))}function dg(e){let t=A(e);return t.persistence.runTransaction(`Get last remote snapshot version`,`readonly`,(e=>t.Pi.getLastRemoteSnapshotVersion(e)))}function fg(e,t){let n=A(e),r=t.snapshotVersion,i=n.Ms;return n.persistence.runTransaction(`Apply remote event`,`readwrite-primary`,(e=>{let a=n.Ns.newChangeBuffer({trackRemovals:!0});i=n.Ms;let o=[];t.targetChanges.forEach(((a,s)=>{let c=i.get(s);if(!c)return;o.push(n.Pi.removeMatchingKeys(e,a.removedDocuments,s).next((()=>n.Pi.addMatchingKeys(e,a.addedDocuments,s))));let l=c.withSequenceNumber(e.currentSequenceNumber);t.targetMismatches.get(s)===null?a.resumeToken.approximateByteSize()>0&&(l=l.withResumeToken(a.resumeToken,r)):l=l.withResumeToken(U.EMPTY_BYTE_STRING,R.min()).withLastLimboFreeSnapshotVersion(R.min()),i=i.insert(s,l),function(e,t,n){return e.resumeToken.approximateByteSize()===0||t.snapshotVersion.toMicroseconds()-e.snapshotVersion.toMicroseconds()>=og?!0:n.addedDocuments.size+n.modifiedDocuments.size+n.removedDocuments.size>0}(c,l,a)&&o.push(n.Pi.updateTargetData(e,l))}));let s=rf(),c=q();if(t.documentUpdates.forEach((r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))})),o.push(pg(e,a,t.documentUpdates).next((e=>{s=e.ks,c=e.qs}))),!r.isEqual(R.min())){let t=n.Pi.getLastRemoteSnapshotVersion(e).next((t=>n.Pi.setTargetsMetadata(e,e.currentSequenceNumber,r)));o.push(t)}return z.waitFor(o).next((()=>a.apply(e))).next((()=>n.localDocuments.getLocalViewOfDocuments(e,s,c))).next((()=>s))})).then((e=>(n.Ms=i,e)))}function pg(e,t,n){let r=q(),i=q();return n.forEach((e=>r=r.add(e))),t.getEntries(e,r).next((e=>{let r=rf();return n.forEach(((n,a)=>{let o=e.get(n);a.isFoundDocument()!==o.isFoundDocument()&&(i=i.add(n)),a.isNoDocument()&&a.version.isEqual(R.min())?(t.removeEntry(n,a.readTime),r=r.insert(n,a)):!o.isValidDocument()||a.version.compareTo(o.version)>0||a.version.compareTo(o.version)===0&&o.hasPendingWrites?(t.addEntry(a),r=r.insert(n,a)):E(ag,`Ignoring outdated watch update for `,n,`. Current version:`,o.version,` Watch version:`,a.version)})),{ks:r,qs:i}}))}function mg(e,t){let n=A(e);return n.persistence.runTransaction(`Get next mutation batch`,`readonly`,(e=>(t===void 0&&(t=Bc),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t))))}function hg(e,t){let n=A(e);return n.persistence.runTransaction(`Allocate target`,`readwrite`,(e=>{let r;return n.Pi.getTargetData(e,t).next((i=>i?(r=i,z.resolve(r)):n.Pi.allocateTargetId(e).next((i=>(r=new $p(t,i,`TargetPurposeListen`,e.currentSequenceNumber),n.Pi.addTargetData(e,r).next((()=>r)))))))})).then((e=>{let r=n.Ms.get(e.targetId);return(r===null||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.Ms=n.Ms.insert(e.targetId,e),n.xs.set(t,e.targetId)),e}))}async function gg(e,t,n){let r=A(e),i=r.Ms.get(t),a=n?`readwrite`:`readwrite-primary`;try{n||await r.persistence.runTransaction(`Release target`,a,(e=>r.persistence.referenceDelegate.removeTarget(e,i)))}catch(e){if(!jc(e))throw e;E(ag,`Failed to update sequence numbers for target ${t}: ${e}`)}r.Ms=r.Ms.remove(t),r.xs.delete(i.target)}function _g(e,t,n){let r=A(e),i=R.min(),a=q();return r.persistence.runTransaction(`Execute query`,`readwrite`,(e=>function(e,t,n){let r=A(e),i=r.xs.get(n);return i===void 0?r.Pi.getTargetData(t,n):z.resolve(r.Ms.get(i))}(r,e,Wd(t)).next((t=>{if(t)return i=t.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(e,t.targetId).next((e=>{a=e}))})).next((()=>r.Fs.getDocumentsMatchingQuery(e,t,n?i:R.min(),n?a:q()))).next((e=>(bg(r,Qd(t),e),{documents:e,Qs:a})))))}function vg(e,t){let n=A(e),r=A(n.Pi),i=n.Ms.get(t);return i?Promise.resolve(i.target):n.persistence.runTransaction(`Get target data`,`readonly`,(e=>r.At(e,t).next((e=>e?e.target:null))))}function yg(e,t){let n=A(e),r=n.Os.get(t)||R.min();return n.persistence.runTransaction(`Get new document changes`,`readonly`,(e=>n.Ns.getAllFromCollectionGroup(e,t,vc(r,fc),2**53-1))).then((e=>(bg(n,t,e),e)))}function bg(e,t,n){let r=e.Os.get(t)||R.min();n.forEach(((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)})),e.Os.set(t,r)}
/**
* @license
* Copyright 2019 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var xg=`firestore_clients`;function Sg(e,t){return`${xg}_${e}_${t}`}var Cg=`firestore_mutations`;function wg(e,t,n){let r=`${Cg}_${e}_${n}`;return t.isAuthenticated()&&(r+=`_${t.uid}`),r}var Tg=`firestore_targets`;function Eg(e,t){return`${Tg}_${e}_${t}`}
/**
* @license
* Copyright 2018 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Dg=`SharedClientState`,Og=class e{constructor(e,t,n,r){this.user=e,this.batchId=t,this.state=n,this.error=r}static Ws(t,n,r){let i=JSON.parse(r),a,o=typeof i==`object`&&[`pending`,`acknowledged`,`rejected`].indexOf(i.state)!==-1&&(i.error===void 0||typeof i.error==`object`);return o&&i.error&&(o=typeof i.error.message==`string`&&typeof i.error.code==`string`,o&&(a=new M(i.error.code,i.error.message))),o?new e(t,n,i.state,a):(D(Dg,`Failed to parse mutation state for ID '${n}': ${r}`),null)}Gs(){let e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}},kg=class e{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Ws(t,n){let r=JSON.parse(n),i,a=typeof r==`object`&&[`not-current`,`current`,`rejected`].indexOf(r.state)!==-1&&(r.error===void 0||typeof r.error==`object`);return a&&r.error&&(a=typeof r.error.message==`string`&&typeof r.error.code==`string`,a&&(i=new M(r.error.code,r.error.message))),a?new e(t,r.state,i):(D(Dg,`Failed to parse target state for ID '${t}': ${n}`),null)}Gs(){let e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}},Ag=class e{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Ws(t,n){let r=JSON.parse(n),i=typeof r==`object`&&r.activeTargetIds instanceof Array,a=hf();for(let e=0;i&&e<r.activeTargetIds.length;++e)i=Uc(r.activeTargetIds[e]),a=a.add(r.activeTargetIds[e]);return i?new e(t,a):(D(Dg,`Failed to parse client data for instance '${t}': ${n}`),null)}},jg=class e{constructor(e,t){this.clientId=e,this.onlineState=t}static Ws(t){let n=JSON.parse(t);return typeof n==`object`&&[`Unknown`,`Online`,`Offline`].indexOf(n.onlineState)!==-1&&typeof n.clientId==`string`?new e(n.clientId,n.onlineState):(D(Dg,`Failed to parse online state: ${t}`),null)}},Mg=class{constructor(){this.activeTargetIds=hf()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}},Ng=class{constructor(e,t,n,r,i){this.window=e,this.Mi=t,this.persistenceKey=n,this.Js=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Hs=this.Ys.bind(this),this.Zs=new V(N),this.started=!1,this.Xs=[];let a=n.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`);this.storage=this.window.localStorage,this.currentUser=i,this.eo=Sg(this.persistenceKey,this.Js),this.no=function(e){return`firestore_sequence_number_${e}`}(this.persistenceKey),this.Zs=this.Zs.insert(this.Js,new Mg),this.ro=RegExp(`^${xg}_${a}_([^_]*)$`),this.io=RegExp(`^${Cg}_${a}_(\\d+)(?:_(.*))?$`),this.so=RegExp(`^${Tg}_${a}_(\\d+)$`),this.oo=function(e){return`firestore_online_state_${e}`}(this.persistenceKey),this._o=function(e){return`firestore_bundle_loaded_v2_${e}`}(this.persistenceKey),this.window.addEventListener(`storage`,this.Hs)}static v(e){return!(!e||!e.localStorage)}async start(){let e=await this.syncEngine.Ts();for(let t of e){if(t===this.Js)continue;let e=this.getItem(Sg(this.persistenceKey,t));if(e){let n=Ag.Ws(t,e);n&&(this.Zs=this.Zs.insert(n.clientId,n))}}this.ao();let t=this.storage.getItem(this.oo);if(t){let e=this.uo(t);e&&this.co(e)}for(let e of this.Xs)this.Ys(e);this.Xs=[],this.window.addEventListener(`pagehide`,(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.no,JSON.stringify(e))}getAllActiveQueryTargets(){return this.lo(this.Zs)}isActiveQueryTarget(e){let t=!1;return this.Zs.forEach(((n,r)=>{r.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.ho(e,`pending`)}updateMutationState(e,t,n){this.ho(e,t,n),this.Po(e)}addLocalQueryTarget(e,t=!0){let n=`not-current`;if(this.isActiveQueryTarget(e)){let t=this.storage.getItem(Eg(this.persistenceKey,e));if(t){let r=kg.Ws(e,t);r&&(n=r.state)}}return t&&this.To.zs(e),this.ao(),n}removeLocalQueryTarget(e){this.To.js(e),this.ao()}isLocalQueryTarget(e){return this.To.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(Eg(this.persistenceKey,e))}updateQueryState(e,t,n){this.Io(e,t,n)}handleUserChange(e,t,n){t.forEach((e=>{this.Po(e)})),this.currentUser=e,n.forEach((e=>{this.addPendingMutation(e)}))}setOnlineState(e){this.Eo(e)}notifyBundleLoaded(e){this.Ao(e)}shutdown(){this.started&&=(this.window.removeEventListener(`storage`,this.Hs),this.removeItem(this.eo),!1)}getItem(e){let t=this.storage.getItem(e);return E(Dg,`READ`,e,t),t}setItem(e,t){E(Dg,`SET`,e,t),this.storage.setItem(e,t)}removeItem(e){E(Dg,`REMOVE`,e),this.storage.removeItem(e)}Ys(e){let t=e;if(t.storageArea===this.storage){if(E(Dg,`EVENT`,t.key,t.newValue),t.key===this.eo)return void D(`Received WebStorage notification for local change. Another client might have garbage-collected our state`);this.Mi.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.ro.test(t.key)){if(t.newValue==null){let e=this.Ro(t.key);return this.Vo(e,null)}{let e=this.mo(t.key,t.newValue);if(e)return this.Vo(e.clientId,e)}}else if(this.io.test(t.key)){if(t.newValue!==null){let e=this.fo(t.key,t.newValue);if(e)return this.po(e)}}else if(this.so.test(t.key)){if(t.newValue!==null){let e=this.yo(t.key,t.newValue);if(e)return this.wo(e)}}else if(t.key===this.oo){if(t.newValue!==null){let e=this.uo(t.newValue);if(e)return this.co(e)}}else if(t.key===this.no){let e=function(e){let t=zc.ce;if(e!=null)try{let n=JSON.parse(e);k(typeof n==`number`,30636,{So:e}),t=n}catch(e){D(Dg,`Failed to read sequence number from WebStorage`,e)}return t}(t.newValue);e!==zc.ce&&this.sequenceNumberHandler(e)}else if(t.key===this._o){let e=this.bo(t.newValue);await Promise.all(e.map((e=>this.syncEngine.Do(e))))}}}else this.Xs.push(t)}))}}get To(){return this.Zs.get(this.Js)}ao(){this.setItem(this.eo,this.To.Gs())}ho(e,t,n){let r=new Og(this.currentUser,e,t,n),i=wg(this.persistenceKey,this.currentUser,e);this.setItem(i,r.Gs())}Po(e){let t=wg(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Eo(e){let t={clientId:this.Js,onlineState:e};this.storage.setItem(this.oo,JSON.stringify(t))}Io(e,t,n){let r=Eg(this.persistenceKey,e),i=new kg(e,t,n);this.setItem(r,i.Gs())}Ao(e){let t=JSON.stringify(Array.from(e));this.setItem(this._o,t)}Ro(e){let t=this.ro.exec(e);return t?t[1]:null}mo(e,t){let n=this.Ro(e);return Ag.Ws(n,t)}fo(e,t){let n=this.io.exec(e),r=Number(n[1]),i=n[2]===void 0?null:n[2];return Og.Ws(new ks(i),r,t)}yo(e,t){let n=this.so.exec(e),r=Number(n[1]);return kg.Ws(r,t)}uo(e){return jg.Ws(e)}bo(e){return JSON.parse(e)}async po(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Co(e.batchId,e.state,e.error);E(Dg,`Ignoring mutation for non-active user ${e.user.uid}`)}wo(e){return this.syncEngine.vo(e.targetId,e.state,e.error)}Vo(e,t){let n=t?this.Zs.insert(e,t):this.Zs.remove(e),r=this.lo(this.Zs),i=this.lo(n),a=[],o=[];return i.forEach((e=>{r.has(e)||a.push(e)})),r.forEach((e=>{i.has(e)||o.push(e)})),this.syncEngine.Fo(a,o).then((()=>{this.Zs=n}))}co(e){this.Zs.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}lo(e){let t=hf();return e.forEach(((e,n)=>{t=t.unionWith(n.activeTargetIds)})),t}},Pg=class{constructor(){this.Mo=new Mg,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||`not-current`}updateQueryState(e,t,n){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new Mg,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}},Fg=class{Oo(e){}shutdown(){}},Ig=`ConnectivityMonitor`,Lg=class{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener(`online`,this.No),window.removeEventListener(`offline`,this.Lo)}Qo(){window.addEventListener(`online`,this.No),window.addEventListener(`offline`,this.Lo)}Bo(){E(Ig,`Network connectivity changed: AVAILABLE`);for(let e of this.qo)e(0)}ko(){E(Ig,`Network connectivity changed: UNAVAILABLE`);for(let e of this.qo)e(1)}static v(){return typeof window<`u`&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}},Rg=null;function zg(){return Rg===null?Rg=function(){return 268435456+Math.round(2147483648*Math.random())}():Rg++,`0x`+Rg.toString(16)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var Bg=`RestConnection`,Vg={BatchGetDocuments:`batchGet`,Commit:`commit`,RunQuery:`runQuery`,RunAggregationQuery:`runAggregationQuery`},Hg=class{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?`https`:`http`,n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Uo=t+`://`+e.host,this.Ko=`projects/${n}/databases/${r}`,this.Wo=this.databaseId.database===Ou?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Go(e,t,n,r,i){let a=zg(),o=this.zo(e,t.toUriEncodedString());E(Bg,`Sending RPC '${e}' ${a}:`,o,n);let s={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(s,r,i);let{host:c}=new URL(o),l=te(c);return this.Jo(e,o,s,n,l).then((t=>(E(Bg,`Received RPC '${e}' ${a}: `,t),t)),(t=>{throw Ns(Bg,`RPC '${e}' ${a} failed with error: `,t,`url: `,o,`request:`,n),t}))}Ho(e,t,n,r,i,a){return this.Go(e,t,n,r,i)}jo(e,t,n){e[`X-Goog-Api-Client`]=function(){return`gl-js/ fire/`+As}(),e[`Content-Type`]=`text/plain`,this.databaseInfo.appId&&(e[`X-Firebase-GMPID`]=this.databaseInfo.appId),t&&t.headers.forEach(((t,n)=>e[n]=t)),n&&n.headers.forEach(((t,n)=>e[n]=t))}zo(e,t){let n=Vg[e];return`${this.Uo}/v1/${t}:${n}`}terminate(){}},Ug=class{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}},Wg=`WebChannelConnection`,Gg=class extends Hg{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,n,r,i){let a=zg();return new Promise(((i,o)=>{let s=new ys;s.setWithCredentials(!0),s.listenOnce(xs.COMPLETE,(()=>{try{switch(s.getLastErrorCode()){case Ss.NO_ERROR:let t=s.getResponseJson();E(Wg,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(t)),i(t);break;case Ss.TIMEOUT:E(Wg,`RPC '${e}' ${a} timed out`),o(new M(j.DEADLINE_EXCEEDED,`Request time out`));break;case Ss.HTTP_ERROR:let n=s.getStatus();if(E(Wg,`RPC '${e}' ${a} failed with status:`,n,`response text:`,s.getResponseText()),n>0){let e=s.getResponseJson();Array.isArray(e)&&(e=e[0]);let t=e?.error;if(t&&t.status&&t.message){let e=function(e){let t=e.toLowerCase().replace(/_/g,`-`);return Object.values(j).indexOf(t)>=0?t:j.UNKNOWN}(t.status);o(new M(e,t.message))}else o(new M(j.UNKNOWN,`Server responded with status `+s.getStatus()))}else o(new M(j.UNAVAILABLE,`Connection failed.`));break;default:O(9055,{l_:e,streamId:a,h_:s.getLastErrorCode(),P_:s.getLastError()})}}finally{E(Wg,`RPC '${e}' ${a} completed.`)}}));let c=JSON.stringify(r);E(Wg,`RPC '${e}' ${a} sending request:`,r),s.send(t,`POST`,c,n,15)}))}T_(e,t,n){let r=zg(),i=[this.Uo,`/`,`google.firestore.v1.Firestore`,`/`,e,`/channel`],a=Es(),o=Ts(),s={httpSessionIdParam:`gsessionid`,initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(s.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(s.useFetchStreams=!0),this.jo(s.initMessageHeaders,t,n),s.encodeInitMessageHeaders=!0;let l=i.join(``);E(Wg,`Creating RPC '${e}' stream ${r}: ${l}`,s);let u=a.createWebChannel(l,s);this.I_(u);let d=!1,f=!1,p=new Ug({Yo:t=>{f?E(Wg,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(d||=(E(Wg,`Opening RPC '${e}' stream ${r} transport.`),u.open(),!0),E(Wg,`RPC '${e}' stream ${r} sending:`,t),u.send(t))},Zo:()=>u.close()}),m=(e,t,n)=>{e.listen(t,(e=>{try{n(e)}catch(e){setTimeout((()=>{throw e}),0)}}))};return m(u,bs.EventType.OPEN,(()=>{f||(E(Wg,`RPC '${e}' stream ${r} transport opened.`),p.o_())})),m(u,bs.EventType.CLOSE,(()=>{f||(f=!0,E(Wg,`RPC '${e}' stream ${r} transport closed`),p.a_(),this.E_(u))})),m(u,bs.EventType.ERROR,(t=>{f||(f=!0,Ns(Wg,`RPC '${e}' stream ${r} transport errored. Name:`,t.name,`Message:`,t.message),p.a_(new M(j.UNAVAILABLE,`The operation could not be completed`)))})),m(u,bs.EventType.MESSAGE,(t=>{if(!f){let n=t.data[0];k(!!n,16349);let i=n,a=i?.error||i[0]?.error;if(a){E(Wg,`RPC '${e}' stream ${r} received error:`,a);let t=a.status,n=function(e){let t=Y[e];if(t!==void 0)return $f(t)}(t),i=a.message;n===void 0&&(n=j.INTERNAL,i=`Unknown error status: `+t+` with message `+a.message),f=!0,p.a_(new M(n,i)),u.close()}else E(Wg,`RPC '${e}' stream ${r} received:`,n),p.u_(n)}})),m(o,ws.STAT_EVENT,(t=>{t.stat===Cs.PROXY?E(Wg,`RPC '${e}' stream ${r} detected buffering proxy`):t.stat===Cs.NOPROXY&&E(Wg,`RPC '${e}' stream ${r} detected no buffering proxy`)})),setTimeout((()=>{p.__()}),0),p}terminate(){this.c_.forEach((e=>e.close())),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter((t=>t===e))}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Kg(){return typeof window<`u`?window:null}function qg(){return typeof document<`u`?document:null}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/function Jg(e){return new yp(e,!0)}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Yg=class{constructor(e,t,n=1e3,r=1.5,i=6e4){this.Mi=e,this.timerId=t,this.d_=n,this.A_=r,this.R_=i,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();let t=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-n);r>0&&E(`ExponentialBackoff`,`Backing off for ${r} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,r,(()=>(this.f_=Date.now(),e()))),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}},Xg=`PersistentStream`,Zg=class{constructor(e,t,n,r,i,a,o,s){this.Mi=e,this.S_=n,this.b_=r,this.connection=i,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=o,this.listener=s,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Yg(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state===4?this.N_():this.auth()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&=(this.C_.cancel(),null)}U_(){this.v_&&=(this.v_.cancel(),null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,e===4?t&&t.code===j.RESOURCE_EXHAUSTED?(D(t.toString()),D(`Using maximum backoff delay to prevent overloading the backend.`),this.M_.g_()):t&&t.code===j.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()):this.M_.reset(),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;let e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([e,n])=>{this.D_===t&&this.G_(e,n)}),(t=>{e((()=>{let e=new M(j.UNKNOWN,`Fetching auth token failed: `+t.message);return this.z_(e)}))}))}G_(e,t){let n=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo((()=>{n((()=>this.listener.Xo()))})),this.stream.t_((()=>{n((()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.t_())))})),this.stream.r_((e=>{n((()=>this.z_(e)))})),this.stream.onMessage((e=>{n((()=>++this.F_==1?this.J_(e):this.onNext(e)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return E(Xg,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget((()=>this.D_===e?t():(E(Xg,`stream callback skipped by getCloseGuardedDispatcher.`),Promise.resolve())))}}},Qg=class extends Zg{constructor(e,t,n,r,i,a){super(e,`listen_stream_connection_backoff`,`listen_stream_idle`,`health_check_timeout`,t,n,r,a),this.serializer=i}j_(e,t){return this.connection.T_(`Listen`,e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();let t=Ip(this.serializer,e),n=function(e){if(!(`targetChange`in e))return R.min();let t=e.targetChange;return t.targetIds&&t.targetIds.length?R.min():t.readTime?Z(t.readTime):R.min()}(e);return this.listener.H_(t,n)}Y_(e){let t={};t.database=jp(this.serializer),t.addTarget=function(e,t){let n,r=t.target;if(n=Pd(r)?{documents:Bp(e,r)}:{query:Vp(e,r).ft},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=Sp(e,t.resumeToken);let r=bp(e,t.expectedCount);r!==null&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(R.min())>0){n.readTime=xp(e,t.snapshotVersion.toTimestamp());let r=bp(e,t.expectedCount);r!==null&&(n.expectedCount=r)}return n}(this.serializer,e);let n=Up(this.serializer,e);n&&(t.labels=n),this.q_(t)}Z_(e){let t={};t.database=jp(this.serializer),t.removeTarget=e,this.q_(t)}},$g=class extends Zg{constructor(e,t,n,r,i,a){super(e,`write_stream_connection_backoff`,`write_stream_idle`,`health_check_timeout`,t,n,r,a),this.serializer=i}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_(`Write`,e,t)}J_(e){return k(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,k(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){k(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();let t=zp(e.writeResults,e.commitTime),n=Z(e.commitTime);return this.listener.na(n,t)}ra(){let e={};e.database=jp(this.serializer),this.q_(e)}ea(e){let t={streamToken:this.lastStreamToken,writes:e.map((e=>Lp(this.serializer,e)))};this.q_(t)}},e_=class{},t_=class extends e_{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new M(j.FAILED_PRECONDITION,`The client has already been terminated.`)}Go(e,t,n,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,a])=>this.connection.Go(e,Tp(t,n),r,i,a))).catch((e=>{throw e.name===`FirebaseError`?(e.code===j.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new M(j.UNKNOWN,e.toString())}))}Ho(e,t,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,o])=>this.connection.Ho(e,Tp(t,n),r,a,o,i))).catch((e=>{throw e.name===`FirebaseError`?(e.code===j.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new M(j.UNKNOWN,e.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}},n_=class{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state=`Unknown`,this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca(`Unknown`),this._a=this.asyncQueue.enqueueAfterDelay(`online_state_timeout`,1e4,(()=>(this._a=null,this.la(`Backend didn't respond within 10 seconds.`),this.ca(`Offline`),Promise.resolve()))))}ha(e){this.state===`Online`?this.ca(`Unknown`):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca(`Offline`)))}set(e){this.Pa(),this.oa=0,e===`Online`&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){let t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(D(t),this.aa=!1):E(`OnlineStateTracker`,t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}},r_=`RemoteStore`,i_=class{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=i,this.Aa.Oo((e=>{n.enqueueAndForget((async()=>{p_(this)&&(E(r_,`Restarting streams for network reachability change.`),await async function(e){let t=A(e);t.Ea.add(4),await o_(t),t.Ra.set(`Unknown`),t.Ea.delete(4),await a_(t)}(this))}))})),this.Ra=new n_(n,r)}};async function a_(e){if(p_(e))for(let t of e.da)await t(!0)}async function o_(e){for(let t of e.da)await t(!1)}function s_(e,t){let n=A(e);n.Ia.has(t.targetId)||(n.Ia.set(t.targetId,t),f_(n)?d_(n):M_(n).O_()&&l_(n,t))}function c_(e,t){let n=A(e),r=M_(n);n.Ia.delete(t),r.O_()&&u_(n,t),n.Ia.size===0&&(r.O_()?r.L_():p_(n)&&n.Ra.set(`Unknown`))}function l_(e,t){if(e.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(R.min())>0){let n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}M_(e).Y_(t)}function u_(e,t){e.Va.Ue(t),M_(e).Z_(t)}function d_(e){e.Va=new pp({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),At:t=>e.Ia.get(t)||null,ht:()=>e.datastore.serializer.databaseId}),M_(e).start(),e.Ra.ua()}function f_(e){return p_(e)&&!M_(e).x_()&&e.Ia.size>0}function p_(e){return A(e).Ea.size===0}function m_(e){e.Va=void 0}async function h_(e){e.Ra.set(`Online`)}async function g_(e){e.Ia.forEach(((t,n)=>{l_(e,t)}))}async function __(e,t){m_(e),f_(e)?(e.Ra.ha(t),d_(e)):e.Ra.set(`Unknown`)}async function v_(e,t,n){if(e.Ra.set(`Online`),t instanceof dp&&t.state===2&&t.cause)try{await async function(e,t){let n=t.cause;for(let r of t.targetIds)e.Ia.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.Ia.delete(r),e.Va.removeTarget(r))}(e,t)}catch(n){E(r_,`Failed to remove targets %s: %s `,t.targetIds.join(`,`),n),await y_(e,n)}else if(t instanceof lp?e.Va.Ze(t):t instanceof up?e.Va.st(t):e.Va.tt(t),!n.isEqual(R.min()))try{let t=await dg(e.localStore);n.compareTo(t)>=0&&await function(e,t){let n=e.Va.Tt(t);return n.targetChanges.forEach(((n,r)=>{if(n.resumeToken.approximateByteSize()>0){let i=e.Ia.get(r);i&&e.Ia.set(r,i.withResumeToken(n.resumeToken,t))}})),n.targetMismatches.forEach(((t,n)=>{let r=e.Ia.get(t);if(!r)return;e.Ia.set(t,r.withResumeToken(U.EMPTY_BYTE_STRING,r.snapshotVersion)),u_(e,t);let i=new $p(r.target,t,n,r.sequenceNumber);l_(e,i)})),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(t){E(r_,`Failed to raise snapshot:`,t),await y_(e,t)}}async function y_(e,t,n){if(!jc(t))throw t;e.Ea.add(1),await o_(e),e.Ra.set(`Offline`),n||=()=>dg(e.localStore),e.asyncQueue.enqueueRetryable((async()=>{E(r_,`Retrying IndexedDB access`),await n(),e.Ea.delete(1),await a_(e)}))}function b_(e,t){return t().catch((n=>y_(e,n,t)))}async function x_(e){let t=A(e),n=N_(t),r=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:Bc;for(;S_(t);)try{let e=await mg(t.localStore,r);if(e===null){t.Ta.length===0&&n.L_();break}r=e.batchId,C_(t,e)}catch(e){await y_(t,e)}w_(t)&&T_(t)}function S_(e){return p_(e)&&e.Ta.length<10}function C_(e,t){e.Ta.push(t);let n=N_(e);n.O_()&&n.X_&&n.ea(t.mutations)}function w_(e){return p_(e)&&!N_(e).x_()&&e.Ta.length>0}function T_(e){N_(e).start()}async function E_(e){N_(e).ra()}async function D_(e){let t=N_(e);for(let n of e.Ta)t.ea(n.mutations)}async function O_(e,t,n){let r=e.Ta.shift(),i=Yf.from(r,t,n);await b_(e,(()=>e.remoteSyncer.applySuccessfulWrite(i))),await x_(e)}async function k_(e,t){t&&N_(e).X_&&await async function(e,t){if(function(e){return Qf(e)&&e!==j.ABORTED}(t.code)){let n=e.Ta.shift();N_(e).B_(),await b_(e,(()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t))),await x_(e)}}(e,t),w_(e)&&T_(e)}async function A_(e,t){let n=A(e);n.asyncQueue.verifyOperationInProgress(),E(r_,`RemoteStore received new credentials`);let r=p_(n);n.Ea.add(3),await o_(n),r&&n.Ra.set(`Unknown`),await n.remoteSyncer.handleCredentialChange(t),n.Ea.delete(3),await a_(n)}async function j_(e,t){let n=A(e);t?(n.Ea.delete(2),await a_(n)):t||(n.Ea.add(2),await o_(n),n.Ra.set(`Unknown`))}function M_(e){return e.ma||(e.ma=function(e,t,n){let r=A(e);return r.sa(),new Qg(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Xo:h_.bind(null,e),t_:g_.bind(null,e),r_:__.bind(null,e),H_:v_.bind(null,e)}),e.da.push((async t=>{t?(e.ma.B_(),f_(e)?d_(e):e.Ra.set(`Unknown`)):(await e.ma.stop(),m_(e))}))),e.ma}function N_(e){return e.fa||(e.fa=function(e,t,n){let r=A(e);return r.sa(),new $g(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{Xo:()=>Promise.resolve(),t_:E_.bind(null,e),r_:k_.bind(null,e),ta:D_.bind(null,e),na:O_.bind(null,e)}),e.da.push((async t=>{t?(e.fa.B_(),await x_(e)):(await e.fa.stop(),e.Ta.length>0&&(E(r_,`Stopping write stream with ${e.Ta.length} pending writes`),e.Ta=[]))}))),e.fa}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var P_=class e{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new Is,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((e=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(t,n,r,i,a){let o=Date.now()+r,s=new e(t,n,o,i,a);return s.start(r),s}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new M(j.CANCELLED,`Operation cancelled`+(e?`: `+e:``))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle===null?Promise.resolve():(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e))))))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};function F_(e,t){if(D(`AsyncQueue`,`${t}: ${e}`),jc(e))return new M(j.UNAVAILABLE,`${t}: ${e}`);throw e}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var I_=class e{static emptySet(t){return new e(t.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||F.comparator(t.key,n.key):(e,t)=>F.comparator(e.key,t.key),this.keyedMap=sf(),this.sortedSet=new V(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(t){if(!(t instanceof e)||this.size!==t.size)return!1;let n=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;n.hasNext();){let e=n.getNext().key,t=r.getNext().key;if(!e.isEqual(t))return!1}return!0}toString(){let e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?`DocumentSet ()`:`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(t,n){let r=new e;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=n,r}},L_=class{constructor(){this.ga=new V(F.comparator)}track(e){let t=e.doc.key,n=this.ga.get(t);n?e.type!==0&&n.type===3?this.ga=this.ga.insert(t,e):e.type===3&&n.type!==1?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.ga=this.ga.remove(t):e.type===1&&n.type===2?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):O(63341,{Rt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){let e=[];return this.ga.inorderTraversal(((t,n)=>{e.push(n)})),e}},R_=class e{constructor(e,t,n,r,i,a,o,s,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=a,this.syncStateChanged=o,this.excludesMetadataChanges=s,this.hasCachedResults=c}static fromInitialDocuments(t,n,r,i,a){let o=[];return n.forEach((e=>{o.push({type:0,doc:e})})),new e(t,n,I_.emptySet(n),o,r,i,!0,!1,a)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Jd(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let e=0;e<t.length;e++)if(t[e].type!==n[e].type||!t[e].doc.isEqual(n[e].doc))return!1;return!0}},z_=class{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((e=>e.Da()))}},B_=class{constructor(){this.queries=V_(),this.onlineState=`Unknown`,this.Ca=new Set}terminate(){(function(e,t){let n=A(e),r=n.queries;n.queries=V_(),r.forEach(((e,n)=>{for(let e of n.Sa)e.onError(t)}))})(this,new M(j.ABORTED,`Firestore shutting down`))}};function V_(){return new tf((e=>Yd(e)),Jd)}async function H_(e,t){let n=A(e),r=3,i=t.query,a=n.queries.get(i);a?!a.ba()&&t.Da()&&(r=2):(a=new z_,r=t.Da()?0:1);try{switch(r){case 0:a.wa=await n.onListen(i,!0);break;case 1:a.wa=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(e){let n=F_(e,`Initialization of query '${Xd(t.query)}' failed`);t.onError(n);return}n.queries.set(i,a),a.Sa.push(t),t.va(n.onlineState),a.wa&&t.Fa(a.wa)&&K_(n)}async function U_(e,t){let n=A(e),r=t.query,i=3,a=n.queries.get(r);if(a){let e=a.Sa.indexOf(t);e>=0&&(a.Sa.splice(e,1),a.Sa.length===0?i=t.Da()?0:1:!a.ba()&&t.Da()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function W_(e,t){let n=A(e),r=!1;for(let e of t){let t=e.query,i=n.queries.get(t);if(i){for(let t of i.Sa)t.Fa(e)&&(r=!0);i.wa=e}}r&&K_(n)}function G_(e,t,n){let r=A(e),i=r.queries.get(t);if(i)for(let e of i.Sa)e.onError(n);r.queries.delete(t)}function K_(e){e.Ca.forEach((e=>{e.next()}))}var q_,J_;(J_=q_||={}).Ma=`default`,J_.Cache=`cache`;var Y_=class{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState=`Unknown`,this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){let t=[];for(let n of e.docChanges)n.type!==3&&t.push(n);e=new R_(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;let n=t!==`Offline`;return(!this.options.qa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t===`Offline`)}Ba(e){if(e.docChanges.length>0)return!0;let t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}ka(e){e=R_.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==q_.Cache}},X_=class{constructor(e){this.key=e}},Z_=class{constructor(e){this.key=e}},Q_=class{constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=q(),this.mutatedKeys=q(),this.eu=$d(e),this.tu=new I_(this.eu)}get nu(){return this.Ya}ru(e,t){let n=t?t.iu:new L_,r=t?t.tu:this.tu,i=t?t.mutatedKeys:this.mutatedKeys,a=r,o=!1,s=this.query.limitType===`F`&&r.size===this.query.limit?r.last():null,c=this.query.limitType===`L`&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((e,t)=>{let l=r.get(e),u=Zd(this.query,t)?t:null,d=!!l&&this.mutatedKeys.has(l.key),f=!!u&&(u.hasLocalMutations||this.mutatedKeys.has(u.key)&&u.hasCommittedMutations),p=!1;l&&u?l.data.isEqual(u.data)?d!==f&&(n.track({type:3,doc:u}),p=!0):this.su(l,u)||(n.track({type:2,doc:u}),p=!0,(s&&this.eu(u,s)>0||c&&this.eu(u,c)<0)&&(o=!0)):!l&&u?(n.track({type:0,doc:u}),p=!0):l&&!u&&(n.track({type:1,doc:l}),p=!0,(s||c)&&(o=!0)),p&&(u?(a=a.add(u),i=f?i.add(e):i.delete(e)):(a=a.delete(e),i=i.delete(e)))})),this.query.limit!==null)for(;a.size>this.query.limit;){let e=this.query.limitType===`F`?a.last():a.first();a=a.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{tu:a,iu:n,Cs:o,mutatedKeys:i}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){let i=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;let a=e.iu.ya();a.sort(((e,t)=>function(e,t){let n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return O(20277,{Rt:e})}};return n(e)-n(t)}(e.type,t.type)||this.eu(e.doc,t.doc))),this.ou(n),r??=!1;let o=t&&!r?this._u():[],s=this.Xa.size===0&&this.current&&!r?1:0,c=s!==this.Za;return this.Za=s,a.length!==0||c?{snapshot:new R_(this.query,e.tu,i,a,e.mutatedKeys,s===0,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:o}:{au:o}}va(e){return this.current&&e===`Offline`?(this.current=!1,this.applyChanges({tu:this.tu,iu:new L_,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((e=>this.Ya=this.Ya.add(e))),e.modifiedDocuments.forEach((e=>{})),e.removedDocuments.forEach((e=>this.Ya=this.Ya.delete(e))),this.current=e.current)}_u(){if(!this.current)return[];let e=this.Xa;this.Xa=q(),this.tu.forEach((e=>{this.uu(e.key)&&(this.Xa=this.Xa.add(e.key))}));let t=[];return e.forEach((e=>{this.Xa.has(e)||t.push(new Z_(e))})),this.Xa.forEach((n=>{e.has(n)||t.push(new X_(n))})),t}cu(e){this.Ya=e.Qs,this.Xa=q();let t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return R_.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}},$_=`SyncEngine`,ev=class{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}},tv=class{constructor(e){this.key=e,this.hu=!1}},nv=class{constructor(e,t,n,r,i,a){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new tf((e=>Yd(e)),Jd),this.Iu=new Map,this.Eu=new Set,this.du=new V(F.comparator),this.Au=new Map,this.Ru=new Ih,this.Vu={},this.mu=new Map,this.fu=ch.cr(),this.onlineState=`Unknown`,this.gu=void 0}get isPrimaryClient(){return!0===this.gu}};async function rv(e,t,n=!0){let r=Pv(e),i,a=r.Tu.get(t);return a?(r.sharedClientState.addLocalQueryTarget(a.targetId),i=a.view.lu()):i=await av(r,t,n,!0),i}async function iv(e,t){let n=Pv(e);await av(n,t,!0,!1)}async function av(e,t,n,r){let i=await hg(e.localStore,Wd(t)),a=i.targetId,o=e.sharedClientState.addLocalQueryTarget(a,n),s;return r&&(s=await ov(e,t,a,o===`current`,i.resumeToken)),e.isPrimaryClient&&n&&s_(e.remoteStore,i),s}async function ov(e,t,n,r,i){e.pu=(t,n,r)=>async function(e,t,n,r){let i=t.view.ru(n);i.Cs&&(i=await _g(e.localStore,t.query,!1).then((({documents:e})=>t.view.ru(e,i))));let a=r&&r.targetChanges.get(t.targetId),o=r&&r.targetMismatches.get(t.targetId)!=null,s=t.view.applyChanges(i,e.isPrimaryClient,a,o);return yv(e,t.targetId,s.au),s.snapshot}(e,t,n,r);let a=await _g(e.localStore,t,!0),o=new Q_(t,a.Qs),s=o.ru(a.documents),c=cp.createSynthesizedTargetChangeForCurrentChange(n,r&&e.onlineState!==`Offline`,i),l=o.applyChanges(s,e.isPrimaryClient,c);yv(e,n,l.au);let u=new ev(t,n,o);return e.Tu.set(t,u),e.Iu.has(n)?e.Iu.get(n).push(t):e.Iu.set(n,[t]),l.snapshot}async function sv(e,t,n){let r=A(e),i=r.Tu.get(t),a=r.Iu.get(i.targetId);if(a.length>1)return r.Iu.set(i.targetId,a.filter((e=>!Jd(e,t)))),void r.Tu.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await gg(r.localStore,i.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(i.targetId),n&&c_(r.remoteStore,i.targetId),_v(r,i.targetId)})).catch(wc)):(_v(r,i.targetId),await gg(r.localStore,i.targetId,!0))}async function cv(e,t){let n=A(e),r=n.Tu.get(t),i=n.Iu.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),c_(n.remoteStore,r.targetId))}async function lv(e,t,n){let r=Fv(e);try{let e=await function(e,t){let n=A(e),r=L.now(),i=t.reduce(((e,t)=>e.add(t.key)),q()),a,o;return n.persistence.runTransaction(`Locally write mutations`,`readwrite`,(e=>{let s=rf(),c=q();return n.Ns.getEntries(e,i).next((e=>{s=e,s.forEach(((e,t)=>{t.isValidDocument()||(c=c.add(e))}))})).next((()=>n.localDocuments.getOverlayedDocuments(e,s))).next((i=>{a=i;let o=[];for(let e of t){let t=zf(e,a.get(e.key).overlayedDocument);t!=null&&o.push(new Hf(e.key,t,od(t.value.mapValue),J.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)})).next((t=>{o=t;let r=t.applyToLocalDocumentSet(a,c);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)}))})).then((()=>({batchId:o.batchId,changes:cf(a)})))}(r.localStore,t);r.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.Vu[e.currentUser.toKey()];r||=new V(N),r=r.insert(t,n),e.Vu[e.currentUser.toKey()]=r}(r,e.batchId,n),await Sv(r,e.changes),await x_(r.remoteStore)}catch(e){let t=F_(e,`Failed to persist write`);n.reject(t)}}async function uv(e,t){let n=A(e);try{let e=await fg(n.localStore,t);t.targetChanges.forEach(((e,t)=>{let r=n.Au.get(t);r&&(k(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1,22616),e.addedDocuments.size>0?r.hu=!0:e.modifiedDocuments.size>0?k(r.hu,14607):e.removedDocuments.size>0&&(k(r.hu,42227),r.hu=!1))})),await Sv(n,e,t)}catch(e){await wc(e)}}function dv(e,t,n){let r=A(e);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){let e=[];r.Tu.forEach(((n,r)=>{let i=r.view.va(t);i.snapshot&&e.push(i.snapshot)})),function(e,t){let n=A(e);n.onlineState=t;let r=!1;n.queries.forEach(((e,n)=>{for(let e of n.Sa)e.va(t)&&(r=!0)})),r&&K_(n)}(r.eventManager,t),e.length&&r.Pu.H_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function fv(e,t,n){let r=A(e);r.sharedClientState.updateQueryState(t,`rejected`,n);let i=r.Au.get(t),a=i&&i.key;if(a){let e=new V(F.comparator);e=e.insert(a,sd.newNoDocument(a,R.min()));let n=q().add(a),i=new sp(R.min(),new Map,new V(N),e,n);await uv(r,i),r.du=r.du.remove(a),r.Au.delete(t),xv(r)}else await gg(r.localStore,t,!1).then((()=>_v(r,t,n))).catch(wc)}async function pv(e,t){let n=A(e),r=t.batch.batchId;try{let e=await ug(n.localStore,t);gv(n,r,null),hv(n,r),n.sharedClientState.updateMutationState(r,`acknowledged`),await Sv(n,e)}catch(e){await wc(e)}}async function mv(e,t,n){let r=A(e);try{let e=await function(e,t){let n=A(e);return n.persistence.runTransaction(`Reject batch`,`readwrite-primary`,(e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next((t=>(k(t!==null,37113),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t)))).next((()=>n.mutationQueue.performConsistencyCheck(e))).next((()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t))).next((()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r))).next((()=>n.localDocuments.getDocuments(e,r)))}))}(r.localStore,t);gv(r,t,n),hv(r,t),r.sharedClientState.updateMutationState(t,`rejected`,n),await Sv(r,e)}catch(e){await wc(e)}}function hv(e,t){(e.mu.get(t)||[]).forEach((e=>{e.resolve()})),e.mu.delete(t)}function gv(e,t,n){let r=A(e),i=r.Vu[r.currentUser.toKey()];if(i){let e=i.get(t);e&&(n?e.reject(n):e.resolve(),i=i.remove(t)),r.Vu[r.currentUser.toKey()]=i}}function _v(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(let r of e.Iu.get(t))e.Tu.delete(r),n&&e.Pu.yu(r,n);e.Iu.delete(t),e.isPrimaryClient&&e.Ru.jr(t).forEach((t=>{e.Ru.containsKey(t)||vv(e,t)}))}function vv(e,t){e.Eu.delete(t.path.canonicalString());let n=e.du.get(t);n!==null&&(c_(e.remoteStore,n),e.du=e.du.remove(t),e.Au.delete(n),xv(e))}function yv(e,t,n){for(let r of n)r instanceof X_?(e.Ru.addReference(r.key,t),bv(e,r)):r instanceof Z_?(E($_,`Document no longer in limbo: `+r.key),e.Ru.removeReference(r.key,t),e.Ru.containsKey(r.key)||vv(e,r.key)):O(19791,{wu:r})}function bv(e,t){let n=t.key,r=n.path.canonicalString();e.du.get(n)||e.Eu.has(r)||(E($_,`New document in limbo: `+n),e.Eu.add(r),xv(e))}function xv(e){for(;e.Eu.size>0&&e.du.size<e.maxConcurrentLimboResolutions;){let t=e.Eu.values().next().value;e.Eu.delete(t);let n=new F(P.fromString(t)),r=e.fu.next();e.Au.set(r,new tv(n)),e.du=e.du.insert(n,r),s_(e.remoteStore,new $p(Wd(Bd(n.path)),r,`TargetPurposeLimboResolution`,zc.ce))}}async function Sv(e,t,n){let r=A(e),i=[],a=[],o=[];r.Tu.isEmpty()||(r.Tu.forEach(((e,s)=>{o.push(r.pu(s,t,n).then((e=>{if((e||n)&&r.isPrimaryClient){let t=e?!e.fromCache:n?.targetChanges.get(s.targetId)?.current;r.sharedClientState.updateQueryState(s.targetId,t?`current`:`not-current`)}if(e){i.push(e);let t=ng.As(s.targetId,e);a.push(t)}})))})),await Promise.all(o),r.Pu.H_(i),await async function(e,t){let n=A(e);try{await n.persistence.runTransaction(`notifyLocalViewChanges`,`readwrite`,(e=>z.forEach(t,(t=>z.forEach(t.Es,(r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r))).next((()=>z.forEach(t.ds,(r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))))))}catch(e){if(!jc(e))throw e;E(ag,`Failed to update sequence numbers: `+e)}for(let e of t){let t=e.targetId;if(!e.fromCache){let e=n.Ms.get(t),r=e.snapshotVersion,i=e.withLastLimboFreeSnapshotVersion(r);n.Ms=n.Ms.insert(t,i)}}}(r.localStore,a))}async function Cv(e,t){let n=A(e);if(!n.currentUser.isEqual(t)){E($_,`User change. New user:`,t.toKey());let e=await lg(n.localStore,t);n.currentUser=t,function(e,t){e.mu.forEach((e=>{e.forEach((e=>{e.reject(new M(j.CANCELLED,t))}))})),e.mu.clear()}(n,`'waitForPendingWrites' promise is rejected due to a user change.`),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await Sv(n,e.Ls)}}function wv(e,t){let n=A(e),r=n.Au.get(t);if(r&&r.hu)return q().add(r.key);{let e=q(),r=n.Iu.get(t);if(!r)return e;for(let t of r){let r=n.Tu.get(t);e=e.unionWith(r.view.nu)}return e}}async function Tv(e,t){let n=A(e),r=await _g(n.localStore,t.query,!0),i=t.view.cu(r);return n.isPrimaryClient&&yv(n,t.targetId,i.au),i}async function Ev(e,t){let n=A(e);return yg(n.localStore,t).then((e=>Sv(n,e)))}async function Dv(e,t,n,r){let i=A(e),a=await function(e,t){let n=A(e),r=A(n.mutationQueue);return n.persistence.runTransaction(`Lookup mutation documents`,`readonly`,(e=>r.er(e,t).next((t=>t?n.localDocuments.getDocuments(e,t):z.resolve(null)))))}(i.localStore,t);a===null?E($_,`Cannot apply mutation batch with id: `+t):(n===`pending`?await x_(i.remoteStore):n===`acknowledged`||n===`rejected`?(gv(i,t,r||null),hv(i,t),function(e,t){A(A(e).mutationQueue).ir(t)}(i.localStore,t)):O(6720,`Unknown batchState`,{Su:n}),await Sv(i,a))}async function Ov(e,t){let n=A(e);if(Pv(n),Fv(n),!0===t&&!0!==n.gu){let e=n.sharedClientState.getAllActiveQueryTargets(),t=await kv(n,e.toArray());n.gu=!0,await j_(n.remoteStore,!0);for(let e of t)s_(n.remoteStore,e)}else if(!1===t&&!1!==n.gu){let e=[],t=Promise.resolve();n.Iu.forEach(((r,i)=>{n.sharedClientState.isLocalQueryTarget(i)?e.push(i):t=t.then((()=>(_v(n,i),gg(n.localStore,i,!0)))),c_(n.remoteStore,i)})),await t,await kv(n,e),function(e){let t=A(e);t.Au.forEach(((e,n)=>{c_(t.remoteStore,n)})),t.Ru.Jr(),t.Au=new Map,t.du=new V(F.comparator)}(n),n.gu=!1,await j_(n.remoteStore,!1)}}async function kv(e,t,n){let r=A(e),i=[],a=[];for(let e of t){let t,n=r.Iu.get(e);if(n&&n.length!==0){t=await hg(r.localStore,Wd(n[0]));for(let e of n){let t=r.Tu.get(e),n=await Tv(r,t);n.snapshot&&a.push(n.snapshot)}}else{let n=await vg(r.localStore,e);t=await hg(r.localStore,n),await ov(r,Av(n),e,!1,t.resumeToken)}i.push(t)}return r.Pu.H_(a),i}function Av(e){return zd(e.path,e.collectionGroup,e.orderBy,e.filters,e.limit,`F`,e.startAt,e.endAt)}function jv(e){return function(e){return A(A(e).persistence).Ts()}(A(e).localStore)}async function Mv(e,t,n,r){let i=A(e);if(i.gu)return void E($_,`Ignoring unexpected query state notification.`);let a=i.Iu.get(t);if(a&&a.length>0)switch(n){case`current`:case`not-current`:{let e=await yg(i.localStore,Qd(a[0])),r=sp.createSynthesizedRemoteEventForCurrentChange(t,n===`current`,U.EMPTY_BYTE_STRING);await Sv(i,e,r);break}case`rejected`:await gg(i.localStore,t,!0),_v(i,t,r);break;default:O(64155,n)}}async function Nv(e,t,n){let r=Pv(e);if(r.gu){for(let e of t){if(r.Iu.has(e)&&r.sharedClientState.isActiveQueryTarget(e)){E($_,`Adding an already active target `+e);continue}let t=await vg(r.localStore,e),n=await hg(r.localStore,t);await ov(r,Av(t),n.targetId,!1,n.resumeToken),s_(r.remoteStore,n)}for(let e of n)r.Iu.has(e)&&await gg(r.localStore,e,!1).then((()=>{c_(r.remoteStore,e),_v(r,e)})).catch(wc)}}function Pv(e){let t=A(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=uv.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=wv.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=fv.bind(null,t),t.Pu.H_=W_.bind(null,t.eventManager),t.Pu.yu=G_.bind(null,t.eventManager),t}function Fv(e){let t=A(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=pv.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=mv.bind(null,t),t}var Iv=class{constructor(){this.kind=`memory`,this.synchronizeTabs=!1}async initialize(e){this.serializer=Jg(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return cg(this.persistence,new ig,e.initialUser,this.serializer)}Cu(e){return new Vh(Uh.mi,this.serializer)}Du(e){return new Pg}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}};Iv.provider={build:()=>new Iv};var Lv=class extends Iv{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){k(this.persistence.referenceDelegate instanceof Wh,46915);let n=this.persistence.referenceDelegate.garbageCollector;return new _h(n,e.asyncQueue,t)}Cu(e){let t=this.cacheSizeBytes===void 0?eh.DEFAULT:eh.withCacheSize(this.cacheSizeBytes);return new Vh((e=>Wh.mi(e,t)),this.serializer)}},Rv=class extends Iv{constructor(e,t,n){super(),this.xu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind=`persistent`,this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.xu.initialize(this,e),await Fv(this.xu.syncEngine),await x_(this.xu.remoteStore),await this.persistence.Ji((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}vu(e){return cg(this.persistence,new ig,e.initialUser,this.serializer)}Fu(e,t){let n=this.persistence.referenceDelegate.garbageCollector;return new _h(n,e.asyncQueue,t)}Mu(e,t){let n=new Rc(t,this.persistence);return new Lc(e.asyncQueue,n)}Cu(e){let t=tg(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes===void 0?eh.DEFAULT:eh.withCacheSize(this.cacheSizeBytes);return new Qh(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,Kg(),qg(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Du(e){return new Pg}},zv=class extends Rv{constructor(e,t){super(e,t,!1),this.xu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);let t=this.xu.syncEngine;this.sharedClientState instanceof Ng&&(this.sharedClientState.syncEngine={Co:Dv.bind(null,t),vo:Mv.bind(null,t),Fo:Nv.bind(null,t),Ts:jv.bind(null,t),Do:Ev.bind(null,t)},await this.sharedClientState.start()),await this.persistence.Ji((async e=>{await Ov(this.xu.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())}))}Du(e){let t=Kg();if(!Ng.v(t))throw new M(j.UNIMPLEMENTED,`IndexedDB persistence is only available on platforms that support LocalStorage.`);let n=tg(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Ng(t,e.asyncQueue,n,e.clientId,e.initialUser)}},Bv=class{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>dv(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=Cv.bind(null,this.syncEngine),await j_(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new B_}()}createDatastore(e){let t=Jg(e.databaseInfo.databaseId),n=function(e){return new Gg(e)}(e.databaseInfo);return function(e,t,n,r){return new t_(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return function(e,t,n,r,i){return new i_(e,t,n,r,i)}(this.localStore,this.datastore,e.asyncQueue,(e=>dv(this.syncEngine,e,0)),function(){return Lg.v()?new Lg:new Fg}())}createSyncEngine(e,t){return function(e,t,n,r,i,a,o){let s=new nv(e,t,n,r,i,a);return o&&(s.gu=!0),s}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await async function(e){let t=A(e);E(r_,`RemoteStore shutting down.`),t.Ea.add(5),await o_(t),t.Aa.shutdown(),t.Ra.set(`Unknown`)}(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}};Bv.provider={build:()=>new Bv};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Vv=class{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):D(`Uncaught Error in snapshot listener:`,e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}},Hv=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new M(j.INVALID_ARGUMENT,`Firestore transactions require all reads to be executed before all writes.`),this.lastTransactionError;let t=await async function(e,t){let n=A(e),r={documents:t.map((e=>Dp(n.serializer,e)))},i=await n.Ho(`BatchGetDocuments`,n.serializer.databaseId,P.emptyPath(),r,t.length),a=new Map;i.forEach((e=>{let t=Fp(n.serializer,e);a.set(t.key.toString(),t)}));let o=[];return t.forEach((e=>{let t=a.get(e.toString());k(!!t,55234,{key:e}),o.push(t)})),o}(this.datastore,e);return t.forEach((e=>this.recordVersion(e))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(e){this.lastTransactionError=e}this.writtenDocs.add(e.toString())}delete(e){this.write(new Kf(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;let e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((e,t)=>{let n=F.fromPath(t);this.mutations.push(new qf(n,this.precondition(n)))})),await async function(e,t){let n=A(e),r={writes:t.map((e=>Lp(n.serializer,e)))};await n.Go(`Commit`,n.serializer.databaseId,P.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw O(50498,{Gu:e.constructor.name});t=R.min()}let n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new M(j.ABORTED,`Document version changed between two reads.`)}else this.readVersions.set(e.key.toString(),t)}precondition(e){let t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(R.min())?J.exists(!1):J.updateTime(t):J.none()}preconditionForUpdate(e){let t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(R.min()))throw new M(j.INVALID_ARGUMENT,`Can't update a document that doesn't exist.`);return J.updateTime(t)}return J.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}},Uv=class{constructor(e,t,n,r,i){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=i,this.zu=n.maxAttempts,this.M_=new Yg(this.asyncQueue,`transaction_retry`)}ju(){--this.zu,this.Ju()}Ju(){this.M_.p_((async()=>{let e=new Hv(this.datastore),t=this.Hu(e);t&&t.then((t=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(t)})).catch((e=>{this.Yu(e)}))))})).catch((e=>{this.Yu(e)}))}))}Hu(e){try{let t=this.updateFunction(e);return!Vc(t)&&t.catch&&t.then?t:(this.deferred.reject(Error(`Transaction callback must return a Promise`)),null)}catch(e){return this.deferred.reject(e),null}}Yu(e){this.zu>0&&this.Zu(e)?(--this.zu,this.asyncQueue.enqueueAndForget((()=>(this.Ju(),Promise.resolve())))):this.deferred.reject(e)}Zu(e){if(e?.name===`FirebaseError`){let t=e.code;return t===`aborted`||t===`failed-precondition`||t===`already-exists`||!Qf(t)}return!1}},Wv=`FirestoreClient`,Gv=class{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=ks.UNAUTHENTICATED,this.clientId=Gs.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async e=>{E(Wv,`Received user=`,e.uid),await this.authCredentialListener(e),this.user=e})),this.appCheckCredentials.start(n,(e=>(E(Wv,`Received new app check token=`,e),this.appCheckCredentialListener(e,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();let e=new Is;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){let n=F_(t,`Failed to shutdown persistence`);e.reject(n)}})),e.promise}};async function Kv(e,t){e.asyncQueue.verifyOperationInProgress(),E(Wv,`Initializing OfflineComponentProvider`);let n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener((async e=>{r.isEqual(e)||(await lg(t.localStore,e),r=e)})),t.persistence.setDatabaseDeletedListener((()=>e.terminate())),e._offlineComponents=t}async function qv(e,t){e.asyncQueue.verifyOperationInProgress();let n=await Jv(e);E(Wv,`Initializing OnlineComponentProvider`),await t.initialize(n,e.configuration),e.setCredentialChangeListener((e=>A_(t.remoteStore,e))),e.setAppCheckTokenChangeListener(((e,n)=>A_(t.remoteStore,n))),e._onlineComponents=t}async function Jv(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){E(Wv,`Using user provided OfflineComponentProvider`);try{await Kv(e,e._uninitializedComponentsProvider._offline)}catch(t){let n=t;if(!function(e){return e.name===`FirebaseError`?e.code===j.FAILED_PRECONDITION||e.code===j.UNIMPLEMENTED:!(typeof DOMException<`u`&&e instanceof DOMException)||e.code===22||e.code===20||e.code===11}(n))throw n;Ns(`Error using user provided cache. Falling back to memory cache: `+n),await Kv(e,new Iv)}}else E(Wv,`Using default OfflineComponentProvider`),await Kv(e,new Lv(void 0));return e._offlineComponents}async function Yv(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(E(Wv,`Using user provided OnlineComponentProvider`),await qv(e,e._uninitializedComponentsProvider._online)):(E(Wv,`Using default OnlineComponentProvider`),await qv(e,new Bv))),e._onlineComponents}function Xv(e){return Yv(e).then((e=>e.syncEngine))}function Zv(e){return Yv(e).then((e=>e.datastore))}async function Qv(e){let t=await Yv(e),n=t.eventManager;return n.onListen=rv.bind(null,t.syncEngine),n.onUnlisten=sv.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=iv.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=cv.bind(null,t.syncEngine),n}function $v(e,t,n={}){let r=new Is;return e.asyncQueue.enqueueAndForget((async()=>function(e,t,n,r,i){let a=new Vv({next:s=>{a.Nu(),t.enqueueAndForget((()=>U_(e,o)));let c=s.docs.has(n);!c&&s.fromCache?i.reject(new M(j.UNAVAILABLE,`Failed to get document because the client is offline.`)):c&&s.fromCache&&r&&r.source===`server`?i.reject(new M(j.UNAVAILABLE,`Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)`)):i.resolve(s)},error:e=>i.reject(e)}),o=new Y_(Bd(n.path),a,{includeMetadataChanges:!0,qa:!0});return H_(e,o)}(await Qv(e),e.asyncQueue,t,n,r))),r.promise}function ey(e,t,n={}){let r=new Is;return e.asyncQueue.enqueueAndForget((async()=>function(e,t,n,r,i){let a=new Vv({next:n=>{a.Nu(),t.enqueueAndForget((()=>U_(e,o))),n.fromCache&&r.source===`server`?i.reject(new M(j.UNAVAILABLE,`Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)`)):i.resolve(n)},error:e=>i.reject(e)}),o=new Y_(n,a,{includeMetadataChanges:!0,qa:!0});return H_(e,o)}(await Qv(e),e.asyncQueue,t,n,r))),r.promise}
/**
* @license
* Copyright 2023 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function ty(e){let t={};return e.timeoutSeconds!==void 0&&(t.timeoutSeconds=e.timeoutSeconds),t}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var ny=new Map,ry=`firestore.googleapis.com`,iy=!0,ay=class{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new M(j.INVALID_ARGUMENT,`Can't provide ssl option if host option is not set`);this.host=ry,this.ssl=iy}else this.host=e.host,this.ssl=e.ssl??iy;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=$m;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<mh)throw new M(j.INVALID_ARGUMENT,`cacheSizeBytes must be at least 1048576`);this.cacheSizeBytes=e.cacheSizeBytes}rc(`experimentalForceLongPolling`,e.experimentalForceLongPolling,`experimentalAutoDetectLongPolling`,e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ty(e.experimentalLongPollingOptions??{}),function(e){if(e.timeoutSeconds!==void 0){if(isNaN(e.timeoutSeconds))throw new M(j.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new M(j.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new M(j.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(e,t){return e.timeoutSeconds===t.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}},oy=class{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type=`firestore-lite`,this._persistenceKey=`(lite)`,this._settings=new ay({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask=`notTerminated`}get app(){if(!this._app)throw new M(j.FAILED_PRECONDITION,`Firestore was not initialized using the Firebase SDK. 'app' is not available`);return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==`notTerminated`}_setSettings(e){if(this._settingsFrozen)throw new M(j.FAILED_PRECONDITION,`Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.`);this._settings=new ay(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(e){if(!e)return new Rs;switch(e.type){case`firstParty`:return new Vs(e.sessionIndex||`0`,e.iamToken||null,e.authTokenFactory||null);case`provider`:return e.client;default:throw new M(j.INVALID_ARGUMENT,`makeAuthCredentialsProvider failed due to invalid credential type`)}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask===`notTerminated`&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask===`notTerminated`?await this._terminate():this._terminateTask=`notTerminated`}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=ny.get(e);t&&(E(`ComponentProvider`,`Removing Datastore`),ny.delete(e),t.terminate())}(this),Promise.resolve()}},sy=class e{constructor(e,t,n){this.converter=t,this._query=n,this.type=`query`,this.firestore=e}withConverter(t){return new e(this.firestore,t,this._query)}},$=class e{constructor(e,t,n){this.converter=t,this._key=n,this.type=`document`,this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new cy(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new e(this.firestore,t,this._key)}toJSON(){return{type:e._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,n,r){if(lc(n,e._jsonSchema))return new e(t,r||null,new F(P.fromString(n.referencePath)))}};$._jsonSchemaVersion=`firestore/documentReference/1.0`,$._jsonSchema={type:I(`string`,$._jsonSchemaVersion),referencePath:I(`string`)};var cy=class e extends sy{constructor(e,t,n){super(e,t,Bd(n)),this._path=n,this.type=`collection`}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new $(this.firestore,null,new F(e))}withConverter(t){return new e(this.firestore,t,this._path)}};function ly(e,t,...n){if(e=v(e),nc(`collection`,`path`,t),e instanceof oy){let r=P.fromString(t,...n);return ac(r),new cy(e,null,r)}{if(!(e instanceof $||e instanceof cy))throw new M(j.INVALID_ARGUMENT,`Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore`);let r=e._path.child(P.fromString(t,...n));return ac(r),new cy(e.firestore,null,r)}}function uy(e,t,...n){if(e=v(e),arguments.length===1&&(t=Gs.newId()),nc(`doc`,`path`,t),e instanceof oy){let r=P.fromString(t,...n);return ic(r),new $(e,null,new F(r))}{if(!(e instanceof $||e instanceof cy))throw new M(j.INVALID_ARGUMENT,`Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore`);let r=e._path.child(P.fromString(t,...n));return ic(r),new $(e.firestore,e instanceof cy?e.converter:null,new F(r))}}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var dy=`AsyncQueue`,fy=class{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Yg(this,`async_queue_retry`),this._c=()=>{let e=qg();e&&E(dy,`Visibility state changed to `+e.visibilityState),this.M_.w_()},this.ac=e;let t=qg();t&&typeof t.addEventListener==`function`&&t.addEventListener(`visibilitychange`,this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;let t=qg();t&&typeof t.removeEventListener==`function`&&t.removeEventListener(`visibilitychange`,this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));let t=new Is;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Xu.push(e),this.lc())))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!jc(e))throw e;E(dy,`Operation failed with retryable error: `+e)}this.Xu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){let t=this.ac.then((()=>(this.rc=!0,e().catch((e=>{throw this.nc=e,this.rc=!1,D(`INTERNAL UNHANDLED ERROR: `,py(e)),e})).then((e=>(this.rc=!1,e))))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);let r=P_.createAndSchedule(this,e,t,n,(e=>this.hc(e)));return this.tc.push(r),r}uc(){this.nc&&O(47125,{Pc:py(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(let t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((e,t)=>e.targetTimeMs-t.targetTimeMs));for(let t of this.tc)if(t.skipDelay(),e!==`all`&&t.timerId===e)break;return this.Tc()}))}dc(e){this.oc.push(e)}hc(e){let t=this.tc.indexOf(e);this.tc.splice(t,1)}};function py(e){let t=e.message||``;return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+`
`+e.stack),t}
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/function my(e){return function(e,t){if(typeof e!=`object`||!e)return!1;let n=e;for(let e of t)if(e in n&&typeof n[e]==`function`)return!0;return!1}(e,[`next`,`error`,`complete`])}var hy=class extends oy{constructor(e,t,n,r){super(e,t,n,r),this.type=`firestore`,this._queue=new fy,this._persistenceKey=r?.name||`[DEFAULT]`}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new fy(e),this._firestoreClient=void 0,await e}}};function gy(e,t,n){n||=Ou;let r=Xt(e,`firestore`);if(r.isInitialized(n)){let e=r.getImmediate({identifier:n}),i=r.getOptions(n);if(Ce(i,t))return e;throw new M(j.FAILED_PRECONDITION,`initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.`)}if(t.cacheSizeBytes!==void 0&&t.localCache!==void 0)throw new M(j.INVALID_ARGUMENT,`cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object`);if(t.cacheSizeBytes!==void 0&&t.cacheSizeBytes!==-1&&t.cacheSizeBytes<mh)throw new M(j.INVALID_ARGUMENT,`cacheSizeBytes must be at least 1048576`);return t.host&&te(t.host)&&ne(t.host),r.initialize({options:t,instanceIdentifier:n})}function _y(e){if(e._terminated)throw new M(j.FAILED_PRECONDITION,`The client has already been terminated.`);return e._firestoreClient||vy(e),e._firestoreClient}function vy(e){let t=e._freezeSettings(),n=function(e,t,n,r){return new Du(e,t,n,r.host,r.ssl,r.experimentalForceLongPolling,r.experimentalAutoDetectLongPolling,ty(r.experimentalLongPollingOptions),r.useFetchStreams,r.isUsingEmulator)}(e._databaseId,e._app?.options.appId||``,e._persistenceKey,t);e._componentsProvider||t.localCache?._offlineComponentProvider&&t.localCache?._onlineComponentProvider&&(e._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),e._firestoreClient=new Gv(e._authCredentials,e._appCheckCredentials,e._queue,n,e._componentsProvider&&function(e){let t=e?._online.build();return{_offline:e?._offline.build(t),_online:t}}(e._componentsProvider))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var yy=class e{constructor(e){this._byteString=e}static fromBase64String(t){try{return new e(U.fromBase64String(t))}catch(e){throw new M(j.INVALID_ARGUMENT,`Failed to construct data from Base64 string: `+e)}}static fromUint8Array(t){return new e(U.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return`Bytes(base64: `+this.toBase64()+`)`}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:e._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(lc(t,e._jsonSchema))return e.fromBase64String(t.bytes)}};yy._jsonSchemaVersion=`firestore/bytes/1.0`,yy._jsonSchema={type:I(`string`,yy._jsonSchemaVersion),bytes:I(`string`)};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var by=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new M(j.INVALID_ARGUMENT,`Invalid field name at argument $(i + 1). Field names must not be empty.`);this._internalPath=new tc(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}},xy=class{constructor(e){this._methodName=e}},Sy=class e{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new M(j.INVALID_ARGUMENT,`Latitude must be a number between -90 and 90, but was: `+e);if(!isFinite(t)||t<-180||t>180)throw new M(j.INVALID_ARGUMENT,`Longitude must be a number between -180 and 180, but was: `+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return N(this._lat,e._lat)||N(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:e._jsonSchemaVersion}}static fromJSON(t){if(lc(t,e._jsonSchema))return new e(t.latitude,t.longitude)}};Sy._jsonSchemaVersion=`firestore/geoPoint/1.0`,Sy._jsonSchema={type:I(`string`,Sy._jsonSchemaVersion),latitude:I(`number`),longitude:I(`number`)};
/**
* @license
* Copyright 2024 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Cy=class e{constructor(e){this._values=(e||[]).map((e=>e))}toArray(){return this._values.map((e=>e))}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:e._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(lc(t,e._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((e=>typeof e==`number`)))return new e(t.vectorValues);throw new M(j.INVALID_ARGUMENT,`Expected 'vectorValues' field to be a number array`)}}};Cy._jsonSchemaVersion=`firestore/vectorValue/1.0`,Cy._jsonSchema={type:I(`string`,Cy._jsonSchemaVersion),vectorValues:I(`object`)};
/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var wy=/^__.*__$/,Ty=class{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask===null?new Vf(e,this.data,t,this.fieldTransforms):new Hf(e,this.data,this.fieldMask,t,this.fieldTransforms)}},Ey=class{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Hf(e,this.data,this.fieldMask,t,this.fieldTransforms)}};function Dy(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw O(40011,{Ac:e})}}var Oy=class e{constructor(e,t,n,r,i,a){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,i===void 0&&this.Rc(),this.fieldTransforms=i||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(t){return new e({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){let t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.gc(e),n}yc(e){let t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.Rc(),n}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return Uy(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(e.length===0)throw this.Sc(`Document fields must not be empty`);if(Dy(this.Ac)&&wy.test(e))throw this.Sc(`Document fields cannot begin and end with "__"`)}},ky=class{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Jg(e)}Cc(e,t,n,r=!1){return new Oy({Ac:e,methodName:t,Dc:n,path:tc.emptyPath(),fc:!1,bc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function Ay(e){let t=e._freezeSettings(),n=Jg(e._databaseId);return new ky(e._databaseId,!!t.ignoreUndefinedProperties,n)}function jy(e,t,n,r,i,a={}){let o=e.Cc(a.merge||a.mergeFields?2:0,t,n,i);zy(`Data must be an object, but it was:`,o,r);let s=Ly(r,o),c,l;if(a.merge)c=new hu(o.fieldMask),l=o.fieldTransforms;else if(a.mergeFields){let e=[];for(let r of a.mergeFields){let i=By(t,r,n);if(!o.contains(i))throw new M(j.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);Wy(e,i)||e.push(i)}c=new hu(e),l=o.fieldTransforms.filter((e=>c.covers(e.field)))}else c=null,l=o.fieldTransforms;return new Ty(new ad(s),c,l)}var My=class e extends xy{_toFieldTransform(e){if(e.Ac!==2)throw e.Ac===1?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(t){return t instanceof e}};function Ny(e,t,n,r){let i=e.Cc(1,t,n);zy(`Data must be an object, but it was:`,i,r);let a=[],o=ad.empty();lu(r,((e,r)=>{let s=Hy(t,e,n);r=v(r);let c=i.yc(s);if(r instanceof My)a.push(s);else{let e=Iy(r,c);e!=null&&(a.push(s),o.set(s,e))}}));let s=new hu(a);return new Ey(o,s,i.fieldTransforms)}function Py(e,t,n,r,i,a){let o=e.Cc(1,t,n),s=[By(t,r,n)],c=[i];if(a.length%2!=0)throw new M(j.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<a.length;e+=2)s.push(By(t,a[e])),c.push(a[e+1]);let l=[],u=ad.empty();for(let e=s.length-1;e>=0;--e)if(!Wy(l,s[e])){let t=s[e],n=c[e];n=v(n);let r=o.yc(t);if(n instanceof My)l.push(t);else{let e=Iy(n,r);e!=null&&(l.push(t),u.set(t,e))}}let d=new hu(l);return new Ey(u,d,o.fieldTransforms)}function Fy(e,t,n,r=!1){return Iy(n,e.Cc(r?4:3,t))}function Iy(e,t){if(Ry(e=v(e)))return zy(`Unsupported field value:`,t,e),Ly(e,t);if(e instanceof xy)return function(e,t){if(!Dy(t.Ac))throw t.Sc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Sc(`${e._methodName}() is not currently supported inside arrays`);let n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(e===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.fc&&t.Ac!==4)throw t.Sc(`Nested arrays are not supported`);return function(e,t){let n=[],r=0;for(let i of e){let e=Iy(i,t.wc(r));e??={nullValue:`NULL_VALUE`},n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if((e=v(e))===null)return{nullValue:`NULL_VALUE`};if(typeof e==`number`)return vf(t.serializer,e);if(typeof e==`boolean`)return{booleanValue:e};if(typeof e==`string`)return{stringValue:e};if(e instanceof Date){let n=L.fromDate(e);return{timestampValue:xp(t.serializer,n)}}if(e instanceof L){let n=new L(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:xp(t.serializer,n)}}if(e instanceof Sy)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof yy)return{bytesValue:Sp(t.serializer,e._byteString)};if(e instanceof $){let n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.Sc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:wp(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof Cy)return function(e,t){return{mapValue:{fields:{[Au]:{stringValue:Nu},[Pu]:{arrayValue:{values:e.toArray().map((e=>{if(typeof e!=`number`)throw t.Sc(`VectorValues must only contain numeric values.`);return gf(t.serializer,e)}))}}}}}}(e,t);throw t.Sc(`Unsupported field value: ${sc(e)}`)}(e,t)}function Ly(e,t){let n={};return uu(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):lu(e,((e,r)=>{let i=Iy(r,t.mc(e));i!=null&&(n[e]=i)})),{mapValue:{fields:n}}}function Ry(e){return!(typeof e!=`object`||!e||e instanceof Array||e instanceof Date||e instanceof L||e instanceof Sy||e instanceof yy||e instanceof $||e instanceof xy||e instanceof Cy)}function zy(e,t,n){if(!Ry(n)||!oc(n)){let r=sc(n);throw r===`an object`?t.Sc(e+` a custom object`):t.Sc(e+` `+r)}}function By(e,t,n){if((t=v(t))instanceof by)return t._internalPath;if(typeof t==`string`)return Hy(e,t);throw Uy(`Field path arguments must be of type string or `,e,!1,void 0,n)}var Vy=RegExp(`[~\\*/\\[\\]]`);function Hy(e,t,n){if(t.search(Vy)>=0)throw Uy(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new by(...t.split(`.`))._internalPath}catch{throw Uy(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function Uy(e,t,n,r,i){let a=r&&!r.isEmpty(),o=i!==void 0,s=`Function ${t}() called with invalid data`;n&&(s+=" (via `toFirestore()`)"),s+=`. `;let c=``;return(a||o)&&(c+=` (found`,a&&(c+=` in field ${r}`),o&&(c+=` in document ${i}`),c+=`)`),new M(j.INVALID_ARGUMENT,s+e+c)}function Wy(e,t){return e.some((e=>e.isEqual(t)))}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Gy=class{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new $(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new Ky(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let t=this._document.data.field(qy(`DocumentSnapshot.get`,e));if(t!==null)return this._userDataWriter.convertValue(t)}}},Ky=class extends Gy{data(){return super.data()}};function qy(e,t){return typeof t==`string`?Hy(e,t):t instanceof by?t._internalPath:t._delegate._internalPath}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/function Jy(e){if(e.limitType===`L`&&e.explicitOrderBy.length===0)throw new M(j.UNIMPLEMENTED,`limitToLast() queries require specifying at least one orderBy() clause`)}var Yy=class{},Xy=class extends Yy{};function Zy(e,t,...n){let r=[];t instanceof Yy&&r.push(t),r=r.concat(n),function(e){let t=e.filter((e=>e instanceof eb)).length,n=e.filter((e=>e instanceof Qy)).length;if(t>1||t>0&&n>0)throw new M(j.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(let t of r)e=t._apply(e);return e}var Qy=class e extends Xy{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type=`where`}static _create(t,n,r){return new e(t,n,r)}_apply(e){let t=this._parse(e);return ab(e._query,t),new sy(e.firestore,e.converter,Kd(e._query,t))}_parse(e){let t=Ay(e.firestore);return function(e,t,n,r,i,a,o){let s;if(i.isKeyField()){if(a===`array-contains`||a===`array-contains-any`)throw new M(j.INVALID_ARGUMENT,`Invalid Query. You can't perform '${a}' queries on documentId().`);if(a===`in`||a===`not-in`){ib(o,a);let t=[];for(let n of o)t.push(rb(r,e,n));s={arrayValue:{values:t}}}else s=rb(r,e,o)}else a!==`in`&&a!==`not-in`&&a!==`array-contains-any`||ib(o,a),s=Fy(n,t,o,a===`in`||a===`not-in`);return G.create(i,a,s)}(e._query,`where`,t,e.firestore._databaseId,this._field,this._op,this._value)}};function $y(e,t,n){let r=t,i=qy(`where`,e);return Qy._create(i,r,n)}var eb=class e extends Yy{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(t,n){return new e(t,n)}_parse(e){let t=this._queryConstraints.map((t=>t._parse(e))).filter((e=>e.getFilters().length>0));return t.length===1?t[0]:K.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return t.getFilters().length===0?e:(function(e,t){let n=e,r=t.getFlattenedFilters();for(let e of r)ab(n,e),n=Kd(n,e)}(e._query,t),new sy(e.firestore,e.converter,Kd(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type===`and`?`and`:`or`}},tb=class e extends Xy{constructor(e,t){super(),this._field=e,this._direction=t,this.type=`orderBy`}static _create(t,n){return new e(t,n)}_apply(e){let t=function(e,t,n){if(e.startAt!==null)throw new M(j.INVALID_ARGUMENT,`Invalid query. You must not call startAt() or startAfter() before calling orderBy().`);if(e.endAt!==null)throw new M(j.INVALID_ARGUMENT,`Invalid query. You must not call endAt() or endBefore() before calling orderBy().`);return new dd(t,n)}(e._query,this._field,this._direction);return new sy(e.firestore,e.converter,function(e,t){let n=e.explicitOrderBy.concat([t]);return new Rd(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}};function nb(e,t=`asc`){let n=t,r=qy(`orderBy`,e);return tb._create(r,n)}function rb(e,t,n){if(typeof(n=v(n))==`string`){if(n===``)throw new M(j.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.`);if(!Hd(t)&&n.indexOf(`/`)!==-1)throw new M(j.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);let r=t.path.child(P.fromString(n));if(!F.isDocumentKey(r))throw new M(j.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Gu(e,new F(r))}if(n instanceof $)return Gu(e,n._key);throw new M(j.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${sc(n)}.`)}function ib(e,t){if(!Array.isArray(e)||e.length===0)throw new M(j.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function ab(e,t){let n=function(e,t){for(let n of e)for(let e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case`!=`:return[`!=`,`not-in`];case`array-contains-any`:case`in`:return[`not-in`];case`not-in`:return[`array-contains-any`,`in`,`not-in`,`!=`];default:return[]}}(t.op));if(n!==null)throw n===t.op?new M(j.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new M(j.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}var ob=class{convertValue(e,t=`none`){switch(Iu(e)){case 0:return null;case 1:return e.booleanValue;case 2:return W(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(yu(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw O(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t=`none`){let n={};return lu(e,((e,r)=>{n[e]=this.convertValue(r,t)})),n}convertVectorValue(e){let t=e.fields?.[Pu].arrayValue?.values?.map((e=>W(e.doubleValue)));return new Cy(t)}convertGeoPoint(e){return new Sy(W(e.latitude),W(e.longitude))}convertArray(e,t){return(e.values||[]).map((e=>this.convertValue(e,t)))}convertServerTimestamp(e,t){switch(t){case`previous`:let n=Tu(e);return n==null?null:this.convertValue(n,t);case`estimate`:return this.convertTimestamp(Eu(e));default:return null}}convertTimestamp(e){let t=vu(e);return new L(t.seconds,t.nanos)}convertDocumentKey(e,t){let n=P.fromString(e);k(Qp(n),9688,{name:e});let r=new ku(n.get(1),n.get(3)),i=new F(n.popFirst(5));return r.isEqual(t)||D(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}};
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function sb(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}var cb=class extends ob{constructor(e){super(),this.firestore=e}convertBytes(e){return new yy(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new $(this.firestore,null,t)}},lb=class{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}},ub=class e extends Gy{constructor(e,t,n,r,i,a){super(e,t,n,r,a),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new db(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let n=this._document.data.field(qy(`DocumentSnapshot.get`,e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new M(j.FAILED_PRECONDITION,`DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().`);let t=this._document,n={};return n.type=e._jsonSchemaVersion,n.bundle=``,n.bundleSource=`DocumentSnapshot`,n.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,`previous`),n.bundle=(this._firestore,this.ref.path,`NOT SUPPORTED`),n)}};ub._jsonSchemaVersion=`firestore/documentSnapshot/1.0`,ub._jsonSchema={type:I(`string`,ub._jsonSchemaVersion),bundleSource:I(`string`,`DocumentSnapshot`),bundleName:I(`string`),bundle:I(`string`)};var db=class extends ub{data(e={}){return super.data(e)}},fb=class e{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new lb(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){let e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new db(this._firestore,this._userDataWriter,n.key,n,new lb(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new M(j.INVALID_ARGUMENT,`To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().`);return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map((n=>{let r=new db(e._firestore,e._userDataWriter,n.doc.key,n.doc,new lb(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:`added`,doc:r,oldIndex:-1,newIndex:t++}}))}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter((e=>t||e.type!==3)).map((t=>{let r=new db(e._firestore,e._userDataWriter,t.doc.key,t.doc,new lb(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter),i=-1,a=-1;return t.type!==0&&(i=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),t.type!==1&&(n=n.add(t.doc),a=n.indexOf(t.doc.key)),{type:pb(t.type),doc:r,oldIndex:i,newIndex:a}}))}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new M(j.FAILED_PRECONDITION,`QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().`);let t={};t.type=e._jsonSchemaVersion,t.bundleSource=`QuerySnapshot`,t.bundleName=Gs.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;let n=[],r=[],i=[];return this.docs.forEach((e=>{e._document!==null&&(n.push(e._document),r.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields,`previous`)),i.push(e.ref.path))})),t.bundle=(this._firestore,this.query._query,t.bundleName,`NOT SUPPORTED`),t}};function pb(e){switch(e){case 0:return`added`;case 2:case 3:return`modified`;case 1:return`removed`;default:return O(61501,{type:e})}}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function mb(e){e=cc(e,$);let t=cc(e.firestore,hy);return $v(_y(t),e._key).then((n=>Cb(t,e,n)))}fb._jsonSchemaVersion=`firestore/querySnapshot/1.0`,fb._jsonSchema={type:I(`string`,fb._jsonSchemaVersion),bundleSource:I(`string`,`QuerySnapshot`),bundleName:I(`string`),bundle:I(`string`)};var hb=class extends ob{constructor(e){super(),this.firestore=e}convertBytes(e){return new yy(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new $(this.firestore,null,t)}};function gb(e){e=cc(e,sy);let t=cc(e.firestore,hy),n=_y(t),r=new hb(t);return Jy(e._query),ey(n,e._query).then((n=>new fb(t,r,e,n)))}function _b(e,t,n){e=cc(e,$);let r=cc(e.firestore,hy),i=sb(e.converter,t,n);return Sb(r,[jy(Ay(r),`setDoc`,e._key,i,e.converter!==null,n).toMutation(e._key,J.none())])}function vb(e,t,n,...r){e=cc(e,$);let i=cc(e.firestore,hy),a=Ay(i),o;return o=typeof(t=v(t))==`string`||t instanceof by?Py(a,`updateDoc`,e._key,t,n,r):Ny(a,`updateDoc`,e._key,t),Sb(i,[o.toMutation(e._key,J.exists(!0))])}function yb(e){return Sb(cc(e.firestore,hy),[new Kf(e._key,J.none())])}function bb(e,t){let n=cc(e.firestore,hy),r=uy(e),i=sb(e.converter,t);return Sb(n,[jy(Ay(e.firestore),`addDoc`,r._key,i,e.converter!==null,{}).toMutation(r._key,J.exists(!1))]).then((()=>r))}function xb(e,...t){e=v(e);let n={includeMetadataChanges:!1,source:`default`},r=0;typeof t[r]!=`object`||my(t[r])||(n=t[r++]);let i={includeMetadataChanges:n.includeMetadataChanges,source:n.source};if(my(t[r])){let e=t[r];t[r]=e.next?.bind(e),t[r+1]=e.error?.bind(e),t[r+2]=e.complete?.bind(e)}let a,o,s;if(e instanceof $)o=cc(e.firestore,hy),s=Bd(e._key.path),a={next:n=>{t[r]&&t[r](Cb(o,e,n))},error:t[r+1],complete:t[r+2]};else{let n=cc(e,sy);o=cc(n.firestore,hy),s=n._query;let i=new hb(o);a={next:e=>{t[r]&&t[r](new fb(o,i,n,e))},error:t[r+1],complete:t[r+2]},Jy(e._query)}return function(e,t,n,r){let i=new Vv(r),a=new Y_(t,i,n);return e.asyncQueue.enqueueAndForget((async()=>H_(await Qv(e),a))),()=>{i.Nu(),e.asyncQueue.enqueueAndForget((async()=>U_(await Qv(e),a)))}}(_y(o),s,i,a)}function Sb(e,t){return function(e,t){let n=new Is;return e.asyncQueue.enqueueAndForget((async()=>lv(await Xv(e),t,n))),n.promise}(_y(e),t)}function Cb(e,t,n){let r=n.docs.get(t._key),i=new hb(e);return new ub(e,i,t._key,r,new lb(n.hasPendingWrites,n.fromCache),t.converter)}var wb=class{constructor(e){let t;this.kind=`persistent`,e?.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=Ob(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}};function Tb(e){return new wb(e)}var Eb=class{constructor(e){this.forceOwnership=e,this.kind=`persistentSingleTab`}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Bv.provider,this._offlineComponentProvider={build:t=>new Rv(t,e?.cacheSizeBytes,this.forceOwnership)}}},Db=class{constructor(){this.kind=`PersistentMultipleTab`}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Bv.provider,this._offlineComponentProvider={build:t=>new zv(t,e?.cacheSizeBytes)}}};function Ob(e){return new Eb(e?.forceOwnership)}function kb(){return new Db}
/**
* @license
* Copyright 2022 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/var Ab={maxAttempts:5},jb=class{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Ay(e)}set(e,t,n){this._verifyNotCommitted();let r=Mb(e,this._firestore),i=sb(r.converter,t,n),a=jy(this._dataReader,`WriteBatch.set`,r._key,i,r.converter!==null,n);return this._mutations.push(a.toMutation(r._key,J.none())),this}update(e,t,n,...r){this._verifyNotCommitted();let i=Mb(e,this._firestore),a;return a=typeof(t=v(t))==`string`||t instanceof by?Py(this._dataReader,`WriteBatch.update`,i._key,t,n,r):Ny(this._dataReader,`WriteBatch.update`,i._key,t),this._mutations.push(a.toMutation(i._key,J.exists(!0))),this}delete(e){this._verifyNotCommitted();let t=Mb(e,this._firestore);return this._mutations=this._mutations.concat(new Kf(t._key,J.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new M(j.FAILED_PRECONDITION,`A write batch can no longer be used after commit() has been called.`)}};function Mb(e,t){if((e=v(e)).firestore!==t)throw new M(j.INVALID_ARGUMENT,`Provided document reference is from a different Firestore instance.`);return e}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var Nb=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Ay(e)}get(e){let t=Mb(e,this._firestore),n=new cb(this._firestore);return this._transaction.lookup([t._key]).then((e=>{if(!e||e.length!==1)return O(24041);let r=e[0];if(r.isFoundDocument())return new Gy(this._firestore,n,r.key,r,t.converter);if(r.isNoDocument())return new Gy(this._firestore,n,t._key,null,t.converter);throw O(18433,{doc:r})}))}set(e,t,n){let r=Mb(e,this._firestore),i=sb(r.converter,t,n),a=jy(this._dataReader,`Transaction.set`,r._key,i,r.converter!==null,n);return this._transaction.set(r._key,a),this}update(e,t,n,...r){let i=Mb(e,this._firestore),a;return a=typeof(t=v(t))==`string`||t instanceof by?Py(this._dataReader,`Transaction.update`,i._key,t,n,r):Ny(this._dataReader,`Transaction.update`,i._key,t),this._transaction.update(i._key,a),this}delete(e){let t=Mb(e,this._firestore);return this._transaction.delete(t._key),this}},Pb=class extends Nb{constructor(e,t){super(e,t),this._firestore=e}get(e){let t=Mb(e,this._firestore),n=new hb(this._firestore);return super.get(e).then((e=>new ub(this._firestore,n,t._key,e._document,new lb(!1,!1),t.converter)))}};function Fb(e,t,n){e=cc(e,hy);let r={...Ab,...n};return(function(e){if(e.maxAttempts<1)throw new M(j.INVALID_ARGUMENT,`Max attempts must be at least 1`)})(r),function(e,t,n){let r=new Is;return e.asyncQueue.enqueueAndForget((async()=>{let i=await Zv(e);new Uv(e.asyncQueue,i,n,t,r).ju()})),r.promise}(_y(e),(n=>t(new Pb(e,n))),r)}
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function Ib(e){return _y(e=cc(e,hy)),new jb(e,(t=>Sb(e,t)))}(function(e,t=!0){(function(e){As=e})(en),Yt(new Me(`firestore`,((e,{instanceIdentifier:n,options:r})=>{let i=e.getProvider(`app`).getImmediate(),a=new hy(new zs(e.getProvider(`auth-internal`)),new Us(i,e.getProvider(`app-check-internal`)),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,[`projectId`]))throw new M(j.INVALID_ARGUMENT,`"projectId" not provided in firebase.initializeApp.`);return new ku(e.options.projectId,t)}(i,n),i);return r={useFetchStreams:t,...r},a._setSettings(r),a}),`PUBLIC`).setMultipleInstances(!0)),rn(Ds,Os,e),rn(Ds,Os,`esm2020`)})();export{$i as C,Yi as S,$y as _,uy as a,ds as b,gy as c,Tb as d,kb as f,vb as g,_b as h,yb as i,xb as l,Fb as m,bb as n,mb as o,Zy as p,ly as r,gb as s,L as t,nb as u,Ib as v,tn as w,Qi as x,Ji as y};