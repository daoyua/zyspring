package com.springtest.zy.spring;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component(value = "aopTest")//相当配置了bean
public class AopTest implements UserInter {
   @Value("zhege")
    public String name;

    public String getName() {
        return name;
    }

//    public void setName(String name) {
//        this.name = name;
//    }

    @Override
    public void haha() {
        System.out.println("apotest:"+name);
    }
}
