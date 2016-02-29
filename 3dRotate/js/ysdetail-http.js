function Diy(){
	this.fvamp=null;//默认鞋面材质id
	this.angle={//0-7 （8个方向）
		cur:0,//当前方向
		num:7//总共方向数
	};
	this.cur=0;
	this.data_all=null;//商品全部数据
}
Diy.prototype={
	init:function(e){
		_diy=this;
		_diy.bind();
		_diy.ng(e);
	},
	bind:function(e){
		//旋转

			var defaults = {
	            clicked: false
	        }
	        var options = jQuery.extend(defaults, e);

	        //mousedown
			$('#showPic').on("mousedown touchstart", function(e){

				 if (e.type == "touchstart") {
	                    options.currPos = window.event.touches[0].pageX;
	            } else {
	                options.currPos = e.pageX;
	            }
	            options.clicked = true;
	            return false;
			});

			//mouseup
			$('#showPic').on('mouseup touchend',function(e){
				options.clicked = false;
			});

			//mousemove
			$('#showPic').on('mousemove touchmove',function(e){
				if(options.clicked){
				  var pageX;

	                if (e.type == "touchmove") {
	                    pageX = window.event.targetTouches[0].pageX;
	                } else {
	                    pageX = e.pageX;
	                }

	             var width_step = 4;

	                if (Math.abs(options.currPos - pageX) >= width_step) {
	                    if (options.currPos - pageX >= width_step) {
	                         $('#rotate-left').click();
	                    } else {
	                        $('#rotate-right').click();	
	                    }
	                    options.currPos = pageX;
	             	}
				}
			});

		//滚动条美化
		setTimeout(function(){
			$('#opt').mCustomScrollbar({scrollInertia:500});
		},120);
		
	},
	ng:function(e){
		var module=angular.module('mod', []);
		module.controller('ctrl_1', function($scope, $http) {

			$.ajax({
				url: 'http://xibuxiedu.dev.bodecn.com/Web/PresellGoods/GetPresellGoodsInfo',
				type: 'post',
				data:{goodsId:6},
				dataType: 'json',
				success: function(data){

						//获取商品基本信息
						$.each(data.ReturnData,function(i,item){

							$('.gName').html(item.Name);
							$('.gSummary').html(item.Summary);
							$('.gPrice').html('￥'+ item.Price);
							$('.gHeelHight').html(item.HeelHight);
							$('.gMaterial').html(item.Material);
							$('.gInMaterial').html(item.InMaterial);
							$('.gsoleMaterial').html(item.Element);
							$('.gSendOutTime').html(item.SendOutTime);
							
							//进入倒计时
							getEndTime(item.EndTime);
						});

				},
				error:function(data){
					console.log(data.status);
				}

			});

			$http.post('http://xibuxiedu.dev.bodecn.com/Web/PresellGoods/GetPresellGoodsInfo?goodsId=6').success(function(d){
	           
	           	_diy.data_all = d.ReturnData[0];

	           	//获取商品颜色
	           	for(var i=0;i<_diy.data_all.PresellColor.length;i++){
	           		if(i==0){
	           			$('.color>p').append("<span class='color-btn colorChecked'><i  style='background-color:"+_diy.data_all.PresellColor[i].Rgb+"'></i></span>");
	           		}else{
	           			$('.color>p').append("<span class='color-btn'><i  style='background-color:"+_diy.data_all.PresellColor[i].Rgb+"'></i></span>");
	           		}
	           		
	           	}
	        })
	        
           	

			//获取时间差    
		    function getEndTime (end){
		    	var currDate=new Date(), endDate=new Date(end);
		    	var time1=currDate.getTime();
		    	var time2=endDate.getTime();
		    	var time3=time2-time1;
		    	var time4=time3/1000;

		    	timer(time4);
		    }

		    //倒计时
			function timer(intDiff) {
				window.setInterval(function() {
					var day = 0,
						hour = 0,
						minute = 0,
						second = 0; //时间默认值		
					if (intDiff > 0) {
						day = Math.floor(intDiff / (60 * 60 * 24));
						hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
						minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
						second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
					}
					if (minute <= 9) minute = '0' + minute;
					if (second <= 9) second = '0' + second;
					$('#day_show').html(day + "天");
					$('#hour_show').html('<s id="h"></s>' + hour + '时');
					$('#minute_show').html('<s></s>' + minute + '分');
					$('#second_show').html('<s></s>' + second + '秒');
					intDiff--;
				}, 1000);
			}


			//更新视图
			function updataView(){

				$http.post('http://xibuxiedu.dev.bodecn.com/Web/PresellGoods/GetPresellGoodsInfo?goodsId=6').success(function(d){
				
					$scope.showpic=d.ReturnData[0].PresellColor[_diy.cur].Pic[_diy.angle.cur].Path;
		
				})
			}
			updataView();
			
			//点击颜色切换图片
			function changeColor(){

				$('.color').on('click','span',function(){

					$(this).addClass('colorChecked').siblings('span').removeClass('colorChecked');
					
					_diy.cur=$(this).index();

					updataView();
				})
				
				
			}
			changeColor();

			//重来
			$scope.resets=function(){
				location.reload();	
			}

			//旋转
			$scope.rotate=function(e){
				if(e>=0){//右转
					_diy.angle.cur<_diy.angle.num?_diy.angle.cur++:_diy.angle.cur=0;
				}else{//左转
					_diy.angle.cur>=0?_diy.angle.cur--:_diy.angle.cur=7;
				}
				updataView();
			}
			
			//全屏
			$scope.fullScreen=function(){
				;(function launchFullscreen(element) {
					if(element.requestFullscreen) {
						element.requestFullscreen();
					} else if(element.mozRequestFullScreen) {
						element.mozRequestFullScreen();
					} else if(element.webkitRequestFullscreen) {
						element.webkitRequestFullscreen();
					} else if(element.msRequestFullscreen) {
						element.msRequestFullscreen();
					}else{
						luck.poptip({
							con:'您的浏览器不支持全屏功能!'	
						})	
					}
				})(document.documentElement);
			}
		});
	}
}
