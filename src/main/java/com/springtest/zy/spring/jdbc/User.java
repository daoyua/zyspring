package com.springtest.zy.spring.jdbc;

import java.io.Serializable;
import java.util.ArrayList;

public class User implements Serializable {

    String name;
    String sex;
    double money;
    int id;
    ArrayList<Oder> oders;

    public ArrayList<Oder> getOders() {
        return oders;
    }

    public void setOders(ArrayList<Oder> oders) {
        this.oders = oders;
    }

    ArrayList<Integer> ids;

    public ArrayList<Integer> getIds() {
        return ids;
    }

    public void setIds(ArrayList<Integer> ids) {
        this.ids = ids;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getMoney() {
        return money;
    }

    public void setMoney(double money) {
        this.money = money;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                ", money=" + money +
                ", id=" + id +
                ", oders=" + oders +
                ", ids=" + ids +
                '}';
    }
}
