package com.springtest.zy.spring.tx;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;

@ContextConfiguration("classpath:tx.xml")
@RunWith(SpringJUnit4ClassRunner.class)

public class TxTest {
    @Resource(name = "accountServer")
    AccountServerImp accountServerImp;

    @Test
    public void testTx() {
        accountServerImp.transfer("zzz","aaa", 22d);
    }
}
