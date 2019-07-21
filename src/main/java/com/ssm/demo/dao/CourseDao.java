package com.ssm.demo.dao;

import com.ssm.demo.entity.Course;
import com.ssm.demo.utils.SelectOption;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author LiuChang
 * @date 2019-02-28
 */
public interface CourseDao {
    /**
     * 返回相应的数据集合
     *
     * @param map
     * @return
     */
    List<Course> findCourses(Map<String, Object> map);

    /**
     * 数据数目
     *
     * @param map
     * @return
     */
    int getTotalCourses(Map<String, Object> map);

    /**
     * 添加
     *
     * @return
     */
    int insertCourse(Course course);

    /**
     * 修改
     *
     * @return
     */
    int updCourse(Course course);

    /**
     * 根据id查找
     *
     * @param id
     * @return
     */
    Course getCourseById(Long id);

    /**
     * 批量删除
     *
     * @param id
     * @return
     */
    int deleteBatch(Object[] id);

    ArrayList<SelectOption> getTeacherSelect();
}
