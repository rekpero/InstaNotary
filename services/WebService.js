class Webservice {
  uploadFileToServer = async (file, fileDetails) => {
    const data = new FormData();

    let uriParts = file.uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    data.append("fileData", {
      uri: file.uri,
      name: `photo.${fileType}`,
      type: `${file.type}/${fileType}`,
    });
    data.append("fileDetails", JSON.stringify(fileDetails));
    const config = {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
      },
      body: data,
    };
    return fetch(
      "https://bluzelle-notary-backend.herokuapp.com/uploadNotary",
      config
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });
  };

  getAllNotaryItems = async () => {
    return fetch("https://bluzelle-notary-backend.herokuapp.com/notary")
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });
  };

  getNotaryItemsByNumber = async (phoneNumber) => {
    return fetch(
      "https://bluzelle-notary-backend.herokuapp.com/notary/phone/" +
        phoneNumber
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });
  };

  getNotaryItemsByHash = async (hash) => {
    return fetch(
      "https://bluzelle-notary-backend.herokuapp.com/notary/hash/" + phoneNumber
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });
  };

  deleteNotaryItemsByHash = async (hash) => {
    const config = {
      method: "DELETE",
    };
    return fetch(
      "https://bluzelle-notary-backend.herokuapp.com/notary/hash/" + hash,
      config
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });
  };
}

export default new Webservice();
