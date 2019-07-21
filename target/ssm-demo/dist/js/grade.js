//解决编辑器弹出层文本框不能输入的问题
$('#gradeModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
    $(document).off('focusin.modal');
});

$(function () {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    $('#gradeModal').modal('hide');

    $("#jqGrid").jqGrid({
        url: 'grades/list',
        datatype: "json",
        colModel: [
            {label: '班级编号', name: 'gradeId', index: 'gradeId', width: 50, key: true},
            {label: '班级名称', name: 'gradeName', index: 'gradeName', width: 120},
            {label: '班主任', name: 'gradeTeacher', index: 'gradeTeacher', width: 120},
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
        var id = $("#gradeId").val();
        var gradeId = $("#id").val();
        var gradeName = $("#grade_name").val();
        var gradeTeacher = $("#gradeTeacher").val();
        var data = {"gradeId": gradeId, "gradeName": gradeName, "gradeTeacher": gradeTeacher};
        var url = 'grades/save';
        //id>0表示编辑操作
        if (id > 0) {
            url = 'grades/update';
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
                    $('#gradeModal').modal('hide');
                    swal("保存成功", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#gradeModal').modal('hide');
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
    var select = $("#gradeTeacher");
    select.empty();
    $.ajax({
        type: 'POST',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: 'grades/showSelect',//url
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
            swal("班主任下拉列表获取失败", {
                icon: "error",
            });
        }
    });
}

function gradeAdd() {
    reset();
    $('.modal-title').html('添加');
    $('#gradeModal').modal('show');

    getSelect();
}

function gradeEdit() {
    reset();
    $('.modal-title').html('编辑');
    $('#id').attr("readonly", "readonly");

    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    getSelect();

    //请求数据
    $.get("grades/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $('#gradeId').val(r.data.gradeId);
            $('#id').val(r.data.gradeId);
            $("#grade_name").val(r.data.gradeName);
            $('#gradeTeacher').val(r.data.gradeTeacher);
        }
    });
    //显示modal
    $('#gradeModal').modal('show');
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
    $("#jqGrid").jqGrid("setGridParam", {url: 'grades/search'}).trigger("reloadGrid");
}

/**
 * 数据验证
 */
function validObject() {
    var id = $('#id').val();
    if (isNull(id)) {
        showErrorInfo("班级编号不能为空!");
        return false;
    }
    if (!validLength(id, 20)) {
        showErrorInfo("班级编号不能大于20!");
        return false;
    }
    if (isNaN(id)) {
        showErrorInfo("班级编号只能为纯数字!");
        return false;
    }

    var gradeName = $('#grade_name').val();
    if (isNull(gradeName)) {
        showErrorInfo("班级名称不能为空!");
        return false;
    }
    if (!validLength(gradeName, 20)) {
        showErrorInfo("班级名称不能大于20!");
        return false;
    }

    var gradeTeacher = $('#gradeTeacher').val();
    if (isNull(gradeTeacher)) {
        showErrorInfo("班主任不能为空!");
        return false;
    }
    if (!validLength(gradeTeacher, 20)) {
        showErrorInfo("班主任字符不能大于20!");
        return false;
    }
    return true;
}

/**
 * 重置
 */
function reset() {
    $('#id').removeAttr("readonly");
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");
    //清空数据
    $('#gradeId').val(0);
    $('#keyword').val('');
    $('#id').val('');
    $("#grade_name").val('');
    $('#gradeTeacher').val('');
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
                url: "grades/delete",
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