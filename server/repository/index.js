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
        address: "bluzelle1myff7jsku73rnwud4pc8n2txu65upxzencg784",
        mnemonic:
          "celery celery swamp outside measure convince another surprise daring glue smoke web silver hazard divert absent december wife usage eight inquiry diesel order that",
        endpoint: "http://dev.testnet.public.bluzelle.com:1317/",
        chain_id: "bluzelle",
        uuid: "MyNotaryAppv1.0.2",
      });
    } catch (err) {
      console.error(err);
    }
  }
  async parseFileUpload(file, fileDetails, res) {
    // getting the buffer from the file
    var picBuffer = Buffer.from(file.buffer);
    // storing the file in IPFS
    ipfs.files.add(picBuffer, async (err, data) => {
      if (err) {
        console.error(err);
        res.json({ message: err.message });
      }
      const randomID = (Math.random() * 1e32).toString(36).substring(0, 10);
      const fileData = {
        ...fileDetails,
        hash: data[0].hash,
        id: randomID,
      };
      try {
        let addNotaryItem = [];
        // creating a notary with a unique id
        await this.bz.create(randomID, JSON.stringify(fileData), {
          gas_price: 10,
          max_gas: 2000000,
        });
        try {
          // fetching previously stored notary list
          const notaryItems = await this.bz.read(fileData.phoneNumber, {
            gas_price: 10,
            max_gas: 2000000,
          });
          addNotaryItem = [...JSON.parse(notaryItems), { id: randomID }];
          // updating with the newly added notary item
          await this.bz.update(
            fileData.phoneNumber,
            JSON.stringify(addNotaryItem),
            {
              gas_price: 10,
              max_gas: 2000000,
            }
          );
        } catch (err) {
          console.log(err);
          // didn't found any notary items of the user
          addNotaryItem = [{ id: randomID }];
          // creating new notary item for the user
          await this.bz.create(
            fileData.phoneNumber,
            JSON.stringify(addNotaryItem),
            {
              gas_price: 10,
              max_gas: 2000000,
            }
          );
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

  async parseTextUpload(notaryText, res) {
    // getting the buffer from the file and storing the text in IPFS
    ipfs.files.add([new Buffer(notaryText.textContent)], async (err, data) => {
      if (err) {
        console.error(err);
        res.json({ message: err.message });
      }
      const randomID = (Math.random() * 1e32).toString(36).substring(0, 10);
      const fileData = {
        ...notaryText,
        hash: data[0].hash,
        id: randomID,
      };
      try {
        let addNotaryItem = [];
        // creating a notary with a unique id
        await this.bz.create(randomID, JSON.stringify(fileData), {
          gas_price: 10,
          max_gas: 2000000,
        });
        try {
          // fetching previously stored notary list
          const notaryItems = await this.bz.read(fileData.phoneNumber, {
            gas_price: 10,
            max_gas: 2000000,
          });
          addNotaryItem = [...JSON.parse(notaryItems), { id: randomID }];
          // updating with the newly added notary item
          await this.bz.update(
            fileData.phoneNumber,
            JSON.stringify(addNotaryItem),
            {
              gas_price: 10,
              max_gas: 2000000,
            }
          );
        } catch (err) {
          console.log(err);
          // didn't found any notary items of the user
          addNotaryItem = [{ id: randomID }];
          // creating new notary item for the user
          await this.bz.create(
            fileData.phoneNumber,
            JSON.stringify(addNotaryItem),
            {
              gas_price: 10,
              max_gas: 2000000,
            }
          );
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

  async getNotaryFilesByPhoneNumber(phoneNumber, res) {
    try {
      // fetching all notary item of user
      const notaryItems = await this.bz.read(phoneNumber, {
        gas_price: 10,
        max_gas: 2000000,
      });
      const parsedNotaryItems = JSON.parse(notaryItems);
      // fetching all notary items details
      let selectedNotaries = await Promise.all(
        parsedNotaryItems.map((notaryItem) => {
          return this.bz.read(notaryItem.id, {
            gas_price: 10,
            max_gas: 2000000,
          });
        })
      );
      selectedNotaries = selectedNotaries.map((notaryItem) =>
        JSON.parse(notaryItem)
      );
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

  async deleteNotaryFiles(phoneNumber, id, res) {
    try {
      // fetching all notary item of user
      const notaryItems = await this.bz.read(phoneNumber, {
        gas_price: 10,
        max_gas: 2000000,
      });
      const parsedNotaryItems = JSON.parse(notaryItems);
      // deleting from the list
      const selectedNotary = parsedNotaryItems.filter(
        (notary) => notary.id !== id
      );
      // deleting the notary item
      await this.bz.delete(id, { gas_price: 10, max_gas: 2000000 });
      // updating the notary list
      await this.bz.update(phoneNumber, JSON.stringify(selectedNotary), {
        gas_price: 10,
        max_gas: 2000000,
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
