package com.springtest.zy.spring;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;

//@Component("aopTest")//相当配置了bean
//@Controller("")
//@Repository("")
public class AopTest {
   @Value("zhege")
    public String name;

    public String getName() {
        return name;
    }

//    public void setName(String name) {
//        this.name = name;
//    }

    public void haha( ) {
        System.out.println("apotest:"+name);
    }
}
