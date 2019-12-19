package com.springtest.zy.mybatis.springboot;

import java.io.Serializable;

public class Oder implements Serializable {

    private int id;
    private int user_id;
    private String number;
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    @Override
    public String toString() {
        return "Oder{" +
                "id=" + id +
                ", user_id=" + user_id +
                ", number='" + number + '\'' +
                ", user=" + user +
                '}';
    }
}
