package edu.ferris.BookApp.domain;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class AccountCredentials {
    private String username;
    private String password;
    Collection<? extends GrantedAuthority> authorities;

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) { this.authorities = authorities; }

}