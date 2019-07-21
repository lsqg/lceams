package com.ssm.demo.dao;

import com.ssm.demo.entity.Teacher;

import java.util.List;
import java.util.Map;

/**
 * @author LiuChang
 * @date 2019-02-28
 */
public interface TeacherDao {
    /**
     * 返回相应的数据集合
     *
     * @param map
     * @return
     */
    List<Teacher> findTeachers(Map<String, Object> map);

    /**
     * 数据数目
     *
     * @param map
     * @return
     */
    int getTotalTeachers(Map<String, Object> map);

    /**
     * 添加
     *
     * @return
     */
    int insertTeacher(Teacher teacher);

    /**
     * 修改
     *
     * @return
     */
    int updTeacher(Teacher teacher);

    /**
     * 根据id查找
     *
     * @param id
     * @return
     */
    Teacher getTeacherById(Long id);

    /**
     * 批量删除
     *
     * @param id
     * @return
     */
    int deleteBatch(Object[] id);
}
