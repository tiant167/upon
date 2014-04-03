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
                     break;
                 case 1:
                     priority = "Severe";
                     break;
                 case 2:
                     priority = "Major";
                     break;
                 case 3:
                     priority = "Minor";
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
             $('.label,.label-primary').parent().next().text(data.name);

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
     $("#new-task-modal").modal('show');
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