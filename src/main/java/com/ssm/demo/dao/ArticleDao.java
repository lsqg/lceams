package com.ssm.demo.dao;

import com.ssm.demo.entity.Article;

import java.util.List;
import java.util.Map;

/**
 * @author LiuChang
 * @date 2019-02-24
 */
public interface ArticleDao {
    /**
     * 返回相应的数据集合
     *
     * @param map
     * @return
     */
    List<Article> findArticles(Map<String, Object> map);

    /**
     * 数据数目
     *
     * @param map
     * @return
     */
    int getTotalArticles(Map<String, Object> map);

    /**
     * 添加
     *
     * @return
     */
    int insertArticle(Article article);

    /**
     * 修改
     *
     * @return
     */
    int updArticle(Article article);

    /**
     * 删除
     *
     * @param id
     * @return
     */
    int delArticle(Long id);

    /**
     * 根据id查找
     *
     * @param id
     * @return
     */
    Article getArticleById(Long id);

    /**
     * 批量删除
     *
     * @param id
     * @return
     */
    int deleteBatch(Object[] id);
}
