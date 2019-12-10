package com.springtest.zy.mybatis;

import com.springtest.zy.spring.jdbc.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public class mybatisTest {
    @Test
    public void test() throws IOException {
        String sss= "mapper/sqlMapConfig.xml";
        InputStream resourceAsStream = Resources.getResourceAsStream(sss);
        SqlSessionFactory build = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = build.openSession();
//        Object o = sqlSession.selectOne("test.selectUser", 1);
//        List<User> o  = sqlSession.selectList("test.selectUserName", "z");
//        System.out.println(o.toString());
//        添加用户
        User user=new User();
        user.setMoney(333);
        user.setName("zyzyzyzy");
        int o = sqlSession.insert("test.addUser", user);
        sqlSession.commit();

        System.out.println(o+"");

    }
}
