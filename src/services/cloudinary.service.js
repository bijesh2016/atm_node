const cloudinary = require("cloudinary").v2;
const { CloudinaryConfig } = require("../config/config");
const { deleteFile } = require("../utilities/helpers");

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: CloudinaryConfig.cloudName,
      api_key: CloudinaryConfig.apiKey,
      api_secret: CloudinaryConfig.api_secret,
    });
  }
  fileupload = async (filepath, dir = "/") => {
    try {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        filepath,
        {
          unique_filename: true,
          folder: "mern_project" + dir,
        }
      );

      const response = cloudinary.url(public_id, {
        transformation: [{ responsive: true, width: 1024, crop: "scale" }],
      });

      deleteFile(filepath);

      return {
        publicId: public_id, 
        url: secure_url, 
        thumbUrl: response, 
      };
    } catch (exception) {
      console.error(exception);
      throw {
        code: 500,
        message: "File upload error",
        status: "CLOUDINARY_ERR",
      };
    }
  };
}

module.exports = CloudinaryService;
