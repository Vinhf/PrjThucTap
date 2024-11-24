package com.Server.uploadFile;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReponsiveFile {
    @JsonProperty("url")
    private String url;

    @JsonProperty("public_id")
    private String public_id;

}
