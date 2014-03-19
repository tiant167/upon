 $('#rightcolumn .close').click(function() {
     $('#stat').collapse('show');
     $('#taskinfo').collapse('hide');

 });


 $('.task a').click(function() {
     $('#stat').collapse('hide');
     // $('#taskinfo').css('display','block');
     $('#taskinfo').collapse('show');
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
 $("#addteambtn").click(function() {
     $("#newteam-modal").modal('show');
 });
 $("#addprojectbtn").click(function() {
     $("#newproject-modal").modal('show');
 });
 $("#modifypersoninfobtn").click(function() {
     $("#modifypersoninfo-modal").modal('show');
 });
 
  $("#project-list > a").click(function(){
	var all = $(this).parent().children().length - 1;
	var parrent = $(this).index();
	if(parrent < all) {
		$(this).parent().children(":lt("+all+")").removeClass("active").children().remove();
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