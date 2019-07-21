package com.ssm.demo.service.impl;

import com.ssm.demo.common.Constants;
import com.ssm.demo.dao.TeacherDao;
import com.ssm.demo.entity.Teacher;
import com.ssm.demo.redis.RedisUtil;
import com.ssm.demo.service.TeacherService;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service("teacherService")
public class TeacherServiceImpl implements TeacherService {

    final static Logger logger = Logger.getLogger(TeacherServiceImpl.class);
    @Resource
    private RedisUtil redisUtil;
    @Resource
    private TeacherDao teacherDao;

    @Override
    public PageResult getTeacherPage(PageUtil pageUtil) {
        List<Teacher> teacherList = teacherDao.findTeachers(pageUtil);
        int total = teacherDao.getTotalTeachers(pageUtil);
        PageResult pageResult = new PageResult(teacherList, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public Teacher queryObject(Long id) {
        logger.info("根据id获取教师数据:" + id);
        Teacher teacher = (Teacher) redisUtil.get(Constants.TEACHER_CACHE_KEY + id, Teacher.class);
        if (teacher != null) {
            logger.info("教师数据已存在于redis中直接读取:" + Constants.TEACHER_CACHE_KEY + id);
            return teacher;
        }
        Teacher teacherFromMysql = teacherDao.getTeacherById(id);
        if (teacherFromMysql != null) {
            logger.info("redis中无此教师的数据,从MySQL数据库中读取教师并存储至redis中:" + Constants.TEACHER_CACHE_KEY + id);
            redisUtil.put(Constants.TEACHER_CACHE_KEY + teacherFromMysql.getTeacherId(), teacherFromMysql);
            return teacherFromMysql;
        }
        return null;
    }

    @Override
    public List<Teacher> queryList(Map<String, Object> map) {
        List<Teacher> teachers = teacherDao.findTeachers(map);
        return teachers;
    }

    @Override
    public int queryTotal(Map<String, Object> map) {
        return teacherDao.getTotalTeachers(map);
    }

    @Override
    public int save(Teacher teacher) {
        Date date = new Date();
        teacher.setCreateTime(date);
        teacher.setCreateTime(date);
        if (teacherDao.insertTeacher(teacher) > 0) {
            logger.info("新增教师成功，将教师数据存储至redis:" + Constants.TEACHER_CACHE_KEY + teacher.getTeacherId());
            redisUtil.put(Constants.TEACHER_CACHE_KEY + teacher.getTeacherId(), teacher);
            return 1;
        }
        return 0;
    }

    @Override
    public int update(Teacher teacher) {
        teacher.setUpdateTime(new Date());
        if (teacherDao.updTeacher(teacher) > 0) {
            logger.info("教师修改成功，更新redis中的教师数据:" + Constants.TEACHER_CACHE_KEY + teacher.getTeacherId());
            redisUtil.del(Constants.TEACHER_CACHE_KEY + teacher.getTeacherId());
            redisUtil.put(Constants.TEACHER_CACHE_KEY + teacher.getTeacherId(), teacher);
            return 1;
        }
        return 0;
    }

    @Override
    public int deleteBatch(Long[] ids) {
        int num = teacherDao.deleteBatch(ids);
        if (num > 0) {
            for (int i = 0; i < ids.length; i++) {
                redisUtil.del(Constants.TEACHER_CACHE_KEY + ids[i]);
            }
            return num;
        }
        return 0;
    }
}
