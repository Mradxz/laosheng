var firstInstall = window.localStorage.firstInstall,yhqtoken='';
window.localStorage.token='';
if(typeof firstInstall == 'undefined'){
	chrome.tabs.create({url:"http://www.wntaoke.com?from=plugin",selected:true});
	window.localStorage.firstInstall = "true";
}

if (typeof window.localStorage.keyPlugin == 'undefined') {
	window.localStorage.keyPlugin = 68;
}
if (typeof window.localStorage.keyTrend == 'undefined') {
	window.localStorage.keyTrend = 81;
}
if (typeof window.localStorage.keyTaoke == 'undefined') {
	window.localStorage.keyTaoke = 87;
}
if (typeof window.localStorage.keyQueqiao == 'undefined') {
	window.localStorage.keyQueqiao = 69;
}
if (typeof window.localStorage.keyLogin == 'undefined') {
	window.localStorage.keyLogin = 65;
}
if (typeof window.localStorage.applyReason == 'undefined') {
	window.localStorage.applyReason = '万能淘客联盟会员申请计划，请通过，更多合作详情请访问万能淘客-www.wntaoke.com';
}
chrome.runtime.onMessage.addListener(function(r, sender, sendResponse) {
	if(r.type == 'yhq'){
		if(r.counts==0){window.localStorage.token='';}
/*		if(window.localStorage.token){
			yhqtoken=window.localStorage.token.split("_")[0];
			sendResponse(window.localStorage.token);
		}else{*/
			chrome.cookies.get({url: "http://taobao.com/", name: "_m_h5_tk"}, function(cookie) {
				if (cookie != null) {
					//alert(JSON.stringify(cookie))
					window.localStorage.token = cookie.value;
					yhqtoken=cookie.value.split("_")[0];
					sendResponse(cookie.value);
				}
			});
		sendResponse(window.localStorage.token);
		// }
		
	}
});
chrome.extension.onConnect.addListener(function(port) {
	  console.assert(port.name == "knockknock");
	  port.onMessage.addListener(function(msg) {
		  // yhqtoken=window.localStorage.token;
		  port.postMessage(window.localStorage.token);
	  });
	});
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    if(request.type == 'gajax'){
		$.get(request.url,request.getdata,function(data) {
			sendResponse({
				msg: 'ok',
				data: data
			});
		});
    }else if(request.type == 'pajax'){
		$.post(request.url,request.postdata,function(data) {
			sendResponse({
				msg: 'ok',
				data: data
			});
		},'json');
    }else if(request.type == 'getyhq'){

    	var activityId=request.getdata.activityId,sellerId=request.getdata.sellerId;
    	 var timestamp=(new Date()).getTime(),appkey="12574478",data=JSON.stringify({uuid:activityId,sellerId:sellerId,queryShop:true});
    	 var sign = r(yhqtoken+"&"+timestamp+"&"+appkey+"&"+data);
    	 // alert(yhqtoken);
    	 var url="https://api.m.taobao.com/h5/mtop.taobao.couponmtopreadservice.findshopbonusactivitys/2.0/?appKey="+appkey+"&t="+timestamp+"&sign="+sign+"&api=mtop.taobao.couponMtopReadService.findShopBonusActivitys&v=2.0&AntiFlood=true&ecode=1&callback=?&data="+data;
    	 // alert(url);
    	 // return true;
    	 $.get(url,function(d){
    	 	// alert(123);
    		 //  if(d.ret[0]=="SUCCESS::调用成功"){
    			 var rd=d.data.module[0];
    			 sendResponse({
    	 				msg: 'ok',
    	 				data: rd
    	 			});
/*    		 }else{
    			 sendResponse({
 	 				msg: 'ok2',
 	 				data: url
 	 			});
    		 }*/

    	 });

    } else if(request.type == 'phajax'){
    	$.ajax({url:request.url,
				method: 'POST',
				data:request.postdata,
				headers: request.head,
				 success:function(data){
					 sendResponse({
							msg: 'ok',
							data: data
						});
				 },
				 error:function(data){
					 console.log(data);                //跨域错误会执行到这里
				 }
    	});
	
    }else if(request.type == 'set'){
		chrome.cookies.get({url: "http://alimama.com/", name: "_tb_token_"}, function(cookie) {
			if (cookie != null) {
				window.localStorage.token = cookie.value;
			}
		});
		var resOK = {
			hidden: window.localStorage.hiddenPlugin,
			reason: window.localStorage.applyReason,
			keyPlugin: window.localStorage.keyPlugin,
			keyTrend: window.localStorage.keyTrend,
			keyTaoke: window.localStorage.keyTaoke,
			keyQueqiao: window.localStorage.keyQueqiao,
			keyLogin: window.localStorage.keyLogin,
			token: window.localStorage.token
		};
		sendResponse(resOK);
	}
});


function r(t) {
    function e(t, e) {
        return t << e | t >>> 32 - e
    }

    function n(t, e) {
        var n, i, o, a, r;
        return o = 2147483648 & t,
            a = 2147483648 & e,
            n = 1073741824 & t,
            i = 1073741824 & e,
            r = (1073741823 & t) + (1073741823 & e),
            n & i ? 2147483648 ^ r ^ o ^ a : n | i ? 1073741824 & r ? 3221225472 ^ r ^ o ^ a : 1073741824 ^ r ^ o ^ a : r ^ o ^ a
    }

    function i(t, e, n) {
        return t & e | ~t & n
    }

    function o(t, e, n) {
        return t & n | e & ~n
    }

    function a(t, e, n) {
        return t ^ e ^ n
    }

    function r(t, e, n) {
        return e ^ (t | ~n)
    }

    function s(t, o, a, r, s, c, l) {
        return t = n(t, n(n(i(o, a, r), s), l)),
            n(e(t, c), o)
    }

    function c(t, i, a, r, s, c, l) {
        return t = n(t, n(n(o(i, a, r), s), l)),
            n(e(t, c), i)
    }

    function l(t, i, o, r, s, c, l) {
        return t = n(t, n(n(a(i, o, r), s), l)),
            n(e(t, c), i)
    }

    function u(t, i, o, a, s, c, l) {
        return t = n(t, n(n(r(i, o, a), s), l)),
            n(e(t, c), i)
    }

    function d(t) {
        for (var e, n = t.length,
                i = n + 8,
                o = (i - i % 64) / 64, a = 16 * (o + 1), r = new Array(a - 1), s = 0, c = 0; n > c;) e = (c - c % 4) / 4,
            s = c % 4 * 8,
            r[e] = r[e] | t.charCodeAt(c) << s,
            c++;
        return e = (c - c % 4) / 4,
            s = c % 4 * 8,
            r[e] = r[e] | 128 << s,
            r[a - 2] = n << 3,
            r[a - 1] = n >>> 29,
            r
    }

    function p(t) {
        var e, n, i = "",
            o = "";
        for (n = 0; 3 >= n; n++) e = t >>> 8 * n & 255,
            o = "0" + e.toString(16),
            i += o.substr(o.length - 2, 2);
        return i
    }

    function f(t) {
        t = t.replace(/\r\n/g, "\n");
        for (var e = "",
                n = 0; n < t.length; n++) {
            var i = t.charCodeAt(n);
            128 > i ? e += String.fromCharCode(i) : i > 127 && 2048 > i ? (e += String.fromCharCode(i >> 6 | 192), e += String.fromCharCode(63 & i | 128)) : (e += String.fromCharCode(i >> 12 | 224), e += String.fromCharCode(i >> 6 & 63 | 128), e += String.fromCharCode(63 & i | 128))
        }
        return e
    }
    var h, g, m, _, v, w, b, y, x, A = [],
        I = 7,
        S = 12,
        k = 17,
        C = 22,
        T = 5,
        E = 9,
        $ = 14,
        P = 20,
        R = 4,
        O = 11,
        j = 16,
        L = 23,
        N = 6,
        U = 10,
        q = 15,
        D = 21;
    for (t = f(t), A = d(t), w = 1732584193, b = 4023233417, y = 2562383102, x = 271733878, h = 0; h < A.length; h += 16) g = w,
        m = b,
        _ = y,
        v = x,
        w = s(w, b, y, x, A[h + 0], I, 3614090360),
        x = s(x, w, b, y, A[h + 1], S, 3905402710),
        y = s(y, x, w, b, A[h + 2], k, 606105819),
        b = s(b, y, x, w, A[h + 3], C, 3250441966),
        w = s(w, b, y, x, A[h + 4], I, 4118548399),
        x = s(x, w, b, y, A[h + 5], S, 1200080426),
        y = s(y, x, w, b, A[h + 6], k, 2821735955),
        b = s(b, y, x, w, A[h + 7], C, 4249261313),
        w = s(w, b, y, x, A[h + 8], I, 1770035416),
        x = s(x, w, b, y, A[h + 9], S, 2336552879),
        y = s(y, x, w, b, A[h + 10], k, 4294925233),
        b = s(b, y, x, w, A[h + 11], C, 2304563134),
        w = s(w, b, y, x, A[h + 12], I, 1804603682),
        x = s(x, w, b, y, A[h + 13], S, 4254626195),
        y = s(y, x, w, b, A[h + 14], k, 2792965006),
        b = s(b, y, x, w, A[h + 15], C, 1236535329),
        w = c(w, b, y, x, A[h + 1], T, 4129170786),
        x = c(x, w, b, y, A[h + 6], E, 3225465664),
        y = c(y, x, w, b, A[h + 11], $, 643717713),
        b = c(b, y, x, w, A[h + 0], P, 3921069994),
        w = c(w, b, y, x, A[h + 5], T, 3593408605),
        x = c(x, w, b, y, A[h + 10], E, 38016083),
        y = c(y, x, w, b, A[h + 15], $, 3634488961),
        b = c(b, y, x, w, A[h + 4], P, 3889429448),
        w = c(w, b, y, x, A[h + 9], T, 568446438),
        x = c(x, w, b, y, A[h + 14], E, 3275163606),
        y = c(y, x, w, b, A[h + 3], $, 4107603335),
        b = c(b, y, x, w, A[h + 8], P, 1163531501),
        w = c(w, b, y, x, A[h + 13], T, 2850285829),
        x = c(x, w, b, y, A[h + 2], E, 4243563512),
        y = c(y, x, w, b, A[h + 7], $, 1735328473),
        b = c(b, y, x, w, A[h + 12], P, 2368359562),
        w = l(w, b, y, x, A[h + 5], R, 4294588738),
        x = l(x, w, b, y, A[h + 8], O, 2272392833),
        y = l(y, x, w, b, A[h + 11], j, 1839030562),
        b = l(b, y, x, w, A[h + 14], L, 4259657740),
        w = l(w, b, y, x, A[h + 1], R, 2763975236),
        x = l(x, w, b, y, A[h + 4], O, 1272893353),
        y = l(y, x, w, b, A[h + 7], j, 4139469664),
        b = l(b, y, x, w, A[h + 10], L, 3200236656),
        w = l(w, b, y, x, A[h + 13], R, 681279174),
        x = l(x, w, b, y, A[h + 0], O, 3936430074),
        y = l(y, x, w, b, A[h + 3], j, 3572445317),
        b = l(b, y, x, w, A[h + 6], L, 76029189),
        w = l(w, b, y, x, A[h + 9], R, 3654602809),
        x = l(x, w, b, y, A[h + 12], O, 3873151461),
        y = l(y, x, w, b, A[h + 15], j, 530742520),
        b = l(b, y, x, w, A[h + 2], L, 3299628645),
        w = u(w, b, y, x, A[h + 0], N, 4096336452),
        x = u(x, w, b, y, A[h + 7], U, 1126891415),
        y = u(y, x, w, b, A[h + 14], q, 2878612391),
        b = u(b, y, x, w, A[h + 5], D, 4237533241),
        w = u(w, b, y, x, A[h + 12], N, 1700485571),
        x = u(x, w, b, y, A[h + 3], U, 2399980690),
        y = u(y, x, w, b, A[h + 10], q, 4293915773),
        b = u(b, y, x, w, A[h + 1], D, 2240044497),
        w = u(w, b, y, x, A[h + 8], N, 1873313359),
        x = u(x, w, b, y, A[h + 15], U, 4264355552),
        y = u(y, x, w, b, A[h + 6], q, 2734768916),
        b = u(b, y, x, w, A[h + 13], D, 1309151649),
        w = u(w, b, y, x, A[h + 4], N, 4149444226),
        x = u(x, w, b, y, A[h + 11], U, 3174756917),
        y = u(y, x, w, b, A[h + 2], q, 718787259),
        b = u(b, y, x, w, A[h + 9], D, 3951481745),
        w = n(w, g),
        b = n(b, m),
        y = n(y, _),
        x = n(x, v);
    var M = p(w) + p(b) + p(y) + p(x);
    return M.toLowerCase()
}