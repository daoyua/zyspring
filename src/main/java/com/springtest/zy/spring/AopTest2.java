package com.springtest.zy.spring;

import org.aspectj.apache.bcel.util.ClassPath;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@Component("aopTest2")//相当配置了bean
//@Controller("")
//@Repository("")

public class AopTest2   {
   @Value("zhege")
    public String name;

    public String getName() {
//        int i =1/0;
        return name;
    }

//    public void setName(String name) {
//        this.name = name;
//    }

    public String  haha() {
     return    "hahah:";
    }
    public String  huanrao() {
        System.out.println("开始环绕了");
     return    "开始环绕了:";
    }

    public void  yichangtest() {
        System.out.println("开始运行异常了");
//        int o= 1/0;
    }

}
