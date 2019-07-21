package com.ssm.demo.service.impl;

import com.ssm.demo.common.Constants;
import com.ssm.demo.common.Result;
import com.ssm.demo.dao.AchiDao;
import com.ssm.demo.entity.Achi;
import com.ssm.demo.redis.RedisUtil;
import com.ssm.demo.service.AchiService;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;
import com.ssm.demo.utils.SelectOption;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service("achiService")
public class AchiServiceImpl implements AchiService {

    final static Logger logger = Logger.getLogger(AchiServiceImpl.class);
    @Resource
    private RedisUtil redisUtil;
    @Resource
    private AchiDao achiDao;

    @Override
    public PageResult getAchiPage(PageUtil pageUtil) {
        List<Achi> achiList = achiDao.findAchis(pageUtil);
        int total = achiDao.getTotalAchis(pageUtil);
        PageResult pageResult = new PageResult(achiList, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public Achi queryObject(String id) {
        logger.info("根据id获取成绩数据:" + id);
        Achi achi = (Achi) redisUtil.get(Constants.ACHI_CACHE_KEY + id, Achi.class);
        if (achi != null) {
            logger.info("成绩数据已存在于redis中直接读取:" + Constants.ACHI_CACHE_KEY + id);
            return achi;
        }
        Achi achiFromMysql = achiDao.getAchiById(id);
        if (achiFromMysql != null) {
            logger.info("redis中无此成绩的数据,从MySQL数据库中读取成绩并存储至redis中:" + Constants.ACHI_CACHE_KEY + id);
            redisUtil.put(Constants.ACHI_CACHE_KEY + achiFromMysql.getAchiId(), achiFromMysql);
            return achiFromMysql;
        }
        return null;
    }

    @Override
    public List<Achi> queryList(Map<String, Object> map) {
        List<Achi> achis = achiDao.findAchis(map);
        return achis;
    }

    @Override
    public int queryTotal(Map<String, Object> map) {
        return achiDao.getTotalAchis(map);
    }

    @Override
    public int save(Achi achi) {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        achi.setAchiId(uuid);
        Date date = new Date();
        achi.setCreateTime(date);
        achi.setCreateTime(date);
        if (achiDao.insertAchi(achi) > 0) {
            logger.info("新增成绩成功，将成绩数据存储至redis:" + Constants.ACHI_CACHE_KEY + achi.getAchiId());
            redisUtil.put(Constants.ACHI_CACHE_KEY + achi.getAchiId(), achi);
            return 1;
        }
        return 0;
    }

    @Override
    public int update(Achi achi) {
        achi.setUpdateTime(new Date());
        if (achiDao.updAchi(achi) > 0) {
            logger.info("成绩修改成功，更新redis中的成绩数据:" + Constants.ACHI_CACHE_KEY + achi.getAchiId());
            redisUtil.del(Constants.ACHI_CACHE_KEY + achi.getAchiId());
            redisUtil.put(Constants.ACHI_CACHE_KEY + achi.getAchiId(), achi);
            return 1;
        }
        return 0;
    }

    @Override
    public int deleteBatch(String[] ids) {
        int num = achiDao.deleteBatch(ids);
        if (num > 0) {
            for (int i = 0; i < ids.length; i++) {
                redisUtil.del(Constants.ACHI_CACHE_KEY + ids[i]);
            }
            return num;
        }
        return 0;
    }

    @Override
    public Result showSelect() {
        Result result = new Result();
        ArrayList<SelectOption> so = achiDao.getAchiSelect();
        result.setData(so);
        return result;
    }
}
