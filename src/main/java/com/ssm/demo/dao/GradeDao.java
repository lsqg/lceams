package com.ssm.demo.dao;

import com.ssm.demo.entity.Grade;
import com.ssm.demo.utils.SelectOption;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author LiuChang
 * @date 2019-02-24
 */
public interface GradeDao {
    /**
     * 返回相应的数据集合
     *
     * @param map
     * @return
     */
    List<Grade> findGrades(Map<String, Object> map);

    /**
     * 数据数目
     *
     * @param map
     * @return
     */
    int getTotalGrades(Map<String, Object> map);

    /**
     * 添加
     *
     * @return
     */
    int insertGrade(Grade grade);

    /**
     * 修改
     *
     * @return
     */
    int updGrade(Grade grade);

    /**
     * 根据id查找
     *
     * @param id
     * @return
     */
    Grade getGradeById(Long id);

    /**
     * 批量删除
     *
     * @param id
     * @return
     */
    int deleteBatch(Object[] id);

    ArrayList<SelectOption> getTeacherSelect();
}
