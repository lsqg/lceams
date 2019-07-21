package com.ssm.demo.entity;

import java.io.Serializable;

/**
 * @author: LiuChang
 * @date: 2019-02-24
 */
public class Grade extends BaseEntity implements Serializable {
    private static final long serialVerisionUID = 1L ;

    private String gradeId;

    private String gradeName;

    private String gradeTeacher;

    private int isDeleted;

    public String getGradeId() {
        return gradeId;
    }

    public void setGradeId(String gradeId) {
        this.gradeId = gradeId;
    }

    public String getGradeName() {
        return gradeName;
    }

    public void setGradeName(String gradeName) {
        this.gradeName = gradeName;
    }

    public String getGradeTeacher() {
        return gradeTeacher;
    }

    public void setGradeTeacher(String gradeTeacher) {
        this.gradeTeacher = gradeTeacher;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }
}
