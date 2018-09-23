//函数定义
//显示历史数据
function display(){
    $.post("./process.php?action=query", {}, function (res) {
        //查询回调
        if (res == "No Records in database!") {
            $("#tbody").empty();
        }
        else {
            var result = eval(res);
            $("#tbody").empty();
            for (i = 0; i < result.length; i++) {
                //循环输出表格
                var table_row_alive = '<tr class="table-info" id="' + result[i].record_id + '">\n' +
                    '                <th scope="row">' + result[i].record_date + '</th>\n' +
                    '                <td>' + result[i].link_type + '</td>\n' +
                    '                <td>' + result[i].link + '</td>\n' +
                    '                <td><button type="button" class="btn btn-danger btn-sm used" id="' + result[i].record_id + '">已使用</button></td>\n' +
                    '            </tr>';
                var table_row_recal = '<tr class="table-active" id="' + result[i].record_id + '">\n' +
                    '                <th scope="row">' + result[i].record_date + '</th>\n' +
                    '                <td>' + result[i].link_type + '</td>\n' +
                    '                <td>' + result[i].link + '</td>\n' +
                    '                <td><button type="button" disabled="disabled" class="btn btn-danger btn-sm disabled used" id="' + result[i].record_id + '">已使用</button></td>\n' +
                    '            </tr>';
                //判断是否已经使用，输出不同的颜色
                if(result[i].link_used == 1){
                    //已使用，置灰
                    $("#tbody").append(table_row_recal);
                }
                else{
                    //未使用，置蓝
                    $("#tbody").append(table_row_alive);
                }
            }
        }
    })
}

function scrollToEnd(){//滚动到底部
    var h = $(document).height()-$(window).height();
    $(document).scrollTop(h);
}



//函数入口
$(document).ready(
    //进入加载查询函数
    display()
)

$("#submit").click(//插入新的
    function() {
        //插入新数据
        var type = $("input[name='customRadio']:checked").val();
        var url = $("#url").val();
        if(type == '' || url == ''){
            $("#submit").text("请选择红包类型并输入网址");
            $("#submit").attr("class", "btn btn-warning btn-lg btn-block");
        }
        else {
            $.post("./process.php?action=insert", {type: type, url: url}, function (res) {
                //post回调
                if(res == "success"){
                    $("#submit").text("搞定了！");
                    $("#submit").attr("class", "btn btn-success btn-lg btn-block");
                    $("#key_words").val("");
                    $("#url").val("");
                    display();
                    scrollToEnd();
                }
                else{
                    $("#submit").text("服务器挂了，快去检查");
                    $("#submit").attr("class", "btn btn-danger btn-lg btn-block");
                }
            })
        }
    }
)

$("#tbody").on("click", ".used", function(){
    var id = $(this).attr("id");
    $.post("./process.php?action=update", {id: id}, function(res){
        //更新回调
        if(res == "success"){
            display();
        }
        else{
            alert("服务器挂了，快去修！");
        }
    })
})