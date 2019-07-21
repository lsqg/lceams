package com.ssm.demo.entity;

import java.io.Serializable;

/**
 * @author: LiuChang
 * @date: 2019-02-28
 */
public class Teacher extends BaseEntity implements Serializable {
    private static final long serialVerisionUID = 1L ;

    private String teacherId;

    private String teacherName;

    private String teacherSex;

    private int teacherTel;

    private String teacherAddress;

    private String teacherExpertise;

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getTeacherSex() {
        return teacherSex;
    }

    public void setTeacherSex(String teacherSex) {
        this.teacherSex = teacherSex;
    }

    public int getTeacherTel() {
        return teacherTel;
    }

    public void setTeacherTel(int teacherTel) {
        this.teacherTel = teacherTel;
    }

    public String getTeacherAddress() {
        return teacherAddress;
    }

    public void setTeacherAddress(String teacherAddress) {
        this.teacherAddress = teacherAddress;
    }

    public String getTeacherExpertise() {
        return teacherExpertise;
    }

    public void setTeacherExpertise(String teacherExpertise) {
        this.teacherExpertise = teacherExpertise;
    }
}
