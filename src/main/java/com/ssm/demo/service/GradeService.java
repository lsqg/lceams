package com.ssm.demo.service;


import com.ssm.demo.common.Result;
import com.ssm.demo.entity.Grade;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;

import java.util.List;
import java.util.Map;

/**
 * @author liuchang
 * @date 2019-02-24
 */
public interface GradeService {

    PageResult getGradePage(PageUtil pageUtil);

    Grade queryObject(Long id);

    List<Grade> queryList(Map<String, Object> map);

    int queryTotal(Map<String, Object> map);

    int save(Grade grade);

    int update(Grade grade);

    int deleteBatch(Long[] ids);

    Result showSelect();
}
