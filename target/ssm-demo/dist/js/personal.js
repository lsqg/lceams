$(function () {
    //隐藏错误提示框
    $('.add-error-info').css("display", "none");

    $.ajax({
        type: 'POST',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: 'users/getUser',//url
        contentType: "application/json; charset=utf-8",
        beforeSend: function (request) {
            //设置header值
            request.setRequestHeader("token", getCookie("token"));
        },
        success: function (result) {
            checkResultCode(result.resultCode);

            $("#userName").val(result.data);
        },
        error: function () {
            swal("获取个人信息失败", {
                icon: "error",
            });
        }
    });
});

//绑定modal上的保存按钮
$('#saveButton').click(function () {
    //验证数据
    if (validObjectForAdd()) {
        //一切正常后发送网络请求
        //ajax
        var password = $("#password").val();

        $.ajax({
            type: 'POST',//方法类型
            dataType: "json",//预期服务器返回的数据类型
            url: 'users/updPassword',//url
            contentType: "application/json; charset=utf-8",
            data: password,
            beforeSend: function (request) {
                //设置header值
                request.setRequestHeader("token", getCookie("token"));
            },
            success: function (result) {
                console.log(result);//打印服务端返回的数据
                checkResultCode(result.resultCode);
                if (result.resultCode == 200) {
                    swal("修改成功", {
                        icon: "success",
                    });
                }
                else {
                    swal("修改失败", {
                        icon: "error",
                    });
                }
                ;
            },
            error: function () {
                swal("操作失败", {
                    icon: "error",
                });
            }
        });

    }
});

/**
 * 数据验证
 */
function validObjectForAdd() {
    var password = $('#password').val();
    if (isNull(password)) {
        showErrorInfo("密码不能为空!");
        return false;
    }
    if (!validPassword(password)) {
        showErrorInfo("请输入符合规范的密码!");
        return false;
    }

    return true;
}