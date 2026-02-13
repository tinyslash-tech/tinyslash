package com.urlshortener.service.impl;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.urlshortener.service.StorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.IOUtils;

import java.io.IOException;

@Service("gridFsStorageService")
@Primary
@ConditionalOnProperty(name = "FILE_STORAGE_TYPE", havingValue = "gridfs", matchIfMissing = true)
public class GridFsStorageService implements StorageService {

  private static final Logger logger = LoggerFactory.getLogger(GridFsStorageService.class);

  @Autowired
  private GridFsTemplate gridFsTemplate;

  @Override
  public String uploadFile(MultipartFile file, String path) throws IOException {
    org.bson.types.ObjectId fileId = gridFsTemplate.store(
        file.getInputStream(),
        path,
        file.getContentType());

    logger.info("Uploaded file to GridFS: {}", path);
    return fileId.toString();
  }

  @Override
  public void deleteFile(String path) {
    gridFsTemplate.delete(new Query(Criteria.where("filename").is(path)));
    logger.info("Deleted file from GridFS: {}", path);
  }

  @Override
  public byte[] downloadFile(String path) throws IOException {
    GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("filename").is(path)));

    if (gridFSFile == null) {
      throw new IOException("File not found in GridFS: " + path);
    }

    GridFsResource resource = gridFsTemplate.getResource(gridFSFile);
    return IOUtils.toByteArray(resource.getInputStream());
  }

  @Override
  public String getPublicUrl(String path) {
    // GridFS files are not directly public, served via controller
    return null;
  }
}
