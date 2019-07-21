package com.ssm.demo.service.impl;

import com.ssm.demo.common.Constants;
import com.ssm.demo.common.Result;
import com.ssm.demo.dao.PlanDao;
import com.ssm.demo.entity.AdminUser;
import com.ssm.demo.entity.Plan;
import com.ssm.demo.redis.RedisUtil;
import com.ssm.demo.service.PlanService;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;
import com.ssm.demo.utils.SelectOption;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service("planService")
public class PlanServiceImpl implements PlanService {

    final static Logger logger = Logger.getLogger(PlanServiceImpl.class);
    @Resource
    private RedisUtil redisUtil;

    @Resource
    private PlanDao planDao;

    @Override
    public PageResult getPlanPage(PageUtil pageUtil) {
        List<Plan> planList = planDao.findPlans(pageUtil);
        int total = planDao.getTotalPlans(pageUtil);
        PageResult pageResult = new PageResult(planList, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public Plan queryObject(Long id) {
        logger.info("根据id获取计划数据:" + id);
        Plan plan = (Plan) redisUtil.get(Constants.PLAN_CACHE_KEY + id, Plan.class);
        if (plan != null) {
            logger.info("计划数据已存在于redis中直接读取:" + Constants.PLAN_CACHE_KEY + id);
            return plan;
        }
        Plan planFromMysql = planDao.getPlanById(id);
        if (planFromMysql != null) {
            logger.info("redis中无此计划的数据,从MySQL数据库中读取计划并存储至redis中:" + Constants.PLAN_CACHE_KEY + id);
            redisUtil.put(Constants.PLAN_CACHE_KEY + planFromMysql.getId(), planFromMysql);
            return planFromMysql;
        }
        return null;
    }

    @Override
    public List<Plan> queryList(Map<String, Object> map) {
        List<Plan> plans = planDao.findPlans(map);
        return plans;
    }

    @Override
    public int queryTotal(Map<String, Object> map) {
        return planDao.getTotalPlans(map);
    }

    @Override
    public int save(Plan plan) {
        Date date = new Date();
        plan.setCreateTime(date);
        plan.setCreateTime(date);
        if (planDao.insertPlan(plan) > 0) {
            logger.info("新增计划成功，将计划数据存储至redis:" + Constants.PLAN_CACHE_KEY + plan.getId());
            redisUtil.put(Constants.PLAN_CACHE_KEY + plan.getId(), plan);
            return 1;
        }
        return 0;
    }

    @Override
    public int update(Plan plan) {
        plan.setUpdateTime(new Date());
        if (planDao.updPlan(plan) > 0) {
            logger.info("计划修改成功，更新redis中的计划数据:" + Constants.PLAN_CACHE_KEY + plan.getId());
            redisUtil.del(Constants.PLAN_CACHE_KEY + plan.getId());
            redisUtil.put(Constants.PLAN_CACHE_KEY + plan.getId(), plan);
            return 1;
        }
        return 0;
    }

    @Override
    public int delete(Long id) {
        if (planDao.delPlan(id) > 0) {
            redisUtil.del(Constants.PLAN_CACHE_KEY + id);
        }
        return 0;
    }

    @Override
    public int deleteBatch(Long[] ids) {
        int num = planDao.deleteBatch(ids);
        if (num > 0) {
            for (int i = 0; i < ids.length; i++) {
                redisUtil.del(Constants.PLAN_CACHE_KEY + ids[i]);
            }
            return num;
        }
        return 0;
    }

    @Override
    public Result showSelect(AdminUser user) {
        Result result = new Result();
        ArrayList<SelectOption> so = planDao.getGradeSelect();
        HashMap<String,Object> map = new HashMap<String,Object>();
        map.put("select", so);
        if (null != user){
            map.put("user", user.getUserName());
        }
        result.setData(map);
        return result;
    }
}
