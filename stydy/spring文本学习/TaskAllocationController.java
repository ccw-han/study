/**
 * Copyright &copy; 2012-2013 <a href="https://github.com/thinkgem/jeesite">JeeSite</a> All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
package com.rextec.sssj.web.system;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Maps;
import com.rextec.sssj.biz.system.impl.*;
import com.rextec.sssj.dal.entity.checkcell.*;
import com.rextec.sssj.dal.entity.system.SysCode;
import com.rextec.sssj.dal.entity.system.SysPartyRole;
import com.rextec.sssj.utils.StringUtils;
import com.rextec.sssj.web.common.controller.BaseController;
import com.rextec.sssj.web.system.editor.SysCodeEditor;
import com.rextec.sssj.web.system.to.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.persistence.Table;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 编码Controller
 */
@Controller
@RequestMapping(value = "/r/task")
public class TaskAllocationController extends BaseController {

    @Autowired
    private TaskAllocationService taskAllocationService;
    @Autowired
    private PersonRoleService executeSqlService;
    @Autowired
    private TaskListService taskListService;
    @Autowired
    private SysCodeEditor sysCodeEditor;

    @Autowired
    private PartyRoleService partyRoleService;

    static final Map<String,Class> taskMap = new HashMap<String, Class>();

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(SysCode.class, sysCodeEditor);
    }
    @RequestMapping(value = {"ajax/list/taskAllocationList"})
    @ResponseBody
    public Map<String, Object> listJson(Model model,String lineSn,String classification) {
        Map<String, Object> result = Maps.newHashMap();
        List<Map<String, Object>> list = taskAllocationService.selectTaskAllocationByLine(lineSn,classification);
        result.put("data", list);
        result.put("total", list.size());
        return result;
    }

    @RequestMapping(value="ajax/save" ,method={RequestMethod.POST})
    @ResponseBody
    public Map<String,Object> save(@RequestBody TaskAllocation taskAllocation){
        Map<String, Object> result = Maps.newHashMap();
        Integer cnt = 0;
        if (StringUtils.isNotBlank(taskAllocation.getId())) {
            cnt = taskAllocationService.updateTaskAllocation(taskAllocation);
        } else {
            taskAllocation.setId(UUID.randomUUID().toString());
            cnt = taskAllocationService.saveTaskAllocation(taskAllocation);
        }
        result.put("type", cnt);
        result.put("data",taskAllocation);
        return result;
    }

    @RequestMapping(value = {"ajax/list/getTaskCategoryList"})
    @ResponseBody
    public Map<String,Object> selectTaskCategory(String lineSn) {
        Map<String, Object> result = Maps.newHashMap();
        List<CheckTableCategory> list = taskAllocationService.selectTaskCategory(lineSn);
        result.put("type", "1");
        result.put("data",list);
        return result;
    }

    @RequestMapping(value = {"ajax/list/getTaskList"})
    @ResponseBody
    public Map<String,Object> selectTodayTasks(String lineSn,Integer category) {
        Map<String, Object> result = Maps.newHashMap();
        List<Map<String, Object>> list = taskAllocationService.selectTaskListByLineAndCategory(lineSn,category);
        result.put("type", "1");
        result.put("data",list);
        return result;
    }

/*    @RequestMapping(value = {"ajax/list/getAllTaskList"})
    @ResponseBody
    public Map<String,Object> selectAllTodayTasks(String lineSn,String classification) {
        Map<String, Object> result = Maps.newHashMap();
        List<Map<String, Object>> list = taskAllocationService.selectAllTaskListByLineAndCategory(lineSn, classification);
        result.put("type", "1");
        result.put("data",list);
        return result;
    }*/

    @RequestMapping(value = {"ajax/list/getAllTaskList"})
    @ResponseBody
    public Map<String,Object> selectAllTodayTasks(String lineSn,String classification) {
        Map<String, Object> result = Maps.newHashMap();
        Map<String,Object> params = new HashMap<String, Object>();
        params.put("lineSn",lineSn);
        params.put("classification",classification);
        List<Map<String, Object>> list = taskAllocationService.selectPlanTasks(params);
        result.put("type", "1");
        result.put("data",list);
        return result;
    }

    @RequestMapping(value = {"ajax/list/planTask"})
    @ResponseBody
    public Map<String,Object> planTask(){
        Map<String, Object> result = Maps.newHashMap();
        taskAllocationService.savePlanTaskList();
        result.put("type", "1");
        return result;
    }

    @RequestMapping(value = {"ajax/list/getAllTables"})
    @ResponseBody
    public Map<String,Object> getTableInfos() {
        Map<String, Object> result = Maps.newHashMap();
        List<Map<String, Object>> list = taskAllocationService.selectAllTable();
        result.put("type", "1");
        result.put("data",list);
        return result;
    }

    @RequestMapping(value = {"ajax/list/getTableFieldsBySearch"})
    @ResponseBody
    public Map<String,Object> getTableFieldsBySearch(@RequestBody BenchmarkSearchTO search) {
        Map<String, Object> result = Maps.newHashMap();
        Map<String, Object> benchmark = taskAllocationService.selectMaxVersionBenchmark(search.getTableCode());
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        if (benchmark!=null && benchmark.get("id")!=null){
            list = taskAllocationService.getTableFields(benchmark.get("id").toString());
        }
        List<Map<String, Object>> records = taskAllocationService.selectRecordsByBenchmarks(search);
        result.put("type", "1");
        result.put("data",list);
        result.put("records",records);
        return result;
    }

    @RequestMapping(value = {"ajax/list/selectBenchamrksByRange"})
    @ResponseBody
    public Map<String,Object> selectBenchamrksByRange(@RequestBody BenchmarkSearchTO search) {
        Map<String, Object> result = Maps.newHashMap();
        List<Map<String, Object>> records = taskAllocationService.selectBenchamrksByRange(search);
        result.put("values",records);
        return result;
    }

    @RequestMapping(value = {"ajax/list/getTableFields"})
    @ResponseBody
    public Map<String,Object> getTableFields(String tableCode) {
        Map<String, Object> result = Maps.newHashMap();
        Map<String, Object> benchmark = taskAllocationService.selectMaxVersionBenchmark(tableCode);
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        if (benchmark!=null && benchmark.get("id")!=null){
            list = taskAllocationService.getTableFields(benchmark.get("id").toString());
        }
        result.put("type", "1");
        result.put("benchmark",benchmark);
        result.put("data",list);
        return result;
    }

    @RequestMapping(value = {"ajax/save/benchmark"})
    @ResponseBody
    public Map<String,Object> saveBenchmark(@RequestBody BenchmarkTO map) {
        Map<String, Object> result = Maps.newHashMap();
        Map<String, Object> benchmark = map.getBenchmark();
        Map<String, Object> benchmark2 = taskAllocationService.selectMaxVersionBenchmark(benchmark.get("table_code").toString());
        if (benchmark !=null && benchmark.get("version")!=null
                && Integer.valueOf(benchmark.get("version").toString()) != Integer.valueOf(benchmark2.get("version").toString())){
            result.put("type", -1);
            result.put("msg","数据已被修改，请刷新重试！");
        } else {
            benchmark.put("version", Integer.valueOf(benchmark.get("version").toString())+1);
            int i = taskAllocationService.saveBenchmark(map);
            result.put("type", i);
        }
        return result;
    }

    @RequestMapping(value = {"ajax/select/tables"})
    @ResponseBody
    public Map<String,Object> selectAllTables() {
        Map<String, Object> result = Maps.newHashMap();
        List<Map<String, Object>> list = taskAllocationService.selectTables();
        result.put("type", 1);
        result.put("data",list);
        return result;
    }

    private ClassPathScanningCandidateComponentProvider createComponentScanner() {
        // Don't pull default filters (@Component, etc.):
        ClassPathScanningCandidateComponentProvider provider
                = new ClassPathScanningCandidateComponentProvider(false);
        provider.addIncludeFilter(new AnnotationTypeFilter(CheckListEntity.class));
        return provider;
    }

    @RequestMapping(value="ajax/execute/sql" ,method={RequestMethod.POST})
    @ResponseBody
    public Map<String,Object> executeSql(@RequestBody Map<String,Object> map){

        //找出所有需同步的表格及类的对应关系
        if(taskMap.isEmpty()){
            synchronized (this){
                if(taskMap.isEmpty()){
                    try {
                        ClassPathScanningCandidateComponentProvider provider = createComponentScanner();
                        for (BeanDefinition beanDef : provider.findCandidateComponents("com.rextec.sssj.dal.entity.checkcell")) {
                            Class<?> cl = Class.forName(beanDef.getBeanClassName());
                            Table clEntity = cl.getAnnotation(Table.class);
                            taskMap.put(clEntity.name().toLowerCase(), cl);
                        }
                    }catch (Exception e){
                        logger.error("finding CheckListEntity", e);
                    }
                }
            }
        }

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        try {
            Map<String, Object> result = Maps.newHashMap();
            String tableName = map.get("tableName").toString();
            if (StringUtils.isNotBlank(tableName)){
                tableName = tableName.toLowerCase();
            }
            Class tableClass = taskMap.get(tableName);
            if(tableClass == null){
                logger.error("table not found for" + tableName);
                taskAllocationService.exeSql(map.get("sql").toString());
                result.put("type", 0);
            }else{
                Object o = mapper.readValue(map.get("data").toString(), tableClass);
                CheckTableHistory history = null;
            /*if ("insert".equals(map.get("type").toString())){
                history = new CheckTableHistory();
                history.setCreateDate(new Date());
                history.setTableId(map.get("tableName").toString());
                String lineSn = map.get("lineSn") != null ? map.get("lineSn").toString() : "";
                history.setLineSn(lineSn);
            }*/
                if(tableClass.equals(MmForm0000209Detail.class)){
                    MmForm0000209Detail t = (MmForm0000209Detail) o;
                    Map tmpMap = mapper.readValue(map.get("data").toString(), Map.class);
                    String processContentStr = mapper.writeValueAsString(tmpMap.get("processContent"));
                    String confirmContentStr = mapper.writeValueAsString(tmpMap.get("confirmContent"));
                    String changeContentStr = mapper.writeValueAsString(tmpMap.get("changeContent"));
                    t.setProcessContent(processContentStr);
                    t.setConfirmContent(confirmContentStr);
                    t.setChangeContent(changeContentStr);

                }

                taskListService.save(o, history);
                result.put("type", 1);
            }
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }

        //Integer cnt = executeSqlService.exeSql(map.get("sql").toString());
        //result.put("type", cnt);
        return null;
    }

    @RequestMapping(value="ajax/selectData" ,method={RequestMethod.POST})
    @ResponseBody
    public Map<String,Object> selectData(@RequestBody Map<String,Object> map){
        Map<String, Object> result = Maps.newHashMap();
        List<Map<String, Object>> list = taskAllocationService.selectData(map);
        result.put("type", 1);
        result.put("data",list);
        return result;
    }

    //某一产线
    @RequestMapping(value = "ajax/selectTask", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> selectTask(@RequestBody LineSearchTo line){
        Map<String, Object> result = Maps.newHashMap();
        //当天需要完成的点检任务
        Integer total = 0;
        List<Map<String, Object>> list = taskAllocationService.selectTasks(line.getLineCode());
        for (int i = 0; i < list.size() ; i++) {
            total = total + (Integer) list.get(i).get("times");
        }
        result.put(line.getLine() +"total", total);
        List<RangeFromTo> rangeFromTos = new ArrayList<>();
        for (int a = 0; a<list.size(); a++){
            boolean x = true;
            for(int index = 0; index < rangeFromTos.size();index++) {
                //同一时间段的统一计算 计算次数
                if (list.get(a).get("range_from").toString().equals(rangeFromTos.get(index).getRangeFrom())
                        && list.get(a).get("range_to").toString().equals(rangeFromTos.get(index).getRangeTo())) {
                    rangeFromTos.get(index).getCodeList().add(list.get(a).get("code").toString());
                    rangeFromTos.get(index).setCnum(rangeFromTos.get(index).getCnum()+(Integer)list.get(a).get("times"));
                    x = false;
                }
            }
            //不同的时间段则放入新的list 计算次数
            if (x){
                RangeFromTo rangeFromTo = new RangeFromTo();
                rangeFromTo.setRangeFrom(list.get(a).get("range_from").toString());
                rangeFromTo.setRangeTo(list.get(a).get("range_to").toString());
                List<String> codeList = new ArrayList<>();
                codeList.add(list.get(a).get("code").toString());
                rangeFromTo.setCodeList(codeList);
                rangeFromTo.setCnum((Integer) list.get(a).get("times"));
                rangeFromTos.add(rangeFromTo);
            }
        }
        TaskProcessInfoSearchTo task = new TaskProcessInfoSearchTo();
        task.setComplete("1");
        if (line.getLine() != null){
            task.setLine(line.getLine());
        }
        //已完成的点检任务
        List<Map<String, Object>> taskComplete = taskAllocationService.selectTaskProcessInfo(task);
        for(int b= 0; b < taskComplete.size(); b++){
            for (int index = 0; index < rangeFromTos.size();index++){
                //如果已完成的点检里面包含当前时段和当前产线的工程，则当前时段和当前产线下已完成项目加1
                if(rangeFromTos.get(index).getCodeList().contains(taskComplete.get(b).get("codedetail"))){
                    rangeFromTos.get(index).setRangCount(rangeFromTos.get(index).getRangCount() + 1);
                }
            }
        }
        result.put(line.getLine() + "complete", taskComplete.size());
        result.put(line.getLine() +"completeData", taskComplete);
        task.setOk("1");
        //已完成的点检任务中NG的数据
        List<Map<String, Object>> taskNg = taskAllocationService.selectTaskProcessInfo(task);
        result.put(line.getLine() +"ng", taskNg.size());
        result.put(line.getLine() +"ngData", taskNg);
        TaskProcessInfoSearchTo task2 = new TaskProcessInfoSearchTo();
        if (line.getLine() != null){
            task2.setLine(line.getLine());
        }
        task2.setItagId("1");
        List<Map<String, Object>> taskItag = taskAllocationService.selectTaskProcessInfo(task2);
        result.put(line.getLine() +"itag",taskItag.size());
        result.put(line.getLine() +"itagData", taskItag);
        result.put(line.getLine() +"times", rangeFromTos);
        return result;
    }
    //所有产线
    @RequestMapping(value = "ajax/selectTasks", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> selectTasks(){
        Map<String, Object> result = Maps.newHashMap();
        List<String> lineName = new ArrayList<>();
        List<String> lineNames = new ArrayList<>();
        //当天需要完成的点检任务
        List<Map<String, Object>> list = taskAllocationService.selectTasks(null);
        List<SysPartyRole> lineCounts = partyRoleService.findSubRoles(partyRoleService.getByCode("gangwei"), false);
        TaskProcessInfoSearchTo task = new TaskProcessInfoSearchTo();
        //已完成的点检任务
        task.setComplete("1");
        List<Map<String, Object>> taskComplete = taskAllocationService.selectTaskProcessInfo(task);
        //已完成的点检任务中NG的数据
        task.setOk("1");
        List<Map<String, Object>> taskNg = taskAllocationService.selectTaskProcessInfo(task);
        //所有产线itag
        TaskProcessInfoSearchTo task2 = new TaskProcessInfoSearchTo();
        task2.setItagId("1");
        List<Map<String, Object>> taskItag = taskAllocationService.selectTaskProcessInfo(task2);
        //不同产线list
        for (int index = 0; index < list.size(); index ++){
            if (!lineName.contains(list.get(index).get("line").toString())){
                lineName.add(list.get(index).get("line").toString());
            }
        }
        int z = lineCounts.size();
        //如果当前产线无计划则设为0
        for(int index = 0; index < z; index++){
            if (!lineName.contains(lineCounts.get(index).getName())){
                result.put(lineCounts.get(index).getName() +"total", 0);
                result.put(lineCounts.get(index).getName() + "complete", 0);
                result.put(lineCounts.get(index).getName() +"ng", 0);
                result.put(lineCounts.get(index).getName() +"itag",0);
            }
            lineNames.add(lineCounts.get(index).getName());
        }
        result.put("line", lineNames);
        //根据不同产线统计数据
        for (int i = 0; i < lineName.size(); i++){
            int total = 0;
            int complete = 0;
            List<Map<String, Object>> completeData = new ArrayList<>() ;
            int ng = 0;
            List<Map<String, Object>> ngData = new ArrayList<>() ;
            int itag = 0;
            List<Map<String, Object>> itagData = new ArrayList<>() ;
            List<RangeFromTo> rangeFromTos = new ArrayList<>();
            //统计不同产线的总量
            for (int a= 0; a < list.size(); a++){
                if (list.get(a).get("line").toString().equals(lineName.get(i))){
                    total = total + (Integer) list.get(a).get("times");
                    boolean x = true;
                    for(int index = 0; index < rangeFromTos.size();index++) {
                        //同一时间段的统一计算 计算次数
                        if (list.get(a).get("range_from").toString().equals(rangeFromTos.get(index).getRangeFrom())
                                && list.get(a).get("range_to").toString().equals(rangeFromTos.get(index).getRangeTo())) {
                            rangeFromTos.get(index).getCodeList().add(list.get(a).get("code").toString());
                            rangeFromTos.get(index).setCnum(rangeFromTos.get(index).getCnum()+(Integer)list.get(a).get("times"));
                            x = false;
                        }
                    }
                    //不同的时间段则放入新的list 计算次数
                    if (x){
                        RangeFromTo rangeFromTo = new RangeFromTo();
                        rangeFromTo.setRangeFrom(list.get(a).get("range_from").toString());
                        rangeFromTo.setRangeTo(list.get(a).get("range_to").toString());
                        List<String> codeList = new ArrayList<>();
                        codeList.add(list.get(a).get("code").toString());
                        rangeFromTo.setCodeList(codeList);
                        rangeFromTo.setCnum((Integer) list.get(a).get("times"));
                        rangeFromTos.add(rangeFromTo);
                    }
                }
            }

            //统计不同产线点检已完成的数量及其数据
            for (int b= 0; b < taskComplete.size(); b++){
                if (taskComplete.get(b).get("line_sn").toString().equals(lineName.get(i))){
                    complete++;
                    completeData.add(taskComplete.get(b));
                }
                for (int index = 0; index < rangeFromTos.size();index++){
                    //如果已完成的点检里面包含当前时段和当前产线的工程，则当前时段和当前产线下已完成项目加1
                    if(rangeFromTos.get(index).getCodeList().contains(taskComplete.get(b).get("codedetail"))){
                        rangeFromTos.get(index).setRangCount(rangeFromTos.get(index).getRangCount() + 1);
                    }
                }
            }
            //统计不同产线点检NG的数量及其数据
            for(int c= 0; c < taskNg.size(); c++){
                if (taskNg.get(c).get("line_sn").toString().equals(lineName.get(i))){
                    ng++;
                    ngData.add(taskNg.get(c));
                }
            }
            //统计不同产线点检Itag产生的数量
            for(int d= 0; d < taskItag.size(); d++){
                if (taskItag.get(d).get("line_sn").toString().equals(lineName.get(i))){
                    itag++;
                    itagData.add(taskItag.get(d));
                }
            }
            result.put(lineName.get(i) +"total", total);
            result.put(lineName.get(i) + "complete", complete);
            result.put(lineName.get(i) +"completeData", completeData);
            result.put(lineName.get(i) +"ng", ng);
            result.put(lineName.get(i) +"ngData", ngData);
            result.put(lineName.get(i) +"itag",itag);
            result.put(lineName.get(i) +"itagData", itagData);
            result.put(lineName.get(i) +"times", rangeFromTos);
        }
        return result;
    }


    //某个产线一周或者一个月的点检任务总数已经OK NG 和itag数量
    @RequestMapping(value = "ajax/selectWeekTask", method = RequestMethod.POST)
    @ResponseBody
    public Map<String,Object> selectWeekTask(@RequestBody LineSearchTo line){
        Map<String, Object> result = Maps.newHashMap();
        TaskProcessInfoSearchTo task = new TaskProcessInfoSearchTo();
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.DAY_OF_MONTH, -6);
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        task.setStartTime(sdf.format(cal.getTime()));
        task.setEndTime(sdf.format(new Date()));
        task.setLine(line.getLine());
        //已完成的点检任务
        task.setComplete("1");
        Integer taskWeekComplete = taskAllocationService.selectWeekTaskProcessInfo(task);
        result.put("complete",taskWeekComplete);
        //已完成的点检任务中NG的数据
        task.setOk("1");
        Integer taskWeekNg = taskAllocationService.selectWeekTaskProcessInfo(task);
        result.put("ng",taskWeekNg);
        //所有产线itag
        TaskProcessInfoSearchTo task2 = new TaskProcessInfoSearchTo();
        task2.setLine(line.getLine());
        task2.setStartTime(sdf.format(cal.getTime()));
        task2.setEndTime(sdf.format(new Date()));
        task2.setItagId("1");
        Integer taskWeekItag = taskAllocationService.selectWeekTaskProcessInfo(task2);
        result.put("itag",taskWeekItag);
        List<Map<String,Object>> weekNg = taskAllocationService.selectWeekNg(task);
        result.put("weekNg",weekNg);
        List<Map<String,Object>> weekItag = taskAllocationService.selectWeekItag(task);
        result.put("weekItag",weekItag);
        TaskProcessInfoSearchTo task3 = new TaskProcessInfoSearchTo();
        task3.setLine(line.getLine());
        List<Map<String,Object>> completeByCategoryId = taskAllocationService.selectCompleteByCategoryId(task3);
        result.put("completeByCategoryId",completeByCategoryId);
        return result;
    }
}
