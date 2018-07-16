
    // var myDate = new Date(),
    //   YY = myDate.getFullYear(),
    //   MM = myDate.getMonth() + 1,
    //   DD = myDate.getDate(),
    //   WW = myDate.getDay();
    // // console.log(YY,MM,DD,WW)
    // var nd = new Date(2018, 07, 0);//取7月份的总天数
    // var ndd = new Date(2018, 07, 1);//取8月份的第一天是周几
    // var day = nd.getDate();//取出当月的第一天是星期几
    
    
    var stratCurrent = new Date(),YY = stratCurrent.getFullYear(), MM = stratCurrent.getMonth() + 1,DD = stratCurrent.getDate();
    var starData = YY+"-"+MM+"-"+DD,moveData = "", endData = YY+"-"+MM+"-"+DD;

    /**
     * 关于这个月?
     * 获取关于指定月份的信息
     */
    function aboutMonth(year, month) {
      var monthBegin = new Date(year, month - 1, 1), monthEnd = new Date(year, month, 0);
      return {
        DayInMonth: monthEnd.getDate(), // 这个月有多少天?
        BeginAtWeek: monthBegin.getDay() // 起始第一天是周几?
      }
    }
    /**
     * 
     * @param {日历容器的class名} className 
     * @param {设置的时间间隔} timeRange 
     */
    function calendarInit(className,timeRange){
      var wrapperContent = '<div class="item">'
                              +'<p>'
                              +'<span class="first_yeas_dom"><span class="left">&lt;</span> <span class="center"></span> <span class="right">&gt;</span></span>'
                              +'<span class="first_month_dom"><span class="left">&lt;</span> <span class="center"></span> <span class="right">&gt;</span></span>'
                              +'<select name="" id="" onchange="selectionTime(this,true)"><option value="时间设置">时间设置</option></select>'
                              +'</p>'
                              +'<ul class="table table_one" ondragstart="return false;"></ul>'
                            +'</div>'
                            +'<div class="item">'
                              +'<p>'
                              +'<span class="second_yeas_dom"><span class="left">&lt;</span> <span class="center"></span> <span class="right">&gt;</span></span>'
                              +'<span class="second_month_dom"><span class="left">&lt;</span> <span class="center"></span> <span class="right">&gt;</span></span>'
                              +'<select name="" id="" onchange="selectionTime(this,false)"><option value="时间设置">时间设置</option></select>'
                              +'</p>'
                              +'<ul class="table table_tow" ondragstart="return false;"></ul>'
                            +'</div>';
      $("."+className).html(wrapperContent);
      clickChange(className,YY,MM);
      $(".item ul").on("mousedown",".choice_data",liMousDowm);
      $(".item ul").on("mouseup",".choice_data",function(e){
        e = e || window.event;
        endData = e.target.attributes.data.value;
        console.log(endData);
        $(".item ul li.choice_data").unbind("mousemove");
      });
      $(document).mouseup(function(){
          $(".item ul li.choice_data").unbind("mousemove");
      });
      if(timeRange){
        var options = "", optionsH = 0,optionsM =  1;
        for (let index = 1,length =1440/timeRange ; index < length+1; index++) {
          if(index>(60/timeRange)-1){
            if(index%(60/timeRange) === 0){
              optionsH++;
              optionsM = 0;
            }
          }
          optionsH = optionsH.toString().length<2 ? "0"+optionsH : optionsH;
          var optionsMstr  = (optionsM*timeRange).toString().length<2 ? "0"+(optionsM*timeRange) : optionsM*timeRange;
          options += "<option value='"+optionsH + " : " +optionsMstr+"'>"+optionsH + " : " +optionsMstr+"</option>";
          optionsM++;
        }
        $("."+className+" select").append(options);
      }

    }
    function lisList(year,month,dataObj,liss,wrapperClassName,isSeond){
      var prveMonthDays;
      if(month==1){
          prveMonthDays = aboutMonth((new Date(year-1,12,0)).getFullYear(), (new Date(year-1,12,0)).getMonth() + 1).DayInMonth;
      }else{
          prveMonthDays = aboutMonth((new Date(year,month-1,0)).getFullYear(), (new Date(year,month-1,0)).getMonth() + 1).DayInMonth;
      }
      for (var index = (prveMonthDays-dataObj.BeginAtWeek); index < prveMonthDays; index++) {
          liss += "<li class='table_cell color_ddd'>"+(index+1)+"</li>";
      }
      for (var index = 0; index < dataObj.DayInMonth; index++){
          liss += "<li class='table_cell choice_data item_"+(index+1)+"' data='"+year+"-"+month+"-"+(index+1)+"'>"+(index+1)+"</li>"; 
      }
      for (var index = 0; index < (42-dataObj.BeginAtWeek-dataObj.DayInMonth); index++) {
          liss += "<li class='table_cell color_ddd'>"+(index+1)+"</li>";
        }
      if(isSeond){
        $("."+wrapperClassName+" .table_tow").html(liss);
      }else{
        $("."+wrapperClassName+" .table_one").html(liss);
      }
      $(".table li:nth-child(7n)").css("color","red");
      $(".table li:nth-child(7n-6)").css("color","red");
    }
    function daysFull(year1,month1,wrapperClassName,year2,month2){
      if(!year2 || !month2){
        year2 = year1;
        month2 = month1*1+1;
        if(month1==12){
          year2 = year1*1+1;
          month2 = 1;
        }
      }
      if(month1 && month1<10){month1 = ("0"+month1).substr(-2)};
      if(month2 && month2<10){month2 = ("0"+month2).substr(-2)};
      $("."+wrapperClassName+" .first_yeas_dom .center").text(year1);
      $("."+wrapperClassName+" .first_month_dom .center").text(month1);
      $("."+wrapperClassName+" .second_yeas_dom .center").text(year2);
      $("."+wrapperClassName+" .second_month_dom .center").text(month2);
      var currentDay = new Date(year1,month1,0);
      var currentDay2 = new Date(year2,month2,0);
      var dataObj1 = aboutMonth(currentDay.getFullYear(), currentDay.getMonth() + 1);
      var dataObj2 = aboutMonth(currentDay2.getFullYear(), currentDay2.getMonth() + 1);
      var lis = '<li class="table_cell week">日</li>';
          lis += '<li class="table_cell week">一</li>';
          lis += '<li class="table_cell week">二</li>';
          lis += '<li class="table_cell week">三</li>';
          lis += '<li class="table_cell week">四</li>';
          lis += '<li class="table_cell week">五</li>';
          lis += '<li class="table_cell week">六</li>';
      var lis2 = lis;
      lisList(year1,month1,dataObj1,lis,wrapperClassName);
      lisList(year2,month2,dataObj2,lis2,wrapperClassName,true);
      //当前日期添加一个active类
      if(year1==YY && month1==MM){
        $(".table_one .choice_data.item_"+DD).addClass("active");
      }else if(year2==YY && month2==MM){
        $(".table_tow .choice_data.item_"+DD).addClass("active");
      }
    }

    
    function clickChange(wrapperClassName,YY,MM,DD){
          //初始日历信息
          $(".first_yeas_dom .center").text(YY);
          $(".first_month_dom .center").text(MM);
          daysFull($(".first_yeas_dom .center").text(),$(".first_month_dom .center").text(),wrapperClassName);
        //年的选择减
        $("."+wrapperClassName + " .first_yeas_dom .left").click(function(){
          $("."+wrapperClassName + " .first_yeas_dom .center").text($("."+wrapperClassName + " .first_yeas_dom .center").text()-1);
          if($("."+wrapperClassName + " .first_yeas_dom .center").text()<1900){//限制最小年份
            $("."+wrapperClassName + " .first_yeas_dom .center").text(1900);
          }
          daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
        })
        //年的选择加
        $("."+wrapperClassName + " .first_yeas_dom .right").click(function(){
          $("."+wrapperClassName + " .first_yeas_dom .center").text($("."+wrapperClassName + " .first_yeas_dom .center").text()*1+1);
          if($("."+wrapperClassName + " .second_yeas_dom .center").text()>$("."+wrapperClassName + " .first_yeas_dom .center").text()){
            daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
          }else{
            daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName);
          }
          
        })
        //月的选择减
        $("."+wrapperClassName + " .first_month_dom .left").click(function(){
          $("."+wrapperClassName + " .first_month_dom .center").text($("."+wrapperClassName + " .first_month_dom .center").text()-1);
          if($("."+wrapperClassName + " .first_month_dom .center").text()<1){
            $("."+wrapperClassName + " .first_month_dom .center").text(12);
            $("."+wrapperClassName + " .first_yeas_dom .center").text($("."+wrapperClassName + " .first_yeas_dom .center").text()-1);
            if($("."+wrapperClassName + " .first_yeas_dom .center").text()<1900){//限制最小年份
              $("."+wrapperClassName + " .first_yeas_dom .center").text(1900);
            }
          }
          daysFull($("."+ wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
        })
        //月的选择加
        $("."+wrapperClassName + " .first_month_dom .right").click(function(){
          $("."+wrapperClassName + " .first_month_dom .center").text($("."+ wrapperClassName + " .first_month_dom .center").text()*1+1);
          if($("."+wrapperClassName + " .first_month_dom .center").text()>12){
            $("."+wrapperClassName + " .first_month_dom .center").text(1);
            $("."+wrapperClassName + " .first_yeas_dom .center").text($("."+wrapperClassName + " .first_yeas_dom .center").text()*1+1);
          }
          var yeasDifference = $("."+wrapperClassName + " .second_yeas_dom .center").text() - $("."+wrapperClassName + " .first_yeas_dom .center").text();
          if(yeasDifference>0){
            if($("."+wrapperClassName + " .second_month_dom .center").text()=="01" && $("."+wrapperClassName + " .first_month_dom .center").text()=="12"){
              daysFull($("."+ wrapperClassName + " .first_yeas_dom .center").text(),$("."+ wrapperClassName + " .first_month_dom .center").text(),wrapperClassName);
            }else{
              daysFull($("."+ wrapperClassName + " .first_yeas_dom .center").text(),$("."+ wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
            }
          }else{
            var monthDifference = $("."+wrapperClassName + " .second_month_dom .center").text()-$("."+wrapperClassName + " .first_month_dom .center").text();
            if(monthDifference>0){
              daysFull($("."+ wrapperClassName + " .first_yeas_dom .center").text(),$("."+ wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
            }else{
              daysFull($("."+ wrapperClassName + " .first_yeas_dom .center").text(),$("."+ wrapperClassName + " .first_month_dom .center").text(),wrapperClassName);
            }
            
          }
        })

        //second部分的年月加减
        //年的选择减
        $("."+wrapperClassName + " .second_yeas_dom .left").click(function(){
          $("."+wrapperClassName + " .second_yeas_dom .center").text($("."+wrapperClassName + " .second_yeas_dom .center").text()-1);
          if($("."+wrapperClassName + " .second_yeas_dom .center").text()<1900){//限制最小年份
            $("."+wrapperClassName + " .second_yeas_dom .center").text(1900);
          }
          var yeas2Difference = $("."+wrapperClassName + " .second_yeas_dom .center").text() - $("."+wrapperClassName + " .first_yeas_dom .center").text();
          if(yeas2Difference<0){
            $("."+wrapperClassName + " .first_yeas_dom .center").text($("."+wrapperClassName + " .second_yeas_dom .center").text());
            daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
          }else{
            daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
          }
        })
        //年的选择加
        $("."+wrapperClassName + " .second_yeas_dom .right").click(function(){
          $("."+wrapperClassName + " .second_yeas_dom .center").text($("."+wrapperClassName + " .second_yeas_dom .center").text()*1+1);
           daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
        })
        //月的选择减
        $("."+wrapperClassName + " .second_month_dom .left").click(function(){
          $("."+wrapperClassName + " .second_month_dom .center").text($("."+wrapperClassName + " .second_month_dom .center").text()-1);
          if($("."+wrapperClassName + " .second_month_dom .center").text()<1){
            $("."+wrapperClassName + " .second_month_dom .center").text(12);
            $("."+wrapperClassName + " .second_yeas_dom .center").text($("."+wrapperClassName + " .second_yeas_dom .center").text()-1);
            if($("."+wrapperClassName + " .second_yeas_dom .center").text()<1900){//限制最小年份
              $("."+wrapperClassName + " .second_yeas_dom .center").text(1900);
            }
          }
          var yeas3Difference = $("."+wrapperClassName + " .second_yeas_dom .center").text() - $("."+wrapperClassName + " .first_yeas_dom .center").text();
          var month2Difference = $("."+wrapperClassName + " .second_month_dom .center").text()-$("."+wrapperClassName + " .first_month_dom .center").text();
          if(yeas3Difference>0){
            daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
          }else{
            if(month2Difference==0){
              $("."+wrapperClassName + " .first_month_dom .center").text($("."+wrapperClassName + " .second_month_dom .center").text()-1)
              if($("."+wrapperClassName + " .second_month_dom .center").text()==1){
                $("."+wrapperClassName + " .first_month_dom .center").text("12");$("."+wrapperClassName + " .first_yeas_dom .center").text($("."+wrapperClassName + " .first_yeas_dom .center").text()-1)
              }
            }
            daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
          }  
        })
        //月的选择加
        $("."+wrapperClassName + " .second_month_dom .right").click(function(){
          $("."+wrapperClassName + " .second_month_dom .center").text($("."+wrapperClassName + " .second_month_dom .center").text()*1+1);
          if($("."+wrapperClassName + " .second_month_dom .center").text()>12){
            $("."+wrapperClassName + " .second_month_dom .center").text(1);
            $("."+wrapperClassName + " .second_yeas_dom .center").text($("."+wrapperClassName + " .second_yeas_dom .center").text()*1+1);
          }
           daysFull($("."+wrapperClassName + " .first_yeas_dom .center").text(),$("."+wrapperClassName + " .first_month_dom .center").text(),wrapperClassName,$("."+wrapperClassName + " .second_yeas_dom .center").text(),$("."+wrapperClassName + " .second_month_dom .center").text());
        })
    }
    


    function liMousDowm(e){
      e = e || window.event;
      $(".choice_data").removeClass("active");
      $(e.target).addClass("active");
      starData = e.target.attributes.data.value;
      console.log(starData);
      $(".item ul li.choice_data").mousemove(function(e){
      e = e || window.event;
      moveData = e.target.attributes.data.value;
      
      //判断是否跨月
      if(dataSplice(moveData).YY==dataSplice(starData).YY && dataSplice(moveData).MM==dataSplice(starData).MM){//不跨月
        var siblingsDoms = $(e.target).siblings(".choice_data");
          var moveDD = dataSplice(moveData).DD;
          var startDD = dataSplice(starData).DD;
          var strT = window.getSelection?window.getSelection().getRangeAt(0):document.selection.createRange();
          $(".choice_data").removeClass("active");
          for (let index = strT.startContainer.textContent, length=strT.endContainer.textContent*1+1; index < length; index++) {
            $(siblingsDoms[0]).parent().find(".item_"+index).addClass("active");
          }
      }else{
        var strTT = window.getSelection?window.getSelection().getRangeAt(0):document.selection.createRange();
          //开始和结束的位置的父元素
          var startParent = $(".table_one").find(".choice_data");
          var endParent   = $(".table_tow").find(".choice_data");
          $(".choice_data").removeClass("active");
          for (var index = strTT.startContainer.textContent,length = startParent.length*1+1; index <length; index++) {
            $(startParent[0]).parent().find(".item_"+index).addClass("active"); 
          }
          for (var j =0 ,l = strTT.endContainer.textContent*1+1; j <l; j++) {
            $(endParent[0]).parent().find(".item_"+j).addClass("active"); 
          }
      } 
    })
    }

    function dataSplice(str){
      return{
        YY:str.split("-")[0],
        MM:str.split("-")[1],
        DD:str.split("-")[2]
      }
    }
    function selectionTime(th,type){
      console.log(3333);
      //$(this).find("option:selected").text();
      if(starData===endData){

        
      }
      if(type){

      }
      console.log($(th).find("option:selected").text());
      
    }
