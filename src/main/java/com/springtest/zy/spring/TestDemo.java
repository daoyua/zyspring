package com.springtest.zy.spring;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:SpringApplication.xml")
public class TestDemo {

    @Test
    public void testSpring() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("SpringApplication.xml");
        UserImpement user = (UserImpement) applicationContext.getBean("user");
        user.haha();

        UserImpement1 user1 = (UserImpement1) applicationContext.getBean("user1");
        user1.haha();
    }

    @Test
    public void testIOC() {

        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("SpringApplication.xml");
        AopTest user = (AopTest) applicationContext.getBean("aopTest");
        user.haha();
    }
    //注解注入属性，注解注入对象
    @Test
    public void testIOC1() {

        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("SpringApplication.xml");
        ServicesImplement services = (ServicesImplement) applicationContext.getBean("services");
        services.haha();
        applicationContext.close();
    }
    @Resource(name = "aopTest2")
    private AopTest2 aopTest2;
    @Test
    public void testAop() {

        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("SpringApplication.xml");
        AopTest services1 = (AopTest) applicationContext.getBean("aopTest");
//        AopTest2 services2 = (AopTest2) applicationContext.getBean("aopTest2");
        services1.haha();
        aopTest2.haha();
        aopTest2.huanrao();
        aopTest2.yichangtest();
        applicationContext.close();
    }
}
