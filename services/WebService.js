class Webservice {
  uploadFileToServer = async (file) => {
    const data = new FormData();

    let uriParts = file.uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    data.append("fileData", {
      uri: file.uri,
      name: `photo.${fileType}`,
      type: `${file.type}/${fileType}`,
    });
    const config = {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
      },
      body: data,
    };
    const response = await fetch(
      "https://bluzelle-notary-backend.herokuapp.com/uploadNotary",
      config
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });

    this.getIpfsFile(response.hash);
    console.log("Response", response);
    return response.hash;
  };

  getIpfsFile = async (hash) => {
    console.log("adsdsd", hash);
    const response = await fetch(
      "https://bluzelle-notary-backend.herokuapp.com/notary/" + hash
    );
    console.log("IPFS", response);
  };
}

export default new Webservice();
