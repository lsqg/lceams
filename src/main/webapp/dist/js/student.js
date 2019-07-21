//解决编辑器弹出层文本框不能输入的问题
$('#studentModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
    $(document).off('focusin.modal');
});

$(function () {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    $('#studentModal').modal('hide');

    $("#jqGrid").jqGrid({
        url: 'students/list',
        datatype: "json",
        colModel: [
            {label: '学号', name: 'studentId', index: 'studentId', width: 120, key: true},
            {label: '所在班级', name: 'grade', index: 'grade', width: 120},
            {label: '学生姓名', name: 'studentName', index: 'studentName', width: 120},
            {label: '性别', name: 'studentSex', index: 'studentSex', width: 120},
            {label: '年龄', name: 'studentAge', index: 'studentAge', width: 120},
            {label: '家长电话', name: 'parentTel', index: 'parentTel', width: 120},
            {label: '家庭住址', name: 'address', index: 'address', width: 120},
            {label: '添加时间', name: 'createTime', index: 'createTime', width: 120},
            {label: '最后更新时间', name: 'updateTime', index: 'updateTime', width: 120}
        ],
        height: 560,
        rowNum: 10,
        rowList: [10, 20, 50],
        styleUI: 'Bootstrap',
        loadtext: '信息读取中...',
        rownumbers: false,
        rownumWidth: 20,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "data.list",
            page: "data.currPage",
            total: "data.totalPage",
            records: "data.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order",
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

});

//绑定modal上的保存按钮
$('#saveButton').click(function () {
    //验证数据
    if (validObject()) {
        //一切正常后发送网络请求
        //ajax
        var id = $("#id").val();
        var studentId = $("#student_id").val();
        var grade = $("#grade").val();
        var studentName = $("#student_name").val();
        var studentSex = $("#student_sex").val();
        var studentAge = $("#student_age").val();
        var parentTel = $("#parent_tel").val();
        var address = $("#address").val();

        var data = {"studentId": studentId,
            "grade": grade,
            "studentName": studentName,
            "studentSex": studentSex,
            "studentAge": studentAge,
            "parentTel": parentTel,
            "address": address};

        var url = 'students/save';

        //id>0表示编辑操作
        if (id > 0) {
            url = 'students/update';
        }
        $.ajax({
            type: 'POST',//方法类型
            dataType: "json",//预期服务器返回的数据类型
            url: url,//url
            contentType: "application/json; charset=utf-8",
            beforeSend: function (request) {
                //设置header值
                request.setRequestHeader("token", getCookie("token"));
            },
            data: JSON.stringify(data),
            success: function (result) {
                checkResultCode(result.resultCode);
                if (result.resultCode == 200) {
                    $('#studentModal').modal('hide');
                    swal("保存成功", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#studentModal').modal('hide');
                    swal(result.message, {
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
 * 获取下拉列表值
 */
function getSelect() {
    var select = $("#grade");
    select.empty();
    $.ajax({
        type: 'POST',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: 'students/showSelect',//url
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            checkResultCode(result.resultCode);

            var list = result.data;

            // 循环添加option
            select.append("<option></option>");
            for (var i=0;i < list.length;i++) {
                select.append("<option value='" + list[i].id + "'>"+ list[i].val +"</option>");
            }
        },
        error: function () {
            swal("所在班级下拉列表获取失败", {
                icon: "error",
            });
        }
    });
}

function studentAdd() {
    reset();
    $('.modal-title').html('添加');
    $('#studentModal').modal('show');

    getSelect();
}

function studentEdit() {
    reset();
    $('.modal-title').html('编辑');
    $('#student_id').attr("readonly", "readonly");

    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    getSelect();

    //请求数据
    $.get("students/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $('#id').val(r.data.studentId);
            $('#student_id').val(r.data.studentId);
            $('#student_name').val(r.data.studentName);
            $('#grade').val(r.data.grade);
            $('#student_sex').val(r.data.studentSex);
            $('#student_age').val(r.data.studentAge);
            $('#parent_tel').val(r.data.parentTel);
            $('#address').val(r.data.address);
        }
    });
    //显示modal
    $('#studentModal').modal('show');
}

/**
 * 搜索功能
 */
function search() {
    //标题关键字
    var keyword = $('#keyword').val();
    if (!validLength(keyword, 20)) {
        swal("搜索字段长度过大!", {
            icon: "error",
        });
        return false;
    }

    //数据封装
    var searchData = {keyword: keyword};

    //传入查询条件参数
    $("#jqGrid").jqGrid("setGridParam", {postData: searchData});
    //点击搜索按钮默认都从第一页开始
    $("#jqGrid").jqGrid("setGridParam", {page: 1});
    //提交post并刷新表格
    $("#jqGrid").jqGrid("setGridParam", {url: 'students/search'}).trigger("reloadGrid");
}

/**
 * 数据验证
 */
function validObject() {
    var studentId = $('#student_id').val();
    if (isNull(studentId)) {
        showErrorInfo("学号不能为空!");
        return false;
    }
    if (!validLength(studentId, 20)) {
        showErrorInfo("学号不能大于20!");
        return false;
    }
    if (isNaN(studentId)) {
        showErrorInfo("学号只能为纯数字!");
        return false;
    }

    var student_name = $('#student_name').val();
    if (isNull(student_name)) {
        showErrorInfo("学生名称不能为空!");
        return false;
    }
    if (!validLength(student_name, 20)) {
        showErrorInfo("学生名称字符不能大于20!");
        return false;
    }

    var student_sex = $('#student_sex').val();
    if (isNull(student_sex)) {
        showErrorInfo("性别不能为空!");
        return false;
    }

    var student_age = $('#student_age').val();
    if (isNull(student_age)) {
        showErrorInfo("年龄不能为空!");
        return false;
    }if (!validLength(student_age, 3)) {
        showErrorInfo("年龄字符长度不能大于3!");
        return false;
    }

    var parent_tel = $('#parent_tel').val();
    if (isNull(parent_tel)) {
        showErrorInfo("家长电话不能为空!");
        return false;
    }
    if (!validLength(parent_tel, 20)) {
        showErrorInfo("家长电话字符不能大于20!");
        return false;
    }
    if (isNaN(parent_tel)) {
        showErrorInfo("家长电话只能为纯数字!");
        return false;
    }

    var address = $('#address').val();
    if (isNull(address)) {
        showErrorInfo("地址不能为空!");
        return false;
    }
    if (!validLength(address, 200)) {
        showErrorInfo("地址字符不能大于200!");
        return false;
    }

    return true;
}

/**
 * 重置
 */
function reset() {
    $('#student_id').removeAttr("readonly");
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");
    //清空数据
    $('#id').val(0);
    $('#keyword').val('');
    $('#student_id').val('');
    $("#grade").val('');
    $('#student_name').val('');
    $('#student_sex').val('');
    $('#student_age').val('');
    $('#parent_tel').val('');
    $('#address').val('');
}

function deleteGrade() {
    var ids = getSelectedRows();
    if (ids == null) {
        return;
    }
    swal({
        title: "确认弹框",
        text: "确认要删除数据吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
        if (flag) {
            $.ajax({
                type: "POST",
                url: "students/delete",
                contentType: "application/json",
                beforeSend: function (request) {
                    //设置header值
                    request.setRequestHeader("token", getCookie("token"));
                },
                data: JSON.stringify(ids),
                success: function (r) {
                    checkResultCode(r.resultCode);
                    if (r.resultCode == 200) {
                        swal("删除成功", {
                            icon: "success",
                        });
                        $("#jqGrid").trigger("reloadGrid");
                    } else {
                        swal(r.message, {
                            icon: "error",
                        });
                    }
                }
            });
        }
    });
}

/**
 * jqGrid重新加载
 */
function reload() {
    reset();
    var page = $("#jqGrid").jqGrid('getGridParam', 'page');
    $("#jqGrid").jqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}