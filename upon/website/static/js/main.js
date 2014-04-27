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
                 case '0':
                     priority = "Critical";
                     $('.label').removeClass().addClass('label label-danger');
                     break;
                 case '1':
                     priority = "Severe";
                     $('.label').removeClass().addClass('label label-warning');
                     break;
                 case '2':
                     priority = "Major";
                     $('.label').removeClass().addClass('label label-primary');
                     break;
                 case '3':
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
             //set task data-taskid
             $('#updatetask-modal #addtask-submit-btn').attr("data-taskid", data.id);
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

             //update the status
             $("#updatetask-status-select option[value='" + data.status + "']").attr("selected", true);

             //set deadline
             if (data.deadline == null) {
                 $('.detaildeadline').empty();
             } else {
                 $('.detaildeadline').html("截止时间：<b>" + data.deadline + "</b>");
             }
             //when update task
             if (data.deadline != "") {
                 $('#updatetask-deadline-input').val(data.deadline);
             }

             if (data.starttime != "") {
                 $('#updatetask-starttime-input').val(data.starttime);
             }

             //when update task set the type
             $("#updatetask-group-select").val(data.type);
             $("#updatetask-group-select option[value='" + data.type + "']").attr("selected", true);

             //when update task set the priority
             $("#updatetask-priority-select").val(data.priority);
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
                 var innerhtml = $("<div class='comment'><img class='smallphoto' src='/avatar/"+item.authorid+"/'><span class='comment-content' style='margin:0 5px'>" + item.content + "</span></div>");
                 $('#commentfield').append(innerhtml);
                 if (window.userid == item.authorid) {
                     $('.comment').last().addClass('mycomment');
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
             <img src='/avatar/"+window.userid+"/' class='smallphoto'>\
             <span class='comment-content' style='margin:0 5px'>" + content + "</span></div>";
             $('#commentfield').append(comments);
             $('#comment-content').val("");
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
 $(document).on("click", ".task .glyphicon-trash", function(e) {
     //$(".glyphicon-trash").click(function(e) {
     var taskid = $(e.target).prev().children().data("taskid");
     $("#deletetask-modal").data("taskid", taskid);
     $("#deletetask-modal").modal('show');
 });
 $(".deletebtn").click(function(e) {
     $("#deletetask-modal").modal('show');
 });

 $(document).on("click", ".addtaskbtn", function(e) {

     //init the add task modal
     $('#task-title-input').val($(e.target).parent().parent().find("input").val());
     $('#task-desc-textarea').val("");
     $('#task-deadline-input').val("");
     $('#task-starttime-input').val("");
     //init task-group-select
     $("#task-group-select option[value='0']").attr("selected", false);
     $("#task-group-select option[value='1']").attr("selected", false);
     $("#task-group-select option[value='2']").attr("selected", false);
     switch ($(e.target).data("type")) {
         case "currentWeekTask":
             $("#task-group-select").val("2");
             $("#task-group-select option[value='2']").attr("selected", true);
             break;
         case "nextWeekTask":
             $("#task-group-select").val("1");
             $("#task-group-select option[value='1']").attr("selected", true);
             break;
         case "futureTask":
             $("#task-group-select").val("0");
             $("#task-group-select option[value='0']").attr("selected", true);
             break;
     }
     $("#task-priority-select option[value='2']").attr("selected", true);
     $('#task-todoer-select').selectedIndex = -1;

     $("#task-modal .suggesstion").remove();
     $("#task-modal").modal('show');
 });
 $(".changebtn").click(function() {
     //if input not valid
     $("#updatetask-modal .suggesstion").remove();
     $("#updatetask-modal").modal('show');
 });

 $(".signoutbtn").click(function() {
     $("#signout-modal").modal('show');
 });

 $(".deleteprojectbtn").click(function() {
     var projectname = $("#project-list a.active").text();
     $("#deleteproject-modal div.modal-body span b").text(projectname);
     $("#deleteproject-modal").modal("show");
 });

 $(document).on("click", "#addtask-submit-btn", function(e) {
     var taskid = $(e.target).data("taskid");

     if (taskid == 0) {
         //new
         var title = $("#task-title-input").val();
         var group = $("#task-group-select").val();
         var priority = $("#task-priority-select").val();
         var todoer = $("#todoer-select").val();
         var detail = $("#task-desc-textarea").val();
         var deadline = $("#task-deadline-input").val();
         var starttime = $("#task-starttime-input").val();
         var status = $("#task-status-select").val();

         var projectid = window.projectid;
         //var taskid = $(e.target).data("taskid");
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
         if (status > 0) {
             if ($("#add-task-form .suggesstion").length > 0) {
                 $("#add-task-form .suggesstion").remove();
             }
             $("#task-status-select").parent().append("<div class='suggesstion'>*新建任务只能为'待完成'，不能为'" + $("#task-status-select").find("option:selected").text() + "'</div>");
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
         $.post("/addtask/", {
             taskid: taskid,
             projectid: projectid,
             name: title,
             detail: detail,
             deadline: deadline,
             starttime: starttime,
             priority: priority,
             type: group,
             status: status,
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
             var parrentdate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
             $(whichweek).find('.deadline').each(function(i, item) {
                 var deadline = $(item).text();
                 if (new Date(deadline).getFullYear() == new Date(parrentdate).getFullYear()) {
                     if (new Date(deadline).getMonth() == new Date(parrentdate).getMonth()) {
                         if (new Date(deadline).getDate() - new Date(parrentdate).getDate() == 1) {
                             $(item).attr('style', 'color:red');
                         }
                     };
                 };
             });

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
         var title = $("#updatetask-title-input").val();
         var group = $("#updatetask-group-select").val();
         var priority = $("#updatetask-priority-select").val();
         var todoer = $("#updatetask-todoer-select").val();
         var detail = $("#updatetask-desc-textarea").val();
         var deadline = $("#updatetask-deadline-input").val();
         var starttime = $("#updatetask-starttime-input").val();
         var status = $("#updatetask-status-select").val();

         var projectid = window.projectid;
         var todoerstr = ""
         if (todoer == null) {
             todoerstr = "";
         } else {
             todoerstr = todoer.join(",");
         }
         //if title or todoer is null ,suggesstion
         if (title == "") {
             if ($("#update-task-form .suggesstion").length > 0) {
                 $("#update-task-form .suggesstion").remove();
             }
             $("#updatetask-title-input").parent().append("<div class='suggesstion'>*任务名称不能为空</div>");
             return false;
         };

         if (todoerstr == "") {
             if ($("#update-task-form .suggesstion").length > 0) {
                 $("#update-task-form .suggesstion").remove();
             }
             $("#updatetask-todoer-select").parent().append("<div class='suggesstion'>*指派人不能为空</div>");
             return false;
         }
         if (starttime != "" && deadline != "") {
             if (starttime > deadline) {
                 if ($("#update-task-form .suggesstion").length > 0) {
                     $("#update-task-form .suggesstion").remove();
                 }
                 $("#updatetask-starttime-input").parent().append("<div class='suggesstion'>*任务开始日期不能大于截至日期</div>");
                 return false;
             }
         }
         $.post("/addtask/", {
             taskid: taskid,
             projectid: projectid,
             name: title,
             detail: detail,
             deadline: deadline,
             starttime: starttime,
             priority: priority,
             type: group,
             status: status,
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
             var parrentdate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
             $(whichweek).find('.deadline').each(function(i, item) {
                 var deadline = $(item).text();
                 if (new Date(deadline).getFullYear() == new Date(parrentdate).getFullYear()) {
                     if (new Date(deadline).getMonth() == new Date(parrentdate).getMonth()) {
                         if (new Date(deadline).getDate() - new Date(parrentdate).getDate() == 1) {
                             $(item).attr('style', 'color:red');
                         }
                     };
                 };
             });

             $('.finishbox').iCheck({
                 checkboxClass: 'icheckbox_square-blue',
                 radioClass: 'iradio_square-blue',
                 increaseArea: '20%' // optional
             });
             //update task finish then fresh
             var freshtask = "#task" + taskid + " a";
             $(freshtask).click();
             $("#updatetask-modal").modal('hide');
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
         //$('#stat').collapse('show');
         //$('#taskinfo').collapse('hide');
         $('#taskinfo').removeClass("in").addClass("collapse");
         //window.location.reload(); //重新刷新页面
         console.log(resp);
         //delete
     });
 });
 // 蓝色的完成框只会出现在两个地方，一个是本周任务，一个是我的任务
 // 本周任务用局部刷新来做
 // 我的任务用dom删除来做
 $(document).on("ifChecked", ".finishbox", function(e) {
     var elem = e.target;
     var taskid = $(elem).data("taskid");
     setTimeout(function() {
         $.post("/completetask/", {
             taskid: taskid
         }).then(function(resp) {
             if ($(elem).parent().parent().parent().parent().attr("id") == "mytaskcollapse") {
                 // my task
                 $("#personal-task-panel #task" + taskid).remove();
                 //bug  本周任务也需要重新载入！
                 //我的任务和待确认的任务都是点击刷新的，所以不会出现一致性问题
                 //只有在我的任务和待确认里面勾掉任务的时候， 本周任务才会出现一致性问题
             }
             $.get("/gettask/" + window.projectid + "/2/").then(function(resp) {
                 $("#currentWeekTask .panel-body").html(resp);
                 $('.finishbox').iCheck({
                     checkboxClass: 'icheckbox_square-blue',
                     radioClass: 'iradio_square-blue',
                     increaseArea: '20%' // optional
                 });
             });
             console.log(taskid);
         });
     }, 1000);


 });

 $(document).on("ifChecked", ".confirmbox", function(e) {
     var elem = e.target;
     var taskid = $(elem).data("taskid");
     setTimeout(function() {
         $.post("/confirmtask/", {
             taskid: taskid
         }).then(function(resp) {
             $("#confirm-task-panel #task" + taskid).remove();
             if ($("#confirm-task-panel .panel-body").children().length == 0) {
                 $("#confirm-task-panel .panel-body").append("<span>您还没有需要确认的任务哦~</span>");
             };
             $.get("/gettask/" + window.projectid + "/2/").then(function(resp) {
                 $("#currentWeekTask .panel-body").html(resp);
                 $('.finishbox').iCheck({
                     checkboxClass: 'icheckbox_square-blue',
                     radioClass: 'iradio_square-blue',
                     increaseArea: '20%' // optional
                 });
             });
             console.log(taskid);
         });
     }, 1000);
 });

 $(document).on("ifUnchecked", ".finishbox", function(e) {
     var elem = e.target;
     var taskid = $(elem).data("taskid");
     setTimeout(function() {
         $.post("/incompletetask/", {
             taskid: taskid
         }).then(function(resp) {
             $.get("/gettask/" + window.projectid + "/2/").then(function(resp) {
                 $("#currentWeekTask .panel-body").html(resp);
                 $('.finishbox').iCheck({
                     checkboxClass: 'icheckbox_square-blue',
                     radioClass: 'iradio_square-blue',
                     increaseArea: '20%' // optional
                 });
             });
             console.log(taskid);
         });
     }, 1000);
 });



 function freshConfirmNum() {
     $.get("/getconfirmnum/" + window.projectid + "/").then(function(resp) {
         var data = eval('(' + resp + ')');
         if (data.error_code == "0") {
             if (data.confirm == "0") {
                 $("#waitnum").text("");
             } else {
                 $("#waitnum").text(data.confirm);
             }
         }
     });
 }
 setInterval('freshConfirmNum()', 3000); //指定1秒刷新一次

 //update team
 $('#update-memberinput').autocomplete({
     serviceUrl: '/searchperson/',
     onSelect: function(suggestion) {
         $(".update-addmember").data("userid", suggestion.data);
     }
 });

 $(".update-addmember").click(function() {
     var userid = $(".update-addmember").data("userid");
     var username = $("#update-memberinput").val();
     //GZW 帮我写下 判断哪个userid是否已经被添加在memberbox里了
     if ($("#manageteam-modal .suggesstion").length > 0) {
         $("#manageteam-modal .suggesstion").remove();
     }
     if ($("#manageteam-modal .teammember[data-userid=" + userid + "]").length == 0) {
         $("#manageteam-modal .memberbox").append('<p class="form-control-static teammember" data-userid="' + userid + '">' + username + '<span class="glyphicon glyphicon-trash"></span></p>');
     } else {
         $("#update-memberinput").parent().after("<div class='suggesstion'>*该成员已经添加过</div>");
     }
     $("#update-memberinput").val("");
 });

 $(document).on("click", "#addmember", function() {
     var teamname = $("#teamtitle").val();
     var teamid = "";
     var teamhtml = $(".teammember");
     var teamarray = new Array(teamhtml.length);
     $.each($('.teammember'), function(i, item) {
         teamarray[i] = $(item).data("userid");
     });
     teamid = teamarray.join(",");
     if (teamname != "") {
         $.post("/addteam/", {
             name: teamname,
             member: teamid
         }).then(function(resp) {
             window.location.href = "/" + eval('(' + resp + ')').teamid + "/";
             console.log(resp);
         });
     } else {
         if ($("#newteam-modal .suggesstion").length > 0) {
             $("#newteam-modal .suggesstion").remove();
         }
         $("#teamtitle").parent().append("<div class='suggesstion'>*团队名称不能为空</div>");
         return false;
     }
 });

 $(document).on("click", "#manageteam", function() {
     var teamid = window.teamid;
     var memberid = "";
     var teamhtml = $("#manageteam-modal .teammember");
     var teamarray = new Array(teamhtml.length);
     $.each($('#manageteam-modal .teammember'), function(i, item) {
         teamarray[i] = $(item).data("userid");
     });
     memberid = teamarray.join(",");
     $.post("/updateteam/", {
         teamid: teamid,
         member: memberid
     }).then(function(resp) {
         window.location.href = "/" + eval('(' + resp + ')').teamid + "/";
     });
 });

 $(document).on("click", "#manageteam-modal .glyphicon-trash", function() {
     $(this).parent().remove();
 });

 $("#delete-project-btn").click(function() {
     $.post("/deleteproject/", {
         projectid: window.projectid
     }).then(function(resp) {
         window.location.reload();
     });
 });

 $("#memberpop").click(function() {
     $("#memberbox-modal").modal("show")
 });
 $('.bigphoto').tooltip('hide');

 $(document).on("click", ".glyphicon-share-alt", function() {
     var taskid = $(this).prev().find("a").data("taskid");
     $.post("/reverttask/", {
         taskid: taskid
     }).then(function(resp) {
         $(this).parent().remove();
         window.location.reload();
     });
 });