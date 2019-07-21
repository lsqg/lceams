package com.ssm.demo.service.impl;

import com.ssm.demo.common.Constants;
import com.ssm.demo.common.Result;
import com.ssm.demo.dao.StudentDao;
import com.ssm.demo.entity.Student;
import com.ssm.demo.redis.RedisUtil;
import com.ssm.demo.service.StudentService;
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

@Service("studentService")
public class StudentServiceImpl implements StudentService {

    final static Logger logger = Logger.getLogger(StudentServiceImpl.class);
    @Resource
    private RedisUtil redisUtil;
    @Resource
    private StudentDao studentDao;

    @Override
    public PageResult getStudentPage(PageUtil pageUtil) {
        List<Student> studentList = studentDao.findStudents(pageUtil);
        int total = studentDao.getTotalStudents(pageUtil);
        PageResult pageResult = new PageResult(studentList, total, pageUtil.getLimit(), pageUtil.getPage());
        return pageResult;
    }

    @Override
    public Student queryObject(Long id) {
        logger.info("根据id获取学生数据:" + id);
        Student student = (Student) redisUtil.get(Constants.STUDENT_CACHE_KEY + id, Student.class);
        if (student != null) {
            logger.info("学生数据已存在于redis中直接读取:" + Constants.STUDENT_CACHE_KEY + id);
            return student;
        }
        Student studentFromMysql = studentDao.getStudentById(id);
        if (studentFromMysql != null) {
            logger.info("redis中无此学生的数据,从MySQL数据库中读取学生并存储至redis中:" + Constants.STUDENT_CACHE_KEY + id);
            redisUtil.put(Constants.STUDENT_CACHE_KEY + studentFromMysql.getStudentId(), studentFromMysql);
            return studentFromMysql;
        }
        return null;
    }

    @Override
    public List<Student> queryList(Map<String, Object> map) {
        List<Student> students = studentDao.findStudents(map);
        return students;
    }

    @Override
    public int queryTotal(Map<String, Object> map) {
        return studentDao.getTotalStudents(map);
    }

    @Override
    public int save(Student student) {
        Date date = new Date();
        student.setCreateTime(date);
        student.setCreateTime(date);
        if (studentDao.insertStudent(student) > 0) {
            logger.info("新增学生成功，将学生数据存储至redis:" + Constants.STUDENT_CACHE_KEY + student.getStudentId());
            redisUtil.put(Constants.STUDENT_CACHE_KEY + student.getStudentId(), student);
            return 1;
        }
        return 0;
    }

    @Override
    public int update(Student student) {
        student.setUpdateTime(new Date());
        if (studentDao.updStudent(student) > 0) {
            logger.info("学生修改成功，更新redis中的学生数据:" + Constants.STUDENT_CACHE_KEY + student.getStudentId());
            redisUtil.del(Constants.STUDENT_CACHE_KEY + student.getStudentId());
            redisUtil.put(Constants.STUDENT_CACHE_KEY + student.getStudentId(), student);
            return 1;
        }
        return 0;
    }

    @Override
    public int deleteBatch(Long[] ids) {
        int num = studentDao.deleteBatch(ids);
        if (num > 0) {
            for (int i = 0; i < ids.length; i++) {
                redisUtil.del(Constants.STUDENT_CACHE_KEY + ids[i]);
            }
            return num;
        }
        return 0;
    }

    @Override
    public Result showSelect() {
        Result result = new Result();
        ArrayList<SelectOption> so = studentDao.getGradeSelect();
        result.setData(so);
        return result;
    }
}
