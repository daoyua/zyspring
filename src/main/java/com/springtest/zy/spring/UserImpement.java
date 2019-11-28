package com.springtest.zy.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;

@Repository("user")
public class UserImpement implements UserInter {
    @Override
    public void haha() {
        System.out.println(name + age);
    }

    String name;
    int age;
    public UserImpement(String name, int age) {
        this.name = name;
        this.age = age;
    }
public UserImpement(){

}
    @Override
    public String toString() {
        return "UserImpement{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }


}
