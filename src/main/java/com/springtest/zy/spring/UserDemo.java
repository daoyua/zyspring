package com.springtest.zy.spring;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class UserDemo {

    @Test
    public void testSpring() {
        ApplicationContext applicationContext=new ClassPathXmlApplicationContext("SpringApplication.xml");
        UserImpement user = (UserImpement) applicationContext.getBean("user");
        user.haha();
    }

    ;
}
