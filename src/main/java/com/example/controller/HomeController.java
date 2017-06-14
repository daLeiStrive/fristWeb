package com.example.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.multipart.support.DefaultMultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @author Chingyu Mo
 * @create 2016-07-23-20:20
 */
// 注解标注此类为springmvc的controller，url映射为"/home"
@Controller
@RequestMapping("/home/*")
public class HomeController {
    //添加一个日志器
    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    //映射一个action
    @RequestMapping("one.do")
    public  String index(HttpServletRequest reques){
//        ,HttpServletResponse response
        //输出日志文件
        logger.info("the first jsp pages");
        //返回一个index.jsp这个视图
        return "index";
    }
    @ResponseBody//返回json
    @RequestMapping("two.do")
    public Map testLogin2(HttpServletRequest request){
        // request和response不必非要出现在方法中，如果用不上的话可以去掉
        // 参数的名称是与页面控件的name相匹配，参数类型会自动被转换
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        Map<String,Object> testMap = new HashMap<>();
        testMap.put("name","小唐");
        testMap.put("age","小wang");

        /*Map resultMap = new HashMap();
        ModelAndView mav = new ModelAndView("/bids/bids");
        resultMap.put("modelAndView", mav);*/
        return testMap;  // 采用重定向方式跳转页面
        // 重定向还有一种简单写法
        // return new ModelAndView("redirect:../index.jsp");
    }
    @ResponseBody//返回json
    @RequestMapping("fileUpload.do")
    public Map fileUpload(HttpServletRequest request) {
//创建一个通用的多部分解析器.
        CommonsMultipartResolver commonsMultipartResolver = new
                CommonsMultipartResolver(request.getSession().getServletContext());
        request.getParameter("file_data");
        //设置编码
        commonsMultipartResolver.setDefaultEncoding("utf-8");
        //判断 request 是否有文件上传,即多部分请求...
        if (commonsMultipartResolver.isMultipart(request))
        {
            //转换成多部分request
            MultipartHttpServletRequest multipartRequest =(MultipartHttpServletRequest) request;
            // 获得上传的文件（根据前台的name名称得到上传的文件）
            MultiValueMap<String, MultipartFile> multiValueMap = multipartRequest.getMultiFileMap();
            // file 是指 文件上传标签的 name=值
            List<MultipartFile> file = multiValueMap.get("exampleInputFile");
            // 判断文件是否为空
            if (!file.isEmpty()) {
                try {
                    for(int i = 0; i < file.size(); i++){
                        MultipartFile f = file.get(i);
                        // 文件保存路径
                        String filePath = "D:\\myFristWeb\\src\\main\\webapp\\fileUpload\\temp\\"
                                + f.getOriginalFilename();
                        f.transferTo(new File(filePath));
                    }
                    // 转存文件
//                    file.transferTo(imageFile);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }

        // 重定向
        return new HashMap<>();
    }

}
