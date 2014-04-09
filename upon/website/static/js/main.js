 //ichecker

 $(document).ready(function() {
     $('.finishbox').iCheck({
         checkboxClass: 'icheckbox_square-blue',
         radioClass: 'iradio_square-blue',
         increaseArea: '20%' // optional
     });
     $('.confirmbox').iCheck({
         checkboxClass: 'icheckbox_square-yellow',
         radioClass: 'iradio_square-yellow',
         increaseArea: '20%' // optional
     });

 });

 $('#rightcolumn .close').click(function() {
     $('#stat').collapse('show');
     $('#taskinfo').collapse('hide');

 });


 $('.task a').click(function(e) {
     var taskid = $(e.target).data("taskid");
     $.get("gettaskdetail/" + taskid + "/").then(function(resp) {
         //Gao Zhiwei should write DOM here 
         //var data = JSON.parse(resp);
         //ajax请求返回的数据是字符串的类型。json是Object对象，所以需要用eval对你的返回值运行一下生成一个object。  
         var data = eval('(' + resp + ')');
         //check if the error_code equal 0
         if (data.error_code == 0) {
             //set priority
             var priority = 0;
             switch (data.priority) {
                 case 0:
                     priority = "Critical";
                     $('.label').addClass('label-danger');
                     break;
                 case 1:
                     priority = "Severe";
                     $('.label').addClass('label-warning');
                     break;
                 case 2:
                     priority = "Major";
                     $('.label').addClass('label-primary');
                     break;
                 case 3:
                     priority = "Minor";
                     $('.label').addClass('label-info');
                     break;
             }
             $('.label,.label-primary').text(priority);

             //set status
             // var status = 0;
             // switch(data.status) {
             // case 0:
             // status = "Cannot Complete";
             // break;
             // case 1:
             // status = "Wait For Complete";
             // break;
             // case 2:
             // status = "Wait For Confirm";
             // break;
             // case 3:
             // status = "total Finished";
             // break;
             // }
             // $('.label,.label-primary').parent().next().text(status);

             //set task title
             $('.taskname').text(data.name);

             //detail info
             $('#taskdetail').text(data.detail);

             //set deadline
             $('.detaildeadline').children().text(data.deadline);

             //set comments
             $('#commentfield').empty();
             $.each(data.comments, function(i, item) {
                 var innerhtml = $("<div class='comment'><img class='smallphoto' src='/static/image/head.png'><span class='comment-content'>" + item.content + "</span></div>");
                 $('#commentfield').append(innerhtml);
                 if (window.userid == item.authorid) {
                     $('.comment').addClass('mycomment');
                 }
             });

         }

         //add taskid to add-comment-btn
         $("#add-comment-btn").data("taskid", taskid);
         $('#stat').collapse('hide');
         $('#taskinfo').collapse('show');
     });
 });

 $("#add-comment-btn").click(function() {
     var taskid = $("#add-comment-btn").data("taskid");
     var content = $("#comment-content").val();
     if (content !== "") {
         $.post("addcomment/", {
             taskid: taskid,
             content: content
         }).then(function(resp) {
             //append a comment to the comment box
             var comments = "<div class='comment mycomment'>\
             <img src='/static/image/head.png' class='smallphoto'>\
             <span class='comment-content'>"+content+"</span></div>";
             $('#commentfield').append(comments);
             $('#comment-content').val() = "";
             console.log(resp);
         });
     }

 });

 $('#teamtask a').click(function() {
     $('#personal-task-panel').css('display', 'none');
     $('#confirm-task-panel').css('display', 'none');
     $('#rubbishaccordion').css('display', 'none');
     $('#accordion').css('display', 'block');

     $('#teamtask').attr('class', 'active');
     $('#mytask').attr('class', '');
     $('#waittask').attr('class', '');
     $('#othertask').attr('class', '');
 });

 $('#rubbishtask a').click(function() {
     $('#accordion').css('display', 'none');
     $('#personal-task-panel').css('display', 'none');
     $('#confirm-task-panel').css('display', 'none');

     $('#rubbishaccordion').css('display', 'block');
     $('#finishcollapse').collapse('hide');
     $('#rubbishcollapse').collapse('show');

     $('#teamtask').attr('class', '');
     $('#mytask').attr('class', '');
     $('#waittask').attr('class', '');
     $('#othertask').attr('class', 'active');
 });
 $('#finishedtask a').click(function() {
     $('#personal-task-panel').css('display', 'none');
     $('#confirm-task-panel').css('display', 'none');
     $('#accordion').css('display', 'none');
     $('#rubbishaccordion').css('display', 'block');
     $('#finishcollapse').collapse('show');
     $('#rubbishcollapse').collapse('hide');

     $('#teamtask').attr('class', '');
     $('#mytask').attr('class', '');
     $('#waittask').attr('class', '');
     $('#othertask').attr('class', 'active');
 });

 $('#mytask a').click(function() {
     $('#personal-task-panel').css('display', 'block');
     $('#confirm-task-panel').css('display', 'none');
     $('#accordion').css('display', 'none');
     $('#rubbishaccordion').css('display', 'none');

     $('#teamtask').attr('class', '');
     $('#mytask').attr('class', 'active');
     $('#waittask').attr('class', '');
     $('#othertask').attr('class', '');
 });
 $('#waittask a').click(function() {
     $('#personal-task-panel').css('display', 'none');
     $('#confirm-task-panel').css('display', 'block');
     $('#accordion').css('display', 'none');
     $('#rubbishaccordion').css('display', 'none');

     $('#teamtask').attr('class', '');
     $('#mytask').attr('class', '');
     $('#waittask').attr('class', 'active');
     $('#othertask').attr('class', '');
 });

 $(".glyphicon-trash,.deletebtn").click(function() {
     $("#alert-modal").modal('show');
 });

 $(".addtaskbtn").click(function() {
     $("#task-modal").modal('show');
 });
 $(".changebtn").click(function() {
     $("#task-modal").modal('show');
 });
 $(".addteambtn").click(function() {
     $("#newteam-modal").modal('show');
 });
 $(".addprojectbtn").click(function() {
     $("#newproject-modal").modal('show');
 });
 $(".modifypersoninfobtn").click(function() {
     $("#modifypersoninfo-modal").modal('show');
 });
 $(".signoutbtn").click(function() {
     $("#signout-modal").modal('show');
 });
 $(".manageteambtn").click(function() {
     $("#manageteam-modal").modal('show');
 });

 $("#project-list > a").click(function() {
     var all = $(this).parent().children().length - 1;
     var parrent = $(this).index();
     if (parrent < all) {
         $(this).parent().children(":lt(" + all + ")").removeClass("active").children().remove();
         $(this).addClass("active").append('<span class="glyphicon glyphicon-chevron-right"></span>');
     } else {
         $("#newproject-modal").modal('show');
     }
 });


 //diagram
 var finishdata = {
     labels: ["January", "February", "March", "April", "May", "June", "July"],
     datasets: [{
         fillColor: "rgba(220,220,220,0.5)",
         strokeColor: "rgba(220,220,220,1)",
         pointColor: "rgba(220,220,220,1)",
         pointStrokeColor: "#fff",
         data: [65, 59, 90, 81, 56, 55, 40]
     }, {
         fillColor: "rgba(151,187,205,0.5)",
         strokeColor: "rgba(151,187,205,1)",
         pointColor: "rgba(151,187,205,1)",
         pointStrokeColor: "#fff",
         data: [28, 48, 40, 19, 96, 27, 100]
     }]
 };
 var ctx = document.getElementById("newandfinish").getContext("2d");
 var myNewChart = new Chart(ctx).Line(finishdata);

 var workdata = [{
         value: 30,
         color: "#F7464A"
     }, {
         value: 50,
         color: "#E2EAE9"
     }, {
         value: 100,
         color: "#D4CCC5"
     }, {
         value: 40,
         color: "#949FB1"
     }, {
         value: 120,
         color: "#4D5360"
     }

 ];

 var workctx = document.getElementById("workcontrast").getContext("2d");
 var workChart = new Chart(workctx).Doughnut(workdata);

 $("#addtask-submit-btn").click(function(e) {
     var title = $("#task-title-input").val();
     var group = $("#task-group-select").val();
     var priority = $("#task-priority-select").val();
     var todoer = $("#todoer-select").val();
     var detail = $("#task-desc-textarea").val();
     var deadline = $("#task-deadline-input").val();
     var starttime = $("#task-starttime-input").val();

     var projectid = window.projectid;
     var taskid = $(e.target).data("taskid");
     if (taskid === 0) {
         //new
         $.post("addtask/", {
             taskid: "0",
             projectid: projectid,
             name: title,
             detail: detail,
             deadline: deadline,
             starttime: starttime,
             priority: priority,
             type: group,
             todoer: todoer
         }).then(function(resp) {
             //callback
             var whichweek = ""
             var priorityname = ""
             var datataskid = eval('(' + resp + ')').taskid;
             switch(group) {
                case "0":
                    whichweek="#futureTask";
                    break;
                case "1":
                    whichweek="#nextWeekTast";
                    break;
                case "2":
                    whichweek="#currentWeekTask";
                    break;
             }

             switch(priority) {
                case "0":
                    priorityname = "h5.critical";
                    break;
                case "1":
                    priorityname = "h5.severe";
                    break;
                case "2":
                    priorityname = "h5.major";
                    break;
                case "3":
                    priorityname = "h5.minor";
                    break;
             }

             if ( $(whichweek+ " " +priorityname) > 0 ) {
                $(whichweek+ " " +priorityname).append("<div class='task'>\
                            <div class='icheckbox_square-blue' style='position: relative;'><input type='checkbox' class='inishbox' style='position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background-color: rgb(255, 255, 255); border: 0px; opacity: 0; background-position: initial initial; background-repeat: initial initial;'><ins class='iCheck-helper' style='position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background-color: rgb(255, 255, 255); border: 0px; opacity: 0; background-position: initial initial; background-repeat: initial initial;'></ins></div>\
                            <span class='tasktitle'><a href='#' data-taskid='"+datataskid+"'>"+ title +"</a></span>\
                            <span class='glyphicon glyphicon-trash'></span>\
                    </div>");
             } else {
                
             }

             
             console.log(resp);
         });
     } else {
         //update

     }

 });