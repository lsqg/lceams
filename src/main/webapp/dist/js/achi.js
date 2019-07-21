//解决编辑器弹出层文本框不能输入的问题
$('#achiModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
    $(document).off('focusin.modal');
});

$(function () {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    $('#achiModal').modal('hide');

    initFlatPickr();

    $("#jqGrid").jqGrid({
        url: 'achis/list',
        datatype: "json",
        colModel: [
            {label: '成绩ID', name: 'achiId', index: 'achiId', width: 120,hidden: true, key: true},
            {label: '学号', name: 'studentId', index: 'studentId', width: 120},
            {label: '学生姓名', name: 'studentName', index: 'studentName', width: 120},
            {label: '课程号', name: 'courseId', index: 'courseId', width: 120},
            {label: '课程名', name: 'courseName', index: 'courseName', width: 120},
            {label: '成绩', name: 'achi', index: 'achi', width: 120},
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

/**
 * 初始化时间选择框
 */
function initFlatPickr() {
    $('#start_time').flatpickr();
    //创建一个当前日期对象
    var now = new Date();
    //格式化日，如果小于9，前面补0
    var day = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    var month = ("0" + (now.getMonth() + 1)).slice(-2);

    //拼装完整日期格式
    var todayTime = now.getFullYear() + "-" + (month) + "-" + (day);
    $('.startTime').val(todayTime);
}

//绑定modal上的保存按钮
$('#saveButton').click(function () {
    //验证数据
    if (validObject()) {
        //一切正常后发送网络请求
        //ajax
        var id = $("#id").val();
        var studentId = $("#student_id").val();
        var courseId = $("#course_id").val();
        var achi = $("#achi").val();

        var data = {"achiId": id,
            "studentId": studentId,
            "courseId": courseId,
            "achi": achi};
        var url = 'achis/save';

        //id>0表示编辑操作
        if (id != 0) {
            url = 'achis/update';
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
                    $('#achiModal').modal('hide');
                    swal("保存成功", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#achiModal').modal('hide');
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
    var select = $("#course_id");
    select.empty();
    $.ajax({
        type: 'POST',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: 'achis/showSelect',//url
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
            swal("课程下拉列表获取失败", {
                icon: "error",
            });
        }
    });
}

function achiAdd() {
    reset();
    $('.modal-title').html('添加');
    $('#achiModal').modal('show');

    getSelect();
}

function achiEdit() {
    reset();
    $('.modal-title').html('编辑');
    $('#achi_id').attr("readonly", "readonly");

    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    getSelect();

    //请求数据
    $.get("achis/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $('#id').val(r.data.achiId);
            $('#student_id').val(r.data.studentId);
            $('#course_id').val(r.data.courseId);
            $('#achi').val(r.data.achi);
        }
    });
    //显示modal
    $('#achiModal').modal('show');
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
    $("#jqGrid").jqGrid("setGridParam", {url: 'achis/search'}).trigger("reloadGrid");
}

/**
 * 数据验证
 */
function validObject() {

    var student_id = $('#student_id').val();
    if (isNull(student_id)) {
        showErrorInfo("学号不能为空!");
        return false;
    }
    if (!validLength(student_id, 20)) {
        showErrorInfo("学号字符不能大于20!");
        return false;
    }

    var course_id = $('#course_id').val();
    if (isNull(course_id)) {
        showErrorInfo("课程不能为空!");
        return false;
    }
    if (!validLength(course_id, 20)) {
        showErrorInfo("课程字符不能大于20!");
        return false;
    }

    var achi = $('#achi').val();
    if (isNull(achi)) {
        showErrorInfo("成绩不能为空!");
        return false;
    }
    if (isNaN(achi)) {
        showErrorInfo("成绩只能为纯数字!");
        return false;
    }
    if (!validLength(achi, 3) && achi != 100) {
        showErrorInfo("成绩字符不能大于3!");
        return false;
    }

    return true;
}

/**
 * 重置
 */
function reset() {
    $('#achi_id').removeAttr("readonly");
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");
    //清空数据
    $('#id').val(0);
    $('#keyword').val('');
    $('#student_id').val('');
    $('#course_id').val('');
    $('#achi').val('');
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
                url: "achis/delete",
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
    initFlatPickr();
    var page = $("#jqGrid").jqGrid('getGridParam', 'page');
    $("#jqGrid").jqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}