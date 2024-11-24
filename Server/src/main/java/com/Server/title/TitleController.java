package com.Server.title;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class TitleController {

    @Autowired
    private TitleService titleService;

    @GetMapping("/auth/titles/{id}")
    public ResponseEntity<TitleDTO> getTitleById(@PathVariable Long id) {
        TitleDTO title = titleService.getTitleById(id);
        return ResponseEntity.ok(title);
    }

    @GetMapping("/auth/titles/getByCourseId/{id}")
    public ResponseEntity<List<TitleDTO>> getTitleByCourseId(@PathVariable Long id) {
        List<TitleDTO> listTitle = titleService.getTitleByCourseId(id);
        // Kiểm tra xem dữ liệu có chứa lessons và quiz không
        System.out.println("List title here: " + listTitle);
        listTitle.forEach(title -> {
            System.out.println("Title Data: "+ title );
        });
        return ResponseEntity.ok(listTitle);
    }
    @PostMapping("/titles/update")
    public ResponseEntity<Title> createTitle(@RequestBody Title title) {
        return ResponseEntity.status(HttpStatus.CREATED).body(title);
    }


}
