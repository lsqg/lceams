package com.ssm.demo.entity;

import java.io.Serializable;

/**
 * @author: LiuChang
 * @date: 2019-04-27
 */
public class Plan extends BaseEntity implements Serializable {
    private static final long serialVerisionUID = 1L ;

    private String id;
    //文章标题
    private String planTitle;
    //计划者
    private String planAuthor;
    //内容
    private String content;
    //计划班级
    private String planGrade;

    @Override
    public String getId() {
        return id;
    }

    @Override
    public void setId(String id) {
        this.id = id;
    }

    public String getPlanTitle() {
        return planTitle;
    }

    public void setPlanTitle(String planTitle) {
        this.planTitle = planTitle;
    }

    public String getPlanAuthor() {
        return planAuthor;
    }

    public void setPlanAuthor(String planAuthor) {
        this.planAuthor = planAuthor;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPlanGrade() {
        return planGrade;
    }

    public void setPlanGrade(String planGrade) {
        this.planGrade = planGrade;
    }
}
