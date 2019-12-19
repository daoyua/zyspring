package com.springtest.zy.mybatis.springboot;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@Controller
@RestController
public class QuickStartTest {

    @RequestMapping("/quick")
    public String quick() {
        return "aaaa springboot";
    }

    @RequestMapping("/user")
    public User quickUser() {
        User user = new User();
        user.setId(1);
        user.setMoney(3333);
        user.setName("hahahha");
        user.setSex("women");
        return user;
    }
}
