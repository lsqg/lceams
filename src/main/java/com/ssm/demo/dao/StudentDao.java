package com.ssm.demo.dao;

import com.ssm.demo.entity.Student;
import com.ssm.demo.utils.SelectOption;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author LiuChang
 * @date 2019-03-05
 */
public interface StudentDao {
    /**
     * 返回相应的数据集合
     *
     * @param map
     * @return
     */
    List<Student> findStudents(Map<String, Object> map);

    /**
     * 数据数目
     *
     * @param map
     * @return
     */
    int getTotalStudents(Map<String, Object> map);

    /**
     * 添加
     *
     * @return
     */
    int insertStudent(Student student);

    /**
     * 修改
     *
     * @return
     */
    int updStudent(Student student);

    /**
     * 根据id查找
     *
     * @param id
     * @return
     */
    Student getStudentById(Long id);

    /**
     * 批量删除
     *
     * @param id
     * @return
     */
    int deleteBatch(Object[] id);

    ArrayList<SelectOption> getGradeSelect();
}
