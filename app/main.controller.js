/*
Author: Aizaya L. Seco
Date: March 10, 2018
Description: main controller for the Instruction Systems Development best appropriate for the use of nursery,kinder and preparatory students. The system mainly optimizes mathematical skills.
*/

(function() {
    angular
        .module('app')
        .controller('mainController', mainController);

    function mainController($scope,$window, $timeout) {
        var vm = this;

        vm.student= {
        	name:"",
   			scores:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
   			time:[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
            retries:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        }

        vm.percentage=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    
        vm.reinforcements={
        	message:['Nice try!','Good start!','You can do better!','Good job!','Very good!', 'Excellent'],
        	pictures:["assets/doraemon.png","assets/spongebob.png","assets/tnj.png","assets/adventure-time.png","assets/grizzle.png","assets/courage.png"]
        }

        vm.pictures={
        	name:["corn","carrot","tomato","chili pepper","eggplant", "strawberry","apple","pineapple","watermelon","banana","sugar apple", "orange"],
        	names:["corns","carrots","tomatoes","chili peppers","eggplants", "strawberries","apples","pineapples","watermelons","bananas","sugar apples", "oranges"],
        	pictures:["assets/1.png","assets/2.png","assets/3.png","assets/4.png","assets/5.png","assets/6.png","assets/7.png","assets/8.png","assets/9.png","assets/10.png","assets/11.png","assets/12.png"]
        }

        vm.numberNames=["one","two","three","four","five","six","seven","eight","nine","ten"];

        vm.items=[];
        vm.questions=[];// holds multiple arrays problems levels 1-18??
       
       	vm.audio = new Audio('assets/classical_music.mp3');
        vm.currentSide="1";
        vm.answer=null;
        vm.noAns=false;
        vm.level=0;
        vm.itemLevel=1; 
        vm.cardview=1; //1-normal, 2-correct, 3- wrong
        vm.currPic=Math.floor((Math.random() * 11));
        vm.PauseStart=null;

        vm.sec=0;
        vm.min=0;
        vm.hour=0;
        vm.timer=null;

        vm.musicOn=true;

        vm.nextSide=nextSide;
        vm.repaintSide=repaintSide;
        vm.resetSide=resetSide;
        vm.reset=reset;
        vm.pauseSide=pauseSide;
        vm.playSide=playSide;

        vm.getTimes=getTimes;
        vm.updateAns=updateAns;
        vm.updateMusic=updateMusic;
        vm.answering=answering;
        vm.next=next;

        generateQuestionsPerlevel();
        vm.audio.play();
        vm.audio.volume=0.8;

        function getTimes(n){
        	return new Array(n);
        }

        function updateAns(num){
        	vm.answer=num;
        }

        function updateMusic(){
        	vm.musicOn=!vm.musicOn;
        	if(vm.musicOn){
        		vm.audio.play();
        	}
        	else{
        		vm.audio.pause();
        	}
        }

        function counter(){
            vm.sec++;
            if(vm.sec==60){
                counterMin();
                vm.sec=0;
            }
            vm.timer = setTimeout(function(){
                counter();
            }, 1000);
        }

        function counterMin(){
            vm.min++;
            if(vm.min==60){
                counterHour();
                vm.min=0;
            }
        }

        function counterHour(){
            vm.hour++;
            if(vm.hour==12){
                //if 12 hours of inactivity reload
                $window.location.reload();
            }
        }

        function start_time(){
            clearTimeout(vm.timer);
            vm.sec = 0;
            vm.min = 0;
            vm.hour = 0;
            paused = false;
            counter();
        }

        function record_time(){
            var seconds="";
            var minutes="";
            var hours="";
            if(vm.sec<10){
                seconds="0"+vm.sec;
            }else{
                seconds=vm.sec+"";
            }

            if(vm.min<10){
                minutes="0"+vm.min;
            }else{
                minutes=vm.min+"";
            }

            if(vm.hour<10){
                hours="0"+vm.hour;
            }else{
                hours=vm.hour+"";
            }

            vm.student.time[vm.level-1]= hours+":"+minutes+":"+seconds;

        }

        function generateUniquePairsSum(max){
        	arrays=[];
            hasMax=false;
        	while(arrays.length<5){
        		array=[];
        		isUnique=true;
        		num1=Math.floor((Math.random() * max));
        		num2=Math.floor((Math.random() * max));
        		if(num1>num2)
        			array.push(num2,num1);
        		else
        			array.push(num1,num2);
        		if((num1+num2)>0 &&(num1+num2)<=max){
        			if(arrays.length>0){
        				for(i=0;i<arrays.length;i++){
		        			if(array[0]==arrays[i][0] && array[1]==arrays[i][1]){
		        				isUnique=false;
		        				break;
		        			}
		        		}
        			}
        		}else{
        			isUnique=false;
        		}

        		if(isUnique){
        			if((array[0]+array[1])==max){
        				hasMax=true;
        			}
                    if((array[0]+array[1])<=max-5){
                        continue;
                    }
        			if(arrays.length==4 && !hasMax){
        				continue;
        			}
        			arrays.push(array);
        		}
        	}
        	return arrays;
        }

        function generateQuestionsPerlevel(){
        	for(k=0;k<6;k++){
        		for(l=0;l<3;l++){
        			arrays=generateUniquePairsSum(5+k);
        			vm.questions.push(arrays);
        		}
        	}
        }

        function next(){
        	vm.currentSide=parseInt(vm.currentSide)+1+"";
        	$('.shape')
				  .shape('set next side', '.side.'+vm.currentSide)
				  .shape('flip right')
				;
			$timeout(function() { 
				if(vm.student.scores[vm.level-1]<3){
					repaintSide();
				}
        		else{
        			nextSide();
                }
        	}, 3000);
        }

        function nextLevelSide(){
        		vm.cardview=1;
	        	vm.itemLevel++;
	        	vm.answer=null;
	        	vm.currPic=Math.floor((Math.random() * 11));        	
        }

        function nextSide(){
        		vm.answer=null;
        		vm.cardview=1;
                if(vm.level>0){
                    record_time();
                }
        		vm.currentSide=parseInt(vm.currentSide)+1+"";
	        	$('.shape')
					  .shape('set next side', '.side.'+vm.currentSide)
					  .shape('flip right')
					;
				vm.level++;
                if(vm.level>0){
                    start_time();
                }

        		vm.itemLevel=1;
        	
        }

        function repaintSide(){ //going to same level
        	vm.cardview=1;
        	vm.currentSide=parseInt(vm.currentSide)-1+"";
        	vm.itemLevel=1;
        	//questions should be re-generated at that level
            var max=0;
            if(vm.level<4 && vm.level>0){
                max=5;
            }
            if(vm.level<7 && vm.level>3){
                max=6;
            }
            if(vm.level<10 && vm.level>6){
                max=7;
            }
            if(vm.level<13 && vm.level>9){
                max=8;
            }
            if(vm.level< 16 && vm.level>12){
                max=9;
            }
            if(vm.level<= 18 && vm.level>15){
                max=10;
            }

        	vm.questions[vm.level-1]=generateUniquePairsSum(max);//regeneration of questions
        	vm.answer=null;
        	vm.noAns=false;
            start_time();
        	vm.student.scores[vm.level-1]=null;
            vm.student.retries[vm.level-1]+=1;
        	$('.shape')
				  .shape('set next side', '.side.'+vm.currentSide)
				  .shape('flip right')
				;
        }

        function resetSide(){ //finishing //quitting 
        	if(vm.level<19){
        		vm.student.scores[vm.level-1]=null;
        	}

        	$('.shape')
				  .shape('set next side', '.side.'+vm.currentSide)
				  .shape('flip right')
				;

            if(vm.level==19){
                for(i=0;i<18;i++){
                    vm.percentage[i]=Math.floor((vm.student.scores[i]/5)*100); 
                    $('.ui.progress.'+i).progress('set percent', vm.percentage[i]);
                }

                $('.ui.modal')
                      .modal('setting','closable',false)
                      .modal('show')
                    ;
            }else{
                $window.location.reload();    
            }
        	
        }

        function reset(){
            $window.location.reload();
        }

        function pauseSide(){
            var close_time= new Date();
            clearTimeout(vm.timer);

        	vm.audio.pause();
        	$('.ui.dimmer')
        		  //.dimmer('setting','opacity',0.98)
                  .dimmer('setting',{
                        opacity: 0.98,
                        closable: false,
                        debug: false
                    });
			$('.ui.dimmer').dimmer('show');
        }

        function playSide(){
            clearTimeout(vm.timer);
            counter();

            if(vm.musicOn)
        	   vm.audio.play();
            $('.ui.dimmer')
              .dimmer('hide');
        }

        function answering(){
        	if(vm.answer ==null || vm.answer ===""){
        		vm.noAns=true;
        	}
        	else{
	        	if(vm.answer==(vm.questions[vm.level-1][vm.itemLevel-1][0]+vm.questions[vm.level-1][vm.itemLevel-1][1])){
	        		vm.cardview=2;
	        		vm.student.scores[vm.level-1]+=1;
	        	}else{
	        		vm.answer=vm.questions[vm.level-1][vm.itemLevel-1][0]+vm.questions[vm.level-1][vm.itemLevel-1][1];
	        		vm.cardview=3;
	        		vm.student.scores[vm.level-1]+=0;
	        	}
	        	vm.noAns=false;
	        	
	        	$timeout(function() { 
	        		if(vm.itemLevel<5)
	        			nextLevelSide();
	        		else
	        			next();
	        		}, 2000); //if itemLevel==5, normal next side kasi reinforcement lang dun
	        }
        }
    }
    
})();

/*
Author: Aizaya L. Seco
Date: March 10, 2018
Description: main controller for the Instruction Systems Development best appropriate for the use of nursery,kinder and preparatory students. The system mainly optimizes mathematical skills.
*/