//解决编辑器弹出层文本框不能输入的问题
$('#teacherModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
    $(document).off('focusin.modal');
});

$(function () {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    $('#teacherModal').modal('hide');

    $("#jqGrid").jqGrid({
        url: 'teachers/list',
        datatype: "json",
        colModel: [
            {label: '教师编号', name: 'teacherId', index: 'teacherId', width: 120, key: true},
            {label: '教师姓名', name: 'teacherName', index: 'teacherName', width: 120},
            {label: '性别', name: 'teacherSex', index: 'teacherSex', width: 120},
            {label: '电话', name: 'teacherTel', index: 'teacherTel', width: 120},
            {label: '地址', name: 'teacherAddress', index: 'teacherAddress', width: 120},
            {label: '专长', name: 'teacherExpertise', index: 'teacherExpertise', width: 120},
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
        var teacherId = $("#teacher_id").val();
        var teacherName = $("#teacher_name").val();
        var teacherSex = $("#teacher_sex").val();
        var teacherTel = $("#teacher_tel").val();
        var teacherAddress = $("#teacher_address").val();
        var teacherExpertise = $("#teacher_expertise").val();

        var data = {"teacherId": teacherId,
            "teacherName": teacherName,
            "teacherSex": teacherSex,
            "teacherTel": teacherTel,
            "teacherAddress": teacherAddress,
            "teacherExpertise": teacherExpertise};
        var url = 'teachers/save';

        //id>0表示编辑操作
        if (id > 0) {
            url = 'teachers/update';
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
                    $('#teacherModal').modal('hide');
                    swal("保存成功", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#teacherModal').modal('hide');
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

function teacherAdd() {
    reset();
    $('.modal-title').html('添加');
    $('#teacherModal').modal('show');
}

function teacherEdit() {
    reset();
    $('.modal-title').html('编辑');
    $('#teacher_id').attr("readonly", "readonly");

    var id = getSelectedRow();
    if (id == null) {
        return;
    }
    //请求数据
    $.get("teachers/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $('#id').val(r.data.teacherId);
            $('#teacher_id').val(r.data.teacherId);
            $('#teacher_name').val(r.data.teacherName);
            $('#teacher_sex').val(r.data.teacherSex);
            $('#teacher_tel').val(r.data.teacherTel);
            $('#teacher_address').val(r.data.teacherAddress);
            $('#teacher_expertise').val(r.data.teacherExpertise);
        }
    });
    //显示modal
    $('#teacherModal').modal('show');
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
    $("#jqGrid").jqGrid("setGridParam", {url: 'teachers/search'}).trigger("reloadGrid");
}

/**
 * 数据验证
 */
function validObject() {
    var teacherId = $('#teacher_id').val();
    if (isNull(teacherId)) {
        showErrorInfo("教师编号不能为空!");
        return false;
    }
    if (!validLength(teacherId, 20)) {
        showErrorInfo("教师编号不能大于20!");
        return false;
    }
    if (isNaN(teacherId)) {
        showErrorInfo("教师编号只能为纯数字!");
        return false;
    }

    var teacher_name = $('#teacher_name').val();
    if (isNull(teacher_name)) {
        showErrorInfo("教师名称不能为空!");
        return false;
    }
    if (!validLength(teacher_name, 20)) {
        showErrorInfo("教师名称字符不能大于20!");
        return false;
    }

    var teacher_sex = $('#teacher_sex').val();
    if (isNull(teacher_sex)) {
        showErrorInfo("性别不能为空!");
        return false;
    }

    var teacher_tel = $('#teacher_tel').val();
    if (isNull(teacher_tel)) {
        showErrorInfo("教师电话不能为空!");
        return false;
    }
    if (!validLength(teacher_tel, 20)) {
        showErrorInfo("教师电话字符不能大于20!");
        return false;
    }

    var teacher_address = $('#teacher_address').val();
    if (isNull(teacher_address)) {
        showErrorInfo("教师地址不能为空!");
        return false;
    }
    if (!validLength(teacher_address, 200)) {
        showErrorInfo("教师地址字符不能大于200!");
        return false;
    }

    return true;
}

/**
 * 重置
 */
function reset() {
    $('#teacher_id').removeAttr("readonly");
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");
    //清空数据
    $('#id').val(0);
    $('#keyword').val('');
    $('#teacher_id').val('');
    $('#teacher_name').val('');
    $('#teacher_sex').val('');
    $('#teacher_tel').val('');
    $('#teacher_address').val('');
    $('#teacher_expertise').val('');
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
                url: "teachers/delete",
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