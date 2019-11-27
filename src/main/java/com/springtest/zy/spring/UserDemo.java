package com.springtest.zy.spring;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

public class UserDemo {

    @Test
    public void testSpring() {
        ApplicationContext applicationContext=new ClassPathXmlApplicationContext("SpringApplication.xml");
        UserImpement user = (UserImpement) applicationContext.getBean("user");
        user.haha();

        UserImpement1 user1 = (UserImpement1) applicationContext.getBean("user1");
        user1.haha();
    }
//    @RequestMapping(value = "/getFactoryData")
//    public @ResponseBody
//    List getFactoryData(){
//        //调用service，传入companyId条件，返回的是一个list
//        return statService.getFactoryData(companyId);
//    }
}
