/*
 * The JAV v1.2(Javascript fro 4A Volcano Development Framework) module contains the components required for building the jav seed file.
 * 风林火山前端开发框架种子文件
 * 所有项目的前端js都是有此开发框架扩展开来的
 * Copyright 2011, 深圳市风林火山电脑技术有限公司
 * 
 * 
 * ========================================更新日志=================================
 * =   （2012-04-17）:dom加入判断是否可视的方法visible，判断dom对象是否是可视
 * 
 */
(function(Host,J){
    var $Fn = function(){},     //定义框架的方法类，框架所提供的一系列工具和方法都是有这个类进行扩张，框架的核心
    defaultView = document.defaultView,
    getComputedStyle = window.getComputedStyle,
    cssNumber = {
        'column-count': 1,
        'columns': 1,
        'font-weight': 1,
        'line-height': 1,
        'opacity': 1,
        'z-index': 1,
        'zoom': 1
    },
    reReady = /complete|loaded|interactive/,
    _slice = Array.prototype.slice,
    POW = Math.pow,
    BOUND = 1.70158,
    PI = Math.PI;
    String.prototype.trim = function(){
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    String.prototype.strlen = function(){
        var Charset = "utf-8";
        if(Charset.toLowerCase() == 'utf-8'){
            return this.replace(/[\u4e00-\u9fa5]/g, "**").length;
        } else {
            return this.replace(/[^\x00-\xff]/g, "**").length;
        }
    }
    /**
     * 判断是否为函数
     * @param o {Object} 要判断的对象
     */
    function _isF(o){
        return ({}).toString.call(o) == "[object Function]"
    }
    /**
     * 判断是否为对象
     * @param o {Object} 要判断的对象
     */
    function _isO(o){
        return typeof o=='object';
    }
    /**
     * 判断一个对象是否是数组
     * @param o {Object} 要判断的对象
     * @return {Boolean} 是否是一个数组
     */
    function _isA(o){
        return Object.prototype.toString.apply(o) === '[object Array]';
    }
    /**
     * 将css属性转化为dhtml,如fontSize转为font-size
     * @param v {String} 要转化的字符串
     */
    function _gDhtml(v){
        return v.replace(/[A-Z]/g, function(match){
            return '-' + match.toLowerCase();
        });
    }
    /**
     * 设置样式，暂不支持设置透明度属性
     * @param el {Object} 要设置的dom对象
     * @param property {Object} 样式属性，可以为字符串和object
     * @param value {Object} 样式属性值
     */
    function _setCss(el, property, value){
        var _setStyle = function(elem,na,va){
            (typeof va == "number" && !cssNumber[_gDhtml(na)]) ? va + "px" : va;
            elem.style[na] = va;
        }
        var _setCssText = function(elem,va){
            elem.style.cssText = va;
        }
        if (_isO(property)){
            var _cssText = [];
            $Fn.Object.each(property,function(key,v){
                _cssText.push(_gDhtml(key) + ':' + v + ';');
            });
            _setCssText(el,_cssText.join(''));
        } else {
            _setStyle(el,property,value);
        }
    }
    function _mix(target,src){
        for (var it in src) {
            target[it] = src[it];
        }
        return target;
    }
    function _prop(obj,name, value) {
        if (typeof(value) == 'undefined') {
            return obj[0][name];
        } else {
            obj.each(function(el) {
                el[0][name] = value;
            });
            return obj;
        }
    }
    /**
     * 获取相关节点，如下一个、上一个、父级节点
     */
    function _relatedNode(el,relate){
        var _el = el[relate];
        while(_el.nodeType!=1){
            _el = _el[relate];
        }
        return (_el) ? $Fn.Dom(_el) : null;
    }
    /**
     * 设置或者获取对象的宽高
     * @param {Object} el
     * @param {Object} value
     */
    function _gsWH(el,attr,value){
        var _dimension = attr.replace(/./, function(m){
                return m.toUpperCase()
        });
        if (typeof(value) == "undefined")
        return (typeof(value) == "undefined") ? (el[0]["offset" + _dimension] || (el[0].style[attr] ? parseInt(el[0].style[attr].replace("px", "")) : 0)):(el.css(attr, value + "px"));
    }
    function _getStyle(elem,name){
        var _newP = _gDhtml(name),val;
        if (getComputedStyle){
            val = getComputedStyle(elem, null).getPropertyValue(_newP);
        } else {
            val = elem.currentStyle[_newP];
            if ((_newP === "width" || _newP === "height") && val === 'auto') { // 获取元素在IE6/7/8中的宽度和高度
                var rect = elem.getBoundingClientRect();
                return (_newP === 'width' ? rect.right - rect.left : rect.bottom - rect.top) + 'px';
            }
            if (_newP === 'opacity') { // 获取元素在IE6/7/8中的透明度
                var filter = elem.currentStyle.filter;
                if (/opacity/.test(filter)) {
                    val = filter.match(/\d+/)[0] / 100;
                    return (val === 1 || val === 0) ? val.toFixed(0) : val.toFixed(1);
                }
                else {
                    if (val === undefined) {
                        return '1';
                    }
                }
            }
        }
        return ((_newP === 'left' || _newP === 'right' || _newP === 'top' || _newP === 'bottom') && val === 'auto') ? "0px" : val;
    }
    function _hidden(elem){
        var _width = parseInt(_gsWH(elem,"width")),_height = parseInt(_gsWH(elem,"height"));
        return _width === 0 && _height === 0 ?
            true :
            _width > 0 && _height > 0 ?
                false :
                _getStyle(elem, "display") === "none";
    }
    function _insert(elem, content, where){
        var _doit = function (el, value){
            switch (where){
                case 1:{
                    el.parentNode.insertBefore(value, el);
                    break;
                }
                case 2:{
                    el.insertBefore(value, el.firstChild);
                    break;
                }
                case 3:{
                    if(el.tagName.toLowerCase() == 'table' && value.tagName.toLowerCase() == 'tr'){
                        if(el.tBodies.length == 0){
                            el.appendChild(document.createElement('tbody'));
                        }
                        el.tBodies[0].appendChild(value);
                    } else {
                        el.appendChild(value);
                    }
                    break;
                }
                case 4:{
                    el.parentNode.insertBefore(value, el.nextSibling);
                    break;
                }
            }
        };
        where = where || 1;
        if(typeof(content) == 'object'){
            if(content.size){
                if(where == 2) content = content.reverse();
                $Fn.Array.each(content, function(it){
                   _doit(elem, it);
                });
            } else {
                _doit(elem, content);
            }
        } else {
            if(typeof(content) == 'string'){
                var div = document.createElement('div');
                div.innerHTML = content;
                var childs = div.childNodes;
                var nodes = [];
                for (var i=childs.length-1; i>=0; i--) {
                    nodes.push(div.removeChild(childs[i]));
                }
                nodes = nodes.reverse();
                for (var i = 0, il = nodes.length; i < il; i++){
                    _doit(elem, nodes[i]);
                }
            }
        }
        return this;
    }
    /** =======================================dom 查找器开始============================================ **/
    var _domSelector = (function(){
        var exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
            exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
            exprNodeName = /^([\w\*\-_]+)/,
            exprNodeAttr = /\[\s*([\w\u00c0-\uFFFF_-]+)\s*(?:(\S?\=)\s*(.*?))?\s*\]/,
            snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
            na = [null,null, null, null],
            _doc = document,
            _emptyArr = [], 
            _slice = _emptyArr.slice;
        /**
         * dom查找
         * @param selector {Object} 需要查找的dom
         * @param context {Object} 查找范围
         */
        function _search(selector, context) {
            context = context || _doc;
            if (!(/^[\w\-#]+$/.test(selector)) && context.querySelectorAll) {
                return _realArray(context.querySelectorAll(selector));
            }
            if (selector.indexOf(',') > -1) {
                var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;
                for(; sIndex < len; ++sIndex) {
                    ret = ret.concat( _find(split[sIndex], context) );
                }
                return unique(ret);
            }
            var parts = selector.match(snack),
                part = parts.pop(),
                id = (part.match(exprId) || na)[1],
                className = !id && (part.match(exprClassName) || na)[1],
                nodeName = !id && (part.match(exprNodeName) || na)[1],
                _attr = part.match(exprNodeAttr) || na,
                attrName = _attr[1] || null,
                attrValue =  _attr[3] || null,
                collection;
            
            if (className && !nodeName && context.getElementsByClassName) {
                collection = _realArray(context.getElementsByClassName(className));  
            } else {
                collection = !id && _realArray(context.getElementsByTagName(nodeName || '*'));
                if (className) {
                    collection = _byAttr(collection, 'className', className);
                }
                if(attrName){
                    collection = _byAttr(collection, attrName, attrValue);
                }
                if (id) {
                    var byId = context.getElementById(id);
                    return byId?[byId]:[];
                }
            }
            return parts[0] && collection[0] ? _byParents(parts, collection) : collection;
        }
        
        /**
         * 转化为数组格式
         * @param o {Object} 需要转化的对象
         */
        function _realArray(o) {
            try {
                return _slice.call(o);
            } catch(e) {
                var ret = [], i = 0, len = o.length;
                for (; i < len; ++i) {
                    ret[i] = o[i];
                }
                return ret;
            }
        }
        /**
         * 通过属性查找dom
         * @param collection {Object} 查找范围集合
         * @param attr {Object} 查找的属性名称
         * @param value {Object} 属性值
         */
        function _byAttr(collection, attr, value) {
            var reg = RegExp('(^|\\s)' + value + '(\\s|$)'),
            _match = (attr == 'className')?function(node){return reg.test(node.className);}:function(node){return reg.test(node.getAttribute(attr));},
            i = -1, node, r = -1, ret = [];
            while ((node = collection[++i])) {
                (_match(node)) && (ret[++r] = node);
            }
            return ret;
        }
        function _byParents(selectorParts, collection, direct){
            var parentSelector = selectorParts.pop();
            if (parentSelector === '>') {
                return _byParents(selectorParts, collection, true);
            }
            var ret = [], r = -1, id = (parentSelector.match(exprId) || na)[1], className = !id && (parentSelector.match(exprClassName) || na)[1], nodeName = !id && (parentSelector.match(exprNodeName) || na)[1], cIndex = -1, node, parent, matches;
            nodeName = nodeName && nodeName.toLowerCase();
            while ((node = collection[++cIndex])) {
                parent = node.parentNode;
                do {
                    matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
                    matches = matches && (!id || parent.id === id);
                    matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));
                    if (direct || matches) {
                        break;
                    }
                }
                while ((parent = parent.parentNode));
                if (matches) {
                    ret[++r] = node;
                }
            }
            
            return selectorParts[0] && ret[0] ? _byParents(selectorParts, ret) : ret;
        }
        return _search;
    })();
    /** =======================================dom 查找器结束============================================ **/
    
    /** =======================================Cache 缓存器开始============================================ **/
    $Fn.Cache = (function(){
        var cacheData = {},
        uuid = 0,
        expando = 'cache' + (+new Date()+"").slice(-8);
        return {
            data:function(key,val,data){
                if (typeof key === "string") {
                    if (val != undefined) {
                        cacheData[key] = val;
                    }
                    return cacheData[key];
                }
                else if (_isO(key)) {
                    var index, thisCache;
                    if (!key[expando]) {
                        index = key[expando] = ++uuid;  //添加一个DOM元素的属性, 随机数是属性名索引值是属性值
                        thisCache = cacheData[index] = {};
                    }
                    else {
                        index = key[expando];
                        thisCache = cacheData[index];
                    }
                    if (!thisCache[expando]) {
                        thisCache[expando] = {};
                    }
                    if (data !== undefined) {
                        thisCache[expando][val] = data;// 将数据存到缓存对象中
                    }
                    return thisCache[expando][val];// 返回DOM元素存储的数据
                }
            },
            remove: function(key, val){
                if (typeof key === 'string') {
                    delete cacheData[key];
                }
                else if (_isO(key)) {
                    if (!key[expando]) {
                        return;
                    }
                    // 检测对象是否为空
                    var isEmptyObject = function(obj){
                        var name;
                        for (name in obj) {
                            return false;
                        }
                        return true;
                    }, 
                    removeAttr = function(){
                        try {
                            delete key[expando];    //IE8及标准浏览器可以直接使用delete来删除属性
                        } 
                        catch (e) {    // IE6、IE7使用removeAttribute方法来删除属性
                            key.removeAttribute(expando);
                        }
                    }, 
                    index = key[expando];
                    if (val) {
                        delete cacheData[index][expando][val];    //只删除指定的数据
                        if (isEmptyObject(cacheData[index][expando])) {    //如果是空对象 索性全部删除
                            delete cacheData[index];
                            removeAttr();
                        }
                    }
                    else {
                        delete cacheData[index];    //删除DOM元素存到缓存中的所有数据
                        removeAttr();
                    }
                }
            }
        }
    })();
    /** =======================================Cache 缓存器结束============================================ **/
    
    
    /** ======================================= Animate开始 ======================================= **/
    $Fn.Easing = {
        // 匀速运动
        linear : function(t){
            return t;
        },
        easeIn : function (t) {
            return t * t;
        },
        easeOut : function (t) {
            return ( 2 - t) * t;
        },
        easeBoth : function (t) {
            return (t *= 2) < 1 ?
                .5 * t * t :
                .5 * (1 - (--t) * (t - 2));
        },
        easeInStrong : function (t) {
            return t * t * t * t;
        },
        easeOutStrong : function (t) {
            return 1 - (--t) * t * t * t;
        },
        easeBothStrong: function (t) {
            return (t *= 2) < 1 ?
                .5 * t * t * t * t :
                .5 * (2 - (t -= 2) * t * t * t);
        },
        easeOutQuart : function(t){
          return -(POW((t-1), 4) -1)
        },
        easeInOutExpo: function(t){
          if(t===0) return 0;
          if(t===1) return 1;
          if((t/=0.5) < 1) return 0.5 * POW(2,10 * (t-1));
          return 0.5 * (-POW(2, -10 * --t) + 2);
        },
        easeOutExpo: function(t){
          return (t===1) ? 1 : -POW(2, -10 * t) + 1;
        },
        swingFrom: function(t) {
          return t*t*((BOUND+1)*t - BOUND);
        },
        swingTo: function(t) {
          return (t-=1)*t*((BOUND+1)*t + BOUND) + 1;
        },
        backIn : function (t) {
            if (t === 1) t -= .001;
            return t * t * ((BOUND + 1) * t - BOUND);
        },
        backOut : function (t) {
            return (t -= 1) * t * ((BOUND + 1) * t + BOUND) + 1;
        },
        bounce : function (t) {
            var s = 7.5625, r;
            if (t < (1 / 2.75)) {
                r = s * t * t;
            }
            else if (t < (2 / 2.75)) {
                r = s * (t -= (1.5 / 2.75)) * t + .75;
            }
            else if (t < (2.5 / 2.75)) {
                r = s * (t -= (2.25 / 2.75)) * t + .9375;
            }
            else {
                r = s * (t -= (2.625 / 2.75)) * t + .984375;
            }
            return r;
        }   
    };
    (function(){
        var animData = [];
        var _animation = {
            getStyle:function(elem,name){
                var _val = _getStyle(elem,name);
                return (_val!="" && _val!= undefined)?_val:(function(el,pro){
                    var _val2 = "";
                    switch(pro){
                        case "scrollTop":
                        case "scrollLeft":
                            _val2 = (el == document.body) ? (document.documentElement[pro] || document.body[pro]) : el[pro];
                            break;
                    }
                    return _val2 + "px";
                }(elem,name));
            },
            /** 
             * 解析颜色值
             * @param { String } 颜色值
             * @return { Object } RGB颜色值组成的对象
             * red : object.r, green : object.g, blue : object.b
             */
            parseColor: function(val){
                var r, g, b;
                if (/rgb/.test(val)) {
                    var arr = val.match(/\d+/g);
                    r = arr[0];
                    g = arr[1];
                    b = arr[2];
                }
                else {
                    if (/#/.test(val)) {
                        var len = val.length;
                        if (len === 7) {
                            r = parseInt(val.slice(1, 3), 16);
                            g = parseInt(val.slice(3, 5), 16);
                            b = parseInt(val.slice(5), 16);
                        }
                        else 
                            if (len === 4) {
                                r = parseInt(val.charAt(1) + val.charAt(1), 16);
                                g = parseInt(val.charAt(2) + val.charAt(2), 16);
                                b = parseInt(val.charAt(3) + val.charAt(3), 16);
                            }
                    }
                    else {
                        return val;
                    }
                }
                return {
                    r: parseFloat(r),
                    g: parseFloat(g),
                    b: parseFloat(b)
                }
            },
            /**
             * 解析CSS属性值
             * @param { String } CSS属性
             * @return { Object } object.val为CSS属性值 object.unit为CSS属性单位
             * object.fn 为计算普通的属性值和颜色值的方法
             */
            parseStyle: function(prop){
                var val = parseFloat(prop), unit = prop.toString().replace(/^[\-\d\.]+/, '');
                return isNaN(val) ? {
                    val: this.parseColor(unit),
                    unit: '',
                    fn: function(sv, tv, tu, e){
                        var r = (sv.r + (tv.r - sv.r) * e).toFixed(0), g = (sv.g + (tv.g - sv.g) * e).toFixed(0), b = (sv.b + (tv.b - sv.b) * e).toFixed(0);
                        return 'rgb(' + r + ',' + g + ',' + b + ')';
                    }
                } : {
                    val: val,
                    unit: unit,
                    fn: function(sv, tv, tu, e){
                        return (sv + (tv - sv) * e).toFixed(3) + tu;
                    }
                }
            },
            /**
             * 将数组转换成对象
             * @param { Array } 数组
             * @param { String } 对象的键值
             * @return { Object }
             */
            newObj: function(arr, val){
                val = val !== undefined ? val : 1;
                var obj = {};
                for (var i = 0, len = arr.length; i < len; i += 1) {
                    obj[arr[i]] = val;
                }
                return obj;
            },
            /**
             * 设置透明度
             * @param { Object } DOM对象
             * @param { String } 透明值
             */
            setOpacity: function(elem, val){
                if (getComputedStyle) {
                    elem.style.opacity = val === 1 ? '' : val;
                }else {
                    elem.style.zoom = 1;
                    elem.style.filter = val === 1 ? '' : 'alpha(opacity=' + val * 100 + ')';
                }
            },
            speed: {    // 预定义速度 
                slow: 600,
                fast: 200,
                defaults: 400
            },
            /**
             * 预定义的动画
             * @param {String} 动画类型(show/hide)
             * @param {Number} 数组index，0为slide，1为fade
             * @return {Object} object.props为CSS属性数组，object.type为动画类型(show/hide)
             */
            fxAttrs: function(type, index){
                var attrs = [['width', 'height', 'opacity', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'], ['height', 'paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'], ['opacity']];
                return {
                    attrs: attrs[index],
                    type: type
                }
            },
            setScroll:function(elem,diff,sv,prop){
                if (elem != document.body) {
                    elem[prop] = parseInt(diff);
                }
                else {
                    if (prop == 'scrollLeft') {
                        window.scrollBy(parseInt(diff) - sv, 0);
                    }
                    else {
                        window.scrollBy(0, parseInt(diff) - sv);
                    }
                }
            },
            /**
             * 将动画参数存储到一个新对象中
             * @param {Object} DOM对象
             * @param {String or Number} 动画持续时间
             * @param {String or Function} tween算法
             * @param {Function} 回调函数
             * @return {Object } 参数的集合对象
             */
            setOptions: function(elem, duration, easing, callback){
                var self = this;
                return {
                    duration: (function(d){
                        return (typeof d === 'number') ? d :(typeof d === 'string' && self.speed[d]) ? self.speed[d] : self.speed.defaults;
                    })(duration),
                    easing: (function(e){
                        return (typeof e === 'string' && $Fn.Easing[e]) ? $Fn.Easing[e] : _isF(e) ? e : $Fn.Easing.easeBoth;
                    })(easing),
                    callback: function(){
                        _isF(callback) &&callback();
                        self.dequeue(elem);
                    }
                };
            },
            /**
             * 初始化动画属性
             * @param { Object } DOM对象
             * @param { Object } CSS动画属性和属性值
             * @param { String } 动画类型
             * @return { Object } 处理好的CSS动画属性和属性值
             */
            setProps: function(elem, props, type){
                if (type) {
                    var attrs = props().attrs, type = props().type, val, obj, p,self=this;
                    if (type === 'hide') {
                        val = attrs[0] === 'opacity' ? '0' : '0px';
                    }
                    obj = this.newObj(attrs, val);
                    if (type === 'show') {
                        for (p in obj) {
                            obj[p] = self.getStyle(elem, p);
                        }
                    }
                    return obj;
                }
                else {
                    if (props && typeof props === 'object') {
                        return props;
                    }
                }
            },
            queue: function(elem, data){ // 将数据添加到队列中
                var animQueue = $Fn.Cache.data(elem, 'animQueue') || $Fn.Cache.data(elem, 'animQueue', []);
                if (data) {
                    animQueue.push(data);
                }
                if (animQueue[0] !== 'runing') {
                    this.dequeue(elem);
                }
            },
            dequeue: function(elem){// 取出队列中的数据并执行
                var self = this, 
                animQueue = $Fn.Cache.data(elem, "animQueue") || $Fn.Cache.data(elem, "animQueue", []), 
                fn = animQueue.shift();
                if (fn === 'runing') {
                    fn = animQueue.shift();
                }
                if (fn) {
                    animQueue.unshift('runing');
                    if (typeof fn === 'number') {
                        Host.setTimeout(function(){
                            self.dequeue(elem);
                        }, fn);
                    }
                    else {
                        if (typeof fn === 'function') {
                            fn.call(elem, function(){
                                self.dequeue(elem);
                            });
                        }
                    }
                }
                if (!animQueue.length) {
                    $Fn.Cache.remove(elem, 'animQueue');
                }
            }
        };
        function Animate(elem, options, props, type){
            return {
                start : function(source, target){
                    var self = this;
                    this.startTime = +new Date();
                    this.source = source;
                    this.target = target;
                    animData.push(this);
                    if (elem.timer) 
                        return;
                    elem.timer = Host.setInterval(function(){
                        for (var i = 0, curStep; curStep = animData[i++];) {
                            curStep.run();
                        }
                        if (!animData.length) {
                            self.stop();
                        }
                    }, 13);
                },
                run : function(end){
                    var startTime = this.startTime, // 动画开始的时间
                    elapsedTime = +new Date(), // 当前帧的时间            
                    duration = options.duration, 
                    endTime = startTime + duration, // 动画结束的时间
                    t = elapsedTime > endTime ? 1 : (elapsedTime - startTime) / duration, e = options.easing(t), len = 0, i = 0, p;
                    for (p in props) { // 计算props对象有多少个属性
                        len += 1;
                    }
                    (type === 'show') && (elem.style.display = 'block');
                    for (p in props) {
                        i += 1;
                        var sv = this.source[p].val, tv = this.target[p].val, tu = this.target[p].unit;
                        if (end || elapsedTime >= endTime) { // 结束动画并还原样式
                            elem.style.overflow = '';
                            (type === 'hide')&&(elem.style.display = 'none');
                            if (type) {
                                (p === 'opacity') ? _animation.setOpacity(elem, 1) : (elem.style[p] = (type === 'hide' ? sv : tv) + tu);
                            }
                            else {
                                switch(p){
                                    case "scrollLeft":
                                    case "scrollTop":
                                        _animation.setScroll(elem,tv,sv,p);
                                        break;
                                    default:
                                        elem.style[p] = /color/i.test(p) ? 'rgb(' + tv.r + ',' + tv.g + ',' + tv.b + ')' : tv + tu;
                                        break;
                                }                               
                            }
                            if (i === len) { // 判断是否为最后一个属性
                                this.complete();
                                options.callback.call(elem);
                            }
                        }
                        else {
                            if (sv === tv) 
                                continue;
                            var _diff = this.target[p].fn(sv, tv, tu, e);
                            switch(p){
                                case "opacity":
                                    _animation.setOpacity(elem, (sv + (tv - sv) * e).toFixed(3));
                                    break;
                                case "scrollLeft":
                                case "scrollTop":
                                    _animation.setScroll(elem,_diff,(elem == document.body) ? (document.documentElement[p] || document.body[p]) : elem[p],p);
                                    break;
                                default:
                                    elem.style[p] = _diff;
                                    break;
                            }
                        }
                        
                    }
                },
                stop : function(){
                    Host.clearInterval(elem.timer);
                    elem.timer = undefined;
                },
                complete : function(){
                    for (var i = animData.length - 1; i >= 0; i--) {
                        if (this === animData[i]) {
                            animData.splice(i, 1);
                        }
                    }
                }
            }
        }
        $Fn.Anim = function(elem, props, duration, easing, callback){
            options = _animation.setOptions(elem, duration, easing, callback), type = _isF(props) ? props().type : null;
            props = _animation.setProps(elem, props, type);
            _animation.queue(elem, function(){
                var source = {}, target = {}, p;
                for (p in props) {
                    if (type === 'show') {
                        // 将CSS重置为0
                        if (p === 'opacity') {
                            _animation.setOpacity(elem, '0');
                        }
                        else {
                            elem.style[p] = '0px';
                        }
                    }
                    source[p] = _animation.parseStyle(_animation.getStyle(elem, p)); // 动画开始时的CSS样式
                    target[p] = _animation.parseStyle(props[p]); // 动画结束时的CSS样式
                }
                var _Anim = Animate(elem, options, props, type);
                _Anim.start(source, target);
            });
            return elem;
        }
    })();
    /** ======================================= Animate结束 ======================================= **/
    $Fn.Event = (function(){
        var _addEvent, _removeEvent;//为避免每次进行兼容性判断，在文档加载的时候进行事件管理
        if (document.addEventListener) {
            _addEvent = function(el, name, func) { el.addEventListener(name, func, false); };
            _removeEvent = function(el, name, func) { el.removeEventListener(name, func, false); };
        }
        else {
            if (document.attachEvent) {
                _addEvent = function(el, name, func) { el.attachEvent("on"+name, func, false); };
                _removeEvent = function(el, name, func) { el.detachEvent("on"+name, func, false); };
            }
            else {
                _addEvent = function(el, name, func) { el["on" + name] = func; };
                _removeEvent = function(el, name, func) { el["on" + name] = null; };
                
            }
        };
        var _fixEvent=function(e){  //修复IE浏览器支持常见的标准事件的API
            if ( e.target ){ //支持DOM 2级标准事件的浏览器无需做修复
                return e;
            }
            var event = {}, name;
            event.target = e.srcElement || document;
            event.preventDefault = function(){
                e.returnValue = false;
            };   
            event.stopPropagation = function(){
                e.cancelBubble = true;
            };
            // IE6/7/8在原生的win.event中直接写入自定义属性 会导致内存泄漏，所以采用复制的方式
            for( name in e ){
                event[name] = e[name];
            }
            return event;
        },   
        _eventHandler=function( elem ){ //依次执行事件绑定的函数
            return function( event ){
                event = _fixEvent( event || win.event );
                var type = event.type,
                    events = $Fn.Cache.data( elem, 'e' + type );
                for( var i = 0, handler; handler = events[i++]; ){
                    if( handler.call(elem, event,elem) === false ){
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            }
        },
        _cache = $Fn.Cache;
        return {
            bind:function(elem,type,handler){
                var events = _cache.data(elem,"e" + type) || _cache.data(elem,"e"+type,[]);
                events.push(handler);
                if (events.length ===1){
                    var eventHandler = _eventHandler(elem);
                    _cache.data(elem,type+"Handler",eventHandler);
                    _addEvent(elem,type,eventHandler);
                }
            },
            unbind: function(elem,type,handler){
                var events = _cache.data(elem, "e" + type);
                if (!events) return;
                if (!handler) {
                    events = undefined;
                }
                else {
                    for (var i = events.length - 1; i >= 0; i--) {
                        var fn = events[i];
                        if (fn === handler) {
                            events.splice(i, 1);
                        }
                    }
                }
                if (!events || !events.length) {
                    var eventHandler = _cache.data(elem, type + "Handler");
                    _removeEvent(elem, type, eventHandler);
                    _cache.remove(elem, type + "Handler");
                    _cache.remove(elem, "e" + type);
                }
            },
            trigger: function(el, ename){
                if (!el) 
                    return;
                if ($Fn.Browser.ie) {
                    el[ename]();
                }
                else 
                    if (document.createEvent) {
                        var ev = document.createEvent('HTMLEvents');
                        ev.initEvent(ename, false, true);
                        el.dispatchEvent(ev);
                    }
                return el;
            }
        }
    })();
    
    /**
     * 框架DOM原型属性
     */
    var _dom_prototype = {
        isdom:true,
        isReady:false,
        ready:function(fn){
            bindReady();
            if (this.isReady) {
                fn.call(document,this);
            } else {
                readyList.push(fn);
            }
            return this;
        },
        size:function(){   //获取DOM长度
            return this.length;
        },
        hide: function(){  //隐藏DOM
            this.css('display', 'none');
            return this;
        },
        show:function(val){   //显示DOM
            this.css('display', typeof val === 'undefined' ? 'block' : val);
            return this;
        },
        css:function(name, value){  //设置或者获取CSS
            if ((typeof(value) == 'undefined') && !_isO(name)) {
                return _getStyle(this[0],name);
            }
            else {
                this.each(function(el){
                    el = el[0];
                    _setCss(el, name, value);
                });
                return this;
            }
        },
        visible:function(){
            return !_hidden(this);
        },
        each: function(callback){       //遍历DOM对象
            for (var i = 0, il = this.length; i < il; i++) {
                if (callback($Fn.Dom(this[i]), i) == false) 
                    break;
            }
            return this;
        },
        index: function(element){
            if(element.size){
                element = element[0];
            }
            return $Fn.Array.index(this, element);
        },
        get: function(idx){
            return idx === undefined ? this : $Fn.Dom(this[idx]);
        },
        html:function(html){
            return _prop(this,"innerHTML", html);
        },
        append: function () {
            var args = arguments;
            this.each(function(it){
                for (var i=0, il=args.length; i<il; i++) {
                    _insert(it[0], args[i], 3);
                }
            });
            return this;
        },
        text: function(value){
            return _prop(this,typeof(this[0].innerText) != "undefined" ? "innerText" : "textContent", value);
        },
        empty: function(){
            return this.each(function(el){
                el[0].innerHTML = "";
            });
        },
        val: function(value){
            return (value === undefined) ? (this.length > 0 ? this[0].value : null) : this.each(function(el){
                _prop(el,"value",value);
            });
        },
        attr:function(name,value){
            return (typeof name == 'string' && value === undefined) ? (this.length == 0 ? undefined :this[0].getAttribute(name)) : this.each(function(el){
                if (_isO(name)) {
                    for (key in name) {
                        el[0].setAttribute(key, name[key]);
                    }
                }
                else {
                    (name == "class") ? el[0].className = value : el.setAttribute(name, value);
                }
            });
        },
        rel:function(){
            return this.attr("rel");
        },
        remove: function(){
            this.each(function(el){
                (el[0].parentNode != null) && (el[0].parentNode.removeChild(el[0]));
            });
            return this;
        },
        next: function(){
            return _relatedNode(this[0],"nextSibling");
        },
        prev:function(){
            return _relatedNode(this[0],"previousSibling");
        },
        parent:function(){
            return _relatedNode(this[0],"parentNode");          
        },
        pos: function(){
            var left = 0, 
            top = 0, 
            el = this[0], 
            de = document.documentElement, 
            db = document.body, 
            reset = function(l, t){
                left += l || 0;
                top += t || 0;
            };
            if (el == document.body) {    //for ie
                if (typeof(window.pageYOffset) == 'number') {
                    top = window.pageYOffset;
                    left = window.pageXOffset;
                }
                else {
                    if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
                        top = document.body.scrollTop;
                        left = document.body.scrollLeft;
                    }
                    else 
                        if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                            top = document.documentElement.scrollTop;
                            left = document.documentElement.scrollLeft;
                        }
                }
            }
            else {
                if (el.getBoundingClientRect) {
                    var box = el.getBoundingClientRect();
                    reset(box.left + Math.max(de.scrollLeft, db.scrollLeft) - de.clientLeft, box.top + Math.max(de.scrollTop, db.scrollTop) - de.clientTop);
                }
                else {
                    var op = el.offsetParent, fixed = el.style.position == 'fixed', oc = el, parent = el.parentNode;
                    reset(el.offsetLeft, el.offsetTop);
                    while (op) {
                        reset(op.offsetLeft, op.offsetTop);
                        
                        if ($Fn.Browser.firefox && !/^t(able|d|h)$/i.test(op.tagName) || $Fn.Browser.safari) {
                            reset(el.style.borderLeftWidth, el.style.borderTopWidth);
                        }
                        if (!fixed && op.style.position == 'fixed') 
                            fixed = true;
                        oc = op.tagName.toLowerCase() == 'body' ? oc : op;
                        op = op.offsetParent;
                    }
                    while (parent && parent.tagName && !/^body|html$/i.test(parent.tagName)) {
                        if (!/^inline|table.*$/i.test(parent.style.display)) 
                            reset(-parent.scrollLeft, -parent.scrollTop);
                        if ($Fn.Browser.firefox && parent.style.overflow != 'visible') 
                            reset(parent.style.borderLeftWidth, parent.style.borderTopWidth);
                        parent = parent.parentNode;
                    }
                    if ($Fn.Browser.firefox && oc.style.position != 'absolute') 
                        reset(-db.offsetLeft, -db.offsetTop);
                    if (fixed) 
                        reset(Math.max(de.scrollLeft, db.scrollLeft), Math.max(de.scrollTop, db.scrollTop));
                }
            };
            return {
                left: left,
                top: top
            };
        },
        width:function(value){
            return _gsWH(this,"width",value);
        },
        height:function(value){
            return _gsWH(this,"height",value);
        },
        addClass: function(name){
            this.each(function(it){
                it = it[0];
                var arr = [];
                if(it.className){
                    arr = it.className.split(' ');
                    if(!$Fn.Array.include(arr, name)) arr.push(name);
                } else {
                    arr.push(name);
                }
                it.className = arr.join(' ');
            });
            return this;
        },
        removeClass: function(name){
            this.each(function(it){
                it = it[0];
                if(it.className){
                    var regexp = new RegExp('\\b' + name.trim() + '\\b', 'g');
                    it.className = it.className.replace(regexp, '');
                }
            });
            return this;
        },
        focus:function(){
            this[0].focus();
            return this;
        },
        select:function(){
            this[0].select();
            return this;
        },
        trigger:function(name){
            this.each(function(el){
                $Fn.Event.trigger(el[0], name);
            });
            return this;
        },
        find: function(tag){
            var nodes = this[0].childNodes, els = [] ,it;
            for(var i = 0, il = nodes.length; i < il; i++){
                it = nodes[i];
                if (it.nodeType && it.nodeType == 1 && it.nodeName.toLowerCase() == tag) {
                    els.push(it);
                } 
            }
            return $Fn.Dom(els[0]);
        },
        on:function(name,func){
            this.each(function(el){
                $Fn.Event.bind(el[0],name,func);
            });
            return this;
        },
        un:function(name,func){
            this.each(function(el){
                $Fn.Event.unbind(el[0],name,func);
            });
            return this;
        },
        anim:function(prop, speed, easing, callback){
            $Fn.Anim(this[0],prop, speed, easing, callback);
        }
    }
    var _find = function(selector, context){
        if (!selector) return [];
        if (typeof selector == 'object') {
            if (selector.nodeType) {
                return [selector];
            }
        }
        else {
            if (typeof selector != 'string') {
                return [];
            }
            else {
                if (context && context.size && context.length) 
                    context = context[0];
                return _domSelector(selector, context);
            }
        }
    }
    var readyList = [],     // DOM Ready函数队列
    isReadyBound,       // 是否已绑定DOM Ready事件
    onDomReady;

    if (document.addEventListener) {
        onDomReady = function() {
            document.removeEventListener("DOMContentLoaded", onDomReady, false);
            domReadyNow();
        };
    } else if (document.attachEvent) {  // For IE Only
        onDomReady = function() {
            if ("complete" === document.readyState) {
                document.detachEvent("onreadystatechange", onDomReady);
                domReadyNow();
            }
        };
    }
    
    // DOM Ready检查 For IE
    function doScrollCheck() {
        if (_dom_prototype.isReady) { return; }
    
        try {
            document.documentElement.doScroll("left");
        } catch (e) {
            setTimeout(doScrollCheck, 1);
            return;
        }
    
        domReadyNow();
    }
    // DOM已就绪
    function domReadyNow() {
        if (!_dom_prototype.isReady) {
            if (!document.body) { return setTimeout(domReadyNow, 13); }
    
            _dom_prototype.isReady = true;
    
            if (readyList) {
                var i = -1, len = readyList.length;
                while (++i < len) {
                    readyList[i].call(document, _dom_prototype);    
                }
                readyList = null;
            }
        }
    }
    // 绑定DOMReady事件
    function bindReady() {
        if (isReadyBound) { return; }
    
        if ("complete" === document.readyState) { return domReadyNow(); }
    
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", domReadyNow, false);
            window.addEventListener("load", domReadyNow, false);
        } else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", domReadyNow);
            window.attachEvent("onload", domReadyNow);
            var isTopLevel;
            try {
                isTopLevel = window.frameElement == null;
            } catch(e) {}
    
            document.documentElement.doScroll && isTopLevel && doScrollCheck();
        }
    
        isReadyBound = true;
    }
    
    /**
     * 定义框架与DOM相关的方法
     * @param {Object} selector
     * @param {Object} context
     */
    $Fn.Dom = function(selector,context){
        var result = _find(selector,context);
        if (result.length) {
            _mix(result,_dom_prototype);
            return result;
        }
        return null;
    };
    $Fn.Dom.ready = _dom_prototype.ready;
    /**
     * 获取浏览器版本及名称
     */
    (function(){
        var agent = navigator.userAgent.toLowerCase();
        $Fn.Browser = {
            version: (agent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
            safari: /webkit/i.test(agent) && !this.chrome,
            opera: /opera/i.test(agent),
            firefox:/firefox/i.test(agent),
            ie: /msie/i.test(agent) && !/opera/.test(agent),
            chrome: /chrome/i.test(agent) && /webkit/i.test(agent) && /mozilla/i.test(agent)
        };
    })();
    /**
     * Object对象常用的一些方法
     */
    $Fn.Object = {
        each:function(obj,callback){
            for (var key in obj) {
                if (callback(key,obj[key]) === false ) {
                    break;
                }
            }
            return obj;
        }
    }
    $Fn.Json = (function(){
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {   //转义字符
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;
        String.prototype.toJSON = function(key){
            return this.valueOf();
        }
        function quote(string){
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' +
            string.replace(escapable, function(a){
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) +
            '"' : '"' + string + '"';
        }
        function str(key, holder){
            var i,k,v,length, mind = gap, partial, value = holder[key];
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }
            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }
            switch (typeof value) {
                case 'string':
                    return quote(value);
                case 'number':
                    return isFinite(value) ? String(value) : 'null';
                case 'boolean':
                case 'null':
                    return String(value);
                case 'object':
                    if (!value) {
                        return 'null';
                    }
                    gap += indent;
                    partial = [];
                    if (_isA(value)) {
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }
                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            k = rep[i];
                            if (typeof k === 'string') {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    else {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }
        return {
            stringify: function(value, replacer, space){
                var i;
                gap = '';
                indent = '';
                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }
                }
                else 
                    if (typeof space === 'string') {
                        indent = space;
                    }
                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }
                return str('', {
                    '': value
                });
            },
            parse: function(data){
                if (typeof data !== "string" || !data) {
                    return null;
                }
                if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                    return window.JSON && window.JSON.parse ? window.JSON.parse(data) : (new Function("return " + data))();
                }
                else {
                    return "";
                }
            }
        }
        
    })();
    $Fn.Array = {
        index: function(arr, value){
            for (var i = 0, il = arr.length; i < il; i++) {
                if (arr[i] == value)
                    return i;
            }
            return -1;
        },
        include: function(arr, value) {
            return this.index(arr, value) != -1;
        },
        each:function(arr,cb){
            for(var i=0,len=arr.length;i<len;i++){
                if (cb(arr[i],i) === false ) {
                    break;
                }
            }
            return arr;
        },
        grep: function(array,callback,inv){    //筛选数组
            /*
             * array：待过滤数组。
             * callback：此函数将处理数组每个元素。第一个参数为当前元素，第二个参数而元素索引值。此函数应返回一个布尔值。另外，此函数可设置为一个字符串，当设置为字符串时，将视为“lambda-form”（缩写形式？），其中 a 代表数组元素，i 代表元素索引值。如“a > 0”代表“function(a){ return a > 0; }”。
             * inv：如果 "invert" 为 false 或为设置，则函数返回数组中由过滤函数返回 true 的元素，当"invert" 为 true，则返回过滤函数中返回 false 的元素集。
             */
            var ret = [];
            for (var i = 0, length = array.length; i < length; i++) {
                if (!inv !== !callback(array[i], i)) {
                    ret.push(array[i]);
                }
            }
            
            return ret;
        }
    }
    /**
     * 框架核心方法
     */
    var proto = {
        use: function(module){
            return $Fn[module];
        }
    }
    if (!Host[J]) Host[J]= proto;
})(window,"jav");
