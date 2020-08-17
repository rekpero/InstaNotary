"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const ipfs_api_1 = __importDefault(require("ipfs-api"));
const ipfs = ipfs_api_1.default("ipfs.infura.io", "5001", { protocol: "https" });
const bluzelle_1 = require("bluzelle");
// import { logger } from "../utils";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Controller {
    constructor() {
        this.parseFileUpload = (file, fileDetails, res) => __awaiter(this, void 0, void 0, function* () {
            // getting the buffer from the file
            const picBuffer = Buffer.from(file.buffer);
            // storing the file in IPFS
            ipfs.files.add(picBuffer, (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    // console.error(err, { origin: "Error from IPFS" });
                    res.json({ message: "Error uploading file in IPFS" });
                }
                const isFilePresent = yield this.checkHashPresent(fileDetails.phoneNumber, data[0].hash);
                // console.log(isFilePresent);
                if (isFilePresent.isPresent) {
                    res.json({
                        isFilePresent: true,
                        notaryId: isFilePresent.id,
                        message: "File is already present",
                    });
                }
                else {
                    const randomID = (Math.random() * 1e32).toString(36).substring(0, 10);
                    // console.log(data);
                    const fileData = Object.assign(Object.assign({}, fileDetails), { ipfsHash: data[0].hash, id: randomID });
                    try {
                        let addNotaryItem = [];
                        // creating a notary with a unique id
                        const txResult = yield this.bz.create(randomID, JSON.stringify(fileData), {
                            gas_price: 10,
                            max_gas: 2000000,
                        });
                        console.log(txResult);
                        try {
                            // fetching previously stored notary list
                            const notaryItems = yield this.bz.read(fileData.phoneNumber);
                            addNotaryItem = [
                                ...JSON.parse(notaryItems),
                                { id: randomID, txHash: txResult.txhash },
                            ];
                            // updating with the newly added notary item
                            yield this.bz.update(fileData.phoneNumber, JSON.stringify(addNotaryItem), {
                                gas_price: 10,
                                max_gas: 2000000,
                            });
                        }
                        catch (err) {
                            // console.error(err, {
                            //   origin: `Error due to no file present in bluzelle DB with key ${fileData.phoneNumber}`,
                            // });
                            // didn't found any notary items of the user
                            addNotaryItem = [{ id: randomID }];
                            // creating new notary item for the user
                            yield this.bz.create(fileData.phoneNumber, JSON.stringify(addNotaryItem), {
                                gas_price: 10,
                                max_gas: 2000000,
                            });
                        }
                        console.debug("Done adding");
                        res.json({
                            message: "Successfully uploaded file to bluzelle",
                        });
                    }
                    catch (err) {
                        // console.error(err, {
                        //   origin: `Error due to failing in creating or updating notary file`,
                        //   data: fileData,
                        // });
                        res.json({
                            message: "Error in uploaded file to bluzelle",
                        });
                    }
                }
            }));
        });
        this.parseFileUploadOverride = (id, fileDetails, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const notaryItem = yield this.bz.read(id);
                // console.log(notaryItem);
                const fileData = Object.assign(JSON.parse(notaryItem), Object.assign({}, fileDetails));
                // console.log(fileData);
                try {
                    // creating a notary with a unique id
                    yield this.bz.update(id, JSON.stringify(fileData), {
                        gas_price: 10,
                        max_gas: 2000000,
                    });
                    // console.debug("Done updating");
                    res.json({
                        message: "Successfully updated file to bluzelle",
                    });
                }
                catch (err) {
                    // console.error(err, {
                    //   origin: `Error due to failing in creating or updating notary file`,
                    //   data: fileData,
                    // });
                    res.json({
                        message: "Error in uploaded file to bluzelle",
                    });
                }
            }
            catch (err) {
                // console.error(err, { origin: "Error in getting notary from bluzelle" });
                res.json({
                    message: "Error in getting notary from bluzelle",
                });
            }
        });
        this.parseTextUpload = (notaryText, res) => __awaiter(this, void 0, void 0, function* () {
            // getting the buffer from the file and storing the text in IPFS
            ipfs.files.add([Buffer.from(notaryText.textContent)], (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.error(err);
                    res.json({ message: "Error uploading file in IPFS" });
                }
                const isFilePresent = yield this.checkHashPresent(notaryText.phoneNumber, data[0].hash);
                // console.log(isFilePresent);
                if (isFilePresent.isPresent) {
                    res.json({
                        isFilePresent: true,
                        notaryId: isFilePresent.id,
                        message: "File is already present",
                    });
                }
                else {
                    const randomID = (Math.random() * 1e32).toString(36).substring(0, 10);
                    const fileData = Object.assign(Object.assign({}, notaryText), { ipfsHash: data[0].hash, id: randomID });
                    try {
                        let addNotaryItem = [];
                        // creating a notary with a unique id
                        const txResult = yield this.bz.create(randomID, JSON.stringify(fileData), {
                            gas_price: 10,
                            max_gas: 2000000,
                        });
                        console.log(txResult);
                        try {
                            // fetching previously stored notary list
                            const notaryItems = yield this.bz.read(fileData.phoneNumber);
                            addNotaryItem = [
                                ...JSON.parse(notaryItems),
                                { id: randomID, txHash: txResult.txhash },
                            ];
                            // updating with the newly added notary item
                            yield this.bz.update(fileData.phoneNumber, JSON.stringify(addNotaryItem), {
                                gas_price: 10,
                                max_gas: 2000000,
                            });
                        }
                        catch (err) {
                            // console.error(err, {
                            //   origin: `Error due to no file present in bluzelle DB with key ${fileData.phoneNumber}`,
                            // });
                            // didn't found any notary items of the user
                            addNotaryItem = [{ id: randomID }];
                            // creating new notary item for the user
                            yield this.bz.create(fileData.phoneNumber, JSON.stringify(addNotaryItem), {
                                gas_price: 10,
                                max_gas: 2000000,
                            });
                        }
                        res.json({
                            message: "Successfully uploaded file to bluzelle",
                        });
                    }
                    catch (err) {
                        // console.error(err, {
                        //   origin: `Error due to failing in creating or updating notary file`,
                        //   data: fileData,
                        // });
                        res.json({
                            message: "Error in uploaded file to bluzelle",
                        });
                    }
                }
            }));
        });
        this.getNotaryFilesByPhoneNumber = (phoneNumber, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // fetching all notary item of user
                const notaryItems = yield this.bz.read(phoneNumber);
                const parsedNotaryItems = JSON.parse(notaryItems);
                // fetching all notary items details
                const selectedNotaries = yield Promise.all(parsedNotaryItems.map((notaryItem) => {
                    return this.bz.read(notaryItem.id);
                }));
                const selectedNotariesParsed = selectedNotaries.map((notaryItem) => JSON.parse(notaryItem));
                const selectedNotariesFinal = selectedNotariesParsed.map((notaryItem) => {
                    Object.assign(notaryItem, {
                        txHash: parsedNotaryItems.filter((item) => item.id === notaryItem.id)[0].txHash,
                    });
                });
                res.json({
                    message: "Get All Notary Items",
                    notaries: selectedNotariesFinal,
                });
            }
            catch (err) {
                // console.error(err, { origin: "Error in getting notary from bluzelle" });
                res.json({
                    message: "Error in getting notary from bluzelle",
                });
            }
        });
        this.deleteNotaryFiles = (phoneNumber, id, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // fetching all notary item of user
                const notaryItems = yield this.bz.read(phoneNumber);
                const parsedNotaryItems = JSON.parse(notaryItems);
                // deleting from the list
                const selectedNotary = parsedNotaryItems.filter((notary) => notary.id !== id);
                // deleting the notary item
                yield this.bz.delete(id, { gas_price: 10, max_gas: 2000000 });
                // updating the notary list
                yield this.bz.update(phoneNumber, JSON.stringify(selectedNotary), {
                    gas_price: 10,
                    max_gas: 2000000,
                });
                res.json({
                    message: "Deleted Notary",
                });
            }
            catch (err) {
                // console.error(err, { origin: "Error in deleting file to bluzelle" });
                res.json({
                    message: "Error in deleting file to bluzelle",
                });
            }
        });
        this.getAppConfigs = (res) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.checkHashPresent = (phoneNumber, hash) => __awaiter(this, void 0, void 0, function* () {
            try {
                const notaryItems = yield this.bz.read(phoneNumber);
                const parsedNotaryItems = JSON.parse(notaryItems);
                // fetching all notary items details
                const selectedNotaries = yield Promise.all(parsedNotaryItems.map((notaryItem) => {
                    return this.bz.read(notaryItem.id);
                }));
                const selectedNotariesParsed = selectedNotaries.map((notaryItem) => JSON.parse(notaryItem));
                const isPresent = selectedNotariesParsed.filter((notaryItem) => {
                    // console.log(notaryItem.hash, hash, notaryItem.hash === hash);
                    return notaryItem.hash === hash;
                }).length !== 0;
                let id = "0";
                if (isPresent) {
                    id = selectedNotariesParsed.filter((notaryItem) => {
                        // console.log(notaryItem.hash, hash, notaryItem.hash === hash);
                        return notaryItem.hash === hash;
                    })[0].id;
                }
                return { isPresent, id };
            }
            catch (err) {
                // console.error(err, { origin: "Error in getting notary from bluzelle" });
                return { isPresent: false };
            }
        });
        this.initBlz();
    }
    initBlz() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.bz = yield bluzelle_1.bluzelle({
                    mnemonic: process.env.BLUZELLE_ACCOUNT_MNEMONIC,
                    endpoint: process.env.BLUZELLE_ENDPOINT,
                    chain_id: process.env.BLUZELLE_CHAIN_ID,
                    uuid: process.env.BLUZELLE_APP_UUID,
                });
            }
            catch (err) {
                console.error(err, { origin: "Error from Bluzelle SDK Init" });
            }
        });
    }
}
exports.default = new Controller();
//# sourceMappingURL=index.js.map