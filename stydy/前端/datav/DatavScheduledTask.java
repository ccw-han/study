package net.cyweb.config.bigcustom;

import com.alibaba.fastjson.JSONObject;
import net.cyweb.config.custom.RemoteAccessUtils;
import net.cyweb.mapper.ProgramBackMapper;
import net.cyweb.service.ProgramBackService;
import net.cyweb.service.ProgramInsertOrUpdateService;
import net.cyweb.service.RedisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Component
@Configuration      //1.主要用于标记配置类，兼备Component的效果。
@EnableScheduling   // 2.开启定时任务
@EnableAsync
@PropertySource(value = "classpath:conf/config.properties")
public class DatavScheduledTask {
    @Autowired
    private RedisService redisService;

    @Value("${note.cnyBTCUrl}")
    private String cnyBTCUrl;

    @Value("${note.cnyUSDTUrl}")
    private String cnyUSDTUrl;

    @Value("${note.cnyETHUrl}")
    private String cnyETHUrl;

    @Autowired
    private ProgramInsertOrUpdateService programInsertOrUpdateService;

    @Autowired
    private ProgramBackService programBackService;

    @Autowired
    private ProgramBackMapper programBackMapper;

    private static final Logger log = LoggerFactory.getLogger(DatavScheduledTask.class);


    /**
     * 项目方， 持有平台币前五的用户的所有买入均价和卖出均价
     *
     * @param
     * @param
     * @return result.getData()
     */
    //TODO 会重复插入问题
    //3.添加定时任务
    //或直接指定时间间隔，例如：5分钟 异步执行
//    @Scheduled(cron = "0 0/1 * * * ?")
    @Async
    public void getProgramForDatav1() {
        programBackService.insertDataToProgramDatav1();
    }

    /**
     * 项目方， 买入卖出均价
     *
     * @param
     * @param
     * @return result.getData()
     */
    //TODO 会重复插入问题
    //3.添加定时任务
    //或直接指定时间间隔，例如：5分钟 异步执行
//    @Scheduled(cron = "0 0/1 * * * ?")
    @Async
    public void getProgramForDatav2() {
        programBackService.insertIntoAveLineDatav2();
    }

    /**
     * 项目方， 买入卖出数量
     *
     * @param
     * @param
     * @return result.getData()
     */
    //TODO 会重复插入问题
    //3.添加定时任务
    //或直接指定时间间隔，例如：5分钟 异步执行
//    @Scheduled(cron = "0 0/1 * * * ?")
    @Async
    public void getProgramForDatav3() {
        programBackService.insertIntoAveLineDatav3();
    }

    /**
     * 项目方， 充币提币数据
     *
     * @param
     * @param
     * @return result.getData()
     */
    //TODO 会重复插入问题
    //3.添加定时任务
    //或直接指定时间间隔，例如：5分钟 异步执行
//    @Scheduled(cron = "0 0/1 * * * ?")
    @Async
    public void getProgramForDatav4() {
        programBackService.insertIntoAveLineDatav4();
    }

    /**
     * 项目方， 做市商买入卖出数量和均价
     *
     * @param
     * @param
     * @return result.getData()
     */
    //TODO 会重复插入问题
    //3.添加定时任务
    //或直接指定时间间隔，例如：5分钟 异步执行
    @Scheduled(cron = "0 0/1 * * * ?")
    @Async
    public void getProgramForDatav5() {
        programBackService.insertIntoAveLineDatav5();
    }



}
