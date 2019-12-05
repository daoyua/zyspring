package com.springtest.zy.spring;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
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

  @AfterReturning (value = "execution(* com.springtest.zy.spring.AopTest2.getName(..))",returning = "result")
    public String  houzhizengqian(Object result) {
        System.out.println("后置增强zy"+result);
        return    "hahah:";
    }
    @Around(value = "execution(* com.springtest.zy.spring.AopTest2.getName(..))")
    public String  huanraotest(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("环绕q++++++++++++++++++++++++++");
        Object proceed = joinPoint.proceed();
        System.out.println("环绕h++++++++++++++++++++++++++");
        return   proceed.toString();
    }
    @AfterThrowing(value = "execution(* com.springtest.zy.spring.AopTest2.getName(..))",throwing = "exx")
    public void  yichang(Throwable exx)   {

        System.out.println("异常抛出++++++++++++++++++++++++++"+exx.getMessage());
    }
    @After(value ="AopTest3.testPointcut()")
    public void  finaltest()   {

        System.out.println("最终++++++++++++++++++++++++++");
    }
    @Pointcut(value = "execution(* com.springtest.zy.spring.AopTest2.getName(..))" )
   public  void testPointcut(){

   }
}
