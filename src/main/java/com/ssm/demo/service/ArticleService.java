package com.ssm.demo.service;


import com.ssm.demo.entity.Article;
import com.ssm.demo.utils.PageResult;
import com.ssm.demo.utils.PageUtil;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;

/**
 * @author liuchang
 * @date 2019-02-20
 */
public interface ArticleService {

    PageResult getArticlePage(PageUtil pageUtil);

    Article queryObject(Long id);

    List<Article> queryList(Map<String, Object> map);

    int queryTotal(Map<String, Object> map);

    int save(Article article);

    int update(Article article);

    int delete(Long id);

    int deleteBatch(Long[] ids);
}
