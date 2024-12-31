// import React, { useState } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const UploadGroups = () => {
//   const [file, setFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [fileData, setFileData] = useState(null);
//   const storedFilePath = "./Sample_File.xlsx"; // Replace with your actual file path

//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files[0];
//     setFile(uploadedFile);
//     readExcelFile(uploadedFile);
//   };

//   const readExcelFile = (file) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: 'binary' });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//       console.log(jsonData); // This will log the entire sheet data as an array of arrays
//       setFileData(jsonData);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setUploadStatus('Please select a file to upload.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('/api/upload-groups', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setUploadStatus('File uploaded successfully!');
//     } catch (error) {
//       setUploadStatus('Error uploading file.');
//     }
//   };

//   const handleDownload = () => {
//     const link = document.createElement('a');
//     link.href = storedFilePath;
//     link.setAttribute('download', 'upload_Format.xlsx'); // Set the desired file name for download
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div>
//       <h2>Upload Group Information</h2>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload</button>
//       <button onClick={handleDownload}>Download</button>
//       <p>{uploadStatus}</p>
//       {fileData && (
//         <div>
//           <h3>Uploaded File Data:</h3>
//           <pre>{JSON.stringify(fileData, null, 2)}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadGroups;


import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import baselinks from "../../../baselinks.json";

const oBaseUri = JSON.parse(JSON.stringify(baselinks));
const baseUri = oBaseUri.DefaultbaseUri;

const UploadGroups = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileData, setFileData] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const storedFilePath = "./Sample_File.xlsx"; // Replace with your actual file path

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    readExcelFile(uploadedFile);
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(jsonData); // This will log the entire sheet data as an array of arrays
      setFileData(jsonData);
      setWorkbook(workbook); // Store the workbook for later use
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    // Loop through each row of data and make an API call
    if (fileData) {
      for (let i = 1; i < fileData.length; i++) { // Start at 1 to skip header row
        const requestData = {
          groupLink: fileData[i][1],
          country: fileData[i][3],
          language: fileData[i][4],
          tags: fileData[i][6],
          groupDesc: fileData[i][7],
          groupRules: "",
        };

        try {
          const response = await axios.post(
            `${baseUri}api/Groups?catId=${fileData[i][2]}&appid=${fileData[i][5]}`,
            requestData
          );

          if (response.status === 200) {
            const resData =  JSON.parse(JSON.stringify(response.data));

            if (resData.message != null && resData.message === "Group Already Exist" ) {
              let statusMessage = resData.message;
              fileData[i].push(statusMessage); 
              //console.log("Already exists");
            }

            if (resData.message === null) {
              fileData[i].push("New group added");
              //alert("New group added");
              // Reset form fields if necessary
            }
          }

          if (response.data === "Group not valid") {
            fileData[i].push("Group link not valid");
            //console.log(response.data);
            //alert("Group link not valid");
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            fileData[i].push("Error Status Code: " + error.response.status + " Error Message: " + error.response);
            //window.location = "/";
          }
          //console.error("API call failed:", error);
          // Handle errors accordingly
          fileData[i].push("API call failed:", error);
        }
      }
      setUploadStatus('File data processed successfully!');
      saveUpdatedFile(); 
    } else {
      setUploadStatus('No data found in the file.');
    }
  };

  const saveUpdatedFile = () => {
    const updatedWorksheet = XLSX.utils.aoa_to_sheet(fileData); // Convert updated data to worksheet
    workbook.Sheets[workbook.SheetNames[0]] = updatedWorksheet; // Update the workbook with new data
    const updatedExcel = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    // Create a Blob and download the updated file
    const blob = new Blob([s2ab(updatedExcel)], { type: "application/octet-stream" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Updated_Groups.xlsx';
    link.click();
  };

  // Helper function to convert binary string to array buffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = storedFilePath;
    link.setAttribute('download', 'upload_Format.xlsx'); // Set the desired file name for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>Upload Group Information</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleDownload}>Download</button>
      <p>{uploadStatus}</p>
      {fileData && (
        <div>
          <h3>Uploaded File Data:</h3>
          <pre>{JSON.stringify(fileData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadGroups;


