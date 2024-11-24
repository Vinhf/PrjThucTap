package com.Server.uploadFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class fileUploadService implements fileUploadImpl{
    private final Cloudinary cloudinary;
    @Override
    public ReponsiveFile uploadFile(MultipartFile multipartFile) throws IOException {
        String publicId = UUID.randomUUID().toString();
        Map uploadResult = cloudinary.uploader().upload(multipartFile.getBytes(),
                ObjectUtils.asMap("public_id", publicId));

        String url = uploadResult.get("url").toString();
        System.out.println(uploadResult);
        return new ReponsiveFile(url, publicId);
    }   

    public Map deleteFile(String publicId) throws IOException {
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
