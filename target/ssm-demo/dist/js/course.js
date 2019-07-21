//解决编辑器弹出层文本框不能输入的问题
$('#courseModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
    $(document).off('focusin.modal');
});

$(function () {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    $('#courseModal').modal('hide');

    initFlatPickr();

    $("#jqGrid").jqGrid({
        url: 'courses/list',
        datatype: "json",
        colModel: [
            {label: '课程编号', name: 'courseId', index: 'courseId', width: 120, key: true},
            {label: '课程名称', name: 'courseName', index: 'courseName', width: 120},
            {label: '任课教师', name: 'courseTeacher', index: 'courseTeacher', width: 120},
            {label: '课程简介', name: 'courseInfo', index: 'courseInfo', width: 120},
            {label: '上课班级', name: 'courseGrade', index: 'courseGrade', width: 120},
            {label: '开课时间', name: 'startTime', index: 'startTime', width: 120},
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
        var courseId = $("#course_id").val();
        var courseName = $("#course_name").val();
        var courseTeacher = $("#course_teacher").val();
        var courseInfo = $("#course_info").val();
        var courseGrade = $("#course_grade").val();
        var startTime = $("#start_time").val();

        var data = {"courseId": courseId,
            "courseName": courseName,
            "courseTeacher": courseTeacher,
            "courseInfo": courseInfo,
            "courseGrade": courseGrade,
            "startTime": startTime};
        var url = 'courses/save';

        //id>0表示编辑操作
        if (id > 0) {
            url = 'courses/update';
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
                    $('#courseModal').modal('hide');
                    swal("保存成功", {
                        icon: "success",
                    });
                    reload();
                }else if(result.resultCode == 403){
                    closeModal();
                    swal(result.message, {
                        icon: "error",
                    });
                }
                else {
                    $('#courseModal').modal('hide');
                    swal("保存失败", {
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

function courseAdd() {
    reset();
    $('.modal-title').html('添加');
    $('#courseModal').modal('show');

    getSelect();
}

/**
 * 获取下拉列表值
 */
function getSelect() {
    var select = $("#course_teacher");
    select.empty();
    $.ajax({
        type: 'POST',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: 'courses/showSelect',//url
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            checkResultCode(result.resultCode);

            var list = result.data;

            // 循环添加option
            select.append("<option></option>");
            for (var i=0;i < list.length;i++) {
                select.append("<option value='" + list[i].id + "'>"+ list[i].val +"</option>");//添加option
            }
        },
        error: function () {
            swal("任课教师下拉列表获取失败", {
                icon: "error",
            });
        }
    });
}

function courseEdit() {
    reset();
    $('.modal-title').html('编辑');
    $('#course_id').attr("readonly", "readonly");

    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    getSelect();

    //请求数据
    $.get("courses/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $('#id').val(r.data.courseId);
            $('#course_id').val(r.data.courseId);
            $('#course_name').val(r.data.courseName);
            $('#course_teacher').val(r.data.courseTeacher);
            $('#course_info').val(r.data.courseInfo);
            $('#course_grade').val(r.data.courseGrade);
            $('#start_time').val(r.data.startTime);
        }
    });
    //显示modal
    $('#courseModal').modal('show');
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
    $("#jqGrid").jqGrid("setGridParam", {url: 'courses/search'}).trigger("reloadGrid");
}

/**
 * 数据验证
 */
function validObject() {
    var courseId = $('#course_id').val();
    if (isNull(courseId)) {
        showErrorInfo("课程编号不能为空!");
        return false;
    }
    if (!validLength(courseId, 20)) {
        showErrorInfo("课程编号不能大于20!");
        return false;
    }
    if (isNaN(courseId)) {
        showErrorInfo("课程编号只能为纯数字!");
        return false;
    }

    var course_name = $('#course_name').val();
    if (isNull(course_name)) {
        showErrorInfo("课程名称不能为空!");
        return false;
    }
    if (!validLength(course_name, 20)) {
        showErrorInfo("课程名称字符不能大于20!");
        return false;
    }

    var course_teacher = $('#course_teacher').val();
    if (isNull(course_teacher)) {
        showErrorInfo("任课教师不能为空!");
        return false;
    }
    if (!validLength(course_teacher, 20)) {
        showErrorInfo("任课教师字符不能大于20!");
        return false;
    }

    var course_info = $('#course_info').val();
    if (isNull(course_info)) {
        showErrorInfo("课程简介不能为空!");
        return false;
    }
    if (!validLength(course_info, 200)) {
        showErrorInfo("课程简介字符不能大于200!");
        return false;
    }

    var course_grade = $('#course_grade').val();
    if (isNull(course_grade)) {
        showErrorInfo("上课班级不能为空!");
        return false;
    }
    if (!validLength(course_grade, 20)) {
        showErrorInfo("上课班级字符不能大于20!");
        return false;
    }

    var start_time = $('#start_time').val();
    if (isNull(start_time)) {
        showErrorInfo("开课时间不能为空!");
        return false;
    }

    return true;
}

/**
 * 重置
 */
function reset() {
    $('#course_id').removeAttr("readonly");
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");
    //清空数据
    $('#id').val(0);
    $('#keyword').val('');
    $('#course_id').val('');
    $('#course_name').val('');
    $('#course_teacher').val('');
    $('#course_info').val('');
    $('#course_grade').val('');
    $('#start_time').val('');
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
                url: "courses/delete",
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
                    }else if(r.resultCode == 403){
                        closeModal();
                        swal("没有此项操作的权限！", {
                            icon: "error",
                        });
                    }
                    else {
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