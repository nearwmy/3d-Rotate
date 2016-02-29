function Diy(){
	this.fvamp=null;//默认鞋面材质id
	this.fheel=null;//默认鞋跟材质id
	this.angle={//1-8 （8个方向）
		cur:1,//当前方向
		num:8//总共方向数
	};	
}
Diy.prototype={
	init:function(e){
		_diy=this;
		_diy.fvamp=e.def.fvamp;
		_diy.fheel=e.def.fheel;
		_diy.bind(e);
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
		
		//右侧选项卡
		$('#menu').on('click','li',function(){
			$(this).addClass('cur').siblings().removeClass('cur');
			$('#opt .cat').eq($(this).index()).siblings().hide().end().show()
			$('#opt').mCustomScrollbar('update');
		})	
	},
	ng:function(data){
		var module=angular.module('mod', []);
		module.controller('ctrl_1', function($scope, $http) {
			//更新视图
			function updataView(){
				$scope.showpic='data/'+_diy.fvamp+'/'+_diy.angle.cur+'/全.png';	
			}
			updataView();

			//变换颜色
			$scope.changeColor=function(){
				if(_diy.fvamp=="f-1"){
					_diy.fvamp="f-2";
				}else{
					_diy.fvamp="f-1";
				}
				updataView();
			}

			//重来
			$scope.resets=function(){
				location.reload();	
			}
			//旋转
			$scope.rotate=function(e){
				if(e>0){//右转
					_diy.angle.cur<_diy.angle.num?_diy.angle.cur++:_diy.angle.cur=1;
				}else{//左转
					_diy.angle.cur>1?_diy.angle.cur--:_diy.angle.cur=8;
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
