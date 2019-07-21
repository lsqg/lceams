package com.ssm.demo.service;


import com.ssm.demo.common.Result;
import com.ssm.demo.entity.Achi;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;

import java.util.List;
import java.util.Map;

/**
 * @author liuchang
 * @date 2019-04-05
 */
public interface AchiService {

    PageResult getAchiPage(PageUtil pageUtil);

    Achi queryObject(String id);

    List<Achi> queryList(Map<String, Object> map);

    int queryTotal(Map<String, Object> map);

    int save(Achi achi);

    int update(Achi achi);

    int deleteBatch(String[] ids);

    Result showSelect();
}
