import express from "express";
// @ts-ignore
import IPFS from "ipfs-api";
const ipfs = IPFS("ipfs.infura.io", "5001", { protocol: "https" });
import { bluzelle, API } from "bluzelle";
// import { logger } from "../utils";
import dotenv from "dotenv";

dotenv.config();

class Controller {
  bz: API;

  constructor() {
    this.initBlz();
  }

  async initBlz() {
    try {
      this.bz = await bluzelle({
        mnemonic:
          "celery celery swamp outside measure convince another surprise daring glue smoke web silver hazard divert absent december wife usage eight inquiry diesel order that",
        endpoint: "http://client.sentry.testnet.public.bluzelle.com/",
        chain_id: "bluzelleTestPublic-1",
        uuid: "InstaNotaryv0.0.3",
      });
    } catch (err) {
      console.error(err, { origin: "Error from Bluzelle SDK Init" });
    }
  }

  parseFileUpload = async (
    file: any,
    fileDetails: any,
    res: express.Response
  ) => {
    // getting the buffer from the file
    const picBuffer = Buffer.from(file.buffer);
    // storing the file in IPFS
    ipfs.files.add(picBuffer, async (err: any, data: any) => {
      if (err) {
        console.error(err, { origin: "Error from IPFS" });
        res.json({ message: "Error uploading file in IPFS" });
      }
      const randomID = (Math.random() * 1e32).toString(36).substring(0, 10);
      console.log(data);
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
          const notaryItems = await this.bz.read(fileData.phoneNumber);
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
          console.error(err, {
            origin: `Error due to no file present in bluzelle DB with key ${fileData.phoneNumber}`,
          });
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
        console.debug("Done adding");
        res.json({
          message: "Successfully uploaded file to bluzelle",
        });
      } catch (err) {
        console.error(err, {
          origin: `Error due to failing in creating or updating notary file`,
          data: fileData,
        });
        res.json({
          message: "Error in uploaded file to bluzelle",
        });
      }
    });
  };

  parseTextUpload = async (notaryText: any, res: express.Response) => {
    // getting the buffer from the file and storing the text in IPFS
    ipfs.files.add(
      [new Buffer(notaryText.textContent)],
      async (err: any, data: any) => {
        if (err) {
          console.error(err, { origin: "Error from IPFS" });
          res.json({ message: "Error uploading file in IPFS" });
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
            const notaryItems = await this.bz.read(fileData.phoneNumber);
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
            console.error(err, {
              origin: `Error due to no file present in bluzelle DB with key ${fileData.phoneNumber}`,
            });
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
          console.error(err, {
            origin: `Error due to failing in creating or updating notary file`,
            data: fileData,
          });
          res.json({
            message: "Error in uploaded file to bluzelle",
          });
        }
      }
    );
  };

  getNotaryFilesByPhoneNumber = async (
    phoneNumber: string,
    res: express.Response
  ) => {
    try {
      // fetching all notary item of user
      const notaryItems = await this.bz.read(phoneNumber);
      const parsedNotaryItems = JSON.parse(notaryItems);
      // fetching all notary items details
      const selectedNotaries = await Promise.all(
        parsedNotaryItems.map((notaryItem: any) => {
          return this.bz.read(notaryItem.id);
        })
      );
      const selectedNotariesParsed = selectedNotaries.map((notaryItem: any) =>
        JSON.parse(notaryItem)
      );
      res.json({
        message: "Get All Notary Items",
        notaries: selectedNotariesParsed,
      });
    } catch (err) {
      console.error(err, { origin: "Error in getting notary from bluzelle" });
      res.json({
        message: "Error in getting notary from bluzelle",
      });
    }
  };

  deleteNotaryFiles = async (
    phoneNumber: string,
    id: string,
    res: express.Response
  ) => {
    try {
      // fetching all notary item of user
      const notaryItems = await this.bz.read(phoneNumber);
      const parsedNotaryItems = JSON.parse(notaryItems);
      // deleting from the list
      const selectedNotary = parsedNotaryItems.filter(
        (notary: any) => notary.id !== id
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
      console.error(err, { origin: "Error in deleting file to bluzelle" });
      res.json({
        message: "Error in deleting file to bluzelle",
      });
    }
  };

  getAppConfigs = async (res: express.Response) => {
    res.json({
      firebaseConfig: {
        apiKey: process.env.FIREBASE_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      },
    });
  };
}
export default new Controller();
