package com.Server.uploadFile;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface fileUploadImpl {
    ReponsiveFile uploadFile(MultipartFile multipartFile) throws IOException;
    Map deleteFile(String public_id) throws IOException;
}
