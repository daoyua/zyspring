package com.springtest.zy.spring;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Controller("aaa")
public class UserImpement3 implements UserInter {
    UserImpement userImpement;

    public void setUserImpement(UserImpement userImpement) {
        this.userImpement = userImpement;
    }

    @PostConstruct //init-method
    public void init() {
        System.out.println("init+++++++++++");
    }

    @PreDestroy  //destroy-method
    public void destroy() {
        System.out.println("destroy+++++++++++");
    }

    @Override
    public void haha() {
        System.out.println("UserImpement3已经运行");
        System.out.println(name + age + userImpement);
    }

    String name;
    int age;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "UserImpement1{" +
                "userImpement=" + userImpement +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
