import path from "node:path";
import fs from "node:fs";

export class DeleteDirectoryPlugin {
  constructor(options = {}) {
    this.directories = Array.isArray(options.directories)
      ? options.directories
      : [options.directory || options.directories].filter(Boolean);
    this.verbose = options.verbose || false;
    this.dry = options.dry || false;
  }

  apply(compiler) {
    const pluginName = "DeleteDirectoryPlugin";

    compiler.hooks.beforeRun.tapAsync(pluginName, (compiler, callback) => {
      this.deleteDirectories(callback);
    });

    compiler.hooks.watchRun.tapAsync(pluginName, (compiler, callback) => {
      this.deleteDirectories(callback);
    });
  }

  deleteDirectories(callback) {
    const promises = this.directories.map((dir) => this.deleteDirectory(dir));

    Promise.all(promises)
      .then(() => callback())
      .catch((err) => callback(err));
  }

  deleteDirectory(directory) {
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(directory);

      if (this.verbose) {
        console.log(
          `[DeleteDirectoryPlugin] ${this.dry ? "Would delete" : "Deleting"}: ${fullPath}`,
        );
      }

      if (this.dry) {
        return resolve();
      }

      // Check if directory exists
      fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
          // Directory doesn't exist, nothing to delete
          if (this.verbose) {
            console.log(
              `[DeleteDirectoryPlugin] Directory does not exist: ${fullPath}`,
            );
          }
          return resolve();
        }

        // Delete directory recursively
        fs.rm(fullPath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(
              `[DeleteDirectoryPlugin] Failed to delete ${fullPath}:`,
              err,
            );
            return reject(err);
          }

          if (this.verbose) {
            console.log(
              `[DeleteDirectoryPlugin] Successfully deleted: ${fullPath}`,
            );
          }
          resolve();
        });
      });
    });
  }
}
