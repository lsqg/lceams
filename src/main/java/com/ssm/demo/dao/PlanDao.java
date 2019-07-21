package com.ssm.demo.dao;

import com.ssm.demo.entity.Plan;
import com.ssm.demo.utils.SelectOption;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author LiuChang
 * @date 2019-04-27
 */
public interface PlanDao {
    /**
     * 返回相应的数据集合
     *
     * @param map
     * @return
     */
    List<Plan> findPlans(Map<String, Object> map);

    /**
     * 数据数目
     *
     * @param map
     * @return
     */
    int getTotalPlans(Map<String, Object> map);

    /**
     * 添加
     *
     * @return
     */
    int insertPlan(Plan plan);

    /**
     * 修改
     *
     * @return
     */
    int updPlan(Plan plan);

    /**
     * 删除
     *
     * @param id
     * @return
     */
    int delPlan(Long id);

    /**
     * 根据id查找
     *
     * @param id
     * @return
     */
    Plan getPlanById(Long id);

    /**
     * 批量删除
     *
     * @param id
     * @return
     */
    int deleteBatch(Object[] id);

    ArrayList<SelectOption> getGradeSelect();
}
