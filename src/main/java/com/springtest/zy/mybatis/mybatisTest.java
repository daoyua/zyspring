package com.springtest.zy.mybatis;

import com.springtest.zy.mybatis.mapper.OrderDao;
import com.springtest.zy.mybatis.mapper.UserDao;
import com.springtest.zy.spring.jdbc.Oder;
import com.springtest.zy.spring.jdbc.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class mybatisTest {
    @Test
    public void test() throws IOException {
        String sss= "sqlMapConfig.xml";
        InputStream resourceAsStream = Resources.getResourceAsStream(sss);
        SqlSessionFactory build = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = build.openSession();
//        Object o = sqlSession.selectOne("test.selectUser", 1);
//        List<User> o  = sqlSession.selectList("test.selectUserName", "z");
//        System.out.println(o.toString());
//        添加用户
//        User user=new User();
//        user.setMoney(10000);
//        user.setName("updatesTest");
//        user.setId(10);
//        int o = sqlSession.insert("test.addUser", user);
//        sqlSession.commit();
//
//        System.out.println(user.getId());
        //修改
//        int o = sqlSession.update("test.updateUser", user);

       //删除
//        int delete = sqlSession.delete("test.deleteUser",9);
//        UserDao mapper = sqlSession.getMapper(UserDao.class);
//        User user1 = mapper.selectUser(3);
//        sqlSession.commit();
//        System.out.println(user1.toString());
//
//        List<User> z = mapper.selectUserName("z");
//        System.out.println(z.toArray().toString());
//        System.out.println(user.getId());


        //根据性别和姓名查询
//        UserDao mapper = sqlSession.getMapper(UserDao.class);
//        User user1 =new User();
//        user1.setName("zzz");
////        user1.setSex("n");
//        List<User> users = mapper.selectUserBySex(user1);
//        System.out.println(users.size()+"");
        UserDao mapper = sqlSession.getMapper(UserDao.class);
        User user1 =new User();
        user1.setName("zzz");
        ArrayList aa=new ArrayList();
        aa.add("1");
        aa.add("2");
        aa.add("3");
        aa.add("4");
        user1.setIds(aa);
//        user1.setSex("n");
        List<User> users = mapper.selectUserListByIDS(user1);
        System.out.println(users.size()+"");
    }
//resultmap
    @Test
    public void test2() throws IOException {
        SqlSession sqlSession =init();
        OrderDao mapper = sqlSession.getMapper(OrderDao.class);
        List<Oder> oders = mapper.selectOrderList();
        for (Oder o:
                oders) {
            System.out.println(o.toString());
        }
        System.out.println(oders.size()+"");
    }
//一对一映射
    @Test
    public void test3() throws IOException {
        SqlSession sqlSession = init();
        OrderDao mapper = sqlSession.getMapper(OrderDao.class);
        List<Oder> oders = mapper.selectAccountByOrder();
        for (Oder o:
                oders) {
            System.out.println(o.toString());
        }
        System.out.println(oders.size()+"");
    }


    //一对多映射
    @Test
    public void test4() throws IOException {
        SqlSession sqlSession = init();
        OrderDao mapper = sqlSession.getMapper(OrderDao.class);
        List<User> users = mapper.selectUsers();
        for (User o:
                users) {
            System.out.println(o.toString());
        }
        System.out.println(users.size()+"");
    }
    private SqlSession init() throws IOException {
        String sss = "sqlMapConfig.xml";
        InputStream resourceAsStream = Resources.getResourceAsStream(sss);
        SqlSessionFactory build = new SqlSessionFactoryBuilder().build(resourceAsStream);
       return build.openSession();

    }
}
