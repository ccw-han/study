package com.rextec.sssj.web.system;

import com.rextec.sssj.biz.system.impl.FileTransferService;
import com.rextec.sssj.dal.entity.filetransfer.MmFormFileTransfer;
import com.rextec.sssj.utils.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController()
@RequestMapping("r/fileTransfer")
public class FileTransferController {

    @Autowired
    private FileTransferService fileTransferService;

    /**
     * 上传文件
     *
     * @param file
     * @return
     */
    @PostMapping("upload")
    @ResponseBody
    public Map<String, Object> FileTransferUpload(HttpServletRequest request, @RequestParam MultipartFile file) {
        String id = request.getParameter("ticketPicId");// file DB id
        String path = request.getSession().getServletContext().getRealPath("/");
        String name = file.getOriginalFilename();// file DB name
        String today = DateUtil.formatDate(new Date(), "yyyyMMdd");
        String dbDir = "/upload/" + today + "/";
        String dbPath = "/upload/" + today + "/" + id + file.getOriginalFilename();// file DB path
        String newPath = path + dbPath;
        Map<String, Object> map = new HashMap<String, Object>();
        FileOutputStream fos= null;
        InputStream is = null;
        try {
            if (!new File(path + dbDir).exists()) {
                new File(path + dbDir).mkdirs();
            }
            fos = new FileOutputStream(new File(newPath));
            is = file.getInputStream();
            byte[] bts = new byte[1024];
            while (is.read(bts) != -1) {
                fos.write(bts);
            }
            MmFormFileTransfer mmFormFileTransfer = new MmFormFileTransfer();
            mmFormFileTransfer.setId(id);
            mmFormFileTransfer.setFileName(name);
            mmFormFileTransfer.setFilePath(dbPath);
            mmFormFileTransfer.setCreateId("");
            mmFormFileTransfer.setUpdateId("");
            map = fileTransferService.saveFileInfo(mmFormFileTransfer);
            return map;
        } catch (Exception e) {
            map.put("code", "0");
            map.put("message", "上传失败！");
            return map;
        } finally {
            try {
                is.close();
                fos.flush();
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @RequestMapping("view/{id}")
    @ResponseBody
    public void FileTransferView(@PathVariable("id") String id, HttpServletRequest request, HttpServletResponse response) {
        MmFormFileTransfer mmFormFileTransfer = fileTransferService.getFileInfo(id);
        if (mmFormFileTransfer == null) {
            return;
        }
        String path = request.getSession().getServletContext().getRealPath("/") + mmFormFileTransfer.getFilePath();
        File file = new File(path);
        if (!file.exists()){
            return;
        }
        FileInputStream fis = null;
        OutputStream os = null;
        try {
            fis = new FileInputStream(file);
            int limit = fis.available();
            byte[] bytes = new byte[limit];
            fis.read(bytes);
            response.setContentType("image/*");
            os = response.getOutputStream();
            os.write(bytes);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                fis.close();
                os.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
