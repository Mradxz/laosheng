var yhqtoken=null;
var jdl = 0;
chrome.runtime.sendMessage({type: "yhq"}, function(r){
	
});
chrome.extension.sendRequest({
			type: "gajax", 
			url: 'http://www.wn.com/index.php?m=api&a=getPluginCore&is_sogou=0&t=' + Math.random() + '&_input_charset=utf-8'
		},function(response){
			if(response.msg == 'ok'){
				var html;
                WNTK_Plugin = {
                    init:function(){
                        console.error("init");
                        this.item_id = this.get_item_id();
                        this.seller_id = this.get_seller_id();
                        this.seller_nick = this.get_seller_nick();
                        this.getLmUid();
                        this.appendMain();
                        this.keyDisplay();
                        this.siteActions();
                    },
                    clickInit:function(){
                        var _this = this;
                        if (_this.item_id && _this.seller_id) {
                            _this.getTyData();
                            _this.getQsData();
                            _this.getWNTKData();
                            _this.initEvent();

//								_this.checkUpdate();
                        }
                    },
                    initEvent:function(){
                        var _this = this;

                        $('.WNTK-plugin-logo').click(function(){
                            $('.WNTK-plugin').slideToggle(200);
                        });

                        $('.WNTK-plugin-lm, .WNTK-plugin-queqiao, .WNTK-plugin-sub').hover(function(){
                            var type = $(this).attr('data-type');
                            $(this).addClass('WNTK-plugin-open');
                            if(type == 1){
                                _this.showTrendData();
                            }else if(type == 2){
                                _this.showUnionData();
                            }else if(type == 3){
                                _this.showQueqiaoList();
                            }else if(type == 4){
                                console.debug('this .WNTK-plugin-sub');
                                //_this.showToolsList();
                            }
                        },function(){
                            $(this).removeClass('WNTK-plugin-open');
                        });

                        $(document).click(function(e) {
                            obj = $(e.srcElement || e.target);
                            var $open = $('.WNTK-plugin-open');
                            if(!obj.is('.WNTK-plugin-open *, .WNTK-layui-layer *, .WNTK-layui-layer-shade, .WNTK-layui-layer-close, .WNTK-layui-layer-btn *')) {
                                $open.removeClass('WNTK-plugin-open');
                            }
                        });

                        $('#WNTK-plugin-queqiao-list').scroll(function() {
                            if ($(this).scrollTop() > 20) {
                                $(".WNTK-plugin-queqiaobox .WNTK-plugin-b,.WNTK-plugin-queqiaobox .WNTK-footer").addClass("top-shadow");
                            } else {
                                $(".WNTK-plugin-queqiaobox .WNTK-plugin-b,.WNTK-plugin-queqiaobox .WNTK-footer").removeClass("top-shadow");
                            }
                        });
                        $('#WNTK-plugin-lm-list').scroll(function() {
                            if ($(this).scrollTop() > 20) {
                                $(".WNTK-plugin-lmbox .WNTK-plugin-b,.WNTK-plugin-lmbox .WNTK-footer").addClass("top-shadow");
                            } else {
                                $(".WNTK-plugin-lmbox .WNTK-plugin-b,.WNTK-plugin-lmbox .WNTK-footer").removeClass("top-shadow");
                            }
                        });
                    },
                    version:0.1,
                    item_id:'',
                    seller_id:'',
                    seller_nick:'',
                    token:'',
                    lmuid:'',
                    tkRate:'',
                    eventRate:'',
                    campaignData:'',
                    ycHtml:'',
                    chartData:'',
                    reason:'',
                    qq_ad:'',
                    tk_ad:'',
                    footer:'',
                    nologin:false,
                    notaoke:false,
                    tqqnologin:false,
                    getUnion:false,
                    Num:0,
                    get_item_id:function(){ //获取商品IID
                        if(window.location.href.indexOf('wntaoke.com') != -1){
                            return false;
                        }
                        if(window.location.href.indexOf('detail.ju.taobao.com') != -1){ //聚划算
                            var itemid = /[\?|&]item_id=(\d+)/.exec(window.location)[1];
                        }else if(window.location.href.indexOf('world.tmall.com') != -1 || window.location.href.indexOf('world.taobao.com') != -1){
                            var itemid = /\/(\d+)\.htm/.exec(window.location)[1];
                        }else{
                            var a=/[\?|&]id=(\d+)/.exec(window.location);
                            if(a!=null && typeof a[1]!='undefined'){
                                itemid = a[1];
                            }
                        }
                        return itemid;
                    },
                    get_seller_id:function(){ //获取店铺ID
                        if(window.location.href.indexOf('detail.ju.taobao.com') != -1){ //聚划算
                            return $('.J_RightRecommend').attr('data-sellerid');
                        }else if(window.location.href.indexOf('chaoshi.detail.tmall.com') != -1){ //天猫超市
                            var d = $("#J_SellerInfo").attr("data-url");
                            var e = d.match(/user_num_id=(\d+)/g);
                            var f = String(e).split("=");
                            return f[1];
                        }else if(window.location.href.indexOf('world.taobao.com') != -1){ //淘宝全球
                            var d = $("#J_listBuyerOnView").attr("data-api");
                            var e = d.match(/seller_num_id=(\d+)/g);
                            var f = String(e).split("=");
                            return f[1];
                        }else if(window.location.href.indexOf('hotel.alitrip.com') != -1 || window.location.href.indexOf('hotel.alitrip.hk') != -1){ //去啊-酒店
                            return $('#J_HotelTitle').attr('data-seller-id');
                        }else{
                            var meta = $('meta[name=microscope-data]').attr('content');
                            if(meta){
                                var userid = /userid=(\d+)/.exec(meta)[1];
                                return userid;
                            }
                        }
                    },
                    get_seller_nick:function(){ //获取旺旺昵称
                        var nick = $('.J_WangWang').attr('data-nick');
                        if(window.location.href.indexOf('chaoshi.detail.tmall.com') != -1){
                            nick = '天猫超市';
                        }
                        if(window.location.href.indexOf('hotel.alitrip.com') != -1){
                            nick = $('.service-group').attr('data-nick');
                        }
                        if(nick == undefined && window.location.href.indexOf('item.taobao.com') != -1){
                            var meta = $('meta[name=description]');
                            var str = meta.attr('content');
                            var arr = str.match(/请进入(.*)的/);
                            nick = arr[1];
                        }
                        return decodeURIComponent(nick);
                    },
                    campaignTpl:'{{# for(var i = 0, len = d.length; i < len; i++){ }}\
										<tr id="campaignId_{{ d[i].campaignId }}">\
											<td>{{ d[i].campaignName }}</td>\
											<td>{{# if(d[i].campaignType == 2){ }}定向{{# }else{ }}通用{{# } }}</td>\
											<td>{{# if(d[i].properties == 3){ }}是{{# }else{ }}否{{# } }}<span class="auditStatus"></span></td>\
											<td>{{ d[i].avgCommissionToString }}</td>\
											<td class="commissionRatePercent" data-campaignid="{{ d[i].campaignId }}" data-shopkeeperid="{{ d[i].shopKeeperId }}"><i></i></td>\
											<td><a href="http://pub.alimama.com/myunion.htm?#!/promo/self/campaign?campaignId={{ d[i].campaignId }}&shopkeeperId={{d[i].shopKeeperId}}&userNumberId={{ WNTK_Plugin.seller_id }}" class="blue-link" target="_blank">详情</a></td>\
											<td>{{# if(d[i].campaignType == 2){ }}<a href="javascript:void(0)" class="ApplyForPlan blue-link" data-campaignid="{{ d[i].campaignId }}" data-shopkeeperid="{{ d[i].shopKeeperId }}">申请</a>{{# } }}</td>\
										</tr>\
									{{# } }}',
                    couponTpl:'{{# for(var i = 0, len = d.length; i < len; i++){ }}\
										<tr>\
											<td>满 {{ d[i].applyAmount }} 减 {{ d[i].amount }}</td>\
											<td>{{ d[i].time }}</td>\
											<td class="couponCount" data-sellerId="{{ d[i].sellerId }}" data-activityId="{{ d[i].activityId }}"><i></i></td>\
											<td><i></i></td>\
											<td><i></i></td>\
											<td><a href="javascript:void(0)" data-href="//shop.m.taobao.com/shop/coupon.htm?sellerId={{ d[i].sellerId }}&activityId={{ d[i].activityId }}" class="CouponUrl blue-link">领取</a></td>\
											<td><a href="javascript:void(0)" class="GenerateDwz blue-link">复制</a></td>\
										</tr>\
									{{# } }}',
                    pluginTpl:'<div class="WNTK-plugin" style="display:none">\
										<ul>\
											<li class="WNTK-plugin-logo" title="点击隐插件"></li>\
											<li class="WNTK-plugin-lm" data-type="2">\
												<div class="WNTK-plugin-ainside"><i class="icon ty"></i><span id="WNTK-plugin-lm-data">正在查询...</span></div>\
												<div class="WNTK-plugin-lmbox">\
													<div class="WNTK-plugin-b">\
														<a href="http://www.wntaoke.com" class="WNTK-plugin-l" target="_blank"></a>\
														<form class="WNTK-plugin-search" action="http://www.wntaoke.com/index.php" method="get" target="_blank" accept-charset="UTF-8">\
															<input type="hidden" name="mod" id="mod" value="promo">\
															<input type="text" placeholder="请输入关键字或宝贝网址(全网)" name="q">\
															<input type="submit" value="">\
														</form>\
														<div class="f-cb"></div>\
														<div class="top-shadow"></div>\
													</div>\
													<div id="WNTK-plugin-lm-list">\
														<div class="detail">\
															<div class="f-fl commission">\
																<ul class="f-cl">\
																	<li class="label f-fl">通用佣金：</li>\
																	<li class="commission_rate f-fl" id="WNTK-plugin-tkRate"></li>\
																</ul>\
																<ul class="f-cl">\
																	<li class="label f-fl">生成链接：</li>\
																	<li class="tlink f-fl">\
																		<a href="javascript:void(0)" class="blue-link" id="WNTK-plugin-tg">QQ提取</a>\
																		<a href="javascript:void(0)" class="blue-link" id="WNTK-plugin-lm-tg" target="_blank">联盟生成</a>\
																	</li>\
																</ul>\
															</div>\
															<div class="f-fr tuiguang_info">\
																<ul class="jiaoyi">\
																	<li class="count f-tac" id="WNTK-plugin-totalNum"></li>\
																	<li class="danwei f-tac">月推广量 / 件</li>\
																</ul>\
																<ul class="yongjin">\
																	<li class="count f-tac" id="WNTK-plugin-totalFee"></li>\
																	<li class="danwei f-tac">月支出佣金 / 元</li>\
																</ul>\
															</div>\
														</div>\
														<div id="WNTK-plugin-tkad"></div>\
														<table class="m-table">\
															<thead><tr><th>计划名</th><th width="50">类型</th><th width="60">审核</th><th width="60">平均佣金</th><th width="50">佣金</th><th width="50">详情</th><th width="50">操作</th></tr></thead>\
															<tbody id="campaignList"><tr><td colspan="7">正在获取推广计划，请稍后<i></i></td></tr></tbody>\
														</table>\
														<table class="m-table">\
															<thead><tr><th>优惠券</th><th width="100">有效期</th><th width="55">已领</th><th width="55">总共</th><th width="50">限领</th><th width="50">领取</th><th width="50">复制</th></tr></thead>\
															<tbody id="couponList"><tr><td colspan="7">正在获取优惠券，请稍后<i></i><br><span class="red">小提示：优惠券获取速度慢？请登录联盟或淘宝后再试！速度杠杠滴！</td></tr></tbody>\
														</table>\
													</div>\
												</div>\
											</li>\
											<li class="WNTK-plugin-queqiao" data-type="3">\
												<div class="WNTK-plugin-ainside"><i class="icon qq"></i><span id="WNTK-plugin-queqiao-data">正在查询...</span></div>\
												<div class="WNTK-plugin-queqiaobox">\
													<div class="WNTK-plugin-b">\
														<a href="http://www.wntaoke.com" class="WNTK-plugin-l" target="_blank"></a>\
														<form class="WNTK-plugin-search" action="http://www.wntaoke.com/index.php" method="get" target="_blank" accept-charset="UTF-8">\
															<input type="text" value="" placeholder="请输入关键字或宝贝网址(鹊桥)" name="q">\
															<input type="submit" value="">\
														</form>\
														<div class="f-cb"></div>\
														<div class="top-shadow"></div>\
													</div>\
													<div id="WNTK-plugin-queqiao-list">\
														<div class="detail">\
															<div class="f-fl commission">\
																<ul class="f-cl">\
																	<li class="label f-fl">鹊桥佣金：</li>\
																	<li class="commission_rate f-fl" id="WNTK-plugin-eventRate"></li>\
																</ul>\
																<ul class="f-cl">\
																	<li class="label f-fl">生成链接：</li>\
																	<li class="tlink f-fl">\
																		<a href="javascript:void(0)" class="blue-link" id="WNTK-plugin-eventtg">一键生成</a>\
																		<a href="javascript:void(0)" class="blue-link" id="WNTK-plugin-lm-eventtg" target="_blank">联盟生成</a>\
																	</li>\
																</ul>\
															</div>\
															<div class="f-fr tuiguang_info">\
																<ul class="jiaoyi">\
																	<li class="count f-tac" id="WNTK-plugin-eventzigou"></li>\
																	<li class="danwei f-tac">自购价格 / 元</li>\
																</ul>\
																<ul class="yongjin">\
																	<li class="count f-tac" id="WNTK-plugin-eventendtime"></li>\
																	<li class="danwei f-tac">活动总共 / 天</li>\
																</ul>\
															</div>\
														</div>\
														<div id="WNTK-plugin-qqad"></div>\
														<div id="WNTK-plugin-qqget"></div>\
													</div>\
												</div>\
											</li>\
											<li class="WNTK-plugin-sub" title="此商品当前在线人数" data-type="4"></li>\
											<li class="WNTK-plugin-clickInit" title="点击查询" data-type="5">点击查询</li>\
										</ul>\
									</div>',
                    appendMain:function(){
                        var _this = this;
                        chrome.extension.sendRequest({type: "set"}, function(response) {
                            _this.reason = response.reason;
                            _this.token = response.token;
                            $('ul.tb-meta,.tm-fcs-panel,.description,.detail-ind,.base-area,.item-service').after(_this.pluginTpl).next().find(".WNTK-plugin-clickInit")
                                .click(function(){
                                    _this.clickInit();
                                });
                            $('.tb-property').css('z-index',3);
                            if (response.hidden != 'true') {
                                $('.WNTK-plugin').slideDown();
                            }
                            _this.getViewCount();
                        });
                    },

                    getTyData:function(){
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'http://pub.alimama.com/items/search.json?q='+encodeURIComponent('http://item.taobao.com/item.htm?id='+_this.item_id)+'&perPageSize=50'
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.data.pageList != null){
                                    var pageList = response.data.data.pageList[0];
                                    _this.zkPrice = pageList.zkPrice;
                                    _this.tkRate = pageList.tkRate;
                                    _this.eventRate = pageList.eventRate;
                                    console.debug("pageList.eventRate="+pageList.eventRate);

                                    _this.campaignData = pageList.tkSpecialCampaignIdRateMap;
                                    //通用
                                    $('#WNTK-plugin-lm-data').html('通用佣金<span class="WNTK-plugin-price">' + pageList.tkRate + '%</span>');
                                    $('#WNTK-plugin-tkRate').html(pageList.tkRate + '% <span class="true-rmb">（¥'+pageList.tkCommFee+'）</span>');
                                    $('#WNTK-plugin-totalNum').html(pageList.totalNum);
                                    $('#WNTK-plugin-totalFee').html(pageList.totalFee);
                                    $('#WNTK-plugin-lm-tg').click(function(){
                                        window.open('http://pub.alimama.com/promo/search/index.htm?q='+encodeURIComponent('http://item.taobao.com/item.htm?id=' + _this.item_id));
                                    });
                                    $('#WNTK-plugin-lm-eventtg').click(function(){
                                        window.open('http://pub.alimama.com/promo/item/channel/index.htm?q='+encodeURIComponent('http://item.taobao.com/item.htm?id=' + _this.item_id)+'&channel=qqhd');
                                    });

                                    $('#WNTK-plugin-tg').click(function(){//生成鹊桥推广链接
                                        var html='<div class="WNTK-plugin"><table class="m-table"><thead><tr><td>联系方式</td><td>提取原文案</td></tr></thead><tbody>';
                                        var qqarr=_this.xiangqing.qqarr;
                                        var textarr=_this.xiangqing.textarr;
                                        for(var i in qqarr){
                                            html+="<tr><td><a>"+qqarr[i]+"</a></td><td><a>"+textarr[i]+"</a></td></tr>";
                                        }
                                        html+='</tbody></table></div>';
                                        if(_this.xiangqing.qqarr.length>0){
                                            layer.open({
                                                type: 1,
                                                area: ['1000px', '530px'],
                                                title: "计划中的联系方式提取",
                                                closeBtn: 0,
                                                shadeClose: true,
                                                skin: 'yourclass',
                                                content: html
                                            });

                                        }else{
                                            layer.msg("未匹配到QQ等联系方式");
                                        }
                                    });
                                    //鹊桥
                                    if(pageList.eventRate){
                                        var eventCommFee = Math.round(pageList.zkPrice*pageList.eventRate)/100;
                                        $('#WNTK-plugin-queqiao-data').html('鹊桥最高<span class="WNTK-plugin-price">' + pageList.eventRate + '%</span>');
                                        $('#WNTK-plugin-eventRate').html(pageList.eventRate + '% <span class="true-rmb">（¥'+eventCommFee+'）</span>');
                                        $('#WNTK-plugin-eventzigou').html(Math.round((pageList.zkPrice-eventCommFee)*100)/100);
                                        $('#WNTK-plugin-eventendtime').html(pageList.dayLeft);
                                    }else{
                                        $('#WNTK-plugin-queqiao-data').html('无鹊桥佣金');
                                    }
                                }else{
                                    _this.notaoke = true;
                                    $('#WNTK-plugin-lm-data').html('无通用佣金');
                                    $('#WNTK-plugin-queqiao-data').html('无鹊桥佣金');
                                }
                            }else{
                                $('#WNTK-plugin-lm-data,#WNTK-plugin-queqiao-data').html('查询失败');
                            }
                        });
                    },
                    xiangqing:{"qqarr":[],"textarr":[]},
                    getCampaignList:function(){
                        var _this = this;
                        if(_this.nologin == true){
                            _this.nologin = true;
                            $('#campaignList').html('<tr><td colspan="7" style="padding:0"><span class="login-btn">点击登录淘宝联盟后再查询</span></td></tr>');
                            $('.login-btn').click(function(){
                                _this.openLmLogin(1);
                            });
                            return false;
                        }
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'http://pub.alimama.com/shopdetail/campaigns.json?oriMemberId=' + _this.seller_id + '&_input_charset=utf-8'
                        },function(response){
                            if(response.msg == 'ok'){
                                console.log("response.data.data=");
                                console.log(response.data)
                                var reg=/访问受限了/gm;
                                if(reg.test(response.data)){
                                    layer.alert('访问受限了，请尝试刷新浏览器重新获取计划，谢谢合作')
                                }
                                console.warn(response);
                                if(response.data.data.campaignList&&response.data.data.campaignList.length > 0){
                                    var clist=response.data.data.campaignList;
                                    for(var i in clist){
                                        if(i){
                                            var campaignName=clist[i].campaignName;
                                            if(campaignName){
                                                var reg=/\d{5,15}/gm;
                                                var qq=campaignName.match(reg);

                                                if(qq){
                                                    for(var x in qq){
                                                        if($.inArray(qq[x],_this.xiangqing.qqarr)==-1){
                                                            _this.xiangqing.qqarr.push(qq[x]);
                                                            _this.xiangqing.textarr.push(campaignName);
                                                        }
                                                    }
                                                }
                                            }
                                            var campaignComments=clist[i].campaignComments;
                                            if(campaignComments){
                                                var reg=/\d{5,15}/gm;
                                                var qq=campaignComments.match(reg);

                                                if(qq){
                                                    for(var x in qq){
                                                        if($.inArray(qq[x],_this.xiangqing.qqarr)==-1){
                                                            _this.xiangqing.qqarr.push(qq[x]);
                                                            _this.xiangqing.textarr.push(campaignComments);
                                                        }
                                                    }
                                                }

                                            }

                                        }

                                    }
                                    console.log(_this.xiangqing);

                                    laytpl(_this.campaignTpl).render(response.data.data.campaignList, function(html){
                                        $('#campaignList').empty().append(html);
                                        $('#campaignId_0').find('.commissionRatePercent').text(_this.tkRate+'%').removeClass('commissionRatePercent');
                                        _this.getHiddenPlan(response.data.data.campaignList[0].shopKeeperId);
                                        setTimeout(function(){
                                            _this.exsitApplyList(response.data.data.exsitApplyList);
                                            $('.ApplyForPlan').click(function() {
                                                $(this).html('<i></i>');
                                                _this.postApplyForPlan($(this).attr('data-campaignid'),$(this).attr('data-shopkeeperid'));
                                            });
                                            $('.ExitCampaign').click(function() {
                                                $(this).html('<i></i>');
                                                _this.getPubCampaignid($(this).attr('data-campaignid'));
                                            });
                                        },300);
                                    });
                                }
                            }
                        });
                    },
                    getHiddenPlan:function(shopKeeperId){
                        var _this = this;
                        var obj = _this.campaignData;
                        if(obj != null){
                            for(i in obj){
                                var tkRate=parseFloat(obj[i]);
                                if(i.indexOf('-') != -1){
                                    var campaignId=i.replace('-','');
                                    chrome.extension.sendRequest({
                                        type: "gajax",
                                        url: 'http://pub.alimama.com/campaign/campaignDetail.json?campaignId='+campaignId+'&shopkeeperId='+shopKeeperId
                                    },function(response){
                                        if(response.msg == 'ok'){
                                            var campaignId = response.data.data.cpsCampaignDO.campaignId;
                                            for(i in obj){
                                                if(i.indexOf('-') != -1){
                                                    var id=i.replace('-','');
                                                    if (id == campaignId){
                                                        var tkRate=parseFloat(obj[i]);
                                                    }
                                                }
                                            }
                                            var h = '<tr id="campaignId_'+campaignId+'"><td>'+response.data.data.cpsCampaignDO.campaignName+'</td><td>隐</td><td>是<span class="auditStatus"></span></td><td>'+response.data.data.cpsCampaignDO.avgCommissionToString+'</td><td>'+tkRate+'%</td><td><a href="http://pub.alimama.com/myunion.htm?#!/promo/self/campaign?campaignId='+campaignId+'&shopkeeperId='+shopKeeperId+'&userNumberId='+_this.seller_id+'" class="blue-link" target="_blank">详情</a></td><td><a href="javascript:void(0)" class="ApplyForPlan blue-link" data-campaignid="'+campaignId+'" data-shopkeeperid="'+shopKeeperId+'">申请</a></td></tr>';
                                            $('#campaignList').append(h);
                                        }
                                    });
                                }else{
                                    $('#campaignId_'+i).find('.commissionRatePercent').html(tkRate+'%');
                                }
                            }
                        }else{
                            $(document).find('.commissionRatePercent').each(function(){
                                _this.getCampaignGoods($(this).attr('data-campaignid'),$(this).attr('data-shopkeeperid'),1,$(this));
                            });
                        }
                    },
                    exsitApplyList:function(arr){
                        var _this = this;
                        if(arr){
                            for (var i=0;i<arr.length;i++){
                                var t=$('#campaignId_'+arr[i].campaignId);
                                if(arr[i].status==1){
                                    t.find('.auditStatus').html('<span class="red">(待审)</span>');
                                    t.find('.ApplyForPlan').html('');
                                }else if(arr[i].status==2){
                                    t.find('.auditStatus').html('<span class="green">(已过)</span>');
                                    t.find('.ApplyForPlan').parent().html('<a href="javascript:void(0)" class="ExitCampaign red" data-campaignid="'+arr[i].campaignId+'">退出</a>');
                                }
                            }
                        }
                    },


                    getCampaignGoods:function(campaignId,shopkeeperId,toPage,t){
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'http://pub.alimama.com/campaign/merchandiseDetail.json?campaignId='+campaignId+'&shopkeeperId='+shopkeeperId+'&userNumberId='+_this.seller_id+'&tab=2&omid='+_this.seller_id+'&toPage='+toPage+'&perPagesize=10&_input_charset=utf-8'
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.hasOwnProperty('data') == false){
                                    return false;
                                }else if(response.data.data.hasOwnProperty('pagelist') && response.data.data.pagelist.length > 0){
                                    var pagelist = response.data.data.pagelist;
                                    for (var i=0;i<pagelist.length;i++){
                                        if(pagelist[i].auctionId==_this.item_id){
                                            var commissionRate = pagelist[i].commissionRatePercent+'%';
                                            t.html(commissionRate);
                                        }
                                    }
                                    if(toPage>50){
                                        t.html('请手动');
                                        return false;
                                    }else if(!commissionRate){
                                        _this.getCampaignGoods(campaignId,shopkeeperId,toPage+1,t);
                                    }
                                }else{
                                    t.html('请手动');
                                }
                            }
                        });
                    },
                    postApplyForPlan:function(campId,keeperid){ //申请定向计划
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "pajax",
                            url: 'http://pub.alimama.com/pubauc/applyForCommonCampaign.json',
                            postdata:{campId:campId,keeperid:keeperid,applyreason:_this.reason,_tb_token_:_this.token}
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.hasOwnProperty('info') == false){
                                    _this.nologin = true;
                                    _this.openLmLogin();
                                }else{
                                    if(response.data.ok == true){
                                        _this.getCampaignList();
                                    }else{
                                        if(response.data.info.message != null){
                                            layer.alert(response.data.info.message, {icon: 5});
                                            $('#campaignId_'+campId).find('.ApplyForPlan').text('申请');
                                        }
                                    }
                                }
                            }else{
                                layer.alert('网络错误或联盟登录失效', {icon: 5});
                            }
                        });
                    },
                    getPubCampaignid:function(campId){
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'http://pub.alimama.com/campaign/joinedCampaigns.json?toPage=1&nickname='+encodeURIComponent(_this.seller_nick)+'&perPageSize=40&_tb_token_='+_this.token+'&_input_charset=utf-8'
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.hasOwnProperty('data') == false){
                                    _this.nologin = true;
                                    _this.openLmLogin();
                                }else{
                                    if(response.data.data.hasOwnProperty('pagelist') && response.data.data.pagelist.length > 0){
                                        var pagelist = response.data.data.pagelist;
                                        for (var i=0;i<pagelist.length;i++){
                                            if(pagelist[i].campaignId==campId){
                                                _this.postExitCampaign(pagelist[i].id);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    },
                    postExitCampaign:function(id){
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "pajax",
                            url: 'http://pub.alimama.com/campaign/exitCampaign.json',
                            postdata:{pubCampaignid:id,_tb_token_:_this.token}
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.ok == true){
                                    _this.getCampaignList();
                                }else{
                                    if(response.data.info.message != null){
                                        layer.alert(response.data.info.message, {icon: 5});
                                    }else{
                                        layer.alert('退出失败，原因未知！', {icon: 5});
                                    }
                                }
                            }else{
                                layer.alert('网络错误或联盟登录失效', {icon: 5});
                            }
                        });
                    },
                    getCoupon:function(){
                        var _this = this;
//							if(_this.nologin == true){
//								_this.getCouponList();
//								return false;
//							}
//							$.getJSON('https://cart.taobao.com/json/GetPriceVolume.do?sellerId=' + _this.seller_id,function(d){
//							});
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'https://cart.taobao.com/json/GetPriceVolume.do?sellerId=' + _this.seller_id
                        },function(response){
                            console.log(response)
                            if(response.msg == 'ok'){
                                if(response.data.indexOf("priceVolumes") > 0){
                                    var d = JSON.parse(response.data);
                                    var list = d.priceVolumes;
                                    if(list != null && list.length > 0){
                                        var h = '', e = [];
                                        for (var i = 0; i < list.length; i++) {
                                            h+= '<tr><td class="cartCouponTitle"><i></i></td><td class="couponDate"><i></i></td><td class="couponCount" data-sellerId="'+_this.seller_id+'" data-activityId="'+list[i].id+'"><i></i></td><td><i></i></td><td><i></i></td><td><a href="javascript:void(0)" data-href="//shop.m.taobao.com/shop/coupon.htm?sellerId='+_this.seller_id+'&activityId='+list[i].id+'" class="CouponUrl blue-link">领取</a></td>'+
                                                '<td><a href="javascript:void(0)" data-clipboard-text="//shop.m.taobao.com/shop/coupon.htm?sellerId='+_this.seller_id+'&activityId='+list[i].id+'" class="GenerateDwz blue-link">复制</a></td></tr>';
                                            var f = new Object();
                                            f['activityId'] = list[i].id;
                                            e.push(f);
                                        }
                                        $('#couponList').html(h);
                                        $('#couponList tr').find('.couponCount').each(function(){
                                            console.warn('627')
                                            _this.getCouponCount($(this).attr('data-sellerId'),$(this).attr('data-activityId'),$(this));
                                            return false;
                                        });
                                    }else{
                                        $('#couponList').html('');
                                    }
                                    _this.getHiddenCoupon(e);
                                }else{
//										_this.getCouponList();
                                }
                            }
                        });
                    },
                    getCouponList:function(){
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'http://ff.win.taobao.com/promotion.htm?id=' + _this.seller_id + '&cc=taoke&aid=0#0'
                        },function(response){
                            if(response.msg == 'ok'){
                                var b, c, e, f, h, k, l;
                                var n = new RegExp("系统错误");
                                b = response.data;
                                if (n.test(b) && 20 >= _this.Num) return _this.Num++,
                                    void _this.getCouponList();
                                if (_this.Num > 20) return;
                                l = b.replace(/(\s{2,}|\n)/gim, "");
                                h = /\x3c!-- 金额券 start --\x3e(.*?)\x3c!-- 金额券 end --\x3e/g;
                                for (e = []; null !== (b = h.exec(l));) {
                                    k = /(<span class="mod-a-a-b">(\d*\.*\d*)<\/span>|<span class="num mod-a-c-b">(.*?)有效<\/span>|<span class="num">(\d*\.*\d*)<\/span>|<span href="\/\/taoquan\.taobao\.com\/coupon\/unify_apply\.htm\?sellerId=(\d*)&activityId=(.*)" class="get-btn")/gim;
                                    for (f = {}; null !== (c = k.exec(b[1]));)"undefined" != typeof c[2] && (f.amount = c[2]),
                                    "undefined" != typeof c[3] && (f.time = c[3]),
                                    "undefined" != typeof c[4] && (f.applyAmount = c[4]),
                                    "undefined" != typeof c[5] && (f.sellerId = c[5]),
                                    "undefined" != typeof c[6] && (f.activityId = c[6]);
                                    e.push(f)
                                }
                                laytpl(_this.couponTpl).render(e, function(html){
                                    $('#couponList').html(html);
                                    $('#couponList tr').find('.couponCount').each(function(){
                                        console.warn('668')
                                        _this.getCouponCount($(this).attr('data-sellerId'),$(this).attr('data-activityId'),$(this));
                                    });
                                });
                                _this.getHiddenCoupon(e);
                            }
                        });
                    },
                    getHiddenCoupon:function(e){
                        var _this = this;
                        $('#couponList').after('<tr id="getHiddenCoupon"><td colspan="7">正在获取隐券，请稍后<i></i></td></tr>');
                        var version='17.5.23',versionCode='52',uid='',url='http://www.qingtaoke.com/api/UserPlan/UserCouponList',k=version + "q" + versionCode + "t" + uid + "k" + url + "q";
                        function vc(a) {
                            var b, c, d, e, f;
                            for (f = 3125363, c = d = 0, e = a.length; d < e; c = ++d) b = a[c], f += b.charCodeAt(0) << c % 8;
                            return f
                        }

                        chrome.extension.sendRequest({
                            type: "phajax",
                            url: url,
                            postdata:{sid:_this.seller_id,gid:_this.item_id},
                            head:{
                                version: version,
                                versionCode:versionCode,
                                uid: '',
                                vc: vc(k)
                            }
                        },function(response){
                            if(response.msg == 'ok'){
                                var d = response.data.data;
                                console.log(d)
                                if (d != null && d.length > 0){
                                    var h = '';
                                    for (var i = 0; i < d.length; i++ ){
                                        h+= '<tr><td class="couponTitle"><i></i></td><td class="couponDate"><i></i></td><td class="couponHiddenCount" data-sellerId="'+_this.seller_id+'" data-activityId="'+d[i].activityId+'"><i></i></td><td><i></i></td><td><i></i></td><td><a href="javascript:void(0)" data-href="//shop.m.taobao.com/shop/coupon.htm?sellerId='+_this.seller_id+'&activityId='+d[i].activityId+'" class="CouponUrl blue-link">领取</a></td>'+
                                            '<td><a href="javascript:void(0)" data-clipboard-text="//shop.m.taobao.com/shop/coupon.htm?sellerId='+_this.seller_id+'&activityId='+d[i].activityId+'" class="GenerateDwz blue-link">复制</a></td></tr>';
                                    }
                                    $('#getHiddenCoupon').empty().after(h);
                                    $(document).find('.couponHiddenCount').each(function(){
                                        console.warn('708')
                                        _this.getCouponCount($(this).attr('data-sellerId'),$(this).attr('data-activityId'),$(this));
                                        return false;
                                    });
                                }else{
                                    $('#getHiddenCoupon').empty();
                                    if (e == '' || e == undefined){
                                        $('#couponList').html('<tr><td colspan="7">该商品暂无优惠券</td></tr>');
                                    }
                                }
                            }
                            $('.CouponUrl').click(function(){
                                _this.layerOpen($(this).attr('data-href'),2,0,false,480,500);
                            });
                            $('.GenerateDwz').on("click",function(){
                                new Clipboard('.GenerateDwz').on('success', function(e) {
                                    layer.msg("复制成功^^");
                                }).on('error', function(e) {
                                    layer.msg("复制失败~");
                                });
//									_this.layerOpen('https://www.wntaoke.com/index.php?m=user&a=coupon&url='+encodeURIComponent($(this).parent().parent().find('.CouponUrl').attr('data-href'))+'&plugin=1',2,0,false,650,510);
                            });
                        });
                    },
                    getCouponCount:function(sellerId,activityId,t){
                        var _this = this;
                        console.log({sellerId:sellerId,activityId:activityId});
                        chrome.extension.sendRequest({
                            type: "getyhq",
                            getdata:{sellerId:sellerId,activityId:activityId}
                        },function(response){
                            console.error('111122222222221111')
                            if(response.msg == 'ok2'){
                                console.error(response);
                                console.warn('ok2');
                            }
                            if(response.msg == 'ok'){
                                var d=response.data;
                                console.warn('getyhqstart');
                                console.warn(d);
                                console.warn('getyhqend');

                                if(d != null){
//										_this.updateConpon(sellerId,activityId);
                                    d.startTime=d.startTime.match(/\b(\d{2}-\d{2})/g)[0];
                                    d.defaultValidityCopywriter=d.defaultValidityCopywriter.match(/\b(\d{2}\.\d{2})\b/g)[0];
                                    t.text(d.appliedCount);//已领
                                    t.next().text(parseInt(d.totalCount) );//总共
                                    t.next().next().text(d.personLimitCount);//限领
                                    var titletxt='';
                                    console.log("_this.zkPrice"+_this.zkPrice+">="+parseInt(d.startFee/100));
                                    if(_this.zkPrice&&_this.zkPrice>=parseInt(d.startFee/100)){
                                        titletxt="<a class='red' title='符合使用标准(只做参考)'>"+'满 '+parseInt(d.startFee/100)+' 减 '+parseInt(d.discount/100)+"</a>";
                                    }else{
                                        titletxt='满 '+parseInt(d.startFee/100)+' 减 '+parseInt(d.discount/100);
                                    }
                                    t.parent('tr').find('.cartCouponTitle').html(titletxt);

                                    if(_this.zkPrice&&_this.zkPrice>=parseInt(d.startFee/100)){
                                        titletxt="<a class='red' title='符合使用标准(只做参考)'>"+'满 '+parseInt(d.startFee/100)+' 减 '+parseInt(d.discount/100)+'（隐）'+"</a>";
                                    }else{
                                        titletxt='满 '+parseInt(d.startFee/100)+' 减 '+parseInt(d.discount/100)+'（隐）';
                                    }
                                    t.parent('tr').find('.couponTitle').html(titletxt);
                                    t.parent('tr').find('.couponDate').text(d.startTime+' ~ '+d.defaultValidityCopywriter);
                                }else{
                                    t.parent('tr').remove();
                                }
                            }else{
                                console.error('222222')
                                setTimeout(function(){
                                    console.warn('778')
                                    _this.getCouponCount(sellerId,activityId,t);
                                },100);
                            }
                        });
                    },

                    updateConpon:function(seller_id,activity_Id){
                        var url='https://www.wntaoke.com/index.php?m=api&a=coupon&sid='+seller_id+'&aid='+activity_Id;
                        console.debug("update coupon url="+url);
                        $.ajax({
                            dataType: "json",
                            url: url,
                            success: function(c) {
                                if(c.status=='1'){
                                    console.debug("coupon ok!");
                                }
                                else{
                                    console.debug('back='+c.msg);
                                }
                            }
                        });
                    },
                    getViewCount:function(){
                        var _this = this;
                        var url,c;
                        url= 'https://lu.taobao.com/api/item?type=view_count&id='+_this.item_id+'&_ksTS=1412581003175_109&callback=1&p=u&from=mypath&f=jp'

                        $.ajax({
                            dataType: "text",
                            url: url,
                            success: function(c) {

                                c = JSON.parse(c.slice(2, -1)),
                                    c.listDesc && c.listDesc.view_count ? $(".WNTK-plugin-sub").html('<i class="icon count"></i>在线：<b>'+c.listDesc.view_count+"</b>") : (b || (b = 0), $(".WNTK-plugin-sub").html('<i class="icon count"></i>在线：<b>未知</b>'));
                            }
                        });



                    },


                    checkUpdate:function(){

                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "pajax",
                            url: 'http://www.wntaoke.com/index.php?m=api&a=update',
                            postdata:{ver: _this.version}
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.version > _this.version){
                                    $('.WNTK-plugin').before(response.data.update);//版本升级检测
                                }
                            }
                        });

                        var url='https://www.wntaoke.com/index.php?m=api&a=checklogin';
                        console.debug("get url="+url);
                        $.ajax({
                            dataType: "json",
                            url: url,
                            success: function(c) {
                                if(c.login=='1'){
                                    _this.tqqnologin = false;
                                    console.debug("user login");
                                }
                                else{
                                    _this.tqqnologin = true;
                                    console.debug('user not login');
                                }
                            }
                        });




                    },

                    getWNTKData:function(){
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "pajax",
                            url: 'http://www.haozhebao.com/index.php?mod=inc&act=pluginAjax&do=webData',
                            postdata:{iid:_this.item_id}
                        },function(response){
                            if(response.msg == 'ok'){

                                //$('#WNTK-plugin-tkad').html(response.data.tk_ad);
                                //$('#WNTK-plugin-qqad').html(response.data.qq_ad);

                            }
                        });
                    },
                    getQsData:function(){
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "pajax",
                            url: 'http://www.haozhebao.com/index.php?mod=inc&act=pluginAjax&do=priceTrend',//获取图表
                            postdata:{iid:_this.item_id,url:window.location.href}
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.status == 1){
                                    _this.chartData = response.data.priceHistory;
                                    $('#PricePoint').html(response.data.PricePoint);
                                    $('#priceTrend').html(response.data.priceTrend);
                                    console.debug('response.data.priceTrend='+response.data.priceTrend);
                                }else{
                                    $('#WNTK-plugin-container').html('<div class="WNTK-loading">获取价格走势图失败，该商品未收录或已下架</div>');
                                    $('#WNTK-plugin-container').after(_this.footer);
                                }
                            }
                        });
                    },
                    showTrendData:function(){
                        var _this = this;
                        if($('#WNTK-plugin-container').html() == ''){
                            $('#WNTK-plugin-container').highcharts({
                                chart: {
                                    plotBorderColor: '#E6E6E6',
                                    plotBorderWidth: 1
                                },
                                exporting: {
                                    enabled: true
                                },
                                plotOptions: {
                                    series: {
                                        shadow: false,
                                        lineWidth: 2
                                    }
                                },
                                title: {
                                    text: ''
                                },
                                colors: ['#FC412D'],
                                xAxis: {
                                    type: 'datetime',
                                    title: {
                                        text: null
                                    },
                                    labels: {
                                        formatter: function() {
                                            var vDate=new Date(this.value);
                                            return (vDate.getMonth()+1)+"/"+vDate.getDate();
                                        },
                                        align: 'center'
                                    },
                                    lineWidth: 0,
                                    tickColor: '#E6E6E6',
                                    tickWidth: 1,
                                    tickLength: 5,
                                    gridLineWidth: 1,
                                    gridLineColor: '#E6E6E6'
                                },
                                yAxis: {
                                    title: {
                                        text: null
                                    },
                                    gridLineColor: '#E6E6E6'
                                },
                                tooltip: {
                                    borderWidth: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    borderRadius: 8,
                                    shadow: false,
                                    style: {
                                        color:'#fff'
                                    },
                                    formatter: function() {
                                        return '日期：' + Highcharts.dateFormat('%Y/%m/%d', this.x) + '<br/>' + this.series.name + '：¥' + this.y;
                                    }
                                },
                                legend: {
                                    enabled: false
                                },
                                series: [{
                                    name: '价格',
                                    data: _this.chartData
                                }],
                            });
                            $('#WNTK-plugin-container').after(_this.footer);
                        }
                    },

                    showToolsList:function(){
                        var _this = this;
                        if($('#WNTK-plugin-container').html() == ''){



                            $('#WNTK-plugin-container').after(_this.footer);
                        }
                    },

                    showUnionData:function(){
                        var _this = this;
                        if(_this.notaoke == false){
                            if(_this.getUnion == false){
                                _this.getUnion = true;
                                _this.getCampaignList();
                                _this.getCoupon();
                            }
                        }else{
                            $('#WNTK-plugin-lm-list').html('<div class="WNTK-loading">该宝贝可能已经下架或者没有加入淘宝客</div>');
                        }

                        if($('.WNTK-plugin-lmbox .WNTK-footer').length == 0){
                            $('#WNTK-plugin-lm-list').after(_this.footer);
                        }
                    },
                    showQueqiaoList:function(){
                        var _this = this;
                        if(_this.notaoke == true || !_this.eventRate){
                            $('#WNTK-plugin-queqiao-list').html('<div class="WNTK-loading">该宝贝未参加鹊桥活动或已下架</div>');
                            if($('.WNTK-plugin-queqiaobox .WNTK-footer').length == 0){
                                $('#WNTK-plugin-queqiao-list').after(_this.footer);
                            }
                            return false;
                        }
                        if($('#WNTK-plugin-qqget').html() == ''){
                            $('#WNTK-plugin-qqget').html('<div class="WNTK-loading"><div class="WNTK-loading-img"></div><div class="WNTK-loading-tip">正在获取数据，请稍候...</div></div>');
                            $('#WNTK-plugin-queqiao-list').after(_this.footer);
                            chrome.extension.sendRequest({
                                type: "pajax",
                                url: 'http://www.haozhebao.com/index.php?mod=inc&act=pluginAjax&do=qqList',
                                postdata:'iid=' + _this.item_id
                            },function(response){
                                if(response.msg == 'ok'){
                                    var str=response.data.data;
                                    str=str.replace(/HZB/g,'WNTK');
                                    str=str.replace(/www\.haozhebao\.com\/deal\//g,'www.wntaoke.com/index.php?m=queqiao&a=show&id=');
                                    str=str.replace(/\.html"/g,'"');
                                    $('#WNTK-plugin-qqget').html(str);
                                    $('.WNTK-plugin-tg').click(function(){
                                        if(_this.tqqnologin == true){
                                            if($this.attr('data-s') ==0){
                                                //_this.openTqqLogin('https://www.wntaoke.com/index.php?m=user&a=tuiguang&id='+$this.attr('data-id')+'&plugin=1');
                                                _this.openTqqLogin('https://www.wntaoke.com/index.php?m=user&a=tuiguang&id='+_this.item_id+'&plugin=1');
                                            }
                                            else{
                                                //_this.openTqqLogin('https://www.wntaoke.com/index.php?m=user&a=tuiguang&id='+$this.attr('data-id')+'&plugin=1');
                                                _this.openTqqLogin('https://www.wntaoke.com/index.php?m=user&a=tuiguang&id='+_this.item_id+'&plugin=1');
                                            }
                                        }else{
                                            var $this = $(this);
                                            if($this.attr('data-s') ==0){
                                                layer.confirm('该商品未到开始时间，现在推广只是普通佣金，是否生成？', {icon: 3},function(index){
                                                    layer.close(index);
                                                    //_this.layerOpen('https://www.wntaoke.com/index.php?m=user&a=tuiguang&id='+$this.attr('data-id')+'&plugin=1',2,0,false,650,510);
                                                    _this.layerOpen('https://www.wntaoke.com/index.php?m=user&a=tuiguang&id='+_this.item_id+'&plugin=1&type=1',2,0,false,650,510);
                                                });
                                            }else{
                                                //_this.layerOpen('https://www.wntaoke.com/index.php?m=user&a=tuiguang&id='+$this.attr('data-id')+'&plugin=1',2,0,false,650,510);
                                                _this.layerOpen('https://www.wntaoke.com/index.php?m=user&a=tuiguang&id='+_this.item_id+'&plugin=1&type=1',2,0,false,650,510);
                                            }
                                        }
                                    });
                                }else{
                                    $('#WNTK-plugin-queqiao-list').html('<div class="WNTK-loading"><div class="WNTK-loading-img"></div><div class="WNTK-loading-tip">网络繁忙，请稍候再试...</div></div>');
                                }
                                if($('.WNTK-plugin-queqiaobox .WNTK-footer').length == 0){
                                    $('#WNTK-plugin-queqiao-list').after(_this.footer);
                                }
                            });
                        }
                    },
                    getLmUid:function(){ //获取PID
                        var _this = this;
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'http://pub.alimama.com/common/getUnionPubContextInfo.json'
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.data.hasOwnProperty('memberid')){
                                    _this.lmuid = response.data.data.memberid;
                                }else{
                                    _this.nologin = true;
                                }
                            }
                        });
                    },
                    getGoodsInfo:function(type,itemid,pid,webid){
                        var _this = this;
                        console.log('http://pub.alimama.com/items/search.json?q='+encodeURIComponent('http://item.taobao.com/item.htm?id='+itemid)+'&perPageSize=50');
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'http://pub.alimama.com/items/search.json?q='+encodeURIComponent('http://item.taobao.com/item.htm?id='+itemid)+'&perPageSize=50'
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.data.pageList != null){
                                    pvid = response.data.info.pvid;
                                    tkRate = response.data.data.pageList[0].tkRate;
                                    eventRate = response.data.data.pageList[0].eventRate;
                                    if(type==0 && eventRate == null){
                                        layer.confirm('该商品未开始或已过期，无法获得鹊桥佣金，<br />只能获得普通佣金，是否生成？', {icon: 3},function(index){
                                            layer.close(index);
                                            _this.getClickUrl(1,itemid,pid,webid,pvid);
                                        });
                                        return false;
                                    }
                                    if(type==0){
                                        $('.WNTK-Plugin-eventRate').html(eventRate+'%');
                                    }else{
                                        $('.WNTK-Plugin-eventRate').html(tkRate+'%');
                                    }
                                    _this.getClickUrl(type,itemid,pid,webid,pvid);
                                }else{
                                    layer.alert('商品不存在或退出淘宝客！', {icon: 5});
                                }
                            }
                        });
                    },
                    getClickUrl:function(type,itemid,pid,webid,pvid){
                        var _this = this;
                        var lm = $('#lm_url');
                        var dwz = $('#lm_dwz');
                        var web = $('#web_push');
                        pid = pid.split("_");
                        uid = parseInt(pid[0]);
                        siteid = parseInt(pid[1]);
                        adzoneid = parseInt(pid[2]);
                        if (uid != _this.lmuid) {
                            layer.alert('您选择的PID和您现在登录的联盟账号<br />PID不一致，请重新选择！', {icon: 0,btn: ['确定']});
                            return false;
                        }
                        web.hide();
                        lm.empty().addClass("disabled").append('正在生成推广链接，请稍候...');
                        dwz.addClass("disabled").val('正在生成推广链接，请稍候...');
                        if(type==1){
                            url = 'http://pub.alimama.com/common/code/getAuctionCode.json?auctionid='+itemid+'&adzoneid='+adzoneid+'&siteid='+siteid+'&pvid='+pvid;
                            console.debug('生成普通链接='+url);
                        }else{
                            url = 'http://pub.alimama.com/common/code/getAuctionCode.json?auctionid='+itemid+'&adzoneid='+adzoneid+'&siteid='+siteid+'&scenes=3&channel=tk_qqhd&pvid='+pvid;
                            console.debug('生成鹊桥链接='+url);
                        }
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: url
                        },function(response){
                            if(response.msg == 'ok'){
                                if(response.data.hasOwnProperty('data') == false){
                                    _this.nologin = true;
                                    _this.openLmLogin();
                                }else if(response.data.data == null){
                                    if(response.data.info.invalidKey == 'adzoneid'){
                                        layer.alert('PID错误，请检查！', {icon: 5});
                                    }else{
                                        layer.alert(response.data.info.message, {icon: 5});
                                    }
                                }else if(response.data.data.hasOwnProperty('clickUrl')){
                                    var clickUrl = response.data.data.clickUrl;
                                    var shortLinkUrl = response.data.data.shortLinkUrl;
                                    lm.removeClass("disabled");
                                    lm.empty().append(clickUrl);
                                    dwz.removeClass("disabled");
                                    dwz.val(shortLinkUrl);
                                    if(type==0 && webid>0){
                                        web.attr({'data-id':webid,'data-url':clickUrl,'disabled':false}).val('推送商品至网站').show();
                                    }
                                    _this.getDwzUrl($('#bd_url'),clickUrl);
                                    _this.getWbUrl($('#wb_url'),clickUrl);
                                }
                            }
                        });
                    },
                    getDwzUrl:function(t,url){ //百度短网址转换
                        t.addClass("disabled").val('正在生成，请稍候...');
                        chrome.extension.sendRequest({
                            type: "pajax",
                            url: 'http://dwz.cn/create.php',
                            postdata:{url:url}
                        },function(response){
                            if(response.msg == 'ok'){
                                t.removeClass("disabled");
                                t.val(response.data.tinyurl);
                            }
                        });
                    },
                    getWbUrl:function(t,url){ //微博短网址转换
                        t.addClass("disabled").val('正在生成，请稍候...');
                        chrome.extension.sendRequest({
                            type: "gajax",
                            url: 'https://api.weibo.com/short_url/shorten.json?source=919944140&url_long='+encodeURIComponent(url)
                        },function(response){
                            if(response.msg == 'ok'){
                                t.removeClass("disabled");
                                t.val(response.data.urls[0].url_short);
                            }
                        });
                    },
                    layerOpen:function(url,type,move,title,width,height,parameter){
                        layer.open({
                            type: type,
                            shift:move,
                            shadeClose: true,
                            title: title,
                            content: url,
                            area: [width+'px', height+'px']
                        });
                    },
                    browserOpen:function(url,width,height){
                        var w = width;
                        var h = height;
                        var top = (window.screen.availHeight-30-h)/2;
                        var left = (window.screen.availWidth-10-w)/2;
                        window.open(url, '', 'height='+h+', width='+w+', top='+top+', left='+left+', toolbar=no, menubar=no, scrollbars=no, location=no, resizable=no, status=no');
                    },
                    openLmLogin:function(type){
                        var _this = this;
                        var url = 'http://www.alimama.com/index.htm';
                        if(type==1){
                            _this.browserOpen(url,350,300);
                            layer.confirm('您是否已经成功登录淘宝联盟？', {
                                icon: 3,
                                btn: ['是','否'],
                            },function(){
                                window.location.reload();
                            });
                        }else{
                            layer.confirm('您还没登录淘宝联盟，是否立即登录？', {
                                icon: 3,
                                btn: ['是','否'],
                            },function(){
                                _this.browserOpen(url,350,300);
                                layer.confirm('您是否已经成功登录淘宝联盟？', {
                                    icon: 3,
                                    btn: ['是','否'],
                                },function(){
                                    window.location.reload();
                                });
                            });
                        }
                        return false;
                    },
                    openTqqLogin:function(url){
                        var _this = this;
                        layer.confirm('您还有没登万能淘宝，是否立即登录？', {icon: 3},function(){
                            var index = layer.confirm();
                            layer.close(index);
                            _this.layerOpen('https://www.wntaoke.com/index.php?m=user&a=login&is_win=1&url='+encodeURIComponent(url),2,0,'登录万能淘客',590,550);
                        });
                        return false;
                    },
                    siteActions:function(){
                        var _this = this;
                        if(window.location.href.indexOf('www.wntaoke.com') == -1){
                            return false;
                        }
                        $('#WNTK-Plugin-Data').attr('data-plugin',1);
                        $('.plugin_user_pid').click(function(){
                            _this.browserOpen('https://www.wntaoke.com/index.php?m=user&a=pid&plugin=1',850,600);
                            layer.confirm('您是否已经设置好您的PID？', {icon: 3},function(){
                                window.location.reload();
                            });
                        });


                        $('.pid_btn').click(function(){
                            console.debug('pid click');
                            var type = $(this).attr('data-type');
                            var pid = $(this).attr('data-pid');
                            var itemid = $(this).attr('data-itemId');
                            var webid = $(this).attr('data-webId');
                            console.debug('pid click');

                            if(_this.lmuid==''){
                                _this.openLmLogin();
                                return false;
                            }

                            if($('.pid_btn').hasClass("btn-primary")) {
                                $('.pid_btn').removeClass("btn-primary");
                            }
                            $(this).addClass("btn-primary");
                            _this.getGoodsInfo(type,itemid,pid,webid);
                        });

                        $('#short_btn').click(function(){
                            var surl=$('#s_url').val();
                            console.debug('surl='+surl);
                            _this.getDwzUrl($('#bd_url'),surl);
                            _this.getWbUrl($('#wb_url'),surl);
                        });




                        $('#pc_long_url').click(function(){
                            _this.getDwzUrl($('#pc_bd_url'),$(this).prev().val());
                            _this.getWbUrl($('#pc_wb_url'),$(this).prev().val());
                        });
                        $('#pc_long_url').click();

                        $('#phone_long_url').click(function(){
                            _this.getDwzUrl($('#phone_bd_url'),$(this).prev().val());
                            _this.getWbUrl($('#phone_wb_url'),$(this).prev().val());
                        });
                        $('#phone_long_url').click();
                    },
                    keyDisplay:function(){
                        var _this = this;
                        $(document).keydown(function(event) {
                            if (event.target.localName != "input") {
                                chrome.extension.sendRequest({type: "set"}, function(response) {
                                    classOpen = 'WNTK-plugin-open';
                                    var $plugin = $('.WNTK-plugin');
//										var $trend = $('.WNTK-plugin-trend');
                                    var $lm = $('.WNTK-plugin-lm');
                                    var $queqiao = $('.WNTK-plugin-queqiao');
                                    if (event.keyCode == response.keyPlugin) {
                                        if ($plugin.length > 0) {
                                            $plugin.slideToggle(200);
                                        }else{
                                            $plugin.fadeToggle(200);
                                        }
                                    }
                                    if (event.keyCode == response.keyTrend) {
//											if ($trend.hasClass(classOpen)) {
//												$trend.removeClass(classOpen);
//											}else{
//												_this.showTrendData();
////												$trend.addClass(classOpen);
//												$lm.removeClass(classOpen);
//												$queqiao.removeClass(classOpen);
//											}
                                    }
                                    if (event.keyCode == response.keyTaoke) {
                                        if ($lm.hasClass(classOpen)) {
                                            $lm.removeClass(classOpen);
                                        }else{
                                            _this.showUnionData();
                                            $lm.addClass(classOpen);
//												$trend.removeClass(classOpen);
                                            $queqiao.removeClass(classOpen);
                                        }
                                    }
                                    if (event.keyCode == response.keyQueqiao) {
                                        if ($queqiao.hasClass(classOpen)) {
                                            $queqiao.removeClass(classOpen);
                                        }else{
                                            _this.showQueqiaoList();
                                            $queqiao.addClass(classOpen);
                                            $trend.removeClass(classOpen);
                                            $lm.removeClass(classOpen);
                                        }
                                    }
                                    if (event.keyCode == response.keyLogin) {
                                        if(_this.nologin == true){
                                            _this.openLmLogin(1);
                                        }else{
                                            layer.confirm('您已经登录淘宝联盟，是否继续登录？', {
                                                icon: 3,
                                                btn: ['是','否'],
                                            },function(){
                                                _this.openLmLogin(1);
                                            });
                                        }
                                    }
                                    if (event.keyCode == '13') {
                                        $("a.WNTK-layui-layer-btn0").click();
                                    }
                                });
                            }
                        });
                    }
                };
                function checkCoupon(){
                    var url=location.href;

                    var seller_id,activity_Id;
                    var reg=new RegExp(/seller[_]{0,1}id=(\d+)/ig);
                    var reg1=new RegExp(/activity[_]{0,1}Id=([0-9 a-z]{32})/ig);
                    var tmp="";
                    var tmp1="";
                    var tmp=reg.exec(url);
                    var tmp1=reg1.exec(url);
                    if (tmp){
                        seller_id=tmp[1];
                        console.debug('1 seller_id='+seller_id);
                    }
                    if (tmp1){
                        activity_Id=tmp1[1];
                        console.debug('2 activity_Id='+activity_Id);
                    }


                    if(seller_id &&activity_Id){
                        var url='https://www.wntaoke.com/index.php?m=api&a=coupon&sid='+seller_id+'&aid='+activity_Id;
                        console.debug("post url="+url);
                        $.ajax({
                            dataType: "json",
                            url: url,
                            success: function(c) {
                                //c = JSON.parse(c.slice(2, -1));
                                if(c.status=='1'){
                                    console.debug("coupon ok!");
                                }
                                else{
                                    console.debug('back='+c.msg);
                                }
                            }
                        });

                    }


                }

                WNTK_Plugin.init();

			}
		});
