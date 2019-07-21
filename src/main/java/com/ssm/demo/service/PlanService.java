package com.ssm.demo.service;


import com.ssm.demo.common.Result;
import com.ssm.demo.entity.AdminUser;
import com.ssm.demo.entity.Plan;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;

import java.util.List;
import java.util.Map;

/**
 * @author liuchang
 * @date 2019-02-20
 */
public interface PlanService {

    PageResult getPlanPage(PageUtil pageUtil);

    Plan queryObject(Long id);

    List<Plan> queryList(Map<String, Object> map);

    int queryTotal(Map<String, Object> map);

    int save(Plan plan);

    int update(Plan plan);

    int delete(Long id);

    int deleteBatch(Long[] ids);

    Result showSelect(AdminUser user);
}
