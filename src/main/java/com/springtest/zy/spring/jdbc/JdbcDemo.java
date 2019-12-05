package com.springtest.zy.spring.jdbc;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

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

        jdbcTemplate.update("insert into account values (null,?,?)", "new", 111);
    }
}
