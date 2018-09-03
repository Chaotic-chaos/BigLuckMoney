function display(){
    //进入后立即加载查询post
    $.post("/process.php?action=query", {}, function(res){
        //post回调
        if(res == "No Records in database!"){
            $("#cards_area").empty();
            $("#cards_area").append("<h3>No Records in Database!</h3>");
        }
        var result = eval(res);
        $("#cards_area").empty();
        for(i=0; i<result.length; i++){
            var display_card = '<!--这里是显示卡-->\n' +
                '                <div class="container_card">\n' +
                '                    <div class="card text-white bg-primary mb-3" id="display_card_"' + (i+1) + ' style="max-width: 20rem;">\n' +
                '                        <div class="card-header">' + result[i].record_date + '<button type="submit" id="' + result[i].record_id + '" class="close del">&times;</button></div>\n' +
                '                        <div class="card-body">\n' +
                '                            <p class="card-text">' + result[i].record_content + '</p>\n' +
                '                            <textarea class="card-text" id="text_' + (i+1) +'" style="position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;">' + result[i].record_content + '</textarea>\n' +
                '                            <button type="button" class="btn btn-outline-secondary writeclipboard" style="width: 48%">一键复制</button>\n' +
                '                            <button type="button" class="btn btn-outline-secondary openlink" style="width: 49%">打开网址</button>\n' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '                <!--显示卡结束在这里-->'
            $("#cards_area").append(display_card);
        }
    })
}

function scrollToEnd(){//滚动到底部
    var h = $(document).height()-$(window).height();
    $(document).scrollTop(h);
}

function showCopySuccess(){
    $("#dialog_area").empty();
    var copy_success = '<div class="alert alert-dismissible alert-info">\n' +
        '                        <button type="button" class="close" data-dismiss="alert">&times;</button>\n' +
        '                        <h4 class="alert-heading">o(>﹏<)o搞定!</h4>\n' +
        '                        <p class="mb-0">复制好了！快去粘贴！</p>\n' +
        '                    </div>';
    $("#dialog_area").append(copy_success);
}

$(document).ready(
    display()
)


$("#submit").click(function(){
    var content = $("#content").val();
    if(content == ''){
        $("#submit").text("请输入内容");
        $("#submit").attr("class", "btn btn-warning btn-lg btn-block");
    }
    else {
        $.post("/process.php?action=insert", {content: content}, function (res) {
            //post回调
            if(res == "success"){
                $("#submit").text("O(∩_∩)O嗯!");
                $("#submit").attr("class", "btn btn-success btn-lg btn-block");
                $("#content").val("");
                display();
                scrollToEnd();
            }
            else{
                $("#submit").text("服务器再次崩溃");
                $("#submit").attr("class", "btn btn-danger btn-lg btn-block");
            }
        })
    }
})

$("#cards_area").on("click", ".del", function(){
    var record_id = $(this).attr("id");
    $.post("/process.php?action=del_record", {record_id: record_id}, function(res){
        //post回调
        $("#dialog_area").empty();
        var del_dialog_success = '<div class="alert alert-dismissible alert-success">\n' +
            '                        <button type="button" class="close" data-dismiss="alert">&times;</button>\n' +
            '                        <h4 class="alert-heading">o(>﹏<)o搞定!</h4>\n' +
            '                        <p class="mb-0">删除成功，已经更新显示区</p>\n' +
            '                    </div>';
        var del_dialog_failed = '<div class="alert alert-dismissible alert-danger">\n' +
            '                        <button type="button" class="close" data-dismiss="alert">&times;</button>\n' +
            '                        <h4 class="alert-heading">(⊙o⊙)Opps!</h4>\n' +
            '                        <p class="mb-0">删除失败，自己检查服务器吧</p>\n' +
            '                    </div>';
        if(res == "success"){
            $("#dialog_area").append(del_dialog_success);
        }
        else{
            $("#dialog_area").append(del_dialog_success);
        }
        display();
        scrollToEnd();
    })
})

$("#cards_area").on("click", ".openlink", function(){
    var link = $(this).prev().prev().text();
    // var redirectWindow = window.open(link, '_blank');
    // redirectWindow.location;
    // window.open("www.baidu.com", "_blank").location;
    window.location.href("www.baidu.com");
})

$("#cards_area").on("click", ".writeclipboard", function(){
    var id = $(this).prev().attr("id");
    var text = document.getElementById(id);
    text.select();
    document.execCommand("Copy");
    showCopySuccess();
})