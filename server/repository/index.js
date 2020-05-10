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
        uuid: "MyNotaryAppv1.0.0",
      });
    } catch (err) {
      console.error(err);
    }
  }
  async parseFileUpload(file, fileDetails, res) {
    console.log(file);
    // var uploadedFile = fs.readFileSync(file.path);
    // console.log(uploadedFile);
    var picBuffer = Buffer.from(file.buffer);
    console.log(picBuffer);
    ipfs.files.add(picBuffer, async (err, data) => {
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
      const fileData = {
        ...fileDetails,
        hash: data[0].hash,
      };
      console.log(fileData);
      try {
        let addNotaryItem = [];
        try {
          const notaryItems = await this.bz.read("notaryItems", {
            gas_price: 10,
          });
          console.log("Notary items", notaryItems);
          addNotaryItem = [...JSON.parse(notaryItems), fileData];
          console.log("Uploaded Notary Item", addNotaryItem);
          await this.bz.update("notaryItems", JSON.stringify(addNotaryItem), {
            gas_price: 10,
          });
        } catch (err) {
          console.log(err);
          addNotaryItem = [fileData];
          console.log("Uploaded Notary Item", addNotaryItem);
          await this.bz.create("notaryItems", JSON.stringify(addNotaryItem), {
            gas_price: 10,
          });
        }
        res.json({
          message: "Successfully uploaded file to bluzelle",
        });
      } catch (err) {
        console.log(err);
        res.json({
          message: "Error in uploaded file to bluzelle",
        });
      }
    });
  }

  async getAllFiles(res) {
    try {
      const notaryItems = await this.bz.read("notaryItems", {
        gas_price: 10,
      });
      console.log("Notary items", notaryItems);
      res.json({
        message: "Get All Notary Items",
        notaries: JSON.parse(notaryItems),
      });
    } catch (err) {
      console.log(err);
      res.json({
        message: "Error in getting all notary from bluzelle",
      });
    }
  }

  async getNotaryFilesByPhoneNumber(phoneNumber, res) {
    try {
      const notaryItems = await this.bz.read("notaryItems", {
        gas_price: 10,
      });
      const parsedNotaryItems = JSON.parse(notaryItems);
      const selectedNotaries = parsedNotaryItems.filter((notary) => {
        console.log(
          notary.phoneNumber,
          phoneNumber,
          notary.phoneNumber === phoneNumber
        );
        return notary.phoneNumber === phoneNumber;
      });
      console.log("Notary items", selectedNotaries);
      res.json({
        message: "Get All Notary Items",
        notaries: selectedNotaries,
      });
    } catch (err) {
      console.log(err);
      res.json({
        message: "Error in getting notary from bluzelle",
      });
    }
  }

  async getNotaryFilesByHash(hash, res) {
    try {
      const notaryItems = await this.bz.read("notaryItems", {
        gas_price: 10,
      });
      const parsedNotaryItems = JSON.parse(notaryItems);
      const selectedNotary = parsedNotaryItems.filter(
        (notary) => notary.hash === hash
      )[0];
      console.log("Notary items", selectedNotary);
      res.json({
        message: "Get All Notary Items",
        notaries: selectedNotary,
      });
    } catch (err) {
      console.log(err);
      res.json({
        message: "Error in getting notary from bluzelle",
      });
    }
  }

  async deleteNotaryFilesByHash(hash, res) {
    try {
      const notaryItems = await this.bz.read("notaryItems", {
        gas_price: 10,
      });
      const parsedNotaryItems = JSON.parse(notaryItems);
      const selectedNotary = parsedNotaryItems.filter(
        (notary) => notary.hash !== hash
      );
      console.log("Notary items", selectedNotary);
      await this.bz.update("notaryItems", JSON.stringify(selectedNotary), {
        gas_price: 10,
      });
      res.json({
        message: "Deleted Notary",
      });
    } catch (err) {
      console.log(err);
      res.json({
        message: "Error in deleting file to bluzelle",
      });
    }
  }
}
module.exports = new Repository();
