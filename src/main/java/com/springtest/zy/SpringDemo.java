package com.springtest.zy;

import org.junit.jupiter.api.Test;

public class SpringDemo {
    @Test
    public void Demo() {
        UserDao userDao = new UserServiceImplement();
        userDao.save();
    }
}
