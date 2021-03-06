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
    var parrentdate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();
    $('.task').find('.deadline').each(function(i, item) {
        var deadline = $(item).text();
        if (new Date(deadline).getFullYear() == new Date(parrentdate).getFullYear()) {
            if (new Date(deadline).getMonth() == new Date(parrentdate).getMonth()) {
                if (new Date(deadline).getDate() - new Date(parrentdate).getDate() == 1) {
                    $(item).attr('style', 'color:red');
                }
            };
        };
    });
});

//add Project
$(document).on("click", ".addprojectbtn", function() {
    $("#newproject-modal .suggesstion").remove();
    $("#newproject-modal").modal('show');
});
$("#project-list > a").click(function() {
    var all = $(this).parent().children().length - 1;
    var parrent = $(this).index();
    if (parrent < all) {
        $(this).parent().children(":lt(" + all + ")").removeClass("active").children().remove();
        $(this).addClass("active").append('<span class="glyphicon glyphicon-chevron-right"></span>');
    } else {
        $("#newproject-modal .suggesstion").remove();
        $("#newproject-modal").modal('show');
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
            var data = eval('(' + resp + ')');
            window.location.href = "/" + window.teamid + "/" + data.projectid + "/";
            console.log(resp);

        });
    }
});

//add Team 
$(".addteambtn").click(function() {
    $("#newteam-modal .suggesstion").remove();
    $("#newteam-modal").modal('show');
});
$('#create-memberinput').autocomplete({
    serviceUrl: '/searchperson/',
    onSelect: function(suggestion) {
        $(".create-addmember").data("userid", suggestion.data);
    }
    //$(".memberbox").append('<p class="form-control-static teammember" data-userid="' + suggestion.data + '">' + suggestion.value + '<span class="glyphicon glyphicon-trash"></span></p>');
});

$(".create-addmember").click(function() {
    var userid = $(".create-addmember").data("userid");
    var username = $("#create-memberinput").val();
    if (userid == null) {
        return false;
    };
    //GZW 帮我写下 判断哪个userid是否已经被添加在memberbox里了
    if ($("#newteam-modal .suggesstion").length > 0) {
        $("#newteam-modal .suggesstion").remove();
    }
    if ($("#newteam-modal .teammember[data-userid=" + userid + "]").length == 0) {
        $("#newteam-modal .memberbox").append('<p class="form-control-static teammember" data-userid="' + userid + '">' + username + '<span class="glyphicon glyphicon-trash"></span></p>');
    } else {
        $("#create-memberinput").parent().after("<div class='suggesstion'>*该成员已经添加过</div>");
    }
    $("#create-memberinput").val("");
});

$(document).on("click", "#addmember", function() {
    var teamname = $("#teamtitle").val();
    var teamid = "";
    var teamhtml = $("#newteam-modal .teammember");
    var teamarray = new Array(teamhtml.length);
    $.each($('#newteam-modal .teammember'), function(i, item) {
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

//update team
$(".manageteambtn").click(function() {
    $("#manageteam-modal .suggesstion").remove();
    $("#manageteam-modal").modal('show');
});

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

//personal info
$(".modifypersoninfobtn").click(function() {
    $("#modifypersoninfo-modal").modal('show');
});

$("#updatePersonalInfo").click(function() {
    var username = $("#nametitle").val();
    if (username != "") {
        $.post("/updatepersonalinfo/", {
            username: username
        }).then(function(resp) {
            window.location.reload();
        });
    }
});

// member box
$("#memberpop").click(function() {
    $("#memberbox-modal").modal("show");
});
$('.bigphoto').tooltip('hide');