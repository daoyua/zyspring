package com.springtest.zy.spring.tx;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

/**
 * 转账的dao
 */
public class AccountDaoImp extends JdbcDaoSupport implements AccountDao {


    @Override
    public void outMoney(String from, Double money) {
        this.getJdbcTemplate().update("update account set money = money-? where name=?", money, from);
    }

    @Override
    public void inMoney(String to, Double money) {
        this.getJdbcTemplate().update("update account set money = money+? where name=?", money, to);
    }
}
