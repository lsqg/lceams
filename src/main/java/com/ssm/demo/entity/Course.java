package com.ssm.demo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * @author: LiuChang
 * @date: 2019-02-28
 */
public class Course extends BaseEntity implements Serializable {
    private static final long serialVerisionUID = 1L ;

    private String courseId;

    private String courseName;

    private String courseTeacher;

    private String courseInfo;

    private String courseGrade;

    private Date startTime;

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getCourseTeacher() {
        return courseTeacher;
    }

    public void setCourseTeacher(String courseTeacher) {
        this.courseTeacher = courseTeacher;
    }

    public String getCourseInfo() {
        return courseInfo;
    }

    public void setCourseInfo(String courseInfo) {
        this.courseInfo = courseInfo;
    }

    public String getCourseGrade() {
        return courseGrade;
    }

    public void setCourseGrade(String courseGrade) {
        this.courseGrade = courseGrade;
    }

    public Date getStartTime() {
        return startTime;
    }

    @JsonFormat(pattern = "yyyy-MM-dd")
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }
}
