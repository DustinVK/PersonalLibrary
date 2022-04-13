package edu.ferris.BookApp.service;

// import com.packt.cardatabase.domain.User;
// import com.packt.cardatabase.domain.UserRepository;
import edu.ferris.BookApp.domain.User;
import edu.ferris.BookApp.domain.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private UserRepository repository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.repository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> currentUser = repository.findByUsername(username);
        if (currentUser.isEmpty()) {
            throw new UsernameNotFoundException(username + "not found.");
        }
        UserDetails user = new org.springframework.security.core.userdetails.User(
                username,
                currentUser.get().getPassword(),
                true,
                true,
                true,
                true,
                AuthorityUtils.createAuthorityList(currentUser.get().getRole()));
        return user;
    }
}
