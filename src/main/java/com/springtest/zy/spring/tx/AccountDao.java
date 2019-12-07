package com.springtest.zy.spring.tx;

public interface AccountDao {
    public void outMoney(String from,Double money);
    public void inMoney(String from,Double money);
}
