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


 $(document).on("click", ".task a", function(e) {
     //$('.task a').on("click", (function(e) {
     var taskid = $(e.target).data("taskid");
     $.get("/gettaskdetail/" + taskid + "/").then(function(resp) {
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
                     $('.label').removeClass().addClass('label label-danger');
                     break;
                 case 1:
                     priority = "Severe";
                     $('.label').removeClass().addClass('label label-warning');
                     break;
                 case 2:
                     priority = "Major";
                     $('.label').removeClass().addClass('label label-primary');
                     break;
                 case 3:
                     priority = "Minor";
                     $('.label').removeClass().addClass('label label-info');
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
             //when update the task , set task title
             $('#updatetask-title-input').val(data.name);

             //detail info
             $('#taskdetail').text(data.detail);
             //update the task
             $('#updatetask-desc-textarea').val(data.detail);

             //set deadline
             $('.detaildeadline').children().text(data.deadline);
             //when update task
             if (data.deadline != "") {
                 $('#updatetask-deadline-input').val(data.deadline);
             }

             if (data.starttime != "") {
                 $('#updatetask-starttime-input').val(data.starttime);
             }

             //when update task set the type
             $("#updatetask-group-select option[value='" + data.type + "']").attr("selected", true);

             //when update task set the priority
             $("#updatetask-priority-select option[value='" + data.priority + "']").attr("selected", true);

             //when update task set the todoer
             if (data.todoer.length > 0) {
                 $("#updatetask-todoer-select option[value='" + data.todoer[0].userid + "']").attr("selected", true);
             }
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
         $("#deletetask-modal").data("taskid", taskid);
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
         $.post("/addcomment/", {
             taskid: taskid,
             content: content
         }).then(function(resp) {
             //append a comment to the comment box
             var comments = "<div class='comment mycomment'>\
             <img src='/static/image/head.png' class='smallphoto'>\
             <span class='comment-content'>" + content + "</span></div>";
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

 // delete task
 $(document).on("click", ".glyphicon-trash", function(e) {
     //$(".glyphicon-trash").click(function(e) {
     var taskid = $(e.target).prev().children().data("taskid");
     $("#deletetask-modal").data("taskid", taskid);
     $("#deletetask-modal").modal('show');
 });
 $(".deletebtn").click(function(e) {
     $("#deletetask-modal").modal('show');
 });

 $(".addtaskbtn").click(function() {
     $("#task-modal .suggesstion").remove();
     $("#task-modal").modal('show');
 });
 $(".changebtn").click(function() {
     $("#updatetask-modal").modal('show');
 });
 $(".addteambtn").click(function() {
     $("#newteam-modal").modal('show');
 });
 $(".addprojectbtn").click(function() {
     $("#newproject-modal .suggesstion").remove();
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
 $(".deleteprojectbtn").click(function() {
     var projectname = $("#project-list a.active").text();
     $("#deleteproject-modal div.modal-body span b").text(projectname);
     $("#deleteproject-modal").modal("show");
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

     var todoerstr = todoer.join(",");

     //if title or todoer is null ,suggesstion
     if (title == "") {
         if ($("#add-task-form .suggesstion").length > 0) {
             $("#add-task-form .suggesstion").remove();
         }
         $("#task-title-input").parent().append("<div class='suggesstion'>*任务名称不能为空</div>");
     };


     if (taskid == 0) {
         //new
         $.post("/addtask/", {
             taskid: "0",
             projectid: projectid,
             name: title,
             detail: detail,
             deadline: deadline,
             starttime: starttime,
             priority: priority,
             type: group,
             todoer: todoerstr
         }).then(function(resp) {
             //callback
             var whichweek = "";
             var priorityname = "";
             var h5 = "h5.";
             var datataskid = eval('(' + resp + ')').taskid;
             var tmptaskid = "task" + datataskid;
             var checkboxhtml = "<div class='icheckbox_square-blue' style='position: relative; display: none;'><input type='checkbox' class='inishbox' style='position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background-color: rgb(255, 255, 255); border: 0px; opacity: 0; background-position: initial initial; background-repeat: initial initial;'><ins class='iCheck-helper' style='position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background-color: rgb(255, 255, 255); border: 0px; opacity: 0; background-position: initial initial; background-repeat: initial initial;'></ins></div>";
             switch (group) {
                 case "0":
                     whichweek = "#futureTask";
                     break;
                 case "1":
                     whichweek = "#nextWeekTask";
                     break;
                 case "2":
                     whichweek = "#currentWeekTask";
                     checkboxhtml = "<div class='icheckbox_square-blue' style='position: relative;'><input type='checkbox' class='inishbox' style='position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background-color: rgb(255, 255, 255); border: 0px; opacity: 0; background-position: initial initial; background-repeat: initial initial;'><ins class='iCheck-helper' style='position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background-color: rgb(255, 255, 255); border: 0px; opacity: 0; background-position: initial initial; background-repeat: initial initial;'></ins></div>";
                     break;
             }

             switch (priority) {
                 case "0":
                     priorityname = "Critical";
                     break;
                 case "1":
                     priorityname = "Severe";
                     break;
                 case "2":
                     priorityname = "Major";
                     break;
                 case "3":
                     priorityname = "Minor";
                     break;
             }

             if ($(whichweek + " " + h5 + priorityname).length > 0) {
                 // $(whichweek+ " " +priorityname).append("<div class='task'>\
                 //             <div class='icheckbox_square-blue' style='position: relative;'><input type='checkbox' class='inishbox' style='position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background-color: rgb(255, 255, 255); border: 0px; opacity: 0; background-position: initial initial; background-repeat: initial initial;'><ins class='iCheck-helper' style='position: absolute; top: -20%; left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background-color: rgb(255, 255, 255); border: 0px; opacity: 0; background-position: initial initial; background-repeat: initial initial;'></ins></div>\
                 //             <span class='tasktitle'><a href='#' data-taskid='"+datataskid+"'>"+ title +"</a></span>\
                 //             <span class='glyphicon glyphicon-trash'></span>\
                 //     </div>");
             } else {
                 var tmpclass = ".panel-body";
                 var delespan = " > span";
                 $(whichweek + " " + tmpclass + " " + delespan).remove();
                 $(whichweek + " " + tmpclass).append("<h5 class='" + priorityname + "'>" + priorityname + "</h5>");
             }
             $(whichweek + " " + h5 + priorityname).after("<div class='task' id='" + tmptaskid + "'>" + checkboxhtml + "<span class='tasktitle'><a href='#' data-taskid='" + datataskid + "'> " + title + " </a></span><span class='glyphicon glyphicon-trash'></span></div>");

             $("#task-modal").modal('hide');
             //reload
             //window.location.reload();
             console.log(resp);
         });
     } else {
         //update

     }

 });

 $("#add-project-submitbtn").click(function() {
     var title = $("#newproject-modal input").val();
     var teamid = window.teamid;
     if (title == "") {
         //GZW
         if ($("#newproject-modal .suggesstion").length > 0) {
             $("#newproject-modal .suggesstion").remove();
         }
         $("#newproject-modal input").parent().append("<div class='suggesstion'>*项目名称不能为空</div>");
     } else {
         $.post('/addproject/', {
             projectname: title,
             teamid: teamid
         }).then(function(resp) {
             console.log(resp);
         });
     }
 });

 $("#deletetask-modal .delete-btn").click(function() {
     var taskid = $("#deletetask-modal").data("taskid");
     $.post('/deletetask/', {
         taskid: taskid
     }).then(function(resp) {
         //GZW
         var deletetaskid = "#task" + taskid;
         //如果task为空,删除相应h5
         if ($(deletetaskid).prev().is('h5')) {
             if ($(deletetaskid).next().is('h5')) {
                 $(deletetaskid).prev().remove();
             };
             if ($(deletetaskid).next().length == 0) {
                 $(deletetaskid).prev().remove();
             };
         };

         $(deletetaskid).remove();
         $("#deletetask-modal").modal('hide');
         $('#stat').collapse('show');
         $('#taskinfo').collapse('hide');
         //window.location.reload(); //重新刷新页面
         console.log(resp);
         //delete
     });
 });