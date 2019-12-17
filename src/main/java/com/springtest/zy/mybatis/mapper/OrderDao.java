package com.springtest.zy.mybatis.mapper;

import com.springtest.zy.spring.jdbc.Oder;
import com.springtest.zy.spring.jdbc.User;

import java.util.List;

public interface OrderDao {

   public List<Oder> selectOrderList();
   public List<Oder> selectAccountByOrder();
   public List<User> selectUsers();

}
