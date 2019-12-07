package com.springtest.zy.spring.tx;

public class AccountServerImp implements AccountServer {
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
    public void transfer(String from, String to, Double money) {
            accountDao.outMoney(from, money);
            accountDao.inMoney(to, money);
    }
}
