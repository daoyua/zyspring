package com.springtest.zy.mybatis;

        import com.springtest.zy.spring.jdbc.User;
        import org.apache.ibatis.io.Resources;
        import org.apache.ibatis.session.SqlSession;
        import org.apache.ibatis.session.SqlSessionFactory;
        import org.apache.ibatis.session.SqlSessionFactoryBuilder;
        import org.junit.Test;

        import java.io.IOException;
        import java.io.InputStream;

public class TestDemo {
    @Test
    public void test() throws IOException {
            String resou= "mapper/sqlMapConfig.xml";
        InputStream resourceAsStream = Resources.getResourceAsStream(resou);
        //创建session工厂

        SqlSessionFactory build = new SqlSessionFactoryBuilder().build(resourceAsStream);

        SqlSession sqlSession = build.openSession();
        User selectUser = sqlSession.selectOne("selectUser", 2);
        System.out.println(selectUser.toString());
    }
}
