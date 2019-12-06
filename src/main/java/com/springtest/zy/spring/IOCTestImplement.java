package com.springtest.zy.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Controller("services")
public class IOCTestImplement implements Services {
    @Autowired
    @Resource(name = "user")
    public UserImpement userImpement;
    @Autowired
    @Qualifier(value = "user1")
    public UserImpement1 userImpement1;
    @Resource(name = "user2")
    public UserImpement2 userImpement2;

    @Autowired
    public UserImpement3 userImpement3;
    @Override
    public void haha() {
        System.out.println("service已经haha了");
        userImpement.haha();
        userImpement1.haha();
        userImpement2.haha();
        userImpement3.haha();
    }
}
