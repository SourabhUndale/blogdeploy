import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import * as XLSX from 'xlsx';
import baselinks from "../../../baselinks.json";

const oBaseUri = JSON.parse(JSON.stringify(baselinks));
const baseUri = oBaseUri.DefaultbaseUri;

const BulkAddGroups = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [delayMs, setDelayMs] = useState(1000);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    event.target.value = null;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('excelFile', selectedFile);

    try {
      // Step 1: Get delay from backend
      const delayResponse = await axios.get(`${baseUri}groups/getRowProcessingDelay`);
      const delayFromServer = delayResponse.data?.delayMilliseconds || 1000;
      setDelayMs(delayFromServer);

      // Step 2: Read Excel file and count rows
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const totalRows = range.e.r; // Ends at index
      setRowCount(totalRows);

      // Step 3: Simulate progress
      let simulatedProgress = 0;
      const step = 100 / totalRows;

      const progressInterval = setInterval(() => {
        simulatedProgress += step;
        setProgress(prev => Math.min(prev + step, 100));
      }, delayFromServer);

      // Step 4: Upload to backend
      const response = await axios.post(
        `${baseUri}groups/bulkAddGroups`,
        formData,
        { responseType: 'blob' }
      );

      clearInterval(progressInterval);
      setProgress(100);

      // Step 5: Download processed file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `GroupImportResult-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;

      setTimeout(() => setProgress(0), 1500);

    } catch (error) {
      alert('Upload failed. Please check the server or the file format.');
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Bulk Upload Groups
        </Typography>
        <Typography variant="body1" gutterBottom color="text.secondary">
          Upload an Excel file (.xlsx or .xls) containing group data. After upload, a new file will be downloaded with status updates for each row.
        </Typography>

        <Box mt={3} display="flex" flexDirection="column" gap={2}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Select Excel File
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </Button>

          {/* ✅ Download Template Button */}
          <Button
            variant="outlined"
            color="secondary"
            href="/Template.xlsx"
            download
            startIcon={<DownloadIcon />}
          >
            Download Template
          </Button>

          {selectedFile && (
            <Typography variant="subtitle2" color="text.secondary">
              Selected File: <strong>{selectedFile.name}</strong>
            </Typography>
          )}

          {isUploading && (
            <Box width="100%" mt={1}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="caption" color="text.secondary">
                Uploading... {Math.round(progress)}%
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            startIcon={<DownloadIcon />}
          >
            {isUploading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Upload and Download Result'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BulkAddGroups;
