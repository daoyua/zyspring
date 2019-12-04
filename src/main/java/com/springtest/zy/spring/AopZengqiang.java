package com.springtest.zy.spring;

import org.aopalliance.intercept.Joinpoint;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;

public class AopZengqiang {
    /**
     *前置通知
     */
    public void checkpri(JoinPoint joinpoint){
//    public void checkpri( ){
        System.out.println("检查+++++++++++++++++++++++"+joinpoint);

    }

    /**
     *后置通知
     * result是haha里面的返回值
     */
    public void wrigtLog(Object result){
        System.out.println("日志记录+++++++++++++++++++++++"+result);
    }
    /**
     * 性能监控
     * 环绕通知
     */
    public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        System.out.println("环绕前通知+++++++++++++++");
        Object obn=  proceedingJoinPoint.proceed();
        System.out.println("环绕后通知+++++++++++++++"+obn);
        return obn;
    }

    public void afterThrowing(Throwable ex){
        System.out.println("异常抛出++++++++++++++++++"+ex.getMessage());
    }

    public void finalmethod(){
        System.out.println("最终通知+++++++++++++");
    }
}
