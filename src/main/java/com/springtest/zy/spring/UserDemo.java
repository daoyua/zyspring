package com.springtest.zy.spring;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class UserDemo {

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
}
