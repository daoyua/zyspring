package com.springtest.zy.spring.tx;

import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

public class AccountServerImp2 implements AccountServer {
    //xml注入，需要set方法
    private AccountDao accountDao;




    public AccountDao getAccountDao() {
        return accountDao;
    }

    public void setAccountDao(AccountDao accountDao) {
        this.accountDao = accountDao;
    }

    /**
     *
     * @param from 转出
     * @param to 转入
     * @param money 金额
     */
    @Override
    public void transfer( String from,  String to,  Double money) {
        //事务的一致性
        accountDao.outMoney(from, money);
//        int i=10/0;
        accountDao.inMoney(to, money);
    }
}
