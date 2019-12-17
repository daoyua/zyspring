package com.springtest.zy.mybatis;

import com.springtest.zy.mybatis.dao.MybatisTet;
import com.springtest.zy.mybatis.mapper.OrderDao;
import com.springtest.zy.spring.jdbc.Oder;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

public class Mybatis_spring {

    @Test
    public void testMybatis(){
        ClassPathXmlApplicationContext classPathXmlApplicationContext=new ClassPathXmlApplicationContext("SpringApplication.xml");
//        OrderDao mapperFactoryBean= (OrderDao) classPathXmlApplicationContext.getBean("mapperFactoryBean");
        //没有接口名字
//        OrderDao bean = classPathXmlApplicationContext.getBean(OrderDao.class);
//        List<Oder> oders = bean.selectOrderList();
//        for (Oder O:
//        oders) {
//            System.out.println(O.toString());
//        }
        //******************************************************************
        MybatisTet ttt= (MybatisTet) classPathXmlApplicationContext.getBean("mybatisTet");
        ttt.tesss();
//        OrderDao mapper = ttt.getSqlSession().getMapper(OrderDao.class);
////        OrderDao mapper = getSqlSession().getMapper(OrderDao.class);
//        List<Oder> oders = mapper.selectOrderList();
//        for (Oder o:oders){
//            System.out.println(o.toString());
//        }
    }
}
