package com.ssm.demo.entity;

import java.io.Serializable;

/**
 * @author: LiuChang
 * @date: 2019-02-28
 */
public class Achi extends BaseEntity implements Serializable {
    private static final long serialVerisionUID = 1L ;

    private String achiId;

    private String studentId;

    private String studentName;

    private String courseId;

    private String courseName;

    private String achi;

    public String getAchiId() {
        return achiId;
    }

    public void setAchiId(String achiId) {
        this.achiId = achiId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

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

    public String getAchi() {
        return achi;
    }

    public void setAchi(String achi) {
        this.achi = achi;
    }
}
