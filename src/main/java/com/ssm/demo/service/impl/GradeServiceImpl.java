package com.ssm.demo.service.impl;

import com.ssm.demo.common.Constants;
import com.ssm.demo.common.Result;
import com.ssm.demo.dao.GradeDao;
import com.ssm.demo.dao.GradeDao;
import com.ssm.demo.entity.Grade;
import com.ssm.demo.entity.Grade;
import com.ssm.demo.redis.RedisUtil;
import com.ssm.demo.service.GradeService;
import com.ssm.demo.service.GradeService;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;
import com.ssm.demo.utils.SelectOption;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service("gradeService")
public class GradeServiceImpl implements GradeService {

    final static Logger logger = Logger.getLogger(GradeServiceImpl.class);
    @Resource
    private RedisUtil redisUtil;

    @Resource
    private GradeDao gradeDao;

    @Override
    public PageResult getGradePage(PageUtil pageUtil) {
        List<Grade> gradeList = gradeDao.findGrades(pageUtil);
        int total = gradeDao.getTotalGrades(pageUtil);
        PageResult pageResult = new PageResult(gradeList, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public Grade queryObject(Long id) {
        logger.info("根据id获取班级数据:" + id);
        Grade grade = (Grade) redisUtil.get(Constants.GRADE_CACHE_KEY + id, Grade.class);
        if (grade != null) {
            logger.info("班级数据已存在于redis中直接读取:" + Constants.GRADE_CACHE_KEY + id);
            return grade;
        }
        Grade gradeFromMysql = gradeDao.getGradeById(id);
        if (gradeFromMysql != null) {
            logger.info("redis中无此班级的数据,从MySQL数据库中读取班级并存储至redis中:" + Constants.GRADE_CACHE_KEY + id);
            redisUtil.put(Constants.GRADE_CACHE_KEY + gradeFromMysql.getGradeId(), gradeFromMysql);
            return gradeFromMysql;
        }
        return null;
    }

    @Override
    public List<Grade> queryList(Map<String, Object> map) {
        List<Grade> grades = gradeDao.findGrades(map);
        return grades;
    }

    @Override
    public int queryTotal(Map<String, Object> map) {
        return gradeDao.getTotalGrades(map);
    }

    @Override
    public int save(Grade grade) {
        Date date = new Date();
        grade.setCreateTime(date);
        grade.setCreateTime(date);
        if (gradeDao.insertGrade(grade) > 0) {
            logger.info("新增班级成功，将班级数据存储至redis:" + Constants.GRADE_CACHE_KEY + grade.getGradeId());
            redisUtil.put(Constants.GRADE_CACHE_KEY + grade.getGradeId(), grade);
            return 1;
        }
        return 0;
    }

    @Override
    public int update(Grade grade) {
        grade.setUpdateTime(new Date());
        if (gradeDao.updGrade(grade) > 0) {
            logger.info("班级修改成功，更新redis中的班级数据:" + Constants.GRADE_CACHE_KEY + grade.getGradeId());
            redisUtil.del(Constants.GRADE_CACHE_KEY + grade.getGradeId());
            redisUtil.put(Constants.GRADE_CACHE_KEY + grade.getGradeId(), grade);
            return 1;
        }
        return 0;
    }

    @Override
    public int deleteBatch(Long[] ids) {
        int num = gradeDao.deleteBatch(ids);
        if (num > 0) {
            for (int i = 0; i < ids.length; i++) {
                redisUtil.del(Constants.GRADE_CACHE_KEY + ids[i]);
            }
            return num;
        }
        return 0;
    }

    @Override
    public Result showSelect() {
        Result result = new Result();
        ArrayList<SelectOption> so = gradeDao.getTeacherSelect();
        result.setData(so);
        return result;
    }
}
