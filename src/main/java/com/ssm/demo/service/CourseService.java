package com.ssm.demo.service;


import com.ssm.demo.common.Result;
import com.ssm.demo.entity.Course;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;

import java.util.List;
import java.util.Map;

/**
 * @author liuchang
 * @date 2019-02-28
 */
public interface CourseService {

    PageResult getCoursePage(PageUtil pageUtil);

    Course queryObject(Long id);

    List<Course> queryList(Map<String, Object> map);

    int queryTotal(Map<String, Object> map);

    int save(Course course);

    int update(Course course);

    int deleteBatch(Long[] ids);

    Result showSelect();
}
