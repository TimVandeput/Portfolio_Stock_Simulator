package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.MysteryPageDTO;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.mysteryPage;
import com.portfolio.demo_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class MysteryPageService {

    private final UserRepository userRepository;

    public MysteryPageService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public mysteryPage createOrUpdateMysteryPage(Long userId, String title) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        String content = fetchWikipediaExtract(title);

        mysteryPage page = user.getMysteryPage();
        if (page == null) {
            page = new mysteryPage();
            page.setUser(user);
        }
        page.setTitle(title);
        page.setContent(content);

        user.setMysteryPage(page);
        userRepository.save(user);
        return page;
    }

    @Transactional
    public MysteryPageDTO createOrUpdateMysteryPageDto(Long userId, String title) {
        mysteryPage page = createOrUpdateMysteryPage(userId, title);
        MysteryPageDTO out = new MysteryPageDTO();
        out.setTitle(page.getTitle());
        out.setContent(page.getContent());
        return out;
    }

    private String fetchWikipediaExtract(String title) {
        try {
            org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();

            String[] variants = new String[] { title, title.replace(' ', '_') };
            String candidate = null;
            for (String v : variants) {
                String encoded = java.net.URLEncoder.encode(v, java.nio.charset.StandardCharsets.UTF_8);
                String url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + encoded;
                try {
                    Map<?, ?> resp = rt.getForObject(url, Map.class);
                    if (resp != null) {
                        Object extract = resp.get("extract");
                        if (extract instanceof String && !((String) extract).isBlank()) {
                            String s = (String) extract;
                            if (s.length() > 200) {
                                return s;
                            }
                            if (candidate == null)
                                candidate = s;
                        }
                    }
                } catch (Exception ignored) {
                }
            }

            try {
                String encodedSpace = java.net.URLEncoder.encode(title, java.nio.charset.StandardCharsets.UTF_8);
                String mwUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&format=json&exchars=2000&titles="
                        + encodedSpace;
                Map<?, ?> mwResp = rt.getForObject(mwUrl, Map.class);
                if (mwResp != null) {
                    Object query = mwResp.get("query");
                    if (query instanceof Map) {
                        Map<?, ?> queryMap = (Map<?, ?>) query;
                        Object pages = queryMap.get("pages");
                        if (pages instanceof Map) {
                            Map<?, ?> pagesMap = (Map<?, ?>) pages;
                            for (Object pageObj : pagesMap.values()) {
                                if (pageObj instanceof Map) {
                                    Object extract = ((Map<?, ?>) pageObj).get("extract");
                                    if (extract instanceof String && !((String) extract).isBlank()) {
                                        return (String) extract;
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (Exception ignored) {
            }

            if (candidate != null && !candidate.isBlank())
                return candidate;
        } catch (Exception e) {
        }
        return "No summary available for '" + title + "'.";
    }
}
