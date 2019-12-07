package com.springtest.zy.spring.tx;

import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

public class AccountServerImp implements AccountServer {
    //xml注入，需要set方法
    private AccountDao accountDao;

    private TransactionTemplate transactionTemplate;

    public TransactionTemplate getTransactionTemplate() {
        return transactionTemplate;
    }

    public void setTransactionTemplate(TransactionTemplate transactionTemplate) {
        this.transactionTemplate = transactionTemplate;
    }

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
    public void transfer(final String from, final String to, final Double money) {
        //事务的一致性
        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus transactionStatus) {
                accountDao.outMoney(from, money);
//                int i=10/0;
                accountDao.inMoney(to, money);
            }
        });
//        accountDao.outMoney(from, money);
//        int i=10/0;
//        accountDao.inMoney(to, money);
    }
}
