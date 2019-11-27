package com.springtest.zy.spring;

public class UserImpement1 implements UserInter {
    UserImpement userImpement;

    public void setUserImpement(UserImpement userImpement) {
        this.userImpement = userImpement;
    }

    @Override
    public void haha() {
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
