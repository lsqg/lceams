package com.ssm.demo.controller;

import com.ssm.demo.common.Constants;
import com.ssm.demo.common.Result;
import com.ssm.demo.common.ResultGenerator;
import com.ssm.demo.controller.annotation.TokenToUser;
import com.ssm.demo.entity.AdminUser;
import com.ssm.demo.entity.Student;
import com.ssm.demo.service.StudentService;
import com.ssm.demo.utils.PageUtil;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @author LiuChang
 * @date 2019-03-05
 */
@RestController
@RequestMapping("/students")
public class StudentController {

    final static Logger logger = Logger.getLogger(StudentController.class);

    @Autowired
    private StudentService studentService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    public Result list(@RequestParam Map<String, Object> params) {
        if (StringUtils.isEmpty(params.get("page")) || StringUtils.isEmpty(params.get("limit"))) {
            return ResultGenerator.genErrorResult(Constants.RESULT_CODE_PARAM_ERROR, "参数异常！");
        }
        //查询列表数据
        PageUtil pageUtil = new PageUtil(params);
        return ResultGenerator.genSuccessResult(studentService.getStudentPage(pageUtil));
    }

    /**
     * 搜索功能
     */
    @RequestMapping("/search")
    public Result search(@RequestParam Map<String, Object> params) {
        if (StringUtils.isEmpty(params.get("page")) || StringUtils.isEmpty(params.get("limit"))) {
            return ResultGenerator.genErrorResult(Constants.RESULT_CODE_PARAM_ERROR, "参数异常！");
        }
        if (!StringUtils.isEmpty(params.get("keyword")) && params.get("keyword").toString().length() > 20) {
            return ResultGenerator.genErrorResult(Constants.RESULT_CODE_PARAM_ERROR, "关键字长度不能大于20！");
        }
        //查询列表数据
        PageUtil pageUtil = new PageUtil(params);
        return ResultGenerator.genSuccessResult(studentService.getStudentPage(pageUtil));
    }

    /**
     * 详情
     */
    @RequestMapping("/info/{id}")
    public Result info(@PathVariable("id") Long id) {
        Student student = studentService.queryObject(id);
        return ResultGenerator.genSuccessResult(student);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    public Result save(@RequestBody Student student, @TokenToUser AdminUser loginUser) {
        if (null != loginUser){
            if (!loginUser.getUserType().equals("0")){
                return ResultGenerator.genErrorResult(Constants.RESULT_CODE_NOT_LIMIT, "没有此项操作的权限！");
            }
        }
        if (loginUser == null) {
            return ResultGenerator.genErrorResult(Constants.RESULT_CODE_NOT_LOGIN, "未登录！");
        }
        if (studentService.save(student) > 0) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult("添加失败");
        }
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    public Result update(@RequestBody Student student, @TokenToUser AdminUser loginUser) {
        if (null != loginUser){
            if (!loginUser.getUserType().equals("0")){
                return ResultGenerator.genErrorResult(Constants.RESULT_CODE_NOT_LIMIT, "没有此项操作的权限！");
            }
        }
        if (loginUser == null) {
            return ResultGenerator.genErrorResult(Constants.RESULT_CODE_NOT_LOGIN, "未登录！");
        }
        if (studentService.update(student) > 0) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult("修改失败");
        }
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    public Result delete(@RequestBody Long[] ids, @TokenToUser AdminUser loginUser) {
        if (null != loginUser){
            if (!loginUser.getUserType().equals("0")){
                return ResultGenerator.genErrorResult(Constants.RESULT_CODE_NOT_LIMIT, "没有此项操作的权限！");
            }
        }
        if (loginUser == null) {
            return ResultGenerator.genErrorResult(Constants.RESULT_CODE_NOT_LOGIN, "未登录！");
        }
        if (ids.length < 1) {
            return ResultGenerator.genErrorResult(Constants.RESULT_CODE_PARAM_ERROR, "参数异常！");
        }
        if (studentService.deleteBatch(ids) > 0) {
            return ResultGenerator.genSuccessResult();
        } else {
            return ResultGenerator.genFailResult("删除失败");
        }
    }

    /**
     * 请求下拉列表
     */
    @RequestMapping("/showSelect")
    @ResponseBody
    public Result showSelect() {
        Result result = studentService.showSelect();
        return result;
    }
}
