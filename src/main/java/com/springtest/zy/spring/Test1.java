package com.springtest.zy.spring;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:SpringApplication.xml")
public class Test1 {
    @Resource(name = "aopTest2")
    private AopTest2 aopTest2;

    @Test
   public void testAop(){
       aopTest2.yichangtest();
       aopTest2.huanrao();
       aopTest2.haha();
       aopTest2.getName();
   }
}
