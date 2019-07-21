//解决编辑器弹出层文本框不能输入的问题
$('#planModal').off('shown.bs.modal').on('shown.bs.modal', function (e) {
    $(document).off('focusin.modal');
});
//KindEditor变量
var editor;
$(function () {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");

    initFlatPickr();

    //详情编辑器
    editor = KindEditor.create('textarea[id="editor"]', {
        items: ['source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
            'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
            'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'multiimage',
            'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
            'anchor', 'link', 'unlink'],
        uploadJson: 'upload/file',
        filePostName: 'file'
    });

    $('#planModal').on('hidden.bs.modal', function () {
        editor.html('请输入...');
    })

    $('#planModal').modal('hide');

    $("#jqGrid").jqGrid({
        url: 'plans/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 50, key: true, hidden: true},
            {label: '学习计划标题', name: 'planTitle', index: 'planTitle', width: 240},
            {label: '计划者', name: 'planAuthor', index: 'planAuthor', width: 120},
            {label: '计划班级', name: 'planGrade', index: 'planGrade', width: 120},
            {label: '发布时间', name: 'createTime', index: 'createTime', width: 120},
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
    $('.startTime').flatpickr();
    $('.endTime').flatpickr();
    //创建一个当前日期对象
    var now = new Date();
    //格式化日，如果小于9，前面补0
    var day = ("0" + now.getDate()).slice(-2);
    //格式化月，如果小于9，前面补0
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    //小时
    var hour = ("0" + now.getHours()).slice(-2);
    //分钟
    var minute = ("0" + now.getMinutes()).slice(-2);
    //秒
    var seconds = ("0" + now.getSeconds()).slice(-2);
    //拼装完整日期格式
    var todayTime = now.getFullYear() + "-" + (month) + "-" + (day) + " 00:00:00";
    var nowTime = now.getFullYear() + "-" + (month) + "-" + (day) + " " + hour + ":" + minute + ":" + seconds;
    $('.startTime').val(todayTime);
    $('.endTime').val(nowTime);
}

//绑定modal上的保存按钮
$('#saveButton').click(function () {
    //验证数据
    if (validObject()) {
        //一切正常后发送网络请求
        //ajax
        var id = $("#planId").val();
        var planTitle = $("#planTitle").val();
        var planAuthor = $("#planAuthor").val();
        var planGrade = $("#planGrade").val();
        var content = editor.html();
        var data = {"planTitle": planTitle, "planAuthor": planAuthor, "planGrade": planGrade, "content": content};
        var url = 'plans/save';
        //id>0表示编辑操作
        if (id > 0) {
            data = {
                "id": id,
                "planTitle": planTitle, "planAuthor": planAuthor,
                "planGrade": planGrade, "content": content};
            url = 'plans/update';
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
                    $('#planModal').modal('hide');
                    swal("保存成功", {
                        icon: "success",
                    });
                    reload();
                }
                else {
                    $('#planModal').modal('hide');
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
    var select = $("#planGrade");
    select.empty();
    $.ajax({
        type: 'POST',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: 'plans/showSelect',//url
        contentType: "application/json; charset=utf-8",
        async:false,
        success: function (result) {
            checkResultCode(result.resultCode);

            var list = result.data.select;

            // 循环添加option
            select.append("<option></option>");
            for (var i=0;i < list.length;i++) {
                select.append("<option value='" + list[i].id + "'>"+ list[i].val +"</option>");
            }
        },
        error: function () {
            swal("计划班级下拉列表获取失败", {
                icon: "error",
            });
        }
    });
}

function planAdd() {
    reset();
    $('.modal-title').html('添加');
    $('#planModal').modal('show');

    getSelect();
    $.ajax({
        type: 'POST',//方法类型
        dataType: "json",//预期服务器返回的数据类型
        url: 'plans/showSelect',//url
        contentType: "application/json; charset=utf-8",
        async:false,
        beforeSend: function (request) {
            //设置header值
            request.setRequestHeader("token", getCookie("token"));
        },
        success: function (result) {
            checkResultCode(result.resultCode);

            $("#planAuthor").val(result.data.user);
        },
        error: function () {
            swal("计划人获取失败", {
                icon: "error",
            });
        }
    });
}

function planEdit() {
    reset();
    $('.modal-title').html('编辑');

    var id = getSelectedRow();
    if (id == null) {
        return;
    }

    getSelect();

    //请求数据
    $.get("plans/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal

            $('#planId').val(r.data.id);
            $('#planTitle').val(r.data.planTitle);
            $('#planAuthor').val(r.data.planAuthor);
            $('#planGrade').val(r.data.planGrade);
            editor.html('');
            editor.html(r.data.content);
        }
    });
    //显示modal
    $('#planModal').modal('show');
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

    //开始时间、结束时间
    var startTimeStr = $('.startTime').val();
    var endTimeStr = $('.endTime').val();
    var startTime = new Date(startTimeStr.replace(/-/, "/"));
    var endTime = new Date(endTimeStr.replace(/-/, "/"));

    if (startTime >= endTime) {
        swal("开始时间不能大于结束时间!", {
            icon: "error"
        });
        return false;
    }

    //数据封装
    var searchData = {keyword: keyword, startTime: startTimeStr, endTime: endTimeStr};

    //传入查询条件参数
    $("#jqGrid").jqGrid("setGridParam", {postData: searchData});
    //点击搜索按钮默认都从第一页开始
    $("#jqGrid").jqGrid("setGridParam", {page: 1});
    //提交post并刷新表格
    $("#jqGrid").jqGrid("setGridParam", {url: 'plans/search'}).trigger("reloadGrid");


}

/**
 * 数据验证
 */
function validObject() {
    var planTitle = $('#planTitle').val();
    if (isNull(planTitle)) {
        showErrorInfo("标题不能为空!");
        return false;
    }
    if (!validLength(planTitle, 200)) {
        showErrorInfo("标题字符不能大于200!");
        return false;
    }

    var planAuthor = $('#planAuthor').val();
    if (isNull(planAuthor)) {
        showErrorInfo("计划者不能为空!");
        return false;
    }

    var planGrade = $('#planGrade').val();
    if (isNull(planGrade)) {
        showErrorInfo("计划班级不能为空!");
        return false;
    }
    if (!validLength(planGrade, 20)) {
        showErrorInfo("计划班级字符不能大于20!");
        return false;
    }

    var content = editor.html();
    if (isNull(content) || content == '请输入...') {
        showErrorInfo("计划内容不能为空!");
        return false;
    }
    if (!validLength(content, 8000)) {
        showErrorInfo("计划内容字符不能大于8000!");
        return false;
    }
    return true;
}

/**
 * 重置
 */
function reset() {
    //隐藏错误提示框
    $('.alert-danger').css("display", "none");
    //清空数据
    $('#planId').val(0);
    $('#keyword').val('');
    $('#planTitle').val('');
    $('#planAuthor').val('');
    $('#planGrade').val('');
    $('#editor').val('');
}

function deletePlan() {
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
                url: "plans/delete",
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