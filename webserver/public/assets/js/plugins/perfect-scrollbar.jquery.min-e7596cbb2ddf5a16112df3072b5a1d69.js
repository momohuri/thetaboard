/*!
 * perfect-scrollbar v1.4.0
 * (c) 2018 Hyunje Jun
 * @license MIT
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.PerfectScrollbar=e()}(this,(function(){"use strict"
function t(t){return getComputedStyle(t)}function e(t,e){for(var i in e){var r=e[i]
"number"==typeof r&&(r+="px"),t.style[i]=r}return t}function i(t){var e=document.createElement("div")
return e.className=t,e}function r(t,e){if(!b)throw new Error("No element matching method supported")
return b.call(t,e)}function l(t){t.remove?t.remove():t.parentNode&&t.parentNode.removeChild(t)}function n(t,e){return Array.prototype.filter.call(t.children,(function(t){return r(t,e)}))}function o(t,e){var i=t.element.classList,r=g.state.scrolling(e)
i.contains(r)?clearTimeout(v[e]):i.add(r)}function s(t,e){v[e]=setTimeout((function(){return t.isAlive&&t.element.classList.remove(g.state.scrolling(e))}),t.settings.scrollingThreshold)}function a(t,e){o(t,e),s(t,e)}function c(t){if("function"==typeof window.CustomEvent)return new CustomEvent(t)
var e=document.createEvent("CustomEvent")
return e.initCustomEvent(t,!1,!1,void 0),e}function h(t){return parseInt(t,10)||0}function u(t){return r(t,"input,[contenteditable]")||r(t,"select,[contenteditable]")||r(t,"textarea,[contenteditable]")||r(t,"button,[contenteditable]")}function d(t,e){return t.settings.minScrollbarLength&&(e=Math.max(e,t.settings.minScrollbarLength)),t.settings.maxScrollbarLength&&(e=Math.min(e,t.settings.maxScrollbarLength)),e}function f(t,i){var r={width:i.railXWidth},l=Math.floor(t.scrollTop)
i.isRtl?r.left=i.negativeScrollAdjustment+t.scrollLeft+i.containerWidth-i.contentWidth:r.left=t.scrollLeft,i.isScrollbarXUsingBottom?r.bottom=i.scrollbarXBottom-l:r.top=i.scrollbarXTop+l,e(i.scrollbarXRail,r)
var n={top:l,height:i.railYHeight}
i.isScrollbarYUsingRight?i.isRtl?n.right=i.contentWidth-(i.negativeScrollAdjustment+t.scrollLeft)-i.scrollbarYRight-i.scrollbarYOuterWidth:n.right=i.scrollbarYRight-t.scrollLeft:i.isRtl?n.left=i.negativeScrollAdjustment+t.scrollLeft+2*i.containerWidth-i.contentWidth-i.scrollbarYLeft-i.scrollbarYOuterWidth:n.left=i.scrollbarYLeft+t.scrollLeft,e(i.scrollbarYRail,n),e(i.scrollbarX,{left:i.scrollbarXLeft,width:i.scrollbarXWidth-i.railBorderXWidth}),e(i.scrollbarY,{top:i.scrollbarYTop,height:i.scrollbarYHeight-i.railBorderYWidth})}function p(t,e){function i(e){b[d]=v+Y*(e[a]-m),o(t,f),W(t),e.stopPropagation(),e.preventDefault()}function r(){s(t,f),t[p].classList.remove(g.state.clicking),t.event.unbind(t.ownerDocument,"mousemove",i)}var l=e[0],n=e[1],a=e[2],c=e[3],h=e[4],u=e[5],d=e[6],f=e[7],p=e[8],b=t.element,v=null,m=null,Y=null
t.event.bind(t[h],"mousedown",(function(e){v=b[d],m=e[a],Y=(t[n]-t[l])/(t[c]-t[u]),t.event.bind(t.ownerDocument,"mousemove",i),t.event.once(t.ownerDocument,"mouseup",r),t[p].classList.add(g.state.clicking),e.stopPropagation(),e.preventDefault()}))}var b="undefined"!=typeof Element&&(Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector),g={main:"ps",element:{thumb:function(t){return"ps__thumb-"+t},rail:function(t){return"ps__rail-"+t},consuming:"ps__child--consume"},state:{focus:"ps--focus",clicking:"ps--clicking",active:function(t){return"ps--active-"+t},scrolling:function(t){return"ps--scrolling-"+t}}},v={x:null,y:null},m=function(t){this.element=t,this.handlers={}},Y={isEmpty:{configurable:!0}}
m.prototype.bind=function(t,e){void 0===this.handlers[t]&&(this.handlers[t]=[]),this.handlers[t].push(e),this.element.addEventListener(t,e,!1)},m.prototype.unbind=function(t,e){var i=this
this.handlers[t]=this.handlers[t].filter((function(r){return!(!e||r===e)||(i.element.removeEventListener(t,r,!1),!1)}))},m.prototype.unbindAll=function(){for(var t in this.handlers)this.unbind(t)},Y.isEmpty.get=function(){var t=this
return Object.keys(this.handlers).every((function(e){return 0===t.handlers[e].length}))},Object.defineProperties(m.prototype,Y)
var X=function(){this.eventElements=[]}
X.prototype.eventElement=function(t){var e=this.eventElements.filter((function(e){return e.element===t}))[0]
return e||(e=new m(t),this.eventElements.push(e)),e},X.prototype.bind=function(t,e,i){this.eventElement(t).bind(e,i)},X.prototype.unbind=function(t,e,i){var r=this.eventElement(t)
r.unbind(e,i),r.isEmpty&&this.eventElements.splice(this.eventElements.indexOf(r),1)},X.prototype.unbindAll=function(){this.eventElements.forEach((function(t){return t.unbindAll()})),this.eventElements=[]},X.prototype.once=function(t,e,i){var r=this.eventElement(t),l=function(t){r.unbind(e,l),i(t)}
r.bind(e,l)}
var w=function(t,e,i,r,l){var n
if(void 0===r&&(r=!0),void 0===l&&(l=!1),"top"===e)n=["contentHeight","containerHeight","scrollTop","y","up","down"]
else{if("left"!==e)throw new Error("A proper axis should be provided")
n=["contentWidth","containerWidth","scrollLeft","x","left","right"]}(function(t,e,i,r,l){var n=i[0],o=i[1],s=i[2],h=i[3],u=i[4],d=i[5]
void 0===r&&(r=!0),void 0===l&&(l=!1)
var f=t.element
t.reach[h]=null,f[s]<1&&(t.reach[h]="start"),f[s]>t[n]-t[o]-1&&(t.reach[h]="end"),e&&(f.dispatchEvent(c("ps-scroll-"+h)),e<0?f.dispatchEvent(c("ps-scroll-"+u)):e>0&&f.dispatchEvent(c("ps-scroll-"+d)),r&&a(t,h)),t.reach[h]&&(e||l)&&f.dispatchEvent(c("ps-"+h+"-reach-"+t.reach[h]))})(t,i,n,r,l)},y={isWebKit:"undefined"!=typeof document&&"WebkitAppearance"in document.documentElement.style,supportsTouch:"undefined"!=typeof window&&("ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch),supportsIePointer:"undefined"!=typeof navigator&&navigator.msMaxTouchPoints,isChrome:"undefined"!=typeof navigator&&/Chrome/i.test(navigator&&navigator.userAgent)},W=function(t){var e=t.element,i=Math.floor(e.scrollTop)
t.containerWidth=e.clientWidth,t.containerHeight=e.clientHeight,t.contentWidth=e.scrollWidth,t.contentHeight=e.scrollHeight,e.contains(t.scrollbarXRail)||(n(e,g.element.rail("x")).forEach((function(t){return l(t)})),e.appendChild(t.scrollbarXRail)),e.contains(t.scrollbarYRail)||(n(e,g.element.rail("y")).forEach((function(t){return l(t)})),e.appendChild(t.scrollbarYRail)),!t.settings.suppressScrollX&&t.containerWidth+t.settings.scrollXMarginOffset<t.contentWidth?(t.scrollbarXActive=!0,t.railXWidth=t.containerWidth-t.railXMarginWidth,t.railXRatio=t.containerWidth/t.railXWidth,t.scrollbarXWidth=d(t,h(t.railXWidth*t.containerWidth/t.contentWidth)),t.scrollbarXLeft=h((t.negativeScrollAdjustment+e.scrollLeft)*(t.railXWidth-t.scrollbarXWidth)/(t.contentWidth-t.containerWidth))):t.scrollbarXActive=!1,!t.settings.suppressScrollY&&t.containerHeight+t.settings.scrollYMarginOffset<t.contentHeight?(t.scrollbarYActive=!0,t.railYHeight=t.containerHeight-t.railYMarginHeight,t.railYRatio=t.containerHeight/t.railYHeight,t.scrollbarYHeight=d(t,h(t.railYHeight*t.containerHeight/t.contentHeight)),t.scrollbarYTop=h(i*(t.railYHeight-t.scrollbarYHeight)/(t.contentHeight-t.containerHeight))):t.scrollbarYActive=!1,t.scrollbarXLeft>=t.railXWidth-t.scrollbarXWidth&&(t.scrollbarXLeft=t.railXWidth-t.scrollbarXWidth),t.scrollbarYTop>=t.railYHeight-t.scrollbarYHeight&&(t.scrollbarYTop=t.railYHeight-t.scrollbarYHeight),f(e,t),t.scrollbarXActive?e.classList.add(g.state.active("x")):(e.classList.remove(g.state.active("x")),t.scrollbarXWidth=0,t.scrollbarXLeft=0,e.scrollLeft=0),t.scrollbarYActive?e.classList.add(g.state.active("y")):(e.classList.remove(g.state.active("y")),t.scrollbarYHeight=0,t.scrollbarYTop=0,e.scrollTop=0)},L={"click-rail":function(t){t.event.bind(t.scrollbarY,"mousedown",(function(t){return t.stopPropagation()})),t.event.bind(t.scrollbarYRail,"mousedown",(function(e){var i=e.pageY-window.pageYOffset-t.scrollbarYRail.getBoundingClientRect().top>t.scrollbarYTop?1:-1
t.element.scrollTop+=i*t.containerHeight,W(t),e.stopPropagation()})),t.event.bind(t.scrollbarX,"mousedown",(function(t){return t.stopPropagation()})),t.event.bind(t.scrollbarXRail,"mousedown",(function(e){var i=e.pageX-window.pageXOffset-t.scrollbarXRail.getBoundingClientRect().left>t.scrollbarXLeft?1:-1
t.element.scrollLeft+=i*t.containerWidth,W(t),e.stopPropagation()}))},"drag-thumb":function(t){p(t,["containerWidth","contentWidth","pageX","railXWidth","scrollbarX","scrollbarXWidth","scrollLeft","x","scrollbarXRail"]),p(t,["containerHeight","contentHeight","pageY","railYHeight","scrollbarY","scrollbarYHeight","scrollTop","y","scrollbarYRail"])},keyboard:function(t){var e=t.element,i=function(){return r(e,":hover")},l=function(){return r(t.scrollbarX,":focus")||r(t.scrollbarY,":focus")}
t.event.bind(t.ownerDocument,"keydown",(function(r){if(!(r.isDefaultPrevented&&r.isDefaultPrevented()||r.defaultPrevented)&&(i()||l())){var n=document.activeElement?document.activeElement:t.ownerDocument.activeElement
if(n){if("IFRAME"===n.tagName)n=n.contentDocument.activeElement
else for(;n.shadowRoot;)n=n.shadowRoot.activeElement
if(u(n))return}var o=0,s=0
switch(r.which){case 37:o=r.metaKey?-t.contentWidth:r.altKey?-t.containerWidth:-30
break
case 38:s=r.metaKey?t.contentHeight:r.altKey?t.containerHeight:30
break
case 39:o=r.metaKey?t.contentWidth:r.altKey?t.containerWidth:30
break
case 40:s=r.metaKey?-t.contentHeight:r.altKey?-t.containerHeight:-30
break
case 32:s=r.shiftKey?t.containerHeight:-t.containerHeight
break
case 33:s=t.containerHeight
break
case 34:s=-t.containerHeight
break
case 36:s=t.contentHeight
break
case 35:s=-t.contentHeight
break
default:return}t.settings.suppressScrollX&&0!==o||t.settings.suppressScrollY&&0!==s||(e.scrollTop-=s,e.scrollLeft+=o,W(t),function(i,r){var l=Math.floor(e.scrollTop)
if(0===i){if(!t.scrollbarYActive)return!1
if(0===l&&r>0||l>=t.contentHeight-t.containerHeight&&r<0)return!t.settings.wheelPropagation}var n=e.scrollLeft
if(0===r){if(!t.scrollbarXActive)return!1
if(0===n&&i<0||n>=t.contentWidth-t.containerWidth&&i>0)return!t.settings.wheelPropagation}return!0}(o,s)&&r.preventDefault())}}))},wheel:function(e){function i(e,i,r){if(!y.isWebKit&&l.querySelector("select:focus"))return!0
if(!l.contains(e))return!1
for(var n=e;n&&n!==l;){if(n.classList.contains(g.element.consuming))return!0
var o=t(n)
if([o.overflow,o.overflowX,o.overflowY].join("").match(/(scroll|auto)/)){var s=n.scrollHeight-n.clientHeight
if(s>0&&!(0===n.scrollTop&&r>0||n.scrollTop===s&&r<0))return!0
var a=n.scrollWidth-n.clientWidth
if(a>0&&!(0===n.scrollLeft&&i<0||n.scrollLeft===a&&i>0))return!0}n=n.parentNode}return!1}function r(t){var r=function(t){var e=t.deltaX,i=-1*t.deltaY
return void 0!==e&&void 0!==i||(e=-1*t.wheelDeltaX/6,i=t.wheelDeltaY/6),t.deltaMode&&1===t.deltaMode&&(e*=10,i*=10),e!=e&&i!=i&&(e=0,i=t.wheelDelta),t.shiftKey?[-i,-e]:[e,i]}(t),n=r[0],o=r[1]
if(!i(t.target,n,o)){var s=!1
e.settings.useBothWheelAxes?e.scrollbarYActive&&!e.scrollbarXActive?(o?l.scrollTop-=o*e.settings.wheelSpeed:l.scrollTop+=n*e.settings.wheelSpeed,s=!0):e.scrollbarXActive&&!e.scrollbarYActive&&(n?l.scrollLeft+=n*e.settings.wheelSpeed:l.scrollLeft-=o*e.settings.wheelSpeed,s=!0):(l.scrollTop-=o*e.settings.wheelSpeed,l.scrollLeft+=n*e.settings.wheelSpeed),W(e),(s=s||function(t,i){var r=Math.floor(l.scrollTop),n=0===l.scrollTop,o=r+l.offsetHeight===l.scrollHeight,s=0===l.scrollLeft,a=l.scrollLeft+l.offsetWidth===l.scrollWidth
return!(Math.abs(i)>Math.abs(t)?n||o:s||a)||!e.settings.wheelPropagation}(n,o))&&!t.ctrlKey&&(t.stopPropagation(),t.preventDefault())}}var l=e.element
void 0!==window.onwheel?e.event.bind(l,"wheel",r):void 0!==window.onmousewheel&&e.event.bind(l,"mousewheel",r)},touch:function(e){function i(t,i){var r=Math.floor(h.scrollTop),l=h.scrollLeft,n=Math.abs(t),o=Math.abs(i)
if(o>n){if(i<0&&r===e.contentHeight-e.containerHeight||i>0&&0===r)return 0===window.scrollY&&i>0&&y.isChrome}else if(n>o&&(t<0&&l===e.contentWidth-e.containerWidth||t>0&&0===l))return!0
return!0}function r(t,i){h.scrollTop-=i,h.scrollLeft-=t,W(e)}function l(t){return t.targetTouches?t.targetTouches[0]:t}function n(t){return!(t.pointerType&&"pen"===t.pointerType&&0===t.buttons||(!t.targetTouches||1!==t.targetTouches.length)&&(!t.pointerType||"mouse"===t.pointerType||t.pointerType===t.MSPOINTER_TYPE_MOUSE))}function o(t){if(n(t)){var e=l(t)
u.pageX=e.pageX,u.pageY=e.pageY,d=(new Date).getTime(),null!==p&&clearInterval(p)}}function s(e,i,r){if(!h.contains(e))return!1
for(var l=e;l&&l!==h;){if(l.classList.contains(g.element.consuming))return!0
var n=t(l)
if([n.overflow,n.overflowX,n.overflowY].join("").match(/(scroll|auto)/)){var o=l.scrollHeight-l.clientHeight
if(o>0&&!(0===l.scrollTop&&r>0||l.scrollTop===o&&r<0))return!0
var s=l.scrollLeft-l.clientWidth
if(s>0&&!(0===l.scrollLeft&&i<0||l.scrollLeft===s&&i>0))return!0}l=l.parentNode}return!1}function a(t){if(n(t)){var e=l(t),o={pageX:e.pageX,pageY:e.pageY},a=o.pageX-u.pageX,c=o.pageY-u.pageY
if(s(t.target,a,c))return
r(a,c),u=o
var h=(new Date).getTime(),p=h-d
p>0&&(f.x=a/p,f.y=c/p,d=h),i(a,c)&&t.preventDefault()}}function c(){e.settings.swipeEasing&&(clearInterval(p),p=setInterval((function(){e.isInitialized?clearInterval(p):f.x||f.y?Math.abs(f.x)<.01&&Math.abs(f.y)<.01?clearInterval(p):(r(30*f.x,30*f.y),f.x*=.8,f.y*=.8):clearInterval(p)}),10))}if(y.supportsTouch||y.supportsIePointer){var h=e.element,u={},d=0,f={},p=null
y.supportsTouch?(e.event.bind(h,"touchstart",o),e.event.bind(h,"touchmove",a),e.event.bind(h,"touchend",c)):y.supportsIePointer&&(window.PointerEvent?(e.event.bind(h,"pointerdown",o),e.event.bind(h,"pointermove",a),e.event.bind(h,"pointerup",c)):window.MSPointerEvent&&(e.event.bind(h,"MSPointerDown",o),e.event.bind(h,"MSPointerMove",a),e.event.bind(h,"MSPointerUp",c)))}}},R=function(r,l){var n=this
if(void 0===l&&(l={}),"string"==typeof r&&(r=document.querySelector(r)),!r||!r.nodeName)throw new Error("no element is specified to initialize PerfectScrollbar")
for(var o in this.element=r,r.classList.add(g.main),this.settings={handlers:["click-rail","drag-thumb","keyboard","wheel","touch"],maxScrollbarLength:null,minScrollbarLength:null,scrollingThreshold:1e3,scrollXMarginOffset:0,scrollYMarginOffset:0,suppressScrollX:!1,suppressScrollY:!1,swipeEasing:!0,useBothWheelAxes:!1,wheelPropagation:!0,wheelSpeed:1},l)n.settings[o]=l[o]
this.containerWidth=null,this.containerHeight=null,this.contentWidth=null,this.contentHeight=null
var s=function(){return r.classList.add(g.state.focus)},a=function(){return r.classList.remove(g.state.focus)}
this.isRtl="rtl"===t(r).direction,this.isNegativeScroll=function(){var t,e=r.scrollLeft
return r.scrollLeft=-1,t=r.scrollLeft<0,r.scrollLeft=e,t}(),this.negativeScrollAdjustment=this.isNegativeScroll?r.scrollWidth-r.clientWidth:0,this.event=new X,this.ownerDocument=r.ownerDocument||document,this.scrollbarXRail=i(g.element.rail("x")),r.appendChild(this.scrollbarXRail),this.scrollbarX=i(g.element.thumb("x")),this.scrollbarXRail.appendChild(this.scrollbarX),this.scrollbarX.setAttribute("tabindex",0),this.event.bind(this.scrollbarX,"focus",s),this.event.bind(this.scrollbarX,"blur",a),this.scrollbarXActive=null,this.scrollbarXWidth=null,this.scrollbarXLeft=null
var c=t(this.scrollbarXRail)
this.scrollbarXBottom=parseInt(c.bottom,10),isNaN(this.scrollbarXBottom)?(this.isScrollbarXUsingBottom=!1,this.scrollbarXTop=h(c.top)):this.isScrollbarXUsingBottom=!0,this.railBorderXWidth=h(c.borderLeftWidth)+h(c.borderRightWidth),e(this.scrollbarXRail,{display:"block"}),this.railXMarginWidth=h(c.marginLeft)+h(c.marginRight),e(this.scrollbarXRail,{display:""}),this.railXWidth=null,this.railXRatio=null,this.scrollbarYRail=i(g.element.rail("y")),r.appendChild(this.scrollbarYRail),this.scrollbarY=i(g.element.thumb("y")),this.scrollbarYRail.appendChild(this.scrollbarY),this.scrollbarY.setAttribute("tabindex",0),this.event.bind(this.scrollbarY,"focus",s),this.event.bind(this.scrollbarY,"blur",a),this.scrollbarYActive=null,this.scrollbarYHeight=null,this.scrollbarYTop=null
var u=t(this.scrollbarYRail)
this.scrollbarYRight=parseInt(u.right,10),isNaN(this.scrollbarYRight)?(this.isScrollbarYUsingRight=!1,this.scrollbarYLeft=h(u.left)):this.isScrollbarYUsingRight=!0,this.scrollbarYOuterWidth=this.isRtl?function(e){var i=t(e)
return h(i.width)+h(i.paddingLeft)+h(i.paddingRight)+h(i.borderLeftWidth)+h(i.borderRightWidth)}(this.scrollbarY):null,this.railBorderYWidth=h(u.borderTopWidth)+h(u.borderBottomWidth),e(this.scrollbarYRail,{display:"block"}),this.railYMarginHeight=h(u.marginTop)+h(u.marginBottom),e(this.scrollbarYRail,{display:""}),this.railYHeight=null,this.railYRatio=null,this.reach={x:r.scrollLeft<=0?"start":r.scrollLeft>=this.contentWidth-this.containerWidth?"end":null,y:r.scrollTop<=0?"start":r.scrollTop>=this.contentHeight-this.containerHeight?"end":null},this.isAlive=!0,this.settings.handlers.forEach((function(t){return L[t](n)})),this.lastScrollTop=Math.floor(r.scrollTop),this.lastScrollLeft=r.scrollLeft,this.event.bind(this.element,"scroll",(function(t){return n.onScroll(t)})),W(this)}
return R.prototype.update=function(){this.isAlive&&(this.negativeScrollAdjustment=this.isNegativeScroll?this.element.scrollWidth-this.element.clientWidth:0,e(this.scrollbarXRail,{display:"block"}),e(this.scrollbarYRail,{display:"block"}),this.railXMarginWidth=h(t(this.scrollbarXRail).marginLeft)+h(t(this.scrollbarXRail).marginRight),this.railYMarginHeight=h(t(this.scrollbarYRail).marginTop)+h(t(this.scrollbarYRail).marginBottom),e(this.scrollbarXRail,{display:"none"}),e(this.scrollbarYRail,{display:"none"}),W(this),w(this,"top",0,!1,!0),w(this,"left",0,!1,!0),e(this.scrollbarXRail,{display:""}),e(this.scrollbarYRail,{display:""}))},R.prototype.onScroll=function(t){this.isAlive&&(W(this),w(this,"top",this.element.scrollTop-this.lastScrollTop),w(this,"left",this.element.scrollLeft-this.lastScrollLeft),this.lastScrollTop=Math.floor(this.element.scrollTop),this.lastScrollLeft=this.element.scrollLeft)},R.prototype.destroy=function(){this.isAlive&&(this.event.unbindAll(),l(this.scrollbarX),l(this.scrollbarY),l(this.scrollbarXRail),l(this.scrollbarYRail),this.removePsClasses(),this.element=null,this.scrollbarX=null,this.scrollbarY=null,this.scrollbarXRail=null,this.scrollbarYRail=null,this.isAlive=!1)},R.prototype.removePsClasses=function(){this.element.className=this.element.className.split(" ").filter((function(t){return!t.match(/^ps([-_].+|)$/)})).join(" ")},R}))
