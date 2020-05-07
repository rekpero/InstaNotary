const fs = require("fs");
const IPFS = require("ipfs-api");
const ipfs = IPFS("ipfs.infura.io", "5001", { protocol: "https" });
const { bluzelle } = require("bluzelle");
class Repository {
  constructor() {
    this.initBlz();
  }
  async initBlz() {
    try {
      this.bz = await bluzelle({
        address: "bluzelle1htcd86l00dmkptdja75za0akg8mrt2w3qhd65v",
        mnemonic:
          "apology antique such ancient spend narrow twin banner coral book iron summer west extend toddler walnut left genius exchange globe satisfy shield case rose",
        endpoint: "http://testnet.public.bluzelle.com:1317",
        chain_id: "bluzelle",
        uuid: "MyNotaryApp" + Date.now().toString(),
      });
    } catch (err) {
      console.error(err);
    }
  }
  async parseFileUpload(file, res) {
    console.log(file);
    // var uploadedFile = fs.readFileSync(file.path);
    // console.log(uploadedFile);
    var picBuffer = Buffer.from(file.buffer);
    console.log(picBuffer);
    ipfs.files.add(picBuffer, (err, data) => {
      if (err) {
        console.error(err);
        res.json({ message: err.message });
      }
      this.bz.version().then(
        (version) => {
          console.log(version);
        },
        (error) => {
          console.error(error);
        }
      );
      console.log(data[0].hash);
      res.json({
        message: "Successfully uploaded file to ipfs",
        hash: data[0].hash,
      });
    });
  }

  async getIpfsFile(hash, res) {
    console.log("get ipfs", hash);
    ipfs.files.get(hash, (err, data) => {
      if (err) {
        console.error(err);
        res.json({ message: err.message });
      }
      console.log(data);
      console.log("ipfs", data[0].content);
      res.json({
        message: "Successfully found file from ipfs",
        data: data[0].content,
      });
    });
  }
}
module.exports = new Repository();
