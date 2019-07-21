package com.ssm.demo.service;


import com.ssm.demo.entity.Teacher;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;

import java.util.List;
import java.util.Map;

/**
 * @author liuchang
 * @date 2019-02-28
 */
public interface TeacherService {

    PageResult getTeacherPage(PageUtil pageUtil);

    Teacher queryObject(Long id);

    List<Teacher> queryList(Map<String, Object> map);

    int queryTotal(Map<String, Object> map);

    int save(Teacher teacher);

    int update(Teacher teacher);

    int deleteBatch(Long[] ids);
}
