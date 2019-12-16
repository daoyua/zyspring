package com.springtest.zy.mybatis.mapper;

import com.springtest.zy.spring.jdbc.User;

import java.util.List;

public interface UserDao {

   public User selectUser(Integer id);
   public List<User> selectUserName(String name);

   //根据姓名和性别查询用户
   public List<User> selectUserBySex(User user);
   public List<User> selectUserListByIDS(User user);
}
