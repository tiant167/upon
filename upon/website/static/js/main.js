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
             $("#taskinfo .tasktodoer").empty();
             //<img src='{{STATIC_URL}}image/head.png' alt='个人头像' class='img-thumbnail bigphoto'>
             for (var i = 0; i < data.todoer.length; i++) {
                 item = data.todoer[i]
                 $("#taskinfo .tasktodoer").append("<img src='/avatar/" + item.userid + "/'  class='img-thumbnail bigphoto todoer' data-toggle='tooltip' data-placement='bottom' data-original-title='" + item.username + "'/>");
             }


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
             $('#updatetask-todoer-select')[0].selectedIndex = -1;
             if (data.todoer.length > 0) {
                 //update the todoer
                 $.each(data.todoer, function(i, item) {
                     $("#updatetask-todoer-select option[value='" + item.userid + "']").attr("selected", true);
                 });
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
         $('.todoer').tooltip('hide');
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
     $.get("/rubbishbin/" + window.projectid + "/").then(function(resp) {
         $("#rubbishcollapse .panel-body").html(resp);
     });
     $.get("/completed/" + window.projectid + "/").then(function(resp) {
         $("#finishcollapse .panel-body").html(resp);
     });
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
     $.get("/rubbishbin/" + window.projectid + "/").then(function(resp) {
         $("#rubbishcollapse .panel-body").html(resp);
     });
     $.get("/completed/" + window.projectid + "/").then(function(resp) {
         $("#finishcollapse .panel-body").html(resp);
     });
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
     $.get("/mytask/" + window.projectid + "/").then(function(resp) {
         $("#personal-task-panel .panel-body").html(resp);
         $('.finishbox').iCheck({
             checkboxClass: 'icheckbox_square-blue',
             radioClass: 'iradio_square-blue',
             increaseArea: '20%' // optional
         });
     });
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
     $.get("/confirmtask/" + window.projectid + "/").then(function(resp) {
         $("#confirm-task-panel .panel-body").html(resp);
         $('.confirmbox').iCheck({
             checkboxClass: 'icheckbox_square-yellow',
             radioClass: 'iradio_square-yellow',
             increaseArea: '20%' // optional
         });
     });
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

 $(document).on("click", ".addtaskbtn", function() {

     //init the add task modal
     $('#task-title-input').val("");
     $('#task-desc-textarea').val("");
     $('#task-deadline-input').val("");
     $('#task-starttime-input').val("");
     $("#task-group-select option[value='2']").attr("selected", true);
     $("#task-priority-select option[value='2']").attr("selected", true);
     $('#task-todoer-select').selectedIndex = -1;

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
     var todoerstr = ""
     if (todoer == null) {
         todoerstr = "";
     } else {
         todoerstr = todoer.join(",");
     }
     //check the input is correct or not
     //if title or todoer is null ,suggesstion
     if (title == "") {
         if ($("#add-task-form .suggesstion").length > 0) {
             $("#add-task-form .suggesstion").remove();
         }
         $("#task-title-input").parent().append("<div class='suggesstion'>*任务名称不能为空</div>");
         return false;
     };
     if (todoerstr == "") {
         if ($("#add-task-form .suggesstion").length > 0) {
             $("#add-task-form .suggesstion").remove();
         }
         $("#todoer-select").parent().append("<div class='suggesstion'>*指派人不能为空</div>");
         return false;
     }
     if (starttime != "" && deadline != "") {
         if (starttime > deadline) {
             if ($("#add-task-form .suggesstion").length > 0) {
                 $("#add-task-form .suggesstion").remove();
             }
             $("#task-starttime-input").parent().append("<div class='suggesstion'>*任务开始日期不能大于截至日期</div>");
             return false;
         }
     }

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
             var target = "";
             switch (group) {
                 case "0":
                     whichweek = "#futureTask .panel-body";
                     break;
                 case "1":
                     whichweek = "#nextWeekTask .panel-body";
                     break;
                 case "2":
                     whichweek = "#currentWeekTask .panel-body";
                     break;
             }
             $(whichweek).html(resp);
             $('.finishbox').iCheck({
                 checkboxClass: 'icheckbox_square-blue',
                 radioClass: 'iradio_square-blue',
                 increaseArea: '20%' // optional
             });
             $("#task-modal").modal('hide');
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
         //if h5 is null ,and the suggestion to add new task
         if ($(deletetaskid).parent().children("h5").length == 0) {
             $(deletetaskid).after("<span>还没有任务哦，赶紧<a href='#' class='addtaskbtn'>添加</a>一个吧</span>").remove();
         } else {
             $(deletetaskid).remove();
         }
         $("#deletetask-modal").modal('hide');
         $('#stat').collapse('show');
         $('#taskinfo').collapse('hide');
         //window.location.reload(); //重新刷新页面
         console.log(resp);
         //delete
     });
 });