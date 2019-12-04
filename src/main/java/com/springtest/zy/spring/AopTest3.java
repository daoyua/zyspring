package com.springtest.zy.spring;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
@Aspect
@Component("aopTest3")//相当配置了bean
public class AopTest3 {

@Before(value = "execution(* com.springtest.zy.spring.AopTest2.*(..))")
    public String  qianzhizengqiang() {
        System.out.println("前置增强zy");
     return    "hahah:";
    }

  @AfterReturning (value = "execution(* com.springtest.zy.spring.AopTest2.huanrao(..))")
    public String  houzhizengqian() {
        System.out.println("后置增强zy");
        return    "hahah:";
    }


}
