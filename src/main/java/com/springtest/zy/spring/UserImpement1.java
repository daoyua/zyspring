package com.springtest.zy.spring;

import org.springframework.stereotype.Component;

import javax.annotation.security.RunAs;


@Component("user1")
public class UserImpement1 implements UserInter {
    UserImpement userImpement;

    public void setUserImpement(UserImpement userImpement) {
        this.userImpement = userImpement;
    }

    @Override
    public void haha() {
        System.out.println("UserImpement1已经运行");
        System.out.println(name+age+userImpement);
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
