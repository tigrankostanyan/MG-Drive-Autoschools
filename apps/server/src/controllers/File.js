const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
module.exports = class File {
  constructor(model, file, options = {}) {
    this.data = {};
    this.data.model = model;
    this.data.file = file;
    this.data.options = options;
    this.status = "error";
    this.message = {};
    this._setTableData();
  }
  async add(name_used) {
    this.table.name_used = name_used;
    const allowed = await this._checkAllowed();
    if (allowed.status == "error") {
      this.message = allowed.messages;
      return this._result();
    }
    if (allowed.media.name == "image") {
      this.data.file.watermark = allowed.limits.watermark || false;
      if (allowed.limits.dimensions) {
        const { width, height } = this.data.file.metadata;
        const dimensions = allowed.limits.dimensions;
        if (dimensions.large) {
          const resizeSaveLarge = await this._saveImage(
            width,
            height,
            dimensions,
            "large",
          );
          if (!resizeSaveLarge) return this._result();
        }
        if (dimensions.small) {
          const resizeSaveSmall = await this._saveImage(
            width,
            height,
            dimensions,
            "small",
          );
          if (!resizeSaveSmall) return this._result();
        }
      }
      else {
        const saveImage = await this._saveImage();
        if (!saveImage) return this._result();
      }
    }
    else {
      const saveFile = await this._saveFile();
      if (!saveFile) return this._result();
    }
    this.status = "success";
    return this._result();
  }
  async replace(name_used) {
    if (!this.data.model.files) {
      this.message.files = `In "${this.table.table_name}" model "files" are not included.`;
      return this._result();
    }
    const oldFile = this.data.model.files.find((f) => f.name_used == name_used);
    if (oldFile) {
      const deleted = await this._deleteImageFiles(oldFile);
      if (!deleted) {
        this.message = {
          error: "Failed to delete old image files.",
        };
        return this._result();
      }
      await oldFile.destroy();
      const index = this.data.model.files.indexOf(oldFile);
      this.data.model.files.splice(index, 1);
    }
    return await this.add(name_used);
  }
  async _deleteImageFiles(fileData) {
    const imageSizes = ["small", "large"];
    const baseFilePath = "./public/images";
    try {
      // Validate fileData to prevent path traversal
      if (!fileData || !fileData.name || !fileData.ext) {
        console.error("Invalid fileData provided");
        return false;
      }
      // Sanitize filename (remove any path components)
      const safeName = fileData.name.replace(/[^a-zA-Z0-9_-]/g, "");
      const safeExt = fileData.ext.replace(/[^a-zA-Z0-9.]/g, "");
      for (const size of imageSizes) {
        if (!["small", "large"].includes(size)) continue;
        const filePath = path.join(
          baseFilePath,
          this.table.table_name,
          size,
          `${safeName}${safeExt}`,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return true;
    } catch (err) {
      console.error("Error deleting image files:", err);
      return false;
    }
  }
  // Whitelist of allowed table names (prevent path traversal)
  _allowedTables = ["questions", "users", "gallery"];
  _allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".pdf",
    ".zip",
  ];
  _setTableData() {
    this.table = {};
    const rawTableName = this.data.model.constructor.name;
    if (!this._allowedTables.includes(rawTableName)) {
      throw new Error(`Invalid table name: ${rawTableName}`);
    }
    this.table.table_name = rawTableName;
    this.table.row_id = this.data.model.id;
    this.table.name_original = this.data.file.name;
    // Use SHA256 instead of deprecated SHA1
    this.table.name = crypto
      .createHash("sha256")
      .update(`${this.table.name_original}-${Date.now()}-${Math.random()}`)
      .digest("hex");
    this.table.type = this.data.file.mimetype;
    this.table.col_name = this.data.options.col_name || null;
    this.table.title = this.data.options.title || null;
    const rawExt = this.data.file.name
      .slice(this.data.file.name.lastIndexOf("."))
      .toLowerCase();
    if (!this._allowedExtensions.includes(rawExt)) {
      const mimeToExt = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/webp": ".webp",
        "application/pdf": ".pdf",
        "application/zip": ".zip",
      };
      this.table.ext = mimeToExt[this.table.type] || ".bin";
    } else {
      this.table.ext = rawExt;
    }
    this.table.sizes = [this.data.file.size];
  }
  async _checkAllowed() {
    const allowed = {};
    const media = this.data.file.mimetype.split("/")[0];
    const type = this.table.type.split("/")[1];
    const size = this.data.file.size;
    const count = this.data.model.files.filter(
      (f) => f.name_used == this.table.name_used,
    ).length;
    allowed.limits = this._getAllowedLimits(
      this.table.table_name,
      this.table.name_used,
    );
    allowed.media = this._getAllowedMedia(media);
    allowed.status = "error";
    allowed.messages = {};
    if (!allowed.media) {
      allowed.messages.media = `The "${this.data.file.mimetype}" media type is not allowed.`;
    } else {
      if (allowed.media.size < size) {
        allowed.messages.size = `The size (${size} bytes) is too large, limit is ${allowed.media.size} bytes.`;
      }
    }
    if (allowed.limits.status != "success") {
      if (allowed.limits.reason == "table") {
        allowed.messages.table = `Table "${this.table.table_name}" not found.`;
      }
      if (allowed.limits.reason == "name") {
        allowed.messages.name = `Name "${this.table.name_used}" for table "${this.table.table_name}" not found.`;
      }
    } else {
      if (allowed.limits.count <= count) {
        allowed.messages.count = `Count limit for "${
          this.table.name_used
        }" in "${this.table.table_name}" table is "${allowed.limits.count}" ${
          allowed.limits.count > 1 ? "files" : "file"
        }.`;
      }
      if (media != "image") {
        if (!allowed.limits.types.includes(type)) {
          allowed.messages.type = `The type "${type}" is not allowed. Allowed types are "${allowed.limits.types.toString()}".`;
        }
      }
      else {
        await this._setMetadata();
        this.table.ext = this.data.file.metadata.format;
        this.table.sizes = {};
        if (!allowed.limits.types.includes(this.table.ext)) {
          allowed.messages.format = `For "${
            this.table.name_used
          }" is not allowed "${
            this.table.ext
          }" format. Allowed only "${allowed.limits.types.join(", ")}" ${
            allowed.limits.types.length > 1 ? "formats" : "format"
          }.`;
        }
      }
    }
    if (!Object.keys(allowed.messages).length) {
      allowed.status = "success";
      delete allowed.messages;
    }
    return allowed;
  }
  _getAllowedLimits(table, name) {
    const names = [
      {
        table: "questions",
        files: [
          {
            name: "question_img",
            count: 3,
            types: ["jpeg", "png", "gif", "webp"],
            dimensions: {
              large: [1080, 1080],
            },
          },
        ],
      },
      {
        table: "users",
        files: [
          {
            name: "user_img",
            count: 3,
            types: ["jpeg", "png", "gif", "webp"],
            dimensions: {
              large: [800, 800],
            },
          },
        ],
      },
      {
        table: "gallery",
        files: [
          {
            name: "gallery_img",
            count: 3,
            types: ["jpeg", "png", "gif", "webp"],
            dimensions: {
              large: [1080, 1080],
            },
          },
        ],
      },
    ];
    let tableData = names.find((n) => n.table == table);
    if (!tableData) {
      return {
        status: "error",
        reason: "table",
      };
    }
    let nameData = tableData.files.find((n) => n.name == name);
    if (!nameData) {
      return {
        status: "error",
        reason: "name",
      };
    }
    nameData.status = "success";
    return nameData;
  }
  _getAllowedMedia(media) {
    const mediaTypes = [
      {
        name: "image",
        types: ["jpeg", "png", "gif", "webp"],
        size: 10 * 1024 * 1024,
      },
    ];
    return mediaTypes.find((m) => m.name === media);
  }
  async _setMetadata() {
    const { format, width, height } = await sharp(
      this.data.file.data,
    ).metadata();
    this.data.file.metadata = {
      format,
      width,
      height,
    };
  }
  async _saveImage(width, height, dimensions, size) {
    let image = sharp(this.data.file.data);
    // dynamic target format for smaller files
    let targetFormat = ["jpeg", "png", "webp"].includes(this.table.ext)
      ? this.table.ext
      : "webp";
    let quality = targetFormat === "png" ? 90 : 82;
    const pathSize = size ? `/${size}` : "";
    const pathStart = `./public/images/${this.table.table_name}${pathSize}`;
    this.table.ext = targetFormat;
    const pathFile = `${this.table.name}.${this.table.ext}`;
    const fullPath = `${pathStart}/${pathFile}`;
    if (!fs.existsSync(pathStart))
      fs.mkdirSync(pathStart, {
        recursive: true,
      });
    if (width && height && dimensions) {
      if (width < dimensions[size][0]) {
        this.message.width = `Image width is ${width}, but must be >= ${dimensions[size][0]} (${size}: ${dimensions[size].join("x")})`;
      }
      if (height < dimensions[size][1]) {
        this.message.height = `Image height is ${height}, but must be >= ${dimensions[size][1]} (${size}: ${dimensions[size].join("x")})`;
      }
      // Fail here; the messages above are the caller-facing validation errors.
      if (this.message.width || this.message.height) return false;
      image = image.resize(dimensions[size][0], dimensions[size][1], {
        fit: "inside",
      });
    } else {
      image = image.resize(800, 800, { fit: "inside" });
    }
    if (this.data.file.watermark) this._addWatermark(image);
    try {
      const imageNew = await image
        .toFormat(targetFormat, { quality })
        .toFile(fullPath);
      if (width && height && dimensions) {
        this.table.sizes[size] = {
          size: imageNew.size,
          width: imageNew.width,
          height: imageNew.height,
        };
      } else {
        this.table.sizes = {
          size: imageNew.size,
          width: imageNew.width,
          height: imageNew.height,
        };
      }
      return {
        status: "success",
      };
    } catch (err) {
      // Delete the file when the save fails.
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      this.message.file = "Image not saved... ⚠️";
      this.message.err = err;
      return false;
    }
  }
  async _saveFile() {
    let pathStart = `./public/files`;
    const pathFile = `${this.table.name}${this.table.ext}`;
    if (this.table.name_used === "summernote") {
      pathStart = `./public/files/summernote`;
    }
    if (!fs.existsSync(pathStart)) {
      fs.mkdirSync(pathStart, {
        recursive: true,
      });
    }
    try {
      await this.data.file.mv(`${pathStart}/${pathFile}`);
      return {
        status: "success",
      };
    } catch (err) {
      this.message.file = "File not saved";
      this.message.err = err;
      return {
        status: "error",
        error: err,
      };
    }
  }
  _addWatermark(image) {
    if (image.options.width >= 600 && image.options.height >= 600) {
      let pathWatermrk = "./public/images/watermark_xl.png",
        offsetX = image.options.width - 161 - 15,
        offsetY = image.options.height - 161 - 15;
      image.composite([
        {
          input: pathWatermrk,
          left: offsetX,
          top: offsetY,
        },
      ]);
    }
  }
  _result() {
    delete this.data;
    this.status == "error" ? delete this.table : delete this.message;
    return this;
  }
};
