package com.ssm.demo.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * @author: LiuChang
 * @date: 2019-02-24
 */
public class Article extends BaseEntity implements Serializable {
    private static final long serialVerisionUID = 1L ;

    private String id;
    //文章标题
    private String articleTitle;
    //文章内容
    private String articleContent;
    //添加人
    private String addName;

    @Override
    public String getId() {
        return id;
    }

    @Override
    public void setId(String id) {
        this.id = id;
    }

    public void setArticleTitle(String articleTitle) {
        this.articleTitle = articleTitle;
    }

    public String getArticleTitle() {
        return articleTitle;
    }

    public void setArticleContent(String articleContent) {
        this.articleContent = articleContent;
    }

    public String getArticleContent() {
        return articleContent;
    }

    public void setAddName(String addName) {
        this.addName = addName;
    }

    public String getAddName() {
        return addName;
    }
}
