package com.ssm.demo.service;


import com.ssm.demo.common.Result;
import com.ssm.demo.entity.Student;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;

import java.util.List;
import java.util.Map;

/**
 * @author liuchang
 * @date 2019-03-05
 */
public interface StudentService {

    PageResult getStudentPage(PageUtil pageUtil);

    Student queryObject(Long id);

    List<Student> queryList(Map<String, Object> map);

    int queryTotal(Map<String, Object> map);

    int save(Student student);

    int update(Student student);

    int deleteBatch(Long[] ids);

    Result showSelect();
}
