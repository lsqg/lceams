package com.ssm.demo.common;

public class Constants {

    public static final int RESULT_CODE_SUCCESS = 200;  // 成功处理请求
    public static final int RESULT_CODE_BAD_REQUEST = 412;  // 请求错误
    public static final int RESULT_CODE_NOT_LOGIN = 402;  // 未登录
    public static final int RESULT_CODE_NOT_LIMIT = 403;  // 没有权限
    public static final int RESULT_CODE_PARAM_ERROR = 406;  // 传参错误
    public static final int RESULT_CODE_SERVER_ERROR = 500;  // 服务器错误

    public final static int PAGE_SIZE = 10;//默认分页条数

    public final static String FILE_PRE_URL = "http://localhost:8080";//上传文件的默认url前缀，根据部署设置自行修改

    public static final String ARTICLE_CACHE_KEY = "ssm-demo:article:";//文章存储于redis的key前缀

    public static final String GRADE_CACHE_KEY = "ssm-demo:grade:";//班级存储于redis的key前缀

    public static final String TEACHER_CACHE_KEY = "ssm-demo:teacher:";//教师存储于redis的key前缀

    public static final String STUDENT_CACHE_KEY = "ssm-demo:student:";//学生存储于redis的key前缀

    public static final String COURSE_CACHE_KEY = "ssm-demo:course:";//课程存储于redis的key前缀

    public static final String ACHI_CACHE_KEY = "ssm-demo:achi:";//成绩存储于redis的key前缀

    public static final String PLAN_CACHE_KEY = "ssm-demo:plan:";//计划存储于redis的key前缀
}
