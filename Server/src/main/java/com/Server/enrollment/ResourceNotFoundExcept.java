package com.Server.enrollment;

public class ResourceNotFoundExcept extends RuntimeException{
    public ResourceNotFoundExcept(String message){
        super(message);
    }
}
