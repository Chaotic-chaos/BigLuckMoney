<?php
/**
 * Created by PhpStorm.
 * User: tony
 * Date: 8/12/18
 * Time: 3:39 PM
 */

require_once "./config.php";
$action = $_GET['action'];

switch($action){
    case "query":
        query();
        break;
    case "insert":
        insert();
        break;
    case "del_record":
        delete();
}

function query()
{
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PWD);
//数据库是否连接成功，测试用
//        if(!$con){
//            $data_status = "Database failed";
//        }
//        else{
//            $data_status =  "Database connected";
//        }
//切换当前数据库
    mysqli_select_db($con, DB_NAME);
//数据库语句定义
    $sql = "SELECT * FROM clip_note";
    $res = mysqli_query($con, $sql);
    $result_number_rows = mysqli_num_rows($res);
    if (!$result_number_rows) {
        echo "No Records in database!";
    } else {
        $res_array = array();
        //映射为关联数组
        while ($row = mysqli_fetch_assoc($res)) {
            array_push($res_array, $row);
        }
        $finish = json_encode($res_array, JSON_UNESCAPED_UNICODE);
        echo $finish;
    }
    mysqli_close($con);
}

function insert(){
    $content = $_POST['content'];
    $current_date = date("Y-m-d");
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PWD);
//数据库是否连接成功，测试用
//        if(!$con){
//            $data_status = "Database failed";
//        }
//        else{
//            $data_status =  "Database connected";
//        }
//切换当前数据库
    mysqli_select_db($con, DB_NAME);
//数据库语句定义
    $sql = "INSERT INTO clip_note VALUES(null, '".$current_date."','".$content."')";
    mysqli_query($con, $sql);
    $res = mysqli_insert_id($con);
    if(!$res){
        echo "failed";
    }
    else{
        echo "success";
    }
}

function delete(){
    $record_id = $_POST["record_id"];
    $con = mysqli_connect(DB_HOST, DB_USER, DB_PWD);
//数据库是否连接成功，测试用
//        if(!$con){
//            $data_status = "Database failed";
//        }
//        else{
//            $data_status =  "Database connected";
//        }
//切换当前数据库
    mysqli_select_db($con, DB_NAME);
//数据库语句定义
    $sql = "DELETE FROM clip_note WHERE record_id = ".$record_id;
    mysqli_query($con, $sql);
    $affected_rows = mysqli_affected_rows($con);
    if($affected_rows){
        echo "success";
    }
    else{
        echo "failed";
    }
}