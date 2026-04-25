package com.medilink.backend.exception;

public class ConsentExpiredException extends RuntimeException {

    public ConsentExpiredException() {
        super("Consent has expired");
    }

    public ConsentExpiredException(String message) {
        super(message);
    }
}
