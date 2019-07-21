package com.ssm.demo.service.impl;

import com.ssm.demo.common.Constants;
import com.ssm.demo.common.Result;
import com.ssm.demo.dao.CourseDao;
import com.ssm.demo.entity.Course;
import com.ssm.demo.redis.RedisUtil;
import com.ssm.demo.service.CourseService;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;
import com.ssm.demo.utils.SelectOption;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

@Service("courseService")
public class CourseServiceImpl implements CourseService {

    final static Logger logger = Logger.getLogger(CourseServiceImpl.class);
    @Resource
    private RedisUtil redisUtil;
    @Resource
    private CourseDao courseDao;

    @Override
    public PageResult getCoursePage(PageUtil pageUtil) {
        List<Course> courseList = courseDao.findCourses(pageUtil);
        int total = courseDao.getTotalCourses(pageUtil);
        PageResult pageResult = new PageResult(courseList, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public Course queryObject(Long id) {
        logger.info("根据id获取课程数据:" + id);
        Course course = (Course) redisUtil.get(Constants.COURSE_CACHE_KEY + id, Course.class);
        if (course != null) {
            logger.info("课程数据已存在于redis中直接读取:" + Constants.COURSE_CACHE_KEY + id);
            return course;
        }
        Course courseFromMysql = courseDao.getCourseById(id);
        if (courseFromMysql != null) {
            logger.info("redis中无此课程的数据,从MySQL数据库中读取课程并存储至redis中:" + Constants.COURSE_CACHE_KEY + id);
            redisUtil.put(Constants.COURSE_CACHE_KEY + courseFromMysql.getCourseId(), courseFromMysql);
            return courseFromMysql;
        }
        return null;
    }

    @Override
    public List<Course> queryList(Map<String, Object> map) {
        List<Course> courses = courseDao.findCourses(map);
        return courses;
    }

    @Override
    public int queryTotal(Map<String, Object> map) {
        return courseDao.getTotalCourses(map);
    }

    @Override
    public int save(Course course) {
        Date date = new Date();
        course.setCreateTime(date);
        course.setCreateTime(date);
        if (courseDao.insertCourse(course) > 0) {
            logger.info("新增课程成功，将课程数据存储至redis:" + Constants.COURSE_CACHE_KEY + course.getCourseId());
            redisUtil.put(Constants.COURSE_CACHE_KEY + course.getCourseId(), course);
            return 1;
        }
        return 0;
    }

    @Override
    public int update(Course course) {
        course.setUpdateTime(new Date());
        if (courseDao.updCourse(course) > 0) {
            logger.info("课程修改成功，更新redis中的课程数据:" + Constants.COURSE_CACHE_KEY + course.getCourseId());
            redisUtil.del(Constants.COURSE_CACHE_KEY + course.getCourseId());
            redisUtil.put(Constants.COURSE_CACHE_KEY + course.getCourseId(), course);
            return 1;
        }
        return 0;
    }

    @Override
    public int deleteBatch(Long[] ids) {
        int num = courseDao.deleteBatch(ids);
        if (num > 0) {
            for (int i = 0; i < ids.length; i++) {
                redisUtil.del(Constants.COURSE_CACHE_KEY + ids[i]);
            }
            return num;
        }
        return 0;
    }

    @Override
    public Result showSelect() {
        Result result = new Result();
        ArrayList<SelectOption> so = courseDao.getTeacherSelect();
        result.setData(so);
        return result;
    }
}
