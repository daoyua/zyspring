package com.springtest.zy.spring;

public class UserImpement implements UserInter {
    @Override
    public void haha() {
        System.out.println(name+age);
    }
String name;
    int age;
    public UserImpement(String name,int age){
        this.name=name;
        this.age=age;
    }

    @Override
    public String toString() {
        return "UserImpement{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }


}
