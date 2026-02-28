package com.urlshortener.service.impl;

import com.urlshortener.dto.CreateUtmTemplateRequest;
import com.urlshortener.dto.UpdateUtmTemplateRequest;
import com.urlshortener.dto.UtmTemplateDto;
import com.urlshortener.model.UtmTemplate;
import com.urlshortener.repository.UtmTemplateRepository;
import com.urlshortener.service.UtmTemplateService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UtmTemplateServiceImpl implements UtmTemplateService {

  private final UtmTemplateRepository utmTemplateRepository;

  public UtmTemplateServiceImpl(UtmTemplateRepository utmTemplateRepository) {
    this.utmTemplateRepository = utmTemplateRepository;
  }

  @Override
  @CacheEvict(value = "utmTemplates", key = "#teamId")
  public UtmTemplateDto createTemplate(String teamId, String userId, CreateUtmTemplateRequest request) {
    if (utmTemplateRepository.existsByTeamIdAndNameIgnoreCase(teamId, request.getName())) {
      throw new IllegalArgumentException("A template with this name already exists in your workspace.");
    }

    UtmTemplate template = new UtmTemplate(teamId, userId, request.getName());
    template.setUtmSource(request.getUtmSource());
    template.setUtmMedium(request.getUtmMedium());
    template.setUtmCampaign(request.getUtmCampaign());
    template.setUtmTerm(request.getUtmTerm());
    template.setUtmContent(request.getUtmContent());
    template.setReferral(request.getReferral());

    template = utmTemplateRepository.save(template);
    return mapToDto(template);
  }

  @Override
  @Cacheable(value = "utmTemplates", key = "#teamId")
  public List<UtmTemplateDto> getTemplatesByTeam(String teamId) {
    return utmTemplateRepository.findByTeamId(teamId).stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  @Override
  @CacheEvict(value = "utmTemplates", key = "#teamId")
  public UtmTemplateDto updateTemplate(String teamId, String templateId, String userId,
      UpdateUtmTemplateRequest request) {
    UtmTemplate template = utmTemplateRepository.findByTeamIdAndId(teamId, templateId)
        .orElseThrow(() -> new IllegalArgumentException("Template not found or does not belong to this team"));

    if (utmTemplateRepository.existsByTeamIdAndNameIgnoreCaseAndIdNot(teamId, request.getName(), templateId)) {
      throw new IllegalArgumentException("Another template with this name already exists in your workspace.");
    }

    template.setName(request.getName());
    template.setUtmSource(request.getUtmSource());
    template.setUtmMedium(request.getUtmMedium());
    template.setUtmCampaign(request.getUtmCampaign());
    template.setUtmTerm(request.getUtmTerm());
    template.setUtmContent(request.getUtmContent());
    template.setReferral(request.getReferral());
    template.setUpdatedAt(LocalDateTime.now());

    template = utmTemplateRepository.save(template);
    return mapToDto(template);
  }

  @Override
  @CacheEvict(value = "utmTemplates", key = "#teamId")
  public void deleteTemplate(String teamId, String templateId, String userId) {
    UtmTemplate template = utmTemplateRepository.findByTeamIdAndId(teamId, templateId)
        .orElseThrow(() -> new IllegalArgumentException("Template not found or does not belong to this team"));

    utmTemplateRepository.delete(template);
  }

  private UtmTemplateDto mapToDto(UtmTemplate template) {
    UtmTemplateDto dto = new UtmTemplateDto();
    dto.setId(template.getId());
    dto.setName(template.getName());
    dto.setUtmSource(template.getUtmSource());
    dto.setUtmMedium(template.getUtmMedium());
    dto.setUtmCampaign(template.getUtmCampaign());
    dto.setUtmTerm(template.getUtmTerm());
    dto.setUtmContent(template.getUtmContent());
    dto.setReferral(template.getReferral());
    dto.setCreatedBy(template.getCreatedBy());
    dto.setCreatedAt(template.getCreatedAt());
    dto.setUpdatedAt(template.getUpdatedAt());
    return dto;
  }
}
