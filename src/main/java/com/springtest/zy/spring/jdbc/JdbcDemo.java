package com.springtest.zy.spring.jdbc;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@ContextConfiguration("classpath:SpringApplication.xml")
@RunWith(SpringJUnit4ClassRunner.class)
public class JdbcDemo {

    @Test
    public void demo1() {
        //创建连接池
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        driverManagerDataSource.setUrl("jdbc:mysql://localhost:3306/test?serverTimezone=UTC");
        driverManagerDataSource.setUsername("root");
        driverManagerDataSource.setPassword("zhouyang");
        //创建jdbc
        JdbcTemplate jdbcTemplate = new JdbcTemplate(driverManagerDataSource);
        jdbcTemplate.update("insert into account values (null,?,?)", "zzz", 22);
    }

    @Resource(name = "jdbcTemplete")
    private JdbcTemplate jdbcTemplate;

    @Test
    public void demo2() {
        //创建jdbc

//        jdbcTemplate.update("insert into account values (null,?,?)", "new", 111);
        //xiugai
//        jdbcTemplate.update("update account set name =? ,money=? where id =?","sss",2222,3);

        //删除
//        jdbcTemplate.update("delete from  account where id=?",2);

        //查询
//        String s = jdbcTemplate.queryForObject("select name from account where id =?", String.class, 3);
//        System.out.println(s+"");

//        Long aLong = jdbcTemplate.queryForObject("select count(*) from account",Long.class);
//        System.out.println(aLong+"");

        List<Map<String, Object>> maps = jdbcTemplate.queryForList("select * from account");
        System.out.println(maps.toArray().toString());
    }

    @Test
    // 查询多条记录
    public void demo7(){
        List<User> list = jdbcTemplate.query("select * from account", new MyRowMapper());
        for (User account : list) {
            System.out.println(account);
        }
    }

    class MyRowMapper implements RowMapper<User> {

        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User account = new User();
            account.setId(rs.getInt("id"));
            account.setName(rs.getString("name"));
            account.setMoney(rs.getDouble("money"));
            return account;
        }

    }
}
