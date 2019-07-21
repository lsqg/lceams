package com.ssm.demo.dao;

import com.ssm.demo.entity.Achi;
import com.ssm.demo.utils.SelectOption;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author LiuChang
 * @date 2019-04-05
 */
public interface AchiDao {
    /**
     * 返回相应的数据集合
     *
     * @param map
     * @return
     */
    List<Achi> findAchis(Map<String, Object> map);

    /**
     * 数据数目
     *
     * @param map
     * @return
     */
    int getTotalAchis(Map<String, Object> map);

    /**
     * 添加
     *
     * @return
     */
    int insertAchi(Achi achi);

    /**
     * 修改
     *
     * @return
     */
    int updAchi(Achi achi);

    /**
     * 根据id查找
     *
     * @param id
     * @return
     */
    Achi getAchiById(String id);

    /**
     * 批量删除
     *
     * @param id
     * @return
     */
    int deleteBatch(Object[] id);

    ArrayList<SelectOption> getAchiSelect();
}
