package com.Server.uploadFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@AllArgsConstructor
@RequestMapping("/api/v1/auth/upload")
public class fileUploadController {

    private fileUploadImpl FileUploadService;

    @PostMapping("/file")
    @Operation(summary = "Upload a file", description = "Uploads an image file and returns the file details")
    @ApiResponse(responseCode = "200", description = "File uploaded successfully")
    @ApiResponse(responseCode = "400", description = "Invalid file data")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<ReponsiveFile> uploadFile(@RequestParam("image") MultipartFile multipartFile) throws IOException {
        try {
            ReponsiveFile uploadResponse = FileUploadService.uploadFile(multipartFile);
            ReponsiveFile response = ReponsiveFile.builder()
                    .url(uploadResponse.getUrl())
                    .public_id(uploadResponse.getPublic_id())
                    .build();
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/file")
    @Operation(summary = "Delete a file", description = "Deletes a file using its public ID")
    @ApiResponse(responseCode = "200", description = "File deleted successfully")
    @ApiResponse(responseCode = "404", description = "File not found")
    @ApiResponse(responseCode = "500", description = "Internal server error")
    public ResponseEntity<Map<String, Object>> deleteFile(@RequestParam("public_id") String publicId) {
        try {
            Map<String, Object> result = FileUploadService.deleteFile(publicId);
            return ResponseEntity.ok(result);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
