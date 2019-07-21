package com.ssm.demo.entity;

import java.util.Date;

/**
 * @description:
 * @author: LiuChang
 * @date: 2019-02-20
 */
public class BaseEntity {
    //主键
    private String id;
    //添加时间
    private Date createTime;
    //最新更新时间
    private Date updateTime;
    //逻辑删除标识
    private int isDeleted;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
