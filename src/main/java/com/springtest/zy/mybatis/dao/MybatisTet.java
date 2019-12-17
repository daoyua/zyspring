package com.springtest.zy.mybatis.dao;

import com.springtest.zy.mybatis.mapper.OrderDao;
import com.springtest.zy.spring.UserInter;
import com.springtest.zy.spring.jdbc.Oder;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.util.List;
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:SpringApplication.xml")
public class MybatisTet extends SqlSessionDaoSupport implements UserInterface {
//    @Resource(name = "sqlSessionFactory")
//    SqlSessionFactoryBean sqlSessionFactoryBean;
//    @Autowired
//    SqlSession sqlSession;

//    @Test
    public void tesss() {
//        ClassPathXmlApplicationContext classPathXmlApplicationContext=new ClassPathXmlApplicationContext("SpringApplication.xml");
//        MybatisTet mybatisTet = (MybatisTet) classPathXmlApplicationContext.getBean("mybatisTet");
//        SqlSessionFactory sqlSessionFactory= mybatisTet.getSqlSessionFactory();
//        SqlSessionFactory sqlSessionFactory = getSqlSessionFactory();
//        SqlSession sqlSession = sqlSessionFactoryBean.();
        SqlSession sqlSession = getSqlSession();
        OrderDao mapper = sqlSession.getMapper(OrderDao.class);
//        OrderDao mapper = getSqlSession().getMapper(OrderDao.class);
        List<Oder> oders = mapper.selectOrderList();
        for (Oder o:oders){
            System.out.println(o.toString());
        }
//        System.out.println(o1.toString());
    }

    @Override
    public void selectAll() {

    }

    @Override
    public Oder selectByID(int id) {
        return null;
    }

    @Override
    public List<Oder> selectOrderList() {
        return null;
    }
}
