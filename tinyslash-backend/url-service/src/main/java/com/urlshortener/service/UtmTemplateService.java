package com.urlshortener.service;

import com.urlshortener.dto.CreateUtmTemplateRequest;
import com.urlshortener.dto.UpdateUtmTemplateRequest;
import com.urlshortener.dto.UtmTemplateDto;
import java.util.List;

public interface UtmTemplateService {

  UtmTemplateDto createTemplate(String teamId, String userId, CreateUtmTemplateRequest request);

  List<UtmTemplateDto> getTemplatesByTeam(String teamId);

  UtmTemplateDto updateTemplate(String teamId, String templateId, String userId, UpdateUtmTemplateRequest request);

  void deleteTemplate(String teamId, String templateId, String userId);
}
