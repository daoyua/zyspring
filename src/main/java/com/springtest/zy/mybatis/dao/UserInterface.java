package com.springtest.zy.mybatis.dao;

import com.springtest.zy.spring.jdbc.Oder;

import java.util.List;

public interface UserInterface {
    public void selectAll();
    public Oder selectByID(int id);
    public List<Oder> selectOrderList();
}
