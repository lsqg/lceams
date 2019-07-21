package com.ssm.demo.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author: LiuChang
 * @date: 2019-02-24
 */
public class AdminUser implements Serializable {
    private static final long serialVerisionUID = 1L ;

    /**
     * 主键
     */
    private Long id;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 用户类型
     */
    private String userType;

    /**
     * 密码
     */
    private String password;

    /**
     * token值
     */
    private String userToken;

    /**
     * 是否已删除 0未删除 1已删除
     */
    private int isDeleted;

    /**
     * 添加时间
     */
    private Date createTime;

    /**
     * 添加时间
     */
    private Date updateTime;

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserToken() {
        return userToken;
    }

    public void setUserToken(String userToken) {
        this.userToken = userToken;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        return "AdminUser{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", userType='" + userType + '\'' +
                ", password='" + password + '\'' +
                ", userToken='" + userToken + '\'' +
                ", isDeleted=" + isDeleted +
                ", createTime=" + createTime +
                '}';
    }
}
